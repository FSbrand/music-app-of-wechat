// pages/hot_songlist/hot_songlist.js
const api = require('../../utils/Api.js')
import PubSub from 'pubsub-js'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        music_list: [],
        head_image: '',
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // 点击歌曲 跳转不同的详情页
    toPlay(event) {
        // 接收参数
        let {
            song,
            index
        } = event.currentTarget.dataset;
        this.setData({
            index: index
        })
        // 路由跳转传参：query 参数
        wx.navigateTo({
            // url:"/pages/songDetail/songDetail?song="+ JSON.stringify(song)
            url: "../music_play/musci_play?musicId=" + song.id
        })
    },
    _getSongDetail() {
        let data1 = app.globalData.hot_songList
        let data2 = []
        for (let i of data1) {
            data2.push(i.id)
        }
        let data3 = {
            ids: data2.join(',')
        }
        api.getSongDetail(data3).then(value => {
            this.setData({
                music_list: value.songs,
                head_image: app.globalData.hot_SongimgSrc
            })
        }).catch(reason => console.log(reason))

    },
    onLoad: function (options) {
        this._getSongDetail()
        PubSub.subscribe("switchType",(msg,data)=>{
            let {music_list,index} = this.data;
            if(data === "pre"){ // 上一首
              index-=1;
              if(index==-1) index=music_list.length-1;
            }else{ // 下一首
              index=(index+1)%music_list.length;
            }
            this.setData({
              index:index
            })
            let musicId = music_list[index].id; // 将要更新的id
            // 将musicId 回传给songDetail页面
            PubSub.publish("musicId",musicId);
          });
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