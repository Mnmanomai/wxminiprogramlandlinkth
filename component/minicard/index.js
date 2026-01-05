// component/minicard/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    AssetId : {
      type : Number,
      value : '',
    },
    AssetType : {
      type : String,
      value : '',
    },
    AssetColor : {
      type : String,
      value : '',
    },
    AssetName : {
      type : String,
      value : '',
    },
    Images : {
      type : String,
      value : '',
    },
    Province : {
      type : String,
      value : '',
    },
    District : {
      type : String,
      value : '',
    },
    SalePriceBath : {
      type: String,
      value : 0,
    },
    RentCostPerMonthBath : {
      type: String,
      value : 0,
    },
    AreaLandRai :{
      type : Number,
      value : '',
    },
    AreaLandNgan :{
      type : Number,
      value : '',
    },
    AreaLandSqw :{
      type : Number,
      value : '',
    },
    AreaWH : {
      type : Number,
      value : '',
    },
    Time : {
      type : String,
      value : '',
    },
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
    Nexttoasset(e){
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${id}`,
      })
    }
  }
})