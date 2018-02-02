//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    pageContents: {},
    bagEmpty: true,
    statusBarHeight: app.globalData.statusBarHeight,
    placeholderHeight: 0,
    backWidth: 0,
    logoWidth: 0,
    canNavBack: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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

  onLoad: function () {
    wx.showNavigationBarLoading();
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
      url: app.globalData.apiBaseUrl + '/v1/contents/home',
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
      url: app.globalData.apiBaseUrl + '/v1/lookbooks',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        page.setData({
          lookbooks: res.data
        })
      }
    })

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/categories',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        page.setData({
          categories: res.data
        })
      }
    })
    wx.stopPullDownRefresh()
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
        const count = res.data.length;
        page.setData({
          bagEmpty: count > 0 ? false : true
        })
        wx.setTabBarItem({
          index: 1,
          text: `购物袋${count > 0 ? ' (' + count + ')' : ''}`
        })
      }
    });
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
    return {
      title: 'ToryBurch 官方',
      desc: '',
      path: '/page/index/index'
    }
  }
})
