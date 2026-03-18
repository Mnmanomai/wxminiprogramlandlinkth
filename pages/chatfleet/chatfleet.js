// pages/chatfleet/chatfleet.js
const config = require("../../config");
Page({

    data: {
        datapost: [],
        groupId: null,
        Images: null,
        assetNo: null,
        textdetail: "",
        chatList: [],
        lastMessageId: "",
        firstMessageId : "",
        messages: [],
        triggered: false,
        page: 1
    },

    async onLoad(options) {
        const gropuid = options.id
        const token = wx.getStorageSync('usersdetail')
        this.setData({
            groupId: gropuid
        })
        // await this.getDataPicture();

        this.socketTask = wx.connectSocket({
            url: `ws://${config.PublicIPCallApiGoBackendnonhttp}/ws/${gropuid}`,
            header: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token.token}`
            },
            success: () => {
                console.log('Socket connecting...');
            }
        })

        this.socketTask.onOpen((res) => {
            console.log('WebSocket Connected!');
        });

        this.socketTask.onMessage((res) => {
            console.log("Raw data from server:", res.data); // จะเห็นเป็น string

            try {
                // 1. แปลง string ให้เป็น Object
                const dataObj = JSON.parse(res.data);
                console.log("Parsed Object:", dataObj);

                // 2. นำ Object ที่ได้ไปใส่ใน chatList (หรือ messages ของคุณ)
                // แนะนำให้ใช้ชื่อตัวแปรที่ตรงกับใน WXML เช่น chatList
                this.setData({
                    chatList: [...this.data.chatList, dataObj]
                }, () => {
                    // 3. เลื่อนหน้าจอลงล่างสุดเมื่อข้อความใหม่มา
                    this.scrollToBottom();
                });

            } catch (e) {
                console.error("Parse JSON error:", e);
                // กรณี server ส่งมาเป็น string ธรรมดาที่ไม่ใช่ JSON
            }
        });

        this.socketTask.onClose(() => console.log('Socket Closed'));
        this.socketTask.onError((err) => console.error('Socket Error:', err));

        await this.FetchListChatFirst(gropuid)

    },

    async onRefresh() {
        if (this._freshing) return;
        this._freshing = true;

        if (!this.data.triggered) {
            this.setData({
                triggered: true
            });
        }

        let lastmsg = this.data.firstMessageId
        let gropuid =  this.data.groupId
        // 2. เรียก API โหลดข้อมูลเก่า (ตัวอย่าง)
        try {
            const response = await this.ReqgetChatDetail(gropuid,lastmsg)
            if (response.data){
                let newList = [...this.data.chatList]
                newList = [...response.data,...this.data.chatList]
                this.setData({
                    chatList: newList,
                    firstMessageId: response.data[0].id,
                    
                })
            }
            this.setData({
                triggered: false 
            }) 
            this._freshing = false;
            
        } catch (e) {
            this.setData({
                triggered: false 
            }) 
            this._freshing = false;
        }
    },

    async FetchListChatFirst(groupid) {
        try {
            const response = await this.ReqgetChatDetail(groupid,0)
            let newList = [...this.data.chatList]
            newList = [...this.data.chatList, ...response.data]
            this.setData({
                chatList: newList,
                firstMessageId: newList[0].id,
            }, () => {
                this.scrollToBottom();
            });
        } catch (e) {
            console.error("Parse JSON error:", e);
        }
    },

    scrollToBottom() {
        const lastIndex = this.data.chatList.length - 1;
        if (lastIndex >= 0) {
            this.setData({
                // ใส่ msg- ข้างหน้าให้ตรงกับ WXML
                lastMessageId: "msg-" + this.data.chatList[lastIndex].id
            });
        }
    },

    onReady() {

    },

    async onShow() {
        // await this.reloadData()
    },

    onHide() {

    },

    onUnload() {

    },

    onPullDownRefresh() {},

    onReachBottom() {

    },

    // Get Chat Group First
    async ReqgetChatDetail(groupid,lastid) {
        const token = wx.getStorageSync("usersdetail")
        let lastidpath = lastid != 0 ? `?lastid=${lastid}`: ""
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.PublicIPCallApiGoBackend}/community/chat/${groupid}${lastidpath}`,
                method: 'GET',
                header: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token.token
                },
                success(res) {
                    resolve(res.data)
                },
            })
        })
    },

    // Setting Value on Varian
    setTextdetail(e) {
        this.setData({
            textdetail: e.detail.value
        });
    },

    // Send Chat To Server
    async sendChat() {
        if (!this.data.textdetail.trim()) return; // ป้องกันส่งข้อความว่าง

        const messagePayload = {
            text: this.data.textdetail,
            time: new Date().toLocaleTimeString(),
            // คุณสามารถใส่ข้อมูลเพิ่มได้ เช่น avatar หรือ userName
        };

        // ส่งผ่าน WebSocket
        if (this.socketTask && this.socketTask.readyState === 1) { // 1 คือสถานะ OPEN
            this.socketTask.send({
                data: JSON.stringify(messagePayload),
                success: () => {
                    this.setData({
                        textdetail: ''
                    });
                },
                fail: (err) => {
                    console.error("Send failed:", err);
                }
            });
        } else {
            wx.showToast({
                title: 'การเชื่อมต่อหลุด',
                icon: 'none'
            });
        }
    },

    // Tap For Self Message 
    bindmetap() {
        wx.showActionSheet({
            itemList: [
                'unsentchat'
            ],
            success(res) {
                if (res.tapIndex == 0) {
                    console.log(res.tapIndex)
                }
            }
        })
    },

    // async reloadData() {
    //     if (!this.data.groupId) return;
    //     try {
    //         const data = await this.getDataFeed(this.data.groupId)
    //         console.log(data)
    //         this.setData({
    //             datapost: data.posts,
    //             groupName: data.group_name,
    //             assetNo: data.asset_no,
    //         })
    //     } catch (err) {
    //         console.error("Reload error:", err)
    //     }
    // },
    // async getDataFeed(id) {
    //     const token = await new Promise((resolve, reject) => {
    //         wx.getStorage({
    //             key: 'usersdetail',
    //             success(res) {
    //                 resolve(res.data.token)
    //             },
    //             fail(err) {
    //                 reject(err)
    //             }
    //         })
    //     });

    //     return new Promise((resolve, reject) => {
    //         wx.request({
    //             url: `${config.PublicIPCallApiGoBackend}/community/post/group/${id}`,
    //             method: 'GET',
    //             header: {
    //                 'Authorization': 'Bearer ' + token
    //             },
    //             success(res) {
    //                 resolve(res.data)
    //             },
    //             fail(err) {
    //                 reject(err)
    //             }
    //         })
    //     })
    // },

    // async getDataPicture() {
    //     const picture = await new Promise((resolve, reject) => {
    //         wx.getStorage({
    //             key: 'usersdetail',
    //             success(res) {
    //                 resolve(res.data.picture)
    //             },
    //             fail(err) {
    //                 reject(err)
    //             }
    //         })
    //     });
    //     this.setData({
    //         Images: picture
    //     })
    // },
})