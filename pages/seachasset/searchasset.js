// pages/seachasset/searchasset.js
const config = require("../../config");
Page({
    data: {
        fetchData: [],
        value: "",
        loading: false,
    },

    onChange(e) {
        const datatextsearch = e.detail
        this.setData({
            value: datatextsearch
        })
    },

    onclicksearch() {
        this.search(this.data.value);
    },

    search(value) {
        let url = "";
        if (value.includes('#')) {
            let setdata = parseInt(value.replace('#', ''), 10);
            url = `${config.apiBaseUrl}/api/miniprogramapi/searchlist.php?find=${setdata}`;
        } else {
            let setdata = value
            url = `${config.apiBaseUrl}/api/miniprogramapi/searchlist.php?findname=${setdata}`;
        }
        const that = this;
        this.setData({
            loading: true
        })
        wx.request({
            url: url,
            success(res) {
                const status = res.data.status;
                let datalist = res.data.response
                if (status == "ok") {
                    that.setData({
                        fetchData: datalist,
                        loading: false
                    })
                } else {
                    that.setData({
                        fetchData: datalist,
                        err: "",
                        loading: false
                    })
                }

            },
            fail(e) {
                that.setData({
                    fetchData: datalist,
                    err: "",
                    loading: false
                })
            },
            complete(e) {

            }
        })
    },
})