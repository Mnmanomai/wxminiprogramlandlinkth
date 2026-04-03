// component/assetinchatcard/assetinchatcard.js
Component({

  /**
   * Component properties
   */
  properties: {
    datalist : {
      type : Array,
      value : []
    }
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
      goAsset(e){
        wx.navigateTo({
          url : `/pages/assetdetail/assetdetail?id=${e.currentTarget.dataset.id}`
        })
      }
  }
})