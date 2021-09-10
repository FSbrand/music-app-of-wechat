// components/toplist/toplist.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        toplist:Object,
        toplist_songs:Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        toplist:[],
        toplist_songs:[]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        to_hotSonglist(){
            app.globalData.hot_songList = this.data.toplist.trackIds
            app.globalData.hot_SongimgSrc = this.data.toplist.coverImgUrl
            wx.navigateTo({
              url: '../../pages/hot_songlist/hot_songlist',
            })
        }
    }
})
