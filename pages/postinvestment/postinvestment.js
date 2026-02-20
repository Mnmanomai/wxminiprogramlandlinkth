// pages/postinvestment/postinvestment.js
const config = require("../../config");

const app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        dataInvest: [],
        offset: 0,
        lenghtQuery: 10,
        language: config.language,
        leghthInvest: 0,
    },

    /**
     * Lifecycle function--Called when page load
     */
    async onLoad(options) {
        wx.setNavigationBarTitle({
          title: config.language == "zh" ? "提供投资": "Offer Investment",
        });
        await this.getData(options.id);
    },

    async getData(id){
      let res = await this.requestInvestPost(id)
      const investment = res.data.data.investment
      const offerlist = res.data.data.offerlist
      let newdataoffer = []
      if (offerlist){
        newdataoffer = offerlist.map((value)=>{
          return {
            ...value,
            saleprice : new Intl.NumberFormat('th-TH').format(value.saleprice),
            wh_size_sqm : new Intl.NumberFormat('th-TH').format(value.wh_size_sqm),
            land_size_rai : new Intl.NumberFormat('th-TH').format(value.land_size_rai),
            salepricepersqw : new Intl.NumberFormat('th-TH').format(value.salepricepersqw),
            pictureagent : value.pictureagent == "" ? "/asset/landlink.png" : value.pictureagent
          }
        })
      }

      this.setData({
        dataInvest :investment,
        datalist :newdataoffer,
      })

    },

    async requestInvestPost(id){
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
            url: `${config.PublicIPCallApiGoBackend}/investment/offerlist/zh/${id}`,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + tokenrequest
            },
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
    }

    // async getData() {
    //     let lengthCheck = this.data.leghthInvest
    //     if (lengthCheck !== -1) {
    //         const dataInvest = await app.GetInvestment(this.data.offset, 1)
    //         let lenghtDataInvest = dataInvest !== "0 result" ? dataInvest.length : -1;
    //         if (lenghtDataInvest != -1) {
    //             const fixedData = dataInvest.map(item => ({
    //                 ...item,
    //                 planned_visit: item.planned_visit ? item.planned_visit.split(' ')[0] : ''
    //             }))

    //             this.setData({
    //                 dataInvest: [...this.data.dataInvest, ...fixedData],
    //                 offset: lenghtDataInvest + this.data.offset,
    //                 leghthInvest: lenghtDataInvest,
    //             })
    //         }
    //     }
    // },

})