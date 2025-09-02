// pages/province/province.js
const config = require('../../config');
const provinceData = require('../../pages/internaldata/province.js');
const ResProvinceData = provinceData.response
Page({
    data: {
        selltype : 0,
        dataProvince: [],
        DisplayProvince: [],
        language : "en",
    },

    NextToDistrict(e) {
        const search_detail = e.target.dataset.id
        const search_detail_name = e.target.dataset.name
        // console.log(search_detail);
        wx.navigateTo({
          url: `/pages/district/district?selltype=${this.data.selltype}&id=${search_detail}&name=${search_detail_name}`
        })
    },

    filterProvince(e) {
        const search_detail = e.detail.trim().toLowerCase();
        const listdefault = this.data.dataProvince || [];
        const result = listdefault.filter(item => {
            let finded = item.province_name_en.trim().toLowerCase().replace(/\s+/g, '');
            return finded.includes(search_detail);
        });
        this.setData({
            DisplayProvince: result
        })
    },

    async onLoad(options) {
        // const Province = await this.loadDataProvince()
        this.setData({
            selltype : options.selltype,
            dataProvince: ResProvinceData,
            DisplayProvince: ResProvinceData,
            language : config.language,
        })
    },
    
})