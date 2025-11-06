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
      // console.log(this.data.news);
    },
    nexttoguide(){
      wx.navigateTo({
        url: '/pages/guideall/index',
      })
    },
    Goto(e){
      const DataTarget = e.currentTarget.dataset.url
      wx.navigateTo({
        url: DataTarget,
      })
    }
  },

  lifetimes: {
    attached() {
      this.GetData();
    }
  }
})