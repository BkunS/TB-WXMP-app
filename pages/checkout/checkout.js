// pages/cart/cart.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    isShippingSet: false, 
    shippingName: '',
    shippingTel: '',
    shippingAddress: '',
    shippingPostal: '',
    shippingPrice: 0,
    totalPrice: 0,
    bagEmpty: true,
    topNavHeight: 0,
    placeholderHeight: 40,
    hambugerWidth: 0,
    searchWidth: 0,
    logoWidth: 0,
    heartWidth: 0,
    disabled: true
  },
  globalMsgLoad: function (e) {
    const imgWidth = e.detail.width
    const imgHeight = e.detail.height
    const ratio = imgWidth / imgHeight;
    const viewWidth = 750;
    const viewHeight = 750 / ratio;
    this.setData({
      placeholderHeight: this.data.placeholderHeight + viewHeight,
    })
  },
  iconLoad: function (e) {
    const iconWidth = app.navIconLoad(e)
    const id = e.currentTarget.id;
    this.setData({
      [id]: iconWidth,
    })
  },
  chooseAddressTap: function(e) {
    const page = this;
    wx.showLoading({
      title: '获取地址',
    })
    app.wxAuthorize('address', () => {
      wx.hideLoading();
      wx.chooseAddress({
        success: function (res) {
          const disabled = page.data.cart.length > 0 ? false : true;
          page.setData({
            shippingName: res.userName,
            shippingTel: res.telNumber,
            shippingAddress: `${res.detailInfo}，${res.cityName}, ${res.provinceName}，${res.countyName}`,
            shippingPostal: res.postalCode,
            isShippingSet: true,
            disabled: disabled
          })
        }
      })
    });
  },
  wxPayTap: function (e) {
    const page = this;
    wx.showToast({
      title: '微信支付',
      icon: 'loading',
      mask: true,
      image: '/assets/wxPayLogo.png',
      duration: 800,
      complete: function() {
        setTimeout(() => {
          wx.showLoading({
            title: '授权中',
            complete: () => {
              setTimeout(() => {
                wx.hideLoading()
                wx.showModal({
                  title: '数额：￥' + page.data.totalPrice,
                  content: '收款方：ToryBurch 中国',
                  confirmText: '支付',
                  success: (res) => {
                    if (res.confirm) {
                      wx.showLoading({
                        title: '订单提交中',
                      });
                      app.getUserInfo(() => {
                        page.submitOrder({
                          'type': 'WeChatPay',
                          'paid': true
                        });
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }, 1800)
            }
          })
        }, 800)
      }
    })
  },
  payLaterTap: function(e) {
    const page = this;
    wx.showLoading({
      title: '订单提交中',
    });
    app.getUserInfo(() => {
      page.submitOrder({
        'type': 'payUponDelivery',
        'paid': false
      });
    })

    /*
    wx.requestPayment({
      'timeStamp': (new Date().getTime() / 1000 | 0) + '',
      'nonceStr': 'aksjdaskjdhaskjd',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        console.log('Success')
      },
      'fail': function (res) {
        console.log('Fail')
      }
    })
    */
  },
  submitOrder: function (payment) {
    const page = this;
    const avatarSplit = app.globalData.userInfo.avatarUrl.split('/');
    const userId = avatarSplit[avatarSplit.length - 2];
    const cart = wx.getStorageSync('cart');
    const fullCart = this.data.cart;
    let products = cart.map((product, index) => {
      product['price'] = fullCart[index].productInfo.price;
      product['salePrice'] = fullCart[index].productInfo.salePrice;
      return product;
    })
    const image = fullCart[0].productInfo.image
    const totalPrice = +page.data.totalPrice;
    const now = new Date();
    const placeTime = now.toISOString();
    const data = {
      userId: userId,
      shipment: {
        name: page.data.shippingName,
        address: page.data.shippingAddress,
        postal: page.data.shippingPostal,
        tel: page.data.shippingTel,
      },
      products: products,
      image: this.data.cart[0].productInfo.image,
      shippingPrice: page.data.shippingPrice,
      totalPrice: totalPrice,
      finalPrice: totalPrice + page.data.shippingPrice,
      status: 'created',
      payment: payment,
      placeTime: placeTime
    };
    //console.log(data);
    
    wx.request({
      method: 'POST',
      url: `${app.globalData.apiBaseUrl}/v1/orders`,
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success: (res) => {
        wx.hideLoading();
        wx.setStorage({
          key: 'cart',
          data: [],
        });
        wx.reLaunch({
          url: `/pages/confirmation/confirmation?id=${res.data.id}`
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '订单提交失败，请重试',
          icon: 'fail'
        });
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '结算'
    })
    wx.showNavigationBarLoading()

    const page = this;
    const topNavHeight = app.globalData.topNavHeight
    this.setData({
      topNavHeight: topNavHeight,
      placeholderHeight: this.data.placeholderHeight + topNavHeight,
    })

    let storedCart = wx.getStorageSync('cart');
    if (storedCart.length > 0 && this.data.isShippingSet) {
      this.setData({
        disabled: false
      })
    }
    let cart = [];
    storedCart.forEach((item) => {
      wx.request({
        method: 'GET',
        url: app.globalData.apiBaseUrl + '/v1/products/' + item.productId,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          let product = res.data
          const { price, salePrice } = product
          let currencyStr = product.currency ? product.currency : app.globalData.defaultCurrency
          let salePriceStr = currencyStr + product.salePrice;
          let priceStr = "";
          if (price > salePrice) {
            priceStr = currencyStr + price;
          }
          product['priceStr'] = priceStr
          product['salePriceStr'] = salePriceStr
          item.productInfo = product;
          cart.push(item);
          let currency = product.currency ? product.currency : app.globalData.defaultCurrency
          let totalPrice = page.data.totalPrice + item.productInfo.salePrice * item.quantity
          this.setData({
            cart: cart,
            totalPrice: totalPrice,
            totalPriceStr: currency + totalPrice
          });
        }
      })
    });

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/contents/checkout',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        page.setData({
          pageContents: res.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const page = this;
    wx.getStorage({
      key: 'cart',
      success: function (res) {
        page.setData({
          bagEmpty: res.data.length > 0 ? false : true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})