/**
 * Created by wang on 2017/7/10.
 */
/**
 * Created by zhanghuaxiong on 2017/5/16.
 */

var dd = cc.dd;
var tdk = dd.tdk;
// var tdk_net = null;
var tdk_am = require("tdk_audio_manager").Instance();
var tdk_base_pb = require('tdk_base_pb');
var tdk_proId = tdk_base_pb.tdk_enum_protoId;
var tdk_desktatus = tdk_base_pb.tdk_enum_deskstatus;

var gameData = require('tdk_game_data');
var tdk_enum_btn = require('TDKBtnConf')
var gbtnTag = tdk_enum_btn.game_operate;
var tdk_speak = require('TDKConstantConf').SPEAK_TEXT;
var tdk_audio = require('TDKConstantConf').AUDIO_TYPE;
var TdkSender = require('jlmj_net_msg_sender_tdk');

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
    },

    testDataFunc : function () {
    },

    test_init : function () {
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
            //{path:preRes.PRE_SEAT_ARR, type:cc.Prefab},
            {path:preRes.PRE_PROMPT_BOX, type:cc.Prefab},
            {path:preRes.PRE_PLAYER_V2, type:cc.Prefab},
            {path:fonRes.FONT_ROUND_WIN, type:cc.Font},
            {path:fonRes.FONT_ROUND_FAILED, type:cc.Font},
            {path:fonRes.FONT_TOTAL_WIN, type:cc.Font},
            {path:fonRes.FONT_TOTAL_FAILED, type:cc.Font},
            {path:fonRes.FONT_WIN, type:cc.Font},
            {path:fonRes.FONT_FAILED, type:cc.Font},
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
        var self = this;
        tdk_am.preload(resArr, function (progress) {
            cpt.string = '正在加载声音资源('+progress+'%)';
        }, function () {
            node.parent.removeFromParent();
            node.parent.destroy();
            self.gameStart();
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
        gameData.gameExist = true;
    },

    gameStart : function () {

        // Start: 如果是 native 且竖屏，切换屏幕角度
       // const SceneOrientationUtil = require('SceneOrientationUtil');
       // SceneOrientationUtil.reOrientation(this.node.parent);
        // End  : 如果是 native 且竖屏，切换屏幕角度

        this.deskInfo = gameData._deskInfo;
        this.playerId_list = new Array(this.maxPlayerCnt); //保存玩家位置信息

        if(gameData.reconnect){
            this.onReconnect();
        }else{
            this.init();
            tdk_am.playMusic(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BG);
        }

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
        tdk.popupParent = cc.find('Canvas');
        this.initGameData();
        this.loadRoomRes();
    },

    //隐藏多余的空位
    hideEmptySeat : function () {
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
        this.showPlayerPoker();
        //显示正在操作的玩家
        this.showActPlayer();
        //显示是否正在解散
        this.showDissolve();
        //显示玩家chipinfo
        this.showPlayerChipInfo();
        this.hideEmptySeat();
    },

    showPlayerChipInfo : function () {
        var self = this;
        gameData.userList.forEach(function (item) {
            var player = self.findPlayer(item.userid);
            player.showChipInfo();
            if(item.fold){
                self.showFoldUI(item.userid);
            }
        });
    },

    showDissolve : function () {
        var gameInfo = gameData.gameInfo;
        var self = this;
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
            };

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
        this.activePlayer(actid, true);
        var self = this;
        var gameInfo = gameData.gameInfo;
        if(gameData._selfId == actid){
            var func = function (option) {
                option.betNum = gameInfo.betnum;
                option.deskStatus = gameInfo.deskStatus;
                self.addCostChipListener(option, actid);
                if(gameInfo.genallin){
                    option.popGameOperateOption(option.gameOperateOption.AI);
                }else{
                    if(gameInfo.canallin){
                        option.popGameOperateOption(option.gameOperateOption.AI);
                    }
                    self.showGameMenu(option, gameInfo.deskStatus);
                }
            };
            this.loadGameMenu(func);
        }
    },

    showPlayerPoker : function () {
        var self = this;
        gameData.userpokerList.forEach(function (item) {
            item.pokerlistList.forEach(function (poker) {
                self.sendPoker_rsp({
                    userid:item.userid,
                    pokerid:poker,
                    borrow:item.borrow,
                    score:item.score,
                }, false);
            });
            self.showPlayerChip({
                userid:item.userid,
                bet:item.bet,
            });
        });
    },

    //判断玩家当前明牌手牌与最高分直接的差距
    addLastPokerScore : function (data) {
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
        if(this.lastPokerList.length == (gameData.userList.length-this.foldPlayerCnt)){
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
        var self = this;
        var func = function (option) {
            option.popGameOperateOption(option.gameOperateOption.KS_C);
            option.addBtnCallbackListener(function (tag) {
                switch (tag){
                    case gbtnTag.KAI_SHI_COIN:
                        self.startMatch();
                    default:
                        break;
                }
            });
        };
        this.loadGameMenu(func);
    },

    //开始匹配
    startMatch:function () {
        var matchNode = cc.find('match', this.node);
        matchNode.active = true;
        var lbl = cc.find('time', matchNode).getComponent(cc.Label);
        var time = 20;
        var func = function (dt) {
            time--;
            lbl.string='('+time+'s)';
            if(0 == time){
                matchNode.active = false;
                this.unschedule(func);
            }
        };
        this.schedule(func, 1);
    },

    showDeskInfo : function () {
        this.gameCntLbl.string = '共'+this.deskInfo.rCnt+'局';
        this.roomNumLbl.string = '【房间号:'+this.deskInfo.did+'】';
        this.allinLbl.string = this.deskInfo.pCnt+'人开局 All in'+this.deskInfo.allin+'倍封顶';

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
        this.hideStartBtn();
    },

    //清除上局筹码信息
    clearAllChipInfo : function () {
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

    // onProtoCacheMessage : function (eventId, data) {
    //     switch (eventId){
    //         case tdk_proId.TDK_PID_TDKJOINDESKRSP:
    //             this.playerEnter(data);
    //             break;
    //         case tdk_proId.TDK_PID_TTDKRETURNDESKRSP:
    //             break;
    //         case tdk_proId.TDK_PID_TDKUSERREADYRSP:
    //             this.playerReady_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKSTARTBETRSP:
    //             this.startBet_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKBETRSP:
    //             this.bet_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKQIJIAORSP:
    //             this.bet_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKFANTIRSP:
    //             this.bet_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKFOLDRSP:
    //             this.fold_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKSENDPOKERRSP:
    //             this.sendPoker_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKROUNDENDRSP:
    //             this.roundEnd_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKDISSOLVEDESKUSERRSP:
    //             this.dissolveDesk_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKPASSRSP:
    //             this.pass_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKKAIPAIRSP:
    //             this.kaipai_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKDISDESKRESULT:
    //             this.dissolveDeskResult_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKZHANJIRSP:
    //             this.zhanjiData_rsp(data);
    //             break;
    //         case tdk_proId.TDK_PID_TDKLEAVEDESKRSP:
    //             this.leaveDesk_rsp(data);
    //             break;
    //         default:
    //             break;
    //     }
    // },

    // //网络回调
    // onEventMessage : function (eventId, data) {
    //     switch (eventId){
    //         case tdk_proId.TDK_PID_TDKJOINDESKRSP:
    //             this.playerEnter(data);
    //             break;
    //         case tdk_proId.TDK_PID_TTDKRETURNDESKRSP:
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

    playerEnter : function (data) {
        cc.log('tdk_coin_room_ui::playerEnter:data=',data);
        return;
        if(this.findUserId(data.userid)){
            //玩家已经存在，只需切换状态
            this.playerOffLine(data.userid, true);
            return;
        }
        gameData.userList.push({"userid":data.userid});
        var len = this.playerId_list.length;
        for(var i=0; i<len; i++){
            var item = this.playerId_list[i];
            if(!item){
                item = data.userid;
                this.playerId_list[i] = item;
                this.addPlayer(item, i);
                break;
            }
        }

        if(gameData.userList.length == this.deskInfo.pCnt){
            this.hideEmptySeat();
        }
    },

    //准备
    playerReady_rsp : function (data) {
        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_READY);
        cc.log('tdk_coin_room_ui::playerReady_rsp:data=',data);
        var self = this;
        this.player_list.forEach(function (item) {
            if(item.userId == data.userid){
                item.setReadOkUI(true);
                if(gameData._selfId == data.userid){
                    self.clearAllChipInfo();
                }
            }
        });

        if(data.allready){
            tdk_am.stopMusic();
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_START);

            this.hideEmptySeat();
            this.foldPlayerCnt = 0;
            gameData.isGaming = true;
            this.gameStart_rsp();
            //显示游戏中的界面
            this.showGamingUI();
            //隐藏游戏前ui
            this.hidePregameUI();
            //更新左上角局数信息
            this.curGameCnt++;
            var cptl = this.currentGameCntLbl.getComponent(cc.Label);
            cptl.string = '第:'+this.curGameCnt+'/'+this.deskInfo.rCnt+'局';
        }
    },

    //隐藏游戏前ui界面
    hidePregameUI : function () {
        var node = cc.find('pregame', this.node);
        node.active = false;
    },

    //开启游戏中ui界面
    showGamingUI : function () {
        this.showChatBtn();
        var node = cc.find('gaming', this.node);
        node.active = true;

        var cptl = this.currentGameCntLbl.getComponent(cc.Label);
        cptl.string = '第:'+this.curGameCnt+'/'+this.deskInfo.rCnt+'局';

        var cptr = this.lt_allinLbl.getComponent(cc.Label);
        cptr.string = '全押:'+ this.deskInfo.allin;
    },

    //显示系统时间
    showTime : function () {
        var cpt = this.timeLbl.getComponent(cc.Label);
        cpt.string = '12:12';
    },

    //显示语音聊天按钮
    showChatBtn : function () {
        var cpt = this.chatToggle.getComponent(cc.Toggle);
        if(cpt.isChecked){
            var chatBtn = cc.find('yuyin', this.node);
            chatBtn.active = true;
        }
    },

    //开始下注
    startBet_rsp : function (data) {
        cc.log('tdk_coin_room_ui::startBet_rsp data:', JSON.stringify(data));
        this.activePlayer(data.userid, true);
        var self = this;
        if(gameData._selfId == data.userid){
            var func = function (option) {
                self.addCostChipListener(option, data.userid);
                option.popGameOperateOption(option.gameOperateOption.XZ);
            };
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
            var voiceArr = dd.tdk_resCfg.AUDIO[player.sex][key];
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
            default:
                break;
        }
        tdk_am.playEffect(path);
        this.activePlayerSpeak(userid, text);
    },

    bet_rsp : function (data) {
        cc.log('tdk_coin_room_ui::bet_rsp data:', JSON.stringify(data));
        this.synOtherPlayerOperate(data.userid, data.predeskstatus);

        if(data.deskstatus == tdk_desktatus.DESKSTATUS_GAMING_KAIPAI){
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
        this.activePlayer(userid, false);
        this.activePlayer(nextuserid, true);
    },

    //设置玩家操作标志
    activePlayer : function (userid, state) {
        var player = this.findPlayer(userid);
        cc.log('tdk_coin_room_ui::activePlayer:userid=',userid,',state=',state,',player=',player);
        if(player){
            player.setPlayerStata(state);
        }
    },

    //刷新其他玩家的下注金额
    freshOtherPlayerCostChip : function (data) {
        var self = this;
        for (var i = 0; i < this.player_list.length; i++){
            var item = this.player_list[i];
            if (item && item.userId == data.userid &&
                item.userId != gameData._selfId) {
                self.freshAllCostChipInfo(item, data.betnum);
            }
        }
    },

    doKaiPai : function (data) {
        cc.log('tdk_coin_room_ui::doKaipai:data=',JSON.stringify(data));
        var self = this;
        if(data.nextuserid == 0){
            this.activePlayer(data.userid);
            this.showAllPoker(data);
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
        this.foldPlayerCnt++;
        //显示扣牌ui
        this.player_list.forEach(function (item) {
            if(item.userId == userid){
                item.setFoldUI(true);
            }
        });
    },

    fold_rsp : function (data) {
        cc.log('tdk_coin_room_ui::fold_rsp data:', JSON.stringify(data));
        this.showFoldUI(data.userid);
        this.activePlayerSpeak(data.userid, tdk_speak.QP);
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_KOU);
        tdk_am.playEffect(path);

        if(data.deskstatus == tdk_desktatus.DESKSTATUS_GAMING_KAIPAI){
            this.doKaiPai(data);
            this.singleProtoDone();
            return;
        }
        this.showCurOperateBtns(data);
        this.singleProtoDone();
    },

    //显示当前可操作按钮
    showCurOperateBtns : function (data) {
        this.changeActivePlayer(data.userid, data.nextuserid);
        var self = this;
        if(gameData._selfId == data.nextuserid){
            var func = function (option) {
                option.betNum = data.betnum;
                option.deskStatus = data.deskstatus;
                self.addCostChipListener(option, data.nextuserid);
                if(data.genallin){
                    option.popGameOperateOption(option.gameOperateOption.AI);
                }else{
                    if(data.canallin){
                        option.popGameOperateOption(option.gameOperateOption.AI);
                    }
                    self.showGameMenu(option, data.deskstatus);
                }
            };
            this.loadGameMenu(func);
        };
    },

    //监听玩家下注
    addCostChipListener : function (option, userid) {
        var self = this;
        var player = this.findPlayer(userid);
        option.addCostChipListener(function (num) {
            self.freshAllCostChipInfo(player, num);
        });
    },

    //找到本轮操作的玩家
    findPlayer : function (userid) {
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
        var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_GAME_MENU, cc.Prefab);
        var menuNode = cc.instantiate(prefab);
        menuNode.parent = tdk.popupParent;
        var option = menuNode.getComponent('tdk_game_menu');
        cb(option);
    },

    //判断当前游戏有哪些操作
    showGameMenu : function(option, status){
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
                arr = option.gameOperateOption.KP;
                break;
            default:
                break;
        }
        option.popGameOperateOption(arr);
    },

    //刷新玩家下注金额和所有玩家下注金额
    freshAllCostChipInfo : function (player, num, isAct) {
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
        this.doNextProto();
    },

    //发牌
    sendPoker_rsp : function (data, isAct) {
        cc.log('tdk_coin_room_ui::sendPoker_rsp data:', JSON.stringify(data));

        var self = this;
        this.player_list.forEach(function (item) {
            if(item.userId == data.userid){
                if(typeof isAct == 'undefined'){
                    item.addPoker(data.pokerid, data.borrow, true, self.singleProtoDone.bind(self));
                    // item.addPoker(data.pokerid, data.borrow);
                }else{
                    item.addPoker(data.pokerid, data.borrow, false);
                }
                item.totalScore(data.totalscore);
                self.addLastPokerScore({userid:data.userid, num:data.score});
            }
        });
    },

    showEndScore : function (userpokerlist) {
        for(var i=0; i<userpokerlist.length; i++){
            this.addLastPokerScore({userid:userpokerlist[i].userid, num:userpokerlist[i].score});
        }
    },

    //本轮游戏结束
    roundEnd_rsp : function (data) {
        cc.log('tdk_coin_room_ui::roundEnd_rsp data:', JSON.stringify(data));
        // this.showEndScore(data.userpokerList);
        var self = this;
        this.foldPlayerCnt = 0;

        if(data.endtype){//烂锅
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_LANGUO);
            gameData.setTie(true);
            var languo = cc.find('languo', this.node);
            languo.active = true;
        }else{
            gameData.setTie(false);
            this.findWinner(data.numList)
        }

        var func = null;
        if(data.deskend){
            //显示战绩按钮
            func = function (option) {
                self.loadZhanjiMenu(option);
            };
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
        for(var i=0; i<gameData.userList.length; i++){
            var player = this.findPlayer(gameData.userList[i].userid);
            player.showResult(0, false);
        }
    },

    findWinner : function (numList) {
        if(numList.length == 0){
            this.noWinner();
            return;
        }

        var tmpArr = numList.concat();
        tmpArr.sort(function (a, b) {
            return b-a;
        });
        var maxNum = tmpArr[0];

        for(var i=0; i<gameData.userList.length; i++){
            var isWin = false;
            if(maxNum == numList[i]){
                isWin = true;
            }
            var player = this.findPlayer(gameData.userList[i].userid);
            player.showResult(numList[i], isWin);
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
        //切换ui
        //去掉desk info
        var roomInfoNode = cc.find('desk', this.node);
        roomInfoNode.active = false;
    },

    hideStartBtn : function () {
        //隐藏开始按钮
        var startBtn = cc.find('desk/start', this .node);
        startBtn.active = false;

        //调整邀请好友按钮位置
        var yaoqingBtn = cc.find('pregame/yaoqing', this.node);
        yaoqingBtn.x = 0;
    },

    //房主开始
    gameStart_rsp : function (data) {
        cc.log('tdk_coin_room_ui::gameStart_rsp:data=',JSON.stringify(data));
        this.roundCnt++;

        this.hideDeskInfo();

        //改變角色ui
        this.player_list.forEach(function (item) {
            item.setReadOkUI(false);
            item.showChipInfo();
        });

        var languo = cc.find('languo', this.node);
        var act = languo.activeInHierarchy;
        if(!act){
            //给出底注
            var self = this;
            this.player_list.forEach(function (item, index) {
                if(item){
                    item.doBet(1);
                    self.totalCostChip++;
                }
            });
            this.freshTotalCostChip();
        }
    },

    initPlayerList : function () {
        var self = this;
        for(var i=0; i<gameData.userList.length; i++){
            var item = gameData.userList[i];
            var pos = item.pos;
            self.playerId_list[pos] = item.userid;
        };
    },

    initReady : function () {
        var self = this;
        gameData.userList.forEach(function (item) {
            if(item.already){
                var player = self.findPlayer(item.userid);
                player.setReadOkUI(true);
                if(gameData._selfId == item.userid){
                    self.hideStartBtn();
                }
            }
        });
    },

    initPlayerUI : function () {
        this.playerListSort();

        cc.log('tdk_coin_room_ui::initPlayerUI:id_list:', this.playerId_list);
        var self = this;
        for(var i=0; i<this.playerId_list.length; i++){
            var item = this.playerId_list[i];
            if(item){
                self.addPlayer(item, i);
            }
        };
    },

    //更新总下注
    freshTotalCostChip : function () {
        var lblNode = cc.find('gaming/chipInfo/lbl', this.node);
        lblNode.getComponent(cc.Label).string = this.totalCostChip;
    },

    addPlayer : function (item, index) {
        var playerGroupNode = this.node.getChildByName('seatArr');
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
        tdk_am.uncache(this.audioCache_list);
    },

    onDestroy : function () {
        cc.log('tdk_coin_room_ui::onDestory!');
        this.unschedule(this.showCurrentTime);
        this.stopCheckProtoCache();
        this.clearArr(this.playerId_list);
        this.clearArr(this.player_list);
        this.unchacheAudio();
    },

    //解散房间
    dissolveDeskBtnClick : function () {
        var data ={
            id:tdk.GameData._selfId,
        }
        TdkSender.onDissolveTdkDesk(data);
    },

    //解散房间
    dissolveDesk_rsp : function (data, func) {
        cc.log('tdk_coin_room_ui::dissolveDesk_rsp:data=',JSON.stringify(data));
        var self = this;

        if(data.disnovote){
            cc.director.loadScene(tdk.home_scene);
            return;
        }

        if(data.resultcode == tdk.base_pb.tdk_enum_disdesicionrsp.DESKDISDESICIONRSP_SUCCESS){
            //加载解散房间ui
            tdk.popup.show(function (shield) {
                var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_DISSOLVE_ROOM, cc.Prefab);
                var menu = cc.instantiate(prefab);
                menu.parent = tdk.popupParent;

                var cpt = menu.getComponent('tdk_dissolve_room');
                var dissolveDeskCb = function () {
                    shield.close();
                };
                cpt.init(data.userid, data.disuserList, dissolveDeskCb);
                if(typeof func != 'undefined'){
                    func(cpt);
                }
            });
        }
        this.singleProtoDone();
    },

    //不踢
    pass_rsp : function (data) {
        cc.log('tdk_coin_room_ui::pass_rsp:data=',JSON.stringify(data));
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
        cc.log('tdk_coin_room_ui::kaipai_rsp:data=',JSON.stringify(data));
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_KAI);
        tdk_am.playEffect(path);

        this.doKaiPai(data);
        this.activePlayerSpeak(data.userid, tdk_speak.KP);
        this.singleProtoDone();
    },

    showAllPoker : function (data) {
        var self = this;
        for(var i=0; i<data.userpokerList.length; i++){
            var item = data.userpokerList[i];
            if(!item.fold){
                self.addLastPokerScore({userid:item.userid, num:item.score});
                var player = self.findPlayer(item.userid);
                player.showBackPoker(item.pokerlistList);
            }
        };
    },

    //解散牌桌的结果
    dissolveDeskResult_rsp : function (data) {
        cc.log('tdk_coin_room_ui::dissolveDeskResult_rsp:data=',JSON.stringify(data));
        if(data.disresult){//显示战绩统计按钮
            var self = this;

            this.showAllPoker(data);
            this.showZhanjiCountDown();
            this.findWinner([]);
            var gameMenu = cc.find('gameMenu', tdk.popupParent);
            if(gameMenu){
                gameMenu.removeFromParent();
                gameMenu.destroy();
            }

            var func = function (option) {
                self.loadZhanjiMenu(option);
            };
            this.loadGameMenu(func);
        }
        this.singleProtoDone();
    },

    loadZhanjiMenu : function (option) {
        var self =this;
        option.popGameOperateOption(option.gameOperateOption.ZJ);
        option.addBtnCallbackListener(function (tag) {
            switch (tag){
                case gbtnTag.ZHAN_JI:
                    self.showZhanji();
                default:
                    break;
            }
        });
    },

    //显示房间左上角按钮菜单
    showRoomMenu : function () {
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

    },

    clearArr : function (arr) {
        arr.forEach(function (item) {
            if(item.node){
                item.node.removeFromParent();
                item.node.destroy();
            }
        });

        arr.splice(0, arr.length);
        arr = [];
    },

    //战绩统计数据
    zhanjiData_rsp : function (data) {
        cc.log('tdk_coin_room_ui::zhanjiData_rsp:data=!',JSON.stringify(data));
        this.zhanjiData = data.dataList;
        this.singleProtoDone();
    },

    leaveDesk_rsp : function (data) {
        cc.log('tdk_coin_room_ui::leaveDesk_rsp:data=!',JSON.stringify(data));
        if(data.result){//离开成功
            if(gameData._selfId == data.userid){
                cc.director.loadScene(tdk.home_scene);
            }else{//其他客户端逻辑处理
                if(!gameData.isGaming){//游戏前离开，清除玩家，重置该座位数据
                    this.resetSeat(data.userid);
                    cc.log('tdk_coin_room_ui::leaveDesk_rsp:',data.userid,'离开房间!');
                }else{
                    //游戏中离开，改变玩家状态
                    this.playerOffLine(data.userid);
                }
            }
        }else{
            cc.warn('tdk_coin_room_ui::leaveDesk_rsp:离开房间失败!');
        }
        this.singleProtoDone();
    },

    //切换玩家离线在线状态
    playerOffLine:function (userid, state) {
        var player = this.findPlayer(userid);
        player.offLine(state);
    },

    resetSeat : function (userid) {
        this.deleteUserIdFromPlayerIdList(userid);
        this.deltePlayerById(userid);
        gameData.deleteUserId(userid);
    },

    deleteUserIdFromPlayerIdList : function (userid) {
        for(var i=0; i<this.playerId_list.length; i++){
            var item = this.playerId_list[i];
            if(item == userid){
                this.playerId_list[i] = null;
            }
        }
    },

    deltePlayerById : function (userid) {
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
        cc.log('tdk_coin_room_ui::showZhanji!');
        if(this.bShowZhanji){
            return;
        }
        this.bShowZhanji = true;
        var self =this;
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_ZHANJI, cc.Prefab);
            var zj = cc.instantiate(prefab);
            zj.parent = tdk.popupParent;
            shield.node.opacity = 125;
            var cpt = zj.getComponent('tdk_zhanji');
            cpt.init(self.zhanjiData);
            cpt.addExitBtnClickListener(function () {
                shield.close();
            });
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

    /************************test**********************************/
    testChipPoint : function () {
        this.startBet_rsp({"id":1001});
    },



    // //Net.js子类
    // //注册协议
    // regRecvFunc: function () {
    //     //注册聊天协议
    //     dd.ChatManagerUtil.register(this, tdk_pid.TDK_PID_TDKCOMBCMSG);
    // },
    // //调用聊天视图
    // showChatView:function () {
    //     var sex = 1; //传入性别
    //     dd.ChatManagerUtil.show(gameData._selfId, tdk_net, tdk_proId.TDK_PID_TDKCOMREQMSG,sex);
    // },
    // //ui
    // onLoad:function () {
    //     dd.ChatManagerUtil.addObserver(this);
    // },
    // onDestroy:function(){
    //     dd.ChatManagerUtil.removeObserver(this);
    // },
    // //交给工具处理
    // doChat:function (data) {
    //     if(data.net == tdk_net){
    //         cc.log('[ui]doChat:收到聊天消息：', JSON.stringify(data.msg));
    //         var pt = cc.v2(0,0);
    //         var sex = 1;
    //         dd.ChatManagerUtil.doChat(data.msg, sex, pt);
    //     }
    // },
    // //监听服务器返回聊天消息
    // onEventMessage:function (event, data) {
    //     switch (event) {
    //         case dd.ChatManagerUtil.chatEvent.CHAT:
    //             this.doChat(data);
    //             break;
    //     }
    // },

});