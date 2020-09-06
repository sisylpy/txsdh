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
    applyStandardName: {
      type: String,
      value: ""
    },
    
    applyRemark: {
      type: String,
      value: ""
    },
    item: {
      type: Object,
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
    depStandardArr: {
      type: Array,
      value: []
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
      this.setData({ show: false,editApply:false,depStandardArr: [] })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      
     
      if(this.data.applyNumber  > 0){
        
        this.triggerEvent('confirm', {
          applyNumber: this.data.applyNumber,
          applyStandardName: this.data.applyStandardName,
          applyRemark: this.data.applyRemark,
          isNotice: this.data.isNotice
        })

        this.setData({
          show: false,
          applyNumber: "",
          applyRemark: "",
          remarkContent: "",
          goodsStandard: "",
          isNotice: false,
          editApply: false,
          
        })
      }else{
        wx.showToast({
          title: '数量只能填写数字',
        })
      }
     
     
    },

    standardchange: function(){
      var name = e.currentTarget.dataset.name;
      console.log(e)
      this.triggerEvent('changeStandard', {
        applyStandardName: name

      })
    },

   

   

    getApplyNumber: function (e) {
      console.log(e)
      this.setData({
       
        applyNumber: e.detail.value
      })
    },

   

    addRemark: function (e) {
      this.setData({
        applyRemark: e.detail.value
      })

    },

    changeStandard: function (e) {
      var name = e.currentTarget.dataset.name;
      console.log(e)
      this.triggerEvent('changeStandard', {
        applyStandardName: name

      })
     

    },
    switchChange(e){
      var value = e.detail.value;
      console.log(value);
      if(value){
        this.setData({
          isNotice:  true
        })
      }else{
        this.setData({
          isNotice: false
        })
      }
      

    }




  },
  

  
  
})
