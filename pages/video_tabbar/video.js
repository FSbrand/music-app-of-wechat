// pages/video_tabbar/video.js
const api = require('../../utils/Api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签
    navigateId: "", // 导航的标识，标记哪个被选中
    videoList: [], // 视频列表数据
    videoId: "", // video的标识，标记哪个视频播放
    videoUpdateTime: [], // 纪录video播放的时长
    isTriggered: false, // 标识下拉刷新是否触发
  },

  // 获取导航数据
  _getVideoGroupListData() {
    api.getVideoGroupListData().then(
      value => {
        this.setData({
          videoGroupList: value.data.slice(15,23),
          navigateId: value.data[15].id
        });
        this._getVideoList(this.data.navigateId); // 获取视频列表数据 navId 是当前选择的 标签ID
      }
    ).catch(reason=>console.log(reason))
  },

  // 获取视频列表数据
  _getVideoList(navigateId) {
    this.setData({
      videoList: [], // 加载新的视频页时 将原来的视频数据清空
    });
    // wx.showLoading({
    //   title: "正在加载"
    // });
    api.getVideoList({id:navigateId}).then(value => {
      // 关闭提示框
      // wx.hideLoading();
      // 收回下拉状态
      this.setData({
        isTriggered: false
      })
      this.setData({
        videoList: value.datas
      })
    }).catch(reason=>console.log(reason))
  },


  //点击切换导航的回调
  changeNav(event) {
    let navigateId = event.currentTarget.id;
    this.setData({
      navigateId: parseInt(navigateId) // 这里乘以一个 1 为了将字符串转换成 int类型
    });
    this._getVideoList(this.data.navigateId);
  },

  // 点击播放| 继续播放 触发事件
  Play(event) {

    let vid = event.currentTarget.id;
    console.log(vid)
    this.vid !== vid && this.videoContext && this.videoContext.stop(); // 关闭上一个播放的视频
    this.vid = vid;
    // 更新data中的videoId的状态数据
    this.setData({
      videoId: vid // 当前播放的videoID
    })
    // 1. 创建一个可以控制 video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前的视频是否有播放纪录：如果有，跳转☞指定的位置
    let {
      videoUpdateTime
    } = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if (videoItem) { // 跳转
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play()
  },

  //  监听视频播放的事件
  handleTimeUadate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }; // 整合一个对象，标记视频的播放时长
    let {
      videoUpdateTime
    } = this.data;
    // 判断纪录播放时长的videoUatateTime数组中是否存在当前的视频的播放记录
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) { // 已存在
      videoItem.currentTime = videoTimeObj.currentTime;
    } else { // 数组里面的没有纪录
      videoUpdateTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdateTime: videoUpdateTime
    })
  },

  // 视频播放结束的回调函数
  handleEnded(event) {
    console.log("播放结束");
    // 移除纪录时长数组中当前视频的纪录
    let {
      videoUpdateTime
    } = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      videoUpdateTime: videoUpdateTime
    })
  },

  //  自定义下拉刷新的回调 ：scroll-view
  handleRefresh(event) {
    // 1.发请求，获取最新的视频数据
    // 2. 关闭下拉，在getVideoGroupListData函数中进行
    this._getVideoList(this.data.navigateId);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.showToast({
        title:"请先登录",
        icon:"none",
        duration:1500,
        success:()=>{
          // 跳转到登录界面
          wx.reLaunch({
            url:"/pages/login/login"
          })
        }
      })
    }
    this._getVideoGroupListData(); // 获取导航标签数据
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
  onShareAppMessage: function ({
    from
  }) {
    console.log(from);
    if (from === "button") {
      return {
        title: "来自Group5的转发",
        page: "/pages/video/video",
        //imageUrl: this.item.data.coverUrl
      }
    }
  }
})