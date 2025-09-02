// pages/search/search.js
const app = getApp();
Page({
  data: {
      fetchData: [], // เก็บผลลัพธ์ทั้งหมด
      offset: 0, // offset สำหรับ API
      limit: 10, // จำนวน item ต่อ request
      loading: false, // กำลังโหลดหรือไม่
      hasMore: true, // มีข้อมูลเหลือให้โหลดหรือไม่
      selltype:0,
      province:0,
      district:0,
      lat:'',
      long:'',
      distancemode:0,
      PropertyType:'',
      IEAT:'',
      Color:'',
      LandSizeStart:'',
      LandSizeEnd:'',
      PriceStart:'',
      PriceEnd:'',
      BuildingStart:'',
      BuildingEnd:'',
      Building : '',
  },

  onLoad(options) {
      this.setData({
        selltype : options.selltype,
        province : options.province,
        district : options.district,
        lat : options.lat,
        long : options.long,
        distancemode : options.distancemode,
        PropertyType : options.PropertyType,
        IEAT : options.IEAT,
        Color : options.Color,
        LandSizeStart : options.LandSizeStart,
        LandSizeEnd : options.LandSizeEnd,
        PriceStart : options.PriceStart,
        PriceEnd : options.PriceEnd,
        BuildingStart : options.BuildingStart,
        BuildingEnd : options.BuildingEnd,
        Building : options.Building,
      })
      this.Getsearch();
  },
  
  async Getsearch(){
    if (this.data.loading || !this.data.hasMore) return;
    this.setData({loading: true});
    let sentobject = {
      selltype : this.data.selltype || 0,
      limit : this.data.limit || 0,
      offset : this.data.offset || 0,
      province : this.data.province || '',
      district : this.data.district || '',
      lat : this.data.lat || '',
      long : this.data.long || '',
      distancemode : this.data.distancemode || '',
      PropertyType : this.data.PropertyType || '',
      IEAT : this.data.IEAT || '',
      Color : this.data.Color || '',
      LandSizeStart : this.data.LandSizeStart || '',
      LandSizeEnd : this.data.LandSizeEnd || '',
      PriceStart : this.data.PriceStart || '',
      PriceEnd : this.data.PriceEnd || '',
      BuildingStart : this.data.BuildingStart || '',
      BuildingEnd : this.data.BuildingEnd || '',
      Building  : this.data.Building || '',
    }

    // console.log(sentobject);
    let Dataget = await app.GetAsset(sentobject);
    let DataMain = await this.settinglist(Dataget)
    
    this.setData({
      fetchData: [...this.data.fetchData, ...DataMain],
      offset: this.data.offset + Dataget.length,
      hasMore: Dataget.length > 0,
      loading: false
    });
  },

  async settinglist (Dataget){
    const Hiddenlist = await app.GetHidden()
    // console.log(Dataget);
    if(Hiddenlist !== "no data search" && !Hiddenlist){
      Dataget = Dataget.filter(item => {
        return !Hiddenlist.includes(Number(item._id));
      });
    }
    return Dataget;
  },

  onShow(){
    // let dataFetch = this.settinglist(this.data.fetchData)
    // this.setData({
    //   fetchData : dataFetch
    // })
  },

  onReachBottom() {
      this.Getsearch();
  }
});
