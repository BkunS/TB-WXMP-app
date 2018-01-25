//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    pageContents: {},
    lookbooks: [],
    categories:[],
    topNavHeight: 0,
    placeholderHeight: 40,
    hambugerWidth: 0,
    searchWidth: 0,
    logoWidth: 0,
    heartWidth: 0, 
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
    const page = this;
    const topNavHeight = app.globalData.topNavHeight
    this.setData({
      topNavHeight: topNavHeight,
      placeholderHeight: this.data.placeholderHeight + topNavHeight,
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
  }
})
