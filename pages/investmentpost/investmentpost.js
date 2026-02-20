const config = require("../../config");

// pages/investmentpost/investmentpost.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    wx.setNavigationBarTitle({
      title: '寻找资产',
    });
    const res = await this.reqInvestment(options.id)
    if(res.statusCode == 200){
      let data = res.data.data 
      this.setData({
        datacore : data[0]
      })
    }
  },

  async reqInvestment(id) {
    const token = await new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'usersdetail',
        success(res) {
          resolve(res.data.token)
        },
        fail(err) {
          reject(err)
        }
      })
    });

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/investment/post`,
        method: 'GET',
        data:{
          'language' : "zh",
          'ivmid' : id,
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        },
      })
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})