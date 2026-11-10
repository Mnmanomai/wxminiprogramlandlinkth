const config = require("../../config");

// component/filternsortsearch/index.js

Component({

  /**
   * Component properties
   */
  properties: {
    inline: { // true = compact icon buttons without the full-width fixed bar
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    show: false,
    current: 1, // the chosen sort value; 1 = newest first (the search default)
    title: config.language == "en" ? "Sort by" : "排序方式",
    // value = the backend's ORDER number (1 newest · 2/3 price · 4/5 price per sq.wah · 6/7 area)
    options: [
      { value: 1, icon: "clock-o", name: config.language == "en" ? "Newest" : "最新发布", sub: config.language == "en" ? "Recently listed first" : "最近发布优先" },
      { value: 2, icon: "gold-coin-o", name: config.language == "en" ? "Price" : "价格", sub: config.language == "en" ? "Low to high" : "低到高" },
      { value: 3, icon: "gold-coin-o", name: config.language == "en" ? "Price" : "价格", sub: config.language == "en" ? "High to low" : "高到低" },
      { value: 5, icon: "balance-o", name: config.language == "en" ? "Price per sq.wah" : "每平方哇价", sub: config.language == "en" ? "Low to high" : "低到高" },
      { value: 4, icon: "balance-o", name: config.language == "en" ? "Price per sq.wah" : "每平方哇价", sub: config.language == "en" ? "High to low" : "高到低" },
      { value: 7, icon: "expand-o", name: config.language == "en" ? "Area" : "面积", sub: config.language == "en" ? "Small to large" : "小到大" },
      { value: 6, icon: "expand-o", name: config.language == "en" ? "Area" : "面积", sub: config.language == "en" ? "Large to small" : "大到小" }
    ]
  },

  /**
   * Component methods
   */
  methods: {
    noop() {}, // swallows taps inside the sheet so they do not reach the backdrop (an empty handler name is not reliable)

    onShowActionSheet() {
      this.setData({
        show: true
      });
      // this.setDataAction();
    },

    onClose() {
      this.setData({
        show: false
      });
    },

    onSelect(event) {
      const value = Number(event.currentTarget.dataset.value)
      this.setData({ current: value, show: false })
      this.triggerEvent('senddata', {
        order: value
      });
    },

    goToFilter() {
      this.triggerEvent('lunchfilter',{
        lunch:true
      })
    },
  }
})