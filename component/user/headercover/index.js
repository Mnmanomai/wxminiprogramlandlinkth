// component/user/headercover/index.js
const config = require("../../../config");
Component({

  /**
   * Component properties
   */
  properties: {
    firstname : '',
    lastname : '',
    picture : '',
  },

  /**
   * Component initial data
   */
  data: {
    language : config.language
  },

  /**
   * Component methods
   */
  methods: {
    goTodetailUser(){
      wx.navigateTo({
        url: '/pages/userdetail/userdetail',
      })
    }


  }
})