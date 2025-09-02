// pages/nearlocation/nearlocation.js
const districtData = require('../../pages/internaldata/place.js');
const app = getApp();
Page({

  data: {
    selltype: 0,
    LocationData: []
  },

  async nextToSearch(e) {
    const selectid = e.target.dataset.id
    const selectlat = e.target.dataset.lat
    const selectlong = e.target.dataset.long
    const selecttext = e.target.dataset.text

    const selltype = this.data.selltype == 1 ? "buy" : "rent"
    const objpushing = {
      selltype : this.data.selltype,
      selltype_name: selltype,
      selectid: selectid,
      selectlat: selectlat,
      selectlong: selectlong,
      selecttext: selecttext,
      distancemode : 1,
      type: "nearlocation"
    }
    app.localStorageSetup('recentsearch', objpushing, 10)
    app.MainStackScreen(objpushing)
  },

  onLoad(options) {
    this.setData({
      selltype: this.options.selltype,
      LocationData: districtData,
    })
  },

})