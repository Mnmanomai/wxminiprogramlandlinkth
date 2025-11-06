const app = getApp();
// component/selecttype/index.js
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
    nextToSearch(e) {
      var type = e.currentTarget.dataset.type
      const objpushing = {
        selltype:"1",
        PropertyType: type,
      }
      app.MainStackScreen(objpushing)
    },
  }
})