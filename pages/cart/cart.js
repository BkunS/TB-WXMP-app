// pages/cart/cart.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
    totalPrice: 0,
    totalPriceStr: "",
    placeholderHeight: 12,
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
  topNavLoad: function (e) {
    const imgWidth = e.detail.width
    const imgHeight = e.detail.height
    const ratio = imgWidth / imgHeight;
    const viewWidth = 750;
    const viewHeight = 750 / ratio;
    this.setData({
      placeholderHeight: this.data.placeholderHeight + viewHeight,
    })
  },
  navIconLoad: function(e) {
    const viewHeight = app.topNavHeight;
    const iconWidth = app.topNavHeight(e);
    console.log(iconWidth)
    this.setData({
      placeholderHeight: this.data.placeholderHeight + viewHeight
    })
  },
  deleteItem: function (e) {
    let cart = this.data.cart;
    const totalPrice = this.data.totalPrice;
    let disabled = this.data.disabled;
    let id = e.currentTarget.id;
    let itemPrice = 0;
    cart.forEach((item, index, array) => {
      if (item.productId === id) {
        itemPrice = item.productInfo.salePrice * item.quantity;
        array.splice(index, 1);
        let updatedPrice = totalPrice - itemPrice
        let currency = item.productInfo.currency ? item.productInfo.currency : app.globalData.defaultCurrency
        this.setData({
          cart: cart,
          disabled: cart.length === 0 || updatedPrice === 0 ? true : false,
          totalPrice: updatedPrice,
          totalPriceStr: currency + updatedPrice
        })
      }
    })
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '商品已移除',
      duration: 1500
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '购物袋'
    })

    const page = this;
    let storedCart = wx.getStorageSync('cart');
    if (storedCart.length > 0) {
      this.setData({
        disabled: false
      })
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
    }

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/contents/cart',
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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