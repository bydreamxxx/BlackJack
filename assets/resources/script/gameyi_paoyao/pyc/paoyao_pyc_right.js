var py = require('paoyao_util');

const CARD_OFFSET = 36;//出牌间距

cc.Class({
    extends: cc.Component,

    properties: {
        out_node: { type: cc.Node, default: null, tooltip: '出牌节点' },
        outcard_pre: { type: cc.Prefab, default: null, tooltip: '出牌预制' },
        cards: { default: [], type: cc.Node, tooltip: '王炸' },
    },

    onLoad: function () {
        this.initUiScript();
    },

    /**
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
        this.hideTimer();
        this.closeLangdi();
        cc.find('op', this.node).active = false;
        this.head.Ready(false);
        this.head.JiaBei(false);
        this.head.showYaoCard(0, 0);
        this.head.RefreshRemain(0);
        this.head.showTuoGuan(false);
        this.head.ShowOffline(false);
        this.head.outCardIndex(0);
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

    //发牌显示
    playSendCards: function (cards) {
        cc.log("下家发牌：", cards);
        this.setRemainCardNum(cards.length);
    },

    /**
     * 设置剩余牌数
     */
    setRemainCardNum: function (num) {
        this.remainCard = num;
        cc.log('下家剩余牌数:', num);
        this.refreshCardsNum();
    },

    //获取手牌数量
    getHandCardNum: function () {
        return this.remainCard;
    },

    /**
     * 刷新牌组数量
     */
    refreshCardsNum: function () {
        if (!this.head)
            this.initUiScript();
        this.head.RefreshRemain(this.remainCard); //手牌数量
    },

    //打牌中
    showPlaying: function (time, curtime) {
        cc.log('下家打牌中...');
        this.clearOutCard();
        cc.find('op', this.node).active = false;
        this.showTimer(time, null, curtime);
    },

    closeLangdi: function () {
        var cardNode = cc.find('liangpai', this.node);
        if (cardNode.childrenCount > 0) {
            for (var i = cardNode.childrenCount - 1; i > -1; i--) {
                var node = cardNode.children[i];
                if (node)
                    node.destroy();
            }
        }
    },

    /**
    * 亮牌
    */
    showLangCard: function (cardlist) {
        cc.log('下家亮底:' + cardlist);
        this.clearOutCard();
        cc.log('下家清除出牌');
        this.hideTimer();
        cc.log('下家关闭倒计时');
        var cardNode = cc.find('liangpai', this.node);
        cardNode.scale = 0.7;
        this.closeLangdi();
        if(cardlist.length == 0) return;
        cc.log('下家清除亮底');
        cc.log('记录牌数量：', this.remainCard + ' 亮牌集合数量：', cardlist.length);
        if (cardlist.length != this.remainCard)
            this.setRemainCardNum(cardlist.length);
        cc.find('op', this.node).active = false;
        var one_lene_num = 15;
        var cards = py.sortOutCards(cardlist);
        var startX = 135;
        var scale = 0.01;
        var duration = 0.1;
        var endscale = 0.68;
        var cardWidth = 169;
        var cardHeight = 233;
        for (var i = 0; i < cards.length; i++) {
            var card = cc.instantiate(this.outcard_pre);
            card.scale = scale;
            cardWidth = card.width;
            cardHeight = card.height;
            this.setPoker(card, cards[i]);
            cardNode.addChild(card);
            card.setSiblingIndex(i);
            card.x = startX;
            card.y = 0;
            if (i >= one_lene_num) {
                var moveTo = cc.moveTo(duration, cc.v2(80 - (one_lene_num - (i - one_lene_num) - 1) * CARD_OFFSET, -50));
                var scaleTo = cc.scaleTo(duration, endscale, endscale);
                var act = cc.spawn(moveTo, scaleTo);
                card.runAction(act);
            }
            else {
                var moveTo = cc.moveTo(duration, cc.v2(-60 - ((cards.length > one_lene_num ? one_lene_num : cards.length) - i - 1) * CARD_OFFSET, 0));
                var scaleTo = cc.scaleTo(duration, endscale, endscale);
                var act = cc.spawn(moveTo, scaleTo);
                card.runAction(act);
            }
        }
        cc.log('下家亮底完成');
    },

    /**
     * 出牌显示
     */
    showOutCard: function (cardlist, isabnormal) {
        cc.log('下家打牌:' + cardlist);
        this.clearOutCard();
        cc.log('下家清除出牌');
        this.hideTimer();
        cc.log('下家关闭倒计时');
        const ONE_LINE_NUM = 10;
        if (cardlist[0] == 0) {
            cc.find('op', this.node).active = false;
            return;
        }
        var ret = py.analysisCards(cardlist);
        var cards = py.sortOutCards(cardlist);
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        } else {
            var startX = 135;
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.68;
            var cardWidth = 169;
            var cardHeight = 233;
            if (ret.index == 18 || ret.index == 19) {
                cc.find('wang_card', this.out_node).active = true;
                for (var i = 0; i < cards.length; ++i) {
                    this.cards[i].active = true;
                    this.setPoker(this.cards[i], cards[i]);
                }
            } else {
                for (var i = 0; i < cards.length; i++) {
                    var card = cc.instantiate(this.outcard_pre);
                    cardWidth = card.width;
                    cardHeight = card.height;
                    this.setPoker(card, cards[i]);
                    card.scaleX = scale;
                    card.scaleY = scale;
                    this.out_node.addChild(card);
                    card.setSiblingIndex(i);
                    card.x = startX;
                    card.y = 0;
                    if (i >= ONE_LINE_NUM) {
                        var moveTo = cc.moveTo(duration, cc.v2(-cardWidth - (ONE_LINE_NUM - (i - ONE_LINE_NUM) - 1) * CARD_OFFSET, -50));
                        var scaleTo = cc.scaleTo(duration, endscale, endscale);
                        var act = cc.spawn(moveTo, scaleTo);
                        card.runAction(act);
                    }
                    else {
                        var moveTo = cc.moveTo(duration, cc.v2(-cardWidth - ((cards.length > ONE_LINE_NUM ? ONE_LINE_NUM : cards.length) - i - 1) * CARD_OFFSET, 0));
                        var scaleTo = cc.scaleTo(duration, endscale, endscale);
                        var act = cc.spawn(moveTo, scaleTo);
                        card.runAction(act);
                    }
                }
            }

            //出牌特效
            if (!isabnormal) {
                this.playAnimation(ret.type, cc.v2(cardWidth * scale + Math.abs((cardlist.length - 1) * startX / 2), cardHeight * scale));
                var cardNum = this.remainCard - cards.length;
                cc.log('下家出完牌剩余牌数:', cardNum);
                this.setRemainCardNum(cardNum);
            }
        }

        cc.log('下家出牌完成');
    },

    /**
     * 特效
     */
    playAnimation: function (outType, card) {
        var outcards = cc.find('outcards', this.node);
        var outcardpos = outcards.parent.convertToWorldSpace(outcards.position);
        var localpos = this.node.parent.convertToNodeSpace(outcardpos);
        var pos = cc.v2(localpos.x - card.x / 2, localpos.y + card.y);
        cc.log('下家----card.y:', card.y, 'pos.x:', pos.x, 'pos.y:', pos.y);
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
                this.head.showBigBomb(3);
                break;
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
        cc.find('op', this.node).active = false;
    },

    /**
     * 显示倒计时
     */
    showTimer: function (sec, callback, curtime) {
        var timer = this.node.getComponentInChildren('ddz_timer');
        timer.play(sec, callback, curtime);
    },

    hideTimer: function () {
        var timer = this.node.getComponentInChildren('ddz_timer');
        timer.setActive(false);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        var headnode = cc.find('Canvas/root');
        headnode.getComponent('py_game_pyc').setPoker(prefab, cardValue);
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
});