const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
const DDZ_Data = require('ddz_data').DDZ_Data;
var ddz = require('ddz_util');
var jlmj_prefab = require('jlmj_prefab_cfg');
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('xyddz_audio_cfg');
var ddz_chat_cfg = require('ddz_chat_cfg');
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

const dissolveUI = 'gameyj_xyddz/prefab/ddz_dissolve';
const test_version = AppCfg.IS_DEBUG;
const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;

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
};

cc.Class({
    extends: cc.Component,

    properties: {
        chat_item: cc.Prefab,
        win_font: { type: cc.Font, default: null, tooltip: '胜利字' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字' },
        paiAtlas: { type: cc.SpriteAtlas, default: null, tooltip: "牌图集" },
        atlas_game: { type: cc.SpriteAtlas, default: null, tooltip: "游戏图集" },
        room_num: { default: null, type: cc.Label, tooltip: '房号', },
        max_time: { default: null, type: cc.Label, tooltip: '最大倍数', },
        btn_invite: { default: null, type: cc.Button, tooltip: "邀请微信好友" },
        btn_friend_invite: { default: null, type: cc.Node, tooltip: "亲友圈邀请好友" },
        btn_read: { default: null, type: cc.Button, tooltip: "游戏准备" },
        dangqian_ju: { default: null, type: cc.Label, tooltip: '当前局数', },
        zong_ju: { default: null, type: cc.Label, tooltip: '总局', },
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
        callscore_splist: [cc.SpriteFrame],
        addsub: [cc.SpriteFrame],
        result_sp: [cc.SpriteFrame],
        jqk_sp: [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        DingRobot.set_ding_type(3);
        this.timeStamp = Math.floor(new Date().getTime() / 1000);
        this.initUiScript(true);
        this.initZhuoBu();
        this.initMusicAndSound();
        this.initRoomInfo();
        this.initPlayer();
        this.initChat();
        this.initReady();
        this.initInviteButton();

        DDZ_ED.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        RecordEd.addObserver(this);
        BSC_ED.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);

        cc.find('chat', this.node).getComponent(cc.Animation).on('play', function () { this.chatAni = true; }.bind(this), this);
        cc.find('chat', this.node).getComponent(cc.Animation).on('finished', function () { this.chatAni = false; }.bind(this), this);

        this.schedule(this.sendLocationInfo, 30);//发送位置信息

        // if (!RoomMgr.Instance().isClubRoom())
        //     this.btn_friend_invite.active = false;

        let size = cc.view.getVisibleSize();
        if (size.width / size.height > 1.9) {
            cc.find('player_down/op_jiaofen', this.node).y -= 20;
        }
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
        DDZ_ED.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        RecordEd.removeObserver(this);
        BSC_ED.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
        DDZ_Data.Destroy();
        RoomMgr.Instance().clear();
        AudioManager.getInstance().stopAllLoopSound();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case DDZ_Event.INIT_ROOM:
                this.initGame();
                break;
            case DDZ_Event.HAND_POKER:
                this.handPoker(data);
                break;
            case DDZ_Event.UPDATE_STATUS:
                this.updateStatus(data);
                break;
            case DDZ_Event.CALLSCORE_RET:
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showReady(false);
                }
                this.callScoreRet(data);
                break;
            case DDZ_Event.SHOW_LORD:
                this.showLord(data);
                break;
            case DDZ_Event.DOUBLE_RET:
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showReady(false);
                }
                this.doubleRet(data);
                break;
            case DDZ_Event.PLAY_POKER:
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showReady(false);
                }
                this.playPoker(data);
                break;
            case DDZ_Event.AUTO_RET:
                this.autoRet(data);
                break;
            case DDZ_Event.RESULT_RET:
                this.showResult(data);
                break;
            case BSC_Event.RANK_INFO:
                this.showRank(data);
                break;
            case DDZ_Event.RECONNECT:
                this.reconnect(data);
                break;
            case BSC_Event.GAME_END:
                break;
            case DDZ_Event.PLAYER_OFFLINE:
                this.playerOffline(data);
                break;
            case DDZ_Event.BG_CLICK:
                this.onBgClick();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case DDZ_Event.MINGPAI:
                this.onMingpai(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
            case DDZ_Event.UPDATE_ROOM_PLAYER_NUM:
                this.updateRoomPlayerNum();
                break;
            case DDZ_Event.PLAYER_READY:
                this.playerReady(data);
                break;
            case DDZ_Event.PLAYER_ISONLINE:
                this.playerOnline(data);
                break;
            case DDZ_Event.PLAYER_ENTER:
                this.playerEnter(data);
                break;
            case DDZ_Event.PLAYER_EXIT:
                this.playerExit(data);
                break;
            case RoomEvent.on_room_leave:
                this.on_room_leave(data[0]);
                break;
            case DDZ_Event.STACK_POKER:
                this.onStackRet(data);
                break;
            case DDZ_Event.ZHANJI:
                this.onZhanji(data);
                break;
            case DDZ_Event.DISSOLVE:
                this.onDissolve(data);
                break;
            case DDZ_Event.DISSOLVE_RESULT:
                this.dissolveResult(data);
                break;
            case DDZ_Event.PLAYER_EXCHANGE:
                this.exchangeRet(data);
                break;
            case DDZ_Event.EXCHANGE_RESULT:
                this.exchangeResult(data);
                break;
            case RecordEvent.PLAY_RECORD:
                for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
                    if (DDZ_Data.Instance().playerInfo[i] && DDZ_Data.Instance().playerInfo[i].userId) {
                        if (data.accid.toLowerCase() == (cc.dd.prefix + DDZ_Data.Instance().playerInfo[i].userId).toLowerCase()) {
                            this._uiComponents[this.idToView(DDZ_Data.Instance().playerInfo[i].userId)].play_yuyin(data.duration);
                        }
                    }
                }
                break;
            //GVoice 语音
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
                    if (DDZ_Data.Instance().playerInfo[i] && DDZ_Data.Instance().playerInfo[i].userId) {
                        if (data[0] == DDZ_Data.Instance().playerInfo[i].userId) {
                            let head = this._uiComponents[this.idToView(DDZ_Data.Instance().playerInfo[i].userId)];
                            head.yuyin_laba.node.active = true;
                            head.yuyin_laba.yuyin_size.node.active = false;
                        }
                    }
                }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
                    if (DDZ_Data.Instance().playerInfo[i] && DDZ_Data.Instance().playerInfo[i].userId) {
                        if (data[0] == DDZ_Data.Instance().playerInfo[i].userId) {
                            let head = this._uiComponents[this.idToView(DDZ_Data.Instance().playerInfo[i].userId)];
                            head.yuyin_laba.node.active = false;
                            head.yuyin_laba.yuyin_size.node.active = false;
                        }
                    }
                }
                break;
            case DDZ_Event.PYC_NEXT:
                this.onNextGame(data);
                break;
            case RoomEvent.player_signal_state:
                this.on_player_signal_state(data[0]);
                break;
            case RoomEvent.update_player_location:
                this.on_player_location_change(data[0]);
                break;
            case DDZ_Event.UPDATE_TIMEOUT:
                this.updateTimeout(data);
                break;
        }
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
            UI.getComponent('user_info_view').setGpsData(DDZ_Data.Instance().playerInfo);
        }
    },

    //继续返回
    onNextGame(msg) {
        if (msg.userId == cc.dd.user.id) {
            cc.find('result_ani/next', this.node).active = false;
            this.hideResult();
            cc.find('reconnect_jixu', this.node).active = false;
            this.clearScene();
            for (var i = 0; i < this._uiComponents.length; i++) {
                cc.find('ready', this._uiComponents[i].headnode).opacity = 255;
            }
            this.playLoading();
        }
        this.playerReady(msg);
    },

    //换牌返回
    exchangeRet(msg) {
        var view = this.idToView(msg.userId);
        var cards = msg.pokersList;
        this._uiComponents[view].onExchangeRet(cards);
    },

    //换牌结果
    exchangeResult(msg) {
        var isClockwise = msg.isClockwise;
        var pokersList = msg.pokersList;
        var down_card = cc.find('exchange/card/down', this.node);
        for (var i = 0; i < down_card.childrenCount; i++) {
            this.setPoker(down_card.children[i], 0);
        }
        cc.find('exchange', this.node).getComponent('ddz_exchangeBone').setData(pokersList);
        var insertCard = function () {
            cc.find('exchange', this.node).getComponent(cc.Animation).off('finished', insertCard, this);
            for (var i = 0; i < this._uiComponents.length; i++) {
                if (i == 0) {
                    this._uiComponents[i].exchangeCardsInsert(pokersList);
                    this._uiComponents[i].remainCard += 3;
                }
                else {
                    this._uiComponents[i].setRemainCardNum(this._uiComponents[i].remainCard + 3);
                }
            }
        }.bind(this);
        cc.find('exchange', this.node).getComponent(cc.Animation).on('finished', insertCard, this);
        if (isClockwise) {
            this.playExchangeAnimation('exchange_shunshizhen');
        }
        else {
            this.playExchangeAnimation('exchange_nishizhen');
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
                var timeout = time || DDZ_Data.Instance().deskInfo.dissolveTimeout;
                var playerList = DDZ_Data.Instance().playerInfo;
                ui.getComponent('ddz_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    onDissolveList(msglist, time) {
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (!UI) {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var playerList = DDZ_Data.Instance().playerInfo;
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
        DDZ_Data.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);
    },

    onZhanji(msg) {
        DDZ_Data.Instance().isEnd = true;
        var zjNode = cc.find('zhanjitongji', this.node);
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
        var playList = msg.playerInfoList.sort((a, b) => { return b.lastScore - a.lastScore });
        var bigWinScore = 0;
        for (var i = 0; i < playList.length; i++) {
            if (playList[i].lastScore > bigWinScore) {
                bigWinScore = playList[i].lastScore;
            }
        }
        for (var i = 0; i < playList.length; i++) {
            var pNode = cc.find('player_layout/userNode' + i, zjNode);
            var player = this.getPlayerById(playList[i].userId);
            var nick = cc.dd.Utils.substr(ddz.filterEmoji(player.name), 0, 6);
            var headUrl = player.headUrl;
            var headsp = cc.find('headNode/head', pNode).getComponent(cc.Sprite);
            var score = playList[i].lastScore;
            this.initHead(headsp, headUrl);
            cc.find('name', pNode).getComponent(cc.Label).string = nick;
            cc.find('roomer', pNode).active = playList[i].isCreator;
            cc.find('ID', pNode).getComponent(cc.Label).string = playList[i].userId.toString();
            if (score > -1) {
                cc.find('win', pNode).active = true;
                cc.find('win', pNode).getComponent(cc.Label).string = '' + score;
                cc.find('lose', pNode).active = false;
            }
            else {
                cc.find('win', pNode).active = false;
                cc.find('lose/num', pNode).getComponent(cc.Label).string = '' + Math.abs(score);
                cc.find('lose', pNode).active = true;
            }
            if (bigWinScore > 0 && score == bigWinScore) {
                cc.find('dayinjia', pNode).active = true;
            }
        }
        if (DDZ_Data.Instance().isDissolved) {
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
            cc.find('zhanjitongji/logo-xyddz', this.node).active = true;
            var fileName = "screen_capture.png";
            cc.dd.SysTools.captureScreen(fileName, canvasNode, function () {
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                    var share_ui = ui.getComponent('klb_hall_share');
                    if (share_ui != null) {
                        share_ui.setCapture(fileName);
                    }
                }.bind(this));
            });
            cc.find('zhanjitongji/logo-xyddz', this.node).active = false;
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
            DDZ_Data.Destroy();
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

    popupOKcancel: function (text, callfunc) {
        // cc.dd.DialogBoxUtil.show(0, text, '确定', '取消', function () {
        //     callfunc();
        // }, function () { });

        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 1);
        }.bind(this));
    },

    updateRoomPlayerNum: function () {
        if (DDZ_Data.Instance().getIsRoomFull()) {
            this.btn_invite.node.active = false;
            //this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
        }
        else {
            this.btn_invite.node.active = true;
            //this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
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
        for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
            if (DDZ_Data.Instance().playerInfo[i] == null || DDZ_Data.Instance().playerInfo[i].userId == null) {
                num++;
            }
        }
        hall_audio_mgr.com_btn_click();
        var title = "房间号:" + RoomMgr.Instance().roomId + '\n';
        var str = this.getRuleString();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(RoomMgr.Instance().roomId, "【" + DDZ_Data.Instance().playerInfo.length + "人斗地主】" + '  差' + num + '人', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [];
            var rules = RoomMgr.Instance()._Rule;
            wanFa.push('共' + rules.circleNum + '局');
            wanFa.push('封顶:' + rules.maxTimes.toString() + '倍');
            if (rules.cardHolder == true) {
                wanFa.push('记牌器');
            }
            if (rules.beenCallScore == true) {
                wanFa.push('好牌必叫');
            }
            if (rules.gps == true) {
                wanFa.push('GPS测距');
            }
            let playerList = DDZ_Data.Instance().playerInfo;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: DDZ_Data.Instance().playerInfo.length + "人斗地主",//房间名称
                content: wanFa,//游戏规则数组
                usercount: DDZ_Data.Instance().playerInfo.length,//人数
                jushu: rules.circleNum,//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            if (custom == 'xianliao') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink("【" + DDZ_Data.Instance().playerInfo.length + "人斗地主】" + '  差' + num + '人', title + str, url);
            }
            else
                cc.dd.native_wx.SendAppInvite(info, "【" + DDZ_Data.Instance().playerInfo.length + "人斗地主】" + '  差' + num + '人', title + str, Platform.wxShareGameUrl[AppCfg.PID]);
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
        str += '  封顶:' + (rules.maxTimes == 0x7FFFFFFF ? '不封顶' : rules.maxTimes.toString() + '倍');
        if (rules.beenCallScore == true) {
            str += '  好牌必叫';
        }
        if (rules.cardHolder == true) {
            str += '  记牌器';
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
        if (DDZ_Data.Instance().isGameStart) {//游戏内准备
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


    //播放loading动画
    playLoading() {
        var loading_ani = cc.find('loading_ani', this.node);
        var spines = loading_ani.getComponentsInChildren(sp.Skeleton);
        var rd = Math.floor(Math.random() * spines.length);
        spines[rd].enabled = true;
        spines[rd].setAnimation(0, 'play', true);
    },
    hideLoading() {
        var loading_ani = cc.find('loading_ani', this.node);
        var spines = loading_ani.getComponentsInChildren(sp.Skeleton);
        for (var i = 0; i < spines.length; i++) {
            spines[i].clearTrack(0);
            spines[i].enabled = false;
        }
    },

    /**
     * 设置准备
     */
    setReady: function (readyId) {
        var selfId = cc.dd.user.id;
        // if (readyId === selfId) {
        //     this.btn_read.node.active = false;
        // }
    },

    /**
     * 邀请好友按钮初始化
     */
    initInviteButton: function () {
        var curJushu = DDZ_Data.Instance().curJushu ? DDZ_Data.Instance().curJushu : 0;
        if (cc.dd.user.id == RoomMgr.Instance().roomerId) {
            this.btn_invite.node.parent.active = true;
            if (curJushu < 1) {
                this.hideLoading();
            }
        }
        if (curJushu > 0) {
            this.btn_invite.node.active = false;
            //this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
        }
        if (DDZ_Data.Instance().getIsRoomFull()) {
            this.btn_invite.node.active = false;
            //this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
        }
    },

    /**
     * 初始化准备按钮
     */
    initReady: function () {
        if (!DDZ_Data.Instance().isGameStart) {
            var player1 = DDZ_Data.Instance().getPlayer(cc.dd.user.id);
            if (player1 != null) {
                if (player1.isReady == 1) {
                    this.setReady(cc.dd.user.id);
                }
            }
            this.playLoading();
        }
        var data = DDZ_Data.Instance();
        if (data) {
            if (data.deskInfo && data.deskInfo.curCircle) {
                if (data.deskInfo.curCircle > 0) {
                    for (var i = 0; i < this._uiComponents.length; i++) {
                        cc.find('ready', this._uiComponents[i].headnode).opacity = 255;
                    }
                }
            }
        }
    },

    //打完一局之后清理场景
    clearScene: function () {
        for (var i = 0; i < 3; i++) {
            this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), 0);
        }
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
        return DDZ_Data.Instance().idToView(id);
    },

    initRoomInfo: function () {
        var Rule = RoomMgr.Instance()._Rule;
        this.room_num.string = RoomMgr.Instance().roomId.toString();
        this.max_time.string = "" + Rule.maxTimes;
        this.zong_ju.string = '-' + Rule.circleNum;
        if (Rule.cardHolder) {
            cc.find('jipaiqi', this.node).active = true;
        }
        //玩法名称+人数+圈数+封顶+缺几人
        if (this.btn_friend_invite) {
            let rule = '斗地主' + ' ' + Rule.circleNum.toString() + '局';
            this.btn_friend_invite.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule);
        }
    },

    initPlayer: function () {
        var playerInfo = DDZ_Data.Instance().playerInfo;
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
            var playerInfo = DDZ_Data.Instance().playerInfo;
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
        var playerInfo = DDZ_Data.Instance().playerInfo;
        DDZ_Data.Instance().maxScore = 0;
        if (!playerInfo) {
            cc.error('playerInfo is null');
            return;
        }
        for (var i = 0; i < playerInfo.length; i++) {
            //this._uiComponents[this.idToView(playerInfo[i].userId)].initPlayerInfo(playerInfo[i]);
            this._uiComponents[this.idToView(playerInfo[i].userId)].resetUI();
        }
        for (var i = 0; i < 3; i++) {
            this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), 0);
        }
        this.hideResult();
        this.onGameOpening();
    },

    onGameOpening: function () {
        this.playDipaiAni = true;
        this.btn_invite.node.parent.active = false;
        DDZ_Data.Instance().setIsStart(true);
        DDZ_Data.Instance().setIsEnd(false);
        this.JipaiCards = [];
        this.refreshJipaiqi();
        var curCircle = DDZ_Data.Instance().deskInfo.curCircle;
        this.dangqian_ju.string = curCircle.toString();
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].showReady(false);
        }
        this.hideLoading();
    },

    //初始化聊天
    initChat: function () {
        var cfg = null;
        var parent = cc.find('chat/panel/text/view/content', this.node);
        parent.removeAllChildren(true);
        if (cc.dd.user.sex == 1) {
            cfg = ddz_chat_cfg.Man;
        }
        else {
            cfg = ddz_chat_cfg.Woman;
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
        var json = cc.sys.localStorage.getItem('ddz_zhuobu_' + cc.dd.user.id);
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
                cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
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
                cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
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
                cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
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
            AudioManager.getInstance().onMusic(ddz_audio_cfg.GAME_MUSIC);
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
        this._uiComponents[0].showBeilv();
        var cards = data.handPokersList;
        for (var i = 0; i < this._uiComponents.length; i++) {
            var exchange = RoomMgr.Instance()._Rule.exchangePoker;
            this._uiComponents[i].playSendCards(cards, null, exchange);
            cc.find('callscore', this.getHeadByView(i)).active = false;//叫分隐藏
        }
        DDZ_Data.Instance().maxScore = 0;
        // if (test_version) {
        //     var ddz_send_msg = require('ddz_send_msg');
        //     ddz_send_msg.sendMingpai();
        // }
        //this.refreshJipaiqi();
    },

    //更新状态
    updateStatus: function (data) {
        var status = data.deskStatus;
        var id = data.curPlayer;
        this.gameStatus = status;
        cc.find('wait_double', this._uiComponents[0].node).active = false;
        switch (status) {
            case roomStatus.STATE_REFRESH: //刷新
                this.initGame();
                break;
            case roomStatus.STATE_CALL_SCORE://叫分
                var callTime = DDZ_Data.Instance().deskInfo.callScoreTimeout;
                var maxScore = DDZ_Data.Instance().maxScore;
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        var joker2 = RoomMgr.Instance()._Rule.beenCallScore;
                        this._uiComponents[i].showCallScoreOp(callTime, maxScore, null, joker2);
                    }
                    else {
                        this._uiComponents[i].hideCallScoreOp();
                    }
                }
                break;
            case roomStatus.STATE_PLAYING://出牌
                var playTime = DDZ_Data.Instance().getPlayerTimeout(id);
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        DDZ_Data.Instance().lastCards = [];
                        DDZ_Data.Instance().lastPlayer = -1;
                        this.curPlayer = i;
                        this._uiComponents[i].showPlaying(playTime);
                    }
                }
                break;
            case roomStatus.STATE_DOUBLE://加倍
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout);
                }
                break;
            case roomStatus.STATE_DOUBLE_FARM://农民优先加倍
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        this._uiComponents[i].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout);
                        if (DDZ_Data.Instance().lordId == cc.dd.user.id) {
                            if (i != 0)
                                cc.find('wait_double', this._uiComponents[0].node).active = true;
                        }
                    }
                }
                break;
            case roomStatus.STATE_CHANGE_POKER://换三张
                this.playExchangeAnimation('exchange_reset');
                for (var i = 0; i < this._uiComponents.length; i++) {
                    this._uiComponents[i].showChangeCard(15);
                }
                break;
        }
    },

    //叫分返回
    callScoreRet: function (data) {
        var id = data.userId;
        var score = data.score;
        this._uiComponents[this.idToView(id)].callScoreRet(score, this.callscore_splist);
        this._uiComponents[this.idToView(id)].hideCallScoreOp();

        var sex = this.getPlayerById(id).sex;
        this.playSound(sex, soundType.JIAOFEN, score);
    },

    //播放换牌动画
    playExchangeAnimation(ani_name) {
        cc.find('exchange', this.node).getComponent(cc.Animation).play(ani_name);
    },

    //显示地主和底牌
    showLord: function (data) {
        var bottomCards = data.bottomPokersList;
        var lordId = data.landholderId;
        // if (test_version) {
        //     this.addMingpaiList(lordId, bottomCards);
        // }
        var times = data.bottomPokersTimes;
        DDZ_Data.Instance().lordId = lordId;
        DDZ_Data.Instance().bottomPokersTimes = times;
        this.total_bei = DDZ_Data.Instance().maxScore * times;
        this.bomb_bei = 1;
        this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times });
        for (var i = 0; i < this._uiComponents.length; i++) {//显示地主 隐藏叫分
            this.scheduleOnce(function () {
                for (var j = 0; j < this._uiComponents.length; j++) {
                    cc.find('callscore', this.getHeadByView(j)).active = false;
                }
            }.bind(this), 1);
            if (i == this.idToView(lordId)) {
                cc.find('lord', this.getHeadByView(this.idToView(lordId))).active = true;
                this._uiComponents[this.idToView(lordId)].showBottomCard(bottomCards);
            }
            else {
                cc.find('lord', this.getHeadByView(i)).active = false;
            }
        }
        this.refreshJipaiqi();
    },

    //加倍返回
    doubleRet: function (data) {
        var id = data.userId;
        var isDouble = data.isDouble;
        if (isDouble) {
            var jiabei_ani = cc.find('jiabei_ani', this.getHeadByView(this.idToView(id)));
            var jiabei_node = cc.find('jiabei', this.getHeadByView(this.idToView(id)));
            jiabei_ani.active = true;
            var spine = jiabei_ani.getComponent(sp.Skeleton);
            spine.setCompleteListener((trackEntry, loopCount) => {
                jiabei_node.active = true;
                jiabei_ani.active = false;
            });
            spine.setAnimation(0, 'animation', false);
            //cc.find('jiabei', this.getHeadByView(this.idToView(id))).active = true;
            cc.find('double', this.getHeadByView(this.idToView(id))).getComponent(cc.Sprite).spriteFrame = null;//this.double_splist[1];
        }
        else {
            cc.find('double', this.getHeadByView(this.idToView(id))).getComponent(cc.Sprite).spriteFrame = null;//this.double_splist[0];
        }
        cc.find('double', this.getHeadByView(this.idToView(id))).active = true;
        this.scheduleOnce(function () {
            cc.find('double', this.getHeadByView(this.idToView(id))).active = false;
        }.bind(this), 1);
        var view = this.idToView(id);
        if (view == 0) {
            this._uiComponents[0].showOperation(-1);
        }
        else {
            this._uiComponents[view].hideTimer();
        }

        var sex = this.getPlayerById(id).sex;
        this.playSound(sex, soundType.JIABEI, isDouble ? 1 : 0);
    },

    /**
     * 出牌消息
     */
    playPoker: function (data) {
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
            DDZ_Data.Instance().lastCards = pokers;
            DDZ_Data.Instance().lastPlayer = this.idToView(id);
        }
        this._uiComponents[this.idToView(id)].showOutCard(pokers, DDZ_Data.Instance().lordId == id);
        if (this._uiComponents[this.idToView(id)].getHandCardNum() != 0) {
            var nextPlayer = this.getNextPlayer(this.idToView(id));
            this.curPlayer = nextPlayer;
            if (this.curPlayer == DDZ_Data.Instance().lastPlayer) {
                DDZ_Data.Instance().lastCards = [];
            }
            var playTime = DDZ_Data.Instance().getPlayerTimeoutByView(nextPlayer);
            this._uiComponents[nextPlayer].showPlaying(playTime);
        }
        if (ddz.analysisCards(pokers).type >= 10) {//炸弹
            this.total_bei *= 2;
            this.bomb_bei *= 2;
            this._uiComponents[0].showBeilv({ total: this.total_bei, zhadan: this.bomb_bei });
        }
    },

    refreshJipaiqi() {
        var list = [];
        for (var i = 0; i < this.JipaiCards.length; i++) {
            if (list.indexOf(this.JipaiCards[i]) == -1) {
                list.push(this.JipaiCards[i]);
            }
        }
        var handcard = this._uiComponents[0]._handCards;
        if (handcard && handcard.length) {
            for (var i = 0; i < handcard.length; i++) {
                if (list.indexOf(handcard[i]) == -1) {
                    list.push(handcard[i]);
                }
            }
        }
        var counts = ddz.countRepeatCards(list);
        counts[17] = 0;
        for (var i = 0; i < list.length; i++) {
            if (list[i] == 172)
                counts[0] = 1;
            if (list[i] == 171)
                counts[17] = 1;
        }
        var jipaiqi = this.getComponentInChildren('xyddz_jipaiqi');
        if (jipaiqi) {
            jipaiqi.setData(counts);
        }
    },

    //出牌音效
    outCardSound: function (id, pokers) {
        if (!this.getPlayerById(id))
            return;
        var sex = this.getPlayerById(id).sex;
        if (pokers.length > 0) {
            if (DDZ_Data.Instance().lastPlayer == this.idToView(id) || !DDZ_Data.Instance().lastCards || DDZ_Data.Instance().lastCards.length == 0) {
                var analysis = ddz.analysisCards(pokers);
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
                var analysis = ddz.analysisCards(pokers);
                var lastanalysis = ddz.analysisCards(DDZ_Data.Instance().lastCards);
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
        if (DDZ_Data.Instance().deskInfo.curCircle == RoomMgr.Instance()._Rule.circleNum) {
            cc.find('result_ani/next', this.node).active = false;
        }
        else {
            for (var i = 0; i < this._uiComponents.length; i++) {
                cc.find('ready', this._uiComponents[i].headnode).opacity = 0;
            }
            cc.find('result_ani/next', this.node).active = true;
        }
        cc.find('setting', this.node).active = false;
        if (data.isGod > 0) {
            this.playSpring();
            this.total_bei *= 2;
            this._uiComponents[0].showBeilv({ total: this.total_bei, chuntian: 2 });
        }
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].showAuto(false);
            cc.find('op', this._uiComponents[i].node).active = false;
        }

        var nodes = [];
        nodes.push(cc.find('result_ani/detail/jiaofen', this.node));
        nodes.push(cc.find('result_ani/detail/zhadan', this.node));
        nodes.push(cc.find('result_ani/detail/chuntian', this.node));
        nodes.push(cc.find('result_ani/detail/total', this.node));
        var idx = 0;
        var jiaofen = DDZ_Data.Instance().maxScore;
        var zhadan = Math.pow(2, data.zhadanNum);
        var chuntian = data.isGod > 0 ? 2 : 1;
        var total = jiaofen * zhadan * chuntian;
        if (isNaN(total)) {
            total = 0;
        }

        nodes[idx++].getChildByName('lbl').getComponent(cc.Label).string = jiaofen.toString();
        nodes[idx++].getChildByName('lbl').getComponent(cc.Label).string = zhadan.toString();
        nodes[idx++].getChildByName('lbl').getComponent(cc.Label).string = chuntian.toString();
        nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = total.toString();

        var changeList = data.changeListList.sort(function (a, b) { return DDZ_Data.Instance().idToView(a.userId) - DDZ_Data.Instance().idToView(b.userId) });
        for (var i = 0; i < changeList.length; i++) {
            if (changeList[i].changeScore > 0) {
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.addsub[0];
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).font = this.win_font;
            }
            else {
                if (changeList[i].changeScore == 0)
                    cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = null;
                else
                    cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.addsub[1];
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).font = this.lose_font;
            }
            cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).string = Math.abs(changeList[i].changeScore).toString();
        }

        var isLord = DDZ_Data.Instance().lordId == changeList[0].userId;
        if (changeList[0].changeScore > 0) {//胜利
            if (isLord) {
                cc.find('Canvas/root/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.result_sp[0];
                var spine = cc.find('Canvas/root/result_ani/ani/dzsl').getComponent(sp.Skeleton);
                spine.enabled = true;
                spine.setAnimation(0, 'play', true);
            }
            else {
                cc.find('Canvas/root/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.result_sp[2];
                var spine = cc.find('Canvas/root/result_ani/ani/nmsl').getComponent(sp.Skeleton);
                spine.enabled = true;
                spine.setAnimation(0, 'play', true);
            }
        }
        else {//失败
            if (isLord) {
                cc.find('Canvas/root/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.result_sp[1];
                var spine = cc.find('Canvas/root/result_ani/ani/dzsb').getComponent(sp.Skeleton);
                spine.enabled = true;
                spine.setAnimation(0, 'play', true);
            }
            else {
                cc.find('Canvas/root/result_ani/result_sp').getComponent(cc.Sprite).spriteFrame = this.result_sp[3];
                var spine = cc.find('Canvas/root/result_ani/ani/nmsb').getComponent(sp.Skeleton);
                spine.enabled = true;
                spine.setAnimation(0, 'play', true);
            }
        }

        this.scheduleOnce(function () {
            //显示手牌
            for (var i = 0; i < data.changeListList.length; i++) {
                if (this.idToView(data.changeListList[i].userId) != 0) {
                    if (data.changeListList[i].leftHandPokerList.length > 0) {
                        this._uiComponents[this.idToView(data.changeListList[i].userId)].showOutCard(data.changeListList[i].leftHandPokerList, DDZ_Data.Instance().lordId == data.changeListList[i].userId, true);
                    }
                }
            }
            //修改玩家分数
            for (var i = 0; i < data.changeListList.length; i++) {
                for (var j = 0; j < DDZ_Data.Instance().playerInfo.length; j++) {
                    if (data.changeListList[i].userId == DDZ_Data.Instance().playerInfo[j].userId) {
                        DDZ_Data.Instance().playerInfo[j].score += data.changeListList[i].changeScore;
                        cc.find('info/gold', this.getHeadByView(this.idToView(data.changeListList[i].userId))).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(DDZ_Data.Instance().playerInfo[j].score);
                        break;
                    }
                }
            }
        }.bind(this), 1);

        this.scheduleOnce(function () {
            var node = cc.find('Canvas/root/result_ani');
            this.scheduleOnce(function () {
                node.active = true;
                if (changeList[0].changeScore > 0)
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.WIN, false);
                else
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.LOSE, false);
            }, 0.05);
        }.bind(this), 1.5);
    },
    hideResult: function () {
        cc.find('Canvas/root/result_ani').active = false;
        var spines = cc.find('Canvas/root/result_ani/ani').getComponentsInChildren(sp.Skeleton);
        spines.forEach(spine => {
            spine.clearTrack(0);
            spine.enabled = false;
        });
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
        //this.btn_read.node.active = false;
        for (var j = 0; j < this._uiComponents.length; j++) {
            cc.find('callscore', this.getHeadByView(j)).active = false;
        }
        for (var i = 0; i < this._uiComponents.length; i++) {
            if (i == 0) {
                this._uiComponents[i].showOperation(-1);
            }
            else {
                this._uiComponents[i].hideTimer();
            }
        }
        var bottomPokers = data.bottomPokersList;
        if (bottomPokers.length) {
            var cards = ddz.sortShowCards(bottomPokers);
            for (var i = 0; i < cards.length; i++) {
                this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), cards[i]);
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), 0);
            }
        }

        var playerInfo = DDZ_Data.Instance().playerInfo;
        for (var i = 0; i < playerInfo.length; i++) {
            var isDouble = playerInfo[i].isDouble;
            var isAuto = playerInfo[i].isAuto;
            var isLord = playerInfo[i].identify;
            if (isLord) {
                DDZ_Data.Instance().lordId = playerInfo[i].userId;
            }
            var isOffline = playerInfo[i].state != 1;
            var isSwitch = playerInfo[i].isSwitch;
            var isWeak = playerInfo[i].netState < 3;
            cc.find('lord', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isLord || false;
            cc.find('tuoguan', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isAuto || false;
            cc.find('jiabei', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isDouble || false;
            cc.find('offline', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isOffline || isSwitch || false;
            cc.find('weak', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isWeak;
            if (this.idToView(playerInfo[i].userId) == 0) {
                cc.find('tuoguan_node', this._uiComponents[0].node).active = isAuto || false;
            }
        }
        this.gameStatus = DDZ_Data.Instance().deskInfo.deskStatus;
        switch (DDZ_Data.Instance().deskInfo.deskStatus) {
            case roomStatus.STATE_PREPARE:
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (playerInfo[i].isPrepared) {
                        this.playerReady({ userId: playerInfo[i].userId });
                    }
                    if (playerInfo[i].userId == cc.dd.user.id) {
                        if (!playerInfo[i].isPrepared) {
                            cc.find('reconnect_jixu', this.node).active = true;
                        }
                        else {
                            this.playLoading();
                        }
                    }
                }
                break;
            case roomStatus.STATE_CALL_SCORE:
                var callTime = DDZ_Data.Instance().deskInfo.callScoreTimeout;
                DDZ_Data.Instance().maxScore = data.curCallScore;
                var curPlayer = data.curPlayer;
                var curTime = data.timeout;
                this._uiComponents[0].showBeilv();
                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(curPlayer)) {
                        var joker2 = RoomMgr.Instance()._Rule.beenCallScore;
                        this._uiComponents[i].showCallScoreOp(callTime, DDZ_Data.Instance().maxScore, curTime, joker2);
                    }
                    else {
                        this._uiComponents[i].hideCallScoreOp();
                    }
                }
                for (var i = 0; i < playerInfo.length; i++) {
                    if (playerInfo[i].callScore > -1) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].callScoreRet(playerInfo[i].callScore, this.callscore_splist);
                    }
                }
                break;
            case roomStatus.STATE_DOUBLE:
                var curTime = data.timeout;
                var unSelect = false;
                var myDouble = null;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (0 == this.idToView(playerInfo[i].userId)) {
                        if (cc.dd._.isUndefined(playerInfo[i].isDouble)) {
                            unSelect = true;
                        }
                        else {
                            myDouble = playerInfo[i].isDouble;
                        }
                    }
                }
                if (unSelect) {
                    this._uiComponents[0].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout, curTime);
                }
                DDZ_Data.Instance().maxScore = data.curCallScore;
                var times = data.bottomPokersTimes;
                DDZ_Data.Instance().bottomPokersTimes = times;
                this.bomb_bei = 1;
                if (unSelect) {
                    this.total_bei = DDZ_Data.Instance().maxScore * times;
                    this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times });
                }
                else {
                    this.total_bei = DDZ_Data.Instance().maxScore * times;
                    //this.total_bei *= myDouble ? 2 : 1;
                    this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times, jiabei: myDouble ? 2 : null });
                }
                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }
                break;
            case roomStatus.STATE_DOUBLE_FARM:
                var curTime = data.timeout;
                DDZ_Data.Instance().maxScore = data.curCallScore;
                var times = data.bottomPokersTimes;
                DDZ_Data.Instance().bottomPokersTimes = times;
                this.bomb_bei = 1;
                this.total_bei = DDZ_Data.Instance().maxScore * times;
                this._uiComponents[0].showBeilv({ total: this.total_bei, });
                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }
                var curPlayer = data.curPlayer;
                this._uiComponents[this.idToView(curPlayer)].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout, curTime);
                break;
            case roomStatus.STATE_PLAYING:
                var curTime = data.timeout;
                var playTime = DDZ_Data.Instance().getPlayerTimeout(data.curPlayer);
                var myDouble = null;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (0 == this.idToView(playerInfo[i].userId)) {
                        myDouble = playerInfo[i].isDouble;
                    }
                }
                DDZ_Data.Instance().maxScore = data.curCallScore;
                var times = data.bottomPokersTimes;
                DDZ_Data.Instance().bottomPokersTimes = times;
                var bombNum = data.curZhaDanNum;
                this.bomb_bei = Math.pow(2, bombNum);
                this.total_bei = DDZ_Data.Instance().maxScore * times * this.bomb_bei;
                //this.total_bei *= myDouble ? 2 : 1;
                this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times, jiabei: myDouble ? 2 : null, zhadan: this.bomb_bei });
                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }
                var recentPlay = data.recentPlayList;
                if (recentPlay[0]) {
                    if (recentPlay[0].pokersList.length > 0) {
                        DDZ_Data.Instance().lastCards = recentPlay[0].pokersList;
                        DDZ_Data.Instance().lastPlayer = this.idToView(recentPlay[0].userId);
                    }
                    else if (recentPlay[1] && recentPlay[1].pokersList.length > 0) {
                        DDZ_Data.Instance().lastCards = recentPlay[1].pokersList;
                        DDZ_Data.Instance().lastPlayer = this.idToView(recentPlay[1].userId);
                    }
                    else {
                        DDZ_Data.Instance().lastCards = [];
                    }
                    for (var i = 0; i < recentPlay.length; i++) {
                        this._uiComponents[this.idToView(recentPlay[i].userId)].displayOutCard(recentPlay[i].pokersList);
                    }
                }
                else {
                    DDZ_Data.Instance().lastCards = [];
                }
                this.curPlayer = this.idToView(data.curPlayer);
                this._uiComponents[this.curPlayer].showPlaying(playTime, curTime);
                break;
        }
        if (data.dissolveInfoList && data.dissolveInfoList.length) {
            var distime = data.timeout;
            this.onDissolveList(data.dissolveInfoList, distime);
        }
        if (DDZ_Data.Instance().reconnectResult) {
            this.showResult(DDZ_Data.Instance().reconnectResult);
            DDZ_Data.Instance().reconnectResult = null;
        }
        if (DDZ_Data.Instance().reconnectZhanji) {
            this.onZhanji(DDZ_Data.Instance().reconnectZhanji);
            DDZ_Data.Instance().reconnectZhanji = null;
        }
    },

    /**
     * 初始化UI脚本
     */
    initUiScript: function (bool) {
        this._uiComponents = [];
        if (bool) {
            this._uiComponents.push(this.node.getComponentInChildren('xyddz_pyc_down_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('xyddz_pyc_right_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('xyddz_pyc_left_ui'));
        }
    },

    //播放顺子特效
    playShunziAnimation: function () {
        var bone = cc.find('shunzi_ani', this.node).getComponent(sp.Skeleton);
        bone.enabled = true;
        bone.setAnimation(0, 'play', false);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
    },

    //播放顺子特效
    playLianduiAnimation: function () {
        var bone = cc.find('liandui_ani', this.node).getComponent(sp.Skeleton);
        bone.enabled = true;
        bone.setAnimation(0, 'play', false);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
    },

    //播放炸弹特效
    playBombAnimation: function () {
        var bone = cc.find('bomb_ani', this.node).getComponent(sp.Skeleton);
        bone.enabled = true;
        bone.setAnimation(0, 'play', false);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.BOMB, false);
    },

    //播放火箭特效
    playRocketAnimation: function () {
        var bone = cc.find('rocket_ani', this.node).getComponent(sp.Skeleton);
        bone.enabled = true;
        bone.setAnimation(0, 'play', false);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.ROCKET, false);
    },

    //春天特效
    playSpring: function () {
        var bone = cc.find('spring_ani', this.node).getComponent(sp.Skeleton);
        bone.enabled = true;
        bone.setAnimation(0, 'play', false);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SPRING, false);
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
        var spine = cc.find('Canvas/root/effect_airplane').getComponent(sp.Skeleton);
        spine.enabled = true;
        spine.setAnimation(0, 'play', false);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.FEIJI, false);
    },

    //获取下一个玩家
    getNextPlayer: function (curPlayer) {
        return curPlayer + 1 < 3 ? curPlayer + 1 : 0;
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
        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();
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
                //this._uiComponents[0].sendTuoGuan();
                //cc.dd.PromptBoxUtil.show('朋友场不能托管');
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
                hall_audio_mgr.com_btn_click();
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_in');
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
                if (DDZ_Data.Instance().isEnd == true) {
                    this.backToHall();
                    return;
                }
                // 已经开始
                if (DDZ_Data.Instance().getIsStart()) {
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
                break;
            case 'next'://继续
                hall_audio_mgr.com_btn_click();
                const req = new cc.pb.room_mgr.room_prepare_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
                    'room_prepare_req', 'no');
                break;
        }
    },

    //选择分摞发牌
    onStackPoker: function (event, data) {
        var stack = parseInt(data);
        var msg = new cc.pb.doudizhu.ddz_stack_poker_req();
        msg.setStack(stack);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_stack_poker_req, msg,
            'ddz_stack_poker_req', true);
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
        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //显示玩家信息
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('nmmj_prefab_cfg');
        var view = parseInt(data);
        var playerInfo = this.getPlayerByView(view);

        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('nmmj_user_info_view');
            user_info.setData(RoomMgr.Instance().gameId,
                RoomMgr.Instance().roomId,
                RoomMgr.Instance().roomLv,
                false,
                playerInfo);
            if (RoomMgr.Instance()._Rule.gps) {
                user_info.setGpsData(DDZ_Data.Instance().playerInfo);
            }
            user_info.show();
        }.bind(this));

        // cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
        //     var user_info = ui.getComponent('user_info_view');
        //     user_info.setData(RoomMgr.Instance().gameId, RoomMgr.Instance().roomId, null, false, playerInfo);
        //     if (RoomMgr.Instance()._Rule.gps) {
        //         user_info.setGpsData(DDZ_Data.Instance().playerInfo);
        //     }
        //     user_info.show();
        // }.bind(this));
    },

    //快捷文字
    onQuickChatClick: function (event) {
        if (!this.chatCD) {
            // this.chatCD = true;
            // this.scheduleOnce(function () {
            //     this.chatCD = false;
            // }.bind(this), 2);
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
        var list = DDZ_Data.Instance().itemList;
        return list[id];
    },

    itemToPlayId(itemid) {
        var list = DDZ_Data.Instance().itemList;
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
        if (DDZ_Data.Instance().playerInfo) {
            if (data.msgtype == 1) {//短语
                var view = this.idToView(data.sendUserId);
                var sex = this.getPlayerById(data.sendUserId).sex;
                this.playSound(sex, soundType.CHAT, data.id);
                var cfg = null;
                if (sex == 1) {
                    cfg = ddz_chat_cfg.Man;
                }
                else {
                    cfg = ddz_chat_cfg.Woman;
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
        var sPos = this.getPlayerHeadPos(send);
        var ePos = this.getPlayerHeadPos(to);

        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        magic_prop.playMagicPropAni(id, sPos, ePos);
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
                            AudioManager.getInstance().onMusic(ddz_audio_cfg.GAME_MUSIC);
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
        var playerInfo = DDZ_Data.Instance().playerInfo;
        if (playerInfo == null) {
            return null;
        }
        for (var i = 0; i < playerInfo.length; i++) {
            if (playerInfo[i].userId == id) {
                return playerInfo[i];
            }
        }
        return null;
    },
    getPlayerByView: function (view) {
        var playerList = DDZ_Data.Instance().playerInfo;
        if (playerList) {
            for (var i = 0; i < playerList.length; i++) {
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
            cfg = ddz_audio_cfg.MAN;
        }
        else {
            cfg = ddz_audio_cfg.WOMAN;
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
                var random = Math.floor(Math.random() * 4);
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
                hua_da.getComponent(cc.Sprite).spriteFrame = this.jqk_sp[value - 11];
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
        this.setPoker(prefab, cardValue);
        // var value = Math.floor(cardValue / 10);
        // var flower = cardValue % 10;
        // var hua_da = prefab.getChildByName('hua_da');
        // var num = prefab.getChildByName('num');
        // var beimian = prefab.getChildByName('beimian');
        // var joker = prefab.getChildByName('joker');
        // switch (value) {
        //     case 0:
        //         beimian.active = true;
        //         break;
        //     case 3:
        //     case 4:
        //     case 5:
        //     case 6:
        //     case 7:
        //     case 8:
        //     case 9:
        //     case 10:
        //     case 11:
        //     case 12:
        //     case 13:
        //     case 14:
        //     case 16:
        //         beimian.active = false;
        //         joker.active = false;
        //         num.active = true;
        //         if (flower % 2 == 0) {
        //             num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
        //         }
        //         else {
        //             num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
        //         }
        //         hua_da.active = true;
        //         hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
        //         break;
        //     case 17:
        //         beimian.active = false;
        //         joker.active = true;
        //         num.active = false;
        //         if (flower % 2 == 0) {
        //             joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r18');
        //             hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
        //         }
        //         else {
        //             joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r19');
        //             hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
        //         }
        //         hua_da.active = true;
        //         break;
        // }
    },

    onMingpaiBtn: function (event, data) {
        var ddz_send_msg = require('ddz_send_msg');
        ddz_send_msg.sendMingpai();
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
        //     var sortcards = ddz.sortShowCards(cards);
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
        //     var sortcards = ddz.sortShowCards(list);
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
