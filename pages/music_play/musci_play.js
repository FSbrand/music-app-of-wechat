import PubSub from 'pubsub-js';
// import moment from "moment";
import math_utils from '../../utils/math_utils'
const api = require('../../utils/Api.js')
// 获取全局实例
const appInstance = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, // 音乐是否播放
        song: {}, // 歌曲详情对象
        musicId: "", // 音乐的id
        musicLick: "", // 音乐链接
        left_time: '',
        sub_time: '',
        left_time1: '',
        sub_time1: '',
        durationTime: 0, // 歌曲总时长
        value: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 1. options：用于接收路由跳转的query参数
        // 2. 原生小程序中路由传参，对参数的长度有限制，如果参数过长会自动截取掉
        let musicId = options.musicId;
        this.setData({
            musicId: musicId
        });
        // 获取音乐详情
        this.getMusicInfo(musicId);

        /* 问题： 如果用户操作系统的控制音乐或者暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
         *  解决方案：
         *     1. 通过控制音频的实例 backgroundAudioManager 去监听音乐播放/暂停
         *
         * */
        // 判断当前音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            // 修改当前页面音乐播放状态为true
            this.setData({
                isPlay: true
            });
        }
        // 创建音乐控制播放实例
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        // 监听音乐播放/暂停/停止
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true);
            appInstance.globalData.musicId = musicId;
        });
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false);
        });
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false);
        });
        // 监听背景音频播放进度更新事件，只有小程序在前台时会回调。
        this.backgroundAudioManager.onTimeUpdate(() => {

            let cureentvalue = (this.backgroundAudioManager.currentTime * 1000 / this.data.durationTime) * 100;
            this.setData({
                value: Math.floor(cureentvalue),
                left_time: math_utils.math_utils_addzero(this.backgroundAudioManager.currentTime / 60, 2),
                left_time1: math_utils.math_utils_addzero(this.backgroundAudioManager.currentTime % 60, 2),
            });
        });
        // 监听音乐播放自然结束
        this.backgroundAudioManager.onEnded(() => {
            // 自动切换下一首,自动播放
            PubSub.publish("switchType", "next");
            // 进度条恢复 0
            this.setData({
                value: 0,
                left_time: '00',
                left_time1: '00',
            })
        });
    },
    //改变进度条
    changevalue(e) {
        console.log(e)
        this.backgroundAudioManager.seek(e.detail.value * this.data.durationTime / 100000)
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay) {
        this.setData({
            isPlay: isPlay
        });
        // 修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = isPlay;
    },

    // 获取音乐的详情的功能函数
    async getMusicInfo(musicId) {
        let songData = await api.Request("/song/detail", {
            ids: musicId
        })
        // songData.data.dt 就是总时长( 毫秒)
        if (songData.songs) {
            let dura = songData.songs[0].dt / 1000
            this.setData({
                durationTime: songData.songs[0].dt,
                song: songData.songs[0],
                left_time: '00',
                left_time1: '00',
                sub_time: math_utils.math_utils_addzero(dura / 60, 2),
                sub_time1: math_utils.math_utils_addzero(dura % 60, 2),
            });
            // 动态修改窗口的标题
            wx.setNavigationBarTitle({
                title: this.data.song.name
            })
        }
    },

    // 点击播放或者暂停的回调函数
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        let {
            musicId,
            musicLink
        } = this.data;
        this.musicControl(isPlay, musicId, musicLink);
    },

    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay, musicId, musicLick) {
        if (isPlay == true) { // 音乐播放
            // 获取播放链接
            if (!musicLick) {
                let musicLickData = await api.Request("/song/url", {
                    id: musicId
                });
                musicLick = musicLickData.data[0].url;
                this.setData({
                    musicLick: musicLick
                })
            }
            this.backgroundAudioManager.src = musicLick; // 添加音乐播放链接
            this.backgroundAudioManager.title = this.data.song.name;
        } else { // 音乐暂停
            this.backgroundAudioManager.pause(); // 音乐暂停
        }
    },

    // 点击切换歌曲回调函数
    handleSwitch(event) {
        // 获取切换的类型
        let type = event.currentTarget.id;
        // 切换歌曲时候关闭当前音乐
        this.backgroundAudioManager.stop();
        // 接收musicId
        PubSub.subscribe("musicId", (msg, musicId) => {
            this.getMusicInfo(musicId);
            // 自动播放音乐
            this.musicControl(true, musicId);
            // 取消订阅
            PubSub.unsubscribe("musicId");
        });

        // 发布消息数据给recommendSong页面
        PubSub.publish("switchType", type);
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
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
            // 修改当前页面音乐播放状态为true
            console.log(true)
            this.setData({
                isPlay: true
            });
        } else {
            if (appInstance.globalData.isMusicPlay) {
                this.musicControl(true,this.data.musicId)
            }
        }
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