// pages/users/users.js
Page({

    /**
     * Page initial data
     */
    data: {
        firstname: '',
        lastname: '',
        images: '',
        position: '',
        showcontact: false,
        opencreategroup: false,
        level: 0,
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        await this.setdatauser()

        let data = wx.getStorageSync('usersdetail')
        this.setData({
            level: data.level
        })
    },

    openpopCrateUser() {
        this.setData({
            opencreategroup: true
        })
    },

    async setdatauser() {
        const datalist = await this.getStorage();
        const detaildata = datalist.data
        this.setData({
            firstname: detaildata.firstname,
            lastname: detaildata.lastname,
            images: detaildata.picture,
        })
    },

    async getStorage() {
        return new Promise((reslove, reject) => {
            wx.getStorage({
                key: 'usersdetail',
                success(option) {
                    reslove(option)
                }
            })
        })
    },

    popupsupport() {
        this.setData({
            showcontact: true
        })
    },

    gotoPage(e) {
        const url = e.currentTarget.dataset.url;
        wx.switchTab({
            url: url,
        })
    },

    openTab(e) {
        const url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url,
        })
    },
})