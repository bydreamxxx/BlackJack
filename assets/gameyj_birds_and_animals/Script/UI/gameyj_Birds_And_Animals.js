// create by wj 2019/07/29
var gameType = require('birds_and_animals_config').BirdsAndAnimalsGameType;
var gameIconConfig = require('birds_and_animals_config').IconConfg;
const gameAudioPath = require('birds_and_animals_config').AuditoPath;
var game_Data = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();
var game_Ed = require('birds_and_animals_data').Birds_And_Animals_Ed;
var game_Event = require('birds_and_animals_data').Birds_And_Animals_Event;
var hallData = require('hall_common_data').HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const fqzs_audio = require('fqzs_audio');
var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
var DingRobot = require('DingRobot');
var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        m_nCurrentPos: 1, //当前跑到的点
        m_nBeginPos: 0, //开始运行位置，作为记录保存点
        m_nFinalPos: 0, //结束位置，靠服务器获取
        m_tRunImage: { default: [], type: cc.Node, tooltip: '光标' },
        m_tImageNode: [],
        m_tWayBillList: [], //路单
        m_tTagSprite: { default: [], type: cc.SpriteFrame, tooltip: '标签' },
        m_nRemainBetTime: 0, //剩余时间
        m_tBetBtnList: [], // '下注按钮'
        m_tChipBtnList: [], //'下注档次按钮'
        m_nBetNum: 0,
        m_nSelectIndx: 0,
        m_oWaitNode: cc.Node,
        m_oAtals: cc.SpriteAtlas,
        m_nStep: 0,
        m_runAddTimer: 0,
        m_nRunState: gameType.GameRunState.RunDefault,
        m_nRoundCount: 0,
        m_runSubTimer: 0,
        m_nLeftStep: 0,
        m_nSubStep: 0,
        m_bRepeatRun: false,
        m_bReverseRun: false,
        m_oChipNode: cc.Node,
        m_oResultNode: cc.Node,
        m_oBigWinNode: cc.Node,
        m_oFunctionUI: cc.Node,
        m_oRuleUI: cc.Node,
        m_oSettingUI: cc.Node,
        m_nResultNum: 0,

        m_nSubSeepControl: 0,
        m_tPlayerHead: [],
        m_oSpecialSke: { default: null, type: sp.Skeleton, tooltip: '特殊动画动画' },
        m_tChangePlayer: [],
        m_bSetGameState: false,
        m_tPlayerBetAct: [],
        m_nPlayerBetIndex: 0,

        m_oContinueBtn: cc.Button,
        m_bOpBet: false,
        m_bRepeatRunTag: false,
    },

    onLoad() {
        DingRobot.set_ding_type(8);

        game_Ed.addObserver(this);
        RoomED.addObserver(this);
        SysED.addObserver(this);
        HallCommonEd.addObserver(this);
        Hall.HallED.addObserver(this);

        Hall.HallData.Instance().BAA_Game = true;

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
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'slot_head_init');

        this.m_oCountDownNode = cc.dd.Utils.seekNodeByName(this.node, 'countdown_ske');
        this.m_oOpNode = cc.dd.Utils.seekNodeByName(this.node, 'start_op_ske');
        this.m_oEndOpNode = cc.dd.Utils.seekNodeByName(this.node, 'end_op_ske');

        for (var i = 0; i < 28; i++) {
            this.m_tImageNode[i] = cc.dd.Utils.seekNodeByName(this.node, 'iconNode' + (i + 1));
        }

        for (var k = 0; k < 4; k++) {
            this.m_tChipBtnList[k] = cc.dd.Utils.seekNodeByName(this.node, 'chipBtn' + k);
        }

        for (var m = 0; m < 11; m++) {
            this.m_tBetBtnList[m] = cc.dd.Utils.seekNodeByName(this.node, 'betBtn' + m);
        }

        for (var i = 0; i < 8; i++) {
            this.m_tPlayerHead[i] = cc.dd.Utils.seekNodeByName(this.node, 'headNode' + i);
        }

        this.m_oContinueBtn.interactable = false;

    },

    onDestroy: function () {
        game_Ed.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        Hall.HallED.removeObserver(this);

        Hall.HallData.Instance().BAA_Game = false;
    },

    //游戏初始化
    initGame: function () {
        this.initBetRank();
        this.showWayBill(); //更新显示路单

        var gameState = game_Data.getGameState();//游戏整体状态
        if (gameState == 2) {
            if (AudioManager._getLocalMusicSwitch()){
                this.m_nMusicId = gameAudioPath + 'begame_WaitBGM';
                AudioManager.playMusic(gameAudioPath + 'begame_WaitBGM');
            }
            gameState = gameType.GameSate.WaitGame;
        }
        if (gameState == 1) {
            var betAreaList = game_Data.getBetAreaList();
            betAreaList.forEach(function (data) {
                this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').betAct(0, data.id, data.value, 0, false); //下注动画
                this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').showAreaTotalBet(data.id);
            }.bind(this))

            if (AudioManager._getLocalMusicSwitch()){
                this.m_nMusicId = gameAudioPath + 'begame_background';
                AudioManager.playMusic(gameAudioPath + 'begame_background');
            }
        }
        this.switchGameState(gameState);
    },

    initBetRank: function () {

        var top8Player = game_Data.getPlayerList();//获取前8数据
        for (var i = 0; i < top8Player.length; i++) {
            var player = top8Player[i];
            var index = player.rank - 1;
            if (this.m_tPlayerHead[index]) {
                this.m_tPlayerHead[index].getChildByName('headSp').getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'fqzs_head_init');
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

        this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').initChip();
        this.playerNumUpdate();
    },

    showGameState: function () {//更新游戏状态
        var gameState = game_Data.getGameState();//游戏整体状态
        if (gameState == 1) {//游戏押注开始
            if (AudioManager._getLocalMusicSwitch()){
                this.m_nMusicId = gameAudioPath + 'begame_background';
                AudioManager.playMusic(gameAudioPath + 'begame_background');
            }

            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').createChipPool();
            this.m_oOpNode.active = true;
            this.playAudio(10001, false);

            var bone = this.m_oOpNode.getComponent(sp.Skeleton);
            bone.setAnimation(0, 'kashixiazhu', false);
            bone.setCompleteListener(function () {
                bone.setCompleteListener(null);
                this.m_oOpNode.active = false;
            }.bind(this));


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
        this.m_oWaitNode.active = false;

        switch (gameState) {
            case gameType.GameSate.BetGame: //下注中
                this.m_oBetTimeNode.active = true;
                var timeText = this.m_oBetTimeNode.getChildByName('timetxt').getComponent(cc.Label);

                this.m_nRemainBetTime = game_Data.getLeftTime();
                timeText.string = game_Data.getLeftTime();
                this.setAllBtnEnable(true);
                this.setTimeTxt();

                break;
            case gameType.GameSate.OpenGame://开奖中
                this.m_oRunNode.active = true;
                this.setAllBtnEnable(false);
                break;
            case gameType.GameSate.ResultGame: //结算中
                this.setAllBtnEnable(false);
                this.m_oEndNode.active = true;
                break;
            case gameType.GameSate.WaitGame: //等待中
                this.setAllBtnEnable(false);
                this.m_oWaitNode.active = true;
                this.m_oEndNode.active = true;
                break;
        }
    },

    setTimeTxt: function () {
        var self = this;
        var timeText = this.m_oBetTimeNode.getChildByName('timetxt').getComponent(cc.Label);
        if (self.m_nRemainBetTime > 0) {
            if (self.m_nRemainBetTime < 10)
                timeText.string = '0' + self.m_nRemainBetTime;
            else
                timeText.string = self.m_nRemainBetTime;
        }
        self.m_oBetTime = setTimeout(function () {
            if (self.m_nRemainBetTime > 0) {
                if (self.m_nRemainBetTime < 10)
                    timeText.string = '0' + self.m_nRemainBetTime;
                else
                    timeText.string = self.m_nRemainBetTime;
                ///////////////todo: 倒计时大数字显示
                if (self.m_nRemainBetTime <= 3)
                    self.playAudio(10003, false);
                if (self.m_nRemainBetTime == 3) {
                    self.m_oCountDownNode.active = true;
                    var Anim = self.m_oCountDownNode.getComponent(sp.Skeleton);
                    Anim.setAnimation(0, 'daojishi', false);
                    self.m_oContinueBtn.interactable = false;
                }
                self.setTimeTxt();
            } else if (self.m_nRemainBetTime <= 0) {
                clearTimeout(self.m_oBetTime);
                self.m_nRemainBetTime = 0;
                self.m_oBetTimeNode.active = false;
                self.m_oCountDownNode.active = false;
                self.setAllBtnEnable(false); //所有按钮置灰
                self.playAudio(10009, false)
                var bone = self.m_oEndOpNode.getComponent(sp.Skeleton);
                bone.setAnimation(0, 'tingzhixiazhu', false);
                bone.setCompleteListener(function () {
                    self.m_oEndOpNode.active = false;
                    bone.setCompleteListener(null);
                    self.stopBet();
                });
                self.m_oEndOpNode.active = true;
            }
            self.m_nRemainBetTime -= 1;
        }, 1000);
    },

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

    //显示路单
    showWayBill: function () {
        for (var i = 0; i < 16; i++) {//重置路单节点
            this.m_tWayBillList[i].active = false;
            this.m_tWayBillList[i].getChildByName('new').active = false;  //新
            this.m_tWayBillList[i].getChildByName('double').active = false; //翻倍
            var childNode = this.m_tWayBillList[i].getChildByName('twicenode')
            if (childNode)
                childNode.removeFromParent(true);
            var childNode1 = this.m_tWayBillList[i].getChildByName('thirdnode')
            if (childNode1)
                childNode1.removeFromParent(true);
        }

        var wayBillList = game_Data.getBillWayLsit(); //获取路单数据
        for (var k = 0; k < wayBillList.length; k++) {
            var data = wayBillList[k];
            if (data) {
                this.m_tWayBillList[k].active = true;
                this.setIcon(this.m_tWayBillList[k], data.icons)
                if (data.type == 1) { //双响炮
                    if (wayBillList[k + 1].type == 1) {

                        var childNode = new cc.Node();
                        var sprite = childNode.addComponent(cc.Sprite);
                        sprite.spriteFrame = this.m_tTagSprite[0];
                        childNode.name = 'twicenode';
                        this.m_tWayBillList[k].addChild(childNode);
                        childNode.x = this.m_tWayBillList[k].width / 2

                        k += 1
                        this.m_tWayBillList[k].active = true;
                        this.setIcon(this.m_tWayBillList[k], wayBillList[k].icons)

                    }
                } else if (data.type == 2) {//三响炮
                    if (wayBillList[k + 1].type == 2 && wayBillList[k + 2].type == 2) {
                        var childNode = new cc.Node();
                        var sprite = childNode.addComponent(cc.Sprite);
                        sprite.spriteFrame = this.m_tTagSprite[1];
                        childNode.name = 'thirdnode';
                        this.m_tWayBillList[k].addChild(childNode);
                        childNode.x = this.m_tWayBillList[k].width

                        k += 1 //第二个数据
                        this.m_tWayBillList[k].active = true;
                        this.setIcon(this.m_tWayBillList[k], wayBillList[k].icons)

                        k += 1 //第三个数据
                        this.m_tWayBillList[k].active = true;
                        this.setIcon(this.m_tWayBillList[k], wayBillList[k].icons)
                    }
                } else if (data.type == 3) {//双倍
                    this.m_tWayBillList[k].getChildByName('double').active = true; //翻倍
                }

                if (k == wayBillList.length - 1) //最新结果
                    this.m_tWayBillList[k].getChildByName('new').active = true; //新

            }
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
        var betId = data.bet.id;
        var bet = data.bet.value;

        game_Data.updatePlayerCoin(data.userId, bet); //更新新的金币

        if (data.userId == cc.dd.user.id) {//玩家自己下注
            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').playerBetAct(-1, betId, bet, 0, true);
            game_Data.updateOwnBetArea(betId, bet);

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
            var saveInfo = {
                userId: data.userId,
                betId: betId,
                bet: bet,
            }
            var player = game_Data.findPlayerByUserId(data.userId);
            if (player)
                this.m_tPlayerHead[player.rank - 1].getComponent('gameyj_Birds_And_Animlas_Player_Op').playPlayerBetAct(saveInfo);


        }
    },


    // playPlayerBetAct: function(saveInfo){
    //     // if(this.m_tPlayerBetAct.length == 0){
    //     //     this.m_nPlayerBetIndex = 0;
    //     //     return;
    //     // }
    //     this.m_nPlayerBetIndex += 1;
    //     var info =  saveInfo; //this.m_tPlayerBetAct.shift();
    //     var player = game_Data.findPlayerByUserId(info.userId);
    //     if(player){
    //         var self = this;
    //         var startPos = this.m_tPlayerStartPos[player.rank - 1];

    //         var act = cc.sequence(cc.moveTo(0.1, cc.v2(startPos.x + 20, startPos.y)), cc.delayTime(0.08), cc.callFunc(function(){
    //             self.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').playerBetAct(player.rank, info.betId, info.bet, 0, true); //下注动画
    //             self.m_tPlayerHead[player.rank - 1].getChildByName('coin').getComponent(cc.Label).string = self.convertChipNum(player.coin, 1); //更新玩家身上金币
    //             self.m_tPlayerHead[player.rank - 1].runAction(cc.moveTo(0.1, cc.v2(69, startPos.y)));
    //             //self.playPlayerBetAct();
    //        }));
    //         if((player.rank - 1) % 2 != 0){
    //             act = cc.sequence(cc.moveTo(0.1, cc.v2(startPos.x - 20, startPos.y)), cc.delayTime(0.08), cc.callFunc(function(){
    //                 self.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').playerBetAct(player.rank, info.betId, info.bet, 0, true); //下注动画
    //                 self.m_tPlayerHead[player.rank - 1].getChildByName('coin').getComponent(cc.Label).string = self.convertChipNum(player.coin, 1); //更新玩家身上金币
    //                 self.m_tPlayerHead[player.rank - 1].runAction(cc.moveTo(0.1, cc.v2(-65, startPos.y)));
    //                 //self.playPlayerBetAct();
    //             }));
    //        }
    //         cc.log('rank=================' + (player.rank - 1));
    //         this.m_tPlayerHead[player.rank - 1].runAction(act);
    //     }

    // },

    updateBetArea: function (data) {//下注区域更新\
        var newValue = this.converValue(data.value);
        this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').betAct(0, data.id, newValue, 0, true); //下注动画

        //this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').showAreaTotalBet(data.id);
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


    stopBet: function () {//动画停止下注动画结束
        this.m_oOpNode.active = false;
        this.m_nBeginPos = this.m_nFinalPos; //
        if (game_Data.getResultType() != 0) {
            this.m_oSpecialSke.node.active = true;
            this.m_oSpecialSke.setCompleteListener(function () {
                this.m_oSpecialSke.node.active = false;
                this.playAudio(10010, false);
                this.runGame(gameType.GameRunState.RunBegin);
                this.switchGameState(gameType.GameSate.OpenGame);
            }.bind(this));
            switch (game_Data.getResultType()) {
                case 1:
                    this.m_oSpecialSke.setAnimation(0, 'shuangxiangpao', false);
                    break;
                case 2:
                    this.m_oSpecialSke.setAnimation(0, 'sanxiangpao', false);
                    break;
                case 3:
                    this.m_oSpecialSke.setAnimation(0, 'lefantian', false);
                    break;
            }
        } else {
            this.playAudio(10010, false);
            this.runGame(gameType.GameRunState.RunBegin);
            this.switchGameState(gameType.GameSate.OpenGame);
        }
    },

    onClickChoseBetNum: function (event, data) {  //选择下注档位
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
        var pbData = new cc.pb.fqzs.msg_fqzs_bet_req(); //发送下注请求
        var pbInfo = new cc.pb.fqzs.fqzs_bet_info();
        var index = parseInt(data);
        pbInfo.setId(index);
        pbInfo.setValue(this.m_nBetNum);
        pbData.setBet(pbInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fqzs.cmd_msg_fqzs_bet_req, pbData, 'msg_fqzs_bet_req', true);
        this.m_bOpBet = true;
    },

    update: function (dt) {
        if (this.m_nRunState == gameType.GameRunState.RunUniformSpeed) {
            this.m_runAddTimer += dt;
            if (this.m_runAddTimer >= this.m_nUniformSpeedTime) {
                this.m_runAddTimer = 0;
                this.runGame(gameType.GameRunState.RunUniformSpeed)
            }
        } else if (this.m_nRunState == gameType.GameRunState.RunSubSpeed) {
            this.m_runSubTimer += dt;
            this.m_nSubSeepControl = gameType.GameTimeControl.SubSpeedTotalTime[this.m_nLeftStep];
            if (this.m_bRepeatRunTag)
                this.m_nSubSeepControl = this.m_nUniformSpeedTime;
            if (this.m_runSubTimer >= this.m_nSubSeepControl) {
                this.m_runSubTimer = 0;
                this.runGame(gameType.GameRunState.RunSubSpeed);
            }
        } else if (this.m_nRunState == gameType.GameRunState.ReverseRun) {
            this.m_runSubTimer += dt;
            if (this.m_runSubTimer >= this.m_nUniformSpeedTime) {
                this.m_runSubTimer = 0;
                this.runGame(gameType.GameRunState.ReverseRun);
            }
        }
    },

    runGame: function (state) {
        var self = this;
        self.m_nRunState = state;
        if (game_Data.isGetResult == false)
            return;

        if (state == gameType.GameRunState.RunBegin) {//开始跑
            var index = self.m_nBeginPos;
            self.m_nStep += 1;

            var tagIndex = self.m_nStep; //记录有几个光标
            for (var i = 0; i < tagIndex; i++) {
                self.m_tRunImage[i].active = true;
                var endPosNode = self.m_tImageNode[(tagIndex + index - 1 - i) % 28]; //光标显示的位置
                self.m_tRunImage[i].setPosition(endPosNode.getPosition());
            }

            if (self.m_nStep == 5) { //四个图标已经显示出来，进行加速
                self.m_nStep = 0;
                self.m_nCurrentPos = index + 5; // 当前位置点

                self.m_nLeftStep = game_Data.getResultList()[0].index - self.m_nBeginPos;
                if (self.m_nLeftStep <= 0)
                    self.m_nLeftStep = gameType.GameTimeControl.RunUniformCircle * 28 + self.m_nLeftStep - gameType.GameTimeControl.SubRunLeftStep - 5;
                else
                    self.m_nLeftStep = (gameType.GameTimeControl.RunUniformCircle - 1) * 28 + self.m_nLeftStep - gameType.GameTimeControl.SubRunLeftStep - 5;
                self.m_nUniformSpeedTime = (gameType.GameTimeControl.RunUniformTotalTime / self.m_nLeftStep).toFixed(3) / 10;
                var runBeginTime = 0.3//gameType.GameTimeControl.BeginRunTime[self.m_nStep - 1];
                var seq = cc.sequence(cc.delayTime(runBeginTime), cc.callFunc(function () {
                    self.runGame(gameType.GameRunState.RunUniformSpeed);//切换加速状态
                    self.m_nAudioNum = self.playAudio(10011, false);
                }))
                self.node.runAction(seq);

            } else {
                var runBeginTime = gameType.GameTimeControl.BeginRunTime[self.m_nStep - 1];
                var seq = cc.sequence(cc.delayTime(runBeginTime), cc.callFunc(function () {
                    self.runGame(gameType.GameRunState.RunBegin);
                }))
                self.node.runAction(seq);
            }
        } else if (state == gameType.GameRunState.RunUniformSpeed) { //匀速跑4圈
            self.m_nCurrentPos += 1; //移动一格
            self.m_nLeftStep -= 1;
            var tagIndex = 5; //记录有几个光标

            for (var i = 0; i < tagIndex; i++) {
                self.m_tRunImage[i].active = true;
                var endPosNode = self.m_tImageNode[(self.m_nCurrentPos - 1 - i) % 28]; //光标显示的位置
                self.m_tRunImage[i].setPosition(endPosNode.getPosition());
            }

            if (self.m_nLeftStep == 0) {
                var currenrPosIndx = (self.m_nCurrentPos % 28);
                self.m_nLeftStep = gameType.GameTimeControl.SubRunLeftStep//game_Data.getResultList()[0].index - currenrPosIndx; //就算结束点
                // if(self.m_nLeftStep < 8)
                //     self.m_nLeftStep += 28;

                self.m_nSubSeepControl = gameType.GameTimeControl.SubSpeedTotalTime[self.m_nLeftStep];//(gameType.GameTimeControl.SubSpeedTotalTime / gameType.GameTimeControl.SubRunLeftStep).toFixed(3) / 3 ;
                self.m_nRoundCount = 0;
                self.runGame(gameType.GameRunState.RunSubSpeed);
                AudioManager.stopSound(self.m_nAudioNum);
                self.playAudio(10012, false);
            }

        } else if (state == gameType.GameRunState.RunSubSpeed) { //减速跑
            if (self.m_nLeftStep != 0) { //未达到预定结束点
                self.m_nCurrentPos += 1; //移动一格

                var tagIndex = self.m_nLeftStep >= 5 ? 5 : self.m_nLeftStep; //记录有几个光标

                for (var i = 0; i < tagIndex; i++) {
                    self.m_tRunImage[i].active = true;
                    var endPosNode = self.m_tImageNode[(self.m_nCurrentPos - 1 - i) % 28]; //光标显示的位置
                    self.m_tRunImage[i].setPosition(endPosNode.getPosition());
                }
                self.m_nLeftStep -= 1;
                if (self.m_nLeftStep <= 4 && self.m_nLeftStep != 0)
                    self.m_tRunImage[self.m_nLeftStep].active = false;

            } else {//第一个图标达到结束点
                self.m_nSubStep = 0;
                self.m_nBeginPos = self.m_nCurrentPos;
                self.runGame(gameType.GameRunState.RunEnd);
                if (self.m_bRepeatRun) {
                    AudioManager.stopSound(self.m_nAudioNum);
                    self.playAudio(10025, false);
                }

                // var tagIndex = 5; //记录有几个光标
                // self.m_nSubStep += 1;
                // for(var i = self.m_nSubStep; i < tagIndex; i ++){
                //     var endPosNode = self.m_tImageNode[(self.m_nCurrentPos - ((i % tagIndex) - self.m_nSubStep) )% 28]; //光标显示的位置
                //     self.m_tRunImage[i].setPosition(endPosNode.getPosition());
                //     if(i == self.m_nSubStep) 
                //         self.m_tRunImage[i].active = false;
                // }

                // if(self.m_nSubStep == 4){
                //     self.m_nSubStep = 0;
                //     self.m_nBeginPos = self.m_nCurrentPos;
                //     self.runGame(gameType.GameRunState.RunEnd);
                // }
            }

        } else if (state == gameType.GameRunState.ReverseRunBegin) {//反向跑开始
            var index = self.m_nBeginPos;
            self.m_nStep += 1;
            self.m_nLeftStep -= 1;

            var tagIndex = self.m_nStep; //记录有几个光标
            for (var i = 0; i < tagIndex; i++) {
                self.m_tRunImage[i].active = true;
                var endPosNode = self.m_tImageNode[(index - tagIndex + i) % 28]; //光标显示的位置
                self.m_tRunImage[i].setPosition(endPosNode.getPosition());
            }
            self.m_nCurrentPos -= 1; //反向一格

            if (self.m_nStep == 5) { //四个图标已经显示出来，进行加速
                self.m_nStep = 0;
                //self.m_nCurrentPos = self.m_nCurrentPos - 4; // 当前位置点
                self.runGame(gameType.GameRunState.ReverseRun);//切换加速状态
            } else {
                var seq = cc.sequence(cc.delayTime(gameType.GameTimeControl.ReverseRunBeginTime), cc.callFunc(function () {
                    self.runGame(gameType.GameRunState.ReverseRunBegin);
                }))
                self.node.runAction(seq);
            }
        } else if (state == gameType.GameRunState.ReverseRun) {//反方向跑
            if (self.m_nLeftStep != 0) { //未达到预定结束点
                var tagIndex = 5; //记录有几个光标
                self.m_nCurrentPos -= 1; //反向一格
                self.m_nLeftStep -= 1;

                for (var i = 0; i < tagIndex; i++) {
                    self.m_tRunImage[i].active = true;
                    var endPosNode = self.m_tImageNode[(self.m_nCurrentPos - 1 + i) % 28]; //光标显示的位置
                    self.m_tRunImage[i].setPosition(endPosNode.getPosition());
                }

            } else {//第一个图标达到结束点
                var tagIndex = 5; //记录有几个光标
                self.m_nSubStep += 1;
                for (var i = self.m_nSubStep; i < tagIndex; i++) {
                    var endPosNode = self.m_tImageNode[(self.m_nCurrentPos - 1 + ((i % tagIndex) - self.m_nSubStep)) % 28]; //光标显示的位置
                    self.m_tRunImage[i].setPosition(endPosNode.getPosition());
                    self.m_tRunImage[(tagIndex - self.m_nSubStep) % 5].active = false;
                }

                if (self.m_nSubStep == 4) {
                    self.m_nSubStep = 0;
                    self.m_nBeginPos = self.m_nCurrentPos;

                    self.runGame(gameType.GameRunState.RunEnd);
                    AudioManager.stopSound(self.m_nAudioNum);
                    self.playAudio(10025, false);
                }

            }
        } else if (state == gameType.GameRunState.RunRepeatBegin) {//再次加速跑
            var index = self.m_nBeginPos;
            self.m_nStep += 1;
            self.m_nLeftStep -= 1;
            self.m_nCurrentPos += 1;

            var tagIndex = self.m_nStep; //记录有几个光标
            for (var i = 0; i < tagIndex; i++) {
                self.m_tRunImage[i].active = true;
                var endPosNode = self.m_tImageNode[(tagIndex + index - 1 - i) % 28]; //光标显示的位置
                self.m_tRunImage[i].setPosition(endPosNode.getPosition());
            }

            if (self.m_nStep == 5) { //四个图标已经显示出来，进行加速
                self.m_nStep = 0;
                self.m_nSubSeepControl = this.m_nUniformSpeedTime;
                self.m_bRepeatRunTag = true;
                self.runGame(gameType.GameRunState.RunSubSpeed);//切换加速状态
            } else {
                var seq = cc.sequence(cc.delayTime(gameType.GameTimeControl.RunRepeatBeginTime), cc.callFunc(function () {
                    self.runGame(gameType.GameRunState.RunRepeatBegin);
                }))
                self.node.runAction(seq);
            }
        } else if (state == gameType.GameRunState.RunEnd) {//结束跑
            self.switchGameState(gameType.GameSate.ResultGame);
            self.m_nFinalPos = self.m_nCurrentPos % 28;
            if (self.m_nFinalPos == 0)
                self.m_nFinalPos = 28;

            var result = game_Data.getResultList()[self.m_nResultNum];
            var data = gameIconConfig.getItem(function (item) {
                if (item.id == result.icon)
                    return item;
            });
            self.playAudio(data.audioId, false);
            self.m_nResultNum = 0;

            var shineAct = cc.repeat(cc.sequence(cc.fadeOut(0.4), cc.fadeIn(0.4)), 2);
            self.m_tRunImage[0].runAction(cc.sequence(shineAct, cc.delayTime(0.05), cc.callFunc(function () {
                self.m_tRunImage[0].active = false;

                var endPosNode = self.m_tImageNode[(self.m_nCurrentPos - 1) % 28]; //结果点
                var shineNode = cc.instantiate(self.m_tRunImage[0]);
                shineNode.parent = endPosNode;
                shineNode.active = true;
                shineNode.setPosition(cc.v2(0, 0));
                shineNode.name = 'shineNode';
                shineNode.zIndex = -10;


                if (game_Data.getResultType() == 1) { //双响炮
                    if (!self.m_bReverseRun) { //判断是否反向跑了
                        var currenrPosIndx = (self.m_nCurrentPos % 28);
                        if (currenrPosIndx == 0)
                            currenrPosIndx = 28;
                        self.m_nLeftStep = currenrPosIndx - game_Data.getResultList()[1].index; //就算结束点

                        if (self.m_nLeftStep < 8 && self.m_nLeftStep > -23)
                            self.m_nLeftStep += 28;
                        else if (self.m_nLeftStep <= -23)
                            self.m_nLeftStep += 56;

                        self.m_bReverseRun = true;
                        self.runGame(gameType.GameRunState.ReverseRunBegin)//反向跑
                        self.m_nAudioNum = self.playAudio(10011, false);
                        self.m_nResultNum = 1;
                    } else {
                        self.showResultUI();
                    }
                } else if (game_Data.getResultType() == 2) {//三响炮
                    if (!self.m_bReverseRun) { //没有反向跑
                        var currenrPosIndx = (self.m_nCurrentPos % 28);
                        if (currenrPosIndx == 0)
                            currenrPosIndx = 28;

                        self.m_nLeftStep = currenrPosIndx - game_Data.getResultList()[1].index; //就算结束点

                        if (self.m_nLeftStep < 8 && self.m_nLeftStep > -23)
                            self.m_nLeftStep += 28;
                        else if (self.m_nLeftStep <= -23)
                            self.m_nLeftStep += 56;
                        self.m_bReverseRun = true;
                        self.runGame(gameType.GameRunState.ReverseRunBegin);
                        self.m_nAudioNum = self.playAudio(10011, false);
                        self.m_nResultNum = 1;

                    } else if (self.m_bReverseRun && !self.m_bRepeatRun) { //已经反向跑并且没有再次跑
                        self.m_bRepeatRun = true;

                        var currenrPosIndx = (self.m_nCurrentPos % 28);
                        if (currenrPosIndx == 0)
                            currenrPosIndx = 28;

                        self.m_nLeftStep = game_Data.getResultList()[2].index - currenrPosIndx; //就算结束点
                        if (self.m_nLeftStep < 8 && self.m_nLeftStep > -23)
                            self.m_nLeftStep += 28;
                        else if (self.m_nLeftStep <= -23)
                            self.m_nLeftStep += 56;

                        self.m_nRoundCount = 0;
                        self.runGame(gameType.GameRunState.RunRepeatBegin);
                        self.m_nAudioNum = self.playAudio(10011, false);
                        self.m_nResultNum = 2;

                    } else {
                        self.runGame(gameType.GameRunState.RunDefault);
                        self.showResultUI();
                    }

                } else {
                    self.runGame(gameType.GameRunState.RunDefault);
                    self.showResultUI();
                }
            })));
        }
    },

    showResultUI: function () {//显示结果
        this.m_bRepeatRunTag = false;
        if (Hall.HallData.Instance().TIMES > 0) {
            cc.dd.PromptBoxUtil.show('恭喜您获得翻翻乐翻牌次数+' + Hall.HallData.Instance().TIMES);
            Hall.HallData.Instance().TIMES = 0;
        }
        this.m_bRepeatRun = false;
        this.m_bReverseRun = false;
        this.m_nLeftStep = 0;
        this.m_nUniformSpeedTime = 0;
        this.m_nSubSeepControl = 0;
        var AreaList = game_Data.getWinAreaList();
        AreaList.forEach(function (info) {
            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').showWinShineAct(info.id);
        }.bind(this));
        this.m_oResultNode.active = true;
        this.m_oResultNode.getComponent('gameyj_Birds_And_Animals_ResultUI').showResultUI(game_Data.getResultList().length - 1); //显示结果界面
        this.m_oBigWinNode.getComponent('gameyj_Birds_And_Animals_Big_Win').setPlayerInfo();

        this.showWayBill();
    },

    caculateResult: function () {//筹码结算
        this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').clearSurplusChips();
        var AreaList = game_Data.getWinAreaList();
        AreaList.forEach(function (info) {
            var areaData = game_Data.getBetAreaInfoById(info.id);
            var chipDistance = info.value - areaData.value;
            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').addResultChips(info.id, chipDistance);
        }.bind(this));

        setTimeout(function () {
            this.showPlayerGetResult();
        }.bind(this), 3000);
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

        this.ShowOwnResult();
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
        // for(var i = 0; i < this.m_tImageNode.length; i++)
        //     this.m_tImageNode[i].getChildByName('shineNode').removeFromParent(true);
    },


    ShowOwnResult: function () {//显示自己结算结果
        this.m_tPlayerBetAct.splice(0, this.m_tPlayerBetAct.length);
        this.m_tChangePlayer.splice(0, this.m_tChangePlayer.length);

        if (!this.m_bOpBet) //本局没有操作，清除续投
            game_Data.clearLastOwnBetList();
        else {
            game_Data.copyOwnBetListToLastOwnBetList();
        }

        this.m_bOpBet = false;

        var resultNum = game_Data.getWinCoin();
        if (resultNum > 0) {
            this.m_oOpNode.active = true;
            var bone = this.m_oOpNode.getComponent(sp.Skeleton);
            bone.setAnimation(0, 'huangBG', false);
            bone.setCompleteListener(function () {
                this.animationEventHandlerOwnResult();
            }.bind(this));


            var node = this.m_oOpNode.getChildByName('resultNumwin');
            node.getComponent(cc.Label).string = ':' + resultNum;

            node.x = (node.width / 2);
            node.active = true;
            node.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
        } else if (resultNum < 0) {
            this.m_oOpNode.active = true;
            var bone = this.m_oOpNode.getComponent(sp.Skeleton);
            bone.setAnimation(0, 'lanBG', false);
            bone.setCompleteListener(function () {
                this.animationEventHandlerOwnResult();
            }.bind(this));


            var node = this.m_oOpNode.getChildByName('resultNumlose');
            node.getComponent(cc.Label).string = ':' + (-resultNum);

            node.x = (node.width / 2);
            node.active = true;
            node.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
        } else {
            this.playAudio(10024, false);
            this.m_oBigWinNode.getComponent('gameyj_Birds_And_Animals_Big_Win').showBigWin();

            for (var i = 0; i < this.m_tImageNode.length; i++) {
                var shineNode = this.m_tImageNode[i].getChildByName('shineNode');
                if (shineNode)
                    shineNode.removeFromParent(true);
            }

            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').hideShineAct();
            for (var i = 0; i < this.m_tBetBtnList.length; i++)
                this.m_tBetBtnList[i].getChildByName('betInfo').active = false;
        }

        if (this.m_oUserGold)
            this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1);
    },

    animationEventHandlerOwnResult: function () {
        this.m_oOpNode.active = false;

        var node = this.m_oOpNode.getChildByName('resultNumwin');
        node.active = false;

        var node1 = this.m_oOpNode.getChildByName('resultNumlose');
        node1.active = false;


        this.playAudio(10024, false);
        this.m_oBigWinNode.getComponent('gameyj_Birds_And_Animals_Big_Win').showBigWin();

        for (var i = 0; i < this.m_tImageNode.length; i++) {
            var shineNode = this.m_tImageNode[i].getChildByName('shineNode');
            if (shineNode)
                shineNode.removeFromParent(true);
        }

        for (var i = 0; i < this.m_tBetBtnList.length; i++)
            this.m_tBetBtnList[i].getChildByName('betInfo').active = false;

        this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').hideShineAct();
        this.m_oOpNode.getComponent(sp.Skeleton).setCompleteListener(null);

    },

    openRecordUI: function (msg) {//打开游戏记录界面
        this.m_nRecordSendIndex = msg.index + 1; //设置发送数据向上的index

        var UI = cc.dd.UIMgr.getUI('gameyj_birds_and_animals/Prefab/birds_and_animals_history');
        if (UI) {
            UI.getComponent('gameyj_Birds_And_Animals_History').setRecordData(msg); //设置剩下的数据
        } else {
            cc.dd.UIMgr.openUI('gameyj_birds_and_animals/Prefab/birds_and_animals_history', function (ui) {
                if (ui) {
                    ui.getComponent('gameyj_Birds_And_Animals_History').openRecordUI(msg); //打开游戏记录界面
                }
            })
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

    onClickFunBtn: function (event, data) {//点击按钮功能响应
        hall_audio_mgr.com_btn_click();
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
                cc.dd.UIMgr.openUI('gameyj_birds_and_animals/Prefab/Birds_And_Animals_Setting_UI', function (ui) {
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
        hall_audio_mgr.com_btn_click();

        var str = '';
        if (game_Data.getStartCoin() >= game_Data.getCurCoin()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (game_Data.getCurCoin() - game_Data.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
                AudioManager.stopMusic();

                var msg = new cc.pb.room_mgr.msg_leave_game_req();

                var gameType = 104;
                var roomId = RoomMgr.Instance().roomId;
                var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                gameInfoPB.setGameType(gameType);
                gameInfoPB.setRoomId(roomId);

                msg.setGameInfo(gameInfoPB);

                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
            }.bind(this), null
        );
    },

    onClickRecord: function () {//发送游戏记录请求
        this.m_nRecordSendIndex = 1;

        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(this.m_nRecordSendIndex);
        msg.setGameType(104);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req, msg, "msg_get_excite_game_record_req", true);
    },

    playerLeave: function (data) {
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
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                game_Data.clearGameData();
                cc.dd.SceneManager.enterHall();
            }
        }
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
            if (this.m_tChangePlayer.length == 0) {
                this.m_tPlayerHead[player.rank - 1].stopAllActions();
                return;
            }
            var indexRank = this.m_tChangePlayer.shift();
            this.m_tPlayerHead[indexRank - 1].getChildByName('headSp').getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'fqzs_head_init');
            this.m_tPlayerHead[indexRank - 1].getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(player.coin, 1);
            if ((indexRank - 1) % 2 == 0)
                this.m_tPlayerHead[indexRank - 1].runAction(cc.moveTo(0.2, cc.v2(69, this.m_tPlayerHead[indexRank - 1].y)));
            else
                this.m_tPlayerHead[indexRank - 1].runAction(cc.moveTo(0.2, cc.v2(-65, this.m_tPlayerHead[indexRank - 1].y)));
        }.bind(this))));
    },

    reconnectToWait: function () {//重连游戏，将游戏设置等待
        this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').clearChipAllUI(); //清理所有筹码有关数据
        for (var i = 0; i < this.m_tImageNode.length; i++) {
            var shineNode = this.m_tImageNode[i].getChildByName('shineNode');
            if (shineNode)
                shineNode.removeFromParent(true);
        }

        for (var i = 0; i < this.m_tBetBtnList.length; i++)
            this.m_tBetBtnList[i].getChildByName('betInfo').active = false;

        this.m_oOpNode.getComponent(sp.Skeleton).setCompleteListener(null);
        this.switchGameState(gameType.GameSate.WaitGame);
        game_Data.setGameState(2);
        this.m_bSetGameState = true;
    },

    reconnectToGoOn: function () {//重连游戏，下注中
        this.setTimeTxt();
        this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').clearChipAllUI(); //清理所有筹码有关数据
        for (var i = 0; i < this.m_tImageNode.length; i++) {
            var shineNode = this.m_tImageNode[i].getChildByName('shineNode');
            if (shineNode)
                shineNode.removeFromParent(true);
        }

        var betAreaList = game_Data.getBetAreaList();
        betAreaList.forEach(function (data) {
            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').betAct(0, data.id, data.value, 0, false); //下注动画
            this.m_oChipNode.getComponent('gameyj_Birds_And_Animals_Chip_Manager').showAreaTotalBet(data.id);
        }.bind(this));
    },

    /**
     * 玩家数量更新
     * @param {*}  
     */
    playerNumUpdate() {
        var node = cc.dd.Utils.seekNodeByName(this.node, 'role_num')
        node.getComponent(cc.Label).string = game_Data.getPlayerNum().toString();
    },

    clickShop: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_birds_and_animals/Prefab/com_game_bag', function (ui) {
            ui.getComponent('com_game_bag');
        }.bind(this));
    },

    clickShowPlayer: function (event, data) { //显示玩家信息
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

    clickCoinueBet: function (event, data) {//续投
        if (game_Data.checkCoinToConinueBet()) {
            var lastList = game_Data.getAllLastOwnBetList();
            for (var i = 0; i < lastList.length; i++) {
                var info = lastList[i];
                if (info) {
                    var pbData = new cc.pb.fqzs.msg_fqzs_bet_req(); //发送下注请求
                    var pbInfo = new cc.pb.fqzs.fqzs_bet_info();
                    var index = parseInt(info.betId);
                    pbInfo.setId(index);
                    pbInfo.setValue(info.betValue);
                    pbData.setBet(pbInfo);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.fqzs.cmd_msg_fqzs_bet_req, pbData, 'msg_fqzs_bet_req', true);
                }
                this.m_bOpBet = true;
            }
        } else {
            cc.dd.PromptBoxUtil.show('当前金币不足，不能进行续投');
        }
        this.m_oContinueBtn.interactable = false;
    },

    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case game_Event.BAA_INIT://初始化游戏
                this.initGame();
                break;
            case game_Event.BAA_BET: //下注消息返回
                this.playerBet(data);
                break;
            case game_Event.BAA_BET_AREA_UPDATE: //下注区域更新
                this.updateBetArea(data);
                break;
            case game_Event.BAA_UPDATE_GAME: //游戏状态更新
                //if(!this.m_bSetGameState)
                this.showGameState();
                this.m_bSetGameState = false;
                break;
            case game_Event.BAA_PLAYER_CHANGE: //玩家切换
                this.changePlayer(data);
                break;
            case game_Event.BAA_PLAYER_COIN_CHANGE:
                this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1);
                break;
            case game_Event.BAA_RECONNET://断线重连
                this.gameReconnect();
                break
            case game_Event.BAA_STOP_BET:
                game_Data.isGetResult = true;
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.BAA_PLAYER_ENTER:
            case RoomEvent.BAA_PLAYER_LEAVE:
                this.playerNumUpdate();
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                clearTimeout(this.m_oBetTime);
                game_Data.clearGameData();
                cc.dd.SceneManager.enterHall();
                break;

            case SysEvent.PAUSE:
                clearTimeout(this.m_oBetTime);
                this._syspausetime = new Date().getTime();
                cc.log('暂停 剩余倒计时:' + this.m_nRemainBetTime);
                break;
            case SysEvent.RESUME:
                if (this._syspausetime != null) {
                    let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                    this.m_nRemainBetTime -= parseInt(durtime);
                    this.m_nRemainBetTime += 1;
                    if (this.m_nRemainBetTime < 3) {
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

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = fqzs_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
});
