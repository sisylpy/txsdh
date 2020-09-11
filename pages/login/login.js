
const globalData = getApp().globalData;
var load = require('../../lib/load.js');

import {
  depUserLogin,
} from '../../lib/apiRestraunt'

Page({

  onLoad: function () {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })
  },



  //微信授权点击“允许”
  getUserInfo: function (e) {
    wx.getUserInfo({
      success: res => {
        load.showLoading("用户登录中")
        wx.login({
          success: (res) => {
            depUserLogin(res.code)
              .then((res) => {
                wx.hideLoading()
                if (res.result.code !== -1) {   
                  wx.redirectTo({
                    url: '../../pages/index/index?userId=' + res.result.data.userInfo.nxDepartmentUserId,
                  })
                } else {
                  load.hideLoading();
                  wx.showToast({
                    title: res.result.msg,
                    icon:'none'
                  })
                }
              })
          },
          fail: (res => {
            load.hideLoading();
            wx.showToast({
              title: "请重新操作",
              icon:'none'
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