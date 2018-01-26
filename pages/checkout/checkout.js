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
    shippingAddres: '',
    shippingPostal: '',
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
    if (!app.addressAuthed) {
      app.wxAuthorize('address');
    }
    wx.chooseAddress({
      success: function (res) {
        page.setData({
          shippingName: res.userName,
          shippingTel: res.telNumber,
          shippingAddres: `${res.detailInfo}，${res.cityName}, ${res.provinceName}，${res.countyName}`,
          shippingPostal: res.postalCode,
          isShippingSet: true
        })
      }
    })
  },
  wxPayTap: function (e) {
    const page = this;

    wx.showToast({
      title: '微信支付',
      icon: 'loading',
      mask: true,
      image: '/assets/wxPayLogo.png',
      duration: 2000,
      complete: function() {
        setTimeout(function () {
          wx.showModal({
            title: '数额：￥' + page.data.totalPrice,
            content: '收款：ToryBurch',
            confirmText: '支付'
          })
        }, 2500)
      }
    })
  },
  payLaterTap: function(e) {
    const authTypes = ['userInfo']
    console.log(authTypes)
    //authTypes.forEach((authType) => {
      app.wxAuthorize(authTypes[0]);
    //})
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
    if (storedCart.length > 0) {
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