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
      this.setData({show: false})
    },

    cancle() {
      this.setData({ show: false,editApply:false,depStandardArr: [] })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      
     console.log(this.data.applyNumber + "applynamenrmer")
      if(this.data.applyNumber  > 0){
        var regex=/^[0]+/; //整数验证正则        
        var apply = "";
        if(this.data.applyNumber.indexOf(".") !== -1){
          apply = this.data.applyNumber;
        }else{
          apply = this.data.applyNumber.replace(regex, "");
        }
        this.triggerEvent('confirm', {
          applyNumber: apply ,
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
          icon: "none"
        })
      }
     
     
    },

    standardchange: function(){
      var name = e.currentTarget.dataset.name;
      this.triggerEvent('changeStandard', {
        applyStandardName: name

      })
    },

   

  
    getApplyNumber: function (e) {
    
      var numberStr = this.data.applyNumber.toString();
      var y = String(numberStr).indexOf(".") ;//获取小数点的位置
      if(y !== -1){
        var count = String(numberStr).length - y;//获取小数点后的个数
      }

      if(e.detail.value > 9999 ){
        wx.showToast({
          title: '最大不能超过9999',
          icon: "none"
        })
      
        this.setData({
          applyNumber: numberStr.substring(0, numberStr.length ),
        })
        
      } else if(count > 2 || count == 2){

        wx.showToast({
          title: '小数点只能保留一位',
        })
        this.setData({
          applyNumber: numberStr.substring(0, numberStr.length - 1),
        })
      }
      
      else {
        console.log(e.detail.value+ " else lide ")
        if(e.detail.value > 0  || e.detail.value == 0){
         

          this.setData({
            applyNumber: e.detail.value
          })
        }else{
          wx.showToast({
            title: '只能填写数字',
            icon: 'none'
          })

          // var g
          // var reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");

          this.setData({
            applyNumber: numberStr.substring(0, numberStr.length ),
          })
        }
      }
     
     
    },

   

    addRemark: function (e) {
      if(e.detail.value.length < 15){
        this.setData({
          applyRemark: e.detail.value
        })
      }else{
        wx.showToast({
          title: '最多输入15个字符。',
          icon:  'none'
        })
        var str = this.data.applyRemark;
        this.setData({
          applyRemark: str.substring(0, e.detail.value.length)
        })
      }
      

    },

    changeStandard: function (e) {
      var name = e.currentTarget.dataset.name;
      this.triggerEvent('changeStandard', {
        applyStandardName: name

      })
     

    },
    switchChange(e){
      var value = e.detail.value;
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
