const RummyData = require("RummyData").RummyData.Instance();

var handler = {
    on_msg_rm_ready_ack(msg) {

    },

    on_msg_rm_action_change(msg) {

    },

    on_msg_rm_state_change_2c(msg) {
        RummyData.changeState(msg);
    },

    on_msg_rm_info(msg) {
        RummyData.setGameInfo(msg);
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