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
                data.map((value, index) => {
                    arrayflav.push(value.id)
                })
                flavoritelist = arrayflav.join(",")
                let datafla = await app.Getlist(flavoritelist)
                console.log(datafla)
                this.setData({
                    flavoritelist: datafla
                })
            }
        }
    },

    /**
     * Component methods
     */
    methods: {
        getflavoritelist() {
            const Flavorite = wx.getStorageSync('FlavoriteList')
            console.log(Flavorite)
        },
    }
})