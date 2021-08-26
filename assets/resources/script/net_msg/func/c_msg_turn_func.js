
    const msg = {};
    var handler = require('net_handler_turntable');
    var recvFuncs = {
        [9300]:{ package_name:'msg', msg_name:'msg_turn_info', name:msg.msg_turn_info, func:handler.on_msg_turn_info, func_name:'on_msg_turn_info', logtag:'[9300:msg_turn_info]' },
        [9301]:{ package_name:'msg', msg_name:'turn_bet_info', name:msg.turn_bet_info, func:handler.on_turn_bet_info, func_name:'on_turn_bet_info', logtag:'[9301:turn_bet_info]' },
        [9302]:{ package_name:'msg', msg_name:'turn_record_info', name:msg.turn_record_info, func:handler.on_turn_record_info, func_name:'on_turn_record_info', logtag:'[9302:turn_record_info]' },
        [9303]:{ package_name:'msg', msg_name:'turn_user_info', name:msg.turn_user_info, func:handler.on_turn_user_info, func_name:'on_turn_user_info', logtag:'[9303:turn_user_info]' },
        [9304]:{ package_name:'msg', msg_name:'msg_turn_bet_req', name:msg.msg_turn_bet_req, func:handler.on_msg_turn_bet_req, func_name:'on_msg_turn_bet_req', logtag:'[9304:msg_turn_bet_req]' },
        [9305]:{ package_name:'msg', msg_name:'msg_turn_bet_ret', name:msg.msg_turn_bet_ret, func:handler.on_msg_turn_bet_ret, func_name:'on_msg_turn_bet_ret', logtag:'[9305:msg_turn_bet_ret]' },
        [9306]:{ package_name:'msg', msg_name:'msg_turn_bet_area_update', name:msg.msg_turn_bet_area_update, func:handler.on_msg_turn_bet_area_update, func_name:'on_msg_turn_bet_area_update', logtag:'[9306:msg_turn_bet_area_update]' },
        [9307]:{ package_name:'msg', msg_name:'msg_turn_state_update', name:msg.msg_turn_state_update, func:handler.on_msg_turn_state_update, func_name:'on_msg_turn_state_update', logtag:'[9307:msg_turn_state_update]' },
        [9308]:{ package_name:'msg', msg_name:'turn_result_info', name:msg.turn_result_info, func:handler.on_turn_result_info, func_name:'on_turn_result_info', logtag:'[9308:turn_result_info]' },
        [9309]:{ package_name:'msg', msg_name:'msg_turn_result', name:msg.msg_turn_result, func:handler.on_msg_turn_result, func_name:'on_msg_turn_result', logtag:'[9309:msg_turn_result]' },
        [9310]:{ package_name:'msg', msg_name:'msg_turn_self_record_req', name:msg.msg_turn_self_record_req, func:handler.on_msg_turn_self_record_req, func_name:'on_msg_turn_self_record_req', logtag:'[9310:msg_turn_self_record_req]' },
        [9311]:{ package_name:'msg', msg_name:'msg_turn_self_record', name:msg.msg_turn_self_record, func:handler.on_msg_turn_self_record, func_name:'on_msg_turn_self_record', logtag:'[9311:msg_turn_self_record]' },
        [9312]:{ package_name:'msg', msg_name:'msg_turn_self_record_ack', name:msg.msg_turn_self_record_ack, func:handler.on_msg_turn_self_record_ack, func_name:'on_msg_turn_self_record_ack', logtag:'[9312:msg_turn_self_record_ack]' },

    };
    module.exports = {
        name:"c_msg_turn_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
