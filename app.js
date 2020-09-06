//app.js
App({
  globalData: {
    currentMonthData: [],
    nickname: null,
    avatarUrl: null,
    windowWidth: null,
    widowHeight: null,
    platform: "",
    disId: null,
    userInfo: null,
    tab1Index: null,
  },
  
  onLaunch: function () {

    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        let width = res.windowWidth,
          height = res.windowHeight,
          rpxR = 750 / width,
          screenHeight = res.screenHeight,
          statusBarHeight = res.statusBarHeight,
          pixelRatio = res.pixelRatio
        this.globalData = {
          windowWidth: width,
          windowHeight: height,
          screenHeight: screenHeight,
          statusBarHeight: statusBarHeight,
          scale: width / 375,
          pixelRatio: pixelRatio,
          rpxR: rpxR,
        }
      }
    })

  },

  getPlatform: function () { //获取客户端平台
    console.log(this.globalData)
    console.log("thithitithtiitisissss")
    return this.globalData["platform"]
  },


  BLEInformation:{
    platform: "",
    deviceId: null,
    writeCharaterId: "",    
    writeServiceId: "",
    notifyCharaterId: "",
    notifyServiceId: "",
    readCharaterId: "",
    readServiceId: "",
  }

})