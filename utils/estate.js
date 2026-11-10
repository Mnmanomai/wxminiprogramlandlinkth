// utils/estate.js — industrial estate directory (the website's /industrial pages): data helpers + display rules shared by the index
// section, the list page and the detail page. Data: public GET /industrial/list and /industrial/:id (no login).
const config = require('../config')

// Photos and logos are static files of the public website (landlink/public/industrial, /industrial-logo), not API data.
const SITE = 'https://www.landlinkth.com'
// placeholder for estates without a photo: a local jpg (the website's placeholder is a webp, which not every phone shows)
const FALLBACK_IMAGE = '/asset/industrail.jpg'

// IEAT estate id -> thumbnail file in the website's public/industrial (copy of its manifest.json; estates without an entry use the placeholder)
const MANIFEST = {
  "18": "18.png",
  "19": "19.png",
  "20": "20.png",
  "21": "21.png",
  "22": "22.png",
  "23": "23.png",
  "24": "24.png",
  "25": "25.png",
  "26": "26.png",
  "27": "27.png",
  "28": "28.png",
  "29": "29.png",
  "30": "30.png",
  "31": "31.png",
  "32": "32.png",
  "33": "33.png",
  "34": "34.png",
  "35": "35.png",
  "36": "36.png",
  "37": "37.png",
  "38": "38.png",
  "39": "39.png",
  "40": "40.png",
  "41": "41.png",
  "42": "42.png",
  "43": "43.png",
  "44": "44.png",
  "45": "45.png",
  "46": "46.png",
  "47": "47.png",
  "48": "48.png",
  "49": "49.png",
  "50": "50.png",
  "51": "51.png",
  "52": "52.png",
  "53": "53.png",
  "54": "54.png",
  "56": "56.png",
  "57": "57.png",
  "58": "58.png",
  "59": "59.png",
  "60": "60.png",
  "61": "61.png",
  "62": "62.png",
  "64": "64.png",
  "66": "66.png",
  "67": "67.png",
  "68": "68.png",
  "69": "69.png",
  "70": "70.png",
  "71": "71.png",
  "72": "72.png",
  "73": "73.png",
  "74": "74.png",
  "75": "75.png",
  "76": "76.png",
  "77": "77.png",
  "78": "78.png",
  "79": "79.png",
  "111": "111.png",
  "118": "118.png",
  "121": "121.png"
}

const get = (path) => new Promise((resolve, reject) => {
  wx.request({
    url: config.PublicIPCallApiGoBackend + path,
    method: 'GET',
    success(res) { res.statusCode === 200 ? resolve(res.data.data) : reject(res) },
    fail: reject
  })
})

exports.list = () => get('/industrial/list').then((d) => d || [])
exports.detail = (id) => get('/industrial/' + id)

exports.imageOf = (e) => (MANIFEST[e.ieat_estate_id] ? SITE + '/industrial/' + MANIFEST[e.ieat_estate_id] : FALLBACK_IMAGE)
exports.logoOf = (e) => (e.logo_url ? SITE + e.logo_url : '')

// name / province in the app language (zh: name_cn -> en -> th); falls back to the language that exists
exports.nameOf = (e) => {
  if (config.language === 'en') return e.name_en || e.name_th
  if (config.language === 'zh') return e.name_cn || e.name_en || e.name_th
  return e.name_th
}
exports.provinceOf = (e) => {
  if (config.language === 'en') return e.province_en || e.province
  if (config.language === 'zh') return e.province_zh || e.province
  return e.province
}

// Provinces shown first (Thai names, prefix match — same order as the website); the rest follow alphabetically
const PRIORITY = ['ชลบุรี', 'ระยอง', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'กรุงเทพ', 'พระนครศรีอยุธยา', 'สมุทรสาคร', 'สมุทรสงคราม']
const rank = (th) => { const i = PRIORITY.findIndex((p) => (th || '').indexOf(p) === 0); return i === -1 ? PRIORITY.length : i }
exports.sortByProvince = (rows) => rows.slice().sort((a, b) => rank(a.province) - rank(b.province) || String(a.province).localeCompare(String(b.province), 'th'))
