// component/feeds/index.js
Component({

  /**
   * Component properties
   */
  properties: {
    donttouch: {
      type: Boolean,
      value: true,
    },
    no: {
      type: String,
      value: '#',
    },
    ugroupid: {
      type: String,
      value: '#',
    },
    picturepost: {
      type: String,
      value: '#',
    },
    namepost: {
      type: String,
      value: '',
    },
    time: {
      type: String,
      value: '',
    },
    commentcount: {
      type: String,
      value: '',
    },
    detail: {
      type: String,
      value: '',
    },
    commentlatest: {
      type: String,
      value: ''
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
    Nexttopostdetail(e) {

      const no = this.data.no;
      const ugroupid = this.data.ugroupid;
      // const picturepost =  this.data.picturepost; 
      // const namepost =  this.data.namepost; 
      // const time =  this.data.time; 
      // const commentcount =  this.data.commentcount; 
      // const detail =  this.data.detail; 
      // let objevent = {
      //   'no' : no,
      //   'picturepost' : picturepost,
      //   'namepost' : namepost,
      //   'time' : time,
      //   'commentcount' : commentcount,
      //   'detail' : detail,
      // }
      if (this.data.donttouch) {
        wx.navigateTo({
          url: `/pages/postdetail/postdetail?id=${no}&ugroupid=${ugroupid}`
        })
      }
    }
  }
})