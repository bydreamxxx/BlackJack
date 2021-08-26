var py_game_pyc = require("py_game_pyc");
var PY_Data = require("paoyao_data").PaoYao_Data;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const PY_Event = require('paoyao_data').PY_Event;
var py_send_msg = require('py_send_msg');
var jlmj_prefab = require('jlmj_prefab_cfg');

cc.Class({
    extends: py_game_pyc,

    properties: {
        match: { default: null, type: cc.Button, tooltip: "开始按钮" },
        jiabei: { default: null, type: cc.Button, tooltip: "加倍开始按钮" },
        room_base: { default: null, type: cc.Node, tooltip: "房间底分/房间类型" },
        anim_match: { default: null, type: dragonBones.ArmatureDisplay, tooltip: "匹配中动画" },
    },

    onLoad: function () {
        this._super();
        this.initLoad();
    },

    initLoad: function () {
        cc.find('prepare', this.node).active = false;
        //底分
        var score = PY_Data.getInstance().GetScore();
        var score_str = '底分: ' + score;
        cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
        this.room_base.getChildByName('base_score').getComponent(cc.Label).string = score_str;
        this.room_base.getChildByName('name').getComponent(cc.Label).string = PY_Data.getInstance().m_strTitle;
    },

    onDestroy: function () {
        this._super();
    },

    //开始按钮
    onMatch(event, target) {
        hall_audio_mgr.com_btn_click();
        this.sendGameReq();
    },

    /**
     * 匹配申请
     */
    sendGameReq: function (rate) {
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        var gameType = PY_Data.getInstance().getGameId();
        var roomId = PY_Data.getInstance().getRoomId();
        msg.setGameType(gameType);
        msg.setRoomId(roomId);
        msg.setRate(rate);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter();
                break;
            case PY_Event.COLLOCATION: //托管
                this.showTuoguan(data);
                break;
            case PY_Event.HAND_POKER: //发牌  
                this.onGameOpening();
                break;
            case RoomEvent.on_room_leave: //玩家离开
                this.on_room_leave();
                break;
            case PY_Event.RECONNECT: //重连
                this.onGameOpening();
                break;
            case RoomEvent.on_room_replace: //换桌
                this.on_room_replace(data[0]);
                break;
            case RoomEvent.on_room_ready: //准备 继续
                this.on_room_ready(data[0]);
                break;
        }
    },

    popupEnterHall: function (text, callfunc) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 2);
        }.bind(this));
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = PY_Data.getInstance().getGameId();
        var roomId = PY_Data.getInstance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    /**
     * 换桌
     */
    on_room_replace: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_POPUP_18;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_POPUP_19;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    this.popupEnterHall(str, null);
                    break;
                default:
                    break;
            }
        } else {
            PY_Data.getInstance().resetTeamInfo();
            PY_Data.getInstance().setIsMatching(true);
            PY_Data.getInstance().clear();
            this.playMatchAnim();
        }
    },

    /**
     * 准备 继续
     */
    on_room_ready: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall(str, this.backToRoomList);
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall(str, this.backToRoomList);
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall(str, null);
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                default:
                    break;
            }
        } else {
            if (msg.userId === cc.dd.user.id) {
                PY_Data.getInstance().resetTeamInfo();
                PY_Data.getInstance().setIsMatching(true);
                PY_Data.getInstance().clear();
                this.playMatchAnim();
            }
        }
    },

    /**
     * 匹配中
     */
    on_coin_room_enter: function () {
        PY_Data.getInstance().setIsMatching(true);
        this.match.node.active = false;
        this.jiabei.node.active = false;
        this.playMatchAnim();
    },

    /**
     * 播放匹配动画
    */
    playMatchAnim: function () {
        this.anim_match.node.active = true;
        this.anim_match.playAnimation('FZZPPZ', -1);
    },

    /**
     * 开始游戏
     */
    onGameOpening: function () {
        this.initLoad();
        PY_Data.getInstance().setIsStart(true);
        PY_Data.getInstance().setIsMatching(false);
        PY_Data.getInstance().setIsEnd(false);
        this.room_base.active = false;
        this.match.node.active = false;
        this.jiabei.node.active = false;
        this.stopMatchAnim();

        var players = PY_Data.getInstance().GetPlayerInfo();
        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            this._uiComponents[this.idToView(player.userId)].initPlayerInfo(player);
        }
    },


    /**
     * 退出房间
     */
    on_room_leave: function () {
        this.backToHall();
    },

    //返回大厅
    backToHall: function (event, data) {
        PY_Data.getInstance().Destroy();
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 停止匹配动画
     */
    stopMatchAnim() {
        this.anim_match.node.active = false;
        //this.anim_match.stop();
    },

    /**
     * 托管
     */
    showTuoguan: function (data) {
        if (!data) return;
        var viewid = this.idToView(data.id);
        this._uiComponents[viewid].Head().showTuoGuan(data.isTuoguan);
    },

    //取消托管
    onCancelAuto: function (event, data) {
        py_send_msg.sendTuoguan(false);
    },

    //加倍开始
    onClickjiabei : function(){
        hall_audio_mgr.com_btn_click();
        this.sendGameReq(1);
    },

});
