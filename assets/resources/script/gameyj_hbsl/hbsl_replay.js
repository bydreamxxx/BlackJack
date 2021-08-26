var hbsl_GameUI = require("hbsl_GameUI");
var replay_data = require('com_replay_data').REPLAY_DATA;

var proto_id = require('c_msg_hb_cmd');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var REPLAY_ED = require('com_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_replay_data').REPLAY_EVENT;
var HBSL_Data = require('hbslData').HBSL_Data;
const HBSL_ED = require('hbslData').HBSL_ED;
const HBSL_Event = require('hbslData').HBSL_Event;

//回放用的协议列表
const replayProto = {
    init: 'cmd_record_room_info',   //初始化
    joinPlayingDeskRsp: 'cmd_hb_desk', //桌子
    // hbgetnotify: 'cmd_TdkCSendPoker', //发牌
    // hbopennotify: 'cmd_TdkCBetRsp',      // 操作
    // hbfinalresult: 'cmd_TdkCOpenPoker', //开牌
    // hbenterack: 'cmd_TdkCRoundEnd',  //小结算
    // finalResult: 'cmd_TdkFinalResult', //大结算
    hbgetnotify : 'cmd_hb_get_notify', //抢红包广播包协议
    hbopennotify :'cmd_msg_hb_open_notify', //开奖
    hbfinalresult : 'cmd_hbfinalresult', //大结算
    hbenterack : 'cmd_msg_hb_enter_ack',//旁观者准备

};

//回放数据
var RoomReplayData = cc.Class({
    ctor() {
        this.selfId = cc.dd.user.id;
        this.callscore = null;
        this.beishu = null;
        this.playStatus = replayProto.init;
        this.resultMsg = null;
        this.bottomPokers = [0, 0, 0];
        this.playerList = [];       //PlayerReplayData类型
    }
});


//玩家数据
var PlayerReplayData = cc.Class({
    ctor() {
        this.handPoker = [];        //手牌
        this.outPoker = null;       //出牌  null表示开没开始出  []为不要
        this.score = 0;             //分数
        this.headUrl = '';          //头像
        this.nickName = '';         //昵称
        this.sex = 0;               //性别
        this.site = -1;             //座位
        this.userId = -1;           //id
        this.callscore = null;      //叫分
        this.double = null;         //加倍
        this.lord = false;          //地主
    },
    setData(data) {
        this.handPoker = data.handPokerList;
        this.score = data.score;
        this.headUrl = data.headUrl;
        this.nickName = data.nickName;
        this.sex = data.sex;
        this.site = data.site;
        this.userId = data.userId;
    },
});

const stepTime = 1;//单步间隔

cc.Class({
    extends: hbsl_GameUI,

    properties: {
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        slider_bar: { type: cc.Node, default: null },
        handler_bar: { type: cc.Node, default: null },
    },

    onLoad: function () {
        this._super();
        this.slider_bar.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        REPLAY_ED.addObserver(this);
        this.init();
    },

    //初始化
    init() {
        this._playIndex = 0;
        var data = replay_data.Instance().getMsgList();
        this._replayData = this.filterMsgList(data);
        this.initData(this._replayData);
        this.initRoundList();
        this.initHandler();
        this.freshSceneByIndex(this._playIndex);
        this.initPlay();
    },

    /**
     * 初始化播放
     */
    initPlay() {
        this.unschedule(this.runStep);
        this.scheduleOnce(function () {
            this.schedule(this.runStep, stepTime);
        }.bind(this), stepTime);
    },

    //单步播放
    runStep() {
        if (!this._pause) {
            if (this._playIndex < this.totalStep) {
                var msg = this._replayData[++this._playIndex];
                this.stepBy(msg);       //数据同步
                this.handlerMsg(msg);   //播放消息
                //进度条滚动
                this.handler_time = 0;
                var timer = 0.05;
                var handlerRun = function () {
                    if (this._pause) {
                        this.unschedule(handlerRun);
                        return;
                    }
                    this.handler_time += timer;
                    cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = (this._playIndex - 1).toString();
                    if (this.handler_time >= stepTime) {
                        this.handler_time = stepTime;
                        cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
                        this.unschedule(handlerRun);
                        if (this._playIndex == this.totalStep) {
                            this._pause = true;
                            this.showPlayBtn(this._pause);
                        }
                    }
                    cc.find('btns/handler_bar/slider', this.node).getComponent(cc.Slider).progress = (1 / this.totalStep * (this._playIndex - 1)) + (1 / this.totalStep) * (this.handler_time / stepTime);
                    this.node.getComponentInChildren('syncPbarSlider').sync();
                }.bind(this);
                this.unschedule(handlerRun);
                this.schedule(handlerRun, timer);
            }
        }
    },

    //播单步操作
    handlerMsg(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.joinPlayingDeskRsp]://桌子
                cc.gateNet.Instance().excuteReplayMsg(id, msg.content);
                break;
            case proto_id[replayProto.hbgetnotify]://抢红包广播协议
                cc.gateNet.Instance().excuteReplayMsg(id, msg.content);
                break;
            case proto_id[replayProto.hbopennotify]://开奖
                cc.gateNet.Instance().excuteReplayMsg(id, msg.content);
                break;
            case proto_id[replayProto.hbfinalresult]://大结算
                cc.gateNet.Instance().excuteReplayMsg(id, msg.content);
                break;
            case proto_id[replayProto.hbenterack]://旁观者准备
                cc.gateNet.Instance().excuteReplayMsg(id, msg.content);
                break;
        }
    },

    /**
     * 消息过滤 保留需要用的消息
     * 保留replayProto中的消息
     * @param {*} msglist 
     */
    filterMsgList(msglist) {
        var list = [];
        var filterIds = [];
        var sendcardMSG = null;
        for (var i in replayProto) {
            if (i == 'init')
                filterIds.push(require('c_msg_doudizhu_cmd')[replayProto[i]]);
            else
                filterIds.push(proto_id[replayProto[i]]);
        }
        for (var i = 0; i < msglist.length; i++) {
            if (filterIds.indexOf(msglist[i].id) != -1) {
                list.push(msglist[i]);
            }
        }
        return list;
    },

    /**
     * 初始化手牌玩家数据
     * @param {Array} data 
     */
    initData(data) {
        this.originData = new RoomReplayData();
        this.playingData = new RoomReplayData();
        var initMsg = this.getInitMsg(replayProto.init);
        this.dangqian_ju.string = initMsg.deskInfo.curCircle.toString();
        var playerList = initMsg.playerInfoList.sort(function (a, b) { return a.site - b.site; });
        for (var i = 0; i < playerList.length; ++i) {
            HBSL_Data.Instance().playerEnter(playerList[i]);
        }
        var haveSelf = false;
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].userId == cc.dd.user.id) {
                haveSelf = true;
                break;
            }
        }
        if (!haveSelf) {
            var random = Math.floor(Math.random() * playerList.length);
            var selfId = playerList[random].userId;
            this.originData.selfId = selfId;
            this.playingData.selfId = selfId;
        }
        var pdata = [];
        for (var i = 0; i < playerList.length; i++) {
            var player = new PlayerReplayData();
            player.setData(playerList[i]);
            pdata.push(player);
        }
        this.originData.playerList = pdata;
        this.playingData.playerList = pdata;
    },

    /**
     * 获取指定消息
     * @param {String} str 
     */
    getInitMsg(str) {
        for (var i = 0; i < this._replayData.length; i++) {
            if (this._replayData[i].id == require('c_msg_doudizhu_cmd')[str]) {
                return this._replayData[i].content;
            }
        }
        return null;
    },

    /**
     * 获取指定消息
     * @param {String} str 
     */
    getMsgByProto(str) {
        for (var i = 0; i < this._replayData.length; i++) {
            if (this._replayData[i].id == proto_id[str]) {
                return this._replayData[i].content;
            }
        }
        return null;
    },

    //初始化局数列表
    initRoundList() {
        var parent = cc.find('btns/roundlist/view/content', this.node);
        for (var i = parent.childrenCount - 1; i > -1; i--) {
            var rNode = parent.children[i];
            if (rNode.name != 'back') {
                rNode.removeFromParent();
                rNode.destroy();
            }
        }
        var round = replay_data.Instance().totalRound;
        this.zong_ju.string = '/' + round + '局';
        var template = cc.find('btns/roundlist/view/content/back', this.node);
        for (var i = 1; i < round + 1; i++) {
            var newNode = cc.instantiate(template);
            newNode.name = i.toString();
            if (newNode.name == this.dangqian_ju.string) {
                newNode.getComponent(cc.Button).interactable = false;
            }
            newNode.getChildByName('label').getComponent(cc.Label).string = i.toString();
            cc.find('btns/roundlist/view/content', this.node).addChild(newNode);
        }
    },

    //初始化进度条
    initHandler() {
        this._pause = false;
        this.showPlayBtn(this._pause);
        this.totalStep = this._replayData.length - 1;
        cc.find('btns/handler_bar/slider', this.node).getComponent(cc.Slider).progress = 0;
        cc.find('btns/handler_bar/slider/progressbar', this.node).getComponent(cc.ProgressBar).progress = 0;
        cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = '0';
        cc.find('btns/handler_bar/total_num', this.node).getComponent(cc.Label).string = this.totalStep.toString();
    },

    /**
    * 显示播放 暂停按钮   
    * True显示播放  False显示暂停
    * @param {Boolean} bool 
    */
    showPlayBtn(bool) {
        if (bool) {
            cc.find('btns/handler_bar/play_btn/play', this.node).active = true;
            cc.find('btns/handler_bar/play_btn/pause', this.node).active = false;
        }
        else {
            cc.find('btns/handler_bar/play_btn/play', this.node).active = false;
            cc.find('btns/handler_bar/play_btn/pause', this.node).active = true;
        }
    },

    /**
     * 刷新界面到指定步数
     * @param {Number} index 
     */
    freshSceneByIndex(index) {
        cc.dd.NetWaitUtil.show('正在缓冲');
        var startTime = new Date().getTime();
        this.genDataByIndex(index);
        var status = this.playingData.playStatus;
        //if(index < this._replayData.length - 1)
            //this.prepareBtn.active = false;
        //tdkRoomData.Instance().seedInitPoker();
        //tdkRoomData.Instance().initChipInfo();
        //var msg = this.getMsgByProto(status);
        //this.handlerMsg(msg);   //播放消息
        var endTime = new Date().getTime();
        cc.log('刷新到' + index + '步,消耗' + (endTime - startTime) + 'ms');
        cc.dd.NetWaitUtil.close();
    },

    /**
     * 生成指定步数的数据
     * @param {Number} index
     */
    genDataByIndex(index) {
        this.resetPlayingDataToOrigin();
        for (var i = 0; i < index; i++) {
            var msg = this._replayData[i + 1];
            this.stepBy(msg);
        }
    },

    //重置播放数据初始化
    resetPlayingDataToOrigin() {
        this.playingData = this.deepCopy(this.originData);
    },

    //对象拷贝
    deepCopy(obj) {
        if (typeof obj != 'object' || obj == null) {
            return obj;
        }
        if (obj instanceof Array) {
            var newobj = [];
        }
        else {
            var newobj = {};
        }
        for (var attr in obj) {
            newobj[attr] = this.deepCopy(obj[attr]);
        }
        return newobj;
    },

    /**
     * 单步数据处理
     * @param {*} msg 
     */
    stepBy(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.joinPlayingDeskRsp]://桌子
                this.playingData.playStatus = replayProto.joinPlayingDeskRsp;
                HBSL_Data.Instance().setDeskData(msg.content);
                break;
            case proto_id[replayProto.hbgetnotify]://抢红包广播协议
                this.playingData.playStatus = replayProto.hbgetnotify;
                HBSL_Data.Instance().addSaoLeiPlyaer(msg.content.msg.role);
                break;
            case proto_id[replayProto.hbopennotify]://开奖
                this.playingData.playStatus = replayProto.hbopennotify;
                HBSL_Data.Instance().updateSettlement(msg.content);
                break;
            case proto_id[replayProto.hbfinalresult]://大结算
                this.playingData.playStatus = replayProto.hbfinalresult;
                HBSL_ED.notifyEvent(HBSL_Event.SETTLEMENT, msg.content);
                break;
            case proto_id[replayProto.hbenterack]://旁观者准备
                this.playingData.playStatus = replayProto.hbenterack;
                HBSL_Data.Instance().onlookersReady(msg.content);
                break;
        }
    },

    bgClick() {
        if (this.roundListActive == true) {
            this.showRoundList(false);
            return;
        }
        this.handler_bar.active = !this.handler_bar.active;
    },

    onDestroy: function () {
        HBSL_Data.Destroy();
        REPLAY_ED.removeObserver(this);
    },


    //显示局数列表
    onOpenRoundList(event, data) {
        hall_audio_mgr.com_btn_click();
        this.showRoundList(true);
    },

    //显示局数列表 !bool 关闭
    showRoundList(bool) {
        if (bool) {
            if (!this._ani_menu) {
                this._ani_menu = true;
                var ani = cc.find('btns/roundlist', this.node).getComponent(cc.Animation);
                if (ani._nameToState[ani._defaultClip.name]) {
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                }
                var func = function () {
                    cc.find('btns/roundlist', this.node).getComponent(cc.Animation).off('finished', func, this);
                    cc.find('btns/changeRound', this.node).active = false;
                    this._ani_menu = false;
                    this.roundListActive = true;
                }.bind(this);
                cc.find('btns/roundlist', this.node).getComponent(cc.Animation).on('finished', func, this);
                cc.find('btns/roundlist', this.node).getComponent(cc.Animation).play();
            }
        }
        else {
            if (!this._ani_menu) {
                this._ani_menu = true;
                var ani = cc.find('btns/roundlist', this.node).getComponent(cc.Animation);
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                var func = function () {
                    cc.find('btns/roundlist', this.node).getComponent(cc.Animation).off('finished', func, this);
                    cc.find('btns/changeRound', this.node).active = true;
                    this._ani_menu = false;
                    this.roundListActive = false;
                }.bind(this);
                cc.find('btns/roundlist', this.node).getComponent(cc.Animation).on('finished', func, this);
                cc.find('btns/roundlist', this.node).getComponent(cc.Animation).play();
            }
        }
    },

    //退出
    onExit(event, data) {
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 播放器按钮点击
     * @param {*} event 
     * @param {*} data 
     */
    onPlayBtn(event, data) {
        switch (data) {
            case 'play':
                if (cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string == this.totalStep.toString()) {
                    return;
                }
                this._pause = !this._pause;
                this.showPlayBtn(this._pause);
                break;
            case 'forward':                    //快进(前进一步并暂停)
                this._pause = true;
                this.showPlayBtn(this._pause);
                if (this._playIndex < this.totalStep) {
                    var step = ++this._playIndex;
                    cc.find('btns/handler_bar/slider', this.node).getComponent(cc.Slider).progress = step / this.totalStep;
                    cc.find('btns/handler_bar/slider/progressbar', this.node).getComponent(cc.ProgressBar).progress = step / this.totalStep;
                    cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
                    this.freshSceneByIndex(step);
                }
                break;
            case 'backward':                    //快退(后退一步并暂停)
                this._pause = true;
                this.showPlayBtn(this._pause);
                if (this._playIndex > 0) {
                    var step = --this._playIndex;
                    cc.find('btns/handler_bar/slider', this.node).getComponent(cc.Slider).progress = step / this.totalStep;
                    cc.find('btns/handler_bar/slider/progressbar', this.node).getComponent(cc.ProgressBar).progress = step / this.totalStep;
                    cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
                    this.freshSceneByIndex(step);
                }
                break;
        }
    },

    //换局
    onChangeRound(event, data) {
        hall_audio_mgr.com_btn_click();
        if (event.target.name == 'back') {
            this.showRoundList(false);
        }
        else {
            var round = parseInt(event.target.name);
            replay_data.Instance().changeRound(round);
        }
    },

    //进度条拖动
    onSliderMove(event, data) {
        this._pause = true;
        this.showPlayBtn(this._pause);
        var progress = event.progress;
        var step = Math.floor(progress * this.totalStep);
        cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = step.toString();
        if (!this.progress_bar_scrolling) {
            this.touchEnd(null, 1);
        }
    },

    touchStart: function () {
        this.progress_bar_scrolling = true;
    },
    touchMove: function () {
        this.progress_bar_scrolling = true;
    },

    touchEnd(event, data) {
        this.progress_bar_scrolling = false;
        var progress = this.slider_bar.parent.getComponent(cc.Slider).progress;
        var step = Math.floor(progress * this.totalStep);
        if (this._playIndex != step) {
            this._playIndex = step;
            cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
            this.freshSceneByIndex(step);
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case REPLAY_EVENT.ON_GET_DATA:
                this.init();
                break;
        }
    },



});
