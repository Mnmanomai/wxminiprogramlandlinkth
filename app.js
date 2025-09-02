const config = require("./config");
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.hideTabBar({
      animation: true
    });
  },
  globalData: {
    userInfo: null
  },

  async localStorageGet(key_storage) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key_storage,
        success(res) {
          resolve(res)
        },
        fail() {
          resolve("no data search");
        }
      })
    })

  },
  localStorageBookmark(key_storage, objectpush, limitlist) {
    wx.getStorage({
      key: key_storage,
      success(res) {
        let oldData = res.data || [];
        oldData.push(objectpush);
        if (oldData.length > limitlist) {
          oldData.splice(0, 1);
        }
        wx.setStorage({
          key: key_storage,
          data: oldData
        });
        wx.showToast({
          title: 'Booking successful',
        })
      },
      fail() {
        const newData = [objectpush];
        wx.setStorage({
          key: key_storage,
          data: newData
        });
        wx.showToast({
          title: 'Booking successful',
        })
      },
      complete() {

      }
    });
  },
  localStorageSetup(key_storage, objectpush, limitlist) {
    wx.getStorage({
      key: key_storage,
      success(res) {
        let oldData = res.data || [];
        oldData.push(objectpush);
        if (oldData.length > limitlist) {
          oldData.splice(0, 1);
        }
        wx.setStorage({
          key: key_storage,
          data: oldData
        });
      },
      fail() {
        const newData = [objectpush];
        wx.setStorage({
          key: key_storage,
          data: newData
        });
      },
      complete() {

      }
    });
  },
  async GetHidden(){
    let Hiddata = await this.localStorageGet('HiddenList')
    let cooking = [];
    if(Hiddata !== "no data search"){
      const SelectorlistCount = Hiddata.data
      SelectorlistCount.map((v,i)=>{
        cooking.push(v.id)
      })
      return cooking;
    }else{
      return "no data search";
    }

    
  },
  async GetAsset(request) {
    // const query = Object.entries({
    //   SELLTYPE : request.selltype || '',
    //   LANGUAGE: 'en',
    //   LIMIT: request.limit,
    //   OFFSET: request.offset,
    //   PROVINCE: request.province || '',
    //   DISTRICT: request.district || '',
    //   MULTILIST: request.mulilist || '',
    //   LAT: request.lat || '',
    //   LONG : request.long || '',
    //   DISTANCEMODE : request.distancemode || '',
    //   PROPTYPE : request.PropertyType || '',
    //   IEAT : request.IEAT || '',
    //   COLOR : request.Color || '',
    //   LANDSTART: request.LandSizeStart || '',
    //   LANDEND: request.LandSizeEnd || '',
    //   PRICESTART: request.PriceStart || '',
    //   PRICEEND: request.PriceEnd || '',
    //   WHSTART: request.BuildingStart || '',
    //   WHEND: request.BuildingEnd || '',
    //   BUILDING : request.Building || '',
    // })
    // .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    // .join('&');
    // const fullUrl = `http://localhost/api/miniprogramapi/search.php?${query}`;
    // console.log("FULL URL:", fullUrl);  // ✅ ดู url ที่จะยิงจริง


    const that = this
    // console.log(request);
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.apiBaseUrl}/api/miniprogramapi/search.php`,
        method: 'GET',
        data: {
          SELLTYPE: request.selltype || '',
          LANGUAGE: 'zh',
          LIMIT: request.limit,
          OFFSET: request.offset,
          PROVINCE: request.province || '',
          DISTRICT: request.district || '',
          LAT: request.lat || '',
          LONG: request.long || '',
          DISTANCEMODE: request.distancemode || '',
          PROPTYPE: request.PropertyType || '',
          IEAT: request.IEAT || '',
          COLOR: request.Color || '',
          LANDSTART: request.LandSizeStart || '',
          LANDEND: request.LandSizeEnd || '',
          PRICESTART: request.PriceStart || '',
          PRICEEND: request.PriceEnd || '',
          WHSTART: request.BuildingStart || '',
          WHEND: request.BuildingEnd || '',
          Building: request.Building || '',
        },
        success(res) {
          // console.log(res);
          const rawData = res.data.response;
          // console.log(rawData);
          let dataProcess = "";
          if (rawData != "Data not found please enter agian.") {
            dataProcess = that.cal_size(rawData)
          }
          resolve(dataProcess)
        },
        fail(err) {
          // console.log("error fetch");
          resolve("err")
        },
        complete() {

        }
      });
    })
  },
  cal_size(rawData) {
    const process = rawData.map(item => {
      const price = item.typeassetn === "1" ?
        (item.LandSizeRai * 400) + (item.LandSizeNgan * 100) + item.LandSizeSQW + " 平方米" :
        item.WHSizeSQM + " 平方米";
      return {
        ...item,
        price
      };
    });
    return process;
  },
  ParseParams(req) {
    // province n district
    let province = req.district_id && req.district_id != "" && req.district_id == "0000" ? `&province=${req.province_id}` : '';
    let district = req.district_id && req.district_id != "" && req.district_id != "0000" ? `&district=${req.district_id}` : '';

    // near location and now location
    let lat = req.selectlat ? `&lat=${req.selectlat}` : '';
    let long = req.selectlong ? `&long=${req.selectlong}` : '';
    let distancemode = req.distancemode ? `&distancemode=${req.distancemode}` : '';
    // detail search
    let PropertyType = req.PropertyType ? `&PropertyType=${req.PropertyType}` : '';
    let IEAT = req.IEAT ? `&IEAT=${req.IEAT}` : '';
    let Color = req.Color ? `&Color=${req.Color}` : '';
    let Building = req.Building ? `&Building=${req.Building}` : '';
    let LandSizeStart = req.LandSizeStart ? `&LandSizeStart=${req.LandSizeStart}` : '';
    let LandSizeEnd = req.LandSizeEnd ? `&LandSizeEnd=${req.LandSizeEnd}` : '';
    let PriceStart = req.PriceStart ? `&PriceStart=${req.PriceStart}` : '';
    let PriceEnd = req.PriceEnd ? `&PriceEnd=${req.PriceEnd}` : '';
    let BuildingStart = req.BuildingStart ? `&BuildingStart=${req.BuildingStart}` : '';
    let BuildingEnd = req.BuildingEnd ? `&BuildingEnd=${req.BuildingEnd}` : '';
    let arrayParams = [
      province,
      district,
      lat,
      long,
      distancemode,
      PropertyType,
      IEAT,
      Color,
      Building,
      LandSizeStart,
      LandSizeEnd,
      PriceStart,
      PriceEnd,
      BuildingStart,
      BuildingEnd
    ]
    let textParams = arrayParams.join("")
    return textParams;
  },
  MainStackScreen(req) {
    // console.log(req);
    const textParams = this.ParseParams(req)
    // console.log(textParams);
    let url = `/pages/search/search?selltype=${req.selltype}${textParams}`
    // console.log(url);
    wx.navigateTo({
      url: url
    })
  },
  GetLatestAsset() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.apiBaseUrl}/api/miniprogramapi/search.php`,
        method: 'GET',
        data: {
          LANGUAGE: 'zh',
          LIMIT: 10,
          ORDER: 'desc'
        },
        success(res) {
          const rawData = res.data.response;
          resolve(rawData)
        },
        fail(err) {
          resolve("err")
        },
      });
    })
  },
  GetInvestment(offset,lenght) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.apiBaseUrl}/api/miniprogramapi/investmentmarket.php`,
        method: 'GET',
        data : {
          LANGUAGE: "zh",
          offset : offset,
          lenght : lenght,
        },
        success(res) {
          const rawData = res.data.response;
          // console.log(rawData);
          resolve(rawData)
        },
        fail(err) {
          resolve("err")
        },
      });
    })
  },

  GetGuide(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.apiBaseUrl}/api/miniprogramapi/read_docv2.php`,
        method: 'GET',
        data : {
          id_doc: id,
          LANGUAGE: "zh",
        },
        success(res) {
          const rawData = res.data.response;
          resolve(rawData)
        },
        fail(err) {
          resolve("err")
        },
      });
    })
  },

  GetContent(topic,limit) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.apiBaseUrl}/api/content_document/all_content_api.php`,
        method: 'GET',
        data : {
          topic: topic,
          limit: limit,
        },
        success(res) {
          const rawData = res.data.response;
          resolve(rawData)
        },
        fail(err) {
          resolve("err")
        },
      });
    })
  },
})
