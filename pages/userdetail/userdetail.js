// pages/userdetail/userdetail.js
const config = require("../../config");
Page({

    /**
     * Page initial data
     */
    data: {
        name: '',
        lastname: '',
        email: '',
        phonenumber: '',
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onChangeName(e) {
        this.setData({
            name: e.detail
        })
    },
    onChangeLastname(e) {
        this.setData({
            lastname: e.detail
        })
    },
    onChangeEmail(e) {
        this.setData({
            email: e.detail
        })
    },
    onChangePhone(e) {
        this.setData({
            phonenumber: e.detail
        })
    },
    async saveInfo() {
        let obj = {
            firstname: this.data.name,
            lastname: this.data.lastname,
            email: this.data.email,
            phonenumber: this.data.phonenumber,
        }
        let res = await this.RequestSaveInfo(obj)
        if (res.statusCode == 200) {
            wx.showToast({
                title: '添加成功',
                icon: 'none'
            })
        } else {

            wx.showToast({
                title: res.data.error,
                icon: 'none'
            })
        }
    },

    async onShow() {
        let res = await this.getInfo()
        this.setData({
            name: res.user_info.firstname,
            lastname: res.user_info.lastname,
            email: res.user_info.email,
            phonenumber: res.user_info.phonenumber,
            images : res.user_info.picture
        })
    },

    async RequestSaveInfo(obj) {
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
                url: `${config.PublicIPCallApiGoBackend}/user/info`,
                method: 'POST',
                data: JSON.stringify(obj),
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                success(res) {
                    resolve(res)
                },
            })
        })
    },

    async getInfo() {
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
                url: `${config.PublicIPCallApiGoBackend}/user/info`,
                method: 'GET',
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                success(res) {
                    resolve(res.data)
                },
            })
        })
    },

    async uploadprofile() {
        try {
            const res = await wx.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: ['album', 'camera']
            })

            const file = res.tempFiles[0]
            const sizeMB = file.size / 1024 / 1024

            if (sizeMB > 3) {
                wx.showToast({
                    title: '图片文件大小不得超过3MB',
                    icon: 'none'
                })
                return
            }

            // ส่ง path ไปทำ compress + upload
            const uploadres = await this.chooseAndUploadImage(file.tempFilePath)
            this.setData({
                images: uploadres.image_url
            })

            
        } catch (err) {
            wx.showToast({
                title: '请联系您的服务提供商。',
                icon: 'none'
            })
            return
        }
    },

    async chooseAndUploadImage(tempFilePath) {
        // 1. compress
        const compressRes = await wx.compressImage({
            src: tempFilePath,
            quality: 10
        })

        const compressedPath = compressRes.tempFilePath

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
        })

        // 2. upload (ห่อ Promise)
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: `${config.PublicIPCallApiGoBackend}/user/info/picture`,
                method: 'POST',
                filePath: compressedPath,
                name: 'file',
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                formData: {
                    type: 'image',
                },
                success: (res) => {
                    let result
                    try {
                        // ⚠️ res.data เป็น string
                        result = JSON.parse(res.data)
                    } catch (e) {
                        reject('invalid json response')
                        return
                    }

                    wx.showToast({
                        title: '上传成功',
                        icon: 'success'
                    })

                    // ⭐ ส่งค่ากลับ
                    resolve(result)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    }
})