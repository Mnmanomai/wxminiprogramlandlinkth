// pages/guide/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    contentData: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  async checkimages(res) {
    const textDetail = res.text_detail;

    // ใช้ map เพื่อ return array ใหม่
    const updated = textDetail.map(element => {
      if (element.startsWith("images ")) { // ถ้าข้อมูลจริงขึ้นต้นด้วย "images "
        let cut = element.substring(7); // ตัด "images " ออก (7 ตัวอักษร)
        return {
          url: cut
        };
      }
      return element; // ถ้าไม่ match ก็คืนค่าเดิม
    });

    return updated;
  },
  async reurlmain(req) {

    return "https://www.landlinkth.com/images/pic_guide_content/" + req
  },

  async onLoad(options) {
    let res = await app.GetGuide(options.id);
    res['main_pic'] = await this.reurlmain(res['main_pic'])
    res['text_detail'] = await this.checkimages(res);
    this.setData({
      contentData: res // เซ็ตค่าที่แก้แล้ว
    });
  },


  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})