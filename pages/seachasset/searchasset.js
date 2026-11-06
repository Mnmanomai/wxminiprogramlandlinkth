// pages/seachasset/searchasset.js
const config = require("../../config");
Page({
    data: {
        fetchData: [],
        value: "",
        loading: false,
        searched: false, // a search has been run (no "no data" before that)
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
            url = `${config.PublicIPCallApiGoBackend}/legacy/miniprogram/searchlist?find=${setdata}`;
        } else {
            let setdata = value
            url = `${config.PublicIPCallApiGoBackend}/legacy/miniprogram/searchlist?findname=${setdata}`;
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
                        fetchData: datalist || [],
                        searched: true,
                        loading: false
                    })
                } else {
                    that.setData({
                        fetchData: [],
                        searched: true,
                        err: "",
                        loading: false
                    })
                }

            },
            fail(e) {
                that.setData({
                    fetchData: [],
                    searched: true,
                    err: "",
                    loading: false
                })
            },
            complete(e) {

            }
        })
    },
})