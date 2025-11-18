// component/inoutsideindus/index.js
const app = getApp();
Component({

  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    nextToSearch(e) {
      var province = e.currentTarget.dataset.province ? e.currentTarget.dataset.province : "";
      var distric = province == "0000" ? "0000" : "";
      var selltype = e.currentTarget.dataset.selltype ? e.currentTarget.dataset.selltype : "1";
      var indus = e.currentTarget.dataset.indus ? e.currentTarget.dataset.indus : "";
      var landsizestart = e.currentTarget.dataset.landsizestart ? e.currentTarget.dataset.landsizestart : "";
      var landsizeend = e.currentTarget.dataset.landsizeend ? e.currentTarget.dataset.landsizeend : "";
      var lat = e.currentTarget.dataset.lat ? e.currentTarget.dataset.lat : "";
      var long = e.currentTarget.dataset.long ? e.currentTarget.dataset.long : "";
      var distancemode = e.currentTarget.dataset.distancemode ? e.currentTarget.dataset.distancemode : "";
      var color = e.currentTarget.dataset.color ? e.currentTarget.dataset.color : "";
      const objpushing = {
        selltype:selltype,
        province_id : province,
        district_id : distric,
        IEAT : indus,
        LandSizeStart : landsizestart,
        LandSizeEnd : landsizeend,
        selectlat : lat,
        selectlong : long,
        distancemode : distancemode,
        Color : color,
      }
      app.MainStackScreen(objpushing)
    },
  }
})