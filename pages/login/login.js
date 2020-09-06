import {

  depUserLogin,
} from '../../lib/apiRestraunt'


const globalData = getApp().globalData;
var load = require('../../lib/load.js');

Page({

  data: {
    canLogin: false,
    accept: false
  },

  onLoad: function (options) {
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
                  this.setData({
                    userId: res.result.data.userInfo.nxDepartmentUserId,
                  })
                  wx.redirectTo({
                    url: '../../pages/index/index?userId=' + this.data.userId,
                  })

                } else {
                  load.hideLoading();
                  wx.showToast({
                    title: res.result.msg,
                  })
                }
              })
          },
          fail: (res => {
            load.hideLoading();
            wx.showToast({
              title: res,
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