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
   
    carArr: {
      type: Array,
      value: ''
    },
    windowHeight: {
      type: Number,
      value: ""
    },
    windowWidth: {
      type: Number,
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

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    reduceNumber(e) {
      console.log(e);  
      this.triggerEvent('reduce', {
        index: e.currentTarget.dataset.index,
      })

    },
    addNumber(e) {
      this.triggerEvent('add', {
        index: e.currentTarget.dataset.index,
      })
    },

    emptyApplyArr:function(e){
      this.triggerEvent('emptyApplyArr', {
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
