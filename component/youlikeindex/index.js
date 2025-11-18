// component/youlikeindex/index.js
const config = require("../../config");
const app = getApp();
Component({

  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    listfev: [],
    MainDataFev: [],
  },

  /**
   * Component methods
   */
  methods: {
    gotodetail(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/assetdetail/assetdetail?id=${id}`,
      })
    },
    async getFuncFev() {
      const Fladata = await app.localStorageGet('FlavoriteList');
      let data = Fladata.data || []
      if (data.length > 0) {
        data = data.map(val => val.id).join(',')
        const res = await this.loadData(data);
        this.setData({
          MainDataFev: res
        })
      }
    },
    async loadData(typeList) {
      const that = this;
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${config.apiBaseUrl}/api/miniprogramapi/search.php?LANGUAGE=${config.language}&MULTILIST=${typeList}`,
          method: 'GET',
          success(res) {
            const rawData = res.data.response;
            if (rawData) {
              const newData = rawData;
              const process = newData.map(item => {
                const price = item.typeassetn === "1" ?
                  (item.LandSizeRai * 400) + (item.LandSizeNgan * 100) + item.LandSizeSQW + " 平方米" :
                  item.WHSizeSQM + " 平方米";
                return {
                  ...item,
                  price
                };
              });
              resolve(process);
            }
          },
          fail(err) {
            resolve('process');
          },
        });
      })
    },
  },

  lifetimes: {
    attached() {
      this.getFuncFev();
    }
  },
  pageLifetimes: {
    show() {
      this.getFuncFev();
    }
  },
})