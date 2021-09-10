// pages/login/login.js

const api = require('../../utils/Api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  // 监听输入文本框事件
  getInput(e){
    
    let type=e.currentTarget.id; //  通过id 传值
    this.setData({
      [type]:e.detail.value
    })
  },

  //登录的回调
  login() {
    // 解构赋值
    let {phone, password} = this.data;
    // 2. 前端验证 : 不能为空，号码正确
    if (!phone) {
      // 提醒用户
      wx.showToast({
        title: "用户名不能为空！",
        icon: "none"
      });
      return;
    }
    // 正则表达式：号码正确
    let phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      // 提醒用户
      wx.showToast({
        title: "手机号格式错误！！",
        icon: "none"
      });
      return;
    }
    // 验证密码
    if (!password) {
      // 提醒用户
      wx.showToast({
        title: "密码不能为空！！",
        icon: "none"
      });
      return;
    }
    let result = api.Login({phone,password,isLogin:true}).then(value=>{
        if(value.code === 200){ // 登录成功
            wx.showToast({
              title: "登录成功！"
            });
            // * JSON.stringify()的作用是将 JavaScript 对象转换为 JSON 字符串，而JSON.parse()可以将JSON字符串转为一个对象
            console.log(value.profile)
            wx.setStorageSync("userInfo",JSON.stringify(value.profile));
            wx.reLaunch({
              url:"/pages/my_tabbar/my"
            });
          }
          else if(result.code === 400){
            wx.showToast({
              title: "手机号错误 ！",
              icon: "none"
            });
          }
          else if(result.code === 502) {
            wx.showToast({
              title: "密码错误 ！",
              icon: "none"
            });
          }
          else{
            wx.showToast({
              title: "登录失败，请重新登陆 ！",
              icon: "none"
            });
          }
    }).catch(reason=>console.log(reason))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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