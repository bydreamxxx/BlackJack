//Created by luke on 2019/2/27
var AudioManager = require('AudioManager');
let sh_audio_cfg = require('sh_audio_cfg');
let sh_game_head = require('sh_head_replay');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppCfg = require('AppConfig');
var Platform = require('Platform');
var replay_data = require('com_replay_data').REPLAY_DATA;
var REPLAY_ED = require('com_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_replay_data').REPLAY_EVENT;
var proto_id = require('c_msg_suoha_cmd');
var chipList = [1, 5, 10, 50, 100];
const cardPositon = [[54.08, 95.04, 136, 176.96, 217.92], [-165.8, -135, -104.2, -73.4, -42.6], [-165.8, -135, -104.2, -73.4, -42.6], [84.5, 115.3, 146.1, 176.9, 207.7], [84.5, 115.3, 146.1, 176.9, 207.7]];
//回放用的协议列表
const replayProto = {
    init: 'cmd_record_room_info',                       //初始化
    roomstate: 'cmd_msg_suoha_state_change_2c',         //房间状态
    sendcard: 'cmd_msg_suoha_deal_card_2c',             //发牌
    bet: 'cmd_msg_suoha_bet_2c',                        //下注
    showcard: 'cmd_msg_suoha_show_card_2c',             //开牌
    result: 'cmd_msg_suoha_result_2c',                  //结算
};

//回放数据
var RoomReplayData = cc.Class({
    ctor() {
        this.selfId = cc.dd.user.id;
        this.playStatus = replayProto.init;
        this.resultMsg = null;
        this.playerList = [];       //PlayerReplayData类型
        this.deskInfo = {           //桌内信息
            baseScore: 1,
        };
    }
});

//玩家数据
var PlayerReplayData = cc.Class({
    ctor() {
        this.handPoker = [];        //手牌
        this.score = 0;             //分数
        this.headUrl = '';          //头像
        this.nickName = '';         //昵称
        this.sex = 0;               //性别
        this.site = -1;             //座位
        this.userId = -1;           //id
        this.curBet = 0;            //叫分
        this.allBet = 0;            //加倍
        this.isDiscard = false;     //庄家
        this.resultScore = null;    //结果
        this.cardtype = null;       //手牌类型
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

const stepTime = 1.5;//单步间隔

cc.Class({
    extends: cc.Component,

    properties: {
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        slider_bar: { type: cc.Node, default: null },
        handler_bar: { type: cc.Node, default: null },
        chip_prefab: cc.Prefab,
        pokerAtlas: { type: cc.SpriteAtlas, default: null, tooltip: '牌图集' },
        result_fonts: [cc.Font],            //结算字体
        type_splist: [cc.SpriteFrame],      //牌类型
        type_splist_gray: [cc.SpriteFrame], //牌类型(灰色)
        chip_splist: [cc.SpriteFrame],      //筹码sp列表
        head_list: [sh_game_head],          //头像
    },

    // use this for initialization
    onLoad: function () {
        this._fapaiqi = cc.find('fapaiqi', this.node).getComponent('sh_fapaiqi');
        this._chipPool = new cc.NodePool('chipPool_sh_replay');
        for (var i = 0; i < 100; i++) {
            var node = cc.instantiate(this.chip_prefab);
            this._chipPool.put(node);
        }
        this.slider_bar.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        REPLAY_ED.addObserver(this);
        this.init();
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
        this.initData();
        this.initRoundList();
        this.initHandler();
        this.initUiScript();
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
        }.bind(this), 0.5);
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

    /**
     * 单步数据处理
     * @param {*} msg 
     */
    stepBy(msg) {
        var id = msg.id;
        let self = this;
        this.playingData.deskInfo.curSay = null;
        switch (id) {
            case proto_id[replayProto.roomstate]://房间状态改变
                this.playingData.playStatus = replayProto.roomstate;
                this.playingData.deskInfo.roomState = msg.content.roomState;
                var playerInfo = this.playingData.playerList;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (msg.content.roomState == 2) {
                        playerInfo[i].allBet = this.playingData.deskInfo.baseScore;
                    }
                    playerInfo[i].curBet = 0;
                }
                this.playingData.deskInfo.maxBet = msg.content.maxBet > 0 ? msg.content.maxBet : 0;
                break;
            case proto_id[replayProto.sendcard]://发牌
                this.playingData.playStatus = replayProto.sendcard;
                var sdata = msg.content.cardInfoListList;
                sdata.forEach(element => {
                    var player = self.getPlayerById(element.userId);
                    player.handPoker = element.cardsList;
                });
                break;
            case proto_id[replayProto.bet]://下注
                this.playingData.playStatus = replayProto.bet;
                if (msg.content.retCode == 0) {
                    var userId = msg.content.userId;
                    this.playingData.deskInfo.curSay = userId;
                    var op = msg.content.op;
                    this.getPlayerById(userId).curOp = op;
                    switch (op) {
                        case 0://加注
                            this.getPlayerById(userId).addBet = msg.content.curBet - this.getPlayerById(userId).curBet;
                            break;
                        case 1://梭哈
                            this.getPlayerById(userId).addBet = msg.content.curBet - this.getPlayerById(userId).curBet;
                            break;
                        case 2://弃牌
                            this.getPlayerById(userId).isDiscard = true;
                            break;
                        case 3://跟注
                            this.getPlayerById(userId).addBet = msg.content.curBet - this.getPlayerById(userId).curBet;
                            break;
                        case 4://开牌
                            break;
                        case 5://过
                            break;
                    }
                    this.getPlayerById(userId).curBet = msg.content.curBet;
                    this.getPlayerById(userId).allBet = msg.content.allBet;
                }
                break;
            case proto_id[replayProto.showcard]://开牌
                this.playingData.playStatus = replayProto.showcard;
                var sdata = msg.content.cardInfoListList;
                sdata.forEach(element => {
                    var player = self.getPlayerById(element.userId);
                    player.handPoker = element.cardsList;
                    player.cardtype = element.type;
                });
                break;
            case proto_id[replayProto.result]://结算
                this.playingData.playStatus = replayProto.result;
                var resultsList = msg.content.resultsList;
                resultsList.forEach(result => {
                    var player = self.getPlayerById(result.userId);
                    var winGold = result.winGold;
                    player.score += winGold;
                    player.resultScore = winGold;
                });
                break;
        }
    },

    //播单步操作
    handlerMsg(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.roomstate]://房间状态
                this.onRoomState(msg.content);
                break;
            case proto_id[replayProto.sendcard]://发牌
                this.onSendCard(msg.content);
                break;
            case proto_id[replayProto.bet]://下注
                this.onBet(msg.content);
                break;
            case proto_id[replayProto.showcard]://开牌
                this.onShowCard(msg.content, true);
                break;
            case proto_id[replayProto.result]://结算
                this.onResult(msg.content, true);
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

    //状态改变
    onRoomState(msg) {
        cc.find('add', this.node).active = false;
        if (msg.roomState == 2) {
            var bScore = this.playingData.deskInfo.baseScore;
            var playerInfo = this.playingData.playerList;
            for (var i = 0; i < playerInfo.length; i++) {
                var view = this.getViewById(playerInfo[i].userId);
                this.playChips(view, bScore);
                this.head_list[view].setAllBet(bScore);
            }
        }
        this.updateDeskScore();
    },

    //播放筹码动画
    playChips(view, add) {
        let chips = [];//筹码列表(贪心法)
        for (var i = chipList.length - 1; i > -1 && add > 0; i--) {
            if (add >= chipList[i]) {
                var num = Math.floor(add / chipList[i]);
                for (var j = 0; j < num; j++) {
                    chips.push(chipList[i]);
                }
                add -= num * chipList[i];
            }
        }
        for (var i = chips.length - 1; i > -1; i--) {
            this.singleBet(view, chips[i]);
        }
    },

    getChipStr(value) {
        if (value < 1000)
            return value.toString();
        else if (value < 10000)
            return value / 1000 + '千';
        else if (value < 1000000)
            return value / 10000 + '万';
        else if (value < 10000000)
            return value / 1000000 + '百万';
        else if (value < 100000000)
            return value / 10000000 + '千万';
        else
            return value / 100000000 + '亿';
    },

    //单个筹码飞出
    singleBet(view, value) {
        var idx = chipList.indexOf(value);
        if (idx != -1) {
            var betArea = cc.find('bet_area', this.node);
            var startpos = this.head_list[view].node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
            const chipWidth = 34;
            var endpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
            let node = this.getChipNode();
            node.tagname = value;
            let sp = node.getComponent(cc.Sprite);
            sp.enabled = false;
            sp.spriteFrame = this.chip_splist[idx];
            sp.getComponentInChildren(cc.Label).string = this.getChipStr(value);
            node.getComponent('sh_chip').fly(startpos, endpos, betArea);
            AudioManager.getInstance().playSound(sh_audio_cfg.Chip, false);
        }
    },

    //补齐筹码
    resumeChips(add, isClear) {
        var betArea = cc.find('bet_area', this.node);
        if (isClear) {
            for (var i = betArea.children.length - 1; i > -1; i--) {
                this._chipPool.put(betArea.children[i]);
            }
        }
        let chips = [];//筹码列表(贪心法)
        for (var i = chipList.length - 1; i > -1 && add > 0; i--) {
            if (add >= chipList[i]) {
                var num = Math.floor(add / chipList[i]);
                for (var j = 0; j < num; j++) {
                    chips.push(chipList[i]);
                }
                add -= num * chipList[i];
            }
        }
        for (var i = 0; i < chips.length; i++) {
            const chipWidth = 34;
            var endpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
            let node = this.getChipNode();
            node.tagname = chips[i];
            let sp = node.getComponent(cc.Sprite);
            sp.enabled = true;
            var idx = chipList.indexOf(chips[i]);
            if (idx != -1)
                sp.spriteFrame = this.chip_splist[idx];
            sp.getComponentInChildren(cc.Label).string = this.getChipStr(chips[i]);
            betArea.addChild(node);
            node.setPosition(endpos);
        }
    },

    //刷新下注底分信息
    updateDeskScore() {
        let total = this.getTotalBet();
        let baseScore = this.playingData.deskInfo.baseScore;
        let max = this.playingData.deskInfo.maxBet || 0;
        let room_str = '底分:' + baseScore + '    封顶:' + max;
        cc.find('info/room', this.node).getComponent(cc.Label).string = room_str;
        cc.find('info/bet', this.node).getComponent(cc.Label).string = total.toString();
    },

    //获取下注总和
    getTotalBet() {
        var total = 0;
        var playerInfo = this.playingData.playerList;
        for (var i = 0; i < playerInfo.length; i++) {
            total += (playerInfo[i].allBet || 0);
        }
        return total;
    },

    //发牌
    onSendCard(msg) {
        const stepTime = 0.1;
        const durTime = 0.2;
        let cardInfoList = msg.cardInfoListList;
        let maxCard = 0;
        for (var i = 0; i < cardInfoList.length; i++) {
            maxCard = cardInfoList[i].cardsList.length > maxCard ? cardInfoList[i].cardsList.length : maxCard;
        }
        if (maxCard == 2) {
            var firstView = this.getViewById(cardInfoList[cardInfoList.length - 1].userId);
            cardInfoList.sort((a, b) => {
                let viewa = this.getViewById(a.userId) - firstView;
                let viewb = this.getViewById(b.userId) - firstView;
                if (viewa < 0) viewa += 5;
                if (viewb < 0) viewb += 5;
                return viewa - viewb;
            });
            for (var i = 0; i < cardInfoList.length; i++) {
                var card = this._fapaiqi.removeCard(1)[0];
                var view = this.getViewById(cardInfoList[i].userId);
                var toScale = cc.v2(0.5, 0.5);
                if (view == 1 || view == 2)
                    var toPosition0 = cc.v2(cardPositon[view][4], 0);
                else
                    var toPosition0 = cc.v2(cardPositon[view][0], 0);
                if (view == 0) toScale = cc.v2(0.64, 0.64);
                var node0 = cc.find('card/card0', this.head_list[view].node);
                node0.scaleX = card.scaleX;
                node0.scaleY = card.scaleY;
                node0.rotation = card.rotation;
                var nodepos0 = node0.convertToWorldSpaceAR(cc.v2(0, 0));
                var cardpos0 = card.convertToWorldSpaceAR(cc.v2(0, 0));
                node0.x += (cardpos0.x - nodepos0.x);
                node0.y += (cardpos0.y - nodepos0.y);
                this.setPokerBack(node0, cardInfoList[i].cardsList[0]);
                node0.getComponent('sh_card').sendCard(card, i * stepTime, durTime, toPosition0, toScale, true);//明牌
            }
            for (var i = 0; i < cardInfoList.length; i++) {
                var card = this._fapaiqi.removeCard(1)[0];
                var view = this.getViewById(cardInfoList[i].userId);
                var toScale = cc.v2(0.5, 0.5);
                if (view == 1 || view == 2)
                    var toPosition1 = cc.v2(cardPositon[view][4], 0);
                else
                    var toPosition1 = cc.v2(cardPositon[view][1], 0);
                if (view == 0) toScale = cc.v2(0.64, 0.64);
                var node0 = cc.find('card/card0', this.head_list[view].node);
                var node1 = cc.find('card/card1', this.head_list[view].node);
                node1.scaleX = card.scaleX;
                node1.scaleY = card.scaleY;
                node1.rotation = card.rotation;
                var nodepos1 = node1.convertToWorldSpaceAR(cc.v2(0, 0));
                var cardpos1 = card.convertToWorldSpaceAR(cc.v2(0, 0));
                node1.x += (cardpos1.x - nodepos1.x);
                node1.y += (cardpos1.y - nodepos1.y);
                this.setPokerBack(node1, cardInfoList[i].cardsList[1]);
                if (view == 1 || view == 2)
                    node0.getComponent('sh_card').moveCard((cardInfoList.length + i) * stepTime + durTime, durTime, cc.v2(cardPositon[view][3], 0));
                node1.getComponent('sh_card').sendCard(card, (cardInfoList.length + i) * stepTime, durTime, toPosition1, toScale, true);
                cc.find('bet', this.head_list[view].node).active = true;
            }
        }
        else {
            var firstView = this.getViewById(cardInfoList[cardInfoList.length - 1].userId);
            cardInfoList.sort((a, b) => {
                let viewa = this.getViewById(a.userId) - firstView;
                let viewb = this.getViewById(b.userId) - firstView;
                if (viewa < 0) viewa += 5;
                if (viewb < 0) viewb += 5;
                return viewa - viewb;
            });
            for (var i = 0; i < cardInfoList.length; i++) {
                var card = this._fapaiqi.removeCard(1)[0];
                var view = this.getViewById(cardInfoList[i].userId);
                var toScale = cc.v2(0.5, 0.5);
                if (view == 1 || view == 2)
                    var toPosition = cc.v2(cardPositon[view][4], 0);
                else
                    var toPosition = cc.v2(cardPositon[view][maxCard - 1], 0);
                if (view == 0) toScale = cc.v2(0.64, 0.64);
                var node = cc.find('card/card' + (maxCard - 1), this.head_list[view].node);
                node.scaleX = card.scaleX;
                node.scaleY = card.scaleY;
                node.rotation = card.rotation;
                var nodepos = node.convertToWorldSpaceAR(cc.v2(0, 0));
                var cardpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
                node.x += (cardpos.x - nodepos.x);
                node.y += (cardpos.y - nodepos.y);
                this.setPokerBack(node, cardInfoList[i].cardsList[maxCard - 1]);
                if (view == 1 || view == 2) {
                    for (var j = 0; j < maxCard - 1; j++) {
                        var node_move = cc.find('card/card' + j, this.head_list[view].node);
                        var move_pos = cc.v2(cardPositon[view][5 - maxCard + j], 0);
                        node_move.getComponent('sh_card').moveCard(i * stepTime + durTime, durTime, move_pos);
                    }
                }
                node.getComponent('sh_card').sendCard(card, i * stepTime, durTime, toPosition, toScale, true);
            }
        }
    },

    onBet(msg) {
        if (msg.retCode == 0) {
            switch (msg.op) {
                case 0:
                    //加注
                    var userId = msg.userId;
                    var view = this.getViewById(userId);
                    var add = this.getPlayerById(userId).addBet;
                    var total = this.getPlayerById(userId).allBet;
                    this.head_list[view].setAllBet(total);
                    cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + add.toString();
                    cc.find('add', this.node).active = true;
                    this.playChips(view, add);
                    if (this.getMaxCurBetWithout(userId) > 0) {
                        this.head_list[view].say('加注');
                        if (this.getPlayerById(userId).sex == 1)
                            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Raise, false);
                        else
                            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Raise, false);
                    }
                    else {
                        this.head_list[view].say('下注');
                        if (this.getPlayerById(userId).sex == 1)
                            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Xiazhu, false);
                        else
                            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Xiazhu, false);
                    }
                    this.updateDeskScore();
                    break;
                case 1:
                    //梭哈
                    var userId = msg.userId;
                    var view = this.getViewById(userId);
                    var add = this.getPlayerById(userId).addBet;
                    var total = this.getPlayerById(userId).allBet;
                    this.head_list[view].setAllBet(total);
                    cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + add.toString();
                    cc.find('add', this.node).active = true;
                    this.playChips(view, add);
                    this.head_list[view].say('梭哈');
                    if (this.getPlayerById(userId).sex == 1)
                        AudioManager.getInstance().playSound(sh_audio_cfg.MAN.ShowHand, false);
                    else
                        AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.ShowHand, false);
                    this.updateDeskScore();
                    break;
                case 2:
                    //弃牌
                    var userId = msg.userId;
                    cc.find('add', this.node).active = false;
                    var view = this.getViewById(userId);
                    this.head_list[view].showDiscard(true);
                    this.head_list[view].say('弃牌');
                    if (this.getPlayerById(userId).sex == 1)
                        AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Discard, false);
                    else
                        AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Discard, false);
                    this.updateDeskScore();
                    break;
                case 3:
                    //跟注
                    var userId = msg.userId;
                    var view = this.getViewById(userId);
                    var add = this.getPlayerById(userId).addBet;
                    var total = this.getPlayerById(userId).allBet;
                    this.head_list[view].setAllBet(total);
                    cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + add.toString();
                    cc.find('add', this.node).active = true;
                    this.playChips(view, add);
                    this.head_list[view].say('跟');
                    if (this.getPlayerById(userId).sex == 1)
                        AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Call, false);
                    else
                        AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Call, false);
                    this.updateDeskScore();
                    break;
                case 4:
                    //开牌
                    var userId = msg.userId;
                    var view = this.getViewById(userId);
                    this.head_list[view].say('开牌');
                    break;
                case 5:
                    //过
                    var userId = msg.userId;
                    var view = this.getViewById(userId);
                    cc.find('add', this.node).active = false;
                    this.head_list[view].say('过');
                    if (this.getPlayerById(userId).sex == 1)
                        AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Pass, false);
                    else
                        AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Pass, false);
                    break;
            }
        }
    },

    //开牌
    onShowCard(msg) {
        let cardInfoListList = msg.cardInfoListList;
        for (var i = 0; i < cardInfoListList.length; i++) {
            var player = this.getPlayerById(cardInfoListList[i].userId);
            if (player && !player.isDiscard) {
                var view = this.getViewById(cardInfoListList[i].userId);
                if (player.userId == msg.winUser) {
                    if (player.cardtype && player.handPoker.length == 5) {
                        this.head_list[view].showCardType(player.cardtype, true);
                        cc.find('win/card_di', this.head_list[view].node).active = true;
                        cc.find('win/card_di', this.head_list[view].node).getComponent(sp.Skeleton).clearTracks();
                        cc.find('win/card_di', this.head_list[view].node).getComponent(sp.Skeleton).setAnimation(0, '5', true);
                    }
                }
                else {
                    if (player.cardtype && player.handPoker.length == 5)
                        this.head_list[view].showCardType(player.cardtype, false);
                }
            }
        }
    },

    onResult(msg) {
        cc.find('add', this.node).active = false;
        this._resultMSG = msg;
        var winView = null;//赢家view
        for (var i = 0; i < msg.resultsList.length; i++) {
            var view = this.getViewById(msg.resultsList[i].userId);
            if (view != null) {
                var score = cc.find('score', this.head_list[view].node);
                if (msg.resultsList[i].winGold < 0)
                    score.getComponent(cc.Label).font = this.result_fonts[1];
                else {
                    score.getComponent(cc.Label).font = this.result_fonts[0];
                    winView = view;
                    this._winView = view;
                }
                score.getComponent(cc.Label).string = ':' + Math.abs(msg.resultsList[i].winGold);
            }
        }
        cc.find('win', this.head_list[winView].node).active = true;
        const flyTime = 0.5;
        var betArea = cc.find('bet_area', this.node);
        if (betArea.childrenCount == 0) {
            this.onResultFinish();
            return;
        }
        var endpos = this.head_list[winView].node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
        for (var i = 0; i < betArea.children.length; i++) {
            if (i == betArea.children.length - 1) {
                betArea.children[i].getComponent('sh_chip').fly2Remove(0, flyTime, endpos, this._chipPool, this.onResultFinish.bind(this));
                AudioManager.getInstance().playSound(sh_audio_cfg.Chip_end, false);
            }
            else
                betArea.children[i].getComponent('sh_chip').fly2Remove(0, flyTime, endpos, this._chipPool);
        }
    },
    onResultFinish() {
        if (this._resultMSG) {
            var msg = this._resultMSG;
            for (var i = 0; i < msg.resultsList.length; i++) {
                var view = this.getViewById(msg.resultsList[i].userId);
                if (view != null) {
                    var score = cc.find('score', this.head_list[view].node);
                    score.active = true;
                }
            }
        }
        this.updatePlayerScore();
    },

    getSelf() {
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            if (this.playingData.playerList[i].userId == this.playingData.selfId) {
                return this.playingData.playerList[i];
            }
        }
        return null;
    },

    //获取筹码节点
    getChipNode() {
        let node = this._chipPool.get();
        if (!node) {
            node = cc.instantiate(this.chip_prefab);
        }
        return node;
    },

    //播放音效
    playSound(sex, type, kind) {
        var path = '';
        var cfg = null;
        if (sex == 1) {//男
            cfg = nn_audio_cfg.MAN;
        }
        else {
            cfg = nn_audio_cfg.WOMAN;
        }
        switch (type) {
            case 0://抢庄
                path = cfg.QIANGZHUANG[kind];
                break;
            case 1://牌型
                path = cfg.PAIXING[kind];
                break;
        }
        AudioManager.getInstance().playSound(path, false);
    },

    //背面牌
    setPokerBack(node, cardValue, paiAtlas) {
        if (paiAtlas == null) {
            paiAtlas = this.pokerAtlas;
        }
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = node.getChildByName('hua_xiao');
        var hua_da = node.getChildByName('hua_da');
        var num = node.getChildByName('num');
        if (value == 2) value = 16;
        if (value == 1) value = 14;
        if (value < 17) {
            switch (flower) {
                case 1:
                    flower = 4;
                    break;
                case 2:
                    flower = 3;
                    break;
                case 3:
                    flower = 2;
                    break;
                case 4:
                    flower = 1;
                    break;
            }
        }
        switch (value) {
            case 0:
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
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
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
        this.updatePlayerScore();
        this.updateDeskChips();
        this.updateDeskScore();
        let totalCards = 0;
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            totalCards += this.playingData.playerList[i].handPoker.length;
        }
        this._fapaiqi.resumeCard(totalCards);//发牌器重置
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            var view = this.idToView(this.playingData.playerList[i].userId);
            this.head_list[view].updatePlayerUI(view, this.playingData.playerList[i]);
            cc.find('say', this.head_list[view].node).active = false;
        }
        cc.find('add', this.node).active = false;
        var status = this.playingData.playStatus;
        switch (status) {
            case replayProto.bet:
                var userId = this.playingData.deskInfo.curSay;
                var view = this.getViewById(userId);
                var curOp = this.getPlayerById(userId).curOp;
                switch (curOp) {
                    case 0://加注
                        cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + this.getPlayerById(userId).addBet.toString();
                        cc.find('add', this.node).active = true;
                        if (this.getMaxCurBetWithout(userId) > 0) {
                            this.head_list[view].say('加注');
                        }
                        else {
                            this.head_list[view].say('下注');
                        }
                        break;
                    case 1://梭哈
                        cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + this.getPlayerById(userId).addBet.toString();
                        cc.find('add', this.node).active = true;
                        this.head_list[view].say('梭哈');
                        break;
                    case 2://弃牌
                        this.head_list[view].say('弃牌');
                        break;
                    case 3://跟注
                        cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + this.getPlayerById(userId).addBet.toString();
                        cc.find('add', this.node).active = true;
                        this.head_list[view].say('跟');
                        break;
                    case 4://开牌
                        this.head_list[view].say('开牌');
                        break;
                    case 5://过
                        this.head_list[view].say('过');
                        break;
                }
                break;
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
            if (obj.hasOwnProperty(attr))
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
        var sendcardMSG = null;
        var resultMsg = null;
        for (var i in replayProto) {
            if (i == 'init')
                filterIds.push(require('c_msg_doudizhu_cmd')[replayProto[i]]);
            else
                filterIds.push(proto_id[replayProto[i]]);
        }
        for (var i = 0; i < msglist.length; i++) {
            if (filterIds.indexOf(msglist[i].id) != -1) {
                //**************************** 发牌消息合并成一个 ********************************/
                if (msglist[i].id == proto_id[replayProto.sendcard]) {
                    if (!sendcardMSG) {
                        sendcardMSG = msglist[i];
                        // for (var j = msglist[i].content.cardInfoListList.length - 1; j > -1; j--) {
                        //     if (msglist[i].content.cardInfoListList[j].cardsList[0] == 0) {
                        //         msglist[i].content.cardInfoListList.splice(j, 1);
                        //     }
                        // }
                        list.push(msglist[i]);
                    }
                    else {
                        for (var j = 0; j < msglist[i].content.cardInfoListList.length; j++) {
                            if (msglist[i].content.cardInfoListList[j].cardsList[0] != 0) {
                                var find = false;
                                for (var k = 0; k < sendcardMSG.content.cardInfoListList.length; k++) {
                                    if (sendcardMSG.content.cardInfoListList[k].userId == msglist[i].content.cardInfoListList[j].userId) {
                                        find = true;
                                        sendcardMSG.content.cardInfoListList[k].cardsList = msglist[i].content.cardInfoListList[j].cardsList;
                                        break;
                                    }
                                }
                                if (!find)
                                    sendcardMSG.content.cardInfoListList.push(msglist[i].content.cardInfoListList[j]);
                            }
                        }
                    }
                }
                //****************************   结算消息放到最后  ********************************/
                else {
                    if (msglist[i].id == proto_id[replayProto.result])
                        resultMsg = msglist[i];
                    else {
                        sendcardMSG = null;
                        if (msglist[i].id == proto_id[replayProto.showcard]) {
                            if (resultMsg) {
                                for (var j = 0; j < resultMsg.content.resultsList.length; j++) {
                                    if (resultMsg.content.resultsList[j].winGold > 0) {
                                        msglist[i].content.winUser = resultMsg.content.resultsList[j].userId;
                                        break;
                                    }
                                }
                            }
                            if (msglist[i].content.cardInfoListList.length)
                                list.push(msglist[i]);
                        }
                        else
                            list.push(msglist[i]);
                    }
                }
            }
        }
        if (resultMsg)
            list.push(resultMsg);
        return list;
    },

    /**
     * 初始化手牌玩家数据
     * @param {Array} data 
     */
    initData() {
        this.originData = new RoomReplayData();
        this.playingData = new RoomReplayData();
        var initMsg = this.getInitMsg(replayProto.init);
        this._desk_rule = initMsg.deskInfo.deskRule.suohaRule;
        if (this._desk_rule.maxScore == 7) {
            chipList = [100, 1000, 10000, 100000, 10000000];
        }
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
    getInitMsg(str) {
        for (var i = 0; i < this._replayData.length; i++) {
            if (this._replayData[i].id == require('c_msg_doudizhu_cmd')[str]) {
                return this._replayData[i].content;
            }
        }
        return null;
    },

    //初始化局数列表
    initRoundList() {
        var parent = cc.find('btns/left/roundlist/view/content', this.node);
        for (var i = parent.childrenCount - 1; i > -1; i--) {
            var rNode = parent.children[i];
            if (rNode.name != 'back') {
                rNode.removeFromParent();
                rNode.destroy();
            }
        }
        var round = replay_data.Instance().totalRound;
        this.zong_ju.string = '/' + round + '局';
        var template = cc.find('btns/left/roundlist/view/content/back', this.node);
        for (var i = 1; i < round + 1; i++) {
            var newNode = cc.instantiate(template);
            newNode.name = i.toString();
            if (newNode.name == this.dangqian_ju.string) {
                newNode.getComponent(cc.Button).interactable = false;
            }
            newNode.getChildByName('label').getComponent(cc.Label).string = i.toString();
            cc.find('btns/left/roundlist/view/content', this.node).addChild(newNode);
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
                var ani = cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation);
                if (ani._nameToState[ani._defaultClip.name]) {
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                }
                var func = function () {
                    cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation).off('finished', func, this);
                    cc.find('btns/changeRound', this.node).active = false;
                    this._ani_menu = false;
                    this.roundListActive = true;
                }.bind(this);
                cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation).on('finished', func, this);
                cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation).play();
            }
        }
        else {
            if (!this._ani_menu) {
                this._ani_menu = true;
                var ani = cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation);
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                var func = function () {
                    cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation).off('finished', func, this);
                    cc.find('btns/changeRound', this.node).active = true;
                    this._ani_menu = false;
                    this.roundListActive = false;
                }.bind(this);
                cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation).on('finished', func, this);
                cc.find('btns/left/roundlist', this.node).getComponent(cc.Animation).play();
            }
        }
    },

    onDestroy: function () {
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

    getViewById(id) {
        return this.idToView(id);
    },

    //userId转座位View
    idToView(id) {
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
            view += 5;
        }
        return view;
    },

    //刷新玩家分数
    updatePlayerScore() {
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            var view = this.getViewById(this.playingData.playerList[i].userId);
            this.head_list[view]._gold.string = this.playingData.playerList[i].score.toString();
        }
    },

    //刷新桌面筹码
    updateDeskChips() {
        let totalBet = 0;
        let deskBet = 0;
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            totalBet += this.playingData.playerList[i].allBet;
        }
        let betArea = cc.find('bet_area', this.node);
        betArea.children.forEach(chip => {
            deskBet += chip.tagname;
        })
        if (deskBet < totalBet) {//补齐筹码
            this.resumeChips(totalBet - deskBet, false);
        }
        else if (deskBet > totalBet) {//清空筹码
            this.resumeChips(totalBet, true);
        }
    },

    /**
     * 初始化UI脚本
     */
    initUiScript() {
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].node.active = false;
        }
        for (var i = 0; i < this.originData.playerList.length; i++) {
            var view = this.idToView(this.originData.playerList[i].userId);
            this.head_list[view].initPlayerUI(view, this.originData.playerList[i]);
        }
    },

    //返回大厅
    backToHall: function (event, data) {
        cc.dd.SceneManager.enterHall();
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

    getMaxCurBetWithout(id) {
        let max = 0;
        var playerList = this.playingData.playerList;
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].curBet > max && playerList[i].userId != id)
                max = playerList[i].curBet;
        }
        return max;
    },
});
