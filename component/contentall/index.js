// component/contentall/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    list : {
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
    nexttoguide(e){
      // console.log(e);
      let data = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/guide/index?id=${data}`,
      })
    },
  }
})