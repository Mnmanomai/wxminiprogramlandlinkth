const config = require("../../config");
const app = getApp()
// pages/myinvestment/myinvestment.js

Page({

    /**
     * Page initial data
     */
    data: {
        dataInvest: [],
        offset: 0,
        lenghtQuery: 10,
        language: "zh",
        leghthInvest: 0,
        show: false,
        lengthinvest :0,
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        const textMyinvestment = config.language == "zh" ? "我的投资" : "My Investment"
        this.setData({
            language : config.language
        })
        wx.setNavigationBarTitle({
            title: textMyinvestment,
        });
        await this.getMyInvestmet()
        // await this.getData();
    },

    async getData() {
        let lengthCheck = this.data.leghthInvest
        if (lengthCheck !== -1) {
            const dataInvest = await app.GetInvestment(this.data.offset, this.data.lenghtQuery)
            let lenghtDataInvest = dataInvest !== "0 result" ? dataInvest.length : -1;
            if (lenghtDataInvest != -1) {
                const fixedData = dataInvest.map(item => ({
                    ...item,
                    planned_visit: item.planned_visit ? item.planned_visit.split(' ')[0] : ''
                }))

                this.setData({
                    dataInvest: [...this.data.dataInvest, ...fixedData],
                    offset: lenghtDataInvest + this.data.offset,
                    leghthInvest: lenghtDataInvest,
                })
            }
        }

    },

    async getMyInvestmet() {
        try {
            let data = await this. reqMyInvestment()
            console.log(data);
            let lengthinvest = data.data.length
            console.log(lengthinvest);
            this.setData({
                dataInvest : [...this.data.dataInvest,...data.data],
                lengthinvest : lengthinvest,
            })
        } catch {
            console.log("error")
        }

        console.log(this.data.dataInvest);
    },

    async reqMyInvestment() {
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
                url: `${config.PublicIPCallApiGoBackend}/investment/zh/myinvestmentlist`,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                success(res) {
                    resolve(res.data)
                },
                fail(res) {
                    reject(res)
                },
            })
        })
    },

    // async onReachBottom() {
    //     await this.getData();
    // },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {

    },


})