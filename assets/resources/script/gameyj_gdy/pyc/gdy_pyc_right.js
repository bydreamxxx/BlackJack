var gdyUtil = require('gdy_util');
var gdyData = require('gdy_game_data').GDY_Data;
const CARD_OFFSET = 36;//出牌间距
cc.Class({
    extends: cc.Component,
    properties: {
        out_node: { type: cc.Node, default: null, tooltip: '出牌节点' },
        outcard_pre: { type: cc.Prefab, default: null, tooltip: '出牌预制' },
        pokernumNode: { default: null, type: cc.Node, tooltip: '手牌节点' },
        danNode: { default: null, type: cc.Node, tooltip: '报单' },
        zhuangNode: { default: null, type: cc.Node, tooltip: '庄家' },
        guanNode: { default: null, type: sp.Skeleton, tooltip: '全关' },
        pokerStartNode: { default: null, type: cc.Node, tooltip: '发牌起始点' },
    },

    onLoad: function () {
        this.initUI();
    },

    onDestroy: function () {

    },

    /**
     * 初始化界面
     */
    initUI: function () {
        this.guanNode.node.active = false; //全关
        this.zhuangNode.active = false;//庄
        this.danNode.active = false; //报单
        //清除出牌
        this.clearOutCard();
        cc.find('op', this.node).active = false;
        this.pokernumNode.active = false; //锁牌
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
     * 显示是否庄
     */
    showZhuang: function (bl) {
        this.zhuangNode.active = bl;
    },

    /**
     * 发牌动画
     */
    sendPoker: function () {
        cc.log('下家发牌');
        this.createPoker();
        this.SendPokerAnimation();
        this.addPokerNum();
    },

    /**
     * 发牌动画
     */
    SendPokerAnimation: function () {
        var poker = this.node.getChildByName('poker');
        if (!poker) return;
        var head = cc.find('com_game_head_right', this.node);
        var orginPos_x = head.x;
        var orginPos_y = head.y;
        var moveTo = cc.moveTo(0.3, cc.v2(orginPos_x - poker.width / 2, orginPos_y));
        var scaleTo = cc.scaleTo(0.3, 0.5);
        poker.active = true;
        var seq = cc.sequence(cc.spawn(moveTo, scaleTo),
            cc.delayTime(0.1), cc.callFunc(function () {
                poker.removeFromParent();
                poker.destroy();
            }.bind(this)));
        poker.runAction(seq);
    },

    /**
     * 创建手牌
     */
    createPoker: function () {
        var card = cc.instantiate(this.outcard_pre);
        card.name = 'poker';
        card.touched = null;
        var cardscale = 0.8;
        card.scaleX = cardscale;
        card.scaleY = cardscale;
        card.active = false;
        var pos_x = this.pokerStartNode.x;
        var pos_y = this.pokerStartNode.y;
        var pos = this.node.convertToNodeSpace(this.pokerStartNode.convertToWorldSpace(cc.v2(pos_x, pos_y)));
        card.setPosition(cc.v2(pos.x, pos.y - card.height * cardscale));
        this.setPoker(card, 0);
        this.node.addChild(card);
    },

    //打牌中
    showPlaying: function (time, curtime) {
        cc.log('下家打牌中...');
        this.clearOutCard();
        cc.find('op', this.node).active = false;
        this.Head().playTimerLoop(time);
    },

    /**
   * 出牌显示
   * @param cardlist 牌的集合
   * @param isabnormal 是否正常出牌
   */
    showOutCard: function (cardlist, changePokerList, index, isabnormal) {
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
        var ret = gdyUtil.analysisCards(cardlist);
        var cards = gdyUtil.sortOutCards(changePokerList);
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        } else {
            if (!isabnormal) {
                this.pokerNum -= cardlist.length;
                this.showpokernum();
            }
            var startX = 135;
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.68;
            var cardWidth = 169;
            var cardHeight = 233;
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.outcard_pre);
                cardWidth = card.width;
                cardHeight = card.height;
                var lazi = (i == index) ? true : false;
                card.getChildByName('lazarillo').active = lazi;
                this.setPoker(card, cards[i]);
                card.scaleX = scale;
                card.scaleY = scale;
                this.out_node.addChild(card);
                card.setSiblingIndex(i);
                card.x = startX;
                card.y = 0;
                if (i >= ONE_LINE_NUM) {
                    var moveTo = cc.moveTo(duration, cc.v2(-cardWidth - (ONE_LINE_NUM - (i - ONE_LINE_NUM) - 1) * CARD_OFFSET + (cardWidth * scale) / 2, -50));
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                }
                else {
                    var moveTo = cc.moveTo(duration, cc.v2(-cardWidth - ((cards.length > ONE_LINE_NUM ? ONE_LINE_NUM : cards.length) - i - 1) * CARD_OFFSET + (cardWidth * scale) / 2, 0));
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                }
            }

            //出牌特效
            if (!isabnormal) {
                this.playAnimation(ret.type, cc.v2(cardWidth * scale + Math.abs((cardlist.length - 1) * startX / 2), cardHeight * scale));
            }
        }
        if (isabnormal)
            cc.find('op', this.node).active = false;
    },

    /**
     * 特效
     */
    playAnimation: function (outType, card) {
        var outcards = cc.find('out_cards', this.node);
        var outcardpos = outcards.parent.convertToWorldSpace(outcards.position);
        var localpos = this.node.parent.convertToNodeSpace(outcardpos);
        var pos = cc.v2(localpos.x - card.x / 2, localpos.y + card.y / 2);
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

    //设置牌值
    setPoker: function (prefab, cardValue) {
        var headnode = cc.find('Canvas/root');
        headnode.getComponent('gdy_game_pyc').setPoker(prefab, cardValue);
    },

    hideTimer: function () {
        this.Head().stopTimer();
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
});


