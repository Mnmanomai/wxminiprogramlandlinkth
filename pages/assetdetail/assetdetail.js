// pages/assetdetail/assetdetail.js
const config = require("../../config");
Page({
    data: {
        show: false,
        id: 0,
        predata: [],
        lat: null,
        long: null,
        distance: [],
        likeActive: false,
        language: "en",
        // customer : "chatid:101",
        markers: [{
            id: 900000001,
            latitude: 13.736717,
            longitude: 100.523186,
            title: "Thailand",
            iconPath: "",
            width: 30,
            height: 30
        }]
    },

    async loadData(id) {
        const that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.apiBaseUrl}/api/request_detail_asset.php`,
                method: 'GET',
                data: {
                    API_KEY: "00c484016ad6d5e066aa718c6dd218f91387141fce8187c8ec808a468c70ee6e",
                    LANGUAGE: config.language,
                    NO_ASSET: id,
                },
                success(res) {
                    const rawData = res.data.respond;
                    const Rai = res.data.respond.LandSizeRai
                    const Ngan = res.data.respond.LandSizeNgan
                    const SQW = res.data.respond.LandSizeSQW

                    const AreaSizeSqw = that.cal_area(Rai, Ngan, SQW);
                    rawData.AreaSizeSqw = AreaSizeSqw;

                    that.setData({
                        predata: rawData,
                        lat: rawData.Latitude,
                        id: rawData._id,
                        long: rawData.Longtitude,
                        markers: [{
                            latitude: rawData.Latitude,
                            longitude: rawData.Longtitude
                        }]
                    });
                    resolve(rawData); // ✅ resolve เมื่อ request เสร็จ
                },
                fail(err) {
                    // console.error('Failed:', err);
                    reject(err); // ✅ reject ถ้า error
                }
            });
        });
    },

    GetMainLocation(lat, long) {
        const listMatch = [{
                nameLocation: config.language == "en" ? "Bangkok Port" : "曼谷港",
                lat: 13.703725202917552,
                lon: 100.57545214497117
            },
            {
                nameLocation: config.language == "en" ? "Suvarnabhumi Airport" : "素万那普机场",
                lat: 13.69228763878031,
                lon: 100.75073565396958
            },
            {
                nameLocation: config.language == "en" ? "Laem Chabang Port" : "林查班港",
                lat: 13.057940254556762,
                lon: 100.89195129089039
            },
        ]
        const assetLocation = {
            lat: lat,
            lon: long
        }
        let DataAdded = []
        listMatch.forEach(element => {
            const locationSet = {
                lat: element.lat,
                lon: element.lon
            }
            const data = this.haversineDistance(locationSet, assetLocation)
            DataAdded = [...DataAdded, {
                name: element.nameLocation,
                distance: data
            }]
        });

        this.setData({
            distance: DataAdded
        })
    },

    haversineDistance(coords1, coords2) {
        const toRad = (x) => x * Math.PI / 180;
        const lat1 = coords1.lat;
        const lon1 = coords1.lon;
        const lat2 = coords2.lat;
        const lon2 = coords2.lon;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        let fixdistance = distance.toFixed(0);
        return fixdistance;
    },

    async onLoad(options) {
        this.setData({
            newsId: options.id, // รับค่า id จาก URL
            language: config.language
        });
        await this.loadData(this.data.newsId)
        this.storagelist();
        this.GetMainLocation(this.data.lat, this.data.long)
    },

    cal_area(rai, ngan, sqw) {
        const drai = rai ? rai * 1200 : 0;
        const dngan = ngan ? ngan * 400 : 0;
        const dsqw = sqw ? sqw * 4 : 0;
        const dreturn = drai + dngan + dsqw
        return dreturn;
    },

    onShareAppMessage() {
        const Share = {
            title: this.data.predata.NameAsset,
            path: "/pages/assetdetail/assetdetail?id=" + this.data.predata._id,
            imageUrl: this.data.predata.no_images_asset && this.data.predata.no_images_asset.length > 0 ?
                this.data.predata.no_images_asset[0] : "/asset/landlink.webp"
        }

        return Share;
    },

    goToMap() {
        wx.pageScrollTo({
            selector: '#section_map',
            duration: 300 // scroll animation 300ms
        });
    },

    storagelist() {
        const Noid = this.data.id;
        const that = this
        wx.getStorage({
            key: 'FlavoriteList',
            success(res) {
                let oldData = res.data || [];
                let DataChecked = false;
                oldData.map(item => {
                    item.id === Noid ? DataChecked = true : '';
                });
                that.setData({
                    likeActive: DataChecked
                })
            },
        });
    },

    likefunc() {
        const id = this.data.id;
        const that = this
        wx.getStorage({
            key: 'FlavoriteList',
            success(res) {
                let oldData = res.data || [];
                const index = oldData.findIndex(item => item.id === id);
                if (index !== -1) {
                    oldData.splice(index, 1);
                    wx.showToast({
                        title: '删除',
                        icon: 'none'
                    });
                } else {
                    oldData.push({
                        id
                    });
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success'
                    });
                }

                wx.setStorage({
                    key: 'FlavoriteList',
                    data: oldData
                });
            },
            fail() {
                const newData = [{
                    id
                }];
                wx.setStorage({
                    key: 'FlavoriteList',
                    data: newData
                });
                wx.showToast({
                    title: '添加成功',
                    icon: 'success'
                });
            },
            complete() {
                that.storagelist()
            }
        });
    },

    hidefunc() {
        const that = this;
        wx.showModal({
            title: '确认隐藏',
            content: '您想隐藏此资产吗？',
            confirmText: '是的',
            cancelText: '不',
            success(res) {
                if (res.confirm) {
                    const idList = that.data.id;
                    wx.getStorage({
                        key: 'HiddenList',
                        success(res) {
                            let oldData = res.data || [];
                            const index = oldData.findIndex(item => item.id === idList);

                            if (index !== -1) {
                                oldData.splice(index, 1);
                            } else {
                                oldData.push({
                                    id: idList
                                });
                            }
                            wx.setStorage({
                                key: 'HiddenList',
                                data: oldData
                            });
                        },
                        fail() {
                            const newData = [{
                                id: idList
                            }];
                            wx.setStorage({
                                key: 'HiddenList',
                                data: newData
                            });
                        },
                        complete() {
                            wx.navigateBack();
                        }
                    });
                }
            }
        });
    },

    showPopup(){
      this.setData({
        show:true
      })
    },

})