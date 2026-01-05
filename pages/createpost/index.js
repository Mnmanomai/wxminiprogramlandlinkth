// pages/createpost/index.js
const config = require("../../config");
Page({

    /**
     * Page initial data
     */
    data: {
        Images: null,
        Name: '',
        Position: '',
    },

    async getDataLocal() {
        const Resdata = await new Promise((resolve, reject) => {
            wx.getStorage({
                key: 'usersdetail',
                success(res) {
                    resolve(res.data)
                },
                fail(err) {
                    reject(err)
                }
            })
        });
        (Resdata);
        this.setData({
            Images: Resdata.picture,
            Name: Resdata.firstname + ' ' + Resdata.lastname,
            Position: '@customer'
        })

    },


    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        this.setData({
            groupId: options.ugroip
        })
        await this.getDataLocal()
    },

    SentBackData(e) {
        const textDetailData = e.detail.value
        this.setData({
            Textdetail: textDetailData
        })
    },

    async PostToServer() {
        this.setData({
            Loading: true
        })
        //group
        const ugroupid = this.data.groupId
        //textDetail
        const textDetail = this.data.Textdetail
        let obj = {
            ugroupid: ugroupid,
            textdetail: textDetail
        }
        
        let res = await this.wxSentRequest(obj)
        if(res){
            this.setData({
                Loading: false
            })
            wx.navigateBack({
                delta: 1
            })
        }
    },

    async wxSentRequest(data) {
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
                url: `${config.PublicIPCallApiGoBackend}/community/post/create`,
                method: 'POST',
                data : JSON.stringify(data),
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
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

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

    },
})