const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
const DDZ_Data = require('ddz_data').DDZ_Data;
var ddz = require('ddz_util');
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('ddz_audio_cfg');
var ddz_chat_cfg = require('ddz_chat_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];
var PropAudioCfg = require('jlmj_ChatCfg').PropAudioCfg;
var FortuneHallManager = require('FortuneHallManager').Instance();
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var game_room = require("game_room");
var hall_prefab = require('hall_prefab_cfg');
var playerExp = require('playerExp');
var DingRobot = require('DingRobot');
var AppCfg = require('AppConfig');
var Platform = require('Platform');
var replay_data = require('com_replay_data').REPLAY_DATA;
var REPLAY_ED = require('com_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_replay_data').REPLAY_EVENT;
var proto_id = require('c_msg_doudizhu_cmd');
//房间状态
const roomStatus = {
    STATE_ENTER: 1,         //进入房间
    STATE_PREPARE: 2,       //准备
    STATE_DEAL_POKER: 3,    //发牌
    STATE_CALL_SCORE: 4,    //叫分
    STATE_DOUBLE: 5,        //加倍
    STATE_PLAYING: 6,       //出牌
    STATE_ENDING: 7,        //结算中
    STATE_STACK_POKER: 10,  //分摞发牌
    STATE_CHANGE_POKER: 11, //换三张
    STATE_DOUBLE_FARM: 12,  //农民优先加倍
};
//声音类型
const soundType = {
    JIAOFEN: 1,             //叫分
    JIABEI: 2,              //加倍
    DAN: 3,                 //单
    DUI: 4,                 //对
    SAN: 5,                 //三
    KILL: 6,                //压死
    PASS: 7,                //不出
    THREE_YI: 8,            //三带一
    THREE_DUI: 9,           //三带对
    FOUR_ER: 10,            //四带二
    FOUR_DUI: 11,           //四带二对
    SHUNZI: 12,             //顺子
    LIANDUI: 13,            //连对
    BOMB: 14,               //炸弹
    ROCKET: 15,             //王炸
    AIRPLANE: 16,           //飞机
    REMAIN: 17,             //警告
    CHAT: 18,               //聊天
};
//特殊底牌 spriteAtlas图片配置
const speBottomCard = {
    DAWANG: 0,
    XIAOWANG: 1,
    SHUANGWANG: 2,
    DUIZI: 3,
    DAWANGDUI: 4,
    XIAOWANGDUI: 5,
    SANTIAO: 6,
    SHUNZI: 7,
    TONGHUA: 8,
    TONGHUASHUN: 9,
};

//回放用的协议列表
const replayProto = {
    init: 'cmd_record_room_info',                   //初始化
    changecard: 'cmd_ddz_record_change_poker',      //换三张
    callscore: 'cmd_ddz_call_score_ack',            //叫分
    bottomcard: 'cmd_ddz_call_score_result',        //底牌
    double: 'cmd_ddz_double_score_ack',             //加倍
    outcard: 'cmd_ddz_play_poker_ack',              //出牌
    result: 'cmd_ddz_play_result',                  //结算
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
    extends: cc.Component,

    properties: {
        win_pic: cc.SpriteFrame,
        lose_pic: cc.SpriteFrame,
        win_font: { type: cc.Font, default: null, tooltip: '胜利字' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字' },
        paiAtlas: { type: cc.SpriteAtlas, default: null, tooltip: "牌图集" },
        atlas_game: { type: cc.SpriteAtlas, default: null, tooltip: "游戏图集" },
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        slider_bar: { type: cc.Node, default: null },
        handler_bar: { type: cc.Node, default: null },
        speSpList: { type: cc.SpriteFrame, default: [], tooltip: '底牌翻倍图片列表' },
    },

    // use this for initialization
    onLoad: function () {
        this.slider_bar.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        REPLAY_ED.addObserver(this);
        this.init();
        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }
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

    //初始化
    init() {
        this._playIndex = 0;
        var data = replay_data.Instance().getMsgList();
        this._replayData = this.filterMsgList(data);
        this.initData(this._replayData);
        this.initRoundList();
        this.initHandler();
        this.initUiScript(true);
        this.freshSceneByIndex(this._playIndex);
        this.initPlay();
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
            case proto_id[replayProto.changecard]://换三张
                this.changeCardIndex = this._playIndex;
                this.showExchange(msg.content);
                break;
            case proto_id[replayProto.callscore]://叫分
                this.callScoreRet(msg.content);
                break;
            case proto_id[replayProto.bottomcard]://翻牌
                this.showLord(msg.content);
                break;
            case proto_id[replayProto.double]://加倍
                this.doubleRet(msg.content);
                break;
            case proto_id[replayProto.outcard]://出牌
                this.playPoker(msg.content);
                break;
            case proto_id[replayProto.result]://结算
                this.showResult(msg.content, true);
                break;
        }
    },

    //换三张
    showExchange(msg) {
        var isClockwise = msg.isClockwise;//顺时针
        var changeInfoList = msg.changeInfoList;
        var exchangeNode = cc.find('exchange', this.node);
        var aniName = isClockwise ? 'exchange_shunshizhen_replay' : 'exchange_nishizhen_replay';
        for (var i = 0; i < changeInfoList.length; i++) {
            var userId = changeInfoList[i].userId;
            var selectPokersList = changeInfoList[i].selectPokersList;
            var resultPokersList = changeInfoList[i].resultPokersList;
            var view = this.idToView(userId);
            var parent = null;
            if (view == 0) {
                parent = cc.find('card/down', exchangeNode);
            }
            else if (view == 1) {
                parent = cc.find('card/right', exchangeNode);
            }
            else {
                parent = cc.find('card/left', exchangeNode);
            }
            for (var j = 0; j < selectPokersList.length; j++) {
                this.setPoker(parent.children[j], selectPokersList[j]);
            }
            this._uiComponents[view].deleteChangeCard(selectPokersList);
        }
        var playFinish = function () {
            exchangeNode.getComponent(cc.Animation).off('finished', playFinish, this);
            for (var i = 0; i < changeInfoList.length; i++) {
                var userId = changeInfoList[i].userId;
                var resultPokersList = changeInfoList[i].resultPokersList;
                var view = this.idToView(userId);
                if (this._playIndex == this.changeCardIndex || this._playIndex == this.changeCardIndex + 1) {
                    this._uiComponents[view].addChangeCard(resultPokersList);
                }
            }
        }.bind(this);
        var playAni = function () {
            exchangeNode.getComponent(cc.Animation).off('finished', playAni, this);
            exchangeNode.getComponent(cc.Animation).on('finished', playFinish, this);
            exchangeNode.getComponent(cc.Animation).play(aniName);
        }.bind(this);
        exchangeNode.getComponent(cc.Animation).on('finished', playAni, this);
        exchangeNode.getComponent(cc.Animation).play('exchange_reset_replay');
    },

    bgClick() {
        if (this.roundListActive == true) {
            this.showRoundList(false);
            return;
        }
        this.handler_bar.active = !this.handler_bar.active;
    },

    //进度条拖动
    onSliderMove(event, data) {
        this._pause = true;
        this.showPlayBtn(this._pause);
        // var progress = event.progress;
        // var step = Math.floor(progress * this.totalStep);
        // if (this._playIndex != step) {
        //     this._playIndex = step;
        //     cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
        //     this.freshSceneByIndex(step);
        // }
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

    //退出
    onExit(event, data) {
        cc.dd.SceneManager.enterHall();
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
        if (status == replayProto.result) {
            this.showResult(this.playingData.resultMsg, false);
        }
        else {
            cc.find('result_ani', this.node).active = false;
        }
        for (var i = 0; i < this.playingData.bottomPokers.length; i++) {
            var dipai_node = cc.find('dipai_info/dipai_' + (i + 1).toString(), this.node);
            this.setDipai(dipai_node, this.playingData.bottomPokers[i]);
        }
        this.calSpecialBottom(this.playingData.bottomPokers.length);
        this._uiComponents[0].showBeilv({ total: this.playingData.beishu, });
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            var view = this.idToView(this.playingData.playerList[i].userId);
            this._uiComponents[view].refreshPlayerUI(status, this.playingData.playerList[i])
        }
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

    /**
     * 单步数据处理
     * @param {*} msg 
     */
    stepBy(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.callscore]://叫分
                this.playingData.playStatus = replayProto.callscore;
                var userId = msg.content.userId;
                var score = msg.content.score;
                for (var i = 0; i < this.playingData.playerList.length; i++) {
                    if (this.playingData.playerList[i].userId == userId) {
                        this.playingData.playerList[i].callscore = score;
                    }
                }
                if (score > 0) {
                    this.playingData.beishu = score;
                    this.playingData.callscore = score;
                }
                break;
            case proto_id[replayProto.changecard]://换牌
                this.playingData.playStatus = replayProto.changecard;
                var changeInfoList = msg.content.changeInfoList;
                for (var i = 0; i < changeInfoList.length; i++) {
                    var userId = changeInfoList[i].userId;
                    var selectPokersList = changeInfoList[i].selectPokersList;
                    var resultPokersList = changeInfoList[i].resultPokersList;
                    for (var j = 0; j < this.playingData.playerList.length; j++) {
                        if (this.playingData.playerList[j].userId == userId) {
                            for (var k = 0; k < selectPokersList.length; k++) {
                                var idx = this.playingData.playerList[j].handPoker.indexOf(selectPokersList[k]);
                                if (idx > -1) {
                                    this.playingData.playerList[j].handPoker.splice(idx, 1);
                                }
                            }
                            this.playingData.playerList[j].handPoker = ddz.sortShowCards(this.playingData.playerList[j].handPoker.concat(resultPokersList));
                            break;
                        }
                    }
                }
                break;
            case proto_id[replayProto.bottomcard]://翻牌
                this.playingData.playStatus = replayProto.bottomcard;
                var bottomPokersList = msg.content.bottomPokersList;
                var landholderId = msg.content.landholderId;
                var bottomPokersTimes = msg.content.bottomPokersTimes;
                this.playingData.bottomPokers = bottomPokersList;
                for (var i = 0; i < this.playingData.playerList.length; i++) {
                    if (this.playingData.playerList[i].userId == landholderId) {
                        this.playingData.playerList[i].lord = true;
                        this.playingData.playerList[i].handPoker = ddz.sortShowCards(this.playingData.playerList[i].handPoker.concat(bottomPokersList));
                    }
                }
                this.playingData.beishu *= bottomPokersTimes;
                break;
            case proto_id[replayProto.double]://加倍
                this.playingData.playStatus = replayProto.double;
                var isDouble = msg.content.isDouble;
                var userId = msg.content.userId;
                for (var i = 0; i < this.playingData.playerList.length; i++) {
                    if (this.playingData.playerList[i].userId == userId) {
                        this.playingData.playerList[i].double = isDouble;
                    }
                }
                break;
            case proto_id[replayProto.outcard]://出牌
                this.playingData.playStatus = replayProto.outcard;
                var cards = msg.content.pokersList;
                var userId = msg.content.userId;
                for (var i = 0; i < this.playingData.playerList.length; i++) {
                    if (this.playingData.playerList[i].userId == userId) {
                        this.playingData.playerList[i].outPoker = cards;
                        for (var j = 0; j < cards.length; j++) {
                            var idx = this.playingData.playerList[i].handPoker.indexOf(cards[j]);
                            if (idx > -1) {
                                this.playingData.playerList[i].handPoker.splice(idx, 1);
                            }
                        }
                    }
                }
                if (ddz.analysisCards(cards).type >= 10) {//炸弹
                    this.playingData.beishu *= 2;
                }
                break;
            case proto_id[replayProto.result]://结算
                this.playingData.playStatus = replayProto.result;
                this.playingData.resultMsg = msg.content;
                var changeScoreList = msg.content.changeListList;
                if (msg.content.isGod > 0) {
                    this.playingData.beishu *= 2;
                }
                for (var i = 0; i < changeScoreList.length; i++) {
                    var userId = changeScoreList[i].userId;
                    var changeScore = changeScoreList[i].changeScore;
                    for (var j = 0; j < this.playingData.playerList.length; j++) {
                        if (this.playingData.playerList[j].userId == userId) {
                            this.playingData.playerList[j].score += changeScore;
                        }
                    }
                }
                break;
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
     * 消息过滤 保留需要用的消息
     * 保留replayProto中的消息
     * @param {*} msglist 
     */
    filterMsgList(msglist) {
        var list = [];
        var filterIds = [];
        for (var i in replayProto) {
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
        var initMsg = this.getMsgByProto(replayProto.init);
        this.dangqian_ju.string = initMsg.deskInfo.curCircle.toString();
        var playerList = initMsg.playerInfoList.sort(function (a, b) { return a.site - b.site; });
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

    //显示局数列表
    onOpenRoundList(event, data) {
        hall_audio_mgr.com_btn_click();
        this.showRoundList(true);
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


    calSpecialBottom: function (cardlist) {
        cc.find('dipai_info/beilv/layout/spe', this.node).active = false;
        if (cardlist[0] > 0) {
            if (ddz.analysisCards(cardlist).type == 3) {//三条
                cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.SANTIAO];
                cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '6倍';
                cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                return;
            }
            var bJ = false;//大王
            var sJ = false;//小王
            var duizi = [];
            var hualist = [];
            for (var i = 0; i < cardlist.length; i++) {
                if (cardlist[i] == 171) {
                    sJ = true;
                }
                else if (cardlist[i] == 172) {
                    bJ = true;
                }
                else {
                    var v = Math.floor(cardlist[i] / 10);
                    var f = cardlist[i] % 10;
                    hualist.push(f);
                    if (duizi[v] != null) {
                        duizi[v] += 1;
                    }
                    else {
                        duizi[v] = 1;
                    }
                }
            }
            var dui = false;
            for (var i = 0; i < 17; i++) {
                if (duizi[i] && duizi[i] == 2) {
                    dui = true;
                    break;
                }
            }
            if (bJ && sJ) {
                cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.SHUANGWANG];
                cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '12倍';
                cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                return;
            }
            else if (bJ) {
                if (dui) {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.DAWANG];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '4倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
                else {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.DAWANG];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '2倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
                return;
            }
            else if (sJ) {
                if (dui) {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.XIAOWANG];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '4倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
                else {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.XIAOWANG];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '2倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
                return;
            }
            else {
                if (dui) {
                    // cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame(speBottomCard.DUIZI);
                    // cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '2倍';
                    // cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                    return;
                }
            }
            var tonghua = false;
            if (hualist.length == 3) {
                if (hualist[0] == hualist[1] && hualist[1] == hualist[2]) {
                    tonghua = true;
                }
            }
            var values = [];
            for (var i = 0; i < cardlist.length; i++) {
                var value = Math.floor(cardlist[i] / 10);
                values.push(value);
            }
            values.sort(function (a, b) { return a - b; });
            if (values[1] - values[0] == 1 && values[2] - values[1] == 1) {
                if (tonghua) {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.TONGHUASHUN];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '9倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
                else {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.SHUNZI];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '3倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
            }
            else {
                if (tonghua) {
                    cc.find('dipai_info/beilv/layout/spe/icon', this.node).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.TONGHUA];
                    cc.find('dipai_info/beilv/layout/spe/lbl', this.node).getComponent(cc.Label).string = '6倍';
                    cc.find('dipai_info/beilv/layout/spe', this.node).active = true;
                }
            }
        }
    },


    onDestroy: function () {
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
        this.initUiScript(false);
        REPLAY_ED.removeObserver(this);
        AudioManager.getInstance().stopAllLoopSound();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case REPLAY_EVENT.ON_GET_DATA:
                this.init();
                break;
        }
    },

    popupOKcancel: function (text, callfunc) {
        cc.dd.DialogBoxUtil.show(0, text, '确定', '取消', function () {
            callfunc();
        }, function () { });
    },


    //打完一局之后清理场景
    clearScene: function () {
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].resetUI();
            if (i != 0) {
                this._uiComponents[i].showUI(false);
            }
        }
    },



    //重连时游戏已结束
    reconnectHall: function () {
        var result_node = cc.find('Canvas/root/result_ani');
        var end_node = cc.find('Canvas/root/game_end');
        if (result_node.active == true && result_node.getChildByName('taotai').active == true) {
            return;
        }
        if (end_node.getChildByName('content').scaleX > 0) {
            return;
        }
        this.backToHall();
    },

    idToView: function (id) {
        var seat = -1;
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            if (this.playingData.playerList[i].userId == id) {
                seat = i;
                break;
            }
        }
        var selfId = this.playingData.selfId;
        var index = -1;
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            if (this.playingData.playerList[i].userId == selfId) {
                index = i;
                break;
            }
        }
        var view = seat - index;
        if (view < 0) {
            view += this.playingData.playerList.length;
        }
        return view;
    },

    initPlayer: function () {
        var playerInfo = DDZ_Data.Instance().playerInfo;
        for (var i = 0; i < playerInfo.length; i++) {
            if (playerInfo[i]) {
                this._uiComponents[this.idToView(playerInfo[i].userId)].initPlayerInfo(playerInfo[i]);
            }
        }
    },



    //初始化聊天
    initChat: function () {
        var cfg = null;
        var parent = cc.find('chat/panel/text/view/content', this.node);
        parent.removeAllChildren(true);
        if (cc.dd.user.sex == 1) {
            cfg = ddz_chat_cfg.Man;
        }
        else {
            cfg = ddz_chat_cfg.Woman;
        }
        for (var i = 0; i < cfg.length; i++) {
            var node = cc.instantiate(this.chat_item);
            node.tagname = i;
            node.getComponentInChildren(cc.Label).string = cfg[i];
            node.on('click', this.onQuickChatClick, this);
            parent.addChild(node);
        }
    },

    //初始化音乐音效设置
    initMusicAndSound: function () {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('setting/bg/content/music/mask', this.node).width = 0;
            cc.find('setting/bg/content/music/tao', this.node).x = -50;
            cc.find('setting/bg/content/music/tao/b', this.node).active = true;
            cc.find('setting/bg/content/music/tao/y', this.node).active = false;
            cc.find('setting/bg/content/music/label_kai', this.node).active = false;
            cc.find('setting/bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onMusic(ddz_audio_cfg.GAME_MUSIC);
        }
        if (!sound) {
            cc.find('setting/bg/content/sound/mask', this.node).width = 0;
            cc.find('setting/bg/content/sound/tao', this.node).x = -50;
            cc.find('setting/bg/content/sound/tao/b', this.node).active = true;
            cc.find('setting/bg/content/sound/tao/y', this.node).active = false;
            cc.find('setting/bg/content/sound/label_kai', this.node).active = false;
            cc.find('setting/bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    //发牌
    handPoker: function (data) {
        this._uiComponents[0].showBeilv();
        var cards = data.handPokersList;
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].playSendCards(cards);
            cc.find('callscore', this.getHeadByView(i)).active = false;//叫分隐藏
        }
        for (var i = 0; i < 3; i++) {
            this.setPoker(cc.find('dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node), 0);
        }
        cc.find('dipai_info/bottomcard_ani', this.node).getComponent(cc.Animation).play('dipai_reset');
        cc.find('dipai_info/beilv/layout/spe', this.node).active = false;
        DDZ_Data.Instance().maxScore = 0;
    },

    //更新状态
    updateStatus: function (data) {
        var status = data.deskStatus;
        var id = data.curPlayer;
        this.gameStatus = status;
        switch (status) {
            case roomStatus.STATE_CALL_SCORE://叫分
                var callTime = DDZ_Data.Instance().deskInfo.callScoreTimeout;
                var maxScore = DDZ_Data.Instance().maxScore;
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        this._uiComponents[i].showCallScoreOp(callTime, maxScore);
                    }
                    else {
                        this._uiComponents[i].hideCallScoreOp();
                    }
                }
                break;
            case roomStatus.STATE_PLAYING://出牌
                var playTime = DDZ_Data.Instance().deskInfo.playTimeout;
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        DDZ_Data.Instance().lastCards = [];
                        DDZ_Data.Instance().lastPlayer = -1;
                        this.curPlayer = i;
                        this._uiComponents[i].showPlaying(playTime);
                        // if (i == 0) {
                        //     this._uiComponents[i].clearAllSelectCards();
                        // }
                    }
                }
                break;
            case roomStatus.STATE_DOUBLE://加倍
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout);
                }
                break;
            case roomStatus.STATE_DOUBLE_FARM://农民优先加倍
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        this._uiComponents[i].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout);
                    }
                }
                break;
            case roomStatus.STATE_STACK_POKER://分摞发牌

                break;
            case roomStatus.STATE_CHANGE_POKER://换三张
                this._uiComponents[0].showChangeCard();
                break;
        }
    },

    //叫分返回
    callScoreRet: function (data) {
        var id = data.userId;
        var score = data.score;
        this._uiComponents[this.idToView(id)].callScoreRet(score);
        this._uiComponents[this.idToView(id)].hideCallScoreOp();

        var sex = this.getPlayerById(id).sex;
        this.playSound(sex, soundType.JIAOFEN, score);
    },

    //显示地主和底牌
    showLord: function (data) {
        var bottomCards = data.bottomPokersList;
        var lordId = data.landholderId;
        var times = data.bottomPokersTimes;
        DDZ_Data.Instance().lordId = lordId;
        DDZ_Data.Instance().bottomPokersTimes = times;
        this.total_bei = DDZ_Data.Instance().maxScore * times;
        this.bomb_bei = 1;
        this._uiComponents[0].showBeilv({ total: this.playingData.beishu });
        for (var i = 0; i < this._uiComponents.length; i++) {//显示地主 隐藏叫分
            this.scheduleOnce(function () {
                for (var j = 0; j < this._uiComponents.length; j++) {
                    cc.find('callscore', this.getHeadByView(j)).active = false;
                }
            }.bind(this), 1);
            if (i == this.idToView(lordId)) {
                cc.find('lord', this.getHeadByView(this.idToView(lordId))).active = true;
                this._uiComponents[this.idToView(lordId)].showBottomCard(bottomCards);
            }
            else {
                cc.find('lord', this.getHeadByView(i)).active = false;
            }
        }
    },

    //加倍返回
    doubleRet: function (data) {
        var id = data.userId;
        var isDouble = data.isDouble;
        if (isDouble) {
            cc.find('jiabei', this.getHeadByView(this.idToView(id))).active = true;
            cc.find('double', this.getHeadByView(this.idToView(id))).getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('jiabei_2');
        }
        else {
            cc.find('double', this.getHeadByView(this.idToView(id))).getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('dz_bujiabeiicon');
        }
        cc.find('double', this.getHeadByView(this.idToView(id))).active = true;
        this.scheduleOnce(function () {
            cc.find('double', this.getHeadByView(this.idToView(id))).active = false;
        }.bind(this), 1);
        var view = this.idToView(id);
        if (view == 0) {
            this._uiComponents[0].showOperation(-1);
        }
        else {
            this._uiComponents[view].hideTimer();
        }

        var sex = this.getPlayerById(id).sex;
        this.playSound(sex, soundType.JIABEI, isDouble ? 1 : 0);
    },

    /**
     * 出牌消息
     */
    playPoker: function (data) {
        for (var i = 0; i < this._uiComponents.length; i++) {
            cc.find('double', this._uiComponents[i].headnode).active = false;
        }
        var id = data.userId;
        var pokers = data.pokersList;
        this.outCardSound(id, pokers);
        var remainNum = this._uiComponents[this.idToView(id)].remainCard;
        if (pokers.length > 0 && remainNum - pokers.length <= 2 && remainNum - pokers.length > 0) {
            var sex = this.getPlayerById(id).sex;
            this.scheduleOnce(function () { this.playSound(sex, soundType.REMAIN, remainNum - pokers.length); }.bind(this), 0.2);//延迟播放报警
        }
        if (pokers.length > 0) {
            DDZ_Data.Instance().lastCards = pokers;
            DDZ_Data.Instance().lastPlayer = this.idToView(id);
        }
        this._uiComponents[this.idToView(id)].showOutCard(pokers, DDZ_Data.Instance().lordId == id);
        if (this._uiComponents[this.idToView(id)].getHandCardNum() != 0) {
            var nextPlayer = this.getNextPlayer(this.idToView(id));
            this._uiComponents[nextPlayer].clearOutCardAndPass();
            this.curPlayer = nextPlayer;
            if (this.curPlayer == DDZ_Data.Instance().lastPlayer) {
                DDZ_Data.Instance().lastCards = [];
            }
        }
        if (ddz.analysisCards(pokers).type >= 10) {//炸弹
            this.total_bei *= 2;
            this.bomb_bei *= 2;
            this._uiComponents[0].showBeilv({ total: this.playingData.beishu });
        }
    },

    getLastPoker(curId) {
        var lastView = this.idToView(curId) - 1 > 0 ? this.idToView(curId) - 1 : 2;
        var lastPlayer = this.getPlayerByView(lastView);
        return lastPlayer.outPoker;
    },

    //出牌音效
    outCardSound: function (id, pokers) {
        var sex = this.getPlayerById(id).sex;
        if (pokers.length > 0) {
            var lastPoker = this.getLastPoker(id);
            if (!lastPoker || lastPoker.length == 0) {
                var analysis = ddz.analysisCards(pokers);
                switch (analysis.type) {
                    case 1://单牌
                        if (analysis.index == 17) {
                            this.playSound(sex, soundType.DAN, pokers[0]);
                        }
                        else {
                            this.playSound(sex, soundType.DAN, analysis.index);
                        }
                        break;
                    case 2://对子
                        this.playSound(sex, soundType.DUI, analysis.index);
                        break;
                    case 3://三张
                        this.playSound(sex, soundType.SAN, analysis.index);
                        break;
                    case 4://三带
                        if (pokers.length == 4) {
                            this.playSound(sex, soundType.THREE_YI, null);
                        }
                        else {
                            this.playSound(sex, soundType.THREE_DUI, null);
                        }
                        break;
                    case 5://顺子
                        if (analysis.index != 14) {
                            this.playSound(sex, soundType.SHUNZI, null);
                        }
                        break;
                    case 6://连对
                        this.playSound(sex, soundType.LIANDUI, null);
                        break;
                    case 7://飞机不带
                    case 8://飞机带一或对
                        this.playSound(sex, soundType.AIRPLANE, null);
                        break;
                    case 9://四带
                        if (pokers.length == 6) {
                            this.playSound(sex, soundType.FOUR_ER, null);
                        }
                        else {
                            this.playSound(sex, soundType.FOUR_DUI, null);
                        }
                        break;
                    case 10://炸弹
                        this.playSound(sex, soundType.BOMB, null);
                        break;
                    case 11://王炸
                        this.playSound(sex, soundType.ROCKET, null);
                        break;
                }
            }
            else {
                var analysis = ddz.analysisCards(pokers);
                var lastanalysis = ddz.analysisCards(lastPoker);
                var typeSame = analysis.type == lastanalysis.type;
                switch (analysis.type) {
                    case 1://单牌
                        if (analysis.index == 17) {
                            this.playSound(sex, soundType.DAN, pokers[0]);
                        }
                        else {
                            this.playSound(sex, soundType.DAN, analysis.index);
                        }
                        break;
                    case 2://对子
                        this.playSound(sex, soundType.DUI, analysis.index);
                        break;
                    case 3://三张
                        this.playSound(sex, soundType.SAN, analysis.index);
                        break;
                    case 4://三带
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            if (pokers.length == 4) {
                                this.playSound(sex, soundType.THREE_YI, null);
                            }
                            else {
                                this.playSound(sex, soundType.THREE_DUI, null);
                            }
                        }
                        break;
                    case 5://顺子
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.SHUNZI, null);
                        }
                        break;
                    case 6://连对
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.LIANDUI, null);
                        }
                        break;
                    case 7://飞机不带
                    case 8://飞机带一或对
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.AIRPLANE, null);
                        }
                        break;
                    case 9://四带
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            if (pokers.length == 6) {
                                this.playSound(sex, soundType.FOUR_ER, null);
                            }
                            else {
                                this.playSound(sex, soundType.FOUR_DUI, null);
                            }
                        }
                        break;
                    case 10://炸弹
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.BOMB, null);
                        }
                        break;
                    case 11://王炸
                        this.playSound(sex, soundType.ROCKET, null);
                        break;
                }
            }
        }
        else {
            this.playSound(sex, soundType.PASS, null);
        }
    },

    /**
     * 托管消息 
     */
    autoRet: function (data) {
        var id = data.userId;
        var isAuto = data.isAuto;
        this._uiComponents[this.idToView(id)].showAuto(isAuto);
    },

    /**
     * 单局结算 
     */
    showResult: function (data, playing) {
        for (var i = 0; i < this._uiComponents.length; i++) {
            cc.find('Canvas/root/result_ani/score' + i.toString() + '/jiabei').active = cc.find('jiabei', this.getHeadByView(i)).active;
        }
        var nodes = [];
        nodes.push(cc.find('result_ani/detail/jiaofen', this.node));
        nodes.push(cc.find('result_ani/detail/dipai', this.node));
        nodes.push(cc.find('result_ani/detail/zhadan', this.node));
        nodes.push(cc.find('result_ani/detail/chuntian', this.node));
        nodes.push(cc.find('result_ani/detail/total', this.node));
        var idx = 0;
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].active = false;
        }
        var jiaofen = this.playingData.callscore;
        var dipai = data.bottomPokersTimes;
        var zhadan = Math.pow(2, data.zhadanNum);
        var total = jiaofen * dipai * zhadan * (data.isGod > 0 ? 2 : 1);
        nodes[idx].getChildByName('name').getComponent(cc.Label).string = '总倍数 x';
        nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = total.toString();
        nodes[idx++].active = true;

        nodes[idx].getChildByName('name').getComponent(cc.Label).string = '叫分 x';
        nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = jiaofen.toString();
        nodes[idx++].active = true;

        if (dipai > 1) {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '底牌 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = dipai.toString();
            nodes[idx++].active = true;
        }

        if (zhadan > 1) {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '炸弹 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = zhadan.toString();
            nodes[idx++].active = true;
        }
        if (data.isGod == 0) {

        }
        else if (data.isGod == 1) {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '春天 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = '2';
            nodes[idx++].active = true;
        }
        else {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '反春 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = '2';
            nodes[idx++].active = true;
        }

        var changeList = data.changeListList.sort(function (a, b) { return this.idToView(a.userId) - this.idToView(b.userId) }.bind(this));
        for (var i = 0; i < changeList.length; i++) {
            if (changeList[i].changeScore > 0) {
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/bg').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('win_di');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('add');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).font = this.win_font;
            }
            else {
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/bg').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('lose_di');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('sub');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).font = this.lose_font;
            }
            cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).string = Math.abs(changeList[i].changeScore).toString();
        }
        //正常播放
        if (playing) {
            if (data.isGod > 0) {
                this.playSpring();
                this.playingData.beishu *= 2;
                this._uiComponents[0].showBeilv({ total: this.playingData.beishu });
            }
            for (var i = 0; i < this._uiComponents.length; i++) {
                cc.find('op', this._uiComponents[i].node).active = false;
            }
            this.scheduleOnce(function () {
                //显示手牌
                for (var i = 0; i < data.changeListList.length; i++) {
                    if (this.idToView(data.changeListList[i].userId) != 0) {
                        if (data.changeListList[i].leftHandPokerList.length > 0) {
                            this._uiComponents[this.idToView(data.changeListList[i].userId)].showOutCard(data.changeListList[i].leftHandPokerList, this.getPlayerById(data.changeListList[i].userId).lord, true);
                        }
                    }
                }
                //修改玩家分数
                for (var i = 0; i < this.playingData.playerList.length; i++) {
                    cc.find('info/gold', this.getHeadByView(this.idToView(this.playingData.playerList[i].userId))).getComponent(cc.Label).string = this.playingData.playerList[i].score.toString();
                }
            }.bind(this), 1);
            this.scheduleOnce(function () {
                var node = cc.find('Canvas/root/result_ani');
                node.getComponent(cc.Animation).play();
                this.scheduleOnce(function () {
                    node.active = true;
                }, 0.05);
            }.bind(this), 1.5);
        }
        //暂停到指定进度
        else {
            var result_node = cc.find('Canvas/root/result_ani');
            cc.find('detail', result_node).scale = 1;
            cc.find('detail', result_node).active = true;
            result_node.active = true;
        }
    },
    hideResult: function () {
        cc.find('Canvas/root/result_ani').active = false;
    },

    /**
     * 开局动画
     */
    playRound: function (data) {
        var roundType = data.roundType;
        var type = data.outType;
        var curRound = DDZ_Data.Instance().curRound;
        var losescore = DDZ_Data.Instance().deskInfo.outScore;
        var basescore = DDZ_Data.Instance().deskInfo.baseScore;
        if (roundType == 1) {//预赛
            if (curRound) {
                cc.find('start_ani/round', this.node).getComponent(cc.Label).string = '预赛第' + curRound.toString() + '轮';
            }
            else {
                cc.find('start_ani/round', this.node).getComponent(cc.Label).string = '';
            }
        }
        else {//决赛
            cc.find('start_ani/round', this.node).getComponent(cc.Label).string = '';
        }
        const str = {
            [1]: '打立出局',
            [2]: '定局积分',
        };
        cc.find('start_ani/type', this.node).getComponent(cc.Label).string = str[type];
        var template = {
            [1]: '积分低于{0}被淘汰',     //预赛
            [2]: '',                    //晋级赛
            [3]: '',
        };
        cc.find('start_ani/desc', this.node).getComponent(cc.Label).string = template[roundType].format(losescore);
        cc.find('start_ani/ani', this.node).getComponent(dragonBones.ArmatureDisplay).playAnimation("BSKS", -1);
        cc.find('start_ani', this.node).getComponent(cc.Animation).play();
        cc.find('dipai_info/base_score', this.node).getComponent(cc.Label).string = '基础分:' + basescore.toString();
        cc.find('dipai_info/default_score', this.node).getComponent(cc.Label).string = '淘汰分:' + losescore.toString();
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.START, false);
    },

    /**
     * 初始化UI脚本
     */
    initUiScript: function (bool) {
        this._uiComponents = [];
        if (bool) {
            this._uiComponents.push(this.node.getComponentInChildren('ddz_replay_down_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('ddz_replay_right_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('ddz_replay_left_ui'));
        }
    },

    //播放炸弹特效
    playBombAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('bomb_camera_' + str);
        var bone = cc.find('bomb_ani/ddz_zhadan_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            bone.playAnimation('zha', 1);
            var finish = function () {
                cc.find('dilie', bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
                bone.enabled = false;
            }
            cc.find('dilie', bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
            cc.find('dilie', bone.node.parent).getComponent(cc.Animation).play();
        }.bind(this);
        bone.playAnimation('lujing' + str, 1);
        bone.scheduleOnce(function () {
            playFinish();
        }, 0.67);
    },

    //播放火箭特效
    playRocketAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('rocket_camera_1');
        var bone = cc.find('rocket_ani/huojian01_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            bone.playAnimation('huojianzha', 1);
            bone.scheduleOnce(function () {
                cc.find('dilie', bone.node.parent).getComponent(cc.Animation).play();
                bone.enabled = false;
            }.bind(this), 1);
        }.bind(this);
        bone.playAnimation('huojianfei' + str, 1);
        bone.scheduleOnce(function () {
            playFinish();
        }, 0.5);
    },

    //春天特效
    playSpring: function () {
        var bone = cc.find('spring_ani/Spring01_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        bone.playAnimation('Spring', 1);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SPRING, false);
    },

    //销毁骨骼动画
    clearBones: function () {
        if (this.springNode) {
            this.springNode.destroy();
            this.springNode = null;
        }
        if (this.rocketNode) {
            this.rocketNode.destroy();
            this.rocketNode = null;
        }
        if (this.bombNode) {
            this.bombNode.destroy();
            this.bombNode = null;
        }
    },

    //播放飞机特效
    playAirplaneAnimation: function () {
        cc.find('Canvas/root/effect_airplane').getComponent(cc.Animation).play();
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.FEIJI, false);
    },

    //获取下一个玩家
    getNextPlayer: function (curPlayer) {
        return curPlayer + 1 < 3 ? curPlayer + 1 : 0;
    },

    //玩家掉线
    playerOffline: function (data) {
        var userId = data.userId;
        var isOffline = data.isOffline;
        this._uiComponents[this.idToView(userId)].showOffline(isOffline);
    },

    //btns点击
    onButtonClick: function (event, data) {
        switch (data) {
            case 'menu'://菜单
                hall_audio_mgr.com_btn_click();
                if (!this.menu_show) {
                    cc.find('menu', this.node).active = true;
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    if (ani._nameToState[ani._defaultClip.name]) {
                        ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                    }
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = true;
                }
                else {
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = null;
                }
                break;
            case 'tuoguan'://托管
                hall_audio_mgr.com_btn_click();
                this._uiComponents[0].sendTuoGuan();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'setting'://设置
                hall_audio_mgr.com_btn_click();
                cc.find('setting', this.node).active = true;
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'chat'://聊天
                var limitWords = null;
                if (!DDZ_Data.Instance().getIsStart()) {
                    limitWords = RoomMgr.Instance()._Rule.limitWords;
                }
                else {
                    limitWords = DDZ_Data.Instance().deskInfo.deskRule.limitWords;
                }
                if (limitWords) {
                    if (!this.wordsCD) {
                        hall_audio_mgr.com_btn_click();
                        cc.dd.PromptBoxUtil.show('此房间不能发言');
                        this.wordsCD = true;
                        this.scheduleOnce(function () {
                            this.wordsCD = false;
                        }.bind(this), 2);
                    }
                }
                else {
                    hall_audio_mgr.com_btn_click();
                    if (!this.chatAni) {
                        cc.find('chat', this.node).getComponent(cc.Animation).play('chat_in');
                    }
                }
                break;
            case 'vip'://vip介绍
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP);
                break;
            case 'exit'://退出
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                var content = "";
                var callfunc = null;
                // 已经开始
                if (DDZ_Data.Instance().getIsStart()) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
                    callfunc = this.reqSponsorDissolveRoom;
                } else {
                    if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                        content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                        callfunc = this.leave_game_req;
                    } else {
                        content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                        callfunc = this.leave_game_req;
                    }
                }
                this.popupOKcancel(content, callfunc);
                break;
        }
    },

    //选择分摞发牌
    onStackPoker: function (event, data) {
        var stack = parseInt(data);
        var msg = new cc.pb.doudizhu.ddz_stack_poker_req();
        msg.setStack(stack);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_stack_poker_req, req,
            'ddz_stack_poker_req', 'no');
    },

    //分摞发牌返回
    stackPokerRet: function (data) {
        var userId = data.userId;
        var stack = data.stack;
        //todo: 显示
    },

    leave_game_req: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    reqSponsorDissolveRoom: function () {
        var msg = new cc.pb.jilinmajiang.p17_req_sponsor_dissolve_room();
        msg.setSponsorid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_sponsor_dissolve_room, msg, "p17_req_sponsor_dissolve_room");
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //显示玩家信息
    showUserInfo: function (event, data) {
        var view = parseInt(data);
        var player = this.getPlayerByView(view);
        if (player) {
            this.userId = player.userId;
            var info_node = cc.find('user_info', this.node);
            cc.find('bg/id', info_node).getComponent(cc.Label).string = 'ID:' + player.userId;
            cc.find('bg/name', info_node).getComponent(cc.Label).string = cc.dd.Utils.substr(ddz.filterEmoji(player.nickName), 0, 8);
            cc.find('bg/coin', info_node).getComponent(cc.Label).string = player.coin.toString();
            cc.find('bg/win', info_node).getComponent(cc.Label).string = player.winTimes.toString();
            cc.find('bg/total', info_node).getComponent(cc.Label).string = player.battleTimes.toString();
            cc.find('bg/level', info_node).getComponent(cc.Label).string = 'Lv.' + player.level.toString();
            var expItem = playerExp.getItem(function (item) { return item.key == player.level; });
            cc.find('bg/exp', info_node).getComponent(cc.Label).string = '(' + player.exp.toString() + '/' + expItem.exp.toString() + ')';
            cc.find('bg/vip', info_node).getComponent(cc.Label).string = player.vipLevel.toString();
            if (player.battleTimes == 0) {
                cc.find('bg/rate', info_node).getComponent(cc.Label).string = '0%';
            }
            else {
                var div = player.winTimes / player.battleTimes;
                var rate = Math.round(div * 10000) / 100;
                cc.find('bg/rate', info_node).getComponent(cc.Label).string = rate.toString() + '%';
            }
            var headsp = cc.find('bg/head_mask/head', info_node).getComponent(cc.Sprite);
            headsp.spriteFrame = null;
            // if (player.headUrl.indexOf('.jpg') != -1) {
            //     FortuneHallManager.getRobotIcon(player.headUrl, function (sprite) {
            //         headsp.spriteFrame = sprite;
            //     });
            // }
            // else {
            cc.dd.SysTools.loadWxheadH5(headsp, player.headUrl);
            //}
            info_node.active = true;
        }
    },

    //快捷文字
    onQuickChatClick: function (event) {
        hall_audio_mgr.com_btn_click();
        if (!this.chatAni) {
            cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
        }

        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();

        var id = parseInt(event.target.tagname);
        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(1);
        chatInfo.setId(id);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 1;
        chat_msg.id = id;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
    },

    //表情点击
    onEmojiClick: function (event, data) {
        if (!this.emojiCD) {
            hall_audio_mgr.com_btn_click();
            this.emojiCD = true;
            setTimeout(function () {
                this.emojiCD = false;
            }.bind(this), 1 * 1000);
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }
            var gameType = DDZ_Data.Instance().getGameId();
            var roomId = DDZ_Data.Instance().getRoomId();
            var id = parseInt(data);

            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(2);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 2;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
    },

    //魔法表情
    sendMagicProp: function (event, data) {
        if (this.userId == cc.dd.user.id) {
            cc.log('不能对自己使用道具！');
            return;
        }

        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(3);
        chatInfo.setId(Number(data));
        chatInfo.setToUserId(this.userId);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 3;
        chat_msg.id = Number(data);
        chat_msg.toUserId = this.userId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        cc.find('user_info', this.node).active = false;
    },

    onChat: function (data) {
        if (DDZ_Data.Instance().playerInfo) {
            if (data.msgtype == 1) {//短语
                var view = this.idToView(data.sendUserId);
                var sex = this.getPlayerById(data.sendUserId).sex;
                this.playSound(sex, soundType.CHAT, data.id);
                var cfg = null;
                if (sex == 1) {
                    cfg = ddz_chat_cfg.Man;
                }
                else {
                    cfg = ddz_chat_cfg.Woman;
                }
                var str = cfg[data.id];
                this._uiComponents[view].showChat(str);
            }
            else if (data.msgtype == 2) {//表情
                var view = this.idToView(data.sendUserId);
                this._uiComponents[view].showEmoji(data.id);
            }
            else if (data.msgtype == 3) {//魔法表情
                this.playMagicProp(data.id, data.sendUserId, data.toUserId);
            }
        }
    },

    //播放魔法表
    playMagicProp: function (id, send, to) {
        var magicIcon = this.createMagicPropIcon(id);
        var startPos = this.getPlayerHeadPos(send);
        var endPos = this.getPlayerHeadPos(to);
        magicIcon.tagname = this.getTargetNode(to);
        magicIcon.setPosition(startPos);
        var moveTo = cc.moveTo(1.0, endPos);
        magicIcon.runAction(cc.sequence(
            moveTo
            , cc.callFunc(function () {
                this.playPropEffect(id, magicIcon);
            }.bind(this))
        ));
    },
    createMagicPropIcon: function (idx) {
        var atlas = cc.resources.get('gameyj_mj/changchun/py/atlas/ccmj_game_userInfo', cc.SpriteAtlas);
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = atlas.getSpriteFrame(magicIcons[idx]);
        magicIcon.parent = cc.find('magic_layer', this.node);
        // this.magicIcons.push(magicIcon);
        return magicIcon;
    },
    getPlayerHeadPos: function (id) {
        var view = this.idToView(id);
        var head = this.getHeadByView(view);
        var pos = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
        return pos;
    },
    getTargetNode: function (id) {
        var view = this.idToView(id);
        var head = cc.find('mask', this.getHeadByView(view));
        return head;
    },
    playPropEffect: function (idx, magicIcon) {
        var node = magicIcon.tagname;
        magicIcon.destroy();
        var magic_prop_ani_node = cc.instantiate(this.magic_prop);
        var magic_prop_ani = magic_prop_ani_node.getComponent(cc.Animation);
        magic_prop_ani.node.active = true;
        magic_prop_ani.node.parent = node;
        magic_prop_ani.play('magic_prop_' + idx);
        magic_prop_ani.on('finished', function () {
            magic_prop_ani.node.destroy();
        });
        AudioManager.getInstance().playSound(PropAudioCfg[idx]);
    },

    //快捷聊天
    onChatToggle: function (event, data) {
        if (data == 'text') {
            cc.find('chat/panel/text', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = true;
            cc.find('chat/panel/emoji', this.node).active = false;
        }
        else {
            cc.find('chat/panel/emoji', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = false;
            cc.find('chat/panel/emoji', this.node).active = true;
        }
    },

    //关闭按钮
    onCloseClick: function (event, data) {
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
            case 'chat':
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                }
                break;
            case 'userinfo':
                cc.find('user_info', this.node).active = false;
                break;
        }
    },

    //点击背景
    onBgClick: function () {
        if (this.menu_show) {
            cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true; }.bind(this), this);
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
        // if (cc.find('player_down/beilv/detail', this.node).active == true) {
        //     cc.find('player_down/beilv/detail', this.node).active = false;
        // }
    },

    //返回大厅
    backToHall: function (event, data) {
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 分享到朋友圈
     */
    PYQBtnCallBack: function () {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('game_end/content/erweima', this.node).active = true;
            cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            cc.find('game_end/content/erweima', this.node).active = false;
        }
    },

    //设置音乐音效
    onSetMusic: function (event, data) {
        var duration = 0.3;
        var step = 0.05;
        switch (data) {
            case 'music':
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', event.target).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', event.target).active = false;
                            cc.find('tao/b', event.target).active = true;
                            cc.find('label_guan', event.target).active = true;
                            AudioManager.getInstance().offMusic();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', event.target).width;
                        var time = duration;
                        this.switch_music = true;
                        event.target.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', event.target).width = width * time / duration;
                            if (time == 0) {
                                event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', event.target).runAction(action);
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', event.target).active = false;
                        var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', event.target).active = true;
                            cc.find('tao/b', event.target).active = false;
                            cc.find('label_kai', event.target).active = true;
                            AudioManager.getInstance().onMusic(ddz_audio_cfg.GAME_MUSIC);
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time = duration;
                        this.switch_music = true;
                        event.target.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', event.target).width = width * (1 - time / duration);
                            if (time == 0) {
                                event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', event.target).runAction(action);
                    }
                }
                break;
            case 'sound':
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', event.target).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', event.target).active = false;
                            cc.find('tao/b', event.target).active = true;
                            cc.find('label_guan', event.target).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', event.target).width;
                        var time = duration;
                        this.switch_sound = true;
                        event.target.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', event.target).width = width * time / duration;
                            if (time == 0) {
                                event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', event.target).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', event.target).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', event.target).active = true;
                            cc.find('tao/b', event.target).active = false;
                            cc.find('label_kai', event.target).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time = duration;
                        this.switch_sound = true;
                        event.target.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', event.target).width = width * (1 - time / duration);
                            if (time == 0) {
                                event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', event.target).runAction(action);
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(1);
                    AudioManager.getInstance().setMusicVolume(1);
                    this.mute = false;
                }
                else {
                    AudioManager.getInstance().setSoundVolume(0);
                    AudioManager.getInstance().setMusicVolume(0);
                    this.mute = true;
                }
                break;
            case 'fangyan':
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },

    //获取player
    getPlayerById: function (id) {
        var playerInfo = this.playingData.playerList;
        for (var i = 0; i < playerInfo.length; i++) {
            if (playerInfo[i].userId == id) {
                return playerInfo[i];
            }
        }
        return null;
    },
    getPlayerByView: function (view) {
        var playerList = this.playingData.playerList;
        if (playerList) {
            for (var i = 0; i < playerList.length; i++) {
                if (this.idToView(playerList[i].userId) == view) {
                    return playerList[i];
                }
            }
        }
        return null;
    },

    //播放音效
    playSound: function (sex, type, kind) {
        var path = '';
        var cfg = null;
        if (sex == 1) {//男
            cfg = ddz_audio_cfg.MAN;
        }
        else {
            cfg = ddz_audio_cfg.WOMAN;
        }
        switch (type) {
            case soundType.JIAOFEN:
                path = cfg.JIAOFEN[kind];
                break;
            case soundType.JIABEI:
                path = cfg.JIABEI[kind];
                break;
            case soundType.DAN:
                path = cfg.DAN[kind];
                break;
            case soundType.DUI:
                path = cfg.DUI[kind];
                break;
            case soundType.SAN:
                path = cfg.SAN[kind];
                break;
            case soundType.KILL:
                var random = Math.floor(Math.random() * 3);
                path = cfg.KILL[random];
                break;
            case soundType.PASS:
                var random = Math.floor(Math.random() * 4);
                path = cfg.PASS[random];
                break;
            case soundType.THREE_YI:
                path = cfg.THREE_YI;
                break;
            case soundType.THREE_DUI:
                path = cfg.THREE_DUI;
                break;
            case soundType.FOUR_ER:
                path = cfg.FOUR_ER;
                break;
            case soundType.FOUR_DUI:
                path = cfg.FOUR_DUI;
                break;
            case soundType.SHUNZI:
                path = cfg.SHUNZI;
                break;
            case soundType.LIANDUI:
                path = cfg.LIANDUI;
                break;
            case soundType.BOMB:
                path = cfg.BOMB;
                break;
            case soundType.ROCKET:
                path = cfg.ROCKET;
                break;
            case soundType.AIRPLANE:
                path = cfg.AIRPLANE;
                break;
            case soundType.REMAIN:
                path = cfg.REMAIN[kind];
                break;
            case soundType.CHAT:
                path = cfg.CHAT[kind];
                break;
        }
        AudioManager.getInstance().playSound(path, false);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        prefab.getChildByName('lord').active = false;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = prefab.getChildByName('hua_xiao');
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        switch (value) {
            case 0:
                prefab.getChildByName('beimian').active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 14:
            case 16:
            case 11:
            case 12:
            case 13:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        var beimian = prefab.getChildByName('beimian');
        var joker = prefab.getChildByName('joker');
        switch (value) {
            case 0:
                beimian.active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 16:
                beimian.active = false;
                joker.active = false;
                num.active = true;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.active = true;
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                break;
            case 17:
                beimian.active = false;
                joker.active = true;
                num.active = false;
                if (flower % 2 == 0) {
                    joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r18');
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r19');
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_da.active = true;
                break;
        }
    },

    onMingpaiBtn: function (event, data) {
        var ddz_send_msg = require('ddz_send_msg');
        ddz_send_msg.sendMingpai();
    },

    onMingpai: function (msg) {
        for (var i = 0; i < msg.rolePokerList.length; i++) {
            this.setMingpaiList(msg.rolePokerList[i].userId, msg.rolePokerList[i].pokersList);
        }
    },

    setMingpaiList: function (id, cards) {

    },

    subMingpaiList: function (id, cards) {

    },

    addMingpaiList: function (id, cards) {

    },

    getHeadByView: function (view) {
        var node = null;
        switch (view) {
            case 0:
                node = cc.find('head_node/head_down', this.node);
                break;
            case 1:
                node = cc.find('head_node/head_right', this.node);
                break;
            case 2:
                node = cc.find('head_node/head_left', this.node);
                break;
        }
        return node;
    },
});
