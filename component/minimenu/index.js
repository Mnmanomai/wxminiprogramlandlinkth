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
        icon: "../../asset/payment.png",
        name: "出售",
        name_en: "Sell",
        url:"/pages/search/search?selltype=1",
      },
      {
        icon: "../../asset/deal.png",
        name: "出租",
        name_en: "Rent",
        url:"/pages/search/search?selltype=2",
      },
      {
        icon: "../../asset/zone.png",
        name: "土地",
        name_en: "Land",
        url:"/pages/search/search?selltype=0&PropertyType=1",
      },
      {
        icon: "../../asset/warehouse.png",
        name: "仓库",
        name_en: "Warehouse",
        url:"/pages/search/search?selltype=0&PropertyType=2",
      },
      {
        icon: "../../asset/factory.png",
        name: "工厂",
        name_en: "Factory",
        url:"/pages/search/search?selltype=0&PropertyType=3",
      },
      {
        icon: "../../asset/supplier.png",
        name: "工业区内",
        name_en: "IEAT",
        url:"/pages/search/search?selltype=0&IEAT=2",
      },
      {
        icon: "../../asset/factory_7927838.png",
        name: "紫色",
        name_en: "PURPLE ZONE",
        url:"/pages/search/search?selltype=0&Color=1",
      },
      {
        icon: "../../asset/boxes_1413861.png",
        name: "浅紫色",
        name_en: "LIGHT PURPLE ZONE",
        url:"/pages/search/search?selltype=0&Color=4",
      },
      // {icon : "../../asset/location-pin_1599834.png",name :"工业区外", name_en:"NONIEAT"},
      // {icon : "../../asset/",name :"春武里府", name_en:"Chonburi"},
      // {icon : "../../asset/",name :"罗勇府", name_en:"Rayong"},
      // {icon : "../../asset/",name :"北柳府", name_en:"Chachoengsao"},
    ]
  },

  /**
   * Component methods
   */
  methods: {

  }
})