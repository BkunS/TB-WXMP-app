// pages/product/product.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageContents: {},
    product: {},
    selected: 1,
    current: 0,
    imgHeights: [],
    placeholderHeight: 12,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
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
  imageLoad: function (e) {
    let imgHeights = this.data.imgHeights
    const imgWidth = e.detail.width
    const imgHeight = e.detail.height
    const ratio = imgWidth / imgHeight
    const viewWidth = 750;
    const viewHeight = viewWidth / ratio
    imgHeights.push(viewHeight)
    this.setData({
      imgHeights: imgHeights,
    })
  },
  bindChange: function (e) {
    this.setData({ current: e.detail.current })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const page = this;

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/contents/pdp',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => { 
        page.setData({
          pageContents: res.data
        });
      }
    })

    wx.request({
      method: 'GET',
      url: app.globalData.apiBaseUrl + '/v1/products/' + options.id,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let product = res.data;
        const priceRange = product.priceRange;
        const salePriceRange = product.salePriceRange;
        let priceStr = '';
        let salePriceStr = '￥' + salePriceRange[0]
        if (salePriceRange[1]) {
          salePriceStr += '-￥' + salePriceRange[1];
        }
         
        if (salePriceRange[0] !== priceRange[0]) {
          priceStr = '￥' + priceRange[0];
        }
        if (priceRange[1] && priceRange[1] !== salePriceRange[1]) {
          priceStr = '￥' + priceRange[0] + '-￥' + priceRange[1]
        }

        product['salePriceStr'] = salePriceStr;
        product['priceStr'] = priceStr;
        page.setData({
          product: product
        });
        console.log(product)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.data.product.variations.forEach((variation) => {
      let ctx = wx.createCanvasContext(variation.color + 'Canvas');
      ctx.arc(39, 30, 15, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setFillStyle(variation.color);
      ctx.fill();
      ctx.draw()
    })
    
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