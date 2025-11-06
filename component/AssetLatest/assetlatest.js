// component/assetlatest/assetlatest.js
Component({

    /**
     * Component properties
     */
    properties: {
        list: { //รายการ
            type: Array,
            value: []
        }
    },

    data: {

    },

    methods: {
        nexttoasset(e) {
            const idList = e.currentTarget.dataset.id;
            const url = `/pages/assetdetail/assetdetail?id=${idList}`
            wx.navigateTo({
                url: url
            })
        }
    }
})