var RoomMgr = require("jlmj_room_mgr").RoomMgr;
let Gametype = cc.dd.Define.GameType;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var AppConfig = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');

let gameGuide = require("gameGuide");
const hallRoomEventDispatcher = require("klb_hall_RoomData").HallRoomEventDispatcher;
const hallRoomEvent = require("klb_hall_RoomData").HallRoomDataEvent;
var game_room_list = require('game_room');
let hall_prop_data = require('hall_prop_data').HallPropData;
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;
var klb_game_list_config = require('klb_gameList');
var hallData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        res: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        hallRoomEventDispatcher.addObserver(this);

        let config = gameGuide.getItemList((data) => {
            return data.isopen == 1;
        })

        if (config.length > 0) {
            let index = Math.floor(Math.random() * config.length);
            this.gameConfig = config[index];
            this.icon.spriteFrame = this.res.getSpriteFrame(this.gameConfig.image);
        }

        this.node.active = this.canShow();
    },

    onDestroy() {
        hallRoomEventDispatcher.removeObserver(this);
    },

    setActive(active) {
        this.node.active = this.canShow() && active;
    },

    start() {
        this.updater_entrance = UpdaterEntrance.COIN;
        let com_game_download = this.node.getComponentInChildren('com_game_update');
        com_game_download.updater_entrance = this.updater_entrance;
        com_game_download.node.active = true;
        com_game_download.updateUI(false);
    },

    onClick() {
        hall_audio_mgr.com_btn_click();

        this.updater = UpdateMgr.getUpdater(this.gameConfig.gameid);
        if (cc.sys.isNative && this.updater) {
            if (this.updater.updateing) {
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if (this.updater.checking) {
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id
            let com_game_download = this.node.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.gameConfig.gameid;
            com_game_download.setUpdateFinishCallback(this.onUpdateFinish.bind(this));
            com_game_download.setGameId(this.gameConfig.gameid);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            this.onUpdateFinish();
        }
    },

    onUpdateFinish() {
        AudioManager.clearBackGroundMusicKey();

        cc.go_to_xiaociji = null;

        let gameID = RoomMgr.Instance().gameId;
        switch (gameID) {
            case Gametype.CCMJ_MATCH:
                let BSC_Data = require('bsc_data').BSC_Data;
                BSC_Data.Instance().clearData();
                let ccmj_util = require("ccmj_util");
                ccmj_util.clear();
                // cc.dd.SceneManager.enterHall();
                break;
            case Gametype.CCMJ_GOLD:
                let DeskEvent = require('jlmj_desk_data').DeskEvent;
                let DeskED = require('jlmj_desk_data').DeskED;
                let msg = {};
                msg.status = 10;
                msg.gameID = this.gameConfig.gameid;
                DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
                return;
            case Gametype.DDZ_MATCH:
                let Bsc = require('bsc_data');
                Bsc.BSC_Data.Instance().clearData();
                // cc.dd.SceneManager.enterHall();
                break;
            case Gametype.DDZ_GOLD:
                let DDZ_Data = require('ddz_data').DDZ_Data;

                let sendLeaveRoom = () => {
                    cc.go_to_xiaociji = this.gameConfig.gameid;

                    var msg = new cc.pb.room_mgr.msg_leave_game_req();
                    var gameType = DDZ_Data.Instance().getGameId();
                    var roomId = DDZ_Data.Instance().getRoomId();
                    var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                    gameInfoPB.setGameType(gameType);
                    gameInfoPB.setRoomId(roomId);
                    msg.setGameInfo(gameInfoPB);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
                }

                if (DDZ_Data.Instance().getIsMatching()) {
                    // 取消匹配状态
                    sendLeaveRoom();
                    return;
                } else {
                    if (DDZ_Data.Instance().getIsStart()) {
                        // sendLeaveRoom();
                        return;
                    } else {
                        DDZ_Data.Destroy();
                        // cc.dd.SceneManager.enterHall();
                    }
                }
                break;
            case Gametype.TDK_COIN:
                var TDkCDeskData = require('tdk_coin_desk_data');
                var CDeskData = TDkCDeskData.TdkCDeskData;

                let leave_game_req = () => {
                    let tdk = cc.find('Canvas/tdk_coin_room').getComponent('tdk_coin_room_ui_new');
                    if (tdk && tdk.checkNotPlayGame()) {
                        cc.go_to_xiaociji = this.gameConfig.gameid;

                        var msg = new cc.pb.room_mgr.msg_leave_game_req();
                        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
                        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
                        msg.setGameInfo(gameInfoPB);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
                    }
                }

                if (CDeskData.Instance().IsStart) {
                    leave_game_req();
                    return;
                } else if (CDeskData.Instance().IsMatching) {
                    // 取消匹配状态
                    leave_game_req();
                    return;
                } else {
                    //     cc.dd.SceneManager.enterHall();
                }
                break;

        }

        cc.dd.NetWaitUtil.show('正在请求数据');
        var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
        protoNewRoomList.setHallGameid(this.gameConfig.gameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
            '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
    },

    canShow() {
        let gameID = RoomMgr.Instance().gameId;
        return !cc._applyForPayment && cc.game_pid < 10000 && cc.game_pid != 2 && this.gameConfig && (gameID == Gametype.CCMJ_MATCH || gameID == Gametype.DDZ_MATCH || gameID == Gametype.CCMJ_GOLD || gameID == Gametype.DDZ_GOLD || gameID == Gametype.TDK_COIN);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case hallRoomEvent.INIT_ROOM_LIST:
                this.initAndOpenRoomUI(data);
                break;
        }
    },

    initAndOpenRoomUI(data) {
        var gameItem = klb_game_list_config.getItem(function (item) {
            if (item.gameid == data.hallGameid)
                return item
        })
        if (gameItem.isxiaociji == 0) { //常规游戏
            switch (data.hallGameid) {
                case 109://疯狂拼十
                case Gametype.HBSL_GOLD://红包扫雷
                case 103: //单挑
                case 104: //飞禽走兽
                case 105: //西游记
                case 106: //幸运转盘
                    var enterfunc = function () {
                        if (data.roomlistList && data.roomlistList.length) {
                            var entermin = 0;
                            game_room_list.items.forEach(function (roomItem) {
                                if (data.hallGameid == roomItem.gameid && roomItem.roomid == data.roomlistList[0].fangjianid) {
                                    var scriptData = require('brnn_data').brnn_Data.Instance();
                                    scriptData.setData(roomItem);
                                    entermin = roomItem.entermin;
                                }
                            }.bind(this));
                            if (hall_prop_data.getInstance().getCoin() < entermin) {
                                var tipsText = '金币不足' + entermin + ',不能进入';
                                cc.dd.DialogBoxUtil.show(0, tipsText, "text33");
                            }
                            else {
                                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                msg.setGameType(data.hallGameid);
                                msg.setRoomId(data.roomlistList[0].fangjianid);
                                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                            }
                        }
                        else {
                            cc.dd.PromptBoxUtil.show('当前禁止该游戏，请联系管理员');
                        }
                    };
                    if (hallData.getInstance().gameId > 0) {    //游戏恢复
                        if (hallData.getInstance().gameId == data.hallGameid) {
                            var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                            msg.setGameType(hallData.getInstance().gameId);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                        }
                        else {
                            var itemgame = klb_game_list_config.getItem(function (item) {
                                if (item.gameid == hallData.getInstance().gameId)
                                    return item;
                            })
                            var str = '您正在[' + itemgame.name + ']房间中游戏，大约30秒后自动进入新游戏。。。'
                            cc.dd.DialogBoxUtil.show(0, str, 'backroom', 'Cancel', function () {
                                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                                msg.setGameType(hallData.getInstance().gameId);
                                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                            }, null);
                            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
                        }
                    }
                    else {
                        enterfunc();
                    }
                    break;
                case 136://新斗三张
                    cc.dd.UIMgr.openUI('blackjack_teenpatti/common/prefab/new_dsz_hall_Room', function (prefab) {
                        var Component = prefab.getComponent('new_dsz_hall_room');
                        Component.initRoomUI(data);
                    });
                    break;
                case 138://捕鱼
                    cc.dd.UIMgr.openUI('gameyj_fish/prefabs/fish_hall_Room', function (prefab) {
                        var Component = prefab.getComponent('gameyj_Fish_Room');
                        Component.initRoomUI(data);
                    });
                    break;
                default:
                    switch (AppConfig.GAME_PID) {
                        case 2: //快乐吧麻将
                        case 3: //快乐吧农安麻将
                        case 4:  //快乐吧填大坑
                        case 5:  //快乐吧牛牛
                            {
                                cc.dd.UIMgr.openUI(hall_prefab.KLB_DL_HALL_ROOM, function (prefab) {
                                    var Component = prefab.getComponent('klb_hall_Room');
                                    Component.initRomUI(data);
                                });
                                break;
                            }
                        default:
                            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_ROOM, function (prefab) {
                                var Component = prefab.getComponent('klb_hall_Room');
                                Component.initRomUI(data);
                            });
                    }
                    break;
            }
        } else {
            var entermin = null;
            game_room_list.items.forEach(function (roomItem) {
                if (data.hallGameid == roomItem.gameid) {
                    if (entermin == null)
                        entermin = roomItem.entermin;
                    else
                        entermin = Math.min(entermin, roomItem.entermin);
                }
            }.bind(this));
            if (hall_prop_data.getInstance().getCoin() < entermin) {
                var tipsText = '金币不足' + entermin + ',不能进入';
                cc.dd.DialogBoxUtil.show(0, tipsText, "text33");
            }
            else {
                var gSlotMgr = require('SlotManger').SlotManger.Instance();
                gSlotMgr.enterGame(gameItem.gameid, 0);
            }
        }
    }
});
