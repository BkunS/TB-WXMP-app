// pages/product/product.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageContents: {},
    product: {},
    selectedColorIndex: 0,
    selectedColorName: "",
    selectedSizes: [],
    selectedSize: "",
    selectedSizeIndex: 0,
    selectedId: "",
    current: 0,
    imgHeights: [],
    placeholderHeight: 12,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    addToCartBTText: "加入购物袋",
    buyNowBTText: "立即购买",
    buttonLoading: false,
    disabled: false
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
  currentChange: function (e) {
    this.setData({ current: e.detail.current })
  },
  radioChange: function (e) {
    const page = this;
    const selectedColorIndex = +e.detail.value;
    const selectedSizeIndex = page.data.selectedSizeIndex;
    const selectedSizes = page.data.product.variations[selectedColorIndex].sizes;
    this.setData({
      selectedSizes: selectedSizes,
      selectedSizeIndex: selectedSizeIndex < selectedSizes.length ? selectedSizeIndex : 0,
      selectedColorIndex: selectedColorIndex,
      selectedId: selectedSizes[selectedSizeIndex].id,
      selectedSize: selectedSizes[selectedSizeIndex].size,
      
    })
    this.selectedChange(e);
  },
  selectedChange: function(e) {
    const page = this;
    const variations = this.data.product.variations;
    const currentVariation = variations[e.detail.value];
    const color = currentVariation.color;
    const colorName = currentVariation.colorName
    this.setData({
      current: page.data.current < currentVariation.images.length ? page.data.current : currentVariation.images.length - 1,
      selectedColorName: colorName
    })
    variations.forEach((variation) => {
      let ctx = wx.createCanvasContext(variation.color.replace(/' '/g, '_') + 'Canvas')
      ctx.arc(30, 30, 15, 0, 2 * Math.PI)
      if (variation.index === page.data.selectedColorIndex) {
        ctx.setStrokeStyle("green")
        ctx.setLineWidth(5)
      } else {
        ctx.setStrokeStyle(variation.colorHex || variation.color)
        ctx.setLineWidth(1)
      }
      ctx.stroke()
      ctx.setFillStyle(variation.colorHex || variation.color)
      ctx.fill()
      ctx.draw()
    })
  },
  pickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    const page = this
    this.setData({
      selectedSizeIndex: e.detail.value,
      selectedSize: page.data.selectedSizes[e.detail.value].size,
      selectedId: page.data.selectedSizes[e.detail.value].id
    });
  }, 
  addToCart: function(e) {
    const page = this;
    let cart = wx.getStorageSync('cart');
    const productId = page.data.selectedId
    let hasProduct = false;
    cart.forEach((item, index) => {
      if (item.productId === productId) {
        item.quantity++;
        hasProduct = true;
      }
    })
    if (hasProduct === false) {
      cart.push({
        productId: productId,
        quantity: 1
      })
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '商品已添加',
      icon: 'success',
      duration: 2000
    })
  },
  buyNow: function (e) {
    console.log(e);
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
        const selectedColorIndex = 0;
        page.setData({
          product: product,
          selectedColorIndex: selectedColorIndex,
          selectedSize: product.variations[selectedColorIndex].sizes[0].size,
          selectedId: product.variations[selectedColorIndex].sizes[0].id,
          selectedSizes: product.variations[selectedColorIndex].sizes,
          selectedColorName: product.variations[selectedColorIndex].colorName
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const page = this;
    this.data.product.variations.forEach((variation) => {
      let ctx = wx.createCanvasContext(variation.color.replace(/' '/g, '_') + 'Canvas')
      ctx.arc(30, 30, 15, 0, 2 * Math.PI)
      if (variation.index === page.data.selectedColorIndex) {
        ctx.setStrokeStyle("green")
        ctx.setLineWidth(5)
      }
      ctx.stroke()
      ctx.setFillStyle(variation.colorHex || variation.color)
      ctx.fill()
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