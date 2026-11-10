// pages/search/search.js
const app = getApp();
const config = require("../../config");
const provinces = require("../internaldata/province.js").response // [{ province_id, province_name (zh), province_name_en }]
const districts = require("../internaldata/district.js").response // [{ district_id, district_name, district_name_en, province_id }]
// Popular provinces first, in the website's order: Chon Buri, Rayong, Chachoengsao, Prachin Buri, Pathum Thani, Samut Prakan,
// Bangkok, Ayutthaya, Samut Sakhon, Samut Songkhram (ids of internaldata/province.js); every other province follows in the data's order
const POPULAR = ['12', '53', '6', '49', '37', '57', '3', '46', '58', '59']

Page({
    data: {
        fetchData: [], // เก็บผลลัพธ์ทั้งหมด
        loading: false, // กำลังโหลดหรือไม่
        hasMore: true, // มีข้อมูลเหลือให้โหลดหรือไม่
        offset: 0,
        limit: 10,
        language: config.language,
        keywordInput: '', // text in the top input
        suggestions: [], // auto-complete rows [{ key, type, id, text, sub, badge }]
        showSuggest: false,
        showLoc: false, // place picker sheet
        locStep: 'province', // 'province' | 'district'
        locProvince: {}, // { id, name } while choosing its district
        locQuery: '',
        locList: [],
        locSel: {}, // district id -> true while choosing (several allowed)
        locSelCount: 0,
        near: false, // opened from a "near" search (estate / my location): the input is shown disabled
        maxItems: 0, // >0 = show only that many results in total (the "New release" card sends latest=20) and stop paging
        searchvalue: {
            selltype: 0,
            assettype: 0,
            order: 0,
            province: 0,
            district: 0,
            lat: '',
            long: '',
            distancemode: 0,
            radius: '',
            PropertyType: '',
            IEAT: '',
            Color: '',
            LandSizeStart: 0,
            LandSizeEnd: 0,
            PriceStart: 0,
            PriceEnd: 0,
            BuildingStart: 0,
            BuildingEnd: 0,
            Building: '',
        },

    },

    // swallows taps inside a popup so they do not reach its backdrop (an empty handler name is not reliable)
    noop() {},

    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '搜索',
        });
        // this.setData({
        //   selectmode : options.selltype
        // })

        const maxItems = Number(options.latest) || 0
        this.setData({
            maxItems: maxItems,
            limit: maxItems || 10, // one request is enough for a capped list
            'searchvalue.selltype': options.selltype ? options.selltype : '',
            'searchvalue.assettype': options.assettype ? options.assettype : '',
            'searchvalue.province': options.province ? options.province : '',
            'searchvalue.district': options.district ? options.district : '',
            'searchvalue.lat': options.lat ? options.lat : '',
            'searchvalue.long': options.long ? options.long : '',
            'searchvalue.distancemode': options.distancemode ? options.distancemode : '',
            'searchvalue.radius': options.radius ? options.radius : '', // km, with distancemode=1 (estate page: 20)
            'searchvalue.PropertyType': options.PropertyType ? options.PropertyType : '',
            'searchvalue.IEAT': options.IEAT ? options.IEAT : '',
            'searchvalue.Color': options.Color ? options.Color : '',
            'searchvalue.LandSizeStart': options.LandSizeStart ? options.LandSizeStart : '',
            'searchvalue.LandSizeEnd': options.LandSizeEnd ? options.LandSizeEnd : '',
            'searchvalue.PriceStart': options.PriceStart ? options.PriceStart : '',
            'searchvalue.PriceEnd': options.PriceEnd ? options.PriceEnd : '',
            'searchvalue.BuildingStart': options.BuildingStart ? options.BuildingStart : '',
            'searchvalue.BuildingEnd': options.BuildingEnd ? options.BuildingEnd : '',
            'searchvalue.Building': options.Building ? options.Building : '',
            'searchvalue.keyword': options.keyword ? options.keyword : '',
            // 'offset': options.keyword ? options.keyword : '0',
        })
        const near = !!options.distancemode && options.distancemode !== '0'
        this.setData({
            near: near,
            // the listings are defined by the radius around a place, so the input only says which place
            keywordInput: near ? (options.label || (config.language === 'en' ? 'Near this location' : '此位置附近')) : (options.keyword ? options.keyword : '')
        })
        this.Getsearch();
    },

    async Getsearch() {
        if (this.data.loading || !this.data.hasMore) return;
        this.setData({
            loading: true
        });

        let sentobject = {
            selltype: this.data.searchvalue.selltype || 0,
            assettype: this.data.searchvalue.assettype || 0,
            limit: this.data.limit || 0,
            order: this.data.searchvalue.order || 0,
            offset: this.data.offset || 0,
            province: this.data.searchvalue.province || '',
            district: this.data.searchvalue.district || '',
            lat: this.data.searchvalue.lat || '',
            long: this.data.searchvalue.long || '',
            distancemode: this.data.searchvalue.distancemode || '',
            radius: this.data.searchvalue.radius || '',
            PropertyType: this.data.searchvalue.PropertyType || '',
            IEAT: this.data.searchvalue.IEAT || '',
            Color: this.data.searchvalue.Color || '',
            LandSizeStart: this.data.searchvalue.LandSizeStart || '',
            LandSizeEnd: this.data.searchvalue.LandSizeEnd || '',
            PriceStart: this.data.searchvalue.PriceStart || '',
            PriceEnd: this.data.searchvalue.PriceEnd || '',
            BuildingStart: this.data.searchvalue.BuildingStart || '',
            BuildingEnd: this.data.searchvalue.BuildingEnd || '',
            Building: this.data.searchvalue.Building || '',
            keyword: this.data.searchvalue.keyword || '',
        }

        let Dataget = ""
        if (sentobject.keyword != "") {
                let recdata = await app.Getkeyword(sentobject);
                Dataget = (recdata || []).map(v => ({
                    ...v,
                    price: Number(v.price).toLocaleString('th-TH'),
                    RentCostPerMonthBath: Number(v.RentCostPerMonthBath).toLocaleString('th-TH'),
                    SalePriceBath: Number(v.SalePriceBath).toLocaleString('th-TH'),
                }));
                const rawCount = Dataget.length
                Dataget = app.filterHidden(Dataget) // listings the user hid
                Dataget.rawLength = rawCount
        } else {
            Dataget = await app.GetAsset(sentobject);
        }

        // paging advances by what the server sent; hidden listings were already taken out of Dataget
        const raw = Dataget.rawLength !== undefined ? Dataget.rawLength : Dataget.length
        this.setsuggesttion(Dataget);
        this.setData({
            fetchData: [...this.data.fetchData, ...Dataget],
            offset: this.data.offset + raw,
            hasMore: raw > 0 && !(this.data.maxItems && this.data.offset + raw >= this.data.maxItems),
            loading: false
        });
    },

    // map icon: pins of the listings, carrying over the buy / rent, property type and IEAT filters (single values only)
    openMap() {
        const v = this.data.searchvalue
        const one = (x) => (x !== undefined && x !== null && x !== '' && String(x) !== '0' ? String(x) : '')
        wx.navigateTo({ url: `/pages/assetmap/assetmap?selltype=${one(v.selltype)}&PropertyType=${one(v.PropertyType)}&IEAT=${one(v.IEAT)}` })
    },

    // the hide icon of a card: take that listing out of the list on screen (storage was updated by the card)
    onHideChange(e) {
        this.setData({ fetchData: this.data.fetchData.filter((r) => Number(r._id) !== Number(e.detail.id)) })
    },

    // ---- top input: keyword search + auto-complete (same data as the website's search box) ----
    onKeywordInput(e) {
        const text = e.detail.value
        this.setData({ keywordInput: text })
        clearTimeout(this.suggestTimer)
        if (!text.trim()) return this.setData({ suggestions: [], showSuggest: false })
        this.suggestTimer = setTimeout(() => this.loadSuggestions(text.trim()), 250)
    },

    onKeywordFocus() {
        if (this.data.suggestions.length > 0) this.setData({ showSuggest: true })
    },

    hideSuggest() {
        if (this.data.showSuggest) this.setData({ showSuggest: false })
    },

    clearKeyword() {
        clearTimeout(this.suggestTimer)
        this.setData({ keywordInput: '', suggestions: [], showSuggest: false, 'searchvalue.keyword': '' })
        this.restart()
    },

    // Enter / the keyboard's search key: search listings by the typed text
    onKeywordConfirm(e) {
        const text = (e.detail.value || '').trim()
        this.setData({ showSuggest: false, 'searchvalue.keyword': text, 'searchvalue.province': '', 'searchvalue.district': '' })
        this.restart()
    },

    async loadSuggestions(text) {
        const en = config.language === 'en'
        const lang = en ? 'en' : (config.language === 'zh' ? 'zh' : 'th')
        const d = await app.GetAutocomplete(text)
        if (!d || text !== this.data.keywordInput.trim()) return // an older answer: the text has changed since
        const name = (x) => x['name_' + lang] || x.name_th
        const badge = { province: en ? 'Province' : '省', district: en ? 'District' : '区', industrial: en ? 'Estate' : '工业区', asset: en ? 'Listing' : '房源' }
        const rows = []
        ;(d.province || []).forEach((x) => rows.push({ type: 'province', id: x.id, text: name(x) }))
        ;(d.district || []).forEach((x) => rows.push({ type: 'district', id: x.id, text: name(x), sub: x['province_' + lang] || x.province_th }))
        ;(d.industrial || []).forEach((x) => rows.push({ type: 'industrial', id: x.id, text: name(x) }))
        ;(d.asset || []).forEach((x) => rows.push({ type: 'asset', id: x.id, text: x.name }))
        this.setData({
            suggestions: rows.map((r, i) => Object.assign({ key: r.type + r.id + '_' + i, badge: badge[r.type] }, r)),
            showSuggest: rows.length > 0
        })
    },

    // like the website: a province / district filters by place; estates and listings search by their name
    pickSuggestion(e) {
        const r = this.data.suggestions[e.currentTarget.dataset.i]
        const base = { showSuggest: false, keywordInput: r.text }
        if (r.type === 'province') {
            this.setData(Object.assign(base, { 'searchvalue.keyword': '', 'searchvalue.province': r.id, 'searchvalue.district': '' }))
        } else if (r.type === 'district') {
            this.setData(Object.assign(base, { 'searchvalue.keyword': '', 'searchvalue.province': '', 'searchvalue.district': r.id }))
        } else {
            this.setData(Object.assign(base, { 'searchvalue.keyword': r.text, 'searchvalue.province': '', 'searchvalue.district': '' }))
        }
        this.restart()
    },

    // ---- place filter (icon inside the input): choose a province, then one of its districts (or all) ----
    placeName(row, key) {
        return config.language === 'en' ? row[key + '_en'] : row[key]
    },

    openLocation() {
        if (this.data.near) return
        this.setData({ showSuggest: false, showLoc: true, locStep: 'province', locQuery: '', locSel: {}, locSelCount: 0 })
        this.refreshLocList()
    },

    closeLocation() { this.setData({ showLoc: false }) },

    refreshLocList() {
        const q = this.data.locQuery.trim().toLowerCase()
        const rows = this.data.locStep === 'province'
            ? provinces.map((p) => ({ id: p.province_id, name: this.placeName(p, 'province_name'), search: (p.province_name + p.province_name_en).toLowerCase(), hot: POPULAR.indexOf(p.province_id) !== -1, rank: POPULAR.indexOf(p.province_id) === -1 ? POPULAR.length : POPULAR.indexOf(p.province_id) }))
                .sort((a, b) => a.rank - b.rank) // stable: the rest keep the data's order
            : districts.filter((d) => d.province_id === String(this.data.locProvince.id))
                .map((d) => ({ id: d.district_id, name: this.placeName(d, 'district_name'), search: '' }))
        this.setData({ locList: q && this.data.locStep === 'province' ? rows.filter((r) => r.search.indexOf(q) !== -1) : rows })
    },

    onLocQuery(e) {
        this.setData({ locQuery: e.detail.value })
        this.refreshLocList()
    },

    pickProvince(e) {
        this.setData({ locStep: 'district', locProvince: { id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name }, locQuery: '', locSel: {}, locSelCount: 0 })
        this.refreshLocList()
    },

    backToProvince() {
        this.setData({ locStep: 'province' })
        this.refreshLocList()
    },

    // tick / untick one district (several allowed)
    toggleDistrict(e) {
        const id = String(e.currentTarget.dataset.id)
        const locSel = Object.assign({}, this.data.locSel)
        locSel[id] ? delete locSel[id] : (locSel[id] = true)
        this.setData({ locSel, locSelCount: Object.keys(locSel).length })
    },

    // "all districts": untick everything (= the whole province)
    clearDistricts() {
        this.setData({ locSel: {}, locSelCount: 0 })
    },

    // apply: the whole province, or only the ticked districts, then search again
    applyLocation() {
        const prov = this.data.locProvince
        const ids = Object.keys(this.data.locSel)
        const names = this.data.locList.filter((d) => this.data.locSel[d.id]).map((d) => d.name)
        this.setData({
            showLoc: false,
            keywordInput: ids.length ? names.join('、') + ' · ' + prov.name : prov.name,
            suggestions: [],
            showSuggest: false,
            'searchvalue.keyword': '',
            'searchvalue.province': ids.length ? '' : Number(prov.id),
            'searchvalue.district': ids.join(',') // "" = no district filter; "1,2" = any of them
        })
        this.restart()
    },

    clearLocation() {
        this.setData({ showLoc: false, keywordInput: '', 'searchvalue.keyword': '', 'searchvalue.province': '', 'searchvalue.district': '' })
        this.restart()
    },

    // run the search again from the first page with the current searchvalue
    restart() {
        this.setData({ fetchData: [], offset: 0, hasMore: true, loading: false })
        return this.Getsearch()
    },

    setsuggesttion(objdata) {
        wx.setStorage({
            key: 'suggesttion',
            data: objdata,
        })
    },

    onReachBottom() {
        this.Getsearch();
    },

    async OrderSelect(e) {
        let Ordervalue = e.detail.order;
        this.setData({
            fetchData: [],
            offset : 0,
            hasMore: true,
            loading: false,
            'searchvalue.order': Ordervalue,
        })
        await this.Getsearch();
    },

    async Openfilter() {
        wx.navigateTo({
            url: '/pages/searchdetail/searchdetail',
            success: (res) => {

                this.setData({
                    'searchvalue.LandSizeStart': this.data.searchvalue.LandSizeStart ? this.data.searchvalue.LandSizeStart : 0,
                    'searchvalue.LandSizeEnd': this.data.searchvalue.LandSizeEnd ? this.data.searchvalue.LandSizeEnd : 0,
                    'searchvalue.PriceStart': this.data.searchvalue.PriceStart ? this.data.searchvalue.PriceStart : 0,
                    'searchvalue.PriceEnd': this.data.searchvalue.PriceEnd ? this.data.searchvalue.PriceEnd : 0,
                    'searchvalue.BuildingStart': this.data.searchvalue.BuildingStart ? this.data.searchvalue.BuildingStart : 0,
                    'searchvalue.BuildingEnd': this.data.searchvalue.BuildingEnd ? this.data.searchvalue.BuildingEnd : 0,
                })
                res.eventChannel.emit('openfilterdata', this.data.searchvalue);
                res.eventChannel.on('returnfilterdata', (data) => {
                    let Colordata = data.success.Color;
                    let dataTest = ""
                    if (Array.isArray(Colordata)) {
                        dataTest = Colordata.join(",");
                        data.success.Color = dataTest
                    }
                    this.setData({
                        fetchData: [],
                        offset: 0,
                        hasMore: true,
                        loading: false,
                        searchvalue: data.success
                    })
                    this.Getsearch()
                })
            },
        })
    },
});
