/**
 * Created by Mac_Li on 2017/10/10.
 */
const Hall = require('jlmj_halldata');
var AppConfig = require('AppConfig');
var dd = cc.dd;
const defaultDuration = 1000 * 60 * 3;//3分钟

let com_marquee = cc.Class({
    extends: cc.Component,

    properties: {
        strTTF: cc.RichText,//跑马灯
        showNode: cc.Node,
    },
    onLoad: function () {
        this.updateTimer = 0;
        this.updateInterval = 0.2;

        this._infoArr = [];
        this._isEnd = true;
        this._defaultInfoArr = []; //获取服务器初始默认数据
        this._isDefaultPlay = true;  //判断是否默认播放客户端自设定
        this._isDefaultEnd = true;  //判断默认播放是否完成一次
        this._nDefaultIndex = 0;   //默认跑马灯索引
        this.closeOnce = false;

        var size = cc.winSize;
        this.node.x = size.width / 2;
        this.node.y = size.height * 0.88;
        this.node.width = size.width * 0.8;
        this._defaultPos = this.node.position;
        cc.find('bg', this.node).width = size.width * 0.8;
        this.showNode.active = false;
        Hall.HallED.addObserver(this);

    },

    updatePosition(height) {
        var size = cc.winSize;
        this.node.x = size.width / 2;
        this.node.y = size.height * (height || 0.88);
    },

    resetPosition() {
        if (this._defaultPos)
            this.node.setPosition(this._defaultPos);
    },

    /**
     * 析构
     * 
     */
    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    update: function (dt) {
        if (!this.isOff) {
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
        }
    },

    lateUpdate: function (dt) {
        if (this.animOn && !this.isOff) {
            this.updateTimer += dt;
            // if (this.updateTimer < this.updateInterval) {
            //     return;
            // }
            this.updateTimer = 0;

            if (this.need_repeat > 0) {
                if (this.strTTF.node.x >= this.anim_target) {
                    this.strTTF.node.x -= this.anim_speed;
                } else {
                    this.strTTF.node.x = this.anim_start;
                    this.need_repeat--;
                }
            } else {
                this.animOn = false;
                this.showNode.active = false;
                this.anim_closeCb();
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
        if (cc._chifengGame || cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame || cc._isBaiDuPingTaiGame || cc._useCardUI)
            return;
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
            case 10004: //巷乐天天踢
            case 10003:
            case 10013:
            case 10014:
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
        this._isDefaultPlay = false;

        if (this.closeOnce == true) {
            // let sceneName = cc.dd.SceneManager.getCurrScene().name;
            // if (sceneName != AppConfig.HALL_NAME) {
            this.turnOff();
            return;
            // } else {
            //     this.closeOnce = false;
            //     this.turnOn();
            // }
        }

        if (this._isEnd && !this.isOff) {//没有开始
            this.startShow();
        }
    },

    /**
     * 开始
     */
    startShow: function () {
        if (cc._chifengGame || cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame || cc._isBaiDuPingTaiGame || cc._useCardUI || cc._applyForPayment)
            return;
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
            case 10003:
            case 10004:
            case 10013:
            case 10014:
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
     * 独立游戏公告
     * @param data 公告内容
     */
    showDLInfo: function (data) {
        if (!this.showNode.active) {
            this.showNode.active = true;
            this._isEnd = false
            this._isDefaultEnd = false;
            this.showInfo(data, 4, 1, this.onDefalutCallBack.bind(this));
            var size = cc.winSize;
            this.node.y = size.height * 0.87;
        }
    },

    /**
     *
     */
    showInfo: function (text, speed, repeat, closeCb) {
        this.need_repeat = repeat;
        this.anim_speed = speed;
        this.anim_closeCb = closeCb;
        this.strTTF.string = text;
        var parentNode = this.strTTF.node.parent;
        this.anim_start = parentNode.width / 2;
        this.strTTF.node.x = this.anim_start;
        this.anim_target = this.anim_start - this.strTTF.node.width - parentNode.width;
        this.updateTimer = 0;
        this.animOn = true;
        // this.scheduleOnce(function () {
        //     var show_node = this.showNode;
        //     this.strTTF.string = text;
        //     var selfNode = this.strTTF.node;
        //     var parentNode = selfNode.parent;
        //     selfNode.x = parentNode.width / 2;
        //     var total = selfNode.width + parentNode.width;
        //     var duration = Math.ceil(total / parentNode.width * speed);
        //     var moveBy = cc.moveBy(duration, cc.v2(-total, 0));
        //     var singleAct = cc.sequence(
        //         moveBy,
        //         cc.callFunc(function () {
        //             selfNode.x = parentNode.width / 2;
        //         }));
        //     var seq = cc.sequence(
        //         cc.repeat(singleAct, repeat),
        //         cc.callFunc(function () {
        //             show_node.active = false;
        //             closeCb();
        //         }));
        //     selfNode.runAction(seq);
        // });
    },

    turnOn() {
        this._infoArr = [];
        this._isEnd = true;
        this._isDefaultPlay = true;
        this._isDefaultEnd = true;
        this._nDefaultIndex = 0;
        this.isOff = false;
    },

    turnOff() {
        this.isOff = true;
        this.strTTF.node.stopAllActions();
        this.showNode.active = false;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        //dd.NetWaitUtil.close();
        switch (event) {
            case Hall.HallEvent.Get_PaoMaDeng_Marquee: //获取跑马灯系统消息
                this.onMarquee(data);
                break;
            case Hall.HallEvent.Get_PaoMaDeng_Default_Marquee: //获取跑马灯默认消息
                this.onDefaultMarquee(data);
                break;
            case Hall.HallEvent.TurnOff_Marquee:
                this.turnOff();
                break;
            case Hall.HallEvent.TurnOn_Marquee:
                this.turnOn();
                break;
            case Hall.HallEvent.Get_PaoMoDeng_DL_Marquee: //独立游戏跑马灯消息
                this.showDLInfo(data);
                break;
            default:
                break;
        }
    },

    onClickClose() {
        this.turnOff();
        // let sceneName = cc.dd.SceneManager.getCurrScene().name;
        // if (sceneName != AppConfig.HALL_NAME) {
        this.closeOnce = true;
        // } else {
        //     this.closeOnce = false;
        //     this.turnOn();
        // }
    }
});
module.exports = com_marquee;
