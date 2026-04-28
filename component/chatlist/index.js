// component/chatlist/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    assetdetail: {
      type: Object,
      value: {},
    },
    chatno: {
      type: String,
      value: '',
    },
    picture: {
      type: String,
      value: '#',
    },
    namechat: {
      type: String,
      value: '',
    },
    notinew: {
      type: Boolean,
      value: false,
    },
    textnew: {
      type: String,
      value: ''
    },
    timenew: {
      type: String,
      value: ''
    },
    month: {
      type: String,
      value: ''
    },
    date: {
      type: String,
      value: ''
    },
    unreadno: {
      type: Number,
      value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {
    // countArray: Array.from({
    //     length: 10
    // })
    userLevel : 0,
  },

  lifetimes: {
    attached: function() {
      this.getUserLevel();
    }
  },
  /**
   * Component methods
   */
  methods: {

    getUserLevel() {
      try {
        const userInfo = wx.getStorageSync('usersdetail');
        if (userInfo && userInfo.level) {
          this.setData({
            userLevel: userInfo.level
          });
        }
      } catch (e) {
        // console.error('ดึงข้อมูลจาก storage ผิดพลาด', e);
      }
    },

    Nexttofeed(e) {
      let idfeed = e.currentTarget.dataset.idfeed
      wx.navigateTo({
        url: `/pages/chatfleet/chatfleet?id=${idfeed}`,
      });
    }
  },
})