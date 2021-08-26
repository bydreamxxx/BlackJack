/**
 * Created by zhanghuaxiong on 2017/5/16.
 */

var dd = cc.dd;
var tdk = dd.tdk;
// var tdk_net = null;
var tdk_am = require("../Common/tdk_audio_manager").Instance();
var tdk_base_pb = require('tdk_base_pb')
var tdk_proId = tdk_base_pb.tdk_enum_protoId;
var tdk_desktatus = tdk_base_pb.tdk_enum_deskstatus;

var gameData = require('tdk_game_data');

var tdk_enum_btn = require('TDKBtnConf')
var gbtnTag = tdk_enum_btn.game_operate;

var tdk_speak = require('TDKConstantConf').SPEAK_TEXT;
var tdk_audio = require('TDKConstantConf').AUDIO_TYPE;

var TdkPlayerData = require('tdk_playerMgr_data');
var PlayerEvent = TdkPlayerData.TdkPlayerEvent;
var PlayerED = TdkPlayerData.TdkPlayerED;

var TdkDeskData = require('tdk_desk_data');
var DeskEvent = TdkDeskData.TdkDeskEvent;
var DeskED = TdkDeskData.TdkDeskED;
var DeskData = TdkDeskData.TdkDeskData.Instance();

var TdkRoomData = require('tdk_room_data');
var RoomEvent = TdkRoomData.TdkRoomEvent;
var RoomED = TdkRoomData.TdkRoomED;
var RoomData = TdkRoomData.TdkRoomData;

var TdkOperationData = require('tdk_operation_data');
var OperationEvent = TdkOperationData.TdkOperationEvent;
var OperationED = TdkOperationData.TdkOperationED;

//var TdkHallData = require('tdk_hall_data');
//var HallEvent = TdkHallData.TdkHallEvent;
//var HallED = TdkHallData.TdkHallED;

var TdkSender =  require('jlmj_net_msg_sender_tdk');
cc.Class({
    extends : cc.Component,

    properties:{
        gameCntLbl : {
            default:null,
            type:cc.Label,
            tooltip:'局数',
        },
        roomNumLbl : {
            default:null,
            type:cc.Label,
            tooltip:'房间号',
        },
        allinLbl : {
            default:null,
            type:cc.Label,
            tooltip:'allin封顶',
        },
        timeLbl:{
            default:null,
            type:cc.Label,
            tooltip:'系统时间',
        },
        currentGameCntLbl:{
            default:null,
            type:cc.Label,
            tooltip:'当前局数',
        },
        lt_allinLbl:{
            default:null,
            type:cc.Label,
            tooltip:'游戏中右上角全压信息',
        },
        bottomNoteLbl:{
            default:null,
            type:cc.Label,
            tooltip:'底注',
        },
        singleNoteLbl:{
            default:null,
            type:cc.Label,
            tooltip:'单注',
        },
        chatToggle:{
            default:null,
            type:cc.Toggle,
            tooltip:'语音复选框'
        },

        maxPlayerCnt : 5,  //玩家数量上限
        totalCostChip : 0, //本局游戏总下注
        roundCnt : 0,  //游戏已玩局数
        curGameCnt : 0, //游戏当前局数
        lastPokerList:[], //记录每个玩家当前最后一张手牌
        foldPlayerCnt : 0, //扣牌人数
        bShowZhanji : false, //是否已经展示战绩

        totalResCnt:0, //总资源个数
        loadResCnt:0, //已加载资源个数

        protoCache_list:[], //协议缓存
        player_list:[], //保存玩家实例
        audioCache_list:[], //音效音乐缓存
        foldPlayer_list:[], //弃牌玩家

        seatArrName:'', //位置父节点名字

        _matchCountDown:20, //匹配倒计时
    },

    testDataFunc : function () {
        gameData.userpokerList = [
            {userid:1001,pokerlistList:[12,33,28,16,17]},
            {userid:1002,pokerlistList:[14,15,16,17,18]},
            {userid:1003,pokerlistList:[12,33,28,42,40]},
            // {userid:1004,pokerlistList:[12,33,28,42,40]},
            // {userid:1005,pokerlistList:[12,33,28,42,40]},
        ];

        gameData.userList=[
            {userid:1001},
            {userid:1002},
            {userid:1003},
            // {userid:1004},
            // {userid:1005},
        ];
    },

    test_init : function () {
        this.player_list = new Array(5);
        gameData._selfId = '1001';
        this.testDataFunc();

        gameData._deskInfo = {
            id:1001,
            pwd:123,
            did:123456,
            rCnt:30,
            pCnt:3,
            allin:100,
            proxy:false,
        };
        cc.log('tdk_coin_room_ui::gameData:',JSON.stringify(gameData._deskInfo));
    },

    loadRoomRes : function () {
        var preRes = dd.tdk_resCfg.PREFAB;
        var atlRes = dd.tdk_resCfg.ATLASS;
        var fonRes = dd.tdk_resCfg.FONT;
        var resArr = [
            {path:atlRes.ATS_CHIPS, type:cc.SpriteAtlas},
            {path:atlRes.ATS_POKER, type:cc.SpriteAtlas},
            {path:preRes.PRE_POKER, type:cc.Prefab},
            {path:preRes.PRE_SHIELD, type:cc.Prefab},
            {path:preRes.PRE_COUNTDOWN, type:cc.Prefab},
            {path:preRes.PRE_ROOM_MENU, type:cc.Prefab},
            {path:preRes.PRE_DISSOLVE_ROOM, type:cc.Prefab},
            {path:preRes.PRE_DISSOLVE_RESULT, type:cc.Prefab},
            {path:preRes.PRE_EXIT_CHOICE, type:cc.Prefab},
            {path:preRes.PRE_INTEGRAL, type:cc.Prefab},
            {path:preRes.PRE_ZHANJI, type:cc.Prefab},
            {path:preRes.PRE_AUDIO_SET, type:cc.Prefab},
            {path:preRes.PRE_XIAZHU, type:cc.Prefab},
            {path:preRes.PRE_GAME_MENU, type:cc.Prefab},
            //{path:preRes.PRE_CROWN, type:cc.Prefab},
            {path:preRes.PRE_CHIP, type:cc.Prefab},
            {path:preRes.PRE_INTEGRAL_V2, type:cc.Prefab},
            //{path:preRes.PRE_ZHANJI_V2, type:cc.Prefab},
            {path:preRes.PRE_SEAT_ARR_3, type:cc.Prefab},
            {path:preRes.PRE_SEAT_ARR_4, type:cc.Prefab},
            {path:preRes.PRE_SEAT_ARR_5, type:cc.Prefab},
            {path:preRes.PRE_PROMPT_BOX, type:cc.Prefab},
            {path:preRes.PRE_DISSOLVE_CONFIRM, type:cc.Prefab},
            {path:preRes.PRE_MESSAGE_BOX, type:cc.Prefab},
            {path:preRes.PRE_PLAYER_V2, type:cc.Prefab},
            {path:fonRes.FONT_ROUND_WIN, type:cc.Font},
            {path:fonRes.FONT_ROUND_FAILED, type:cc.Font},
            {path:fonRes.FONT_TOTAL_WIN, type:cc.Font},
            {path:fonRes.FONT_TOTAL_FAILED, type:cc.Font},
        ];
        this.totalResCnt = resArr.length;
        for(var i=0; i<resArr.length; i++){
            var item = resArr[i];
            dd.ResLoader.preloadSceneStaticRes(item.path, item.type, this.loadResSuccess.bind(this));
        }
    },

    //资源加载
    loadResSuccess : function () {
        this.loadResCnt++;
        var progress = Math.floor(1/this.totalResCnt*this.loadResCnt*100);
        var node = cc.find('Canvas/loadRes/lbl');
        var cpt = node.getComponent(cc.Label);
        cpt.string = '正在加载图片资源('+progress+'%)';
        cc.log('tdk_coin_room_ui::loadResSuccess!图片资源已加载',progress,'%');
        if(this.loadResCnt == this.totalResCnt){
            cc.log('tdk_coin_room_ui::loadResSuccess!图片资源加载完毕!');

            this.loadAudioRes();
            this.gameStart();
        }
    },

    loadAudioRes:function () {
        var audioRes = dd.tdk_resCfg.AUDIO;
        var resArr = new Array();
        for(var i=0; i<audioRes.length; i++){
            var item = audioRes[i];
            for(const key in item){
                var kvalue = item[key];
                for(var j=0; j<kvalue.length; j++){
                    resArr.push(kvalue[j]);
                }
            }
        }

        var commonAudioRes = dd.tdk_resCfg.AUDIO_COMMON;
        for(const key in commonAudioRes){
            resArr.push(commonAudioRes[key]);
        }

        var node = cc.find('Canvas/loadRes/lbl');
        var cpt = node.getComponent(cc.Label);
        tdk_am.preload(resArr, function (progress) {
            cpt.string = '正在加载声音资源('+progress+'%)';
        }, function () {
            node.parent.removeFromParent();
            node.parent.destroy();
        });
        this.audioCache_list = resArr;
    },

    testAction : function () {
        var poker = cc.find('pokerNode/Poker', this.node);
        // poker.setPosition(cc.v2(-460,-75));
        var wpt = poker.convertToWorldSpace(cc.v2(0,0));

        cc.log('tdk_coin_room_ui::testAction:wpt=',wpt);

        var player = cc.find('seatArr/seat5/player_v2/Poker', this.node);
        var npt = player.convertToNodeSpace(wpt);
        // var ppoker = cc.find('Poker', player);
        player.setPosition(npt);
        var player2 = cc.find('seatArr/seat5/player_v2/Poker2', this.node);
        var npt2 = player2.convertToNodeSpace(wpt);
        player2.setPosition(npt2);
        cc.log('tdk_coin_room_ui::testAction:npt=',npt2,',wpt=',wpt);

        return;
        var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_POKER, cc.Prefab);
        var poker = cc.instantiate(prefab);
        var pokerParent = cc.find('pokerNode', this.node);
        poker.parent = pokerParent;
        poker.scale = 0.58;
        poker.setPosition(cc.v2(0, 180));
        poker.setRotation(90);

        var bezier = [cc.v2(-500, 300), cc.v2(-800, 0), cc.v2(-460, -75),];
        var bezierTo = cc.bezierTo(2, bezier);
        // var scaleTo = cc.scaleTo(2, 0.58);
        // var rotationTo = cc.rotateTo(2, 0);
        poker.runAction(cc.spawn(bezierTo/*, scaleTo, rotationTo*/));

    },

    initGameData : function () {
        gameData.gameType = require('TDKConstantConf').GAME_TYPE.GT_COIN;
    },

    addObserver:function () {
        PlayerED.addObserver(this);
        DeskED.addObserver(this);
        RoomED.addObserver(this);
        OperationED.addObserver(this);
        HallED.addObserver(this);
    },

    removeObserver:function () {
        PlayerED.removeObserver(this);
        DeskED.removeObserver(this);
        RoomED.removeObserver(this);
        OperationED.removeObserver(this);
        HallED.removeObserver(this);
    },

    /**
     * 系统按钮返回
     * @param ev
     */
    systemBack:function (ev) {
        // tdk.popup.show(function (shield) {
        //     var prefab = cc.loader.getRes(dd.tdk_resCfg.PREFAB.PRE_MESSAGE_BOX, cc.Prefab);
        //     var mb = cc.instantiate(prefab);
        //     mb.parent = tdk.popupParent;
        //
        //     var cpt = mb.getComponent('tdk_message_box');
        //     cpt.show('预留接口！');
        //     cpt.addOkBtnClickListener(function () {
        //         shield.close();
        //     });
        // });
    },

    initSeat : function () {
        var cnt = DeskData.playerCnt;
        var path='';
        if(3 == cnt){
            path = dd.tdk_resCfg.PREFAB.PRE_SEAT_ARR_3;
            this.seatArrName = 'seatArr_3';
        }else if(4 == cnt){
            path = dd.tdk_resCfg.PREFAB.PRE_SEAT_ARR_4;
            this.seatArrName = 'seatArr_4';
        }else if(5 == cnt){
            path = dd.tdk_resCfg.PREFAB.PRE_SEAT_ARR_5;
            this.seatArrName = 'seatArr_5';
        }
        var prefab = cc.resources.get(path, cc.Prefab);
        var seatNode = cc.instantiate(prefab);
        seatNode.parent = this.node;
    },

    gameStart : function () {
        this.seatArrName = 'seatArr_5';
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.systemBack.bind(this));
        // this.initSeat();
        this.addObserver();
        // RoomData.Instance().freshView(gameData._selfId);
        this.init();
        // this.showCurrentTime(0);
        // this.schedule(this.showCurrentTime, 60);

        return;
        // this.testAction();
        // return;

        //test
        // this.test_init();
        this.deskInfo = gameData._deskInfo;
        // this.player_list = new Array(this.maxPlayerCnt);
        this.playerId_list = new Array(this.maxPlayerCnt); //保存玩家位置信息
        // tdk_net.addObserver(this);

        if(gameData.reconnect){
            this.onReconnect();
        }else{
            this.init();
            tdk_am.playMusic(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BG);
        }

        //test
        // this.showPlayerPoker();
        // this.gameStart_rsp();

        this.checkTime = 0;
        this.startCheckProtoCache();
    },

    startCheckProtoCache : function () {
        var scheduler = cc.director.getScheduler();
        if(!scheduler.isScheduled(this.checkProtoCache, this)){
            this.schedule(this.checkProtoCache, this.checkTime);
        }
    },

    stopCheckProtoCache : function () {
        var scheduler = cc.director.getScheduler();
        if(scheduler.isScheduled(this.checkProtoCache, this)){
            this.unschedule(this.checkProtoCache);
        }
    },

    onLoad : function () {
        cc.log('[ui]::tdk_coin_room_ui:: onLoad!');
        // Start: 如果是 native 且竖屏，切换屏幕角度
        //const SceneOrientationUtil = require('SceneOrientationUtil');
        //SceneOrientationUtil.reOrientation(this.node.parent);
        // End  : 如果是 native 且竖屏，切换屏幕角度

        tdk.popupParent = cc.find('Canvas');
        this.initGameData();
        this.loadRoomRes();
    },

    //隐藏多余的空位
    hideEmptySeat : function () {
        return;
        var seatArr = cc.find('seatArr', this.node);
        for(var i=0; i<this.playerId_list.length; i++){
            var item = this.playerId_list[i];
            cc.log('tdk_coin_room_ui::hideEmptySeat:item=', item);
            if(!item){
                var seat = cc.find('seat'+(i+1), seatArr);
                seat.active = false;
            }
        };
    },

    onReconnect : function () {
        gameData.isGaming = true;
        this.hideStartBtn();
        this.hideDeskInfo();
        this.initPlayerList();
        this.initPlayerUI();
        this.hidePregameUI();
        this.showChatBtn();
        this.curGameCnt = gameData.gameInfo.curRoundCnt;
        this.showGamingUI();
        //显示正在操作的玩家
        this.showActPlayer();
        //显示是否正在解散
        this.showDissolve();
        this.showPlayerPoker();
        //显示玩家chipinfo
        this.showPlayerChipInfo();
        this.hideEmptySeat();
    },

    showPlayerChipInfo : function () {

        gameData.userList.forEach(function (item) {
            var player = this.findPlayer(item.userid);
            player.showChipInfo();
            if(item.fold){
                this.showFoldUI(item.userid);
            }
            if(item.isleaving){
                this.playerOffLine(item.userid, true);
            }
        }.bind(this));
    },

    showDissolve : function () {
        var gameInfo = gameData.gameInfo;
        if(gameInfo.disdeciding){
            var func = function (cpt) {
                var desicionList = gameData.desicionList;
                var userList = gameData.userList;
                for(var i=0; i<userList.length; i++){
                    var result = desicionList[i];
                    if(-1 == result){
                        continue;
                    }else if(0 == result){
                        cpt.dissolveDeskDesicion_rsp({
                            userid:userList[i].userid,
                            desicion:false,
                        });
                        break;
                    }else if(1 == result){
                        cpt.dissolveDeskDesicion_rsp({
                            userid:userList[i].userid,
                            desicion:true,
                        });
                    }
                }
            }.bind(this);

            this.dissolveDesk_rsp({
                userid:gameInfo.disrequserid,
                desicion:true,
                resultcode:0,
            }, func);
        }
    },

    showPlayerChip : function (data) {
        var player = this.findPlayer(data.userid);
        this.freshAllCostChipInfo(player, data.bet, false);
    },

    showActPlayer : function () {
        var actid = gameData.gameInfo.actUserId;
        cc.log('tdk_coin_room_ui::showActPlaye！actid=',actid);
        this.activePlayer(actid, true);
        var gameInfo = gameData.gameInfo;
        if(gameData._selfId == actid){
            var func = function (option) {
                option.betNum = gameInfo.betnum;
                option.deskStatus = gameInfo.deskStatus;
                this.addCostChipListener(option, actid);
                if(gameInfo.genallin){
                    option.popGameOperateOption(option.gameOperateOption.AI);
                }else{
                    if(gameInfo.canallin){
                        option.popGameOperateOption(option.gameOperateOption.AI);
                    }
                    this.showGameMenu(option, gameInfo.deskStatus);
                }
            }.bind(this);
            this.loadGameMenu(func);
        }
    },

    showPlayerPoker : function () {
        var scoreList=[];
        for(var i=0; i<gameData.userpokerList.length; i++) {
            var item = gameData.userpokerList[i];
            var player = this.findPlayer(item.userid);
            for(var j=0; j<item.pokerlistList.length; j++) {
                var pokerid = item.pokerlistList[j];
                player.addPoker(pokerid, item.borrow, false);
            }
            scoreList.push({obj:player, score:item.score});
            this.showPlayerChip({
                userid: item.userid,
                bet: item.bet,
            });
        }

        var tmpArr = [];
        for(var i=0; i<scoreList.length; i++){
            tmpArr.push(scoreList[i].score);
        }
        tmpArr.sort(function (a,b) {
            return b-a;
        });
        var maxNum = tmpArr[0];
        for(var i=0; i<scoreList.length; i++){
            var item = scoreList[i];
            var offset = item.score-maxNum;
            item.obj.showScore(item.score, offset);
        }
    },

    onReconnectAddLastPokerScore : function (data) {
        cc.log('[ui] tdk_coin_room_ui::onReconnectAddLastPokerScore:data=',JSON.stringify(data));
        var exist = false;
        for(var i=0; i<this.lastPokerList.length; i++){
            if(this.lastPokerList[i].userid == data.userid){
                this.lastPokerList[i].num = data.num;
                exist = true;
                return;
            }
        }
        if(!exist){
            this.lastPokerList.push(data);
        }
        if(this.lastPokerList.length == DeskData.playerCnt){
            var tmpArr = new  Array();
            for(var i=0; i<this.lastPokerList.length; i++){
                tmpArr.push(this.lastPokerList[i].num);
            }
            tmpArr.sort(function (a,b) {
                return b-a;
            });
            cc.log('tdk_coin_room_ui::onReconnectAddLastPokerScore:tmpArr,', tmpArr,',poker:',this.lastPokerList);
            var maxNum = tmpArr[0];
            for(var i=0; i<this.lastPokerList.length; i++){
                var offset = this.lastPokerList[i].num-maxNum;
                cc.log('tdk_coin_room_ui::onReconnectAddLastPokerScore:offset=',
                    offset,this.lastPokerList[i].num,maxNum);
                var player = this.findPlayer(this.lastPokerList[i].userid);
                player.showScore(this.lastPokerList[i].num, offset);
            }
            this.clearArr(this.lastPokerList);
            this.clearArr(tmpArr);
            cc.log('tdk_coin_room_ui::onReconnectAddLastPokerScore: line:277 poker:',this.lastPokerList);
        }
    },

    //判断玩家当前明牌手牌与最高分直接的差距
    addLastPokerScore : function (data) {
        cc.log('[ui] tdk_coin_room_ui::addLastPokerScore:data=',JSON.stringify(data));
        var exist = false;
        for(var i=0; i<this.lastPokerList.length; i++){
            if(this.lastPokerList[i].userid == data.userid){
                this.lastPokerList[i].num = data.num;
                exist = true;
                return;
            }
        }
        if(!exist){
            this.lastPokerList.push(data);
        }
        if(this.lastPokerList.length == (DeskData.playerCnt-this.foldPlayerCnt)){
            var tmpArr = new  Array();
            for(var i=0; i<this.lastPokerList.length; i++){
                tmpArr.push(this.lastPokerList[i].num);
            }
            tmpArr.sort(function (a,b) {
                return b-a;
            });
            cc.log('tdk_coin_room_ui::addLastPoker:tmpArr,', tmpArr,',poker:',this.lastPokerList);
            var maxNum = tmpArr[0];
            for(var i=0; i<this.lastPokerList.length; i++){
                var offset = this.lastPokerList[i].num-maxNum;
                cc.log('tdk_coin_room_ui::addLastPokerScore:offset=',
                    offset,this.lastPokerList[i].num,maxNum);
                var player = this.findPlayer(this.lastPokerList[i].userid);
                player.showScore(this.lastPokerList[i].num, offset);
            }
            this.clearArr(this.lastPokerList);
            this.clearArr(tmpArr);
            cc.log('tdk_coin_room_ui::addLastPoker: line:277 poker:',this.lastPokerList);
        }
    },

    init : function () {
        // this.showDeskInfo();
        // this.initPlayerList();
        // this.initPlayerUI();
        // this.initReady();

        var func = function (option) {
            option.popGameOperateOption(option.gameOperateOption.KS_C);
            option.addBtnCallbackListener(function (tag) {
                switch (tag){
                    case gbtnTag.KAI_SHI_COIN:
                        this.startMatch();
                    default:
                        break;
                }
            }.bind(this));
        };
        this.loadGameMenu(func);
    },

    //开始匹配
    startMatch:function () {
        var matchNode = cc.find('match', this.node);
        matchNode.active = true;
        this.schedule(this.matchCountDown.bind(this), 1);
    },

    matchCountDown:function (dt) {
        var matchNode = cc.find('match', this.node);
        var lbl = cc.find('time', matchNode).getComponent(cc.Label);
        this._matchCountDown--;
        lbl.string='('+this._matchCountDown+'s)';
        if(0 == this._matchCountDown){
           this.stopMatch();
        }
    },

    stopMatch:function () {
        var matchNode = cc.find('match', this.node);
        this._matchCountDown = 20;
        matchNode.active = false;
        this.unschedule(this.matchCountDown);
    },

    showDeskInfo : function () {
        this.gameCntLbl.string = '共'+this.deskInfo.rCnt+'局';
        this.roomNumLbl.string = '【房间号:'+this.deskInfo.did+'】';
        this.allinLbl.string = this.deskInfo.pCnt+'人开局 Allin'+this.deskInfo.allin+'倍封顶';

        //游戏开始前，非房主不显示解散按钮
        if(!gameData.isRoomOwner){
            var jiesanBtn = cc.find('pregame/jiesan', this.node);
            jiesanBtn.active = false;
        }
    },

    //点击开始按钮显示准备
    readyBtnClick : function () {
        var data ={
            id:gameData._selfId,
        }
        TdkSender.onTdkUserReady(data);
        //tdk_net.sendRequest(tdk_proId.TDK_PID_TDKUSERREADYREQ,data);
        this.hideStartBtn();
    },

    //清除上局筹码信息
    clearAllChipInfo : function () {
        this.printDebugInfo('clearAllChipInfo');
        var languo = cc.find('languo', this.node);
        var act = languo.activeInHierarchy;
        if(!act){
            this.totalCostChip = 0;
            this.freshTotalCostChip();
        }
        this.player_list.forEach(function (item) {
            if(!act){
                item.clearChipInfo();
            }
            item.clearPoker();
        });
    },

    //游戏操作按钮回调
    onGameOperateBtnClick : function (msg) {
        this.printDebugInfo('onGameOperateBtnClick');
        switch (msg){
            case gbtnTag.KAI_SHI:
                this.startOperateInPopMenu();
                break;
            case gbtnTag.KOU_PAI:
                this.foldOperateInPopMenu();
                break;
            default:
                break;
        }
    },

    //玩家在弹出操作栏中选择开始
    startOperateInPopMenu : function () {

    },

    //玩家在弹出操作栏中选择扣牌
    foldOperateInPopMenu : function () {

    },

    onProtoCacheMessage : function (eventId, data) {
        switch (eventId){
            case tdk_proId.TDK_PID_TDKJOINDESKRSP:
                this.playerEnter(data);
                break;
            case tdk_proId.TDK_PID_TTDKRETURNDESKRSP:
                this.playerReturn(data);
                break;
            case tdk_proId.TDK_PID_TDKUSERREADYRSP:
                this.playerReady_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKSTARTBETRSP:
                this.startBet_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKBETRSP:
                this.bet_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKQIJIAORSP:
                this.bet_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKFANTIRSP:
                this.bet_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKFOLDRSP:
                this.fold_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKSENDPOKERRSP:
                this.sendPoker_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKROUNDENDRSP:
                this.roundEnd_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKDISSOLVEDESKUSERRSP:
                this.dissolveDesk_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKPASSRSP:
                this.pass_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKKAIPAIRSP:
                this.kaipai_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKDISDESKRESULT:
                this.dissolveDeskResult_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKZHANJIRSP:
                this.zhanjiData_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKLEAVEDESKRSP:
                this.leaveDesk_rsp(data);
                break;
            case tdk_proId.TDK_PID_TDKALLUSERPOKERRSP:
                this.allPoker_rsp(data);
                break;
            default:
                break;
        }
    },

    /**
     * 玩家是否已经存在
     * @param userid
     */
    isPlayerExist:function (userid) {
        var exist = false;
        this.player_list.forEach(function (item) {
            if(userid == item.userId){
                exist = true;
            }
        });
        return exist;
    },

    /**
     * 玩家返回
     * @param data
     */
    playerComeBack:function (data) {
        this.playerOffLine(data.userId, false);
    },

    /**
     * 设置解散房间按钮状态
     * @param state
     */
    showJieSanBtn:function(state){
        var jiesanNode = cc.find('Canvas/tdk_room/pregame/jiesan');
        if(jiesanNode){
            jiesanNode.active = state;
        }
    },

    /**
     * 玩家进入
     * @param data
     */
    playerEnter:function (data) {
        cc.log('[ui]tdk_coin_room_ui::playerEnter:data=',JSON.stringify(data));
        if(this.isPlayerExist(data.userId)){
            this.playerOffLine(data.userId, false);
            return;
        }
        if(data.userId == gameData._selfId && !data.isOwner){
            this.showJieSanBtn(false);
        }

        var pos = data.pos;
        var playerGroupNode = this.node.getChildByName(this.seatArrName);
        var seatNode = playerGroupNode.getChildByName('seat'+(pos+1));
        seatNode.active = true;
        var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_PLAYER_V2, cc.Prefab);
        var playerNode = cc.instantiate(prefab);
        var player = playerNode.getComponent('tdk_player_ui');
        player.seatId = pos+1;
        player.userId = data.userId;
        player.nick = data.nick;
        player.sex = data.sex;
        player.openId = data.openId;
        player.city = data.city;
        player.headUrl = data.headUrl;
        player.bRoomOwner = data.isOwner;
        this.player_list.push(player);
        var nick = cc.find('nick',playerNode);
        var nickCpt = nick.getComponent(cc.Label);
        if(typeof player.nick == 'undefined'){
            player.nick = player.userId;
        }

        nickCpt.string = player.nick;
        playerNode.parent = seatNode;

        if(data.isLeaving){
            this.playerOffLine(data.userId, true);
        }
    },

    /**
     * 玩家扣牌
     * @param data
     */
    playerFold:function (data) {
        this.showFoldUI(data.userId);
    },

    /**
     * 牌桌初始化
     * @param data
     */
    deskInit:function (data) {
        if(data.freshViewUserId != gameData._selfId){
            return;
        }
        var node = cc.find('gaming', this.node);
        node.active = true;
        this.lt_allinLbl.string = '全押:'+data.allinCnt;
        this.bottomNoteLbl.string = '底注:'+data.dizhu;
        this.singleNoteLbl.string = '单注:'+data.danzhu;
    },

    /**
     * 玩家准备
     * @param data
     */
    playerReady:function (data) {
        this.playerReady_rsp(data);
        if(data.userId == gameData._selfId){
            // this.hideStartBtn();
            this.curGameCnt = data.deskround;
        }

        // var node = cc.find('gameMenu', tdk.popupParent);
        // if(node){
        //     node.removeFromParent();
        //     node.destroy();
        // }

        // var player = this.findPlayer(data.userId);
        // if(player){
        //     player.setReadOkUI();
        //     if(data.isSelf()){
        //         this.clearAllChipInfo();
        //     }
        // }
    },

    /**
     * 所有玩家准备
     */
    playerAllReady:function (data) {
        this.printDebugInfo('playerAllReady');
        // cc.log('[ui]tdk_coin_room_ui::playerAllReady!data=',data);
        this.playerId_list = data.playerPos_list;

        if(!gameData.reconnect){
            tdk_am.stopMusic();
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_START);
            // this.curGameCnt++;
            cc.log('[ui]tdk_coin_room_ui::playerAllReady:非断线重连进，当前游戏局数为:',this.curGameCnt);
            // this.currentGameCntLbl.string = '第:'+this.curGameCnt+'/'+DeskData.gameCnt+'局';
        }

        this.hideEmptySeat();
        this.foldPlayerCnt = 0;
        gameData.isGaming = true;
        this.gameStart_rsp(data);
        //显示游戏中的界面
        this.showGamingUI();
        //隐藏游戏前ui
        this.hidePregameUI();
        //更新左上角局数信息
    },

    /**
     * 返回游戏
     * @param data
     */
    returnGame:function (data) {
        this.printDebugInfo('returnGame');
        gameData.isGaming = true;
        this.hideStartBtn();
        this.hideDeskInfo();
        this.hidePregameUI();
        this.showChatBtn();
        this.showGamingUI();
    },

    /**
     * 烂锅
     */
    doLanGuo:function (data) {
        gameData.setTie(true);
        var languo = cc.find('languo', this.node);
        languo.active = true;
    },

    /**
     * 断线重连操作
     * @param data
     */
    operationReconnect:function (data) {
        this.printDebugInfo('operationReconnect');
        if(data.deskstatus == tdk_desktatus.DESKSTATUS_WAITINGFORREADY && !data.isReady){
            var func = function (option) {
                option.betNum = data.betnum;
                option.deskStatus = data.deskstatus;
                this.addCostChipListener(option, data.userid);
                if(data.genallin){
                    option.popGameOperateOption(option.gameOperateOption.AI);
                }else{
                    if(data.canallin){
                        option.popGameOperateOption(option.gameOperateOption.AI);
                    }
                    this.showGameMenu(option, data.deskstatus);
                }
            }.bind(this);
            this.loadGameMenu(func);
            return;
        }

        if(data.actuserid !='undefined' && data.actuserid != 0){
            this.activePlayer(data.actuserid, true);

            if(data.actuserid == gameData._selfId){
                var func = function (option) {
                    option.betNum = data.betnum;
                    option.deskStatus = data.deskstatus;
                    this.addCostChipListener(option, data.userid);
                    if(data.genallin){
                        option.popGameOperateOption(option.gameOperateOption.AI);
                    }else{
                        if(data.canallin){
                            option.popGameOperateOption(option.gameOperateOption.AI);
                        }
                        this.showGameMenu(option, data.deskstatus);
                    }
                }.bind(this);
                this.loadGameMenu(func);
            }
        }
    },

    joinDeskSuccess:function (data) {
        this.stopMatch();
        RoomData.Instance().freshView(gameData._selfId);
        var func = function (option) {
            option.popGameOperateOption(option.gameOperateOption.KS);
        };
        this.loadGameMenu(func);
    },

    onEventMessage:function (event, data) {
        switch (event){
            case HallEvent.JOIN_DESK_SUCCESS:
                cc.log('[ui]tdk_player_ui::onEventMessage:HallEvent.JOIN_DESK_SUCCESS!');
                this.joinDeskSuccess(data);
                break;
            case DeskEvent.INIT:
                cc.log('[ui]tdk_player_ui::onEventMessage:DeskEvent.INIT!');
                this.deskInit(data);
                break;
            case PlayerEvent.PLAYER_ENTER:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.PLAYER_ENTER!');
                this.playerEnter(data);
                break;
            case PlayerEvent.PLAYER_COME_BACK:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.PLAYER_COME_BACK!');
                this.playerComeBack(data);
                break;
            case PlayerEvent.PLAYER_FOLD:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.PLAYER_FOLD!');
                this.playerFold(data);
                break;
            case PlayerEvent.PLAYER_READY:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.PLAYER_READY!');
                this.playerReady(data);
                break;
            case PlayerEvent.PLAYER_EXIT:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.PLAYER_EXIT!');
                this.playerExitGame(data);
                break;
            case PlayerEvent.ADD_POKER:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.ADD_POKER!');
                this.sendPoker_rsp(data);
                break;
            case PlayerEvent.RECONNECT_ADD_POKER:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.RECONNECT_ADD_POKER!');
                this.reconnectSendPoker(data);
                break;
            case PlayerEvent.FOLD:
                this.findPlayer(data.userId).setFoldUI(true);
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.FOLD!');
                break;
            case PlayerEvent.ALL_PLAYER_READY:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.ALL_PLAYER_READY!');
                this.playerAllReady(data);
                break;
            case PlayerEvent.PLAYER_LEAVE:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.PLAYER_LEAVE!');
                this.leaveDesk_rsp(data);
                break;
            case PlayerEvent.SHOW_ALL_POKER:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.SHOW_ALL_POKER!');
                this.showAllPoker(data);
                break;
            case PlayerEvent.FRESH_CHIP_AND_WIN:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.FRESH_CHIP_AND_WIN!');
                this.freshChipAndWin(data);
                break;
            case RoomEvent.ROOM_ALREADY_JIE_SAN:
                cc.log('[ui]tdk_player_ui::onEventMessage:PlayerEvent.ROOM_ALREADY_JIE_SAN!');
                this.roomAlreadyJieSan(data);
                break;
            case RoomEvent.ZHAN_JI:
                cc.log('[ui]tdk_player_ui::onEventMessage:RoomEvent.ZHAN_JI!');
                this.zhanjiData_rsp(data);
                break;
            case RoomEvent.INIT:
                cc.log('[ui]tdk_player_ui::onEventMessage:RoomEvent.INIT!');
                this.roomInit(data);
                break;
            case RoomEvent.RETURN_GAME:
                cc.log('[ui]tdk_player_ui::onEventMessage:RoomEvent.RETURN_GAME!');
                this.returnGame(data);
                break;
            case RoomEvent.JIE_SAN_SHEN_QING:
                cc.log('[ui]tdk_player_ui::onEventMessage:RoomEvent.JIE_SAN_SHEN_QING!');
                this.dissolveDesk_rsp(data);
                break;
            case RoomEvent.JIE_SAN_JIE_GUO:
                cc.log('[ui]tdk_player_ui::onEventMessage:RoomEvent.JIE_SAN_JIE_GUO!');
                this.dissolveDeskResult_rsp(data);
                break;
            case OperationEvent.START_BET:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.START_BET!');
                this.startBet_rsp(data);
                break;
            case OperationEvent.BET:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.BET!');
                this.bet_rsp(data);
                break;
            case OperationEvent.GEN:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.GEN!');
                this.bet_rsp(data);
                break;
            case OperationEvent.FAN_TI:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.FAN_TI!');
                this.bet_rsp(data);
                break;
            case OperationEvent.QI_JIAO:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.QI_JIAO!');
                this.bet_rsp(data);
                break;
            case OperationEvent.PASS:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.PASS!');
                this.pass_rsp(data);
                break;
            case OperationEvent.FOLD:
                cc.log('[ui]tdk_player_ui::onEventMessage: OperationEvent.FOLD!');
                this.fold_rsp(data);
                break;
            case OperationEvent.KAI_PAI:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.KAI_PAI!');
                this.kaipai_rsp(data);
                break;
            case OperationEvent.ROUND_END:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.ROUND_END!');
                this.roundEnd_rsp(data);
                break;
            case OperationEvent.ON_RECONNECT:
                cc.log('[ui]tdk_player_ui::onEventMessage:OperationEvent.ON_RECONNECT!');
                this.operationReconnect(data);
                break;
            default:
                break;
        }
    },

    //网络回调
    // onEventMessage : function (eventId, data) {
    //     switch (eventId){
    //         case tdk_proId.TDK_PID_TDKJOINDESKRSP:
    //             // this.playerEnter(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKALLUSERPOKERRSP:
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TTDKRETURNDESKRSP:
    //             // this.playerReturn(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKUSERREADYRSP:
    //             this.playerReady_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKSTARTBETRSP:
    //             // this.startBet_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKBETRSP:
    //             // this.bet_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKQIJIAORSP:
    //             // this.bet_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKFANTIRSP:
    //             // this.bet_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKFOLDRSP:
    //             // this.fold_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKSENDPOKERRSP:
    //             this.addProtoCache({pid:eventId, data:data});
    //             // this.sendPoker_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKROUNDENDRSP:
    //             // this.roundEnd_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKDISSOLVEDESKUSERRSP:
    //             // this.dissolveDesk_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKPASSRSP:
    //             // this.pass_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKKAIPAIRSP:
    //             // this.kaipai_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKDISDESKRESULT:
    //             // this.dissolveDeskResult_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKZHANJIRSP:
    //             // this.zhanjiData_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         case tdk_proId.TDK_PID_TDKLEAVEDESKRSP:
    //             // this.leaveDesk_rsp(data);
    //             this.addProtoCache({pid:eventId, data:data});
    //             break;
    //         default:
    //             break;
    //     }
    // },

    //查看新进入的玩家是否已经存在
    findUserId : function (userid) {
        cc.log('tdk_coin_room_ui::findUserId:userid=',userid,',playerId_list=',this.playerId_list);
        var find = false;
        for(var i=0; i<this.playerId_list.length; i++){
            var item = this.playerId_list[i];
            if(item == userid){
                find = true;
                break;
            }
        }
        return find;
    },

    playerReturn:function (data) {
        this.printDebugInfo('playerReturn');
        // cc.log('tdk_coin_room_ui::playerReturn:data=',data);
        if(gameData._selfId != data.userid){
            this.playerOffLine(data.userid, false);
        }
        this.singleProtoDone();
    },

    // playerEnter : function (data) {
    //     cc.log('tdk_coin_room_ui::playerEnter:data=',data);
    //     if(this.findUserId(data.userid)){
    //         //玩家已经存在，只需切换状态
    //         this.playerOffLine(data.userid, false);
    //         this.singleProtoDone();
    //         return;
    //     }
    //     gameData.userList.push({"userid":data.userid});
    //     var len = this.playerId_list.length;
    //     for(var i=0; i<len; i++){
    //         var item = this.playerId_list[i];
    //         if(!item){
    //             item = data.userid;
    //             this.playerId_list[i] = item;
    //             this.addPlayer(item, i);
    //             break;
    //         }
    //     }
    //
    //     if(gameData.userList.length == this.deskInfo.pCnt){
    //         this.hideEmptySeat();
    //     }
    //     this.singleProtoDone();
    // },

    //准备
    playerReady_rsp : function (data) {
        this.printDebugInfo('playerReady_rsp');
        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_READY);
        // cc.log('tdk_coin_room_ui::playerReady_rsp:data=',data);

        this.player_list.forEach(function (item) {
            if(item.userId == data.userId){
                item.setReadOkUI(true);
                if(gameData._selfId == data.userId){
                    this.clearAllChipInfo();
                }
            }
        }.bind(this));
    },

    //隐藏游戏前ui界面
    hidePregameUI : function () {
        this.printDebugInfo('hidePregameUI');
        var node = cc.find('pregame', this.node);
        node.active = false;
    },

    //开启游戏中ui界面
    showGamingUI : function () {
        this.printDebugInfo('showGamingUI');
        this.showChatBtn();
        var node = cc.find('gaming', this.node);
        node.active = true;

        // var cptl = this.currentGameCntLbl.getComponent(cc.Label);
        // cptl.string = '第:'+this.curGameCnt+'/'+this.deskInfo.rCnt+'局';
        // var cptr = this.lt_allinLbl.getComponent(cc.Label);
        // cptr.string = '全押:'+ this.deskInfo.allin;

        cc.log('[ui]tdk_coin_room_ui::showGamingUI:当前游戏局数为:', this.curGameCnt);
        // this.currentGameCntLbl.string = '第:'+this.curGameCnt+'/'+DeskData.gameCnt+'局';
        this.lt_allinLbl.string = '全押:'+ DeskData.allinCnt;
        this.bottomNoteLbl.string = '基数:'+DeskData.dizhu;
        this.singleNoteLbl.string = '单注:'+DeskData.danzhu;
    },

    //显示系统时间
    showTime : function () {
        var cpt = this.timeLbl.getComponent(cc.Label);
        cpt.string = '12:12';
    },

    //显示语音聊天按钮
    showChatBtn : function () {
        // var cpt = this.chatToggle.getComponent(cc.Toggle);
        // if(cpt.isChecked){
        //     var chatBtn = cc.find('yuyin', this.node);
        //     chatBtn.active = true;
        // }
    },

    //开始下注
    startBet_rsp : function (data) {
        this.printDebugInfo('startBet_rsp');
        // cc.log('tdk_coin_room_ui::startBet_rsp data:', JSON.stringify(data));
        this.activePlayer(data.userid, true);
  
        if(gameData._selfId == data.userid){
            var func = function (option) {

                this.addCostChipListener(option, data.userid);
                option.popGameOperateOption(option.gameOperateOption.XZ);
            }.bind(this);
            this.loadGameMenu(func);
        }
        this.singleProtoDone();
    },

    activePlayerSpeak : function (userid, text) {
        var player = this.findPlayer(userid);
        if(player){
            player.doSpeak(text);
        }
    },

    getSpeakVoice:function (userid, key) {
        var player = this.findPlayer(userid);
        if(player){
            var voiceArr = dd.tdk_resCfg.AUDIO[player.sexIdx][key];
            var cnt = voiceArr.length;
            var random = Math.random();
            var num = Math.floor(random*10);
            var remainder = num % cnt;
            cc.log('tdk_coin_room_ui::getSpeakVoice:random=',random,',num=',num,',remainder=', remainder);
            return voiceArr[remainder];
        }else{
            cc.error('tdk_coin_room_ui::getSpeakVoice:玩家',userid,'没有找到!');
        }
    },

    //同步其他客户端玩家操作
    synOtherPlayerOperate:function (userid, state) {
        this.printDebugInfo('synOtherPlayerOperate');
        var text='';
        var path='';
        switch (state){
            case tdk_desktatus.DESKSTATUS_GAMING_BET:
                text = tdk_speak.XZ;
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_XZ);
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_QIJIAO:
                text = tdk_speak.QJ;
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_TI);
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_FANTI:
                text = tdk_speak.FT;
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_FT);
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_BET_GEN:
            case tdk_desktatus.DESKSTATUS_GAMING_QIJIAO_GEN:
            case tdk_desktatus.DESKSTATUS_GAMING_FANTI_GEN:
                text = tdk_speak.GZ;
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_GEN);
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_ALLIN:
            case tdk_desktatus.DESKSTATUS_GAMING_ALLINGEN:
                text = tdk_speak.AI;
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_AI);
                break;
            default:
                cc.error('tdk_coin_room_ui::synOtherPlayerOperate:为何没有上一个玩家状态！');
                return;
        }
        tdk_am.playEffect(path);
        this.activePlayerSpeak(userid, text);
    },

    bet_rsp : function (data) {
        this.printDebugInfo('bet_rsp');
        // cc.log('tdk_coin_room_ui::bet_rsp data:', JSON.stringify(data));
        this.synOtherPlayerOperate(data.userid, data.predeskstatus);

        if(data.deskstatus == tdk_desktatus.DESKSTATUS_GAMING_KAIPAI){
            // var player = this.findPlayer(data.userid);
            // if(gameData._selfId != data.userid){
            //     this.freshAllCostChipInfo(player, data.betnum);
            // }
            this.freshOtherPlayerCostChip(data);
            this.doKaiPai(data);
            this.singleProtoDone();
            return;
        }
        this.freshOtherPlayerCostChip(data);
        this.showCurOperateBtns(data);
        this.singleProtoDone();
    },

    //改变操作玩家标志
    changeActivePlayer : function (userid, nextuserid) {
        this.printDebugInfo('changeActivePlayer');
        this.activePlayer(userid, false);
        this.activePlayer(nextuserid, true);
    },

    //设置玩家操作标志
    activePlayer : function (userid, state) {
        this.printDebugInfo('activePlayer');
        var player = this.findPlayer(userid);
        cc.log('tdk_coin_room_ui::activePlayer:userid=',userid,',state=',state,',player=',player);
        if(player){
            player.setPlayerStata(state);
        }
    },

    //刷新其他玩家的下注金额
    freshOtherPlayerCostChip : function (data) {
        this.printDebugInfo('freshOtherPlayerCostChip');
        for (var i = 0; i < this.player_list.length; i++){
            var item = this.player_list[i];
            if (item && item.userId == data.userid &&
                item.userId != gameData._selfId) {
                this.freshAllCostChipInfo(item, data.betnum);
            }
        }
    },

    doKaiPai : function (data) {
        this.printDebugInfo('doKaiPai');
        // cc.log('tdk_coin_room_ui::doKaipai:data=',JSON.stringify(data));
        if(data.nextuserid == 0){
            this.activePlayer(data.userid);
            // this.showAllPoker(data);
            return;
        }
        this.changeActivePlayer(data.userid, data.nextuserid);
        if(gameData._selfId == data.nextuserid){
            var func = function (option) {
                option.deskStatus = data.deskstatus;
                option.popGameOperateOption(option.gameOperateOption.KP);
            };
            this.loadGameMenu(func);
        }
    },

    showFoldUI : function (userid) {
        this.printDebugInfo('showFoldUI');
        this.foldPlayerCnt++;
        //显示扣牌ui
        this.player_list.forEach(function (item) {
            if(item.userId == userid){
                this.foldPlayer_list.push(userid);
                item.setFoldUI(true);
            }
        }.bind(this));
    },

    fold_rsp : function (data) {
        this.printDebugInfo('fold_rsp');
        cc.log('tdk_coin_room_ui::fold_rsp data:', JSON.stringify(data));
        this.showFoldUI(data.userid);
        this.activePlayerSpeak(data.userid, tdk_speak.QP);
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_KOU);
        tdk_am.playEffect(path);

        if(data.deskstatus == tdk_desktatus.DESKSTATUS_GAMING_SCORECMP){
            this.doKaiPai(data);
            this.singleProtoDone();
            return;
        }
        this.showCurOperateBtns(data);
        this.singleProtoDone();
    },

    //显示当前可操作按钮
    showCurOperateBtns : function (data) {
        this.printDebugInfo('showCurOperateBtns');
        this.changeActivePlayer(data.userid, data.nextuserid);
        if(gameData._selfId == data.nextuserid){
            var func = function (option) {
                option.betNum = data.betnum;
                option.deskStatus = data.deskstatus;
                this.addCostChipListener(option, data.nextuserid);
                if(data.genallin){
                    option.popGameOperateOption(option.gameOperateOption.AI);
                }else{
                    if(data.canallin){
                        option.popGameOperateOption(option.gameOperateOption.AI);
                    }
                    this.showGameMenu(option, data.deskstatus);
                }
            }.bind(this);
            this.loadGameMenu(func);
        };
    },

    //监听玩家下注
    addCostChipListener : function (option, userid) {
        this.printDebugInfo('addCostChipListener');
        var player = this.findPlayer(userid);
        option.addCostChipListener(function (num) {
            this.freshAllCostChipInfo(player, num);
        }.bind(this));
    },

    //找到本轮操作的玩家
    findPlayer : function (userid) {
        this.printDebugInfo('findPlayer');
        var player = null;
        for(var i=0; i<this.player_list.length; i++) {
            var item = this.player_list[i];
            if ( item && item.userId == userid) {
                player = item;
            }
        }
        if(!player){
            cc.warn('tdk_coin_room_ui::findPlayer: 没有找到玩家:',userid);
        }
        return player;
    },

    //加载游戏操作按钮
    loadGameMenu : function (cb) {
        this.printDebugInfo('loadGameMenu');
        var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_GAME_MENU, cc.Prefab);
        var menuNode = cc.instantiate(prefab);
        menuNode.parent = tdk.popupParent;
        var option = menuNode.getComponent('tdk_game_menu');
        cb(option);
    },

    //判断当前游戏有哪些操作
    showGameMenu : function(option, status){
        this.printDebugInfo('showGameMenu');
        var arr = null;
        switch(status){
            case tdk_desktatus.DESKSTATUS_GAMING_BET:
                arr = option.gameOperateOption.XZ;
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_QIJIAO:
                arr = option.gameOperateOption.BT_QJ;
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_FANTI:
                arr = option.gameOperateOption.BT_FT;
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_BET_GEN:
                arr = option.gameOperateOption.GZ;
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_QIJIAO_GEN:
                arr = option.gameOperateOption.GZ;
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_FANTI_GEN:
                arr = option.gameOperateOption.GZ;
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_LANGUO:
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_END:
                break;
            case tdk_desktatus.DESKSTATUS_GAMING_KAIPAI:
                arr = option.gameOperateOption.KP_C;
                break;
            case tdk_desktatus.DESKSTATUS_WAITINGFORREADY:
                arr = option.gameOperateOption.KS;
                break;
            default:
                break;
        }
        option.popGameOperateOption(arr);
    },

    //刷新玩家下注金额和所有玩家下注金额
    freshAllCostChipInfo : function (player, num, isAct) {
        this.printDebugInfo('freshAllCostChipInfo');
        player.doBet(num, isAct);
        this.totalCostChip += num;
        this.freshTotalCostChip();
    },

    //显示开始按钮
    showStartBtn : function () {
        var startBtn = cc.find('bg/roomInfo/start', this.node);
        startBtn.active = true;
    },

    checkProtoCache : function (dt) {
        if(this.protoCache_list.length > 0){
            cc.log('tdk_coin_room_ui::checkProtoCache!');
            this.stopCheckProtoCache();
            this.doNextProto();
        }
    },

    showPlayerScoreFlag : function () {
        this.printDebugInfo('showPlayerScoreFlag');
        this.player_list.forEach(function (item) {
            if(item){
                item.showScoreFlag();
            }
        });
    },

    addProtoCache : function (data) {
        cc.log('tdk_coin_room_ui::addProtoCache!data=',data);
        this.protoCache_list.push(data);
    },

    doNextProto : function () {
        if(this.protoCache_list.length > 0){
            cc.log('tdk_coin_room_ui::doNextProto !if:cache_list:',this.protoCache_list);
            var data = this.protoCache_list.shift();
            this.onProtoCacheMessage(data.pid, data.data);
        }else{
            cc.log('tdk_coin_room_ui::doNextProto! else');
            this.startCheckProtoCache();
        }
    },

    singleProtoDone : function () {
        cc.log('tdk_coin_room_ui::singleProtoDone!');
        // this.doNextProto();
    },

    /**
     * 断线重连发牌
     * @param data
     */
    reconnectSendPoker:function (data) {
        this.printDebugInfo('reconnectSendPoker');
        if(data.freshViewUserId == gameData._selfId){
            for(var i=0; i<this.player_list.length; i++) {
                var item = this.player_list[i];
                if (item.userId == data.userid) {
                    item.addPoker(data.pokerid, data.borrow, false);
                    item.setTotalScore(data.totalscore);
                    this.onReconnectAddLastPokerScore({userid: data.userid, num: data.score});
                    item.setOpenScore(data.score);
                }
            }
        }
    },

    //发牌
    sendPoker_rsp : function (data, isAct) {
        this.printDebugInfo('sendPoker_rsp');
        cc.log('tdk_coin_room_ui::sendPoker_rsp data:', JSON.stringify(data));

        for(var i=0; i<this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item.userId == data.userid) {
                if (typeof isAct == 'undefined') {
                    item.addPoker(data.pokerid, data.borrow, true, this.singleProtoDone.bind(this));
                } else {
                    item.addPoker(data.pokerid, data.borrow, false);
                }
                item.setTotalScore(data.totalscore);
                this.addLastPokerScore({userid: data.userid, num: data.score});
                item.setOpenScore(data.score);
            }
        }
    },

    showEndScore : function (userpokerlist) {
        this.printDebugInfo('showEndScore');
        for(var i=0; i<userpokerlist.length; i++){
            this.addLastPokerScore({userid:userpokerlist[i].userid, num:userpokerlist[i].score});
        }
    },

    //本轮游戏结束
    roundEnd_rsp : function (data) {
        this.printDebugInfo('roundEnd_rsp');
        // cc.log('tdk_coin_room_ui::roundEnd_rsp data:', JSON.stringify(data));
        // this.showEndScore(data.userpokerList);
        this.foldPlayerCnt = 0;
        this.foldPlayer_list.splice(0, this.foldPlayer_list.length);
        this.foldPlayer_list = [];

        if(data.endtype){//烂锅
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_LANGUO);
            gameData.setTie(true);
            var languo = cc.find('languo', this.node);
            languo.active = true;
        }else{
            gameData.setTie(false);
            this.findWinner(data.numlistList);
        }

        var func = null;
        if(data.deskend){
            //显示战绩按钮
            func = function (option) {
                this.loadZhanjiMenu(option);
            }.bind(this);
            this.showZhanjiCountDown();
        }else{
            //显示开始按钮
            func = function (option) {
                option.popGameOperateOption(option.gameOperateOption.KS);
            };
        }
        this.loadGameMenu(func);
        this.singleProtoDone();
    },

    noWinner : function () {
        this.printDebugInfo('noWinner');
        for(var i=0; i<gameData.userList.length; i++){
            var player = this.findPlayer(gameData.userList[i].userid);
            player.showResult(0, false);
        }
    },

    findWinner : function (numList) {
        this.printDebugInfo('findWinner');
        if(numList.length == 0){
            this.noWinner();
            return;
        }

        var tmpArr = new Array();
        numList.forEach(function (item) {
            tmpArr.push(item.num);
        });
        tmpArr.sort(function (a, b) {
            return b-a;
        });
        var maxNum = tmpArr[0];

        for(var i=0; i<numList.length; i++){
            var isWin = false;
            if(maxNum == numList[i].num){
                isWin = true;
            }
            var player = this.findPlayer(numList[i].userid);
            player.showResult(numList[i].num, isWin);
        }
    },

    quickSort : function (array) {
        var sort=function(prev, numsize){
            var nonius = prev;
            var j = numsize -1;
            var flag = array[prev];
            if ((numsize - prev) > 1) {
                while(nonius < j){
                    for(; nonius < j; j--){
                        if (array[j] < flag) {
                            array[nonius++] = array[j];　//a[i] = a[j]; i += 1;
                            break;
                        };
                    }
                    for( ; nonius < j; nonius++){
                        if (array[nonius] > flag){
                            array[j--] = array[nonius];
                            break;
                        }
                    }
                }
                array[nonius] = flag;
                sort(0, nonius);
                sort(nonius + 1, numsize);
            }
        };
        sort(0, array.length);
        return array;
    },

    hideDeskInfo : function () {
        this.printDebugInfo('hideDeskInfo');
        //切换ui
        //去掉desk info
        var roomInfoNode = cc.find('desk', this.node);
        roomInfoNode.active = false;
    },

    hideStartBtn : function () {
        this.printDebugInfo('hideStartBtn');
        //隐藏开始按钮
        var startBtn = cc.find('desk/start', this .node);
        startBtn.active = false;

        //调整邀请好友按钮位置
        var yaoqingBtn = cc.find('pregame/yaoqing', this.node);
        yaoqingBtn.x = 0;
    },

    //房主开始
    gameStart_rsp : function (data) {
        this.printDebugInfo('gameStart_rsp');
        // cc.log('tdk_coin_room_ui::gameStart_rsp:data=',JSON.stringify(data));

        // this.hideDeskInfo();

        //改變角色ui
        this.player_list.forEach(function (item) {
            item.setReadOkUI(false);
            item.showChipInfo();
        });

        if(data.isReconnect){
            return;
        }

        var languo = cc.find('languo', this.node);
        var act = languo.activeInHierarchy;
        if(!act){
            //给出底注
  
            this.player_list.forEach(function (item, index) {
                if(item){
                    item.doBet(DeskData.dizhu);
                    this.totalCostChip++;
                }
            }.bind(this));
            this.freshTotalCostChip();
        }
    },

    initPlayerList : function () {
        this.printDebugInfo('initPlayerList');
        for(var i=0; i<gameData.userList.length; i++){
            var item = gameData.userList[i];
            var pos = item.pos;
            this.playerId_list[pos] = item.userid;
        };
    },

    initReady : function () {
        this.printDebugInfo('initReady');
        gameData.userList.forEach(function (item) {
            if(item.already){
                var player = this.findPlayer(item.userid);
                player.setReadOkUI(true);
                if(gameData._selfId == item.userid){
                    this.hideStartBtn();
                }
            }
        }.bind(this));
    },

    initPlayerUI : function () {
        this.printDebugInfo('initPlayerUI');
        this.playerListSort();

        cc.log('tdk_coin_room_ui::initPlayerUI:id_list:', this.playerId_list);
        for(var i=0; i<this.playerId_list.length; i++){
            var item = this.playerId_list[i];
            if(item){
                this.addPlayer(item, i);
            }
        };
    },

    //更新总下注
    freshTotalCostChip : function () {
        this.printDebugInfo('freshTotalCostChip');
        var lblNode = cc.find('gaming/chipInfo/lbl', this.node);
        lblNode.getComponent(cc.Label).string = this.totalCostChip;
    },

    addPlayer : function (item, index) {
        this.printDebugInfo('addPlayer');
        var playerGroupNode = this.node.getChildByName(this.seatArrName);
        var seatNode = playerGroupNode.getChildByName('seat'+(index+1));
        var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_PLAYER_V2, cc.Prefab);
        var playerNode = cc.instantiate(prefab);
        var player = playerNode.getComponent('tdk_player_ui');
        player.seatId = index+1;
        player.userId = item;
        player.bRoomOwner = gameData.isRoomOwner;
        // this.player_list[index] = player;
        this.player_list.push(player);
        var nick = cc.find('nick',playerNode);
        var nickCpt = nick.getComponent(cc.Label);
        nickCpt.string = player.userId;
        playerNode.parent = seatNode;
    },

    playerListSort : function () {
        this.printDebugInfo('playerListSort');
        var tmp_list = new Array();
        for(var i in this.playerId_list){
            if(this.playerId_list[i] == gameData._selfId){
                this.playerId_list = this.playerId_list.slice(i);
                break;
            }else{
                tmp_list.push(this.playerId_list[i]);
            }
        }
        this.playerId_list = this.playerId_list.concat(tmp_list);
        this.clearArr(tmp_list);
    },

    unchacheAudio : function () {
        this.printDebugInfo('unchacheAudio');
        tdk_am.uncache(this.audioCache_list);
    },

    releaseUi:function () {
        this.clearArr(this.player_list);

        var seat = cc.find(this.seatArrName, this.node);
        if(seat){
            seat.removeFromParent();
            seat.destroy();
        }

        this.node.removeFromParent();
        this.node.destroy();
    },

    onDestroy : function () {
        cc.log('[ui]tdk_coin_room_ui::onDestroy!');
        RoomData.Instance().resetData();
        gameData.resetData();
        this.printDebugInfo('onDestroy');
        this.unschedule(this.showCurrentTime);
        this.stopCheckProtoCache();
        // this.clearArr(this.playerId_list);
        this.unchacheAudio();
        tdk_am.stopMusic();
        // tdk_net.removeObserver(this);
        this.removeObserver();
    },

    //解散房间
    dissolveDeskBtnClick : function () {
        this.printDebugInfo('dissolveDeskBtnClick');
        // var data ={
        //     id:tdk.GameData._selfId,
        // }
        // tdk_net.sendRequest(tdk_proId.TDK_PID_TDKDISSOLVEDESKREQ,data);
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_DISSOLVE_CONFIRM, cc.Prefab);
            var dialog = cc.instantiate(prefab);
            dialog.parent = tdk.popupParent;

            var cpt = dialog.getComponent('tdk_dissolve_confirm');
            cpt.addBtnOkClickListener(function () {
                shield.close();
            });
            cpt.addBtnCancelClickListener(function () {
                shield.close();
            });
        });
    },

    //解散房间
    dissolveDesk_rsp : function (data, func) {
        this.printDebugInfo('dissolveDesk_rsp');
        // cc.log('tdk_coin_room_ui::dissolveDesk_rsp:data=',JSON.stringify(data));
        var jsData = data.jiesanshenqingData;

        if(jsData.disnovote){
            this.resetPlayerState();

            tdk.popup.show(function (shield) {
                var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_MESSAGE_BOX, cc.Prefab);
                var mb = cc.instantiate(prefab);
                mb.parent = tdk.popupParent;

                var cpt = mb.getComponent('tdk_message_box');
                cpt.show('房间解散成功！');
                cpt.addOkBtnClickListener(function () {
                    shield.close();
                    this.exitGame();
                }.bind(this));
            });
            return;
        }

        if(jsData.resultcode == tdk.base_pb.tdk_enum_disdesicionrsp.DESKDISDESICIONRSP_SUCCESS){
            //加载解散房间ui
            tdk.popup.show(function (shield) {
                var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_DISSOLVE_ROOM, cc.Prefab);
                var menu = cc.instantiate(prefab);
                menu.parent = tdk.popupParent;

                var cpt = menu.getComponent('tdk_dissolve_room');
                var dissolveDeskCb = function () {
                    shield.close();
                };
                cpt.init(data.disrequserid, data.jiesanData_list, dissolveDeskCb, data.disVoteTime);
                if(typeof func != 'undefined'){
                    func(cpt);
                }
            });
        }
        this.singleProtoDone();
    },

    //不踢
    pass_rsp : function (data) {
        this.printDebugInfo('pass_rsp');
        // cc.log('tdk_coin_room_ui::pass_rsp:data=',JSON.stringify(data));
        this.activePlayerSpeak(data.userid, tdk_speak.BT);
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_BT);
        tdk_am.playEffect(path);

        if(data.deskstatus == tdk_desktatus.DESKSTATUS_GAMING_KAIPAI){
            this.doKaiPai(data);
            this.singleProtoDone();
            return;
        }
        this.showCurOperateBtns(data);
        this.singleProtoDone();
    },

    kaipai_rsp : function (data) {
        this.printDebugInfo('kaipai_rsp');
        // cc.log('tdk_coin_room_ui::kaipai_rsp:data=',JSON.stringify(data));
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_KAI);
        tdk_am.playEffect(path);

        this.doKaiPai(data);
        this.activePlayerSpeak(data.userid, tdk_speak.KP);
        this.singleProtoDone();
    },

    //展示玩家所有手牌
    allPoker_rsp : function (data) {
        this.printDebugInfo('allPoker_rsp');
        cc.log('tdk_coin_room_ui::allPoker_rsp:data=',JSON.stringify(data));
        this.showAllPoker(data);
        this.singleProtoDone();
    },

    showAllPoker : function (data) {
        cc.log('[ui] tdk_coin_room_ui::showAllPoker:data=', JSON.stringify(data));
        if(!data.fold){
            var player = this.findPlayer(data.userid);
            player.setTotalScore(data.totalscore);
            this.addLastPokerScore({userid:data.userid, num:data.totalscore});
            player.showBackPoker(data.pokerlistList);
            player.setOpenScore(data.score);
        }
    },

    /**
     * 解散房间成功，展示手牌
     * @param data
     */
    jiesanShowPoker:function (data) {
        for(var i=0; i<data.userpokerList.length; i++){
            var item = data.userpokerList[i];
            if(!item.fold){
                this.addLastPokerScore({userid:item.userid, num:item.totalscore});
                var player = this.findPlayer(item.userid);
                player.setTotalScore(data.totalscore);
                player.showBackPoker(item.pokerlistList);
                player.setOpenScore(data.score);
            }
        };
    },

    /**
     * 更新玩家下注和总输赢
     * @param data
     */
    freshChipAndWin:function (data) {
        this.printDebugInfo('freshChipAndWin');
        var player = this.findPlayer(data.userId);
        if(player){
            // this.freshAllCostChipInfo(player, data.costChip, false);
            if(data.costChip_list.length > 0){
                data.costChip_list.forEach(function (num) {
                    player.showCostChip(num);
                    this.totalCostChip += num;
                }.bind(this));
            }
            this.freshTotalCostChip();
            player.showWinNum(data.totalWinNum);
            player.resetPokerScorePt(data.poker_list.length);
        }
    },

    resetPlayerState:function () {
        this.player_list.forEach(function (player) {
            player.setPlayerStata(false);
        });
    },

    //解散牌桌的结果
    dissolveDeskResult_rsp : function (data) {
        this.printDebugInfo('dissolveDeskResult_rsp');
        // cc.log('tdk_coin_room_ui::dissolveDeskResult_rsp:data=',JSON.stringify(data));
        if(data.disresult){//显示战绩统计按钮
            this.resetPlayerState();
            var mbFunc = function () {
                this.jiesanShowPoker(data);
                this.showZhanjiCountDown();
                this.findWinner([]);
                var gameMenu = cc.find('gameMenu', tdk.popupParent);
                if(gameMenu){
                    gameMenu.removeFromParent();
                    gameMenu.destroy();
                    // gameMenu.close();
                }

                var func = function (option) {
                    this.loadZhanjiMenu(option);
                }.bind(this);
                this.loadGameMenu(func);
            }.bind(this);

            var infoBox = function () {
                tdk.popup.show(function (shield) {
                    var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_MESSAGE_BOX, cc.Prefab);
                    var mb = cc.instantiate(prefab);
                    mb.parent = tdk.popupParent;

                    var cpt = mb.getComponent('tdk_message_box');
                    cpt.show('房间解散成功！');
                    cpt.addOkBtnClickListener(function () {
                        shield.close();
                        mbFunc();
                    });
                });
            };

            var dissolveUi = cc.find('dissolveroom', tdk.popupParent);
            if(dissolveUi){
                var cpt = dissolveUi.getComponent('tdk_dissolve_room');
                cpt.close();
            }
            infoBox();
        }
        this.singleProtoDone();
    },

    loadZhanjiMenu : function (option) {
        this.printDebugInfo('loadZhanjiMenu');

        option.popGameOperateOption(option.gameOperateOption.ZJ);
        option.addBtnCallbackListener(function (tag) {
            switch (tag){
                case gbtnTag.ZHAN_JI:
                this.showZhanji();
                default:
                    break;
            }
        }.bind(this));
    },

    //显示房间左上角按钮菜单
    showRoomMenu : function () {
        this.printDebugInfo('showRoomMenu');
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_ROOM_MENU, cc.Prefab);
            var menu = cc.instantiate(prefab);
            menu.parent = tdk.popupParent;
            var cpt = menu.getComponent('tdk_room_menu');
            shield.addTouchShieldCallback(function () {
                shield.close();
                cpt.close();
            });
            cpt.addClickListener(function () {
                shield.close();
            });
        });
    },

    //语音聊天复选框
    yuyinCheckBoxClick : function () {
        // var cpt = this.chatToggle.getComponent(cc.Toggle);
        // if(cpt.isChecked){
        //     var chatBtn = cc.find('yuyin', this.node);
        //     chatBtn.active = true;
        // }
    },

    //语音聊天按钮
    yuyinBtnClick : function(){

    },

    //文字表情按钮
    biaoqingBtnClick : function(){

    },

    //邀请好友
    yaoqingBtnClick : function(){
        if(!cc.sys.isNative){
            return;
        }
        dd.native.setOnWxShare(function () {
            cc.log("微信分享成功");
        });
        DD.WXApiHandler.SendAppContent("123456", "填大坑", "房间号:123456,不要走,决战到天亮!", 'https://d.alphaqr.com/klbgame');
    },

    clearArr : function (arr) {
        this.printDebugInfo('clearArr');
        arr.forEach(function (item) {
            if(item.node){
                item.node.removeFromParent();
                item.node.destroy();
            }
        });

        arr.splice(0, arr.length);
        arr = [];
    },

    /**
     * 房间已经解散
     * @param data
     */
    roomAlreadyJieSan:function (data) {
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_MESSAGE_BOX, cc.Prefab);
            var mb = cc.instantiate(prefab);
            mb.parent = tdk.popupParent;

            var cpt = mb.getComponent('tdk_message_box');
            cpt.show('房间已经解散！');
            cpt.addOkBtnClickListener(function () {
                shield.close();
                this.releaseUi();
                cc.director.loadScene(tdk.home_scene);
            }.bind(this));
        });
    },

    //战绩统计数据
    zhanjiData_rsp : function (data) {
        this.printDebugInfo('zhanjiData_rsp');
        // cc.log('tdk_coin_room_ui::zhanjiData_rsp:data=!',JSON.stringify(data));
        this.zhanjiData = data.zhanjiData.dataList;
        this.singleProtoDone();
    },

    roomInit:function (data) {
        // cc.log('[ui] tdk_coin_room_ui::roomInit：data=',JSON.stringify(data));
        if(data.freshViewUserId == gameData._selfId){
            this.activeuserid = data.userid;
            this.curGameCnt = gameData.curGameCnt;

            cc.log('[ui]tdk_coin_room_ui::roomInit:当前游戏局数为:', this.curGameCnt);

            if(data.isLanGuo){
                this.doLanGuo(data);
            }
        }
    },

    playerExitGame:function (data) {
        cc.log('[ui] tdk_coin_room_ui::playerExiteGame！');
        for(var i=0;i<this.player_list.length; i++){
            var item = this.player_list[i];
            if(item.userId == data.userId){
                item.node.parent.active = false;
                item.clearPlayer();
                item = null;
                this.player_list.splice(i,1);
            }
        }
        if(gameData._selfId == data.userId){
            cc.director.loadScene(tdk.home_scene);
        }
    },

    leaveDesk_rsp : function (data) {
        cc.log('[ui] tdk_coin_room_ui::leaveDesk_rsp！');
        this.printDebugInfo('leaveDesk_rsp');

        if(gameData._selfId == data.userId){
            cc.director.loadScene(tdk.home_scene);
        }else{
            this.playerOffLine(data.userId, true);
        }

        // if(data.isSelf()){
        //     this.exitGame();
        // }else{//其他客户端逻辑处理
        //     if(!gameData.isGaming){//游戏前离开，清除玩家，重置该座位数据
        //         this.resetSeat(data.userId);
        //         cc.log('tdk_coin_room_ui::leaveDesk_rsp:',data.userId,'离开房间!');
        //     }else{
        //         //游戏中离开，改变玩家状态
        //         this.playerOffLine(data.userId, true);
        //     }
        // }

        this.singleProtoDone();
    },

    //切换玩家离线在线状态
    playerOffLine:function (userid, state) {
        this.printDebugInfo('playerOffLine');
        cc.log('tdk_coin_room_ui::playerOffLine:state=', state);
        var player = this.findPlayer(userid);
        player.offLine(state);
    },

    resetSeat : function (userid) {
        this.printDebugInfo('resetSeat');
        this.deleteUserIdFromPlayerIdList(userid);
        this.deltePlayerById(userid);
        gameData.deleteUserId(userid);
    },

    deleteUserIdFromPlayerIdList : function (userid) {
        this.printDebugInfo('deleteUserIdFromPlayerIdList');
        for(var i=0; i<this.playerId_list.length; i++){
            var item = this.playerId_list[i];
            if(item == userid){
                this.playerId_list[i] = null;
            }
        }
    },

    deltePlayerById : function (userid) {
        this.printDebugInfo('deltePlayerById');
        for(var i=0; i<this.player_list.length; i++){
            var item = this.player_list[i];
            if(item.userId == userid){
                item.node.removeFromParent();
                item.node.destroy();
                this.player_list.splice(i,1);
            }
        }
    },

    //显示战绩
    showZhanji : function () {
        this.printDebugInfo('showZhanji');
        if(this.bShowZhanji){
            return;
        }
        this.bShowZhanji = true;

        tdk.popup.show(function (shield) {
            // var prefab = cc.loader.getRes(dd.tdk_resCfg.PREFAB.PRE_ZHANJI, cc.Prefab);
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_ZHANJI_V2, cc.Prefab);
            var zj = cc.instantiate(prefab);
            zj.parent = tdk.popupParent;
            shield.node.opacity = 125;
            var cpt = zj.getComponent('tdk_zhanji');
            cpt.init(this.zhanjiData);
            cpt.addExitBtnClickListener(function () {
                shield.close();
                this.releaseUi();
            }.bind(this));
        });
    },

    //战绩统计倒计时
    zhanji_countDown : function (dt) {
        var node = cc.find('countDown', this.node);
        node.active = true;
        var lbl = node.getComponent(cc.Label);
        var num = parseInt(lbl.string);
        lbl.string = --num;
        if(num == 0){
            node.active = false;
            this.unschedule(this.zhanji_countDown);
            //主动推送战绩
            this.showZhanji();
        }
    },

    showZhanjiCountDown : function () {
        this.schedule(this.zhanji_countDown,1);
    },

    //显示当前时间，只有时分
    showCurrentTime : function (dt) {
        var str = '';
        var now  = new Date();
        var hh = now.getHours();
        if(hh < 10){
            str = str + '0';
        }
        str = str+hh;
        str = str+':';
        var mm = now.getMinutes();
        if(mm < 10){
            str = str + '0';
        }
        str = str+mm;
        cc.log('tdk_coin_room_ui::showCurrentTime:',str);
        var cpt = this.timeLbl.getComponent(cc.Label);
        cpt.string = str;
    },

    exitGame : function () {
        this.printDebugInfo('exitGame');
        // tdk_net.Destroy();
        // tdk.GameData.resetData();
        this.releaseUi();
        cc.director.loadScene(tdk.home_scene);
    },

    printDebugInfo:function (funcName) {
        // cc.log('[ui] tdk_coin_room_ui::'+funcName);
    },

    /************************test**********************************/
    testChipPoint : function () {
        this.startBet_rsp({"id":1001});
    },
});