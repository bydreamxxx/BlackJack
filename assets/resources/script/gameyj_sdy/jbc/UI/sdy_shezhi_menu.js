
var audio = require('sdy_audio');
var jlmj_prefab = require('jlmj_prefab_cfg');
var jlmj_layer_zorder = require("jlmj_layer_zorder");
var RoomData = require('sdy_room_data').RoomData;
var RoomEvent = require('sdy_room_data').RoomEvent;
var RoomED = require('sdy_room_data').RoomED;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        touchNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart.bind(this));
    },

    /**
     * 触摸
     */
    touchStart:function (event) {
        if(!this.node.active){
            return false;
        }
        if (!this.touchNode.getBoundingBoxToWorld().contains(event.touch.getLocation())) {
            this.closeBtnCallBack();
        }
    },

    /**
     * 关闭
     */
    closeBtnCallBack:function () {
        cc.dd.UIMgr.closeUI(this.node);
    },

    /**
     * 退出
     */
    exitBtnCallBack:function () {
        audio.com_btn_click();

        // if(!RoomData.Instance().matching){
        //     RoomData.Instance().clear();
        //     PlayerMgr.Instance().clear();
        //     RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_LEAVEGAME, null);
        //     cc.dd.SceneManager.replaceScene("kuaileba_hall");
        //     return;
        // }

        if(RoomData.Instance().isFriendRoom() && RoomData.Instance().game_started){ //朋友场开始后申请解散
            var msg = new cc.pb.sdy.msg_sdy_dissolve_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_dissolve_req,msg,"msg_sdy_dissolve_req", true);
        }else{ //朋友场未开始 金币场
            var msg = new cc.pb.room_mgr.msg_leave_game_req();

            var gameType = RoomData.Instance().game_type;
            var roomId = RoomData.Instance().room_lv;
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType( gameType );
            gameInfoPB.setRoomId( roomId );

            msg.setGameInfo( gameInfoPB );

            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req,msg,"msg_leave_game_req", true);
        }

        this.closeBtnCallBack();
    },

    /**
     * 托管
     */
    guizeBtnCallBack:function () {
        audio.com_btn_click();
        var msg = new cc.pb.sdy.msg_sdy_auto_req();
        msg.setType(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_auto_req,msg,'msg_sdy_auto_req',true);
        this.closeBtnCallBack();
    },

    /**
     *设置
     */
    shezhiBtnCallBack:function () {
        audio.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_sdy/jbc/prefab/sdy_shezhi');
        this.closeBtnCallBack();
    },

});
