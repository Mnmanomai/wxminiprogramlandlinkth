const config = require("../../config")

// pages/colormultiselect/colormultiselect.json
config
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
        this.loadcolor()
    },

    loadcolor() {

        const dataColor = [
          { text:"全部 (All)", value: 0,mark: 0,},
          { text:"紫色 (Purple zone)", value: 1,mark: 0,},
          { text:"黄色 (Yellow zone)", value: 2,mark: 0,},
          { text:"绿色 (Green zone)", value: 3,mark: 0,},
          { text:"浅紫色 (Light Purple zone)", value: 4,mark: 0,},
          { text:"橙色 (Orange zone)", value: 5,mark: 0,},
          { text:"棕色的 (Brown zone)", value: 6,mark: 0,},
          { text:"浅棕色 (Light Brown zone)", value: 7,mark: 0,},
          { text:"红色的 (Red zone)", value: 8,mark: 0,},
          { text:"蓝色的 (Blue zone)", value: 9,mark: 0,},
          { text:"绿色对角线 (Green diagonal zone)", value: 10,mark: 0,},
          { text:"灰色的 (Gray zone)", value: 11,mark: 0,},
          { text:"橄榄绿 (Olive green zone)", value: 12,mark: 0,},
          { text:"粉色的 (Pink zone)", value: 13,mark: 0,}
        ]


        this.setData({
            masterlistcolor: dataColor,
            listcolor: dataColor
        })
    },

    confirmSelect() {
      
        const selected = this.data.masterlistcolor.filter(i => i.mark === 1).map(i => ({
            value: i.value,
            text: i.text
        }))

        const selectText = this.data.masterlistcolor.filter(i => i.mark === 1).map(i => i.text).join(',')
        const selectno = this.data.masterlistcolor.filter(i => i.mark === 1).map(i => i.value).join(',')

        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]

        prevPage.setData({
            selectedColor: selected,
            color: selectText,
            colorvalue: selectno,
        })
        wx.navigateBack()
    },

    searchlist(e) {
        const keyword = (e.detail || '').trim().toLowerCase()
        const mastercolor = this.data.masterlistcolor || []
        if (!keyword) {
            this.setData({
                listcolor: mastercolor
            })
            return
        }
        const cleanKeyword = keyword.replace(/\s+/g, '')
        const result = mastercolor.filter(item => {
            const textsearch = (item.text || '')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '')
            return textsearch.includes(cleanKeyword)
        })
        this.setData({
            listcolor: result
        })
    },

    selectlist(e) {
      const value = e.currentTarget.dataset.value
      const master = this.data.masterlistcolor
  
      // 👉 กด 0 = reset ทั้งหมด และเลือก 0
      if (value === 0) {
          const newMaster = master.map(item => ({
              ...item,
              mark: item.value === 0 ? 1 : 0
          }))
  
          this.setData({
              masterlistcolor: newMaster,
              listcolor: this.syncList(this.data.listcolor, newMaster)
          })
          return
      }
  
      // 👉 กดค่าอื่น
      const newMaster = master.map(item => {
          if (item.value === value) {
              return {
                  ...item,
                  mark: item.mark === 1 ? 0 : 1
              }
          }
  
          // ถ้ามีการเลือกอย่างอื่น ให้ 0 ถูก unselect
          if (item.value === 0) {
              return {
                  ...item,
                  mark: 0
              }
          }
  
          return item
      })
  
      this.setData({
          masterlistcolor: newMaster,
          listcolor: this.syncList(this.data.listcolor, newMaster)
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