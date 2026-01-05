// component/createpost/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    PictureOwenrID : '',
    ugroup : '',
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
    Nexttocreatepost(){
      wx.navigateTo({
        url: `/pages/createpost/index?ugroip=${this.data.ugroup}`,
      })
    }
  }
})