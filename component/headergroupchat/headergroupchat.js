// component/headergroupchat/headergroupchat.js
const config = require("../../config");
const app = getApp()
Component({

    /**
     * Component properties
     */
    properties: {
        namegroup: {
            type: String,
            value: '',
        },
        groupid: {
            type: String,
            value: '',
        },
        assetid: {
            type: Number,
            value: '',
        },
        images : {
          type: String,
            value: '',
        }
    },

    /**
     * Component initial data
     */
    data: {
        // show: false,
        language: config.language
    },

    /**
     * Component methods
     */
    methods: {
        showPopup() {
            // this.setData({
            //     show: true
            // });
            const that= this
            wx.showActionSheet({
              itemList: [
                config.language == "zh" ? "群组简介" : "Goto Profile",
                config.language == "zh" ? "群组成员" : "Goto Member",
                config.language == "zh" ? "邀请入群" : "Invite to group",
                config.language == "zh" ? "聊天中的资产" : "Asset In Chat",
                // config.language == "zh" ? "最喜欢的资产" : "Favorite assets",
              ],
              success (res) {
                if(res.tapIndex == 0){
                  that.goToGroupProfile();
                } 
                if(res.tapIndex == 1){
                  that.goToGroupMember();
                } 
                if(res.tapIndex == 2){
                  that.goToinviteqr();
                } 
                if(res.tapIndex == 3){
                  that.goToAssetInchat()
                } 
                // if(res.tapIndex == 3){
                //   that.goToinviteqr();
                // } 
              },
              fail (res) {
                console.log(res.errMsg)
              }
            })
        },

        onClose() {
            this.setData({
                show: false
            });
        },

        goToGroupProfile() {
            wx.navigateTo({
                url: `/pages/groupprofile/groupprofile?groupid=${this.data.groupid}`,
            })
        },

        goToGroupMember() {
            wx.navigateTo({
                url: `/pages/groupmember/groupmember?groupid=${this.data.groupid}`,
            })
        },

        goToAsset() {
            wx.navigateTo({
                url: `/pages/assetdetail/assetdetail?id=${this.data.assetid}`,
            })
        },

        goToPreviewTask() {
            wx.navigateTo({
                url: `/pages/taskpreview/taskpreview?id=${this.data.assetid}`,
            })
        },

        goToAssetInchat() {
          wx.navigateTo({
              url: `/pages/assetinchat/assetinchat?id=${this.data.groupid}`,
          })
      },

        goToinviteqr() {
            wx.navigateTo({
                url: `/pages/groupinviteqr/groupinviteqr?id=${this.data.groupid}&groupname=${this.data.namegroup}&image=${this.data.images}`,
            })
        },

        goToFlavoriteAsset(){
          wx.navigateTo({
            url : `/pages/`
          })
        }
    }
})