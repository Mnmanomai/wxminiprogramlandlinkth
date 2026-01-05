// component/headergroupchat/headergroupchat.js
Component({

  /**
   * Component properties
   */
  properties: {
    namegroup:'',
    groupid:'',
    assetid:'',
  },

  /**
   * Component initial data
   */
  data: {
    show: false,
  },

  /**
   * Component methods
   */
  methods: {
    showPopup() {
      this.setData({ show: true });
    },
  
    onClose() {
      this.setData({ show: false });
    },

    goToGroupProfile(){
      const groupid = this.data.groupid
      wx.navigateTo({
        url: `/pages/groupprofile/groupprofile?groupid=${groupid}`,
      })
    },

    goToGroupMember(){
      const groupid = this.data.groupid
      wx.navigateTo({
        url: `/pages/groupmember/groupmember?groupid=${groupid}`,
      })
    },

    goToAsset(){
      const assetid = this.data.assetid
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${assetid}`,
      })
    }
  }
})