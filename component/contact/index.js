// component/contact/index.js

Component({

  properties: {
    customer: {
      type: String,
      value: "",
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    show: false,
    supportPhone: '+66641648899',
    customer : '',
  },

  methods: {
    onClose() {
      this.setData({
        show: false
      });
    },

    callCustomer() {
      const chatnumber = this.data.customer
      console.log(chatnumber);
    },

    callSupport() {
      wx.makePhoneCall({
        phoneNumber: this.data.supportPhone,
        success() {},
        fail(err) {}
      });
    },

  }
})