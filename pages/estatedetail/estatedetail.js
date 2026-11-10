// pages/estatedetail/estatedetail.js — one industrial estate (the website's /industrial/:id page):
// cover + logo, names, location, the info rows that have data, the 10 nearest listings (within 20 km) and the companies inside.
const estate = require('../../utils/estate')
const config = require('../../config')
const app = getApp()

const EN = config.language === 'en'
const RADIUS_KM = 20 // "near the estate" = within 20 km
// [api field, label] — only rows with data are shown (most estates have few details)
const INFO = [
  ['established_year', EN ? 'Established' : '成立年份'],
  ['developer', EN ? 'Developer' : '开发商'],
  ['director_name', EN ? 'Director' : '园区负责人'],
  ['address_detail', EN ? 'Address' : '地址'],
  ['project_area', EN ? 'Project area' : '项目面积'],
  ['available_area', EN ? 'Available area' : '可用面积'],
  ['distance_info', EN ? 'Distances' : '距离信息'],
  ['land_price', EN ? 'Land price' : '土地价格'],
  ['service_rate', EN ? 'Service rate' : '服务费率'],
  ['facilities', EN ? 'Facilities' : '设施'],
  ['electrical_system', EN ? 'Electrical system' : '供电系统'],
  ['target_industries', EN ? 'Target industries' : '目标产业'],
  ['privileges', EN ? 'Privileges' : '优惠政策'],
  ['other_info', EN ? 'Other information' : '其他信息']
]

Page({
  data: {
    en: EN,
    estate: null,        // raw API detail
    view: null,          // { name, otherNames, place, image, logo }
    info: [],            // [{ label, value }]
    companies: [],
    nearby: [],          // up to 10 listings within 20 km, shown with the search card
    failed: false
  },

  async onLoad(options) {
    this.id = options.id
    try {
      const e = await estate.detail(this.id)
      const name = estate.nameOf(e)
      const province = estate.provinceOf(e)
      wx.setNavigationBarTitle({ title: name })
      this.setData({
        estate: e,
        view: {
          name,
          // the other-language names, as a secondary line (helps people who search by another language)
          otherNames: [e.name_th, e.name_en, e.name_cn].filter((n, i, a) => n && n !== name && a.indexOf(n) === i).slice(0, 2),
          place: [e.location_name, province].filter(Boolean).join(', '),
          image: estate.imageOf(e),
          logo: estate.logoOf(e)
        },
        info: INFO.filter((r) => e[r[0]]).map((r) => ({ label: r[1], value: e[r[0]] })),
        companies: e.companies || []
      })
      this.loadNearby(e)
    } catch (err) {
      this.setData({ failed: true })
    }
  },

  // the app's distance search (lat / long / distancemode) around the estate's coordinates, as a true 20 km circle
  async loadNearby(e) {
    if (!e.latitude || !e.longitude) return
    const rows = await app.GetAsset({ selltype: '', limit: 10, offset: 0, lat: e.latitude, long: e.longitude, distancemode: 1, radius: RADIUS_KM })
    if (Array.isArray(rows)) this.setData({ nearby: rows })
  },

  viewAllNearby() {
    const e = this.data.estate
    wx.navigateTo({ url: `/pages/search/search?selltype=&lat=${e.latitude}&long=${e.longitude}&distancemode=1&radius=${RADIUS_KM}&label=${encodeURIComponent((EN ? 'Near ' : '靠近 ') + this.data.view.name)}` })
  }
})
