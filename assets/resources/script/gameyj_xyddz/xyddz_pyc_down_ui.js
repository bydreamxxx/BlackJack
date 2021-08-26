var ddz = require('ddz_util');
var ddz_send_msg = require('ddz_send_msg');
const DDZ_Data = require('ddz_data').DDZ_Data;
const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('xyddz_audio_cfg');
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
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音
    },

    // use this for initialization
    onLoad: function () {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
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
        this.namelbl.string = cc.dd.Utils.substr(player.name, 0, 4);
        this.goldlbl.string = cc.dd.Utils.getNumToWordTransform(player.score);
        this.initHead(player.openId, player.headUrl);
        this.showReady(player.isReady == 1);
        cc.find('vip_head/level', this.headnode).getComponent(cc.Label).string = player.vipLevel.toString();
        cc.find('vip_head', this.headnode).active = player.vipLevel > 0;
        this.showUI(true);
    },


    initHead: function (openId, headUrl) {
        this.openId = openId;
        if (headUrl && headUrl != '') {
            cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        }
    },

    //显示player 节点
    showUI: function (bool) {
        if (bool) {
            this.node.active = true;
            this.headnode.active = true;
        }
        else {
            this.node.active = false;
            this.headnode.active = false;
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
            cc.find('Canvas/root').getComponent('xyddz_pyc').refreshJipaiqi();
        }.bind(this);
        this.clearHandCards();
        this._handCards = ddz.sortShowCards(cards);
        var showFunc = function () {
            cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation).off('finished', null, this);
            if (this.soundid) {
                AudioManager.getInstance().stopSound(this.soundid);
                this.soundid = null;
            }
            this.clearHandCards();
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
            var self = this;
            var sortcards = ddz.sortShowCards(cards);
            var ani = cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation);
            var xipai = cc.find('Canvas/root/sendcard_ani/xipai').getComponent(sp.Skeleton);
            xipai.node.active = true;
            xipai.setCompleteListener((trackEntry, loopCount) => {
                for (var i = 0; i < cards.length; i++) {
                    self.setPoker(ani.node.children[i], sortcards[i]);
                }
                ani.on('finished', showFunc, self);
                ani.play('sendcard');
            });
            xipai.enabled = true;
            xipai.setAnimation(0, 'play', false);
            this.soundid = AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.DEAL_CARD, false);
        }
        else {
            showFunc();
        }
    },

    /**
     * 叫分操作显示
     */
    showCallScoreOp: function (time, maxScore, curtime, joker2) {
        this.showOperation(opType.CALLSCORE);
        var buttons = [];
        cc.find('op_jiaofen/zero', this.node).active = true;
        buttons.push(cc.find('op_jiaofen/one', this.node).getComponent(cc.Button));
        buttons.push(cc.find('op_jiaofen/two', this.node).getComponent(cc.Button));
        buttons.push(cc.find('op_jiaofen/three', this.node).getComponent(cc.Button));
        for (var i = 0; i < buttons.length; i++) {
            if (i < maxScore) {
                buttons[i].node.active = false;
            }
            else {
                buttons[i].node.active = true;
            }
        }
        if (joker2) {
            var cards = this._handCards;
            var counts = ddz.countRepeatCards(cards);
            if (counts[16] == 4 || counts[17] == 2) {
                cc.find('op_jiaofen/zero', this.node).active = false;
                buttons[0].node.active = false;
                buttons[1].node.active = false;
            }
        }
        this.node.getComponentInChildren('ddz_timer').play(time, null, curtime);
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
        for (var i = 0; i < ops.length; i++) {
            if (i == type) {
                ops[i].active = true;
            }
            else {
                ops[i].active = false;
            }
        }
        if (type == -1) {
            this.node.getComponentInChildren('ddz_timer').setActive(false);
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
                card.y = 0;
            }
            // for (var i = 0; i < cardlist.length; i++) {
            //     cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].scaleX = 0;
            //     cc.find('top/dipai_info/bottomcard_ani', this.node.parent).children[i].scaleY = 0;
            // }
            cc.find('lord', this.hand_node.children[this.hand_node.childrenCount - 1]).active = true;
        }.bind(this);

        for (var i = 0; i < cards.length; i++) {
            //cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent).scale = 0;
            this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
        }
        downCard();
        cc.find('top/dipai_info', this.node.parent).getComponent(cc.Animation).play('dipai_ani');
    },

    //显示加倍
    showDouble: function (time, curtime) {
        //加倍
        this.showOperation(opType.DOUBLE);
        this.node.getComponentInChildren('ddz_timer').play(time, null, curtime);
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
                this.node.getComponentInChildren('ddz_timer').play(time, null, curtime);
            }
            else {//没有牌可以大过上家
                this.showOperation(opType.YAOBUQI);
                time = 5;
                this.node.getComponentInChildren('ddz_timer').play(time, null, curtime);
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
            this.node.getComponentInChildren('ddz_timer').play(time, null, curtime);
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
            var chupai_ani = cc.find('chupai_ani', this.out_node.parent).getComponent(sp.Skeleton);
            chupai_ani.enabled = true;
            chupai_ani.setAnimation(0, 'play', false);
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
                    cc.find('Canvas/root').getComponent('xyddz_pyc').playShunziAnimation();
                    break;
                case 6://连对
                    cc.find('Canvas/root').getComponent('xyddz_pyc').playLianduiAnimation();
                    break;
                case 7://飞机不带
                case 8://飞机
                    cc.find('Canvas/root').getComponent('xyddz_pyc').playAirplaneAnimation();
                    break;
                case 10://炸弹
                    cc.find('Canvas/root').getComponent('xyddz_pyc').playBombAnimation();
                    break;
                case 11://火箭
                    cc.find('Canvas/root').getComponent('xyddz_pyc').playRocketAnimation();
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
                cc.find('top/round_info/beishu', this.node.parent).getComponent(cc.Label).string = data.total.toString();
            }
        }
        else {
            cc.find('top/round_info/beishu', this.node.parent).getComponent(cc.Label).string = '';
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
        //出牌
        var forbid = !true;
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
            node.removeFromParent();
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
        this.node.parent.getComponent('xyddz_pyc').setDipai(prefab, cardValue);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        this.node.parent.getComponent('xyddz_pyc').setPoker(prefab, cardValue);
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
