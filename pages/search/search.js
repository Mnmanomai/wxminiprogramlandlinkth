// pages/search/search.js
const app = getApp();
Page({
    data: {
        fetchData: [], // เก็บผลลัพธ์ทั้งหมด
        loading: false, // กำลังโหลดหรือไม่
        hasMore: true, // มีข้อมูลเหลือให้โหลดหรือไม่
        offset: 0,
        limit: 10,
        searchvalue: {
            selltype: 0,
            assettype: 0,
            order: 0,
            province: 0,
            district: 0,
            lat: '',
            long: '',
            distancemode: 0,
            PropertyType: '',
            IEAT: '',
            Color: '',
            LandSizeStart: 0,
            LandSizeEnd: 0,
            PriceStart: 0,
            PriceEnd: 0,
            BuildingStart: 0,
            BuildingEnd: 0,
            Building: '',
        },

    },

    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '搜索',
        });
        this.setData({
            'searchvalue.selltype': options.selltype ? options.selltype : '',
            'searchvalue.assettype': options.assettype ? options.assettype : '',
            'searchvalue.province': options.province ? options.province : '',
            'searchvalue.district': options.district ? options.district : '',
            'searchvalue.lat': options.lat ? options.lat : '',
            'searchvalue.long': options.long ? options.long : '',
            'searchvalue.distancemode': options.distancemode ? options.distancemode : '',
            'searchvalue.PropertyType': options.PropertyType ? options.PropertyType : '',
            'searchvalue.IEAT': options.IEAT ? options.IEAT : '',
            'searchvalue.Color': options.Color ? options.Color : '',
            'searchvalue.LandSizeStart': options.LandSizeStart ? options.LandSizeStart : '',
            'searchvalue.LandSizeEnd': options.LandSizeEnd ? options.LandSizeEnd : '',
            'searchvalue.PriceStart': options.PriceStart ? options.PriceStart : '',
            'searchvalue.PriceEnd': options.PriceEnd ? options.PriceEnd : '',
            'searchvalue.BuildingStart': options.BuildingStart ? options.BuildingStart : '',
            'searchvalue.BuildingEnd': options.BuildingEnd ? options.BuildingEnd : '',
            'searchvalue.Building': options.Building ? options.Building : '',
        })

        this.Getsearch();
    },

    async Getsearch() {
        if (this.data.loading || !this.data.hasMore) return;
        this.setData({
            loading: true
        });
        let sentobject = {
            selltype: this.data.searchvalue.selltype || 0,
            assettype: this.data.searchvalue.assettype || 0,
            limit: this.data.limit || 0,
            order: this.data.searchvalue.order || 0,
            offset: this.data.offset || 0,
            province: this.data.searchvalue.province || '',
            district: this.data.searchvalue.district || '',
            lat: this.data.searchvalue.lat || '',
            long: this.data.searchvalue.long || '',
            distancemode: this.data.searchvalue.distancemode || '',
            PropertyType: this.data.searchvalue.PropertyType || '',
            IEAT: this.data.searchvalue.IEAT || '',
            Color: this.data.searchvalue.Color || '',
            LandSizeStart: this.data.searchvalue.LandSizeStart || '',
            LandSizeEnd: this.data.searchvalue.LandSizeEnd || '',
            PriceStart: this.data.searchvalue.PriceStart || '',
            PriceEnd: this.data.searchvalue.PriceEnd || '',
            BuildingStart: this.data.searchvalue.BuildingStart || '',
            BuildingEnd: this.data.searchvalue.BuildingEnd || '',
            Building: this.data.searchvalue.Building || '',
        }
        let Dataget = await app.GetAsset(sentobject);
        // let DataMain = await this.settinglist(Dataget)
        this.setData({
            fetchData: [...this.data.fetchData, ...Dataget],
            // fetchData: this.data.fetchData,
            offset: this.data.offset + Dataget.length,
            hasMore: Dataget.length > 0,
            loading: false
        });
    },



    onReachBottom() {
        this.Getsearch();
    },

    OrderSelect(e) {
        let Ordervalue = e.detail.order;
        this.setData({
            fetchData: [],
            'searchvalue.order': Ordervalue,
        })
        this.Getsearch();
    },

    async Openfilter() {
        wx.navigateTo({
            url: '/pages/searchdetail/searchdetail',
            success: (res) => {

                this.setData({
                  'searchvalue.LandSizeStart' : this.data.searchvalue.LandSizeStart ? this.data.searchvalue.LandSizeStart : 0,
                  'searchvalue.LandSizeEnd' : this.data.searchvalue.LandSizeEnd ? this.data.searchvalue.LandSizeEnd : 0,
                  'searchvalue.PriceStart' : this.data.searchvalue.PriceStart ? this.data.searchvalue.PriceStart : 0,
                  'searchvalue.PriceEnd' : this.data.searchvalue.PriceEnd ? this.data.searchvalue.PriceEnd : 0,
                  'searchvalue.BuildingStart' : this.data.searchvalue.BuildingStart ? this.data.searchvalue.BuildingStart : 0,
                  'searchvalue.BuildingEnd' : this.data.searchvalue.BuildingEnd ? this.data.searchvalue.BuildingEnd : 0,
                })

                res.eventChannel.emit('openfilterdata', this.data.searchvalue);
                res.eventChannel.on('returnfilterdata', (data) => {


                    let Colordata = data.success.Color;
                    let dataTest = ""
                    if (Array.isArray(Colordata)) {
                        dataTest = Colordata.join(",");
                        data.success.Color = dataTest
                    }



                    this.setData({
                        fetchData: [],
                        offset: 0,
                        searchvalue: data.success
                    })
                    this.Getsearch()
                })

            },
        })
    },
});
