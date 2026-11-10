const config = require('../../config')
// components/cardListAsset/cardListAsset.js
Component({

  /**
   * Component properties
   */
  properties: {
    // '' = no hide icon · 'hide' = an eye icon next to the heart that hides the listing from now on · 'restore' = brings a hidden one back
    hideMode: { type: String, value: '' },
    list: { //รายการ
      type: Array,
      value: []
    }
  },

  /**
   * Component initial data
   */
  data: {
    language: config.language,
    cur: {}, // current photo index per card id
    contactShow: false, // the contact popup
    contactCtx: {}, // the listing the popup was opened for
    liked: {} // asset id -> true, from the same storage the detail page's heart uses (FlavoriteList = [{id}])
  },

  /**
   * Component methods
   */
  lifetimes: {
    attached() { this.loadLiked() }
  },
  pageLifetimes: {
    show() { this.loadLiked() } // the heart may have been toggled on the detail page
  },

  methods: {
    // the headset button: contact popup (chat + all Landlink numbers) for this listing
    openContact(e) {
      const id = Number(e.currentTarget.dataset.id)
      const a = (this.data.list || []).find((r) => Number(r._id) === id) || {}
      this.setData({
        contactShow: true,
        contactCtx: { from: 'asset:' + id, title: '#' + id + ' ' + (a.NameAsset || ''), path: '/pages/assetdetail/assetdetail?id=' + id, img: a.no_images_asset || '' }
      })
    },

    closeContact() {
      this.setData({ contactShow: false })
    },

    // hide icon: 'hide' list = the listing is hidden from now on (storage HiddenList: search, home, map) and leaves this list at once;
    // 'restore' list (Favourites › Hidden) = brings it back
    toggleHide(e) {
      const id = Number(e.currentTarget.dataset.id)
      const app = getApp()
      const en = config.language === 'en'
      const hide = this.data.hideMode === 'hide'
      hide ? app.hideAsset(id) : app.unhideAsset(id)
      wx.showToast({ title: hide ? (en ? 'Hidden — see Favourites › Hidden' : '已隐藏，可在 收藏 › 已隐藏 中恢复') : (en ? 'Restored' : '已恢复'), icon: 'none' })
      this.triggerEvent('hidechange', { id, hidden: hide })
    },

    loadLiked() {
      const that = this
      wx.getStorage({
        key: 'FlavoriteList',
        success(res) {
          const liked = {}
          ;(res.data || []).forEach(v => { liked[Number(v.id)] = true })
          that.setData({ liked })
        },
        fail() { that.setData({ liked: {} }) }
      })
    },

    // same storage + shape as assetdetail's likefunc, so both stay in sync
    toggleLike(e) {
      const id = Number(e.currentTarget.dataset.id)
      const that = this
      wx.getStorage({
        key: 'FlavoriteList',
        success(res) { that.saveLike(id, res.data || []) },
        fail() { that.saveLike(id, []) }
      })
    },

    saveLike(id, list) {
      const index = list.findIndex(v => Number(v.id) === id)
      if (index !== -1) {
        list.splice(index, 1)
        wx.showToast({ title: '删除', icon: 'none' })
      } else {
        list.push({ id })
        wx.showToast({ title: '添加成功', icon: 'success' })
      }
      wx.setStorage({ key: 'FlavoriteList', data: list })
      this.setData({ ['liked.' + id]: index === -1 })
    },

    onSwipe(e) {
      this.setData({ ['cur.' + e.currentTarget.dataset.id]: e.detail.current })
    },

    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${id}`
      });
    },
  }
})