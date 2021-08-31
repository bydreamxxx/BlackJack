// create by wj 2018/08/31

const Hall = require('jlmj_halldata');
var dd = cc.dd;
var AppConfig = require('AppConfig');
const defaultDuration = 1000 * 60 * 3;//3分钟
cc.Class({
    extends: cc.Component,

    properties: {
        strTTF: cc.RichText,//跑马灯
        showNode: cc.Node,
    },
    onLoad: function () {
        this._infoArr = [];
        this._isEnd = true;
        this._defaultInfoArr = []; //获取服务器初始默认数据
        this._isDefaultPlay = true;  //判断是否默认播放客户端自设定
        this._isDefaultEnd = true;  //判断默认播放是否完成一次
        this._nDefaultIndex = 0;   //默认跑马灯索引

        Hall.HallED.addObserver(this);
    },
    /**
     * 析构
     * 
     */
    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    update: function (dt) {
        if (this._isDefaultPlay) {//判定一直播放默认的
            ///一次默认的未播放完
            if (this._isDefaultEnd) {
                var now = new Date().getTime();
                if (!this.lastdate || (now - this.lastdate > defaultDuration)) {
                    this.onStartPlayDefaultShow();
                }
            }
        } else {//判定播放系统的
            if (this._isEnd) {
                this.startShow()
            }
        }
    },

    /**
     * 跑马灯默认信息
     */
    onDefaultMarquee: function (data) {
        this._defaultInfoArr = data.contentList;
    },

    /**
     * 播发默认的跑马灯信息
     */
    onStartPlayDefaultShow: function () {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                return;
        }
        if (this._defaultInfoArr.length > 0) {
            this.lastdate = new Date().getTime();
            this.showNode.active = true;
            this._isEnd = false
            this._isDefaultEnd = false;
            if (this._nDefaultIndex >= this._defaultInfoArr.length) {
                this._nDefaultIndex = 0;
            }
            this.showInfo(this._defaultInfoArr[this._nDefaultIndex], 5, 1, this.onDefalutCallBack.bind(this));
            this._nDefaultIndex += 1;
            if (this._nDefaultIndex >= this._defaultInfoArr.length) {
                this._nDefaultIndex = 0;
            }
        }
        else {
            this.showNode.active = false;
        }
    },
    /**
     * 跑马灯默认播放回调
     */
    onDefalutCallBack: function () {
        this._isDefaultEnd = true
        this._isEnd = true
    },

    /**
     * 跑马灯数据
     */
    onMarquee: function (data) {
        this._infoArr.push(data);
        this._isDefaultPlay = false
        if (this._isEnd) {//没有开始
            this.startShow();
        }
    },

    /**
     * 开始
     */
    startShow: function () {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                return;
        }
        var data = this._infoArr.splice(0, 1);
        if (data.length) {
            this.showNode.active = true;
            this._isEnd = false;
            this.showInfo(data[0].content, data[0].speed, data[0].showtimes, this.startShow.bind(this));
        } else {//没有信息则完成一轮
            this._isDefaultPlay = true;
            this._isDefaultEnd = true;
            this._isEnd = true;
        }
    },

    /**
     *
     */
    showInfo: function (text, speed, repeat, closeCb) {
        this.scheduleOnce(function () {
            var show_node = this.showNode;
            this.strTTF.string = text.replace(/#ffffff/g, "#000000");
            var selfNode = this.strTTF.node;
            var parentNode = selfNode.parent;
            selfNode.x = parentNode.width / 2;
            var total = selfNode.width + parentNode.width;
            var duration = Math.ceil(total / parentNode.width * speed);
            var moveBy = cc.moveBy(duration, cc.v2(-total, 0));
            var singleAct = cc.sequence(
                moveBy,
                cc.callFunc(function () {
                    selfNode.x = parentNode.width / 2;
                }));

            var seq = cc.sequence(
                cc.repeat(singleAct, repeat),
                cc.callFunc(function () {
                    show_node.active = false;
                    closeCb();
                }));
            selfNode.runAction(seq);
        });
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        dd.NetWaitUtil.close();
        switch (event) {
            case Hall.HallEvent.Get_ShuiHu_Marquee: //获取水浒传跑马灯系统消息
                this.onMarquee(data);
                break;
            default:
                break;
        }
    },

});
