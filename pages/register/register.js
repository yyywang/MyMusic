// pages/register/register.js
import verify from '../../utils/verify.js'
import {HTTP} from '../../utils/http.js'
import {showErrModal} from '../../utils/tips.js'
import {Token} from '../../utils/token.js'

var token = new Token();
const app = getApp();
const http = new HTTP();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: null,
    picker: ['音乐欣赏', '流行音乐赏析', '两者']
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          app.globalData.userInfo = e.detail.userInfo
          this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
          })
          var name = this.data.name,
            stuId = this.data.stuId,
            wxName = this.data.userInfo.nickName,
            category = parseInt(this.data.index);

          if (category === 0) category = 'classical';
          else if (category === 1) category = 'pop';
          else if (category === 2) category = 'both';

          that.register(stuId, name, category, wxName);
        }
      }
    })

  },
  onInputStuId: function (e) {
    var stuId = e.detail.value;
    var lawfulStuId = verify.verifyStuId(stuId);

    this.setData({
      lawfulStuId: lawfulStuId,
      stuId: stuId
    })

    this._setStartBtn();
  },
  onInputName: function (e) {
    var name = e.detail.value;
    var lawfulName = verify.verifyName(name);

    this.setData({
      lawfulName: lawfulName,
      name: name
    })

    this._setStartBtn();
  },
  // 表单输入信息提示
  onStuIdBlur: function (e) {
    if (!this.data.lawfulStuId) {
      this.setData({
        showStuIdTip: true
      })
    } else {
      this.setData({
        showStuIdTip: false
      })
    }
  },
  onNameBlur: function (e) {
    if (!this.data.lawfulName) {
      this.setData({
        showNameTip: true
      })
    } else {
      this.setData({
        showNameTip: false
      })
    }
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    this._setStartBtn();
  },
  // 检测是否可启用“开启”按钮
  _canEnableBtn: function (e) {
    return this.data.lawfulName &&
      this.data.lawfulStuId &&
      typeof this.data.index === "string" ? true : false
  },
  // 启用“开启按钮”
  _enableBtn: function(e) {
    this.setData({
      enableBtn: true
    })
  },
  // 禁用“开启按钮”
  _disableBtn: function(e) {
    this.setData({
      enableBtn: false
    })
  },
   // 设置“开启”按钮
  _setStartBtn: function(e) {
    this._canEnableBtn() ? this._enableBtn() : this._disableBtn();
  },

  // 通过：学号-stuid，姓名-name，所选课程-category 在服务端注册
  register: function (stuId, name, category, wxName) {
    wx.login({
      success: res => {
        var params = {
          url: 'client/register',
          data: {
            name: name,
            account: stuId,
            stu_id: stuId,
            category: category,
            wx_name: wxName,
            code: res.code,
            type: 200
          },
          type: 'POST',
          sCallback: function (e) {
            wx.switchTab({
              url: '/pages/index/index',
            })
            // 注册成功标识，用于今后启动小程序检测是否注册
            wx.setStorage({
              data: true,
              key: 'registered',
            }) 
            token.verify();
          },
          eCallback: function (e) {
            wx.hideLoading({
              complete: (res) => {},
            })
            var that = this;
            if(e.data.error_code === 1005) {
              wx.showModal({
                title: that.data.stu_id + "已被绑定",
                content: "若不是本人绑定，请联系老师",
                showCancel: false
              })
            }else{
              showErrModal(e.data.error_code);
            }
          }
        }
        http.request(params);
        
      }
    })
  }
})