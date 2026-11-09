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
    Transactiontype : {
      type : String,
      value : '',
    },
    Industrailtype : {
      type : String,
      value : '',
    },
    Freezonetype : {
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
      if (!id) return
      const url = `/pages/assetdetail/assetdetail?id=${id}`
      // a mini program holds at most 10 pages: browsing from one listing to the next must not fill the stack, so near the limit
      // (or when navigateTo is refused) the current page is replaced instead
      if (getCurrentPages().length >= 9) {
        wx.redirectTo({ url })
        return
      }
      wx.navigateTo({
        url,
        fail() { wx.redirectTo({ url }) }
      })
    }
  }
})