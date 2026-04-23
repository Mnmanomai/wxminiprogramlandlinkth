// pages/searchselect/searchselect.js
const app = getApp()
const config = require("../../config")
Page({

  /**
   * Page initial data
   */
  data: {
    fetchData: [], // เก็บผลลัพธ์ทั้งหมด
    loading: false, // กำลังโหลดหรือไม่
    hasMore: true, // มีข้อมูลเหลือให้โหลดหรือไม่
    offset: 0,
    limit: 10,
    selected : []
  },
  handleAssetSend(e){
    const returndata = e.detail.list
    const data = returndata.filter(val => val.selected).map(val => val._id);
    this.setData({
      selected : data
    })
  },

  returntochat() {
    // console.log(this.data.selected)
    const pages = getCurrentPages();
    const prevpagereal = pages[pages.length - 2];
    const prevpagepath = prevpagereal.route
    let prevPage = pages[pages.length - 3];

    if (prevpagepath == "pages/district/district"){
      prevPage = pages[pages.length - 4];
    }else if(prevpagepath == "pages/nearlocation/nearlocation"){
      prevPage = pages[pages.length - 3];
    }else if(prevpagepath == "pages/chatfleet/chatfleet"){
      prevPage = pages[pages.length - 2];
    }

    const data = this.data.selected

    const targetFunc = prevPage.sendasset || (prevPage.selectComponent && prevPage.selectComponent('#chat-id')?.sendasset);

    if (targetFunc) {
      try {
        if (prevpagepath == "pages/district/district"){
          targetFunc.call(prevPage, [data]);
          wx.navigateBack({ delta: 3 });
        }else if(prevpagepath == "pages/nearlocation/nearlocation"){
          targetFunc.call(prevPage, [data]);
          wx.navigateBack({ delta: 2 });
        }else if(prevpagepath == "pages/chatfleet/chatfleet"){
          targetFunc.call(prevPage, [data]);
          wx.navigateBack({ delta: 1 });
        }

      } catch (err) {
        console.error("เรียกฟังก์ชันได้แต่รันไม่สำเร็จ:", err);
      }
    } else {
      // console.log("ฟังก์ชันที่มีในหน้านี้:", Object.keys(prevPage));
      // console.error("ไม่พบ sendAsset ใน Page นี้จริงๆ");
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options)
    wx.setNavigationBarTitle({
      title: "搜索",
    });
    this.setData({
      'searchvalue.selltype': options.selltype ? options.selltype : '',
      'searchvalue.assettype': options.assettype ? options.assettype : '',
      'searchvalue.province': options.province ? options.province : '',
      'searchvalue.district': options.district ? options.district : '',
      'searchvalue.lat': options.lat ? options.lat : '',
      'searchvalue.long': options.long ? options.long : '',
      'searchvalue.distancemode': options.distancemode ? options.distancemode : '',
      'searchvalue.PropertyType': options.PropertyType ? options.PropertyType : '',
      'searchvalue.IEAT': options.IEAT ? options.IEAT : '',
      'searchvalue.Color': options.Color ? options.Color : '',
      'searchvalue.LandSizeStart': options.LandSizeStart ? options.LandSizeStart : '',
      'searchvalue.LandSizeEnd': options.LandSizeEnd ? options.LandSizeEnd : '',
      'searchvalue.PriceStart': options.PriceStart ? options.PriceStart : '',
      'searchvalue.PriceEnd': options.PriceEnd ? options.PriceEnd : '',
      'searchvalue.BuildingStart': options.BuildingStart ? options.BuildingStart : '',
      'searchvalue.BuildingEnd': options.BuildingEnd ? options.BuildingEnd : '',
      'searchvalue.Building': options.Building ? options.Building : '',
      'searchvalue.keyword': options.keyword ? options.keyword : '',
      // 'offset': options.keyword ? options.keyword : '0',
    })
    this.Getsearch();
  },

  async Getsearch() {
    if (this.data.loading || !this.data.hasMore) return;
    this.setData({
      loading: true
    });

    let sentobject = {
      selltype: this.data.searchvalue.selltype || 0,
      assettype: this.data.searchvalue.assettype || 0,
      limit: this.data.limit || 0,
      order: this.data.searchvalue.order || 0,
      offset: this.data.offset || 0,
      province: this.data.searchvalue.province || '',
      district: this.data.searchvalue.district || '',
      lat: this.data.searchvalue.lat || '',
      long: this.data.searchvalue.long || '',
      distancemode: this.data.searchvalue.distancemode || '',
      PropertyType: this.data.searchvalue.PropertyType || '',
      IEAT: this.data.searchvalue.IEAT || '',
      Color: this.data.searchvalue.Color || '',
      LandSizeStart: this.data.searchvalue.LandSizeStart || '',
      LandSizeEnd: this.data.searchvalue.LandSizeEnd || '',
      PriceStart: this.data.searchvalue.PriceStart || '',
      PriceEnd: this.data.searchvalue.PriceEnd || '',
      BuildingStart: this.data.searchvalue.BuildingStart || '',
      BuildingEnd: this.data.searchvalue.BuildingEnd || '',
      Building: this.data.searchvalue.Building || '',
      keyword: this.data.searchvalue.keyword || '',
    }

    let Dataget = ""
    if (sentobject.keyword != "") {
      let recdata = await app.Getkeyword(sentobject);
      Dataget = recdata.map(v => ({
        ...v,
        price: Number(v.price).toLocaleString('th-TH'),
        RentCostPerMonthBath: Number(v.RentCostPerMonthBath).toLocaleString('th-TH'),
        SalePriceBath: Number(v.SalePriceBath).toLocaleString('th-TH'),
      }));
    } else {
      Dataget = await app.GetAsset(sentobject);
    }
    
    this.setData({
      fetchData: [...this.data.fetchData, ...Dataget],
      offset: this.data.offset + Dataget.length,
      hasMore: Dataget.length > 0,
      loading: false
    });
    // console.log(this.data.fetchData)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
    this.Getsearch()
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})