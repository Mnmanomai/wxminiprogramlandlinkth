// pages/groupmember/groupmember.js
const config = require("../../config");
Page({

    /**
     * Page initial data
     */
    data: {

    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        this.setData({
            uidgroup: options.groupid
        })

    },
    async onShow() {
        let res = await this.AjaxLoadMember()
        this.setData({
            datalist : res.data
        })
    },

    async AjaxLoadMember() {
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
                url: `${config.PublicIPCallApiGoBackend}/community/group/member/${this.data.uidgroup}`,
                method: 'GET',
                header: {
                    'Authorization': 'Bearer ' + token
                },
                success(res) {
                    resolve(res.data)
                },
                fail(err) {
                    reject(err)
                }
            })
        })
    },
})