const PDK_ED = require('pdk_data').PDK_ED;
const PDK_Event = require('pdk_data').PDK_Event;
const PDK_Data = require('pdk_data').PDK_Data;
var pdk = require('pdk_util');
var jlmj_prefab = require('jlmj_prefab_cfg');
var AudioManager = require('AudioManager');
var pdk_audio_cfg = require('pdk_audio_cfg');
var pdk_chat_cfg = require('ddz_chat_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];
var PropAudioCfg = require('jlmj_ChatCfg').PropAudioCfg;
var FortuneHallManager = require('FortuneHallManager').Instance();
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var HallCommonData = HallCommonObj.HallCommonData;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var game_room = require("game_room");
var hall_prefab = require('hall_prefab_cfg');
var playerExp = require('playerExp');
var DingRobot = require('DingRobot');
var AppCfg = require('AppConfig');
var Platform = require('Platform');
const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
const dissolveUI = 'gameyj_pdk/prefabs/pdk_dissolve';
const test_version = AppCfg.IS_DEBUG;
const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;
const convertTimes = [0, 0, 15, 20, 40];//封顶倍数

//房间状态
const roomStatus = {
    STATE_REFRESH: 0,       //
    STATE_ENTER: 1,         //进入房间
    STATE_PREPARE: 2,       //准备
    STATE_DEAL_POKER: 3,    //发牌
    STATE_CALL_SCORE: 4,    //叫分
    STATE_DOUBLE: 5,        //加倍
    STATE_PLAYING: 6,       //出牌
    STATE_ENDING: 7,        //结算中
    STATE_STACK_POKER: 10,  //分摞发牌
    STATE_CHANGE_POKER: 11, //换三张
    STATE_DOUBLE_FARM: 12,  //农民优先加倍
};

const soundType = {
    JIAOFEN: 1,             //叫分
    JIABEI: 2,              //加倍
    DAN: 3,                 //单
    DUI: 4,                 //对
    SAN: 5,                 //三
    KILL: 6,                //压死
    PASS: 7,                //不出
    THREE_YI: 8,            //三带一
    THREE_DUI: 9,           //三带对
    FOUR_ER: 10,            //四带二
    FOUR_DUI: 11,           //四带二对
    SHUNZI: 12,             //顺子
    LIANDUI: 13,            //连对
    BOMB: 14,               //炸弹
    ROCKET: 15,             //王炸
    AIRPLANE: 16,           //飞机
    REMAIN: 17,             //警告
    CHAT: 18,               //聊天
    FOUR_SAN: 19,           //四带三
};

cc.Class({
    extends: cc.Component,

    properties: {
        chat_item: cc.Prefab,
        win_pic: cc.SpriteFrame,
        lose_pic: cc.SpriteFrame,
        win_font: { type: cc.Font, default: null, tooltip: '胜利字' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字' },
        paiAtlas: { type: cc.SpriteAtlas, default: null, tooltip: "牌图集" },
        atlas_game: { type: cc.SpriteAtlas, default: null, tooltip: "游戏图集" },
        room_num: { default: null, type: cc.Label, tooltip: '房号', },
        btn_invite: { default: null, type: cc.Node, tooltip: "邀请微信好友" },
        btn_friend_invite: { default: null, type: cc.Node, tooltip: "亲友圈邀请好友" },
        btn_read: { default: null, type: cc.Button, tooltip: "游戏准备" },
        btn_start: { default: null, type: cc.Button, tooltip: "游戏开局" },
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        magic_atlas: { type: cc.SpriteAtlas, default: null, tooltip: '魔法道具' },
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
        addsub: [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        DingRobot.set_ding_type(3);
        this.initUiScript(true);
        this.initZhuoBu();
        this.initMusicAndSound();
        this.initRoomInfo();
        this.initPlayer();
        this.initChat();
        this.initInviteButton();
        this.initReady();

        PDK_ED.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        RecordEd.addObserver(this);
        BSC_ED.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);

        cc.find('chat', this.node).getComponent(cc.Animation).on('play', function () { this.chatAni = true; }.bind(this), this);
        cc.find('chat', this.node).getComponent(cc.Animation).on('finished', function () { this.chatAni = false; }.bind(this), this);

        this.schedule(this.sendLocationInfo, 30);//发送位置信息
        // if (test_version) {
        //     cc.find('test', this.node).active = true;
        //     this.pokerPrefab = this._uiComponents[0].paiPre;
        // }
        if (!RoomMgr.Instance().isClubRoom())
            this.btn_friend_invite.active = false;

        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }
    },

    onDestroy: function () {
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
        this.initUiScript(false);
        PDK_ED.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        RecordEd.removeObserver(this);
        BSC_ED.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
        PDK_Data.Destroy();
        RoomMgr.Instance().clear();
        AudioManager.getInstance().stopAllLoopSound();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case PDK_Event.INIT_ROOM:
                this.initGame();
                break;
            case PDK_Event.HAND_POKER:
                this.handPoker(data);
                break;
            case PDK_Event.UPDATE_STATUS:
                this.updateStatus(data);
                break;
            case PDK_Event.PLAY_POKER:
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showReady(false);
                }
                this.playPoker(data);
                break;
            case PDK_Event.AUTO_RET:
                this.autoRet(data);
                break;
            case PDK_Event.RESULT_RET:
                this.showResult(data);
                break;
            case BSC_Event.RANK_INFO:
                this.showRank(data);
                break;
            case PDK_Event.RECONNECT:
                this.reconnect(data);
                break;
            case BSC_Event.GAME_END:
                break;
            case PDK_Event.PLAYER_OFFLINE:
                this.playerOffline(data);
                break;
            case PDK_Event.BG_CLICK:
                this.onBgClick();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case PDK_Event.MINGPAI:
                this.onMingpai(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
            case PDK_Event.UPDATE_ROOM_PLAYER_NUM:
                this.updateRoomPlayerNum();
                break;
            case PDK_Event.PLAYER_READY:
                this.playerReady(data);
                break;
            case PDK_Event.PLAYER_ISONLINE:
                this.playerOnline(data);
                break;
            case PDK_Event.PLAYER_ENTER:
                this.playerEnter(data);
                break;
            case PDK_Event.PLAYER_EXIT:
                this.playerExit(data);
                break;
            case RoomEvent.on_room_leave:
                this.on_room_leave(data[0]);
                break;
            case PDK_Event.STACK_POKER:
                this.onStackRet(data);
                break;
            case PDK_Event.ZHANJI:
                this.onZhanji(data);
                break;
            case PDK_Event.DISSOLVE:
                this.onDissolve(data);
                break;
            case PDK_Event.DISSOLVE_RESULT:
                this.dissolveResult(data);
                break;
            case RecordEvent.PLAY_RECORD:
                for (var i = 0; i < PDK_Data.Instance().playerInfo.length; i++) {
                    if (PDK_Data.Instance().playerInfo[i] && PDK_Data.Instance().playerInfo[i].userId) {
                        if (data.accid.toLowerCase() == (cc.dd.prefix + PDK_Data.Instance().playerInfo[i].userId).toLowerCase()) {
                            this._uiComponents[this.idToView(PDK_Data.Instance().playerInfo[i].userId)].play_yuyin(data.duration);
                        }
                    }
                }
                break;
            //GVoice 语音
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                for (var i = 0; i < PDK_Data.Instance().playerInfo.length; i++) {
                    if (PDK_Data.Instance().playerInfo[i] && PDK_Data.Instance().playerInfo[i].userId) {
                        if (data[0] == PDK_Data.Instance().playerInfo[i].userId) {
                            let head = this._uiComponents[this.idToView(PDK_Data.Instance().playerInfo[i].userId)];
                            head.yuyin_laba.node.active = true;
                            head.yuyin_laba.yuyin_size.node.active = false;
                        }
                    }
                }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                for (var i = 0; i < PDK_Data.Instance().playerInfo.length; i++) {
                    if (PDK_Data.Instance().playerInfo[i] && PDK_Data.Instance().playerInfo[i].userId) {
                        if (data[0] == PDK_Data.Instance().playerInfo[i].userId) {
                            let head = this._uiComponents[this.idToView(PDK_Data.Instance().playerInfo[i].userId)];
                            head.yuyin_laba.node.active = false;
                            head.yuyin_laba.yuyin_size.node.active = false;
                        }
                    }
                }
                break;
            case PDK_Event.PYC_NEXT:
                this.onNextGame(data);
                break;
            case RoomEvent.player_signal_state:
                this.on_player_signal_state(data[0]);
                break;
            case RoomEvent.update_player_location:
                this.on_player_location_change(data[0]);
                break;
            case PDK_Event.UPDATE_TIMEOUT:
                this.updateTimeout(data);
                break;
            case PDK_Event.UPDATE_SCORE:
                this.scoreUpdate(data);
                break;
        }
    },

    scoreUpdate(data) {
        var view = this.idToView(data[0]);
        var node = cc.find('update_score', this.node);
        if (data[1] >= 0) {
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('score').getComponent(cc.Sprite).spriteFrame = this.win_pic;
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('lbl').getComponent(cc.Label).font = this.win_font;
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('lbl').getComponent(cc.Label).string = data[1] + '';
        }
        else {
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('score').getComponent(cc.Sprite).spriteFrame = this.lose_pic;
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('lbl').getComponent(cc.Label).font = this.lose_font;
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('lbl').getComponent(cc.Label).string = Math.abs(data[1]) + '';
        }
        node.getChildByName('score' + view).getChildByName('ani').getComponent(cc.Animation).play();
        cc.find('info/gold', this.getHeadByView(view)).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(data[2]);
    },

    updateTimeout(msg) {
        let userId = msg.playUserId;
        let timeout = msg.playTimeout;
        if (cc.dd.user.id == userId) {
            cc.dd.PromptBoxUtil.show('您已多轮出牌缓慢，出牌时间缩短为' + timeout + '秒!');
        };
    },

    //更新经纬度
    sendLocationInfo() {
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
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            }
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_player_location_req, pbData, 'msg_player_location_req', true);
    },

    //信号不良
    on_player_signal_state(msg) {
        var userId = msg.userId;
        var isWeak = msg.isWeak;
        var view = this.idToView(userId);
        var cnt = msg.cnt;
        if (cnt) {
            var player = this.getPlayerById(userId);
            if (player) {
                player.netState = cnt;
            }
        }
        if (view != null) {
            if (cc.find('offline', this._uiComponents[view].headnode).active == false) {
                cc.find('weak', this._uiComponents[view].headnode).active = isWeak;
            }
        }
    },

    //位置更新
    on_player_location_change(msg) {
        var userId = msg.userId;
        var latlngInfo = msg.latlngInfo;
        var player = this.getPlayerById(userId);
        if (player) {
            player.address = msg.address;
            player.location = latlngInfo;
        }
        this.refreshGPSWarn();
        var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        if (UI) {
            UI.getComponent('user_info_view').setGpsData(PDK_Data.Instance().playerInfo);
        }
    },

    //继续返回
    onNextGame(msg) {
        if (msg.userId == cc.dd.user.id) {
            cc.find('result_ani/next', this.node).active = false;
            cc.find('result_ani', this.node).active = false;
            cc.find('reconnect_jixu', this.node).active = false;
            this.clearScene();
            for (var i = 1; i < this._uiComponents.length; i++) {
                cc.find('ready', this._uiComponents[i].headnode).opacity = 255;
            }
        }
        this.playerReady(msg);
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

    //显示关闭记牌器
    switchJipaiqi(event, data) {
        var node = event.target.getChildByName('bg');
        if (node.active == true) {
            node.active = false;
        }
        else {
            if (HallCommonData.getInstance().isMemoryCard(33))
                node.active = true;
            else
                cc.dd.PromptBoxUtil.show('请在游戏商城中购买记牌器道具.');
        }

    },

    onDissolve(msg, time) {
        this.closePopupView();
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('ddz_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = time || PDK_Data.Instance().deskInfo.dissolveTimeout;
                var playerList = PDK_Data.Instance().playerInfo;
                ui.getComponent('ddz_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    onDissolveList(msglist, time) {
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (!UI) {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var playerList = PDK_Data.Instance().playerInfo;
                for (var i = 0; i < msglist.length; i++) {
                    if (i == 0) {
                        ui.getComponent('ddz_dissolve').setStartData(time, playerList, msglist[i]);
                    }
                    else {
                        ui.getComponent('ddz_dissolve').setData(msglist[i]);
                    }
                }
            })
        }
        else {
            for (var i = 0; i < msglist.length; i++) {
                UI.getComponent('ddz_dissolve').setData(msglist[i]);
            }
        }
    },

    dissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        PDK_Data.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);
    },

    onZhanji(msg) {
        PDK_Data.Instance().isEnd = true;
        var zjNode = cc.find('zhanjitongji', this.node);
        var roomId = RoomMgr.Instance().roomId;
        var totalRound = PDK_Data.Instance().deskInfo.curCircle;
        var strTime = this.generateTimeStr(new Date());
        var strRule = '规则:' + this.getRuleString();
        if (RoomMgr.Instance().isClubRoom()) {
            if (cc.find('multiple', zjNode)) {
                cc.find('multiple', zjNode).active = false;
                // cc.find('multiple', zjNode).getComponentInChildren(cc.Label).string = RoomMgr.Instance().multiple + '倍场';
            }
        }
        else {
            if (cc.find('multiple', zjNode))
                cc.find('multiple', zjNode).active = false;
        }
        cc.find('time/room_number', zjNode).getComponent(cc.Label).string = roomId.toString();
        cc.find('time/total_round', zjNode).getComponent(cc.Label).string = '共' + totalRound.toString() + '局';
        cc.find('time/time_lbl', zjNode).getComponent(cc.Label).string = strTime;
        cc.find('rule', zjNode).getComponent(cc.Label).string = strRule;
        var playList = msg.playerInfoList;
        var bigWinScore = 0;
        for (var i = 0; i < playList.length; i++) {
            if (playList[i].lastScore > bigWinScore) {
                bigWinScore = playList[i].lastScore;
            }
        }
        for (var i = 0; i < playList.length; i++) {
            var view = this.idToView(playList[i].userId);
            var pNode = cc.find('player_layout/userNode' + view.toString(), zjNode);
            var player = this.getPlayerById(playList[i].userId);
            var nick = cc.dd.Utils.substr(pdk.filterEmoji(player.name), 0, 6);
            var headUrl = player.headUrl;
            var headsp = cc.find('headNode/head', pNode).getComponent(cc.Sprite);
            var score = playList[i].lastScore;
            this.initHead(headsp, headUrl);
            cc.find('layout/userName', pNode).getComponent(cc.Label).string = nick;
            cc.find('layout/fangzhu', pNode).active = playList[i].isCreator;
            cc.find('ID', pNode).getComponent(cc.Label).string = playList[i].userId.toString();
            cc.find('zhadanNum', pNode).getComponent(cc.Label).string = (playList[i].bombTimes || 0) + '';
            cc.find('danjuNum', pNode).getComponent(cc.Label).string = (playList[i].topScore || 0) + '';
            cc.find('winNum', pNode).getComponent(cc.Label).string = (playList[i].winTimes || 0) + '';
            cc.find('loseNum', pNode).getComponent(cc.Label).string = (playList[i].loseTimes || 0) + '';
            cc.find('baodiNum', pNode).getComponent(cc.Label).string = (playList[i].baodiTimes || 0) + ''
            cc.find('zhaniaoNum', pNode).getComponent(cc.Label).string = (playList[i].birdScore || 0) + '';
            if (score > -1) {
                cc.find('mark', pNode).color = cc.color(192, 0, 0);
                cc.find('mark', pNode).getComponent(cc.Label).string = '+' + score.toString();
            }
            else {
                cc.find('mark', pNode).color = cc.color(0, 192, 0);
                cc.find('mark', pNode).getComponent(cc.Label).string = score.toString();
            }
            if (bigWinScore > 0 && score == bigWinScore) {
                cc.find('dayingjia', pNode).active = true;
            }
            pNode.active = true;
        }
        if (PDK_Data.Instance().isDissolved) {
            zjNode.active = true;
        }
        else {
            cc.find('result_ani/taotai', this.node).active = true;
        }
    },

    closeZhanji(event, data) {
        if (data == 'show') {
            cc.find('zhanjitongji', this.node).active = true;
        }
        else {
            cc.find('zhanjitongji', this.node).active = false;
            this.backToHall();
        }
    },

    shareZhanji(event, data) {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('zhanjitongji/gongzhonghao', this.node).active = true;
            if (data == 'wechat') {
                cc.dd.native_wx.SendScreenShot(canvasNode);
            }
            else if (data == 'xianliao') {
                cc.dd.native_wx.sendXlScreenShot(canvasNode);
            }
            else {
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            }
            cc.find('zhanjitongji/gongzhonghao', this.node).active = false;
        }
    },

    initHead(headsp, headUrl) {
        // if (headUrl.indexOf('.jpg') != -1) {
        //     FortuneHallManager.getRobotIcon(headUrl, function (sprite) {
        //         headsp.spriteFrame = sprite;
        //     }.bind(this));
        // }
        // else {
        if (headUrl && headUrl != '') {
            cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
        }
        //}
    },

    on_room_leave: function (data) {
        if (data.userId == cc.dd.user.id) {
            PDK_Data.Destroy();
            cc.dd.SceneManager.enterHall();
        }
        else {
            if (data.userId == RoomMgr.Instance().roomerId) {
                cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", 'text33', null, function () {
                    // 返回大厅
                    cc.dd.SceneManager.enterHall();
                }, function () {
                });
            }
        }
    },

    popupOKcancel: function (text, callfunc) {
        // cc.dd.DialogBoxUtil.show(0, text, 'text33', 'Cancel', function () {
        //     callfunc();
        // }, function () { });

        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 1);
        }.bind(this));
    },

    updateRoomPlayerNum: function () {
        if (PDK_Data.Instance().getIsRoomFull()) {
            this.btn_invite.active = false;
            this.btn_friend_invite.active = this.btn_invite.active && RoomMgr.Instance().isClubRoom();
        }
        else {
            this.btn_invite.active = true;
            this.btn_friend_invite.active = this.btn_invite.active && RoomMgr.Instance().isClubRoom();
        }
    },

    playerReady: function (data) {
        this._uiComponents[this.idToView(data.userId)].showReady(true);
        this.setReady(data.userId);
    },
    playerOnline: function (data) {
        var view = this.idToView(data[0].userId);
        cc.find('weak', this._uiComponents[view].headnode).active = false;
        this._uiComponents[view].showOffline(!data[1]);
    },
    /**
     * 邀请微信好友
     */
    onInvaite: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        var num = 0;
        for (var i = 0; i < PDK_Data.Instance().playerInfo.length; i++) {
            if (PDK_Data.Instance().playerInfo[i] == null || PDK_Data.Instance().playerInfo[i].userId == null) {
                num++;
            }
        }
        hall_audio_mgr.com_btn_click();
        var title = "房间号:" + RoomMgr.Instance().roomId + '\n';
        var str = this.getRuleString();
        if (cc.sys.isNative|| cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            // cc.dd.native_wx.SendAppContent(RoomMgr.Instance().roomId, "【" + PDK_Data.Instance().playerInfo.length + "人斗地主】" + '  差' + num + '人', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [];
            var rules = RoomMgr.Instance()._Rule;
            wanFa.push('共' + rules.circleNum + '局');
            wanFa.push('封顶:' + (rules.maxTimes == 1 ? '不封顶' : convertTimes[rules.maxTimes].toString() + '分'));
            if (rules.limitWords == true) {
                wanFa.push('禁言');
            }
            if (rules.limitTalk == true) {
                wanFa.push('禁止语音');
            }
            if (rules.gps == true) {
                wanFa.push('GPS测距');
            }
            let playerList = PDK_Data.Instance().playerInfo;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: PDK_Data.Instance().playerInfo.length + "人跑得快",//房间名称
                content: wanFa,//游戏规则数组
                usercount: PDK_Data.Instance().playerInfo.length,//人数
                jushu: rules.circleNum,//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            if (custom == 'xianliao') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink("【" + PDK_Data.Instance().playerInfo.length + "人跑得快】" + '  差' + num + '人', title + str, url);
            }
            else
                cc.dd.native_wx.SendAppInvite(info, "【" + PDK_Data.Instance().playerInfo.length + "人跑得快】" + '  差' + num + '人', title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
        cc.log("邀请好友：", str);
    },

    /**
     * 规则字符串
     */
    getRuleString: function () {
        var str = '';
        var rules = RoomMgr.Instance()._Rule;
        str += '共' + rules.circleNum + '局';
        str += '  封顶:' + (rules.maxTimes == 0 ? '不封顶' : convertTimes[rules.maxTimes].toString() + '分');
        if (rules.limitWords == true) {
            str += '  禁言';
        }
        if (rules.limitTalk == true) {
            str += '  禁止语音';
        }
        if (rules.gps == true) {
            str += '  GPS测距';
        }
        return str;
    },

    /**
     * 准备
     */
    onReady: function () {
        hall_audio_mgr.com_btn_click();
        if (PDK_Data.Instance().isGameStart) {//游戏内准备
            // var player = playerMgr.Instance().getPlayer(dd.user.id);
            // player.reqReady();
        } else {
            var msg = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(RoomMgr.Instance().gameId);
            gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);
        }
    },

    /**
     * 设置准备
     */
    setReady: function (readyId) {
        var selfId = cc.dd.user.id;
        if (readyId === selfId) {
            this.btn_read.node.active = false;
            this.btn_start.node.active = false;
        }
    },

    /**
     * 邀请好友按钮初始化
     */
    initInviteButton: function () {
        var isRoomer = RoomMgr.Instance().isRoomer(cc.dd.user.id);
        this.btn_start.node.active = isRoomer;
        this.btn_read.node.active = !isRoomer;
        var curJushu = PDK_Data.Instance().curJushu ? PDK_Data.Instance().curJushu : 1;
        if (curJushu > 1) {
            this.btn_invite.active = false;
            this.btn_friend_invite.active = this.btn_invite.active && RoomMgr.Instance().isClubRoom();
        }
        if (PDK_Data.Instance().getIsRoomFull()) {
            this.btn_invite.active = false;
            this.btn_friend_invite.active = this.btn_invite.active && RoomMgr.Instance().isClubRoom();
        }
    },

    /**
     * 初始化准备按钮
     */
    initReady: function () {
        if (!PDK_Data.Instance().isGameStart) {
            var player1 = PDK_Data.Instance().getPlayer(cc.dd.user.id);
            if (player1 != null) {
                if (player1.isReady == 1 || player1.isReady == true) {
                    this.setReady(cc.dd.user.id);
                }
            }
        }
    },

    //打完一局之后清理场景
    clearScene: function () {
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].resetUI();
        }
    },

    /**
     * 播放匹配动画
    */
    playMatchAnim() {
        this.anim_match.node.active = true;
        this.anim_match.play();
    },

    /**
     * 停止匹配动画
     */
    stopMatchAnim() {
        this.anim_match.node.active = false;
        this.anim_match.stop();
    },

    //重连时游戏已结束
    reconnectHall: function () {
        var result_node = cc.find('Canvas/root/result_ani');
        var end_node = cc.find('Canvas/root/zhanjitongji');
        if (result_node.active == true && result_node.getChildByName('taotai').active == true) {
            return;
        }
        if (end_node.active == true) {
            return;
        }
        this.backToHall();
    },


    idToView: function (id) {
        return PDK_Data.Instance().idToView(id);
    },

    initRoomInfo: function () {
        var Rule = RoomMgr.Instance()._Rule;
        this.room_num.string = RoomMgr.Instance().roomId.toString();
        this.zong_ju.string = '/' + Rule.circleNum.toString() + '局';

        var detialNode = cc.find('room_info/detail', this.node);
        cc.find('room_num/lbl', detialNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
        cc.find('round_num/lbl', detialNode).getComponent(cc.Label).string = Rule.circleNum.toString();
        cc.find('fengding_num/lbl', detialNode).getComponent(cc.Label).string = Rule.maxTimes == 1 ? '不封顶' : convertTimes[Rule.maxTimes] + '分';
        cc.find('layout/zhangshu', detialNode).getComponent(cc.Label).string = Rule.handPokerNum + '张';
        cc.find('layout/must', detialNode).active = Rule.isMustBeenPlay;
        cc.find('op_chupai/must', this._uiComponents[0].node).active = Rule.isMustBeenPlay;
        cc.find('layout/xianchu', detialNode).getComponent(cc.Label).string = Rule.firstPlayRole == 1 ? '黑桃3先出' : '庄家先出';
        cc.find('layout/baodi', detialNode).active = Rule.isBaoDi;
        cc.find('layout/zhadan', detialNode).active = !Rule.isChaiBomb;
        cc.find('layout/si2', detialNode).active = Rule.isFourTake2;
        cc.find('layout/si3', detialNode).active = Rule.isFourTake3;
        cc.find('layout/aaa', detialNode).active = Rule.isBombOfAaa;
        cc.find('layout/erren', detialNode).active = Rule.roomRoleNum == 2;
        cc.find('layout/zhaniao', detialNode).getComponent(cc.Label).string = ['', '不扎鸟', '扎鸟翻倍', '扎鸟5分', '扎鸟10分'][Rule.zhaNiao];
        cc.find('layout/gz', detialNode).getComponent(cc.Label).string = Rule.firstPlaySpade3 == 1 ? '首局先出黑桃3' : '首局无要求';
        cc.find('layout/gn', detialNode).active = Rule.isShowLeftCardsNum ? '显示牌数' : '不显示牌数';
        cc.find('layout/3chuwan', detialNode).active = Rule.isFplayThreeTake;
        cc.find('layout/3jiewan', detialNode).active = Rule.isSplayThreeTake;
        cc.find('layout/feijichuwan', detialNode).active = Rule.isFplayThreeLineTake;
        cc.find('layout/feijijiewan', detialNode).active = Rule.isSplayThreeLineTake;
        cc.find('layout/tuoguan', detialNode).getComponent(cc.Label).string = ['', '15秒超时', '30秒超时', '60秒超时', '90秒超时', '无超时'][Rule.playTimeout];
        cc.find('layout/voice', detialNode).active = Rule.limitTalk;
        cc.find('layout/gps', detialNode).active = Rule.gps;

        //玩法名称+人数+圈数+封顶+缺几人
        if (this.btn_friend_invite) {
            let rule = '跑得快' + ' ' + Rule.circleNum.toString() + '局';
            this.btn_friend_invite.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule);
        }

        this.schedule(this.switchTimeRound, 10);
    },

    initPlayer: function () {
        var playerInfo = PDK_Data.Instance().playerInfo;
        for (var i = 0; i < playerInfo.length; i++) {
            if (playerInfo[i]) {
                this._uiComponents[this.idToView(playerInfo[i].userId)].initPlayerInfo(playerInfo[i]);
            }
        }
        this.refreshGPSWarn();
    },
    playerEnter: function (player) {
        this._uiComponents[this.idToView(player.userId)].initPlayerInfo(player);
        this.refreshGPSWarn();
    },
    playerExit: function (view) {
        this._uiComponents[view].resetUI();
        this._uiComponents[view].showUI(false);
        this.refreshGPSWarn();
    },
    refreshGPSWarn: function () {
        if (RoomMgr.Instance()._Rule.gps) {
            var gpsList = [];
            var playerInfo = PDK_Data.Instance().playerInfo;
            for (var i = 0; i < playerInfo.length; i++) {
                cc.find('gps_bj', this._uiComponents[i].headnode).active = false;
                if (playerInfo[i] && playerInfo[i].location) {
                    gpsList.push({ userId: playerInfo[i].userId, location: playerInfo[i].location });
                }
            }
            for (var i = 0; i < gpsList.length - 1; i++) {
                for (var j = i; j < gpsList.length - 1; j++) {
                    if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
                        cc.find('gps_bj', this._uiComponents[this.idToView(gpsList[j].userId)].headnode).active = true;
                        cc.find('gps_bj', this._uiComponents[this.idToView(gpsList[j + 1].userId)].headnode).active = true;
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
            cc.log('gps距离:++++++' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        }
    },

    closePopupView: function () {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
    },

    //初始化房间
    initGame: function () {
        var playerInfo = PDK_Data.Instance().playerInfo;
        if (!playerInfo) {
            cc.error('playerInfo is null');
            return;
        }
        for (var i = 0; i < playerInfo.length; i++) {
            //this._uiComponents[this.idToView(playerInfo[i].userId)].initPlayerInfo(playerInfo[i]);
            if (playerInfo[i] && playerInfo[i].userId)
                this._uiComponents[this.idToView(playerInfo[i].userId)].resetUI();
        }
        this.hideResult();
        this.onGameOpening();
    },

    onGameOpening: function () {
        PDK_Data.Instance().setIsStart(true);
        PDK_Data.Instance().setIsEnd(false);
        this.JipaiCards = [];
        this.refreshJipaiqi();
        this.room_num.node.parent.active = false;
        this.btn_invite.active = false;
        this.btn_friend_invite.active = false;
        var curCircle = PDK_Data.Instance().deskInfo.curCircle;
        this.dangqian_ju.string = curCircle.toString();
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].showReady(false);
        }
    },

    //初始化聊天
    initChat: function () {
        var cfg = null;
        var parent = cc.find('chat/panel/text/view/content', this.node);
        parent.removeAllChildren(true);
        if (cc.dd.user.sex == 1) {
            cfg = pdk_chat_cfg.Man;
        }
        else {
            cfg = pdk_chat_cfg.Woman;
        }
        for (var i = 0; i < cfg.length; i++) {
            var node = cc.instantiate(this.chat_item);
            node.tagname = i;
            node.getComponentInChildren(cc.Label).string = cfg[i];
            node.on('click', this.onQuickChatClick, this);
            parent.addChild(node);
        }
    },

    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('pdk_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
                cc.sys.localStorage.setItem('pdk_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('pdk_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
        }
        var bg_item = cc.find('setting/bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('setting/bg/content/zhuomian/toggles/tog', this.node);
        this.zhuobu.forEach(element => {
            var bg = cc.instantiate(bg_item);
            bg.getComponent(cc.Sprite).spriteFrame = element;
            bg.active = true;
            bg_item.parent.addChild(bg);
            var tog = cc.instantiate(tog_item);
            tog.active = true;
            tog_item.parent.addChild(tog);
        });
        this.nextBgBtn = cc.find('setting/bg/content/next_BG', this.node).getComponent(cc.Button);
        this.preBgBtn = cc.find('setting/bg/content/pre_BG', this.node).getComponent(cc.Button);
        this.idxZm = idx;
        this.contentZm = bg_item.parent;
        this.toggleZm = tog_item.parent;
        this.toggleZm.children[idx + 1].getChildByName('lv').active = true;
        this.zmWidth = bg_item.width;
        this.zmSpacingX = this.contentZm.getComponent(cc.Layout).spacingX;
        this.contentZm.x = - idx * (this.zmSpacingX + this.zmWidth);
        this.freshNextPreBtn();
    },
    freshNextPreBtn() {
        this.nextBgBtn.interactable = this.idxZm < (this.zhuobu.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },
    nextZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm + 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('pdk_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },
    preZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm - 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('pdk_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },

    //初始化音乐音效设置
    initMusicAndSound: function () {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('setting/bg/content/music/mask', this.node).width = 0;
            cc.find('setting/bg/content/music/tao', this.node).x = -50;
            cc.find('setting/bg/content/music/tao/b', this.node).active = true;
            cc.find('setting/bg/content/music/tao/y', this.node).active = false;
            cc.find('setting/bg/content/music/label_kai', this.node).active = false;
            cc.find('setting/bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onMusic(pdk_audio_cfg.GAME_MUSIC);
        }
        if (!sound) {
            cc.find('setting/bg/content/sound/mask', this.node).width = 0;
            cc.find('setting/bg/content/sound/tao', this.node).x = -50;
            cc.find('setting/bg/content/sound/tao/b', this.node).active = true;
            cc.find('setting/bg/content/sound/tao/y', this.node).active = false;
            cc.find('setting/bg/content/sound/label_kai', this.node).active = false;
            cc.find('setting/bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    //发牌
    handPoker: function (data) {
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].showReady(false);
        }
        var cards = data.handPokersList;
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].playSendCards(cards, null);
        }
    },

    //更新状态
    updateStatus: function (data) {
        var status = data.deskStatus;
        var id = data.curPlayer;
        this.gameStatus = status;
        switch (status) {
            case roomStatus.STATE_REFRESH: //刷新
                this.initGame();
                break;
            case roomStatus.STATE_PLAYING://出牌
                var playTime = PDK_Data.Instance().getPlayerTimeout(id);
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        PDK_Data.Instance().lastCards = [];
                        PDK_Data.Instance().lastPlayer = -1;
                        this.curPlayer = i;
                        this._uiComponents[i].showPlaying(playTime);
                        this._uiComponents[i].showBanker(true);
                    }
                }
                break;
        }
    },

    /**
     * 出牌消息
     */
    playPoker: function (data) {
        if (!data.isSucess) {
            cc.dd.PromptBoxUtil.show('出牌不符合规则');
            return;
        }
        var id = data.userId;
        var pokers = data.pokersList;
        for (var i = 0; i < pokers.length; i++) {
            this.JipaiCards.push(pokers[i]);
        }
        this.refreshJipaiqi();
        // if (test_version) {
        //     if (pokers.length > 0) {
        //         this.subMingpaiList(id, pokers);
        //     }
        // }
        this.outCardSound(id, pokers);
        var remainNum = this._uiComponents[this.idToView(id)].remainCard;
        if (pokers.length > 0 && remainNum - pokers.length <= 2 && remainNum - pokers.length > 0) {
            var sex = this.getPlayerById(id).sex;
            this.scheduleOnce(function () { this.playSound(sex, soundType.REMAIN, remainNum - pokers.length); }.bind(this), 0.2);//延迟播放报警
        }
        if (pokers.length > 0) {
            PDK_Data.Instance().lastCards = pokers;
            PDK_Data.Instance().lastPlayer = this.idToView(id);
        }
        this._uiComponents[this.idToView(id)].showOutCard(pokers, PDK_Data.Instance().lordId == id);
        if (this._uiComponents[this.idToView(id)].getHandCardNum() != 0) {
            var nextPlayer = this.getNextPlayer(this.idToView(id));
            this.curPlayer = nextPlayer;
            if (this.curPlayer == PDK_Data.Instance().lastPlayer) {
                PDK_Data.Instance().lastCards = [];
            }
            var playTime = PDK_Data.Instance().getPlayerTimeoutByView(nextPlayer);
            this._uiComponents[nextPlayer].showPlaying(playTime);
        }
    },

    //TODO:
    refreshJipaiqi() {
        // var counts = pdk.countRepeatCards(this.JipaiCards);
        // for (var i = 3; i < 17; i++) {
        //     var node = cc.find('top/dipai_info/jipaiqi/bg/' + i + '_num', this.node);
        //     if (node) {
        //         node.getComponent(cc.Label).string = counts[i].toString();
        //     }
        // }
        // var jokerda = 0, jokerxiao = 0;
        // for (var i = 0; i < this.JipaiCards.length; i++) {
        //     if (this.JipaiCards[i] == 172)
        //         jokerda = 1;
        //     if (this.JipaiCards[i] == 171)
        //         jokerxiao = 1;
        // }
        // cc.find('top/dipai_info/jipaiqi/bg/172_num', this.node).getComponent(cc.Label).string = jokerda.toString();
        // cc.find('top/dipai_info/jipaiqi/bg/171_num', this.node).getComponent(cc.Label).string = jokerxiao.toString();
    },

    //出牌音效
    outCardSound: function (id, pokers) {
        if (!this.getPlayerById(id))
            return;
        var sex = this.getPlayerById(id).sex;
        if (pokers.length > 0) {
            var analysis = pdk.analysisCards(pokers);
            if (analysis.type == 3) {
                var aaa = false;
                pokers.forEach(function (card) {
                    if (parseInt(card / 10) == 14) {
                        aaa = true;
                    }
                });
                if (aaa && RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.isBombOfAaa) {
                    this.playSound(sex, soundType.BOMB, null);
                    return;
                }
            }
            if (analysis.type == 0 && analysis.stype > 0) {//飞机少带
                if (analysis.stype == 1) {
                    this.playSound(sex, soundType.SAN, analysis.index);
                }
                else if (analysis.stype == 2) {
                    this.playSound(sex, soundType.AIRPLANE, null);
                }
                else {
                    this.playSound(sex, soundType.FOUR_SAN, null);
                }
                return;
            }
            if (PDK_Data.Instance().lastPlayer == this.idToView(id) || !PDK_Data.Instance().lastCards || PDK_Data.Instance().lastCards.length == 0) {
                switch (analysis.type) {
                    case 1://单牌
                        if (analysis.index == 17) {
                            this.playSound(sex, soundType.DAN, pokers[0]);
                        }
                        else {
                            this.playSound(sex, soundType.DAN, analysis.index);
                        }
                        break;
                    case 2://对子
                        this.playSound(sex, soundType.DUI, analysis.index);
                        break;
                    case 3://三张
                        this.playSound(sex, soundType.SAN, analysis.index);
                        break;
                    case 4://三带
                        if (pokers.length == 4) {
                            this.playSound(sex, soundType.THREE_YI, null);
                        }
                        else {
                            this.playSound(sex, soundType.THREE_DUI, null);
                        }
                        break;
                    case 5://顺子
                        if (analysis.index != 14) {
                            this.playSound(sex, soundType.SHUNZI, null);
                        }
                        break;
                    case 6://连对
                        this.playSound(sex, soundType.LIANDUI, null);
                        break;
                    case 7://飞机不带
                    case 8://飞机带一或对
                        this.playSound(sex, soundType.AIRPLANE, null);
                        break;
                    case 9://四带
                        if (pokers.length == 6) {
                            this.playSound(sex, soundType.FOUR_ER, null);
                        }
                        else {
                            this.playSound(sex, soundType.FOUR_DUI, null);
                        }
                        break;
                    case 10://炸弹
                        this.playSound(sex, soundType.BOMB, null);
                        break;
                    case 11://王炸
                        this.playSound(sex, soundType.ROCKET, null);
                        break;
                }
            }
            else {
                var analysis = pdk.analysisCards(pokers);
                var lastanalysis = pdk.analysisCards(PDK_Data.Instance().lastCards);
                var typeSame = analysis.type == lastanalysis.type;
                switch (analysis.type) {
                    case 1://单牌
                        if (analysis.index == 17) {
                            this.playSound(sex, soundType.DAN, pokers[0]);
                        }
                        else {
                            this.playSound(sex, soundType.DAN, analysis.index);
                        }
                        break;
                    case 2://对子
                        this.playSound(sex, soundType.DUI, analysis.index);
                        break;
                    case 3://三张
                        this.playSound(sex, soundType.SAN, analysis.index);
                        break;
                    case 4://三带
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            if (pokers.length == 4) {
                                this.playSound(sex, soundType.THREE_YI, null);
                            }
                            else {
                                this.playSound(sex, soundType.THREE_DUI, null);
                            }
                        }
                        break;
                    case 5://顺子
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.SHUNZI, null);
                        }
                        break;
                    case 6://连对
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.LIANDUI, null);
                        }
                        break;
                    case 7://飞机不带
                    case 8://飞机带一或对
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.AIRPLANE, null);
                        }
                        break;
                    case 9://四带
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            if (pokers.length == 6) {
                                this.playSound(sex, soundType.FOUR_ER, null);
                            }
                            else {
                                this.playSound(sex, soundType.FOUR_DUI, null);
                            }
                        }
                        break;
                    case 10://炸弹
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.BOMB, null);
                        }
                        break;
                    case 11://王炸
                        this.playSound(sex, soundType.ROCKET, null);
                        break;
                }
            }
        }
        else {
            this.playSound(sex, soundType.PASS, null);
        }
    },

    /**
     * 托管消息 
     */
    autoRet: function (data) {
        var id = data.userId;
        var isAuto = data.isAuto;
        this._uiComponents[this.idToView(id)].showAuto(isAuto);
    },

    /**
     * 单局结算 
     */
    showResult: function (data) {
        if (PDK_Data.Instance().deskInfo.curCircle == RoomMgr.Instance()._Rule.circleNum) {
            cc.find('result_ani/next', this.node).active = false;
        }
        else {
            for (var i = 1; i < this._uiComponents.length; i++) {
                cc.find('ready', this._uiComponents[i].headnode).opacity = 0;
            }
            cc.find('result_ani/next', this.node).active = true;
            this.nextGameTime = PDK_Data.Instance().getPlayerTimeout() || 15;
            var timer = function () {
                this.nextGameTime--;
                if (this.nextGameTime < 0) {
                    this.nextGameTime = 0;
                    this.unschedule(timer);
                }
                cc.find('result_ani/next/time', this.node).getComponent(cc.Label).string = this.nextGameTime.toString();
            }.bind(this);
            this.schedule(timer, 1);
        }
        cc.find('setting', this.node).active = false;
        for (var i = 0; i < this._uiComponents.length; i++) {
            //this._uiComponents[i].showAuto(false);
            cc.find('op', this._uiComponents[i].node).active = false;
        }

        var layouts = [];
        layouts.push(cc.find('result_ani/score0/layout', this.node));
        layouts.push(cc.find('result_ani/score1/layout', this.node));
        layouts.push(cc.find('result_ani/score2/layout', this.node));
        for (var i = 0; i < layouts.length; i++) {
            for (var j = 0; j < layouts[i].childrenCount; j++) {
                layouts[i].children[j].active = false;
            }
        }
        var nodes = [];
        nodes.push(cc.find('result_ani/score0/totalwin', this.node));
        nodes.push(cc.find('result_ani/score0/totallose', this.node));
        nodes.push(cc.find('result_ani/score0/baodi', this.node));
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].active = false;
        }

        var changeList = data.changeListList.sort(function (a, b) { return PDK_Data.Instance().idToView(a.userId) - PDK_Data.Instance().idToView(b.userId) });
        var selfScore = 0;
        var selfLeftNum = 1;
        for (var i = 0; i < changeList.length; i++) {
            var view = this.idToView(changeList[i].userId);
            var cScore = changeList[i].changeScore;
            if (view == 0) {
                selfScore = cScore;
                selfLeftNum = changeList[i].leftHandPokerList.length;
                if (changeList[i].detailList.length == 0 && cScore == 0) {//保底
                    cc.find('result_ani/score0/baodi', this.node).active = true;
                }
                else if (cScore > 0) {
                    cc.find('result_ani/score0/totalwin/score', this.node).getComponent(cc.Label).string = cScore + '';
                    cc.find('result_ani/score0/totalwin', this.node).active = true;
                }
                else {
                    cc.find('result_ani/score0/totallose/score', this.node).getComponent(cc.Label).string = Math.abs(cScore) + '';
                    cc.find('result_ani/score0/totallose', this.node).active = true;
                }
            }
            else {
                if (changeList[i].detailList.length == 0) {
                    cc.find('result_ani/score' + view + '/layout/baodi', this.node).active = true;
                }
                else {
                    if (cScore > 0) {
                        cc.find('result_ani/score' + view + '/layout/totalwin/score', this.node).getComponent(cc.Label).string = cScore + '';
                        cc.find('result_ani/score' + view + '/layout/totalwin', this.node).active = true;
                    }
                }
            }
            for (var j = 0; j < changeList[i].detailList.length; j++) {
                var detail = changeList[i].detailList[j];
                switch (detail.reason) {
                    case 1://手牌输赢
                        if (detail.score < 0) {
                            cc.find('result_ani/score' + view + '/layout/leftcard/num', this.node).getComponent(cc.Label).string = changeList[i].leftHandPokerList.length + '';
                            cc.find('result_ani/score' + view + '/layout/leftcard/score', this.node).getComponent(cc.Label).string = Math.abs(detail.score) + '';
                            cc.find('result_ani/score' + view + '/layout/leftcard', this.node).active = true;
                        }
                        break;
                    case 2://扎鸟输赢
                        if (detail.score >= 0) {
                            cc.find('result_ani/score' + view + '/layout/zhaniaowin/score', this.node).getComponent(cc.Label).string = Math.abs(detail.score) + '';
                            cc.find('result_ani/score' + view + '/layout/zhaniaowin', this.node).active = true;
                        }
                        else {
                            cc.find('result_ani/score' + view + '/layout/zhaniaolose/score', this.node).getComponent(cc.Label).string = Math.abs(detail.score) + '';
                            cc.find('result_ani/score' + view + '/layout/zhaniaolose', this.node).active = true;
                        }
                        break;
                    case 3://炸弹输赢
                        if (detail.score >= 0) {
                            cc.find('result_ani/score' + view + '/layout/zhadanwin/score', this.node).getComponent(cc.Label).string = Math.abs(detail.score) + '';
                            cc.find('result_ani/score' + view + '/layout/zhadanwin', this.node).active = true;
                        }
                        else {
                            cc.find('result_ani/score' + view + '/layout/zhadanlose/score', this.node).getComponent(cc.Label).string = Math.abs(detail.score) + '';
                            cc.find('result_ani/score' + view + '/layout/zhadanlose', this.node).active = true;
                        }
                        break;
                    case 4://包赔
                        if (detail.score < 0) {
                            cc.find('result_ani/score' + view + '/layout/baopei/score', this.node).getComponent(cc.Label).string = Math.abs(detail.score) + '';
                            cc.find('result_ani/score' + view + '/layout/baopei', this.node).active = true;
                        }
                        else {
                            cc.find('result_ani/score' + view + '/layout/beibaopei', this.node).active = true;
                        }
                        break;
                }
            }
        }

        this.scheduleOnce(function () {
            //显示手牌
            for (var i = 0; i < data.changeListList.length; i++) {
                if (this.idToView(data.changeListList[i].userId) != 0) {
                    if (data.changeListList[i].leftHandPokerList.length > 0) {
                        this._uiComponents[this.idToView(data.changeListList[i].userId)].showOutCard(data.changeListList[i].leftHandPokerList, PDK_Data.Instance().lordId == data.changeListList[i].userId, true);
                    }
                }
            }
            //修改玩家分数
            for (var i = 0; i < data.changeListList.length; i++) {
                for (var j = 0; j < PDK_Data.Instance().playerInfo.length; j++) {
                    if (!PDK_Data.Instance().playerInfo[j])
                        continue;
                    if (data.changeListList[i].userId == PDK_Data.Instance().playerInfo[j].userId) {
                        PDK_Data.Instance().playerInfo[j].score += data.changeListList[i].changeScore;
                        cc.find('info/gold', this.getHeadByView(this.idToView(data.changeListList[i].userId))).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(PDK_Data.Instance().playerInfo[j].score);
                        break;
                    }
                }
            }
        }.bind(this), 1);

        this.scheduleOnce(function () {
            var node = cc.find('Canvas/root/result_ani');
            node.getComponent(cc.Animation).play();
            if (selfScore > 0) {
                var win_spine = cc.find('result_ani/win_spine', this.node).getComponent(sp.Skeleton);
                win_spine.setCompleteListener((trackEntry, loopCount) => {
                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                    if (name === 'CC') {
                        win_spine.setAnimation(0, 'ninyingle', true);
                    }
                });
                win_spine.enabled = true;
                win_spine.setAnimation(0, 'CC', false);
            }
            else if (selfScore < 0) {
                var lose_spine = cc.find('result_ani/lose_spine', this.node).getComponent(sp.Skeleton);
                lose_spine.setCompleteListener((trackEntry, loopCount) => {
                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                    if (name === 'CC') {
                        lose_spine.setAnimation(0, 'henyihan', true);
                    }
                });
                lose_spine.enabled = true;
                lose_spine.setAnimation(0, 'CC', false);
            }
            else {
                if (selfLeftNum == 0) {
                    var win_spine = cc.find('result_ani/win_spine', this.node).getComponent(sp.Skeleton);
                    win_spine.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                        if (name === 'CC') {
                            win_spine.setAnimation(0, 'ninyingle', true);
                        }
                    });
                    win_spine.enabled = true;
                    win_spine.setAnimation(0, 'CC', false);
                }
                else {
                    var baodi_spine = cc.find('result_ani/baodi_spine', this.node).getComponent(sp.Skeleton);
                    baodi_spine.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                        if (name === 'CC') {
                            baodi_spine.setAnimation(0, 'ninyingle', true);
                        }
                    });
                    baodi_spine.enabled = true;
                    baodi_spine.setAnimation(0, 'CC', false);
                }
            }
            this.scheduleOnce(function () {
                node.active = true;
            }, 0.05);
        }.bind(this), 1.5);
    },
    hideResult: function () {
        var win_spine = cc.find('result_ani/win_spine', this.node).getComponent(sp.Skeleton);
        var lose_spine = cc.find('result_ani/lose_spine', this.node).getComponent(sp.Skeleton);
        var baodi_spine = cc.find('result_ani/baodi_spine', this.node).getComponent(sp.Skeleton);
        win_spine.clearTrack(0);
        lose_spine.clearTrack(0);
        baodi_spine.clearTrack(0);
        win_spine.enabled = false;
        lose_spine.enabled = false;
        baodi_spine.enabled = false;
        cc.find('Canvas/root/result_ani').active = false;
    },

    /**
     * 断线重连
     */
    reconnect: function (data) {
        for (var i = 0; i < this._uiComponents.length; i++) {
            cc.find('gps_bj', this._uiComponents[i].headnode).active = false;
        }
        this.initGame();
        this.initPlayer();
        this.JipaiCards = data.playedPokersList || [];
        this.refreshJipaiqi();
        this.btn_read.node.active = false;
        this.btn_start.node.active = false;
        for (var i = 0; i < this._uiComponents.length; i++) {
            if (i == 0) {
                this._uiComponents[i].showOperation(-1);
            }
            else {
                this._uiComponents[i].hideTimer();
            }
        }
        var playerInfo = PDK_Data.Instance().playerInfo;
        for (var i = 0; i < playerInfo.length; i++) {
            if (!playerInfo[i])
                continue;
            var isAuto = playerInfo[i].isAuto;
            var isOffline = playerInfo[i].state != 1;
            var isSwitch = playerInfo[i].isSwitch;
            var isWeak = playerInfo[i].netState < 3;
            cc.find('tuoguan', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isAuto || false;
            cc.find('offline', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isOffline || isSwitch || false;
            cc.find('weak', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isWeak;
            if (this.idToView(playerInfo[i].userId) == 0) {
                cc.find('tuoguan_node', this._uiComponents[0].node).active = isAuto || false;
            }
        }
        this.gameStatus = PDK_Data.Instance().deskInfo.deskStatus;
        switch (PDK_Data.Instance().deskInfo.deskStatus) {
            case roomStatus.STATE_PREPARE:
                var playerInfo = PDK_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (!playerInfo[i])
                        continue;
                    if (playerInfo[i].isPrepared) {
                        this.playerReady({ userId: playerInfo[i].userId });
                    }
                    if (playerInfo[i].userId == cc.dd.user.id) {
                        if (!playerInfo[i].isPrepared) {
                            cc.find('reconnect_jixu', this.node).active = true;
                        }
                    }
                }
                break;
            case roomStatus.STATE_PLAYING:
                var curTime = data.timeout;
                var playTime = PDK_Data.Instance().getPlayerTimeout(data.curPlayer);
                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = PDK_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (!playerInfo[i])
                        continue;
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }
                var recentPlay = data.recentPlayList;
                if (recentPlay[0]) {
                    if (recentPlay[0].pokersList.length > 0) {
                        PDK_Data.Instance().lastCards = recentPlay[0].pokersList;
                        PDK_Data.Instance().lastPlayer = this.idToView(recentPlay[0].userId);
                    }
                    else if (recentPlay[1] && recentPlay[1].pokersList.length > 0) {
                        PDK_Data.Instance().lastCards = recentPlay[1].pokersList;
                        PDK_Data.Instance().lastPlayer = this.idToView(recentPlay[1].userId);
                    }
                    else {
                        PDK_Data.Instance().lastCards = [];
                    }
                    for (var i = 0; i < recentPlay.length; i++) {
                        this._uiComponents[this.idToView(recentPlay[i].userId)].displayOutCard(recentPlay[i].pokersList);
                    }
                }
                else {
                    PDK_Data.Instance().lastCards = [];
                }
                this.curPlayer = this.idToView(data.curPlayer);
                this._uiComponents[this.curPlayer].showPlaying(playTime, curTime);

                var zhuangUid = data.zhuangUid;
                var zhuangView = this.idToView(zhuangUid);
                if (zhuangView != null) {
                    cc.find('banker', this._uiComponents[zhuangView].headnode).active = true;
                }
                break;
        }
        if (data.dissolveInfoList && data.dissolveInfoList.length) {
            var distime = data.timeout;
            this.onDissolveList(data.dissolveInfoList, distime);
        }
        if (PDK_Data.Instance().reconnectResult) {
            this.showResult(PDK_Data.Instance().reconnectResult);
            PDK_Data.Instance().reconnectResult = null;
        }
        if (PDK_Data.Instance().reconnectZhanji) {
            this.onZhanji(PDK_Data.Instance().reconnectZhanji);
            PDK_Data.Instance().reconnectZhanji = null;
        }
    },

    /**
     * 初始化UI脚本
     */
    initUiScript: function (bool) {
        this._uiComponents = [];
        if (bool) {
            this._uiComponents.push(this.node.getComponentInChildren('pdk_pyc_down_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('pdk_pyc_right_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('pdk_pyc_left_ui'));
        }
    },

    //播放炸弹特效
    playBombAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('bomb_camera_' + str);
        var bone = cc.find('bomb_ani/ddz_zhadan_ske_' + str, this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('zha', 1);
            var finish = function () {
                cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
                bone.enabled = false;
            }
            cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
            cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).play();
        }.bind(this);
        bone.playAnimation('lujing' + str, 1);
        bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    //播放火箭特效
    playRocketAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('rocket_camera_' + str);
        var bone = cc.find('rocket_ani/huojian01_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            //bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('huojianzha', 1);
            bone.scheduleOnce(function () {
                cc.find('dilie', bone.node.parent).getComponent(cc.Animation).play();
                bone.enabled = false;
            }.bind(this), 1);
        }.bind(this);
        bone.playAnimation('huojianfei' + str, 1);
        this.scheduleOnce(playFinish, 0.5);
        //bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    //销毁骨骼动画
    clearBones: function () {
        if (this.springNode) {
            this.springNode.destroy();
            this.springNode = null;
        }
        if (this.rocketNode) {
            this.rocketNode.destroy();
            this.rocketNode = null;
        }
        if (this.bombNode) {
            this.bombNode.destroy();
            this.bombNode = null;
        }
    },

    //播放飞机特效
    playAirplaneAnimation: function () {
        cc.find('Canvas/root/effect_airplane').getComponent(cc.Animation).play();
        AudioManager.getInstance().playSound(pdk_audio_cfg.EFFECT.FEIJI, false);
    },

    //获取下一个玩家
    getNextPlayer: function (curPlayer) {
        var next = curPlayer + 1 < 3 ? curPlayer + 1 : 0;
        if (!this.getPlayerByView(next) && RoomMgr.Instance()._Rule.roomRoleNum == 2) {
            return this.getNextPlayer(next);
        }
        return next;
    },

    //玩家掉线
    playerOffline: function (data) {
        var userId = data.userId;
        var isOffline = data.isOffline;
        this._uiComponents[this.idToView(userId)].showOffline(isOffline);
    },

    //开始按钮
    onMatch(event, target) {
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        var gameType = PDK_Data.Instance().getGameId();
        var roomId = PDK_Data.Instance().getRoomId();
        msg.setGameType(gameType);
        msg.setRoomId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    //btns点击
    onButtonClick: function (event, data) {
        switch (data) {
            case 'menu'://菜单
                hall_audio_mgr.com_btn_click();
                if (!this.menu_show) {
                    cc.find('menu', this.node).active = true;
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    if (ani._nameToState[ani._defaultClip.name]) {
                        ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                    }
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = true;
                }
                else {
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = null;
                }
                break;
            case 'tuoguan'://托管
                hall_audio_mgr.com_btn_click();
                this._uiComponents[0].sendTuoGuan();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'setting'://设置
                hall_audio_mgr.com_btn_click();
                cc.find('setting', this.node).active = true;
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'chat'://聊天
                var limitWords = null;
                if (!PDK_Data.Instance().getIsStart()) {
                    limitWords = RoomMgr.Instance()._Rule.limitWords;
                }
                else {
                    limitWords = PDK_Data.Instance().deskInfo.deskRule.limitWords;
                }
                if (limitWords) {
                    if (!this.wordsCD) {
                        hall_audio_mgr.com_btn_click();
                        cc.dd.PromptBoxUtil.show('此房间不能发言');
                        this.wordsCD = true;
                        this.scheduleOnce(function () {
                            this.wordsCD = false;
                        }.bind(this), 2);
                    }
                }
                else {
                    hall_audio_mgr.com_btn_click();
                    if (!this.chatAni) {
                        cc.find('chat', this.node).getComponent(cc.Animation).play('chat_in');
                    }
                }
                break;
            case 'vip'://vip介绍
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP);
                break;
            case 'exit'://退出
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                var content = "";
                var callfunc = null;
                //已经结束
                if (PDK_Data.Instance().isEnd == true) {
                    this.backToHall();
                    return;
                }
                // 已经开始
                if (PDK_Data.Instance().getIsStart()) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
                    callfunc = this.reqSponsorDissolveRoom;
                }
                else {
                    if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                        content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                        callfunc = this.leave_game_req;
                    } else {
                        content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                        callfunc = this.leave_game_req;
                    }
                }
                this.popupOKcancel(content, callfunc);
                break;
            case 'rule'://规则
                if (cc.find('room_info/detail', this.node).active == true) {
                    cc.find('room_info/detail', this.node).active = false;
                }
                else {
                    cc.find('room_info/detail', this.node).active = true;
                }
                break;
            case 'next'://继续
                hall_audio_mgr.com_btn_click();
                const req = new cc.pb.room_mgr.room_prepare_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
                    'room_prepare_req', 'no');
                break;
        }
    },


    leave_game_req: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //发起解散
    reqSponsorDissolveRoom: function () {
        var msg = new cc.pb.room_mgr.room_dissolve_agree_req();
        msg.setIsAgree(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, msg, "room_dissolve_agree_req", true);
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = PDK_Data.Instance().getGameId();
        var roomId = PDK_Data.Instance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //显示玩家信息
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('jlmj_prefab_cfg');
        var view = parseInt(data);
        var playerInfo = this.getPlayerByView(view);
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
            user_info.setData(RoomMgr.Instance().gameId, RoomMgr.Instance().roomId, null, false, playerInfo);
            if (RoomMgr.Instance()._Rule.gps) {
                user_info.setGpsData(PDK_Data.Instance().playerInfo);
            }
            user_info.show();
        }.bind(this));
    },

    //快捷文字
    onQuickChatClick: function (event) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            hall_audio_mgr.com_btn_click();
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }

            var gameType = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomId;

            var id = parseInt(event.target.tagname);
            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(1);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 1;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
        else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },

    //表情点击
    onEmojiClick: function (event, data) {
        if (!this.emojiCD) {
            hall_audio_mgr.com_btn_click();
            this.emojiCD = true;
            setTimeout(function () {
                this.emojiCD = false;
            }.bind(this), 3 * 1000);
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }
            var gameType = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomId;
            var id = parseInt(data);

            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(2);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 2;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
    },

    idToItem(id) {
        var list = PDK_Data.Instance().itemList;
        return list[id];
    },

    itemToPlayId(itemid) {
        var list = PDK_Data.Instance().itemList;
        return list.indexOf(itemid);
    },

    //魔法表情
    sendMagicProp: function (event, data) {
        if (this.userId == cc.dd.user.id) {
            cc.log('不能对自己使用道具！');
            return;
        }
        const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
        var dataINfo = hall_prop_data.getItemInfoByDataId(this.id2Item(Number(data)));
        if (dataINfo == undefined || dataINfo.count < 1) {
            cc.log('道具数量不足!');
            cc.dd.PromptBoxUtil.show('道具数量不足! 可以通过金币兑换。');
            return;
        }

        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(3);
        chatInfo.setId(this.id2Item(Number(data)));
        chatInfo.setToUserId(this.userId);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 3;
        chat_msg.id = this.id2Item(Number(data));
        chat_msg.toUserId = this.userId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        cc.find('user_info', this.node).active = false;
    },

    onChat: function (data) {
        if (PDK_Data.Instance().playerInfo) {
            if (data.msgtype == 1) {//短语
                var view = this.idToView(data.sendUserId);
                var sex = this.getPlayerById(data.sendUserId).sex;
                this.playSound(sex, soundType.CHAT, data.id);
                var cfg = null;
                if (sex == 1) {
                    cfg = pdk_chat_cfg.Man;
                }
                else {
                    cfg = pdk_chat_cfg.Woman;
                }
                var str = cfg[data.id];
                this._uiComponents[view].showChat(str);
            }
            else if (data.msgtype == 2) {//表情
                var view = this.idToView(data.sendUserId);
                this._uiComponents[view].showEmoji(data.id);
            }
            else if (data.msgtype == 3) {//魔法表情
                this.playMagicProp(data.id, data.sendUserId, data.toUserId);
            }
        }
    },

    //播放魔法表
    playMagicProp: function (id, send, to) {
        // var magicIcon = this.createMagicPropIcon(id);
        // var startPos = this.getPlayerHeadPos(send);
        // var endPos = this.getPlayerHeadPos(to);
        // magicIcon.tag = this.getTargetNode(to);
        // magicIcon.setPosition(startPos);
        // var moveTo = cc.moveTo(1.0, endPos);
        // magicIcon.runAction(cc.sequence(
        //     moveTo
        //     , cc.callFunc(function () {
        //         this.playPropEffect(id, magicIcon);
        //     }.bind(this))
        // ));
        //var mj_xbq = cc.find('xinbiaoqing', this.node);
        //var xinbiaoqing = mj_xbq.getComponent('mj_xinbiaoqing');
        var sPos = this.getPlayerHeadPos(send);
        var ePos = this.getPlayerHeadPos(to);
        //xinbiaoqing.playeXinBiaoQing(id, cc.find('magic_layer', this.node), sPos, ePos);

        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        magic_prop.playMagicPropAni(id, sPos, ePos);
    },
    createMagicPropIcon: function (idx) {
        var atlas = this.magic_atlas;
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = atlas.getSpriteFrame(magicIcons[idx]);
        magicIcon.parent = cc.find('magic_layer', this.node);
        // this.magicIcons.push(magicIcon);
        return magicIcon;
    },
    getPlayerHeadPos: function (id) {
        var view = this.idToView(id);
        var head = this.getHeadByView(view);
        var pos = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
        return pos;
    },
    getTargetNode: function (id) {
        var view = this.idToView(id);
        var head = cc.find('mask', this.getHeadByView(view));
        return head;
    },
    playPropEffect: function (idx, magicIcon) {
        var node = magicIcon.tagname;
        magicIcon.destroy();
        var magic_prop_ani_node = cc.instantiate(this.magic_prop);
        var magic_prop_ani = magic_prop_ani_node.getComponent(cc.Animation);
        magic_prop_ani.node.active = true;
        magic_prop_ani.node.parent = node;
        magic_prop_ani.play('magic_prop_' + idx);
        magic_prop_ani.on('finished', function () {
            magic_prop_ani.node.destroy();
        });
        AudioManager.getInstance().playSound(PropAudioCfg[idx]);
    },

    //快捷聊天
    onChatToggle: function (event, data) {
        if (data == 'text') {
            cc.find('chat/panel/text', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = true;
            cc.find('chat/panel/emoji', this.node).active = false;
        }
        else {
            cc.find('chat/panel/emoji', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = false;
            cc.find('chat/panel/emoji', this.node).active = true;
        }
    },

    //关闭按钮
    onCloseClick: function (event, data) {
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
            case 'chat':
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                }
                break;
            case 'userinfo':
                cc.find('user_info', this.node).active = false;
                break;
        }
    },

    //点击背景
    onBgClick: function () {
        if (this.menu_show) {
            cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true; }.bind(this), this);
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
        // if (cc.find('player_down/beilv/detail', this.node).active == true) {
        //     cc.find('player_down/beilv/detail', this.node).active = false;
        // }
        if (cc.find('room_info/detail', this.node).active == true) {
            cc.find('room_info/detail', this.node).active = false;
        }
    },

    //返回大厅
    backToHall: function (event, data) {
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 分享到朋友圈
     */
    PYQBtnCallBack: function () {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('game_end/content/erweima', this.node).active = true;
            cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            cc.find('game_end/content/erweima', this.node).active = false;
        }
    },

    //设置音乐音效
    onSetMusic: function (event, data) {
        var duration = 0.3;
        var step = 0.05;
        switch (data) {
            case 'music':
                var music_Node = this.music_Node;
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = false;
                            cc.find('tao/b', music_Node).active = true;
                            cc.find('label_guan', music_Node).active = true;
                            AudioManager.getInstance().offMusic();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', music_Node).width;
                        var time = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', music_Node).width = width * time / duration;
                            if (time == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = true;
                            cc.find('tao/b', music_Node).active = false;
                            cc.find('label_kai', music_Node).active = true;
                            AudioManager.getInstance().onMusic(pdk_audio_cfg.GAME_MUSIC);
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time1 = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time1 -= step;
                            if (time1 < 0)
                                time1 = 0;
                            cc.find('mask', music_Node).width = width * (1 - time1 / duration);
                            if (time1 == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                break;
            case 'sound':
                var sound_Node = this.sound_Node;
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = false;
                            cc.find('tao/b', sound_Node).active = true;
                            cc.find('label_guan', sound_Node).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', sound_Node).width;
                        var time2 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time2 -= step;
                            if (time2 < 0)
                                time2 = 0;
                            cc.find('mask', sound_Node).width = width * time2 / duration;
                            if (time2 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = true;
                            cc.find('tao/b', sound_Node).active = false;
                            cc.find('label_kai', sound_Node).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time3 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time3 -= step;
                            if (time3 < 0)
                                time3 = 0;
                            cc.find('mask', sound_Node).width = width * (1 - time3 / duration);
                            if (time3 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(1);
                    AudioManager.getInstance().setMusicVolume(1);
                    this.mute = false;
                }
                else {
                    AudioManager.getInstance().setSoundVolume(0);
                    AudioManager.getInstance().setMusicVolume(0);
                    this.mute = true;
                }
                break;
            case 'fangyan':
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },

    //获取player
    getPlayerById: function (id) {
        var playerInfo = PDK_Data.Instance().playerInfo;
        if (playerInfo == null) {
            return null;
        }
        for (var i = 0; i < playerInfo.length; i++) {
            if (!playerInfo[i])
                continue;
            if (playerInfo[i].userId == id) {
                return playerInfo[i];
            }
        }
        return null;
    },
    getPlayerByView: function (view) {
        var playerList = PDK_Data.Instance().playerInfo;
        if (playerList) {
            for (var i = 0; i < playerList.length; i++) {
                if (!playerList[i])
                    continue;
                if (this.idToView(playerList[i].userId) == view) {
                    return playerList[i];
                }
            }
        }
        return null;
    },

    //播放音效
    playSound: function (sex, type, kind) {
        var path = '';
        var cfg = null;
        if (sex == 1) {//男
            cfg = pdk_audio_cfg.MAN;
        }
        else {
            cfg = pdk_audio_cfg.WOMAN;
        }
        switch (type) {
            case soundType.JIAOFEN:
                path = cfg.JIAOFEN[kind];
                break;
            case soundType.JIABEI:
                path = cfg.JIABEI[kind];
                break;
            case soundType.DAN:
                path = cfg.DAN[kind];
                break;
            case soundType.DUI:
                path = cfg.DUI[kind];
                break;
            case soundType.SAN:
                path = cfg.SAN[kind];
                break;
            case soundType.KILL:
                var random = Math.floor(Math.random() * 3);
                path = cfg.KILL[random];
                break;
            case soundType.PASS:
                var random = Math.floor(Math.random() * 4);
                path = cfg.PASS[random];
                break;
            case soundType.THREE_YI:
                path = cfg.THREE_YI;
                break;
            case soundType.THREE_DUI:
                path = cfg.THREE_DUI;
                break;
            case soundType.FOUR_ER:
                path = cfg.FOUR_ER;
                break;
            case soundType.FOUR_DUI:
                path = cfg.FOUR_DUI;
                break;
            case soundType.SHUNZI:
                path = cfg.SHUNZI;
                break;
            case soundType.LIANDUI:
                path = cfg.LIANDUI;
                break;
            case soundType.BOMB:
                path = cfg.BOMB;
                break;
            case soundType.ROCKET:
                path = cfg.ROCKET;
                break;
            case soundType.AIRPLANE:
                path = cfg.AIRPLANE;
                break;
            case soundType.REMAIN:
                path = cfg.REMAIN[kind];
                break;
            case soundType.CHAT:
                path = cfg.CHAT[kind];
                break;
            case soundType.FOUR_SAN:
                path = cfg.FOUR_SAN;
                break;
        }
        AudioManager.getInstance().playSound(path, false);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        prefab.getChildByName('lord').active = false;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = prefab.getChildByName('hua_xiao');
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
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
            case 17:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        var beimian = prefab.getChildByName('beimian');
        var joker = prefab.getChildByName('joker');
        switch (value) {
            case 0:
                beimian.active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 16:
                beimian.active = false;
                joker.active = false;
                num.active = true;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.active = true;
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                break;
            case 17:
                beimian.active = false;
                joker.active = true;
                num.active = false;
                if (flower % 2 == 0) {
                    joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r18');
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r19');
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_da.active = true;
                break;
        }
    },

    onMingpaiBtn: function (event, data) {
        var pdk_send_msg = require('pdk_send_msg');
        pdk_send_msg.sendMingpai();
    },

    onMingpai: function (msg) {
        for (var i = 0; i < msg.rolePokerList.length; i++) {
            this.setMingpaiList(msg.rolePokerList[i].userId, msg.rolePokerList[i].pokersList);
        }
    },

    setMingpaiList: function (id, cards) {
        // if (test_version) {
        //     var view = this.idToView(id);
        //     var node = null;
        //     if (view == 1) {
        //         node = cc.find('test/right_card', this.node);
        //     }
        //     else if (view == 2) {
        //         node = cc.find('test/left_card', this.node);
        //     }
        //     else {
        //         return;
        //     }
        //     node.removeAllChildren(true);
        //     var sortcards = pdk.sortShowCards(cards);
        //     for (var i = 0; i < sortcards.length; i++) {
        //         var card = cc.instantiate(this.pokerPrefab);
        //         card.scaleX = 0.3;
        //         card.scaleY = 0.3;
        //         card.name = sortcards[i].toString();
        //         this.setPoker(card, sortcards[i]);
        //         node.addChild(card);
        //     }
        // }
    },

    subMingpaiList: function (id, cards) {
        // if (test_version) {
        //     var view = this.idToView(id);
        //     var node = null;
        //     if (view == 1) {
        //         node = cc.find('test/right_card', this.node);
        //     }
        //     else if (view == 2) {
        //         node = cc.find('test/left_card', this.node);
        //     }
        //     else {
        //         return;
        //     }
        //     for (var i = node.childrenCount - 1; i > -1; i--) {
        //         if (cards.indexOf(parseInt(node.children[i].name)) != -1) {
        //             node.children[i].removeFromParent(true);
        //         }
        //     }
        // }
    },

    addMingpaiList: function (id, cards) {
        // if (test_version) {
        //     var view = this.idToView(id);
        //     var node = null;
        //     if (view == 1) {
        //         node = cc.find('test/right_card', this.node);
        //     }
        //     else if (view == 2) {
        //         node = cc.find('test/left_card', this.node);
        //     }
        //     else {
        //         return;
        //     }
        //     var list = [];
        //     for (var i = 0; i < node.childrenCount; i++) {
        //         list.push(parseInt(node.children[i].name));
        //     }
        //     for (var i = 0; i < cards.length; i++) {
        //         list.push(cards[i]);
        //     }
        //     node.removeAllChildren(true);
        //     var sortcards = pdk.sortShowCards(list);
        //     for (var i = 0; i < sortcards.length; i++) {
        //         var card = cc.instantiate(this.pokerPrefab);
        //         card.scaleX = 0.3;
        //         card.scaleY = 0.3;
        //         card.name = sortcards[i].toString();
        //         this.setPoker(card, sortcards[i]);
        //         node.addChild(card);
        //     }
        // }
    },

    getHeadByView: function (view) {
        var node = null;
        switch (view) {
            case 0:
                node = cc.find('head_node/head_down', this.node);
                break;
            case 1:
                node = cc.find('head_node/head_right', this.node);
                break;
            case 2:
                node = cc.find('head_node/head_left', this.node);
                break;
        }
        return node;
    },



    //时间转字符串 yyyy-mm-dd  hh:mm:ss
    generateTimeStr(date) {
        var pad2 = function (n) { return n < 10 ? '0' + n : n };
        return date.getFullYear().toString() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + '  ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
    },
});
