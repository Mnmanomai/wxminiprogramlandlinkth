// pages/grouplist/grouplist.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: "Group Company",
    });
  },

  NavigateTo() {
    wx.navigateTo({
      url: "/pages/taskpreview/taskpreview"
    })
  },

  sharepage() {},
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
  onClose(event) {
    const { instance } = event.detail;
    instance.close(); // ปิดแถบ swipe หลังจากกด
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // ดึงค่า path และ title จาก data- ใน WXML
      const { path, title } = res.target.dataset;
      
      return {
        title: title, 
        path: path, // นี่คือ URL/Path ของหน้าอื่นที่คุณต้องการให้เพื่อนเปิด
        imageUrl: '' // ใส่ URL รูปภาพหน้าปกการแชร์ได้ (ถ้ามี)
      };
    }
    
    // กรณีแชร์จากเมนูจุด 3 จุดปกติ
    return {
      title: 'หน้าหลักแอป',
      path: '/pages/index/index'
    };
  }

})