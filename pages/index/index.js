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
                console.log(res);
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
                                    console.log(result.data);
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
                                            // console.log("Saved successfully!");
                                        },
                                        fail(err) {
                                            // console.error("Failed to save:", err);
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
        
        this.setData({
            dataAsset: getAsset
        })
        
        console.log(this.data.dataAsset)
    },
    onShareAppMessage(){
      
    }
})
