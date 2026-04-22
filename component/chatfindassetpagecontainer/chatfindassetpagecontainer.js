// component/chatfindassetpagecontainer/chatfindassetpagecontainer.js
const app = getApp()
Component({

    /**
     * Component properties
     */
    properties: {
        FindAssetPageContainer: {
            type: Boolean,
            value: false
        }
    },

    /**
     * Component initial data
     */
    data: {
        active: 1,
        flavoritelist: [],
        activeflavorite : false,
        selectedIds: [],
        datasend : []
    },

    observers: {
        'FindAssetPageContainer': async function (FindAssetPageContainer) {
            if (FindAssetPageContainer) {
                // ทำงานเมื่อ page-container กำลังจะเปิดขึ้นมา
                const data = wx.getStorageSync('FlavoriteList');
                this.setData({
                    localData: data
                });
                let arrayflav = []
                let flavoritelist = ""
                if (data.length != 0) {
                    data.map((value, index) => {
                        arrayflav.push(value.id)
                    })
                    flavoritelist = arrayflav.join(",")
                    let datafla = await app.Getlist(flavoritelist)
                    this.setData({
                        flavoritelist: datafla
                    })
                }

            }
        }
    },

    /**
     * Component methods
     */
    methods: {
        getflavoritelist() {
            const Flavorite = wx.getStorageSync('FlavoriteList')
            // console.log(Flavorite)
        },
        changemode(){
          
          this.setData({
            activeflavorite : !this.data.activeflavorite
          })
        },

        handleAssetSelect(e) {
          const clickedId = e.detail.id;
          let selectedIds = this.data.selectedIds;
        
          // ตรวจสอบว่ามี ID นี้อยู่ใน list หรือยัง
          const index = selectedIds.indexOf(clickedId);
        
          if (index > -1) {
            selectedIds.splice(index, 1);
          } else {
            selectedIds.push(clickedId);
          }
        
          this.setData({
            selectedIds: selectedIds
          });
        },
        
        sendtochat(){
          // console.log("sendtochat")
            this.triggerEvent('sendattachment',{
              selectedIds: this.data.selectedIds
            })
        },
    }
})