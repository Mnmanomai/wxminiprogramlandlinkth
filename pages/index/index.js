// index.js
const app = getApp();
Page({
    data: {
        datarecent: [], // recently viewed listings (ids kept in storage RecentViewed by the detail page)
        show: false,
    },

    onReceiveData(e) {
        this.setData({
            show: e.detail.data
        })
    },

    // TEMP debugging: a toast is visible even if the Console is filtered / looking at the wrong panel
    // tesclick(){
    //   console.log("test")
    //   wx.showToast({ title: 'tap ok', icon: 'none' })
    // },
    
    async onLoad() {
        console.log("index onLoad started") // TEMP debugging
        const chachengsao = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 6});
        const chonburi = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 12});
        const rayong = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 53});
        const yutya = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 46});
        const phathum = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 37});
        const samutprakarn = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 57});
        const samutsakorn = await app.GetAsset({selltype: 1,limit: 10,offset: 0,province: 58});
        // a failed request answers "err" (a string): show nothing for that province instead of empty cards
        const rows = (v) => (Array.isArray(v) ? v : [])
        this.setData({
            datachachengsao: rows(chachengsao),
            datachonburi: rows(chonburi),
            datarayong: rows(rayong),
            datayutya: rows(yutya),
            dataphathum: rows(phathum),
            datasamutprakarn: rows(samutprakarn),
            datasamutsakorn: rows(samutsakorn),
        })
    },
    // refreshed every time the page is shown: a listing opened from here moves to the front of the row on return
    async onShow() {
        const ids = (wx.getStorageSync('RecentViewed') || []).slice(0, 10)
        if (ids.length === 0) return this.setData({ datarecent: [] })
        const rows = await app.GetAsset({ selltype: 0, limit: 10, offset: 0, multilist: ids.join(',') })
        // the API does not keep the order of MULTILIST: put the most recently viewed first
        const list = Array.isArray(rows) ? rows.slice().sort((a, b) => ids.indexOf(a._id) - ids.indexOf(b._id)) : []
        this.setData({ datarecent: list })
    },
    onShareAppMessage() {
        return {
            path: 'pages/index/index',
        }
    },
    
})
