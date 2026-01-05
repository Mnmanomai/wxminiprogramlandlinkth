// pages/chat/chat.js
const app = getApp();
const config = require("../../config");
Page({

    /**
     * Page initial data
     */
    data: {
        chatlist: [],
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad() {
        wx.setNavigationBarTitle({
            title: '聊天',
        });
    },

    async onShow() {
        let data = await this.getChatList();
        this.setData({
            chatlist: data.data
        })
        
    },



    async getChatList() {
        const tokenrequest = await new Promise((resolve, reject) => {
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
                url: `${config.PublicIPCallApiGoBackend}/community/group/getgroupchat`,
                method: 'GET',
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                success(res) {
                    resolve(res.data)
                },
            })
        })
    }

})