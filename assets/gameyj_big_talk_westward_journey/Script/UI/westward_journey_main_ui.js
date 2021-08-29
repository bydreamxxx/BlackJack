//create by wj 2019/12/04
var hallData = require('hall_common_data').HallCommonData;
var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');
var gameIconConfig = require('westward_Journey_Config').IconConfg;
var gameType = require('westward_Journey_Config').WestwardJourneyGameType;
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
const xy_audio = require('xiyou_audio');
const gameAudioPath = require('westward_Journey_Config').AuditoPath;
var hall_prop_data = require('hall_prop_data').HallPropData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_tWayBillList: [],
        m_tImageNode: [],
        m_tChipBtnList: [],
        m_tBetBtnList: [],
        m_tPlayerHead: [],
        m_tPlayerHeadStartPos: [],
        m_oContinueBtn: cc.Button, //续投按钮
        m_oAtals: cc.SpriteAtlas,
        m_nRemainBetTime: 0, //剩余时间
        m_oBeginNode: cc.Node, //本局开始节点
        m_nBetNum: 0,
        m_nSelectIndx: 0,
        m_tPlayerBetAct: [], //保存玩家下注内容
        m_nPlayerBetIndex: 0,
        m_bSetGameState: false,
        m_tChangePlayer: [],
        m_oFailNode: cc.Node,
        m_oChipNode: cc.Node,
        m_oBigWinNode: cc.Node,
        m_oChangePanel: { default: [], type: cc.Node },
        m_oJuBaoTxt: cc.Label,
        m_oFunctionUI: cc.Node,
        m_oRuleUI: cc.Node,
        m_bOpenShop: false,
        m_oYujingPing: cc.Animation,
        m_olightning: cc.Node,
        m_oWaitNode: cc.Node,
        m_nBetAudioId: 6,
        /////////////////跑马灯相关//////////////
        m_nBeginPos: 0, //开始点
        m_nFinalPos: 0, //结束点
        m_nLeftStep: 0, //结束跑的格子数
        m_nSubRunStep: 0,//减速跑的格子数
        m_nRunState: gameType.GameRunState.RunDefault, //跑马灯状态
        m_nStep: 0, //格数
        m_runAddTimer: 0, //加速时间控制
        m_runUniformTimer: 0, //高匀速时间控制
        m_runUniformTotalTimer: 0, //高匀速总时长
        m_runSubTimer: 0, //减速跑计时
        m_stopTimer: 0, //停止
        m_nSubRunTimeStep: 0,
        m_nReverseRunSetp: 0,
        m_nRecordSendIndex: 1,
    },

    onLoad() {
        //DingRobot.set_ding_type(9);
        game_Ed.addObserver(this);
        RoomED.addObserver(this);
        SysED.addObserver(this);
        HallCommonEd.addObserver(this);
        Hall.HallED.addObserver(this);


        for (var i = 0; i < 16; i++) { //绑定路单节点
            this.m_tWayBillList[i] = cc.dd.Utils.seekNodeByName(this.node, "icon_node" + i);
            this.m_tWayBillList[i].active = false;
        }

        this.m_oBetTimeNode = cc.dd.Utils.seekNodeByName(this.node, 'bettimeNode'); //下注提示节点
        this.m_oRunNode = cc.dd.Utils.seekNodeByName(this.node, 'runningNode'); //运行中节点
        this.m_oEndNode = cc.dd.Utils.seekNodeByName(this.node, 'endNode'); //计算中提示节点

        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "cointxt").getComponent(cc.Label); //玩家金币 

        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "nametext").getComponent(cc.Label); //设置名字
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 7);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "userHeadNode").getComponent('klb_hall_Player_Head'); //设置头像
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'westward_head_init');

        for (var i = 0; i < 27; i++) {//跑的icon
            this.m_tImageNode[i] = cc.dd.Utils.seekNodeByName(this.node, 'iconNode' + (i + 1));
        }

        for (var k = 0; k < 4; k++) {//下注筹码档位选择 
            this.m_tChipBtnList[k] = cc.dd.Utils.seekNodeByName(this.node, 'chipBtn' + k);
        }

        for (var i = 0; i < 8; i++) { //前八排名
            this.m_tPlayerHead[i] = cc.dd.Utils.seekNodeByName(this.node, 'headNode' + i);
            this.m_tPlayerHeadStartPos[i] = this.m_tPlayerHead[i].getPosition();
        }

        for (var m = 0; m < 11; m++) {//下注选择区
            this.m_tBetBtnList[m] = cc.dd.Utils.seekNodeByName(this.node, 'betBtn' + m);
        }
        this.m_oContinueBtn.interactable = false;
        if (AudioManager._getLocalMusicSwitch())
            this.m_nMusicId = AudioManager.playMusic(gameAudioPath + 'dhxy_bgm');

        //筹码
        var json = cc.sys.localStorage.getItem('westward_journey_chip');
        if (json == 'undefined' || json == null) {
            cc.sys.localStorage.setItem('westward_journey_chip', true);
        }
        this.updateYujinPing();
    },

    onDestroy: function () {
        game_Ed.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    //游戏初始化
    initGame: function () {
        this.initBetRank();
        this.showWayBill(); //更新显示路单

        var gameState = game_Data.getGameState(); //游戏状态
        if (gameState == 2) {//游戏进行中，需要等待
            gameState = gameType.GameSate.WaitGame
        } else {
            //下注区间展示
            var betAreaList = game_Data.getBetAreaList();
            betAreaList.forEach(function (data) {
                this.m_oChipNode.getComponent('westward_journey_chip_manager').betAct(0, data.id, data.value, 0, false); //下注动画
                this.m_oChipNode.getComponent('westward_journey_chip_manager').showAreaTotalBet(data.id);
            }.bind(this))
        }
        this.switchGameState(gameState);
    },

    initBetRank: function () {//初始化下注筹码与排行
        var top8Player = game_Data.getPlayerList();//获取前8数据
        for (var i = 0; i < top8Player.length; i++) {
            var player = top8Player[i];
            var index = player.rank - 1;
            if (this.m_tPlayerHead[index]) {
                this.m_tPlayerHead[index].getChildByName('headSp').getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'westward_head_init');
                this.m_tPlayerHead[index].getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(player.coin, 1);
            }
        }

        if (this.m_oUserGold)
            this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1);

        var configData = game_Data.getRoomConfigData(); //获取配置表数据
        if (configData) {
            var betList = configData.bets.split(';');
            if (betList && betList.length != 0) {
                for (var i = 0; i < betList.length; i++) //设置下注档位
                    this.m_tChipBtnList[i].getChildByName('numTxt').getComponent(cc.Label).string = this.convertChipNum(betList[i], 0);
            }
            this.m_nBetNum = betList[this.m_nSelectIndx];
            var animNode = this.m_tChipBtnList[this.m_nSelectIndx].getChildByName('clickAnim');
            animNode.active = true;
            animNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('saoguang');
        }

        this.m_oChipNode.getComponent('westward_journey_chip_manager').initChip();
        this.playerNumUpdate();

    },

    //显示路单
    showWayBill: function () {
        for (var i = 0; i < 16; i++)
            this.m_tWayBillList[i].active = false;
        var wayBillList = game_Data.getBillWayLsit(); //获取路单数据
        for (var k = 0; k < wayBillList.length; k++) {
            var data = wayBillList[k];
            if (data) {
                this.m_tWayBillList[k].active = true;
                if (data.type != 0)
                    this.setIcon(this.m_tWayBillList[k], 12)
                else
                    this.setIcon(this.m_tWayBillList[k], data.iconsList[0])
            }
        }
    },

    //设置路单icon
    setIcon: function (node, icon) {
        var iconNode = node.getChildByName('icon');
        if (iconNode) {
            var data = gameIconConfig.getItem(function (item) {
                if (item.id == icon)
                    return item;
            })
            var sprite = this.m_oAtals.getSpriteFrame(data.icon);
            iconNode.getComponent(cc.Sprite).spriteFrame = sprite;
        }
    },

    showGameState: function () {//更新游戏状态
        var gameState = game_Data.getGameState();//游戏整体状态
        if (gameState == 1) {//游戏押注开始
            this.m_oChipNode.getComponent('westward_journey_chip_manager').createChipPool();

            for (var i = 0; i < 26; i++) {//屏蔽所有高光图标
                var highLightNode = this.m_tImageNode[i].getChildByName('lightIcon');
                if (highLightNode)
                    highLightNode.active = false; //显示高亮
                var shineNode = this.m_tImageNode[i].getChildByName('runShine');
                if (shineNode)
                    shineNode.active = false;
                var drawNode = this.m_tImageNode[i].getChildByName('drawShine');
                if (drawNode)
                    drawNode.active = false;
            }

            this.m_oBeginNode.active = true;
            var particleNode = this.m_oBeginNode.getChildByName('benjukaishi1');
            if (particleNode) {
                particleNode.active = true;
                particleNode.getComponent(cc.ParticleSystem).resetSystem();

            }
            var boneNode = this.m_oBeginNode.getChildByName('benjukaishi');
            if (boneNode) {
                var bone = boneNode.getComponent(sp.Skeleton);
                bone.clearTracks();
                bone.setAnimation(0, 'benjukaishi', false);
                bone.setCompleteListener(function () {
                    this.m_oBeginNode.active = false;
                    particleNode.active = false;
                    bone.setCompleteListener(null);
                }.bind(this));
            }
            this.playAudio(8, false);

            var animNode = this.m_tChipBtnList[this.m_nSelectIndx].getChildByName('clickAnim'); //上一次下注的扫光标记
            animNode.active = true;
            animNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('saoguang');

        }
        this.switchGameState(gameState);
    },

    switchGameState: function (gameState) {//游戏状态切换
        this.m_oBetTimeNode.active = false;
        this.m_oRunNode.active = false;
        this.m_oEndNode.active = false;

        switch (gameState) {
            case gameType.GameSate.BetGame: //下注中
                this.m_oWaitNode.active = false;
                if (this.m_oWaitTimeOut) {
                    clearTimeout(this.m_oWaitTimeOut);
                    this.m_oWaitTimeOut = null;
                }
                this.m_oBetTimeNode.active = true;
                var timeText = this.m_oBetTimeNode.getChildByName('timetxt').getComponent(cc.Label);

                this.m_nRemainBetTime = game_Data.getLeftTime();
                timeText.string = game_Data.getLeftTime() < 10 ? '0' + game_Data.getLeftTime() : game_Data.getLeftTime();
                this.m_oChangePanel[0].active = true;
                this.m_oChangePanel[1].active = false;
                this.setAllBtnEnable(true);

                var self = this;
                function setTimeTxt() { //倒计时更新
                    self.m_oBetTime = setTimeout(function () {
                        self.m_nRemainBetTime -= 1;
                        if (self.m_nRemainBetTime > 0) {
                            if (self.m_nRemainBetTime < 10)
                                timeText.string = '0' + self.m_nRemainBetTime;
                            else
                                timeText.string = self.m_nRemainBetTime;
                            ///////////////todo: 倒计时计时音效
                            if (self.m_nRemainBetTime <= 5)
                                self.playAudio(5, false);
                            setTimeTxt();
                        } else if (self.m_nRemainBetTime <= 0) {
                            self.m_nRemainBetTime = 0;
                            self.m_oBetTimeNode.active = false;
                            self.setAllBtnEnable(false); //所有按钮置灰
                            self.m_oChangePanel[0].active = false;
                            self.m_oChangePanel[1].active = true;
                            self.m_oJuBaoTxt.string = game_Data.getJuBao();
                            self.switchGameState(gameType.GameSate.OpenGame);
                        }
                    }, 1000);
                }
                setTimeTxt();
                break;
            case gameType.GameSate.OpenGame://开奖中
                this.m_oRunNode.active = true;
                this.m_oRunNode.getChildByName('timetxt').active = false;

                this.setAllBtnEnable(false);
                //this.m_nBeginPos = this.m_nFinalPos;
                this.runGame(gameType.GameRunState.RunBegin);
                if (game_Data.getResultType() == 0) {
                    if (game_Data.getWinAreaList()[0].betId == 3)
                        this.m_olightning.active = true;

                    this.playAudio(3, false);
                } else {
                    this.m_olightning.active = true;
                    this.playAudio(4, false);
                }
                this.m_oBigWinNode.getComponent('westward_journey_big_win').setPlayerInfo();
                break;
            case gameType.GameSate.ResultGame: //结算中
                this.setAllBtnEnable(false);
                this.m_oEndNode.active = true;
                break;
            case gameType.GameSate.WaitGame: //等待中
                this.m_oRunNode.active = true;
                var timeNode = this.m_oRunNode.getChildByName('timetxt');
                timeNode.active = true;
                var timeText = timeNode.getComponent(cc.Label);
                var leftTime = 88;
                timeText.string = leftTime;
                this.m_oWaitNode.active = true;

                this.setAllBtnEnable(false);
                this.m_oChangePanel[0].active = true;
                this.m_oChangePanel[1].active = false;
                break;
        }
    },

    setAllBtnEnable: function (isEnable) {//设置按钮是否可使用
        this.m_tChipBtnList.forEach(function (btnNode) { //下注档次按钮
            btnNode.getComponent(cc.Button).interactable = isEnable;
            if (!isEnable) {
                btnNode.getChildByName('numTxt').color = cc.color(70, 65, 65);
                var animNode = btnNode.getChildByName('clickAnim');
                animNode.active = false;
            } else
                btnNode.getChildByName('numTxt').color = cc.color(0, 0, 0);
        });

        this.m_tBetBtnList.forEach(function (betNode) {//下注按钮
            betNode.getComponent(cc.Button).interactable = isEnable;
        });

        this.m_oContinueBtn.interactable = (isEnable && game_Data.checkCanContinueBet());
    },

    playerBet: function (data) {//玩家下注
        for (var betInfo of data.betList) {
            if (data.userId == cc.dd.user.id) {//玩家自己的下注
                var betId = betInfo.betId;
                var bet = betInfo.betSelf;
                game_Data.updatePlayerCoin(data.userId, bet);//更新玩家身上金币显示

                ///////////////////todo:下注动画////////////////////////////
                var json = cc.sys.localStorage.getItem('westward_journey_chip');
                if (json == 'true')
                    this.m_oChipNode.getComponent('westward_journey_chip_manager').playerBetAct(-1, betId, bet, 0, true);
                game_Data.updateOwnBetArea(betId, bet);//更新自己的下注区间显示

                var betInfoNode = this.m_tBetBtnList[betId - 1].getChildByName('betInfo');
                betInfoNode.active = true;

                var playerBet = game_Data.getOwnBetAreaInfoById(betId);
                betInfoNode.getChildByName('betNum').getComponent(cc.Label).string = this.convertChipNum(playerBet.value, 1);

                if (this.m_oUserGold)
                    this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1); //更新自己金币
                var player = game_Data.findPlayerByUserId(data.userId);
                if (player)
                    this.m_tPlayerHead[player.rank - 1].getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(player.coin, 1); //更新玩家身上金币

            } else {//其他玩家下注
                var betId = betInfo.betId;
                var bet = betInfo.betSelf;


                var json = cc.sys.localStorage.getItem('westward_journey_chip');
                if (json == 'true') {
                    var saveInfo = {
                        userId: data.userId,
                        betId: betId,
                        bet: bet,
                    }
                    var player = game_Data.findPlayerByUserId(data.userId);
                    if (player)
                        this.m_tPlayerHead[player.rank - 1].getComponent('westward_journey_player_op').playPlayerBetAct(saveInfo);
                } else {
                    var player = game_Data.findPlayerByUserId(data.userId);
                    if (player) {
                        game_Data.updatePlayerCoin(data.userId, bet);//更新玩家身上金币显示
                        this.m_tPlayerHead[player.rank - 1].getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(player.coin, 1); //更新玩家身上金币
                    }
                }


            }
        }
    },

    // playPlayerBetAct: function(){
    //     if(this.m_tPlayerBetAct.length == 0){
    //         this.m_nPlayerBetIndex = 0;
    //         return;
    //     }
    //     this.m_nPlayerBetIndex += 1;
    //     var info = this.m_tPlayerBetAct.shift();
    //     var player = game_Data.findPlayerByUserId(info.userId);
    //     if(player){
    //         game_Data.updatePlayerCoin(info.userId, info.bet);//更新玩家身上金币显示

    //         var self = this;
    //         var startPos = this.m_tPlayerHead[player.rank - 1].getPosition();
    //         self.m_oChipNode.getComponent('westward_journey_chip_manager').playerBetAct(player.rank, info.betId, info.bet, 0, true); //下注动画
    //         var act = cc.sequence(cc.moveTo(0.1, cc.v2(startPos.x + 20, startPos.y)), cc.delayTime(0.08), cc.callFunc(function(){
    //                 self.m_tPlayerHead[player.rank - 1].getChildByName('coin').getComponent(cc.Label).string = self.convertChipNum(player.coin, 1); //更新玩家身上金币
    //                 self.m_tPlayerHead[player.rank - 1].runAction(cc.moveTo(0.1, cc.v2(69, startPos.y)));
    //                 self.playPlayerBetAct();
    //         }));
    //         if((player.rank - 1) % 2 != 0){
    //             act = cc.sequence(cc.moveTo(0.1, cc.v2(startPos.x - 20, startPos.y)), cc.delayTime(0.08), cc.callFunc(function(){
    //                     self.m_tPlayerHead[player.rank - 1].getChildByName('coin').getComponent(cc.Label).string = self.convertChipNum(player.coin, 1); //更新玩家身上金币
    //                     self.m_tPlayerHead[player.rank - 1].runAction(cc.moveTo(0.1, cc.v2(-65, startPos.y)));
    //                     self.playPlayerBetAct();
    //             }));
    //         }
    //         this.m_tPlayerHead[player.rank - 1].runAction(act);
    //     }

    // },

    updateBetArea: function (data) {//下注区域更新
        var newValue = this.converValue(data.value);
        ///////////////////todo:下注动画////////////////////////////
        this.playAudio(this.m_nBetAudioId, false);
        this.m_nBetAudioId += 1;
        if (this.m_nBetAudioId == 8)
            this.m_nBetAudioId = 6;

        this.m_oChipNode.getComponent('westward_journey_chip_manager').betAct(0, data.id, newValue, 0, true); //下注动画
    },

    converValue: function (value) {
        var numStr = value.toString();
        var firstNum = parseInt(numStr[0]);
        //var secondNum = parseInt(numStr[1]);
        var lastNum = parseInt(numStr[numStr.length - 1]);
        for (var i = 0; i < numStr.length - 1; i++) {
            firstNum = firstNum * 10;
        }

        return firstNum + lastNum;
    },


    /**
     * 玩家数量更新
     * @param {*}  
     */
    playerNumUpdate() {
        var node = cc.dd.Utils.seekNodeByName(this.node, 'role_num')
        node.getComponent(cc.Label).string = game_Data.getPlayerNum().toString();
    },

    changePlayer: function (index) {//前8名切换
        var player = game_Data.findPlayerByUserId(index)

        var startPos = this.m_tPlayerHead[player.rank - 1].getPosition();
        var width = this.m_tPlayerHead[player.rank - 1].width;
        this.m_tChangePlayer.push(player.rank);
        var moveto = cc.moveTo(0.2, cc.v2(0 - width / 2, startPos.y));
        if ((player.rank - 1) % 2 != 0)
            moveto = cc.moveTo(0.2, cc.v2(width / 2, startPos.y));

        this.m_tPlayerHead[player.rank - 1].runAction(cc.sequence(moveto, cc.delayTime(0.04), cc.callFunc(function () {
            var indexRank = this.m_tChangePlayer.shift();
            this.m_tPlayerHead[indexRank - 1].getChildByName('headSp').getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'fqzs_head_init');
            this.m_tPlayerHead[indexRank - 1].getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(player.coin, 1);
            if ((indexRank - 1) % 2 == 0)
                this.m_tPlayerHead[indexRank - 1].runAction(cc.moveTo(0.2, cc.v2(69, this.m_tPlayerHead[indexRank - 1].y)));
            else
                this.m_tPlayerHead[indexRank - 1].runAction(cc.moveTo(0.2, cc.v2(-65, this.m_tPlayerHead[indexRank - 1].y)));
        }.bind(this))));
    },

    playerLeave: function (data) {//玩家离开消息
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
                    game_Data.clearGameData();
                    game_Data.clearLastOwnBetList();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                game_Data.clearGameData();
                game_Data.clearLastOwnBetList();
                if (!this.m_bOpenShop)
                    cc.dd.SceneManager.enterHall();
                else
                    cc.dd.SceneManager.erterHallChange();
            }
            this.m_bOpenShop = false;
        }
    },

    showChip: function (isShow) {//是否显示筹码
        if (isShow) {
            var betAreaList = game_Data.getBetAreaList();
            betAreaList.forEach(function (data) {
                this.m_oChipNode.getComponent('westward_journey_chip_manager').betAct(0, data.id, data.value, 0, false); //下注动画
                this.m_oChipNode.getComponent('westward_journey_chip_manager').showAreaTotalBet(data.id);
            }.bind(this));
        } else {
            this.m_oChipNode.getComponent('westward_journey_chip_manager').clearSurplusChips();
            var betAreaList = game_Data.getBetAreaList();
            betAreaList.forEach(function (data) {
                this.m_oChipNode.getComponent('westward_journey_chip_manager').showAreaTotalBet(data.id);
            }.bind(this));
        }
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

    onClickChoseBetNum: function (event, data) {  //选择下注档位
        this.playAudio(2, false);
        var configData = game_Data.getRoomConfigData(); //获取配置表数据
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
        this.playAudio(2, false);
        var pbData = new cc.pb.xiyou.msg_xiyou_bet_req(); //发送下注请求
        var List = [];
        var pbInfo = new cc.pb.xiyou.xiyou_bet_info();
        var index = parseInt(data);
        pbInfo.setBetId(index);
        pbInfo.setBetSelf(parseInt(this.m_nBetNum));
        List.push(pbInfo)
        pbData.setBetList(List);
        cc.gateNet.Instance().sendMsg(cc.netCmd.xiyou.cmd_msg_xiyou_bet_req, pbData, 'msg_xiyou_bet_req', true);
        this.m_bOpBet = true;
    },

    clickCoinueBet: function (event, data) {//续投
        this.playAudio(2, false);
        if (game_Data.checkCoinToConinueBet()) {
            var pbData = new cc.pb.xiyou.msg_xiyou_bet_req(); //发送下注请求
            var List = [];

            var lastList = game_Data.getAllLastOwnBetList();
            for (var i = 0; i < lastList.length; i++) {
                var info = lastList[i];
                if (info) {
                    var pbInfo = new cc.pb.xiyou.xiyou_bet_info();
                    var index = parseInt(info.betId);
                    pbInfo.setBetId(index);
                    pbInfo.setBetSelf(info.betValue);
                    List.push(pbInfo)
                }
            }
            pbData.setBetList(List);
            cc.gateNet.Instance().sendMsg(cc.netCmd.xiyou.cmd_msg_xiyou_bet_req, pbData, 'msg_xiyou_bet_req', true);
            this.m_bOpBet = true;
        } else {
            cc.dd.PromptBoxUtil.show('当前金币不足，不能进行续投');
        }
        this.m_oContinueBtn.interactable = false;
    },

    onClickFunBtn: function (event, data) {//点击按钮功能响应
        this.playAudio(2, false);
        switch (data) {
            case 'FUNCTION':
                this.m_oFunctionUI.active = !this.m_oFunctionUI.active;
                break;
            case 'RULE':
                this.m_oFunctionUI.active = false;
                this.m_oRuleUI.active = !this.m_oRuleUI.active;
                break;
            case 'SETTING':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/westward_journey_Setting_UI', function (ui) {
                    ui.zIndex = 3000;
                    //ui.getComponent("").show(str, func, 2);
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

    onClickQuit: function () {
        this.playAudio(2, false);

        var str = '';
        if (game_Data.getStartCoin() >= game_Data.getCurCoin()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (game_Data.getCurCoin() - game_Data.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                // cc.audioEngine.stop(this.m_nMusicId);
                AudioManager.stopMusic();

                var msg = new cc.pb.room_mgr.msg_leave_game_req();

                var gameType = 105;
                var roomId = RoomMgr.Instance().roomId;
                var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                gameInfoPB.setGameType(gameType);
                gameInfoPB.setRoomId(roomId);

                msg.setGameInfo(gameInfoPB);

                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
            }.bind(this), null
        );
    },

    onClickRecord: function () {
        this.m_nRecordSendIndex = 1;

        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(this.m_nRecordSendIndex);
        msg.setGameType(105);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req, msg, "msg_get_excite_game_record_req", true);
    },

    clickShop: function (event, data) {
        this.playAudio(2, false);
        cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/westward_journey_bag', function (ui) {
            ui.getComponent('westward_journey_bag');
        }.bind(this));
    },

    clickShowPlayer: function (event, data) { //显示玩家信息
        this.playAudio(2, false);
        var index = parseInt(data);

        var node = this.m_tPlayerHead[index].getChildByName('player_Info_node');
        if (node) {
            var player = game_Data.findPlayerByRank(index + 1);
            if (player) {
                node.getChildByName('name').getComponent(cc.Label).string = player.name;
                if (player.userId == cc.dd.user.id) {
                    node.getChildByName('id').getComponent(cc.Label).string = player.userId;
                } else {
                    node.getChildByName('id').getComponent(cc.Label).string = '';
                }
                cc.find('bg/dss_paihangbang_tk_di02', node).active = player.userId == cc.dd.user.id;
                node.active = true;
            }
        }
        cc.dd.Utils.seekNodeByName(this.node, 'clickHide').active = true;
    },

    clickHidePlayerInfo: function (event, data) { //关闭玩家信息
        for (var i = 0; i < this.m_tPlayerHead.length; i++) {
            var node = this.m_tPlayerHead[i].getChildByName('player_Info_node');
            if (node) {
                node.active = false;
            }
        }
        cc.dd.Utils.seekNodeByName(this.node, 'clickHide').active = false;
    },

    clickYuJingPing: function (event, data) {//点击玉净瓶
        this.m_oYujingPing.play('yujingping_dianji');
        var self = this;
        var cliclkCallBack = function () {
            self.m_oYujingPing.off('finished', cliclkCallBack);
            var data = hall_prop_data.getItemInfoByDataId(1101);
            if (data == null) {
                cc.dd.DialogBoxUtil.show(1, '是否前往商城购买玉净瓶？', '确定', '取消', function () {
                    var msg = new cc.pb.room_mgr.msg_leave_game_req();

                    var gameType = 105;
                    var roomId = RoomMgr.Instance().roomId;
                    var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                    gameInfoPB.setGameType(gameType);
                    gameInfoPB.setRoomId(roomId);

                    msg.setGameInfo(gameInfoPB);

                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
                    self.m_bOpenShop = true;

                }, null);
            } else {
                cc.dd.PromptBoxUtil.show("已购买玉净瓶");
                self.m_oYujingPing.play('yujingping_jihuo');
            }

        }
        self.m_oYujingPing.on('finished', cliclkCallBack);
    },

    ///////////////////////////////////////////////////主体动画begin//////////////////////////////////////////////////
    update: function (dt) {
        switch (this.m_nRunState) {
            case gameType.GameRunState.RunBegin://开始运行
                this.m_runAddTimer += dt;
                if (this.m_runAddTimer >= (gameType.GameTimeControl.AddSpeedTotalTime / gameType.GameTimeControl.AddSpeedStep)) {
                    this.m_runAddTimer = 0;
                    this.runGame(gameType.GameRunState.RunBegin);
                }
                break;
            case gameType.GameRunState.RunUniformSpeed://高匀速转
                this.m_runUniformTimer += dt;
                if (this.m_runUniformTimer >= (gameType.GameTimeControl.RunUniformTotalTime / (gameType.GameTimeControl.RunUniformCircle * 26))) {
                    this.m_runUniformTimer = 0;
                    this.m_runUniformTotalTimer += dt; //总时长计数
                    this.runGame(gameType.GameRunState.RunUniformSpeed);
                }
                break;
            case gameType.GameRunState.RunSubSpeed://减速运行
                this.m_runSubTimer += dt;
                if (this.m_runSubTimer >= (gameType.GameTimeControl.SubRunTotalTime / this.m_nSubRunTimeStep)) {
                    this.m_runSubTimer = 0;
                    this.runGame(gameType.GameRunState.RunSubSpeed);
                }
                break;
            case gameType.GameRunState.RunEnd: //停止运行
                this.m_stopTimer += dt;
                if (game_Data.getResultType() != 0) {
                    if (this.m_stopTimer >= (gameType.GameTimeControl.EndRunTotalTime / 3)) {
                        this.m_stopTimer = 0;
                        this.runGame(gameType.GameRunState.RunEnd);
                    }
                } else {
                    if (this.m_stopTimer >= (1.2 / 3)) {
                        this.m_stopTimer = 0;
                        this.runGame(gameType.GameRunState.RunEnd);
                    }
                }
                break;
            case gameType.GameRunState.ReverseRun: //再次跑
                this.m_runSubTimer += dt;
                if (this.m_runSubTimer >= (3.5 / this.m_nReverseRunSetp)) {
                    this.m_runSubTimer = 0;
                    this.runGame(gameType.GameRunState.ReverseRun);
                }
                break;
        }
    },


    runGame: function (state) {
        var self = this;
        self.m_nRunState = state;
        if (state == gameType.GameRunState.RunBegin) {//开始跑
            self.m_nStep += 1;
            for (var i = 0; i < self.m_nStep; i++) {
                var index = (self.m_nBeginPos + i) % 26; //索引点
                var highLightNode = this.m_tImageNode[index].getChildByName('lightIcon');
                if (highLightNode) {
                    highLightNode.active = true; //显示高亮
                }
                var shineNode = this.m_tImageNode[index].getChildByName('runShine');
                if (shineNode) {
                    shineNode.active = true;
                    var opacity = 255 - (self.m_nStep - i - 1) % 26 * 20;
                    shineNode.setOpacity(opacity); //设置透明度
                }
            }
            if (self.m_nStep == gameType.GameTimeControl.AddSpeedStep) {//如果达到预定加速步骤数
                self.m_nStep += 2;
                self.runGame(gameType.GameRunState.RunUniformSpeed);//切换匀速状态
            }
        } else if (state == gameType.GameRunState.RunUniformSpeed) {//高匀速跑
            self.m_nStep += 1;
            for (var i = 0; i < 26; i++) {//屏蔽所有高光图标
                var highLightNode = this.m_tImageNode[i].getChildByName('lightIcon');
                if (highLightNode)
                    highLightNode.active = false; //显示高亮
                var shineNode = this.m_tImageNode[i].getChildByName('runShine');
                if (shineNode)
                    shineNode.active = false;
            }
            for (var i = self.m_nStep; i >= (self.m_nStep - 9); i--) {
                var index = (self.m_nBeginPos + i) % 26; //索引点
                var highLightNode = this.m_tImageNode[index].getChildByName('lightIcon');

                if (highLightNode) {
                    highLightNode.active = true; //显示高亮
                }

                var shineNode = this.m_tImageNode[index].getChildByName('runShine');
                if (shineNode) {
                    var opacity = 255 - (self.m_nStep - i - 1) % 26 * 20;
                    shineNode.setOpacity(opacity); //设置透明度
                    shineNode.active = true;
                }
            }
            if (self.m_runUniformTotalTimer >= gameType.GameTimeControl.RunUniformTotalTime) {
                self.m_runUniformTotalTimer = 0;
                self.m_nLeftStep = parseInt(Math.random() * (5 - 3 + 1) + 3, 10); //做停止操作的计数
                if (game_Data.getResultType() == 0)
                    self.m_nLeftStep = 5;
                self.m_nFinalPos = game_Data.getResultList()[0] - 1;
                if (game_Data.getResultType() != 0)
                    self.m_nFinalPos = 4; //月光宝盒
                var endPos = self.m_nFinalPos - self.m_nLeftStep - 1;
                self.m_nSubRunStep = (endPos < 0 ? (endPos + 26) : endPos) - ((self.m_nStep + self.m_nBeginPos) % 26);//当前位置与预估结束位置的差值
                self.m_nSubRunStep = self.m_nSubRunStep < 0 ? self.m_nSubRunStep + 26 : self.m_nSubRunStep; //真实的减速格子数; 1 - 23差距
                self.m_nSubRunStep = self.m_nSubRunStep < 10 ? self.m_nSubRunStep + 26 : self.m_nSubRunStep; //真实的减速格子数; 27 - 35差距
                self.m_nSubRunTimeStep = self.m_nSubRunStep;
                self.runGame(gameType.GameRunState.RunSubSpeed);//切换减速状态
            }
        } else if (state == gameType.GameRunState.RunSubSpeed) {//减速运行
            self.m_nStep += 1;
            self.m_nSubRunStep -= 1;

            for (var i = 0; i < 26; i++) {//屏蔽所有高光图标
                var highLightNode = this.m_tImageNode[i].getChildByName('lightIcon');
                if (highLightNode)
                    highLightNode.active = false; //显示高亮
                var shineNode = this.m_tImageNode[i].getChildByName('runShine');
                if (shineNode)
                    shineNode.active = false;
            }
            var setpIndex = 9;
            if (self.m_nSubRunStep < 9) {
                setpIndex = self.m_nSubRunStep;
            }
            for (var i = self.m_nStep; i >= (self.m_nStep - setpIndex); i--) {
                var index = (self.m_nBeginPos + i) % 26; //索引点
                var highLightNode = this.m_tImageNode[index].getChildByName('lightIcon');
                if (highLightNode) {
                    highLightNode.active = true; //显示高亮
                }

                var shineNode = this.m_tImageNode[index].getChildByName('runShine');
                if (shineNode) {
                    shineNode.active = true;
                    var opacity = 255 - (self.m_nStep - i) % 26 * 20;
                    shineNode.setOpacity(opacity); //设置透明度
                }
            }

            self.m_nSubRunTimeStep -= 1;
            if (self.m_nSubRunTimeStep <= 3)
                self.m_nSubRunTimeStep = 3;
            if (self.m_nSubRunStep == 0)
                self.runGame(gameType.GameRunState.RunEnd);//停止状态

        } else if (state == gameType.GameRunState.RunEnd) {//停止运行
            for (var i = 0; i < 26; i++) {//屏蔽所有高光图标
                var highLightNode = this.m_tImageNode[i].getChildByName('lightIcon');
                if (highLightNode)
                    highLightNode.active = false; //显示高亮
                var shineNode = this.m_tImageNode[i].getChildByName('runShine');
                if (shineNode)
                    shineNode.active = false;
            }
            var index = (self.m_nBeginPos + self.m_nStep) % 26; //索引点

            var highLightNode = this.m_tImageNode[index].getChildByName('lightIcon');
            if (highLightNode) {
                highLightNode.active = true; //显示高亮
            }
            var shineNode = this.m_tImageNode[index].getChildByName('runShine');

            if ((self.m_nStep + self.m_nBeginPos) % 26 == self.m_nFinalPos)
                shineNode = this.m_tImageNode[index].getChildByName('drawShine');
            if (shineNode) {
                shineNode.active = true;
                shineNode.setOpacity(255); //设置透明度
            }
            self.m_nStep += 1;

            if ((self.m_nStep + self.m_nBeginPos) % 26 == self.m_nFinalPos + 1) {
                self.m_nStep = 0;
                self.m_nLeftStep = 0;
                self.m_stopTimer = 0;
                self.m_runAddTimer = 0;
                self.m_runSubTimer = 0;
                self.m_runUniformTimer = 0;
                self.m_runUniformTotalTimer = 0;
                self.m_nBeginPos = self.m_nFinalPos;
                self.m_nRunState = gameType.GameRunState.RunDefault; //设置默认值

                if (!self.m_bOpBet) //本局没有操作，清除续投
                    game_Data.clearLastOwnBetList();
                else {
                    game_Data.copyOwnBetListToLastOwnBetList();
                }
                self.m_bOpBet = false;

                if (game_Data.getResultType() == 0) {//非月光宝盒
                    self.showResultUI(game_Data.getResultList()[0], true);//普通
                } else {
                    if (game_Data.getResultType() != 4) { //不是惜败
                        self.showResultUI(5, false);//月光宝盒
                    } else {//  惜败
                        this.m_oFailNode.active = true;
                        this.playAudio(21, false);
                        var failSkeleton = this.m_oFailNode.getChildByName('xibai');
                        var bone = failSkeleton.getComponent(sp.Skeleton);
                        bone.clearTracks();
                        bone.setAnimation(0, 'animation', false);
                        bone.setCompleteListener(function () {
                            self.m_oFailNode.active = false;
                            bone.setCompleteListener(null);
                            self.showFinalResult();
                        });
                    }

                }
            }
        } else if (state == gameType.GameRunState.ReverseRun) {//月光宝盒再次跑
            self.m_nLeftStep -= 1;
            self.m_nStep += 1;
            if (self.m_nStep <= gameType.GameTimeControl.ReverseSpeedSetp) {//初始6格子
                for (var i = 0; i < self.m_nStep; i++) {
                    var index = (self.m_nBeginPos + i) % 26; //索引点
                    var highLightNode = self.m_tImageNode[index].getChildByName('lightIcon');
                    if (highLightNode) {
                        highLightNode.active = true; //显示高亮
                    }
                    var shineNode = self.m_tImageNode[index].getChildByName('runShine');
                    if (shineNode) {
                        shineNode.active = true;
                        var opacity = 255 - (self.m_nStep - i - 1) % 26 * 20;
                        shineNode.setOpacity(opacity); //设置透明度
                    }
                }
            } else {
                for (var i = 0; i < 26; i++) {//屏蔽所有高光图标
                    var highLightNode = self.m_tImageNode[i].getChildByName('lightIcon');
                    if (highLightNode)
                        highLightNode.active = false; //显示高亮
                    var shineNode = self.m_tImageNode[i].getChildByName('runShine');
                    if (shineNode)
                        shineNode.active = false;
                }
                var setpIndex = gameType.GameTimeControl.ReverseSpeedSetp;
                if (self.m_nLeftStep <= gameType.GameTimeControl.ReverseSpeedSetp) {
                    setpIndex = self.m_nLeftStep;
                }
                for (var i = self.m_nStep; i >= (self.m_nStep - setpIndex); i--) {
                    var index = (self.m_nBeginPos + i) % 26; //索引点
                    var highLightNode = self.m_tImageNode[index].getChildByName('lightIcon');
                    if (highLightNode) {
                        highLightNode.active = true; //显示高亮
                    }

                    var shineNode = self.m_tImageNode[index].getChildByName('runShine');
                    if (shineNode) {
                        shineNode.active = true;
                        var opacity = 255 - (self.m_nStep - i) % 26 * 20;
                        shineNode.setOpacity(opacity); //设置透明度
                    }
                }
                if (self.m_nLeftStep == 0)
                    self.runGame(gameType.GameRunState.ReverseRunEnd);//停止状态

            }
        } else if (state = gameType.GameRunState.ReverseRunEnd) {
            for (var i = 0; i < 26; i++) {//屏蔽所有高光图标
                var highLightNode = this.m_tImageNode[i].getChildByName('lightIcon');
                if (highLightNode)
                    highLightNode.active = false; //显示高亮
                var shineNode = this.m_tImageNode[i].getChildByName('runShine');
                if (shineNode)
                    shineNode.active = false;
            }
            var index = (self.m_nBeginPos + self.m_nStep) % 26; //索引点

            var highLightNode = this.m_tImageNode[index].getChildByName('lightIcon');
            if (highLightNode) {
                highLightNode.active = true; //显示高亮
            }
            var shineNode = this.m_tImageNode[index].getChildByName('runShine');

            if ((self.m_nStep + self.m_nBeginPos) % 26 == self.m_nFinalPos) {

                self.m_nStep = 0;
                self.m_nLeftStep = 0;
                self.m_runSubTimer = 0;
                self.m_nBeginPos = self.m_nFinalPos;
                self.m_nRunState = gameType.GameRunState.RunDefault; //设置默认值
                self.m_nReverseRunSetp = 0;

                shineNode = this.m_tImageNode[index].getChildByName('drawShine');

                self.showResultUI(game_Data.getResultList()[self.m_nResultCount - 1], (self.m_nResultCount - 1 == 0));//普通
                self.m_nResultCount -= 1;
            }
            if (shineNode) {
                shineNode.active = true;
                shineNode.setOpacity(255); //设置透明度
            }
        }
    },

    runReverse: function () {
        if (!game_Data.getIsReverseRun()) //不是再次跑
            this.m_nResultCount = game_Data.getResultList().length;//结果个数
        this.m_nBeginPos = this.m_nFinalPos;
        this.m_nFinalPos = game_Data.getResultList()[this.m_nResultCount - 1] - 1;

        this.m_nLeftStep = this.m_nFinalPos - this.m_nBeginPos;
        this.m_nLeftStep = this.m_nLeftStep < 0 ? this.m_nLeftStep + 26 : this.m_nLeftStep;
        this.m_nLeftStep = this.m_nLeftStep < 17 ? this.m_nLeftStep + 26 : this.m_nLeftStep;
        this.m_nReverseRunSetp = this.m_nLeftStep;
        this.runGame(gameType.GameRunState.ReverseRun);
        this.playAudio(22, false);
        game_Data.setReverseRun(true);
    },

    showResultUI: function (result, isEnd) {//显示结果
        var data = gameIconConfig.getItem(function (item) {//获取数据
            for (var index of item.indexList) {
                if (index == result)
                    return item;
            }
        });

        if (data) {
            switch (data.type) {
                case 0: //仙
                    cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/showXianResult', function (ui) {
                        var cpt = ui.getComponent('show_role_result_ui');
                        if (cpt)
                            cpt.initUI(data.id, result - 1);
                    })
                    break;
                case 1: //魔
                    cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/showMoResult', function (ui) {
                        var cpt = ui.getComponent('show_role_result_ui');
                        if (cpt)
                            cpt.initUI(data.id, result - 1);
                    })
                    break;
                case 2: //齐天大圣
                    cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/qitiandasheng_ui', function (ui) {
                    })
                    break;
                case 3: //月光宝盒 
                    cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/yueguangbaohe_ui', function (ui) {
                    });
                    break;
            }
        }
        if (data.id != 12)
            this.m_oChipNode.getComponent('westward_journey_chip_manager').showWinShineAct(data.id);
    },

    playPaoHitAct: function () {//再次发炮
        var ui = cc.dd.UIMgr.getUI('gameyj_big_talk_westward_journey/Prefab/yueguangbaohe_ui');
        var cpt = ui.getComponent('yueguangbaohe_ui');
        if (cpt)
            cpt.playYueGuangBaoHe();
    },

    showFinalResult: function () {//显示结算界面
        cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/resultUI', function (ui) {
            var cpt = ui.getComponent('show_result_ui');
            if (cpt)
                cpt.initResultUI();
        });
        cc.dd.UIMgr.destroyUI('gameyj_big_talk_westward_journey/Prefab/yueguangbaohe_ui');
        this.m_oChipNode.getComponent('westward_journey_chip_manager').clearSurplusChips();
        this.m_oChipNode.getComponent('westward_journey_chip_manager').hideShineAct();
        for (var i = 0; i < this.m_tBetBtnList.length; i++)//隐藏自己下注的数据
            this.m_tBetBtnList[i].getChildByName('betInfo').active = false;
        if (this.m_oUserGold)
            this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1);
        this.showWayBill(); //显示新的路单
        game_Data.setReverseRun(false);
        this.showPlayerGetResult(); //显示玩家输赢
        this.m_olightning.active = false;
        this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1);
    },

    updateYujinPing: function () {
        var data = hall_prop_data.getItemInfoByDataId(1101);
        if (data == null) {
            this.m_oYujingPing.stop('yujingping_jihuo');
        } else {
            this.m_oYujingPing.play('yujingping_jihuo');
        }
    },

    showBigWin: function () {
        this.m_oBigWinNode.getComponent('westward_journey_big_win').showBigWin();
        this.updateYujinPing();
    },

    //隐藏飘字动画
    HidePlayerResultNode: function () {
        for (var i = 0; i < 8; i++) {
            var playerHead = cc.dd.Utils.seekNodeByName(this.node, 'headNode' + i);
            if (playerHead) {
                var moveNode = cc.dd.Utils.seekNodeByName(playerHead, 'winNode');
                moveNode.active = false;
                moveNode.y = -35;
                moveNode.stopAllActions();

                moveNode = cc.dd.Utils.seekNodeByName(playerHead, 'failNode');
                moveNode.active = false;
                moveNode.y = -35;
                moveNode.stopAllActions();
            }
        }

        this.m_nPlayerBetIndex = 0;
        this.m_tPlayerBetAct.splice(0, this.m_tPlayerBetAct.length);
    },

    showPlayerGetResult: function () {//显示玩家的结算
        var self = this;
        var playerList = game_Data.getPlayerList();
        var bHideShow = false;
        for (var i = 0; i < playerList.length; i++) {
            var playerInfo = playerList[i];

            this.m_tPlayerHead[playerInfo.rank - 1].getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(playerInfo.coin, 1);

            if (playerInfo.win > 0) {
                bHideShow = true;
                var playerHead = cc.dd.Utils.seekNodeByName(this.node, 'headNode' + (playerInfo.rank - 1));
                if (playerHead) {
                    var winNodeNum = cc.dd.Utils.seekNodeByName(playerHead, 'winNum');
                    winNodeNum.getComponent(cc.Label).string = '+' + this.convertChipNum(playerInfo.win, 0);

                    var moveNode = cc.dd.Utils.seekNodeByName(playerHead, 'winNode');
                    moveNode.active = true;

                    var startPos = moveNode.getPosition();
                    moveNode.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(startPos.x, startPos.y + 70)), cc.delayTime(0.5), cc.callFunc(function () {
                        moveNode.setPosition(startPos);
                        if (i == playerList.length)
                            self.HidePlayerResultNode();
                    })))
                }
            } else if (playerInfo.win < 0) {
                bHideShow = true;
                var playerHead = cc.dd.Utils.seekNodeByName(this.node, 'headNode' + (playerInfo.rank - 1));
                if (playerHead) {
                    var failNodeNum = cc.dd.Utils.seekNodeByName(playerHead, 'failNum');
                    failNodeNum.getComponent(cc.Label).string = '-' + this.convertChipNum(parseInt(-playerInfo.win), 0);

                    var moveNode = cc.dd.Utils.seekNodeByName(playerHead, 'failNode');
                    moveNode.active = true;

                    var startPos = moveNode.getPosition();
                    moveNode.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(startPos.x, startPos.y + 70)), cc.delayTime(0.5), cc.callFunc(function () {
                        moveNode.setPosition(startPos);
                        if (i == playerList.length)
                            self.HidePlayerResultNode();

                    })))
                }
            }
            if (i == playerList.length - 1 && bHideShow == false)
                self.HidePlayerResultNode();
        }
    },

    openRecordUI: function (msg) {//打开游戏记录界面
        this.m_nRecordSendIndex = msg.index + 1; //设置发送数据向上的index

        var UI = cc.dd.UIMgr.getUI('gameyj_big_talk_westward_journey/Prefab/westward_journey_history');
        if (UI) {
            UI.getComponent('westward_journey_History').setRecordData(msg); //设置剩下的数据
        } else {
            cc.dd.UIMgr.openUI('gameyj_big_talk_westward_journey/Prefab/westward_journey_history', function (ui) {
                if (ui) {
                    ui.getComponent('westward_journey_History').openRecordUI(msg); //打开游戏记录界面
                }
            })
        }
    },
    ///////////////////////////////////////////////////主体动画end//////////////////////////////////////////////////

    reconnectToWait: function () {//重连游戏，将游戏设置等待
        this.m_oChipNode.getComponent('westward_journey_chip_manager').clearChipAllUI(); //清理所有筹码有关数据
        for (var i = 0; i < this.m_tBetBtnList.length; i++)
            this.m_tBetBtnList[i].getChildByName('betInfo').active = false;

        this.switchGameState(gameType.GameSate.WaitGame);
        game_Data.setGameState(2);
        this.m_bSetGameState = true;
    },

    reconnectToGoOn: function () {//重连游戏，下注中
        this.m_oChipNode.getComponent('westward_journey_chip_manager').clearChipAllUI(); //清理所有筹码有关数据
        this.m_oChipNode.getComponent('westward_journey_chip_manager').initChip();
        var betAreaList = game_Data.getBetAreaList();
        betAreaList.forEach(function (data) {
            this.m_oChipNode.getComponent('westward_journey_chip_manager').betAct(0, data.id, data.value, 0, false); //下注动画
            this.m_oChipNode.getComponent('westward_journey_chip_manager').showAreaTotalBet(data.id);
        }.bind(this));
    },

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = xy_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case game_Event.Westward_Journey_INIT://游戏初始化
                this.initGame();
                break;
            case game_Event.Westward_Journey_Bet: //下注消息
                this.playerBet(data);
                break;
            case game_Event.Westward_Journey_BET_AREA_UPDATE: //更新下注区域
                this.updateBetArea(data); //更新下注区域区间显示
                break;
            case game_Event.Westward_Journey_UPDATE_GAME: //游戏状态更新
                game_Data.setReverseRun(false);
                this.showGameState();
                this.m_bSetGameState = false;
                break;
            case game_Event.Westward_journey_PLAYER_ENTER: //玩家进入
            case game_Event.Westward_journey_PLAYER_EXIT: //玩家离开
                this.playerNumUpdate();
                break;
            case game_Event.Westward_Journey_PLAYER_COIN_CHANGE: //玩家金币更新
                this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1);
                break;
            case game_Event.Westward_Journey_PLAYER_CHANGE: //前8名次切换 
                this.changePlayer(data);
                break;
            case game_Event.Westward_Journey_RUN_REPEAT: //月光宝盒再次跑
                this.runReverse();
                break;
            case game_Event.Westward_Journey_CHECK_RESULT: //检查结果  
                if (game_Data.getIsReverseRun() && this.m_nResultCount > 0)
                    this.playPaoHitAct();//再次发射炮弹表现
                else
                    this.showFinalResult();//结算界面
                break;
            case game_Event.Westward_Journey_BIG_WIN://显示大赢家
                this.showBigWin(); //显示大赢家   
                break;
            case game_Event.Westward_Journey_CHIP: //筹码显示操作  
                this.showChip(data);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                cc.dd.SceneManager.enterHall();
                game_Data.clearGameData();
                game_Data.clearLastOwnBetList();
                break;
            case SysEvent.PAUSE:
                this._syspausetime = new Date().getTime();
                cc.log('暂停 剩余倒计时:' + this.m_nRemainBetTime);
                break;
            case SysEvent.RESUME:
                if (this._syspausetime != null) {
                    let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                    this.m_nRemainBetTime -= durtime;
                    if (durtime < 3) {
                        this.reconnectToWait();  //将游戏整体设置为等待状态
                    } else {
                        this.reconnectToGoOn(); //游戏继续进行
                    }
                }
                break;
            case Hall.HallEvent.PLAYER_OP_RECORD: //玩家操作记录消息返回
                this.openRecordUI(data); //打开游戏记录界面
                break;
            case Hall.HallEvent.PLAYER_OP_RECORD_NULL: //玩家无操作记录消息返回
                cc.dd.PromptBoxUtil.show('您尚未进行下注，没有游戏记录');
                break;
        }
    },
});
