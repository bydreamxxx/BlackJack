var audio = require('sdy_audio');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var Platform = require("Platform");
const AppCfg = require('AppConfig');
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        btn_ready: cc.Button,
        btn_invite: cc.Button,
    },

    onLoad: function () {
        this.initUI();
        RoomED.addObserver(this);
    },

    initUI: function () {
        var player = PlayerMgr.Instance().getPlayer(cc.dd.user.id);
        if(player){
            this.btn_ready.node.active = !player.ready;
        }
    },

    onDestroy: function () {
        RoomED.removeObserver(this);
    },

    onClickReady: function () {
        audio.com_btn_click();
        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().game_info.gameType );
        gameInfoPB.setRoomId( RoomMgr.Instance().game_info.roomId );
        pbData.setGameInfo( gameInfoPB );
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req,pbData,"msg_prepare_game_req", true);
    },

    onClickInvite: function () {
        audio.com_btn_click();
        // var str = this.getTextByRoomNumber() + " " + this.getTextByQuan() + " " + this.getTextByFengDing() + " " + this.getTextByWanFa();
        if (cc.sys.isNative) {
            cc.dd.native_wx.SendAppContent(RoomMgr.Instance().game_info.room_id, "【三打一】", "房间说明",  Platform.GetAppUrl(AppCfg.GAME_PID,AppCfg.PID));
        }
    },

    onEventMessage: function (event,data) {
        switch (event){
            case RoomEvent.on_room_ready:
                if(data[0].userId == cc.dd.user.id){
                    this.btn_ready.node.active = false;
                }
                break;
            default:
                break;
        }
    },
});
