// pages/find_tabbar/find.js
const api = require('../../utils/Api.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    search_height: 0,
    bannerlist: {},
    toplist0: [],
    toplist0_songs: [],
    toplist1: [],
    toplist1_songs: [],
    toplist2: [],
    toplist2_songs: [],
    toplist3: [],
    toplist3_songs: [],
    toplist4: [],
    toplist4_songs: [],
    topNav: [{
        pic: 'list',
        name: '每日推荐'
      },
      {
        pic: 'song',
        name: '歌单'
      },
      {
        pic: 'rank',
        name: '排行榜'
      },
      {
        pic: 'dj',
        name: '电台'
      },
      {
        pic: 'online',
        name: '直播'
      },
    ],
  },
  err() {
    wx.showToast({
      title: '功能暂未开发',
      duration: 1000,
      icon: 'error'
    })
  },
  to_hotSonglist(e) {
    api.getPlayListDetail({
      id: e.currentTarget.dataset.id
    }).then(value => {
      app.globalData.hot_songList = value.playlist.trackIds
      app.globalData.hot_SongimgSrc = value.playlist.coverImgUrl
      wx.navigateTo({
        url: '../../pages/hot_songlist/hot_songlist',
      })
    }).catch(reason=>{
      console.log(reason)
    })

  },
  toRecommendSong() {
    wx.navigateTo({
      url: '../recommend_songs/recommend',
    })
  },
  toSearch: () => {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  showerr() {
    wx.showToast({
      title: '功能未开发',
      icon: 'error',
      duration: 900
    })
  },
  _getBanner: function () {
    api.getBanner().then((value) => {
      this.setData({
        bannerlist: value.banners
      })
    }).catch(reason => console.log(reason))
  },
  _getList0() {
    api.getTopList({
      idx: 0
    }).then(value => {
      this.setData({
        toplist0: value.playlist,
        toplist0_songs: value.playlist.tracks.slice(0, 3)
      })
    }).catch(reason => console.log(reason))
  },
  _getList1() {
    api.getTopList({
      idx: 1
    }).then(value => {
      this.setData({
        toplist1: value.playlist,
        toplist1_songs: value.playlist.tracks.slice(0, 3)
      })
    }).catch(reason => console.log(reason))
  },
  _getList2() {
    api.getTopList({
      idx: 2
    }).then(value => {
      this.setData({
        toplist2: value.playlist,
        toplist2_songs: value.playlist.tracks.slice(0, 3)
      })
    }).catch(reason => console.log(reason))
  },
  _getList3() {
    api.getTopList({
      idx: 3
    }).then(value => {
      this.setData({
        toplist3: value.playlist,
        toplist3_songs: value.playlist.tracks.slice(0, 3)
      })
    }).catch(reason => console.log(reason))
  },
  _getList4() {
    api.getTopList({
      idx: 4
    }).then(value => {
      this.setData({
        toplist4: value.playlist,
        toplist4_songs: value.playlist.tracks.slice(0, 3)
      })
    }).catch(reason => console.log(reason))
  },
  _getTopList: function () {
    this._getList0()
    this._getList1()
    this._getList2()
    this._getList3()
    this._getList4()
  },
  _getRecommendSonglist() {
    api.getRecommendSonglist({
      limit: 15
    }).then(value => {
      this.setData({
        recommendList: value.playlists
      })
    }).catch(reason => {
      console.log(reason)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search_height: app.globalData.navheight
    })
    this._getBanner()
    this._getTopList()
    this._getRecommendSonglist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})