//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    landingContents: {},
    categories:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    const page = this;

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/landingContents',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        page.setData({
          landingContents: res.data
        })
      }
    })

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/categories', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        page.setData({
          categories: res.data
        })
      }
    })
  }
})
