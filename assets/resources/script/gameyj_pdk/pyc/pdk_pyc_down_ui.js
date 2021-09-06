var pdk = require('pdk_util');
var pdk_send_msg = require('pdk_send_msg');
const PDK_Data = require('pdk_data').PDK_Data;
const PDK_ED = require('pdk_data').PDK_ED;
const PDK_Event = require('pdk_data').PDK_Event;
var AudioManager = require('AudioManager');
var pdk_audio_cfg = require('pdk_audio_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const selectHeight = 25;        //提起牌高度
const paiBorder = 0;         //牌宽度边距 20.8
const cardWidth = 169;          //牌宽

const HANDNUM = 16;             //手牌数量

//操作类型
const opType = {
    NONE: -1,           //隐藏
    OUTCARD: 0,         //出牌
    YAOBUQI: 1,         //要不起
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
        shunzi_node: { type: cc.Node, default: null, },
        liandui_node: { type: cc.Node, default: null, },
        tongtianshun_node: { type: cc.Node, default: null, },
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
            if (!pdk.analysisCards(selectCards).type) {
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
        var counts = pdk.countRepeatCards(cards);
        var cardlist = pdk.kindSortCards(cards);
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
        player.name = pdk.filterEmoji(player.name);
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
        // if (headUrl && headUrl != '') {
        cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        // }
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
        if (this.hand_node.childrenCount > 0) {
            var offset = (this.hand_node.width + paiBorder - 77 * 2 - cardWidth * 0.9) / (HANDNUM - 1);
            var start = (this.hand_node.width + paiBorder - (this.hand_node.childrenCount - 1) * offset - cardWidth * 0.9) / 2;
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
        this._handCards = pdk.sortShowCards(cards);
        var showFunc = function () {
            cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation).stop();
            cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation).off('finished', null, this);
            if (this.soundid) {
                AudioManager.getInstance().stopSound(AudioManager.getInstance().getAudioID(this.soundid));
                this.soundid = null;
            }
            for (var i = 0; i < this._handCards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                card.name = this._handCards[i].toString();
                card.touched = null;
                card.scaleX = 0.9;
                card.scaleY = 0.9;
                var width = card.width * card.scaleX;
                var offset = (this.hand_node.width + paiBorder - 77 * 2 - width) / (HANDNUM - 1);
                var start = (this.hand_node.width + paiBorder - (this._handCards.length - 1) * offset - width) / 2;
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
            var sortcards = pdk.sortShowCards(cards);
            var ani = cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation);
            for (var i = 0; i < sortcards.length; i++) {
                this.setPoker(ani.node.children[i], sortcards[i]);
            }
            ani.off('finished', null, this);
            ani.on('finished', showFunc, this);
            if (sortcards.length == 15)
                ani.play('sendcard_ani15');
            else
                ani.play('sendcard_ani');
            // cc.find('Canvas/deal_card').active = true;
            // cc.find('Canvas/deal_card').getComponent(cc.Animation).on('finished', showFunc, this);
            this.soundid = pdk_audio_cfg.EFFECT.DEAL_CARD;
            AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.DEAL_CARD, true);
            // cc.find('Canvas/deal_card').getComponent(cc.Animation).play();
        }
        else {
            showFunc();
        }
    },

    /**
     * 显示操作
     */
    showOperation: function (type) {
        var ops = [];
        ops.push(cc.find('op_chupai', this.node));
        ops.push(cc.find('op_yaobuqi', this.node));
        for (var i = 0; i < ops.length; i++) {
            if (i == type) {
                ops[i].active = true;
                if (type == opType.OUTCARD) {
                    cc.find('op_chupai/must', this.node).opacity = 0;
                    var nopass = RoomMgr.Instance()._Rule ? RoomMgr.Instance()._Rule.isMustBeenPlay : true;
                    if (nopass) {
                        cc.find('pass', ops[i]).getComponent(cc.Button).interactable = false;
                    }
                    else {
                        cc.find('pass', ops[i]).getComponent(cc.Button).interactable = true;
                    }
                }
            }
            else {
                ops[i].active = false;
                ops[i].getComponentInChildren('ddz_timer').setActive(false);
            }
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
        cc.log(PDK_Data.Instance().lastCards);
        if (PDK_Data.Instance().lastCards && PDK_Data.Instance().lastCards.length > 0 && PDK_Data.Instance().lastPlayer != 0) {
            if (pdk.calCards(PDK_Data.Instance().lastCards, this._handCards, RoomMgr.Instance()._Rule)) {
                this.showOperation(opType.OUTCARD);
                cc.find('op_chupai/must', this.node).opacity = 255;
                cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = true;
                //cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = true;
                this.onSelectCardChanged();
                cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
            }
            else {//没有牌可以大过上家
                this.showOperation(opType.YAOBUQI);
                //time = 5;
                cc.find('op_yaobuqi', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
                if (!cc.find('tuoguan_node', this.node).active) {
                    //cc.find('nocard', this.node).getComponent(cc.Animation).play();
                    this.showNoCard(true);
                    //this.scheduleOnce(function () { pdk_send_msg.sendCards([]) }, 1);
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
    showOutCard: function (cardlist) {
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
            var cards = pdk.sortOutCards(cardlist);
            var scale = 0.4;
            var duration = 0.1;
            var endscale = 0.6;
            var midNode = cc.find(cards[Math.floor(cards.length / 2)].toString(), this.hand_node);
            if (!midNode) {
                cc.error('手牌找不到:' + cards[Math.floor(cards.length / 2)].toString());
                return;
            }
            var midX = midNode.x;

            if (cardlist.length < 3) {
                AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.CHUPAI, false);
            }
            else {
                AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.CHUPAIDA, false);
            }
            for (var i = 0; i < cards.length; i++) {
                var rNode = cc.find(cards[i].toString(), this.hand_node);
                rNode.removeFromParent();
                rNode.destroy();
                //cc.find(cards[i].toString(), this.hand_node).removeFromParent(true);
                var card = cc.instantiate(this.paiPre);
                var offset = (this.hand_node.width + paiBorder - cardWidth - 77 * 2) / (HANDNUM - 1);
                this.setPoker(card, cards[i]);
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
                        cc.find('Canvas/root').getComponent('pdk_game_pyc').playBombAnimation('zhu');
                    }
                    break;
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
                        AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.TONGTIANSHUN, false);
                    } else {
                        var node = this.shunzi_node;
                        node.getComponent(sp.Skeleton).enabled = true;
                        node.getComponent(sp.Skeleton).clearTrack(0);
                        node.getComponent(sp.Skeleton).setAnimation(0, 'shunzi', false);
                        node.x = posX;
                        node.y = this.out_node.height + 40;
                        AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.SHUNZI, false);
                    }
                    // this.scheduleOnce(function () {
                    //     var count = this.out_node.childrenCount;
                    //     var mid = this.out_node.children[Math.floor(count / 2)];
                    //     cc.find('Canvas/root').getComponent('pdk_game').playShunziAnimation(mid);
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
                    //cc.find('Canvas/root').getComponent('pdk_game').playLianduiAnimation(this.out_node, cc.v2(posX, this.out_node.height));

                    var node = this.liandui_node;
                    node.getComponent(sp.Skeleton).enabled = true;
                    node.getComponent(sp.Skeleton).clearTrack(0);
                    node.getComponent(sp.Skeleton).setAnimation(0, 'liandui', false);
                    node.x = posX + 50;
                    node.y = this.out_node.height + 40;
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
                    cc.find('Canvas/root').getComponent('pdk_game_pyc').playBombAnimation('zhu');
                    break;
                case 11://火箭
                    cc.find('Canvas/root').getComponent('pdk_game_pyc').playRocketAnimation('1');
                    break;
                default:
                    break;
            }
            if (type == 0 && stype == 2) {//飞机少带
                cc.find('Canvas/root').getComponent('pdk_game_pyc').playAirplaneAnimation();
            }
        }
    },
    displayOutCard: function (cardlist) {
        this.clearOutCard();
        var endscale = 0.6;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            var cards = pdk.sortOutCards(cardlist);
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                var offset = (this.hand_node.width + paiBorder - cardWidth - 77 * 2) / (HANDNUM - 1);
                this.setPoker(card, cards[i]);
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
        var changeList = msg.changeListList.sort(function (a, b) { return PDK_Data.Instance().idToView(a.userId) - PDK_Data.Instance().idToView(b.userId) });
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
        if (!bool) {
            var game = this.node.parent.getComponent('pdk_game_pyc');
            if (game && game.curPlayer == 0) {
                if (PDK_Data.Instance().lastCards && PDK_Data.Instance().lastCards.length > 0 && PDK_Data.Instance().lastPlayer != 0) {
                    if (!pdk.calCards(PDK_Data.Instance().lastCards, this._handCards, RoomMgr.Instance()._Rule)) {//没有牌可以大过上家
                        this.scheduleOnce(this.fixAutoPass, 1);
                    }
                }
            }
        }
    },

    //修复要不起情况下取消托管卡死问题
    fixAutoPass() {
        var game = this.node.parent.getComponent('pdk_game_pyc');
        if (game && game.curPlayer == 0) {
            if (PDK_Data.Instance().lastCards && PDK_Data.Instance().lastCards.length > 0 && PDK_Data.Instance().lastPlayer != 0) {
                if (!pdk.calCards(PDK_Data.Instance().lastCards, this._handCards, RoomMgr.Instance()._Rule)) {//没有牌可以大过上家
                    this.onPass();
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

    getAllCards() {
        var cards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            var card = parseInt(this.hand_node.children[i].name);
            cards.push(card);
        }
        return cards;
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
            AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.CHOUPAI, false);
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
        var selectAll = selectCards.length == this.hand_node.children.length;
        //出牌
        if (pdk.compareCards(PDK_Data.Instance().lastCards, selectCards, RoomMgr.Instance()._Rule, this.getAllCards())) {
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
        pdk_send_msg.tuoGuan(true);
    },

    //重置UI
    resetUI: function () {
        this.showNoCard(false);
        this.clearOutCard();
        this.clearHandCards();
        cc.find('op', this.node).active = false;
        cc.find('weak', this.headnode).active = false;
        cc.find('banker', this.headnode).active = false;
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('pdk_game_pyc').setDipai(prefab, cardValue);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        this.node.parent.getComponent('pdk_game_pyc').setPoker(prefab, cardValue);
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
        PDK_ED.notifyEvent(PDK_Event.BG_CLICK, null);
    },

    //叫分
    onCallScore: function (event, data) {
        var score = parseInt(data);
        pdk_send_msg.callScore(score);
    },

    onCallDouble: function (event, data) {
        if (data == 'true') {
            pdk_send_msg.callDouble(true);
        }
        else {
            pdk_send_msg.callDouble(false);
        }
    },


    //不出
    onPass: function (event, data) {
        var cards = [];
        pdk_send_msg.sendCards(cards);
    },

    //提示
    onTips: function (event, data) {
        if (!pdk.calCards(PDK_Data.Instance().lastCards, this._handCards, RoomMgr.Instance()._Rule)) {//不出
            pdk_send_msg.sendCards([]);
            return;
        }
        if (this.tipIndex == null || this.tipIndex == -1) {
            var next = this.node.parent.getComponent('pdk_game_pyc').getNextPlayer(0);
            var remian = this.node.parent.getComponent('pdk_game_pyc')._uiComponents[next].getHandCardNum();
            this.tipArray = pdk.calCards(PDK_Data.Instance().lastCards, this._handCards, RoomMgr.Instance()._Rule, remian == 1);
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
        var res = pdk.analysisCards(selectCards);
        if (res.type || res.stype) {
            pdk_send_msg.sendCards(selectCards);
        }
    },

    //取消托管
    onCancelAuto: function (event, data) {
        pdk_send_msg.tuoGuan(false);
    },
    ///////////////////////////////////////////// 按钮点击 end //////////////////////////////////////////
});
