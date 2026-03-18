// component/taskpreviewcard/taskpreviewcard.js
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
    Naviagtetoasset(){
      wx.navigateTo({
        url : "/pages/assetdetail/assetdetail?id=1388"
      })
    },
  }
})