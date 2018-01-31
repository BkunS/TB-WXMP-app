// pages/order/order.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    bagEmpty: true,
    topNavHeight: 0,
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
    const page = this; 
    if (options.notification) {
      app.getNotification();
    }

    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    wx.showNavigationBarLoading()

    const topNavHeight = app.globalData.topNavHeight
    this.setData({
      topNavHeight: topNavHeight,
      placeholderHeight: this.data.placeholderHeight + topNavHeight,
    })

    let fullProducts = [];
    let order = {};
    wx.request({
      method: 'GET',
      url: `${app.globalData.apiBaseUrl}/v1/orders/${options.id}`,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        order = res.data;
        let { products } = order;
        console.log('products0:', products)
        products.forEach((product) => {
          console.log(product)
          wx.request({
            method: 'GET',
            url: `${app.globalData.apiBaseUrl}/v1/products/${product.productId}`,
            success: (res) => {
              const { price } = product;
              const { salePrice } = product;
              product = res.data;
              product['price'] = price;
              product['salePrice'] = salePrice;
            },
            complete: () => {
              fullProducts.push(product);
            }
          })
        });
        
      },
      complete: () => {
        console.log('products:', fullProducts)
        order['products'] = fullProducts;
        page.setData({
          order: order
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideNavigationBarLoading();
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