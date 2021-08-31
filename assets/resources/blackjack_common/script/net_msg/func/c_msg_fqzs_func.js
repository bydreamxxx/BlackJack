
    const msg = {};
    var handler = require('net_handler_fqzs');
    var recvFuncs = {
        [7400]:{ package_name:'msg', msg_name:'msg_fqzs_info', name:msg.msg_fqzs_info, func:handler.on_msg_fqzs_info, func_name:'on_msg_fqzs_info', logtag:'[7400:msg_fqzs_info]' },
        [7401]:{ package_name:'msg', msg_name:'fqzs_bet_info', name:msg.fqzs_bet_info, func:handler.on_fqzs_bet_info, func_name:'on_fqzs_bet_info', logtag:'[7401:fqzs_bet_info]' },
        [7402]:{ package_name:'msg', msg_name:'fqzs_record_info', name:msg.fqzs_record_info, func:handler.on_fqzs_record_info, func_name:'on_fqzs_record_info', logtag:'[7402:fqzs_record_info]' },
        [7403]:{ package_name:'msg', msg_name:'fqzs_user_info', name:msg.fqzs_user_info, func:handler.on_fqzs_user_info, func_name:'on_fqzs_user_info', logtag:'[7403:fqzs_user_info]' },
        [7404]:{ package_name:'msg', msg_name:'msg_fqzs_bet_req', name:msg.msg_fqzs_bet_req, func:handler.on_msg_fqzs_bet_req, func_name:'on_msg_fqzs_bet_req', logtag:'[7404:msg_fqzs_bet_req]' },
        [7405]:{ package_name:'msg', msg_name:'msg_fqzs_bet_ret', name:msg.msg_fqzs_bet_ret, func:handler.on_msg_fqzs_bet_ret, func_name:'on_msg_fqzs_bet_ret', logtag:'[7405:msg_fqzs_bet_ret]' },
        [7406]:{ package_name:'msg', msg_name:'msg_fqzs_bet_area_update', name:msg.msg_fqzs_bet_area_update, func:handler.on_msg_fqzs_bet_area_update, func_name:'on_msg_fqzs_bet_area_update', logtag:'[7406:msg_fqzs_bet_area_update]' },
        [7407]:{ package_name:'msg', msg_name:'msg_fqzs_state_update', name:msg.msg_fqzs_state_update, func:handler.on_msg_fqzs_state_update, func_name:'on_msg_fqzs_state_update', logtag:'[7407:msg_fqzs_state_update]' },
        [7408]:{ package_name:'msg', msg_name:'fqzs_result_info', name:msg.fqzs_result_info, func:handler.on_fqzs_result_info, func_name:'on_fqzs_result_info', logtag:'[7408:fqzs_result_info]' },
        [7409]:{ package_name:'msg', msg_name:'msg_fqzs_result', name:msg.msg_fqzs_result, func:handler.on_msg_fqzs_result, func_name:'on_msg_fqzs_result', logtag:'[7409:msg_fqzs_result]' },

    };
    module.exports = {
        name:"c_msg_fqzs_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
