// component/assetchatcard/assetchatcard.js
Component({

    /**
     * Component properties
     */
    properties: {
        assetDetail: {
            type: Object,
            value: {},
        }
    },

    /**
     * Component initial data
     */
    data: {

    },

    /**
     * Component methods
     */
    methods: {
        nexttoasset(e) {
            // console.log(e)
            let data = e.currentTarget.dataset.id
            wx.navigateTo({
                url : `/pages/assetdetail/assetdetail?id=${data}`
            })
        }
    }
})