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
   
    depGoodsName: {
      type: String,
      value: ""
    },
    standardName: {
      type: String,
      value: ""
    },
   
    myHeight: {
      type: Number,
      value: ""
    }
   
   

   
  
   
    
   
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
    clickMask() {
      this.setData({show: false})
    },

    cancle() {
      this.setData({ show: false, standardName: "",depGoodsName: "" })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      if(this.data.standardName.length > 0){
        this.triggerEvent('confirm', {
          standardName: this.data.standardName,
        })
      }
     

      this.setData({
        show: false,
        standardName: "",
        depGoodsName: ""

      })
    },

    getStandard: function (e) {
      console.log(e)
      this.setData({   
        standardName: e.detail.value
      })
    },


    getFocus: function(e){
      
      this.triggerEvent('getFocus', {
        myHeight: e.detail.height,
       
      })
    }
    









  },
  

  
  
})
