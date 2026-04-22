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
    // ... data ของ serchflow
    selectedLang: 'cn',
    isGatheringData: false,
    searchStep: 0,
    tempRequiment: {},
    allFlows: {
      th: [{
          field: 'deal_type',
          question: 'สวัสดีครับ! ยินดีที่ได้ดูแลคุณลูกค้าครับ ไม่ทราบว่าวันนี้มองเป็นการ "ซื้อ" หรือ "เช่า" ดีครับ?',
          options: ['ซื้อ', 'เช่า', 'ซื้อและเช่า']
        },
        {
          field: 'prop_type',
          question: 'ต้องการมองหาทรัพย์ประเภทไหนเป็นพิเศษครับ?',
          options: ['ที่ดิน', 'โกดัง', 'โรงงาน']
        },
        {
          field: 'ieat',
          question: 'สนใจทรัพย์ที่ตั้งอยู่ "ใน" หรือ "นอก" นิคมอุตสาหกรรมครับ?',
          options: ['ในนิคมฯ', 'นอกนิคมฯ', 'ได้ทั้งหมด']
        },
        {
          field: 'color_zone',
          question: 'มีผังสีที่กำหนดไว้ในใจไหมครับ? (ถ้าไม่แน่ใจเลือก "ม่วง" สำหรับอุตสาหกรรมได้ครับ)',
          options: ['ม่วง', 'ม่วงลาย', 'เหลือง', 'ส้ม']
        },
        {
          field: 'province',
          question: 'สนใจในจังหวัดไหนเป็นพิเศษไหมครับ? (ระบุในตัวเลือกหรือพิมพ์บอกผมได้เลย)',
          options: ['ชลบุรี', 'ระยอง', 'ฉะเชิงเทรา', 'สมุทรปราการ', 'อยุธยา', 'ปราจีนบุรี', 'สระบุรี', 'ปทุมธานี'],
          allowInput: true
        },
        {
          field: 'budget_buy',
          question: 'สำหรับงบประมาณในส่วนของการ "ซื้อ" ตั้งเป้าไว้ที่เท่าไหร่ครับ?',
          options: ['ไม่เกิน 20 ล้าน', '20-50 ล้าน', '50-100 ล้าน', '100 ล้านขึ้นไป'],
          condition: (req) => req.deal_type !== 'เช่า'
        },
        {
          field: 'budget_rent',
          question: 'ส่วนงบประมาณการ "เช่า" ต่อเดือน มองไว้ประมาณเท่าไหร่ครับ?',
          options: ['ไม่เกิน 1 แสน', '1-3 แสน', '3 แสนขึ้นไป'],
          condition: (req) => req.deal_type !== 'ซื้อ'
        },
        {
          field: 'free_zone',
          question: 'จำเป็นต้องใช้สิทธิประโยชน์ Free Zone ด้วยไหมครับ?',
          options: ['ต้องการ', 'ไม่ต้องการ', 'ได้ทั้งคู่']
        }
      ],
      en: [{
          field: 'deal_type',
          question: 'Hello! I\'m here to help you find the best property. Are you looking to "Buy" or "Rent"?',
          options: ['Buy', 'Rent', 'Both']
        },
        {
          field: 'prop_type',
          question: 'What type of property are you interested in?',
          options: ['Land', 'Warehouse', 'Factory']
        },
        {
          field: 'ieat',
          question: 'Would you prefer inside or outside an Industrial Estate?',
          options: ['Inside', 'Outside', 'Both']
        },
        {
          field: 'color_zone',
          question: 'Any specific Land Zone Color in mind?',
          options: ['Purple', 'Purple-Dot', 'Yellow', 'Orange']
        },
        {
          field: 'province',
          question: 'Which province are you focusing on? (You can select or type below)',
          options: ['Chonburi', 'Rayong', 'Chachoengsao', 'Samut Prakan', 'Ayutthaya', 'Prachinburi', 'Saraburi', 'Pathum Thani'],
          allowInput: true
        },
        {
          field: 'budget_buy',
          question: 'What is your planned budget for "Buying"?',
          options: ['Under 20M THB', '20M - 50M THB', '50M - 100M THB', 'Over 100M THB'],
          condition: (req) => req.deal_type !== 'Rent'
        },
        {
          field: 'budget_rent',
          question: 'What is your monthly budget for "Renting"?',
          options: ['Under 100k', '100k - 300k', 'Over 300k'],
          condition: (req) => req.deal_type !== 'Buy'
        },
        {
          field: 'free_zone',
          question: 'Do you require a Free Zone privilege?',
          options: ['Yes', 'No', 'Either']
        }
      ],
      cn: [{
          field: 'deal_type',
          question: '您好！很高兴为您服务。请问您是想“购买”还是“租赁”？',
          options: ['购买', '租赁', '两者均可']
        },
        {
          field: 'prop_type',
          question: '您对哪种类型的资产感感兴趣？',
          options: ['土地', '仓库', '工厂']
        },
        {
          field: 'ieat',
          question: '您倾向于工业园区“内”还是“外”？',
          options: ['园区内', '园区外', '两者均可']
        },
        {
          field: 'color_zone',
          question: '您对土地规划用途（颜色）有要求吗？',
          options: ['紫色', '紫白相间', '黄色', '橙色']
        },
        {
          field: 'province',
          question: '您感兴趣哪个省份？（可直接选择或在下方输入）',
          options: ['春武里府 (Chonburi)', 
          '罗勇府 (Rayong)', 
          '北柳府 (Chachoengsao)', 
          '北榄府 (Samut Prakan)', 
          '阿瑜陀耶 (Ayutthaya)', 
          '巴真府 (Prachinburi)', 
          '北标府 (Saraburi)', 
          '巴吞他尼府 (Pathum Thani)'],
          allowInput: true
        },
        {
          field: 'budget_buy',
          question: '关于“购买”的预算，您的范围是多少？',
          options: ['2000万泰铢以下', '2000万-5000万', '5000万-1亿', '1亿泰铢以上'],
          condition: (req) => req.deal_type !== '租赁'
        },
        {
          field: 'budget_rent',
          question: '关于“租赁”，您的月预算是多少？',
          options: ['5万以下', '5万-15万', '15万以上'],
          condition: (req) => req.deal_type !== '购买'
        },
        {
          field: 'free_zone',
          question: '您需要自贸区（Free Zone）权限吗？',
          options: ['需要', '不需要', '两者均可']
        }
      ]
    }

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
      isNewChat: true,
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
      messages: [],
      isNewChat: false
    })

    // ดึงประวัติแชท
    this.loadOldmsg(chatId)
  },
  createNewChatLogic: function() {
    const newId = this.initNewChat();
    wx.setStorageSync('current_chat_id', newId);
    
    const fakeNewChat = {
        session_id: newId,
        title: "การสนทนาใหม่..."
    };
        const updatedHistory = [fakeNewChat, ...this.data.chatHistory];
        this.setData({
        currentChatId: newId,
        isNewChat: true,
        messages: [],
        chatHistory: updatedHistory,
        isSidebarOpen: false,
        lastId: 'bottom-anchor'
    });
    return newId;
},

  // startNewChat
  startNewChat: function () {
    this.createNewChatLogic();
    wx.showToast({
                  //เริ่มแชทใหม่
        title: '开始新的聊天',
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
    if (this.data.isGatheringData && this.data.searchStep >= 0) {
      let {
        searchStep,
        selectedLang,
        allFlows,
        tempRequiment,
        messages
      } = this.data;
      if (!messages) messages = [];

      const currentFlow = allFlows[selectedLang];
      const currentTask = currentFlow[searchStep];

      if (currentTask) {
        tempRequiment[currentTask.field] = msg;
        const newMessage = [...messages, {
          role: "user",
          content: msg
        }];

        this.setData({
          tempRequiment,
          messages: newMessage,
          inputVal: '',
          searchStep: searchStep + 1,
          lastId: `msg-${newMessage.length -1}`
        }, () => {
          this.nextSearchStep();
        })
        return;
      }
    }





    // แชทปกติ
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
    // console.log(userMsg);
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
            content: item.content,
            assets: item.assets || [],
            time: item.time || ''
          }));
          this.setData({
            messages: history,
            lastId: 'bottom-anchor'
          }, () => {
            // เลื่อนลงไปล่างสุดหลังโหลดประวัติเสร็จ
            setTimeout(() => {
              this.setData({
                lastId: 'bottom-anchor'
              });
            }, 300);
          });
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
    const chatId = e.detail.chatid;
    const jwtToken = this.data.userToken;

    wx.showModal({
        title: '确认删除',
        content: '您想删除此对话历史记录吗？',
        success: (res) => {
            if (res.confirm) {
                wx.request({
                    url: `${config.apitestAI}/delete-chat/${chatId}`,
                    method: 'POST',
                    data: { token: jwtToken },
                    success: (response) => {
                        if (response.data.status === "success") {
                            // 1. กรองแชทที่ลบออกไปจาก List ก่อน
                            const filteredHistory = this.data.chatHistory.filter(item => item.session_id !== chatId);
                            
                            // 2. อัปเดต List ที่กรองแล้วลง Data
                            this.setData({ chatHistory: filteredHistory }, () => {
                                // 3. ถ้าลบแชทที่คาอยู่ ให้สร้างแชทใหม่ต่อทันที
                                if (chatId === this.data.currentChatId) {
                                    this.createNewChatLogic();
                                }
                                
                                // โชว์แค่ Toast เดียวคือลบสำเร็จ
                                wx.showToast({
                                  // ลบเรียบร้อยแล้ว
                                    title: '已删除完成',
                                    icon: 'success'
                                });
                            });
                        }
                    }
                });
            }
        }
    });
},

  // เสริช
  startLandSearch: function () {
    const welcomeMsg = {
      role: "ai",
      content: "กรุณาเลือกภาษา / Please select language / 请选择语言",
      options: ['ไทย', 'English', '中文'],
      isLanguageSelection: true
    }

    this.setData({
      messages: [...this.data.messages, welcomeMsg],
      isGatheringData: true,
      searchStep: -1, // -1 คือขั้นตอนเลือกภาษา
      tempRequiment: {},
      lastId: 'bottom-anchor'
    });
    // this.nextSearchStep();
  },
  nextSearchStep: function () {
    const {
      searchStep,
      selectedLang,
      allFlows,
      tempRequiment
    } = this.data;

    if (searchStep === -1 || !allFlows[selectedLang]) return;
    const currentFlow = allFlows[selectedLang];

    if (searchStep >= currentFlow.length) {
      this.finishSearchAndCallAI();
      return;
    }



    const currentTask = currentFlow[searchStep];
    if (currentTask.condition && !currentTask.condition(tempRequiment)) {
      // console.log(`ข้ามข้อ ${currentTask.field} ไม่ตรงเงื่อนไข`);
      this.setData({
        searchStep: searchStep + 1
      }, () => {
        this.nextSearchStep();
      });
      return
    }
    const botMsg = {
      role: "ai",
      content: currentTask.question,
      options: currentTask.options,
      isBotlogic: true,
      allowInput: currentTask.allowInput || false
    };
    this.setData({
      messages: [...this.data.messages, botMsg],
      lastId: 'bottom-anchor'
    });

  },
  handleOptionClick: function (e) {
    // const val = e.currentTarget.dataset.val;
    // const msgIdx = e.currentTarget.dataset.msgIdx;

    const {
      val,
      msgIdx
    } = e.currentTarget.dataset;

    let {
      searchStep,
      selectedLang,
      allFlows,
      messages,
      tempRequiment
    } = this.data;


    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].options) {
        messages[i].options = null;
        break;
      }
    }
    // ขั้นตอนเลือกภาษา
    if (searchStep === -1) {
      let lang = 'th';
      if (val === 'English') lang = 'en';
      if (val === '中文') lang = 'cn';
      selectedLang = lang;
      searchStep = 0;
    } else {
      const currentFlow = allFlows[selectedLang];
      if (currentFlow && allFlows[selectedLang]) {
        const field = currentFlow[searchStep].field;
        tempRequiment[field] = val;
        searchStep++;
      }

    }
    const newMessages = [...messages, {
      role: "user",
      content: val
    }];
    this.setData({
      selectedLang,
      searchStep,
      tempRequiment,
      messages: newMessages,
      lastId: `msg-${newMessages.length -1}`
    }, () => {
      // console.log("Current Step after click:", this.data.searchStep);
      this.nextSearchStep(); // ไปเริ่มข้อ 1 ของภาษานั้นๆ
    });
  },

  finishSearchAndCallAI: function () {
    const req = this.data.tempRequiment;
    const jwtToken = this.data.userToken;

    // console.log(req);


    const summaryMsg = {
      role: "ai",
      content: `กำลังวิเคราะห์เงื่อนไขและค้นหาทรัพย์ที่เหมาะสมในระบบ LandLink ให้สักครู่นะครับ...`,
      isLoading: true
    };

    const newMessages = [...this.data.messages, summaryMsg];

    this.setData({
      messages: newMessages,
      isGatheringData: false,
      lastId: `msg-${newMessages.length - 1}`
    });
    wx.request({
      url: `${config.apitestAI}/chat`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      data: {
        session_id: this.data.currentChatId,
        token: jwtToken,
        user_type: "Agent",
        query_data: req,
        lang: this.data.selectedLang,
        message: "ช่วยวิเคราะห์และแนะนำทรัพย์ตามเงื่อนไขนี้",
      },
      success: (res) => {
        if (res.data && res.data.answer) {
          const finalMessages = this.data.messages.filter(m => !m.isLoading);
          const updatedMessages = [...finalMessages, {
            role: "ai",
            content: res.data.answer,
            assets: res.data.assets || []
          }];
      
          this.setData({
            messages: updatedMessages,
            lastId: 'bottom-anchor'
          }, () => {
          
            if (updatedMessages.length <= 2) {
              this.getChatlist();
            }
          });
      
          setTimeout(() => {
            this.setData({ lastId: 'bottom-anchor' });
          }, 300);
        }
      },
      fail: (err) => {
        console.error("API Error:", err);
        const finalMessages = this.data.messages.filter(m => !m.isLoading);
        this.setData({
          messages: [...finalMessages, {
            role: "ai",
            content: "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ"
          }],
          lastId: 'bottom-anchor'
        });
      }
    });
  },
  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id; // ดึง id จาก data-id ใน wxml
    if (id) {
      wx.navigateTo({
        url: `../assetdetail/assetdetail?id=${id}`,
        success: () => {
          // console.log('Navigated to property:', id);
        },
        fail: (err) => {
          // console.error('Navigation failed:', err);
          wx.showToast({
            title: 'Cannot open page',
            icon: 'none'
          });
        }
      });
    }
  }

});