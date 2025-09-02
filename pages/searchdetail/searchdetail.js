// pages/searchdetail/searchdetail.js
const app = getApp();
const config = require("../../config")
Page({
  data: {
    selltype: 0,
    PropertyType: 1,
    PropertyTypeName: "Land",
    IEAT: 0,
    IEATText: "All",
    Color: 0,
    ColorText: "All",
    WithBuildingOpen: 1,
    Building: 0,
    show: false,
    LandSizeStart: 0,
    LandSizeEnd: 0,
    PriceStart: 0,
    PriceEnd: 0,
    BuildingStart: 0,
    BuildingEnd: 0,
    language : 'en',
    DataPropType: [
      {id: 1,name: config.language == "en" ? "Land" : "土地"},
      {id: 2,name: config.language == "en" ? "Warehouse" : "仓库"},
      {id: 3,name: config.language == "en" ? "Factory" : "工厂"}
    ],
    DataIEAT: [
      {id: 0,name: config.language == "en" ? "All" : "全部"},
      {id: 2,name: config.language == "en" ? "IEAT" : "工业区内"},
      {id: 1,name: config.language == "en" ? "Non IEAT" : "工业区外"}
    ],
    DataColor: [
        {id: 0,name: config.language == "en" ? "All" : "全部",},
        {id: 1,name: config.language == "en" ? "Purple zone" : "紫色",},
        {id: 2,name: config.language == "en" ? "Yellow zone" : "黄色",},
        {id: 3,name: config.language == "en" ? "Green zone" : "绿色",},
        {id: 4,name: config.language == "en" ? "Light Purple zone" : "浅紫色",},
        {id: 5,name: config.language == "en" ? "Orange zone" : "橙色",},
        {id: 6,name: config.language == "en" ? "Brown zone" : "棕色的",},
        {id: 7,name: config.language == "en" ? "Light Brown zone" : "浅棕色",},
        {id: 8,name: config.language == "en" ? "Red zone" : "红色的",},
        {id: 9,name: config.language == "en" ? "Blue zone" : "蓝色的",},
        {id: 10,name: config.language == "en" ? "Green diagonal zone" : "绿色对角线",},
        {id: 11,name: config.language == "en" ? "Gray zone" : "灰色的",},
        {id: 12,name: config.language == "en" ? "Olive green zone" : "橄榄绿",},
        {id: 13,name: config.language == "en" ? "Pink zone" : "粉色的",}
      ],
      DataOpenBuilding: [
          {name: config.language == "en" ? "Non Building" : "非建筑物"},
          {name: config.language == "en" ? "With Building" : "有建筑物"},
      ]
  },
  async onLoad(options) {
    this.setData({
      selltype: options.selltype,
      language : config.language
    })
  },
  async nextToSearch(e) {
    const selltype = this.data.selltype == 1 ? "buy" : "rent"
    const objpushing = {
      selltype: this.data.selltype,
      selltype_name: selltype,
      PropertyType: this.data.PropertyType,
      PropertyTypeName: this.data.PropertyTypeName,
      IEAT: this.data.IEAT,
      IEATText: this.data.IEATText,
      Color: this.data.Color,
      ColorText: this.data.ColorText,
      Building: this.data.WithBuildingOpen,
      LandSizeStart: this.data.LandSizeStart,
      LandSizeEnd: this.data.LandSizeEnd,
      PriceStart: this.data.PriceStart,
      PriceEnd: this.data.PriceEnd,
      BuildingStart: this.data.BuildingStart,
      BuildingEnd: this.data.BuildingEnd,
      type: "seachondetail"
    }
    app.localStorageSetup('recentsearch', objpushing, 10)
    app.MainStackScreen(objpushing)
  },
  async Bookmark(e) {
    const selltype = this.data.selltype == 1 ? "buy" : "rent"
    const objpushing = {
      selltype: this.data.selltype,
      selltype_name: selltype,
      PropertyType: this.data.PropertyType,
      PropertyTypeName: this.data.PropertyTypeName,
      IEAT: this.data.IEAT,
      IEATText: this.data.IEATText,
      Color: this.data.Color,
      ColorText: this.data.ColorText,
      Building: this.data.WithBuildingOpen,
      LandSizeStart: this.data.LandSizeStart,
      LandSizeEnd: this.data.LandSizeEnd,
      PriceStart: this.data.PriceStart,
      PriceEnd: this.data.PriceEnd,
      BuildingStart: this.data.BuildingStart,
      BuildingEnd: this.data.BuildingEnd,
      type: "seachondetail"
    }
    app.localStorageBookmark('Bookmark', objpushing, 10)
  },
  onInputStart(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      PriceStart: val.toLocaleString('th-TH')
    });
  },
  onInputEnd(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      PriceEnd: val.toLocaleString('th-TH')
    });
  },
  onInputLandStart(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      LandSizeStart: val.toLocaleString('th-TH')
    });
  },
  onInputLandEnd(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      LandSizeEnd: val.toLocaleString('th-TH')
    });
  },
  onInputBuildingStart(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      BuildingStart: val.toLocaleString('th-TH')
    });
  },
  onInputBuildingEnd(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      BuildingEnd: val.toLocaleString('th-TH')
    });
  },
  selectBuildingOpen(e) {
    const dataId = e.target.dataset.id
    this.setData({
      WithBuildingOpen: dataId
    })
  },
  selectProperty(e) {
    const dataId = e.target.dataset.id
    const dataText = e.target.dataset.text
    this.setData({
      PropertyType: dataId,
      PropertyTypeName: dataText
    })
  },
  selectIEAT(e) {
    const dataId = e.target.dataset.id
    const dataText = e.target.dataset.text
    this.setData({
      IEAT: dataId,
      IEATText: dataText
    })
  },
  selectColor(e) {
    const dataId = e.target.dataset.id
    const dataText = e.target.dataset.text
    this.setData({
      Color: dataId,
      ColorText: dataText,
    })
  },

})