Component({
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  data: {
    localList: [],
    show:false,
    supportPhone : "0627324174"
  },

  observers: {
    'list': function (newList) {
      this.setData({ localList: newList })
      this.checkOverflow()
    },
  },
  

  methods: {
    
    toggleComment(e) {
      const id = e.currentTarget.dataset.id
      let newList = this.data.localList.map(item => {
        if (item.ID === id) {
          item.expanded = !item.expanded
        }
        return item
      })
      this.setData({ localList: newList })
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

        this.setData({ localList: newList })
      }).exec()

      // console.log("pass check overflow")
    },

    showPopup() {
      this.setData({
        show: true
      });
    },
    onClose() {
      this.setData({
        show: false
      });
    },
  
    toCustomMessage() {
  
    },
  
    callSupport() {
      wx.makePhoneCall({
        phoneNumber: this.data.supportPhone,
        success() {
          // console.log("กำลังโทรหา Support...");
        },
        fail(err) {
          // console.error("โทรไม่สำเร็จ", err);
        }
      });
    },
  }
})
