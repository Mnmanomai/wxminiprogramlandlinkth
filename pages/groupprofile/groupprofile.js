// pages/groupprofile/groupprofile.js
const config = require('../../config');
Page({

    /**
     * Page initial data
     */
    data: {
        groupname: '',
        images: null,
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        let res = await this.requestPreset(options.groupid)
        this.setData({
            groupid: options.groupid,
            groupname: res.data.groupname,
            images: res.data.groupicture,
        })
    },

    async requestPreset(data) {
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
                url: `${config.PublicIPCallApiGoBackend}/community/group/profile/${data}`,
                method: 'GET',
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

    setName(e) {
        this.setData({
            groupname: e.detail.value
        })

    },

    async ChangeName() {
        const groupname = this.data.groupname
        const groupid = this.data.groupid
        const res = await this.requestChangeName(groupname,groupid)
        const status = res.statusCode
        if (status == 200){
            await wx.showToast({
                title: '数据保存成',
                icon: 'success'
            })

        }else{
            wx.showToast({
                title: '请联系您的服务提供商。',
                icon: 'none'
            })
        }
    },

    async requestChangeName(groupname,groupid){
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

        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.PublicIPCallApiGoBackend}/community/group/profile/detail/name`,
                method: 'POST',
                data: JSON.stringify({
                    ugroupid: groupid,
                    groupname: groupname
                }),
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                success(res) {
                    resolve(res)
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
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

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
                url: `${config.PublicIPCallApiGoBackend}/community/group/profile/detail/picture`,
                method: 'POST',
                filePath: compressedPath,
                name: 'file',
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                formData: {
                    type: 'image',
                    ugroupid: this.data.groupid
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
