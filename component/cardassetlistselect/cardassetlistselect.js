// component/cardassetlistselect/cardassetlistselect.js
Component({

  /**
   * Component properties
   */
  properties: {
    
    dataarraylist : {
      type : Array ,
      value : []
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
    nextToAssetDetail(e){
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url : `/pages/assetdetail/assetdetail?id=${id}&selectmode=1`
      })
    },
    selectSend(e) {
      const id = e.currentTarget.dataset.id;
      // console.log(id)
      const dataarraylist = this.data.dataarraylist.map(item => {
          if (item._id == id) {
              return {
                  ...item,
                  selected: !item.selected
              };
          }
          return item;
      });
      // console.log(dataarraylist)

      this.setData({
          dataarraylist
      }, () => {
          this.triggerEvent('select', {
              list: dataarraylist
          });
      });
  }
  }
})