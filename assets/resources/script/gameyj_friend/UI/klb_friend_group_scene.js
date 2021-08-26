const club_sender = require('jlmj_net_msg_sender_club');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
var DingRobot = require('DingRobot');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var hall_prefab = require('hall_prefab_cfg');
var klb_game_list_config = require('klb_gameList');
var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        joinNode: {
            default: null,
            type: cc.Node,
            tooltip: "好友圈创建、选择、加入"
        },
        lobbyNode: {
            default: null,
            type: cc.Node,
            tooltip: "好友圈大厅"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.refreshCheckTime = 0;
        cc._wait_club_baofang_enter = null;
        cc._wait_club_baofang_list = null;
        cc._wait_all_club_list = null;

        cc.game.setFrameRate(60);

        DingRobot.set_ding_type(7);

        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }

        this.joinNode.active = false;
        this.lobbyNode.active = false;

        cc.dd.SysTools.setLandscape();
        RoomED.addObserver(this);
        club_Ed.addObserver(this);
        club_sender.requireALlClubList();
        cc.dd.UpdaterED.addObserver(this);
        SysED.addObserver(this);
        Hall.HallED.addObserver(this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        AudioManager.playMusic('gameyj_friend/audio/bgm');
    },

    onKeyDown: function (event) {
        if (event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape) {
            if (!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)) {
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function (ui) {
                    ui.getComponent('klb_friend_group_notice').show('是否要返回大厅', () => {
                        cc.back_to_club = null;
                        cc.game.setFrameRate(40);
                        clubMgr.setClubOpenCreateUITag(false);
                        club_sender.enterChatClub(clubMgr.getSelectClubId(), 2);
                        cc.dd.SceneManager.enterHall();
                    });
                }.bind(this));
            }
        }
    },

    onDestroy: function () {
        if (this.waitJoinTime) {
            clearTimeout(this.waitJoinTime);
            this.waitJoinTime = null;
        }
        cc._wait_club_baofang_enter = null;
        cc._wait_club_baofang_list = null;
        cc._wait_all_club_list = null;
        clubMgr.setClubOpenCreateUITag(false);

        club_Ed.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        cc.dd.UpdaterED.removeObserver(this);
        Hall.HallED.removeObserver(this);

        AudioManager.stopMusic();
    },

    onClickBackLobby() {
        hall_audio_mgr.com_btn_click();
        cc.back_to_club = null;
        clubMgr.setClubOpenCreateUITag(false);
        cc.game.setFrameRate(40);
        club_sender.enterChatClub(clubMgr.getSelectClubId(), 2);
        cc.dd.SceneManager.enterHall();
    },

    onClickBack() {
        hall_audio_mgr.com_btn_click();
        cc.back_to_club = null;

        this.changeToJoin();
        club_sender.requireALlClubList();
    },

    changeToLobby() {
        //聊天亲友圈
        club_sender.enterChatClub(clubMgr.getSelectClubId(), 2);
        club_sender.enterChatClub(clubMgr.getSelectClubId(), 1);

        clubMgr.setClubOpenCreateUITag(true);

        this.waitEnterLobby = false;
        cc.dd.user.clubJob = null;

        this.joinNode.active = false;
        this.lobbyNode.active = true;
        club_sender.getManagerReq(clubMgr.getSelectClubId());
        this.lobbyNode.getComponent('klb_friend_group_lobby').updateUI();
    },

    changeToJoin() {
        club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CLOSE_RED_BAG_ANIM);

        //聊天大厅
        if (clubMgr.getSelectClubId() != 0) {
            club_sender.enterChatClub(clubMgr.getSelectClubId(), 2);
            club_Ed.notifyEvent(club_Event.FRIEND_GROUP_CLEAN_CHAT);
        }
        clubMgr.setSelectClubId(0);
        clubMgr.cleanClubMember();
        clubMgr.setClubOpenCreateUITag(false);
        clubMgr.setClubCreateRoomType(0);

        cc.back_to_club = null;

        this.joinNode.active = true;
        this.lobbyNode.active = false;
        this.joinNode.getComponent('klb_friend_group_join').updateUI();
    },

    start() {

    },

    enterClub(clubId) {
        clubMgr.setSelectClubId(clubId);

        let local_result = cc.sys.localStorage.getItem('club_game_wafanum');

        if (cc.dd._.isString(local_result) && local_result != "") {
            clubMgr.setLastRoomID(parseInt(local_result));
            cc.sys.localStorage.removeItem('club_game_wafanum');

            this.waitEnterLobby = true;
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.CLUB_INIT_CLUB_LIST: //初始化俱乐部列表界面
                if (this.waitEnterLobby && clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId())) {
                    this.changeToLobby();
                } else {
                    this.changeToJoin();
                }
                break;
            case club_Event.CLUB_SAVE_CARD_SUCCESS: //存入房卡成功，刷新当前俱乐部界面
            case club_Event.CLUB_OPEN_SUCCESS://打开新的俱乐部
                this.lobbyNode.getComponent('klb_friend_group_lobby').updateUI();
                this.joinNode.getComponent('klb_friend_group_join').updateUI();
                break;
            case club_Event.CLUB_CREATE_SUCCESS: //创建俱乐部成功

                cc.dd.UIMgr.destroyUI(prefab_config.KLB_FG_CREATE_GROUP);
                this.changeToJoin();
                // this.joinNode.getComponent('klb_friend_group_join').updateUI();
                break;
            case club_Event.CLUB_kICK_PLAYER_OUT://被请出俱乐部
                if (data == cc.dd.user.id)
                    club_sender.requireALlClubList();
                // this.changeToJoin();
                // else
                // club_sender.managerClubReq(clubMgr.getSelectClubId());
                break;
            case club_Event.CLUB_OP_APPLY_PLAYER: //俱乐部解散或者退出
                if (data.opUserid == 0)
                    club_sender.requireALlClubList();
                break;
            case club_Event.CLUB_QUIT_OR_DISSOLVE: //解散或者退出俱乐部
                club_sender.requireALlClubList();
                // this.changeToJoin();
                break;
            case club_Event.CLUB_CLOSE_CREATE_UI: //关掉创建俱乐部界面
                break;
            case club_Event.FRIEND_CHANGE_LOBBY:
                this.changeToLobby();
                break;
            case RoomEvent.on_choose_seat:
                var hallRoom = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_CHOOSE);
                if (hallRoom) {
                    var choose = hallRoom.getComponent('klb_hall_Choose');
                    if (choose)
                        choose.showChooseUI(data);
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHOOSE, function (ui) {
                        var choose = ui.getComponent('klb_hall_Choose');
                        if (choose)
                            choose.showChooseUI(data);
                    });
                }
                break;
            case cc.dd.UpdaterEvent.NEW_VERSION_FOUND:
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    return;
                }
                if (cc.dd.Utils.checkIsUpdateOrWrongRoom(cc._joinUpdater.cfg.game_id)) {
                    let name = '';
                    let config = klb_game_list_config.getItem(function (item) {
                        return item.gameid == cc._joinUpdater.cfg.game_id;
                    }.bind(this));
                    if (config) {
                        name = config.name
                    }
                    // cc.dd.DialogBoxUtil.show(0, "请先在大厅更新游戏:" + name, '确定', null, function () {
                    //
                    // }.bind(this), null);

                    if (!cc.dd.UIMgr.getUI(hall_prefab.HALL_GAME_UPDATE)) {
                        cc.dd.UIMgr.openUI(hall_prefab.HALL_GAME_UPDATE, function (prefab) {
                            var update = prefab.getComponent('hall_game_update_of_dialog');
                            update.setGameID(cc._joinUpdater.cfg.game_id, name, cc._joinUpdater.roomId);
                        })
                    }
                } else {
                    cc.dd.DialogBoxUtil.show(0, "房间号错误", '确定', null, function () {

                    }.bind(this), null);
                }
                break;
            case cc.dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    return;
                }
                if (cc._join_room_updated) {
                    cc._join_room_updated();
                    cc._join_room_updated = null;
                }
                break;
            case SysEvent.RESUME:
                if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != "") {
                    this.waitJoinTime = setTimeout(() => {
                        this.waitJoinTime = null;
                        club_sender.joinClubReq(parseInt(cc.wx_enter_club_id));
                        cc.wx_enter_club_id = null;
                    }, 2000)
                } else if (this.joinNode.active) {
                    if (!cc._wait_all_club_list) {
                        club_sender.requireALlClubList();
                    }
                } else if (this.lobbyNode.active) {
                    this.waitEnterLobby = true
                    this.refreshCheckTime = 0;
                    if (!cc._wait_all_club_list) {
                        club_sender.requireALlClubList();
                        club_sender.openClub(clubMgr.getSelectClubId());
                    }
                }
                break;
            case Hall.HallEvent.GET_USERINFO:
                if (cc.sys.platform == cc.sys.MOBILE_BROWSER || cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
                    if (this.joinNode.active) {
                        if (!cc._wait_all_club_list) {
                            club_sender.requireALlClubList();
                        }
                    } else if (this.lobbyNode.active) {
                        this.waitEnterLobby = true
                        this.refreshCheckTime = 0;
                        if (!cc._wait_all_club_list) {
                            club_sender.requireALlClubList();
                            club_sender.openClub(clubMgr.getSelectClubId());
                        }
                    }
                }
                cc.dd.native_systool.getNativeScheme();
                break;
            default:
                break;
        }
    },

    update(dt) {
        if (this.refreshCheckTime > 2) {
            this.refreshCheckTime = 0;

            if (cc._wait_all_club_list === true) {
                club_sender.requireALlClubList();
            }

            if (cc._wait_club_baofang_list > 0) {
                club_sender.getClubBaoFangList(cc._wait_club_baofang_list);
            }

            if (cc.dd._.isArray(cc._wait_club_baofang_enter) && cc._wait_club_baofang_enter.length === 2) {
                club_sender.enterClubBaoFang(cc._wait_club_baofang_enter[0], cc._wait_club_baofang_enter[1]);
            }
            return;
        }

        this.refreshCheckTime += dt;
    },
});
