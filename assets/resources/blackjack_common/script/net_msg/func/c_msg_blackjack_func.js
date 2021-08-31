
    const msg = {};
    var handler = require('net_handler_horse_racing');
    var recvFuncs = {
        [9500]:{ package_name:'msg', msg_name:'msg_bj_state_change_2c', name:msg.msg_bj_state_change_2c, func:handler.on_msg_bj_state_change_2c, func_name:'on_msg_bj_state_change_2c', logtag:'[9500:msg_bj_state_change_2c]' },
        [9501]:{ package_name:'msg', msg_name:'msg_bj_info', name:msg.msg_bj_info, func:handler.on_msg_bj_info, func_name:'on_msg_bj_info', logtag:'[9501:msg_bj_info]' },
        [9502]:{ package_name:'msg', msg_name:'bj_bet_info', name:msg.bj_bet_info, func:handler.on_bj_bet_info, func_name:'on_bj_bet_info', logtag:'[9502:bj_bet_info]' },
        [9503]:{ package_name:'msg', msg_name:'bj_user_info', name:msg.bj_user_info, func:handler.on_bj_user_info, func_name:'on_bj_user_info', logtag:'[9503:bj_user_info]' },
        [9504]:{ package_name:'msg', msg_name:'msg_bj_deal_poker', name:msg.msg_bj_deal_poker, func:handler.on_msg_bj_deal_poker, func_name:'on_msg_bj_deal_poker', logtag:'[9504:msg_bj_deal_poker]' },
        [9505]:{ package_name:'msg', msg_name:'msg_bj_action_change', name:msg.msg_bj_action_change, func:handler.on_msg_bj_action_change, func_name:'on_msg_bj_action_change', logtag:'[9505:msg_bj_action_change]' },
        [9506]:{ package_name:'msg', msg_name:'msg_bj_bet_req', name:msg.msg_bj_bet_req, func:handler.on_msg_bj_bet_req, func_name:'on_msg_bj_bet_req', logtag:'[9506:msg_bj_bet_req]' },
        [9507]:{ package_name:'msg', msg_name:'msg_bj_bet_ret', name:msg.msg_bj_bet_ret, func:handler.on_msg_bj_bet_ret, func_name:'on_msg_bj_bet_ret', logtag:'[9507:msg_bj_bet_ret]' },
        [9508]:{ package_name:'msg', msg_name:'bj_result_info', name:msg.bj_result_info, func:handler.on_bj_result_info, func_name:'on_bj_result_info', logtag:'[9508:bj_result_info]' },
        [9509]:{ package_name:'msg', msg_name:'msg_bj_result', name:msg.msg_bj_result, func:handler.on_msg_bj_result, func_name:'on_msg_bj_result', logtag:'[9509:msg_bj_result]' },

    };
    module.exports = {
        name:"c_msg_blackjack_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
