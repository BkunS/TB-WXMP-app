// pages/product/product.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageContents: {},
    product: {},
    bagEmpty: true,
    statusBarHeight: app.globalData.statusBarHeight,
    placeholderHeight: 0,
    backWidth: 0,
    logoWidth: 0,
    shareIconHeight: app.globalData.defaultShareIconHeight,
    canNavBack: false,
    selectedColorIndex: 0,
    selectedColorName: "",
    selectedSizes: [],
    selectedSize: "",
    selectedSizeIndex: 0,
    selectedId: "",
    current: 0,
    imgHeights: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    addToCartBTText: "加入购物袋",
    buyNowBTText: "去购物袋",
    buttonLoading: false,
    enableSize: false,
    title: "明星产品"
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
  radioLoad: function () {
    const page = this;
    this.data.product.variations.forEach((variation) => {
      let ctx = wx.createCanvasContext(variation.color.replace(/' '/g, '_') + 'Canvas')
      ctx.arc(30, 30, 15, 0, 2 * Math.PI)
      if (variation.index === page.data.selectedColorIndex) {
        ctx.setStrokeStyle("#0c2340")
        ctx.setLineWidth(5)
      }
      ctx.stroke()
      ctx.setFillStyle(variation.colorHex || variation.color)
      ctx.fill()
      ctx.draw()
    })
  },
  radioChange: function (e) {
    const page = this;
    console.log(page.data.product)
    const selectedColorIndex = +e.detail.value;
    const selectedSizeIndex = page.data.selectedSizeIndex;
    const selectedSizes = page.data.product.variations[selectedColorIndex].sizes;
    const enableSize = selectedSizes.length > 1 ? true : false;
    this.setData({
      enableSize: enableSize,
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
    const page = this
    this.setData({
      selectedSizeIndex: e.detail.value,
      selectedSize: page.data.selectedSizes[e.detail.value].size,
      selectedId: page.data.selectedSizes[e.detail.value].id
    });
  }, 
  addToCart: function(e) {
    const page = this;
    wx.getStorage({
      key: 'cart',
      complete: function(res) {
        let cart = res.data ? res.data : [];
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
        if (cart.length > 0) {
          page.setData({
            bagEmpty: false
          })
        }
        wx.setStorage({
          key: 'cart',
          data: cart,
          success: function() {
            wx.showToast({
              title: '商品已添加',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function() {
            wx.showToast({
              title: '添加失败，请重试',
              icon: 'none',
              duration: 2500
            })
          }
        })
      },
    })
  },
  buyNow: function (e) {
    //this.addToCart(e);
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  wechatShare: function(e) {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const page = this;
    const topNavHeight = app.globalData.topNavHeight
    const placeholderHeight = this.data.placeholderHeight + app.globalData.statusBarHeight +
      topNavHeight + app.globalData.defaultIconPadding;
    const canNavBack = getCurrentPages().length > 1 ? true : false;
    this.setData({
      pageName: options.title ? options.title : page.data.title,
      canNavBack: canNavBack,
      topNavHeight: topNavHeight,
      placeholderHeight: placeholderHeight,
    })
    
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
        wx.setNavigationBarTitle({
          title: product.displayName
        })
        const currencyStr = product.currency ? product.currency : app.globalData.defaultCurrency
        const priceRange = product.priceRange;
        const salePriceRange = product.salePriceRange;
        let priceStr = '';
        let salePriceStr = currencyStr + salePriceRange[0]
        if (salePriceRange[1]) {
          salePriceStr += '-' + currencyStr + salePriceRange[1];
        }
         
        if (salePriceRange[0] !== priceRange[0]) {
          priceStr = '￥' + priceRange[0];
        }
        if (priceRange[1] && priceRange[1] !== salePriceRange[1]) {
          priceStr = currencyStr + priceRange[0] + '-' + currencyStr + priceRange[1]
        }

        let { descriptionList } = product;
        descriptionList = descriptionList.map((value) => {
          return ' - ' + value;
        })
        /*
        let { variations } = product;
        variations = variations.map((variation) => {
          let sizes = variation.sizes;
          return variation['sizes'] = sizes.map((size) => {
            wx.request({
              method: 'GET',
              url: `${app.globalData.apiBaseUrl}/v1/inventories/${size.id}`,
              success: (res) => {
                const inventory = res.data.inventory;
                size['inventory'] = inventory ? inventory : -1;
              },
              complete: (res) => {
                return size;
              }
            })
          })
        });*/

        product['descriptionList'] = descriptionList;
        product['salePriceStr'] = salePriceStr;
        product['priceStr'] = priceStr;
        const selectedColorIndex = 0;
        const selectedSizes = product.variations[selectedColorIndex].sizes;
        const enableSize = selectedSizes.length > 1 ? true : false;
        page.setData({
          enableSize: enableSize,
          product: product,
          selectedColorIndex: selectedColorIndex,
          selectedSize: product.variations[selectedColorIndex].sizes[0].size,
          selectedId: product.variations[selectedColorIndex].sizes[0].id,
          selectedSizes: selectedSizes,
          selectedColorName: product.variations[selectedColorIndex].colorName
        });
        console.log(page.data.product);
        page.radioLoad();
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
    const page = this;
    wx.setNavigationBarTitle({
      title: '当季新品'
    })
    wx.getStorage({
      key: 'cart',
      success: function (res) {
        page.setData({
          bagEmpty: res.data.length > 0 ? false : true
        })
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
    wx.showNavigationBarLoading()
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
    wx.hideLoading();
    return {
      title: 'ToryBurch - ' + this.data.product.displayName,
      desc: '',
      path: '/page/product/product?id=' + this.data.selectedId
    }  
  }
})