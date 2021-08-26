var PY_Data = require("paoyao_data").PaoYao_Data;
var py = require('paoyao_util');
var PySound = require('paoyao_type').SoundEnum;
const PY_ED = require('paoyao_data').PY_ED;
const PY_Event = require('paoyao_data').PY_Event;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var hallData = require('hall_common_data').HallCommonData;
var Define = require("Define");
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var jlmj_prefab = require('jlmj_prefab_cfg');
var AudioManager = require('AudioManager');
var pyOutSoundcfg = require('pyOutSound');
const dissolveUI = 'gameyj_ddz/pyc/prefabs/ddz_dissolve';
const manPrefix = 'gameyi_paoyao/common/sound/man/';
const womanPrefix = 'gameyi_paoyao/common/sound/woman/';
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var Platform = require('Platform');
var AppCfg = require('AppConfig');
const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
var DingRobot = require('DingRobot');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
cc.Class({
    extends: cc.Component,

    properties: {
        paiAtlas: { type: cc.SpriteAtlas, default: null, tooltip: "牌图集" },
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        default_head: { default: null, type: cc.SpriteFrame, tooltip: '默认头像' },
    },

    onLoad: function () {
        DingRobot.set_ding_type(5);
        this.init();
        this.initUiScript();
        this.initGame();
        this.schedule(this.sendLocationInfo, 30);//发送位置信息
    },

    onDestroy: function () {
        PY_Data.getInstance().Destroy();
        PY_ED.removeObserver(this);
        RoomED.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
        RecordEd.removeObserver(this);
        RoomMgr.Instance().clear();
        this._uiComponents = [];
        AudioManager.getInstance().stopAllLoopSound();
    },

    /**
     * 初始化界面
     */
    init: function () {
        PY_ED.addObserver(this);
        RoomED.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RecordEd.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);
    },

    /**
     * 初始化UI脚本
     */
    initUiScript: function () {
        this._uiComponents = [];
        this._uiComponents.push(this.node.getComponentInChildren('paoyao_pyc_down'));
        this._uiComponents.push(this.node.getComponentInChildren('paoyao_pyc_right'));
        this._uiComponents.push(this.node.getComponentInChildren('paoyao_pyc_up'));
        this._uiComponents.push(this.node.getComponentInChildren('paoyao_pyc_left'));
        //得到结算界面脚本
        this.Settlement = this.node.getComponentInChildren('paoyao_Settlement');
        this.result = this.node.getComponentInChildren('paoyao_result');
        //通用信息面板脚本
        this.gameComon = this.node.getComponent('paoyao_game_comon');
    },

    /**
     * 初始化分数
     */
    initGame: function () {
        cc.find('chat', this.node).active = true;
        var roomtype = RoomMgr.Instance().gameId;
        console.log("initGame=====: " + roomtype)
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            cc.find('prepare', this.node).active = true;
            //底分
            var score_str = '底分: ' + RoomMgr.Instance()._Rule.baseScore * 0.1;
            cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
            //人数
            cc.find('prepare/GuZe/RenShu', this.node).getComponent(cc.Label).string = PY_Data.getInstance().GetPopulationStr();
            //局数
            cc.find('prepare/GuZe/JuShu', this.node).getComponent(cc.Label).string = PY_Data.getInstance().GetBureauNum();
            //玩法
            cc.find('prepare/GuZe/WanFa1', this.node).getComponent(cc.Label).string = PY_Data.getInstance().GetPlay();
            //规则
            cc.find('prepare/GuZe/GuZe1', this.node).getComponent(cc.Label).string = PY_Data.getInstance().GetRule1();
            cc.find('prepare/GuZe/GuZe2', this.node).getComponent(cc.Label).string = PY_Data.getInstance().GetRule2();
            //房间号
            cc.find('prepare/FangJangHao/bg/haoshu', this.node).getComponent(cc.Label).string = RoomMgr.Instance().roomId;

            this.initPlayer();
            this.initRoomInfo();
            this.ShowCurCircle();
        } else {
            var score = PY_Data.getInstance().GetScore();
            var score_str = '底分: ' + score;
            cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
            cc.log('玩家身上金币：', HallPropData.getCoin());
            if (this._uiComponents[0])
                this._uiComponents[0].Head().Score(HallPropData.getCoin()); //积分
            this._uiComponents[0].Head().initHead(hallData.getInstance().userId, hallData.getInstance().headUrl); //头像
        }
    },

    /**
     * 朋友局详细信息
     */
    initRoomInfo: function () {
        var Rule = RoomMgr.Instance()._Rule;
        this.zong_ju.string = '/' + Rule.circleNum.toString() + '局';
        var detialNode = cc.find('room_info/detail', this.node);
        cc.find('room_num/lbl', detialNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
        cc.find('round_num/lbl', detialNode).getComponent(cc.Label).string = Rule.circleNum.toString();
        cc.find('layout/wanfa', detialNode).getComponent(cc.Label).string = PY_Data.getInstance().GetPlay();
        cc.find('layout/guize1', detialNode).getComponent(cc.Label).string = PY_Data.getInstance().GetRule1();
        cc.find('layout/issan', detialNode).getComponent(cc.Label).string = PY_Data.getInstance().GetRule2();
        cc.find('layout/chat', detialNode).active = Rule.limitWords;
        cc.find('layout/voice', detialNode).active = Rule.limitTalk;
        cc.find('layout/gps', detialNode).active = Rule.gps;
        cc.find('layout/jiebei', detialNode).active = Rule.double;
        this.schedule(this.switchTimeRound, 10);

        let btnnode = cc.find('prepare/klb_friend_group_invite_btn', this.node);

        //玩法名称+人数+圈数+封顶+缺几人
        let rule = '刨幺' + ' ' + Rule.circleNum.toString() + '局';
        if (btnnode)
            btnnode.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule)
    },

    setFriendGroupInvite(visible) {
        let node = cc.find("prepare/klb_friend_group_invite_btn", this.node);
        if (node) {
            if (visible) {
                node.active = RoomMgr.Instance().isClubRoom();
            } else {
                node.active = false;
            }
        }
    },

    /**
     * 检查游戏状态
     */
    checkGameState: function () {
        var Rule = RoomMgr.Instance()._Rule;
        var curcircleNum = PY_Data.getInstance().GetCurCircle();
        if (curcircleNum > 1 && Rule.circleNum > curcircleNum) {
            PY_Data.getInstance().setIsStart(true);
        } else {
            PY_Data.getInstance().setIsStart(false);
        }
    },

    /**
     * 显示局数
     */
    ShowCurCircle: function () {
        if (this.dangqian_ju)
            this.dangqian_ju.string = PY_Data.getInstance().GetCurCircle();
    },

    //切换局数和时间显示
    switchTimeRound: function () {
        var timeNode = cc.find('room_info/time', this.node);
        var roundNode = cc.find('room_info/round', this.node);
        if (timeNode.active) {
            timeNode.active = false;
            roundNode.active = true;
        }
        else {
            timeNode.active = true;
            roundNode.active = false;
        }
    },

    //显示玩家信息
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('jlmj_prefab_cfg');
        var view = parseInt(data);
        var playerInfo = PY_Data.getInstance().GetPlayerData(view);
        if (playerInfo) {
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
                var user_info = ui.getComponent('user_info_view');
                user_info.setData(RoomMgr.Instance().gameId, RoomMgr.Instance().roomId, null, false, playerInfo);
                if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps) {
                    user_info.setGpsData(PY_Data.getInstance().GetPlayerInfo());
                }
                user_info.show();
            }.bind(this));
        }
    },

    /**
     * 邀请微信好友
     */
    onInvaite: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }

        hall_audio_mgr.com_btn_click();
        var data = PY_Data.getInstance();
        var roomid = RoomMgr.Instance().roomId;
        var title = "房间号:" + roomid + '\n';
        var str = "玩法: " + data.GetPlay() + "规则: " + data.GetRule1();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(roomid, "【" + data.GetPopulationStr() + data.GetBureauNum(), title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [data.GetPlay(), data.GetRule1()];

            let playerList = PY_Data.getInstance().GetPlayerInfo();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: '东北刨幺',//房间名称
                content: wanFa,//游戏规则数组
                usercount: 4,//人数
                jushu: RoomMgr.Instance()._Rule.circleNum,//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            if (custom == 'xianliao') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink('【刨幺】', title + str, url);
            }
            else
                cc.dd.native_wx.SendAppInvite(info, "【" + data.GetPopulationStr() + data.GetBureauNum(), title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
        cc.log("邀请好友：", title + str);
    },

    /**
     * 准备
     */
    onReady: function onReady() {
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);
    },

    /**
     * 部署桌面玩家信息
     */
    deployPlayer: function () {

    },

    onEventMessage: function (event, data) {
        switch (event) {
            case PY_Event.INIT_ROOM:  //初始化房间
                this.initGame();
                break;
            case PY_Event.PLAYER_ENTER:  //玩家进入    
                this.playerEnter(data);
                break;
            case PY_Event.PLAYER_EXIT: //玩家离开
                this.RefreshPlayerExit(data);
                break;
            case PY_Event.RESULT_RET: //单局结算
                this.RefreshSettlement(data);
                break;
            case PY_Event.HAND_POKER: //发牌
                this.handPoker(data);
                break;
            case PY_Event.CHOOSE_YAO: //选幺返回
                break;
            case PY_Event.CHOOSE_YAOEND: //选幺结束
                this.yaoData = data;
                break;
            case PY_Event.CHANGE_YAO: //玩家幺改变
                this.changeYao(data);
                break;
            case RoomEvent.on_room_ready: //准备 继续
                this.RoomReady(data[0]);
                break;
            case PY_Event.PLAY_POKER: //出牌返回
                this.playPoker(data);
                break;
            case PY_Event.REFRESH_FEN: //刷新记分牌
                this.refrshFenCard();
                break;
            case PY_Event.PLAY_XUE: //通知雪
                this.xueCard(data);
                break;
            case PY_Event.XUE_CALLBACK: //请求雪回调
                this.xueCallback(data);
                break;
            case PY_Event.UPDELE_SCORE: //更新桌面积分
                this.desktopIntegral(data.score);
                break;
            case PY_Event.UPDELE_TOOLSCORE: //更新队伍总积分
                this.UpdeleTeamInfo();
                break;
            case PY_Event.CHANGE_DESK: //桌子状态发生改变
                this.changeDesk(data);
                break;
            case PY_Event.OTHER_POKER: //队友手牌
                this.othePoker(data);
                break;
            case PY_Event.READY_REQ: //准备
                this.RefrshReady(data);
                break;
            case RoomEvent.on_room_leave: //解散
                this.on_room_leave(data[0]);
                break;
            case PY_Event.TOTAL_RESULT: //总结算
                this.showResult(data);
                break;
            case ChatEvent.CHAT:
                this.ShowChat(data);
                break;
            case PY_Event.CHAR_REQ: //喊话
                this.ShowHanhua(data);
                break;
            case PY_Event.PLAYER_ISONLINE: //离线
                this.refrshPlayerOnline(data);
                break;
            case PY_Event.RECONNECT: //重连
                this.reconnect(data);
                break;
            case PY_Event.DISSOLVE: //解散申请
                this.onDissolve(data, 30);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
            case PY_Event.DISSOLVE_RESULT: //解散结果
                this.dissolveResult(data);
                break;
            case RoomEvent.on_room_replace: //换桌
            case RoomEvent.on_coin_room_enter:
                this.clearScene();
                break;
            case RecordEvent.PLAY_RECORD:
                this.play_yuyin(data);
                break;
            case cc.dd.native_gvoice_event.PLAY_GVOICE: //播放语音
                this.showYuying(data[0], true);
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE: //停止语音
                this.showYuying(data[0], false);
                break;
            case RoomEvent.update_player_location: //位置更新
                this.on_player_location_change(data[0]);
                break;
        }
    },

    //位置更新
    on_player_location_change(msg) {
        var userId = msg.userId;
        var latlngInfo = msg.latlngInfo;
        var player = PY_Data.getInstance().getPlayer(userId);
        if (player) {
            player.ip = msg.ip;
            player.address = msg.address;
            player.location = latlngInfo;
        }
        this.refreshGPSWarn();
        var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        if (UI) {
            UI.getComponent('user_info_view').setGpsData(PY_Data.getInstance().GetPlayerInfo());
        }
    },

    refreshGPSWarn: function () {
        //cc.log('refreshGPSWarn----- gps:',RoomMgr.Instance()._Rule.gps);
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps) {
            var gpsList = [];
            var playerInfo = PY_Data.getInstance().GetPlayerInfo();
            if (!playerInfo) return;
            for (var i = 0; i < playerInfo.length; i++) {
                var player = playerInfo[i];
                if (player) {
                    var view = this.idToView(player.userId);
                    this._uiComponents[view].Head().ShowGps(false);
                    if (player && player.location) {
                        gpsList.push({ userId: player.userId, location: player.location });
                    }
                }
            }
            for (var i = 0; i < gpsList.length - 1; i++) {
                for (var j = i; j < gpsList.length - 1; j++) {
                    if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
                        var view1 = this.idToView(gpsList[j].userId);
                        var player1 = this._uiComponents[view1].Head();
                        if (player1)
                            player1.ShowGps(true);

                        var view2 = this.idToView(gpsList[j + 1].userId);
                        var player2 = this._uiComponents[view2].Head();
                        if (player2)
                            player2.ShowGps(true);
                    }
                }
            }
        }
    },

    getDistance(locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++111111' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++2222' + distance);
            return distance;
        }
    },

    play_yuyin: function (data) {
        var playerInfo = PY_Data.getInstance().GetPlayerInfo();
        for (var i = 0; i < playerInfo.length; i++) {
            if (playerInfo[i] && playerInfo[i].userId) {
                if (data.accid.toLowerCase() == (cc.dd.prefix + playerInfo[i].userId).toLowerCase()) {
                    var view = this.idToView(playerInfo[i].userId);
                    this._uiComponents[view].Head().play_yuyin(data.duration)
                }
            }
        }
    },

    /**
     * 语音
     */
    showYuying: function (openID, bl) {
        cc.log("语音--------openID:", openID, '-------bl:', bl);
        var view = this.idToView(openID);
        var player = PY_Data.getInstance().getPlayer(openID);
        if (player)
            this._uiComponents[view].Head().showYuYing(bl);
    },

    /**
     * 玩家离线
     */
    refrshPlayerOnline: function (data) {
        var view = this.idToView(data[0].userId);
        this._uiComponents[view].Head().ShowOffline(!data[1]);
    },

    //重连时游戏已结束
    reconnectHall: function () {
        this.backToHall();
    },

    /**
     * 重连
     */
    reconnect: function (data) {
        this.initPlayer();
        this.refrshFenCard();
        var state = data.state;
        var uiserid = hallData.getInstance().userId;
        var nextTime = PY_Data.getInstance().GetTime();
        if (state == 0) { //等待准备状态
            this.checkGameState();
            for (var i = 0; i < data.roleListList.length; ++i) {
                var role = data.roleListList[i];
                var viewid = this.idToView(role.id);
                this._uiComponents[viewid].Head().Ready(role.ready); //是否准备
            }
            this.reconnectReady();
        } else if (state == 1) { //游戏中状态
            this.initGamaState();
            this.reconnectDissolve(data.dissolveTimeout, data.dissolveInfoList);
            for (var i = 0; i < data.roleListList.length; ++i) {
                var role = data.roleListList[i];
                var viewid = this.idToView(role.id);

                if (uiserid == role.id) {
                    if (role.pokerList.length == 0) {
                        var player = PY_Data.getInstance().GetTeammateInfo(role.id);
                        var cards = this.getothePokers(data.roleListList, player.userId);
                        this._uiComponents[viewid].othePoker(cards);
                    } else {
                        this._uiComponents[viewid].playSendCards(role.pokerList, 0);
                    }
                } else {
                    cc.log('玩家ID', role.id, '重连手牌集合: ', role.pokerList.length, ' 手牌数量: ', role.pokerNum)
                    this._uiComponents[viewid].setRemainCardNum(role.pokerNum);
                }


                if (data.opId == role.id) { //出牌显示
                    this.getDesktopMaxCard(data.roleListList);
                    // if (data.opId == uiserid) { //自己

                    // }
                    this._uiComponents[viewid].showPlaying(nextTime);
                } else {
                    this._uiComponents[viewid].showOutCard(role.outPokerList, true);
                }
            }
        } else if (state == 2) { //等待雪状态
            this.initGamaState();
            this.reconnectDissolve(data.dissolveTimeout, data.dissolveInfoList);
            var teamid = PY_Data.getInstance().GetPlayerTeamID();
            for (var i = 0; i < data.roleListList.length; ++i) {
                var role = data.roleListList[i];
                var viewid = this.idToView(role.id);
                if (uiserid == role.id) {
                    this._uiComponents[viewid].playSendCards(role.pokerList, 0);
                }
                else {
                    this._uiComponents[viewid].setRemainCardNum(role.pokerNum);
                }
                if (teamid == data.tmpWin && uiserid == role.id) {
                    this._uiComponents[viewid].ChooseXueCard(nextTime);
                }
            }
        }

        for (var i = 0; i < data.roleListList.length; ++i) {
            var role = data.roleListList[i];
            var viewid = this.idToView(role.id);
            if (RoomMgr.Instance().gameId != Define.GameType.PAOYAO_FRIEND)
                this._uiComponents[viewid].Head().showTuoGuan(role.isAuto); //是否托管
            else
                this._uiComponents[viewid].Head().showTuoGuan(false); //是否托管
            this._uiComponents[viewid].Head().ShowOffline(!role.isOnline) //是否在线
            //this._uiComponents[viewid].Head().RefreshRemain(role.pokerNum); //手牌数量
            this._uiComponents[viewid].Head().outCardIndex(role.outIndex); // 出完牌的顺序
            this._uiComponents[viewid].Head().JiaBei(role.double); // 是否加倍
            if (cc.dd.user.id != role.id)
                this._uiComponents[viewid].Head().showYaoCard(role.aNum, role.yNum); //显示幺牌 
            this._uiComponents[viewid].Head().Score(role.totalScore); //积分
            var bl = PY_Data.getInstance().checkTeammate(role.id);
            this._uiComponents[viewid].Head().ShowRedLiu(bl); //红桃六
        }

        //桌面积分重置
        this.UpdeleTeamInfo();
        this.desktopIntegral(data.score);
        this.ShowCurCircle();
    },

    /**
     * 断线重连获桌面上最大出的牌
     */
    getDesktopMaxCard: function (roleList) {
        for (var i = 0; i < roleList.length; ++i) {
            var role = roleList[i];
            if (role.outPokerList.length == 0) {
                PY_Data.getInstance().refreshcardPassNum(false);
            }

            if (py.compareCards(PY_Data.getInstance().lastCards, role.outPokerList)) {
                var viewid = this.idToView(role.id);
                PY_Data.getInstance().lastCards = role.outPokerList;
                PY_Data.getInstance().lastPlayer = viewid;
            }
        }
    },

    /**
     * 断线重连--解散申请
     * @param tiem 倒计时
     * @param dissolveInfolist 玩家解散数据数组
     */
    reconnectDissolve: function (tiem, dissolveInfolist) {
        if (dissolveInfolist.length == 0) {
            return;
        }
        for (var i = 0; i < dissolveInfolist.length; ++i) {
            this.onDissolve(dissolveInfolist[i], tiem);
        }
    },

    /**
     * 获取队友手牌
     * @param roleList 玩家数据集合
     * @param userid 队友userID
     */
    getothePokers: function (roleList, uiserid) {
        for (var i = 0; i < roleList.length; ++i) {
            var role = roleList[i];
            if (role.id == uiserid) {
                return role.pokerList;
            }
        }
    },

    /**
     * 断线重连--准备阶段
     */
    reconnectReady: function () {
        var player = PY_Data.getInstance().getPlayer(cc.dd.user.id);
        var prepareNode = cc.find('prepare', this.node);
        if (!player || !prepareNode) return;
        prepareNode.active = !player.ready;
        var circle = PY_Data.getInstance().GetCurCircle();
        if (circle > 1) {
            PY_Data.getInstance().ReduceCurCircle();
            cc.find('GuZe', prepareNode).active = false;
            cc.find('FangJangHao', prepareNode).active = false;
            cc.find('Botton', prepareNode).active = false;
            cc.find('btns', prepareNode).active = !player.ready;
            if (!player.ready) {
                var double = RoomMgr.Instance()._Rule ? RoomMgr.Instance()._Rule.double : false;
                cc.find('btns/zhunbei', prepareNode).active = double;
            }

            this.hideResult();
            this.resetUI();
        }
    },

    /**
     * 房间内玩家信息
     * @param bl 是否转幺
     */
    initPlayer: function (bl) {
        var playerInfo = PY_Data.getInstance().GetPlayerInfo();
        if (!playerInfo) return;
        for (var i = 0; i < playerInfo.length; i++) {
            var player = playerInfo[i];
            if (player) {
                var viewid = this.idToView(player.userId);
                this._uiComponents[viewid].initPlayerInfo(player, bl);
                var double = PY_Data.getInstance().getPlayer(player.userId).double;
                var isdouble = double ? double : false;
                this._uiComponents[viewid].Head().JiaBei(isdouble);
            }
        }
        this.showWeiXin();
        this.refreshGPSWarn();
    },

    /**
     * 刷新记分牌
     */
    refrshFenCard: function () {
        var fenCards = PY_Data.getInstance().GetFenCards();
        if (fenCards) {
            cc.find('btns/jipaiqi/bg/13_num', this.node).getComponent(cc.Label).string = fenCards.cardk;
            cc.find('btns/jipaiqi/bg/10_num', this.node).getComponent(cc.Label).string = fenCards.card10;
            cc.find('btns/jipaiqi/bg/5_num', this.node).getComponent(cc.Label).string = fenCards.card5;
        }
    },

    /**
     * 选幺结束
     */
    chooseYaoEnd: function () {
        if (!this.yaoData) return;
        for (var i = 0; i < this.yaoData.listList.length; ++i) {
            var player = this.yaoData.listList[i];
            var viewid = this.idToView(player.id);
            if (cc.dd.user.id != player.id)
                this._uiComponents[viewid].Head().showYaoCard(player.aNum, player.yNum);
        }
        this.yaoData = null;
    },

    /**
     * 玩家幺改变
     */
    changeYao: function (data) {
        if (!data) return;
        var info = data.yao;
        var viewid = this.idToView(info.id);
        if (cc.dd.user.id != info.id)
            this._uiComponents[viewid].Head().showYaoCard(info.aNum, info.yNum);
    },

    /**
     * 玩家进入房间
     * @param player 玩家数据
     */
    playerEnter: function (player) {
        var viewid = this.idToView(player.userId);
        this._uiComponents[viewid].initPlayerInfo(player);
        this.showWeiXin();
        this.refreshGPSWarn();
    },

    /**
     * 邀请玩家按钮
     */
    showWeiXin: function () {
        var full = PY_Data.getInstance().checkPlayer();
        var player = PY_Data.getInstance().getPlayer(cc.dd.user.id);
        if (cc.dd.user.id == player.userId) {
            var prepareNode = cc.find('prepare', this.node);
            if (prepareNode) {
                cc.find('GuZe', prepareNode).active = !full;
                cc.find('FangJangHao', prepareNode).active = !full;
                cc.find('Botton/weixin', prepareNode).active = !full;
                this.setFriendGroupInvite(!full);
                cc.find('Botton/start', prepareNode).active = !player.ready;
            }
        }
    },

    /**
     * 聊天，表情，魔法道具
     */
    ShowChat: function (data) {
        var sendviewid = this.idToView(data.sendUserId);
        this._uiComponents[sendviewid].showChat(data);
    },

    /**
     * 喊话
     */
    ShowHanhua: function (data) {
        var viewid = this.idToView(data.id);
        var d = {
            msgtype: 4,
            msgId: data.msg,
            id: data.id,
        }
        this._uiComponents[viewid].showChat(d);
    },

    /**
     * 刷新桌面
     */
    RefreshDesk: function () {
        var isturn = PY_Data.getInstance().RefreshPlayerInfo();
        if (isturn) {
            this.initPlayer(isturn);
        }
        this.outCard();
    },

    /**
     * 退出房间
     */
    on_room_leave: function (data) {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype != Define.GameType.PAOYAO_FRIEND) {
            return;
        }

        if (data.userId == cc.dd.user.id) {
            PY_Data.getInstance().Destroy();
            cc.dd.SceneManager.enterHall();
        }
        else {
            if (data.userId == RoomMgr.Instance().roomerId) {
                cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", '确定', null, function () {
                    // 返回大厅
                    cc.dd.SceneManager.enterHall();
                }, function () {
                });
            }
        }
    },

    /**
     * 解散房间申请
     */
    onDissolve(msg, time) {
        this.closePopupView();
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('ddz_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = time ? time : 30;
                var playerList = PY_Data.getInstance().GetPlayerInfo();
                ui.getComponent('ddz_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    /**
     * 解散返回
     */
    dissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        PY_Data.getInstance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
            //this.backToHall();
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);

    },

    //返回大厅
    backToHall: function (event, data) {
        PY_Data.getInstance().Destroy();
        cc.dd.SceneManager.enterHall();
    },


    closePopupView: function () {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
    },

    /**
     * 总结算
     */
    showResult: function (data) {
        cc.log("总结算", data);
        PY_Data.getInstance().isEnd = true;
        PY_Data.getInstance().setIsStart(false);
        PY_Data.getInstance().lastCards = [];
        PY_Data.getInstance().lastPlayer = null;
        this.stopTime();
        this.ResultData = data;
        var circleNum = RoomMgr.Instance()._Rule.circleNum;
        var roomtype = RoomMgr.Instance().gameId;
        var num = PY_Data.getInstance().GetCurCircle() - 1;
        cc.log('num ： ', num, "circleNum : ", circleNum + 'roomtype :', roomtype);
        if (num < circleNum && roomtype == Define.GameType.PAOYAO_FRIEND) {
            this.showResultEvent();
        }
    },

    /**
     * 显示战绩界面
     */
    showResultEvent: function () {
        if (!this.ResultData) return;
        if (!this.result)
            this.result = this.node.getComponentInChildren('paoyao_result');
        this.result.initResultInfo(this.ResultData);
        this.ResultData = null;
    },

    /**
     * 隐藏战绩界面
     */
    hideResult: function () {
        var result = cc.find('result_ani', this.node);
        if (result)
            result.active = false;
    },

    /**
     * 关闭定时器
     */
    stopTime: function () {
        var players = PY_Data.getInstance().GetPlayerInfo();
        var uiserid = hallData.getInstance().userId;
        for (var i = 0; i < players.length; ++i) {
            if (uiserid == players[i].userId)
                continue;
            var viewid = this.idToView(players[i].userId);
            this._uiComponents[viewid].hideTimer();
        }
    },

    /**
     * 玩家离开房间
     * @param view 顺序座位号
     */
    RefreshPlayerExit: function (view) {
        this._uiComponents[view].RefreshPlayerExit();
        this.showWeiXin();
        this.refreshGPSWarn();
    },

    /**
     * 准备 继续
     */
    RoomReady: function (data) {
        if (data) {
            var gameinfo = data.gameInfo;
            if (gameinfo && gameinfo.gameType == Define.GameType.PAOYAO_FRIEND) {
                var viewid = this.idToView(data.userId);
                if (viewid == 0) {
                    cc.find('prepare/Botton/start', this.node).active = false;
                    var prepareNode = cc.find('prepare', this.node);
                    if (prepareNode) {
                        cc.find('btns', prepareNode).active = false;
                    }
                }

                this._uiComponents[viewid].Head().Ready(true);
            } else
                this.clearScene();
        } else {
            this.clearScene();
        }
    },

    //打完一局之后清理场景
    clearScene: function () {
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].resetUI();
            if (i != 0) {
                this._uiComponents[i].Head().showUI(false);
                this._uiComponents[i].Head().headsp.spriteFrame = this.default_head;
            }
        }
    },

    /**
     * 朋友场准备
     */
    RefrshReady: function (data) {
        if (!data)
            return;
        var uiserid = hallData.getInstance().userId;
        if (uiserid == data.id) {
            PY_Data.getInstance().AddCurCircle();
            this.ShowCurCircle();
            PY_Data.getInstance().resetFenCard();
            this.refrshFenCard();
            PY_Data.getInstance().resetTeamInfo();
            this.resetUI();
            var prepareNode = cc.find('prepare', this.node);
            if (prepareNode) {
                cc.find('btns', prepareNode).active = false;
            }
        }

        PY_Data.getInstance().setDouble(data.id, data.isDouble);
        console.log("玩家ID: " + data.id + "是否准备: " + data.isDouble);
        PY_Data.getInstance().setReady(data.id, true);
        var players = PY_Data.getInstance().GetPlayerInfo();
        if (!players) return;
        for (var i = 0; i < players.length; ++i) {
            var playernode = this._uiComponents[this.idToView(players[i].userId)];
            if (playernode) {
                playernode.Head().Ready(players[i].ready);
                playernode.Head().Score(players[i].score);
            }
        }
    },

    /**
     * 重置界面
     */
    resetUI: function () {
        var players = PY_Data.getInstance().GetPlayerInfo();
        if (!players) return;
        for (var i = 0; i < players.length; ++i) {
            var playernode = this._uiComponents[this.idToView(players[i].userId)];
            if (playernode) {
                playernode.resetUI();
            }
        }
    },

    /**
     * 结算界面
     * @param data 结算数据
     */
    RefreshSettlement: function (data) {
        var showsettlement = function (data) {
            var roomtype = RoomMgr.Instance().gameId;
            if (roomtype == Define.GameType.PAOYAO_GOLD) {
                this.checkGameState();
                PY_Data.getInstance().isSettlement = true;
            }
            PY_Data.getInstance().lastCards = [];
            PY_Data.getInstance().lastPlayer = null;
            this.stopTime();
            //显示手牌
            var uiserid = hallData.getInstance().userId;
            var list = data.pokerList;
            for (var i = 0; i < list.length; ++i) {
                var viewid = this.idToView(list[i].id)
                this._uiComponents[viewid].showLangCard(list[i].pokerList);

            }

            for (var i = 0; i < data.resultList.length; ++i) {
                var player = data.resultList[i];
                var viewid = this.idToView(player.id);
                this._uiComponents[viewid].Head().refreshScore(player.score);
            }

            if (!this.Settlement)
                this.Settlement = this.node.getComponentInChildren('paoyao_Settlement');
            this.Settlement.InitSettlement(data);
        }.bind(this);
        this.nextTime = 0;
        var timer = function () {
            this.nextTime--;
            if (this.nextTime < 0) {
                this.nextTime = 0;
                this.unschedule(timer)
                showsettlement(data);
            }
        }
        this.schedule(timer, 1)
    },

    /**
     * 队友手牌
     */
    othePoker: function (data) {
        if (!data)
            return;
        var list = data.list;
        var cards = list.pokerList;
        var taemid = PY_Data.getInstance().GetPlayerTeamID();
        console.log("队友手牌======:" + taemid);
        if (taemid == list.teamId)
            this._uiComponents[0].othePoker(cards);
    },

    /**
     * 游戏中状态
     */
    initGamaState: function () {
        if (!this.gameComon)
            this.gameComon = this.node.getComponent('paoyao_game_comon');
        this.gameComon.initBtns(true);
        PY_Data.getInstance().setIsStart(true);
        PY_Data.getInstance().isEnd = false;
        cc.find('prepare', this.node).active = false;
        var isming = true;
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            isming = RoomMgr.Instance()._Rule.isMing;
        }
        var count = PY_Data.getInstance().GetPopulation();
        for (var i = 0; i < count; ++i) {
            this._uiComponents[i].Head().showYaoNode(isming);
        }

        cc.find('liaotian', this.node).active = true;

    },

    //发牌
    handPoker: function (data) {
        if (!data)
            return;
        this.initGamaState();
        cc.find('layer_base_score', this.node).active = true;
        this.UpdeleTeamInfo();
        var userid = hallData.getInstance().userId;
        for (var i = 0; i < data.length; ++i) {
            var d = data[i];
            if (d) {
                var viewid = this.idToView(d.id);
                if (userid == d.id)
                    this._uiComponents[viewid].playSendCards(d.pokerList);
                else {
                    var pokerNum = 27;
                    var roomtype = RoomMgr.Instance().gameId;
                    if (roomtype == Define.GameType.PAOYAO_FRIEND) {
                        pokerNum = (RoomMgr.Instance()._Rule && !RoomMgr.Instance()._Rule.hasSan) ? 25 : 27;
                    }
                    this._uiComponents[viewid].setRemainCardNum(pokerNum);
                }
                var bl = PY_Data.getInstance().checkTeammate(d.id);
                this._uiComponents[viewid].Head().ShowRedLiu(bl); //红桃六
            }
        }
        //转幺刷新桌面
        this.RefreshDesk();
        //刷新玩家信息
        this.refreshPlayers();
    },

    /**
     * 刷新玩家信息
     */
    refreshPlayers: function () {
        var players = PY_Data.getInstance().GetPlayerInfo();
        if (!players) return;
        for (var i = 0; i < players.length; ++i) {
            var d = players[i];
            var viewid = this.idToView(d.userId);
            var double = PY_Data.getInstance().getPlayer(d.userId).double;
            var isdouble = double ? double : false;
            console.log("玩家ID: " + d.userId + "是否j加倍: " + isdouble);
            this._uiComponents[viewid].Head().Ready(false);
            this._uiComponents[viewid].Head().JiaBei(isdouble);
            PY_Data.getInstance().setReady(d.userId, false);
            PY_Data.getInstance().ResetOutIndex(d.userId);
        }
    },

    /**
     * 雪牌
     */
    xueCard: function (data) {
        if (!data) return;
        var playerID = hallData.getInstance().userId;
        var viewid = this.idToView(playerID);
        var players = PY_Data.getInstance().GetPlayerInfo();
        for (var i = 0; i < players.length; ++i) {
            if (data.teamId == players[i].team_id && playerID == players[i].userId) {
                this._uiComponents[viewid].ChooseXueCard(15);
            }
        }
        var teamid = PY_Data.getInstance().GetPlayerTeamID();
        if (teamid != data.teamId)
            this._uiComponents[0].showOperation();
    },

    /**
     * 出牌
     */
    outCard: function () {
        var nextId = PY_Data.getInstance().GetNextID();
        var time = PY_Data.getInstance().GetTime();
        var viewid = this.idToView(nextId);
        this._uiComponents[viewid].showPlaying(time)
    },

    addUIComponents: function (index) {
        switch (index) {
            case 0:
                this._uiComponents[0] = this.node.getComponentInChildren('paoyao_pyc_down');
                break;
            case 1:
                this._uiComponents[1] = this.node.getComponentInChildren('paoyao_pyc_right');
                break;
            case 2:
                this._uiComponents[2] = this.node.getComponentInChildren('paoyao_pyc_up');
                break;
            case 3:
                this._uiComponents[3] = this.node.getComponentInChildren('paoyao_pyc_left');
                break;
        }
    },
    /**
     * 出牌消息
     */
    playPoker: function (data) {
        var curViewid = this.idToView(data.opId);
        var nextviewid = this.idToView(data.nextId);
        cc.log('出牌的消息ID:' + data.opId + ' viewid:' + curViewid);
        cc.log('下家出牌的ID:' + data.nextId + 'viewid:' + nextviewid);
        var pokers = data.pokerList;
        var player = PY_Data.getInstance().getPlayer(data.opId);
        if (player)
            player.out_poker = pokers;
        this.outCardSound(curViewid, pokers);
        if (pokers.length > 0) {
            PY_Data.getInstance().lastCards = pokers;
            PY_Data.getInstance().lastPlayer = curViewid;
            PY_Data.getInstance().refreshcardPassNum(false);
            PY_Data.getInstance().RefreshFenCard(pokers);
        } else
            PY_Data.getInstance().refreshcardPassNum(true);
        cc.log("出牌的消息集合: ", pokers);
        if (!this._uiComponents[curViewid])
            this.addUIComponents(curViewid);
        this._uiComponents[curViewid].showOutCard(pokers);
        if (this._uiComponents[curViewid].getHandCardNum() != 0) {
            if (nextviewid == PY_Data.getInstance().lastPlayer) {
                PY_Data.getInstance().lastCards = [];
                PY_Data.getInstance().refreshcardPassNum(false);
            }
        } else {
            var outIndex = this.getNextOutIndex();
            //var player = PY_Data.getInstance().getPlayer(data.opId);
            if (player)
                player.out_index = outIndex;
            this._uiComponents[curViewid].Head().outCardIndex(outIndex);
        }
        this.checkNetPlayer(data.nextId);
        this.refreshPlayerOut(data.opId);
        this.showotherPoker(data.opId, pokers);
        var timestamp = Date.parse(new Date()) / 1000;
        cc.log('出牌返回--服务器时间:' + data.nextTime, '本地时间:' + timestamp)
        var playTime = data.nextTime;
        this._uiComponents[nextviewid].showPlaying(playTime);
    },

    /**
     * 播放音效
     * @param sex 性别
     * @param type 出牌类型
     * @param index 牌值
     */
    firstplaySound: function (sex, type, index) {
        var path = null;
        var cfglist = pyOutSoundcfg.getItemList(function (itrem) {
            if (itrem.type == type) {
                return itrem;
            }
        });

        var str = '';
        for (var i = 0; i < cfglist.length; ++i) {
            if (cfglist[i].value == index) {
                str = cfglist[i].soundName;
            }
        }

        if (sex == 1) {
            path = manPrefix + str;
        } else if (sex == 0) {
            path = womanPrefix + str;
        }
        console.log('播放音效----paht : ' + path);
        AudioManager.getInstance().playSound(path, false);
    },

    /**
     * 播放音效
     * @param sex 性别
     * @param type 出牌类型
     */
    playSound: function (sex, type) {
        var path = null;
        var cfg = pyOutSoundcfg.getItem(function (itrem) {
            if (itrem.type == type) {
                return itrem;
            }
        });
        var str = cfg.soundName;
        if (sex == 0) {
            path = manPrefix + str;
        } else if (sex == 1) {
            path = womanPrefix + str;
        }
        console.log("出牌类型音效：" + path);
        AudioManager.getInstance().playSound(path, false);
    },

    /**
     * 出牌音效
     * @param id 座位号
     * @param pokers 出牌集合
     */
    outCardSound: function (id, pokers) {
        var player = PY_Data.getInstance().getPlayerByViewID(id);
        var sex = 0;
        if (player)
            sex = player.sex;
        if (pokers.length > 0) {
            if (PY_Data.getInstance().lastPlayer == this.idToView(id) || !PY_Data.getInstance().lastCards || PY_Data.getInstance().lastCards.length == 0) {
                var analysis = py.analysisCards(pokers);
                switch (analysis.type) {
                    case 1://单牌
                    case 2://对子
                        this.firstplaySound(sex, analysis.type, analysis.index);
                        break;
                    case 3://单顺
                    case 4://对顺
                    case 5://三路
                    case 6://四路
                    case 7://五路
                    case 8://六路
                    case 9://七路
                    case 10://八路
                    case 11://小幺
                    case 12://中幺
                    case 13://老幺
                    case 14://老老幺
                        this.playSound(sex, analysis.type, 0);
                        break;
                }
            }
            else {
                var analysis = py.analysisCards(pokers);
                var lastanalysis = py.analysisCards(PY_Data.getInstance().lastCards);
                var typeSame = analysis.type == lastanalysis.type;
                switch (analysis.type) {
                    case 1://单牌
                    case 2://对子
                        this.firstplaySound(sex, analysis.type, analysis.index);
                        break;
                    case 3://单顺
                    case 4://对顺
                        this.playSound(sex, analysis.type, 0);
                        //this.playSound(sex, PySound.SOUND_RUNOVER);
                        break;
                    case 5://三路
                    case 6://四路
                    case 7://五路
                    case 8://六路
                    // if (analysis.index == 18) { //复数王炸
                    //     //this.playSound(sex, PySound.SOUND_CLOSE);
                    //     break;
                    // }
                    case 9://七路
                    case 10://八路
                        // if (analysis.index == 18) { //复数王炸
                        //     //this.playSound(sex, PySound.SOUND_CLOSE);
                        //     break;
                        // }
                        this.playSound(sex, analysis.type, 0);
                        break;
                    case 11://小幺
                        this.playSound(sex, analysis.type, 0);
                        break;
                    case 12://中幺
                    case 13://老幺
                    case 14://老老幺
                        this.playSound(sex, analysis.type, 0);
                        break;
                }
            }
        }
        else {
            var num = Math.round(Math.random() + 21)
            this.playSound(sex, num);
        }
    },

    //桌子状态改变
    changeDesk: function (data) {
        var curViewid = this.idToView(data.nextId);
        if (curViewid == PY_Data.getInstance().lastPlayer) {
            PY_Data.getInstance().lastCards = [];
        }
        var playTime = data.nextTime;
        this._uiComponents[curViewid].showPlaying(playTime);
    },

    //显示队友手牌
    showotherPoker: function (userid, cardlist) {
        var player = PY_Data.getInstance().getPlayer(userid);
        var teamid = PY_Data.getInstance().GetPlayerTeamID();
        if (this._uiComponents[0].getHandCardNum() == 0 && player.team_id == teamid) {
            this._uiComponents[0].refrshOthePoker(cardlist);
        }
    },

    /**
     * 下一位出完牌顺序
     */
    getNextOutIndex: function () {
        var outindex = 0;
        var players = PY_Data.getInstance().GetPlayerInfo();
        for (var i = 0; i < players.length; ++i) {
            if (players[i].out_index > outindex)
                outindex = players[i].out_index;
        }
        return outindex + 1;
    },

    /**
     * 刷新玩家手牌为空的出牌节点
     */
    refreshPlayerOut: function (curplayerId) {
        var curplayer = this.idToView(curplayerId);
        var nextplayer = this.getNextPlayer(curplayer);
        var outHand = function (nextid) {
            if (this._uiComponents[nextid].getHandCardNum() == 0) {
                this._uiComponents[nextid].clearOutCard();
                return true;
            }
            return false;
        }.bind(this);
        var isout = outHand(nextplayer);
        if (isout) {
            var nextid = this.getNextPlayer(nextplayer);
            outHand(nextid);
        }
    },

    /**
     * 检查是否该队友出牌
     */
    checkNetPlayer: function (nextid) {
        var lastPalyerNum = this.getCardPlayer();
        var passnum = PY_Data.getInstance().getcardPassNum();
        if (passnum >= lastPalyerNum) {
            PY_Data.getInstance().lastCards = [];
            PY_Data.getInstance().lastPlayer = -1;
        }
    },

    /**
     * 桌面还剩共几人出牌
     */
    getCardPlayer: function () {
        var players = PY_Data.getInstance().GetPlayerInfo();
        var num = 0;
        for (var i = 0; i < players.length; ++i) {
            var playerviewid = this.idToView(players[i].userId);
            var cardNum = this._uiComponents[playerviewid].getHandCardNum();
            if (cardNum == 0)
                ++num;
        }
        var coun = PY_Data.getInstance().GetPopulation();
        return coun - num;
    },

    //获取下一个玩家
    getNextPlayer: function (curPlayer) {
        return curPlayer + 1 < PY_Data.getInstance().GetPopulation() ? curPlayer + 1 : 0;
    },

    /**
     * 获取玩家
     * @param id 玩家uiseID
     */
    idToView: function (id) {
        return PY_Data.getInstance().idToView(id);
    },

    //桌面积分
    desktopIntegral: function (score) {
        var baseScore = cc.find('layer_base_score', this.node);
        var numNode = baseScore.getChildByName('num').getComponent(cc.Label);
        if (score) {
            baseScore.active = true;
            numNode.string = score;
        } else {
            numNode.string = 0;
            baseScore.active = false;
        }


    },

    /**
     * 更新队伍积分
     */
    UpdeleTeamInfo: function () {
        var team = cc.find('difen', this.node);
        var currNum = team.getChildByName('our_num').getComponent(cc.Label);
        var oppositeNum = team.getChildByName('opposite_num').getComponent(cc.Label);
        var teaminfo = PY_Data.getInstance().GetTeamInfo();
        var currTeamId = PY_Data.getInstance().GetPlayerTeamID();
        for (var i = 0; i < teaminfo.length; ++i) {
            if (teaminfo[i].id == currTeamId) {
                currNum.string = teaminfo[i].score;
            } else {
                oppositeNum.string = teaminfo[i].score;
            }
        }
        this.desktopIntegral();
    },

    //请求雪返回
    xueCallback: function (data) {
        if (!data)
            return;
        if (data.type == true)
            this._uiComponents[0].showOperation(null);
        else {
            var playerID = hallData.getInstance().userId;
            if (playerID == data.id)
                this._uiComponents[0].showOperation(null);
        }

    },

    /**
     * 点击桌面
     */
    onBgClick: function () {
        this._uiComponents[0].clearAllSelectCards();
        if (cc.find('room_info/detail', this.node) && cc.find('room_info/detail', this.node).active == true) {
            cc.find('room_info/detail', this.node).active = false;
        }
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        prefab.getChildByName('lord').active = false;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = prefab.getChildByName('hua_xiao');
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        if (value == 17)
            value = 3;
        switch (value) {
            case 0:
                prefab.getChildByName('beimian').active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 14:
            case 16:
            case 11:
            case 12:
            case 13:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 18:
                prefab.getChildByName('beimian').active = false;
                num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + 17);
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                hua_xiao.active = false;
                break;
            case 19:
                prefab.getChildByName('beimian').active = false;
                num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + 17);
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                hua_xiao.active = false;
                break;
        }
    },

    //更新经纬度
    sendLocationInfo() {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype != Define.GameType.PAOYAO_FRIEND) return;
        var pbData = new cc.pb.room_mgr.msg_player_location_req();
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                var adress;
                if (typeof (latitude) != 'undefined' && typeof (longitude) != 'undefined')
                    adress = jsb.reflection.callStaticMethod('game/SystemTool', "getAdress", "()Ljava/lang/String;");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                cc.log("详细地址：位置 " + adress);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);

            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                var adress = jsb.reflection.callStaticMethod('SystemTool', "getAdress");
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                cc.log("详细地址：位置 " + adress);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_player_location_req, pbData, 'msg_player_location_req', true);
        }
    },
});
