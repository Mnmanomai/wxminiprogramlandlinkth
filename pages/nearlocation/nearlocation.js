// pages/nearlocation/nearlocation.js
const districtData = require('../../pages/internaldata/place.js');
const app = getApp();
Page({

  data: {
    selltype: 0,
    LocationData: []
  },

  async nextToSearch(e) {
    const selectmode = this.data.selectmode

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
      selectmode : selectmode,
      distancemode : 1,
      type: "nearlocation"
    }
    if (selectmode !== "1"){
      app.localStorageSetup('recentsearch', objpushing, 10)
      app.MainStackScreen(objpushing)
    }else{
      app.NextToSelectMode(objpushing)
    }
    
    
  },

  onLoad(options) {
    this.setData({
      selectmode : options.selectmode,
      selltype: this.options.selltype,
      LocationData: districtData,
    })
  },

})