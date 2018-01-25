//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.openId = res.code;
        const app = this;
        wx.request({
          method: 'POST',
          url: app.globalData.apiBaseUrl + '/v1/auth',
          header: {
            'content-type': 'application/json'
          },
          body: {
            'openId': app.globalData.openId
          },
          success: (res) => {
            console.log(res)
            app.globalData.accessToken = res.data.access_token
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  navIconLoad: function(e) {
    const imgHeight = e.detail.height
    const imgWidth = e.detail.width
    const ratio = imgWidth / imgHeight
    let viewHeight = 0;
    if (e.currentTarget.id === "logoWidth") {
      viewHeight = this.globalData.defaultLogoHeight;
    } else {
      viewHeight = this.globalData.defaultIconHeight;
    }
    return ratio * imgHeight * this.globalData.iconZoom;
  },
  globalData: {
    userInfo: null,
    openId: "",
    accessToken: "",
    defaultCurrency: "￥",
    defaultIconHeight: 25,
    defaultLogoHeight: 30,
    topNavHeight: 60,
    iconZoom: 0.6,
    apiBaseUrl: 'http://localhost:10010'
  }
})