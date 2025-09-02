// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        },
        hasUserInfo: false,
        canIUseGetUserProfile: wx.canIUse('getUserProfile'),
        canIUseNicknameComp: wx.canIUse('input.type.nickname'),
        dataAsset : []
    },
    
    gotofilter() {
        wx.navigateTo({
            url: '/pages/filtersearch/filtersearch',
        })
    },

    async onLoad(){
      const getAsset = await app.GetLatestAsset();
      this.setData({
        dataAsset : getAsset
      })
    },

    
})
