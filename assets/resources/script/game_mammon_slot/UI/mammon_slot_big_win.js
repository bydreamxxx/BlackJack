// create by wj 2018/12/18
var SlotCfg = require('SlotCfg');
const slot_audio = require('slotaudio');
var AudioManager = require('AudioManager').getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oResultTxt: cc.Label,
        dragonBonesNode: sp.Skeleton,
        m_oCoinAnim: cc.Node,
        m_nIndex: 0,
        m_nwinNum: 0,
        m_nBetNum: 0,
        m_bPlay: false,
        m_nTimer: 0,
    },


    onLoad: function () {

    },

    update: function (dt) {
        if (this.m_bPlay) {
            this.m_nTimer += dt;
            if (this.m_nTimer >= 0.1) {
                var addNum = parseInt(this.m_oResultTxt.string) + this.m_nWeight;
                if (addNum >= this.m_nwinNum) {
                    addNum = this.m_nwinNum;
                    this.m_bPlay = false;
                    var self = this;
                    var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        if (self.canEnd) {
                            self.quitWindow();
                        }
                        self.node.stopAllActions();
                    }));
                    this.node.runAction(seq);
                }
                this.m_oResultTxt.string = addNum;
                this.m_nTimer = 0;
            }
        }
    },

    //设置结算数据
    setResultNum: function (num, wintype, bet) {
        this.m_nwinNum = num;
        this.m_nBetNum = bet;

        this.m_oResultTxt.string = 0;
        if (wintype == 1) {//大赢家
            this.playBigWinAct(false);
            this.playAudio(1025033);

        } else {//超级大赢家
            this.playBigWinAct(true);
            this.playAudio(1025034);

        }
    },

    //播放大赢家
    playBigWinAct: function (isPlayMega) {
        this.canEnd = false;
        this.m_nWeight = parseInt(this.m_nBetNum * 10 / 30);
        this.m_bPlay = true;
        this.playCoinAnim(200, 0.02);
        this.dragonBonesNode.clearTracks();
        this.dragonBonesNode.setAnimation(0, 'BIGWINCC', false);
        var self = this;
        this.dragonBonesNode.setCompleteListener(function () {
            self.m_oResultTxt.node.active = true;
            self.dragonBonesNode.setAnimation(0, 'BIGWINXH', false);
            self.dragonBonesNode.setCompleteListener(function () {
                self.canEnd = true;
                if (!self.m_bPlay) {
                    self.quitWindow();
                }
                if (isPlayMega)
                    self.playMegaWinAct();
            });
        });
    },

    //播放超级大赢家
    playMegaWinAct: function () {
        this.canEnd = false;
        //this.dragonBonesNode.clearTracks();
        this.m_nWeight = parseInt((this.m_nwinNum - this.m_nBetNum * 20) / 50);
        if (this.m_nWeight == 0) {
            this.m_nWeight = 100000
        }
        this.playCoinAnim(80, 0.01);
        this.dragonBonesNode.setAnimation(0, 'MEGAWINCC', false);
        var self = this;
        this.dragonBonesNode.setCompleteListener(function () {
            self.m_oResultTxt.node.active = true;
            self.dragonBonesNode.setAnimation(0, 'MEGAWINXH', false);
            self.dragonBonesNode.setCompleteListener(function () {
                // cc.dd.UIMgr.destroyUI(self.node);
                self.canEnd = true;
                if (!self.m_bPlay) {
                    self.quitWindow();
                }
            });
        });
    },

    playCoinAnim: function (totalCount, delayTimer) {
        if (this.m_nIndex == totalCount)
            return;
        var self = this;
        var node = cc.instantiate(this.m_oCoinAnim);
        node.active = true;
        node.getComponent(cc.Animation).play('coinRotateAnim');
        var x = Math.floor(Math.random() * (640 - 0 + 1) + 0);
        var tag = Math.round(Math.random());
        if (tag == 0)
            x = -x;
        parseInt(Math.random() * (720 - 360 + 1) + 360, 10);
        var q1_y = Math.floor(Math.random() * (720 - 360 + 1) + 360);
        parseInt(Math.random() * (360 - 290 + 1) + 290, 10);
        var q2_y = Math.floor(Math.random() * (360 - 290 + 1) + 290);
        var q1 = cc.v2(x, q1_y);
        var q2 = cc.v2(x, q2_y);
        var coin_endPos = cc.v2(x, - 360);
        var bezier = [q1, q2, coin_endPos];
        var time = 1;
        var bezierAct = cc.bezierTo(time, bezier);
        node.scaleX = 0.6;
        node.scaleY = 0.6;
        var scale = parseInt(Math.random() * (14 - 11) + 11, 10) / 10;
        var scaleAct = cc.scaleTo(0.5, scale);
        node.runAction(cc.sequence(cc.spawn(bezierAct, scaleAct, cc.sequence(cc.delayTime(delayTimer), cc.callFunc(function () {
            self.playCoinAnim(totalCount, delayTimer);
            self.m_nIndex += 1;
        }))), cc.callFunc(function () {
            node.active = false;
            node.removeFromParent();
            if (self.m_nIndex >= totalCount) {
                var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                    //self.quitWindow();
                    node.stopAllActions();
                }));
                self.node.runAction(seq);
            }
        })));
        node.parent = this.m_oCoinAnim.parent;
    },

    //播放相应音效
    playAudio: function (audioId) {
        var data = slot_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(SlotCfg.AudioMammonPath + name);
    },

    quitWindow: function () {
        var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('mammon_slot_ui');
        if (slotMainUI) {
            slotMainUI.updateResult();
            slotMainUI.playBackGround();
            slotMainUI.quitBigWin();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
