// component/contact/index.js — the "contact us" popup: the three Landlink phone numbers and the WeChat customer-service chat.
const support = require('../../utils/support')
const config = require('../../config')

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    // optional context for the chat button: which listing the customer is asking about (the team gets a card of it)
    sessionFrom: { type: String, value: '' },
    msgTitle: { type: String, value: '' },
    msgPath: { type: String, value: '' },
    msgImg: { type: String, value: '' }
  },

  data: {
    en: config.language === 'en',
    phones: support.PHONES
  },

  methods: {
    // tell the page to hide it (the page owns `show`; closing only the component's copy would leave the page thinking it is still open)
    onClose() {
      this.setData({ show: false })
      this.triggerEvent('close')
    },

    callNumber(e) {
      support.call(e.currentTarget.dataset.number)
    }
  }
})
