// components/shareButton/mymodal.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },

    item: {
      type: Object,
      value: ""
    },
   
    editIndependent: {
      type: Boolean,
      value: false
    },
    item: {
      type: Object,
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
      this.setData({ show: false, item: "",editIndependent: false, })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      this.triggerEvent('confirm', {
       
        item: this.data.item 
      })

      this.setData({
        show: false,
        item: "",
        edit: false,

      })
    },

    getGoodsName: function (e) {
      console.log(e)
      var item = "item.nxDigGoodsName";
      this.setData({
        [item]: e.detail.value
      })
    },
    getStandard: function (e) {
      console.log(e)
      var item = "item.nxDigGoodsStandardname";
      this.setData({
        [item]: e.detail.value
      })
    },

    




    getFocus: function(e){
      
      this.triggerEvent('getFocus', {
        myHeight: e.detail.height,
       
      })
    }




  },
  

  
  
})
