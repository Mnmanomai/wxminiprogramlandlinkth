const app = getApp();
const config = require("../../config");
Page({
  data: {
    isSidebarOpen: false, // สถานะเปิด/ปิด Sidebar
    chatHistory: [],
    messages: [],
    inputVal: '',
    currentChatId: '',
    lastId: '',
    userToken: '',
    // ... data อื่นๆ
  },

  async onLoad() {
    // console.log("kao");
    const res = await app.localStorageGet('usersdetail');
    if (res !== "no data search") {
      this.setData({
        userToken: res.data.token
      });
      this.getChatlist()
    }
    let chatId = wx.getStorageSync('current_chat_id');
    if (!chatId) {
      this.initNewChat();
    } else {
      this.setData({
        currentChatId: chatId
      });
      this.loadOldmsg(chatId)
    }
  },
  initNewChat: function () {
    const newChatId = "chat_" + Date.now();
    wx.setStorageSync('current_chat_id', newChatId);
    this.setData({
      currentChatId: newChatId,
      messages: []
    })
    // console.log(newChatId);
    return newChatId
  },

  // getChatlist: function () {
  //   const mockHistory =[
  //     {id:'1',title:'question1'},
  //     {id:'2',title:'question2'}
  //   ]
  // },
  // สลับsidebar
  toggleSidebar: function () {
    this.setData({
      isSidebarOpen: !this.data.isSidebarOpen
    });
  },

  // ฟังก์ชันสลับแชท (สำหรับ Component ai-history เรียกใช้)
  switchChat: function (e) {
    const chatId = e.detail.chatid;

    this.setData({
      currentChatId: chatId,
      isSidebarOpen: false,
      messages: []
    })

    // ดึงประวัติแชท
    this.loadOldmsg(chatId)
  },
  // startNewChat
  startNewChat: function () {
    const newId = this.initNewChat();
    wx.setStorageSync('current_chat_id', newId);
    // console.log(newId);
    const fakeNewChat = {
      session_id: newId,
      title: "การสนทนาใหม่..."
    };
    const updatedHistory = [fakeNewChat, ...this.data.chatHistory];
    this.setData({
      currentChatId: newId,
      messages: [],
      chatHistory: updatedHistory,
      isSidebarOpen: false,
      lastId: 'bottom-anchor'
    });
    wx.showToast({
      title: 'เริ่มแชทใหม่',
      icon: 'none'
    });
  },
  //พิมพ์ส่งข้อความ
  onInput: function (e) {
    // console.log(e);
    this.setData({
      inputVal: e.detail.value
    });
  },
  handleSend: function () {
    const msg = this.data.inputVal.trim();
    if (!msg) return;


    const updateMsg = [...this.data.messages, {
      role: "user",
      content: msg
    }];
    this.setData({
      messages: updateMsg,
      inputVal: '',
      lastId: 'bottom-anchor'
    })

    // เอาคำถามไปถาม ai
    this.askAI(msg)
  },
  askAI: function (userMsg) {
    console.log(userMsg);
    const jwtToken = this.data.userToken;
    const newMessage = [
      ...this.data.messages,
      {
        role: "ai",
        content: "",
        isLoading: true
      },

    ];
    this.setData({
      messages: newMessage,
      inputText: '',
      lastId: 'bottom-anchor'
    })

    wx.request({
      url: `${config.apitestAI}/chat`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        // ส่งแบบมาตรฐาน Authorization Header
        'Authorization': `Bearer ${jwtToken}`
      },
      data: {
        token: jwtToken,
        user_type: "Agent",
        message: userMsg,
        session_id: this.data.currentChatId
      },
      success: (res) => {
        if (res.data.status === "success") {
          const aiAnswer = res.data.answer;
          let currentMsgs = [...this.data.messages];
          if (currentMsgs.length > 0 && currentMsgs[currentMsgs.length - 1].isLoading) {
            currentMsgs.pop();
          }

          const finalMsgs = [...currentMsgs, {
            role: "ai",
            content: aiAnswer
          }];
          this.setData({
            messages: finalMsgs,
            lastId: 'bottom-anchor'
          }, () => {
            // เช็คเพื่ออัปเดต Sidebar หลังจาก render ข้อความเสร็จ
            if (finalMsgs.length <= 2) {
              this.getChatlist();
            }
          });
        }
      },
      fail: () => {
        let currentMsgs = this.data.messages;
        currentMsgs.pop();
        this.setData({
          messages: currentMsgs
        });
        wx.showToast({
          title: 'เกิดข้อผิดพลาด',
          icon: 'none'
        });
      }
    });
  },
  loadOldmsg: function (session_id) {
    // console.log("eiei");
    const url = `${config.apitestAI}/get-history/${session_id}`
    const jwtToken = this.data.userToken;
    if (!jwtToken) return;
    wx.request({
      url: `${config.apitestAI}/get-history/${session_id}`,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      data: {
        token: jwtToken,
        user_type: "Agent",
      },
      success: (res) => {
        if (res.data.status === "success") {
          const history = res.data.history.map(item => ({
            role: item.role,
            content: item.content
          }));
          this.setData({
            messages: history,
            // lastId: 'bottom-anchor'
          })

        }
      }

    })

  },
  getChatlist: function () {
    const jwtToken = this.data.userToken;
    if (!jwtToken) return
    wx.request({
      url: `${config.apitestAI}/get-all-chats`,
      method: 'POST',
      data: {
        token: jwtToken,
        user_type: "Agent"
      },
      success: (res) => {
        if (res.data.status === "success") {
          this.setData({
            chatHistory: res.data.chats

          })
        }
      },
      fail: (err) => {
        console.error("ไม่สำเร็จ");
      }
    })

  },
  deleteChat: function (e) {
    // console.log("kao");
    const chatId = e.detail.chatid
    const jwtToken = this.data.userToken;
    // const url = `${config.apitestAI}/delete-chat/${chatId}`;

    // console.log(url);

    wx.showModal({
      title: '确认删除',
      content: '您想删除此对话历史记录吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${config.apitestAI}/delete-chat/${chatId}`,
            method: 'POST',
            data: {
              token: jwtToken,
            },
            success: (res) => {
              if (res.data.status === "success") {
                const aiAnswer = res.data.answer;
                let currentMsgs = [...this.data.messages];
                if (currentMsgs.length > 0 && currentMsgs[currentMsgs.length - 1].isLoading) {
                  currentMsgs.pop()
                }
                const finalMsgs = [
                  ...currentMsgs, {
                    role: "ai",
                    content: aiAnswer
                  }
                ];

                this.setData({
                  messages: finalMsgs,
                  lastId: 'bottom-anchor'
                }, () => {
                  if (finalMsgs.length <= 2) {
                    this.getChatlist();
                  }
                })
              }



            }

          })


        }

        if (res.confirm) {

        }
      }
    })




  }
});