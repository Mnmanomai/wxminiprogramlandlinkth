// index.js
const app = getApp();
Page({
  data: {
    dataAsset: [],
    show : false,
    // fromChild : false
  },
  gotofilter() {
    wx.navigateTo({
      url: '/pages/filtersearch/filtersearch',
    })
  },

  onReceiveData(e) {
    // console.log('Data from component:', e.detail)
    this.setData({
      show: e.detail.data
    })
    // console.log(this.data.show);
  },
  
  async onLoad() {
    const getAsset = await app.GetLatestAsset();
    this.setData({
      dataAsset: getAsset
    })
  },
})
