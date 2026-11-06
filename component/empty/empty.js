// component/empty/empty.js — the "no data" state shared by the list pages
const config = require("../../config")

Component({
  properties: {
    // override the default message (zh: 暂无数据 / en: No data)
    text: { type: String, value: '' },
    icon: { type: String, value: 'info-o' }
  },
  data: {
    message: ''
  },
  lifetimes: {
    attached() {
      this.setData({ message: this.data.text || (config.language === 'en' ? 'No data' : '暂无数据') })
    }
  }
})
