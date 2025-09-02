// pages/filtersearch/filtersearch.js
const app = getApp();
const config = require("../../config");

Page({
  data: {
    SellType: 1,
    active: 0,
    RecentDisplay: [],
    BookmarkDisplay: [],
    Search_fun: [{
        id: 1,
        icon: 'orders-o',
        name: config.language == "en" ? "Search on Detail" : "按详情搜索",
      },
      {
        id: 2,
        icon: 'flag-o',
        name: config.language == "en" ? "Near Location" : "附近位置",
      },
      {
        id: 3,
        icon: 'location-o',
        name: config.language == "en" ? "Near me" : "距离我 30 公里",
      },
      {
        id: 4,
        icon: 'guide-o',
        name: config.language == "en" ? "Search By province and district" : "按省份和地区搜索",
      },
      {
        id: 5,
        icon: 'search',
        name: config.language == "en" ? "Search #no or Asset Name" : "搜索编号或资产名称",
      },
    ]
  },
  async onLoad() {

  },

  async onShow() {
    const dataRecent = await app.localStorageGet('recentsearch')
    if (dataRecent != "no data search") {
      dataRecent.data = dataRecent.data.slice().reverse()
      this.setData({
        RecentDisplay: dataRecent.data
      })
    }

    const dataBookmark = await app.localStorageGet('Bookmark')
    if (dataBookmark != "no data search") {
      dataBookmark.data = dataBookmark.data.slice().reverse()
      this.setData({
        BookmarkDisplay: dataBookmark.data
      })
    }
  },

  onActiveChange(e) {
    this.setData({
      SellType: e.detail.SellType
    });
  },

  NextToSearch(e) {
    let indexlist = e.currentTarget.dataset.index
    const datalist = this.data.RecentDisplay[indexlist]
    app.MainStackScreen(datalist)
  },

  NextToSearchBookmark(e) {
    let indexlist = e.currentTarget.dataset.index
    const datalist = this.data.BookmarkDisplay[indexlist]
    app.MainStackScreen(datalist)
  },

  btnNextToSearchResult(e) {
    let id = e.currentTarget.dataset.id
    let url = id == 1 ? `/pages/searchdetail/searchdetail?selltype=${this.data.SellType}`
        : id == 2 ? `/pages/nearlocation/nearlocation?selltype=${this.data.SellType}`
        : id == 3 ? `/pages/search/search`
        : id == 4 ? `/pages/province/province?selltype=${this.data.SellType}`
        : id == 5 ? `/pages/seachasset/searchasset`
        : "";
    wx.navigateTo({
      url: url
    })
  },
})