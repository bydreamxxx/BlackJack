var gdy_data = require("gdy_game_data").GDY_Data;
const GDY_ED = require('gdy_game_data').GDY_ED;
const GDY_Event = require('gdy_game_data').GDY_Event;
module.exports = {

    /**
     * 桌子协议
     */
    on_gdy_desk: function (msg) {
        gdy_data.Instance().setDeskData(msg);
        GDY_ED.notifyEvent(GDY_Event.DESK_INIT, msg);
    },

    /**
     * 发牌
     */
    on_msg_gdy_send_poker: function (msg) {
        gdy_data.Instance().setSendPoker(msg);
        GDY_ED.notifyEvent(GDY_Event.HAND_POKER, msg);
    },

    /**
     * 玩家操作返回
     */
    on_msg_gdy_act_ack: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.ACT_ACK, msg);
    },

    /**
     * 改变倍数
     */
    on_msg_gdy_rate_notify : function(msg){
        GDY_ED.notifyEvent(GDY_Event.CHANGE_RATE, msg.rate);
    },

    /**
     * 小结算
     */
    on_msg_gdy_result: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.RESULT_RET, msg);
    },

    /**
     * 大结算
     */
    on_msg_gdy_final_result: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.TOTAL_RESULT, msg);
    },

    /**
     * 托管
     */
    on_msg_gdy_tuoguan_change: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.TUOGUAN, msg);
    },

    /**
     * 玩家被关状态改变
     */
    on_msg_gdy_guan_change: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.CHANGE_GUAN, msg);
    },

    /**
     * 准备返回
     */
    on_room_prepare_ack: function (msg) {
        gdy_data.Instance().setRoomReady(msg);
    },

    //解散返回
    on_room_dissolve_agree_ack: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.DISSOLVE, msg);
    },

    //解散结果
    on_room_dissolve_agree_result: function (msg) {
        GDY_ED.notifyEvent(GDY_Event.DISSOLVE_RESULT, msg);
    },
}