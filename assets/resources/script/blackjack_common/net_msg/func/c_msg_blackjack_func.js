
    const msg = {};
    var handler = require('net_handler_blackjack');
    var recvFuncs = {
        [9600]:{ package_name:'msg', msg_name:'msg_bj_ready_req', name:msg.msg_bj_ready_req, func:handler.on_msg_bj_ready_req, func_name:'on_msg_bj_ready_req', logtag:'[9600:msg_bj_ready_req]' },
        [9601]:{ package_name:'msg', msg_name:'msg_bj_ready_ack', name:msg.msg_bj_ready_ack, func:handler.on_msg_bj_ready_ack, func_name:'on_msg_bj_ready_ack', logtag:'[9601:msg_bj_ready_ack]' },
        [9602]:{ package_name:'msg', msg_name:'msg_bj_action_change', name:msg.msg_bj_action_change, func:handler.on_msg_bj_action_change, func_name:'on_msg_bj_action_change', logtag:'[9602:msg_bj_action_change]' },
        [9603]:{ package_name:'msg', msg_name:'msg_bj_state_change_2c', name:msg.msg_bj_state_change_2c, func:handler.on_msg_bj_state_change_2c, func_name:'on_msg_bj_state_change_2c', logtag:'[9603:msg_bj_state_change_2c]' },
        [9604]:{ package_name:'msg', msg_name:'msg_bj_dissolve_agree_req', name:msg.msg_bj_dissolve_agree_req, func:handler.on_msg_bj_dissolve_agree_req, func_name:'on_msg_bj_dissolve_agree_req', logtag:'[9604:msg_bj_dissolve_agree_req ]' },
        [9605]:{ package_name:'msg', msg_name:'msg_bj_dissolve_agree_ack', name:msg.msg_bj_dissolve_agree_ack, func:handler.on_msg_bj_dissolve_agree_ack, func_name:'on_msg_bj_dissolve_agree_ack', logtag:'[9605:msg_bj_dissolve_agree_ack ]' },
        [9606]:{ package_name:'msg', msg_name:'msg_bj_dissolve_agree_result', name:msg.msg_bj_dissolve_agree_result, func:handler.on_msg_bj_dissolve_agree_result, func_name:'on_msg_bj_dissolve_agree_result', logtag:'[9606:msg_bj_dissolve_agree_result ]' },
        [9607]:{ package_name:'msg', msg_name:'msg_bj_info', name:msg.msg_bj_info, func:handler.on_msg_bj_info, func_name:'on_msg_bj_info', logtag:'[9607:msg_bj_info]' },
        [9608]:{ package_name:'msg', msg_name:'bj_bet_info', name:msg.bj_bet_info, func:handler.on_bj_bet_info, func_name:'on_bj_bet_info', logtag:'[9608:bj_bet_info]' },
        [9609]:{ package_name:'msg', msg_name:'bj_user_info', name:msg.bj_user_info, func:handler.on_bj_user_info, func_name:'on_bj_user_info', logtag:'[9609:bj_user_info]' },
        [9610]:{ package_name:'msg', msg_name:'msg_bj_deal_poker', name:msg.msg_bj_deal_poker, func:handler.on_msg_bj_deal_poker, func_name:'on_msg_bj_deal_poker', logtag:'[9610:msg_bj_deal_poker]' },
        [9611]:{ package_name:'msg', msg_name:'msg_bj_bet_req', name:msg.msg_bj_bet_req, func:handler.on_msg_bj_bet_req, func_name:'on_msg_bj_bet_req', logtag:'[9611:msg_bj_bet_req]' },
        [9612]:{ package_name:'msg', msg_name:'msg_bj_bet_ret', name:msg.msg_bj_bet_ret, func:handler.on_msg_bj_bet_ret, func_name:'on_msg_bj_bet_ret', logtag:'[9612:msg_bj_bet_ret]' },
        [9613]:{ package_name:'msg', msg_name:'bj_result_info', name:msg.bj_result_info, func:handler.on_bj_result_info, func_name:'on_bj_result_info', logtag:'[9613:bj_result_info]' },
        [9614]:{ package_name:'msg', msg_name:'msg_bj_result', name:msg.msg_bj_result, func:handler.on_msg_bj_result, func_name:'on_msg_bj_result', logtag:'[9614:msg_bj_result]' },
        [9615]:{ package_name:'msg', msg_name:'msg_bj_result_all_2c', name:msg.msg_bj_result_all_2c, func:handler.on_msg_bj_result_all_2c, func_name:'on_msg_bj_result_all_2c', logtag:'[9615:msg_bj_result_all_2c ]' },

    };
    module.exports = {
        name:"c_msg_blackjack_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
