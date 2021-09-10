// components/slider/slider.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiper:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    circular: true,
    indicatorActiveColor: '#FF0000',
    indicatorColor: '#FFFAFA',
    duration: 500
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
