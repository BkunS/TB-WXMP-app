// pages/product/product.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageContents: {},
    product: {},
    current: 0,
    imgHeights: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  imageLoad: function (e) {
    let imgHeights = this.data.imgHeights
    const imgHeight = e.detail.height  
    imgHeights.push(imgHeight)
    this.setData({
      imgHeights: imgHeights,
    })
    console.log(imgHeights);
  },
  bindChange: function (e) {
    console.log(e.detail.current)
    this.setData({ current: e.detail.current })
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