var ddz = require('ddz_util');
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('xyddz_audio_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const CARD_OFFSET = 36;//出牌间距

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
        remainNode: { type: cc.Node, default: null, tooltip: "剩余牌节点" },
        out_node: { type: cc.Node, default: null, tooltip: '出牌节点' },
        outcard_pre: { type: cc.Prefab, default: null, tooltip: '出牌预制' },
        emoji_node: { type: cc.Node, default: null, tooltip: "表情节点" },
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音
    },

    // use this for initialization
    onLoad: function () {

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

    //显示准备
    showReady: function (bool) {
        bool = bool ? true : false;
        cc.find('ready', this.headnode).active = bool;
    },

    //初始化玩家信息
    initPlayerInfo: function (player) {
        player.name = ddz.filterEmoji(player.name);
        this.goldlbl.string = cc.dd.Utils.getNumToWordTransform(player.score);
        this.namelbl.string = cc.dd.Utils.substr(player.name, 0, 4);
        this.initHead(player.openId, player.headUrl);
        this.showReady(player.isReady == 1);
        cc.find('vip_head/level', this.headnode).getComponent(cc.Label).string = player.vipLevel.toString();
        cc.find('vip_head', this.headnode).active = player.vipLevel > 0;
        this.showUI(true);
    },

    initHead: function (openId, headUrl) {
        // if (headUrl.indexOf('.jpg') != -1) {
        //     FortuneHallManager.getRobotIcon(headUrl, function (sprite) {
        //         this.headsp.spriteFrame = sprite;
        //     }.bind(this));
        // }
        // else {
        if (headUrl && headUrl != '') {
            cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        }
        //}
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

    //重置UI
    resetUI: function () {
        cc.find('op', this.node).active = false;
        cc.find('jiabei', this.headnode).active = false;
        cc.find('lord', this.headnode).active = false;
        cc.find('callscore', this.headnode).active = false;
        cc.find('double', this.headnode).active = false;
        cc.find('weak', this.headnode).active = false;
        this.clearOutCard();
        this.remainNode.active = false;
    },

    //发牌显示
    playSendCards: function (cards) {
        this.setRemainCardNum(cards.length);
        this.remainNode.active = true;
    },

    showDouble: function (time) {
        this.showTimer(time, null);
    },

    //分摞发牌
    showFenluo(time) {
        cc.find('xuanpaizhong', this.headnode).active = true;
        this.showTimer(time, null, null);
    },
    hideFenluo() {
        cc.find('xuanpaizhong', this.headnode).active = false;
        this.hideTimer();
    },

    showChangeCard(time) {
        cc.find('xuanpaizhong', this.headnode).active = true;
        this.showTimer(time, null, null);
    },
    onExchangeRet(cards, isReconnect) {
        this.hideTimer();
        cc.find('xuanpaizhong', this.headnode).active = false;
        var ex_right = cc.find('exchange/card/right', this.node.parent);
        ex_right.active = true;
        if (!isReconnect) {
            this.setRemainCardNum(this.remainCard - 3);
        }
    },

    /**
     * 叫分显示
     */
    showCallScoreOp: function (time, _, curtime) {
        this.showTimer(time, null, curtime);
    },
    hideCallScoreOp: function () {
        this.hideTimer();
    },

    //叫分返回
    callScoreRet: function (score, splist) {
        cc.find('callscore', this.headnode).getComponent(cc.Sprite).spriteFrame = splist[score];
        cc.find('callscore', this.headnode).active = true;
    },

    /**
     * 底牌动画
     */
    showBottomCard: function (cardlist) {
        //var cards = ddz.sortShowCards(cardlist);
        var cards = cardlist;


        for (var i = 0; i < cards.length; i++) {
            this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
        }
        cc.find('top/dipai_info', this.node.parent).getComponent(cc.Animation).play('dipai_ani');
        var cardNum = this.remainCard + cards.length;
        this.setRemainCardNum(cardNum);
    },

    //打牌中
    showPlaying: function (time, curtime) {
        cc.log('下家打牌中...');
        this.clearOutCard();
        cc.find('op', this.node).active = false;
        this.showTimer(time, null, curtime);
    },

    /**
     * 设置剩余牌数
     */
    setRemainCardNum: function (num) {
        this.remainCard = num;
        // if (num > 0 && num < 4) {
        //     cc.find('lbl', this.remainNode).active = false;
        //     cc.find('spr', this.remainNode).active = true;
        //     cc.find('spr', this.remainNode).getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('syp_' + num.toString());
        // }
        // else {
        cc.find('lbl', this.remainNode).active = true;
        cc.find('lbl', this.remainNode).getComponent(cc.Label).string = num.toString();
        //}
        if (num > 0 && num < 3) {
            cc.find('baojing', this.remainNode).active = true;
            cc.find('baojing', this.remainNode).getComponent(cc.Animation).play();
        }
        else {
            cc.find('baojing', this.remainNode).active = false;
            cc.find('baojing', this.remainNode).getComponent(cc.Animation).stop();
        }
    },
    //获取手牌数量
    getHandCardNum: function () {
        return this.remainCard;
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

    /**
     * 出牌显示
     */
    showOutCard: function (cardlist, isLord, last) {
        cc.log('下家打牌:' + cardlist);
        this.clearOutCard();
        cc.log('下家清除出牌');
        this.hideTimer();
        cc.log('下家关闭倒计时');
        const ONE_LINE_NUM = 10;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var chupai_ani = cc.find('chupai_ani', this.out_node.parent).getComponent(sp.Skeleton);
            chupai_ani.enabled = true;
            chupai_ani.setAnimation(0, 'play', false);

            var cards = ddz.sortOutCards(cardlist);
            var startX = 135;
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.68;
            var cardWidth = NaN;

            if (cardlist.length < 3) {
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHUPAI, false);
            }
            else {
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHUPAIDA, false);
            }
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.outcard_pre);
                cardWidth = card.width;
                this.setPoker(card, cards[i]);
                if (isLord && i == cards.length - 1) {
                    cc.find('lord', card).active = true;
                }
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
                    //card.runAction(scaleTo);
                }
                else {
                    if (isLord && i == ONE_LINE_NUM - 1) {
                        cc.find('lord', card).active = true;
                    }
                    var moveTo = cc.moveTo(duration, cc.v2(-cardWidth - ((cards.length > ONE_LINE_NUM ? ONE_LINE_NUM : cards.length) - i - 1) * CARD_OFFSET, 0));
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                    //card.runAction(scaleTo);
                }
            }

            var cardNum = this.remainCard - cards.length;
            if (!last) {
                this.setRemainCardNum(cardNum);
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
        }
        cc.log('下家出牌完成');
    },
    displayOutCard: function (cardlist, isLord) {
        this.clearOutCard();
        const ONE_LINE_NUM = 10;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var cards = ddz.sortOutCards(cardlist);
            var startX = -135;
            var cardWidth = NaN;
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.outcard_pre);
                cardWidth = card.width;
                this.setPoker(card, cards[i]);
                if (isLord) {
                    cc.find('lord', card).active = true;
                }
                this.out_node.addChild(card);
                card.setSiblingIndex(i);
                card.scaleX = 0.68;
                card.scaleY = 0.68;
                card.x = startX;
                card.y = 0;
                if (i >= ONE_LINE_NUM) {
                    card.x = -cardWidth - (ONE_LINE_NUM - (i - ONE_LINE_NUM) - 1) * CARD_OFFSET;
                    card.y = -50;
                }
                else {
                    card.x = -cardWidth - ((cards.length > ONE_LINE_NUM ? ONE_LINE_NUM : cards.length) - i - 1) * CARD_OFFSET;
                    card.y = 0;
                }
            }
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

    //清除出牌
    clearOutCard: function () {
        for (var i = this.out_node.childrenCount - 1; i > -1; i--) {
            var node = this.out_node.children[i];
            node.removeFromParent();
            node.destroy();
        }
        //this.out_node.removeAllChildren(true);
    },

    /**
     * 托管显示
     */
    showAuto: function (isAuto) {
        var bool = isAuto || false;
        cc.find('tuoguan', this.headnode).active = bool;
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        this.node.parent.getComponent('xyddz_pyc').setPoker(prefab, cardValue);
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('xyddz_pyc').setDipai(prefab, cardValue);
    },
});
