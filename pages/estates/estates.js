// pages/estates/estates.js — industrial estate directory, grouped by province (same order as the website's /industrial page).
const estate = require('../../utils/estate')
const config = require('../../config')

Page({
  data: {
    groups: [], // [{ province, rows: [{ id, name, province, image, logo }] }]
    loaded: false,
    failed: false,
    en: config.language === 'en'
  },

  async onLoad() {
    wx.setNavigationBarTitle({ title: config.language === 'en' ? 'Industrial estates' : '工业园区' })
    try {
      const rows = estate.sortByProvince(await estate.list())
      const groups = []
      rows.forEach((e) => {
        const province = estate.provinceOf(e) || '-'
        let g = groups[groups.length - 1]
        if (!g || g.province !== province) { g = { province, rows: [] }; groups.push(g) }
        g.rows.push({ id: e.id, name: estate.nameOf(e), image: estate.imageOf(e), logo: estate.logoOf(e) })
      })
      this.setData({ groups, loaded: true })
    } catch (err) {
      this.setData({ loaded: true, failed: true })
    }
  },

  openEstate(e) {
    wx.navigateTo({ url: '/pages/estatedetail/estatedetail?id=' + e.currentTarget.dataset.id })
  }
})
