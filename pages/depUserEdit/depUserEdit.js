const globalData = getApp().globalData;
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'


import {
  updateDepUserWithFile,
  updateDepUser,
 
} from '../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    canSave: false,
    imgChanged: false,
    weeks: 1,
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,

    })

    var depInfo = wx.getStorageSync('depInfo');
    if (depInfo) {
      this.setData({
        depInfo: depInfo,
      })

      var weeks = depInfo.nxDepartmentShowWeeks;
      var items = [];
      for(var i = 0; i < 4; i++){
        var check = false;
        if(weeks == i + 1){
          check = true;
        }
        var item = {
          value: i + 1,
          checked: check
        }
        items.push(item);

      }
      this.setData({
        items: items,
        weeks: weeks
      })
    }


    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        userName: userInfo.nxDuWxNickName
      })
      if (userInfo.nxDuUrlChange == 1) {
        this.setData({
          src: apiUrl.server + userInfo.nxDuWxAvartraUrl
        })
      } else {
        this.setData({
          src: userInfo.nxDuWxAvartraUrl,

        })
      }
    }

  },


  //选择图片
  choiceImg: function (e) {
    var _this = this;

    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        _this.setData({
          src: res.tempFilePaths,
          isSelectImg: true,
          imgChanged: true,
          canSave: true

        })
        // _this._checkSave();
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },


  /**
   * 获取用户名
   * @param {*} e 
   */
  getUserName(e) {
    if(e.detail.value !== this.data.userInfo.nxDuWxNickName){
      this.setData({
        userName: e.detail.value,
        canSave: true,
      })
    }
   

  },

  /**
   * 修改显示周期
   * @param {}} e 
   */
  radioChange: function (e) {
    this.setData({
      weeks:e.detail.value,
      canSave: true,
    })
  },

/**
 * 保存修改内容
 */
  save() {

    //如果修改了图片
    if (this.data.imgChanged) {
      var filePathList = this.data.src;
      var userName = this.data.userName;
      var userId = this.data.userInfo.nxDepartmentUserId;
      var weeks = this.data.weeks;
      var depId = this.data.depInfo.nxDepartmentId;
      load.showLoading("保存修改内容")
      updateDepUserWithFile(filePathList, userName, userId, weeks, depId).then(res => {
        if(res.result == '{"code":0}'){ 
          load.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
        
      })
    } else {
      //没有修改图片
      var userName = this.data.userName;
      var userId = this.data.userInfo.nxDepartmentUserId;
      var depId = this.data.depInfo.nxDepartmentId;
      var weeks = this.data.weeks;

      var data = {
        userName: userName,
        weeks: weeks,
        userId: userId,
        depId: depId
      }
      load.showLoading("保存修改内容");
      updateDepUser(data).then(res => {
        if (res.result.code == 0) {
          load.hideLoading();
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; 
        prevPage.setData({
          userInfo: res.result.data.userInfo,
          depInfo: res.result.data.depInfo,
          weeks: this.data.weeks,
        })
        wx.navigateBack({
          delta: 1
        })
        wx.setStorageSync('depInfo', res.result.data.depInfo);
        wx.setStorageSync('userInfo', res.result.data.userInfo);
      }else{
        wx.showToast({
          title: '获取信息失败',
          icon: 'none'
        })
      }
      })
    }
  },

  

   






})