// pages/groupinvite/groupinvite.js
const config = require("../../config")
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

        wx.request({
            url: `${config.PublicIPCallApiGoBackend}/community/group/join`,
            method: 'POST',
            data: {
                queryurl: this.data.invitegroup
            },
            header: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            success: (res) => {
                if(res.data.groupid){
                  wx.reLaunch({
                    url : `/pages/chat/chat`
                  })
                }
            },
            complete: () => {
                wx.hideLoading();
            }
        });
    },

    
})