// component/filternsortsearch/index.js
Component({

  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    show: false,
    actions: [
      // {
        // value: '1',
        // name: '推荐'
      // }, //แนะนำ
      {
        value: '2',
        name: '价格',
        subname : '低到高'
      }, //ราคา น้อยไปมาก
      {
        value: '3',
        name: '价格',
        subname : '高到低'
      }, //ราคา มากไปน้อย
      {
        value: '4',
        name: '每平方英尺价',
        subname : '高到低'
      }, //ราคาต่อตารางวา มากไปน้อย
      {
        value: '5',
        name: '每平方英尺价',
        subname : '低到高'
      }, //ราคาต่อตารางวา น้อยไปมาก
      {
        value: '6',
        name: '面积',
        subname : '高到低'
      }, //ขนาดพื้นที่ มากไปน้อย
      {
        value: '7',
        name: '面积',
        subname : '低到高'
      }, //ขนาดพื้นที่ น้อยไปมาก
    ]
  },

  /**
   * Component methods
   */
  methods: {
    onShowActionSheet() {
      this.setData({
        show: true
      });
    },

    onClose() {
      this.setData({
        show: false
      });
    },

    onSelect(event) {
      const value = event.detail.value;
      this.triggerEvent('senddata', {
        order: value
      });
    },

    goToFilter() {
      this.triggerEvent('lunchfilter',{
        lunch:true
      })
    },
  }
})