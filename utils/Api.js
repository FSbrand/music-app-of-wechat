import config from './config'

const Request = function (_url = "", data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + _url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').filter(x => x.indexOf('MUSIC_U') !== -1).join('') : ''
      },
      success: res => {
        if (data.isLogin) {
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          });
        }
        resolve(res.data)
      },
      fail: reason => {
        reject(reason)
      }
    })
  })
}

module.exports = {
  Request,
  getLogin: (data) => {
    return Request('/login/cellphone'), data
  },//登录接口
  getHotSearch:()=>{
    return Request('/search/hot/detail')
  },//获取热搜
  getSearchDefault:()=>{
    return Request('/search/default')
  },//默认搜索关键词
  getBanner:()=>{
    return Request('/banner')
  },//获取轮播图
  getTopList:(data)=>{
    return Request('/top/list',data)
  },//获取榜单
  getSongDetail:(data)=>{
    return Request('/song/detail',data)
  },//获取歌曲详情（通过id）
  getRecommendSongs:(data)=>{
    return Request('/recommend/songs',data)
  },//获取歌曲详情页
  Login:(data)=>{
    return Request('/login/cellphone',data)
  },//登录
  getUserPlayRecord:(data)=>{
    return Request('/user/record',data)
  },//获取播放记录
  getVideoGroupListData:()=>{
    return Request('/video/group/list')
  },//获取视频分组列表
  getVideoList:(data)=>{
    return Request('/video/group',data)
  },//根据标签获取视频列表
  getRecommendSonglist:(data)=>{
    return Request('/top/playlist/highquality',data)
  },//获取推荐歌单
  getPlayListDetail:(data)=>{
    return Request('/playlist/detail',data)
  },//获取歌单详情
  getSearchSuggest:(data)=>{
    return Request('/search/suggest',data)
  },//获取搜索建议
  getSearchDetail:(data)=>{
    return Request('/search',data)
  },//搜索
}