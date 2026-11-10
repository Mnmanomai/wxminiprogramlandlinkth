// component/mapsection/index.js — home page "Map" section: one tappable card that opens the listing map.
const config = require('../../config')

Component({
  data: {
    title: config.language === 'en' ? 'Map' : '地图找房',
    text: config.language === 'en' ? 'See where the listings are' : '在地图上查看房源位置',
    go: config.language === 'en' ? 'Open map' : '打开地图'
  },

  methods: {
    openMap() {
      wx.navigateTo({ url: '/pages/assetmap/assetmap' })
    }
  }
})
