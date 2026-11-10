const config = require("./config");
App({
  async onLaunch() {
    // chat pages await this: they may open before the login below has finished
    this.loginPromise = this.LoginWechat()
    try { await this.loginPromise } catch (e) { /* pages show their own error state */ }
  },

  globalData: {
    userInfo: null,
    bufferlist: [],
  },

  async LoginWechat() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (!res.code) {
            reject(new Error('No code'))
            return
          }
  
          wx.request({
            url: `${config.PublicIPCallApiGoBackend}/auth/wechat/login`,
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json'
            },
  
            success: (result) => {
              const d = result.data || {}
  
              wx.setStorage({
                key: "usersdetail",
                data: {
                  token: d.token,
                  firstname: d.firstname,
                  lastname: d.lastname,
                  picture: d.picture,
                  level: d.level,
                  role: d.role // 'customer' | 'agent' — decides which chat rooms the user sees
                },
                success() {
                  resolve(true)
                },
                fail(err) {
                  reject(err)
                }
              })
            },
  
            fail(err) {
              reject(err)
            }
          })
        },
  
        fail(err) {
          reject(err)
        }
      })
    })
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
  async GetHidden() {
    let Hiddata = await this.localStorageGet('HiddenList')
    let cooking = [];
    if (Hiddata !== "no data search") {
      const SelectorlistCount = Hiddata.data
      SelectorlistCount.map((v, i) => {
        cooking.push(v.id)
      })
      return cooking;
    } else {
      return "no data search";
    }
  },
  // website's /autocomplete/suggest: { province, district, industrial, asset } lists for the typed text (null on failure)
  GetAutocomplete(text) {
    return new Promise((resolve) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/autocomplete/suggest`,
        method: 'GET',
        data: { q: text },
        success(res) { resolve(res.statusCode === 200 ? res.data.data : null) },
        fail() { resolve(null) }
      })
    })
  },

  async Getkeyword(obj) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/product/search`,
        method: 'GET',
        data: {
          keyword: obj.keyword,
          color: obj.Color,
          selltype: obj.selltype,
          assettype: obj.PropertyType,
          IEAT: obj.IEAT,
          PriceStart: obj.PriceStart,
          PriceEnd: obj.PriceEnd,
          LandSizeStart: obj.LandSizeStart,
          LandSizeEnd: obj.LandSizeEnd,
          BuildingStart: obj.BuildingStart,
          BuildingEnd: obj.BuildingEnd,
          offset: obj.offset,
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          resolve(res.data.list)
          // resolve(res)
        },
        fail(err) {
          reject(err)
        },
        complete(res) {}
      })
    })
  },

  async GetAsset(request) {
    const that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/legacy/miniprogram/search`,
        method: 'GET',
        data: {
          SELLTYPE: request.selltype || 0, // 0 = every type; an empty value matches nothing on the backend
          LANGUAGE: config.language,
          LIMIT: request.limit,
          ORDER: request.order,
          OFFSET: request.offset,
          PROVINCE: request.province || '',
          DISTRICT: request.district || '',
          LAT: request.lat || '',
          LONG: request.long || '',
          MULTILIST: request.multilist || '', // comma-separated asset ids (recently viewed)
          DISTANCEMODE: request.distancemode || '',
          RADIUSKM: request.radius || '', // optional true-circle radius (km) with DISTANCEMODE
          PROPTYPE: request.PropertyType || '',
          IEAT: request.IEAT || '',
          COLOR: request.Color || '',
          LANDSTART: request.LandSizeStart || '',
          LANDEND: request.LandSizeEnd || '',
          PRICESTART: request.PriceStart || '',
          PRICEEND: request.PriceEnd || '',
          WHSTART: request.BuildingStart || '',
          WHEND: request.BuildingEnd || '',
          BUILDING: request.Building || '',
        },
        success(res) {
          const rawData = res.data.response;
          let dataProcess = "";
          if (rawData != "Data not found please enter agian.") {
            dataProcess = that.cal_size(rawData)
            if (Array.isArray(dataProcess)) {
              // listings the user hid are not shown again; rawLength = how many the server sent (paging must advance by that, not by what is left)
              const raw = dataProcess.length
              if (!request.includeHidden) dataProcess = that.filterHidden(dataProcess)
              dataProcess.rawLength = raw
            }
          }
          if (!Array.isArray(dataProcess) && rawData != "Data not found please enter agian.") {
            console.warn('GetAsset: unexpected answer', res.statusCode, JSON.stringify(res.data).slice(0, 200))
          }
          resolve(dataProcess)
        },
        fail(err) {
          // shows in the debug console of a trial / release build ("request:fail url not in domain list" = the API domain is not whitelisted)
          console.warn('GetAsset failed:', err && err.errMsg)
          resolve("err")
        },
        complete() {

        }
      });
    })
  },
  // ---- hidden listings: ids in storage HiddenList ([{id}], like FlavoriteList); kept on this phone only ----
  getHiddenIds() {
    const ids = {}
    ;(wx.getStorageSync('HiddenList') || []).forEach((v) => { ids[Number(v.id)] = true })
    return ids
  },

  // rows without the listings the user hid (a list that is not rows is returned as it is)
  filterHidden(rows) {
    if (!Array.isArray(rows)) return rows
    const hidden = this.getHiddenIds()
    return rows.filter((r) => !hidden[Number(r._id)])
  },

  hideAsset(id) {
    const list = wx.getStorageSync('HiddenList') || []
    if (!list.some((v) => Number(v.id) === Number(id))) list.push({ id: Number(id) })
    wx.setStorageSync('HiddenList', list)
  },

  unhideAsset(id) {
    wx.setStorageSync('HiddenList', (wx.getStorageSync('HiddenList') || []).filter((v) => Number(v.id) !== Number(id)))
  },

  cal_size(rawData) {
    if (rawData) {
      const process = rawData.map(item => {
        const price = item.typeassetn === "1" ?
          (item.LandSizeRai * 400) + (item.LandSizeNgan * 100) + item.LandSizeSQW + " 平方米" :
          item.WHSizeSQM + " 平方米";
        // price per square metre: land → land area (Area_all is in sq.wah, 1 sq.wah = 4 m²); otherwise the building area.
        // Rent listings use the monthly rent. Empty when there is no price or no area.
        const num = v => Number(String(v == null ? "" : v).replace(/,/g, "")) || 0
        const cost = item.typeselln === "2" ? num(item.RentCostPerMonthBath) : num(item.SalePriceBath)
        const sqm = item.typeassetn === "1" ? num(item.Area_all) * 4 : (num(item.WHSizeSQM) || num(item.Area_all) * 4)
        const per = cost > 0 && sqm > 0 ? cost / sqm : 0
        const persqm = per > 0 ? (per >= 100 ? String(Math.round(per)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : per.toFixed(2)) : ""
        return {
          ...item,
          price,
          persqm,
          listed: this.listedText(item.Create_date)
        };
      });
      return process;
    }
  },
  // "Listed on Oct, 2025 (3w ago)" / "发布于 2025年10月（3周前）" from Create_date ("YYYY-MM-DD HH:MM:SS")
  listedText(createDate) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(createDate || "")
    if (!m) return ""
    const en = config.language === "en"
    const year = Number(m[1]), month = Number(m[2])
    const days = Math.floor((Date.now() - new Date(year, month - 1, Number(m[3])).getTime()) / 86400000)
    const unit = (n, enU, zhU) => (en ? n + enU : n + zhU) + (en ? " ago" : "前")
    let ago
    if (days < 1) ago = en ? "today" : "今天"
    else if (days < 7) ago = unit(days, "d", "天")
    else if (days < 30) ago = unit(Math.floor(days / 7), "w", "周")
    else if (days < 365) ago = unit(Math.floor(days / 30), "mo", "个月")
    else ago = unit(Math.floor(days / 365), "y", "年")
    const monthEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]
    return en ? `Listed on ${monthEn}, ${year} (${ago})` : `发布于 ${year}年${month}月（${ago}）`
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

  NextToSelectMode(req) {
    const textParams = this.ParseParams(req)
    let url = `/pages/searchselect/searchselect?selltype=${req.selltype}${textParams}`
    wx.navigateTo({
      url: url
    })
  },

  MainStackScreen(req) {
    const textParams = this.ParseParams(req)
    let url = `/pages/search/search?selltype=${req.selltype}${textParams}`
    wx.navigateTo({
      url: url
    })
  },
  GetQuerySearch(req) {
    const textParams = this.ParseParams(req)
    let url = `/pages/search/search?selltype=${req.selltype}${textParams}`
    // GetAsset()
  },
  GetInvestment(offset, lenght) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/investment/list`,
        method: 'GET',
        data: {
          language: config.language,
          offset: offset,
        },
        success(res) {
          const rawData = res.data;
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
        url: `${config.PublicIPCallApiGoBackend}/legacy/miniprogram/news/detail`,
        method: 'GET',
        data: {
          id_doc: id,
          LANGUAGE: config.language,
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
  GetContent(topic, limit) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/legacy/miniprogram/news`,
        method: 'GET',
        data: {
          language: config.language,
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

  async Getlist(data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/product/list?listid=${data}&language=zh`,
        method: 'GET',
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

})
