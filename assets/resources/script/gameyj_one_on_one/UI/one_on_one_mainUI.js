// create by wj 2019/02/13
var hallData = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var PK_MgrObj = require('pk_data_mgr');
var PK_MgrData = PK_MgrObj.PK_Data_Mgr.Instance();
var PK_Mgr_Ed = PK_MgrObj.PK_MgrED;
var PK_Mgr_Event = PK_MgrObj.PK_MgrEvent;

const PK_Config = require('pk_Config');
const PK_Bet = require('pk_bet');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;

const pk_audio = require('pk_audio');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

let SysED = require("com_sys_data").SysED;
let SysEvent = require("com_sys_data").SysEvent;
const Hall = require('jlmj_halldata');


cc.Class({
    extends: cc.Component,

    properties: {
        m_tRoundInfoTxt: { default: [], type: cc.Label, tooltip: '局数具体信息' },
        m_tZoomBetTxt: { default: [], type: cc.Label, tooltip: '区域下注信息' },
        m_tSelfBetTxt: { default: [], type: cc.Label, tooltip: '个人下注信息' },
        m_tIconSpriteframe: { default: [], type: cc.SpriteFrame, tooltip: '路单图标' },
        m_tWaybillTxt: [],//保存路单节点
        m_oBetTxt: cc.Label, //下注倍率
        m_oWinTxt: cc.Label, //净输赢
        m_oTimeNode: cc.Node, //投注倒计时显示节点
        m_oPokerNode: cc.Node, //翻开牌的提示节点
        m_oTotalBetTxt: cc.Label, //总下注
        m_oChangeBetNode: cc.Node, //切换下注倍率动画
        m_tBetNumTxt: { default: [], type: cc.Label, tooltip: '下注倍率列表' },
        pokerAtlas: cc.SpriteAtlas,
        m_oCoinNode: cc.Node,
        m_tCoinPosNode: { default: [], type: cc.Node },
        m_tPkBetList: null,
        m_tCoinNodeContainor: [],
        m_tShineNode: { default: [], type: cc.Node, },
        m_tControlBtn: { default: [], type: cc.Button },
        m_nBet: 0,
        m_oPokerActNode: { default: [], type: cc.Node, tooltip: '翻牌动画' },
        m_nIndex: 0,
        m_oShineAnim: cc.Animation,
        m_bDoubleSheet: false,
        m_oRuleUI: cc.Node,
        m_oFuctionUi: cc.Node,
        m_tFontList: { default: [], type: cc.Font },
        m_nRemainBetTime: 0,
        m_bRateType: false,
        m_tChangeRateBtn: { default: [], type: cc.Node, },
        m_bHoldClick: false,
        m_nLongTime: 0,
        m_nSendTimer: 0,
        m_nColorType: 0,
        m_tBetBtn: { default: [], type: cc.Node, tooltip: '下注按钮' },
        bgNode: cc.Node,
        m_nRecordSendIndex: 1,
    },

    onLoad: function () {
        // this.scaleX = this.node.width / this.node.height;
        // let windowSize=cc.winSize;//推荐  原因  短
        // this.bgNode.scaleX = (windowSize.width / windowSize.height) / this.scaleX;

        PK_Mgr_Ed.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        SysED.addObserver(this);
        Hall.HallED.addObserver(this);


        //玩家个人信息
        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "nameTxt").getComponent(cc.Label);
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 6);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "headSp").getComponent('klb_hall_Player_Head');
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'one_on_one_head_init');
        this.m_oCoinTxt = cc.dd.Utils.seekNodeByName(this.node, "coinTxt").getComponent(cc.Label);

        for (var i = 0; i < 36; i++) {//保存路单36个节点
            this.m_tWaybillTxt[i] = cc.dd.Utils.seekNodeByName(this.node, "infoNode" + i);
            this.m_tWaybillTxt[i].active = true;
        }
        this.m_oDrawUI = cc.dd.Utils.seekNodeByName(this.node, "drawNode");
        if (AudioManager._getLocalMusicSwitch()){
            this.m_nMusicId = PK_Config.AuditoPath + 'PK_bg';
            AudioManager.playMusic(PK_Config.AuditoPath + 'PK_bg');
        }
        this.createChipPool();

        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }

        for (var i = 0; i < 5; i++) {
            this.m_tBetBtn[i].on(cc.Node.EventType.TOUCH_START, this.onClickBetStart, this);
            this.m_tBetBtn[i].on(cc.Node.EventType.TOUCH_END, this.onClickBetEnd, this);
            this.m_tBetBtn[i].on(cc.Node.EventType.TOUCH_CANCEL, this.onClickBetEnd, this);

            this.m_tBetBtn[i].tagname = i + 1;
        }
    },

    onDestroy: function () {
        PK_Mgr_Ed.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        Hall.HallED.removeObserver(this);

        cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
        AudioManager.stopMusic();
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
    },

    //创建筹码池
    createChipPool: function () {
        this.coinPool = new cc.NodePool();
        var initCount = 1000;
        for (var i = 0; i < initCount; i++) {
            var chip = cc.instantiate(this.m_oCoinNode);
            this.coinPool.put(chip);
        }
    },

    //创建筹码
    createChip: function () {
        var coin = null;
        if (this.coinPool.size() > 0) {
            coin = this.coinPool.get();
        } else {
            coin = cc.instantiate(this.m_oCoinNode);
        }
        return coin;
    },

    //初始化下注倍率
    InitBetRate: function () {
        var data = PK_Bet.getItem(function (item) {
            if (item.key == PK_MgrData.getConfigId()) {
                return item;
            }
        });
        this.m_tPkBetList = data.bets.split(';');
        this.m_nBet = this.m_tPkBetList[0];
    },

    //初始化游戏界面
    InitPKUI: function () {
        this.playerNumUpdate();
        this.InitBetRate();
        for (var k = 0; k < this.m_tPkBetList.length; k++) { //设置下注倍率档次
            this.m_tBetNumTxt[k].string = this.m_tPkBetList[k];
        }
        this.m_oBetTxt.string = this.m_tPkBetList[0];
        this.randomSelectOpenAction();
        var state = PK_MgrData.getDeskData(); //获取游戏状态
        switch (state) {
            case PK_Config.PK_State.PK_Bet_Time://投注中
                this.gameStateAnalysis(PK_Config.PK_GameState.PK_Bet);
                break;
            case PK_Config.PK_State.PK_Bet_Open_Poker://开牌中
                this.gameStateAnalysis(PK_Config.PK_GameState.PK_Open);
                //判定是否有命运转轮
                var reelType = PK_MgrData.getReelType()
                if (reelType > 0) {
                    this.m_oPokerNode.active = true;
                    this.m_oPokerNode.getChildByName('desc').getComponent(cc.Label).string = PK_Config.PK_Reel_Type_Desc[reelType.toString()];
                }
                break;
            case PK_Config.PK_State.PK_Bet_Result: //结算中(等待开始)
                this.gameStateAnalysis(PK_Config.PK_GameState.PK_Wait);
                break;
        }

        this.updateWayBillList();//更新路单
        this.updateRoundList(); //更新局数显示
        this.updateZoomBetList(); //更新区域下注与总投注
        this.updateSelfBetList();//更新个人下注
        this.updateSelfInfo();//更新个人数据
    },

    //刷新路单
    updateWayBillList: function () {
        this.m_tWaybillTxt.forEach(function (node) {
            node.active = false;
        });
        var waybillList = PK_MgrData.getWaybillData(); //获取路单数据  
        for (var i = 0; i < waybillList.length; i++) {
            var data = waybillList[i]; //单个数据
            var pokerId = parseInt(data / 1000); //牌点数
            var reelType = parseInt(data % 1000); //命运转轮类型
            this.m_tWaybillTxt[i].active = true;
            var textNode = cc.dd.Utils.seekNodeByName(this.m_tWaybillTxt[i], 'pokerInfo'); //牌型描述
            textNode.active = true;
            var index1 = parseInt(parseInt(pokerId / 100) % 2);
            textNode.getComponent(cc.RichText).string = PK_Config.PK_PokerColor[index1] + PK_Config.PK_Poker[pokerId.toString()] + '</c>';
            textNode.setPosition(cc.v2(-13.4, 0));
            textNode.getComponent(cc.RichText).fontSize = 26;

            var reelNode = cc.dd.Utils.seekNodeByName(this.m_tWaybillTxt[i], 'reelType'); //命运转轮描述节点
            reelNode.active = true;
            if (reelType == 0) //没有命运转轮
                reelNode.active = false;
            else if (reelType >= 1 && reelType <= 13) //有命运转轮
                reelNode.getComponent(cc.Sprite).spriteFrame = this.m_tIconSpriteframe[reelType - 1];
            else if (reelType > 13) { //双响炮
                reelNode.active = false;
                var index2 = parseInt(parseInt(reelType / 100) % 2);
                textNode.setPosition(cc.v2(0, 0));
                textNode.getComponent(cc.RichText).fontSize = 20;
                var pokerDesc = '黑桃'
                if (parseInt(pokerId / 100) == 2)
                    pokerDesc = '红桃'
                else if (parseInt(pokerId / 100) == 3)
                    pokerDesc = '梅花'
                else if (parseInt(pokerId / 100) == 4)
                    pokerDesc = '方块'
                textNode.getComponent(cc.RichText).string = PK_Config.PK_PokerColor[index1] + pokerDesc + '</c><color=#fcbd2d>&</c>' + PK_Config.PK_PokerColor[index2] + pokerDesc + '</c>';
            }
        }
    },

    //刷新局数数据
    updateRoundList: function () {
        var roundList = PK_MgrData.getRoundInfo(); //获取局数数据
        for (var i = 0; i < roundList.length; i++) {
            if (!this.m_bRateType)
                this.m_tRoundInfoTxt[i].string = roundList[i];
            else {
                if (i == 0)
                    this.m_tRoundInfoTxt[i].string = roundList[i];
                else
                    this.m_tRoundInfoTxt[i].string = parseInt(roundList[i] / roundList[0] * 100) + ':';
            }
        }
    },

    //刷新区域下注和总投
    updateZoomBetList: function () {
        var zoomBetList = PK_MgrData.getBetInfo();//获取区域下注数据
        for (var i = 0; i < zoomBetList.length; i++) {
            if (PK_MgrData.getDeskData() == PK_Config.PK_State.PK_Bet_Time) {
                var lastBet = parseInt(this.m_tZoomBetTxt[i].string);
                if (lastBet < zoomBetList[i]) {
                    var num = 0;
                    if (zoomBetList[i] >= 1 && zoomBetList[i] < 10000)
                        num = 1;
                    else if (zoomBetList[i] >= 10001 && zoomBetList[i] < 100000)
                        num = 2;
                    else if (zoomBetList[i] >= 100001 && zoomBetList[i] < 1000000)
                        num = 3;
                    else if (zoomBetList[i] >= 1000001 && zoomBetList[i] < 2000000)
                        num = 4;
                    else if (zoomBetList[i] >= 2000001)
                        num = 5;

                    this.coinFlyAction(this.m_tCoinPosNode[i], num);
                }
            }
            this.m_tZoomBetTxt[i].string = zoomBetList[i];
        }

        this.m_oTotalBetTxt.string = PK_MgrData.getTotalBet();//总下注
    },

    //刷新个人下注
    updateSelfBetList: function () {
        var selfBetList = PK_MgrData.getSelfBetData();//获取个人下注
        for (var i = 0; i < selfBetList.length; i++) {
            this.m_tSelfBetTxt[i].string = selfBetList[i]
        }
    },

    //刷新个人数据
    updateSelfInfo: function () {
        if (PK_MgrData.getSelfWinNum() != 0)
            this.m_oWinTxt.string = PK_MgrData.getSelfWinNum() > 0 ? ':' + PK_MgrData.getSelfWinNum() : ';' + PK_MgrData.getSelfWinNum()//净输赢
        else
            this.m_oWinTxt.string = 0;
        this.m_oCoinTxt.string = PK_MgrData.getPlayerCoin();//玩家金币
    },


    //显示最后得分结果
    resultUI: function () {
        for (i = 0; i < 5; i++) {
            if (!this.m_tShineNode[i].active) {
                this.m_tZoomBetTxt[i].string = 0;
                this.m_tSelfBetTxt[i].string = 0;
            }
        }
        var pokerList = PK_MgrData.getOpenPokerData();//获取结果
        for (var i = 0; i < pokerList.length; i++) {
            var pokerid = pokerList[i];
            var index = parseInt(pokerid / 100);
            var betList = PK_MgrData.getBetInfo();
            this.m_tZoomBetTxt[index - 1].string = ':' + parseInt(betList[index - 1]); //区域下注结算结果
            var selfBetList = PK_MgrData.getSelfBetData();//获取个人下注
            var selNum = parseInt(selfBetList[index - 1]) //个人下注结算
            if (selNum > 0)
                this.m_tSelfBetTxt[index - 1].string = ':' + (selNum);
            if (pokerList.length > 1 && parseInt(pokerList[0] / 100) == parseInt(pokerList[1] / 100))
                break;
        }
        this.updateSelfInfo();
    },

    //清理所有界面数据
    clearAllUI: function () {
        for (i = 0; i < 5; i++) {
            this.m_tZoomBetTxt[i].string = 0;
            this.m_tSelfBetTxt[i].string = 0;

            this.m_tZoomBetTxt[i].font = this.m_tFontList[0];
            this.m_tSelfBetTxt[i].font = this.m_tFontList[1];

            this.m_tShineNode[i].active = false;
            this.m_tShineNode[i].stopAllActions();
            this.m_tShineNode[i + 5].active = false;
            this.m_tShineNode[i + 5].stopAllActions();
        }
        this.m_oTotalBetTxt.string = 0;
        this.setAllBtnEnable(true);
        PK_MgrData.clearAllData();
    },

    //随机选择翻牌动画
    randomSelectOpenAction: function () {
        var index = parseInt(Math.random() * 3, 10);
        cc.log('random_indx+++++' + index)
        for (var i = 0; i < 3; i++) {
            this.m_oPokerActNode[i].active = index == i ? true : false;
            this.m_nIndex = index;
            this.m_oPokerActNode[index].getComponent('open_poker_action').reset(index);
        }
    },

    ////////////////////////////////////////////////动画表现Begin/////////////////////////////////////////////
    //投注中
    showBet: function () {
        this.m_oShineAnim.stop();
        this.m_oTimeNode.active = true;
        this.m_oPokerNode.active = false;
        var timeTxt = this.m_oTimeNode.getChildByName('timer').getComponent(cc.Label);
        this.m_nRemainBetTime = PK_MgrData.getLeftTime();
        timeTxt.string = PK_MgrData.getLeftTime();
        var self = this;
        function setTimeTxt() {
            self.m_oBetTime = setTimeout(function () {
                self.m_nRemainBetTime -= 1;
                if (self.m_nRemainBetTime > 0) {
                    timeTxt.string = self.m_nRemainBetTime;
                    setTimeTxt();
                } else if (self.m_nRemainBetTime <= 0) {
                    self.m_nRemainBetTime = 0;
                    self.m_oTimeNode.active = false;
                    self.setAllBtnEnable(false);
                }
            }, 1000);
        }
        setTimeTxt();
    },

    //显示命运转轮
    showFortunWeelUI: function () {
        var self = this;
        var reelType = PK_MgrData.getReelType();
        cc.dd.UIMgr.openUI('gameyj_one_on_one/Prefab/fortune_wheel_ui', function (ui) {
            self.playAudio(1026016);
            var cpt = ui.getComponent('fortune_weel_slot');
            var callBack = function () {
                self.showDrawUI();
            }
            cpt.onInit(reelType, callBack);
        });
    },

    //翻牌界面
    showDrawUI: function () {
        this.m_oShineAnim.play();
        this.m_oTimeNode.active = false;
        this.m_oDrawUI.active = true;
        var userId = PK_MgrData.getOpenPlayerId(); //获取搓牌玩家id
        var userType = PK_MgrData.getOpenUserType(); //获取搓牌玩家类型

        var otherDraw = this.m_oDrawUI.getChildByName('otherDraw');
        var ownDraw = this.m_oDrawUI.getChildByName('ownDraw');
        if (userId == 0) {//系统搓牌
            otherDraw.active = true;
            ownDraw.active = false;
            var tipTxt = otherDraw.getChildByName('name').getComponent(cc.Label);
            tipTxt.string = '系统';
            otherDraw.getChildByName('descSprite0').active = false;
        } else {//玩家搓牌
            if (userId != cc.dd.user.id) {//其他玩家搓牌
                otherDraw.active = true;
                ownDraw.active = false;
                var tipTxt = otherDraw.getChildByName('name').getComponent(cc.Label);
                tipTxt.string = PK_MgrData.getOpenPlayerName();//搓牌玩家名字
                otherDraw.getChildByName('descSprite0').active = true;
            } else {//自己搓牌
                otherDraw.active = false;
                ownDraw.active = true;
                this.m_oPokerActNode[this.m_nIndex].getComponent('open_poker_action').enableOpen(true);
            }
        }

        //////判定是否为双响炮
        var doubleSheet = this.m_oDrawUI.getChildByName('doubuleSheet');
        if (PK_MgrData.getReelType() == PK_Config.PK_ReelType.Double_bang)
            doubleSheet.active = true;
        else
            doubleSheet.active = false;
        //判定是否有命运转轮
        var reelType = PK_MgrData.getReelType()
        if (reelType > 0) {
            this.m_oPokerNode.active = true;
            this.m_oPokerNode.getChildByName('desc').getComponent(cc.Label).string = PK_Config.PK_Reel_Type_Desc[reelType.toString()];
        }
    },

    //具体的牌数据设置
    setPoker(node, cardValue, isShow) {
        if (cardValue < 500) {//四色牌
            var value = Math.floor(cardValue % 100); //点数
            var flower = Math.floor(cardValue / 100); //花色
            var hua_xiao = cc.dd.Utils.seekNodeByName(node, 'hua_xiao');
            var hua_xiao1 = cc.dd.Utils.seekNodeByName(node, 'hua_xiao1');
            var hua_da = cc.dd.Utils.seekNodeByName(node, 'hua_da');
            hua_da.scaleX = 2.3;
            hua_da.scaleY = 2.3;

            var num = cc.dd.Utils.seekNodeByName(node, 'num');
            var num1 = cc.dd.Utils.seekNodeByName(node, 'num1');
            cc.dd.Utils.seekNodeByName(node, 'beimian').active = !isShow;

            if (value == 2) value = 16;
            if (flower % 2 == 0) {
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r' + value.toString());
                num1.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r' + value.toString());

            }
            else {
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_b' + value.toString());
                num1.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_b' + value.toString());

            }
            hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('hs_' + flower.toString());
            hua_xiao.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('hs_' + flower.toString());
            hua_xiao1.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('hs_' + flower.toString());
            hua_xiao.active = true;
            hua_xiao1.active = true;
        } else {
            var value = Math.floor(cardValue % 500); //点数
            var hua_xiao = cc.dd.Utils.seekNodeByName(node, 'hua_xiao');// node.getChildByName('hua_xiao');
            var hua_xiao1 = cc.dd.Utils.seekNodeByName(node, 'hua_xiao1');
            var hua_da = cc.dd.Utils.seekNodeByName(node, 'hua_da');
            hua_da.scaleX = 0.45;
            hua_da.scaleY = 0.45;
            var num = cc.dd.Utils.seekNodeByName(node, 'num');
            var num1 = cc.dd.Utils.seekNodeByName(node, 'num1');
            cc.dd.Utils.seekNodeByName(node, 'beimian').active = !isShow;


            if (value == 0) {//小王
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r19');
                num1.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r19');
                hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_jokerxiao');

            }
            else {//大王
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r18');
                num1.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_r18');
                hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('pkp_jokerda');

            }

            hua_xiao.active = false;
            hua_xiao1.active = false;
        }
    },

    //更新翻牌界面，针对双响炮
    updateDrawPoker: function (index, pokerId) {
        var pokerNode = cc.dd.Utils.seekNodeByName(this.m_oDrawUI, 'poker_' + index);//显示牌的节点
        if (pokerNode) {
            this.setPoker(pokerNode, pokerId, true); //设置牌色
        }
    },

    //显示翻牌动画
    showOpenPoker: function () {
        if (PK_MgrData.getOpenPlayerId() == cc.dd.user.id)
            this.playAudio(1026009);
        var pokerList = PK_MgrData.getOpenPokerData();//获取结果
        var self = this;
        var callBack = function () {
            if (self.m_bDoubleSheet)
                self.updateDrawPoker(1, pokerList[1]);
            self.updateWayBillList();
            self.updateRoundList();
            for (var i = 0; i < pokerList.length; i++) {
                var pokerid = pokerList[i];
                var index = parseInt(pokerid / 100) - 1;
                var shineNode = self.m_tShineNode[index];
                shineNode.active = true;
                shineNode.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))));

                var shineNode1 = self.m_tShineNode[index + 5];
                shineNode1.active = true;
                shineNode1.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))));

                self.m_tZoomBetTxt[index].font = self.m_tFontList[2];
                self.m_tSelfBetTxt[index].font = self.m_tFontList[2];

            }
            self.resultUI();
            setTimeout(function () {
                self.m_oDrawUI.active = false;
                for (var i = 0; i < 2; i++) {
                    var pokerNode = cc.dd.Utils.seekNodeByName(self.m_oDrawUI, 'poker_' + i);//显示牌的节点
                    cc.dd.Utils.seekNodeByName(pokerNode, 'beimian').active = true;
                }
                self.showResultUI();
            }, 3000);
        }

        if (pokerList.length > 1) {//双响炮
            self.m_bDoubleSheet = true;
            var bangCallBack = function () {
                self.updateDrawPoker(0, pokerList[0])
                self.randomSelectOpenAction();
                self.setPoker(self.m_oPokerActNode[self.m_nIndex], pokerList[1], false);
                self.m_oPokerActNode[self.m_nIndex].getComponent('open_poker_action').openAction(self.m_nIndex, callBack, pokerList[1]);

            }
            this.setPoker(this.m_oPokerActNode[this.m_nIndex], pokerList[0], false);
            this.m_oPokerActNode[this.m_nIndex].getComponent('open_poker_action').openAction(this.m_nIndex, bangCallBack, pokerList[0]);

        } else {
            self.m_oDrawUI.active = false;
            this.setPoker(this.m_oPokerActNode[this.m_nIndex], pokerList[0], false);

            this.m_oPokerActNode[this.m_nIndex].getComponent('open_poker_action').openAction(this.m_nIndex, callBack, pokerList[0]);
        }
    },

    //显示结算界面
    showResultUI: function () {
        var pokerList = PK_MgrData.getOpenPokerData();
        var selfBetList = PK_MgrData.getSelfBetData();
        for (var i = 0; i < pokerList.length; i++) {
            var pokerid = pokerList[i];
            var index = parseInt(pokerid / 100) - 1;
            if (selfBetList[index] != 0) {
                this.playAudio(1026012);
                break;
            }
        }

        var dataList = PK_MgrData.getResultRankData();//获取结算数据
        cc.dd.UIMgr.openUI('gameyj_one_on_one/Prefab/one_on_one_result', function (ui) {
            var cpt = ui.getComponent('one_on_one_result');
            cpt.showResult(dataList);
        });
    },

    //等待开始
    waitNewGame: function () {
        var pokerList = PK_MgrData.getOpenPokerData();//获取结果
        this.setPoker(this.m_oPokerActNode[this.m_nIndex], pokerList[0], false);
        this.m_oPokerActNode[this.m_nIndex].getComponent('open_poker_action').defaultShow(this.m_nIndex);
        this.m_oShineAnim.play();
        //判定是否有命运转轮
        var reelType = PK_MgrData.getReelType()
        if (reelType > 0) {
            this.m_oPokerNode.active = true;
            this.m_oPokerNode.getChildByName('desc').getComponent(cc.Label).string = PK_Config.PK_Reel_Type_Desc[reelType.toString()];
        }
    },

    //控制按钮是否可以点击
    setAllBtnEnable: function (enable) {
        for (var i = 0; i < this.m_tControlBtn.length; i++) {
            this.m_tControlBtn[i].interactable = enable;
            this.setBtnLightOrDark(this.m_tControlBtn[i].node, enable);
        }
    },

    //按钮高亮/暗色处理
    setBtnLightOrDark: function (node, isLight) {
        if (isLight)
            node.color = cc.color(255, 255, 255);
        else
            node.color = cc.color(80, 80, 80);
    },

    //显示金币飞的动画
    coinFlyAction: function (node, num) {
        if (num <= 0)
            return;
        var end_X = node.x;
        var end_Y = node.y;

        var coinNode = this.createChip();
        coinNode.active = true;
        coinNode.parent = node.parent;
        this.m_tCoinNodeContainor.push(coinNode);
        var moveTo = cc.moveTo(0.5, cc.v2(end_X, end_Y));
        var self = this;
        coinNode.runAction(cc.sequence(moveTo, cc.delayTime(0.3), cc.callFunc(function () {
            var node = self.m_tCoinNodeContainor.shift();
            node.removeFromParent();
            node.active = false;
        })));
        var timer = parseInt(Math.random() * (5 - 3 + 1) + 3, 10) * 100;
        setTimeout(function () {
            var count = num - 1;
            if (count > 0)
                this.coinFlyAction(node, count)
        }.bind(this), timer);

    },
    ////////////////////////////////////////////////动画表现end//////////////////////////////////////////////

    //////////////////////////////////////////////逻辑管理begin/////////////////////////////////////////////
    //状态翻转机
    gameStateAnalysis: function (state) {
        if (this.m_oBetTime)
            clearTimeout(this.m_oBetTime);
        switch (state) {
            case PK_Config.PK_GameState.PK_Bet: //下注
                this.m_oDrawUI.active = false;
                this.randomSelectOpenAction();
                this.setAllBtnEnable(true);
                this.showBet();
                break;
            case PK_Config.PK_GameState.PK_Weel: //命运转轮
                this.setAllBtnEnable(false);
                this.checkWeelType();
                break;
            case PK_Config.PK_GameState.PK_Open: //搓牌
                this.setAllBtnEnable(false);
                this.showDrawUI();
                break;
            case PK_Config.PK_GameState.PK_Result: //结算
                this.showResult();
                break;
            case PK_Config.PK_GameState.PK_Wait: //等待
                this.setAllBtnEnable(false);
                this.waitNewGame();
                break;
        }
    },

    //检测命运转轮
    checkWeelType: function () {
        this.m_oTimeNode.active = false;
        var type = PK_MgrData.getReelType();
        if (type == 0)//没有命运转轮
            this.gameStateAnalysis(PK_Config.PK_GameState.PK_Open);
        else//显示命运转轮
            this.showFortunWeelUI();
    },

    openRecordUI: function (msg) {//打开游戏记录界面
        this.m_nRecordSendIndex = msg.index + 1; //设置发送数据向上的index

        var UI = cc.dd.UIMgr.getUI('gameyj_one_on_one/Prefab/gameyj_one_on_one_history');
        if (UI) {
            UI.getComponent('one_on_one_history').setRecordData(msg); //设置剩下的数据
        } else {
            cc.dd.UIMgr.openUI('gameyj_one_on_one/Prefab/gameyj_one_on_one_history', function (ui) {
                if (ui) {
                    ui.getComponent('one_on_one_history').openRecordUI(msg); //打开游戏记录界面
                }
            })
        }
    },
    //////////////////////////////////////////////逻辑管理end/////////////////////////////////////////////

    update: function (dt) {
        if (this.m_bHoldClick) {
            this.m_nLongTime += dt;
            if (this.m_nLongTime >= 1.0) {
                this.m_nSendTimer += dt;
                if (this.m_nSendTimer >= 0.15) {
                    this.sendBet();
                    this.m_nSendTimer = 0;
                }
            }
        }
    },

    onClickBet: function (event, data) {
        this.playAudio(1026018);
        this.m_nColorType = parseInt(data);
        cc.log('onclick==========');
    },

    //点击下注
    onClickBetStart: function (event, data) {
        this.m_bHoldClick = true;
        this.m_nLongTime = 0;
        this.m_nColorType = parseInt(event.target.tagname);

        cc.log('startclick==========' + this.m_nColorType)
    },

    onClickBetEnd: function (event, data) {
        this.m_bHoldClick = false;
        if (this.m_nLongTime >= 1.0) {//进入自动下注
            this.m_nLongTime = 0;
            return;
        }
        this.m_nLongTime = 0;
        this.sendBet();
        cc.log('endclick==========')
    },

    //撤销下注
    onClickCancelBet: function (event, data) {
        this.playAudio(1026003);
        var selfBet = PK_MgrData.getSelfBetData();
        if (selfBet.length == 0) {
            cc.dd.PromptBoxUtil.show('本局您尚未下注');
            return;
        }

        var pbData = new cc.pb.pk.msg_pk_bet_req();
        pbData.setOpType(2);
        cc.gateNet.Instance().sendMsg(cc.netCmd.pk.cmd_msg_pk_bet_req, pbData, 'msg_pk_bet_req', true);
    },

    //点击修改下注倍率
    onClickChangeBetRate: function (event, data) {
        this.m_oChangeBetNode.active = !this.m_oChangeBetNode.active;
        if (this.m_oChangeBetNode.active) {
            hall_audio_mgr.com_btn_click();
        }
    },

    //选择下注倍率
    onClickSelectBetRate: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var index = parseInt(data);
        this.m_oBetTxt.string = this.m_tPkBetList[index];
        this.m_nBet = this.m_tPkBetList[index];
        this.onClickChangeBetRate(null, null);
    },

    //点击翻牌
    onClickOpenPoker: function (event, data) {
        var pbData = new cc.pb.pk.msg_pk_open_cards_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.pk.cmd_msg_pk_open_cards_req, pbData, 'msg_pk_open_cards_req', true);
    },

    //点击打开功能按钮
    onClickFunction: function (event, data) {
        this.m_oFuctionUi.active = !this.m_oFuctionUi.active;
        if (this.m_oFuctionUi.active) {
            hall_audio_mgr.com_btn_click();
        }
    },

    //点击打开规则界面
    onClickRule: function (event, data) {
        this.m_oRuleUI.active = !this.m_oRuleUI.active;
        if (this.m_oRuleUI.active) {
            this.m_oRuleUI.zIndex = 4000;
            hall_audio_mgr.com_btn_click();
        }
    },

    //点击打开设置界面
    onClickSetting: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_one_on_one/Prefab/one_on_one_setting', function (ui) {
            ui.zIndex = 3000;
            //ui.getComponent("").show(str, func, 2);
        }.bind(this));
    },

    //点击退出
    onClickQuit: function (event, data) {
        hall_audio_mgr.com_btn_click();

        var str = '';
        if (PK_MgrData.getStartCoin() >= PK_MgrData.getPlayerCoin()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (PK_MgrData.getPlayerCoin() - PK_MgrData.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, 'text33', 'Cancel',
            function () {
                cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
                AudioManager.stopMusic();

                var msg = new cc.pb.room_mgr.msg_leave_game_req();

                var gameType = 103;
                var roomId = RoomMgr.Instance().roomId;
                var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                gameInfoPB.setGameType(gameType);
                gameInfoPB.setRoomId(roomId);

                msg.setGameInfo(gameInfoPB);

                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
            }.bind(this), null
        );
    },

    clickShop: function (event, data, type) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_one_on_one/Prefab/pk_com_game_bag', function (ui) {
            ui.getComponent('com_game_bag');
        }.bind(this));
    },

    onClickRecord: function (event, data) {//获取游戏记录
        this.m_nRecordSendIndex = 1;

        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(this.m_nRecordSendIndex);
        msg.setGameType(103);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req, msg, "msg_get_excite_game_record_req", true);
    },

    //点击切换局数显示模式
    onClickChangeRateType: function (event, data) {
        this.m_bRateType = !this.m_bRateType;
        this.updateRoundList();
        this.m_tChangeRateBtn[0].active = this.m_bRateType;
        this.m_tChangeRateBtn[1].active = !this.m_bRateType;
    },

    //发送下注消息
    sendBet: function () {
        if (PK_MgrData.getPlayerCoin() >= this.m_nBet) {
            this.playAudio(1026018);
            var pbData = new cc.pb.pk.msg_pk_bet_req();
            pbData.setOpType(1);
            pbData.setBet(this.m_nBet);
            pbData.setColor(parseInt(this.m_nColorType));
            cc.gateNet.Instance().sendMsg(cc.netCmd.pk.cmd_msg_pk_bet_req, pbData, 'msg_pk_bet_req', true);
        } else {
            if (this.m_bHoldClick) {
                this.m_bHoldClick = false;
                this.m_nLongTime = 0;
                this.m_nSendTimer = 0;
                this.m_nColorType = 0;
            }
        }
    },
    /////////////////////////////////////////消息通讯///////////////////////////////////


    /**
     * 玩家进入
     * @param {*} player 
     */
    playerNumUpdate(player) {
        var node = cc.dd.Utils.seekNodeByName(this.node, 'playerNum')
        node.getComponent(cc.Label).string = PK_MgrData.getPlayerNum().toString();
    },


    /**
     * 玩家离开
     */
    playerLeave(data) {
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
                    PK_MgrData.clearAllData();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                PK_MgrData.clearAllData();
                cc.dd.SceneManager.enterHall();
            }
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case PK_Mgr_Event.PK_INIT_UI_DATA: //初始化界面数据
                this.InitPKUI();
                break;
            case PK_Mgr_Event.PK_UPDATE_STATE: //游戏状态切换
                var state = PK_MgrData.getDeskData(); //获取游戏状态
                switch (state) {
                    case PK_Config.PK_State.PK_Bet_Time://投注中
                        this.clearAllUI();
                        this.gameStateAnalysis(PK_Config.PK_GameState.PK_Bet);
                        this.playAudio(1026001, false);
                        break;
                    case PK_Config.PK_State.PK_Bet_Open_Poker://开牌中
                        this.gameStateAnalysis(PK_Config.PK_GameState.PK_Open);
                        break;
                    case PK_Config.PK_State.PK_Bet_Result: //结算中(等待开始)
                        this.gameStateAnalysis(PK_Config.PK_GameState.PK_Result);
                        break;
                }
                break;
            case PK_Mgr_Event.PK_RESULT_GET:
                this.m_bHoldClick = false;
                this.m_nLongTime = 0;
                this.m_nSendTimer = 0;
                this.m_nColorType = 0;
                this.gameStateAnalysis(PK_Config.PK_GameState.PK_Weel);
                break;
            case PK_Mgr_Event.PK_UPDATE_BET_INFO: //更新下注区域
                this.updateZoomBetList();
                break;
            case PK_Mgr_Event.PK_OPEN_POKER: //开启牌
                this.showOpenPoker();
                break;
            case PK_Mgr_Event.PK_BET: //下注
                var newCoin = PK_MgrData.getPlayerCoin() - this.m_nBet;
                PK_MgrData.updatePlayerCoin(newCoin);
            case PK_Mgr_Event.PK_CANCEL_BET: //取消下注
                this.m_oCoinTxt.string = PK_MgrData.getPlayerCoin();//玩家金币
                this.updateSelfBetList(); //更新个人下注
                break;
            case PK_Mgr_Event.PLAYER_JOIN:
            case PK_Mgr_Event.PLAYER_EXIT:
                this.playerNumUpdate();
                break;
            case PK_Mgr_Event.PLYAER_COIN_CHANGE:
                this.m_oCoinTxt.string = PK_MgrData.getPlayerCoin();//玩家金币
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                PK_MgrData.clearAllData();
                this.onDestroy();
                cc.dd.SceneManager.enterHall();
                break;
            case SysEvent.PAUSE:
                this._syspausetime = new Date().getTime();
                cc.log('暂停 倒计时');
                break;
            case SysEvent.RESUME:
                if (this._syspausetime != null) {
                    let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                    if (durtime < 10) {
                        if (this.m_nRemainBetTime >= 10) {
                            this.m_nRemainBetTime -= durtime;
                            cc.log('恢复 耗时' + durtime + ' 剩余倒计时:' + this.m_nRemainBetTime);
                        }
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
        var data = pk_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(PK_Config.AuditoPath + name, isloop);
    },
});
