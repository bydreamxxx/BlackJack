

var HBSL_Data = require("hbslData").HBSL_Data;
const HBSL_ED = require('hbslData').HBSL_ED;
const HBSL_Event = require('hbslData').HBSL_Event;

var hanlder = {
    /**
     * 桌子消息
     */
    on_hb_desk: function (msg) {
        HBSL_Data.Instance().setDeskData(msg);
    },

    /**
     * 广播抢红包玩家
     */
    on_msg_hb_get_notify: function (msg) {
        HBSL_Data.Instance().addSaoLeiPlyaer(msg.role);
    },

    /**
     * 抢红包回调消息
     */
    on_msg_hb_get_ack: function (msg) {
        if (!msg) return;
        var str = '';
        switch (msg.code) {
            case 0:
                HBSL_Data.Instance().addSelfPlayer(msg);
                return;
            case 1:
                str = '金币不足！';
                break;
            case 2:
                str = '红包已抢光!'
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
    },

    /**
     * 埋雷玩家列表
     */
    on_msg_hb_list_ack: function (msg) {
        HBSL_Data.Instance().pullMaiLeiData(msg);
    },

    /**
     * 埋红包
     */
    on_msg_hb_set_ack: function (msg) {
        HBSL_ED.notifyEvent(HBSL_Event.PLAYER_MAIHB, msg);
    },

    /**
     * 开奖
     */
    on_msg_hb_open_notify: function (msg) {
        HBSL_Data.Instance().updateSettlement(msg);
    },

    /**
     * 大结算
     */
    on_HbFinalResult: function (msg) {
        HBSL_ED.notifyEvent(HBSL_Event.SETTLEMENT, msg);
    },

    //解散返回
    on_room_dissolve_agree_ack: function (msg) {
        HBSL_ED.notifyEvent(HBSL_Event.DISSOLVE, msg);
    },

    //解散结果
    on_room_dissolve_agree_result: function (msg) {
        HBSL_ED.notifyEvent(HBSL_Event.DISSOLVE_RESULT, msg);
    },

};
module.exports = hanlder;