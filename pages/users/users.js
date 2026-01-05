// pages/users/users.js
Page({

  /**
   * Page initial data
   */
  data: {
    firstname: '',
    lastname: '',
    images: '',
    position: '',
    showcontact : false
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    await this.setdatauser()


  },

  async setdatauser() {
    const datalist = await this.getStorage();
    (datalist.data); 
    const detaildata = datalist.data
    this.setData({
      firstname : detaildata.firstname,
      lastname : detaildata.lastname,
      images : detaildata.picture,
    })
  },

  async getStorage(){
    return new Promise((reslove, reject) => {
      wx.getStorage({
        key: 'usersdetail',
        success(option) {
          reslove(option)
        }
      })
    })
  },

  popupsupport(){
    this.setData({
      showcontact : true
    })
  }
})