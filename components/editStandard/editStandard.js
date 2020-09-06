// components/shareButton/mymodal.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: true
    },
    item: {
      type: Object,
      value: ""
    },
    nxGoodsName: {
      type: String,
      value: ""
    },
    standardName: {
      type: String,
      value: ""
    }

   

   
  
   
    
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInput: false,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({show: false})
    },

    cancle() {
      this.setData({ show: false })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      
      this.triggerEvent('confirm', {
        standardName: this.data.standardName,
       
      })

      this.setData({
        show: false,
        standardName: "",
      })
    },

    getStandard: function (e) {
      console.log(e)
      this.setData({   
        standardName: e.detail.value
      })
    },

    









  },
  

  
  
})
