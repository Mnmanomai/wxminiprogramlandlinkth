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
        language : "en",
    },
    
    onLoad(){
      this.setData({
        language : config.language
      })
    },

    async onShow() {
        const Fladata = await this.getlocalstorate('FlavoriteList')
        const Hiddata = await this.getlocalstorate('HiddenList')
        if (Fladata) {
            let process = await this.loadData(Fladata);
            this.setData({
                FlavoriteList: process,
            });
        }

        if (Hiddata) {
            let process = await this.loadData(Hiddata);
            this.setData({
                HiddenList: process,
            });
        }

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
                url: `${config.apiBaseUrl}/api/miniprogramapi/search.php?LANGUAGE=zh&MULTILIST=${typeList}`,
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