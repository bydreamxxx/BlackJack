var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AutomaticRobMgr = require('hbslData').AutomaticRobMgr;
const HBSL_ED = require('hbslData').HBSL_ED;
const HBSL_Event = require('hbslData').HBSL_Event;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require('Define');

cc.Class({
    extends: cc.Component,
    properties: {
        jinbiNode: { type: cc.Node, default: null, tooltip: "金币" },
        pengyouNode: { type: cc.Node, default: null, tooltip: "朋友" }
    },
    onLoad: function () {
    },

    onDestroy: function () {
    },

    init: function () {
        var bl = RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL;
        this.jinbiNode.active = !bl;
        this.pengyouNode.active = bl;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            AutomaticRobMgr.Instance().addHbMoney(10);
            AutomaticRobMgr.Instance().addHbMoney(20);
            AutomaticRobMgr.Instance().addHbMoney(30);
            AutomaticRobMgr.Instance().addHbMoney(40);
            AutomaticRobMgr.Instance().addHbMoney(50);
        } else {
            AutomaticRobMgr.Instance().addHbMoney(1);
            AutomaticRobMgr.Instance().addHbMoney(3);
            AutomaticRobMgr.Instance().addHbMoney(5);
            AutomaticRobMgr.Instance().addHbMoney(10);
            AutomaticRobMgr.Instance().addHbMoney(20);
        }
        this.RobNum = 20;
    },

    /**
     * 抢包金额
     */
    onClickMoney: function (target, data) {
        hall_audio_mgr.com_btn_click();
        var num = parseInt(data);
        if (num < 0) return;
        if (target.isChecked)
            AutomaticRobMgr.Instance().addHbMoney(num);
        else
            AutomaticRobMgr.Instance().deleteHbMoney(num);

    },

    /**
     * 抢包次数
     */
    onClickNum: function (target, data) {
        hall_audio_mgr.com_btn_click();
        var num = parseInt(data);
        if (target.isChecked)
            this.RobNum = num;
    },

    onColse: function () {
        hall_audio_mgr.com_btn_click();
        this.node.removeFromParent();
        this.node.destroy();
    },

    /**
     * 确定
     */
    onqueding: function () {
        hall_audio_mgr.com_btn_click();
        AutomaticRobMgr.Instance().setRobNum(this.RobNum);
        HBSL_ED.notifyEvent(HBSL_Event.OPEN_WUXIAN);
        this.node.removeFromParent();
        this.node.destroy()
    },
});