//create by wj 2018/06/20
var hallData = require('hall_common_data').HallCommonData;
const TinyGameType = require('TinyGameType').TinyGameType;
var gSlotMgr = require('SlotManger').SlotManger.Instance();
var slotSender = require('gameyj_slot_sender').SlotSender.getInstance();
var SlotCfg = require('SlotCfg');
const slot_audio = require('slotaudio');
const SlotType = require('SlotType').SlotType;
var AudioManager = require('AudioManager').getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oMainNode: cc.Node,
        historyNode: { default: [], type: cc.Sprite, tooltip: '历史结果' },
        m_oRoleAnim: { default: [], type: cc.Animation, tooltip: '人物动画' },

        yaZhuSprite: cc.Sprite,
        yaZhuSpriteFrame: { default: [], type: cc.SpriteFrame, tooltip: '押注图片' },
        m_nIndex: 0,
        Atlas: cc.SpriteAtlas,
        btnStateAtlas: cc.SpriteAtlas,
        m_nResultNum: 0,
        m_nCurrentAudioId: 0,
        m_nMusicId: 0,
        m_bIsWaitting: true,

        m_nWeight: 1,//权值
        m_nBetMin: 0, //最小押注值
        m_bGetAward: false,
        m_oLeftAnimation: cc.Animation,
        m_oRightAnimation: cc.Animation,

        m_oLeftRoleAnimation: cc.Animation,
        m_oRightRoleAnimation: cc.Animation,

        resultNode: cc.Node,
        m_nUserCurGold: 0,
        m_oDescNode: cc.Node,
    },

    onLoad: function () {
        this.playAudio(101405);
        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "Text_UserGold").getComponent(cc.Label);
        if (this.m_oUserGold)
            this.m_oUserGold.string = this.changeNumToCHN(gSlotMgr.getGold());
        this.m_nUserCurGold = gSlotMgr.getGold();
        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "name").getComponent(cc.Label);
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 6);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "headMask").getComponent('klb_hall_Player_Head');
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'compare_game_init');
        //打开/输/赢 的骰子
        this.m_oTouziImg_0 = cc.dd.Utils.seekNodeByName(this.m_oRoleAnim[2].node, "touzi").getComponent(cc.Sprite);
        this.m_oTouziImg_1 = cc.dd.Utils.seekNodeByName(this.m_oRoleAnim[3].node, "touzi").getComponent(cc.Sprite);
        this.m_oTouziImg_2 = cc.dd.Utils.seekNodeByName(this.m_oRoleAnim[4].node, "touzi").getComponent(cc.Sprite);

        this.awardTxt = cc.dd.Utils.seekNodeByName(this.node, "awrad").getComponent(cc.Label);
        if (this.awardTxt)
            this.awardTxt.string = gSlotMgr.getResultFen();
        this.winNode = cc.dd.Utils.seekNodeByName(this.node, "winNode");
        this.m_oWinNumTxt = this.winNode.getChildByName('num').getComponent(cc.Label);
        this.m_nBetMin = gSlotMgr.getBetMin() / 100;

        this.m_oLeftAnimation.play();
        this.m_oRightAnimation.play();

        var Btn = cc.dd.Utils.seekNodeByName(this.node, "backBtn");
        Btn.getComponent(cc.Button).interactable = false;
        var state = Btn.getChildByName('btnState').getComponent(cc.Button);
        state.interactable = false;
        var BtnCover = cc.dd.Utils.seekNodeByName(this.node, "btnCover");
        BtnCover.getComponent(cc.Button).interactable = false;

        var singleBtn = cc.dd.Utils.seekNodeByName(this.node, "double");
        if (gSlotMgr.getResultFen() > gSlotMgr.getGold()) {
            singleBtn.getComponent(cc.Button).interactable = false;
            singleBtn.getChildByName('desc').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
        }

        var self = this;
        var actionCallBack = function () {
            self.m_oRightAnimation.off('finished', actionCallBack);
            if (AudioManager._getLocalMusicSwitch()) {
                self.m_nMusicId = AudioManager.playMusic(SlotCfg.AuditoPath + 'Bg_Bet');
            }

            var seq = cc.sequence(cc.delayTime(0.05), cc.callFunc(function () {
                self.gameState(TinyGameType.GameSate.WaitGame);
                gSlotMgr.setDownBtnState(SlotType.DownBtnState.Down);
            }));
            self.node.runAction(seq);
        }

        this.m_oRightAnimation.on('finished', actionCallBack);
        //this.gameState(TinyGameType.GameSate.StartGame);
        this.setButtonEnabel(false);
        this.setHistoryList(false);
    },

    update: function (dt) {
        if (this.m_bGetAward) {
            var totalnum = parseInt(gSlotMgr.getTinyGameData().getAwardMoney());
            this.m_nWeight = Math.ceil(totalnum / 50);
            var num = parseInt(this.m_oWinNumTxt.string);
            if (num > 0) {
                num -= this.m_nWeight;
                this.m_nUserCurGold = this.m_nUserCurGold + this.m_nWeight;
                if (num <= 0)
                    num = 0;
                this.m_oWinNumTxt.string = num;
                this.awardTxt.string = num;
                if (num == 0)
                    this.m_nUserCurGold = gSlotMgr.getGold();
                if (this.m_nUserCurGold > gSlotMgr.getGold())
                    this.m_nUserCurGold = gSlotMgr.getGold();
                this.m_oUserGold.string = this.changeNumToCHN(this.m_nUserCurGold);
                if (num == 0) {
                    this.m_nWeight = 1;
                    this.winNode.active = false;
                    gSlotMgr.setResultFen(0);
                    var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
                    if (slotMainUI) {
                        slotMainUI.playBackGround();
                        slotMainUI.updateGold();
                        slotMainUI.OnEffectEnd();
                    }
                    cc.dd.UIMgr.destroyUI(this.node);
                }
            } else {
                this.m_nWeight = 1;
                this.winNode.active = false;
                gSlotMgr.setResultFen(0);
                var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
                if (slotMainUI) {
                    slotMainUI.playBackGround();
                    slotMainUI.updateGold();
                    slotMainUI.OnEffectEnd();
                }
                cc.dd.UIMgr.destroyUI(this.node);
            }
        }

    },

    updateUserGold: function (newGold) {
        this.m_oUserGold.string = this.changeNumToCHN(newGold);
        this.m_nUserCurGold = newGold;
    },

    //播放相应音效
    playAudio: function (audioId) {
        var data = slot_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        AudioManager.playSound(SlotCfg.AuditoPath + name);
    },

    stopAudio: function (audioId) {

        AudioManager.stopSound(audioId);
    },

    //设置下注按钮是否可操作
    setButtonEnabel: function (enabel) {
        cc.dd.Utils.seekNodeByName(this.node, "small_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "single_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "double_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "big_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "one_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "two_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "three_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "four_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "five_btn").getComponent(cc.Button).interactable = enabel;
        cc.dd.Utils.seekNodeByName(this.node, "six_btn").getComponent(cc.Button).interactable = enabel;
    },

    //设置类型选择按钮是否可操作
    setButtonTypeEnabel: function (enabel) {
        var Btn = cc.dd.Utils.seekNodeByName(this.node, "backBtn");
        Btn.getComponent(cc.Button).interactable = enabel;
        var state = Btn.getChildByName('btnState').getComponent(cc.Button);
        state.interactable = enabel;
        var BtnCover = cc.dd.Utils.seekNodeByName(this.node, "btnCover");
        BtnCover.getComponent(cc.Button).interactable = enabel;

        var smallBtn = cc.dd.Utils.seekNodeByName(this.node, "half");
        smallBtn.getComponent(cc.Button).interactable = enabel;
        smallBtn.getChildByName('desc').getComponent(cc.LabelOutline).color = enabel ? new cc.Color(143, 79, 19, 255) : new cc.Color(181, 175, 175, 255);
        var singleBtn = cc.dd.Utils.seekNodeByName(this.node, "double");
        singleBtn.getComponent(cc.Button).interactable = enabel;
        singleBtn.getChildByName('desc').getComponent(cc.LabelOutline).color = enabel ? new cc.Color(143, 79, 19, 255) : new cc.Color(181, 175, 175, 255);
        if (gSlotMgr.getTinyGameData().getAwardMoney() > gSlotMgr.getGold()) {
            singleBtn.getComponent(cc.Button).interactable = false;
            singleBtn.getChildByName('desc').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
        }
        var doubleBtn = cc.dd.Utils.seekNodeByName(this.node, "complete");
        doubleBtn.getComponent(cc.Button).interactable = enabel;
        doubleBtn.getChildByName('desc').getComponent(cc.LabelOutline).color = enabel ? new cc.Color(143, 79, 19, 255) : new cc.Color(181, 175, 175, 255);
    },
    //设置历史结果
    setHistoryList: function (needRun) {
        var historyList = gSlotMgr.getTinyGameData().getHistoryList();
        var moveAct = null;
        var index = 0;
        for (var i = 0; i < historyList.length; i++) {
            this.historyNode[i].spriteFrame = this.Atlas.getSpriteFrame('shz_img_dice_jilu_' + historyList[i]);
            if (needRun) {
                if (historyList.length - 1 == i) {
                    this.m_nEndPos = this.historyNode[i].node.getPosition();
                    var startPos = this.historyNode[9].node.getPosition();
                    this.historyNode[i].node.setPosition(startPos);
                    moveAct = cc.moveTo(0.5, cc.v2(this.m_nEndPos.x, this.m_nEndPos.y));
                    index = i;
                }
            }
            this.historyNode[i].node.active = true;
        }
        if (needRun)
            this.historyNode[index].node.runAction(moveAct);
    },
    setResult: function () {
        var pointsList = gSlotMgr.getTinyGameData().getPoints();
        var spriteSp = this.Atlas.getSpriteFrame('shz_img_dice_small' + pointsList[0]);
        if (this.m_oTouziImg_0) {
            this.m_oTouziImg_0.spriteFrame = spriteSp;
            this.m_oTouziImg_0.node.active = true;
        }
        if (this.m_oTouziImg_1) {
            this.m_oTouziImg_1.spriteFrame = spriteSp;
            this.m_oTouziImg_1.node.active = true;
        }
        if (this.m_oTouziImg_2) {
            this.m_oTouziImg_2.spriteFrame = spriteSp;
            this.m_oTouziImg_2.node.active = true;
        }
        this.m_nResultNum = pointsList[0];
    },

    hideUI: function () {
        if (this.m_oTouziImg_0) {
            this.m_oTouziImg_0.node.active = false;
        }
        if (this.m_oTouziImg_1) {
            this.m_oTouziImg_1.node.active = false;
        }
        if (this.m_oTouziImg_2) {
            this.m_oTouziImg_2.node.active = false;
        }
        this.yaZhuSprite.node.active = false;
        this.resultNode.active = false;
    },

    //设置人物动画显示
    setRolePlayAnimByIndex: function (index, callFunc) {
        for (var i = 0; i < 5; i++) {
            if (i == index) {
                this.m_oRoleAnim[i].node.active = true;
                this.m_oRoleAnim[i].play();
                if (callFunc)
                    this.m_oRoleAnim[i].on('finished', callFunc);
            } else {
                this.m_oRoleAnim[i].stop();
                this.m_oRoleAnim[i].node.active = false;
            }
        }
    },

    gameState: function (state) {
        if (state == TinyGameType.GameSate.StartGame) {
            this.playAudio(101314);

            this.node.stopAllActions();
            var self = this;
            var actionCallBack4 = function () {
                self.m_oRoleAnim[1].off('finished', actionCallBack4);
                self.node.stopAllActions();
                self.playAudio(101316);
                var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    self.gameState(TinyGameType.GameSate.WaitGame);
                }));
                self.node.runAction(seq);
            }

            this.setRolePlayAnimByIndex(1, actionCallBack4);
            this.m_oLeftRoleAnimation.play('leftRoleAnim1');
            this.m_oRightRoleAnimation.play('rightRoleAnim3');

        } else if (state == TinyGameType.GameSate.WaitGame) {//等待游戏
            if (this.m_bIsWaitting == false)
                return;
            //循环播放
            this.setRolePlayAnimByIndex(0, null);
            this.m_oLeftRoleAnimation.play('leftRoleAnim');
            this.m_oRightRoleAnimation.play('rightRoleAnim2');

        } else if (state == TinyGameType.GameSate.OpenGame) {
            this.m_bIsWaitting = false;
            this.stopAudio(this.m_nCurrentAudioId);
            //this.m_nCurrentAudioId = this.playAudio(101315);
            this.node.stopAllActions();
            this.setResult();

            var self = this;
            var actionCallBack1 = function () {
                self.m_oRoleAnim[2].off('finished', actionCallBack1);
                self.playAudio(101299 + self.m_nResultNum);
                var seq = cc.sequence(cc.delayTime(0.6), cc.callFunc(function () {
                    self.gameState(TinyGameType.GameSate.ResultGame);
                }));
                self.node.runAction(seq);
            }
            this.setRolePlayAnimByIndex(2, actionCallBack1);
            this.m_oLeftRoleAnimation.play('leftRoleAnim1');
            this.m_oRightRoleAnimation.play('rightRoleAnim3');
        } else if (state == TinyGameType.GameSate.ResultGame) {
            this.setHistoryList(true);
            //this.node.stopAllActions();            
            var touzi = this.resultNode.getChildByName('touzi1');
            this.resultNode.active = true;
            touzi.getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame('shz_img_dice_big' + this.m_nResultNum);

            var index = gSlotMgr.getTinyGameData().getAwardMoney() > 0 ? 0 : 1;
            if (index == 0) {//玩家获胜
                this.winNode.active = true;
                this.winNode.getComponent(cc.Animation).play();
                if (this.m_oWinNumTxt)
                    this.m_oWinNumTxt.string = gSlotMgr.getTinyGameData().getAwardMoney();
                this.awardTxt.string = gSlotMgr.getTinyGameData().getAwardMoney();

                var self = this;
                self.playAudio(101312);
                self.playAudio(101406);
                var actionCallBack2 = function () {
                    self.m_oRoleAnim[3].off('finished', actionCallBack2);
                    self.m_bIsWaitting = true;

                    var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                        self.setButtonTypeEnabel(true);
                        self.hideUI();
                        self.gameState(TinyGameType.GameSate.WaitGame);
                    }));
                    self.node.runAction(seq);
                }
                this.setRolePlayAnimByIndex(3, actionCallBack2);
                this.m_oLeftRoleAnimation.play('leftRoleAnim1');
                this.m_oRightRoleAnimation.play('rightRoleAnim1');
            } else {
                var self = this;
                self.playAudio(101313);
                self.playAudio(101407);
                var actionCallBack3 = function () {
                    self.m_oRoleAnim[4].off('finished', actionCallBack3);
                    cc.audioEngine.stop(self.m_nMusicId);
                    AudioManager.stopMusic();
                    gSlotMgr.setResultFen(0);
                    var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                        var slotMainUI = gSlotMgr.getSlotMainUI();
                        if (slotMainUI) {
                            slotMainUI.playBackGround();
                            slotMainUI.updateGold();
                            slotMainUI.OnEffectEnd();
                        }

                        cc.dd.UIMgr.destroyUI(self.node);
                    }));
                    self.node.runAction(seq);
                }
                this.setRolePlayAnimByIndex(4, actionCallBack3);
                this.m_oLeftRoleAnimation.play('leftRoleAnim2');
                this.m_oRightRoleAnimation.play('rightRoleAnim');

            }
        }
    },
    //选择押注类型
    onClickYaType: function (event, data) {
        this.playAudio(101405);
        this.winNode.active = false;
        this.m_oDescNode.active = true;
        this.setButtonTypeEnabel(false);
        slotSender.compareType(parseInt(data));
        this.gameState(TinyGameType.GameSate.StartGame);
        if (parseInt(data) == 3)
            this.awardTxt.string = parseInt(parseInt(this.awardTxt.string) / 2);
        else if (parseInt(data) == 1)
            this.awardTxt.string = parseInt(parseInt(this.awardTxt.string) * 2);
    },

    //押注
    onClickYa: function (event, data) {
        this.setButtonEnabel(false);
        this.m_oDescNode.active = false;
        this.yaZhuSprite.node.active = true;
        this.yaZhuSprite.node.setPosition(event.target.getPosition());
        this.yaZhuSprite.spriteFrame = this.yaZhuSpriteFrame[0];
        this.stopAudio(this.m_nCurrentAudioId);
        slotSender.startCompareGame(parseInt(data));
    },
    //退出游戏
    onClickQuit: function (event, data) {
        this.playAudio(101003);
        gSlotMgr.awardFen();
        gSlotMgr.setNeedUpdateGold(true);
        cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.stopMusic();
        this.m_bGetAward = true;
    },

    //点击充值按钮
    onClickRechargeBtn: function (event, data) {
        this.playAudio(101100);
        cc.dd.DialogBoxUtil.show(1, '是否立即前往大厅充值？', '确定', '取消',
            function () {
                gSlotMgr.quitGame();
                cc.dd.SceneManager.enterHallRecharge();
            }, null
        );
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },
});
