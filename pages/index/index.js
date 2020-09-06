// pagesOrder/rIndex/rIndex.js

const globalData = getApp().globalData;
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'

import {
  depGetWeeksApply,
  saveOrder,
  updateOrder,
  deleteOrder,
  getDepAndUserInfo,
  getDepInfo,
  getDepUserInfo,

} from '../../lib/apiRestraunt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChoice: false,
    showOperation: false,
    showMyIndependent: false,
    depFatherId: null,
    edit: false


  },

  onShow: function (options) {

    if (this.data.depFatherId != null) {
      this._getDepApply(); //初始化数据
    }
     if(this.data.edit){
       this._getDepInfo(); //更新用户修改页面后信息
       this._getUserInfo(); //更新用户修改页面后信息
       this.setData({
        edit: false
       })
     }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
      userId: options.userId,    
    })
     
    if(this.data.userId){
      this._querySubDepartments();
    }

  },

  /**
   * 查询是否有子部门
   */
  _querySubDepartments() {
   
    load.showLoading("获取部门信息")
    getDepAndUserInfo(this.data.userId).then(res => {
      this.setData({
        def: "getDepAndUserle"
      })
      if (res.result.code == 0) {
        
        load.hideLoading();
        this.setData({
          userInfo: res.result.data.userInfo,
          depInfo: res.result.data.depInfo,
          disId: res.result.data.depInfo.nxDepartmentDisId,
        })
        wx.setStorageSync('userInfo', res.result.data.userInfo);

        //有部门，等待弹窗选择部门
        if (res.result.data.depInfo.nxDepartmentSubAmount > 0) {
          this.setData({
            showChoice: true,
            subArr: res.result.data.depInfo.nxDepartmentEntities,
          })
        } else {
          //没有部门
          if(res.result.data.depInfo.nxDepartmentIsGroupDep == 0){
            this.setData({
              depId: res.result.data.depInfo.nxDepartmentId,
              depFatherId: res.result.data.depInfo.nxDepartmentFatherId,
            })  
          }
          if(res.result.data.depInfo.nxDepartmentIsGroupDep == 1){
            this.setData({
              depId: res.result.data.depInfo.nxDepartmentId,
              depFatherId: res.result.data.depInfo.nxDepartmentId,
            })  
          }       

          wx.setStorageSync('depInfo', res.result.data.depInfo);

          wx.setNavigationBarTitle({
            title: this.data.depInfo.nxDepartmentName + ".订货群",
          })


          this._getDepApply();

        }
      }else{
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }
    
    })
  },

/**
 * 获取初始化申请数据
 */
  _getDepApply() {
    var date = Number(this.data.depInfo.nxDepartmentShowWeeks) * 7;
    var data = {
      weeks: date,
      depId: this.data.depInfo.nxDepartmentId,
    }
    load.showLoading("获取申请中")
    depGetWeeksApply(data).then(res => {
      if (res.result.code == 0) {
        load.hideLoading();
        this.setData({
          applyArr: res.result.data.arr,
        })

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
          title: '获取数据失败',
          icon: 'none'
        })
      }
    })
  },



/**
 * 子部门选择
 * @param {}} e 
 */
  selectDepartment(e) {
    var index = e.currentTarget.dataset.index;
    var dep = this.data.depInfo.nxDepartmentEntities[index]
    this.setData({
      depInfo: dep,
      depFatherId: dep.nxDepartmentFatherId,
      depId: dep.nxDepartmentId,
      showChoice: false,
      subDepName: dep.nxDepartmentName,
    })

    wx.setStorageSync('depInfo', dep);

    this._getDepApply();

  },


  /**
   * 打开操作面板
   * @param {}} e 
   */
  openOperation(e) {
    console.log(e);
    this.setData({
      showOperation: true,
      applyItem: e.currentTarget.dataset.item,
    })
  },
/**
 * 关闭操作面板
 */
  hideMask() {
    this.setData({
      showOperation: false,
    })
  },


  //显示订单弹窗
  applyGoods: function (e) {
    this.setData({
      show: true,
      showOperation: false,
      applyStandardName: this.data.applyItem.nxDoStandard,
      item: this.data.applyItem.nxDepartmentDisGoodsEntity,
    })
  },

  
/**
 * 点击弹窗的“关闭”按钮
 */
  cancle() {
  
    this.setData({
      show: false,
      editApply: false,
      applyItem: "",
      item: "",
      applyNumber: "",
      applyStandardName: "",
      depStandardArr: [],

    })
  },


/**
 * 申请自采购申请
 */
  applyIndependent: function () {
    this.setData({
      showMyIndependent: true,
      showOperation: false,
      item: this.data.applyItem.nxDepIndependentGoodsEntity,
      applyStandardName: this.data.applyItem.nxDepIndependentGoodsEntity.nxDigGoodsStandardname,
    })
  },


 /**
  * 配送申请，换订货规格
  * @param {*} e 
  */
  changeStandard: function (e) {
    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  // 保存订货订单
  confirm: function (e) {

    //修改申请
    if (this.data.editApply) {
      //配送申请
      if(this.data.applyItem.nxDoGoodsType == 0){
        this._updateDisOrder(e);
      }
      //自采购申请
      if(this.data.applyItem.nxDoGoodsType == 1){
        this._updateIndependentOrders(e);
      }
    } else {
      //保存配送申请
      if(this.data.applyItem.nxDoGoodsType == 0){
        this._saveDisOrder(e);
      }
      //保存自采购申请
      if(this.data.applyItem.nxDoGoodsType == 1){
        this._saveIndependentOrders(e);
      }
    }

    this.setData({
      show: false,
      editApply: false,
      applyItem: "",
      item: "",
      applyNumber: "",
      applyStandardName: "",
      showMyIndependent: false,
    })
  },

  /**
   * 保存配送申请
   * @param {}} e 
   */
  _saveDisOrder(e) {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
  
    var dg = {
      nxDoOrderUserId: this.data.userId,
      nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
      nxDoDistributerId: this.data.disId,
      nxDoDepartmentFatherId: this.data.depFatherId,
      nxDoDisGoodsId: this.data.item.nxDdgDisGoodsId,
      nxDoDepDisGoodsId: this.data.item.nxDepartmentDisGoodsId,
      nxDoDisGoodsFatherId: this.data.item.nxDoDisGoodsFatherId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      isNotice: e.detail.isNotice,
      nxDoRemark: e.detail.applyRemark,
      nxDoGoodsType: 0,
      nxDoApplyWhatDay: week,
      nxDoIsAgent: 0,

    };


    saveOrder(dg).then(res => {
      console.log(res);
      if (res.result.code == 0) {
        this._getDepApply();
      }else{
        wx.showToast({
          title: '保存订单失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 修改配送申请
   * @param {} e 
   */
  _updateDisOrder(e) {

    var dg = {
      nxDepartmentOrdersId: this.data.applyItem.nxDepartmentOrdersId,
      nxDoOrderUserId: this.data.userId,
      nxDoNxGoodsId: this.data.item.nxGoodsId,
      nxDoNxGoodsFatherId: this.data.item.nxGoodsFatherId,
      nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
      nxDoDistributerId: this.data.disId,
      nxDoDepartmentFatherId: this.data.depFatherId,
      nxDoDepDisGoodsId: this.data.applyItem.nxDoDepDisGoodsId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      isNotice: e.detail.isNotice,
      nxDoRemark: e.detail.applyRemark,
      // nxDoGoodsType: 0,
    };

    updateOrder(dg).then(res => {
      if (res) {
        if (res.result.code == 0) {
          this._getDepApply();
        }else{
          wx.showToast({
            title: '修改订单失败',
          })
        }
      }
    })

  },

  /**
   * 保存自采购申请
   * @param {}} e 
   */
  _saveIndependentOrders(e){
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];

    var order = {
      nxDoOrderUserId: this.data.userInfo.nxDepartmentUserId,
      nxDoIndGoodsId: this.data.item.nxDepartmentIndependentGoodsId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: this.data.item.nxDigGoodsStandardname,
      nxDoRemark: e.detail.remark,
      nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
      nxDoDepartmentFatherId: this.data.depFatherId,
      nxDioApplyStatus: 0,
      nxDoIndGoodsPy: this.data.item.nxDigGoodsPy,
      nxDoGoodsType: 1,
      nxDoApplyWhatDay: week,
      nxDoIsAgent: 0,

    };

    saveOrder(order).then(res => {
      console.log(res);
      if (res.result.code == 0) {
        this._getDepApply();
      }else{
        wx.showToast({
          title: '保存订单失败',
          icon: 'none'
        })
      }
    })
  },

/**
 * 修改自采购申请
 * @param {}} e 
 */
  _updateIndependentOrders(e){
    var dg = {
      nxDepartmentOrdersId: this.data.applyItem.nxDepartmentOrdersId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoRemark: e.detail.applyRemark,
    };

    updateOrder(dg).then(res => {
        if (res.result.code == 0) {
          this._getDepApply();
        }else{
          wx.showToast({
            title: '修改申请失败',
            icon: 'none'
          })
        }
      
    })

  },
 

  /**
   * 修改配送商品申请
   */
  editApply() {
    var applyItem = this.data.applyItem;
    this.setData({
      show: true,
      showOperation: false,
      applyStandardName: applyItem.nxDoStandard,
      item: this.data.applyItem.nxDepartmentDisGoodsEntity,
      editApply: true,
      applyNumber: applyItem.nxDoQuantity,
      applyRemark:applyItem.nxDoRemark,

    })
  },

  /**
   * 修改自采购商品申请
   */
  editIndependentApply() {
    this.setData({
      showMyIndependent: true,
      showOperation: false,
      item: this.data.applyItem.nxDepIndependentGoodsEntity,
      applyStandardName: this.data.applyItem.nxDoStandard,
      applyNumber: this.data.applyItem.nxDoQuantity,
      editApply: true
    })
  },

  /**
   * 删除申请
   */
  deleteApply() {
    deleteOrder(this.data.applyItem.nxDepartmentOrdersId).then(res => {
      if (res.result.code == 0) {
        this._getDepApply();
      }
    })
  },


  /**
   * 打开修改部门页面
   */
  toEdit() {
    this.setData({
      edit: true
    })
    wx.navigateTo({
      url: '../depUserEdit/depUserEdit',
    })
  },

/**
 * 打开商品页面
 */
  toResGoods() {
    wx.navigateTo({
      url: '../resGoods/resGoods?depFatherId=' + this.data.depFatherId,
    })
  },


  _getDepInfo(){
    getDepInfo(this.data.depInfo.nxDepartmentId).then(res =>{
      if(res){
      this.setData({
        depInfo: res.result.data,
      })
        wx.setStorageSync('depInfo', res.result.data);
 
      }
    })
 
  },
 
  _getUserInfo(){
     getDepUserInfo(this.data.userInfo.nxDepartmentUserId).then(res =>{
       if(res.result.code == 0){
        this.setData({
          userInfo: res.result.data,
        })
         wx.setStorageSync('userInfo', res.result.data);
       }else{
         wx.showToast({
           title: '获取用户信息失败',
           icon: 'none'
         })
       }
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
          applyItem: "",
        })
      }
    }
   
  },



  // 

})