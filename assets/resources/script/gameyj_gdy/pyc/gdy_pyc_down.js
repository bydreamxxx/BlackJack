var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var gdyData = require('gdy_game_data').GDY_Data;
const selectpath = 'gameyj_ddz/common/audio/Send_CARD';
var AudioManager = require('AudioManager');
var gdyUtil = require('gdy_util');
var gdy_send_msg = require('gdy_send_msg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var Define = require("Define");

const selectHeight = 25;        //提起牌高度
const paiBorder = 0;         //牌宽度边距 20.8
const cardWidth = 169;          //牌宽
const HANDNUM = 17;             //手牌数量
//操作类型
const opType = {
    NONE: -1,           //隐藏
    OUTCARD: 0,         //出牌
    YAOBUQI: 1,         //要不起

};

cc.Class({
    extends: cc.Component,
    properties: {
        hand_node: { type: cc.Node, default: null, tooltip: "手牌父节点" },
        paiPre: { type: cc.Prefab, default: null, tooltip: "手牌预制" },
        touchNode: { type: cc.Node, default: null, tooltip: "触摸节点" },
        opchupai: { type: cc.Node, default: null, tooltip: "出牌提示节点" },
        out_node: { type: cc.Node, default: null, tooltip: "出牌节点" },
        tuoguan: { default: null, type: cc.Node, tooltip: '托管遮罩' },
        pokernumNode: { default: null, type: cc.Node, tooltip: '手牌节点' },
        danNode: { default: null, type: cc.Node, tooltip: '报单' },
        zhuangNode: { default: null, type: cc.Node, tooltip: '庄家' },
        guanNode: { default: null, type: sp.Skeleton, tooltip: '全关' },
        pokerStartNode: { default: null, type: cc.Node, tooltip: '发牌起始点' },
    },

    onLoad: function () {
        this.initUI();
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
    },

    onDestroy: function () {

    },

    initUI: function () {
        this.danNode.active = false; //报单
        this.pokernumNode.active = false;//手牌
        this.showSuoLian(); //锁
        this.guanNode.node.active = false; //全关
        this.zhuangNode.active = false; //庄

        //清除出牌
        this.clearOutCard();
        //清除手牌
        this.clearHeadCard();
        this.showNoCard(false);
        this.showOperation(opType.NONE);
        this.touchNode.active = false;
        cc.find('op', this.node).active = false;
    },

    /**
     * 初始化牌数量
     */
    initPokerNum: function (num) {
        this.pokerNum = num; //初始化牌数量
        this.showpokernum();
    },

    /**
     * 增加手牌
     */
    addPokerNum: function () {
        this.pokerNum++;
        this.showpokernum();
    },

    /**
     * 获取头像控件
     */
    Head: function () {
        if (!this.head)
            this.head = this.node.getComponentInChildren('com_game_head');
        return this.head;
    },

    /**
     * 玩家动画公用类
     */
    PlayerAnimation: function () {
        if (!this.pAnimation)
            this.pAnimation = this.node.getComponent('gdy_player_comon');
        return this.pAnimation;
    },

    /**
     * 显示锁链
     */
    showSuoLian: function () {
        var isQuanGuan = gdyData.Instance().getQuanGuan();
        cc.find('suolian', this.pokernumNode).active = isQuanGuan;
    },

    /**
     * 显示手牌数量
     */
    showpokernum: function () {
        if (this.pokerNum > 0)
            this.pokernumNode.active = true;
        this.showSuoLian();

        //牌数量
        cc.find('lbl', this.pokernumNode).getComponent(cc.Label).string = this.pokerNum;
        this.danNode.active = this.pokerNum == 1;
        if (this.pokerNum == 1)
            this.playBaoJing();
    },

    /**
     * 首次发牌
     */
    firstSendPoker: function () {
        this.pokerNum = 5;
        this.pokernumNode.active = true;
    },

    /**
     * 显示是否庄
     */
    showZhuang: function (bl) {
        this.zhuangNode.active = bl;
    },

    /**
     * 开始发牌
     */
    sendPokerFirst: function (pokerList) {
        cc.log('开始发牌');
        //清理手牌
        this.clearHeadCard();
        //创建手牌
        this.createPoker(pokerList);
        //刷新手牌长度
        this.refreshHandCards();
        //清空touch事件
        this.clearTouchList();
        this.canTouch = true;
        this.touchNode.active = true;
    },

    /**
     * 创建手牌
     */
    createNewCreate: function () {
        var card = cc.instantiate(this.paiPre);
        card.name = 'poker';
        card.touched = null;
        card.scaleX = 0.8;
        card.scaleY = 0.8;
        var width = card.width;
        var offset = (this.hand_node.width + paiBorder - width) / (HANDNUM - 1);
        var start = (this.hand_node.width + paiBorder - width) / 2;
        card.x = start + this.out_node.childrenCount * offset;
        card.y = 0;
        card.active = false;
        this.setPoker(card, 0);
        this.hand_node.addChild(card);
    },

    /**
     * 发牌
     */
    sendPoker: function () {
        cc.log('发牌中');
        //this.canTouch = false;
        this.createNewCreate();
        //发牌动画
        this.SendPokerAnimation();
        //增加手牌
        this.addPokerNum();
    },

    /**
     * 发牌动画
     */
    SendPokerAnimation: function () {
        var poker = this.hand_node.children[this.hand_node.childrenCount - 1];
        if (!poker) return;
        var orginPos_x = poker.x;
        var orginPos_y = poker.y;
        var pos_x = this.pokerStartNode.x;
        var pos_y = this.pokerStartNode.y;
        var pos = this.hand_node.convertToNodeSpace(this.pokerStartNode.convertToWorldSpace(cc.v2(pos_x, pos_y)));
        poker.setPosition(cc.v2(pos.x, pos.y - poker.height));

        var moveTo = cc.moveTo(0.3, cc.v2(orginPos_x - poker.width / 2, orginPos_y));
        var scaleTo = cc.scaleTo(0.3, 0.8);
        poker.active = true;
        var seq = cc.sequence(cc.spawn(moveTo, scaleTo),
            cc.delayTime(0.1), cc.callFunc(function () {
                // this.canTouch = true;
                var pokerList = gdyData.Instance().getHandPoker();
                this.createPoker(pokerList);
            }.bind(this)));
        poker.runAction(seq);
    },

    /**
     * 创建手牌
     */
    createPoker: function (handPoker) {
        cc.log('创建手牌 :', handPoker);
        if (!handPoker) return;
        this.clearHeadCard();
        for (var i = 0; i < handPoker.length; i++) {
            var card = cc.instantiate(this.paiPre);
            card.name = handPoker[i].toString();
            card.touched = null;
            card.scaleX = 0.8;
            card.scaleY = 0.8;
            var width = card.width;
            var offset = 0;
            var start = 0;
            if (handPoker.length < HANDNUM) {
                offset = (this.hand_node.width + paiBorder - width) / (HANDNUM - 1);
                start = (this.hand_node.width + paiBorder - (handPoker.length - 1) * offset - width) / 2;
            }
            else {
                offset = (this.hand_node.width + paiBorder - width) / (handPoker.length - 1);
                start = 0;
            }
            this.setPoker(card, handPoker[i]);
            card.x = start + i * offset;
            card.y = 0;
            card.active = true;
            this.hand_node.addChild(card);
        }
        this.RefreshhandSort(handPoker);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        var headnode = cc.find('Canvas/root');
        headnode.getComponent('gdy_game_pyc').setPoker(prefab, cardValue);
    },

    /**
     * 出牌显示
     * @param cardlist 原先牌组
     * @param changePokerList 变化后的牌组
     * @param index 癞子下标
     */
    showOutCard: function (cardlist, changePokerList, index, isabnormal) {
        cc.log('自己打牌:' + cardlist, 'index : ', index);
        this.showOperation(opType.NONE);
        this.showNoCard(false);
        if (cardlist && cardlist[0] == 0) {
            cc.find('op', this.node).active = false;
            return;
        }

        var ret = gdyUtil.analysisCards(cardlist);
        var cards = gdyUtil.sortOutCards(cardlist);
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
            this.clearAllSelectCards();
        } else {
            if (!isabnormal) {
                this.pokerNum -= cardlist.length;
                this.showpokernum();
            }

            for (var i = this._handCards.length - 1; i > -1; i--) {
                if (cardlist.indexOf(this._handCards[i]) != -1) {
                    this.deleteCards(cardlist, this._handCards[i]);
                    this._handCards.splice(i, 1);
                }
            }

            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.7;
            var midNode = cc.find(cards[Math.floor(cards.length / 2)].toString(), this.hand_node);
            if (!midNode) {
                cc.error('手牌找不到:' + cards[Math.floor(cards.length / 2)].toString());
                return;
            }
            var midX = midNode.x;
            //删除手牌
            for (var i = 0; i < cards.length; i++) {
                var rNode = cc.find(cards[i].toString(), this.hand_node);
                if (!rNode) continue;
                rNode.removeFromParent();
                rNode.destroy();
            }

            var changeCards = [];
            if (index != -1) {
                changeCards = gdyUtil.sortOutCards(changePokerList);
            } else {
                changeCards = gdyUtil.sortOutCards(changePokerList);
                //gdyUtil.getConversionList(changePokerList, changeCards);
            }
            //变化后的牌
            for (var i = 0; i < changeCards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
                var lazi = (i == index) ? true : false;
                card.getChildByName('lazarillo').active = lazi;
                if (lazi)
                    this.setPoker(card, changePokerList[i]);
                else
                    this.setPoker(card, changeCards[i]);
                card.scaleX = scale;
                card.scaleY = scale;
                this.out_node.addChild(card);
                card.setSiblingIndex(i);
                card.x = (i - Math.floor(changeCards.length / 2)) * offset * scale;
                card.y = 0;
                var moveTo = null;
                if (changeCards.length % 2 == 1) {
                    moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(changeCards.length / 2)) * offset * endscale - card.width / 2 * endscale, 0));
                }
                else {
                    moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(changeCards.length / 2)) * offset * endscale - card.width / 2 * endscale + offset * endscale / 2, 0));
                }
                var scaleTo = cc.scaleTo(duration, endscale, endscale);
                var act = cc.spawn(moveTo, scaleTo);
                card.runAction(act);
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
            this.Head().stopTimer();
        }
        if (isabnormal)
            cc.find('op', this.node).active = false;
    },

    /**
    * 打牌中
    */
    showPlaying: function (time, curtime) {
        cc.log('自己打牌中...');
        cc.find('op', this.node).active = false;
        this.clearOutCard();
        this.tipIndex = -1;//清除提示
        cc.log('牌权：', gdyData.Instance().lastCards);
        if (gdyData.Instance().lastCards && gdyData.Instance().lastCards.length > 0 && gdyData.Instance().lastPlayer != 0) {
            if (gdyUtil.calCards(gdyData.Instance().lastCards, this._handCards)) {
                this.showOperation(opType.OUTCARD);
                cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = true;
                var rule = RoomMgr.Instance()._Rule;
                if (!rule) return;
                cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = !rule.biCard;
                this.onSelectCardChanged();
                this.tishi();
                cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, function () {
                }, curtime);
            } else {//没有牌可以大过上家
                this.showOperation(opType.YAOBUQI);
                time = 5;
                cc.find('op_yaobuqi', this.node).getComponentInChildren('ddz_timer').play(time, function () {
                    // if (RoomMgr.Instance().gameId != Define.GameType.DSZ_FRIEND)
                    //     gdy_send_msg.sendCards([], []);
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
            this.Head().playTimerLoop(time);
            //cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
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
        if (this.hand_node.childrenCount > 17) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (this.hand_node.childrenCount - 1);
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                var move = cc.moveTo(duration, cc.v2(i * offset, 0));
                this.hand_node.children[i].runAction(move);
            }
        }
        else if (this.hand_node.childrenCount > 0) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
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

    /**
     * 刷新手牌排序
     */
    RefreshhandSort: function (cards) {
        this._handCards = gdyUtil.sortShowCards(cards);
        if (this._handCards.length != this.hand_node.childrenCount)
            return;
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            var handnode = this.hand_node.children[i];
            handnode.name = this._handCards[i].toString();
            this.setPoker(handnode, this._handCards[i]);
        }
    },

    /**
     * 特效
     */
    playAnimation: function (outType) {
        var bomb = cc.find('bomb_ani', this.node.parent.parent);
        var bombx = bomb.x;
        var bomby = bomb.y;
        var pos = this.out_node.convertToNodeSpace(bomb.convertToWorldSpace(cc.v2(bombx, bomby)));
        var pos = cc.v2(0, this.out_node.position.y);
        switch (outType) {
            case 3:
                this.PlayerAnimation().showSingleSE(pos);
                break;
            case 4:
                this.PlayerAnimation().showDoubleSE(pos);
                break;
            case 5:
                this.PlayerAnimation().showMediumBomb();
                //this.head.showBigBomb(1); 天王炸
                break;
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
        ops.push(cc.find('op_chupai', this.node));
        ops.push(cc.find('op_yaobuqi', this.node));;
        for (var i = 0; i < ops.length; i++) {
            if (i == type) {
                ops[i].active = true;
            }
            else {
                ops[i].active = false;
                //this.Head().playTimer(time,null,curtime);
                ops[i].getComponentInChildren('ddz_timer').setActive(false);
            }
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

        //多选牌组合
        if (gdyUtil.compareCards(gdyData.Instance().lastCards, selectCards)) {
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
            if (!gdyUtil.analysisCards(selectCards).type) {
                if (this.start_touch_none) {
                    this.setChooseCards(selectCards);
                }
            }
        }
    },

    /**
    * 选定牌
    */
    setChooseCards: function (cards) {
        var type = gdyUtil.analysisCards(cards).type;
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
     * 播放锁动画
     */
    playSuo: function () {
        var isQuanGuan = gdyData.Instance().getQuanGuan();
        if (!isQuanGuan) return;
        var suolian = cc.find('suolian', this.pokernumNode);
        var anim = suolian.getComponent(sp.Skeleton);
        anim.setEndListener(function () {
            suolian.active = false;
        }.bind(this));
        if (anim)
            anim.setAnimation(0, 'sui', false);
    },

    /**
     * 播放全关动画
     */
    playQuanGuan: function () {
        var isQuanGuan = gdyData.Instance().getQuanGuan();
        if (!this.guanNode || !isQuanGuan) return;
        this.guanNode.node.active = true;
        this.guanNode.setAnimation(0, 'quanguan', false);
    },

    /**
     * 播放报警动画
     */
    playBaoJing: function () {
        if (!this.danNode) return;
        this.danNode.active = true;
        var baojingAni = this.danNode.getComponent(cc.Animation);
        baojingAni.play('baojing');
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
        cc.log('出牌：', selectCards, '出牌类型：', gdyUtil.analysisCards(selectCards).type);
        if (gdyUtil.analysisCards(selectCards).type) {
            var cards = gdyUtil.compositeCardType(selectCards);
            if (cards.length > 0) {
                if (gdyUtil.analysisCards(cards[0]).type) {
                    this.laziCard = cards[0];
                }
            }
            if (!this.laziCard)
                this.laziCard = selectCards;

            gdy_send_msg.sendCards(selectCards, this.laziCard);
            this.laziCard = null;
        }
    },

    //不出
    onPass: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var cards = [];
        cc.log('不出');
        gdy_send_msg.sendCards(cards, cards);
    },

    //提示
    onTips: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (!gdyUtil.calCards(gdyData.Instance().lastCards, this._handCards)) {//不出
            gdy_send_msg.sendCards([], []);
            return;
        }
        this.tishi();
    },

    /**
     * 提示牌
     */
    tishi: function () {
        var cards = [];
        if (this.tipIndex == null || this.tipIndex == -1) {
            this.tipArray = gdyUtil.calCards(gdyData.Instance().lastCards, this._handCards);
            this.tipIndex = 0;
            if (this.tipArray) {
                gdyUtil.getConversionList(this.tipArray[0], cards);
                this.setChooseCards(cards);
            }
        }
        else {
            this.tipIndex = this.tipIndex + 1 >= this.tipArray.length ? 0 : this.tipIndex + 1;
            gdyUtil.getConversionList(this.tipArray[this.tipIndex], cards);
            this.setChooseCards(cards);
        }
    },

    /**
     * 有牌必出
     */
    showCardBi: function () {
        var rule = RoomMgr.Instance()._Rule;
        if (!rule) return;
        if (rule.biCard)
            cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = false;
    },

});


