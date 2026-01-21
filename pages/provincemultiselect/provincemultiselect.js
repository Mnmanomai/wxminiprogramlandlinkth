// pages/provincemultiselect/provincemultiselect.js
const provincelist = require('../../pages/internaldata/province.js');
Page({

    /**
     * Page initial data
     */
    data: {

    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        this.loadprovince()
    },

    loadprovince() {
        const data = provincelist['response'].map(v => ({
            text: `${v.province_name} (${v.province_name_en})`,
            value: v.province_id,
            mark: 0,
        }))

        this.setData({
            masterlistprovince: data,
            listprovince: data
        })
    },

    confirmSelect() {
        const selected = this.data.masterlistprovince.filter(i => i.mark === 1).map(i => ({
            value: i.value,
            text: i.text
        }))

        const selectText = this.data.masterlistprovince.filter(i => i.mark === 1).map(i => i.text).join(',')
        const selectno = this.data.masterlistprovince.filter(i => i.mark === 1).map(i => i.value).join(',')

        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]

        prevPage.setData({
            selectedProvince: selected,
            province: selectText,
            provincevalue: selectno,
        })
        wx.navigateBack()
    },

    searchlist(e) {
        const keyword = (e.detail || '').trim().toLowerCase()
        const masterprovince = this.data.masterlistprovince || []
        if (!keyword) {
            this.setData({
                listprovince: masterprovince
            })
            return
        }
        const cleanKeyword = keyword.replace(/\s+/g, '')
        const result = masterprovince.filter(item => {
            const textsearch = (item.text || '')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '')
            return textsearch.includes(cleanKeyword)
        })
        this.setData({
            listprovince: result
        })
    },

    selectlist(e) {
        const value = e.currentTarget.dataset.value
        const master = this.data.masterlistprovince
        const selectedCount = master.filter(i => i.mark === 1).length
        const newMaster = master.map(item => {
            if (item.value === value) {
                if (item.mark === 1) {
                    return {
                        ...item,
                        mark: 0
                    }
                }
                if (selectedCount < 5) {
                    return {
                        ...item,
                        mark: 1
                    }
                }
                wx.showToast({
                    title: '最多可以选择 5 个省份。',
                    icon: 'none'
                })
            }
            return item
        })
        this.setData({
            masterlistprovince: newMaster,
            listprovince: this.syncList(this.data.listprovince, newMaster)
        })
    },

    syncList(renderList, masterList) {
        return renderList.map(item => {
            const found = masterList.find(m => m.value === item.value)
            return found ? {
                ...item,
                mark: found.mark
            } : item
        })
    },


})