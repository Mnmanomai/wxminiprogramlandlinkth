const {
    language
} = require("../../config")
const config = require("../../config")

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
        showpopup: false,
        language: config.language
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
      doSomething(){

      },
        openPostInvestment(){
            wx.navigateTo({
              url: '/pages/postinvestment/postinvestment',
            })
        },

        opencontact() {
            this.triggerEvent('sendData', {
                data: true
            })
        },

        showPopup() {

            this.setData({
                showpopup: true
            });
        },

        onClose() {
            this.setData({
                showpopup: false
            });
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
                    if (rects[index] && rects[index].height > 50) {
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
        
        DeleteInvestment() {
            const texttitle = config.language == "zh" ? "移至回收站" : "Move to trash"
            const textcontent = config.language == "zh" ? "此项目将被移至回收站。您可以稍后将其恢复。" : `This item will be moved to Trash.You can restore it later.`
            const textconfirmText = config.language == "zh" ? "确定" : "OK"
            const textcancelText = config.language == "zh" ? "取消" : "Cancel"
            wx.showModal({
                title: texttitle,
                content: textcontent,
                confirmText: textconfirmText,
                cancelText: textcancelText,
                success(res) {
                    if (res.confirm) {
                        let texthow = config.language == "zh" ? "" : ""
                        // console.log()
                    } else if (res.cancel) {
                        let texthow = config.language == "zh" ? "" : ""
                        // console.log('User clicked Cancel')
                    }
                }
            })

        }

    },
})
