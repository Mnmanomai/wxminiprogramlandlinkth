const app = getApp()
const config = require('../../config')
// pages/assetinchat/assetinchat.js
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
      title : '聊天中的资产'
    })


    this.setData({
      ugroupid : options.id
    })
    await this.ReqAssetinChat()
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
  async ReqAssetinChat() {
    let res = await this.ReqGetAssetInChat(this.data.ugroupid)
    const mainadata = res.data
    let datafind = mainadata.length != 0 ? mainadata.join(",") : ""
    
    let resdata = await app.Getlist(datafind)
    console.log(resdata)
    this.setData({
      fetchlist : resdata
    })
},

// Get Asset In Chat
async ReqGetAssetInChat(groupid) {
    const token = wx.getStorageSync("usersdetail")
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${config.PublicIPCallApiGoBackend}/chat/asset/${groupid}`,
            method: 'GET',
            header: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token.token
            },
            success(res) {
                resolve(res.data)
            },
        })
    })
},
})