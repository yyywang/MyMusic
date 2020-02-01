// pages/index/index.js
import {
    HTTP
} from '../../utils/http.js'
const app = getApp();
const http = new HTTP();

Page({
    data: {
        TabCur: 0,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        classicalList: null,
        popList: null,
        vocalList: null,
        hasUserInfo: false,
        loadProgress: false,
        onSearch: false
    },
    onLoad: function () {
        this.getData();
    },
    tabSelect: function (e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        this.getData();
    },
    // 获取数据
    getData: function (callBack) {
        if (this.data.TabCur == 0) {
            this.getWeekData('classical', callBack)
        } else if (this.data.TabCur == 1) {
            this.getWeekData('pop', callBack)
        } else {
            this.getVocalData(callBack);
        }
    },
    // 获取 classical/流行音乐 周数据
    getWeekData: function (category, callBack) {
        var that = this;

        if (category == 'classical') {
            // 如果有缓存数据，不再进行获取数据请求
            if (this.data.classicalList) return;
            var params = {
                url: 'course/' + category + '/week',
                sCallback: function(res){
                    that.setData({
                        classicalList: res
                    })
                    callBack && callBack(that)
                },
                eCallback: function(res) {
                    callBack && callBack(that)
                }
            }
        }
        if(category == 'pop'){
            // 如果有缓存数据，不再进行获取数据请求
            if (this.data.popList) return;
            var params = {
                url: 'course/' + category + '/week',
                sCallback: function(res){
                    that.setData({
                        popList: res
                    })
                    callBack && callBack(that)
                },
                eCallback: function(res) {
                    callBack && callBack(that)
                }
            }
        }
        // 从服务端获取数据
        http.request(params);
    },
    // 获取声乐课程数据
    getVocalData: function (callBack) {
        callBack && callBack()
    },
    onWeekTap: function (e) {
        var week = e.currentTarget.dataset.week;
        var tabCur = this.data.TabCur;
        var category = null;

        // classical与pop
        if(tabCur != 2) {
            var category = tabCur == 0 ? 'classical' : 'pop';
            wx.navigateTo({
                url: './a-week-course/a-week-course?category=' + category + '&week=' + week,
            })
        // vocal
        }else {

        }
    },

    onPullDownRefresh: function () {
        // 下拉刷新需要重新向服务端读取数据
        // 将缓存清除，调用 getData() 函数即可向服务端请求数据。即：
        // 将 popList/classicalList/vocalList 值设为 null
        this.setData({
            loadProgress: true,
            popList: null,
            classicalList: null,
            vocalList: null
        })

        this.getData(function(page){
            wx.stopPullDownRefresh()
            page.setData({
                loadProgress: false
            })
        })
    },
    onSearchFocus: function (e) {
        this.setData({
            onSearch: true
        })
    },
    onSearchCancel: function (e) {
        this.setData({
            onSearch: false
        })
    }
})