// pages/index/a-week-course/a-week-course.js
import {HTTP} from '../../../utils/http.js'
const app = getApp();
const http = new HTTP();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        inMusicList: null,
        outMusicList: null,
        week: '',
        TabCur: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            week: options.week,
            category: options.category
        })
        this.getData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.videoContext = wx.createVideoContext('myVideo')
    },

    onMusicTap: function(e) {
      wx.navigateTo({
        url: '/pages/video-page/video-page?mid=' + e.currentTarget.dataset.mid,
      })
    },
    tabSelect: function(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        this.getData();
    },
    // 从服务端获取本页面所需数据
    getData: function(e) {
        // 如果没有缓存数据，向服务端请求
        if(!this.checkCatchMusicList()) this.rqMusicList();
    },
    // 向服务端请求一周数据
    rqMusicList: function(e) {
        var category = this.data.category,
            week = this.data.week,
            in_or_out = this.data.TabCur == 0 ? 'in' : 'out',
            that = this;

        var params = {
            url: 'course/' + category + '/week/' + week + '/' + in_or_out,
            sCallback: function(res) {
                if(in_or_out == 'in'){
                    that.setData({
                        inMusicList: res
                    })
                }else {
                    that.setData({
                        outMusicList: res
                    })
                }
            },
            eCallback: function(e){}
        }
        http.request(params)
    },
    // 检测是否有缓存数据
    checkCatchMusicList: function(e) {
        if(this.data.TabCur == 0){
            if(this.data.inMusicList) return true;
        }
        if(this.data.TabCur == 1) {
            if(this.data.outMusicList) return true;
        }

        return false;
    }
})