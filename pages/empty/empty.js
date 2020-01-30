// pages/empty/empty.js
import {
    HTTP
} from '../../utils/http.js'
const http = new HTTP();

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
        // 若用户已绑定学号和姓名，不显示绑定页面，跳转至首页
        this.verifyRegister(function (res) {
            if (res) {
                wx.switchTab({
                    url: '/pages/index/index'
                })
            } else {
                wx.redirectTo({
                    url: '/pages/register/register'
                })
            }
        })
    },
    // 校验此用户是否注册
    verifyRegister: function (callback) {
        var registered = wx.getStorageSync('registered');
        // 若本地有已注册标识则不进行服务端注册校验
        if (registered) {
            callback && callback(registered);
            return;
        }
        // 服务端校验
        wx.login({
            success: res => {
                var params = {
                    url: 'client',
                    data: {
                        account: res.code,
                        type: 200
                    },
                    sCallback: function (res) {
                        // 本地写入已注册标识
                        var registered = false;
                        if (res.id) {
                            registered = true;
                            wx.setStorage({
                                data: true,
                                key: 'registered',
                            })
                        }
                        console.log(res)
                        callback && callback(registered);
                    },
                    eCallback: function (res) {
                        if(res.data.error_code === 1001) {
                            callback && callback(false);
                        }
                    }
                }

                http.request(params);
            }
        })

        return registered;
    }
})