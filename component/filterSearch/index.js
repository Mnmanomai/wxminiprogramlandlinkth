// components/filterSearch/index.js
const config = require("../../config")
Component({
    properties: {
        SellType: {
            type: Number,
            value: 1
        }
    },

    data : {
      list : [
        {id : 1, name : config.language == "en" ? "Buy" : "购买"},
        {id : 2, name : config.language == "en" ? "Rent" : "租赁"},
      ],
    },

    methods: {
        ChangeSlide(e) {
            const getSlider = e.currentTarget.dataset.index
            this.setData({
                SellType: getSlider
            })
            this.triggerEvent('change', {
                SellType: this.data.SellType
            });
        }
    }
})