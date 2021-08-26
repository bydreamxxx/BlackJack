var py = require('paoyao_util');
var PY_Data = require("paoyao_data").PaoYao_Data;
var py_send_msg = require('py_send_msg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const selectpath = 'gameyi_paoyao/common/sound/select';
var AudioManager = require('AudioManager');
var Define = require("Define");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const selectHeight = 25;        //提起牌高度
const paiBorder = 0;         //牌宽度边距 20.8
const cardWidth = 169;          //牌宽

const HANDNUM = 18;             //手牌数量

//操作类型
const opType = {
    NONE: -1,           //隐藏
    XUE: 0,             //雪
    OUTCARD: 1,         //出牌
    YAOBUQI: 2,         //要不起

};

cc.Class({
    extends: cc.Component,

    properties: {
        hand_node: { type: cc.Node, default: null, tooltip: "手牌父节点" },
        paiPre: { type: cc.Prefab, default: null, tooltip: "手牌预制" },
        touchNode: { type: cc.Node, default: null, tooltip: "触摸节点" },
        opchupai: { type: cc.Node, default: null, tooltip: "出牌提示节点" },
        out_node: { type: cc.Node, default: null, tooltip: "出牌节点" },
        other_node: { type: cc.Node, default: null, tooltip: "队友手牌节点" },
        cards: { default: [], type: cc.Node, tooltip: '王炸' },
    },

    onLoad: function () {
        this.initUiScript();
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
    },

    /**s
     * 初始化UI脚本
     */
    initUiScript: function () {
        if (!this.head)
            this.head = this.node.getComponent('paoyao_headComon');
    },

    /**
    * 初始化玩家信息
    * @param player 玩家信息
    * @param isTurnYao 转幺
    */
    initPlayerInfo: function (player, isTurnYao) {
        this.initUiScript();
        if (this.head)
            this.head.initPlayerInfo(player, isTurnYao);
    },

    //重置UI
    resetUI: function () {
        //清除出牌
        this.clearOutCard();
        this.clearHeadCard();
        this.showNoCard(false);
        this.showOperation(opType.NONE);

        cc.find('op', this.node).active = false;
        cc.find('other_node', this.node).active = false;
        this.touchNode.active = false;
        this.head.Ready(false);
        this.head.JiaBei(false);
        this.head.showYaoCard(0, 0);
        this.head.RefreshRemain(0);
        this.head.showTuoGuan(false);
        this.head.ShowOffline(false);
        this.head.outCardIndex(0);
    },

    //不出
    onPass: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var cards = [];
        cc.log('不出');
        py_send_msg.sendCards(cards);
    },


    //提示
    onTips: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (!py.calCards(PY_Data.getInstance().lastCards, this._handCards)) {//不出
            py_send_msg.sendCards([]);
            return;
        }
        var cards = [];
        if (this.tipIndex == null || this.tipIndex == -1) {
            this.tipArray = py.calCards(PY_Data.getInstance().lastCards, this._handCards);
            this.tipIndex = 0;
            if (this.tipArray) {
                py.getConversionList(this.tipArray[0], cards);
                this.setChooseCards(cards);
            }
        }
        else {
            this.tipIndex = this.tipIndex + 1 >= this.tipArray.length ? 0 : this.tipIndex + 1;
            py.getConversionList(this.tipArray[this.tipIndex], cards);
            this.setChooseCards(cards);
        }
    },

    //出牌
    onSendCard: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
            }
        }
        cc.log('出牌：', selectCards);
        if (py.analysisCards(selectCards).type) {
            py_send_msg.sendCards(selectCards);
        }
    },

    //获取手牌数量
    getHandCardNum: function () {
        return this.remainCard ? this.remainCard : 0;
    },

    /**
     * 玩家头像信息
     */
    Head: function () {
        if (!this.head)
            this.initUiScript();
        return this.head;
    },

    /**
     * 聊天，表情,魔法表情
     */
    showChat: function (data) {
        if (this.head)
            this.head.showChat(data);
    },

    /**
     * 选择雪
     */
    ChooseXueCard: function (time, curtime) {
        this.showOperation(opType.XUE);
        cc.find('op_xue', this.node).getComponentInChildren('py_timer').play(time, null, curtime);
    },

    /**
     * 选择雪事件
     */
    onXueEvent: function (event, data) {
        py_send_msg.sendXue(data == 'xue' ? true : false);
    },

    //发牌显示
    playSendCards: function (cards, time) {
        cc.log("自己发牌：", cards);
        this.touchNode.active = true;
        this.clearHeadCard();
        var duration = time == null ? 1 : time;
        var showCompleted = function () {//发牌动画完成回
            cc.log('发牌回调')
            this.canTouch = true;
            this.clearTouchList();
        }.bind(this);
        cc.find('Canvas/root/sendcard_ani').active = true;
        var ani = cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation);
        this._handCards = py.sortShowCards(cards);
        for (var i = 0; i < this._handCards.length; i++) {
            this.setPoker(ani.node.children[i], this._handCards[i]);
        }
        this.remainCard = this._handCards.length;
        this.refreshCardsNum();
        //this._handCards = py.sortShowCards(cards);
        var showFunc = function () {
            //cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation).off('finished', null, this);
            if (this.soundid) {
                AudioManager.getInstance().stopSound(this.soundid);
                this.soundid = null;
            }
            this.showYaoPoker();
            for (var i = 0; i < this._handCards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                card.name = this._handCards[i].toString();
                card.touched = null;
                card.scaleX = 0.85;
                card.scaleY = 0.85;
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
                    }
                }
                else {
                    card.x = start + i * offset;
                    card.y = 0;
                }
            }
        }.bind(this);

        if (duration > 0) {
            var sortFunc = function () {
                ani.off('finished', null, this);
                for (var i = 0; i < cards.length; i++) {
                    this.setPoker(ani.node.children[i], this._handCards[i]);
                }
                showFunc();
            }.bind(this);

            ani.off('finished', null, this);
            ani.on('finished', sortFunc, this);
            ani.play('sendPoker');
        } else {
            showFunc();
        }
    },

    /**
     * 队友手牌
     */
    othePoker: function (cards) {
        this.clearHeadCard();
        if (!cards) return;
        this._handCards = py.sortShowCards(cards);
        for (var i = 0; i < this._handCards.length; i++) {
            var card = cc.instantiate(this.paiPre);
            card.name = this._handCards[i].toString();
            card.touched = null;
            card.scaleX = 0.85;
            card.scaleY = 0.85;
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
            card.x = start + i * offset;
            card.y = 0;
            this.hand_node.addChild(card);
        }
        this.refreshHandCards(0.2);
        cc.find('other_node', this.node).active = true;
    },

    /**
     * 刷新显示队友手牌
     */
    refrshOthePoker: function (cardlist) {
        if (!this._handCards) return;
        cc.log('队友打牌:' + cardlist);
        for (var i = this._handCards.length - 1; i > -1; i--) {
            if (cardlist.indexOf(this._handCards[i]) != -1) {
                this._handCards.splice(i, 1);
            }
        }

        for (var i = 0; i < cardlist.length; i++) {
            var rNode = cc.find(cardlist[i].toString(), this.hand_node);
            if (rNode) {
                rNode.removeFromParent();
                rNode.destroy();
            }
        }
        this.RefreshhandSort(this._handCards);
        this.refreshHandCards(0.2);
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                this.hand_node.children[i].touched = null;
            }
        }
    },

    /**
     * 你没有牌打过上家
     */
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
     * 显示操作
     */
    showOperation: function (type) {
        var ops = [];
        ops.push(cc.find('op_xue', this.node));
        ops.push(cc.find('op_chupai', this.node));
        ops.push(cc.find('op_yaobuqi', this.node));;
        for (var i = 0; i < ops.length; i++) {
            if (i == type) {
                ops[i].active = true;
            }
            else {
                ops[i].active = false;
                ops[i].getComponentInChildren('py_timer').setActive(false);
            }
        }
    },

    /**
     * 亮牌
     */
    showLangCard: function (cardlist) {
        cc.log('自己亮牌中....');
        if (cardlist && cardlist.length == 0) {
            this.clearHeadCard();
            cc.find('other_node', this.node).active = false;
        } else {
            this.showOperation(opType.NONE);
            this.showNoCard(false);
            cc.find('op', this.node).active = false;
        }
    },

    /**
     * 出牌显示
     */
    showOutCard: function (cardlist, isabnormal) {
        cc.log('自己打牌:' + cardlist, '是否是重连:', isabnormal);
        if (cardlist.length == 0)
            this.clearOutCard();
        this.showOperation(opType.NONE);
        this.showNoCard(false);
        if (cardlist[0] == 0) {
            cc.find('op', this.node).active = false;
            return;
        }

        var ret = py.analysisCards(cardlist);
        var cards = py.sortOutCards(cardlist);
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
            this.clearAllSelectCards();
        } else {
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.7;
            if (!isabnormal) {
                this.remainCard -= cardlist.length;
                this.refreshCardsNum();
            } else {
                if (ret.index == 18 || ret.index == 19) {
                    cc.find('wang_card', this.out_node).active = true;
                    for (var i = 0; i < cards.length; ++i) {
                        this.cards[i].active = true;
                        this.setPoker(this.cards[i], cards[i]);
                    }
                } else {
                    for (var i = 0; i < cards.length; i++) {
                        var card = cc.instantiate(this.paiPre);
                        var offset = (this.hand_node.width + paiBorder - cardWidth) / (24 - 1);
                        this.setPoker(card, cards[i]);
                        card.scaleX = endscale;
                        card.scaleY = endscale;
                        this.out_node.addChild(card);
                        card.setSiblingIndex(i);
                        card.x = (i - Math.floor(cards.length / 2)) * offset * endscale;
                        card.y = 0;
                    }
                }
                return;
            }
            for (var i = this._handCards.length - 1; i > -1; i--) {
                if (cardlist.indexOf(this._handCards[i]) != -1) {
                    this.deleteCards(cardlist, this._handCards[i]);
                    this._handCards.splice(i, 1);
                }
            }


            var midNode = cc.find(cards[Math.floor(cards.length / 2)].toString(), this.hand_node);
            if (!midNode) {
                cc.error('手牌找不到:' + cards[Math.floor(cards.length / 2)].toString());
                return;
            }
            if (ret.index == 18 || ret.index == 19) {
                cc.find('wang_card', this.out_node).active = true;
                for (var i = 0; i < cards.length; ++i) {
                    var rNode = cc.find(cards[i].toString(), this.hand_node);
                    if (!rNode) continue;
                    rNode.removeFromParent();
                    rNode.destroy();
                    this.cards[i].active = true;
                    this.setPoker(this.cards[i], cards[i]);
                }
            } else {
                for (var i = 0; i < cards.length; i++) {
                    var rNode = cc.find(cards[i].toString(), this.hand_node);
                    if (!rNode) continue;
                    rNode.removeFromParent();
                    rNode.destroy();
                    var card = cc.instantiate(this.paiPre);
                    var offset = (this.hand_node.width + paiBorder - cardWidth) / (24 - 1);
                    this.setPoker(card, cards[i]);
                    card.scaleX = scale;
                    card.scaleY = scale;
                    this.out_node.addChild(card);
                    card.setSiblingIndex(i);
                    card.x = (i - Math.floor(cards.length / 2)) * offset * scale;
                    card.y = 0;
                    var moveTo = null;
                    if (cards.length % 2 == 1) {
                        moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(cards.length / 2)) * offset * endscale - card.width / 2 * endscale, 0));
                    }
                    else {
                        moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(cards.length / 2)) * offset * endscale - card.width / 2 * endscale + offset * endscale / 2, 0));
                    }
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                }
            }

            //播放特效
            if (!isabnormal)
                this.playAnimation(ret.type)
            else
                this.showOperation(opType.NONE);

            this.RefreshhandSort(this._handCards);
            this.refreshHandCards(0.2);
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (this.hand_node.children[i].touched == 'touched') {
                    this.hand_node.children[i].touched = null;
                }
            }
        }

        cc.log('自己出牌完成');
    },

    /**
     * 特效
     */
    playAnimation: function (outType) {
        var pos = cc.v2(0, this.out_node.position.y);
        switch (outType) {
            case 3:
                this.head.showSingleSE(pos);
                break;
            case 4:
                this.head.showDoubleSE(pos);
                break;
            case 5:
            case 6:
                this.head.showSmallBomb(pos, 1);
                break;
            case 11:
                this.head.showSmallBomb(pos, 2);
                break;
            case 7:
            case 8:
            case 12:
                this.head.showMediumBomb();
                break;
            case 9:
            case 10:
            case 13:
            case 14:
                this.head.showBigBomb(1);
                break;
        }
    },

    /**
     * 刷新牌组数量
     */
    refreshCardsNum: function () {
        if (!this.head)
            this.initUiScript();
        //this.head.RefreshRemain(this.remainCard); //手牌数量
    },

    /**
     * 刷新手牌排序
     */
    RefreshhandSort: function (cards) {
        this._handCards = py.sortShowCards(cards);
        if (this._handCards.length != this.hand_node.childrenCount)
            return;
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            var handnode = this.hand_node.children[i];
            handnode.name = this._handCards[i].toString();
            this.setPoker(handnode, this._handCards[i]);
        }
    },

    /**
    * 打牌中
    */
    showPlaying: function (time, curtime) {
        cc.log('自己打牌中...');
        cc.find('op', this.node).active = false;
        this.clearOutCard();
        this.tipIndex = -1;//清除提示
        cc.log(PY_Data.getInstance().lastCards);
        if (PY_Data.getInstance().lastCards && PY_Data.getInstance().lastCards.length > 0 && PY_Data.getInstance().lastPlayer != 0) {
            if (py.calCards(PY_Data.getInstance().lastCards, this._handCards)) {
                this.showOperation(opType.OUTCARD);
                cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = true;
                cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = true;
                this.onSelectCardChanged();
                cc.find('op_chupai', this.node).getComponentInChildren('py_timer').play(time, function () {
                }, curtime);
            } else {//没有牌可以大过上家
                this.showOperation(opType.YAOBUQI);
                time = 5;
                cc.find('op_yaobuqi', this.node).getComponentInChildren('py_timer').play(time, function () {
                    if (RoomMgr.Instance().gameId != Define.GameType.PAOYAO_FRIEND)
                        py_send_msg.sendCards([]);
                }.bind(this), curtime);
                if (!cc.find('tuoguan_node', this.node).active) {
                    this.showNoCard(true);
                }
            }
        }
        else {
            this.showOperation(opType.OUTCARD);
            cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = false;
            cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = false;
            this.onSelectCardChanged();
            cc.find('op_chupai', this.node).getComponentInChildren('py_timer').play(time, null, curtime);
        }
    },

    //重置所有提出的手牌
    clearAllSelectCards: function () {
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                this.selectCard(i);
            }
        }
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
        if (this.hand_node.childrenCount > HANDNUM) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (this.hand_node.childrenCount - 1);
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                var move = cc.moveTo(duration, cc.v2(i * offset, 0));
                this.hand_node.children[i].runAction(move);
            }
        }
        else if (this.hand_node.childrenCount > 0) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (HANDNUM - 1);
            var start = (this.hand_node.width + paiBorder - (this.hand_node.childrenCount - 1) * offset - cardWidth) / 2;
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                var move = cc.moveTo(duration, cc.v2(start + i * offset, 0));
                this.hand_node.children[i].runAction(move);
            }
        }
        else {
            return;
        }
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        var headnode = cc.find('Canvas/root');
        headnode.getComponent('py_game_pyc').setPoker(prefab, cardValue);
    },

    /**
     * 显示幺牌
     */
    showYaoPoker: function () {
        var headnode = cc.find('Canvas/root');
        headnode.getComponent('py_game_pyc').chooseYaoEnd();
    },

    //转幺
    refreshDesk: function () {
        var headnode = cc.find('Canvas/root');
        headnode.getComponent('py_game_pyc').RefreshDesk();
    },

    //清除出牌
    clearOutCard: function () {
        for (var i = this.out_node.childrenCount - 1; i > -1; i--) {
            var node = this.out_node.children[i];
            if (node.name == 'wang_card') {
                node.active = false;
                for (var j = 0; j < node.childrenCount; ++j) {
                    var cardnode = node.children[j];
                    cardnode.active = false;
                }
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
            else {
                node.destroy();
            }
        }
        //this.out_node.removeAllChildren(true);
    },

    //清除手牌
    clearHeadCard: function () {
        for (var i = this.hand_node.childrenCount - 1; i > -1; i--) {
            var node = this.hand_node.children[i];
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
            else {
                node.destroy();
            }
        }
        cc.find('op', this.node).active = false;
    },

    /**
     * 玩家离开房间
     */
    RefreshPlayerExit: function () {
        if (this.head)
            this.head.showUI(false);
    },

    onDestroy: function () {
        // if (this.head)
        //     this.head.onDestroy();
    },

    //清空当前touch列表
    clearTouchList: function () {
        this.touchList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.touch_start_node = null;
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
            //AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHOUPAI, false);
            this.onSelectCardChanged();
        }
    },

    //选牌变化
    onSelectCardChanged: function () {
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
                AudioManager.getInstance().playSound(selectpath, false);
            }
        }

        if (py.compareCards(PY_Data.getInstance().lastCards, selectCards)) {
            cc.find('op_chupai/send', this.node).getComponent(cc.Button).interactable = true;
        }
        else {
            cc.find('op_chupai/send', this.node).getComponent(cc.Button).interactable = false;
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

    /**
     * 删除选牌列表
     */
    deleteCards: function (cards, num) {
        for (var i = 0; i < cards.length; ++i) {
            if (cards[i] == num) {
                cards.splice(i, 1);
                return;
            }
        }
    },

    /**
    * 选定牌
    */
    setChooseCards: function (cards) {
        var type = py.analysisCards(cards).type;
        if (type >= 11) {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (cards.indexOf(parseInt(this.hand_node.children[i].name)) != -1) {
                    this.deleteCards(cards, this.hand_node.children[i].name);
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
        } else {
            for (var i = this.hand_node.childrenCount - 1; i >= 0; i--) {
                if (cards.indexOf(parseInt(this.hand_node.children[i].name)) != -1) {
                    this.deleteCards(cards, this.hand_node.children[i].name);
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

        }
    },

    touchStart: function (event) {
        this.clearTouchList();
        cc.log('点击牌面：', this.canTouch)
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
            if (!py.analysisCards(selectCards).type) {
                if (this.start_touch_none) {
                    this.setChooseCards(selectCards);
                }
            }
        }
    },

});