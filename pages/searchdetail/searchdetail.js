// pages/searchdetail/searchdetail.js
const app = getApp();
const config = require("../../config");
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
      IEAT: '',
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
    DataSellnrent : [
      {
        id : 1,
        name: config.language == "en" ? "Buy" : "购买"
      },
      {
        id : 2,
        name: config.language == "en" ? "Rent" : "租赁"
      },
    ],
    DataPropType: [{
        id: 0,
        name: config.language == "en" ? "All" : "全部"
      },
      {
        id: 1,
        name: config.language == "en" ? "Land" : "土地"
      },
      {
        id: 2,
        name: config.language == "en" ? "Warehouse" : "仓库"
      },
      {
        id: 3,
        name: config.language == "en" ? "Factory" : "工厂"
      }
    ],
    DataIEAT: [{
        id: '0',
        name: config.language == "en" ? "All" : "全部"
      },
      {
        id: '2',
        name: config.language == "en" ? "IEAT" : "工业区内"
      },
      {
        id: '1',
        name: config.language == "en" ? "Non IEAT" : "工业区外"
      }
    ],
    DataColor: [{
        id: "0",
        name: config.language == "en" ? "All" : "全部",
        select: true,
      },
      {
        id: "1",
        name: config.language == "en" ? "Purple zone" : "紫色",
        select: false,
      },
      {
        id: "2",
        name: config.language == "en" ? "Yellow zone" : "黄色",
        select: false,
      },
      {
        id: "3",
        name: config.language == "en" ? "Green zone" : "绿色",
        select: false,
      },
      {
        id: "4",
        name: config.language == "en" ? "Light Purple zone" : "浅紫色",
        select: false,
      },
      {
        id: "5",
        name: config.language == "en" ? "Orange zone" : "橙色",
        select: false,
      },
      {
        id: "6",
        name: config.language == "en" ? "Brown zone" : "棕色的",
        select: false,
      },
      {
        id: "7",
        name: config.language == "en" ? "Light Brown zone" : "浅棕色",
        select: false,
      },
      {
        id: "8",
        name: config.language == "en" ? "Red zone" : "红色的",
        select: false,
      },
      {
        id: "9",
        name: config.language == "en" ? "Blue zone" : "蓝色的",
        select: false,
      },
      {
        id: "10",
        name: config.language == "en" ? "Green diagonal zone" : "绿色对角线",
        select: false,
      },
      {
        id: "11",
        name: config.language == "en" ? "Gray zone" : "灰色的",
        select: false,
      },
      {
        id: "12",
        name: config.language == "en" ? "Olive green zone" : "橄榄绿",
        select: false,
      },
      {
        id: "13",
        name: config.language == "en" ? "Pink zone" : "粉色的",
        select: false,
      }
    ],
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
  async onLoad(options) {
    const eventChaneel = this.getOpenerEventChannel();
    let Color_receiver = ''
    eventChaneel.on('openfilterdata', (data) => {

      this.setData({
        filterdata: data,
        language: config.language,
      })
      this.setData({
        'filterdata.WithBuildingOpen': '0',
      })
      

      Color_receiver = data.Color
      if (Color_receiver != '') {
        Color_receiver = Color_receiver.split(",");

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
      }else{
        this.setData({
          'filterdata.Color' : "0",
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

    if(this.data.filterdata.DataOpenBuilding == 0){
      this.setData({
        'filterdata.BuildingStart' : 0,
        'filterdata.BuildingEnd' : 0,
      })
    }
    
    this.setData({
      'filterdata.LandSizeStart' : landsizestart ? landsizestart : "0",
      'filterdata.LandSizeEnd' : landsizeend ? landsizeend : "0",
      'filterdata.PriceStart' : pricestart ? pricestart : "0",
      'filterdata.PriceEnd' : priceend ? priceend : "0",
      'filterdata.BuildingStart' : buildingstart ? buildingstart : "0",
      'filterdata.BuildingEnd' : buildingend ? buildingend : "0",
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
    this.setData({
      'filterdata.WithBuildingOpen': dataId
    })
  },
  selectBuynRent(e){
    const dataID = e.target.dataset.id
    this.setData({
      'filterdata.selltype' : dataID,
    })
  },
  selectProperty(e) {
    const dataId = e.target.dataset.id
    const dataText = e.target.dataset.text
    this.setData({
      'filterdata.PropertyType': dataId,
      'filterdata.PropertyTypeName': dataText
    })
  },
  selectIEAT(e) {
    const dataId = e.target.dataset.id
    const dataText = e.target.dataset.text
    this.setData({
      'filterdata.IEAT': dataId,
      'filterdata.IEATText': dataText
    })
  },
  selectColor(e) {
    const id = String(e.currentTarget.dataset.id);
    let DataColor = this.data.DataColor;

    // ถ้ากด "0" → เคลียร์ทั้งหมด เหลือค่า "0" 
    if (id === "0") {
      DataColor = DataColor.map(item => {
        item.select = item.id === "0"; // ให้ "0" เป็น select = true, อื่น ๆ = false
        return item;
      });

      this.setData({
        DataColor,
        'filterdata.Color': ["0"] // เก็บแค่ "0"
      });
      return;
    }

    // toggle สีอื่น ๆ
    DataColor = DataColor.map(item => {
      if (item.id === id) {
        item.select = !item.select;
      } else if (item.id === "0") {
        // ถ้าเลือกสีอื่น ๆ ให้ "0" auto deselect
        item.select = false;
      }
      return item;
    });

    // สร้าง array ของสีที่เลือก
    const selectedArr = DataColor
      .filter(item => item.select)
      .map(item => item.id);

    this.setData({
      DataColor,
      'filterdata.Color': selectedArr
    });
  },
})