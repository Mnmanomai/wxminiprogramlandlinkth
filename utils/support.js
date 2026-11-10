// utils/support.js — how to reach Landlink: three phone numbers, the Chinese ones always first (Chinese/Cantonese · Chinese · Thai) plus the WeChat customer-service chat
// (the open-type="contact" buttons). Every "contact us" point of the app uses this list.
const config = require('../config')

const EN = config.language === 'en'

// number = what is dialled (Chinese mobiles with +86 so the call works from Thailand and from China); shown = what the user reads
const PHONES = [
  { label: EN ? 'Chinese (Cantonese)' : '中文（粤语）', number: '+8613751858071', shown: '137 5185 8071' },
  { label: EN ? 'Chinese' : '中文', number: '+8618620135968', shown: '186 2013 5968' },
  { label: EN ? 'Thai' : '泰语', number: '+66641648899', shown: '+66 64 164 8899' }
]

exports.PHONES = PHONES

exports.call = (number) => wx.makePhoneCall({ phoneNumber: number, fail() { /* the user cancelled the call sheet */ } })

// action sheet with the three numbers; picking one dials it
exports.callSheet = () => {
  wx.showActionSheet({
    itemList: PHONES.map((p) => p.label + '  ' + p.shown),
    success(res) { exports.call(PHONES[res.tapIndex].number) }
  })
}
