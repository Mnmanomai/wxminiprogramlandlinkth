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

  }
})
