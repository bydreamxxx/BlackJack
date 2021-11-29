const RummyData = require("RummyData").RummyData.Instance();
const RummyGameMgr = require("RummyGameMgr");

var handler = {
    on_msg_rm_ready_ack(msg) {

    },

    on_msg_rm_action_change(msg) {

    },

    on_msg_rm_state_change_2c(msg) {
        RummyData.changeState(msg);
        RummyGameMgr.changeState();
    },

    on_msg_rm_info(msg) {
        RoomMgr.Instance().player_mgr.playerEnterGame();
        RummyData.setGameInfo(msg);
        RummyGameMgr.updateUI();
    },

    on_msg_rm_poker_ack(msg) {

    },

    on_msg_rm_deal_poker(msg) {

    },

    on_msg_rm_deal_poker_broadcast(msg) {

    },

    on_msg_rm_give_up_poker_ack(msg) {

    },

    on_msg_rm_give_up_poker_broadcast(msg) {

    },

    on_msg_rm_syn_giveup_poker(msg) {

    },

    on_msg_rm_show_ack(msg) {

    },

    on_msg_rm_commit_ack(msg) {

    },

    on_msg_rm_sort_ack(msg) {

    },

    on_msg_rm_drop_ack(msg) {

    },

    on_msg_rm_result(msg) {

    },
};

module.exports = handler;