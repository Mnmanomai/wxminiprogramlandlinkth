// pages/groupinvite/groupinvite.js
const config = require("../../config")
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {

  },

  onLoad(options) {
    this.setData({
      invitegroup: options.invitegroup
    })

    wx.showLoading({
      title: 'กำลังเข้าสู่ระบบ...'
    });
  },

  async onReady() {
    let data = wx.getStorageSync("usersdetail")
    if (!data) {
      await app.LoginWechat()
      data = wx.getStorageSync("usersdetail")
    }

    wx.request({
      url: `${config.PublicIPCallApiGoBackend}/community/group/join`,
      method: 'POST',
      data: {
        queryurl: this.data.invitegroup
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + data.token
      },
      success: (res) => {
        if (res.data.groupid) {
          wx.reLaunch({
            url: `/pages/chatfleet/chatfleet?id=${res.data.groupid}`
          })
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
})