
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [9800]:{ package_name:'msg', msg_name:'msg_rm_ready_req', name:msg.msg_rm_ready_req, func:handler.on_msg_rm_ready_req, func_name:'on_msg_rm_ready_req', logtag:'[9800:msg_rm_ready_req]' },
        [9801]:{ package_name:'msg', msg_name:'msg_rm_ready_ack', name:msg.msg_rm_ready_ack, func:handler.on_msg_rm_ready_ack, func_name:'on_msg_rm_ready_ack', logtag:'[9801:msg_rm_ready_ack]' },
        [9802]:{ package_name:'msg', msg_name:'msg_rm_action_change', name:msg.msg_rm_action_change, func:handler.on_msg_rm_action_change, func_name:'on_msg_rm_action_change', logtag:'[9802:msg_rm_action_change]' },
        [9803]:{ package_name:'msg', msg_name:'msg_rm_state_change_2c', name:msg.msg_rm_state_change_2c, func:handler.on_msg_rm_state_change_2c, func_name:'on_msg_rm_state_change_2c', logtag:'[9803:msg_rm_state_change_2c]' },
        [9804]:{ package_name:'msg', msg_name:'msg_rm_info', name:msg.msg_rm_info, func:handler.on_msg_rm_info, func_name:'on_msg_rm_info', logtag:'[9804:msg_rm_info]' },
        [9805]:{ package_name:'msg', msg_name:'msg_rm_deal_poker', name:msg.msg_rm_deal_poker, func:handler.on_msg_rm_deal_poker, func_name:'on_msg_rm_deal_poker', logtag:'[9805:msg_rm_deal_poker]' },
        [9806]:{ package_name:'msg', msg_name:'msg_rm_give_up_poker_req', name:msg.msg_rm_give_up_poker_req, func:handler.on_msg_rm_give_up_poker_req, func_name:'on_msg_rm_give_up_poker_req', logtag:'[9806:msg_rm_give_up_poker_req]' },
        [9807]:{ package_name:'msg', msg_name:'msg_rm_give_up_poker_ack', name:msg.msg_rm_give_up_poker_ack, func:handler.on_msg_rm_give_up_poker_ack, func_name:'on_msg_rm_give_up_poker_ack', logtag:'[9807:msg_rm_give_up_poker_ack]' },
        [9808]:{ package_name:'msg', msg_name:'msg_rm_syn_giveup_poker', name:msg.msg_rm_syn_giveup_poker, func:handler.on_msg_rm_syn_giveup_poker, func_name:'on_msg_rm_syn_giveup_poker', logtag:'[9808:msg_rm_syn_giveup_poker]' },
        [9809]:{ package_name:'msg', msg_name:'rm_group', name:msg.rm_group, func:handler.on_rm_group, func_name:'on_rm_group', logtag:'[9809:rm_group]' },
        [9810]:{ package_name:'msg', msg_name:'msg_rm_group_req', name:msg.msg_rm_group_req, func:handler.on_msg_rm_group_req, func_name:'on_msg_rm_group_req', logtag:'[9810:msg_rm_group_req]' },
        [9811]:{ package_name:'msg', msg_name:'msg_rm_group_ack', name:msg.msg_rm_group_ack, func:handler.on_msg_rm_group_ack, func_name:'on_msg_rm_group_ack', logtag:'[9811:msg_rm_group_ack]' },
        [9812]:{ package_name:'msg', msg_name:'msg_rm_show_req', name:msg.msg_rm_show_req, func:handler.on_msg_rm_show_req, func_name:'on_msg_rm_show_req', logtag:'[9812:msg_rm_show_req]' },
        [9813]:{ package_name:'msg', msg_name:'msg_rm_show_ack', name:msg.msg_rm_show_ack, func:handler.on_msg_rm_show_ack, func_name:'on_msg_rm_show_ack', logtag:'[9813:msg_rm_show_ack]' },
        [9814]:{ package_name:'msg', msg_name:'msg_rm_sort_req', name:msg.msg_rm_sort_req, func:handler.on_msg_rm_sort_req, func_name:'on_msg_rm_sort_req', logtag:'[9814:msg_rm_sort_req]' },
        [9815]:{ package_name:'msg', msg_name:'msg_rm_sort_ack', name:msg.msg_rm_sort_ack, func:handler.on_msg_rm_sort_ack, func_name:'on_msg_rm_sort_ack', logtag:'[9815:msg_rm_sort_ack]' },
        [9816]:{ package_name:'msg', msg_name:'msg_rm_drop_req', name:msg.msg_rm_drop_req, func:handler.on_msg_rm_drop_req, func_name:'on_msg_rm_drop_req', logtag:'[9816:msg_rm_drop_req]' },
        [9817]:{ package_name:'msg', msg_name:'msg_rm_drop_ack', name:msg.msg_rm_drop_ack, func:handler.on_msg_rm_drop_ack, func_name:'on_msg_rm_drop_ack', logtag:'[9817:msg_rm_drop_ack]' },
        [9818]:{ package_name:'msg', msg_name:'rm_result_info', name:msg.rm_result_info, func:handler.on_rm_result_info, func_name:'on_rm_result_info', logtag:'[9818:rm_result_info]' },
        [9819]:{ package_name:'msg', msg_name:'msg_rm_result', name:msg.msg_rm_result, func:handler.on_msg_rm_result, func_name:'on_msg_rm_result', logtag:'[9819:msg_rm_result]' },

    };
    module.exports = {
        name:"c_msg_rummy_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
