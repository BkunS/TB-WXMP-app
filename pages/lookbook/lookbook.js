// pages/lookbook/lookbook.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lookbook: {},
    pageContents: {},
    placeholderHeight: 12
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '当季新品'
    })

    const page = this;
    
    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/contents/lookbooks/' + options.id,
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
      method: "GET",
      url: app.globalData.apiBaseUrl + '/v1/lookbooks/' + options.id,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let lookbook = res.data
        let { masterProducts } = lookbook;
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
        lookbook.masterProducts = masterProducts
        page.setData({
          lookbook: lookbook
        })
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