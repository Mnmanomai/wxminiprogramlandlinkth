// component/cardlistcol/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    list: { //รายการ
      type: Array,
      value: []
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
    goToDetail(e) {
      
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${id}`
      });
    },
  }
})