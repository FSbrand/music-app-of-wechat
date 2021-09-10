import PubSub from 'pubsub-js'

const api = require('../../utils/Api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:"", // 天
    month:"", // 月份
    recommendList: [], // 推荐列表数据
    index:0, // 点击播放音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.showToast({
        title:"请先登录",
        icon:"none",
        success:()=>{
          // 跳转到登录界面
          wx.reLaunch({
            url:"/pages/login/login"
          })
        }
      })
    }


    // 更新日期
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    });

    // 获取每日推荐的数据
    this.getRecommendList()

    // ** 订阅（绑定）来自播放器页面发布的消息
    PubSub.subscribe("switchType",(msg,data)=>{
      let {recommendList,index} = this.data;
      if(data === "pre"){ // 上一首
        index-=1;
        if(index==-1) index=recommendList.length-1;
      }else{ // 下一首
        index=(index+1)%recommendList.length;
      }
      this.setData({
        index:index
      })
      let musicId = recommendList[index].id; // 将要更新的id
      // 将musicId 回传给songDetail页面
      PubSub.publish("musicId",musicId);
    });


  },

  // 获取用户每日推荐数据
  async getRecommendList() {
    let recommendList = await api.Request("/recommend/songs");
    this.setData({
      recommendList: recommendList.recommend
    })
  },

  // 点击歌曲 跳转不同的详情页
  toPlay(event){
    // 接收参数
    let {song,index} = event.currentTarget.dataset;
    this.setData({
      index:index
    })
    // 路由跳转传参：query 参数
    wx.navigateTo({
      // url:"/pages/songDetail/songDetail?song="+ JSON.stringify(song)
      url:"../music_play/musci_play?musicId="+ song.id
    })
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