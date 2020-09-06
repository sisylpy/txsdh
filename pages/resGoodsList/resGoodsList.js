// pagesRes/disGoodsCata/disGoodsCata.js


const globalData = getApp().globalData;

var load = require('../../lib/load.js');

import {
  depGetDepGoods,
  saveOrder,
  depSaveStandard,
  depUpdateStandard,
  depDeleteStandard,
  getDepGoodsStandard
} from '../../lib/apiRestraunt'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPage: 0,
    totalCount: 0,
    limit: 6,
    currentPage: 1,
    isLoading: false,
    depStandardArr: [],
    editStandard: false,
    showStandard:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      fatherName: options.fatherName,
      goodsFatherId: options.fatherId,
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
        disName: depValue.nxDistributerEntity.nxDistributerName,
        disIntroduce: "专业生鲜配送"
      })
      //确定fatherid
      if (this.data.depInfo.nxDepartmentFatherId == 0) {
        this.setData({
          depFatherId: this.data.depInfo.nxDepartmentId,
        })
      } else {
        this.setData({
          depFatherId: this.data.depInfo.nxDepartmentFatherId
        })
      }
      //确定批发商头像
      if (depValue.nxDistributerEntity.nxDistributerUserEntities[0].nxDiuUrlChange == 1) {
        this.setData({
          disSrc: apiUrl.server + userInfo.nxDuWxAvartraUrl
        })
      } else {
        this.setData({
          disSrc: depValue.nxDistributerEntity.nxDistributerUserEntities[0].nxDiuWxAvartraUrl,

        })
      }
    }
    this._getInitData();
  },
/**
 * 获取初始化商品
 */
  _getInitData() {
    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      depId: this.data.depFatherId,
      fatherId: this.data.goodsFatherId,
    }
     load.showLoading("获取配送商品")
    depGetDepGoods(data).then(res => {
      if (res.result.page) {
        console.log(res.result.page);
        load.hideLoading();
        this.setData({
          goodsList: res.result.page.list,
        })

        //创建节点选择器
        var that = this;
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#mjltest').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          console.log(res);
          //取高度
          console.log(res[0].height);
          that.setData({
            maskHeight: res[0].height * globalData.rpxR
          })
        })
        
      }else{
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },


  /**
   * 显示操作面板，选择被操作商品
   * @param {}} e 
   */
  openOperation(e) {
    this.setData({
      showOperation: true,
      index: e.currentTarget.dataset.index,
      item: e.currentTarget.dataset.item,
      standardName: "",
      depGoodsName: ""
    })
  },
  
  /**
   * 点击+，给商品添加新订货单位
   */
  addStandard(e) {
    this.setData({
      showAdd: true,
      index: e.currentTarget.dataset.index,
      item: e.currentTarget.dataset.item,
      depGoodsName: e.currentTarget.dataset.name,
      standardName: ""
    })
  },

  
  /**
   * 点击订货单位
   * @param {*} e 
   */
  clickStandard(e){
    this.setData({
      showStandard: true,
      showOperation: true,
      index: e.currentTarget.dataset.index,
      standardName: e.currentTarget.dataset.standardname,
      depGoodsName: e.currentTarget.dataset.name,
      itemStandard: e.currentTarget.dataset.itemstandard,
      item: e.currentTarget.dataset.item,
    })
  },

  /**
   * 点击订货单位后，选择-“修改”
   * todo
   */
  edit() {
    this.setData({
       showAdd: true, 
       editStandard: true,
       showStandard: false,
       showOperation:false

     })
   },
  /**
   * 点击订货单位后，选择-“删除”
   * todo
   */
  delete(){
    var depStandardId = this.data.itemStandard.nxDepartmentStandardId;
    depDeleteStandard(depStandardId).then(res =>{
      if(res.result.code == 0){
        console.log(res);
        this._updateGoods();
      }else{
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    })
  },

/**
 * 添加或修改订货单位
 * @param {}} e 
 */
  confirmStandard(e) {
    console.log(e);
    if (this.data.editStandard) {
      this._updateStandard(e);
    } else {
      this._saveStandard(e);
    }
    this.setData({
      standardName: "",
      depGoodsName: "",
      itemStandard: "",
      editStandard:false,
      showStandard: false,


    })
  },
  /**
   * 保存订货单位
   * @param {}} e 
   */
  _saveStandard(e) {
    var data = {
      nxDdsDdsGoodsId: this.data.item.nxDepartmentDisGoodsId,
      nxDdsStandardName: e.detail.standardName,
    }
    depSaveStandard(data).
    then(res => {
      if (res) {
        console.log(res);
        this._updateGoods();
      }
    })
  },
  /**
   * 更新订货单位
   * @param {}} e 
   */
  _updateStandard(e) {
    var data = {
      nxDepartmentStandardId: this.data.itemStandard.nxDepartmentStandardId,
      nxDdsStandardName: e.detail.standardName,
    }
    depUpdateStandard(data).
    then(res => {
      if (res) {
        console.log(res)
        this._updateGoods();
      }
    })
  },
/**
 * 更新商品
 */
  _updateGoods() {
    var that = this;
    getDepGoodsStandard(this.data.item.nxDepartmentDisGoodsId).then(res => {
      if (res.result.code == 0) {
        var arr = "goodsList[" + that.data.index + "].nxDepStandardEntities"
        that.setData({
          [arr]: res.result.data,
          itemStandard: "",
          showStandard: false,
          item: "",
          standardName: "",
          depGoodsName: "",

        })
      }else{
        wx.showToast({
          title: '跟新商品失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 关闭操作面板
   */
  hideMask() {
    this.setData({
      showOperation: false,
      showStandard: false,
      // standardName: "",
      // depGoodsName: "",


    })
  },

  /**
   * 取消 按钮
   */
  cancle(){
    this.setData({
      standardName: "",
      depGoodsName: "",
      itemStandard: "",
      item: "",
      editStandard:false,
      showStandard: false,

    })
  },

/**
   * 打开配送申请弹窗
   */
  applyGoods: function () {
    this.setData({
      showOperation: false,
      show: true,
      applyStandardName: this.data.item.nxDdgDepGoodsStandardname,
    })
  },
/**
 * 换订货单位
 * @param {}} e 
 */
  changeStandard: function (e) {
    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  /**
   * 保存配送申请
   * @param {*} e 
   */
  confirm: function (e) {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];

    var dg = {
      nxDoOrderUserId: this.data.userInfo.nxDepartmentUserId,
      nxDoDepDisGoodsId: this.data.item.nxDepartmentDisGoodsId, //
      nxDdgDisGoodsFatherId: this.data.item.nxDdgDisGoodsFatherId,
      nxDoDisGoodsId: this.data.item.nxDdgDisGoodsId, //1
      nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
      nxDoDistributerId: this.data.depInfo.nxDepartmentDisId,
      nxDoDepartmentFatherId: this.data.depFatherId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      nxDoRemark: e.detail.applyRemark,
      nxDoGoodsType: 0,
      nxDoApplyWhatDay: week,
      isNotice: e.detail.isNotice,
      nxDoIsAgent: 0,
      nxDoDisGoodsFatherId: this.data.goodsFatherId,

    };

    saveOrder(dg).then(res => {
      if (res.result.code == 0) {
        var isShow = "goodsList[" + this.data.index + "].isShow";
        this.setData({
          [isShow]: true,
        })
      }else{
        wx.showToast({
          title: '订单保存失败',
          icon:'none'
        })
      }
    })
  },
/**
 * 弹窗获取页面高度
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
    // console.log(e.touches[0].pageX)
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
    console.log(start)
    console.log(end)
    if(this.data.touchS && this.data.touchE){
      if(start[1] < end[1] - 30){
        this.setData({
          showOperation:false,
        })
      }
    }
    
  },




})