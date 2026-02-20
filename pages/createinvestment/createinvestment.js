// pages/createinvestment/createinvestment.js
const config = require('../../config');

Page({

  /**
   * Page initial data
   */
  data: {
    language: config.language,
    topic: "",
    description: "",
    selltypevalue: '',
    assettypevalue: '',
    provincevalue: '',
    industrailtypevalue: '',
    landsizemin: '',
    landsizemax: '',
    buildingsizemin: '',
    buildingsizemax: '',
    visitplandate: '',
    // topic: "topic test fromwechat by manomai sudkaew",
    // description: "test wechat description by new",
    // selltypevalue: 1,
    // assettypevalue: 2,
    // provincevalue: "3,5",
    // industrailtypevalue: 2,
    // landsizemin: 1,
    // landsizemax: 2,
    // buildingsizemin: 1,
    // buildingsizemax: 2,
    // visitplandate: 1771520400000,


    color: "",
    colorvalue: "",

    assettype: "",
    selltype: "",

    province: '',
    district: '',
    industrailtype: '',
    visitplandateDisplay: '',

    ShowPopupSellType: false,
    ShowPopupAssetType: false,
    ShowPopupIndustrailType: false,
    ShowPopupVisitplan: false,

    radio: '1',
    selectedColor: [],
    selectedProvince: [] || "",
    provincelist: [] || "",
    selltypeobject: [] || "",
    assettypeobject: [] || "",
    industriltypeobject: [] || "",

    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: config.language == "zh" ? "创造投资": "Create Investment",
    });

    this.setFirsrt()
  },

  setFirsrt() {
    this.SetSellTypeSelect()
    this.SetAssetTypeSelect()
    this.SetIndustrailSelect()
  },

  OpenProvince() {
    wx.navigateTo({
      url: '/pages/provincemultiselect/provincemultiselect',
    })
  },

  OpenColor() {
    wx.navigateTo({
      url: '/pages/colormultiselect/colormultiselect',
    })
  },

  async Savefile() {

    wx.showModal({
      title: '确认并保存。',
      content: '您想保存此信息吗？',
      complete: async (res) => {
        if (res.confirm) {
          this.checkBeforeSave();
          let objdata = {
            topic: this.data.topic,
            description: this.data.description,
            selltype: this.data.selltypevalue,
            assettype: this.data.assettypevalue,
            color: this.data.colorvalue,
            province: this.data.provincevalue,
            industariltype: this.data.industrailtypevalue,
            areaLandSizeMin: this.data.landsizemin,
            areaLandSizeMax: this.data.landsizemax,
            areaBuildingSizeMin: this.data.buildingsizemin,
            areaBuildingSizeMax: this.data.buildingsizemax,
            visitPlanDate: new Date(this.data.visitplandate).toISOString()
          }
          let res = await this.RequestSent(objdata);
          if (res.statusCode == 200) {
            wx.navigateBack({
              delta: -1,
              success: (res) => {},
              fail: (res) => {},
              complete: (res) => {},
            })
          } else {
            wx.showToast({
              title: res.error,
              icon: 'icon',
              duration: 700,
            })
          }

        }
      }
    })


  },

  async RequestSent(objdata) {
    const tokenrequest = await new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'usersdetail',
        success(res) {
          resolve(res.data.token)
        },
        fail(err) {
          reject(err)
        }
      })
    });

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/investment/create`,
        method: 'POST',
        data: JSON.stringify(objdata),
        header: {
          'Authorization': 'Bearer ' + tokenrequest
        },
        success(res) {
          resolve(res)
        },
      })
    })
  },

  checkBeforeSave() {

    let landsizemin = this.data.landsizemin
    let landsizemax = this.data.landsizemax
    let buildingsizemin = this.data.buildingsizemin
    let buildingsizemax = this.data.buildingsizemax

    if (landsizemin > landsizemax || buildingsizemin > buildingsizemax) {
      wx.showToast({
        title: "土地面积或建筑物面积有误。",
        icon: 'error',
        duration: 700
      })
    }

    const requiredFields = [{
        key: 'topic',
        label: '话题'
      },
      {
        key: 'description',
        label: '请输入用户名'
      },
      {
        key: 'selltypevalue',
        label: '销售类型'
      },
      {
        key: 'assettypevalue',
        label: '资产类型'
      },
      {
        key: 'provincevalue',
        label: '省'
      },
      {
        key: 'industrailtypevalue',
        label: 'I-EAT'
      },
      {
        key: 'landsizemin',
        label: '最小土地面积 (rai)',
        zeroInvalid: true
      },
      {
        key: 'landsizemax',
        label: '最大土地尺寸 (rai)',
        zeroInvalid: true
      },
      {
        key: 'buildingsizemin',
        label: '最小建筑尺寸',
        zeroInvalid: true
      },
      {
        key: 'buildingsizemax',
        label: '最大建筑尺寸',
        zeroInvalid: true
      },
      {
        key: 'visitplandate',
        label: ' 计划访问日期'
      }
    ]

    let objrequest = []
    requiredFields.forEach(item => {
      const value = this.data[item.key]
      const isEmpty =
        value === "" ||
        value === null ||
        value === undefined || (item.zeroInvalid && Number(value) === 0)
      if (isEmpty) {
        wx.showToast({
          title: "请填写所有必填项。",
          icon: 'error',
          duration: 700
        })
        return;
      }
    })

    if (objrequest.length > 0) {
      return false
    }

    return true
  },

  SetSellTypeSelect() {
    let array = [{
        value: 1,
        text: config.language == "zh" ? "销售" : "Sale",
      },
      {
        value: 2,
        text: config.language == "zh" ? "租" : "Rent",
      },
      {
        value: 3,
        text: config.language == "zh" ? "出售及出租" : "Sale&Rent",
      }
    ]

    this.setData({
      selltypeobject: array
    })
  },
  SetAssetTypeSelect() {
    let array = [{
        value: 1,
        text: config.language == "zh" ? "土地" : "Land",
      },
      {
        value: 2,
        text: config.language == "zh" ? "仓库" : "Warehouse",
      },
      {
        value: 3,
        text: config.language == "zh" ? "工厂" : "Factory",
      }
    ]

    this.setData({
      assettypeobject: array
    })
  },
  SetIndustrailSelect() {
    let array = [{
        value: 1,
        text: config.language == "zh" ? "全部" : "All",
      },
      {
        value: 2,
        text: config.language == "zh" ? "工业区内" : "IEAT",
      },
      {
        value: 3,
        text: config.language == "zh" ? "工业区外" : "Non IEAT",
      }
    ]

    this.setData({
      industriltypeobject: array
    })
  },

  //Sell Type
  openSellType() {
    this.setData({
      ShowPopupSellType: true
    })
  },
  onCloseSellType() {
    this.setData({
      ShowPopupSellType: false
    })
  },
  onConfirmSellType(e) {
    let data = e.detail.value
    this.setData({
      ShowPopupSellType: false,
      selltype: data.text,
      selltypevalue: data.value
    })
  },

  // asset type
  openAssetType() {
    this.setData({
      ShowPopupAssetType: true
    })
  },
  onCloseAssetType() {
    this.setData({
      ShowPopupAssetType: false
    })
  },
  onConfirmAssetType(e) {
    let data = e.detail.value
    this.setData({
      ShowPopupAssetType: false,
      assettype: data.text,
      assettypevalue: data.value
    })
  },


  //industrail
  openIndustrailType() {
    this.setData({
      ShowPopupIndustrailType: true
    })
  },
  onCloseIndustrailType() {
    this.setData({
      ShowPopupIndustrailType: false
    })
  },
  onConfirmIndustrailType(e) {
    let data = e.detail.value
    this.setData({
      ShowPopupIndustrailType: false,
      industrailtype: data.text,
      industrailtypevalue: data.value
    })
  },


  OpenVisitplan() {
    this.setData({
      ShowPopupVisitplan: true
    })
  },

  CloseVisitplan() {
    this.setData({
      ShowPopupVisitplan: false
    })
  },

  SelectVisitplan(event) {
    let timedate = event.detail
    let dataobj = this.unixMsToYMD(timedate)
    this.setData({
      visitplandateDisplay: dataobj,
      visitplandate: timedate,
    });
  },

  unixMsToYMD(ms) {
    const date = new Date(ms)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  },

  inputTopic(e) {
    this.setData({
      topic: e.detail
    })
  },

  inputDescription(e) {
    this.setData({
      description: e.detail
    })
  },

  inputLandsizemin(e) {

    // let data = e.detail
    // parseInt(data)
    this.setData({
      landsizemin: parseInt(e.detail)
    })
  },

  inputLandsizemax(e) {
    this.setData({
      landsizemax: parseInt(e.detail)
    })
  },

  inputBuildingmin(e) {
    this.setData({
      buildingsizemin: parseInt(e.detail)
    })
  },

  inputBuildingmax(e) {
    this.setData({
      buildingsizemax: parseInt(e.detail)
    })
  },



})