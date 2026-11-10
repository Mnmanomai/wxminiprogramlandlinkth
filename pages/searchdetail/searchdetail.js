// pages/searchdetail/searchdetail.js
const app = getApp();
const config = require("../../config");
// [id, English name, Chinese name, swatch CSS, meaning (en), meaning (zh)] — in display order: purple, purple striped, yellow, orange, green, then the others
const ZONES = [
  [1, "Purple zone", "紫色", "#800080", "Industrial and warehouse area", "工业及仓储用地"],
  [4, "Purple striped zone", "紫色条纹", "repeating-linear-gradient(45deg, #800080, #800080 4px, #ffffff 4px, #ffffff 8px)", "Specific-purpose industry and warehouse area", "特定用途工业及仓储用地"],
  [2, "Yellow zone", "黄色", "#FFFF00", "Low-density residential area", "低密度住宅用地"],
  [5, "Orange zone", "橙色", "#FFA500", "Medium-density residential area", "中密度住宅用地"],
  [3, "Green zone", "绿色", "#2E8B57", "Rural and agricultural area", "乡村及农业用地"],
  [10, "Green diagonal zone", "绿色对角线", "repeating-linear-gradient(45deg, #008000, #008000 4px, #ffffff 4px, #ffffff 8px)", "Agricultural conservation area", "农业保护用地"],
  [6, "Brown zone", "棕色", "#8B4513", "High-density residential area", "高密度住宅用地"],
  [7, "Light Brown zone", "浅棕色", "#D2B48C", "High-density residential area (transitional zone)", "高密度住宅用地（过渡区）"],
  [8, "Red zone", "红色", "#DC143C", "Commercial area", "商业用地"],
  [9, "Blue zone", "蓝色", "#0000FF", "Government institutions and public utilities", "政府机构及公共设施用地"],
  [11, "Gray zone", "灰色", "#696969", "Religious institution area", "宗教机构用地"],
  [12, "Olive green zone", "橄榄绿", "#808000", "Government, education or military institution area", "政府、教育或军事机构用地"],
  [13, "Pink zone", "粉色", "#FFC0CB", "Open space for recreation and environmental conservation", "休闲及环境保护开放空间用地"]
]
// const {filter} = require("../internaldata/place");
Page({
  data: {

    filterdata: {
      selltype: 0,
      assettype: 0,
      order: 0,
      province: 0,
      district: 0,
      lat: '',
      long: '',
      distancemode: 0,
      PropertyType: '',
      IEAT: 0,
      IEATtext: 'All',
      Color: '',
      LandSizeStart: 0,
      LandSizeEnd: 0,
      PriceStart: 0,
      PriceEnd: 0,
      BuildingStart: '',
      BuildingEnd: '',
      Building: '',
    },
    language: 'zh',
    showZoneInfo: false, // popup explaining each land colour
    sellSel: {}, // buy (1) / rent (2): either or both; both or none = no filter
    ieatSel: {}, // inside IEAT (2) / outside (1): either or both; both or none = no filter
    typeSel: {}, // property type id -> true when selected (several can be on at once)
    // which filter sections are expanded (tap a section title to slide it open / shut)
    open: { sell: true, type: true, ieat: true, color: true, price: true, land: true, building: true, bsize: true },
    DataSellnrent: [{
        id: 1,
        name: config.language == "en" ? "Buy" : "购买"
      },
      {
        id: 2,
        name: config.language == "en" ? "Rent" : "租赁"
      },
    ],
    DataPropType: [{
        id: 1,
        name: config.language == "en" ? "Land" : "土地",
        image: "/asset/land.png"
      },
      {
        id: 2,
        name: config.language == "en" ? "Warehouse" : "仓库",
        image: "/asset/warehouse.png"
      },
      {
        id: 3,
        name: config.language == "en" ? "Factory" : "工厂",
        image: "/asset/factory.png"
      }
    ],
    DataIEAT: [{
        id: '2',
        name: config.language == "en" ? "IEAT" : "工业区内"
      },
      {
        id: '1',
        name: config.language == "en" ? "Non IEAT" : "工业区外"
      }
    ],
    // land colour = the area's city-plan zone: swatch + what the zone is for (wording from the website's "zone meaning" texts)
    DataColor: ZONES.map(function (z) {
      return {
        id: String(z[0]),
        name: config.language == "en" ? z[1] : z[2],
        bg: z[3],
        meaning: config.language == "en" ? z[4] : z[5],
        select: false
      }
    }),
    DataOpenBuilding: [{
        id: '0',
        name: config.language == "en" ? "Non Building" : "非建筑物"
      },
      {
        id: '1',
        name: config.language == "en" ? "With Building" : "有建筑物"
      },
    ]
  },
  // swallows taps inside a popup so they do not reach its backdrop (an empty handler name is not reliable)
  noop() {},

  async onLoad(options) {
    const eventChaneel = this.getOpenerEventChannel();
    let Color_receiver = ''
    eventChaneel.on('openfilterdata', (data) => {


      this.setData({
        filterdata: data,
        language: config.language,
      })

      // this.setData({
      //   'filterdata.WithBuildingOpen': '0',
      // })

      // PropertyType arrives as '', 0 or a comma list such as "1,3"
      const typeSel = {}
      String(data.PropertyType || '').split(',').forEach((v) => { if (v && v !== '0') typeSel[v] = true })
      this.setData({ typeSel })
      // selltype / IEAT arrive as '', 0, '1' or '2' (0 / '' = no filter = nothing selected)
      const sellSel = {}
      const ieatSel = {}
      String(data.selltype || '').split(',').forEach((v) => { if (v === '1' || v === '2') sellSel[v] = true })
      String(data.IEAT || '').split(',').forEach((v) => { if (v === '1' || v === '2') ieatSel[v] = true })
      this.setData({ sellSel, ieatSel })

      Color_receiver = data.Color
      if (Color_receiver != '') {
        Color_receiver = String(Color_receiver).split(","); // may arrive as an array (selectColor stores one) or a "1,2" string

        let DataColor = this.data.DataColor;

        DataColor = DataColor.map(item => {
          if (Color_receiver.includes(item.id)) {
            item.select = true;
          } else {
            item.select = false;
          }
          return item;
        });

        this.setData({
          DataColor
        });
      } else {
        this.setData({
          'filterdata.Color': "0",
        })
      }
      if (this.data.filterdata.IEAT == "") {
        this.setData({
          'filterdata.IEAT': 0,
          'filterdata.IEATtext': 'All',
        })
      }
    })

  },

  async BacktoSearch() {

    let landsizestart = this.data.filterdata.LandSizeStart ? this.data.filterdata.LandSizeStart : "0";
    let landsizeend = this.data.filterdata.LandSizeEnd ? this.data.filterdata.LandSizeEnd : "0";
    let pricestart = this.data.filterdata.PriceStart ? this.data.filterdata.PriceStart : "0";
    let priceend = this.data.filterdata.PriceEnd ? this.data.filterdata.PriceEnd : "0";
    let buildingstart = this.data.filterdata.BuildingStart ? this.data.filterdata.BuildingStart : "0";
    let buildingend = this.data.filterdata.BuildingEnd ? this.data.filterdata.BuildingEnd : "0";

    let intlandsizestart = landsizestart ? parseFloat(landsizestart) : 0;
    let intlandsizeend = landsizeend ? parseFloat(landsizeend) : 0;
    let intpricestart = pricestart ? parseFloat(pricestart) : 0;
    let intpriceend = priceend ? parseFloat(priceend) : 0;
    let intbuildingstart = buildingstart ? parseFloat(buildingstart) : 0;
    let intbuildingend = buildingend ? parseFloat(buildingend) : 0;

    if (intlandsizestart > intlandsizeend && intlandsizeend != 0) {
      
      wx.showToast({
        title: "价格格式无效",
        icon: "error",
        duration: 1200
      })
      return;
    }
    if (intpricestart > intpriceend && intpriceend != 0) {
      wx.showToast({
        title: "土地面积格式无效",
        icon: "error",
        duration: 1200
      })
      return;
    }
    if (intbuildingstart > intbuildingend && intbuildingend != 0) {
      wx.showToast({
        title: "建筑面积格式无效",
        icon: "error",
        duration: 1200
      })
      return;
    }
    if (this.data.filterdata.DataOpenBuilding == 0) {
      this.setData({
        'filterdata.BuildingStart': 0,
        'filterdata.BuildingEnd': 0,
      })
    }

    this.setData({
      'filterdata.LandSizeStart': landsizestart ? landsizestart : "0",
      'filterdata.LandSizeEnd': landsizeend ? landsizeend : "0",
      'filterdata.PriceStart': pricestart ? pricestart : "0",
      'filterdata.PriceEnd': priceend ? priceend : "0",
      'filterdata.BuildingStart': buildingstart ? buildingstart : "0",
      'filterdata.BuildingEnd': buildingend ? buildingend : "0",
    })

    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('returnfilterdata', {
      success: this.data.filterdata
    });
    wx.navigateBack({
      delta: 1 // delta = 1 คือกลับ 1 หน้า
    });
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
      'filterdata.PriceStart': val.toLocaleString('th-TH')
    });
  },
  onInputEnd(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      'filterdata.PriceEnd': val.toLocaleString('th-TH')
    });
  },
  onInputLandStart(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      'filterdata.LandSizeStart': val.toLocaleString('th-TH')
    });
  },
  onInputLandEnd(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      'filterdata.LandSizeEnd': val.toLocaleString('th-TH')
    });
  },
  onInputBuildingStart(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      'filterdata.BuildingStart': val.toLocaleString('th-TH')
    });
  },
  onInputBuildingEnd(e) {
    let val = e.detail.value
    val = val.replace(/,/g, "")
    val = parseInt(val) || 0
    this.setData({
      'filterdata.BuildingEnd': val.toLocaleString('th-TH')
    });
  },
  selectBuildingOpen(e) {
    const dataId = e.target.dataset.id
    if (dataId == 0) {
      this.setData({
        'filterdata.BuildingStart': 0,
        'filterdata.BuildingEnd': 0,
      })
    }
    this.setData({
      'filterdata.WithBuildingOpen': dataId
    })

  },
  // slide a filter section open / shut
  toggle(e) {
    const k = e.currentTarget.dataset.k
    this.setData({ ['open.' + k]: !this.data.open[k] })
  },

  // Buy / Rent: either or both. One picked = that type; both or none = 0 (every listing — the backend has no "buy or rent" other than all)
  toggleSell(e) {
    const id = String(e.currentTarget.dataset.id)
    const sellSel = Object.assign({}, this.data.sellSel)
    sellSel[id] ? delete sellSel[id] : (sellSel[id] = true)
    const ids = Object.keys(sellSel)
    this.setData({ sellSel, 'filterdata.selltype': ids.length === 1 ? Number(ids[0]) : 0 })
  },
  // multi-select: tap a card to switch that property type on / off. filterdata.PropertyType = ids joined by "," ('' = no filter)
  toggleProperty(e) {
    // currentTarget = the tapped card itself (e.target would be the image / frame inside it, which has no data-id)
    const id = String(e.currentTarget.dataset.id)
    const typeSel = Object.assign({}, this.data.typeSel)
    typeSel[id] ? delete typeSel[id] : (typeSel[id] = true)
    const picked = this.data.DataPropType.filter((t) => typeSel[String(t.id)])
    this.setData({
      typeSel,
      'filterdata.PropertyType': picked.map((t) => t.id).join(','),
      'filterdata.PropertyTypeName': picked.map((t) => t.name).join(',')
    })
  },
  // inside / outside an industrial estate: either or both. One picked = that value; both or none = '0' (no filter)
  toggleIEAT(e) {
    const id = String(e.currentTarget.dataset.id)
    const ieatSel = Object.assign({}, this.data.ieatSel)
    ieatSel[id] ? delete ieatSel[id] : (ieatSel[id] = true)
    const ids = Object.keys(ieatSel)
    const picked = this.data.DataIEAT.filter((t) => ieatSel[t.id])
    this.setData({
      ieatSel,
      'filterdata.IEAT': ids.length === 1 ? ids[0] : '0',
      'filterdata.IEATText': picked.length === 1 ? picked[0].name : 'All'
    })
  },
  // land colour cards: several can be on; none on = no colour filter (stored as ["0"], what the search expects)
  selectColor(e) {
    const id = String(e.currentTarget.dataset.id)
    const DataColor = this.data.DataColor.map(function (item) {
      return item.id === id ? Object.assign({}, item, { select: !item.select }) : item
    })
    const picked = DataColor.filter(function (item) { return item.select }).map(function (item) { return item.id })
    this.setData({
      DataColor,
      'filterdata.Color': picked.length ? picked : ["0"]
    })
  },

  // (i) next to the colour title: popup with what each colour is for
  openZoneInfo() { this.setData({ showZoneInfo: true }) },
  closeZoneInfo() { this.setData({ showZoneInfo: false }) },
})