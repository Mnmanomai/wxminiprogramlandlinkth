const config = require("../../config")
Component({
    data: {
        active: 0,
        tabs: [{
                url: '/pages/index/index',
                icon: 'home-o',
                text: 'Home'
            },
            {
                url: '/pages/activities/activities',
                icon: 'search',
                text: 'Activities'
            },
            {
                url: '/pages/investmentmarket/investmentmarket',
                icon: 'chat-o',
                text: 'Massage'
            },
            {
                url: '/pages/chat/chat',
                icon: 'chat-o',
                text: 'Massage'
            },
            {
                url: '/pages/users/users',
                icon: 'users-o',
                text: 'users'
            },
        ]
    },

    lifetimes: {
        attached() {
            // เช็ค path ของหน้านี้ แล้วกำหนด active ให้อัตโนมัติ
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            const currentPath = '/' + currentPage.route;

            const activeIndex = this.data.tabs.findIndex(tab => tab.url === currentPath);
            this.setData({
                active: activeIndex
            });
        }
    },

    methods: {
        onChange(event) {
            const index = event.detail;
            const target = this.data.tabs[index];
            if (target) {
                wx.switchTab({
                    url: target.url
                });
            }
        }
    }
})
