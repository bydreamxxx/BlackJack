var AudioManager = require('AudioManager');
var nn_audio_cfg = require('nn_audio_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppCfg = require('AppConfig');
var Platform = require('Platform');
var replay_data = require('com_replay_data').REPLAY_DATA;
var REPLAY_ED = require('com_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_replay_data').REPLAY_EVENT;
var proto_id = require('c_msg_douniu_cmd');

const CardType = {  //牌类型
    Invalid: -1,            //无效
    Niu_0: 0,               //无牛
    Niu_1: 1,               //牛1
    Niu_2: 2,               //牛2
    Niu_3: 3,               //牛3
    Niu_4: 4,               //牛4
    Niu_5: 5,               //牛5
    Niu_6: 6,               //牛6
    Niu_7: 7,               //牛7
    Niu_8: 8,               //牛8
    Niu_9: 9,               //牛9
    Niu_10: 10,             //牛牛
    Three: 11,              //三条
    Line: 14,               //顺子
    Color: 15,              //同花
    Silver: 12,             //银牛
    Hulu: 16,               //葫芦
    Gold: 13,               //金牛
    Bomb: 17,               //炸弹
    Small: 19,              //五小牛
    ColorLine: 18,          //同花顺
};

//回放用的协议列表
const replayProto = {
    init: 'cmd_record_room_info',                       //初始化
    //roomstate: 'cmd_msg_bullfight_state_change_2c',     //房间状态
    sendcard: 'cmd_msg_bullfight_deal_card_2c',         //发牌
    banker: 'cmd_msg_bullfight_rob_bull_2c',            //抢庄
    bankret: 'cmd_msg_bullfight_banker_2c',             //抢庄结果
    bet: 'cmd_msg_bullfight_bet_2c',                    //下注
    showcard: 'cmd_msg_bullfight_show_card_2c',         //开牌
    result: 'cmd_msg_bullfight_result_2c',              //结算
};

//回放数据
var RoomReplayData = cc.Class({
    ctor() {
        this.selfId = cc.dd.user.id;
        this.playStatus = replayProto.init;
        this.resultMsg = null;
        this.playerList = [];       //PlayerReplayData类型
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
        this.callscore = null;      //叫分
        this.double = null;         //加倍
        this.banker = false;        //庄家
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
const timer = 0.05;

cc.Class({
    extends: cc.Component,

    properties: {
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        slider_bar: { type: cc.Node, default: null },
        handler_bar: { type: cc.Node, default: null },
        coin_prefab: cc.Prefab,
        pokerAtlas: { type: cc.SpriteAtlas, default: null, tooltip: '牌图集' },
        win_font: { type: cc.Font, default: null, tooltip: '胜利字体' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字体' },
        head_nodes: [cc.Node],
        bankSpList: [cc.SpriteFrame],
        betSpList: [cc.SpriteFrame],
        typeSpList: [cc.SpriteFrame],
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
                this.unschedule(this.handlerRun);
                this.handler_time = 0;
                this.schedule(this.handlerRun, timer);
                cc.log('starttime:' + new Date().getTime());
            }
        }
    },

    handlerRun(dt) {
        if (this._pause) {
            this.unschedule(this.handlerRun);
            return;
        }
        this.handler_time += dt;
        cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = (this._playIndex - 1).toString();
        if (this.handler_time >= stepTime) {
            cc.log('endtime:' + new Date().getTime());
            this.handler_time = stepTime;
            var ratio = (1 / this.totalStep * (this._playIndex - 1)) + (1 / this.totalStep) * (this.handler_time / stepTime);
            cc.find('btns/handler_bar/slider', this.node).getComponent(cc.Slider).progress = ratio;
            this.node.getComponentInChildren('syncPbarSlider').sync();
            cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
            this.unschedule(this.handlerRun);
            if (this._playIndex == this.totalStep) {
                this._pause = true;
                this.showPlayBtn(this._pause);
            }
        }
        var ratio = (1 / this.totalStep * (this._playIndex - 1)) + (1 / this.totalStep) * (this.handler_time / stepTime);
        cc.find('btns/handler_bar/slider', this.node).getComponent(cc.Slider).progress = ratio;
        this.node.getComponentInChildren('syncPbarSlider').sync();
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
            case proto_id[replayProto.banker]://抢庄
                this.onBanker(msg.content);
                break;
            case proto_id[replayProto.bankret]://抢庄成功
                this.onBankerRet(msg.content);
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

    onRoomState(msg) {

    },

    onSendCard(const_msg) {
        let msg = this.deepCopy(const_msg);
        let self = this;
        var sdata = msg.cardInfoListList;
        sdata.forEach(element => {
            var player = self.getPlayerById(element.userId);
            player.handPoker = element.cardsList;
        });

        var comp = function (a, b) {
            var viewA = this.idToView(a.userId);
            var viewB = this.idToView(b.userId);
            if (viewA == 0) return false;
            if (viewB == 0) return true;
            return viewB - viewA;
        }.bind(this);
        msg.cardInfoListList.sort(comp);
        var playFinished = function (event) {
            event.target.off('finished', playFinished);
            var data = sdata.shift();
            if (data) {
                playAni(data);
            }
        };
        var playDBFinished = function () {
            cc.find('zi/start', this.node).getComponent(cc.Animation).off('finished', playDBFinished, this);
            var data = sdata.shift();
            if (data) {
                playAni(data);
            }
        };
        var playAni = function (data) {
            var userId = data.userId;
            var cardsList = data.cardsList;
            var view = this.idToView(userId);
            for (var i = 0; i < cardsList.length; i++) {
                this.setPoker(cc.find('player/handcard', this.head_nodes[view]).children[i], cardsList[i]);
            }
            cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).on('finished', playFinished);
            var ani_name = cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).getClips().find(e => { return e.name.indexOf('sendpoker') != -1; }).name;
            cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).play(ani_name);
        }.bind(this);
        cc.find('zi/start', this.node).active = true;
        cc.find('zi/start', this.node).getComponent(cc.Animation).on('finished', playDBFinished, this);
        cc.find('zi/start', this.node).getComponent(cc.Animation).play();
        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.START_GAME, false);
    },

    onBanker(msg) {
        var userId = msg.userId;
        var bet = msg.bet;
        var player = this.getPlayerById(userId);
        if (!player) {
            cc.log('抢庄返回, 找不到玩家, id:' + userId);
        }
        player.callscore = bet;
        var view = this.idToView(userId);
        var sex = player.sex;
        cc.find('player/qiangzhuang', this.head_nodes[view]).getComponent(cc.Sprite).spriteFrame = this.getBankSpriteFrame(bet);
        this.playSound(sex, 0, bet);
    },

    onBankerRet(msg) {
        var bankerId = msg.userId;
        this.getPlayerById(bankerId).banker = true;
        var view = this.idToView(bankerId);
        for (var i = 0; i < this.head_nodes.length; i++) {
            if (i != view)
                cc.find('player/qiangzhuang', this.head_nodes[i]).getComponent(cc.Sprite).spriteFrame = null;
        }
        cc.find('bank_ani', this.head_nodes[view]).active = true;
        cc.find('banker_ani2', this.head_nodes[view]).active = true;
        cc.find('bank_di', this.head_nodes[view]).active = true;
        cc.find('banker', this.head_nodes[view]).active = true;
        cc.find('bank_ani', this.head_nodes[view]).getComponent(cc.Animation).play();
        cc.find('banker_ani2', this.head_nodes[view]).getComponent(cc.Animation).play();
        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.BANKER, false);
    },

    onBet(msg) {
        if (msg.retCode == 0) {
            var userId = msg.userId;
            var bet = msg.bet;
            this.getPlayerById(userId).double = bet;
            var view = this.idToView(userId);
            cc.find('player/xiazhu', this.head_nodes[view]).getComponent(cc.Sprite).spriteFrame = this.getBetSpriteFrame(bet);
            if (view == 0)
                AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.BET, false);
        }
    },

    onShowCard(const_msg) {
        let self = this;
        let msg = this.deepCopy(const_msg);
        var sdata = msg.cardInfoListList;
        sdata.forEach(element => {
            var player = self.getPlayerById(element.userId);
            if (!player) {
                cc.log('开牌， 找不到玩家, id:' + element.userId);
            }
            player.handPoker = element.cardsList;
            player.orderCardsList = element.orderCardsList;
            player.cardtype = element.type;
        });

        var comp = function (a, b) {
            var viewB = this.idToView(b.userId);
            if (viewB == 0) return true;
            return false;
        }.bind(this);
        msg.cardInfoListList.sort(comp);
        var playFinished = function (event) {
            //event.target.off(dragonBones.EventObject.COMPLETE, null);
            event && event.target.off('finished', playFinished, this);
            var data = sdata.shift();
            if (data) {
                playAni(data);
            }
            else {
                cc.find('zi/start_bipai', this.node).active = false;
            }
        };
        var playAni = function (data) {
            var userId = data.userId;
            var cardsList = data.cardsList;
            var type = data.type;
            var orderCardsList = data.orderCardsList;
            var view = this.idToView(userId);
            if (view == 0) {
                cc.find('player/type/type', this.head_nodes[view]).getComponent(cc.Sprite).spriteFrame = this.typeSpList[type];
                cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).on('finished', playFinished, this);
                var kou5 = this._desk_rule ? this._desk_rule.showType : 1;
                if (kou5 != 2) {
                    this.playSound(this.getPlayerById(userId).sex, 1, type);
                    cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).play('fanpai');
                    cc.log('自己翻牌 play fanpai');
                }
                else {
                    this.playSound(this.getPlayerById(userId).sex, 1, type);
                    cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).play('fanpai5');
                    cc.log('play fanpai5');
                }
            }
            else {
                var sortedcards = this.getSortedCards(cardsList, type);
                if (view != null && view > -1 && view < 9) {
                    for (var i = 0; i < sortedcards.length; i++) {
                        this.setPokerBack(cc.find('player/handcard', this.head_nodes[view]).children[i], sortedcards[i]);
                    }
                    cc.find('player/type/type', this.head_nodes[view]).getComponent(cc.Sprite).spriteFrame = this.typeSpList[type];
                    cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).on('finished', playFinished, this);
                    cc.find('player', this.head_nodes[view]).getComponent(cc.Animation).play('showcard_other');
                    cc.log('其他人开牌view:' + view, ',userId:' + userId);
                    this.playSound(this.getPlayerById(userId).sex, 1, type);
                }
            }
        }.bind(this);

        cc.find('zi', this.node).getComponent(cc.Animation).off('finished', null);
        cc.find('zi', this.node).getComponent(cc.Animation).on('finished', playFinished, this);
        cc.find('zi/start_bipai', this.node).scaleX = 0;
        cc.find('zi/start_bipai', this.node).scaleY = 0;
        cc.find('zi/start_bipai', this.node).active = true;
        cc.find('zi', this.node).getComponent(cc.Animation).play('start_bipai');
        cc.log('开始比牌...');
        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.OpenCard, false);
    },

    onResult(msg) {
        var winList = [];
        let self = this;
        var list = msg.resultsList;
        this.head_nodes.forEach(head => {
            head.getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).string = '';
            head.getChildByName('win_gold').getChildByName('lose_di').active = false;
            head.getChildByName('win_gold').getChildByName('win_di').active = false;
        });
        var self_wingold = 0;
        var bankerWin = [];
        var bankerLost = [];
        var bankerView = -1;
        for (var i = 0; i < list.length; i++) {
            var view = this.idToView(list[i].userId);
            if (list[i].winGold < 0) {
                this.head_nodes[view].getChildByName('win_gold').getChildByName('lose_di').active = true;
                this.head_nodes[view].getChildByName('win_gold').getChildByName('win_di').active = false;
                this.head_nodes[view].getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).font = this.lose_font;
                this.head_nodes[view].getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(list[i].winGold);
            }
            else {
                this.head_nodes[view].getChildByName('win_gold').getChildByName('lose_di').active = false;
                this.head_nodes[view].getChildByName('win_gold').getChildByName('win_di').active = true;
                this.head_nodes[view].getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).font = this.win_font;
                this.head_nodes[view].getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(list[i].winGold);
            }
            if (this._desk_rule && this._desk_rule.gameType == 2) {
                if (list[i].winGold > 0) {
                    bankerView = view;
                }
                else {
                    bankerWin.push(view);
                }
            }
            else {
                var isBanker = this.getPlayerById(list[i].userId).banker;
                if (!isBanker) {
                    if (list[i].winGold > 0) {
                        bankerLost.push(view);
                    }
                    else {
                        bankerWin.push(view);
                    }
                }
                else {
                    bankerView = view;
                }
            }
        }
        var showCoinFly = function (list1, list2) {
            const totalTime = 1;
            const flyTime = 0.5;
            const coinCount = 20;
            const posOffset = 5;
            const timeOffset = 0.04;
            if (list1.length && list2.length) {
                for (var i = 0; i < list1.length; i++) {
                    var sv = list1[i][0];
                    var tv = list1[i][1];
                    var posStart = self.head_nodes[sv].position;
                    var posTo = self.head_nodes[tv].position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, null);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
                for (var i = 0; i < list2.length; i++) {
                    var sv = list2[i][0];
                    var tv = list2[i][1];
                    var posStart = self.head_nodes[sv].position;
                    var posTo = self.head_nodes[tv].position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = totalTime + 0.1 + (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list2.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else if (list1.length) {
                for (var i = 0; i < list1.length; i++) {
                    var sv = list1[i][0];
                    var tv = list1[i][1];
                    var posStart = self.head_nodes[sv].position;
                    var posTo = self.head_nodes[tv].position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list1.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else if (list2.length) {
                for (var i = 0; i < list2.length; i++) {
                    var sv = list2[i][0];
                    var tv = list2[i][1];
                    var posStart = self.head_nodes[sv].position;
                    var posTo = self.head_nodes[tv].position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list2.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else {
                play2ndAni();
            }
        };
        var playCoinFly = function (event) {
            if (event) {
                event.target.off('finished', playCoinFly);
            }
            var list1 = [], list2 = [];
            for (var i = 0; i < bankerWin.length; i++) {
                var list = [bankerWin[i], bankerView];
                list1.push(list);
            }
            for (var i = 0; i < bankerLost.length; i++) {
                var list = [bankerView, bankerLost[i]];
                list2.push(list);
            }
            showCoinFly(list1, list2);
        };
        var play2ndAni = function (event) {
            if (event) {
                event.target.off('finished', null);
            }
            for (var i = 0; i < self.playingData.playerList.length; i++) {
                var vv = self.idToView(self.playingData.playerList[i].userId);
                self.updatePlayerScore(self.head_nodes[vv], self.playingData.playerList[i]);
            }
            self.node.getChildByName('head_node').getComponent(cc.Animation).play('result');
        };
        playCoinFly();
    },

    getSelf() {
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            if (this.playingData.playerList[i].userId == this.playingData.selfId) {
                return this.playingData.playerList[i];
            }
        }
        return null;
    },

    /**
     * 获取排序后的牌
     * @param {Array<Number>} cards 
     * @param {Number} type
     */
    getSortedCards(cards, type) {
        var getValue = function (card) {
            var value = parseInt(card / 10);
            if (value < 1 || value > 17) {
                cc.log('无效牌:' + card);
                return value;
            }
            else if (value < 11 || value == 17) {
                return value;
            }
            else if (value < 14) {
                return 10;
            }
        };
        var list = [];
        var repeats = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        cards.forEach(element => {
            repeats[Math.floor(element / 10)]++;
        });
        switch (type) {
            case CardType.ColorLine://同花顺
            case CardType.Line://顺子
            case CardType.Color://同花
            case CardType.Silver://银牛
            case CardType.Gold://金牛
            case CardType.Small://五小牛
            case CardType.Niu_0://无牛
                return cards.sort(function (a, b) { return b - a });
                break;
            case CardType.Bomb://炸弹
                var sortlist = cards.sort(function (a, b) { return b - a });
                if (Math.floor(sortlist[0] / 10) == Math.floor(sortlist[1] / 10)) {
                    return sortlist;
                }
                else {
                    return [sortlist[1], sortlist[2], sortlist[3], sortlist[4], sortlist[0]];
                }
                break;
            case CardType.Hulu://葫芦
                var sortlist = cards.sort(function (a, b) { return b - a });
                if (repeats[Math.floor(sortlist[0] / 10)] == 3) {
                    return sortlist;
                }
                else {
                    return [sortlist[2], sortlist[3], sortlist[4], sortlist[0], sortlist[1]];
                }
                break;
            case CardType.Three://三条
                var sortlist = cards.sort(function (a, b) { return b - a });
                if (repeats[Math.floor(sortlist[0] / 10)] == 3) {
                    return sortlist;
                }
                else if (repeats[Math.floor(sortlist[1] / 10)] == 3) {
                    return [sortlist[1], sortlist[2], sortlist[3], sortlist[0], sortlist[4]];
                }
                else {
                    return [sortlist[2], sortlist[3], sortlist[4], sortlist[0], sortlist[1]];
                }
                break;
            case CardType.Niu_10:
            case CardType.Niu_9:
            case CardType.Niu_8:
            case CardType.Niu_7:
            case CardType.Niu_6:
            case CardType.Niu_5:
            case CardType.Niu_4:
            case CardType.Niu_3:
            case CardType.Niu_2:
            case CardType.Niu_1:
                var sortlist = cards.sort(function (a, b) { return b - a });
                for (var i = 0; i < 3; i++) {
                    for (var j = i + 1; j < 4; j++) {
                        for (var k = j + 1; k < 5; k++) {
                            var total = getValue(sortlist[i]) + getValue(sortlist[j]) + getValue(sortlist[k]);
                            if (total % 10 == 0) {
                                list[0] = sortlist[i];
                                list[1] = sortlist[j];
                                list[2] = sortlist[k];
                                var index = 3;
                                for (var l = 0; l < 5; l++) {
                                    if (l == i || l == j || l == k) {
                                        continue;
                                    }
                                    list[index++] = sortlist[l];
                                }
                                return list;
                            }
                        }
                    }
                }
                break;
        }
    },

    getCoin() {
        if (!this.coinPool) {
            this.coinPool = new cc.NodePool('nn_replay_coin');
        }
        var node = this.coinPool.get();
        if (!node) {
            node = cc.instantiate(this.coin_prefab);
            node.name = 'coin_' + (this._coincount ? ++this._coincount : (this._coincount = 1));
        }
        cc.find('coin_node', this.node).addChild(node);
        return node;
    },

    /**
     * 获取抢庄图片
     * @param {Number} bet 
     */
    getBankSpriteFrame(bet) {
        const indexlist = [0, 1, 2, 3, 4];
        var idx = indexlist.indexOf(bet);
        if (idx == -1) {
            return null;
        }
        return this.bankSpList[idx];
    },

    /**
     * 获取倍率图片
     * @param {Number} bet 
     */
    getBetSpriteFrame(bet) {
        const indexlist = [1, 2, 3, 4, 5, 6, 9];
        var idx = indexlist.indexOf(bet);
        if (idx == -1) {
            return null;
        }
        return this.betSpList[idx];
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

    /**
     * 设置牌面
     * @param {cc.Node} node 
     * @param {Number} cardValue 
     * @param {cc.SpriteAtlas} paiAtlas
     */
    setPoker(node, cardValue, paiAtlas) {
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
                node.getChildByName('beimian').active = true;
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
                node.getChildByName('beimian').active = false;
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
                node.getChildByName('beimian').active = false;
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
        // var status = this.playingData.playStatus;
        // switch (status) {
        //     case replayProto.init:

        //         break;
        // }
        cc.find('zi/start_bipai', this.node).active = false;
        for (var i = 0; i < this.playingData.playerList.length; i++) {
            var view = this.idToView(this.playingData.playerList[i].userId);
            this.updatePlayerUI(this.head_nodes[view], this.playingData.playerList[i]);
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
        let self = this;
        switch (id) {
            case proto_id[replayProto.sendcard]://发牌
                this.playingData.playStatus = replayProto.sendcard;
                var sdata = msg.content.cardInfoListList;
                sdata.forEach(element => {
                    var player = self.getPlayerById(element.userId);
                    player.handPoker = element.cardsList;
                });
                break;
            case proto_id[replayProto.banker]://抢庄
                this.playingData.playStatus = replayProto.banker;
                var userId = msg.content.userId;
                var bet = msg.content.bet;
                var player = this.getPlayerById(userId);
                player.callscore = bet;
                break;
            case proto_id[replayProto.bankret]://当庄
                this.playingData.playStatus = replayProto.bankret;
                var bankerId = msg.content.userId;
                this.getPlayerById(bankerId).banker = true;
                for (var i = 0; i < this.playingData.playerList.length; i++) {
                    if (this.playingData.playerList[i].userId != bankerId)
                        this.playingData.playerList[i].callscore = null;
                }
                break;
            case proto_id[replayProto.bet]://下注
                this.playingData.playStatus = replayProto.bet;
                if (msg.content.retCode == 0) {
                    var userId = msg.content.userId;
                    var bet = msg.content.bet;
                    this.getPlayerById(userId).double = bet;
                }
                break;
            case proto_id[replayProto.showcard]://开牌
                this.playingData.playStatus = replayProto.showcard;
                var sdata = msg.content.cardInfoListList;
                sdata.forEach(element => {
                    var player = self.getPlayerById(element.userId);
                    player.handPoker = element.cardsList;
                    player.orderCardsList = element.orderCardsList;
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
        for (var i in replayProto) {
            if (i == 'init')
                filterIds.push(require('c_msg_doudizhu_cmd')[replayProto[i]]);
            else
                filterIds.push(proto_id[replayProto[i]]);
        }
        for (var i = 0; i < msglist.length; i++) {
            if (filterIds.indexOf(msglist[i].id) != -1) {
                //**************************** 发牌消息合并成一个 ********************************/
                if (msglist[i].id == require('c_msg_doudizhu_cmd')[replayProto.init]) {
                    this._showType = msglist[i].content.deskInfo.deskRule.psRule.showType;
                }
                if (msglist[i].id == proto_id[replayProto.sendcard]) {
                    if (this._showType != 2) {
                        if (!sendcardMSG) {
                            sendcardMSG = msglist[i];
                            for (var j = msglist[i].content.cardInfoListList.length - 1; j > -1; j--) {
                                if (msglist[i].content.cardInfoListList[j].cardsList[0] == 0) {
                                    msglist[i].content.cardInfoListList.splice(j, 1);
                                }
                            }
                            list.push(msglist[i]);
                        }
                        else {
                            for (var j = 0; j < msglist[i].content.cardInfoListList.length; j++) {
                                if (msglist[i].content.cardInfoListList[j].cardsList[0] != 0) {
                                    sendcardMSG.content.cardInfoListList.push(msglist[i].content.cardInfoListList[j]);
                                }
                            }
                        }
                    }
                    else {
                        if (!sendcardMSG) {
                            sendcardMSG = msglist[i];
                            list.push(msglist[i]);
                        }
                    }
                }
                else
                    //****************************   end  ********************************/
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
        this._desk_rule = initMsg.deskInfo.deskRule.psRule;
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
            view += this.playingData.playerList.length;
        }
        return view;
    },


    updatePlayerScore(node, data) {
        node.getChildByName('coin').getComponent(cc.Label).string = data.score;
    },

    updatePlayerUI(node, data) {
        node.getChildByName('coin').getComponent(cc.Label).string = data.score;
        node.getChildByName('nickname').getComponent(cc.Label).string = cc.dd.Utils.substr(data.nickName, 0, 4);
        node.getChildByName('bank_di').active = data.banker;
        node.getChildByName('banker').active = data.banker;
        node.getChildByName('banker_ani2').active = false;
        node.getChildByName('bank_ani').active = false;
        //todo:
        var player_node = node.getChildByName('player');
        player_node.getComponent(cc.Animation).stop();
        player_node.getChildByName('qiangzhuang').getComponent(cc.Sprite).spriteFrame = this.getBankSpriteFrame(data.callscore);
        player_node.getChildByName('xiazhu').getComponent(cc.Sprite).spriteFrame = this.getBetSpriteFrame(data.double);
        player_node.getChildByName('type').active = false;
        if (data.cardtype != null) {
            cc.find('type/type', player_node).getComponent(cc.Sprite).spriteFrame = this.typeSpList[data.cardtype];
            player_node.getChildByName('type').active = true;
        }
        if (data.handPoker.length == 0) {
            player_node.getChildByName('handcard').active = false;
        }
        else {
            if (this.playingData.playStatus == replayProto.result || this.playingData.playStatus == replayProto.showcard) {
                var sortedcards = this.getSortedCards(data.handPoker, data.cardtype);
                for (var i = 0; i < sortedcards.length; i++) {
                    this.setPoker(player_node.getChildByName('handcard').children[i], sortedcards[i]);
                }
            } else {
                for (var i = 0; i < data.handPoker.length; i++) {
                    this.setPoker(player_node.getChildByName('handcard').children[i], data.handPoker[i]);
                }
            }
            if (this.idToView(data.userId) == 0) {
                var poker0 = cc.find('handcard/poker_0', player_node);
                var poker1 = cc.find('handcard/poker_1', player_node);
                var poker2 = cc.find('handcard/poker_2', player_node);
                var poker3 = cc.find('handcard/poker_3', player_node);
                var poker4 = cc.find('handcard/poker_4', player_node);
                cc.find('handcard/fanpai_ani', player_node).active = false;
                if (this.playingData.playStatus == replayProto.result || this.playingData.playStatus == replayProto.showcard) {
                    poker0.setPosition(-64, 108);
                    poker0.setScale(0.42, 0.42);
                    poker1.setPosition(-32, 108);
                    poker1.setScale(0.42, 0.42);
                    poker2.setPosition(0, 108);
                    poker2.setScale(0.42, 0.42);
                    poker3.setPosition(32, 108);
                    poker3.setScale(0.42, 0.42);
                    poker4.setPosition(64, 108);
                    poker4.setScale(0.42, 0.42);
                    cc.find('type', player_node).setPosition(99, 75.1);
                    cc.find('type', player_node).setScale(0.6, 0.6);
                }
                else {
                    poker0.setPosition(-228, 0);
                    poker0.setScale(0.64, 0.64);
                    poker1.setPosition(-114, 0);
                    poker1.setScale(0.64, 0.64);
                    poker2.setPosition(0, 0);
                    poker2.setScale(0.64, 0.64);
                    poker3.setPosition(114, 0);
                    poker3.setScale(0.64, 0.64);
                    poker4.setPosition(228, 0);
                    poker4.setScale(0.64, 0.64);
                    cc.find('type', player_node).setPosition(99, -41);
                    cc.find('type', player_node).setScale(1, 1);
                }
            }
            player_node.getChildByName('handcard').active = true;
        }
        if (data.resultScore == null) {
            node.getChildByName('win_gold').active = false;
        }
        else {
            if (data.resultScore < 0) {
                node.getChildByName('win_gold').getChildByName('lose_di').active = true;
                node.getChildByName('win_gold').getChildByName('win_di').active = false;
                node.getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).font = this.lose_font;
                node.getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(data.resultScore);
            }
            else {
                node.getChildByName('win_gold').getChildByName('lose_di').active = false;
                node.getChildByName('win_gold').getChildByName('win_di').active = true;
                node.getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).font = this.win_font;
                node.getChildByName('win_gold').getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(data.resultScore);
            }
            node.getChildByName('win_gold').active = true;
            node.getChildByName('win_gold').y = 72;
            node.getChildByName('win_gold').opacity = 255;
        }
    },

    initPlayerUI(node, data) {
        this.updatePlayerUI(node, data);
        let sp = cc.find('headNode/head', node).getComponent(cc.Sprite);
        cc.dd.SysTools.loadWxheadH5(sp, data.headUrl);
        node.active = true;
    },

    /**
     * 初始化UI脚本
     */
    initUiScript() {
        this.head_nodes.forEach(element => {
            element.active = false;
        });
        for (var i = 0; i < this.originData.playerList.length; i++) {
            var view = this.idToView(this.originData.playerList[i].userId);
            this.initPlayerUI(this.head_nodes[view], this.originData.playerList[i]);
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
});
