// pages/assetmap/assetmap.js — where the listings are: pins on a map.
// - The pins of the visible area come from GET /legacy/miniprogram/mappoints (newest first, capped) every time the map stops moving;
//   it takes the same filters as the list search.
// - Top bar like the search page: an input with auto-complete (province / district = filter the pins, estate = fly there, listing =
//   open it) and the filter button (the same filter page as search).
// - Tap a pin: a vertical list of cards for it and its nearest neighbours in the bottom sheet; tap a card to fly to its pin (the focused
//   pin turns red), its button opens the listing. The sheet can be dragged up / down (the map shrinks / grows), up to 70% of the screen.
const config = require('../../config')
const zones = require('../../utils/zones')
const estate = require('../../utils/estate')
const app = getApp()

const EN = config.language === 'en'
const money = (n, rent) => {
  const v = Number(n) || 0
  const t = v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : v >= 1e3 ? Math.round(v / 1e3) + 'K' : String(v)
  return '฿' + t + (rent ? (EN ? '/mo' : '/月') : '')
}
// pin picture per property type (the marker needs an iconPath, otherwise only its price label is drawn); the focused pin is red
const PIN = { 1: '/asset/pin-land.png', 2: '/asset/pin-warehouse.png', 3: '/asset/pin-factory.png' }
const PIN_ACTIVE = '/asset/pin-active.png'
const TYPE = { 1: EN ? 'Land' : '土地', 2: EN ? 'Warehouse' : '仓库', 3: EN ? 'Factory' : '工厂' }

Page({
  data: {
    // opens on the Eastern Seaboard, where most listings are; the first load fills the pins
    latitude: 13.1,
    longitude: 101.2,
    scale: 9,
    markers: [],
    count: 0,
    loading: false,
    topbarHeight: 60,
    mapHeight: 400, // px: the screen minus the top bar and the bottom sheet (set in onLoad / while dragging)
    panelHeight: 120, // px: the bottom sheet, between stops.min and 70% of the screen
    cards: [], // the tapped pin first, then its nearest neighbours: { id, name, price, type, image, colorName, swatch } (image / colour arrive a moment later)
    current: 0, // the focused card (its pin is the red one)
    scrollInto: '', // id of the card to scroll to
    keywordInput: '', // text in the top input
    suggestions: [], // auto-complete rows
    showSuggest: false,
    // same shape as the search page's searchvalue: this is what the filter page reads and returns
    filterdata: {
      selltype: '', assettype: 0, order: 0, province: '', district: '', lat: '', long: '', distancemode: 0,
      PropertyType: '', IEAT: '', Color: '', LandSizeStart: 0, LandSizeEnd: 0, PriceStart: 0, PriceEnd: 0, BuildingStart: 0, BuildingEnd: 0, Building: ''
    },
    en: EN
  },

  pins: {}, // asset id -> pin, to build the bottom cards
  pinIndex: {}, // asset id -> index in data.markers
  curId: 0, // the pin whose card is showing (red and bigger)
  quietUntil: 0, // region changes caused by our own moves are ignored until then

  onLoad(options) {
    this.setData({
      'filterdata.selltype': options.selltype || '',
      'filterdata.PropertyType': options.PropertyType || '',
      'filterdata.IEAT': options.IEAT || ''
    })
    this.mapCtx = wx.createMapContext('map', this)
    // top bar, map and bottom sheet are stacked (the map is native: nothing can be laid over it). The sheet is dragged between
    // a collapsed height and 70% of the screen; the map takes the rest.
    const sys = wx.getSystemInfoSync()
    const inset = sys.safeArea ? Math.max(0, sys.screenHeight - sys.safeArea.bottom) : 0
    this.win = sys.windowHeight
    const min = 100 + inset
    const max = Math.max(min + 60, Math.floor(sys.windowHeight * 0.7)) // the sheet can go up to 70% of the screen
    this.stops = { min, mid: Math.round((min + max) / 2), max }
    this.setPanel(min)
  },

  // resize the sheet; the map gets the remaining height
  setPanel(h) {
    const panelHeight = Math.max(this.stops.min, Math.min(this.stops.max, Math.round(h)))
    this.setData({ panelHeight, mapHeight: this.win - this.data.topbarHeight - panelHeight })
  },

  // dragging the sheet by its header: follows the finger, snaps to the nearest of collapsed / middle / 70% on release
  onDragStart(e) {
    this.drag = { y: e.touches[0].clientY, h: this.data.panelHeight }
  },

  onDragMove(e) {
    if (!this.drag) return
    this.setPanel(this.drag.h + (this.drag.y - e.touches[0].clientY))
  },

  onDragEnd() {
    if (!this.drag) return
    this.drag = null
    const s = this.stops
    const h = this.data.panelHeight
    this.setPanel([s.min, s.mid, s.max].reduce((best, x) => (Math.abs(x - h) < Math.abs(best - h) ? x : best)))
  },

  // ---------------------------------------------------------------- pins
  // the map finished drawing (first time, or after a programmatic move)
  onUpdated() {
    if (!this.first) { this.first = true; this.loadVisible() }
  },

  // the user stopped dragging / zooming
  onRegionChange(e) {
    if (e.type === 'end' && Date.now() > this.quietUntil) this.loadVisible()
  },

  // every filter of the page as the API's query (same names as the list search)
  filterQuery() {
    const f = this.data.filterdata
    const color = Array.isArray(f.Color) ? f.Color.join(',') : String(f.Color || '')
    return {
      SELLTYPE: f.selltype || 0, PROPTYPE: f.PropertyType || '', IEAT: f.IEAT || '', COLOR: color === '0' ? '' : color,
      PROVINCE: f.province || '', DISTRICT: f.district || '',
      LANDSTART: f.LandSizeStart || '', LANDEND: f.LandSizeEnd || '', PRICESTART: f.PriceStart || '', PRICEEND: f.PriceEnd || '',
      WHSTART: f.BuildingStart || '', WHEND: f.BuildingEnd || ''
    }
  },

  // a place filter (province / district) is shown whole: no map bounds, then the map flies to the pins
  loadVisible() {
    if (this.data.loading) return
    if (this.data.filterdata.province || this.data.filterdata.district) return this.fetchPins(null, true)
    this.mapCtx.getRegion({
      success: (r) => this.fetchPins(r, false),
      fail: () => this.fetchPins(null, false)
    })
  },

  fetchPins(region, fit) {
    const data = Object.assign({ LIMIT: 400 }, this.filterQuery())
    if (region) {
      data.MINLAT = region.southwest.latitude
      data.MAXLAT = region.northeast.latitude
      data.MINLNG = region.southwest.longitude
      data.MAXLNG = region.northeast.longitude
    }
    this.setData({ loading: true })
    wx.request({
      url: config.PublicIPCallApiGoBackend + '/legacy/miniprogram/mappoints',
      method: 'GET',
      data,
      success: (res) => {
        // listings the user hid (HiddenList) are not shown on the map either
        const hidden = app.getHiddenIds()
        const rows = ((res.data && res.data.response) || []).filter((p) => !hidden[Number(p.id)])
        this.pins = {}
        this.pinIndex = {}
        // price labels always on while the map is not crowded, otherwise only on tap
        const always = rows.length <= 60
        const markers = rows.map((p, i) => {
          this.pins[p.id] = p
          this.pinIndex[p.id] = i
          const cur = p.id === this.curId
          return {
            id: p.id, latitude: p.lat, longitude: p.lng, iconPath: cur ? PIN_ACTIVE : (PIN[p.type_asset] || PIN[1]), width: cur ? 36 : 26, height: cur ? 44 : 32,
            callout: { content: money(p.price, p.rent), display: always || cur ? 'ALWAYS' : 'BYCLICK', fontSize: 11, color: '#334155', bgColor: '#ffffff', padding: 4, borderRadius: 6, borderWidth: 1, borderColor: '#94a3b8' }
          }
        })
        this.setData({ markers, count: rows.length })
        if (fit && rows.length) {
          this.quietUntil = Date.now() + 1500
          this.mapCtx.includePoints({ points: rows.map((p) => ({ latitude: p.lat, longitude: p.lng })), padding: [40, 40, 40, 40] })
        }
      },
      complete: () => this.setData({ loading: false })
    })
  },

  // ---------------------------------------------------------------- cards
  // distance in km between two pins (flat-earth is fine at this scale)
  km(a, b) {
    const dy = (a.lat - b.lat) * 111.32
    const dx = (a.lng - b.lng) * 111.32 * Math.cos(a.lat * Math.PI / 180)
    return Math.sqrt(dx * dx + dy * dy)
  },

  // tap a pin: cards open for it and its 9 nearest neighbours (swipe sideways to step through them); the photos and zone
  // colours are filled in a moment later with one request for all of them
  async onMarkerTap(e) {
    const p = this.pins[e.detail.markerId]
    if (!p) return
    const near = Object.keys(this.pins).map((k) => this.pins[k]).filter((q) => q.id !== p.id)
      .sort((a, b) => this.km(p, a) - this.km(p, b)).slice(0, 9)
    const list = [p].concat(near)
    this.setCurrentPin(p.id)
    if (this.data.panelHeight < this.stops.mid) this.setPanel(this.stops.mid) // make room for the list
    this.setData({
      current: 0,
      scrollInto: '',
      cards: list.map((q) => ({ id: q.id, name: q.name, price: money(q.price, q.rent), type: TYPE[q.type_asset] || '', image: '', colorName: '', swatch: '' }))
    })
    const ids = list.map((q) => q.id)
    const rows = await app.GetAsset({ selltype: 0, limit: 10, offset: 0, multilist: ids.join(',') })
    if (!Array.isArray(rows) || !this.data.cards.length || this.data.cards[0].id !== p.id) return // the answer is for an older tap
    const upd = {}
    this.data.cards.forEach((c, i) => {
      const a = rows.find((r) => r._id === c.id)
      if (!a) return
      upd['cards[' + i + '].image'] = a.no_images_asset || ''
      upd['cards[' + i + '].colorName'] = a.ColorOfLand || ''
      upd['cards[' + i + '].swatch'] = zones.swatch(a.OriginalColor)
    })
    this.setData(upd)
  },

  // the focused pin is red and bigger (with its price label always on); the one that had the focus goes back to its type's pin
  setCurrentPin(id) {
    const upd = {}
    const set = (pid, cur) => {
      const i = this.pinIndex[pid]
      if (i === undefined) return
      upd['markers[' + i + '].iconPath'] = cur ? PIN_ACTIVE : (PIN[this.pins[pid].type_asset] || PIN[1])
      upd['markers[' + i + '].width'] = cur ? 36 : 26
      upd['markers[' + i + '].height'] = cur ? 44 : 32
      upd['markers[' + i + '].callout.display'] = cur || this.data.markers.length <= 60 ? 'ALWAYS' : 'BYCLICK'
    }
    if (this.curId) set(this.curId, false)
    this.curId = id
    if (id) set(id, true)
    this.setData(upd)
  },

  // tap a card: its pin becomes the red one and the map flies to it (the card's own button is what opens the listing)
  onCardTap(e) {
    const id = Number(e.currentTarget.dataset.id)
    const i = this.data.cards.findIndex((c) => c.id === id)
    const p = this.pins[id]
    if (i < 0) return
    this.setData({ current: i })
    if (!p) return
    this.setCurrentPin(p.id)
    this.quietUntil = Date.now() + 800 // moving the map ourselves must not reload (and reshuffle) the pins
    this.setData({ latitude: p.lat, longitude: p.lng })
  },

  openAsset(e) {
    wx.navigateTo({ url: '/pages/assetdetail/assetdetail?id=' + e.currentTarget.dataset.id })
  },

  // tap on the empty map: hide the cards and the focus
  onMapTap() {
    if (this.data.cards.length) {
      this.setCurrentPin(0)
      this.setData({ cards: [], current: 0 })
      this.setPanel(this.stops.min) // nothing to list: fold the sheet away
    }
  },

  // ---------------------------------------------------------------- top bar: auto-complete + filter
  onKeywordInput(e) {
    const text = e.detail.value
    this.setData({ keywordInput: text })
    clearTimeout(this.suggestTimer)
    if (!text.trim()) return this.setData({ suggestions: [], showSuggest: false })
    this.suggestTimer = setTimeout(() => this.loadSuggestions(text.trim()), 250)
  },

  onKeywordFocus() {
    if (this.data.suggestions.length > 0) this.setData({ showSuggest: true })
  },

  // ✕: forget the place filter and look at the visible area again
  clearKeyword() {
    clearTimeout(this.suggestTimer)
    const had = this.data.filterdata.province || this.data.filterdata.district
    this.setData({ keywordInput: '', suggestions: [], showSuggest: false, 'filterdata.province': '', 'filterdata.district': '' })
    if (had) this.loadVisible()
  },

  async loadSuggestions(text) {
    const lang = EN ? 'en' : (config.language === 'zh' ? 'zh' : 'th')
    const d = await app.GetAutocomplete(text)
    if (!d || text !== this.data.keywordInput.trim()) return // an older answer
    const name = (x) => x['name_' + lang] || x.name_th
    const badge = { province: EN ? 'Province' : '省', district: EN ? 'District' : '区', industrial: EN ? 'Estate' : '工业区', asset: EN ? 'Listing' : '房源' }
    const rows = []
    ;(d.province || []).forEach((x) => rows.push({ type: 'province', id: x.id, text: name(x) }))
    ;(d.district || []).forEach((x) => rows.push({ type: 'district', id: x.id, text: name(x), sub: x['province_' + lang] || x.province_th }))
    ;(d.industrial || []).forEach((x) => rows.push({ type: 'industrial', id: x.id, text: name(x) }))
    ;(d.asset || []).forEach((x) => rows.push({ type: 'asset', id: x.id, text: x.name }))
    this.setData({
      suggestions: rows.map((r, i) => Object.assign({ key: r.type + r.id + '_' + i, badge: badge[r.type] }, r)),
      showSuggest: rows.length > 0
    })
  },

  // province / district: filter the pins by place (the map then flies to them) · estate: fly to it · listing: open it
  async pickSuggestion(e) {
    const r = this.data.suggestions[e.currentTarget.dataset.i]
    this.setData({ showSuggest: false, keywordInput: r.text })
    if (r.type === 'asset') return wx.navigateTo({ url: '/pages/assetdetail/assetdetail?id=' + r.id })
    if (r.type === 'industrial') {
      this.setData({ 'filterdata.province': '', 'filterdata.district': '' })
      try {
        const e2 = (await estate.list()).find((x) => x.id === r.id)
        if (e2 && e2.latitude && e2.longitude) {
          this.quietUntil = 0
          return this.setData({ latitude: Number(e2.latitude), longitude: Number(e2.longitude), scale: 13 })
        }
      } catch (err) { /* no coordinates: stay where we are */ }
      return
    }
    this.setData({
      'filterdata.province': r.type === 'province' ? r.id : '',
      'filterdata.district': r.type === 'district' ? r.id : ''
    })
    this.loadVisible()
  },

  // the filter button: the same filter page as the search page; what it returns replaces the page's filters
  openFilter() {
    wx.navigateTo({
      url: '/pages/searchdetail/searchdetail',
      success: (res) => {
        res.eventChannel.emit('openfilterdata', this.data.filterdata)
        res.eventChannel.on('returnfilterdata', (data) => {
          const f = data.success
          if (Array.isArray(f.Color)) f.Color = f.Color.join(',')
          this.setData({ filterdata: f })
          this.setCurrentPin(0)
          this.setData({ cards: [], current: 0 })
          this.setPanel(this.stops.min)
          this.loadVisible()
        })
      }
    })
  },

  // a tap on the suggestion list's empty space / the list itself must not reach anything behind it
  noop() {}
})
