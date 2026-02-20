// pages/investmentmarket/investmentmarket.js
const app = getApp()
Page({
    data: {
        dataInvest: [],
        offset: 0,
        lenghtQuery: 10,
        language: "zh",
        leghthInvest: 0,
        show: false
    },

    async onLoad(options) {
        wx.setNavigationBarTitle({
            title: '寻找资产',
        });
        await this.getData();
    },

    onReceiveData(e) {
        this.setData({
            show: e.detail.data
        })
    },

    async getData() {
        let lengthCheck = this.data.leghthInvest
        if (lengthCheck !== -1) {
            const dataInvest = await app.GetInvestment(this.data.offset, this.data.lenghtQuery)
            let lenghtDataInvest = dataInvest.data !== null ? dataInvest.data.length : -1;
            if (lenghtDataInvest != -1) {
                const fixedData = dataInvest.data.map(item => ({
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

    async onReachBottom() {
        await this.getData();
    },
})