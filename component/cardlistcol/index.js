// component/cardlistcol/index.js
const app = getApp();
Component({

  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: []
    },
    provinceno: {
      type: String,
      value:''
    },
    
  },

  /**
   * Component initial data
   */
  data: {

    // countArray: Array.from({ length: 10 })
  },

  /**
   * Component methods
   */
  methods: {
    PackageNonsavednextToSearch(e) {
      var province = e.currentTarget.dataset.province ? e.currentTarget.dataset.province : "";
      var distric = province == "0000" ? "0000" : "0000";
      var selltype = 0;
      const objpushing = {
        selltype:selltype,
        province_id : province,
        district_id : distric,
      }
      app.MainStackScreen(objpushing)
    },

    
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${id}`
      });
    },
  }
})