//create by wj 2020/12/15
var hallData = require('hall_common_data').HallCommonData;
const gameData = require('horse_racing_Data').Horse_Racing_Data.Instance();
const horse_racing_Ed = require('horse_racing_Data').Horse_Racing_Ed;
const horse_racing_Event = require('horse_racing_Data').Horse_Racing_Event;
const gameType = require('horse_racing_Config').HorseRacingGameConfig;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
const gameAudioPath = require('horse_racing_Config').AuditoPath;
const audioConfig = require('horse_audio');
const Hall = require('jlmj_halldata');
var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        m_tHorseInfoNodeList: { default: [], type: cc.Node, tooltip: '6匹马的信息节点' },
        m_tHorseBetNodeList: { default: [], type: cc.Node, tooltip: '下注节点' },
        m_tPlayerBetNodeList: { default: [], type: cc.Node, tooltip: '筹码选择节点' },
        m_tTotalBetTxtList: { default: [], type: cc.Label, tooltip: '总押注数据显示' },
        m_tChipBtnList: { default: [], type: cc.Node, tooltip: '下注按钮' },
        m_tBetBtnList: { default: [], type: cc.Node, tooltip: '下注操作按钮' },
        m_nSelectIndx: 0,
        m_nBetNum: 0,
        m_oEndOpNode: cc.Node,
        m_oWaitNode: cc.Node,
        m_oOpNode: cc.Node,
        m_oBetTimeNode: cc.Node,
        m_nRemainBetTime: 0,
        m_oContinueBtn: cc.Button,
        m_oClearBtn: cc.Button,
        m_bOpBet: false,
        m_oTimeAct: cc.Sprite,
        m_nTimerProgress: 0,
        m_tGameMainUI: { default: [], type: cc.Node, tooltip: '游戏主界面' },
        m_oFunctionUI: cc.Node,

        timeText: cc.Label,
    },


    onLoad() {
        // cc.debug.setDisplayStats(true);
        cc.game.setFrameRate(60);

        horse_racing_Ed.addObserver(this);
        RoomED.addObserver(this);
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        SysED.addObserver(this);

        this.startCount = false;

        this.m_tGameMainUI[0].active = true;

        for (var i = 0; i < 6; i++) {//初始化马匹信息节点
            this.m_tHorseInfoNodeList[i] = cc.dd.Utils.seekNodeByName(this.node, 'horseNode' + (i + 1));
            if (this.m_tHorseInfoNodeList[i])
                this.updateHorseInfo(this.m_tHorseInfoNodeList[i], false, null);
        }

        var count = 0;
        for (var i = 0; i < 6; i++) {//初始化马匹下注信息
            for (var j = i + 1; j < 7; j++) {
                this.m_tHorseBetNodeList[count] = cc.dd.Utils.seekNodeByName(this.node, 'betNode' + i + j);
                this.m_tHorseBetNodeList[count].tag = i * 10 + j
                if (this.m_tHorseBetNodeList[count])
                    this.updateHorseBetInfo(this.m_tHorseBetNodeList[count], false, null);
                this.m_tBetBtnList[count] = this.m_tHorseBetNodeList[count];
                count++;
            }
        }

        for (var i = 0; i < 10; i++) {//初始化总下注显示
            this.m_tTotalBetTxtList[i] = cc.dd.Utils.seekNodeByName(this.node, 'totalBet_Num' + i).getComponent(cc.Label);
            this.m_tTotalBetTxtList[i].node.active = false;
        }

        for (var k = 0; k < 4; k++) {
            this.m_tChipBtnList[k] = cc.dd.Utils.seekNodeByName(this.node, 'betBtn' + k);
        }

        this.m_oRoundTxt = cc.dd.Utils.seekNodeByName(this.node, 'match_desc').getComponent(cc.Label); //场次描述

        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "goldTxt").getComponent(cc.Label); //玩家金币 

        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "nameTxt").getComponent(cc.Label); //设置名字
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 7);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "playerHead").getComponent('klb_hall_Player_Head'); //设置头像
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'horse_race_head_init');

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onDestroy: function () {
        cc.game.setFrameRate(40);
        horse_racing_Ed.removeObserver(this);
        RoomED.removeObserver(this);
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        SysED.removeObserver(this);
    },

    update: function (dt) {
        if (this.startCount) {
            this.m_nRemainBetTime -= dt;

            if (this.m_nRemainBetTime > 0) {
                if (this.m_nRemainBetTime <= 10 && this.countDownTimeState == 0) {
                    this.playAudio(22, false); //还剩10秒下注时间提示
                    this.countDownTimeState = 1;
                }
                else if (this.m_nRemainBetTime <= 5 && this.countDownTimeState == 1) {
                    this.playAudio(11, false); //倒计时
                    this.countDownTimeState = 2;
                }

                if (this.m_nRemainBetTime < 9)
                    this.timeText.string = '0' + Math.ceil(this.m_nRemainBetTime);
                else
                    this.timeText.string = Math.ceil(this.m_nRemainBetTime);

            } else {
                if (this.m_nRemainBetTime <= 0 && this.countDownTimeState == 2) {
                    this.setAllBtnEnable(false); //所有按钮置灰

                    var closeAnim = () => {
                        var anim = this.m_oEndOpNode.getChildByName('fu_d').getComponent(cc.Animation);
                        anim.off('finished', closeAnim, this);
                        this.m_oBetTimeNode.active = false;
                        this.m_nRemainBetTime = 0;
                        this.m_oEndOpNode.active = false;
                        this.stopBet();
                    };

                    var anim = this.m_oEndOpNode.getChildByName('fu_d').getComponent(cc.Animation);
                    anim.on('finished', closeAnim, this);
                    anim.play();
                    anim.setCurrentTime(0);
                    this.m_oEndOpNode.active = true;
                }

                this.startCount = false;
                this.timeText.string = '00';
                this.countDownTimeState = 0;
            }
        }

        if (this.m_nTimerProgress > 0) {
            this.m_nTimerProgress -= dt;
            this.m_oTimeAct.fillRange = 1 - this.m_nTimerProgress / 25;
        }
    },

    initGameMainUI: function () {//初始化游戏整个界面信息
        AudioManager.playMusicNotControlledBySwitch(gameAudioPath + 'horse_background_01_v01');


        this.updateGold(); //更新金币
        this.updateRound(); //更新场次
        var horseList = gameData.getHoseList();
        horseList.forEach(function (horseData) { //更新马匹信息
            this.updateHorseInfo(this.m_tHorseInfoNodeList[horseData.index - 1], true, horseData)
        }.bind(this));

        this.updateBetArea(); //更新下注区域信息
        this.initChip(); //初始化玩家下注筹码档次
        this.updateTotalBet(); //更新总下注

        var gameState = gameData.getGameState();//游戏整体状态
        if (gameState == 2) {
            gameState = gameType.GameSate.WaitGame;
        }

        this.switchGameState(gameState);
        this.playerNumUpdate();

        let checkGameIsOpen = () => {
            if (this.openGame && gameState != gameType.GameSate.WaitGame) {
                this.m_oRunMainUI.active = true;
                this.m_oRunMainUI.getComponent('horse_racing_horses_Control').playRunAct();
            }
        }

        var ui = cc.dd.UIMgr.getUI('gameyj_horse_racing/prefabs/Scence_game');
        if (ui) {
            cc.dd.UIMgr.destroyUI(ui);
            this.m_oRunMainUI = null;

            setTimeout(() => {
                if (this.node.isValid) {
                    this.m_oRunMainUI = cc.dd.UIMgr.getUI('gameyj_horse_racing/prefabs/Scence_game');
                    if (this.m_oRunMainUI) {
                        this.m_oRunMainUI.active = false;

                        checkGameIsOpen();
                    } else {
                        cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/Scence_game', (ui) => {
                            this.m_oRunMainUI = ui;
                            this.m_oRunMainUI.active = false;

                            checkGameIsOpen();
                        });
                    }
                }
            }, 1000);
        } else {
            cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/Scence_game', function (ui) {
                this.m_oRunMainUI = ui;
                this.m_oRunMainUI.active = false;

                checkGameIsOpen();
            }.bind(this));
        }


    },

    //更新金币显示
    updateGold: function () {
        this.m_oUserGold.string = this.convertChipNum(gameData.getCoin(), 1);
    },

    //更新场次信息：
    updateRound: function () {
        this.m_oRoundTxt.string = '第' + gameData.getRoundId() + '场'; //场次描述
    },

    //更新马匹信息显示
    updateHorseInfo(node, isShow, data) {
        var oNameTxt = node.getChildByName('horseName');
        oNameTxt.active = isShow;
        if (data)
            oNameTxt.getComponent(cc.Label).string = data.name;
        var oLevelTxt = node.getChildByName('horseLevel');
        // if(data)
        //     oLevelTxt.getComponent(cc.Label).string = data.rate;
        oLevelTxt.active = false;
        for (var i = 0; i < 5; i++) {
            var oRankNode = node.getChildByName('rank' + i);
            oRankNode.active = isShow;
            if (data && data.rankList[i])
                oRankNode.getComponent(cc.Label).string = data.rankList[i];
        }
    },

    //更新游戏整体下注信息
    updateBetArea: function () {
        var horseBetList = gameData.getBetAreaList();
        horseBetList.forEach(function (horseBetData) {//更新下注信息
            var node = this.findBetInfoNode(horseBetData.id);
            if (node)
                this.updateHorseBetInfo(node, true, horseBetData)
        }.bind(this));
    },

    //更新个人下注信息
    updateOwnBetInfo: function (id) {
        var node = this.findBetInfoNode(id);
        var horseBetData = gameData.getBetAreaInfoById(id);
        if (node)
            this.updateHorseBetInfo(node, true, horseBetData)
    },

    //更新马匹下注信息
    updateHorseBetInfo(node, isShow, data) {
        // var ownbg = cc.dd.Utils.seekNodeByName(node, 'img_betBtn_value_bg');
        // ownbg.active = isShow;
        var selectBg = cc.dd.Utils.seekNodeByName(node, 'resultBg');
        selectBg.active = isShow;
        var oOwnBetTxt = cc.dd.Utils.seekNodeByName(node, 'ownBet');

        if (data) {
            if (data.sfBet != 0) {
                oOwnBetTxt.getComponent(cc.Label).string = this.convertChipNum(data.sfBet);
                oOwnBetTxt.active = true;
            } else {
                // ownbg.active = false;
                oOwnBetTxt.active = false;
                selectBg.active = false;
            }
        }
        var oTotalBetTxt = cc.dd.Utils.seekNodeByName(node, 'totalBet');
        oTotalBetTxt.active = isShow;
        if (data)
            oTotalBetTxt.getComponent(cc.Label).string = this.convertChipNum(data.allBet, 1);
        var oRateTxt = cc.dd.Utils.seekNodeByName(node, 'betRate');
        oRateTxt.active = isShow;
        if (data) {
            oRateTxt.getComponent(cc.Label).string = (data.rate / 10).toFixed(1);
            oRateTxt.getComponent(cc.LabelOutline).color = data.rate >= 1000 ? cc.Color.RED : cc.Color.BLACK;
        }
    },

    findBetInfoNode: function (id) {//查找马匹下注节点
        var betNode = null;
        for (var i = 0; i < this.m_tHorseBetNodeList.length; i++) {
            var node = this.m_tHorseBetNodeList[i];
            if (node.tag == id) {
                betNode = node;
                return betNode;
            }
        }
        return betNode;
    },


    //初始化玩家下注档次
    initChip: function () {
        var configData = gameData.getRoomConfigData(); //获取配置表数据
        if (configData) {
            var betList = configData.bets.split(';');
            if (betList && betList.length != 0) {
                for (var i = 0; i < betList.length; i++) //设置下注档位
                    this.m_tChipBtnList[i].getChildByName('betNumTxt').getComponent(cc.Label).string = this.convertChipNum(betList[i], 0);
            }
            this.m_nBetNum = betList[this.m_nSelectIndx];
            var animNode = this.m_tChipBtnList[this.m_nSelectIndx].getChildByName('clickAnim');
            animNode.active = true;
            animNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('saoguang');
        }
    },

    onClickChoseBetNum: function (event, data) {  //选择下注档位
        var configData = gameData.getConfigId(); //获取配置表数据
        if (configData) {
            var index = parseInt(data); //索引
            this.m_nSelectIndx = index;
            var betList = configData.bets.split(';');
            if (betList && betList.length != 0) {
                this.m_nBetNum = betList[index];
            }

            for (var i = 0; i < this.m_tChipBtnList.length; i++) {
                var animNode = this.m_tChipBtnList[i].getChildByName('clickAnim');
                if (i == index) {
                    animNode.active = true;
                    animNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('saoguang');
                } else {
                    animNode.active = false;
                }
            }
        }
    },

    updateTotalBet: function () {//更新总下注金额
        var totalBet = gameData.getAllBet();
        var count = 9;

        var showTag = false;
        for (; count > -1; count--) {
            var num = parseInt(totalBet / Math.pow(10, count));
            totalBet = totalBet % Math.pow(10, count);
            showTag = num > 0 || showTag;
            this.m_tTotalBetTxtList[count].string = num;
            this.m_tTotalBetTxtList[count].node.active = count == 0 ? true : showTag;
        }
    },

    showGameState: function () {//更新游戏状态
        var gameState = gameData.getGameState();//游戏整体状态
        if (gameState == 1) {//游戏押注开始
            this.playAudio(21, false);//新局开始播发

            var self = this;
            var closeAnim = function () {
                self.m_oOpNode.active = false;
                var anim = self.m_oOpNode.getChildByName('shen_d').getComponent(cc.Animation);
                anim.off('finished', closeAnim, this);
            }
            this.m_oOpNode.active = true;
            var anim = this.m_oOpNode.getChildByName('shen_d').getComponent(cc.Animation);
            anim.on('finished', closeAnim, this);
            anim.play();
            anim.setCurrentTime(0);


            var animNode = this.m_tChipBtnList[this.m_nSelectIndx].getChildByName('clickAnim'); //上一次下注的扫光标记
            animNode.active = true;
            animNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('saoguang');
            this.switchGameState(gameState);
        }
    },

    switchGameState: function (gameState) {//游戏状态切换
        this.m_oBetTimeNode.active = false;
        this.m_oEndOpNode.active = false;
        this.m_oWaitNode.active = false;

        this.openGame = false;
        switch (gameState) {
            case gameType.GameSate.BetGame: //下注中
                if (gameData.getLeftTime() == 0) {
                    this.switchGameState(gameType.GameSate.WaitGame);
                    return;
                }
                this.m_oBetTimeNode.active = true;

                this.m_nRemainBetTime = gameData.getLeftTime();
                this.m_nTimerProgress = this.m_nRemainBetTime;
                this.timeText.string = gameData.getLeftTime();
                this.setAllBtnEnable(true);
                this.setTimeTxt();
                break;
            case gameType.GameSate.ResultGame: //结算中
                this.setAllBtnEnable(false);
                this.m_oEndOpNode.active = true;
                var self = this;
                var closeAnim = function () {
                    self.m_oOpNode.active = false;
                    var anim = self.m_oEndOpNode.getChildByName('fu_d').getComponent(cc.Animation);
                    anim.off('finished', closeAnim, this);
                }
                var anim = this.m_oEndOpNode.getChildByName('fu_d').getComponent(cc.Animation);
                anim.on('finished', closeAnim, this);
                anim.play();
                anim.setCurrentTime(0);
                break;
            case gameType.GameSate.WaitGame: //等待中
                this.setAllBtnEnable(false);
                this.m_oWaitNode.active = true;
                var bone = this.m_oWaitNode.getComponent(sp.Skeleton);
                bone.setAnimation(0, 'sm_ts_yxjxz', true);

                break;
            case gameType.GameSate.OpenGame: //开始跑马
                this.openGame = true;
                AudioManager.stopMusic();

                this.setAllBtnEnable(false);
                if (!this.m_bOpBet) //本局没有操作，清除续投
                    gameData.clearLastOwnBetList();
                else {
                    gameData.copyOwnBetListToLastOwnBetList();
                }
                this.m_bOpBet = false;

                if (this.m_oRunMainUI) {
                    if (gameData.runRankList.length <= 0) {
                        setTimeout(() => {//等1秒网络延迟
                            if (this.node.isValid) {
                                if (gameData.runRankList.length > 0) {
                                    this.m_oRunMainUI.active = true;
                                    this.m_oRunMainUI.getComponent('horse_racing_horses_Control').playRunAct();
                                } else {
                                    this.reconnectToWait();
                                }
                            }
                        }, 1000);
                    } else {
                        this.m_oRunMainUI.active = true;
                        this.m_oRunMainUI.getComponent('horse_racing_horses_Control').playRunAct();
                    }
                } else {
                    this.reconnectToWait();
                }
                break;
        }
    },

    setTimeTxt: function () {
        if (this.m_nRemainBetTime > 0) {
            if (this.m_nRemainBetTime <= 5) {
                this.countDownTimeState = 2;
            } else if (this.m_nRemainBetTime <= 10) {
                this.countDownTimeState = 1;
            } else {
                this.countDownTimeState = 0;
            }

            if (Math.ceil(this.m_nRemainBetTime) == 10) {
                this.playAudio(22, false); //还剩10秒下注时间提示
            }
            else if (Math.ceil(this.m_nRemainBetTime) == 5) {
                this.playAudio(11, false); //倒计时
            }

            if (this.m_nRemainBetTime < 9)
                this.timeText.string = '0' + Math.ceil(this.m_nRemainBetTime);
            else
                this.timeText.string = Math.ceil(this.m_nRemainBetTime);

            this.startCount = true;

            this.m_nTimerProgress = this.m_nRemainBetTime;
            this.m_oTimeAct.fillRange = 1 - this.m_nTimerProgress / 25;
        } else {
            this.setAllBtnEnable(false); //所有按钮置灰

            var closeAnim = () => {
                var anim = this.m_oEndOpNode.getChildByName('fu_d').getComponent(cc.Animation);
                anim.off('finished', closeAnim, this);
                this.m_oBetTimeNode.active = false;
                this.m_nRemainBetTime = 0;
                this.m_oEndOpNode.active = false;
                this.stopBet();
            };

            var anim = this.m_oEndOpNode.getChildByName('fu_d').getComponent(cc.Animation);
            anim.on('finished', closeAnim, this);
            anim.play();
            anim.setCurrentTime(0);
            this.m_oEndOpNode.active = true;

            this.startCount = false;
            this.timeText.string = '00';
            this.countDownTimeState = 0;

            this.m_nTimerProgress = 0;
            this.m_oTimeAct.fillRange = 1;
        }
    },

    stopBet: function () {
        this.m_oOpNode.active = false;
        this.switchGameState(gameType.GameSate.OpenGame);
    },

    setAllBtnEnable: function (isEnable) {//设置按钮是否可使用
        this.m_tChipBtnList.forEach(function (btnNode) { //下注档次按钮
            btnNode.getComponent(cc.Button).interactable = isEnable;
            if (!isEnable) {
                btnNode.getChildByName('betNumTxt').color = cc.color(70, 65, 65);
                var animNode = btnNode.getChildByName('clickAnim');
                animNode.active = false;
            } else
                btnNode.getChildByName('betNumTxt').color = cc.color(0, 0, 0);
        });

        this.m_tBetBtnList.forEach(function (betNode) {//下注按钮
            betNode.getComponent(cc.Button).interactable = isEnable;
        });

        this.m_oContinueBtn.interactable = (isEnable && gameData.checkCanContinueBet());
        this.m_oClearBtn.interactable = (isEnable && gameData.checkCanClear());
    },

    playerNumUpdate: function () {//更新玩家人数
        var node = cc.dd.Utils.seekNodeByName(this.m_tGameMainUI[0], 'role_num')
        node.getComponent(cc.Label).string = gameData.getPlayerNum();

        // var node1 = cc.dd.Utils.seekNodeByName(this.m_oRunGameUi, 'role_num')
        // node1.getComponent(cc.Label).string = gameData.getPlayerNum();
    },

    playerLeave: function (data) {//玩家离开
        var jlmj_prefab = require('jlmj_prefab_cfg');
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '您的金币小于此房间最低金币限制';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '由于长时间未操作，您已离开游戏';
                        break;
                    case 4:
                        str = '当前禁止该游戏，请联系管理员';
                        break;
                }
                var func = function () {
                    gameData.clearGameData();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                gameData.clearGameData();
                cc.dd.SceneManager.enterHall();
            }
        }
    },

    reconnectToWait: function () {//断线重连，结算中
        this.clearMainUI();
        this.setAllBtnEnable(false);
        this.switchGameState(gameType.GameSate.WaitGame);
        gameData.setGameState(2);

    },

    clearMainUI: function () {//清理主界面显示
        this.m_bOpBet = false;
        for (var i = 0; i < 21; i++) {
            this.updateHorseBetInfo(this.m_tHorseBetNodeList[i], false, null);
        }
        gameData.setAllBet(0);
        this.updateTotalBet();
        this.m_oBetTimeNode.active = false;
    },

    reconnectToGoOn: function () {//重连游戏，下注中
        this.setTimeTxt();
    },


    openRecordUI: function (msg) {//打开游戏记录界面
        this.m_nRecordSendIndex = msg.index + 1; //设置发送数据向上的index

        var UI = cc.dd.UIMgr.getUI('gameyj_horse_racing/prefabs/horse_racing_Record_UI');
        if (UI) {
            UI.getComponent('horse_racing_Record_UI').setRecordData(msg); //设置剩下的数据
        } else {
            cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/horse_racing_Record_UI', function (ui) {
                if (ui) {
                    ui.getComponent('horse_racing_Record_UI').openRecordUI(msg); //打开游戏记录界面
                }
            })
        }
    },

    onClickChoseBetNum: function (event, data) {  //选择下注档位
        var configData = gameData.getRoomConfigData(); //获取配置表数据
        if (configData) {
            var index = parseInt(data); //索引
            this.m_nSelectIndx = index;
            var betList = configData.bets.split(';');
            if (betList && betList.length != 0) {
                this.m_nBetNum = betList[index];
            }

            for (var i = 0; i < this.m_tChipBtnList.length; i++) {
                var animNode = this.m_tChipBtnList[i].getChildByName('clickAnim');
                if (i == index) {
                    animNode.active = true;
                    animNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('saoguang');
                } else {
                    animNode.active = false;
                }
            }
        }

    },

    onClickBet: function (event, data) {//点击按钮下注
        var pbData = new cc.pb.horse.msg_horse_bet_req(); //发送下注请求
        var pbInfo = new cc.pb.horse.horse_bet_info();
        var index = parseInt(data);
        pbData.setOpType(1);
        pbInfo.setId(index);
        pbInfo.setSfBet(this.m_nBetNum);
        pbData.setBetInfo(pbInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.horse.cmd_msg_horse_bet_req, pbData, 'msg_horse_bet_req', true);
        this.m_bOpBet = true;
        this.m_oClearBtn.interactable = true;
        this.m_oContinueBtn.interactable = false;
    },

    onClickCoinueBet: function (event, data) {//续投
        if (gameData.checkCoinToConinueBet()) {
            var lastList = gameData.getAllLastOwnBetList();
            for (var i = 0; i < lastList.length; i++) {
                var info = lastList[i];
                if (info) {
                    var pbData = new cc.pb.horse.msg_horse_bet_req(); //发送下注请求
                    var pbInfo = new cc.pb.horse.horse_bet_info();
                    var index = parseInt(info.betId);
                    pbData.setOpType(1);
                    pbInfo.setId(index);
                    pbInfo.setSfBet(info.betValue);
                    pbData.setBetInfo(pbInfo);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.horse.cmd_msg_horse_bet_req, pbData, 'msg_horse_bet_req', true);

                }
                this.m_bOpBet = true;
                this.m_oClearBtn.interactable = true;
            }
        } else {
            cc.dd.PromptBoxUtil.show('当前金币不足，不能进行续投');
        }
        this.m_oContinueBtn.interactable = false;
    },

    onClickClear: function (event, data) {//清除下注
        var pbData = new cc.pb.horse.msg_horse_bet_req(); //发送下注请求
        pbData.setOpType(2);
        cc.gateNet.Instance().sendMsg(cc.netCmd.horse.cmd_msg_horse_bet_req, pbData, 'msg_horse_bet_req', true);
        this.m_oClearBtn.interactable = false;
        this.m_bOpBet = false;
    },

    onClickQuit: function () {
        var str = '';
        if (gameData.getStartCoin() >= gameData.getCoin()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (gameData.getCoin() - gameData.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                AudioManager.stopMusic();

                var msg = new cc.pb.room_mgr.msg_leave_game_req();

                var gameType = 107;
                var roomId = RoomMgr.Instance().roomId;
                var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                gameInfoPB.setGameType(gameType);
                gameInfoPB.setRoomId(roomId);

                msg.setGameInfo(gameInfoPB);

                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
            }.bind(this), null
        );
    },

    onKeyDown: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.escape) {
            this.onClickQuit();
        }
    },

    onClickRecord: function () {//发送游戏记录请求
        this.m_nRecordSendIndex = 1;

        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(this.m_nRecordSendIndex);
        msg.setGameType(107);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req, msg, "msg_get_excite_game_record_req", true);
    },

    onClickFunBtn: function (event, data) {//点击按钮功能响应
        // this.playAudio(10002, false);

        switch (data) {
            case 'FUNCTION':
                this.m_oFunctionUI.active = !this.m_oFunctionUI.active;
                break;
            case 'RULE':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/horse_racing_Rule_UI', function (ui) {
                    ui.setLocalZOrder(3000);
                }.bind(this));
                break;
            case 'SETTING':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/horse_racing_Setting_UI', function (ui) {
                    ui.setLocalZOrder(3000);
                }.bind(this));
                break;
            case 'QUIT':
                this.m_oFunctionUI.active = false;
                this.onClickQuit();
                break;
            case 'RECORD':
                this.m_oFunctionUI.active = false;
                this.onClickRecord();
                break;
        }
    },

    clickShop: function (event, data) {
        //this.playAudio(10002, false);
        cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/com_game_bag', function (ui) {
            ui.getComponent('com_game_bag');
        }.bind(this));
    },


    //转换筹码字
    convertChipNum: function (num, type) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5) + '万';
            else
                str = str.substr(0, 4) + '万';
        } else if (num >= 100000000) {
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5) + '亿';
            else
                str = str.substr(0, 4) + '亿';
        }
        return str
    },

    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case horse_racing_Event.HORSE_RACING_INIT: //初始化游戏
                this.initGameMainUI();
                break;
            case horse_racing_Event.HORSE_RACING_UPDATE: //游戏状态更新
                this.initGameMainUI();
                this.showGameState();
                break;
            case horse_racing_Event.HORSE_RACING_UPDATE_BET_AREA: //更新游戏下注信息
                this.updateBetArea();
                this.updateGold();
                this.updateTotalBet();
                break;
            case horse_racing_Event.HORSE_RACING_UPDATE_BET: //更新个人下注
            case horse_racing_Event.HORSE_RACING_BET_CLEAR: //清理下注信息
                this.updateOwnBetInfo(parseInt(data));
                this.updateGold();
                break;
            case horse_racing_Event.HORSE_RACING_PLAYER_ENTER: //玩家进入离开
            case horse_racing_Event.HORSE_RACING_PLAYER_EXIT:
                this.playerNumUpdate();
                break;
            case horse_racing_Event.HORSE_RACING_PLAYER_COIN_CHANGE:
                this.updateGold();
                break;
            case horse_racing_Event.HORSE_RACING_RUN_END:
                if (this.m_oRunMainUI.active) {
                    this.m_oRunMainUI.getComponent('horse_racing_horses_Control').getHorseInfo(data);
                }
                break;
            case horse_racing_Event.HORSE_RACING_TURN:
                if (this.m_oRunMainUI.active) {
                    this.m_oRunMainUI.getComponent('horse_racing_horses_Control').setTurnCamera(data);
                }
                break;
            case Hall.HallEvent.PLAYER_OP_RECORD://往期记录消息已经返回
                this.openRecordUI(data);
                break;
            case Hall.HallEvent.PLAYER_OP_RECORD_NULL: //玩家无操作记录消息返回
                cc.dd.PromptBoxUtil.show('您尚未进行下注，没有游戏记录');
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                gameData.clearGameData();
                cc.dd.SceneManager.enterHall();
                break;
            case SysEvent.PAUSE:
                this._syspausetime = new Date().getTime();
                cc.log('暂停 剩余倒计时:' + this.m_nRemainBetTime);
                break;
            case SysEvent.RESUME:
                var ui = cc.dd.UIMgr.getUI('gameyj_horse_racing/prefabs/Scence_game');
                if (ui) {
                    cc.dd.UIMgr.destroyUI(ui);

                    this.m_oRunMainUI = null;
                }

                setTimeout(() => {
                    if (this.node.isValid) {
                        cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/Scence_game', function (ui) {
                            this.m_oRunMainUI = ui;
                            this.m_oRunMainUI.active = false;

                            if (this._syspausetime != null) {
                                let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                                cc.log(`恢复 剩余倒计时${this.m_nRemainBetTime} ${durtime}`);
                                // this.m_nRemainBetTime -= parseInt(durtime);
                                // this.m_nRemainBetTime += 1;
                                this.m_nRemainBetTime -= durtime;
                                cc.log(`恢复 剩余倒计时 同步${this.m_nRemainBetTime}`);
                                if (this.m_nRemainBetTime < 3) {
                                    this.reconnectToWait();  //将游戏整体设置为等待状态
                                } else {
                                    this.reconnectToGoOn(); //游戏继续进行
                                }
                            }
                        }.bind(this));
                    }
                }, 50);
                break;
        }
    },

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = audioConfig.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return [AudioManager.playSound(gameAudioPath + name, isloop), data.time];
    },

});
