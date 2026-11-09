// pages/chat/chat.js — my chats (the website's rooms: one per listing I wrote about; an agent also sees the ones they answer)
const config = require('../../config')
const chatapi = require('../../utils/chatapi')

Page({
  data: {
    chats: [],
    loaded: false,
    failed: false,
    language: config.language
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: config.language === 'en' ? 'Chats' : '聊天' })
  },

  async onShow() {
    try {
      const rows = await chatapi.listRooms()
      this.setData({
        chats: rows.map((r) => Object.assign({}, r, { time: chatapi.shortTime(r.last_message_at) })),
        loaded: true,
        failed: false
      })
    } catch (e) {
      this.setData({ loaded: true, failed: true })
    }
  },

  openRoom(e) {
    wx.navigateTo({ url: '/pages/chatroom/chatroom?id=' + e.currentTarget.dataset.id })
  }
})
