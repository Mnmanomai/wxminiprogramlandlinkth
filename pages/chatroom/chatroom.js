// pages/chatroom/chatroom.js — one chat room (the website's room): history over REST, live messages over the room socket.
const config = require('../../config')
const chatapi = require('../../utils/chatapi')

const RECONNECT_MS = 3000
const T = {
  closed: { zh: '此会话已被管理员关闭', en: 'This chat was closed by an administrator' },
  noAccess: { zh: '无法打开此会话', en: 'You cannot open this chat' },
  offline: { zh: '连接中…', en: 'Connecting…' },
  sendFail: { zh: '发送失败，请稍后重试', en: 'Could not send — try again' },
  cancel: { zh: '撤回', en: 'Unsend' }
}
const t = (k) => T[k][config.language === 'en' ? 'en' : 'zh']

Page({
  data: {
    language: config.language,
    room: null,
    messages: [],
    input: '',
    mySide: 'customer',
    connected: false,
    closedText: '', // set when the room is closed / not accessible: the input is replaced by this
    hasMore: true,
    loadingMore: false,
    scrollInto: ''
  },

  roomId: 0,
  socket: null,
  retry: null,
  stopped: false,

  async onLoad(options) {
    this.roomId = Number(options.id)
    this.stopped = false
    try {
      const room = await chatapi.getRoom(this.roomId)
      this.setData({ room, mySide: room.my_side || 'customer' })
      wx.setNavigationBarTitle({ title: room.agent_name || room.asset_name || 'Chat' })
      await this.loadFirstPage()
      chatapi.markRead(this.roomId)
      this.connect()
    } catch (e) {
      this.setData({ closedText: e && e.terminated ? t('closed') : t('noAccess') })
    }
  },

  onShow() {
    if (!this.socket && !this.stopped && this.data.room && !this.data.closedText) this.connect()
  },

  onHide() { this.disconnect() },
  onUnload() { this.stopped = true; this.disconnect() },

  disconnect() {
    clearTimeout(this.retry)
    if (this.socket) { this.socket.close(); this.socket = null }
    this.setData({ connected: false })
  },

  connect() {
    if (this.socket || this.stopped) return
    this.socket = chatapi.connect(this.roomId, {
      onOpen: () => this.setData({ connected: true }),
      onMessage: (m) => this.onIncoming(m),
      onClose: (code) => {
        this.socket = null
        this.setData({ connected: false })
        if (this.stopped) return
        if (code === 4004) return this.setData({ closedText: t('closed') }) // closed by an admin: never retry
        if (code === 4003) return this.setData({ closedText: t('noAccess') }) // not a member
        this.retry = setTimeout(() => this.connect(), RECONNECT_MS)
      }
    })
  },

  decorate(m) {
    return Object.assign({}, m, { mine: m.sender_type === this.data.mySide, time: chatapi.shortTime(m.created_at) })
  },

  async loadFirstPage() {
    const rows = await chatapi.getMessages(this.roomId, 0, 30) // newest first
    const messages = rows.slice().reverse().map((m) => this.decorate(m))
    this.setData({ messages, hasMore: rows.length >= 30 })
    this.toBottom()
  },

  async loadOlder() {
    const { messages, hasMore, loadingMore } = this.data
    if (!hasMore || loadingMore || messages.length === 0) return
    this.setData({ loadingMore: true })
    try {
      const firstId = messages[0].id
      const rows = await chatapi.getMessages(this.roomId, firstId, 30)
      const older = rows.slice().reverse().map((m) => this.decorate(m))
      this.setData({ messages: older.concat(messages), hasMore: rows.length >= 30, scrollInto: 'm' + firstId })
    } finally {
      this.setData({ loadingMore: false })
    }
  },

  onIncoming(m) {
    if (this.data.messages.some((x) => x.id === m.id)) return
    this.setData({ messages: this.data.messages.concat(this.decorate({ id: m.id, sender_type: m.sender_type, sender_id: m.sender_id, message: m.message, created_at: m.created_at })) })
    this.toBottom()
    chatapi.markRead(this.roomId) // the room is on screen
  },

  toBottom() {
    const n = this.data.messages.length
    if (n) this.setData({ scrollInto: 'm' + this.data.messages[n - 1].id })
  },

  onInput(e) { this.setData({ input: e.detail.value }) },

  send() {
    const text = (this.data.input || '').trim()
    if (!text || this.data.closedText) return
    if (!this.socket || !this.socket.isOpen()) return wx.showToast({ title: t('offline'), icon: 'none' })
    try {
      this.socket.send(text) // the server stores it and broadcasts it back to the room (that is what shows it)
      this.setData({ input: '' })
    } catch (e) {
      wx.showToast({ title: t('sendFail'), icon: 'none' })
    }
  },

  // long-press my own message → unsend (hidden from my view only; the other side keeps seeing it, as on the website)
  onLongPress(e) {
    const { id, mine } = e.currentTarget.dataset
    if (!mine) return
    wx.showActionSheet({
      itemList: [t('cancel')],
      success: async () => {
        try {
          await chatapi.cancelMessage(this.roomId, id)
          this.setData({ messages: this.data.messages.filter((x) => x.id !== id) })
        } catch (err) {
          wx.showToast({ title: t('sendFail'), icon: 'none' })
        }
      }
    })
  },

  openAsset() {
    const room = this.data.room
    if (room) wx.navigateTo({ url: '/pages/assetdetail/assetdetail?id=' + room.asset_id })
  }
})
