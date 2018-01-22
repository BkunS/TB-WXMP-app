// pages/cart/cart.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
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
    const page = this;
    let cart = [];
    wx.getStorageSync('cart').forEach((item) => {
      wx.request({
        method: 'GET',
        url: app.globalData.apiBaseUrl + '/v1/products/' + item.productId,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          item.productInfo = res.data;
          cart.push(item);
          this.setData({
            cart: cart
          });
        }
      })
    });

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