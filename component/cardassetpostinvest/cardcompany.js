// component/cardcompany/cardcompany.js
Component({

  /**
   * Component properties
   */
  properties: {
    data : {}
  },

  data: {
    // test : [{
    //   ID : 1,
    //   nameasset:"Y 罗勇府浅紫色土地带新仓库出售，土地面积25-2-94.20售价350万泰铢每莱 已有工",
    //   province:"Bangkok",
    //   district:"Bangna",
    //   avgsqmperprice : "10,000",
    //   land_size_rai: 25,
    //   land_size_ngan: 2,
    //   land_size_sqw: 94.2,
    //   posted : "4 hours",
    //   ieat : true,
    //   assettype : "sell",
    //   saleprice : "102,942,000",
    // }]
  },

  /**
   * Component methods
   */
  methods: {
    Openasset(e){
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${e.currentTarget.dataset.id}`,
      })
    },
    
  }
})