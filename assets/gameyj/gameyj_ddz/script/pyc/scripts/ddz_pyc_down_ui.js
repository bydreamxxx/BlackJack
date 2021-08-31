var ddz = require('ddz_util');
var ddz_send_msg = require('ddz_send_msg');
const DDZ_Data = require('ddz_data').DDZ_Data;
const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('ddz_audio_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const selectHeight = 25;        //提起牌高度
const paiBorder = 0;         //牌宽度边距 20.8
const cardWidth = 169;          //牌宽

const HANDNUM = 17;             //手牌数量

//操作类型
const opType = {
    NONE: -1,           //隐藏
    CALLSCORE: 0,       //叫分
    DOUBLE: 1,          //加倍
    OUTCARD: 2,         //出牌
    YAOBUQI: 3,         //要不起
    HUANSANZHANG: 4,    //换三张
    FENLUO: 5,          //分摞发牌
};

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

cc.Class({
    extends: cc.Component,

    properties: {
        headnode: { type: cc.Node, default: null, tooltip: "head节点" },
        headsp: { type: cc.Sprite, default: null, tooltip: "头像" },
        namelbl: { type: cc.Label, default: null, tooltip: "昵称" },
        goldlbl: { type: cc.Label, default: null, tooltip: "金币" },
        hand_node: { type: cc.Node, default: null, tooltip: "手牌父节点" },
        out_node: { type: cc.Node, default: null, tooltip: "出牌节点" },
        paiPre: { type: cc.Prefab, default: null, tooltip: "手牌预制" },
        touchNode: { type: cc.Node, default: null, tooltip: "触摸节点" },
        emoji_node: { type: cc.Node, default: null, tooltip: "表情节点" },
        topcard_node: { type: cc.Node, default: null, },
        top1_node: { type: cc.Node, default: null, },
        top2_node: { type: cc.Node, default: null, },
        shunzi_node: { type: cc.Node, default: null, },
        liandui_node: { type: cc.Node, default: null, },
        tongtianshun_node: { type: cc.Node, default: null, },
        speSpList: { type: cc.SpriteFrame, default: [], tooltip: '底牌翻倍图片列表' },
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音
    },

    // use this for initialization
    onLoad: function () {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));

        //通天顺
        this.tongtianshun_node.active = true;
        this.tongtianshun_node.active = false;
        this.tongtianshun_ani = this.tongtianshun_node.getComponent(dragonBones.ArmatureDisplay);
        this.tongtianshun_ani.addEventListener(dragonBones.EventObject.COMPLETE, function (event) {
            if (event.detail.animationState.name === "TTS") {
                this.tongtianshun_node.active = false;
            }
        }, this);
    },

    onDestroy: function () {

    },

    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this), duration * 1000);
    },


    touchStart: function (event) {
        this.clearTouchList();
        if (!this.canTouch) {
            return;
        }
        this.start_touch_none = true;
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                this.start_touch_none = false;
                break;
            }
        }
        this.touch_start_node = this.getTouchCard(event);
        if (this.touch_start_node != null) {
            this.selectCard(this.touch_start_node);
            this.touchList[this.touch_start_node] = 1;
        }
    },

    touchMove: function (event) {
        if (!this.canTouch) {
            return;
        }
        if (this.touch_start_node != null) {
            var cur_node = this.getTouchCard(event);
            if (cur_node != null) {
                this.selectLine(this.touch_start_node, cur_node);
            }
        }
    },

    touchEnd: function (event) {
        if (!this.canTouch) {
            return;
        }
        if (this.touch_start_node != null) {
            var selectCards = [];
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (this.hand_node.children[i].touched == 'touched') {
                    selectCards.push(parseInt(this.hand_node.children[i].name));
                }
            }
            if (!ddz.analysisCards(selectCards).type) {
                if (this.start_touch_none) {
                    var shunzi = this.getShunZi(selectCards);
                    if (shunzi) {
                        this.setChooseCards(shunzi);
                    }
                }
            }
        }
    },


    getShunZi: function (cards) {
        var sz_list = [];
        var counts = ddz.countRepeatCards(cards);
        var cardlist = ddz.kindSortCards(cards);
        for (var i = 3; i < 15; i++) {
            if (counts[i] > 0) {
                var flag = true;
                for (var j = 1; j < 5; j++) {
                    if (counts[i + j] == 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    var k = i + 5;
                    for (; k < 15; k++) {
                        if (counts[k] == 0) {
                            break;
                        }
                    }
                    --k;
                    var doubleflag = true;
                    for (var start = i; start < k + 1; start++) {
                        if (counts[start] < 2) {
                            doubleflag = false;
                            break;
                        }
                    }
                    if (doubleflag) {
                        for (var start = i; start < k + 1; start++) {
                            var len = cardlist[start].length;
                            sz_list.push(cardlist[start][len - 1], cardlist[start][len - 2]);
                        }
                        return sz_list;
                    }
                    else {
                        for (var start = i; start < k + 1; start++) {
                            var len = cardlist[start].length;
                            sz_list.push(cardlist[start][len - 1]);
                        }
                        return sz_list;
                    }
                }
            }
        }
        for (var i = 3; i < 15; i++) {
            if (counts[i] > 1) {
                if (counts[i + 1] > 1 && counts[i + 2] > 1) {
                    for (var index = i; index < i + 3; index++) {
                        var len = cardlist[index].length;
                        sz_list.push(cardlist[index][len - 1], cardlist[index][len - 2]);
                    }
                    if (counts[i + 3] > 1) {//最多只可能有四对  不用循环
                        var lens = cardlist[i + 3].length;
                        sz_list.push(cardlist[i + 3][lens - 1], cardlist[i + 3][lens - 2]);
                    }
                    return sz_list;
                }
            }
        }
        return null;
    },


    //初始化玩家信息
    initPlayerInfo: function (player) {
        player.name = ddz.filterEmoji(player.name);
        this.namelbl.string = cc.dd.Utils.substr(player.name, 0, 6);
        this.goldlbl.string = cc.dd.Utils.getNumToWordTransform(player.score);
        this.initHead(player.openId, player.headUrl);
        this.showReady(player.isReady == 1);
        cc.find('vip_head/level', this.headnode).getComponent(cc.Label).string = player.vipLevel.toString();
        cc.find('vip_head', this.headnode).active = player.vipLevel > 0;
        this.showUI(true);
    },


    initHead: function (openId, headUrl) {
        this.openId = openId;
        //if (headUrl && headUrl != '') {
        cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        // }
    },

    //显示player 节点
    showUI: function (bool) {
        if (bool) {
            this.node.active = true;
            this.headnode.getComponent(cc.Animation).play();
        }
        else {
            this.node.active = false;
        }
    },

    //显示准备
    showReady: function (bool) {
        bool = bool ? true : false;
        cc.find('ready', this.headnode).active = bool;
    },

    /**
     * 刷新手牌
     * 计算手牌长宽和位置
     */
    refreshHandCards: function (time) {
        var duration = time == null ? 0 : time;
        if (duration > 0) {
            this.canTouch = false;
            this.scheduleOnce(function () {
                this.canTouch = true;
            }.bind(this), duration);
        }
        if (this.hand_node.childrenCount > 17) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (this.hand_node.childrenCount - 1);
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                // this.hand_node.children[i].x = i * offset;
                // this.hand_node.children[i].y = 0;
                var move = cc.moveTo(duration, cc.v2(i * offset, 0));
                this.hand_node.children[i].stopAllActions();
                this.hand_node.children[i].runAction(move);
            }
        }
        else if (this.hand_node.childrenCount > 0) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
            var start = (this.hand_node.width + paiBorder - (this.hand_node.childrenCount - 1) * offset - cardWidth) / 2;
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                // this.hand_node.children[i].x = start + i * offset;
                // this.hand_node.children[i].y = 0;
                var move = cc.moveTo(duration, cc.v2(start + i * offset, 0));
                this.hand_node.children[i].stopAllActions();
                this.hand_node.children[i].runAction(move);
            }
        }
        else {
            return;
        }
    },

    //清除手牌
    clearHandCards: function () {
        for (var i = this.hand_node.childrenCount - 1; i > -1; i--) {
            var node = this.hand_node.children[i];
            if (node.getChildByName('touch') != null) {
                node.removeFromParent();
                node.destroy();
            }
            else {
                node.destroy();
            }
        }
        //this.hand_node.removeAllChildren(true);
    },

    /**
     * 发牌显示
     */
    playSendCards: function (cards, time, exchange) {
        var duration = time == null ? 1 : time;
        this.remainCard = cards.length;
        var showCompleted = function () {//发牌动画完成回调
            this.canTouch = true;
            this.clearTouchList();
        }.bind(this);
        this.clearHandCards();
        this._handCards = ddz.sortShowCards(cards);
        var showFunc = function () {
            cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation).off('finished', null, this);
            if (this.soundid) {
                AudioManager.getInstance().stopSound(AudioManager.getAudioID(this.soundid));
                this.soundid = null;
            }
            if (!exchange) {
                cc.find('Canvas/root/top/dipai_info').active = true;
                cc.find('Canvas/root/top/dipai_info').getComponent(cc.Animation).play();
            }
            for (var i = 0; i < this._handCards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                card.name = this._handCards[i].toString();
                card.touched = null;
                card.scaleX = 1;
                card.scaleY = 1;
                var width = card.width;
                var offset = 0;
                var start = 0;
                if (this._handCards.length < HANDNUM) {
                    offset = (this.hand_node.width + paiBorder - width) / (HANDNUM - 1);
                    start = (this.hand_node.width + paiBorder - (this._handCards.length - 1) * offset - width) / 2;
                }
                else {
                    offset = (this.hand_node.width + paiBorder - width) / (this._handCards.length - 1);
                    start = 0;
                }
                this.setPoker(card, this._handCards[i]);
                this.hand_node.addChild(card);
                if (i == this._handCards.length - 1) {
                    if (time == 0) {
                        var hide = function () {
                            var ani = cc.find('Canvas/root/sendcard_ani');
                            for (var i = 0; i < ani.children.length; i++) {
                                ani.children[i].active = false;
                            }
                        }
                        card.x = start + i * offset;
                        card.y = 0;
                        showCompleted();
                        this.refreshHandCards();
                        var ani = cc.find('Canvas/root/sendcard_ani');
                        for (var j = 0; j < ani.children.length; j++) {
                            ani.children[j].active = false;
                        }
                        hide();
                        //var seq = cc.sequence(cc.moveTo(0, cc.v2(start + i * offset, 0)), cc.callFunc(showCompleted), cc.callFunc(this.refreshHandCards, this, 0));
                    }
                    else {
                        var hide = function () {
                            var ani = cc.find('Canvas/root/sendcard_ani');
                            for (var i = 0; i < ani.children.length; i++) {
                                ani.children[i].active = false;
                            }
                        }
                        card.x = start + i * offset;
                        card.y = 0;
                        showCompleted();
                        hide();
                        //var seq = cc.sequence(cc.moveTo(0, cc.v2(start + i * offset, 0)), cc.callFunc(showCompleted), cc.callFunc(hide));
                    }
                }
                else {
                    card.x = start + i * offset;
                    card.y = 0;
                    //var seq = cc.moveTo(0, cc.v2(start + i * offset, 0));
                }
                //card.runAction(seq);
            }
        }.bind(this);
        if (duration > 0) {
            var sortcards = ddz.sortShowCards(cards);
            var ani = cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation);
            for (var i = 0; i < cards.length; i++) {
                this.setPoker(ani.node.children[i], cards[i]);
            }
            var sortFunc = function () {
                ani.off('finished', null, this);
                for (var i = 0; i < cards.length; i++) {
                    this.setPoker(ani.node.children[i], sortcards[i]);
                }
                ani.on('finished', showFunc, this);
                ani.play('sendcard_ani2');
            }.bind(this);
            ani.off('finished', null, this);
            ani.on('finished', sortFunc, this);
            ani.play('sendcard_ani');
            cc.find('Canvas/root/top/dipai_info').active = false;
            // cc.find('Canvas/deal_card').active = true;
            // cc.find('Canvas/deal_card').getComponent(cc.Animation).on('finished', showFunc, this);
            this.soundid = ddz_audio_cfg.EFFECT.DEAL_CARD
            AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.DEAL_CARD, true);
            // cc.find('Canvas/deal_card').getComponent(cc.Animation).play();
        }
        else {
            showFunc();
        }
    },

    //显示分摞发牌
    showFenluo(time) {
        this.showOperation(opType.FENLUO);
        cc.find('op_fenluo', this.node).getComponentInChildren('ddz_timer').play(time, null, null);
        var fenluo = cc.find('fenluo', this.node.parent);
        for (var i = 0; i < fenluo.childrenCount; i++) {
            if (fenluo.children[i].tagname == 'free') {
                fenluo.children[i].getComponent(cc.Button).interactable = true;
                fenluo.children[i].getChildByName('jiantou').active = true;
                fenluo.children[i].getChildByName('jiantou').getComponent(cc.Animation).play();
            }
        }
    },
    hideFenluo() {
        this.showOperation(opType.NONE);
        var fenluo = cc.find('fenluo', this.node.parent);
        for (var i = 0; i < fenluo.childrenCount; i++) {
            fenluo.children[i].getComponent(cc.Button).interactable = false;
            fenluo.children[i].getChildByName('jiantou').getComponent(cc.Animation).stop();
            fenluo.children[i].getChildByName('jiantou').active = false;
        }
    },

    /**
     * 叫分操作显示
     */
    showCallScoreOp: function (time, maxScore, curtime, joker2) {
        this.showOperation(opType.CALLSCORE);
        var buttons = [];
        cc.find('op_jiaofen/zero', this.node).getComponent(cc.Button).interactable = true;
        buttons.push(cc.find('op_jiaofen/one', this.node).getComponent(cc.Button));
        buttons.push(cc.find('op_jiaofen/two', this.node).getComponent(cc.Button));
        buttons.push(cc.find('op_jiaofen/three', this.node).getComponent(cc.Button));
        for (var i = 0; i < buttons.length; i++) {
            if (i < maxScore) {
                buttons[i].interactable = false;
            }
            else {
                buttons[i].interactable = true;
            }
        }
        if (joker2) {
            var cards = this._handCards;
            var counts = ddz.countRepeatCards(cards);
            if (counts[16] == 4 || counts[17] == 2) {
                cc.find('op_jiaofen/zero', this.node).getComponent(cc.Button).interactable = false;
                buttons[0].interactable = false;
                buttons[1].interactable = false;
            }
        }
        cc.find('op_jiaofen', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
    },
    hideCallScoreOp: function () {
        this.showOperation(opType.NONE);
    },

    //叫分返回
    callScoreRet: function (score, splist) {
        // var str = '';
        // switch (score) {
        //     case 0:
        //         str = '不 叫';
        //         break;
        //     case 1:
        //         str = '1 分';
        //         break;
        //     case 2:
        //         str = '2 分';
        //         break;
        //     case 3:
        //         str = '3 分';
        //         break;
        // }
        // cc.find('callscore/lbl', this.headnode).getComponent(cc.Label).string = str;
        cc.find('callscore', this.headnode).getComponent(cc.Sprite).spriteFrame = splist[score];
        cc.find('callscore', this.headnode).active = true;
    },

    onExchangeRet(cards, isReconnect) {
        for (var i = this._handCards.length - 1; i > -1; i--) {
            if (cards.indexOf(this._handCards[i]) != -1) {
                this._handCards.splice(i, 1);
            }
        }
        this.showOperation(opType.NONE);
        var ex_down = cc.find('exchange/card/down', this.node.parent);
        for (var i = 0; i < cards.length; i++) {
            var rmNode = cc.find(cards[i].toString(), this.hand_node);
            if (rmNode) {
                rmNode.removeFromParent();
                rmNode.destroy();
            }
            this.setPoker(ex_down.children[i], cards[i]);
        }
        this.refreshHandCards(0.2);
        ex_down.active = true;
        if (!isReconnect) {
            this.remainCard -= 3;
        }
    },

    /**
     * 显示操作
     */
    showOperation: function (type) {
        var ops = [];
        ops.push(cc.find('op_jiaofen', this.node));
        ops.push(cc.find('op_jiabei', this.node));
        ops.push(cc.find('op_chupai', this.node));
        ops.push(cc.find('op_yaobuqi', this.node));
        ops.push(cc.find('op_huansanzhang', this.node));
        ops.push(cc.find('op_fenluo', this.node));
        for (var i = 0; i < ops.length; i++) {
            if (i == type) {
                ops[i].active = true;
            }
            else {
                ops[i].active = false;
                ops[i].getComponentInChildren('ddz_timer').setActive(false);
            }
        }
    },

    exchangeCardsInsert(cardlist) {
        var cards = ddz.sortShowCards(cardlist);
        for (var i = 0; i < cards.length; i++) {
            this._handCards.push(cards[i]);
        }
        this._handCards = ddz.sortShowCards(this._handCards);
        var width = cardWidth;
        var offset = (this.hand_node.width + paiBorder - width) / (this.hand_node.childrenCount + cards.length - 1);
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            var value = parseInt(this.hand_node.children[i].name);
            var index = this._handCards.indexOf(value);
            this.hand_node.children[i].x = index * offset;
            this.hand_node.children[i].y = 0;
            this.hand_node.children[i].touched = null;
        }
        for (var i = 0; i < cards.length; i++) {
            var card = cc.instantiate(this.paiPre);
            card.name = cards[i].toString();
            card.touched = null;
            card.scaleX = 1;
            card.scaleY = 1;
            this.setPoker(card, cards[i]);
            var index = this._handCards.indexOf(cards[i]);
            this.hand_node.addChild(card);
            card.setSiblingIndex(index);
            card.x = index * offset;
            card.y = this.hand_node.children[0].height;
            card.runAction(cc.moveBy(0.5, cc.v2(0, -this.hand_node.children[0].height)));
        }
    },

    /**
     * 底牌动画
     */
    showBottomCard: function (cardlist) {
        this.remainCard += cardlist.length;
        var cards = ddz.sortShowCards(cardlist);

        for (var i = 0; i < cards.length; i++) {
            this.setPoker(cc.find('top/dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
        }

        var width = cardWidth;
        var offset = (this.hand_node.width + paiBorder - width) / (this.hand_node.childrenCount + cards.length - 1);
        for (var i = 0; i < cards.length; i++) {
            this._handCards.push(cards[i]);
        }
        this._handCards = ddz.sortShowCards(this._handCards);

        // var tarpos = [];
        // var cardpos = [];
        // for (var i = 0; i < cardlist.length; i++) {
        //     tarpos[i] = this.hand_node.convertToWorldSpace(cc.v2(this._handCards.indexOf(cardlist[i]) * offset, this.hand_node.children[0].height));
        //     cardpos[i] = cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].convertToWorldSpace(cc.v2(0, 0));
        // }

        var downCard = function () {
            cc.find('top/dipai_info', this.node.parent).getComponent(cc.Animation).off('finished', downCard, this);
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                var value = parseInt(this.hand_node.children[i].name);
                var index = this._handCards.indexOf(value);
                this.hand_node.children[i].x = index * offset;
                this.hand_node.children[i].y = 0;
                this.hand_node.children[i].touched = null;
            }
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                card.name = cards[i].toString();
                card.touched = null;
                card.scaleX = 1;
                card.scaleY = 1;
                this.setPoker(card, cards[i]);
                var index = this._handCards.indexOf(cards[i]);
                this.hand_node.addChild(card);
                card.setSiblingIndex(index);
                card.x = index * offset;
                card.y = this.hand_node.children[0].height;
                card.runAction(cc.moveBy(0.5, cc.v2(0, -this.hand_node.children[0].height)));
            }
            // for (var i = 0; i < cardlist.length; i++) {
            //     cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].scaleX = 0;
            //     cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].scaleY = 0;
            // }
            cc.find('lord', this.hand_node.children[this.hand_node.childrenCount - 1]).active = true;
        }.bind(this);

        cc.find('top/dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).play('dipai_rotate');
        this.scheduleOnce(function () {
            cc.find('top/dipai_info', this.node.parent).getComponent(cc.Animation).on('finished', downCard, this);
            cc.find('top/dipai_info', this.node.parent).getComponent(cc.Animation).play('dipai_ani_jbc_0');
            this.calSpecialBottom(cardlist);
            for (var i = 0; i < cards.length; i++) {
                //cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent).scale = 0;
                this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
            }
        }.bind(this), 1);

        // for (var i = 0; i < cardlist.length; i++) {
        //     if (i == cardlist.length - 1) {
        //         var action = cc.moveBy(0.5, tarpos[i].sub(cardpos[i]));
        //         var finish = cc.callFunc(downCard);
        //         var seq = cc.sequence(action, finish);
        //         cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].runAction(seq);
        //     }
        //     else {
        //         var action = cc.moveBy(1, tarpos[i].sub(cardpos[i]));
        //         cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].runAction(action);
        //     }
        // }


    },
    calSpecialBottom: function (cardlist) {
        if (RoomMgr.Instance()._Rule.bottomPokerDouble != true) {
            return;
        }
        if (ddz.analysisCards(cardlist).type == 3) {//三条
            cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.SANTIAO];
            cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '6倍';
            cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
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
            cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.SHUANGWANG];
            cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '12倍';
            cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            return;
        }
        else if (bJ) {
            if (dui) {
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.DAWANG];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '4倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
            else {
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.DAWANG];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '2倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
            return;
        }
        else if (sJ) {
            if (dui) {
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.XIAOWANG];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '4倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
            else {
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.XIAOWANG];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '2倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
            return;
        }
        else {
            if (dui) {
                // cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.DUIZI];
                // cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '2倍';
                // cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
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
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.TONGHUASHUN];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '9倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
            else {
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.SHUNZI];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '3倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
        }
        else {
            if (tonghua) {
                cc.find('top/dipai_info/beilv/layout/spe/icon', this.node.parent).getComponent(cc.Sprite).spriteFrame = this.speSpList[speBottomCard.TONGHUA];
                cc.find('top/dipai_info/beilv/layout/spe/lbl', this.node.parent).getComponent(cc.Label).string = '6倍';
                cc.find('top/dipai_info/beilv/layout/spe', this.node.parent).active = true;
            }
        }
    },

    //显示加倍
    showDouble: function (time, curtime) {
        //加倍
        this.showOperation(opType.DOUBLE);
        cc.find('op_jiabei', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
    },

    //显示换三张
    showChangeCard: function (time) {
        this.onSelectCardChanged();
        this.showOperation(opType.HUANSANZHANG);
        cc.find('op_huansanzhang', this.node).getComponentInChildren('ddz_timer').play(time, null, null);
    },

    /**
     * 打牌中
     */
    showPlaying: function (time, curtime) {
        cc.log('自己打牌中...');
        cc.find('op', this.node).active = false;
        this.clearOutCard();
        this.tipIndex = -1;//清除提示
        cc.log(DDZ_Data.Instance().lastCards);
        if (DDZ_Data.Instance().lastCards && DDZ_Data.Instance().lastCards.length > 0 && DDZ_Data.Instance().lastPlayer != 0) {
            if (ddz.calCards(DDZ_Data.Instance().lastCards, this._handCards)) {
                this.showOperation(opType.OUTCARD);
                cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = true;
                cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = true;
                this.onSelectCardChanged();
                cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
            }
            else {//没有牌可以大过上家
                this.showOperation(opType.YAOBUQI);
                time = 5;
                cc.find('op_yaobuqi', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
                if (!cc.find('tuoguan_node', this.node).active) {
                    //cc.find('nocard', this.node).getComponent(cc.Animation).play();
                    this.showNoCard(true);
                    //this.scheduleOnce(function () { ddz_send_msg.sendCards([]) }, 1);
                }
            }
        }
        else {
            this.showOperation(opType.OUTCARD);
            cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = false;
            cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = false;
            this.onSelectCardChanged();
            cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
        }
    },

    showNoCard: function (flag) {
        var node = cc.find('nocard', this.node);
        if (flag == true) {
            if (node.active == false) {
                node.opacity = 0;
                node.active = true;
                node.getComponent(cc.Animation).play();
            }
        }
        else {
            if (node.active == true) {
                node.active = false;
            }
        }
    },

    /**
     * 出牌显示
     */
    showOutCard: function (cardlist, isLord) {
        cc.log('自己打牌:' + cardlist);
        this.showOperation(opType.NONE);
        this.showNoCard(false);
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
            this.clearAllSelectCards();
        }
        else {
            this.remainCard -= cardlist.length;
            for (var i = this._handCards.length - 1; i > -1; i--) {
                if (cardlist.indexOf(this._handCards[i]) != -1) {
                    this._handCards.splice(i, 1);
                }
            }
            var cards = ddz.sortOutCards(cardlist);
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.7;
            var midNode = cc.find(cards[Math.floor(cards.length / 2)].toString(), this.hand_node);
            if (!midNode) {
                cc.error('手牌找不到:' + cards[Math.floor(cards.length / 2)].toString());
                return;
            }
            var midX = midNode.x;

            var tp = ddz.analysisCards(cards).type;
            if (tp == 1 && cards[0] == 172) {//
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TOPCARD, false);
                for (var i = 0; i < cards.length; i++) {
                    var rmNode = cc.find(cards[i].toString(), this.hand_node);
                    rmNode.removeFromParent();
                    rmNode.destroy();
                }
                var node = this.top1_node;
                this.setPoker(node.getChildByName('ddz_poker_0'), cards[0]);
                if (isLord) {
                    node.getChildByName('ddz_poker_0').getChildByName('lord').active = true;
                }
                else {
                    node.getChildByName('ddz_poker_0').getChildByName('lord').active = false;
                }
                node.active = true;
                var playFire = function () {
                    node.getComponent(cc.Animation).off('finished', playFire);
                    var pos = cc.v2(640, 226);
                    var top1 = this.topcard_node;
                    top1.getComponent(sp.Skeleton).enabled = true;
                    top1.getComponent(sp.Skeleton).clearTrack(0);
                    top1.getComponent(sp.Skeleton).setAnimation(0, 'dingpai1', false);
                    top1.x = pos.x;
                    top1.y = pos.y;
                }.bind(this);
                node.getComponent(cc.Animation).on('finished', playFire);
                node.getComponent(cc.Animation).play();
            }
            else if (tp == 2 && ddz.analysisCards(cards).index == 16) {//
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TOPCARD, false);
                for (var i = 0; i < cards.length; i++) {
                    var rmvNode = cc.find(cards[i].toString(), this.hand_node);
                    rmvNode.removeFromParent();
                    rmvNode.destroy();
                }
                var node = this.top2_node;
                this.setPoker(node.getChildByName('ddz_poker_0'), cards[0]);
                this.setPoker(node.getChildByName('ddz_poker_1'), cards[1]);
                if (isLord) {
                    node.getChildByName('ddz_poker_1').getChildByName('lord').active = true;
                }
                else {
                    node.getChildByName('ddz_poker_1').getChildByName('lord').active = false;
                }
                node.active = true;
                var playFire = function () {
                    node.getComponent(cc.Animation).off('finished', playFire);
                    var pos = cc.v2(640, 226);
                    var top1 = this.topcard_node;
                    top1.getComponent(sp.Skeleton).enabled = true;
                    top1.getComponent(sp.Skeleton).clearTrack(0);
                    top1.getComponent(sp.Skeleton).setAnimation(0, 'dingpai1', false);
                    top1.x = pos.x;
                    top1.y = pos.y;
                }.bind(this);
                node.getComponent(cc.Animation).on('finished', playFire);
                node.getComponent(cc.Animation).play();
            }
            else {
                if (cardlist.length < 3) {
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHUPAI, false);
                }
                else {
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHUPAIDA, false);
                }
                for (var i = 0; i < cards.length; i++) {
                    var rNode = cc.find(cards[i].toString(), this.hand_node);
                    rNode.removeFromParent();
                    rNode.destroy();
                    //cc.find(cards[i].toString(), this.hand_node).removeFromParent(true);
                    var card = cc.instantiate(this.paiPre);
                    var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
                    this.setPoker(card, cards[i]);
                    if (isLord && i == cards.length - 1) {
                        cc.find('lord', card).active = true;
                    }
                    card.scaleX = scale;
                    card.scaleY = scale;
                    this.out_node.addChild(card);
                    card.setSiblingIndex(i);
                    card.x = (i - Math.floor(cards.length / 2)) * offset * scale + midX;
                    card.y = 0;
                    if (cards.length % 2 == 1) {
                        var moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale, this.out_node.height));
                    }
                    else {
                        var moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2, this.out_node.height));
                    }
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                    //card.runAction(scaleTo);
                }
            }
            this.refreshHandCards(0.2);

            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (this.hand_node.children[i].touched == 'touched') {
                    this.hand_node.children[i].touched = null;
                }
            }

            // this.clearAllSelectCards();
            // this.scheduleOnce(function () {
            //     this.refreshHandCards(0.2);
            // }.bind(this), 0.1);


            if (isLord && this.hand_node.childrenCount > 0) {
                cc.find('lord', this.hand_node.children[this.hand_node.childrenCount - 1]).active = true;
            }

            var type = ddz.analysisCards(cards).type;
            switch (type) {
                case 5://顺子
                    var tongtianshun = false;
                    cards.forEach(function (card) {
                        if (parseInt(card / 10) == 14) {
                            tongtianshun = true;
                        }
                    });
                    var posX = - this.out_node.x - card.width / 2 * endscale;
                    // if (cards.length % 2 == 1) {
                    //     posX = - this.out_node.x - card.width / 2 * endscale;
                    // }
                    // else {
                    //     posX = - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2;
                    // }

                    if (tongtianshun) {
                        this.tongtianshun_node.active = true;
                        this.tongtianshun_node.x = posX + 40;
                        this.tongtianshun_node.y = this.out_node.height + 40;
                        this.tongtianshun_ani.playAnimation('TTS', 1);
                        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TONGTIANSHUN, false);
                    } else {
                        var node = this.shunzi_node;
                        node.getComponent(sp.Skeleton).enabled = true;
                        node.getComponent(sp.Skeleton).clearTrack(0);
                        node.getComponent(sp.Skeleton).setAnimation(0, 'shunzi', false);
                        node.x = posX;
                        node.y = this.out_node.height + 40;
                        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                    }
                    // this.scheduleOnce(function () {
                    //     var count = this.out_node.childrenCount;
                    //     var mid = this.out_node.children[Math.floor(count / 2)];
                    //     cc.find('Canvas/root').getComponent('ddz_game').playShunziAnimation(mid);
                    // }.bind(this), duration);
                    break;
                case 6://连对
                    //cc.find('liandui', this.out_node).getComponent(cc.Animation).play();
                    var posX = - this.out_node.x - card.width / 2 * endscale;
                    // if (cards.length % 2 == 1) {
                    //     posX = - this.out_node.x - card.width / 2 * endscale;
                    // }
                    // else {
                    //     posX = - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2;
                    // }
                    //cc.find('Canvas/root').getComponent('ddz_game').playLianduiAnimation(this.out_node, cc.v2(posX, this.out_node.height));

                    var node = this.liandui_node;
                    node.getComponent(sp.Skeleton).enabled = true;
                    node.getComponent(sp.Skeleton).clearTrack(0);
                    node.getComponent(sp.Skeleton).setAnimation(0, 'liandui', false);
                    node.x = posX + 50;
                    node.y = this.out_node.height + 40;
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                    // this.scheduleOnce(function () {
                    //     var count = this.out_node.childrenCount;
                    //     var mid = this.out_node.children[Math.floor(count / 2)];
                    //     cc.find('Canvas/root').getComponent('ddz_game').playLianduiAnimation(mid);
                    //     //cc.find('shunzi', this.out_node).getComponent(cc.Animation).play();
                    // }.bind(this), duration);
                    break;
                case 7://飞机不带
                case 8://飞机
                    cc.find('Canvas/root').getComponent('ddz_game_pyc').playAirplaneAnimation();
                    break;
                case 10://炸弹
                    cc.find('Canvas/root').getComponent('ddz_game_pyc').playBombAnimation('zhu');
                    break;
                case 11://火箭
                    cc.find('Canvas/root').getComponent('ddz_game_pyc').playRocketAnimation('1');
                    break;
                default:
                    break;
            }
        }
    },
    displayOutCard: function (cardlist, isLord) {
        this.clearOutCard();
        var endscale = 0.7;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var cards = ddz.sortOutCards(cardlist);
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
                this.setPoker(card, cards[i]);
                if (isLord) {
                    cc.find('lord', card).active = true;
                }
                this.out_node.addChild(card);
                card.setSiblingIndex(i);
                card.scaleX = endscale;
                card.scaleY = endscale;
                if (cards.length % 2 == 1) {
                    card.x = (i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale;
                }
                else {
                    card.x = (i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2;
                }
                card.y = this.out_node.height;
            }
        }
    },

    //获取手牌数量
    getHandCardNum: function () {
        return this.remainCard;
    },

    //单局结算
    showResult: function (msg, isLord) {
        this.canTouch = false;
        var changeList = msg.changeListList.sort(function (a, b) { return DDZ_Data.Instance().idToView(a.userId) - DDZ_Data.Instance().idToView(b.userId) });
        this.playResultAni(changeList, isLord);
    },

    /**
     * 结算动画
     */
    playResultAni: function (list, isLord) {
        // if (isLord) {
        //     if (list[0].changeScore > 0) {//地主胜利
        //         cc.find('Canvas/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('jieguo_dzsl');
        //     }
        //     else {//地主失败
        //         cc.find('Canvas/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('jieguo_ddsb');
        //     }
        // }
        // else {
        //     if (list[0].changeScore > 0) {//农民胜利
        //         cc.find('Canvas/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('jieguo_nmsl');
        //     }
        //     else {//农民失败
        //         cc.find('Canvas/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('jieguo_nmsb');
        //     }
        // }
        for (var i = 0; i < list.length; i++) {
            if (list[i].changeScore > 0) {
                //cc.find('Canvas/result_ani/score' + i.toString()).getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('win_di');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('add');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score/lbl').getComponent(cc.Label).font = this.win_font;
            }
            else {
                //cc.find('Canvas/result_ani/score' + i.toString()).getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('lose_di');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('sub');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score/lbl').getComponent(cc.Label).font = this.lose_font;
            }
            cc.find('Canvas/root/result_ani/score' + i.toString() + '/score/lbl').getComponent(cc.Label).string = Math.abs(list[i].changeScore).toString();
        }
        var node = cc.find('Canvas/root/result_ani');
        node.active = true;
        // node.getComponent(cc.Animation).on('finished', function () {
        //     node.active = false;
        // });
        node.getComponent(cc.Animation).play();
    },

    /**
     * 显示托管
     */
    showAuto: function (isAuto) {
        var bool = isAuto || false;
        cc.find('tuoguan_node', this.node).active = bool;
        cc.find('tuoguan', this.headnode).active = bool;
    },

    /**
     * 显示倍率
     */
    showBeilv: function (data) {
        if (data) {
            if (data.total != null) {
                cc.find('top/dipai_info/beilv/layout/num', this.node.parent).getComponent(cc.Label).string = '/' + data.total.toString();// + '倍';
            }
            // if (data.jiaofen != null) {
            //     cc.find('beilv/detail/jiaofen/bei', this.node).getComponent(cc.Label).string = data.jiaofen > 0 ? 'x' + data.jiaofen.toString() : '-';
            // }
            // if (data.dipai != null) {
            //     cc.find('beilv/detail/dipai/bei', this.node).getComponent(cc.Label).string = data.dipai > 0 ? 'x' + data.dipai.toString() : '-';
            // }
            // if (data.jiabei != null) {
            //     cc.find('beilv/detail/jiabei/bei', this.node).getComponent(cc.Label).string = data.jiabei > 0 ? 'x' + data.jiabei.toString() : '-';
            // }
            // if (data.zhadan != null) {
            //     cc.find('beilv/detail/zhadan/bei', this.node).getComponent(cc.Label).string = data.zhadan > 0 ? 'x' + data.zhadan.toString() : '-';
            // }
            // if (data.chuntian != null) {
            //     cc.find('beilv/detail/chuntian/bei', this.node).getComponent(cc.Label).string = data.chuntian > 0 ? 'x' + data.chuntian.toString() : '-';
            // }
        }
        else {
            cc.find('top/dipai_info/beilv/layout/num', this.node.parent).getComponent(cc.Label).string = '';
            // cc.find('beilv/detail/jiaofen/bei', this.node).getComponent(cc.Label).string = '-';
            // cc.find('beilv/detail/dipai/bei', this.node).getComponent(cc.Label).string = '-';
            // cc.find('beilv/detail/jiabei/bei', this.node).getComponent(cc.Label).string = '-';
            // cc.find('beilv/detail/zhadan/bei', this.node).getComponent(cc.Label).string = '-';
            // cc.find('beilv/detail/chuntian/bei', this.node).getComponent(cc.Label).string = '-';
        }
    },

    //离线
    showOffline: function (isOffline) {
        cc.find('offline', this.headnode).active = isOffline;
    },

    /**
     * 播放表情
     */
    showEmoji: function (id) {
        this.emoji_node.active = true;
        this.emoji_node.getComponent(cc.Animation).play("em" + (id - 1));
        this.scheduleOnce(function () {
            this.emoji_node.active = false;
        }.bind(this), 3);
    },

    /**
     * 播放短语
     */
    showChat: function (str) {
        var chat_node = cc.find('chat', this.headnode);
        var lbl = chat_node.getChildByName('lbl');
        lbl.getComponent(cc.Label).string = str;
        chat_node.width = lbl.width + 30;
        chat_node.getComponent(cc.Animation).play();
    },

    /**
    * 选定牌
    */
    setChooseCards: function (cards) {
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (cards.indexOf(parseInt(this.hand_node.children[i].name)) != -1) {
                if (this.hand_node.children[i].touched != 'touched') {
                    this.selectCard(i);
                }
            }
            else {
                if (this.hand_node.children[i].touched == 'touched') {
                    this.selectCard(i);
                }
            }
        }
    },

    /**
     * 选择单张牌 在提起和放下状态之间切换
     */
    selectCard: function (index) {
        var duration = 0.1; //动画时长
        if (this.hand_node.childrenCount > index) {
            if (this.hand_node.children[index].touched == 'touched') {
                var down = cc.moveTo(duration, cc.v2(this.hand_node.children[index].x, 0));
                this.hand_node.children[index].stopAllActions();
                this.hand_node.children[index].runAction(down);
                this.hand_node.children[index].touched = null;
            }
            else {
                var up = cc.moveTo(duration, cc.v2(this.hand_node.children[index].x, selectHeight));
                this.hand_node.children[index].stopAllActions();
                this.hand_node.children[index].runAction(up);
                this.hand_node.children[index].touched = 'touched';
            }
            AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHOUPAI, false);
            this.onSelectCardChanged();
        }
    },

    //touchMove时候 多选牌
    selectLine: function (start, end) {
        if (start > end) {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (i >= end && i <= start) {
                    if (!this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 1;
                    }
                }
                else {
                    if (this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 0;
                    }
                }
            }
        }
        else if (start < end) {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (i >= start && i <= end) {
                    if (!this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 1;
                    }
                }
                else {
                    if (this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 0;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (i != start) {
                    if (this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 0;
                    }
                }
            }
        }
    },

    //选牌变化
    onSelectCardChanged: function () {
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
            }
        }
        //换三张
        if (selectCards.length == 3) {
            cc.find('op_huansanzhang/send', this.node).getComponent(cc.Button).interactable = true;
        }
        else {
            cc.find('op_huansanzhang/send', this.node).getComponent(cc.Button).interactable = false;
        }
        //出牌
        var forbid = !DDZ_Data.Instance().deskInfo.deskRule.canDaiExtra2;
        if (ddz.compareCards(DDZ_Data.Instance().lastCards, selectCards, forbid)) {
            cc.find('op_chupai/send', this.node).getComponent(cc.Button).interactable = true;
        }
        else {
            cc.find('op_chupai/send', this.node).getComponent(cc.Button).interactable = false;
        }
    },

    //清空当前touch列表
    clearTouchList: function () {
        this.touchList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.touch_start_node = null;
    },

    //重置所有提出的手牌
    clearAllSelectCards: function () {
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                this.selectCard(i);
            }
        }
    },

    //清除出牌
    clearOutCard: function () {
        for (var i = this.out_node.childrenCount - 1; i > -1; i--) {
            var node = this.out_node.children[i];
            if (node.name == 'top_card_ani1') {
                node.active = false;
            }
            else if (node.name == 'top_card_ani2') {
                node.active = false;
            }
            else if (node.name == 'top_card1') {
                node.getComponent(sp.Skeleton).enabled = false;
            }
            else if (node.name == 'shunzi_ani') {
                node.getComponent(sp.Skeleton).enabled = false;
            }
            else if (node.name == 'liandui_ani') {
                node.getComponent(sp.Skeleton).enabled = false;
            }
            else if (node.getChildByName('touch') != null) {
                node.removeFromParent();
                node.destroy();
            }
            else if (node.name == 'tongtianshun_ani') {
                node.active = false;
            }
            else {
                node.destroy();
            }
        }
        //this.out_node.removeAllChildren(true);
    },

    //touch事件是否在牌上
    getTouchCard: function (event) {
        for (var i = this.hand_node.childrenCount - 1; i > -1; i--) {
            if (this.isTouch(event, cc.find('touch', this.hand_node.children[i]))) {
                return i;
            }
        }
        return null;
    },
    isTouch: function (event, node) {
        if (node.getBoundingBoxToWorld().contains(event.touch.getLocation())) {
            return true;
        }
        return false;
    },

    //发送托管
    sendTuoGuan: function () {
        ddz_send_msg.tuoGuan(true);
    },

    //重置UI
    resetUI: function () {
        this.showNoCard(false);
        this.clearOutCard();
        this.clearHandCards();
        cc.find('Canvas/root/top/dipai_info').active = false;
        this.showBeilv();
        cc.find('op', this.node).active = false;
        cc.find('jiabei', this.headnode).active = false;
        cc.find('lord', this.headnode).active = false;
        cc.find('callscore', this.headnode).active = false;
        cc.find('double', this.headnode).active = false;
        cc.find('weak', this.headnode).active = false;
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('ddz_game_pyc').setDipai(prefab, cardValue);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        this.node.parent.getComponent('ddz_game_pyc').setPoker(prefab, cardValue);
    },

    ///////////////////////////////////////////// 按钮点击 start //////////////////////////////////////////
    //双击背景
    bgClick: function (event, data) {
        // var time = new Date().getTime();
        // if (this.lastBgClickTime && time - this.lastBgClickTime < 500) {
        //     this.lastBgClickTime = null;
        //     this.clearAllSelectCards();
        // }
        // else {
        //     this.lastBgClickTime = time;
        // }
        this.clearAllSelectCards();
        DDZ_ED.notifyEvent(DDZ_Event.BG_CLICK, null);
    },

    //叫分
    onCallScore: function (event, data) {
        var score = parseInt(data);
        ddz_send_msg.callScore(score);
    },

    onCallDouble: function (event, data) {
        if (data == 'true') {
            ddz_send_msg.callDouble(true);
        }
        else {
            ddz_send_msg.callDouble(false);
        }
    },

    //换三张
    onExchange(event, data) {
        if (data == 'send') {
            var selectCards = [];
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (this.hand_node.children[i].touched == 'touched') {
                    selectCards.push(parseInt(this.hand_node.children[i].name));
                }
            }
            ddz_send_msg.sendExchange(selectCards);
        }
        else {
            var array = [];
            for (var i = 1; i < 4; i++) {
                array.push(this._handCards[this._handCards.length - i]);
            }
            this.setChooseCards(array);
        }
    },

    //不出
    onPass: function (event, data) {
        var cards = [];
        ddz_send_msg.sendCards(cards);
    },

    //提示
    onTips: function (event, data) {
        if (!ddz.calCards(DDZ_Data.Instance().lastCards, this._handCards)) {//不出
            ddz_send_msg.sendCards([]);
            return;
        }
        if (this.tipIndex == null || this.tipIndex == -1) {
            this.tipArray = ddz.calCards(DDZ_Data.Instance().lastCards, this._handCards);
            this.tipIndex = 0;
            this.setChooseCards(this.tipArray[0]);
        }
        else {
            this.tipIndex = this.tipIndex + 1 >= this.tipArray.length ? 0 : this.tipIndex + 1;
            this.setChooseCards(this.tipArray[this.tipIndex]);
        }
    },

    //出牌
    onSendCard: function (event, data) {
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
            }
        }
        if (ddz.analysisCards(selectCards).type) {
            ddz_send_msg.sendCards(selectCards);
        }
    },

    //取消托管
    onCancelAuto: function (event, data) {
        ddz_send_msg.tuoGuan(false);
    },

    //倍率提示
    onBeiLvTip: function (event, data) {
        var detail_node = cc.find('beilv/detail', this.node);
        if (detail_node.active) {
            detail_node.active = false;
        }
        else {
            detail_node.active = true;
        }
    },
    ///////////////////////////////////////////// 按钮点击 end //////////////////////////////////////////
});
