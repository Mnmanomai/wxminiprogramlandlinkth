// component/assetlistchat/assetlistchat.js
Component({

    /**
     * Component properties
     */
    properties: {
        dataobj: {
            type: Object,
            value: {}
        },
        dataarraylist: {
            type: Array,
            value: []
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
        selectSend(e) {
            const {
                id
            } = e.currentTarget.dataset;
            const dataarraylist = this.data.dataarraylist.map(item => {
                if (item.id == id) {
                    return {
                        ...item,
                        selected: !item.selected
                    };
                }
                return item;
            });

            this.setData({
                dataarraylist
            }, () => {
                this.triggerEvent('select', {
                    id: id,
                    list: dataarraylist
                });
            });
        }

    }
})