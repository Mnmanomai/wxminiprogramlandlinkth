const config = require("../../../config");
// component/user/menu/index.js
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
    language : config.language
  },

  /**
   * Component methods
   */
  methods: {
    gotoPage(e) {
      const url = e.currentTarget.dataset.url;
      wx.switchTab({
        url: url,
      })
    },

    openTab(e) {
      
      const url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
      })
    },

    supportTrigger(){
      this.triggerEvent('triggersupport',true)
    }


  }
})