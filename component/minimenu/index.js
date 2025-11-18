// component/minimenu/index.js
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

    menulist: [{
        icon: "../../asset/payment-method.png",
        name: "出售",
        name_en: "Sell",
        url:"/pages/search/search?selltype=1",
      },
      {
        icon: "../../asset/lease.png",
        name: "出租",
        name_en: "Rent",
        url:"/pages/search/search?selltype=2",
      },
      {
        icon: "../../asset/land (1).png",
        name: "土地",
        name_en: "Land",
        url:"/pages/search/search?selltype=0&PropertyType=1",
      },
      {
        icon: "../../asset/warehouse (3).png",
        name: "仓库",
        name_en: "Warehouse",
        url:"/pages/search/search?selltype=0&PropertyType=2",
      },
      {
        icon: "../../asset/factory (4).png",
        name: "工厂",
        name_en: "Factory",
        url:"/pages/search/search?selltype=0&PropertyType=3",
      },
      {
        icon: "../../asset/factory-machine.png",
        name: "工业区内",
        name_en: "IEAT",
        url:"/pages/search/search?selltype=0&IEAT=2",
      },
      {
        icon: "../../asset/packaging.png",
        name: "紫色",
        name_en: "PURPLE ZONE",
        url:"/pages/search/search?selltype=0&Color=1",
      },
      {
        icon: "../../asset/automation.png",
        name: "浅紫色",
        name_en: "LIGHT PURPLE ZONE",
        url:"/pages/search/search?selltype=0&Color=4",
      },
    ]
  },

  /**
   * Component methods
   */
  methods: {
    Goto(e){
      const dataTargetUrl = e.currentTarget.dataset.url
      wx.navigateTo({
        url: dataTargetUrl,
      })
    }
  }
})