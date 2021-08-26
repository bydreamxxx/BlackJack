/**
 * Created by luke on 2018/12/5
 */
let sender = require('net_sender_suoha');
let hall_audio_mgr = require('hall_audio_mgr').Instance();
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let sh_Data = require('sh_data').sh_Data;
const OP_TYPE = {
    discard: 0x0001,
    pass: 0x0002,
    showhand: 0x0004,
    add: 0x0008,
    follow: 0x0010,
    opencard: 0x0020,
    GAME: 0xFFFF,
    RESULT: 0x0000,
    EXCHANGE: 0xEEEE,
};

cc.Class({
    extends: cc.Component,

    properties: {
        game_node: cc.Node,
        addbet_node: cc.Node,
        result_node: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        RoomED.addObserver(this);
    },

    onDestroy() {
        RoomED.removeObserver(this);
    },
    // start () {},

    showOp(type, mask) {
        switch (type) {
            case OP_TYPE.GAME:
                this.game_node.active = true;
                this.result_node.active = false;
                cc.find('bar', this.game_node).active = false;
                cc.find('discard', this.game_node).active = ((mask & OP_TYPE.discard) > 0);
                cc.find('pass', this.game_node).active = ((mask & OP_TYPE.pass) > 0);
                cc.find('layout/showhand', this.game_node).active = ((mask & OP_TYPE.showhand) > 0);
                cc.find('layout/add', this.game_node).active = ((mask & OP_TYPE.add) > 0);
                cc.find('follow', this.game_node).active = ((mask & OP_TYPE.follow) > 0);
                cc.find('layout/opencard', this.game_node).active = ((mask & OP_TYPE.opencard) > 0);
                break;
            case OP_TYPE.RESULT:
                this.game_node.active = false;
                this.addbet_node.active = false;
                this.result_node.active = true;
                cc.find('continue', this.result_node).active = true;
                cc.find('timer', this.result_node).active = true;
                break;
            case OP_TYPE.EXCHANGE:
                this.game_node.active = false;
                this.addbet_node.active = false;
                this.result_node.active = true;
                cc.find('continue', this.result_node).active = false;
                cc.find('timer', this.result_node).active = false;
                break;
        }
        this.node.getComponent(cc.Animation).play('show_op');
    },

    hideOp() {
        this.node.getComponent(cc.Animation).play('hide_op');
    },

    //弃牌
    discard() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.disCard();
    },

    //过
    pass() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.Pass();
    },

    //梭哈
    showhand() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.showHand();
    },

    //加注
    add() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        if (sh_Data.Instance().isFriendGold == true) {
            let show = cc.find('bar', this.game_node).active;
            cc.find('bar', this.game_node).active = !show;
        }
        else {
            this.game_node.active = false;
            this.addbet_node.active = true;
        }
    },

    //跟注
    follow() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.Call();
    },

    //开牌
    opencard() {
        if (this._opCD)
            return;
        this.opCoolDown();
        hall_audio_mgr.com_btn_click();
        sender.openCard();
    },


    opCoolDown() {
        this._opCD = true;
        setTimeout(() => {
            this._opCD = false;
        }, 500);
    },

    //换桌
    exchange() {
        hall_audio_mgr.com_btn_click();
        this.stopTime();
        if (!this.CD) {
            this.CD = true;
            cc.find('exchange', this.result_node).active = false;
            this.scheduleOnce(function () {
                cc.find('exchange', this.result_node).active = true;
                this.CD = false;
            }.bind(this), 5);
            var pbData = new cc.pb.room_mgr.msg_change_room_req();
            pbData.setGameType(sh_Data.Instance().getGameId());
            pbData.setRoomCoinId(sh_Data.Instance().getRoomId());
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
        }
    },

    //继续
    continue() {
        hall_audio_mgr.com_btn_click();
        this.stopTime();
        if (!this.CD) {
            this.CD = true;
            this.scheduleOnce(function () {
                this.CD = false;
            }.bind(this), 1);
            var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(sh_Data.Instance().getGameId());
            gameInfoPB.setRoomId(sh_Data.Instance().getRoomId());
            pbData.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);
        }
    },

    startTime: function () {
        var timeout = 15;
        timelbl = cc.find('timer', this.result_node).getComponent(cc.Label);
        timelbl.string = timeout.toString();
        this.timeFunc = setInterval(function () {
            if (timeout < 0) {
                this.stopTime();
                this.sendLeaveRoom();
            } else {
                timelbl.string = timeout.toString();
            }
            --timeout;
        }.bind(this), 1000);
    },

    stopTime: function () {
        if (this.timeFunc) {
            clearInterval(this.timeFunc);
            this.timeFunc = null;
        }
    },

    sendLeaveRoom: function () {
        if (this.result_node.active) {
            var msg = new cc.pb.room_mgr.msg_leave_game_req();
            var gameType = sh_Data.Instance().getGameId();
            var roomId = sh_Data.Instance().getRoomId();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(gameType);
            gameInfoPB.setRoomId(roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
        }
    },

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

    on_room_ready: function (msg) {
        if (msg.userId === cc.dd.user.id) {
            this.hideOp();
        }
    },

    on_room_replace: function () {
        this.hideOp();
    },
});
