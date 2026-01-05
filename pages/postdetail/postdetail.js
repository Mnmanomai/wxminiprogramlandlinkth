const config = require('../../config');
Page({
    data: {
        keyboardHeight: 0,
        paddingbottominput: 60,
        paddingbottomcontent: 100,
        scrollTop: 0,
        textdetail: '',
        datapost: {
            no: '',
            picturepost: '',
            namepost: '',
            time: '',
            commentcount: '',
            detail: '',
        },
        post: {
        },
    },

    async onLoad(option) {
        const postNo = option.id
        const ugroupid = option.ugroupid
        this.setData({
            postNo : postNo,
            ugroupid : ugroupid,
        })

        const resdata = await this.getComment(this.data.postNo, this.data.ugroupid);
        this.setData({
            comment: resdata.data.comment,
            post: resdata.data.post
        });
    },

    setTextdetail(e) {
        this.setData({
            textdetail: e.detail.value
        });
    },

    async sentComment() {
        let objsent = {
            textdetail: this.data.textdetail,
            upostid: this.data.postNo,
            ugroupid : this.data.ugroupid
        }
        let res = await this.SentCommentServer(objsent)

        const resdata = await this.getComment(this.data.postNo, this.data.ugroupid);
        this.setData({
            comment: resdata.data.comment,
            post: resdata.data.post
        });

        this.setData({
            textdetail: ''
        })
    },

    async SentCommentServer(obj) {
        const tokenrequest = await new Promise((resolve, reject) => {
            wx.getStorage({
                key: 'usersdetail',
                success(res) {
                    resolve(res.data.token)
                },
                fail(err) {
                    reject(err)
                }
            })
        });

        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.PublicIPCallApiGoBackend}/community/comment/create`,
                method: 'POST',
                data: obj,
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                success(res) {
                    resolve(res.data)
                },
            })
        })
    },

    async getComment(postNo, ugroupid) {
        const tokenrequest = await new Promise((resolve, reject) => {
            wx.getStorage({
                key: 'usersdetail',
                success(res) {
                    resolve(res.data.token)
                },
                fail(err) {
                    reject(err)
                }
            })
        });


        return new Promise((resolve, reject) => {
            wx.request({
                url: `${config.PublicIPCallApiGoBackend}/community/post/${ugroupid}/${postNo}`,
                method: 'GET',
                header: {
                    'Authorization': 'Bearer ' + tokenrequest
                },
                success(res) {
                    resolve(res.data)
                },
            })
        })
    },

    onFocus(e) {
        const height = e.detail.height; // keyboard height

        this.setData({
            keyboardHeight: height,
            paddingbottominput: 10,
            paddingbottomcontent: 50,
        });

        // Auto scroll ให้เห็น input
        setTimeout(() => {
            this.setData({
                scrollTop: 999999 // scroll ลงล่างสุด
            });
        }, 50);
    },

    onBlur() {
        this.setData({
            keyboardHeight: 0,
            paddingbottominput: 60,
            paddingbottomcontent: 100,
        });
        setTimeout(() => {
            this.setData({
                scrollTop: 999999
            });
        }, 80);
    },

    onLineChange() {
        setTimeout(() => {
            this.setData({
                scrollTop: 999999
            });
        }, 1000);
    },

    async onPullDownRefresh() {
        const resdata = await this.getComment(this.data.post.uid);
        this.setData({
            comment: resdata.data.comment,
            post: resdata.data.post
        });
    },
});
