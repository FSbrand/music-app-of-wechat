const api = require('../../utils/Api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value: '',
    search_dafault: '',
    hot_songlist: '',
    keywords_search: '',
    suggestlist: [],
    haskey: false
  },
  //获取默认搜索关键词
  _getSearchDefault() {
    api.getSearchDefault().then((value) => {
      this.setData({
        search_dafault: value.data.showKeyword
      })
    }).catch(reason => console.log(reason))
  },

  //获取推荐关键词
  getSuggest(e) {
    if (!e.detail.value) {
      this.setData({
        haskey: false
      })
      return
    }
    api.getSearchSuggest({
      keywords: e.detail.value,
      type: "mobile"
    }).then(value => {
      if (value.result.allMatch)
        this.setData({
          haskey: true,
          suggestlist: value.result.allMatch
        })
      else this.setData({
        haskey: true,
        suggestlist: '没有相关内容'
      })
    })
  },
  cancle() {
    this.setData({
      haskey: false
    })
  },
  _return() {
    wx.navigateBack({})
  },
  //获取热搜索列表
  _getHotSearch() {
    api.getHotSearch().then(value => {
      this.setData({
        hot_songlist: value.data
      })
    }).catch(reason => console.log(reason))
  },
  getSuggestDetail(e) {
    api.getSearchDetail({
      keywords: e.currentTarget.dataset.keyword
    }).then(
      value => {
        console.log(value)
        app.globalData.hot_songList = value.result.songs
        app.globalData.hot_SongimgSrc = ''
        wx.navigateTo({
          url: '../../pages/hot_songlist/hot_songlist',
        })
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSearchDefault()
    this._getHotSearch()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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