// pages/restaurant/restaurant.js


const globalData = getApp().globalData;

import {
  depOrderUserSave,
  getSubDepartments,
  depUserLogin

} from '../../lib/apiRestraunt'

var load = require('../../lib/load.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depFatherId: options.depId,
      disId: options.disId,
      depName: options.depName,
      showDepartment: false,

    })

    load.showLoading("获取子部门")
    getSubDepartments(this.data.depFatherId).then(res => {
      if (res.result.code == 0) {
        load.hideLoading();
        this.setData({
          subDepArr: res.result.data,
          selDepartmentName: res.result.data[0].nxDepartmentName,
          nxDuDepartmentId: res.result.data[0].nxDepartmentId,
        })
      }else{
        wx.showToast({
          title: '获取部门失败',
        })
      }
    })


  },
  showDepartment() {
    this.setData({
      showDepartment: true,
    })

  },
  hideNumber() {
    this.setData({
      showDepartment: false,
    })
  },

  selDepartment(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    this.setData({
      selDepartmentName: name,
      showDepartment: false,
      nxDuDepartmentId: id,
    })

  },


  //用户授权中链接socket
  getUserInfo: function (e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {

        wx.login({
          success: (res) => {
            if (e.currentTarget.dataset.type == 0) {
              var nxDepartmentUser = {
                nxDuWxNickName: e.detail.userInfo.nickName,
                nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDuCode: res.code,
                nxDuAdmin: 0,
                nxDuDepartmentId: this.data.nxDuDepartmentId,
                nxDuDistributerId: this.data.disId,
                nxDuDepartmentFatherId: this.data.depFatherId,
              }

              load.showLoading("保存用户中")
              depOrderUserSave(nxDepartmentUser)
                .then((res => {
                  load.hideLoading();
                  if (res.result.code == 0) {
                    //跳转首页
                    wx.redirectTo({
                      url: '../../pages/index/index?userId=' + res.result.data,
                    })
                  } else {
                    wx.showToast({
                      title: '已注册,请直接登陆',
                      icon: 'none'
                    })
                  }
                }))
            } else {
              // 
              load.showLoading("登陆中")
              depUserLogin(res.code)
                .then((res) => {
                  load.hideLoading();
                  if (res.result.code == 0) { 
                    wx.redirectTo({
                      url: '../../pages/index/index?userId=' + res.result.data.userInfo.nxDepartmentUserId,
                    })
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                      icon: 'none'
                    })
                  }
                }) 
            }
          },
          fail: (res => {
            wx.showToast({
              title: '请重新操作',
              icon: 'none'
            })
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
        
      }
    })
  },














})