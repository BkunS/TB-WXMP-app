// pages/orders/orders.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    bagEmpty: true,
    placeholderHeight: 40,
    hambugerWidth: 0,
    searchWidth: 0,
    logoWidth: 0,
    heartWidth: 0,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单记录'
    })
    wx.showNavigationBarLoading()

    const page = this;
    const topNavHeight = app.globalData.topNavHeight
    this.setData({
      topNavHeight: topNavHeight,
      placeholderHeight: this.data.placeholderHeight + topNavHeight,
    })

    let updatedOrders = [];
    wx.request({
      method: 'GET',
      url: `${app.globalData.apiBaseUrl}/v1/orders?userId=${options.userId}`,
      success: (res) => {
        let orders = res.data;
        orders.forEach((order) => {
          const { placeTime } = order;
          const time = new Date(placeTime);
          var options = {
            year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
          }; 
          const timeStr = time.toLocaleTimeString("ja-JP", options);
          order['timeStr'] = timeStr;
          const currency = order.currency ? order.currency : app.globalData.defaultCurrency;
          order['finalPriceStr'] = currency + order.finalPrice;
          updatedOrders.push(order);
        })
      },
      complete: () => {
        page.setData({
          orders: updatedOrders
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