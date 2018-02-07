// pages/profile/profile.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userId: "",
    bagEmpty: true,
    statusBarHeight: app.globalData.statusBarHeight,
    placeholderHeight: 0,
    backWidth: 0,
    logoWidth: 0,
    defaultIconHeight: app.globalData.defaultIconHeight,
    canNavBack: false,
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
      [id + 'Width']: iconWidth,
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '获取信息',
    });
    const page = this;
    const topNavHeight = app.globalData.topNavHeight
    const placeholderHeight = this.data.placeholderHeight + app.globalData.statusBarHeight +
      topNavHeight + app.globalData.defaultIconPadding;
    const canNavBack = getCurrentPages().length > 1 ? true : false
    this.setData({
      pageName: '用户中心',
      canNavBack: canNavBack,
      topNavHeight: topNavHeight,
      placeholderHeight: placeholderHeight,
    })

    if (app.globalData.userInfo) {
      const userInfo = app.globalData.userInfo;
      const avatarSplit = userInfo.avatarUrl.split('/');
      const userId = avatarSplit[avatarSplit.length - 2];
      app.globalData['userId'] = userId;
      this.setData({
        userId: userId,
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        const userInfo = res.userInfo;
        const avatarSplit = userInfo.avatarUrl.split('/');
        const userId = avatarSplit[avatarSplit.length - 2];
        app.globalData['userId'] = userId;
        this.setData({
          userId: userId,
          userInfo: userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          const userInfo = res.userInfo;
          app.globalData.userInfo = userInfo;
          const avatarSplit = userInfo.avatarUrl.split('/');
          const userId = avatarSplit[avatarSplit.length - 2];
          app.globalData['userId'] = userId;
          this.setData({
            userId: userId,
            userInfo: userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideNavigationBarLoading()
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const page = this; 
    wx.setNavigationBarTitle({
      title: '用户中心'
    })
    wx.showNavigationBarLoading();
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
      },
      complete: () => {
        wx.hideNavigationBarLoading();
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