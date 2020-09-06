// components.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: ''
    },
    imgUrl: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickitem:function(){
      this.triggerEvent("removeItem")
      console.log('triggerEvent ...')
    },
    toWhere: function() {
      this.triggerEvent("toWhere")

    }

  }
})
