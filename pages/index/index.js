// index.js
const app = getApp();
Page({
    data: {
        dataAsset: [],
        show: false,
    },
    onReceiveData(e) {
        this.setData({
            show: e.detail.data
        })
    },
    async onLoad() {
        const getAsset = await app.GetLatestAsset();
        const chachengsao = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 6});
        const chonburi = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 12});
        const rayong = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 53});
        const yutya = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 46});
        const phathum = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 37});
        const samutprakarn = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 57});
        const samutsakorn = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 58});
        this.setData({
            dataAsset: getAsset,
            datachachengsao: chachengsao,
            datachonburi: chonburi,
            datarayong: rayong,
            datayutya: yutya,
            dataphathum: phathum,
            datasamutprakarn: samutprakarn,
            datasamutsakorn: samutsakorn,
        })
    },
    onShareAppMessage() {
        return {
            path: 'pages/index/index',
        }
    },
    nexttofeed(e) {
        wx.navigateTo({
            url: `/pages/feeds/feeds`
        });
    },
})
