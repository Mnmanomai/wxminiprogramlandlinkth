Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    data: {
      type: Boolean,
      value: false
    }
  },

  data: {
    localList: [],
  },

  observers: {
    'list': function (newList) {
      this.setData({
        localList: newList
      })
      this.checkOverflow()
    },
  },


  methods: {
    goToPost(e) {
      wx.navigateTo({
        url: `/pages/investmentpost/investmentpost?id=${e.currentTarget.dataset.id}`
      })
    },

    catchdatadesciption() {

    },

    opencontact() {
      this.triggerEvent('sendData', {
        data: true
      })
    },

    toggleComment(e) {
      const id = e.currentTarget.dataset.id
      let newList = this.data.localList.map(item => {
        if (item.ID === id) {
          item.expanded = !item.expanded
        }
        return item
      })
      this.setData({
        localList: newList
      })
    },
    checkOverflow() {
      const query = this.createSelectorQuery()
      query.selectAll('.description').boundingClientRect(rects => {
        let newList = this.data.localList.map((item, index) => {
          if (rects[index] && rects[index].height > 60) {
            item.isOverflow = true
          } else {
            item.isOverflow = false
          }
          return item
        })

        this.setData({
          localList: newList
        })
      }).exec()
    },

    onImageError: function(e) {
      // 1. ดึง index จาก data-index ที่เราส่งมาจาก wxml
      const index = e.currentTarget.dataset.index;
      // 2. สร้าง path สำหรับเข้าถึงข้อมูลใน array โดยตรง (เช่น history[0].picture)
      const targetPath = `history[${index}].picture`;
      
      // 3. อัปเดตข้อมูลให้เป็นรูป Default
      this.setData({
        [targetPath]: '/asset/landlink.png'
      });
      
    }

  },
})
