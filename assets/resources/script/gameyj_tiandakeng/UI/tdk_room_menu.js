var dd = cc.dd;
var tdk = dd.tdk;

var hall_audio_mgr = require('hall_audio_mgr').Instance();
var Define = require('Define');
var TDkCDeskData = require('tdk_coin_desk_data');
var CDeskData = TDkCDeskData.TdkCDeskData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var jlmj_prefab = require('jlmj_prefab_cfg');
var tdkSend = require('jlmj_net_msg_sender_tdk');
var TdkCPlayerData = require('tdk_coin_player_data');
var CPlayerData = TdkCPlayerData.TdkCPlayerMgrData;

cc.Class({
    extends: cc.Component,

    properties: {
        clickCallback: null,
        createNode: { default: null, type: cc.Node, tooltip: '创建界面' },
    },


    onLoad: function () {
        this.roomNode = cc.find('Canvas/tdk_coin_room');
        if (this.roomNode) {
            this.roomRoot = this.roomNode.getComponent('tdk_coin_room_ui_new');
        }
    },

    //btns点击
    onButtonClick: function (event, data) {
        cc.log("------------ btns: ", event.target.name);
        switch (data) {
            case 'tuoguan'://托管
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.roomNode).active = false;
                this.roomRoot.menu_show = false;
                cc.find('room_info/xiala', this.roomNode).getComponent(cc.Button).interactable = true;
                var roomtype = RoomMgr.Instance().gameId;
                if (roomtype == Define.GameType.TDK_FRIEND ||
                    roomtype == Define.GameType.TDK_FRIEND_LIU) {
                    return;
                }
                //托管协议
                //tdkSend.onTuoGuan(true);
                break;
            case 'setting'://设置
                hall_audio_mgr.com_btn_click();
                cc.find('setting', this.roomNode).active = true;
                cc.find('menu', this.roomNode).active = false;
                this.roomRoot.menu_show = false;
                cc.find('room_info/xiala', this.roomNode).getComponent(cc.Button).interactable = true;
                break;
            case 'wanfa': //玩法
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.roomNode).active = false;
                this.roomRoot.menu_show = false;
                cc.find('room_info/xiala', this.roomNode).getComponent(cc.Button).interactable = true;
                if (this.createNode) {
                    this.createNode.active = true;
                    var gameid = RoomMgr.Instance().gameId;
                    
                    this.createNode.getComponent('klb_hall_CreateRoom').showGameList(gameid, true);
                    var ani = this.createNode.getChildByName('actionnode').getComponent(cc.Animation);
                    ani.play('klb_hall_createRoom');
                }
                break;
            case 'rank'://退出
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.roomNode).active = false;
                this.roomRoot.menu_show = false;
                cc.find('room_info/xiala', this.roomNode).getComponent(cc.Button).interactable = true;
                var roomtype = RoomMgr.Instance().gameId;
                cc.log('退出------roomtype :', roomtype);
                if (roomtype == Define.GameType.TDK_FRIEND ||
                    roomtype == Define.GameType.TDK_FRIEND_LIU) {
                    var content = "";
                    var callfunc = null;

                    var role = CPlayerData.Instance().getUserById(cc.dd.user.id);
                    if (!role) {
                        this.leave_game_req();
                        return;
                    }

                    //已经结束
                    if (CDeskData.Instance().isEnd) {
                        this.backToHall();
                        return;
                    }

                    // 已经开始
                    if (CDeskData.Instance().IsStart) {
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
                } else if (roomtype == Define.GameType.TDK_COIN) {
                    if (CDeskData.Instance().IsStart) {
                        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                            ui.getComponent("jlmj_popup_view").show('正在游戏中，是否退出?', this.leave_game_req, 1);
                        }.bind(this));
                    } else if (CDeskData.Instance().IsMatching) {
                        // 取消匹配状态
                        this.leave_game_req();
                    } else {
                        this.backToHall();
                    }
                }
                break;
        }
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
    leave_game_req: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    /**
     * 解散房间二次确认
     */
    popupOKcancel: function (text, callfunc) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 1);
        }.bind(this));
    },

    //返回大厅
    backToHall: function (event, data) {
        cc.dd.SceneManager.enterHall();
    },

    onDestroy: function () {
    },
});
