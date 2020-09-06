// components/shareButton/mymodal.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    showInd: {
      type: Boolean,
      value: true
    },
   
    item: {
      type: Object,
      value: ""
    },
    applyStandardName: {
      type: String,
      value: ""
    },
    applyNumber: {
      type: String,
      value: ""
    },
    editApply: {
      type: Boolean,
      value: false
    },
   

   
  
   
    
   
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
      this.setData({showInd: false})
    },

    cancle() {
      this.setData({ showInd: false,  })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      
      this.triggerEvent('confirm', {
        applyNumber: this.data.applyNumber,
      })

      this.setData({
        showInd: false,
        applyNumber: "",
      })
    },

    getQuantity: function (e) {
      console.log(e)
      this.setData({
       
        applyNumber: e.detail.value
      })
    },

    









  },
  

  
  
})
