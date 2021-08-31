var ddz = require('ddz_util');
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('xyddz_audio_cfg');

const CARD_OFFSET = 36;//出牌间距

cc.Class({
    extends: cc.Component,

    properties: {
        headnode: { type: cc.Node, default: null, tooltip: "head节点" },
        headsp: { type: cc.Sprite, default: null, tooltip: "头像" },
        namelbl: { type: cc.Label, default: null, tooltip: "昵称" },
        goldlbl: { type: cc.Label, default: null, tooltip: "金币" },
        remainNode: { type: cc.Node, default: null, tooltip: "剩余牌节点" },
        hand_node: { type: cc.Node, default: null, tooltip: '手牌节点' },
        out_node: { type: cc.Node, default: null, tooltip: '出牌节点' },
        outcard_pre: { type: cc.Prefab, default: null, tooltip: '出牌预制' },
    },

    // use this for initialization
    onLoad: function () {

    },
    onDestroy: function () {

    },

    /**
     * 刷新界面
     * @param {*} status 
     * @param {*} player 
     */
    refreshPlayerUI(status, player) {
        this.initPlayerInfo(player);
        this.playSendCards(player.handPoker);
        this.displayOutCard(player.outPoker, player.lord);
        cc.find('jiabei', this.headnode).active = (player.double == true);
        cc.find('lord', this.headnode).active = (player.lord == true);
        cc.find('callscore', this.headnode).active = false;
        cc.find('double', this.headnode).active = false;
        if (status == 'cmd_ddz_call_score_ack' && player.callscore != null) {
            var splist = cc.find('Canvas').getComponentInChildren('xyddz_replay').callscore_splist;
            this.callScoreRet(player.callscore, splist);
        }
        if (status == 'cmd_ddz_double_score_ack' && player.double != null) {
            if (player.double) {
                cc.find('double', this.headnode).getComponent(cc.Sprite).spriteFrame = this.node.parent.getComponent('xyddz_replay').atlas_game.getSpriteFrame('jiabei_2');
            }
            else {
                cc.find('double', this.headnode).getComponent(cc.Sprite).spriteFrame = this.node.parent.getComponent('xyddz_replay').atlas_game.getSpriteFrame('dz_bujiabeiicon');
            }
            cc.find('double', this.headnode).active = true;
        }
    },


    //初始化玩家信息
    initPlayerInfo: function (player) {
        this.goldlbl.string = player.score.toString();
        this.initHead(player.headUrl);
        this.namelbl.string = cc.dd.Utils.substr(player.name, 0, 4);
    },

    initHead: function (headUrl) {
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

    //重置UI
    resetUI: function () {
        cc.find('op', this.node).active = false;
        cc.find('jiabei', this.headnode).active = false;
        cc.find('lord', this.headnode).active = false;
        this.clearOutCard();
        this.remainNode.active = false;
    },

    //发牌显示
    playSendCards: function (cards) {
        this.setRemainCardNum(cards.length);
        this.remainNode.active = true;
        this.clearHandCards();
        this._handCards = ddz.sortShowCards(cards);
        for (var i = 0; i < this._handCards.length; i++) {
            var card = cc.instantiate(this.outcard_pre);
            card.name = this._handCards[i].toString();
            card.scaleX = 0.4;
            card.scaleY = 0.4;
            this.setPoker(card, this._handCards[i]);
            this.hand_node.addChild(card);
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

    //删除交换牌
    deleteChangeCard(cards) {
        for (var i = 0; i < cards.length; i++) {
            var idx = this._handCards.indexOf(cards[i]);
            this._handCards.splice(idx, 1);
            var rmNode = cc.find(cards[i].toString(), this.hand_node);
            rmNode.removeFromParent();
            rmNode.destroy();
        }
    },
    //添加交换牌
    addChangeCard(cards) {
        if (this._handCards.indexOf(cards[0]) != -1) {
            return;
        }
        this._handCards = ddz.sortShowCards(this._handCards.concat(cards));
        this.playSendCards(this._handCards);
    },

    /**
     * 底牌动画
     */
    showBottomCard: function (cardlist) {
        //var cards = ddz.sortShowCards(cardlist);
        var cards = cardlist;
        //todo:翻牌动画
        var finish = function () {
            cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).off('finished', finish, this);
            for (var i = 0; i < cards.length; i++) {
                this.setPoker(cc.find('dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node.parent), cards[i]);
            }
            cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).getAnimationState('dipai_rotate').speed = 2;
            cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).play('dipai_rotate');
            this.scheduleOnce(function () {
                cc.find('dipai_info', this.node.parent).getComponent(cc.Animation).play('dipai_ani_jbc');
                for (var i = 0; i < cards.length; i++) {
                    cc.find('dipai_info/dipai_' + (i + 1).toString(), this.node.parent).scale = 0;
                    this.setDipai(cc.find('dipai_info/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
                }
                this._handCards = ddz.sortShowCards(this._handCards.concat(cardlist));
                this.playSendCards(this._handCards);
            }.bind(this), 0.5);
        }.bind(this);
        cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).on('finished', finish, this);
        cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).play('dipai_reset');
        var cardNum = this.remainCard + cards.length;
        this.setRemainCardNum(cardNum);
    },

    clearOutCardAndPass() {
        cc.find('op', this.node).active = false;
        this.clearOutCard();
    },

    //打牌中
    showPlaying: function (time, curtime) {
        this.clearOutCard();
        cc.find('op', this.node).active = false;
        this.showTimer(time, null, curtime);
    },

    showDouble: function (time) {
        this.showTimer(time, null);
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
        if (num > 0 && num < 3) {
            cc.find('baojing', this.remainNode).active = true;
            cc.find('baojing', this.remainNode).getComponent(cc.Animation).stop();
            cc.find('baojing', this.remainNode).getComponent(cc.Animation).play();
        }
        else {
            cc.find('baojing', this.remainNode).active = false;
            cc.find('baojing', this.remainNode).getComponent(cc.Animation).stop();
        }
        // }
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
        this.clearOutCard();
        this.hideTimer();
        const ONE_LINE_NUM = 10;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var cards = ddz.sortOutCards(cardlist);
            var startX = -135;
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.68;
            var cardWidth = NaN;
            var tp = ddz.analysisCards(cards).type;
            for (var i = 0; i < cards.length; i++) {
                var rmNode = cc.find(cards[i].toString(), this.hand_node);
                rmNode.removeFromParent();
                rmNode.destroy();
            }

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
                    var moveTo = cc.moveTo(duration, cc.v2((i - ONE_LINE_NUM) * CARD_OFFSET, -50));
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                    //card.runAction(scaleTo);
                }
                else {
                    var moveTo = cc.moveTo(duration, cc.v2(i * CARD_OFFSET, 0));
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
                        cc.find('Canvas/root').getComponent('xyddz_replay').playShunziAnimation();
                        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                        break;
                    case 6://连对
                        cc.find('Canvas/root').getComponent('xyddz_replay').playLianduiAnimation();
                        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                        break;
                    case 7://飞机不带
                    case 8://飞机
                        cc.find('Canvas/root').getComponent('xyddz_replay').playAirplaneAnimation();
                        break;
                    case 10://炸弹
                        cc.find('Canvas/root').getComponent('xyddz_replay').playBombAnimation('zuo');
                        break;
                    case 11://火箭
                        cc.find('Canvas/root').getComponent('xyddz_replay').playRocketAnimation('3');
                        break;
                    default:
                        break;
                }
            }
        }
    },
    displayOutCard: function (cardlist, isLord) {
        this.clearOutCard();
        if (cardlist == null) {
            cc.find('op', this.node).active = false;
            return;
        }
        const ONE_LINE_NUM = 10;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            cc.find('op', this.node).active = false;
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
                    card.x = (i - ONE_LINE_NUM) * CARD_OFFSET;
                    card.y = -50;
                }
                else {
                    card.x = i * CARD_OFFSET;
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
        this.emoji_node.getComponent(cc.Animation).play("emotion_" + id);
        this.scheduleOnce(function () {
            this.emoji_node.getComponent(cc.Animation).stop();
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
        chat_node.width = lbl.width + 10;
        chat_node.getComponent(cc.Animation).play();
    },

    //清除出牌
    clearOutCard: function () {
        for (var i = this.out_node.childrenCount - 1; i > -1; i--) {
            var node = this.out_node.children[i];
            if (node.name == 'top_card_ani1_left') {
                node.active = false;
            }
            else if (node.name == 'top_card_ani2_left') {
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
        this.node.parent.getComponent('xyddz_replay').setPoker(prefab, cardValue);
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('xyddz_replay').setDipai(prefab, cardValue);
    },
});
