// pages/assetdetail/assetdetail.js
const chatapi = require('../../utils/chatapi')
const config = require("../../config");
Page({
  data: {
    buildingList: [],
    closedText: '',
    closedDate: '',
    circles: [],
    id: 0,
    predata: [],
    lat: null,
    long: null,
    likeActive: false,
    language: "en",
    x: 0,
    y: 500,
    supportPhone: '+66641648899',
    opensee: true,
    markers: [{
      id: 900000001,
      latitude: 13.736717,
      longitude: 100.523186,
      title: "Thailand",
      iconPath: "",
      width: 30,
      height: 30
    }]
  },

  async onLoad(options) {
    const res = wx.getSystemInfoSync()
    const buttonSize = 56 // px
    const margin = 0 // ระยะห่างขอบจอ
    this.setData({
      x: res.windowWidth - buttonSize - margin,
      y: res.windowHeight * 0.6
    })
    await this.setData({
      newsId: options.id ? options.id : options.scene, // รับค่า id จาก URL
      language: config.language
    });

    await this.loadData(this.data.newsId)
    this.storagelist();

  },

  async loadData(id) {
    const that = this;
    const tokenrequest = wx.getStorageSync('usersdetail');
    const token = tokenrequest.token;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.PublicIPCallApiGoBackend}/product/assetdetail/${id}?language=zh`,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + token
        },
        success(res) {
          var assetdetail = res.data.data.assetdetail
          var nearasset = res.data.data.nearasset
          // each building's type as text (office / warehouse / factory / other) for the list shown when a listing has several
          const typeText = { 1: { zh: '办公楼', en: 'Office' }, 2: { zh: '仓库', en: 'Warehouse' }, 3: { zh: '工厂', en: 'Factory' }, 4: { zh: '其他', en: 'Other' } }
          const lang = that.data.language === 'en' ? 'en' : 'zh'
          const buildingList = (assetdetail.buildings || []).map(function (b) {
            return Object.assign({}, b, { typeText: (typeText[b.type] || typeText[4])[lang] })
          })
          // the owner may hide the exact spot: then the map shows an area (circle, same 400 m as the website) instead of the pin
          const exact = !!assetdetail.show_exact_location
          // a closed listing (sold / rented / other) keeps its page, with a banner instead of the contact button
          const closed = assetdetail.closed
          const closedTexts = {
            sold: { zh: '该房源已售出', en: 'This property has been sold' },
            rented: { zh: '该房源已出租', en: 'This property has been rented' },
            other: { zh: '该房源已结束销售', en: 'This property is no longer available' }
          }
          that.setData({
            predata: assetdetail,
            buildingList: buildingList,
            closedText: closed ? (closedTexts[closed.reason] || closedTexts.other)[lang] : '',
            closedDate: closed && closed.at ? String(closed.at).slice(0, 10) : '',
            circles: exact ? [] : [{
              latitude: assetdetail.address.lat,
              longitude: assetdetail.address.lng,
              radius: 400, color: '#1e3a8a99', fillColor: '#1e3a8a26', strokeWidth: 1
            }],
            lat: assetdetail.address.lat,
            id: assetdetail.assetid,
            long: assetdetail.address.lng,
            markers: exact ? [{
              id: assetdetail.assetid,
              latitude: assetdetail.address.lat,
              longitude: assetdetail.address.lng,
              width: 30,
              height: 30
            }] : [],
            nearasset: nearasset
          });

          wx.setNavigationBarTitle({
            title: assetdetail.assetname,
          });
          resolve(assetdetail); // ✅ resolve เมื่อ request เสร็จ
        },
        fail(err) {
          reject(err); // ✅ reject ถ้า error
        }
      });
    });

  },

  async Getref() {
    const token = await new Promise((resolve, reject) => {
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
        url: `${config.PublicIPCallApiGoBackend}/user/ref/generate`,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + token
        },
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

  // open (or reuse) my chat with the listing's seller, then go to the room
  async startChat() {
    const en = this.data.language === 'en'
    wx.showLoading({ title: '', mask: true })
    try {
      const room = await chatapi.startRoom(Number(this.data.id))
      wx.hideLoading()
      wx.navigateTo({ url: '/pages/chatroom/chatroom?id=' + room.id })
    } catch (e) {
      wx.hideLoading()
      wx.showToast({ title: (e && e.message) || (en ? 'Cannot start chat' : '暂时无法发起聊天'), icon: 'none' })
    }
  },

  async onShareAppMessage() {
    // a customer has no referral code: share without it rather than fail
    let res = await this.Getref().catch(() => ({}))
    const Share = {
      title: `#${this.data.id} ${this.data.predata.assetname}`,
      path: `/pages/assetdetail/assetdetail?id=${this.data.id}${res && res.ref ? '&ref=' + res.ref : ''}`,
      imageUrl: this.data.predata.Images && this.data.predata.Images.length > 0 ?
        this.data.predata.Images[0].filepath : "/asset/landlink.webp"
    }
    return Share;
  },

  storagelist() {
    const Noid = this.data.id;
    const that = this
    wx.getStorage({
      key: 'FlavoriteList',
      success(res) {
        let oldData = res.data || [];
        let DataChecked = false;
        oldData.map(item => {
          item.id === Noid ? DataChecked = true : '';
        });
        that.setData({
          likeActive: DataChecked
        })
      },
    });
  },

  likefunc() {
    const id = this.data.id;
    const that = this
    wx.getStorage({
      key: 'FlavoriteList',
      success(res) {
        let oldData = res.data || [];
        const index = oldData.findIndex(item => item.id === id);
        if (index !== -1) {
          oldData.splice(index, 1);
          wx.showToast({
            title: '删除',
            icon: 'none'
          });
        } else {
          oldData.push({
            id
          });
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
        }

        wx.setStorage({
          key: 'FlavoriteList',
          data: oldData
        });
      },
      fail() {
        const newData = [{
          id
        }];
        wx.setStorage({
          key: 'FlavoriteList',
          data: newData
        });
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
      },
      complete() {
        that.storagelist()
      }
    });
  },

  scrollToMap() {
    this.setData({
      toView: 'section_map'
    })
  },

  fullscreenpicture(e) {
    const indexDataPreview = e.currentTarget.dataset.index;
    const urls = this.data.predata.Images.map(function (img) { return img.filepath })
    wx.previewImage({
      current: urls[indexDataPreview],
      urls: urls
    })
  },

  showPopup() {
    const that = this
    wx.showActionSheet({
      itemList: [
        config.language == "zh" ? `与 Landlink 通话` : `Call With Landlink`,
      ],
      success(res) {
        if (res.tapIndex == 0) {
          that.callSupport();
        }
      }
    })
  },

  callSupport() {
    wx.makePhoneCall({
      phoneNumber: this.data.supportPhone,
      success() {},
      fail(err) {}
    });
  },

  toggleopensee() {
    this.setData({
      opensee: !this.data.opensee
    })
  }
});
