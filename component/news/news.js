// component/news/news.js
const app = getApp();
Component({
  properties: {
    
  },
  data: {
    news: [],
  },

  methods: {
    async GetData(){
      const res = await app.GetContent(5,4)
      this.setData({
        news : res
      })
    },
    nexttoguide(){
      wx.navigateTo({
        url: '/pages/guideall/index',
      })
    }
  },

  lifetimes: {
    attached() {
      this.GetData();
    }
  }
})