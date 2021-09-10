// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.navheight=result.statusBarHeight
      },
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    musicId:'',
    isMusicPlay:false,
    userInfo: null,
    navheight:0,
    hot_songList:[],
    hot_SongimgSrc:'',
  }
})
