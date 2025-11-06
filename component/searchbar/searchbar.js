// component/searchbar/searchbar.js
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
    gotofilter() {
      wx.navigateTo({
        url: '/pages/filtersearch/filtersearch',
      })
    },
  }
})