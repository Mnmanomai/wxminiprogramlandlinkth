// pages/postinvestment/postinvestment.js
const config = require("../../config");

const app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        dataInvest: [],
        offset: 0,
        lenghtQuery: 10,
        language: config.language,
        leghthInvest: 0,
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        await this.getData();
    },

    async getData() {
        let lengthCheck = this.data.leghthInvest
        if (lengthCheck !== -1) {
            const dataInvest = await app.GetInvestment(this.data.offset, 1)
            console.log(dataInvest);
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

    }
})