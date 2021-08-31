var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
const nn_data = require('nn_data');

var dd = cc.dd;

cc.Class({
    extends: cc.Component,

    properties: {
        time: { default: null, type: cc.Label, tooltip: "时间" },
    },


    onDestroy: function () {
        this.stopTime();
        RoomED.removeObserver(this);
    },

    // use this for initialization
    onLoad: function () {
        RoomED.addObserver(this);
    },

    init: function () {

    },

    /**
     * 开始倒计时
     */
    startTime: function () {
        var timeout = 15;
        this.time.string = timeout;
        this.timeFunc = setInterval(function () {
            if (timeout < 0) {
                this.stopTime();
                this.sendLeaveRoom();
            } else {
                this.time.string = timeout.toString();
            }
            --timeout;
        }.bind(this), 1000);
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        if (this.node.active) {
            var msg = new cc.pb.room_mgr.msg_leave_game_req();
            var gameType = nn_data.Instance().getGameId();
            var roomId = nn_data.Instance().getRoomId();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(gameType);
            gameInfoPB.setRoomId(roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
        }
    },

    /**
     * 准备
     */
    sendReady: function () {
        if (!this.CD) {
            this.CD = true;
            this.scheduleOnce(function () {
                this.CD = false;
            }.bind(this), 1);
            var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(nn_data.Instance().getGameId());
            gameInfoPB.setRoomId(nn_data.Instance().getRoomId());
            pbData.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);
        }
        //todo:清空桌面
        //this.clearPlayerList(false);
    },



    /**
     * 发送换桌协议
     */
    sendReplaceDesktop: function () {
        //todo:清空桌面
        //this.clearPlayerList(false);
        if (!this.CD) {
            this.CD = true;
            this.scheduleOnce(function () {
                this.CD = false;
            }.bind(this), 1);
            var pbData = new cc.pb.room_mgr.msg_change_room_req();
            pbData.setGameType(nn_data.Instance().getGameId());
            pbData.setRoomCoinId(nn_data.Instance().getRoomId());
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
        }
    },


    stopTime: function () {
        if (this.timeFunc) {
            clearInterval(this.timeFunc);
            this.timeFunc = null;
        }
    },


    /**
     * 下一局游戏
     */
    nextGame: function () {
        this.stopTime();
        this.sendReady();
    },

    /**
     * 分享
     */
    share: function () {

    },

    /**
     * 换桌
     */
    huanzhuo: function () {
        this.stopTime();
        this.sendReplaceDesktop();
    },

    on_room_ready: function (msg) {
        if (msg.userId === cc.dd.user.id) {
            cc.find('next', this.node).active = false;
            this.node.active = false;
        }
    },

    on_room_replace: function () {
        cc.find('next', this.node).active = false;
        this.node.active = false;
    },

    /**
     * 事件接收
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.on_room_ready:
                this.on_room_ready(data[0]);
                break;
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
        }

    },

});
