// component/chatlist/index.js
Component({

    /**
     * Component properties
     */
    properties: {
      chatno:{
        type:String,
        value:'',
      },
      picture:{
        type:String,
        value:'#',
      },
      namechat:{
        type:String,
        value:'',
      },
      notinew:{
        type:Boolean,
        value:false,
      },
      textnew:{
        type:String,
        value:''
      },
      timenew:{
        type:String,
        value:''
      },
      unreadno:{
        type:Number,
        value:0
      }
    },

    /**
     * Component initial data
     */
    data: {
        // countArray: Array.from({
        //     length: 10
        // })
    },

    /**
     * Component methods
     */
    methods: {
        Nexttofeed(e) {
            let idfeed = e.currentTarget.dataset.idfeed
            let namechat = e.currentTarget.dataset.namechat
            wx.navigateTo({
                url: `/pages/feeds/feeds?id=${idfeed}&groupname=${namechat}`,
            });
        }
    },
})