var pdk = require('pdk_util');
var AudioManager = require('AudioManager');
var pdk_audio_cfg = require('pdk_audio_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const CARD_OFFSET = 30;//出牌间距

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
        shunzi_node: { type: cc.Node, default: null, },
        liandui_node: { type: cc.Node, default: null, },
        tongtianshun_node: { type: cc.Node, default: null, },
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音
    },

    // use this for initialization
    onLoad: function () {
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

    //初始化玩家信息
    initPlayerInfo: function (player) {
        player.name = pdk.filterEmoji(player.name);
        this.goldlbl.string = cc.dd.Utils.getNumToWordTransform(player.score);
        this.namelbl.string = cc.dd.Utils.substr(player.name, 0, 6);
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
        // if (headUrl && headUrl != '') {
        cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        // }
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
        cc.find('weak', this.headnode).active = false;
        cc.find('banker', this.headnode).active = false;
        this.clearOutCard();
        this.remainNode.active = false;
    },

    //显示准备
    showReady: function (bool) {
        bool = bool ? true : false;
        cc.find('ready', this.headnode).active = bool;
    },

    //发牌显示
    playSendCards: function (cards) {
        this.setRemainCardNum(cards.length);
        this.remainNode.active = true;
    },

    //打牌中
    showPlaying: function (time, curtime) {
        cc.log('上家打牌中...');
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
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.isShowLeftCardsNum == false) {
            cc.find('lbl', this.remainNode).active = false;
        }
        else {
            cc.find('lbl', this.remainNode).active = true;
            cc.find('lbl', this.remainNode).getComponent(cc.Label).string = num.toString();
        }
        if (num > 0 && num < 2) {
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
        cc.log('上家打牌:' + cardlist);
        this.clearOutCard();
        cc.log('上家清除出牌');
        this.hideTimer();
        cc.log('上家关闭倒计时');
        const ONE_LINE_NUM = 10;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var cards = pdk.sortOutCards(cardlist);
            var startX = -135;
            var scale = 0.4;
            var duration = 0.1;
            var endscale = 0.56;

            if (cardlist.length < 3) {
                AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.CHUPAI, false);
            }
            else {
                AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.CHUPAIDA, false);
            }
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.outcard_pre);
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
                    if (isLord && i == ONE_LINE_NUM - 1) {
                        cc.find('lord', card).active = true;
                    }
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
                var type = pdk.analysisCards(cards).type;
                var stype = pdk.analysisCards(cards).stype;
                switch (type) {
                    case 3://三张
                        var aaa = false;
                        cards.forEach(function (card) {
                            if (parseInt(card / 10) == 14) {
                                aaa = true;
                            }
                        });
                        if (aaa && RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.isBombOfAaa) {
                            cc.find('Canvas/root').getComponent('pdk_game_pyc').playBombAnimation('zuo');
                        }
                        break;
                    case 5://顺子
                        var tongtianshun = false;
                        cards.forEach(function (card) {
                            if (parseInt(card / 10) == 14) {
                                tongtianshun = true;
                            }
                        });
                        var posX = 0;
                        if (cards.length > ONE_LINE_NUM) {
                            posX = ONE_LINE_NUM / 2 * CARD_OFFSET;
                        }
                        else {
                            posX = cards.length / 2 * CARD_OFFSET;
                        }

                        if (tongtianshun) {
                            this.tongtianshun_node.active = true;
                            this.tongtianshun_node.x = posX + 30;
                            this.tongtianshun_node.y = 40;
                            this.tongtianshun_ani.playAnimation('TTS', 1);
                            AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.TONGTIANSHUN, false);
                        } else {

                            //cc.find('Canvas/root').getComponent('pdk_game').playShunziAnimation(this.out_node, cc.v2(posX, 0));

                            var node = this.shunzi_node;
                            node.getComponent(sp.Skeleton).enabled = true;
                            node.getComponent(sp.Skeleton).clearTrack(0);
                            node.getComponent(sp.Skeleton).setAnimation(0, 'shunzi', false);
                            node.x = posX;
                            node.y = 40;
                            AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.SHUNZI, false);
                        }

                        // this.scheduleOnce(function () {
                        //     var count = this.out_node.childrenCount;
                        //     var mid = this.out_node.children[Math.floor(count / 2)];
                        //     cc.find('Canvas/root').getComponent('pdk_game').playShunziAnimation(mid);
                        //     //cc.find('shunzi', this.out_node).getComponent(cc.Animation).play();
                        // }.bind(this), duration);
                        break;
                    case 6://连对
                        var posX = 0;
                        if (cards.length > ONE_LINE_NUM) {
                            posX = ONE_LINE_NUM / 2 * CARD_OFFSET;
                        }
                        else {
                            posX = cards.length / 2 * CARD_OFFSET;
                        }
                        //cc.find('Canvas/root').getComponent('pdk_game').playLianduiAnimation(this.out_node, cc.v2(posX, 0));

                        var node = this.liandui_node;
                        node.getComponent(sp.Skeleton).enabled = true;
                        node.getComponent(sp.Skeleton).clearTrack(0);
                        node.getComponent(sp.Skeleton).setAnimation(0, 'liandui', false);
                        node.x = posX + 35;
                        node.y = 40;
                        AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.SHUNZI, false);
                        // this.scheduleOnce(function () {
                        //     var count = this.out_node.childrenCount;
                        //     var mid = this.out_node.children[Math.floor(count / 2)];
                        //     cc.find('Canvas/root').getComponent('pdk_game').playLianduiAnimation(mid);
                        //     //cc.find('shunzi', this.out_node).getComponent(cc.Animation).play();
                        // }.bind(this), duration);
                        break;
                    case 7://飞机不带
                    case 8://飞机
                        cc.find('Canvas/root').getComponent('pdk_game_pyc').playAirplaneAnimation();
                        break;
                    case 10://炸弹
                        cc.find('Canvas/root').getComponent('pdk_game_pyc').playBombAnimation('zuo');
                        break;
                    case 11://火箭
                        cc.find('Canvas/root').getComponent('pdk_game_pyc').playRocketAnimation('3');
                        break;
                    default:
                        break;
                }
                if (type == 0 && stype == 2) {//飞机少带
                    cc.find('Canvas/root').getComponent('pdk_game_pyc').playAirplaneAnimation();
                }
            }
        }
        cc.log('上家出牌完成');
    },
    displayOutCard: function (cardlist, isLord) {
        this.clearOutCard();
        const ONE_LINE_NUM = 10;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var cards = pdk.sortOutCards(cardlist);
            var startX = -135;
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.outcard_pre);
                this.setPoker(card, cards[i]);
                if (isLord) {
                    cc.find('lord', card).active = true;
                }
                this.out_node.addChild(card);
                card.setSiblingIndex(i);
                card.scaleX = 0.56;
                card.scaleY = 0.56;
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

    //显示庄
    showBanker(show) {
        if (show) {
            cc.find('banker', this.headnode).active = true;
            cc.find('banker', this.headnode).getComponent(cc.Animation).play();
        }
        else {
            cc.find('banker', this.headnode).active = false;
        }
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
        this.node.parent.getComponent('pdk_game_pyc').setPoker(prefab, cardValue);
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('pdk_game_pyc').setDipai(prefab, cardValue);
    },
});
