// pages/groupmember/groupmember.js
const config = require("../../config");
Page({

    /**
     * Page initial data
     */
    data: {
        datalist: [],
        loaded: false, // the members have been requested (no "no data" before that)
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
        let members = []
        try {
            const res = await this.AjaxLoadMember()
            members = (res && res.data) || []
        } catch (e) {
            // a failed request shows the same as "nobody here"
        }
        this.setData({
            datalist : members,
            loaded: true
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