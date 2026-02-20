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
        doSomething() {

        },
        openPostInvestment(e) {
            wx.navigateTo({
                url: `/pages/postinvestment/postinvestment?id=${e.currentTarget.dataset.id}`,
            })
        },

        sharepostinvestment(){
          
        },

        opencontact() {
            this.triggerEvent('sendData', {
                data: true
            })
        },

        showPopup(e) {
            let idivm = e.target.dataset.id;
            this.setData({
                showpopup: true,
                idset: idivm,
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

        async DeleteInvestment(e) {
            const ivmid = e.target.dataset.id
            const texttitle = config.language == "zh" ? "移至回收站" : "Move to trash"
            const textcontent = config.language == "zh" ? "此项目将被移至回收站。您可以稍后将其恢复。" : `This item will be moved to Trash.You can restore it later.`
            const textconfirmText = config.language == "zh" ? "确定" : "OK"
            const textcancelText = config.language == "zh" ? "取消" : "Cancel"
            wx.showModal({
                title: texttitle,
                content: textcontent,
                confirmText: textconfirmText,
                cancelText: textcancelText,
                success: async (res) => { 
                    if (res.confirm) {
                      try {
                        const result = await this.DeleteCallFunction(ivmid)
                        if (result.statusCode == 200){
                            wx.showToast({
                                title : "删除投资成功",
                                icon : "success",
                                duration:700,
                            })
                            const pages = getCurrentPages()
                            const currentPage = pages[pages.length - 1]

                            wx.redirectTo({
                              url: '/' + currentPage.route
                            })
                        }else{
                            wx.showToast({
                                title : result.error,
                                icon : "error",
                                duration:700,
                            })
                        }
                      } catch (err) {
                        console.error('DELETE FAIL', err)
                      }
                    }
                  }
            })

        },

        async DeleteCallFunction(ivmid) {

            const token = await new Promise((resolve, reject) => {
                wx.getStorage({
                    key: 'usersdetail',
                    success(res) {
                        resolve(res.data.token)
                    },
                    fail(err) {
                        reject(err)
                    }
                })
            });

            return new Promise((resolve, reject) => {
                wx.request({
                    url: `${config.PublicIPCallApiGoBackend}/investment/delete/${ivmid}`,
                    method: 'DELETE',
                    header: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    success(res) {
                        resolve(res)
                    },
                    fail(res) {
                        reject(res)
                    },
                })
            })
        }
    },
})
