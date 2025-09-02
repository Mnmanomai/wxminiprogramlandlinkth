// pages/province/province.js
const config = require('../../config.js');
const districtData = require('../../pages/internaldata/district.js');
const ResDistrictData = districtData.response
const app = getApp();
Page({

  data: {
    selltype: 0,
    ProvinceID: 0,
    ProvinceName: "",
    dataDistrict: [],
    DistricDefault: [],
    DisplayDistrict: [],
    language : "en",
  },

  async onLoad(options) {
    this.setData({
      selltype: options.selltype,
      ProvinceID: options.id || null,
      ProvinceName: options.name || "",
      language : config.language,
    })
    // const District = await this.loadDataDistrict()
    this.setData({
      dataDistrict: ResDistrictData,
      DistricDefault: ResDistrictData,
      DisplayDistrict: ResDistrictData,
    })
    this.filterdefault(this.data.ProvinceID)
  },

  filterdefault(e) {
    const id_default = e
    const listdefault = this.data.dataDistrict || [];
    const result = listdefault.filter(item => {
      let finded = item.province_id;
      return finded === id_default;
    });

    const first_row = {
      district_id: "0000",
      district_name: "全部",
      district_name_en: "All",
      latitude: "13.646",
      longtitude: "100.37",
      province_id: this.data.ProvinceID
    }
    result.unshift(first_row)

    this.setData({
      DistricDefault: result,
      DisplayDistrict: result,
    })
  },

  async nextToSearch(e) {
    const distric_id = e.target.dataset.district
    const province_id = e.target.dataset.province
    const namedistrict = e.target.dataset.namedistric

    const selltype = this.data.selltype == 1 ? "buy" : "rent"
    const objpushing = {
      selltype : this.data.selltype,
      selltype_name: selltype,
      district_id: distric_id,
      distric_name: namedistrict,
      province_id: province_id,
      province_name: this.data.ProvinceName,
      type: "provinceanddistrict"
    }
    app.localStorageSetup('recentsearch', objpushing, 10)
    app.MainStackScreen(objpushing)
  },

  filterDistrict(e) {
    const search_detail = e.detail.trim().toLowerCase();
    const listdefault = this.data.DistricDefault || [];
    const result = listdefault.filter(item => {
      let finded = item.district_name_en.trim().toLowerCase().replace(/\s+/g, '');
      return finded.includes(search_detail);
    });

    this.setData({
      DisplayDistrict: result
    })
  },
})