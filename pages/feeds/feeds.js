// pages/feeds/feeds.js
const config = require("../../config");
Page({
    data: {
        datapost: [],
        groupId: null,
        Images: null,
        assetNo : null
    },

    async onLoad(options) {
        this.setData({
            groupId: options.id
        })

        await this.getDataPicture();
    },

    async onShow() {
        await this.reloadData()
    },

    async reloadData() {
        if (!this.data.groupId) return;

        try {
            const data = await this.getDataFeed(this.data.groupId)
            this.setData({
                datapost: data.posts,
                groupName : data.group_name,
                assetNo : data.asset_no,
            })
        } catch (err) {
            console.error("Reload error:", err)
        }
    },
    async getDataPicture() {
        const picture = await new Promise((resolve, reject) => {
            wx.getStorage({
                key: 'usersdetail',
                success(res) {
                    resolve(res.data.picture)
                },
                fail(err) {
                    reject(err)
                }
            })
        });
        this.setData({
            Images: picture
        })

    },

    async getDataFeed(id) {
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
                url: `${config.PublicIPCallApiGoBackend}/community/post/group/${id}`,
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
