// components/cardListAsset/cardListAsset.js
Component({

  /**
   * Component properties
   */
  properties: {
    list: { //รายการ
      type: Array,
      value: []
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
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${id}`
      });
    },
  }
})