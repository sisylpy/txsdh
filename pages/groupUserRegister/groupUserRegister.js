// pages/restaurant/restaurant.js


const globalData = getApp().globalData;


import {
  depOrderUserSave,
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
      depId: options.depId,
      disId: options.disId,
      depName: options.depName,
    })
  },


  //用户授权
  getUserInfo: function (e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            // 注册接口
            if (e.currentTarget.dataset.type == 0) {
              var nxDepartmentUser = {
                nxDuWxNickName: e.detail.userInfo.nickName,
                nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDuCode: res.code,
                nxDuAdmin: 0,
                nxDuDepartmentId: this.data.depId,
                nxDuDistributerId: this.data.disId,
                nxDuDepartmentFatherId: this.data.depId,
              }
              depOrderUserSave(nxDepartmentUser)
                .then((res => {
                  if (res.result.code !== -1) {
                    wx.redirectTo({
                      url: '../../pages/index/index?userId=' + res.result.data,
                    })
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                    })
                  }
                }))
            } else {

              // 登陆接口
              depUserLogin(res.code)
                .then((res) => {
                  wx.hideLoading()                
                  if (res.result.code == 0) {
                    wx.redirectTo({
                      url: '../../pages/index/index?userId=' + res.result.data.userInfo.nxDepartmentUserId,
                    })
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                    })
                  }
                })
            }
          },
          fail: (res => {
            wx.showToast({
              title: res,
            })
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: '请检查网络',
        })
      }
    })
  },












})