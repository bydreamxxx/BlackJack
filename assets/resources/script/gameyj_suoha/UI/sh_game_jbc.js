/**
 * Created by luke on 2018/12/10
 */
let hall_audio_mgr = require('hall_audio_mgr').Instance();
const hall_common_data = require('hall_common_data').HallCommonData;
let SH_ED = require('sh_data').SH_ED;
let SH_Event = require('sh_data').SH_Event;
let sh_Data = require('sh_data').sh_Data;
let sh_send_msg = require('net_sender_suoha');
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let AudioManager = require('AudioManager');
let game_room = require("game_room");
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let jlmj_prefab = require('jlmj_prefab_cfg');
let hall_prop_data = require('hall_prop_data').HallPropData;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
let ChatEd = require('jlmj_chat_data').ChatEd;
let ChatEvent = require('jlmj_chat_data').ChatEvent;
let sh_op = require('sh_op');
let sh_game_head = require('sh_game_head');
let sh_audio_cfg = require('sh_audio_cfg');
const INIT_CHIPNUM = 100;   //初始化筹码数量
const chipList = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const cardPositon = [[54.08, 95.04, 136, 176.96, 217.92], [-165.8, -135, -104.2, -73.4, -42.6], [-165.8, -135, -104.2, -73.4, -42.6], [84.5, 115.3, 146.1, 176.9, 207.7], [84.5, 115.3, 146.1, 176.9, 207.7]];
/**
 * 操作类型
 */
const OP_TYPE = {
    discard: 0x0001,        //弃牌
    pass: 0x0002,           //过
    showhand: 0x0004,       //梭哈
    add: 0x0008,            //加注
    follow: 0x0010,         //跟注
    opencard: 0x0020,       //开牌
    GAME: 0xFFFF,           //游戏操作
    RESULT: 0x0000,         //结算操作
    EXCHANGE: 0xEEEE,       //换桌操作
};

const OP_TIME = 14;

cc.Class({
    extends: cc.Component,

    properties: {
        head_list: [sh_game_head],          //头像
        sh_op: sh_op,                       //op脚本
        chipPrefab: cc.Prefab,              //筹码预制体
        chip_splist: [cc.SpriteFrame],      //筹码sp列表
        result_fonts: [cc.Font],            //结算字体
        new_result_fonts: [cc.Font],        //新结算字体
        type_splist: [cc.SpriteFrame],      //牌类型
        type_splist_gray: [cc.SpriteFrame], //牌类型(灰色)
        pokerAtlas: cc.SpriteAtlas,         //牌图集
        anim_match: { default: null, type: dragonBones.ArmatureDisplay, tooltip: "匹配中动画" },
        seatList: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        ChatEd.addObserver(this);
        SH_ED.addObserver(this);
        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomMgr.Instance().roomType = 2;
        //************************ 筹码对象池 ****************************/
        this._chipPool = new cc.NodePool('chipPool_sh');
        for (var i = 0; i < INIT_CHIPNUM; i++) {
            var node = cc.instantiate(this.chipPrefab);
            this._chipPool.put(node);
        }
        let cardnode = this.head_list[0].node.getChildByName('card');
        for (var i = 0; i < cardnode.children.length; i++) {
            cardnode.children[i].on(cc.Node.EventType.TOUCH_START, this.touchCardStart.bind(this));
            //cardnode.children[i].on(cc.Node.EventType.TOUCH_MOVE, this.touchCardMove.bind(this));
            cardnode.children[i].on(cc.Node.EventType.TOUCH_END, this.touchCardEnd.bind(this));
            cardnode.children[i].on(cc.Node.EventType.TOUCH_CANCEL, this.touchCardCancel.bind(this));
        }
    },

    start() {
        this._fapaiqi = cc.find('fapaiqi', this.node).getComponent('sh_fapaiqi');
    },

    /**
     * 播放匹配动画
    */
    playMatchAnim() {
        if (this.anim_match) {
            this.anim_match.node.active = true;
            this.anim_match.playAnimation('FZZPPZ', -1);
        }
    },

    /**
     * 停止匹配动画
     */
    stopMatchAnim() {
        if (this.anim_match)
            this.anim_match.node.active = false;
        //this.anim_match.stop();
    },

    onDestroy() {
        this._chipPool.clear();
        ChatEd.removeObserver(this);
        SH_ED.removeObserver(this);
        RoomED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        sh_Data.Destroy();
    },

    //事件处理
    onEventMessage(event, data) {
        switch (event) {
            case SH_Event.ROOM_STATE://房间状态改变
                this.onRoomStatus(data);
                break;
            case SH_Event.PLAYER_READY://玩家准备
                break;
            case SH_Event.OVER_TURN://话事
                this.clearScore();
                this.onOverTurn(data);
                break;
            case SH_Event.BET_RAISE://加注
                this.onBetRaise(data);
                break;
            case SH_Event.BET_SHOWHAND://梭哈
                this.onShowHand(data);
                break;
            case SH_Event.BET_DISCARD://弃牌
                this.onDiscard(data);
                break;
            case SH_Event.BET_CALL://跟注
                this.onBetCall(data);
                break;
            case SH_Event.BET_OPENCARD://开牌
                this.onBetOpencard(data);
                break;
            case SH_Event.BET_PASS://过
                this.onPass(data);
                break;
            case SH_Event.DEAL_CARD://发牌
                this.onDealCard(data);
                break;
            case SH_Event.SHOW_CARD://亮牌
                this.onShowCard(data);
                break;
            case SH_Event.RESULT://结算
                this.onResult(data);
                break;
            case SH_Event.RECONNECT://重连
                this.onReconnect(data);
                break;
            case SH_Event.PLAYER_JOIN:
            case SH_Event.PLAYER_EXIT:
                this.playerUpdated();
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                var end_node = cc.find('zhanjitongji', this.node);
                if (end_node && end_node.active == true) {
                    return;
                }
                this.backToHall();
                break;
            case RoomEvent.update_poker_back:
                this.changePokerBack(data);
                break;
            case RoomEvent.on_coin_room_enter:
                this.playMatchAnim();
                break;
            case SH_Event.LOOK_CARD:
                this.onLookCard(data);
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
        }
    },

    //旁观表情
    onChat(data) {
        var sh_chat = this.getComponentInChildren('sh_chat');
        if (sh_chat) {
            if (data.msgtype == 2) {
                var player = sh_Data.Instance().getWatchPlayer(data.sendUserId);
                if (player && !player.isForbidden && !this._watchChatForbidden)
                    sh_chat.showEmoji(player.name, data.id);
            }
        }
    },

    playerUpdated() {
        var players = sh_Data.Instance().getPlayerList();
        if (players && players.length > 1) {
            this.showWaiting(false);
            this.canShowMatching = true;
        }
        else {
            this.showWaiting(true);
            this.canShowMatching = false;
            this.showMatching(false);
        }
    },

    changePokerBack(sprite) {
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].setCardSprite(sprite);
        }
    },

    on_room_replace(msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_POPUP_18;
                    cc.dd.DialogBoxUtil.show(0, str, '确定', null, function () {
                        cc.dd.SceneManager.enterHall();
                    }, function () {
                    });
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_POPUP_19;
                    cc.dd.DialogBoxUtil.show(0, str, '确定', null, function () {
                        cc.dd.SceneManager.enterHall();
                    }, function () {
                    });
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    cc.dd.DialogBoxUtil.show(0, str, '确定', null, function () {
                        cc.dd.SceneManager.enterHall();
                    }, function () {
                    });
                    break;
                default:
                    break;
            }
        }
        else {
            this.resetGameUI();
            for (var i = sh_Data.Instance().playerList.length - 1; i > -1; i--) {
                if (sh_Data.Instance().playerList[i].userId != cc.dd.user.id) {
                    sh_Data.Instance().playerList.splice(i, 1);
                }
            }
            let basescore = sh_Data.Instance().m_nBaseScore;
            let room_str = '底分:' + basescore + '    封顶:' + 0;
            cc.find('info/room', this.node).getComponent(cc.Label).string = room_str;
            cc.find('info/bet', this.node).getComponent(cc.Label).string = '0';
            this.playMatchAnim();
        }
    },

    //加注
    onBetRaise(data) {
        let userId = data.userId;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.hideOp();
        let add = data.add;
        let total = data.total;
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        this.head_list[view].setAllBet(total);
        cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + add.toString();
        cc.find('add', this.node).active = true;
        this.playChips(view, add);
        if (sh_Data.Instance().getMaxCurBetWithout(userId) > 0) {
            this.allStopSay();
            this.head_list[view].say('加注');
            if (sh_Data.Instance().getPlayerById(userId).sex == 1)
                AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Raise, false);
            else
                AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Raise, false);
        }
        else {
            this.allStopSay();
            this.head_list[view].say('下注');
            if (sh_Data.Instance().getPlayerById(userId).sex == 1)
                AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Xiazhu, false);
            else
                AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Xiazhu, false);
        }
        this.updateDeskScore();
    },

    //梭哈
    onShowHand(data) {
        let userId = data.userId;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.hideOp();
        let add = data.add;
        let total = data.total;
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        this.head_list[view].setAllBet(total);
        cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + add.toString();
        cc.find('add', this.node).active = true;
        this.playChips(view, add);
        this.allStopSay();
        this.head_list[view].say('梭哈');
        if (sh_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.ShowHand, false);
        else
            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.ShowHand, false);
        this.updateDeskScore();
    },

    //弃牌
    onDiscard(data) {
        let userId = data.userId;
        cc.find('add', this.node).active = false;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.showOp(OP_TYPE.EXCHANGE);
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        for (var i = 0; i < 5; i++) {
            var node = cc.find('card/card' + i, this.head_list[view].node);
            node.getComponent('sh_card').updateMoveCard();
        }
        this.head_list[view].showDiscard(true);
        this.allStopSay();
        this.head_list[view].say('弃牌');
        if (sh_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Discard, false);
        else
            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Discard, false);
        this.updateDeskScore();
    },

    //跟注
    onBetCall(data) {
        let userId = data.userId;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.hideOp();
        let add = data.add;
        let total = data.total;
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        this.head_list[view].setAllBet(total);
        cc.find('add/num', this.node).getComponent(cc.Label).string = '+' + add.toString();
        cc.find('add', this.node).active = true;
        this.playChips(view, add);
        this.allStopSay();
        this.head_list[view].say('跟');
        if (sh_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Call, false);
        else
            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Call, false);
        this.updateDeskScore();
    },

    //开牌
    onBetOpencard(data) {
        let userId = data.userId;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.hideOp();
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        this.allStopSay();
        this.head_list[view].say('开牌');
        //TODO:气泡&音效
    },

    //过
    onPass(data) {
        let userId = data.userId;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.hideOp();
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        this.allStopSay();
        this.head_list[view].say('过');
        if (sh_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Pass, false);
        else
            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Pass, false);
    },

    //发牌
    onDealCard(msg) {
        const stepTime = 0.2;
        const durTime = 0.5;
        let cardInfoList = msg.cardInfoListList;
        let maxCard = 0;
        for (var i = 0; i < cardInfoList.length; i++) {
            maxCard = cardInfoList[i].cardsList.length > maxCard ? cardInfoList[i].cardsList.length : maxCard;
        }
        if (maxCard == 2) {
            //下底
            AudioManager.getInstance().playSound(sh_audio_cfg.Start, false);
            var bScore = sh_Data.Instance().m_nBaseScore;
            for (var i = 0; i < cardInfoList.length; i++) {
                var player = sh_Data.Instance().getPlayerById(cardInfoList[i].userId);
                var view = sh_Data.Instance().getViewById(cardInfoList[i].userId)
                if (player && !player.isWatch) {
                    player.bready = false;
                    player.allBet = bScore;
                    this.playChips(view, bScore);
                    this.head_list[view].setAllBet(bScore);
                }
            }
            this.updateDeskScore();

            var firstView = sh_Data.Instance().getViewById(cardInfoList[cardInfoList.length - 1].userId);
            cardInfoList.sort((a, b) => {
                let viewa = sh_Data.Instance().getViewById(a.userId) - firstView;
                let viewb = sh_Data.Instance().getViewById(b.userId) - firstView;
                if (viewa < 0) viewa += 5;
                if (viewb < 0) viewb += 5;
                return viewa - viewb;
            });
            for (var i = 0; i < cardInfoList.length; i++) {
                var card = this._fapaiqi.removeCard(1)[0];
                var view = sh_Data.Instance().getViewById(cardInfoList[i].userId);
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
                node0.getComponent('sh_card').sendCard(card, i * stepTime, durTime, toPosition0, toScale, false);//明牌 后面改回来
            }
            for (var i = 0; i < cardInfoList.length; i++) {
                var card = this._fapaiqi.removeCard(1)[0];
                var view = sh_Data.Instance().getViewById(cardInfoList[i].userId);
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
            //let maxView = this.getMaxCardPlayerView(cardInfoList);
            var firstView = sh_Data.Instance().getViewById(cardInfoList[cardInfoList.length - 1].userId);
            cardInfoList.sort((a, b) => {
                let viewa = sh_Data.Instance().getViewById(a.userId) - firstView;
                let viewb = sh_Data.Instance().getViewById(b.userId) - firstView;
                if (viewa < 0) viewa += 5;
                if (viewb < 0) viewb += 5;
                return viewa - viewb;
            });
            for (var i = 0; i < cardInfoList.length; i++) {
                var card = this._fapaiqi.removeCard(1)[0];
                var view = sh_Data.Instance().getViewById(cardInfoList[i].userId);
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

    //获取当前牌型最大的玩家
    getMaxCardPlayerView(cardInfoList) {
        let list = [];
        for (var i = 0; i < cardInfoList.length; i++) {
            var data = { userId: cardInfoList[i].userId, cardsList: [] };
            for (var j = 1; j < cardInfoList[i].cardsList.length - 1; j++) {
                var card = Math.floor(cardInfoList[i].cardsList[j] / 10) == 1 ? 130 + cardInfoList[i].cardsList[j] : cardInfoList[i].cardsList[j];
                data.cardsList.push(card);
            }
            list.push(data);
        }
        let getType = function (cards) {
            let ret = { type: 0, value: 0 };
            switch (cards.length) {
                case 1:
                    ret.type = 1;
                    ret.value = cards[0];
                    break;
                case 2:
                    if (Math.floor(cards[0] / 10) == Math.floor(cards[1] / 10)) {
                        ret.type = 2;
                        ret.value = Math.max(cards);
                    }
                    else {
                        ret.type = 1;
                        ret.value = Math.max(cards);
                    }
                    break;
                case 3:
                    if (Math.floor(cards[0] / 10) == Math.floor(cards[1] / 10) && Math.floor(cards[0] / 10) == Math.floor(cards[2] / 10)) {
                        ret.type = 3;
                        ret.value = Math.max(cards);
                    }
                    else if (Math.floor(cards[0] / 10) == Math.floor(cards[1] / 10) || Math.floor(cards[0] / 10) == Math.floor(cards[2] / 10) || Math.floor(cards[1] / 10) == Math.floor(cards[2] / 10)) {
                        ret.type = 2;
                        if (Math.floor(cards[0] / 10) == Math.floor(cards[1] / 10)) {
                            ret.value = Math.max(cards[0], cards[1]);
                        }
                        else if (Math.floor(cards[0] / 10) == Math.floor(cards[2] / 10)) {
                            ret.value = Math.max(cards[0], cards[2]);
                        }
                        else {
                            ret.value = Math.max(cards[1], cards[2]);
                        }
                    }
                    else {
                        ret.type = 1;
                        ret.value = Math.max(cards);
                    }
                    break;
            }
            return ret;
        };
        for (var i = 0; i < list.length; i++) {
            var ret = getType(list[i].cardsList);
            list[i].type = ret.type;
            list[i].value = ret.value;
        }
        list.sort((a, b) => {
            if (a.type > b.type) return -1;
            else if (a.type < b.type) return 1;
            else return b.value - a.value;
        });
        return sh_Data.Instance().getViewById(list[0].userId);
    },

    //亮牌
    onShowCard(msg) {
        // for (var i = 0; i < 5; i++) {
        //     var player = sh_Data.Instance().getPlayerByViewIdx(i);
        //     if (player && !player.isDiscard) {
        //         var cardnode = cc.find('card', this.head_list[i].node);
        //         for (var j = 0; j < player.cardsList.length; j++) {
        //             this.setPokerBack(cardnode.children[j], player.cardsList[j]);
        //         }
        //         this.head_list[i].showCardType(this.type_splist[player.cardtype - 1])
        //     }
        // }
        let cardInfoListList = msg.cardInfoListList;
        for (var i = 0; i < cardInfoListList.length; i++) {
            var player = sh_Data.Instance().getPlayerById(cardInfoListList[i].userId);
            if (player && !player.isDiscard) {
                var view = sh_Data.Instance().getViewById(cardInfoListList[i].userId);
                var cardnode = cc.find('card', this.head_list[view].node);
                for (var j = 0; j < player.cardsList.length; j++) {
                    this.setPokerBack(cardnode.children[j], player.cardsList[j]);
                }
                if (view == this._winView) {
                    this.head_list[view].showCardType(this.type_splist[player.cardtype - 1]);
                    var winplayer = sh_Data.Instance().getPlayerByViewIdx(view);
                    if (winplayer.cardtype > 0 && winplayer.cardsList.length == 5) {//开了牌
                        cc.find('win/card_di', this.head_list[view].node).active = true;
                        cc.find('win/card_di', this.head_list[view].node).getComponent(sp.Skeleton).clearTracks();
                        cc.find('win/card_di', this.head_list[view].node).getComponent(sp.Skeleton).setAnimation(0, '5', true);
                    }
                }
                else
                    this.head_list[view].showCardType(this.type_splist_gray[player.cardtype - 1]);
            }
        }
    },

    //显示其他玩家看牌
    onLookCard(userId) {
        var view = sh_Data.Instance().getViewById(userId);
        if (view != null && view != 0) {
            var player = sh_Data.Instance().getPlayerByViewIdx(view);
            if (player.isDiscard || sh_Data.Instance().roomStatus > 7)//弃牌玩家不显示
                return;
            var card = cc.find('card/card0', this.head_list[view].node);
            if (card && card.active) {
                card.getComponent('sh_card').showExposeCard();
            }
        }
    },

    //结算
    onResult(msg) {
        cc.find('add', this.node).active = false;
        this._resultMSG = msg;
        var winView = null;//赢家view
        for (var i = 0; i < msg.resultsList.length; i++) {
            var view = sh_Data.Instance().getViewById(msg.resultsList[i].userId);
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
                if (view == 0 && cc.dd.user.id == msg.resultsList[i].userId) {
                    var jiesuan_di = cc.find('jiesuan_di', this.head_list[view].node);
                    if (jiesuan_di) {
                        var tax = 0;
                        if (this._isBscGaming) {
                            tax = 10000;//比赛场房费
                        }
                        else {
                            var shJbcCfgItem = game_room.getItem(function (item) {
                                return item.gameid == cc.dd.Define.GameType.SH_GOLD && item.roomid == sh_Data.Instance().m_nRoomid;
                            });
                            shJbcCfgItem && (tax = shJbcCfgItem.tax);
                        }
                        cc.find('score', jiesuan_di).getComponent(cc.Label).font = msg.resultsList[i].winGold < 0 ? this.new_result_fonts[1] : this.new_result_fonts[0];
                        cc.find('score', jiesuan_di).getComponent(cc.Label).string = '/' + Math.abs(msg.resultsList[i].winGold - tax);
                        cc.find('detail', jiesuan_di).getComponent(cc.Label).string = '奖金 ' + (msg.resultsList[i].winGold < 0 ? '-' : '+') + Math.abs(msg.resultsList[i].winGold) + '       房费 -' + tax;
                    }
                }
            }
        }

        // var winplayer = sh_Data.Instance().getPlayerByViewIdx(winView);
        // if (winplayer.cardtype > 0 && winplayer.cardsList.length == 5) {//开了牌
        //     cc.find('win/card_di', this.head_list[winView].node).active = true;
        //     cc.find('win/card_di', this.head_list[winView].node).getComponent(sp.Skeleton).clearTracks();
        //     cc.find('win/card_di', this.head_list[winView].node).getComponent(sp.Skeleton).setAnimation(0, '5', true);
        // }
        if (winView == null) {
            this.resumeChips([], true);
            this.onResultFinish();
        }
        else {
            cc.find('win', this.head_list[winView].node).active = true;
            const flyTime = 1;
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
        }
    },
    onResultFinish() {
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
        if (this._resultMSG) {
            var msg = this._resultMSG;
            for (var i = 0; i < msg.resultsList.length; i++) {
                var view = sh_Data.Instance().getViewById(msg.resultsList[i].userId);
                if (view != null) {
                    var score = cc.find('score', this.head_list[view].node);
                    if (view == 0 && cc.dd.user.id == msg.resultsList[i].userId) {
                        var jiesuan_di = cc.find('jiesuan_di', this.head_list[view].node);
                        if (jiesuan_di) {
                            jiesuan_di.active = true;
                            score.active = false;
                        }
                        else {
                            score.active = true;
                        }
                    }
                    else {
                        score.active = true;
                        var bsc = this.head_list[view].node.getComponentInChildren('sh_bsc_score');
                        if (bsc) {
                            bsc.setChange(msg.resultsList[i].winGold);
                        }
                    }
                }
            }
            var selfplayer = sh_Data.Instance().getPlayerByViewIdx(0);
            if (selfplayer && !selfplayer.isWatch) {
                this.showMatching(true);
            }
        }
        if (!this._totalResult)
            this.sh_op.showOp(OP_TYPE.RESULT);
    },

    //显示匹配中
    showMatching(isShow) {
        var match = cc.find('matching', this.node);
        if (match) {
            match.active = (isShow && this.canShowMatching);
        }
    },

    showWaiting(isShow) {
        var wait = cc.find('waiting', this.node);
        if (wait) {
            wait.active = isShow;
        }
    },

    //清理上局分数以及匹配动画
    clearScore() {
        for (var i = 0; i < 5; i++) {
            var score = cc.find('score', this.head_list[i].node);
            if (score)
                score.active = false;
            var jiesuan_di = cc.find('jiesuan_di', this.head_list[i].node);
            if (jiesuan_di)
                jiesuan_di.active = false;
            var win = cc.find('win', this.head_list[i].node);
            if (win)
                win.active = false;
            var type = cc.find('type', this.head_list[i].node);
            if (type)
                type.active = false;
        }
        this.showMatching(false);
        this.showWaiting(false);
    },

    //重连
    onReconnect(msg) {
        this.showWait();
        this.showReadys(false);
        this.stopMatchAnim();
        this.updateChips && this.updateChips();
        var configId = sh_Data.Instance().configId;
        if (configId) {
            var shJbcCfgItem = game_room.getItem(function (item) {
                return item.key === configId;
            });
            sh_Data.Instance().setData(shJbcCfgItem);
        }
        this.updateDeskScore();
        let totalBet = sh_Data.Instance().getTotalBet();
        let deskBet = this.getAllChipSum();
        if (deskBet < totalBet) {//补齐筹码
            this.resumeChips(totalBet - deskBet, false);
        }
        else if (deskBet > totalBet) {//清空筹码
            this.resumeChips(totalBet, true);
        }
        let totalCardNum = 0;
        for (var i = 0; i < 5; i++) {
            var player = sh_Data.Instance().getPlayerByViewIdx(i);
            if (player) {
                var cardnode = cc.find('card', this.head_list[i].node);
                totalCardNum += player.cardsList.length;
                for (var j = 0; j < 5; j++) {
                    if (j < player.cardsList.length) {
                        this.setPokerBack(cardnode.children[j], player.cardsList[j]);
                        if (i == 0) {
                            cardnode.children[j].scaleX = 0.64;
                            cardnode.children[j].scaleY = 0.64;
                        }
                        else {
                            cardnode.children[j].scaleX = 0.5;
                            cardnode.children[j].scaleY = 0.5;
                        }
                        cardnode.children[j].rotation = 0;
                        if (i == 1 || i == 2)
                            cardnode.children[j].setPosition(cardPositon[i][5 - player.cardsList.length + j], 0);
                        else
                            cardnode.children[j].setPosition(cardPositon[i][j], 0);
                        cardnode.children[j].active = true;
                    }
                    else {
                        cardnode.children[j].active = false;
                    }
                }
                if (player.isDiscard)//是否弃牌
                    this.head_list[i].showDiscard(true);
                else {
                    this.head_list[i].showDiscard(false);
                    cc.find('beimian', cardnode.children[0]).active = true;
                    for (var j = 1; j < 5; j++) {
                        if (j < player.cardsList.length) {
                            cc.find('beimian', cardnode.children[j]).active = false;
                        }
                    }
                }
                if (player.allBet > 0) {//总下注
                    this.head_list[i].setAllBet(player.allBet);
                    cc.find('bet', this.head_list[i].node).active = true;
                }
                else
                    cc.find('bet', this.head_list[i].node).active = false;
            }
        }
        this._fapaiqi.resumeCard(totalCardNum);//发牌器重置
        var selfplayer = sh_Data.Instance().getPlayerByViewIdx(0);
        if (selfplayer && (selfplayer.isWatch || selfplayer.isDiscard)) {
            this.sh_op.showOp(OP_TYPE.EXCHANGE);
        }
        switch (sh_Data.Instance().roomStatus) {
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                for (var tt = 0; tt < 5; tt++) {
                    if (this.head_list[tt].node)
                        this.head_list[tt].node.getComponentInChildren('sh_timer').setActive(false);
                }
                this.onOverTurn(sh_Data.Instance().curPlayer, msg.leftTime > 0 ? msg.leftTime : null);
                this.showMatching(false);
                this.showWaiting(false);
                this.canShowMatching = true;
                this.clearScore();
                this._resultMSG = null;
                break;
            case 8:
                break;
            case 0:
            case 9:
                this.resetGameUI();
                break;
        }
    },

    //显示等待下局
    showWait() {
        var selfplayer = sh_Data.Instance().getPlayerByViewIdx(0);
        if (!selfplayer) return;
        var self_wait = this.head_list[0].node.getChildByName('wait');
        if (self_wait) {
            self_wait.active = selfplayer.isWatch;
        }
    },

    onGuize(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            cc.find('guize', this.node).active = false;
        }
        else {
            cc.find('guize', this.node).active = true;
        }
    },

    //刷新下注底分信息
    updateDeskScore() {
        let total = sh_Data.Instance().getTotalBet();
        let basescore = sh_Data.Instance().m_nBaseScore;
        let max = sh_Data.Instance().maxBet;
        let room_str = '底分:' + basescore + '    封顶:' + max;
        cc.find('info/room', this.node).getComponent(cc.Label).string = room_str;
        cc.find('info/bet', this.node).getComponent(cc.Label).string = total.toString();
    },

    gameStart() {
        this.stopMatchAnim();
    },

    //状态改变
    onRoomStatus(status) {
        this.gameStart();
        this.updateDeskScore();
        this.updateChips && this.updateChips();
        this.showWait();
        switch (status) {
            case 0://等待
                this.resetGameUI();
                break;
            case 1://准备
                this.resetGameUI();
                this._fapaiqi.resetCards();
                break;
            case 2://下底
                if (sh_Data.Instance().getWatchPlayer(cc.dd.user.id)) {
                    this.resetGameUI();
                    this._fapaiqi.resetCards();
                }
                this.clearScore();
                this.showReadys(false);
                for (var i = 0; i < 5; i++) {
                    var player = sh_Data.Instance().getPlayerByViewIdx(i)
                    if (player) {
                        player.bready = false;
                    }
                }
                // var bScore = sh_Data.Instance().m_nBaseScore;
                // for (var i = 0; i < 5; i++) {
                //     var player = sh_Data.Instance().getPlayerByViewIdx(i)
                //     if (player && !player.isWatch) {
                //         player.bready = false;
                //         player.allBet = bScore;
                //         this.playChips(i, bScore);
                //         this.head_list[i].setAllBet(bScore);
                //     }
                // }
                this.updateDeskScore();
                break;
            case 3://一轮下注
                this.clearScore();
                for (var i = 0; i < 5; i++) {
                    var player = sh_Data.Instance().getPlayerByViewIdx(i)
                    if (player && !player.isWatch) {
                        player.curBet = 0;
                    }
                }
                cc.find('add', this.node).active = false;
                break;
            case 4://二轮下注
                this.clearScore();
                for (var i = 0; i < 5; i++) {
                    var player = sh_Data.Instance().getPlayerByViewIdx(i)
                    if (player && !player.isWatch) {
                        player.curBet = 0;
                    }
                }
                cc.find('add', this.node).active = false;
                break;
            case 5://三轮下注
                this.clearScore();
                for (var i = 0; i < 5; i++) {
                    var player = sh_Data.Instance().getPlayerByViewIdx(i)
                    if (player && !player.isWatch) {
                        player.curBet = 0;
                    }
                }
                cc.find('add', this.node).active = false;
                break;
            case 6://四轮下注
                this.clearScore();
                for (var i = 0; i < 5; i++) {
                    var player = sh_Data.Instance().getPlayerByViewIdx(i)
                    if (player && !player.isWatch) {
                        player.curBet = 0;
                    }
                }
                cc.find('add', this.node).active = false;
                break;
            case 7://开牌
                this.clearScore();
                for (var i = 0; i < 5; i++) {
                    var player = sh_Data.Instance().getPlayerByViewIdx(i)
                    if (player && !player.isWatch) {
                        player.curBet = 0;
                    }
                }
                cc.find('add', this.node).active = false;
                break;
            case 8://结算
                break;
            case 9://重置
                break;
        }
    },

    //清理桌面
    resetGameUI() {
        cc.find('bet_area', this.node).removeAllChildren();
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].resetUI();
        }
        this.updateDeskScore();
        cc.find('add', this.node).active = false;
    },

    //显示准备
    showReadys(show) {
        show = !!show;
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].ready.getComponent(cc.Sprite).enabled = show;
        }
    },

    //该谁说话
    onOverTurn(userId, time) {
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0 && userId == cc.dd.user.id) {//自己
            let optype = 0;
            this.head_list[view].node.getComponentInChildren('sh_timer').play(OP_TIME, null, time);
            let player = sh_Data.Instance().getPlayerById(cc.dd.user.id);
            let limit = sh_Data.Instance().maxBet;
            let max = sh_Data.Instance().getMaxAllBet();
            let curmax = sh_Data.Instance().getMaxCurBet();
            cc.log('当前封顶:' + limit + '   最大下注:' + max + '   当前最大下注' + curmax);
            if (sh_Data.Instance().roomStatus == 7 || player.allBet == limit) {//下注到上限
                optype |= OP_TYPE.opencard;
                optype |= OP_TYPE.discard;
            }
            else {
                if (max < limit) {//可加注
                    optype |= OP_TYPE.discard;
                    if (curmax > 0) {
                        optype |= OP_TYPE.follow;
                    }
                    else {
                        optype |= OP_TYPE.pass;
                    }
                    if (sh_Data.Instance().roomStatus == 5 || sh_Data.Instance().roomStatus == 6)
                        optype |= OP_TYPE.showhand;
                    optype |= OP_TYPE.add;
                    if (sh_Data.Instance().roomStatus == 5 || sh_Data.Instance().roomStatus == 6) {
                        this.node.getComponentInChildren('sh_bet_slider').setData(curmax, 3 * sh_Data.Instance().getBaseScore(), limit - max, sh_Data.Instance().getBaseScore(), 0);
                        this.node.getComponentInChildren('sh_addbet').setData(curmax, limit - max, sh_Data.Instance().getBaseScore());
                    }
                    else {
                        this.node.getComponentInChildren('sh_bet_slider').setData(curmax, sh_Data.Instance().getBaseScore(), limit - max, sh_Data.Instance().getBaseScore(), 1);
                        this.node.getComponentInChildren('sh_addbet').setData(curmax, limit - max, sh_Data.Instance().getBaseScore());
                    }
                }
                else {//不可加注
                    optype |= OP_TYPE.discard;
                    if (sh_Data.Instance().roomStatus == 5 || sh_Data.Instance().roomStatus == 6)
                        optype |= OP_TYPE.showhand;
                    else
                        optype |= OP_TYPE.follow;
                }
            }
            this.sh_op.showOp(OP_TYPE.GAME, optype);
        }
        else {//其他人
            this.head_list[view].node.getComponentInChildren('sh_timer').play(OP_TIME, null, time);
        }
    },

    //获取筹码节点
    getChipNode() {
        let node = this._chipPool.get();
        if (!node) {
            node = cc.instantiate(this.chipPrefab);
        }
        return node;
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
        if (chips.length > 0) {
            if (chips.length > 5)
                AudioManager.getInstance().playSound(sh_audio_cfg.Chip_HE, false);
            else
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
            betArea.addChild(node);
            node.setPosition(endpos);
        }
    },

    //单个筹码飞出
    singleBet(view, value) {
        var betArea = cc.find('bet_area', this.node);
        var startpos = this.head_list[view].node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
        const chipWidth = 34;
        var endpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
        let node = this.getChipNode();
        node.tagname = value;
        let sp = node.getComponent(cc.Sprite);
        sp.enabled = false;
        var idx = chipList.indexOf(value);
        if (idx != -1)
            sp.spriteFrame = this.chip_splist[idx];
        node.getComponent('sh_chip').fly(startpos, endpos, betArea);
    },

    //获取所有筹码总和
    getAllChipSum() {
        let value = 0;
        let betArea = cc.find('bet_area', this.node);
        betArea.children.forEach(chip => {
            value += chip.tagname;
        })
        return value;
    },

    //背面牌
    setPokerBack(node, cardValue) {
        let paiAtlas = this.pokerAtlas;
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

    touchCardStart() {
        if (sh_Data.Instance().getWatchPlayer(cc.dd.user.id))
            return;
        if (sh_Data.Instance().roomStatus > 7 || sh_Data.Instance().getPlayerByViewIdx(0).isDiscard)
            return;
        cc.find('card/card0/beimian', this.head_list[0].node).active = false;
        sh_send_msg.exposeCard();
        //this.unschedule(this.resumeCardBack);
    },
    touchCardEnd() {
        this.resumeCardBack();
        //this.scheduleOnce(this.resumeCardBack, 3);
    },
    touchCardCancel() {
        this.resumeCardBack();
        //this.scheduleOnce(this.resumeCardBack, 3);
    },
    resumeCardBack() {
        if (sh_Data.Instance().roomStatus > 7)
            return;
        cc.find('card/card0/beimian', this.head_list[0].node).active = true;
    },

    //退出
    onExit() {
        hall_audio_mgr.com_btn_click();
        // if (nn_data.Instance().isMatching) {
        //     this.sendLeaveRoom();
        // } else {
        if (sh_Data.Instance().isGaming) {
            var self = sh_Data.Instance().getPlayerById(cc.dd.user.id);
            if (self != null) {
                if (self.isWatch) {
                    this.sendLeaveRoom();
                }
                else if (self.isDiscard) {
                    this.sendLeaveRoom();
                }
                else {
                    cc.dd.DialogBoxUtil.show(0, '主动退出视为弃牌，是否确认退出', '确定', '取消', this.sendLeaveRoom, null, '退出游戏');
                }
            }
            else {
                self = sh_Data.Instance().getWatchPlayer(cc.dd.user.id);
                if (self)
                    cc.log('观战退出');
                this.sendLeaveRoom();
            }
        }
        else if (hall_common_data.getInstance().gameId == 163) {
            this.sendLeaveRoom();
        }
        else {
            this.backToHall();
        }
        //}
    },

    /**
    * 离开房间
    */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '您的金币小于此房间最低金币限制';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '由于长时间未操作，您已离开游戏';
                        break;
                    case 4:
                        str = '当前禁止该游戏，请联系管理员';
                        break;
                }
                var func = function () {
                    this.backToHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                this.backToHall();
            }
        }
    },

    allStopSay() {
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].stopSay();
        }
    },

    backToHall() {
        var AppCfg = require('AppConfig');
        //cc.dd.SceneManager.enterHall();
        var roominfo = sh_Data.Instance().m_coinData;
        cc.dd.SceneManager.enterRoomList(163);
        cc.dd._chooseSeatId = roominfo.roomid;
        cc.dd._chooseGameId = roominfo.gameid;
        // cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {

        //     cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_Seat", function (node) {
        //         let ui = node.getComponent("klb_hall_Seat");
        //         if (ui) {
        //             ui.initBaseInfo(roominfo);

        //             var msg = new cc.pb.game_rule.msg_get_room_desks_req();
        //             var gameInfo = new cc.pb.room_mgr.common_game_header();
        //             gameInfo.setGameType(163);
        //             gameInfo.setRoomId(roominfo.roomid);
        //             msg.setGameInfo(gameInfo);
        //             msg.setIndex(1);
        //             cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req, msg,
        //                 '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);
        //         }
        //     });

        // });
    },
    // update (dt) {},

    //关闭观战列表
    onCloseWatchList() {
        var watchList = cc.find('watch_list', this.node);
        if (watchList) {
            watchList.active = false;
        }
    },

    //打开观战列表
    onOpenWatchList() {
        hall_audio_mgr.com_btn_click();
        var watchList = cc.find('watch_list', this.node);
        if (watchList && !watchList.active) {
            var contentNode = cc.find('ScrollView/view/content', watchList);
            var itemNode = cc.find('watch_player', this.node);
            contentNode.removeAllChildren();
            var playerList = sh_Data.Instance().watchList;
            for (var i = 0; i < playerList.length; i++) {
                var newNode = cc.instantiate(itemNode);
                cc.find('name', newNode).getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(playerList[i].name, 0, 6);
                var sp = cc.find('mask/icon', newNode).getComponent(cc.Sprite);
                cc.dd.SysTools.loadWxheadH5(sp, playerList[i].headUrl);
                if (!this._watchChatForbidden && !playerList[i].isForbidden) {
                    cc.find('chat', newNode).active = true;
                    cc.find('forbidchat', newNode).active = false;
                }
                else {
                    cc.find('chat', newNode).active = false;
                    cc.find('forbidchat', newNode).active = true;
                }
                newNode.tagname = playerList[i].userId;
                newNode.active = true;
                contentNode.addChild(newNode);
            }
            if (!this._watchChatForbidden) {
                cc.find('forbid_all', watchList).active = true;
                cc.find('resume_all', watchList).active = false;
            }
            else {
                cc.find('forbid_all', watchList).active = false;
                cc.find('resume_all', watchList).active = true;
            }
            watchList.active = true;
        }
    },

    //一键屏蔽观战表情
    onClickForbidWholeWatchPlayers(event, custom) {
        hall_audio_mgr.com_btn_click();
        var watchList = cc.find('watch_list', this.node);
        var contentNode = cc.find('watch_list/ScrollView/view/content', this.node);
        if (custom == 'cancel') {
            this._watchChatForbidden = false;
            for (var i = 0; i < contentNode.childrenCount; i++) {
                var item = contentNode.children[i];
                cc.find('chat', item).active = true;
                cc.find('forbidchat', item).active = false;
                var player = sh_Data.Instance().getWatchPlayer(item.tagname);
                player && (player.isForbidden = false);
            }
            cc.find('forbid_all', watchList).active = true;
            cc.find('resume_all', watchList).active = false;
        }
        else {
            this._watchChatForbidden = true;
            for (var i = 0; i < contentNode.childrenCount; i++) {
                var item = contentNode.children[i];
                cc.find('chat', item).active = false;
                cc.find('forbidchat', item).active = true;
                var player = sh_Data.Instance().getWatchPlayer(item.tagname);
                player && (player.isForbidden = true);
            }
            cc.find('forbid_all', watchList).active = false;
            cc.find('resume_all', watchList).active = true;
        }
    },

    //点击屏蔽
    onClickForbiddenChat(event, custom) {
        hall_audio_mgr.com_btn_click();
        var item = event.target.parent;
        if (custom == 'cancel') {
            cc.find('chat', item).active = true;
            cc.find('forbidchat', item).active = false;
            var player = sh_Data.Instance().getWatchPlayer(item.tagname);
            player && (player.isForbidden = false);
            if (this._watchChatForbidden == true) {
                this._watchChatForbidden = false;
                cc.find('forbid_all', watchList).active = true;
                cc.find('resume_all', watchList).active = false;
            }
        }
        else {
            cc.find('chat', item).active = false;
            cc.find('forbidchat', item).active = true;
            var player = sh_Data.Instance().getWatchPlayer(item.tagname);
            player && (player.isForbidden = true);
        }
    },

    onClickSitDown(event, custom) {
        var idx = parseInt(custom);
        var gameid = RoomMgr.Instance().gameId;
        var roomid = sh_Data.Instance().m_nRoomid;
        var deskid = RoomMgr.Instance().deskId;

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(gameid);
        msg.setRoomId(roomid);
        msg.setDeskId(deskid);
        msg.setSeat(idx);
        msg.setLookPlayer(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    update(dt) {
        if (this.seatList.length > 0) {
            if (sh_Data.Instance().getWatchPlayer(cc.dd.user.id)) {
                for (var i = 0; i < this.head_list.length; i++) {
                    this.seatList[i].active = !this.head_list[i].node.active;
                }
            }
            else {
                for (var i = 0; i < this.seatList.length; i++) {
                    if (this.seatList[i].active == true)
                        this.seatList[i].active = false;
                }
            }
        }
    },
});
