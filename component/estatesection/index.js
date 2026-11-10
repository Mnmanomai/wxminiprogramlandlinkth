// component/estatesection/index.js — "Industrial estates" section on the home page: a swipeable row of estate cards + a link to the full list.
const estate = require('../../utils/estate')
const config = require('../../config')

const MAX = 10 // cards on the home page; the full directory is on the list page

Component({
  data: {
    title: config.language === 'en' ? 'Industrial estates' : '工业园区',
    more: config.language === 'en' ? 'All' : '全部',
    cards: []
  },

  lifetimes: {
    async attached() {
      try {
        const rows = estate.sortByProvince(await estate.list()).slice(0, MAX)
        this.setData({
          cards: rows.map((e) => ({ id: e.id, name: estate.nameOf(e), province: estate.provinceOf(e), image: estate.imageOf(e), logo: estate.logoOf(e) }))
        })
      } catch (err) {
        // the section simply stays hidden when the directory cannot be loaded
      }
    }
  },

  methods: {
    openEstate(e) {
      wx.navigateTo({ url: '/pages/estatedetail/estatedetail?id=' + e.currentTarget.dataset.id })
    },
    openAll() {
      wx.navigateTo({ url: '/pages/estates/estates' })
    }
  }
})
