// pages/assetdetail/assetdetail.js
// Listing detail page: photos, price, owner, land/building/parking facts, map, nearby listings, plus like / chat / share / call actions.
const config = require("../../config");
Page({
  data: {
    buildingList: [],      // buildings of the listing, each with a translated type label (typeText)
    closedText: '',        // banner text when the listing is closed (sold / rented / other); '' = still open
    closedDate: '',        // closing date (YYYY-MM-DD) shown under the banner
    circles: [],           // map circle (400 m area) used instead of a pin when the owner hides the exact spot
    id: 0,                 // asset id (number, from the API's assetid)
    predata: [],           // the whole assetdetail payload from the API; the wxml reads everything from here
    lat: null,             // map centre latitude
    long: null,            // map centre longitude
    likeActive: false,     // true when this asset is in the local favourites list
    language: "en",        // UI language, set from config in onLoad
    x: 0,                  // position of the floating Landlink support button (movable-view)
    y: 500,
    showcontact: false,    // the contact popup (floating Landlink button)
    opensee: true,         // true = the lower detail sections are collapsed ("Show more")
    markers: [{            // map pins; the placeholder below is replaced once the listing has loaded
      id: 900000001,
      latitude: 13.736717,
      longitude: 100.523186,
      title: "Thailand",
      iconPath: "",
      width: 30,
      height: 30
    }]
  },

  // Page start: place the floating support button at the right edge, read the asset id, load the detail and the like state.
  async onLoad(options) {
    const res = wx.getSystemInfoSync()
    const buttonSize = 56 // px
    const margin = 0 // gap from the screen edge
    this.setData({
      x: res.windowWidth - buttonSize - margin,
      y: res.windowHeight * 0.6
    })
    await this.setData({
      newsId: options.id ? options.id : options.scene, // asset id from the URL (?id=) or from a scanned QR code (scene)
      language: config.language
    });

    await this.loadData(this.data.newsId)
    this.storagelist();

  },

  // GET /product/assetdetail/:id → fills predata, buildings, closed banner, map circle/markers and nearby listings.
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
          var assetdetail = res.data.data.assetdetail // the listing itself
          var nearasset = res.data.data.nearasset     // nearby listings shown at the bottom
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
          // push everything the template needs into page data
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
          that.rememberViewed(assetdetail.assetid)
          resolve(assetdetail); // resolve when the request is done
        },
        fail(err) {
          reject(err); // reject on network error
        }
      });
    });

  },

  // GET /user/ref/generate → this user's referral code (appended to shared links). Fails for users without one (customers).
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

  async onShareAppMessage() {
    // a customer has no referral code: share without it rather than fail
    let res = await this.Getref().catch(() => ({}))
    const Share = {
      title: `#${this.data.id} ${this.data.predata.assetname}`,
      path: `/pages/assetdetail/assetdetail?id=${this.data.id}${res && res.ref ? '&ref=' + res.ref : ''}`,
      imageUrl: this.data.predata.Images && this.data.predata.Images.length > 0 ?
        this.data.predata.Images[0].filepath : "/asset/landlink.png"
    }
    return Share;
  },

  // Recently viewed: keeps the last 10 distinct asset ids, newest first (storage RecentViewed; the home page shows them).
  rememberViewed(id) {
    const ids = (wx.getStorageSync('RecentViewed') || []).filter(function (x) { return x !== Number(id) })
    ids.unshift(Number(id))
    wx.setStorageSync('RecentViewed', ids.slice(0, 10))
  },

  // Reads the local favourites list (storage key FlavoriteList = [{id}]) and sets likeActive for this asset.
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

  // Like button: toggles this asset in the local favourites list (add / remove + toast), then refreshes likeActive.
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

  // "location" button: scrolls the page down to the map section (#section_map).
  scrollToMap() {
    this.setData({
      toView: 'section_map'
    })
  },

  // Tap on a photo: opens the full-screen preview at that photo, swipeable through all of the listing's photos.
  fullscreenpicture(e) {
    const indexDataPreview = e.currentTarget.dataset.index;
    const urls = this.data.predata.Images.map(function (img) { return img.filepath })
    wx.previewImage({
      current: urls[indexDataPreview],
      urls: urls
    })
  },

  // Floating Landlink button: the contact popup (customer-service chat + the three phone numbers).
  showPopup() {
    this.setData({ showcontact: true })
  },

  closeContact() {
    this.setData({ showcontact: false })
  },

  // "Show more" / collapse of the lower detail sections.
  toggleopensee() {
    this.setData({
      opensee: !this.data.opensee
    })
  }
});
