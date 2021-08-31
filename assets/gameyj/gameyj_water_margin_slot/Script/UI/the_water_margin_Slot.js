//create by wj 2018/06/06
var arrayCtrl = require('ArrayCtrl').ArrayCtrl;
var SlotCfg = require('SlotCfg');
var gSlotMgr = require('SlotManger').SlotManger.Instance();
var SlotType = require('SlotType').SlotType;
const data_slotcard = require('slotcard');
const slot_audio = require('slotaudio');
const sfz_base_pay = require('sfz_base_pay');
var hallData = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const hall_prop_data = require('hall_prop_data').HallPropData;
var AudioManager = require('AudioManager').getInstance();
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tRunTimer: [], //老虎机时间管理数组
        m_tLinePosContainter: [], //
        m_tWinLineContainer: [],//保存中奖后坐标点
        m_nIndex: 0, //赢线
        m_nTimerControl: 0, //长按时间控制
        //判定滚筒结束点
        m_tRunEndTag: [],
        m_tRunEndTimer: [],
        //是否进入小游戏
        m_isEnterSmallGame: false,
        //背景音效ƒ
        m_oAudioEffectId: 0,
        //音效时间控制
        m_bNeedAudioControl: false,
        m_playLong: false,
        m_oplayLongTimer: 0,
        m_nAudioTimer: 0,
        m_bAutoLongAudio: 0,

        m_bFirstGetBetMsg: false,
        atlas: cc.SpriteAtlas,

        iconOffset: 138,
        lineEffectTime: 2,

        m_btnDownState: SlotType.DownBtnState.Down,
        m_nRunEndTag: 0,

        freeCard: -1,
        bounsCard: 0,

        //操作点击按钮
        m_oOpBtn: cc.Sprite,
        m_oCompareBtn: cc.Button,
        m_oAutoBtn: cc.Button,
        m_oYaAllBtn: cc.Button,
        btnAtlas: cc.SpriteAtlas,
        m_oRuleUI: cc.Node,
        m_oAddFenBtn: cc.Button,
        m_oSubFenBtn: cc.Button,
        //菜单列表
        m_oMenuListNode: cc.Node,

        cardAnimaClips: { default: [], type: cc.AnimationClip, tooltip: '卡片特效' },
        cardRunAnimaClips: { default: [], type: cc.AnimationClip, tooltip: '卡片播放特效' },

        m_nWeight: 1,//权值
        m_nBetMin: 0, //最小押注值

        m_oYaZhuNode: cc.Node,
        m_oAutoSelectNode: cc.Node,
        m_nAutoCount: 0,
        m_nRunAudioId: 0,

        m_tWinLines: [],
        m_bCanSelesctAuto: true,

        //规则相关
        m_nCurrPage: 1,
        m_oPrePageBtn: cc.Button,
        m_oNextPageBtn: cc.Button,
        m_tRulePage: { default: [], type: cc.Node },
        m_oDescTxt: cc.Label,

        m_nUserCurGold: 0,
        m_oBoundNode: cc.Node,
        m_bLastIsFastModel: true,

        m_nTotalCount: 0,
        m_nBetCount: 0,
        m_nLeftMax: 0,
        m_nLeftMin: 0,
        m_nCountIndex: 0,
        m_nBetIndex: 0,
        m_tCountChangeBtn: { default: [], type: cc.Button },
        m_tBetRateBtn: { default: [], type: cc.Button },
        m_oLeftMaxEdit: cc.EditBox,
        m_oLeftMinEdit: cc.EditBox,

        m_oAllWinNode: cc.Node,
        m_oRenWuNode: cc.Node,
        m_oWuQiNode: cc.Node,
        m_oCoinSkeleton: sp.Skeleton,
        m_tCheckBtnList: { default: [], type: cc.Toggle },
        m_tCheckTagList: [],
    },

    /**
     * 返回按键
     * @param event
     */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.back: {
                if (!this.__showbox) {
                    this.__showbox = true;
                    cc.dd.NetWaitUtil.close();
                    gSlotMgr.quitGame();
                }
            }
                break;
            default:
                break;
        }
    },

    onLoad: function () {
        Hall.HallED.notifyEvent(Hall.HallEvent.TurnOff_Marquee);

        HallCommonEd.addObserver(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.playBackGround();
        //主体转轮
        var oRunContent = cc.dd.Utils.seekNodeByName(this.node, "Panel_RunContent");
        var tRunLines = new arrayCtrl();
        tRunLines.CreateArrayCtrl(-1, 1, oRunContent);
        tRunLines.resize(5);

        this.m_tRunLines = [];
        this.m_tRunContent = [];
        //老虎机背景
        for (var i = 0; i < 5; i++) {
            var runLine = tRunLines.at(i);
            this.m_tRunContent[i] = cc.dd.Utils.seekNodeByName(runLine, "Panel_Content");
            var arrRunLine = new arrayCtrl();
            arrRunLine.CreateArrayCtrl(1, -1, this.m_tRunContent[i]);
            this.m_tRunLines[i] = arrRunLine;
        }

        //赢线
        this.m_tShowLines = [];
        var oShowLineContent = cc.dd.Utils.seekNodeByName(this.node, "panle_line_Mask")
        for (var i = 0; i < SlotCfg.MaxLineCount; i++) {
            this.m_tShowLines[i] = cc.dd.Utils.seekNodeByName(oShowLineContent, "Panel_line" + (i + 1))
            if (this.m_tShowLines[i])
                this.m_tShowLines[i].active = false;
        }

        //反向赢线
        this.m_tRightShowLines = [];
        var oRightShowLineContent = cc.dd.Utils.seekNodeByName(this.node, "panle_right_line_Mask")
        for (var i = 0; i < SlotCfg.MaxLineCount; i++) {
            this.m_tRightShowLines[i] = cc.dd.Utils.seekNodeByName(oRightShowLineContent, "Panel_line" + (i + 1))
            if (this.m_tRightShowLines[i])
                this.m_tRightShowLines[i].active = false;
        }

        this.m_oYaXian = cc.dd.Utils.seekNodeByName(this.node, "Text_Yaqiannum").getComponent(cc.Label);
        this.m_oYaFen = cc.dd.Utils.seekNodeByName(this.node, "Text_Yafennum").getComponent(cc.Label);
        this.m_oYaFenTotal = cc.dd.Utils.seekNodeByName(this.node, "Text_YafenTotal").getComponent(cc.Label);
        this.m_oYaFenGet = cc.dd.Utils.seekNodeByName(this.node, "Text_Getfen").getComponent(cc.Label);
        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "Text_UserGold").getComponent(cc.Label);
        if (this.m_oUserGold)
            this.m_oUserGold.string = this.changeNumToCHN(gSlotMgr.getGold());
        this.m_nUserCurGold = gSlotMgr.getGold();
        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "name").getComponent(cc.Label);
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 6);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "headMask").getComponent('klb_hall_Player_Head');
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'slot_head_init');

        this.m_oAutoCountTxt = cc.dd.Utils.seekNodeByName(this.node, "auto_count").getComponent(cc.Label);
        this.m_oYazhuBtn = cc.dd.Utils.seekNodeByName(this.node, "line_btn").getComponent(cc.Button);

        for (var i = 0; i < 5; i++) {
            var betTxt = cc.dd.Utils.seekNodeByName(this.m_oYaZhuNode, "line_btn_" + i).getChildByName('num').getComponent(cc.Label);
            if (betTxt) {
                var bet = gSlotMgr.getSelectBetNumByIndex(i);
                betTxt.string = bet;
            }
        }

        this.winNode = cc.dd.Utils.seekNodeByName(this.node, "winNode");
        this.m_oWinNumTxt = this.winNode.getChildByName('num').getComponent(cc.Label);
        this.m_nBetMin = gSlotMgr.getBetMin() / 100;
        this.FillRunline();
        this.UpdateYa();
        this.updatePlayerOnline();

        this.m_tCountLevelCfg = [25, 50, 100, 200, 500];
        this.m_tBetRateLevelCfg = [10, 15, 20, 25, 50, 100];

        this.m_oTotalCountTxt = cc.dd.Utils.seekNodeByName(this.m_oAutoSelectNode, "countlabel");
        if (this.m_oTotalCountTxt)
            this.m_oTotalCountTxt.getComponent(cc.Label).string = this.m_tCountLevelCfg[this.m_nCountIndex];
        this.m_tCountChangeBtn[0].interactable = false;
        this.m_nTotalCount = this.m_tCountLevelCfg[this.m_nCountIndex];

        this.m_oBetRateTxt = cc.dd.Utils.seekNodeByName(this.m_oAutoSelectNode, "betlabel");
        if (this.m_oBetRateTxt)
            this.m_oBetRateTxt.getComponent(cc.Label).string = this.m_tBetRateLevelCfg[this.m_nBetIndex];
        this.m_tBetRateBtn[0].interactable = false;
        this.m_nBetCount = this.m_tBetRateLevelCfg[this.m_nBetIndex];

        this.m_oLeftMaxTxt = cc.dd.Utils.seekNodeByName(this.m_oAutoSelectNode, "leftCoinlabel");
        if (this.m_oLeftMaxTxt)
            this.m_oLeftMaxTxt.getComponent(cc.Label).string = gSlotMgr.getGold() + 100;

        this.m_oLeftMinTxt = cc.dd.Utils.seekNodeByName(this.m_oAutoSelectNode, "leftCoinlabel1");
        if (this.m_oLeftMinTxt)
            this.m_oLeftMinTxt.getComponent(cc.Label).string = gSlotMgr.getGold() - 100;

        this.m_tCheckBtnList[0].isChecked = gSlotMgr.isFastModel(); //加速游戏选项
        this.m_tCheckTagList[0] = gSlotMgr.isFastModel();

        this.m_tCheckBtnList[1].isChecked = true; //进入小玛丽后停止
        this.m_tCheckTagList[1] = true;

        this.m_tCheckBtnList[2].isChecked = true; //开出全屏奖后停止
        this.m_tCheckTagList[2] = true;

        this.m_tCheckBtnList[3].isChecked = false; //总局数
        this.m_tCheckTagList[3] = false;

        this.m_tCheckBtnList[4].isChecked = false; //中奖倍数
        this.m_tCheckTagList[4] = false;

        this.m_tCheckBtnList[5].isChecked = false; //余额大于
        this.m_tCheckTagList[5] = false;

        this.m_tCheckBtnList[6].isChecked = false; //余额小于
        this.m_tCheckTagList[6] = false;

        if (gSlotMgr.getReconnect())
            gSlotMgr.checkSmallGame();
    },

    onDestroy: function () {
        gSlotMgr.resetGameMusicAndAudio();
        Hall.HallED.notifyEvent(Hall.HallEvent.TurnOn_Marquee);

        cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
        AudioManager.stopMusic();
        HallCommonEd.removeObserver(this);
    },

    //播放背景音乐
    playBackGround: function () {
        if (AudioManager._getLocalMusicSwitch()){
            this.m_nMusicId = SlotCfg.AuditoPath + 'xiongdiwushu';
            AudioManager.playMusic(SlotCfg.AuditoPath + 'xiongdiwushu');
        }
    },

    //播放相应音效
    playAudio: function (audioId) {
        var data = slot_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        //AudioManager.setSoundVolume(0.4);
        return AudioManager.playSound(SlotCfg.AuditoPath + name);
    },
    CheckGold: function () {
        var lineBet = gSlotMgr.getLastDownInfo().lastLineBet;
    },

    //更新在线玩家
    updatePlayerOnline: function () {
        var onlineTxt = cc.dd.Utils.seekNodeByName(this.node, 'rolecount').getComponent(cc.Label);
        if (onlineTxt)
            onlineTxt.string = gSlotMgr.getPlayerOnlineCount();
    },

    //更新押注数据
    UpdateYa: function () {
        var bet = gSlotMgr.getLastDownInfo().lastLineBet;
        this.m_oYaFen.string = bet;
        this.m_oYaFenTotal.string = bet * 9;
    },

    //更新玩家身上金币
    updateGold: function () {
        var gold = gSlotMgr.getGold();
        this.m_oUserGold.string = this.changeNumToCHN(gold);
        this.m_nUserCurGold = gold;
    },

    //显示真实结果
    updateResult: function () {
        this.m_oYaFenGet.string = gSlotMgr.getResultFen();
        if (gSlotMgr.getResultFen() > 0) {
            this.playAudio(101404);
            this.winNode.active = true;
            var anim = this.winNode.getComponent(cc.Animation);
            anim.play();
            var self = this;
            var seq = cc.sequence(cc.delayTime(0.4), cc.callFunc(function () {
                if ((self.m_btnDownState == SlotType.DownBtnState.Stop || self.m_btnDownState == SlotType.DownBtnState.Stoping) &&
                    gSlotMgr.isBetAuto() == false && gSlotMgr.getSmallGameTimes() == 0) {
                    self.setDownBtnState(SlotType.DownBtnState.Award);
                } else if (gSlotMgr.isBetAuto() && gSlotMgr.getSmallGameTimes() == 0) {
                    self.OnEffectEnd();
                } else if (gSlotMgr.getSmallGameTimes() > 0 && self.m_isEnterSmallGame == false) {
                    self.m_isEnterSmallGame = true;
                    var cpt = self.m_oBoundNode.getChildByName('boundnum').getComponent(cc.Label);
                    cpt.string = ':' + gSlotMgr.getSmallGameTimes();
                    self.winNode.active = false;
                    self.m_oBoundNode.active = true;
                    self.m_oAllWinNode.active = false;
                    self.m_oRenWuNode.active = false;
                    self.m_oWuQiNode.active = false;
                    var anim = self.m_oBoundNode.getComponent(cc.Animation);
                    anim.play();
                    var boundCallBack = function () {
                        anim.off('finished', boundCallBack);
                        self.OnEffectEnd();
                    }
                    anim.on('finished', boundCallBack);
                }
            }));
            this.node.runAction(seq);

            if (gSlotMgr.getAllWinType() == 9) {
                self.m_oAllWinNode.active = true;
                self.m_oRenWuNode.active = true;
                self.m_oCoinSkeleton.node.active = true;
                self.m_oCoinSkeleton.clearTracks();
                self.m_oCoinSkeleton.setAnimation(0, 'beng', false);
                // self.m_oCoinSkeleton.setCompleteListener(function(){
                //     self.m_oAllWinNode.active = false;
                //     self.m_oRenWuNode.active = false;
                // })
            } else if (gSlotMgr.getAllWinType() == 10) {
                self.m_oAllWinNode.active = true;
                self.m_oWuQiNode.active = true;
                self.m_oCoinSkeleton.node.active = true;
                self.m_oCoinSkeleton.clearTracks();
                self.m_oCoinSkeleton.setAnimation(0, 'beng', false);
                // self.m_oCoinSkeleton.setCompleteListener(function(){
                //     self.m_oAllWinNode.active = false;
                //     self.m_oWuQiNode.active = false;
                // })
            }

            if (this.m_oWinNumTxt)
                this.m_oWinNumTxt.string = gSlotMgr.getResultFen();
        }
        this.UpdateYa();
    },

    //更新自动旋转次数
    updateAutoCount: function () {
        if (this.m_nAutoCount == 0)
            this.m_oAutoCountTxt.string = '自动';
        else if (this.m_nAutoCount <= -1)
            this.m_oAutoCountTxt.string = '自动\n无限次';
        else
            this.m_oAutoCountTxt.string = '自动\n' + this.m_nAutoCount + '次';
    },


    //移除节点上的动画
    RemoveNodeAction: function () {

    },

    //清空得分
    clearGetFen: function () {
        this.m_oYaFenGet.string = '0';
    },


    //快速模式
    fastRunModel: function (dt) {
        if (this.m_tRunTimer.length > 0) {
            for (var k = 0; k < this.m_tRunTimer.length; k++) {
                var v = this.m_tRunTimer[k];
                if (v) {
                    v.passTime = v.passTime + dt;
                    var runLine = this.m_tRunContent[k];
                    if (v.passTime > 0 && this.m_tRunEndTag[k] == false) {
                        var curPosY = -v.passTime * v.cfg.startSpeed * 2;
                        if (curPosY <= v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5) {
                            curPosY = v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5;
                            runLine.y = curPosY;
                            this.m_tRunEndTag[k] = true;
                            //声音播放，暂未处理if(gSlotMgr.)
                            //this.m_tRunTimer[k] = null;
                            this.m_nRunEndTag += 1;
                            this.playAudio(101002);
                        } else {
                            runLine.y = curPosY;
                        }
                    }

                    if (this.m_tRunEndTag[0] == true) {
                        for (var i = 0; i < 5; i++) {//快速停止
                            var runLine = this.m_tRunContent[i];
                            var arrRunLine = this.m_tRunLines[i];
                            if (this.m_tRunTimer[i] != null) {
                                if (this.m_tRunTimer[i] && curPosY >= this.m_tRunTimer[i].endPosY + this.m_tRunLines[i].m_offset.y * 0.5) {
                                    runLine.y = this.m_tRunTimer[i].endPosY + arrRunLine.m_offset.y * 0.5;
                                    this.m_tRunTimer[i] = null;
                                    this.m_tRunEndTimer[i] = 0;
                                    this.m_tRunEndTag[i] = false;
                                    this.m_nRunEndTag = 5;
                                } else {
                                    this.m_tRunContent[i].y = curPosY + (40 * this.m_tRunEndTimer[i] - this.m_tRunEndTimer[i] * this.m_tRunTimer[i]);
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    },

    //特效模式
    effectRunModel: function (dt) {
        if (this.m_tRunTimer.length > 0) {
            for (var k = 0; k < this.m_tRunTimer.length; k++) {
                var v = this.m_tRunTimer[k];
                if (v) {
                    v.passTime = v.passTime + dt;
                    var runLine = this.m_tRunContent[k];
                    if (v.passTime > 0 && this.m_tRunEndTag[k] == false) {
                        var curPosY = -v.passTime * v.cfg.startSpeed;
                        if (curPosY <= v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5) {
                            curPosY = v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5;
                            runLine.y = curPosY - this.m_tRunLines[k].m_offset.y + 80;
                            this.m_tRunEndTag[k] = true;
                            //声音播放，暂未处理if(gSlotMgr.)
                            this.playAudio(101410);
                        } else {
                            runLine.y = curPosY;
                        }
                    }
                }
            }

            for (var m = 0; m < this.m_tRunEndTag.length; m++) {
                var vardata = this.m_tRunEndTag[m];
                if (vardata) {
                    this.m_tRunEndTimer[m] = this.m_tRunEndTimer[m] + dt;
                    var curPosY = this.m_tRunContent[m].y;
                    if (this.m_tRunTimer[m] && curPosY >= this.m_tRunTimer[m].endPosY + this.m_tRunLines[m].m_offset.y * 0.5) {
                        //this.playAudio(101410);
                        this.m_tRunContent[m].y = this.m_tRunTimer[m].endPosY + this.m_tRunLines[m].m_offset.y * 0.5;
                        this.m_tRunTimer[m] = null;
                        this.m_tRunEndTimer[m] = 0;
                        this.m_tRunEndTag[m] = false;
                        this.m_nRunEndTag += 1;
                    } else {
                        this.m_tRunContent[m].y = curPosY + (40 * this.m_tRunEndTimer[m] - this.m_tRunEndTimer[m] * this.m_tRunTimer[m]);
                    }
                }

            }
        }
    },

    update: function (dt) {
        if (this.m_tRunTimer.length > 0) {

            if (gSlotMgr.isFastModel() == this.m_bLastIsFastModel) {
                if (gSlotMgr.isFastModel())
                    this.fastRunModel(dt);
                else
                    this.effectRunModel(dt);
            } else {
                if (this.m_bLastIsFastModel)
                    this.fastRunModel(dt);
                else
                    this.effectRunModel(dt);
            }
        }

        if (this.m_nRunEndTag == 5) {
            this.m_nRunEndTag = 0;
            this.m_tRunTimer.splice(0, this.m_tRunTimer.length);
            this.OnRunEnd();
        }

        //得分操作
        if (this.m_btnDownState == SlotType.DownBtnState.Awarding) {
            var totalnum = parseInt(gSlotMgr.getResultFen());
            this.m_nWeight = Math.ceil(totalnum / 50);
            var num = parseInt(this.m_oWinNumTxt.string);
            if (num > 0) {
                num -= this.m_nWeight;
                this.m_nUserCurGold = this.m_nUserCurGold + this.m_nWeight;
                if (num <= 0)
                    num = 0;
                this.m_oWinNumTxt.string = num;
                this.m_oYaFenGet.string = num;
                if (num == 0)
                    this.m_nUserCurGold = gSlotMgr.getGold();
                if (this.m_nUserCurGold > gSlotMgr.getGold())
                    this.m_nUserCurGold = gSlotMgr.getGold();
                this.m_oUserGold.string = this.changeNumToCHN(this.m_nUserCurGold);
                if (num <= 0) {
                    if (gSlotMgr.isBetAuto()) {
                        var self = this;
                        self.m_bCanSelesctAuto = true;
                        var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                            if (gSlotMgr.isBetAuto())
                                self.onClickEnterAutoBet(null, null);
                            else
                                self.setDownBtnState(SlotType.DownBtnState.Down);
                        }));
                        this.node.runAction(seq);
                    } else {
                        this.setDownBtnState(SlotType.DownBtnState.Down);
                    }
                    this.m_nWeight = 1;
                    this.winNode.active = false;
                    this.m_oAllWinNode.active = false;
                    this.m_oRenWuNode.active = false;
                    this.m_oWuQiNode.active = false;
                }
            }
            // }else{
            //     if(gSlotMgr.isBetAuto()){
            //         this.m_bCanSelesctAuto = true;
            //         this.setDownBtnState(SlotType.DownBtnState.AutoDown);
            //     }else
            //         this.setDownBtnState(SlotType.DownBtnState.Down);
            //     this.m_nWeight = 1;
            //     this.winNode.active = false;
            // }
        }
    },

    setTopAction: function (animName) {
        var leftNode = cc.dd.Utils.seekNodeByName(this.node, "lineNodeShineleft");
        leftNode.active = true;
        var leftLightAction = leftNode.getComponent(cc.Animation);
        leftLightAction.play(animName);
        var rightNode = cc.dd.Utils.seekNodeByName(this.node, "lineNodeShineRight");
        rightNode.active = true;
        var rightLightAction = rightNode.getComponent(cc.Animation);
        rightLightAction.play(animName);
    },

    stopTopAction: function (animName) {
        var leftNode = cc.dd.Utils.seekNodeByName(this.node, "lineNodeShineleft");
        leftNode.active = false;
        var leftLightAction = leftNode.getComponent(cc.Animation);
        leftLightAction.stop(animName);
        var rightNode = cc.dd.Utils.seekNodeByName(this.node, "lineNodeShineRight");
        rightNode.active = false;
        var rightLightAction = rightNode.getComponent(cc.Animation);
        rightLightAction.stop(animName);
    },

    //生成老虎机数列
    FillRunline: function () {
        var self = this;
        var tRunLinesData = gSlotMgr.getAllRunLine();
        for (var i = 0; i < 5; i++) {
            var arrRunLine = this.m_tRunLines[i];
            var oneLineData = tRunLinesData[i];
            arrRunLine.updateItemEx(oneLineData, function (card_id, uiNode, index, key) {
                var cardCfg = data_slotcard.items[card_id];
                uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardCfg.icon);
                // if(index == 0 || index == 1 || index == 2 || index == oneLineData.length - 2 || index == oneLineData.length - 3 || index == oneLineData.length - 4)
                //     uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardCfg.icon);

                uiNode.active = true;
            });
        }
    },

    //下注以后的预览
    UpdatePre: function () {
        this.FillRunline();
        this.StartRunEffect();
    },

    //开始跑老虎机
    StartRunEffect: function () {
        var runCfg = gSlotMgr.getRunCfg()
        for (var i = 0; i < 5; i++) {
            var runLine = this.m_tRunContent[i];
            var arrRunLine = this.m_tRunLines[i];
            runLine.y = 0

            var runTimer = [];
            runTimer.cfg = runCfg[i];

            runTimer.endPosY = -(arrRunLine.showCount() - 5) * arrRunLine.m_offset.y
            runTimer.passTime = - runTimer.cfg.delayTime / 1000.0

            this.m_tRunTimer[i] = runTimer;
            this.m_tRunEndTag[i] = false;
            this.m_tRunEndTimer[i] = 0;
        }
        this.setTopAction('lightAnim');
    },

    showStopBtn: function () {
        if (gSlotMgr && gSlotMgr.getGameState() == SlotType.GameState.Runing)
            this.setDownBtnState(SlotType.DownBtnState.Stop);
    },

    //滚轴转动结束
    OnRunEnd: function () {
        this.stopTopAction('lightAnim');
        gSlotMgr.setGameState(SlotType.GameState.ShowLine);
        //this.updateResult();
        //var nLastGold = gSlotMgr.getLastGold();
        // if(gSlotMgr.getGold() < nLastGold)
        //     this.updateGold();
        //    if((this.m_btnDownState == SlotType.DownBtnState.Stop || this.m_btnDownState == SlotType.DownBtnState.Stoping) &&
        //      gSlotMgr.isBetAuto() == false && gSlotMgr.getSmallGameTimes() == 0){
        //          if(gSlotMgr.getResultFen() == 0)
        //             this.setDownBtnState(SlotType.DownBtnState.Down);
        //         else
        //             this.setDownBtnState(SlotType.DownBtnState.Stoping);
        //      }else if(gSlotMgr.getSmallGameTimes() > 0){
        this.m_btnDownState = SlotType.DownBtnState.Stop;
        this.setDownBtnState(SlotType.DownBtnState.Stoping);
        // }
        this.setSlotDarkOrLight(true);
        var winLines = gSlotMgr.getWinLines();
        if (winLines.length == 0 && gSlotMgr.getAllWinType() != -1) {
            this.playAllWinAct();
            if (this.m_tCheckTagList[6] && gSlotMgr.isBetAuto()) {//勾选了全屏后脱离自动
                gSlotMgr.stopBetAuto();
                this.m_nAutoCount = 0;
                this.updateAutoCount();
                gSlotMgr.setSlotLastAuto();
            }
        } else {
            this.OnRunEndPlayEffect(winLines);
        }
    },
    //播放高倍率card音效
    playHighRateAudio: function (winLines) {
        //筛选最高倍率的中奖图标
        var maxCardLine = winLines[0];
        var maxRate = sfz_base_pay.items[winLines[0].card].three_X;
        switch (winLines[0].num) {
            case 4:
                maxRate = sfz_base_pay.items[winLines[0].card].four_X;
                break;
            case 5:
                maxRate = sfz_base_pay.items[winLines[0].card].five_X;
                break;
        }
        var indexSort = winLines.length;
        for (var j = 1; j < indexSort; j++) {
            var card_j = sfz_base_pay.items[winLines[j].card];
            var rate_j = card_j.three_X;
            switch (winLines[j].num) {
                case 4:
                    rate_j = card_j.four_X;
                    break;
                case 5:
                    rate_j = card_j.five_X;
                    break;
            }
            if (maxRate < rate_j)
                maxCardLine = winLines[j];
        }

        var audioList = data_slotcard.items[maxCardLine.card].audio_id.split(';');
        if (audioList) {
            for (var m = 0; m < audioList.length; m++) {
                var audio = audioList[m].split(':');
                if (maxCardLine.num == parseInt(audio[0])) {
                    this.playAudio(parseInt(audio[1]));
                    break;
                }
            }
        }

    },

    //播放全屏奖
    playAllWinAct: function () {
        var self = this;
        //将所有的图片存入容器中
        var cardPosVec = [];
        for (var i = 0; i < 3; i++) {
            for (var k = 0; k < 5; k++) {
                var v = gSlotMgr.getLineCfg(i)[k];
                cardPosVec.push(v);
            }
        }
        this.m_tLinePosContainter.push(cardPosVec);


        //播放线的特效
        for (var n = 0; n < this.m_tShowLines.length; n++) {
            this.m_tShowLines[n].active = true;
            var anim = this.m_tShowLines[n].getComponent(cc.Animation);
            anim.play('lineShineAnim' + n);
            // if(n == this.m_tShowLines.length - 1){
            //     var lineShowCallBack = function(){
            //         anim.off('finished', lineShowCallBack);
            //         for(var m = 0; m < self.m_tShowLines.length; m++){
            //             var lineNode = self.m_tShowLines[m];
            //             lineNode.active = false;
            //         }

            //     }
            //     anim.on('finished', lineShowCallBack);
            // }
        }

        //播放闪烁效果
        for (var m = 0; m < this.m_tLinePosContainter.length; m++) {
            var cardPosList = this.m_tLinePosContainter[m];
            if (cardPosList.length != 0) {
                for (var k = 0; k < cardPosList.length; k++) {
                    var v = cardPosList[k];
                    var uiNode = this.getCardNode(v.x, v.y);
                    var cardID = gSlotMgr.getCard(v.x, v.y);
                    this.playCardWinEffect(cardID, uiNode);
                    //播放全屏的图片特效
                    if (m == this.m_tLinePosContainter.length - 1 && k == cardPosList.length - 1) {
                        var seq1 = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                            self.setTopAction('lightShine');

                            if (gSlotMgr.getAllWinType() == 9) {
                                self.playAudio(101201);
                            } else if (gSlotMgr.getAllWinType() == 10) {
                                self.playAudio(101200);
                            } else {
                                var audioList = data_slotcard.items[gSlotMgr.getAllWinType()].audio_id.split(';');
                                if (audioList) {
                                    var audio = audioList[0].split(':');
                                    self.playAudio(parseInt(audio[1]));
                                }

                            }
                            for (var n = 0; n < self.m_tShowLines.length; n++) {
                                self.m_tShowLines[n].active = false;
                            }

                            self.playCardEffect();

                            var result = cc.sequence(cc.delayTime(4), cc.callFunc(function () {
                                self.updateResult();
                            }));
                            self.node.runAction(result);
                        }))
                        this.node.runAction(seq1);
                    }
                }
            }
        }
    },

    //滚轴结束特效开始播放
    OnRunEndPlayEffect: function (winLines) {
        if (winLines.length > 0) {
            this.m_nIndex = 0;
            //this.playWinEffect();

            var self = this;
            this.m_tWinLines.splice(0, this.m_tWinLines.length);
            var compare = function (a, b) {
                if ((a.card == self.freeCard && b.card == self.bounsCard) || (a.card == self.bounsCard && b.card == self.freeCard))
                    return a.card < b.card
                else {
                    return a.line > b.line;

                    // if(a.card == b.card)
                    //     return a.line >= b.line;
                    // else
                    //     return a.card > b.card;
                }
            }
            winLines.sort(compare);
            this.m_tWinLines = winLines;
            this.m_tLinePosContainter.splice(0, this.m_tLinePosContainter.length);
            this.m_tWinLineContainer.splice(0, this.m_tWinLineContainer.length);
            //展示赢线
            for (var k = 0; k < winLines.length; k++) {
                var v = winLines[k];
                if (k == winLines.length - 1) {
                    if (!gSlotMgr.isFastModel())
                        this.caculateWinLine(v.line, v.card, v.num, true);
                    else
                        this.ShowLineEffect(v.line, v.card, v.num, true);
                }
                else {
                    if (!gSlotMgr.isFastModel())
                        this.caculateWinLine(v.line, v.card, v.num, false);
                    else
                        this.ShowLineEffect(v.line, v.card, v.num, false);
                }
            }

            if (gSlotMgr.getResultFen() != 0) {
                this.playPlayerGoldAdd(gSlotMgr.getResultFen());
            } else {
                var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                    self.OnEffectEnd();
                }));
                this.node.runAction(seq);

            }
        } else {
            var self = this;
            var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                self.OnEffectEnd();
            }))
            this.node.runAction(seq);
            if (gSlotMgr.isBetAuto() == false)
                this.setDownBtnState(SlotType.DownBtnState.Down);
        }
    },

    //计算赢线数据
    caculateWinLine: function (lineNum, cardID, cardNum, bNeedCallBack) {
        if (gSlotMgr.getFreeTimes() > 0 || gSlotMgr.getSmallGameTimes() > 0) {
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
        }

        this.m_isShowLine = true;
        var cardPosList = [];
        if (lineNum > 0) {
            var linetTypeList = {
                lineNum: lineNum,
                type: 0,
            };

            var wildCard = gSlotMgr.getWildCard();
            for (var k = 0; k < gSlotMgr.getLineCfg(lineNum - 1).length; k++) {
                var v = gSlotMgr.getLineCfg(lineNum - 1)[k];
                var posCard = gSlotMgr.getCard(v.x, v.y);

                if (cardID == posCard || (wildCard == posCard && data_slotcard.items[cardID].type != SlotType.CardType.Func)) {
                    if (k + 1 != gSlotMgr.getLineCfg(lineNum - 1).length) {
                        var nextPos = gSlotMgr.getLineCfg(lineNum - 1)[k + 1];
                        var nextPosCard = gSlotMgr.getCard(nextPos.x, nextPos.y);
                        if (cardID == nextPosCard || (wildCard == nextPosCard)) {
                            if (cardPosList.length == cardNum)
                                break;
                            cardPosList[cardPosList.length] = v;
                        } else if (cardID != nextPosCard && wildCard != nextPosCard && cardPosList.length + 1 == cardNum) {
                            cardPosList[cardPosList.length] = v;
                        } else {
                            linetTypeList.type = 1;
                        }
                    } else {
                        if (cardPosList.length == cardNum)
                            break;
                        cardPosList[cardPosList.length] = v;
                    }
                } else {
                    if (v.x == 0) {
                        linetTypeList.type = 1;
                    }
                    if (cardPosList.length == cardNum)
                        break;
                }
            }

            this.m_tLinePosContainter.push(cardPosList);
            this.m_tWinLineContainer.push(linetTypeList);
            if (bNeedCallBack)
                this.OnLineEffectCallBack();
        } else {//做散型的中奖
            for (var col = 0; col < SlotCfg.ColCount - 1; col++) {
                for (var row = 0; row < SlotCfg.RowCount - 1; row++) {
                    var posCard = gSlotMgr.getCard(col, row);
                    if (cardID == posCard)
                        cardPosList[cardPosList.length] = { x: col, y: row };
                }
            }
            this.m_tLinePosContainter.push(cardPosList);
            this.m_tWinLineContainer.push(lineNum);
            if (bNeedCallBack)
                this.OnLineEffectCallBack();
        }

        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 3; y++) {
                var cardNode = this.getCardNode(x, y);
                cardNode.stopAllActions();
            }
        }
    },

    //赢线特效
    ShowLineEffect: function (lineNum, cardID, cardNum, bNeedCallBack) {
        if (gSlotMgr.getFreeTimes() > 0 || gSlotMgr.getSmallGameTimes() > 0) {
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
        }

        this.m_isShowLine = true;
        var cardPosList = [];
        if (lineNum > 0) {
            var linetTypeList = {
                lineNum: lineNum,
                type: 0,
            };

            var wildCard = gSlotMgr.getWildCard();
            for (var k = 0; k < gSlotMgr.getLineCfg(lineNum - 1).length; k++) {
                var v = gSlotMgr.getLineCfg(lineNum - 1)[k];
                var posCard = gSlotMgr.getCard(v.x, v.y);
                // if(k + 1 != gSlotMgr.getLineCfg(lineNum - 1).length){
                //     var nextPos = gSlotMgr.getLineCfg(lineNum - 1)[k + 1];
                //     var nextPosCard = gSlotMgr.getCard(nextPos.x, nextPos.y);
                //     if((cardID == posCard && posCard == nextPosCard) ||((wildCard == posCard || wildCard == nextPosCard) && )
                // }

                if (cardID == posCard || (wildCard == posCard && data_slotcard.items[cardID].type != SlotType.CardType.Func)) {
                    if (k + 1 != gSlotMgr.getLineCfg(lineNum - 1).length) {
                        var nextPos = gSlotMgr.getLineCfg(lineNum - 1)[k + 1];
                        var nextPosCard = gSlotMgr.getCard(nextPos.x, nextPos.y);
                        if (cardID == nextPosCard || (wildCard == nextPosCard)) {
                            if (cardPosList.length == cardNum)
                                break;
                            cardPosList[cardPosList.length] = v;
                        } else if (cardID != nextPosCard && wildCard != nextPosCard && cardPosList.length + 1 == cardNum) {
                            cardPosList[cardPosList.length] = v;
                            linetTypeList.type = 1;
                        }
                    } else {
                        if (cardPosList.length == cardNum)
                            break;
                        cardPosList[cardPosList.length] = v;
                    }
                }
                else {
                    if (cardPosList.length == cardNum)
                        break;
                }
            }
            this.m_tLinePosContainter.push(cardPosList);
            this.m_tWinLineContainer.push(linetTypeList);
            //赢线特效
            var uiNode = this.m_tShowLines[lineNum - 1];
            if (uiNode) {
                uiNode.active = true;
                uiNode.getChildByName('line').active = true;
                var shineEffect = cc.repeat(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5)), this.lineEffectTime);
                var effect = null;
                var self = this;
                if (bNeedCallBack) {
                    self.playHighRateAudio(this.m_tWinLines);
                    self.playCardEffect();
                    effect = cc.sequence(shineEffect, cc.delayTime(0.8), cc.callFunc(function () {
                        self.updateResult();
                    }))
                } else {
                    effect = cc.sequence(shineEffect, cc.callFunc(function () {
                        //uiNode.stopAllActions();
                    }))
                }
                uiNode.runAction(effect);
            }
        } else {//做散型的中奖
            for (var col = 0; col < SlotCfg.ColCount - 1; col++) {
                for (var row = 0; row < SlotCfg.RowCount - 1; row++) {
                    var posCard = gSlotMgr.getCard(col, row);
                    if (cardID == posCard)
                        cardPosList[cardPosList.length] = { x: col, y: row };
                }
            }
            this.m_tLinePosContainter.push(cardPosList);
            this.m_tWinLineContainer.push(lineNum);
            if (bNeedCallBack)
                this.OnLineEffectCallBack();
        }

        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 3; y++) {
                var cardNode = this.getCardNode(x, y);
                cardNode.stopAllActions();
            }
        }
    },

    //播放获奖特效
    playCardEffect: function () {
        for (var k = 0; k < this.m_tLinePosContainter.length; k++) {
            var cardPosList = this.m_tLinePosContainter[k];
            for (var index = 0; index < cardPosList.length; index++) {
                var v = cardPosList[index];
                var uiNode = this.getCardNode(v.x, v.y);
                uiNode.removeAllChildren(true);
                var cardID = gSlotMgr.getCard(v.x, v.y);
                this.playCardWinRunEffect(cardID, uiNode);
                var cardCfg = data_slotcard.items[cardID];
                uiNode.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(cardCfg.icon);

            }
        }
    },

    //赢线特效结束后的回调
    OnLineEffectCallBack: function () {
        if (this.m_tLinePosContainter.length == 0)
            return;
        var self = this;
        if (this.m_nIndex > this.m_tWinLineContainer.length - 1) {
            this.m_nIndex = 0;
            this.playHighRateAudio(this.m_tWinLines);
            this.playCardEffect();

            for (var index = 0; index < this.m_tWinLineContainer.length; index++) {
                var lineNum = this.m_tWinLineContainer[index].lineNum;
                var type = this.m_tWinLineContainer[index].type;
                var lineNode = self.m_tShowLines[lineNum - 1];
                if (lineNode) {
                    lineNode.active = true;
                    lineNode.getComponent(cc.Animation).play('lightWinShine');
                }
            }


            var result = cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
                self.updateResult();
            }));
            self.node.runAction(result);
            return;
        }

        // if(this.m_nIndex > this.m_tLinePosContainter.length -1)
        //     this.m_nIndex = 0;
        //this.playAudio(101102 + (this.m_nIndex % 3));

        // //自动旋转
        // if(gSlotMgr && gSlotMgr.isBetAuto()){
        //     var seq = cc.sequence(cc.delayTime(1.25), cc.callFunc(function(){
        //         self.OnEffectEnd();
        //     }))
        //     this.node.runAction(seq);
        //     return;
        // }

        //所有图片置灰
        this.setSlotDarkOrLight(true);
        // for(var x = 0; x < 5; x++){
        //     for(var y = 0; y < 3; y++){
        //         var uiNode = this.getCardNode(x, y);
        //         var cardID = gSlotMgr.getCard(x, y);
        //         var cardCfg = data_slotcard.items[cardID];
        //         uiNode.removeAllChildren(true);
        //         uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardID + '_0_03');
        //     }
        // }

        //card特效
        // for(var index = 0; index < this.m_tLinePosContainter.length; index++){
        var cardPosList = this.m_tLinePosContainter[this.m_nIndex];
        if (cardPosList.length != 0) {
            for (var k = 0; k < cardPosList.length; k++) {
                var v = cardPosList[k];
                var uiNode = this.getCardNode(v.x, v.y);
                var cardID = gSlotMgr.getCard(v.x, v.y);
                this.playCardWinEffect(cardID, uiNode);
            }
        }
        //  }

        //赢线显示
        //for(var k = 0; k < this.m_tWinLineContainer.length; k++){
        var lineNum = this.m_tWinLineContainer[this.m_nIndex].lineNum;
        var type = this.m_tWinLineContainer[this.m_nIndex].type;
        var lineShowNode = self.m_tShowLines[lineNum - 1];
        if (type == 1)
            lineShowNode = self.m_tRightShowLines[lineNum - 1];
        if (lineShowNode) {
            lineShowNode.active = true;
            lineShowNode.getChildByName('line').active = true;
            this.playAudio(101102);
            var anim = lineShowNode.getComponent(cc.Animation);
            var animName = 'lineShineAnim' + (lineNum - 1);
            anim.play(animName);
            var lineCallBack = function () {
                anim.off('finished', lineCallBack);
                self.m_nIndex += 1;

                var effect = cc.sequence(cc.delayTime(0.8), cc.callFunc(function () {
                    lineShowNode.active = false;
                    self.OnLineEffectCallBack();
                }));
                lineShowNode.runAction(effect);

            }
            anim.on('finished', lineCallBack);
        }
        // }
        // //小游戏
        // if(gSlotMgr.getSmallGameTimes() > 0 && this.m_isEnterSmallGame == false){
        //     self.m_isEnterSmallGame = true;
        //     var seq = cc.sequence(cc.delayTime(2), cc.callFunc(function(){
        //         self.OnEffectEnd();
        //     }));
        //     this.node.runAction(seq);
        // }
        // var lineNode = self.m_tShowLines[this.m_tWinLineContainer[this.m_nIndex] - 1];
        // if(lineNode){
        //     lineNode.active = true;
        //     var shineEffect = cc.repeat(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5)), 1.5);
        //     var effect = cc.sequence(shineEffect, cc.callFunc(function(){
        //         lineNode.active = false;
        //         self.OnLineEffectCallBack();
        //     }));
        //     lineNode.runAction(effect);
        // }

    },

    //创建动画特效
    setEffect: function (effectId, uiNode, isLoop, func, clipsList) {
        var childNode = new cc.Node();
        childNode.width = uiNode.width;
        childNode.height = uiNode.height;
        var sprite = childNode.addComponent(cc.Sprite);
        var action = childNode.addComponent(cc.Animation);
        // if(needChild){
        //     var childLowNode = new cc.Node();
        //     childLowNode.width = uiNode.width;
        //     childLowNode.height = uiNode.height;
        //     var sprite = childLowNode.addComponent(cc.Sprite);
        //     childNode.addChild(childLowNode);
        // }

        action.addClip(clipsList[effectId], 'effect' + effectId);
        action.play('effect' + effectId);
        uiNode.addChild(childNode);
        var callBack = function () {
            action.off('finished', callBack);
            uiNode.removeAllChildren(true);
        };
        action.on('finished', callBack);
    },

    //播放card特效
    playCardWinEffect: function (cardID, uiNode) {
        var cardCfg = data_slotcard.items[cardID];
        if (cardCfg.playeffect != -1) {
            uiNode.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(cardID + '_0_02');
            this.setEffect(0, uiNode, false, null, this.cardAnimaClips);
            this.setEffect(1, uiNode, false, null, this.cardAnimaClips);

        }
    },

    //播放card特效
    playCardWinRunEffect: function (cardID, uiNode) {
        var cardCfg = data_slotcard.items[cardID];
        if (cardCfg.playeffect != -1) {
            this.setEffect(cardCfg.effect, uiNode, false, null, this.cardRunAnimaClips);
            this.setEffect(1, uiNode, false, null, this.cardAnimaClips);
        }
    },


    OnEffectEnd: function () {
        this.m_bFirstGetBetMsg = false;
        gSlotMgr.setGameState(SlotType.GameState.ShowWin)

        this.checkEnterSmallGame(gSlotMgr.getSmallGameTimes() > 0);
        // var nLastGold = gSlotMgr.getLastGold();
        // if(gSlotMgr.getGold() < nLastGold)
        //     this.updateGold();
    },

    //检查是否进入小游戏
    checkEnterSmallGame: function (isEnter) {
        if (isEnter) {
            this.showSmallGame();
            this.winNode.active = false;
            this.m_oAllWinNode.active = false;
            this.m_oRenWuNode.active = false;
            this.m_oWuQiNode.active = false;
            this.m_oBoundNode.active = false;
            this.m_isEnterSmallGame = isEnter;
            this.m_btnDownState = SlotType.DownBtnState.stop;
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
            if (this.m_tCheckTagList[1] == true) {//进入小玛丽后退出自动旋转
                gSlotMgr.stopBetAuto();
                this.m_nAutoCount = 0;
                this.updateAutoCount();
                gSlotMgr.setSlotLastAuto();
            }
        } else {
            this.checkEnterAutoBet(gSlotMgr.getSlotLastAuto());
        }
    },

    //检查是否进入自动旋转
    checkEnterAutoBet: function (isEnter) {
        if (isEnter) {
            if (gSlotMgr.getResultFen() > 0) {
                if (this.m_tCheckTagList[4] && ((parseInt(gSlotMgr.getResultFen() / (gSlotMgr.getLastDownInfo().lastLineBet * 9))) >= this.m_nBetCount)) { //中奖倍数被选中
                    gSlotMgr.stopBetAuto();
                    this.setDownBtnState(SlotType.DownBtnState.Award);
                    this.m_nAutoCount = 0;
                    this.updateAutoCount();
                    gSlotMgr.setSlotLastAuto();
                } else {
                    var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                        gSlotMgr.awardFen();
                        this.setDownBtnState(SlotType.DownBtnState.Awarding);
                        this.playAudio(101003);
                    }.bind(this)));
                    this.node.runAction(seq);
                    gSlotMgr.setBetAuto(true);
                }
            } else {
                this.m_bCanSelesctAuto = true;
                this.onClickEnterAutoBet(null, null);
            }
        } else {
            if (this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping) {
                gSlotMgr.stopBetAuto();
                this.setDownBtnState(SlotType.DownBtnState.Down);
            } else {
                if (gSlotMgr.getResultFen() > 0) {
                    this.setDownBtnState(SlotType.DownBtnState.Award);
                    //this.playAudio(101003);
                } else
                    this.setDownBtnState(SlotType.DownBtnState.Down);
            }
        }
        // if(gSlotMgr.isBetAuto() == false)
        //     this.setDownBtnState(SlotType.DownBtnState.Down);


    },

    //进入小游戏
    showSmallGame: function () {
        gSlotMgr.showSmallGame();
        cc.dd.UIMgr.openUI("gameyj_water_margin_slot/Prefab/slot_TinyGame_UI", function (prefab) {
            cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
            AudioManager.stopMusic();
        }.bind(this));

    },

    //整个老虎机置灰
    setSlotDarkOrLight: function (isDark) {
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 3; y++) {
                var uiNode = this.getCardNode(x, y);
                var cardID = gSlotMgr.getCard(x, y);
                var cardCfg = data_slotcard.items[cardID];
                var str = isDark ? (cardID + '_0_03') : cardCfg.icon;
                uiNode.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(str);
                uiNode.removeAllChildren(true);
            }
        }
    },

    //结束线的特效
    stopLineEffect: function () {
        for (var i = 0; i < this.m_tShowLines.length; i++) {
            var uiNode = this.m_tShowLines[i];
            uiNode.stopAllActions();
            uiNode.active = false;
        }

        this.m_tLinePosContainter.splice(0, this.m_tLinePosContainter.length);
        this.m_tWinLineContainer.splice(0, this.m_tWinLineContainer.length);
    },

    //按钮状态
    setDownBtnState: function (state) {
        if (state == this.m_btnDownState)
            return;
        var opBtnCpt = this.m_oOpBtn.getComponent(cc.Button);
        var stateSp = this.m_oOpBtn.node.getChildByName('state_Sprite').getComponent(cc.Sprite);
        var stateSpBtnCpt = this.m_oOpBtn.node.getChildByName('state_Sprite').getComponent(cc.Button);
        if (state == SlotType.DownBtnState.Down) {//可下注状态
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_start');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_start');
            opBtnCpt.interactable = true;
            stateSpBtnCpt.interactable = true;
            this.m_oCompareBtn.interactable = false;
            this.m_oCompareBtn.node.getChildByName('compare').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            this.m_oYazhuBtn.interactable = true;
            this.m_oYazhuBtn.node.getChildByName('betDesc').getComponent(cc.LabelOutline).color = new cc.Color(143, 79, 19, 255);
            this.m_oYaFen.node.getComponent(cc.LabelOutline).color = new cc.Color(143, 79, 19, 255);
            this.m_oAutoBtn.interactable = true;
            this.m_oAutoBtn.node.getChildByName('auto_count').getComponent(cc.LabelOutline).color = new cc.Color(173, 79, 19, 255);
            this.m_oYaAllBtn.interactable = true;
            this.m_oAddFenBtn.interactable = true;
            this.m_oSubFenBtn.interactable = true;
            this.m_bCanSelesctAuto = true;
        } else if (state == SlotType.DownBtnState.Downing) {//运转不可点击状态
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_start');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_start');
            opBtnCpt.interactable = false;
            stateSpBtnCpt.interactable = false;
            this.m_oCompareBtn.interactable = false;
            this.m_oYaAllBtn.interactable = false;
            this.m_oAddFenBtn.interactable = false;
            this.m_oSubFenBtn.interactable = false;
            this.m_oYaFen.node.getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            this.m_oYazhuBtn.interactable = false;
            this.m_oYazhuBtn.node.getChildByName('betDesc').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            this.m_bCanSelesctAuto = false;
        } else if (state == SlotType.DownBtnState.Stop) {//可点击停止状态
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_stop');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_quanting');
            opBtnCpt.interactable = true;
            stateSpBtnCpt.interactable = true;
            this.m_oCompareBtn.interactable = false;
            this.m_oCompareBtn.node.getChildByName('compare').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            this.m_bCanSelesctAuto = false;
        } else if (state == SlotType.DownBtnState.Stoping) {//停止中
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_stop');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_quanting');
            if (gSlotMgr.isBetAuto)
                stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_quanting');
            opBtnCpt.interactable = false;
            stateSpBtnCpt.interactable = false;
            this.m_oCompareBtn.interactable = false;
            this.m_bCanSelesctAuto = false;
        } else if (state == SlotType.DownBtnState.Award) {//点击得分
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_start');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_defen');
            opBtnCpt.interactable = true;
            stateSpBtnCpt.interactable = true;
            this.m_oCompareBtn.interactable = true;
            this.m_oCompareBtn.node.getChildByName('compare').getComponent(cc.LabelOutline).color = new cc.Color(143, 79, 19, 255);
            this.m_bCanSelesctAuto = true;
        } else if (state == SlotType.DownBtnState.Awarding) {//得分中
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_stop');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_defen');
            opBtnCpt.interactable = false;
            stateSpBtnCpt.interactable = false;
            this.m_oCompareBtn.interactable = false;
            this.m_oCompareBtn.node.getChildByName('compare').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            this.m_bCanSelesctAuto = false;
        } else if (state == SlotType.DownBtnState.AutoDown) {//自动旋转
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_stop');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_start')
            opBtnCpt.interactable = false;
            stateSpBtnCpt.interactable = false;
            this.m_oCompareBtn.interactable = false;
            this.m_oYaAllBtn.interactable = false;
            this.m_oAddFenBtn.interactable = false;
            this.m_oSubFenBtn.interactable = false;
            this.m_oYaFen.node.getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            this.m_oYazhuBtn.interactable = false;
            this.m_oYazhuBtn.node.getChildByName('betDesc').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
            var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                this.setDownBtnState(SlotType.DownBtnState.AutoDowning);
            }.bind(this)));
            this.node.runAction(seq);
            this.m_bCanSelesctAuto = false;
        } else if (state == SlotType.DownBtnState.AutoDowning) {//自动旋转中
            this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_stop');
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_quanting')
            opBtnCpt.interactable = true;
            stateSpBtnCpt.interactable = true;
            this.m_bCanSelesctAuto = false;
        } else if (state == SlotType.DownBtnState.AutoDownStoping) {//自动旋转
            if (this.m_btnDownState == SlotType.DownBtnState.AutoDowning) {
                this.m_oOpBtn.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_stop');
                stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('shz_btn_txt_quanting');
                opBtnCpt.interactable = false;
                stateSpBtnCpt.interactable = false;
                this.m_oCompareBtn.interactable = false;
                this.m_btnDownState = SlotType.DownBtnState.Stoping;
                this.m_bCanSelesctAuto = false;
                return;
            }
        }
        this.m_btnDownState = state;
    },

    //重置小游戏标志
    resetEnterTinyGameTag: function () {
        this.m_isEnterSmallGame = false;
    },

    //播放赢钱的特效
    playPlayerGoldAdd: function () {

    },

    //获取老虎机上的数据节点
    getCardNode: function (x, y) {
        var arrRunLine = this.m_tRunLines[x];
        return arrRunLine.at(arrRunLine.showCount() - 4 + y);
    },

    //点击开始按钮
    onClickStar: function (event, data) {
        this.RemoveNodeAction();
        this.clearGetFen();
        this.m_oMenuListNode.active = false;

        this.resetEnterTinyGameTag();
        if (this.m_btnDownState == SlotType.DownBtnState.Down) {
            if (gSlotMgr.getSmallGameTimes() > 0)
                return;
            //this.m_oYaFEn.string = '0';
            this.m_oYaZhuNode.active = false;
            this.m_oAutoSelectNode.active = false;

            this.node.stopAllActions();
            this.setSlotDarkOrLight(false);
            this.stopLineEffect();
            if (hall_prop_data.getInstance().getCoin() < (gSlotMgr.getBetMin() * 9)) {
                cc.dd.DialogBoxUtil.show(1, '您的金币不足，不能继续进行游戏', '退出', '取消', function () {
                    gSlotMgr.quitGame();
                }, null);
                return;
            }

            var yaFen = this.m_oYaFen.string;
            if (parseInt(yaFen) * 9 > hall_prop_data.getInstance().getCoin()) {
                cc.dd.PromptBoxUtil.show('金币不足，请重新押注');
                return;
            }
            var self = this;
            // var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function(){
            // self.m_oStartPanel.active = false;
            self.m_nRunAudioId = self.playAudio(101000);
            this.m_bLastIsFastModel = gSlotMgr.isFastModel();
            gSlotMgr.bet(9, parseInt(yaFen));

            self.updateGold();
            self.setDownBtnState(SlotType.DownBtnState.Downing);
            self.m_bCdBet = true;
            //}));

            var self = this;
            var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                //if(gSlotMgr != null && gSlotMgr.getSmallGameTimes() == 0)
                self.showStopBtn();
            }))
            this.node.runAction(seq);
        } else if (this.m_btnDownState == SlotType.DownBtnState.Stop) {
            this.playAudio(101100);
            AudioManager.stopSound(this.m_nRunAudioId);
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
            var indexList = [];
            for (var i = 0; i < 5; i++) {
                var runLine = this.m_tRunContent[i];
                var arrRunLine = this.m_tRunLines[i];
                if (this.m_tRunTimer[i] != null) {
                    runLine.y = this.m_tRunTimer[i].endPosY + arrRunLine.m_offset.y * 0.5;
                    this.m_tRunTimer[i] = null;
                    this.m_tRunEndTimer[i] = 0;
                    this.m_tRunEndTag[i] = false;
                    this.m_nRunEndTag += 1;
                }
            }
            this.playAudio(101002);

            // var self = this;
            // var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function(){
            //     self.m_nRunEndTag = 5;
            //     self.m_tRunTimer.splice(0, self.m_tRunTimer.length);
            //     //self.OnRunEnd();
            // }));
            // this.node.runAction(seq);

            //gSlotMgr.stopRunLine(indexList);
        } else if (this.m_btnDownState == SlotType.DownBtnState.Award) {
            this.playAudio(101003)
            gSlotMgr.awardFen();
            this.stopLineEffect();
            this.setDownBtnState(SlotType.DownBtnState.Awarding);

            //this.setDownBtnState(SlotType.DownBtnState.Down);
        } else if (this.m_btnDownState == SlotType.DownBtnState.AutoDowning) {
            this.playAudio(101100);
            AudioManager.stopSound(this.m_nRunAudioId);
            this.m_nAutoCount = 0;
            this.updateAutoCount();
            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();

            for (var i = 0; i < 5; i++) {
                var runLine = this.m_tRunContent[i];
                var arrRunLine = this.m_tRunLines[i];
                if (this.m_tRunTimer[i] != null) {
                    runLine.y = this.m_tRunTimer[i].endPosY + arrRunLine.m_offset.y * 0.5;
                    this.m_tRunTimer[i] = null;
                    this.m_tRunEndTimer[i] = 0;
                    this.m_tRunEndTag[i] = false;
                    this.m_nRunEndTag += 1;
                }
            }
            this.playAudio(101002);

            // if(this.m_tRunTimer.length > 0)
            //     this.setDownBtnState(SlotType.DownBtnState.AutoDownStoping);
            // else{
            //     if(gSlotMgr.getResultFen() > 0)
            //         this.setDownBtnState(SlotType.DownBtnState.Award);
            //     else
            //         this.setDownBtnState(SlotType.DownBtnState.Down);
            // }
        }
    },

    //进入自动旋转
    onClickEnterAutoBet: function (event, data) {
        if (this.m_tRunTimer.length != 0)
            return;
        if (hall_prop_data.getInstance().getCoin() < (gSlotMgr.getBetMin() * 9)) {
            cc.dd.DialogBoxUtil.show(1, '您的金币不足，不能继续进行游戏', '退出', '取消', function () {
                gSlotMgr.quitGame();
            }, null);
            return;
        }

        var yaFen = this.m_oYaFen.string;
        if (parseInt(yaFen) * 9 > hall_prop_data.getInstance().getCoin()) {
            this.setDownBtnState(SlotType.DownBtnState.Down);
            this.m_nAutoCount = 0;
            this.updateAutoCount();
            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();
            cc.dd.PromptBoxUtil.show('金币不足，请重新押注');
            return;
        }

        if ((this.m_tCheckTagList[5] && this.m_nLeftMax <= gSlotMgr.getGold()) || (this.m_tCheckTagList[6] && this.m_nLeftMin >= gSlotMgr.getGold())) {//不符合情况
            this.setDownBtnState(SlotType.DownBtnState.Down);
            this.m_nAutoCount = 0;
            this.updateAutoCount();
            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();
            cc.dd.PromptBoxUtil.show('余额不满足您对自动旋转的设置');
            return;
        }
        this.setSlotDarkOrLight(false);
        this.stopLineEffect();

        var self = this;
        var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            if (self.m_nAutoCount == 0) {
                self.setDownBtnState(SlotType.DownBtnState.Down);
                return;
            }

            //self.m_oStartPanel.active = false;
            self.playAudio(101000);
            self.m_bLastIsFastModel = gSlotMgr.isFastModel();
            gSlotMgr.betAuto(9, parseInt(yaFen));
            if (self.m_nAutoCount > 0)
                self.m_nAutoCount -= 1;
            self.updateAutoCount();
            self.updateGold();
            if (self.m_nAutoCount == 0) {
                gSlotMgr.stopBetAuto();
                gSlotMgr.setSlotLastAuto();
            } else {
                self.setDownBtnState(SlotType.DownBtnState.AutoDown);
                self.m_bCanSelesctAuto = false;
            }
        }));
        this.node.runAction(seq);



        // this.playAudio(101000);
        // gSlotMgr.betAuto(9, parseInt(yaFen));
        // this.m_nAutoCount -= 1;
        // this.updateAutoCount();
        // this.updateGold();
    },

    //点击押注按钮
    onClickYaZhu: function (event, data) {
        this.m_oMenuListNode.active = false;
        this.playAudio(101100);
        this.m_oYaZhuNode.active = !this.m_oYaZhuNode.active;
    },

    //点击选择押注数据
    onClickYaZhunBet: function (event, data) {
        this.playAudio(101100);
        var index = parseInt(data);
        var lineBet = gSlotMgr.getSelectBetNumByIndex(index);
        gSlotMgr.setLastDownInfo(9, lineBet);
        this.UpdateYa();
        this.m_oYaZhuNode.active = !this.m_oYaZhuNode.active;
    },


    // //增加押注
    // OnYafenAdd: function(event, data){
    //     this.playAudio(101101);
    //     var lineBet = gSlotMgr.getLastDownInfo().lastLineBet;
    //     gSlotMgr.controlBetIndex(SlotType.SlotAddOrSubState.InAdd);
    //     lineBet = Math.min(gSlotMgr.getBetMax(), gSlotMgr.getBetNumByIndex());

    //     this.stopLineEffect();
    //     gSlotMgr.setLastDownInfo(9, lineBet);
    //     this.UpdateYa();
    // },

    // //减少押注
    // OnYafenSub: function(event, data){
    //     this.playAudio(101101);
    //     var lineBet = gSlotMgr.getLastDownInfo().lastLineBet;
    //     gSlotMgr.controlBetIndex(SlotType.SlotAddOrSubState.InSub);
    //     lineBet = Math.max(gSlotMgr.getBetMin(), gSlotMgr.getBetNumByIndex());
    //     gSlotMgr.setLastDownInfo(9, lineBet);
    //     this.UpdateYa();
    // },

    // //压最大值
    // OnYaAllLine: function(event, data){
    //     this.playAudio(101100);
    //     this.stopLineEffect();
    //     var lineBet = gSlotMgr.getBetMax();
    //     if(lineBet * 9 > gSlotMgr.getGold()){
    //         lineBet = Math.floor(gSlotMgr.getGold() / 9);
    //         if(lineBet < gSlotMgr.getBetMin())
    //             lineBet = gSlotMgr.getBetMin();
    //         gSlotMgr.jugeBetIndex(lineBet);
    //         lineBet = gSlotMgr.getBetNumByIndex();
    //     }
    //     gSlotMgr.setLastDownInfo(9, lineBet);
    //     this.UpdateYa();
    //     gSlotMgr.InitBetIndex(lineBet);
    //     this.onClickStar(null, null);
    // },
    //进入比倍游戏
    onClickEnterComapreGame: function (event, data) {
        this.playAudio(101100);

        this.winNode.active = false;
        this.m_oAllWinNode.active = false;

        var opBtnCpt = this.m_oOpBtn.getComponent(cc.Button);
        opBtnCpt.interactable = false;
        this.m_oCompareBtn.interactable = false;
        this.m_oCompareBtn.node.getChildByName('compare').getComponent(cc.LabelOutline).color = new cc.Color(181, 175, 175, 255);
        var stateSpBtnCpt = this.m_oOpBtn.node.getChildByName('state_Sprite').getComponent(cc.Button);
        stateSpBtnCpt.interactable = false;

        cc.dd.UIMgr.openUI("gameyj_water_margin_slot/Prefab/compare_Game_UI", function (prefab) {
            cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
            AudioManager.stopMusic();
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
        }.bind(this));
        this.clearGetFen();
    },

    //点击菜单按钮
    onClickMenuBtn: function (event, data) {
        this.playAudio(101100);
        this.m_oMenuListNode.active = !this.m_oMenuListNode.active;
    },

    //退出按钮
    onClickQuitBtn: function (event, data) {
        this.playAudio(101100);
        var str = '';
        if (gSlotMgr.getStartCoin() >= gSlotMgr.getGold()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (gSlotMgr.getGold() - gSlotMgr.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                this.node.stopAllActions();
                cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
                AudioManager.stopMusic();
                gSlotMgr.quitGame();
            }.bind(this), null
        );

    },

    //点击规则按钮
    onClickRuleBtn: function (event, data) {
        this.playAudio(101100);
        this.m_oRuleUI.active = !this.m_oRuleUI.active;
    },

    reconnectHall: function () {
        cc.dd.SceneManager.enterHall();
    },

    //点击规则按钮
    onClickRuleInfo: function (event, data) {
        this.playAudio(101409);
        var type = parseInt(data);
        this.m_nCurrPage += type;
        if (this.m_nCurrPage <= 1) {
            this.m_nCurrPage = 1;
            this.m_oPrePageBtn.interactable = false;
        } else if (this.m_nCurrPage >= 5) {
            this.m_nCurrPage = 5;
            this.m_oNextPageBtn.interactable = false;
        } else {
            this.m_oPrePageBtn.interactable = true;
            this.m_oNextPageBtn.interactable = true;
        }
        for (var i = 0; i < 5; i++) {
            if (this.m_nCurrPage - 1 == i)
                this.m_tRulePage[i].active = true;
            else
                this.m_tRulePage[i].active = false;
        }
        this.m_oDescTxt.string = '规则（' + this.m_nCurrPage + '/5）';
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

    //获取全屏数据/在线玩家列表
    onClickGetList: function (event, data) {
        this.playAudio(101100);
        gSlotMgr.resetCanSendTag();
        gSlotMgr.getAllWinOrOnlineList(parseInt(data), 1);
    },

    //点击设置按钮
    onClickSettingBtn: function (event, data) {
        this.playAudio(101100);
        cc.dd.UIMgr.openUI("gameyj_water_margin_slot/Prefab/water_margin_Setting", function (node) {
        });
    },

    //关闭单线下注选择狂
    onCloseSelectYaZhu: function (event, data) {
        this.m_oYaZhuNode.active = false;
    },

    //关闭自动转选择框
    onCloseAutoSelect: function (event, data) {
        this.m_oAutoSelectNode.active = false;
    },
    setOrignSoundVolume: function () {

    },

    /////////////////////////////////////////////////////////////**自动转相关Begin **///////////////////////////////////////////////
    //选择自动次数按钮
    onClickAutoSelectBtn: function (event, data) {
        this.m_oMenuListNode.active = false;
        this.playAudio(101100);
        this.m_oAutoSelectNode.active = !this.m_oAutoSelectNode.active;
        this.m_tCheckBtnList[0].isChecked = gSlotMgr.isFastModel(); //加速游戏选项
        this.m_tCheckTagList[0] = gSlotMgr.isFastModel();

        if (gSlotMgr.isBetAuto()) {
            this.m_oAutoSelectNode.active = false;
            if (this.m_tCheckTagList[3])
                this.m_nAutoCount = this.m_nTotalCount;
            else
                this.m_nAutoCount = 0;
            this.updateAutoCount();
            //this.m_bCanSelesctAuto = true;
            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();
        }
    },

    onClickChangeCount: function (event, data) {
        this.m_nCountIndex += (data == 1 ? -1 : 1);
        if (this.m_nCountIndex == 0)
            this.m_tCountChangeBtn[0].interactable = false;
        else
            this.m_tCountChangeBtn[0].interactable = true;

        if (this.m_nCountIndex == this.m_tCountLevelCfg.length - 1)
            this.m_tCountChangeBtn[1].interactable = false;
        else
            this.m_tCountChangeBtn[1].interactable = true;

        this.m_nTotalCount = this.m_tCountLevelCfg[this.m_nCountIndex];
        this.m_oTotalCountTxt.getComponent(cc.Label).string = this.m_nTotalCount;
        if (this.m_tCheckTagList[3])
            this.m_nAutoCount = this.m_nTotalCount;
    },

    onClickChangeBet: function (event, data) {
        this.m_nBetIndex += (data == 1 ? -1 : 1);
        if (this.m_nBetIndex == 0)
            this.m_tBetRateBtn[0].interactable = false;
        else
            this.m_tBetRateBtn[0].interactable = true;

        if (this.m_nBetIndex == this.m_tBetRateLevelCfg.length - 1)
            this.m_tBetRateBtn[1].interactable = false;
        else
            this.m_tBetRateBtn[1].interactable = true;

        this.m_nBetCount = this.m_tBetRateLevelCfg[this.m_nBetIndex];
        this.m_oBetRateTxt.getComponent(cc.Label).string = this.m_nBetCount;
    },

    //editBox输入改变
    onGetMaxEditBoxEnterChanged: function (event, data) {
        var n = Number(event);
        if (isNaN(n)) {
            cc.dd.PromptBoxUtil.show("请输入正确的数字");
            return
        }
        var num = 0
        num = parseInt(event);
        if (event == "")
            num = 0;
        this.m_nLeftMax = num;
        this.m_oLeftMaxTxt.getComponent(cc.Label).string = num;
    },

    //editbox输入结束
    onMaxEditBoxEnterEnd: function (event, data) {
        this.m_oLeftMaxEdit.string = '';
    },


    //editBox输入改变
    onGetMinEditBoxEnterChanged: function (event, data) {
        var n = Number(event);
        if (isNaN(n)) {
            cc.dd.PromptBoxUtil.show("请输入正确的数字");
            return
        }
        var num = 0
        num = parseInt(event);
        if (event == "")
            num = 0;
        this.m_nLeftMin = num;
        this.m_oLeftMinTxt.getComponent(cc.Label).string = num;
    },

    //editbox输入结束
    onMinEditBoxEnterEnd: function (event, data) {
        this.m_oLeftMinEdit.string = '';
    },

    //点击选择自动旋转次数
    onClickSeletAutoCount: function (event, data) {
        this.playAudio(101100);
        if (this.m_tCheckTagList[3])
            this.m_nAutoCount = this.m_nTotalCount;
        else
            this.m_nAutoCount = -1;
        this.updateAutoCount();
        gSlotMgr.setBetAuto(true);
        gSlotMgr.setSlotLastAuto();

        this.m_oAutoSelectNode.active = !this.m_oAutoSelectNode.active;
        if (this.m_bCanSelesctAuto) {
            if (this.m_btnDownState == SlotType.DownBtnState.Award) {
                gSlotMgr.awardFen();
                this.setDownBtnState(SlotType.DownBtnState.Awarding);
                this.playAudio(101003);
            } else {
                var seq = cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                    this.onClickEnterAutoBet(null, null);
                }.bind(this)));
                this.node.runAction(seq);
            }
        }
    },

    onClickCloseAuto: function (event, data) {
        this.m_oAutoSelectNode.active = false;
    },

    onClickSelectToggle: function (event, data) {
        var index = parseInt(data);
        this.m_tCheckBtnList[index].isChecked = !this.m_tCheckBtnList[index].isChecked;
        this.m_tCheckTagList[index] = !this.m_tCheckTagList[index];
        //if(this.m_tCheckBtnList[index].isChecked)
        this.m_tCheckBtnList[index].node.getChildByName('checkmark').active = this.m_tCheckTagList[index];
        //else
        //  this.m_tCheckBtnList[index].uncheck()
        if (index == 0)
            gSlotMgr.setIsFastModel();
    },
    /////////////////////////////////////////////////////////////**自动转相关End **///////////////////////////////////////////////

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

    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
        }
    }
});
