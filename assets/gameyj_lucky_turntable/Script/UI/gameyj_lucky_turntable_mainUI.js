// create by wj 2020/6/3
const gameType = require('lucky_turntable_config').LuckyTurnTableGameType;
const gameRunControl = require('lucky_turntable_config').LuckyTurntableRunControl;
const gameAudioPath = require('lucky_turntable_config').AuditoPath;
const audioConfig = require('lucky_turntable_audio');
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
var game_Ed = require('lucky_turntable_data').Lucky_Turntable_Ed;
var game_Event = require('lucky_turntable_data').Lucky_Turntable_Event;
var hallData = require('hall_common_data').HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
const Hall = require('jlmj_halldata');
var login_module = require('LoginModule');


cc.Class({
    extends: cc.Component,

    properties: {
        mianLayer: cc.Node, //主界面
        resultLayer: cc.Node, //结果界面
        rankLayer: cc.Node, //排行界面
        runtableRootNode: cc.Node, //转盘主体节点
        m_oRuntableActionNode: cc.Node, //转盘旋转节点
        m_oFunctionUI: cc.Node, //功能菜单


        m_tBillListNodeVec: { default: [], type: cc.Node, tooltip: '路单列表节点容器' },
        m_tBetBtnVec: { default: [], type: cc.Node, tooltip: '下注区域节点' }, // '下注区域'
        m_tPlayerHead: { default: [], type: cc.Node, tooltip: '前五玩家头像' },
        m_tChipBtnVec: { default: [], type: cc.Node, tooltip: '筹码档位选择按钮' },
        m_tTagSprite: { default: [], type: cc.SpriteFrame, tooltip: '标签' },
        m_tWinTypeSpite: { default: [], type: cc.SpriteFrame, tooltip: '中奖类型标签' },
        m_tChipSpVec: [],
        m_tConfigBetList: [],
        m_nBetNum: 0, //下注值
        m_nSelectIndex: 0, //选择的下注档位
        m_nRemainBetTime: 0,//剩余时间
        m_oWaitNode: cc.Node,//等待游戏结束提示
        m_bSetGameState: false,
        m_oChipAtlas: cc.SpriteAtlas, //筹码资源
        m_oBallNode: cc.Node, //滚珠
        m_tBillBgVec: { default: [], type: cc.SpriteFrame, tooltip: '路单节点背景' },
        m_oOneResultNode: cc.Node, //一次结果节点

        ///////////////转盘表现控制//////////////
        // m_nTimeControl : 10,
        m_bStartPlay: false,
        m_bPlayRun: false, //转盘控制
        m_bPlayeBallRun: false, //球控制
        m_nRunTime: 0,
        m_nStartRotation: 0,//转盘初始旋转角度
        m_nLastRotation: 0, //上次转盘旋转点
        m_bOpBet: false, //本局是否有下注操作
        m_nTotalBallRotate: 0,
        m_bIsReverse: false,
        m_nRunTimeControl: 0, //转盘转动次数控制
        m_bRunEndNeedCallBack: false,
        m_nBallSubSpeed: 0,
        m_nBallStartSpeed: 0,
        m_nCurrentResultId: 0,
        m_nOffsetCellNum: 0,
        m_bPlayBezier: false,

        m_oCancelBtn: cc.Button,
        m_oContinueBtn: cc.Button,
        isGetResult: false,
    },

    onLoad() {
        game_Ed.addObserver(this);
        RoomED.addObserver(this);
        SysED.addObserver(this);
        HallCommonEd.addObserver(this);

        this.m_oBetTimeNode = cc.dd.Utils.seekNodeByName(this.mianLayer, 'leftTimeNode'); //剩余时间显示节点

        var billListRoot = cc.dd.Utils.seekNodeByName(this.mianLayer, 'billListNode'); //路单根节点
        if (billListRoot) {
            for (var i = 0; i < 20; i++) {
                this.m_tBillListNodeVec[i] = cc.dd.Utils.seekNodeByName(billListRoot, 'billNode' + i); //加载路单节点
                if (this.m_tBillListNodeVec[i])
                    this.m_tBillListNodeVec[i].active = false;
            }
        }

        var betAreaRoot = cc.dd.Utils.seekNodeByName(this.mianLayer, 'betArea'); //下注按钮根节点
        if (betAreaRoot) {
            for (var i = 0; i < 33; i++) {
                this.m_tBetBtnVec[i] = cc.dd.Utils.seekNodeByName(betAreaRoot, 'betArea' + (i + 1)); //加载路单节点
                this.m_tBetBtnVec[i].tagname = i + 1;
                this.m_tBetBtnVec[i].getComponent(cc.Button).enabled = true;
            }
        }

        for (var i = 1; i <= 5; i++) { //前五玩家
            this.m_tPlayerHead[i - 1] = cc.dd.Utils.seekNodeByName(this.node, 'userHeadNod' + i);
        }

        var chipArrayRoot = cc.dd.Utils.seekNodeByName(this.mianLayer, 'chipLayer'); //下注区间数组
        if (chipArrayRoot) {
            for (var i = 0; i < 4; i++) {
                this.m_tChipBtnVec[i] = cc.dd.Utils.seekNodeByName(this.mianLayer, 'chipsArray' + i);

                this.m_tChipSpVec[i] = new Array();
                for (var j = 0; j < 5; j++)
                    this.m_tChipSpVec[i][j] = cc.dd.Utils.seekNodeByName(this.mianLayer, 'chips_' + i + '_' + j);
            }
        }

        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "ownChips").getComponent(cc.Label); //玩家金币 

        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "name").getComponent(cc.Label); //设置名字
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 7);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "ownHeadNod").getComponent('klb_hall_Player_Head'); //设置头像
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'lucky_head_init');

        this.m_nStartRotation = this.m_oRuntableActionNode.rotation; //初始化转盘初始旋转值
        //this.m_nLastRotation = this.m_nStartRotation;
        this.m_oBallStartPos = this.m_oBallNode.getPosition(); //初始化小球初始位置

        this.runtableRunNormal();
        this.m_oContinueBtn.node.active = false;
        this.m_oCancelBtn.node.active = true;
        this.m_oCancelBtn.interactable = false;
    },

    onDestroy: function () {
        game_Ed.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    update(dt) {
        if (this.m_bStartPlay) {

            this.m_oBallNode.parent.rotation = this.m_oRuntableActionNode.rotation;

        } else if (this.m_bPlayRun) {
            this.playRotateRuntableAct(dt);
            if (this.m_bPlayeBallRun)
                this.playRotateBallAct(dt);
        }
    },



    initGame: function () { //游戏界面初始化
        this.initBetRank();
        this.showWayBill(); //显示路单
        this.initBetAreaInfo(); //初始化下注区域信息
        this.playerNumUpdate();
        if (AudioManager._getLocalMusicSwitch())
            this.m_nMusicId = AudioManager.playMusic(gameAudioPath + 'audio_bgm_1');

        var gameState = game_Data.getGameState();//游戏整体状态
        if (gameState == 2 || gameState == 3) { //结算中
            gameState = gameType.GameSate.WaitGame;
        }
        if (gameState == 1) { //下注中
        }
        this.switchGameState(gameState);
    },

    // caculatePlayerChipsShow: function(){//玩家筹码表现计算
    //     var ownCoin = game_Data.getCurCoin(); //当前玩家身上金币
    //     var caculateCoin = ownCoin;
    //     for(var i = this.m_tConfigBetList.length -1; i >= 0; this.m_tConfigBetList.length--){
    //         var count = caculateCoin / this.m_tConfigBetList[i]; //当前档位下需要多少个筹码;
    //         if(count > 5){ //筹码个数大于了5个
    //             var coinPerChip =  (this.m_tConfigBetList[i] * Math.ceil(count / 5)); //向上取整计算实际每个筹码代表的值
    //             count = Math.ceil(caculateCoin / coinPerChip); //实际显示多少个筹码
    //             for(var k = 0; k < 5; k++){
    //                 if(k < count){
    //                     this.m_tChipBtnVec[i][k].active = true; //小于于筹码个数显示
    //                     var chipNumNode = this.m_tChipBtnVec[i][k].getChildByName('chipNowNum');
    //                     if(chipNumNode)
    //                         chipNumNode.getComponent(cc.Label).string = this.convertChipNum(coinPerChip * (k + 1) < caculateCoin ? coinPerChip : (caculateCoin - (coinPerChip * (k+1))), 1);
    //                 }else
    //                     this.m_tChipBtnVec[i][k].active = false;
    //             }
    //         }
    //         var caculateCoin = caculateCoin % this.m_tConfigBetList[i]; //低档位的值;
    //     }
    // },

    caculatePlayerChipsShow: function () {//玩家筹码表现计算
        for (var k = 0; k < this.m_tConfigBetList.length; k++) {
            for (var i = 0; i < 5; i++) {
                this.m_tChipSpVec[k][i].getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame('chips_' + (k + 1));
                if (k == this.m_nSelectIndex) {
                    this.m_tChipSpVec[k][i].active = true;
                } else {
                    if (i != 0)
                        this.m_tChipSpVec[k][i].active = false;
                    else
                        this.m_tChipSpVec[k][i].active = true;
                }
                var chipNumNode = this.m_tChipSpVec[k][i].getChildByName('chipNowNum');
                if (chipNumNode)
                    chipNumNode.getComponent(cc.Label).string = this.convertChipNum(parseInt(this.m_tConfigBetList[k]), 0, 0);
            }
        }
    },

    initBetRank: function () { //初始化下注区间与前5名玩家数据
        var configData = game_Data.getRoomConfigData(); //获取配置表数据
        if (configData) {
            this.m_tConfigBetList = configData.bets.split(';');
            this.m_nBetNum = parseInt(this.m_tConfigBetList[this.m_nSelectIndex]); //当前每次下注的值

            if (this.m_tConfigBetList && this.m_tConfigBetList.length != 0) {
                this.caculatePlayerChipsShow();
                if (parseInt(this.m_tConfigBetList[this.m_tConfigBetList.length - 1]) + 1 >= configData.max_bet) { //最后档次高于最大下注
                    this.m_tChipBtnVec[this.m_tConfigBetList.length - 1].getComponent(cc.Button).interactable = false;  //下注按钮锁死
                    for (var i = 0; i < 5; i++) {
                        if (i != 0)
                            this.m_tChipSpVec[this.m_tConfigBetList.length - 1][i].active = false;
                        else {
                            this.m_tChipSpVec[this.m_tConfigBetList.length - 1][i].active = true;
                            this.m_tChipSpVec[this.m_tConfigBetList.length - 1][i].getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame('chips_0'); //置灰不可下注值
                        }
                    }
                }
            }

            var animNode = this.m_tChipBtnVec[this.m_nSelectIndex].getChildByName('choumadonghua'); //上一次下注的扫光标记
            animNode.active = true;
            animNode.getComponent(cc.Animation).play('chouma');
        }

        var top5Player = game_Data.getPlayerList();//获取前5数据
        for (var i = 0; i < top5Player.length; i++) {
            var player = top5Player[i];
            var index = player.rank - 1;
            if (this.m_tPlayerHead[index]) {
                this.m_tPlayerHead[index].getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'lucky_top_head_init');
            }
        }

        if (this.m_oUserGold)
            this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1, 5); //玩家自己的金币显示
    },

    updateTop5RankPlayer: function () {
        for (var i = 0; i < 5; i++) {
            this.m_tPlayerHead[i].active = false;
            cc.dd.Utils.seekNodeByName(this.node, 'player_rank_' + (i + 1)).active = false;
        }
        var top5Player = game_Data.getPlayerList();//获取前5数据
        for (var i = 0; i < top5Player.length; i++) {
            var player = top5Player[i];
            if (player) {
                var index = player.rank - 1;
                if (this.m_tPlayerHead[index]) {
                    this.m_tPlayerHead[index].getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'lucky_top_head_init');
                    this.m_tPlayerHead[index].active = true;
                    cc.dd.Utils.seekNodeByName(this.node, 'player_rank_' + player.rank).active = true;

                }
            }
        }
    },

    setIcon: function (node, icon) {
        var caiNode = node.getChildByName('cai');
        var numText = node.getChildByName('num').getComponent(cc.Label);
        var bgSp = node.getComponent(cc.Sprite);
        if (icon == 25) { //中了彩
            caiNode.active = true;
            numText.node.active = false;
            bgSp.spriteFrame = this.m_tBillBgVec[2]; //绿色底
        } else {
            numText.node.active = true;
            numText.string = icon; //设置中奖号码
            if (icon % 2 == 0)
                bgSp.spriteFrame = this.m_tBillBgVec[0]; //红色底
            else
                bgSp.spriteFrame = this.m_tBillBgVec[1]; //蓝色底
        }
    },

    showWayBill: function () {//显示路单
        for (var i = 0; i < 20; i++) {//重置路单节点
            this.m_tBillListNodeVec[i].active = false;
            this.m_tBillListNodeVec[i].getChildByName('new').active = false;  //新
            this.m_tBillListNodeVec[i].getChildByName('double').active = false; //翻倍
            this.m_tBillListNodeVec[i].getChildByName('cai').active = false; //彩字
            var childNode = this.m_tBillListNodeVec[i].getChildByName('twicenode')
            if (childNode)
                childNode.removeFromParent(true);
            var childNode1 = this.m_tBillListNodeVec[i].getChildByName('thirdnode')
            if (childNode1)
                childNode1.removeFromParent(true);
        }

        var wayBillList = game_Data.getBillWayLsit(); //获取路单数据
        for (var k = 0; k < wayBillList.length; k++) {
            var data = wayBillList[k];
            if (data) {
                this.m_tBillListNodeVec[k].active = true;
                this.setIcon(this.m_tBillListNodeVec[k], wayBillList[k].icons);
                if (data.type == 1) { //双响炮
                    if (wayBillList[k + 1].type == 1) {

                        var childNode = new cc.Node();


                        var sprite = childNode.addComponent(cc.Sprite);
                        sprite.spriteFrame = this.m_tTagSprite[0];
                        childNode.name = 'twicenode';
                        sprite.type = cc.Sprite.Type.SLICED;
                        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                        childNode.width = 94
                        this.m_tBillListNodeVec[k].addChild(childNode);
                        childNode.x = this.m_tBillListNodeVec[k].width / 2
                        childNode.zIndex = -1;

                        var winTypeNode = this.m_tBillListNodeVec[k].getChildByName('double')
                        winTypeNode.active = true; //翻倍
                        winTypeNode.getComponent(cc.Sprite).spriteFrame = this.m_tWinTypeSpite[1];
                        winTypeNode.x = this.m_tBillListNodeVec[k].width / 2

                        k += 1
                        this.m_tBillListNodeVec[k].active = true;
                        this.setIcon(this.m_tBillListNodeVec[k], wayBillList[k].icons)

                    }
                } else if (data.type == 2) {//三响炮
                    if (wayBillList[k + 1].type == 2 && wayBillList[k + 2].type == 2) {
                        var childNode = new cc.Node();
                        var sprite = childNode.addComponent(cc.Sprite);
                        sprite.spriteFrame = this.m_tTagSprite[1];
                        childNode.name = 'thirdnode';
                        sprite.type = cc.Sprite.Type.SLICED;
                        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                        childNode.width = 143
                        this.m_tBillListNodeVec[k + 1].addChild(childNode);
                        childNode.x = 0
                        childNode.zIndex = -1;


                        var winTypeNode = this.m_tBillListNodeVec[k + 1].getChildByName('double')
                        winTypeNode.active = true; //翻倍
                        winTypeNode.getComponent(cc.Sprite).spriteFrame = this.m_tWinTypeSpite[2];
                        winTypeNode.x = 0


                        k += 1 //第二个数据
                        this.m_tBillListNodeVec[k].active = true;
                        this.setIcon(this.m_tBillListNodeVec[k], wayBillList[k].icons)

                        k += 1 //第三个数据
                        this.m_tBillListNodeVec[k].active = true;
                        this.setIcon(this.m_tBillListNodeVec[k], wayBillList[k].icons)
                    }
                } else if (data.type == 3) {//双倍
                    var winTypeNode = this.m_tBillListNodeVec[k].getChildByName('double')
                    winTypeNode.active = true; //翻倍
                    winTypeNode.getComponent(cc.Sprite).spriteFrame = this.m_tWinTypeSpite[0];
                    winTypeNode.x = 0

                }

                if (k == wayBillList.length - 1) //最新结果
                    this.m_tBillListNodeVec[k].getChildByName('new').active = true; //新

            }
        }
    },

    initBetAreaInfo: function () {//初始化下注区域信息
        var betAreaList = game_Data.getBetAreaList();
        var self = this;
        betAreaList.forEach(function (data) {
            if (data.value != 0) {
                var betNumNode = self.m_tBetBtnVec[data.id - 1].getChildByName('betNum');
                if (betNumNode) {
                    betNumNode.active = true;
                    betNumNode.getComponent(cc.Label).string = self.convertChipNum(data.value, 1, 0);
                    var width = betNumNode.width;

                    var chipIcon = self.m_tBetBtnVec[data.id - 1].getChildByName('chipsicon');
                    if (chipIcon) {
                        chipIcon.x = -(width + chipIcon.width / 2 + betNumNode.y);
                        chipIcon.active = true;
                    }
                }

                var ownBet = game_Data.getOwnBetAreaInfoById(data.id);
                if (ownBet && ownBet.value != 0) {
                    var betInfoNode = self.m_tBetBtnVec[data.id - 1].getChildByName('ownchip');
                    betInfoNode.active = true;

                    betInfoNode.getChildByName('ownchipnum').getComponent(cc.Label).string = self.convertChipNum(ownBet.value, 0, 4);
                }
            }
        })
    },

    showGameState: function () {//更新游戏状态
        var gameState = game_Data.getGameState();//游戏整体状态
        if (gameState == 1) {//游戏押注开始
            // if(AudioManager._getLocalMusicSwitch())
            //     this.m_nMusicId = AudioManager.playMusic(gameAudioPath + 'begame_background');

            var animNode = this.m_tChipBtnVec[this.m_nSelectIndex].getChildByName('choumadonghua'); //上一次下注的扫光标记
            animNode.active = true;
            animNode.getComponent(cc.Animation).play('chouma');
        }
        this.switchGameState(gameState);
    },

    switchGameState: function (gameState) {//游戏状态切换
        this.m_oBetTimeNode.active = false;
        this.resultLayer.active = false;
        //this.m_oEndNode.active = false;
        this.m_oWaitNode.active = false;

        switch (gameState) {
            case gameType.GameSate.BetGame: //下注中
                clearTimeout(this.m_oBetTime);

                this.m_oBetTimeNode.active = true;
                var timeText = this.m_oBetTimeNode.getChildByName('lefttimeText').getComponent(cc.Label);

                this.m_nRemainBetTime = game_Data.getLeftTime();
                timeText.string = game_Data.getLeftTime();
                this.setAllBtnEnable(true);
                this.setTimeTxt();

                break;
            case gameType.GameSate.OpenGame://开奖中
                this.resultLayer.active = true;
                this.setAllBtnEnable(false);
                break;
            case gameType.GameSate.ResultGame: //结算中
                this.setAllBtnEnable(false);
                break;
            case gameType.GameSate.WaitGame: //等待中
                this.setAllBtnEnable(false);
                this.m_oWaitNode.active = true;
                break;
        }
    },

    playerBet: function (data) {//下注消息返回
        var betId = data.bet.id;
        var bet = data.bet.value;

        game_Data.updatePlayerCoin(data.userId, bet); //更新新的金币
        game_Data.updateOwnBetArea(betId, bet);

        var betInfoNode = this.m_tBetBtnVec[betId - 1].getChildByName('ownchip');
        betInfoNode.active = true;

        var playerBet = game_Data.getOwnBetAreaInfoById(betId);
        betInfoNode.getChildByName('ownchipnum').getComponent(cc.Label).string = this.convertChipNum(playerBet.value, 0, 4);

        this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1, 5);
    },

    updateBetArea: function (data) {//下注区域更新\
        if (data.value) {
            var num = 0;
            if (data.value >= 1 && data.value < 10000)
                num = 1;
            else if (data.value >= 10001 && data.value < 100000)
                num = 2;
            else if (data.value >= 100001 && data.value < 1000000)
                num = 3;
            else if (data.value >= 1000001 && data.value < 2000000)
                num = 4;
            else if (data.value >= 2000001)
                num = 5;

            this.m_tBetBtnVec[data.id - 1].getComponent('gameyj_lucky_turntable_coin_fly_act').playCoinFly(data.id, num);
            this.m_tBetBtnVec[data.id - 1].getComponent('gameyj_lucky_turntable_coin_fly_act').updateBetAreaTxtNum(data.id); //更新下注区域筹码值显示

        }
    },

    changePlayer: function (index) {//前5名次变动
        var player = game_Data.findPlayerByUserId(index)
        if (player) {
            this.m_tPlayerHead[player.rank - 1].getChildByName('headSp').getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'luck_top_head_init');
        }
    },

    setAllBtnEnable: function (isEnable) {//设置按钮是否可使用
        this.m_tBetBtnVec.forEach(function (btnNode) {
            btnNode.getComponent(cc.Button).enabled = isEnable;
        }.bind(this));

        var configData = game_Data.getRoomConfigData(); //获取配置表数据
        this.m_tChipBtnVec.forEach(function (btnNode, index) {
            for (var i = 0; i < 5; i++) {
                if (!isEnable) {
                    this.m_tChipSpVec[index][i].getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame('chips_0'); //置灰不可下注值
                    btnNode.getComponent(cc.Button).interactable = false;  //下注按钮锁死
                } else {
                    if (index == this.m_tChipBtnVec.length - 1 && parseInt(this.m_tConfigBetList[this.m_tConfigBetList.length - 1]) + 1 >= configData.max_bet) { //最后档次高于最大下注
                        this.m_tChipSpVec[index][i].getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame('chips_0'); //置灰不可下注值
                        btnNode.getComponent(cc.Button).interactable = false;  //下注按钮锁死
                    } else {
                        this.m_tChipSpVec[index][i].getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame('chips_' + (index + 1));
                        btnNode.getComponent(cc.Button).interactable = true;  //下注按钮锁死
                    }
                }
            }

        }.bind(this));

        this.m_oCancelBtn.interactable = isEnable;
        this.m_oContinueBtn.interactable = isEnable;

        if (!this.m_bOpBet) {//没有下注操作
            this.m_oCancelBtn.node.active = false;
            if (game_Data.checkCoinToConinueBet())
                this.m_oContinueBtn.node.active = true;
            else
                this.m_oContinueBtn.node.active = false;
        }
    },

    setTimeTxt: function () {//倒计时
        var self = this;
        var timeText = this.m_oBetTimeNode.getChildByName('lefttimeText').getComponent(cc.Label);
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
                self.setTimeTxt();
            } else if (self.m_nRemainBetTime <= 0) {
                clearTimeout(self.m_oBetTime);
                self.m_nRemainBetTime = 0;
                self.m_oBetTimeNode.active = false;
                self.setAllBtnEnable(false); //所有按钮置灰
                if (self.isGetResult)
                    self.changeMainUI();
                else {
                    login_module.Instance().reconnectWG();
                    self.clearMainUI();
                    self.setAllBtnEnable(false);
                }
            }
            self.m_nRemainBetTime -= 1;
        }, 1000);
    },

    setRankInfo: function () {
        for (var i = 0; i < 5; i++) {
            var rankNode = this.rankLayer.getChildByName('rankNode' + i); //排行榜名次节点
            if (rankNode)
                rankNode.active = false;
        }
        var winnerList = game_Data.getWinnerList(); //获取前五排行玩家
        winnerList.forEach(function (player, index) {
            var rankNode = this.rankLayer.getChildByName('rankNode' + (player.rank - 1)); //排行榜名次节点
            if (rankNode && player.win > 0) {
                rankNode.active = true;
                var playerHeadNode = rankNode.getChildByName('userHeadNod' + player.rank); //头像节点
                if (playerHeadNode)
                    playerHeadNode.getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'lucky_rank_head_init');

                var winNum = rankNode.getChildByName('winNum'); //赢了多少钱
                if (winNum)
                    winNum.getComponent(cc.Label).string = ':' + player.win;

                var rankCount = rankNode.getChildByName('rankTime');
                if (rankCount)
                    rankCount.getComponent(cc.Label); //连续上榜几次。
            }
        }.bind(this));
    },

    clearOwnBetInfo: function () {//撤销个人下注界面显示
        for (var i = 0; i < 33; i++) {
            var betInfoNode = this.m_tBetBtnVec[i].getChildByName('ownchip');
            betInfoNode.active = false;

            var betData = game_Data.getBetAreaInfoById(i + 1);
            if (betData && betData.value == 0) {
                var betNumNode = this.m_tBetBtnVec[betData.id - 1].getChildByName('betNum');
                if (betNumNode) {
                    betNumNode.active = false;
                    var chipIcon = this.m_tBetBtnVec[betData.id - 1].getChildByName('chipsicon');
                    if (chipIcon) {
                        chipIcon.active = false;
                    }
                }

            }
        }
        this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1, 5);
    },

    /**
     * 玩家数量更新
     * @param {*}  
     */
    playerNumUpdate() {
        var node = cc.dd.Utils.seekNodeByName(this.mianLayer, 'roleNum')
        node.getComponent(cc.Label).string = game_Data.getPlayerNum();

        node = cc.dd.Utils.seekNodeByName(this.resultLayer, 'roleNum')
        node.getComponent(cc.Label).string = game_Data.getPlayerNum();
    },


    openRecordInUI: function () {//打开往期记录界面
        cc.dd.UIMgr.openUI('gameyj_lucky_turntable/Prefab/ownBetHistory', function (ui) {
            ui.zIndex = 3000;
        }.bind(this));
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
                    game_Data.clearGameData();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                var Anim = this.rankLayer.getComponent(cc.Animation);
                Anim.off('stop', this.showRuntableLayer, this); //绑定结束回调
                this.resultLayer.stopAllActions();
                this.runtableRootNode.stopAllActions();
                this.mianLayer.stopAllActions();


                game_Data.clearGameData();
                cc.dd.SceneManager.enterHall();
            }
        }
    },

    ////////////////////////////////////////////////////////转盘动画表现Begin/////////////////////////////////////////////////
    runtableRunNormal: function () {//主界面转盘正常旋转
        var rotateAct = cc.rotateBy(1, 6);
        this.m_oRuntableActionNode.runAction(cc.repeatForever(rotateAct));
        this.m_bStartPlay = true;
    },



    changeMainUI: function () {
        var Anim = this.mianLayer.getComponent(cc.Animation);
        if (!this.m_bIsReverse) {
            Anim.on('stop', this.showRuntableLayer, this);
            Anim._nameToState[Anim._defaultClip.name].wrapMode = cc.WrapMode.Normal; //绑定结束回调
            this.m_bIsReverse = false; //不需要反向动画
        } else {
            Anim._nameToState[Anim._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            this.m_bIsReverse = false; //需要反向动画
        }
        Anim.play();
    },

    showRuntableLayer: function () {
        if (!this.m_bIsReverse) {
            var self = this;
            this.runtableRootNode.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0, 0)), cc.callFunc(function () {
                var lastAnim = self.mianLayer.getComponent(cc.Animation);
                lastAnim.off('stop', self.showRuntableLayer, self); //解除上个动画的结束回调
                self.m_bIsReverse = false; //不需要反向动画
                self.showRotationLayer();
            })))
        } else {
            var self = this;
            if (this.runtableRootNode) {
                this.runtableRootNode.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(-337, 337)), cc.callFunc(function () {
                    self.resultLayer.active = false;

                    var lastAnim = self.rankLayer.getComponent(cc.Animation);
                    lastAnim.off('stop', self.showRuntableLayer, this); //绑定结束回调

                    self.m_bIsReverse = true; //需要反向动画
                    self.changeMainUI();
                })))
            }
        }
    },

    showRotationLayer: function () {
        this.resultLayer.active = true;
        var Anim = this.resultLayer.getComponent(cc.Animation);
        if (!this.m_bIsReverse) {
            Anim.on('stop', this.showResultType, this); //绑定结束回调
            Anim._nameToState[Anim._defaultClip.name].wrapMode = cc.WrapMode.Normal;
            this.m_bIsReverse = true; //不需要反向动画

            this.resultLayer.getComponent('gameyj_lucky_truntable_resultUI').initReusltBetArea();
            this.setRankInfo(); //提前前5数据
        } else {
            this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1, 5);

            Anim._nameToState[Anim._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            Anim.on('stop', this.showRankUI, this); //绑定结束回调
            this.m_bIsReverse = true; //需要反向动画
        }
        Anim.play();
    },

    showRankUI: function () {//显示最终排行
        this.resultLayer.getComponent('gameyj_lucky_truntable_resultUI').clearAllUI();

        var lastAnim = this.resultLayer.getComponent(cc.Animation);
        lastAnim.off('stop', this.showRankUI, this); //解除上个动画的结束回调

        var Anim = this.rankLayer.getComponent(cc.Animation);
        Anim.on('stop', this.showRuntableLayer, this); //绑定结束回调
        Anim.play();

        game_Data.clearGameData();
        this.updateTop5RankPlayer();
        this.isGetResult = false;
    },

    playRotateRuntableAct: function (dt) {//播放转盘动画
        this.m_nRunTime += dt;
        if (this.m_nRunTime >= 16) {
            this.m_bPlayRun = false;
            this.m_nRunTime = 16;
        }

        var off_s = gameRunControl.start_speed * this.m_nRunTime - gameRunControl.sub_speed * this.m_nRunTime * this.m_nRunTime / 2;
        this.m_oRuntableActionNode.rotation = off_s;
        if (this.m_nRunTime == 16) {

            this.m_bPlayRun = false;
            this.m_bPlayeBallRun = false;
            this.m_nRunTime = 0;

            this.m_nLastRotation = 0;
            this.m_nBallSubSpeed = 0;
            this.m_nBallStartSpeed = 0;
            this.m_nTotalBallRotate = 0;

            this.showOneReuslt();
        }
    },

    playRotateBallAct: function (dt) {//播放球滚动动画
        var nowRotate = this.m_nBallStartSpeed * this.m_nRunTime - this.m_nBallSubSpeed * this.m_nRunTime * this.m_nRunTime / 2;
        var rotateOff = nowRotate - this.m_nLastRotation;
        this.m_nTotalBallRotate = this.m_nTotalBallRotate - rotateOff;
        this.m_oBallNode.rotation = this.m_nTotalBallRotate;
        var new_X = Math.sin((this.m_nTotalBallRotate / 180) * Math.PI) * 206;
        var new_Y = Math.cos((this.m_nTotalBallRotate / 180) * Math.PI) * 206;

        this.m_oBallNode.setPosition(cc.v2(new_X, new_Y));
        this.m_nLastRotation = nowRotate;

        if (this.m_nRunTime > gameRunControl.ball_run_time) {
            this.runBallBezierAct();
            this.m_bPlayeBallRun = false;
            this.m_bPlayBezier = true;
        }
    },

    runBallBezierAct: function () {//运行球的抛物线
        this.m_bPlayBezier = false;
        var offsetAngel = this.m_nOffsetCellNum * gameRunControl.per_cell_angel;
        this.m_nTotalBallRotate -= offsetAngel;
        var end_X = Math.sin((this.m_nTotalBallRotate / 180) * Math.PI) * 133;
        var end_Y = Math.cos((this.m_nTotalBallRotate / 180) * Math.PI) * 133;

        var new_X = Math.sin((this.m_nTotalBallRotate / 180) * Math.PI) * 179 - 6;
        var new_Y = Math.cos((this.m_nTotalBallRotate / 180) * Math.PI) * 143;

        var now_X = this.m_oBallNode.x;
        var now_Y = this.m_oBallNode.y;

        var posArry = [cc.v2(now_X, now_Y), cc.v2((now_X + new_X) / 3 * 2, (now_Y + new_Y) / 3 * 2), cc.v2(new_X, new_Y)]
        var bezierAct1 = cc.bezierTo(1.5, posArry);

        var moveToEnd = cc.moveTo(0.5, cc.v2(end_X, end_Y));
        this.m_oBallNode.runAction(cc.sequence(bezierAct1, moveToEnd, cc.callFunc(function () {
            this.playAudio(10004, false);
        }.bind(this))));
    },

    rotateRuntable: function (resultId, needCallBack) { //转盘根据结果转一次

        this.m_bStartPlay = false;
        this.m_oRuntableActionNode.stopAllActions();

        this.m_oRuntableActionNode.rotation = this.m_nStartRotation; //重置初始数据
        this.m_oBallNode.parent.rotation = this.m_nStartRotation;
        this.m_oBallNode.setPosition(this.m_oBallStartPos);
        this.m_oBallNode.rotation = 0;

        this.m_bRunEndNeedCallBack = needCallBack;
        this.m_nOffsetCellNum = parseInt(Math.random() * (3 - 2 + 1) + 2, 10);
        var rotateToatl = 0;
        resultId += this.m_nOffsetCellNum;
        resultId = resultId % 26;
        cc.log('resutId========' + resultId);
        rotateToatl = gameRunControl.ball_total_run_circle * 360 + (26 - resultId) * gameRunControl.per_cell_angel;

        this.m_nBallSubSpeed = (rotateToatl - gameRunControl.ball_end_speed * gameRunControl.ball_run_time) * 2 / (gameRunControl.ball_run_time * gameRunControl.ball_run_time);
        this.m_nBallStartSpeed = gameRunControl.ball_run_time * this.m_nBallSubSpeed + gameRunControl.ball_end_speed;
        this.m_bPlayRun = true;
        this.m_bPlayeBallRun = true;
        this.playAudio(10005, false);
    },


    rotateResult: function () { //转盘出结果
        var lastAnim = this.resultLayer.getComponent(cc.Animation);
        lastAnim.off('stop', this.rotateResult, this); //解除上个动画的结束回调

        var resultType = game_Data.getResultType(); //获取结果类型
        var resultlist = game_Data.getResultList(); //获取结果列表

        this.m_nCurrentResultId = resultlist[this.m_nRunTimeControl].icon;
        cc.log('m_nCurrentResultId========' + this.m_nCurrentResultId);
        if (resultType == 0 || resultType == 3) { //转一次
            var resultId = resultlist[this.m_nRunTimeControl].index;
            this.rotateRuntable(resultId, false);
        } else if (resultType == 1) {//双响炮
            var resultId = resultlist[this.m_nRunTimeControl].index;

            if (this.m_nRunTimeControl == 0)
                this.rotateRuntable(resultId, false);
            else
                this.rotateRuntable(resultId, true);
            this.m_nRunTimeControl -= 1; //运行一次减一次
        } else if (resultType == 2) {//三响炮
            var resultId = resultlist[this.m_nRunTimeControl].index;

            if (this.m_nRunTimeControl == 0)
                this.rotateRuntable(resultId, false);
            else
                this.rotateRuntable(resultId, true);
            this.m_nRunTimeControl -= 1; //运行一次减一次
        }
    },

    showOneReuslt: function () {//一次结果表现显示
        var resulText = this.m_oOneResultNode.getChildByName('resultNum').getComponent(cc.Label);
        if (resulText) {
            if (this.m_nCurrentResultId == 25)
                resulText.string = ':';
            else
                resulText.string = this.m_nCurrentResultId;
        }
        var self = this;
        this.m_oOneResultNode.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(1), cc.fadeOut(0.1), cc.callFunc(function () {
            if (self.m_bRunEndNeedCallBack) {
                self.resultLayer.getComponent('gameyj_lucky_truntable_resultUI').caculateHighLightArea(self.m_nCurrentResultId);
                self.rotateResult();
            } else {
                //self.showRankUI();

                self.m_nRunTimeControl = 0;
                self.runtableRunNormal();
                self.showWayBill();
                self.resultLayer.getComponent('gameyj_lucky_truntable_resultUI').showWinAreaShine();
            }
        })))
    },

    showResultType: function () {
        var lastAnim = this.resultLayer.getComponent(cc.Animation);
        lastAnim.off('stop', this.showResultType, this); //解除上个动画的结束回调

        if (!this.m_bOpBet) {
            game_Data.clearLastOwnBetList();
        } else {
            game_Data.copyOwnBetListToLastOwnBetList();
        }
        this.m_bOpBet = false;
        var resultType = game_Data.getResultType(); //获取结果类型
        if (this.m_nRunTimeControl == 0) {
            this.m_nRunTimeControl = resultType; //转的次数控制
            if (resultType == 3)
                this.m_nRunTimeControl = 0;
        }
        if (resultType != 0) {
            cc.dd.UIMgr.openUI("gameyj_lucky_turntable/Prefab/resultTypeLayer", function (node) {
                let ui = node.getComponent('gameyj_lucky_result_typeUI');
                ui.playActType(resultType, this.rotateResult, this);
            }.bind(this));//加载界面
        } else {
            this.rotateResult(); //展示结果
        }

        this.clearMainUI();//提前清理主界面数据显示
    },

    clearMainUI: function () {//清理主界面显示
        this.m_bOpBet = false;
        for (var i = 0; i < 33; i++) {
            this.m_tBetBtnVec[i].getComponent('gameyj_lucky_turntable_coin_fly_act').clearUI();
            this.m_tBetBtnVec[i].getChildByName('ownchip').active = false;
        }
        if (game_Data.checkCoinToConinueBet())
            this.m_oContinueBtn.active = true;
        else
            this.m_oContinueBtn.active = false;

        this.m_oCancelBtn.active = false;

    },

    reconnectToGoOn: function () {//重连游戏，下注中
        this.setTimeTxt();

        for (var i = 0; i < 33; i++)
            this.m_tBetBtnVec[i].getComponent('gameyj_lucky_turntable_coin_fly_act').updateBetAreaTxtNum(i + 1);

    },

    reconnectToWait: function () {//断线重连，结算中
        this.clearMainUI();
        this.setAllBtnEnable(false);
        this.switchGameState(gameType.GameSate.WaitGame);
        game_Data.setGameState(2);

    },

    ////////////////////////////////////////////////////////转盘动画表现end/////////////////////////////////////////////////

    /////////////////////////////////////////////////////////按钮操作Begin////////////////////////////////////////////////////

    onClickBetArea: function (event, data) {//点击下注区域
        this.playAudio(10007, false);
        var pbData = new cc.pb.turn.msg_turn_bet_req();
        var pbInfo = new cc.pb.turn.turn_bet_info();
        var index = parseInt(data);
        pbInfo.setId(index);
        pbInfo.setValue(this.m_nBetNum);
        pbData.setBet(pbInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.turn.cmd_msg_turn_bet_req, pbData, 'msg_turn_bet_req', true);
        this.m_bOpBet = true;

        this.m_oContinueBtn.node.active = false;
        if (this.m_bOpBet) {
            this.m_oCancelBtn.node.active = true;
            this.m_oCancelBtn.interactable = true;
        }
    },

    onClickChoseBetNum: function (event, data) {  //选择下注档位
        this.playAudio(10002, false);
        var configData = game_Data.getRoomConfigData(); //获取配置表数据
        if (configData) {
            var index = parseInt(data); //索引
            this.m_nSelectIndex = index;
            var betList = configData.bets.split(';');
            if (betList && betList.length != 0) {
                this.m_nBetNum = betList[index];
            }

            this.caculatePlayerChipsShow();

            if (parseInt(this.m_tConfigBetList[this.m_tConfigBetList.length - 1]) + 1 >= configData.max_bet) { //最后档次高于最大下注
                this.m_tChipBtnVec[this.m_tConfigBetList.length - 1].getComponent(cc.Button).interactable = false;  //下注按钮锁死

                this.m_tChipSpVec[this.m_tConfigBetList.length - 1][0].active = true;
                this.m_tChipSpVec[this.m_tConfigBetList.length - 1][0].getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame('chips_0'); //置灰不可下注值
            }

            for (var i = 0; i < this.m_tChipBtnVec.length; i++) {
                var animNode = this.m_tChipBtnVec[i].getChildByName('choumadonghua');
                if (i == index) {
                    animNode.active = true;
                    animNode.getComponent(cc.Animation).play('chouma');
                } else {
                    animNode.active = false;
                }
            }
        }

    },

    clickCoinueBet: function (event, data) {//续投
        this.playAudio(10002, false);
        if (game_Data.checkCoinToConinueBet()) {
            var lastList = game_Data.getAllLastOwnBetList();
            for (var i = 0; i < lastList.length; i++) {
                var info = lastList[i];
                if (info) {
                    var pbData = new cc.pb.turn.msg_turn_bet_req();
                    var pbInfo = new cc.pb.turn.turn_bet_info();
                    var index = parseInt(info.betId);
                    pbInfo.setId(index);
                    pbInfo.setValue(info.betValue);
                    pbData.setBet(pbInfo);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.turn.cmd_msg_turn_bet_req, pbData, 'msg_turn_bet_req', true);
                }
                this.m_bOpBet = true;
            }
        } else {
            cc.dd.PromptBoxUtil.show('当前金币不足，不能进行续投');
        }
        this.m_oContinueBtn.interactable = false;
        this.m_oContinueBtn.node.active = false;
        if (this.m_bOpBet) {
            this.m_oCancelBtn.node.active = true;
            this.m_oCancelBtn.interactable = true;
        }
    },

    //撤销下注
    onClickCancelBet: function (event, data) {
        this.playAudio(10003, false);

        var pbData = new cc.pb.turn.msg_turn_bet_req();
        var pbInfo = new cc.pb.turn.turn_bet_info();

        pbInfo.setId(100);
        pbInfo.setValue(0);
        pbData.setBet(pbInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.turn.cmd_msg_turn_bet_req, pbData, 'msg_turn_bet_req', true);
        this.m_oCancelBtn.interactable = false;
        this.m_oCancelBtn.node.active = false;
        if (game_Data.checkCoinToConinueBet()) {
            this.m_oContinueBtn.interactable = false;
            this.m_oContinueBtn.node.active = false;
        }

    },

    onClickRecordBtn: function (event, data) {//发送请求往期记录
        this.playAudio(10002, false);
        var pbData = new cc.pb.turn.msg_turn_self_record_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.turn.cmd_msg_turn_self_record_req, pbData, 'msg_turn_self_record_req', true);
    },

    onClickFunBtn: function (event, data) {//点击按钮功能响应
        this.playAudio(10002, false);

        switch (data) {
            case 'FUNCTION':
                this.m_oFunctionUI.active = !this.m_oFunctionUI.active;
                this.m_oFunctionUI.getComponent(cc.Animation).play();
                break;
            case 'RULE':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_lucky_turntable/Prefab/lucky_turntable_ruleUI', function (ui) {
                    ui.zIndex = 3000;
                }.bind(this));
                break;
            case 'SETTING':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_lucky_turntable/Prefab/lucky_truntable_Setting_UI', function (ui) {
                    ui.zIndex = 3000;
                }.bind(this));
                break;
            case 'QUIT':
                this.m_oFunctionUI.active = false;
                this.onClickQuit();
                break;
        }
    },

    onClickQuit: function (event, data) {//退出
        this.playAudio(10002, false);

        var str = '';
        if (game_Data.getStartCoin() >= game_Data.getCurCoin()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (game_Data.getCurCoin() - game_Data.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                cc.audioEngine.stop(this.m_nMusicId);
                AudioManager.stopMusic();

                var msg = new cc.pb.room_mgr.msg_leave_game_req();

                var gameType = 106;
                var roomId = RoomMgr.Instance().roomId;
                var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                gameInfoPB.setGameType(gameType);
                gameInfoPB.setRoomId(roomId);

                msg.setGameInfo(gameInfoPB);

                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
            }.bind(this), null
        );
    },

    clickShop: function (event, data) {
        this.playAudio(10002, false);
        cc.dd.UIMgr.openUI('gameyj_lucky_turntable/Prefab/com_game_bag', function (ui) {
            ui.getComponent('com_game_bag');
        }.bind(this));
    },

    clickShowPlayer: function (event, data) { //显示玩家信息
        var index = parseInt(data);

        cc.dd.UIMgr.openUI('gameyj_lucky_turntable/Prefab/playerInfoLayer', function (ui) {
            ui.getComponent('gameyj_lucky_truntable_playerInfo').initPlayerInfo(index);
        }.bind(this));
    },

    /////////////////////////////////////////////////////////按钮操作end////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////消息通讯begin//////////////////////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case game_Event.LUCKY_TURNTABLE_INIT: //初始化游戏数据
                if (this.isGetResult) {//代表游戏在出结果时断线重连
                    var msg = new cc.pb.room_mgr.msg_leave_game_req();

                    var gameType = 106;
                    var roomId = RoomMgr.Instance().roomId;
                    var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                    gameInfoPB.setGameType(gameType);
                    gameInfoPB.setRoomId(roomId);

                    msg.setGameInfo(gameInfoPB);

                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);

                    clearTimeout(this.m_oBetTime);
                    game_Data.clearGameData();
                    cc.dd.SceneManager.enterHall();
                } else
                    this.initGame();
                break;
            case game_Event.LUCKY_TURNTABLE_BET: //下注返回
                this.playerBet(data);
                break;
            case game_Event.LUCKY_TURNTABLE_UPDATE_BET_AREA: //下注区域更新
                this.updateBetArea(data);
                break;
            case game_Event.LUCKY_TURNTABLE_UPDATE_GAME: //游戏状态更新
                this.showGameState();
                this.m_bSetGameState = false;
                break;
            case game_Event.LUCKY_TURNTABLE_PLAYER_CHANGE: //玩家切换
                this.changePlayer(data);
                break;
            case game_Event.LUCKY_TURNTABLE_PLAYER_COIN_CHANGE:
                this.m_oUserGold.string = this.convertChipNum(game_Data.getCurCoin(), 1, 5);
                break;
            case game_Event.LUCKY_TURNTABLE_STOP_BET:
                this.isGetResult = true;
                break;
            case game_Event.LUCKY_TURNTABLE_PLAYER_ENTER:
            case game_Event.LUCKY_TURNTABLE_PLAYER_EXIT:
                this.playerNumUpdate();
                break;
            case game_Event.LUCKY_TURNTABLE_RECORD_DATA://往期记录消息已经返回
                this.openRecordInUI();
                break;
            case game_Event.LUCKY_TURNTABLE_CANCEL_BET: //撤销下注  
                this.clearOwnBetInfo();
                break;
            case RoomEvent.on_room_leave: //百人场玩家离开
                this.playerLeave(data[0]);
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
        }
    },
    ////////////////////////////////////////////////////////消息通讯end//////////////////////////////////////////////////

    //转换筹码字
    convertChipNum: function (num, type, useNum) {
        var str = num;
        if (num >= 1000 && num < 10000) {
            if (useNum == 4 || useNum == 5) {
                str = num.toFixed(0);
            } else {
                str = (num / 1000).toFixed(type);
                var endStr = '';
                switch (useNum) {
                    case 0:
                        endStr = '千';
                        break;
                }
                str += endStr;
            }
        } else if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5);
            else
                str = str.substr(0, 4);
            var endStr = '';
            switch (useNum) {
                case 0:
                    endStr = '万';
                    break;
                case 5:
                    str = (num / 10000).toFixed(type);
                    endStr = '万';
                    break;
                case 4:
                    endStr = ':';
                    break;
            }
            str += endStr;

        } else if (num >= 100000000) {
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5);
            else
                str = str.substr(0, 4);
            var endStr = '';
            switch (useNum) {
                case 0:
                    endStr = '亿';
                    break;
                case 5:
                    str = (num / 100000000).toFixed(type);
                    endStr = '亿';
                    break;
                case 4:
                    endStr = ';';
                    break;
            }
            str += endStr;
        }
        return str
    },

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = audioConfig.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },

});
