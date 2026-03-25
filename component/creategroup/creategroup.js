const config = require("../../config")

// component/creategroup/creategroup.js
Component({

    /**
     * Component properties
     */
    properties: {
        opencreategroup: {
            type: Boolean,
            value: false,
        }
    },

    /**
     * Component initial data
     */
    data: {
        Name: "",
        images: "",
    },

    /**
     * Component methods
     */
    methods: {


        setTextinputName(e) {
            let data = e.detail.value
            this.setData({
                Name: data
            })
        },

        create() {
            const tokenrequest = wx.getStorageSync('usersdetail');
            const token = tokenrequest.token;
            const name = this.data.Name;
            const picture = this.data.images; // Path รูป

            // 1. ตรวจสอบชื่อกลุ่ม
            if (!name || name.trim().length === 0) {
                wx.showToast({
                    title: '请输入群名称',
                    icon: 'error'
                });
                return;
            }

            wx.showLoading({
                title: '正在创建讨论群...'
            });

            // 2. เช็คว่ามีรูปหรือไม่
            if (picture && picture.length > 0) {
                // --- กรณีมีรูป: ใช้ wx.uploadFile ---
                wx.uploadFile({
                    url: `${config.PublicIPCallApiGoBackend}/chat/creategroup`,
                    filePath: picture,
                    name: 'image_file',
                    header: {
                        'Authorization': 'Bearer ' + token
                    },
                    formData: {
                        'name': name
                    },
                    success: (res) => this.handleSuccess(res),
                    fail: (err) => this.handleFail(err)
                });
            } else {
                // --- กรณีไม่มีรูป: ใช้ wx.request (ส่งแบบ JSON ปกติ) ---
                wx.request({
                    url: `${config.PublicIPCallApiGoBackend}/chat/creategroup`,
                    method: 'POST',
                    header: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        'name': name
                    },
                    success: (res) => this.handleSuccess(res),
                    fail: (err) => this.handleFail(err)
                });
            }
        },

        // แยก Function จัดการผลลัพธ์เพื่อลด Code ซ้ำซ้อน
        handleSuccess(res) {
            wx.hideLoading();
            // wx.uploadFile คืนค่าเป็น String ต้อง JSON.parse เอง
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            wx.showToast({
                title: '群组已创建完成。',
                icon: 'success'
            });

            this.setData({
                opencreategroup : false
            })

            wx.switchTab({
                url : '/pages/chat/chat'
            })

        },

        handleFail(err) {
            wx.hideLoading();
            // console.error('เกิดข้อผิดพลาด:', err);
            wx.showToast({
                title: '创建群组失败。',
                icon: 'none'
            });
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


                this.setData({
                    images: file.tempFilePath
                })


            } catch (err) {
                wx.showToast({
                    title: '请联系您的服务提供商。',
                    icon: 'none'
                })
                return
            }
        },


    }
})