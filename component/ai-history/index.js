// components/ai-history/ai-history.js
Component({
  properties: {
    // ประกาศว่า Component นี้รับค่าอะไรได้บ้าง (ต้องตรงกับใน .wxml ของคุณ)
    title: {
      type: String,
      value: 'ห้องแชทใหม่'
    },
    active: {
      type: Boolean,
      value: false
    },
    chatid: {
      type: String,
      value: ''
    }
  },

  methods: {
    // เมื่อกดที่รายการแชท
    onTap: function() {
      // ส่งค่ากลับไปบอกหน้าหลัก (ai.js) ว่าเลือกห้องไหน
      this.triggerEvent('select', { chatid: this.properties.chatid });
    },

    // เมื่อกดปุ่มลบ (Icon)
    onDelete: function() {
      // ส่งค่ากลับไปบอกหน้าหลักว่าต้องการลบห้องไหน
      this.triggerEvent('delete', { chatid: this.properties.chatid });
    }
  }
})