const app = getApp()
// pages/groupinviteqr/groupinviteqr.js
Page({


  data: {
    id: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      id: options.id,
      groupname : options.groupname
    })
  },
  async onShareAppMessage() {
    let groupid = this.data.id
    let querygroup = await app.Getinvitegroup(groupid)
    const Share = {
      title: this.data.groupname,
      path: `/pages/groupinvite/groupinvite?invitegroup=${querygroup}`,
      imageUrl: this.data.image && this.data.image.length > 0 ?
        this.data.image : "/asset/landlink.png"
    }
    return Share
  }
})