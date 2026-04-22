const config = require("../../config")
Page({
  data: {
    showAction: false,
    showCascader: false,

    // แสดงผลบนหน้าจอ
    transactionText: '',
    locationText: '',
    actiondata: [],

    // ข้อมูลสำหรับ Action Sheet
    transactionOptions: [
      { name: 'ขาย (Sale)',value: 'sale'},
      { name: 'เช่า (Rent)',value: 'rent'}
    ],
    propertyOptions: [
      { name: 'land',value: 'land'},
      { name: 'warehouse',value: 'warehouse'},
      { name: 'factory',value: 'factory'}
    ],

    cityplanOptions: [
      { name: config.language == "en" ? "All" : "全部",value: "all"},
      { name: config.language == "en" ? "Purple zone" : "紫色",value: "purplezone"},
      { name: config.language == "en" ? "Yellow zone" : "黄色",value: "yellowzone"},
      { name: config.language == "en" ? "Green zone" : "绿色",value: "greenzone"},
      { name: config.language == "en" ? "Light Purple zone" : "浅紫色",value: "lightpurplezone"},
      { name: config.language == "en" ? "Orange zone" : "橙色",value: "orangezone"},
      { name: config.language == "en" ? "Brown zone" : "棕色的",value: "brownzone"},
      { name: config.language == "en" ? "Light Brown zone" : "浅棕色",value: "lightbrownzone"},
      { name: config.language == "en" ? "Red zone" : "红色的",value: "redzone"},
      { name: config.language == "en" ? "Blue zone" : "蓝色的",value: "bluezone"},
      { name: config.language == "en" ? "Green diagonal zone" : "绿色对角线",value: "green diagonalzone"},
      { name: config.language == "en" ? "Gray zone" : "灰色的",value: "grayzone"},
      { name: config.language == "en" ? "Olive green zone" : "橄榄绿",value: "olivegreenzone"},
      { name: config.language == "en" ? "Pink zone" : "粉色的",value: "pinkzone"}
    ],

    // ข้อมูลสำหรับ Cascader (ตัวอย่าง)
    areaOptions: [{
        text: 'กรุงเทพฯ',
        value: 'BKK',
        children: [{
            text: 'พระนคร',
            value: 'BKK-01'
          },
          {
            text: 'วัฒนา',
            value: 'BKK-02'
          }
        ]
      },
      {
        text: 'นนทบุรี',
        value: 'NON',
        children: [{
            text: 'เมืองนนทบุรี',
            value: 'NON-01'
          },
          {
            text: 'ปากเกร็ด',
            value: 'NON-02'
          }
        ]
      }
    ]
  },

  // --- Functions สำหรับ Action Sheet ---
  showActionSheet(e) {
    let datatype = e.currentTarget.dataset.type
    if (datatype == 'transaction') {
      this.setData({
        showAction: true,
        actiondata: this.data.transactionOptions
      });
    } else if (datatype == 'property') {
      this.setData({
        showAction: true,
        actiondata: this.data.propertyOptions
      });
    } else if (datatype == 'cityplan') {
      this.setData({
        showAction: true,
        actiondata: this.data.cityplanOptions
      });
    }


  },
  onSelectTransaction(e) {
    this.setData({
      transactionText: e.detail.name,
      showAction: false
    });
  },

  // --- Functions สำหรับ Cascader ---
  showLocation() {
    this.setData({
      showCascader: true
    });
  },
  onFinishLocation(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    const text = selectedOptions.map(o => o.text).join(' > ');
    this.setData({
      locationText: text,
      showCascader: false
    });
  },

  // ปิด Popup ทุกชนิด
  onClose() {
    this.setData({
      showAction: false,
      showCascader: false
    });
  }
});