// utils/chatapi.js — the mini program's chat is the website's chat: one room per asker × listing (customer-chat endpoints + the
// /ws/customer-chat/:id socket). The signed-in user is a customer, or — for a real agent — an agent; both can ASK about a listing.
const config = require('../config')

const user = () => wx.getStorageSync('usersdetail') || {}

// the first request may run before the login in app.onLaunch has finished
async function ready() {
  const app = getApp()
  if (app && app.loginPromise) {
    try { await app.loginPromise } catch (e) { /* the request below reports it */ }
  }
}

function request(method, path, data) {
  return ready().then(() => new Promise((resolve, reject) => {
    wx.request({
      url: config.PublicIPCallApiGoBackend + path,
      method,
      data,
      header: { Authorization: 'Bearer ' + user().token, 'content-type': 'application/json' },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(res.data)
        const body = res.data || {}
        // 410 / code room_terminated: an administrator closed this chat
        reject({ status: res.statusCode, code: body.code, message: body.error, trace: body.trace_id, terminated: res.statusCode === 410 || body.code === 'room_terminated' })
      },
      fail(err) { reject({ status: 0, message: err.errMsg }) }
    })
  }))
}

// open (or reuse) my chat about a listing → room detail { id, asset_id, asset_name, asset_image, agent_name, my_side, ... }
exports.startRoom = (assetId) => request('POST', '/customer-chat/start', { asset_id: assetId }).then((r) => r.data)
exports.getRoom = (roomId) => request('GET', '/customer-chat/' + roomId).then((r) => r.data)
exports.getMessages = (roomId, beforeId, limit) =>
  request('GET', '/customer-chat/' + roomId + '/messages?limit=' + (limit || 30) + (beforeId ? '&before_id=' + beforeId : '')).then((r) => r.data || [])
exports.markRead = (roomId) => request('POST', '/customer-chat/' + roomId + '/read').catch(() => {})
exports.cancelMessage = (roomId, messageId) => request('DELETE', '/customer-chat/' + roomId + '/messages/' + messageId)

// every chat I am in, newest first: the ones I started (customer or agent) + — for an agent — the ones I answer
exports.listRooms = async () => {
  const isAgent = user().role === 'agent'
  const [asked, answering] = await Promise.all([
    request('GET', '/customer-chat/asked-rooms').then((r) => r.data || []),
    isAgent ? request('GET', '/customer-chat/rooms').then((r) => r.data || []) : Promise.resolve([])
  ])
  const rows = asked.map((r) => ({
    id: r.id, asset_id: r.asset_id, asset_name: r.asset_name, asset_image: r.asset_image,
    who: r.agent_name, last_message: r.last_message, last_message_at: r.last_message_at, unread_count: r.unread_count
  })).concat(answering.map((r) => ({
    id: r.id, asset_id: r.asset_id, asset_name: r.asset_name, asset_image: '',
    who: r.agent_label || r.customer_name, last_message: r.last_message, last_message_at: r.last_message_at, unread_count: r.unread_count
  })))
  rows.sort((a, b) => (a.last_message_at < b.last_message_at ? 1 : -1))
  return rows
}

// the live socket of one room. handlers: onMessage(msg), onOpen(), onClose(code). Returns { send(text), close() }.
exports.connect = (roomId, handlers) => {
  const task = wx.connectSocket({
    url: config.PublicIPCallApiGoBackendnonhttp + '/ws/customer-chat/' + roomId,
    header: { Authorization: 'Bearer ' + user().token }
  })
  let open = false
  task.onOpen(() => { open = true; handlers.onOpen && handlers.onOpen() })
  task.onMessage((res) => {
    try { handlers.onMessage && handlers.onMessage(JSON.parse(res.data)) } catch (e) { /* not a chat message */ }
  })
  task.onClose((res) => { open = false; handlers.onClose && handlers.onClose(res.code) })
  task.onError(() => { open = false })
  return {
    isOpen: () => open,
    send: (text) => task.send({ data: JSON.stringify({ message: text }) }),
    close: () => { try { task.close({}) } catch (e) { /* already closed */ } }
  }
}

// "2026-11-09 14:03:11" (server time) → "14:03" today, "11-09 14:03" otherwise
exports.shortTime = (raw) => {
  if (!raw) return ''
  const s = String(raw).replace('T', ' ')
  const day = s.slice(0, 10)
  const now = new Date()
  const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
  return day === today ? s.slice(11, 16) : s.slice(5, 10) + ' ' + s.slice(11, 16)
}
