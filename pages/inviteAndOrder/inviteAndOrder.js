// pagesRes/inviteAndOrder/inviteAndOrder.js


const app = getApp()
const globalData = getApp().globalData;

Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depId: options.depId,
      disId: options.disId,
      subAmount: options.subAmount,
      depName: options.depName,
     
    })

  
  },



/**
 * 分享给同事，加入订货群
 * @param {}} options 
 */
  onShareAppMessage: function (options) {
   
     var shareObj = {
      // title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      // path: '/pages/share/share', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
    if (options.from == 'button') {
      // 此处可以修改 shareObj 中的内容
      if(this.data.subAmount == 0){
        shareObj.title = "请加入订货群"
        shareObj.path = '/pages/groupUserRegister/groupUserRegister?depId=' + this.data.depId + '&disId=' + this.data.disId + '&depName=' + this.data.depName;
      }
      if(this.data.subAmount > 0){
        shareObj.title = "请选择所在部门，加入订货群"
        shareObj.path = '/pages/depUserRegister/depUserRegister?depId=' + this.data.depId + '&disId=' + this.data.disId + '&depName=' + this.data.depName;
      }
    }
    // 返回shareObj
    return shareObj;
  },










})