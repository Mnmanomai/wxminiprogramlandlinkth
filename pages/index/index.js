// index.js
const app = getApp();
Page({
  data: {
    dataAsset: [],
    show: false,
  },


  onReceiveData(e) {
    this.setData({
      show: e.detail.data
    })
  },

  async onLoad() {
    wx.getStorage({
      key: "usersdetail",
      success(res) {
      },
      fail(res) {
        wx.login({
          success: (res) => {
            if (res.code) {
              wx.request({
                url: 'http://127.0.0.1:8080/auth/wechat/login',
                method: 'POST',
                data: {
                  code: res.code
                },
                success: (result) => {
                  var datadetail = result.data
                  var token = datadetail.token;
                  var username = datadetail.firstname;
                  var lastname = datadetail.lastname;
                  wx.setStorage({
                    key: "usersdetail",
                    data: {
                      token: token,
                      firstname: username,
                      lastname: lastname,
                    },
                    success() {
                    },
                    fail(err) {
                    }
                  });
                }
              })
            }
          },
        })
      }
    })

    const getAsset = await app.GetLatestAsset();
    const chachengsao = await app.GetAsset({selltype:1,limit:10,offset:0,province:6});
    const chonburi = await app.GetAsset({selltype:1,limit:10,offset:0,province:12});
    const rayong = await app.GetAsset({selltype:1,limit:10,offset:0,province:53});
    const yutya = await app.GetAsset({selltype:1,limit:10,offset:0,province:46});
    const phathum = await app.GetAsset({selltype:1,limit:10,offset:0,province:37});
    const samutprakarn = await app.GetAsset({selltype:1,limit:10,offset:0,province:57});
    const samutsakorn = await app.GetAsset({selltype:1,limit:10,offset:0,province:58});

    this.setData({
      dataAsset: getAsset,
      datachachengsao : chachengsao,
      datachonburi : chonburi,
      datarayong : rayong,
      datayutya : yutya,
      dataphathum : phathum,
      datasamutprakarn : samutprakarn,
      datasamutsakorn : samutsakorn,
    })

  },
  onShareAppMessage() {
    return {
      path:'pages/index/index',
    }
  }
})
