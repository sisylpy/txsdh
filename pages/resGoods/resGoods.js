// pages/purchase/purchase.js
var load = require('../../lib/load.js');

let windowWidth = 0;
let itemWidth = 0;
const globalData = getApp().globalData;

import {
  depGetDepDisGoodsCata, 
  depGetIndependentGoods,
  saveOrder, 
  saveDepIndependentGoods,
  editDepIndependentGoods,
  deleteDepIndependentGoods
} from '../../lib/apiRestraunt';



Page({
  data: {
    tab1Index: 0,
    itemIndex: 0,
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: [
      {
        id: 1,
        amount: 0,
        words: "配送"
      },{
        id: 2,
        amount: 0,
        words: "自采购"
      } ],
    limit: 20,
    page: 1,
    isSearching: false,
    editIndependent:false
  },

  onLoad: function (options) {

    this.setData({
      depFatherId: options.depFatherId,
    })
    
    var value = wx.getStorageSync('userInfo');
    if (value) {
      this.setData({
        userInfo: value,
      })
    }
   
    var depValue = wx.getStorageSync('depInfo');
    if (depValue) {
      this.setData({
        depInfo: depValue,       
      })
      if(this.data.depInfo.nxDepartmentFatherId == 0){
        this.setData({
          depFatherId: this.data.depInfo.nxDepartmentId,
        })
      }else{
        this.setData({
          depFatherId: this.data.depInfo.nxDepartmentFatherId
        })
      }
    }

    this.clueOffset();

    this._getDepDisGoods();

  },

  
  /**
   * 获取配送商品类别列表
   */
  _getDepDisGoods(){
    load.showLoading("获取配送商品")
    depGetDepDisGoodsCata(this.data.depFatherId).then(res => {
      if(res.result.code == 0) {
        load.hideLoading();
        this.setData({
          depGoodsArr: res.result.data,
        })
      }else{
        wx.showToast({
          title: '获取配送商品类别失败',
        })
      }
    })
  },

  /**
   * 获取自采购申请
   */
  _getDepIndependentGoods(){
    load.showLoading("获取自采购商品")
   depGetIndependentGoods(this.data.depFatherId).then(res =>{
     if(res.result.code ==0){
      load.hideLoading();
      this.setData({
        independentArr: res.result.data,
        item: ""
      })

      
      var that = this;
      var query = wx.createSelectorQuery();
      //选择id
      query.select('#mjltest').boundingClientRect()
      query.exec(function (res) {
        
        that.setData({
          maskHeight: res[0].height * globalData.rpxR
        })
      })
      
      
     }else{
       wx.showToast({
         title: '获取自采购商品失败',
         icon: 'none'
       })
     }
   })
  },

  /**
   * 计算偏移量
   */
  clueOffset() {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs) {
          tempArr.push(itemWidth * i);
        }
        // tab 样式初始化
        windowWidth = res.windowWidth;
        that.setData({
          sliderOffsets: tempArr,
          sliderOffset: 0,
          sliderLeft: 0,
          windowWidth: globalData.windowWidth * globalData.rpxR,
          windowHeight: globalData.windowHeight * globalData.rpxR,
        });



      }
    });
  },

  /**
   * tabItme点击
   */
  onTab1Click(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
      itemIndex: index,
      showOperation:false
    })
  },

  /**
   * swiper-item 的位置发生改变
   */
  swiperTran(event) {
    let dx = event.detail.dx;
    let index = event.currentTarget.dataset.index;
    if (dx > 0) { //----->
      if (index < this.data.tabs.length - 1) { //最后一页不能---->
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        this.setData({
          sliderOffset: newOffset,
        })
      }
    } else { //<-----------
      if (index > 0) { //最后一页不能<----
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        this.setData({
          sliderOffset: newOffset,
        })
      }
    }

  },

  /**
   * current 改变时会触发 change 事件
   */
  swiperChange(event) {
    // this.setData({
    //   sliderOffset: this.data.sliderOffsets[event.detail.current],
    //   tab1Index: event.detail.current,
    //   itemIndex: event.detail.current,
    // })
  },
  /**
   * 动画结束时会触发 animationfinish 事件
   */
  animationfinish(event) {
    this.setData({
      sliderOffset: this.data.sliderOffsets[event.detail.current],
      tab1Index: event.detail.current,
      itemIndex: event.detail.current,
    })
    if(!this.data.isSearching){
      if(this.data.tab1Index == 0){
        this._getDepDisGoods();
      }
      if(this.data.tab1Index == 1){
        this._getDepIndependentGoods();
      }
    }
  },

  showOrHide(e){
    var greatIndex = e.currentTarget.dataset.greatindex;
    var grandIndex = e.currentTarget.dataset.grandindex;
    for( var i = 0; i < this.data.depGoodsArr.length; i ++){
     
      for(var j = 0; j < this.data.depGoodsArr[i].fatherGoodsEntities.length; j++){
        var itemShow = "depGoodsArr["+ i+"].fatherGoodsEntities["+ j+"].isShow";
         if (i != greatIndex || j != grandIndex) {
          this.setData({
            [itemShow]: false
          })         
         }    
      }  
    }

    var show = this.data.depGoodsArr[greatIndex].fatherGoodsEntities[grandIndex].isShow;
    var itemShow = "depGoodsArr["+ greatIndex+"].fatherGoodsEntities["+ grandIndex+"].isShow";
    this.setData({
      [itemShow]: !show
    })
  },


  //search-bar
  getGoodsName(e) {
    var value = e.detail.value;
    if(value.length > 0){
      this.setData({
        isSearching: true,
      })
      var data = {
        depId: this.data.depId,
        searchStr: value
      }
      // searchDepDisGoodsAndIndependentGoods(data).then(res => {
      //   if (res) {
      //     console.log(res.result.data)
      
      //     var  depArr = res.result.data.depGoodsArr;
      //     var amountDep = 0;
      //     for(var i = 0; i < depArr.length;  i++){
      //       var tempArrLength = depArr[i].fatherGoodsEntities.length;
      //       amountDep = amountDep + tempArrLength;
      //     }
      //     var  indArr = res.result.data.independentArr;
      //     var amountInd = 0;
      //     for(var i = 0; i < indArr.length;  i++){
      //       var tempIndArrLength = indArr[i].list.length;
      //       amountInd = amountInd + tempIndArrLength;
      //     }

        
      //     this.setData({
      //       depGoodsArr: res.result.data.depGoodsArr,
      //       independentArr: res.result.data.independentArr,
      //       tabs: [{
      //         amount: amountDep ,
      //         words: "配送"
      //       },{
      //         amount: amountInd,
      //         words: "自采购"
      //       } ],
      //     })
      //   }
      // })
    }else{
      this.setData({
        isSearching: false
      })
      this._getDepDisGoods();
      this._getDepIndependentGoods();
    }   
  },


  /**
   * 打开操作，选择操作商品
   * @param {} e 
   */
  openOperation(e) {
    this.setData({
      showOperation: true,
      pareIndex: e.currentTarget.dataset.pareindex,
      index: e.currentTarget.dataset.index,
      item: e.currentTarget.dataset.item,
    })
  },

  
  /**
   * 添加自定义商品
   */
  addIndependent(){
    this.setData({
      showIndependent: true,
      item: ""
    })
  },

 
  /**
   * 修改自定义商品
   */
  edit(){
    var item = this.data.independentArr[this.data.pareIndex].list[this.data.index];
   
    this.setData({
      showIndependent: true,
      editIndependent: true,
      // item: this.data.independentArr[this.data.pareIndex].list[this.data.index],
    })
  },
  
  /**
   * 删除自定义商品
   */
  delete(){
    deleteDepIndependentGoods(this.data.item.nxDepartmentIndependentGoodsId)
    .then(res =>{
      if(res.result.code == 0){
        this._getDepIndependentGoods();
      }else{
        wx.showToast({
          title: res.result.msg,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 添加或修改自定义商品
   * @param {} e 
   */
  confirmAdd: function (e) {

    if(this.data.editIndependent){
      var data = {
        nxDepartmentIndependentGoodsId: this.data.item.nxDepartmentIndependentGoodsId,
        nxDigGoodsName: e.detail.item.nxDigGoodsName,
        nxDigGoodsStandardname: e.detail.item.nxDigGoodsStandardname
      }
      load.showLoading("修改自采购商品")
      editDepIndependentGoods(data).then(res =>{
        if(res.result.code == 0){
          load.hideLoading();
          this._getDepIndependentGoods();
        }else{
          wx.showToast({
            title: '修改商品失败',
            icon: 'none'
          })
        }
      })
    }else{
      var fatherId = "";
      if(this.data.depInfo.nxDepartmentIsGroupDep == 0){
          fatherId = this.data.depInfo.nxDepartmentFatherId
      }if(this.data.depInfo.nxDepartmentIsGroupDep == 1){
        fatherId = this.data.depInfo.nxDepartmentId
      }
      var data = {
        nxDigDepartmentId: fatherId,
        nxDigGoodsName: e.detail.item.nxDigGoodsName,
        nxDigGoodsStandardname: e.detail.item.nxDigGoodsStandardname
      }
      load.showLoading("保存自采购商品")
      saveDepIndependentGoods(data).
      then(res => {
        if (res.result.code == 0) {
          this._getDepIndependentGoods();
        }else{
          wx.showToast({
            title: '保存自采购商品失败',
            icon: 'none'
          })
        }
      })
      }
  },

/**
 * 关闭操作面板
 */
  hideMask() {
    this.setData({
      showOperation: false,
      // item: "",
    })
  },

  /**
   * 点击弹窗的“关闭”按钮
   */
  cancle(){-
    this.setData({
      item: "",
      editIndependent: false,
      showMyIndependent: false,
      showMyIndependent: false,

    })
  },
 
  /**
   * 添加自定义商品申请
   */
  applyIndependent: function () {
    this.setData({
      showOperation: false,
      showMyIndependent: true,
    })
  },
  /**
   * 保存自定义申请
   * @param {} e 
   */
  confirmOrderIndenpendent(e){
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];

    var order = {
      nxDoOrderUserId: this.data.userInfo.nxDepartmentUserId,
      nxDoIndGoodsId: this.data.item.nxDepartmentIndependentGoodsId,
      // nxDoStandard: this.data.item.nxDigGoodsStandardname,
      nxDoQuantity: e.detail.applyNumber,
      nxDoRemark: e.detail.remark,
      nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
      nxDoDepartmentFatherId: this.data.depFatherId,
      nxDioApplyStatus: 0,
      nxDoIndGoodsPy: this.data.item.nxDigGoodsPy,
      nxDoGoodsType: 1,
      nxDoApplyWhatDay: week,
      nxDoIsAgent: 0,
    };

    load.showLoading("保存自采购申请")
    saveOrder(order).then(res => {
      load.hideLoading();
      if (res.result.code == 0) {
        var isShow = "independentArr["+ this.data.pareIndex +"].list[" + this.data.index +"].isShow"
        // this.setData({
        //   [isShow]: true
        // })
        wx.showToast({
          title: '保存成功！',
        })
      }else{
        wx.showToast({
          title: '保存自采购申请失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 打开配送商品列表页
   * @param {}} e 
   */
  toGoodsList(e){
    wx.navigateTo({
      url: '../resGoodsList/resGoodsList?fatherId=' + e.currentTarget.dataset.id
       + '&fatherName=' +  e.currentTarget.dataset.name,
    })
 },


/**
 * 自采购弹窗获取页面高度
 * @param {*} e 
 */
 getFocus(e){
  var height = e.detail.myHeight;
  this.setData({
    myHeight: (globalData.windowHeight - height) * globalData.rpxR
  })
},




  /**
   * 滑动
   * @param {}} e 
   */

  touchStart: function(e){
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx,sy]
  },
  touchMove: function(e){
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy]
  },
  touchEnd: function(e){
    let start = this.data.touchS
    let end = this.data.touchE
   
    if(this.data.touchS && this.data.touchE){
      if(start[1] < end[1] - 30){
        this.setData({
          showOperation:false,
          item: "",
        })
      }
    }
    
  },



})