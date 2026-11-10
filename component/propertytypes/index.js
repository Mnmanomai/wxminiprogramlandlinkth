// component/propertytypes/index.js — four entry cards under the IEAT section (one row): New release · Land · Warehouse · Factory.
// Tapping one opens the search list: New release = the 20 newest listings (search page option latest=20, newest first, no paging); the others filter
// by type_asset 1 land / 2 warehouse / 3 factory (sale mode).
const app = getApp()
const config = require('../../config')

Component({
  data: {
    types: config.language === 'en' ? [
      { id: 'new', image: '/asset/newrelease.jpg', title: 'New release', sub: 'Freshly listed' },
      { id: 1, image: '/asset/land.png', title: 'Land', sub: 'Build it your way' },
      { id: 2, image: '/asset/warehouse.png', title: 'Warehouse', sub: 'Ready to store & ship' },
      { id: 3, image: '/asset/factory.png', title: 'Factory', sub: 'Ready to produce' }
    ] : [
      { id: 'new', image: '/asset/newrelease.jpg', title: '最新发布', sub: '新鲜上架' },
      { id: 1, image: '/asset/land.png', title: '土地', sub: '按需打造' },
      { id: 2, image: '/asset/warehouse.png', title: '仓库', sub: '即租即用' },
      { id: 3, image: '/asset/factory.png', title: '工厂', sub: '即刻投产' }
    ]
  },

  methods: {
    openType(e) {
      const id = e.currentTarget.dataset.id
      if (id === 'new') {
        // New release: the 20 newest listings (sale and rent), no paging
        wx.navigateTo({ url: '/pages/search/search?selltype=&latest=20' })
        return
      }
      app.MainStackScreen({ selltype: '1', PropertyType: id })
    }
  }
})
