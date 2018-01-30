//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.openId = res.code;
        console.log(res);
        const app = this;
        wx.request({
          method: 'POST',
          url: app.globalData.apiBaseUrl + '/v1/auth/accessToken',
          header: {
            'content-type': 'application/json'
          },
          body: {
            'openId': app.globalData.openId
          },
          success: (res) => {
            app.globalData.accessToken = res.data.access_token
            console.log('access_token:', res.data.access_token)
          }
        })
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
  getUserInfo: function(cb) {
    this.wxAuthorize('userInfo', () => {
      // 获取用户信息
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          this.globalData.userInfo = res.userInfo
          console.log(res)
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
          cb();
        },
        fail: res => {
          wx.showModal({
            title: '无法获取到用户信息',
            content: '请重新授权',
          })
        }
      })
    })
  },
  wxAuthorize: function(authType, cb) {
    const app = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting[`scope.${authType}`]) {
          wx.authorize({
            scope: `scope.${authType}`
          })
        }
        cb();
      }
    })
  },
  getNotification: function (params) {
    const app = this;

    let offset = 0;
    let count = 20;
    if (params) {
      offset = params.offset ? +params.offset : 0;
      count = params.count ? +params.count : 20
    }
    wx.request({
      method: 'POST',
      url: `${app.globalData.getTemplateNotificationBaseUrl}?access_token=${app.globalData.accessToken}`,
      header: {
        'content-type': 'application/json'
      },
      data: {
        'id': 'AT0009'
      },
      success: (res) => {
        console.log(res);
      }
    })
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
    getTemplateNotificationBaseUrl: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/library/get',
    getTemplateMsgListsBaseUrl: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/library/list',
    apiBaseUrl: 'http://localhost:10010' // 'https://digital-innovation-180520.appspot.com'
  }
})