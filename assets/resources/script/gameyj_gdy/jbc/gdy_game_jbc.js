
var gdy_game_pyc = require('gdy_game_pyc')
var GDY_Event = require('gdy_game_data').GDY_Event;
var gdyData = require('gdy_game_data').GDY_Data;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
cc.Class({
    extends: gdy_game_pyc,
    properties: {
        match: { default: null, type: cc.Button, tooltip: "开始按钮" },
        room_base: { default: null, type: cc.Node, tooltip: "房间底分/房间类型" },
        anim_match: { default: null, type: dragonBones.ArmatureDisplay, tooltip: "匹配中动画" },
        tuoguan: { default: null, type: cc.Node, tooltip: "托管" },
    },

    onLoad: function () {
        this._super();
        this.initBaseScore();
    },

    onDestroy: function () {
        this._super();
    },

    initBaseScore: function () {
        var name_lbl = cc.find('layer_base_score/name', this.node).getComponent(cc.Label);
        var score_lbl = cc.find('layer_base_score/base_score', this.node).getComponent(cc.Label);
        var title_str = gdyData.Instance().m_strTitle;
        var score_str = '底分: ' + gdyData.Instance().m_nBaseScore;
        name_lbl.string = title_str;
        score_lbl.string = score_str;
        cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
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
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        msg.setGameType(gameType);
        msg.setRoomId(roomId);
        msg.setRate(rate);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    /**
     * 匹配中
     */
    on_coin_room_enter: function () {
        gdyData.Instance().IsMatching = true;
        this.match.node.active = false;
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
     * 停止匹配动画
     */
    stopMatchAnim() {
        this.anim_match.node.active = false;
        //this.anim_match.stop();
    },

    /**
     * 开始游戏
     */
    onGameOpening: function () {
        gdyData.Instance().IsStart = true;
        gdyData.Instance().IsMatching = false;
        gdyData.Instance().IsEnd = true;
        this.room_base.active = false;
        this.match.node.active = false;
        this.stopMatchAnim();
    },

    /**
     * 退出房间
     */
    on_room_leave: function () {
        this.backToHall();
    },

    //返回大厅
    backToHall: function (event, data) {
        gdyData.Destroy();
        cc.dd.SceneManager.enterHall();
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
                gdyData.Instance().IsMatching = true;
                this.playMatchAnim();
            }
        }
    },

    /**
     * 托管
     */
    showTuoguan: function (data) {
        if (!data) return;
        if(data.userId == cc.dd.user.id){
            this.tuoguan.active = data.isAuto;
        }
    },

    /**
     * 回调事件
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case GDY_Event.TUOGUAN:
                this.showTuoguan(data);
                break;
            case GDY_Event.RECONNECT: //重连
                this.initBaseScore();
                break;
            case RoomEvent.on_coin_room_enter: //开始
                this.on_coin_room_enter();
                break;
            case RoomEvent.on_room_leave: //玩家离开
                this.on_room_leave();
                break;
            case RoomEvent.on_room_ready: //准备 继续
                this.on_room_ready(data[0]);
                break;
        }
    },
});


