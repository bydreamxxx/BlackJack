import { isLong } from 'long';

var FortuneHallManager = require('FortuneHallManager').Instance();
var ddz = require('ddz_util');
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('ddz_audio_cfg');
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
        player.name = ddz.filterEmoji(player.name);
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
        //if (headUrl && headUrl != '') {
        cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        //}
        //}
    },


    //显示player 节点
    showUI: function (bool) {
        if (bool) {
            this.node.active = true;
            this.headnode.active = true;
            this.headnode.getComponent(cc.Animation).play();
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

    //分摞发牌
    showFenluo(time) {
        cc.find('xuanpaizhong', this.headnode).active = true;
        this.showTimer(time, null, null);
    },
    hideFenluo() {
        cc.find('xuanpaizhong', this.headnode).active = false;
        this.hideTimer();
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

    showChangeCard(time) {
        cc.find('xuanpaizhong', this.headnode).active = true;
        this.showTimer(time, null, null);
    },
    onExchangeRet(cards, isReconnect) {
        this.hideTimer();
        cc.find('xuanpaizhong', this.headnode).active = false;
        var ex_left = cc.find('exchange/card/left', this.node.parent);
        ex_left.active = true;
        if (!isReconnect) {
            this.setRemainCardNum(this.remainCard - 3);
        }
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
        //todo:翻牌动画
        for (var i = 0; i < cards.length; i++) {
            this.setPoker(cc.find('top/dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node.parent), cards[i]);
        }
        cc.find('top/dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).play('dipai_rotate');
        this.scheduleOnce(function () {
            cc.find('top/dipai_info', this.node.parent).getComponent(cc.Animation).play('dipai_ani_jbc_2');
            this.calSpecialBottom(cardlist);
            for (var i = 0; i < cards.length; i++) {
                //cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent).scale = 0;
                this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
            }
        }.bind(this), 1);
        var cardNum = this.remainCard + cards.length;
        this.setRemainCardNum(cardNum);
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
            var cards = ddz.sortOutCards(cardlist);
            var startX = -135;
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.68;
            var cardWidth = NaN;
            var tp = ddz.analysisCards(cards).type;
            if (!last && tp == 1 && cards[0] == 172) {//
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TOPCARD, false);
                var node = this.top1_node;
                this.setPoker(node.getChildByName('ddz_poker_0'), cards[0]);
                if (isLord) {
                    node.getChildByName('ddz_poker_0').getChildByName('lord').active = true;
                }
                else {
                    node.getChildByName('ddz_poker_0').getChildByName('lord').active = false;
                }
                node.getChildByName('ddz_poker_0').scale = 0;
                node.active = true;
                var playFire = function () {
                    node.getComponent(cc.Animation).off('finished', playFire);
                    var pos = cc.v2(58, 72);
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
            else if (!last && tp == 2 && ddz.analysisCards(cards).index == 16) {//
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TOPCARD, false);
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
                    var pos = cc.v2(76, 72);
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
            }
            var cardNum = this.remainCard - cards.length;
            if (!last) {
                this.setRemainCardNum(cardNum);
                var type = ddz.analysisCards(cards).type;
                switch (type) {
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
                            AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TONGTIANSHUN, false);
                        } else {

                            //cc.find('Canvas/root').getComponent('ddz_game').playShunziAnimation(this.out_node, cc.v2(posX, 0));

                            var node = this.shunzi_node;
                            node.getComponent(sp.Skeleton).enabled = true;
                            node.getComponent(sp.Skeleton).clearTrack(0);
                            node.getComponent(sp.Skeleton).setAnimation(0, 'shunzi', false);
                            node.x = posX;
                            node.y = 40;
                            AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                        }

                        // this.scheduleOnce(function () {
                        //     var count = this.out_node.childrenCount;
                        //     var mid = this.out_node.children[Math.floor(count / 2)];
                        //     cc.find('Canvas/root').getComponent('ddz_game').playShunziAnimation(mid);
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
                        //cc.find('Canvas/root').getComponent('ddz_game').playLianduiAnimation(this.out_node, cc.v2(posX, 0));

                        var node = this.liandui_node;
                        node.getComponent(sp.Skeleton).enabled = true;
                        node.getComponent(sp.Skeleton).clearTrack(0);
                        node.getComponent(sp.Skeleton).setAnimation(0, 'liandui', false);
                        node.x = posX + 35;
                        node.y = 40;
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
                        cc.find('Canvas/root').getComponent('ddz_game_pyc').playBombAnimation('zuo');
                        break;
                    case 11://火箭
                        cc.find('Canvas/root').getComponent('ddz_game_pyc').playRocketAnimation('3');
                        break;
                    default:
                        break;
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
        this.node.parent.getComponent('ddz_game_pyc').setPoker(prefab, cardValue);
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('ddz_game_pyc').setDipai(prefab, cardValue);
    },
});
