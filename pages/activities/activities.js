// pages/activities/activities.js
const config = require("../../config")
Page({
    data: {
        FlavoriteList: [], // เก็บผลลัพธ์ทั้งหมด
        HiddenList: [], // เก็บผลลัพธ์ทั้งหมด
        offset: 0, // offset สำหรับ API
        limit: 10, // จำนวน item ต่อ request
        active: 0,
        ListNoFla: '',
        ListNoHide: '',
        language: "en",
    },

    onLoad() {
        wx.setNavigationBarTitle({
            title: '活动',
        });
        this.setData({
            language: config.language
        })
    },

    async onShow() {
        const Fladata = await this.getlocalstorate('FlavoriteList')
        if (Fladata) {
            let process = await this.loadData(Fladata);
            this.setData({
                FlavoriteList: process,
            });
        }
        const Hiddata = await this.getlocalstorate('HiddenList')
        if (Hiddata) {
            this.setData({ HiddenList: await this.loadData(Hiddata) })
        } else {
            this.setData({ HiddenList: [] })
        }
    },

    // a hidden listing was restored from its card: take it out of this tab
    onRestored(e) {
        this.setData({ HiddenList: this.data.HiddenList.filter((r) => Number(r._id) !== Number(e.detail.id)) })
    },

    getlocalstorate(key) {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key,
                success(res) {
                    let data = res.data || []
                    if (data.length > 0) {
                        data = data.map(val => val.id).join(',')
                    }
                    resolve(data)
                },
                fail() {
                    resolve('')
                }
            })
        })
    },

    async loadData(typeList) {
        const that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.PublicIPCallApiGoBackend}/legacy/miniprogram/search?LANGUAGE=${config.language}&LIMIT=30&MULTILIST=${typeList}`,
                method: 'GET',
                success(res) {
                    const rawData = res.data.response;
                    if (rawData) {
                        const newData = rawData;
                        const process = newData.map(item => {
                            const price = item.typeassetn === "1" ?
                                (item.LandSizeRai * 400) + (item.LandSizeNgan * 100) + item.LandSizeSQW + " 平方米" :
                                item.WHSizeSQM + " 平方米";
                            return {
                                ...item,
                                price
                            };
                        });
                        resolve(process);
                    }
                },
                fail(err) {
                    resolve('process');
                },
            });
        })
    },
})