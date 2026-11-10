// pages/users/users.js
const config = require("../../config")
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
        language : config.language,
        level: 0,
        role: 'customer', // 'agent' once an agent account is linked to this WeChat
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        await this.setdatauser()

        let data = wx.getStorageSync('usersdetail')
        this.setData({
            level: data.level,
            role: data.role || 'customer'
        })
        this.loaded = true
    },

    // coming back from the account sign-in page (or after unlinking) the session may have changed
    async onShow() {
        if (!this.loaded) return // onLoad is still doing the first load
        await this.setdatauser()
        const data = wx.getStorageSync('usersdetail') || {}
        this.setData({ level: data.level, role: data.role || 'customer' })
    },

    goAccountLogin() {
        wx.navigateTo({ url: '/pages/agentlogin/agentlogin' })
    },

    // forget the account linked to this WeChat, then sign in again: this WeChat is a plain user again
    unlinkWechat() {
        const zh = config.language !== 'en'
        wx.showModal({
            title: zh ? '退出账号登录' : 'Sign out of account',
            content: zh ? '退出后，此微信将以普通用户身份使用。' : 'This WeChat will be used as a normal user afterwards.',
            confirmText: zh ? '退出' : 'Sign out',
            success: (m) => {
                if (!m.confirm) return
                const token = (wx.getStorageSync('usersdetail') || {}).token
                wx.request({
                    url: config.PublicIPCallApiGoBackend + '/auth/wechat/unbind-agent',
                    method: 'POST',
                    header: { Authorization: 'Bearer ' + token },
                    success: async (res) => {
                        if (res.statusCode !== 200) return wx.showToast({ title: zh ? '操作失败' : 'Something went wrong', icon: 'none' })
                        await getApp().LoginWechat() // a new session: customer now
                        wx.showToast({ title: zh ? '已退出' : 'Signed out', icon: 'success' })
                        this.onShow()
                    },
                    fail: () => wx.showToast({ title: zh ? '操作失败' : 'Something went wrong', icon: 'none' })
                })
            }
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

    closeContact() {
        this.setData({ showcontact: false })
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