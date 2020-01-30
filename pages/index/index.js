// pages/index/index.js
const app = getApp()

Page({
    data: {
        TabCur: 0,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        weekList: [],
        hasUserInfo: false,
        loadProgress: false,
        onSearch: false
    },
    onLoad: function() {
        this.getWeekData();
    },
    tabSelect: function(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })

        this.getWeekData()
    },
    getWeekData: function(event) {
        var category = '';

        if (this.data.TabCur == 0) {
            category = 'classical';
        } else {
            category = 'pop'
        }

    },
    onWeekTap: function(event) {
        var week = event.currentTarget.dataset.week;
        var category = event.currentTarget.dataset.category;

        wx.navigateTo({
            url: './a-week-list/a-week-list?week=' + week + '&category=' + category,
        })
    },

    onPullDownRefresh: function() {
        this.setData({
            loadProgress: true
        })

        this.getWeekData()
    },
    onSearchFocus: function(e) {
        this.setData({
            onSearch: true
        })
    },
    onSearchCancel: function(e) {
        this.setData({
            onSearch: false
        })
    }
})