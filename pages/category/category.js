// pages/category/category.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageContents: {},
    category: {},
    bagEmpty: true,
    statusBarHeight: app.globalData.statusBarHeight,
    placeholderHeight: -5,
    backWidth: 0,
    logoWidth: 0,
    canNavBack: false,
    pageName: "",
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
      [id +'Width']: iconWidth,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()

    const page = this;
    const topNavHeight = app.globalData.topNavHeight
    const placeholderHeight = this.data.placeholderHeight + app.globalData.statusBarHeight +
      topNavHeight + app.globalData.defaultIconPadding;
    const canNavBack = getCurrentPages().length > 1 ? true : false
    this.setData({
      canNavBack: canNavBack,
      topNavHeight: topNavHeight,
      placeholderHeight: placeholderHeight,
    })

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/contents/categories/' + options.id,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        page.setData({
          pageContents: res.data
        })
      }
    })
    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/categories/' + options.id,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let category = res.data

        wx.setNavigationBarTitle({
          title: category.displayName,
        })

        let { masterProducts } = category;
        masterProducts.map((product) => {
          const { price, salePrice } = product
          let currencyStr = product.currency ? product.currency : app.globalData.defaultCurrency
          let salePriceStr = currencyStr + product.salePrice;
          let priceStr = "";
          if (price > salePrice) {
            priceStr = currencyStr + price;
          }
          product['priceStr'] = priceStr
          product['salePriceStr'] = salePriceStr
          return product;
        })
        category.masterProducts = masterProducts
        page.setData({
          category: category,
          pageName: category.displayName,
        })
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
    wx.setNavigationBarTitle({
      title: '当季新品'
    })
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