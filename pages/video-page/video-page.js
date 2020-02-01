// pages/video-page/video-page.js
import {HTTP} from '../../utils/http.js'
const app = getApp();
const http = new HTTP();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        music: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       this.setData({
           mid: options.mid
       })
       this._getData();
    },
    /**
     * 点击点赞按钮
     * 
     * 向服务端提交数据成功后，只更新本地点赞按钮状态
     * 不再重新拉取整个 music 数据
     * @param {*} e 
     */
    onLikeTap: function(e) {
        this._likeOrNot(this.data.mid);
    },
    // 逻辑同 “点赞”
    onFavorTap: function(e) {
        this._favorOrNot(this.data.mid)
    },
    // 获取music数据
    _getData: function(e){
        this._rqMusic(this.data.mid);
    },
    // 检测数据 key 是否存在，即是否有缓存数据
    _checkCatch:function(key) {
        return this.data[key] ? true : false
    },
    // 向服务端请求指定id的music数据
    _rqMusic: function(id) {
        var that = this;
        var params = {
            url: 'music/' + id,
            sCallback: function(res) {
                that.setData({
                    music: res
                })
            },
            eCallback: function(e) {}
        }

        http.request(params);
    },
    // 点赞或取消点赞
    _likeOrNot: function(mid) {
        var that = this;
        var params = {
            url: 'music/like/' + mid,
            type: 'put',
            sCallback: function(res){
                that._updateLikeStatus(that)
            },
            eCallback: function(e){}
        }

        http.request(params)
    },
    // 更新本地 点赞 状态与数据
    _updateLikeStatus: function(page) {
        var music = page.data.music;

        music.has_like ? music.like_num-- : music.like_num++
        music.has_like = !music.has_like
        page.setData({
            music: music
        })
    },
    // 收藏或取消收藏
    _favorOrNot: function(mid){
        var that = this;
        var params = {
            url: 'music/favor/' + mid,
            type: 'put',
            sCallback: function(res){
                that._updateFavorStatus(that)
            },
            eCallback: function(e){}
        }

        http.request(params)
    },
    // 更新本地 收藏 状态与数据
    _updateFavorStatus: function(page) {
        var music = page.data.music;

        music.has_favor ? music.favor_num-- : music.favor_num++
        music.has_favor = !music.has_favor
        page.setData({
            music: music
        })
    },
})