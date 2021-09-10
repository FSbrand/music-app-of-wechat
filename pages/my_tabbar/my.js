const api = require('../../utils/Api.js')
let startY = 0; // 手指开始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离


Page({
  /**
   * 页面的初始数据
   */

  data: {
    coverTransform: "translateY(0rpx)", // 移动距离数据
    coverTransition: "", // 缓动效果
    userInfo: {}, // 用户数据
    recentPlayList: [], // 用户的播放记录
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取本地存储的用户信息
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      // 更新userInfo
      this.setData({
        userInfo: JSON.parse(userInfo),
        isLogin:true
      });
      // 获取用户的播放记录
      this._getUserPlayRecord(this.data.userInfo.userId);
    }
  },

  // 获取用户的播放纪录
  _getUserPlayRecord(userId) {
    api.getUserPlayRecord({
      uid: userId,
      type: 0
    }).then(value => {
      // 由于每一项没有一个key 可以标识，这里使用map进行加工一下
      this.setData({
        recentPlayList: value.allData
      })
    }).catch(reason=>console.log(reason))
  },

  // 绑定事件
  handleTouchStart(event) {
    // 获取起始坐标
    startY = event.touches[0].clientY; // touches[0]取第一次点击，因为屏幕可能有多个位置被点击
  },

  handleTouchMove(event) {
    // 获取手指移动的坐标
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY; // 手指往下移动为正，往下为负数
    // 更新移动的距离
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
      coverTransition: ""
    })
  },

  handleTouchEnd(event) {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: "transform 1s linear"
    })
  },

  // 个人中心页面跳转 登录界面
  toLogin() {
    if(this.data.isLogin===true)return
    wx.navigateTo({
      url: "/pages/login/login"
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