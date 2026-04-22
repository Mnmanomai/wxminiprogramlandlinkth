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
        firstMessageId: "",
        messages: [],
        triggered: false,
        groupPicture: "",
        groupName: "",
        page: 1,
        language: config.language,
        FindAssetPageContainer: false,
        AssetInChatPageContainer : false,
    },

    async onLoad(options) {
        const gropuid = options.id
        const token = wx.getStorageSync('usersdetail')
        this.setData({
            groupId: gropuid,
        })
        // await this.getDataPicture();

        this.socketTask = wx.connectSocket({
            url: `${config.PublicIPCallApiGoBackendnonhttp}/ws/${gropuid}`,
            header: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token.token}`
            },
            success: () => {
                // console.log('Socket connecting...');
            }
        })

        this.socketTask.onOpen((res) => {
            // console.log('WebSocket Connected!');
        });

        this.socketTask.onMessage((res) => {

            try {
                const dataObj = JSON.parse(res.data);
                let newlist = this.data.chatList
                if (dataObj.status == 1) {
                    newlist.map((value, index) => {
                        if (dataObj.unsentid == value.id) {
                            newlist[index].status = 1
                            newlist[index].text = ""
                            newlist[index].userName = ""
                        }
                    })
                    this.setData({
                        chatList: newlist,
                    })
                } else {
                    this.setData({
                        chatList: [...this.data.chatList, dataObj]
                    }, () => {
                        this.scrollToBottom();
                    });
                }

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
        let gropuid = this.data.groupId
        // 2. เรียก API โหลดข้อมูลเก่า (ตัวอย่าง)
        try {
            const response = await this.ReqgetChatDetail(gropuid, lastmsg)
            if (response.data) {
                let newList = [...this.data.chatList]
                newList = [...response.data, ...this.data.chatList]
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
            const response = await this.ReqgetChatDetail(groupid, 0)
            let newList = [...this.data.chatList]
            newList = [...this.data.chatList, ...response.data]
            // console.log(newList)
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
        await this.reloadData()
    },

    onHide() {

    },

    onUnload() {

    },

    onPullDownRefresh() {},

    onReachBottom() {

    },

    // Get Chat Group First
    async ReqgetChatDetail(groupid, lastid) {
        const token = wx.getStorageSync("usersdetail")
        let lastidpath = lastid != 0 ? `?lastid=${lastid}` : ""
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

    openFindasset() {
        this.setData({
            FindAssetPageContainer: true
        })
    },

    async getAsset(e){
      const idasset = e.detail.selectedIds
      await this.sendasset(idasset)
    },

    async sendasset(e) {
        // console.log(e)
        // console.log('sendasset')

        // const idasset = e.detail.selectedIds != undefined ? e.detail.selectedIds : e
        // console.log(idasset)
        let dataid = e.join(",")
        // console.log(dataid)
        // if (idasset) return;
        const messagePayload = {
            asset: dataid,
            time: new Date().toLocaleTimeString(),
        };

        if (this.socketTask && this.socketTask.readyState === 1) { // 1 คือสถานะ OPEN
            this.socketTask.send({
                data: JSON.stringify(messagePayload),
                success: () => {
                    this.setData({
                        FindAssetPageContainer: false
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
    bindlongmetap(e) {
        const that = this
        let id = e.currentTarget.id
        wx.showActionSheet({
            itemList: [
                'unsentchat'
            ],
            success(res) {
                if (res.tapIndex == 0) {
                    that.unsendMsg(id)
                }
            }
        })
    },

    unsendMsg(id) {
        // let id = e.currentTarget.id
        let result = parseInt(id.replace("msg-", ""));
        if (result == 0) return;
        const payloadsent = {
            unsentmsg: result
        }
        if (this.socketTask && this.socketTask.readyState === 1) {
            this.socketTask.send({
                data: JSON.stringify(payloadsent),
                success: () => {
                    // console.log("unsent message")
                },
                fail: (err) => {
                    // console.error("Send failed:", err);
                }
            });
        } else {
            wx.showToast({
                title: 'การเชื่อมต่อหลุด',
                icon: 'none'
            });
        }
    },

    // loadname for header 
    async reloadData() {
        if (!this.data.groupId) return;
        try {
            const data = await this.getHeaderChat(this.data.groupId)
            this.setData({
                groupPicture: data.data.grouppicture,
                groupName: data.data.groupname,
            })

            // console.log(this.data)
        } catch (err) {
            console.error("Reload error:", err)
        }
    },

    async getHeaderChat(ugroupid) {
        const token = await wx.getStorageSync("usersdetail")
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.PublicIPCallApiGoBackend}/chat/header/${ugroupid}`,
                method: 'GET',
                header: {
                    'Authorization': 'Bearer ' + token.token
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

    menubar() {
        wx.showActionSheet({
            itemList: [
                config.language == "zh" ? "群组简介" : "Flvorite Asset"
            ],
            success(res) {
                if (res.tapIndex == 0) {
                    that.goToGroupProfile();
                }
            },
            fail(res) {
                // console.log(res.errMsg)
            }
        })
    },

    // openAssetInChatPageContainer(){
    //   console.log("openAssetInChatPageContainer")
      
    //   this.setData({
    //     AssetInChatPageContainer : true
    //     // FindAssetPageContainer : true
    //   })
    //   console.log(this.data.AssetInChatPageContainer) 
    // },
})