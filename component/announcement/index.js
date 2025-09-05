// component/announcement/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    data: { // รับ props จาก page ได้
      type: Boolean,
      value: false
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
    opencontact(){
      this.triggerEvent('sendData', { data: true })
    }
  }
})