
    const msg = {};
    var handler = require('net_handler_horse_racing');
    var recvFuncs = {
        [9500]:{ package_name:'msg', msg_name:'horse_info', name:msg.horse_info, func:handler.on_horse_info, func_name:'on_horse_info', logtag:'[9500:horse_info]' },
        [9501]:{ package_name:'msg', msg_name:'horse_bet_info', name:msg.horse_bet_info, func:handler.on_horse_bet_info, func_name:'on_horse_bet_info', logtag:'[9501:horse_bet_info]' },
        [9502]:{ package_name:'msg', msg_name:'msg_horse_info', name:msg.msg_horse_info, func:handler.on_msg_horse_info, func_name:'on_msg_horse_info', logtag:'[9502:msg_horse_info]' },
        [9503]:{ package_name:'msg', msg_name:'msg_horse_begin', name:msg.msg_horse_begin, func:handler.on_msg_horse_begin, func_name:'on_msg_horse_begin', logtag:'[9503:msg_horse_begin]' },
        [9504]:{ package_name:'msg', msg_name:'msg_horse_update', name:msg.msg_horse_update, func:handler.on_msg_horse_update, func_name:'on_msg_horse_update', logtag:'[9504:msg_horse_update]' },
        [9505]:{ package_name:'msg', msg_name:'msg_horse_bet_req', name:msg.msg_horse_bet_req, func:handler.on_msg_horse_bet_req, func_name:'on_msg_horse_bet_req', logtag:'[9505:msg_horse_bet_req]' },
        [9506]:{ package_name:'msg', msg_name:'msg_horse_bet_ret', name:msg.msg_horse_bet_ret, func:handler.on_msg_horse_bet_ret, func_name:'on_msg_horse_bet_ret', logtag:'[9506:msg_horse_bet_ret]' },
        [9507]:{ package_name:'msg', msg_name:'msg_horse_open_tongshi_req', name:msg.msg_horse_open_tongshi_req, func:handler.on_msg_horse_open_tongshi_req, func_name:'on_msg_horse_open_tongshi_req', logtag:'[9507:msg_horse_open_tongshi_req]' },
        [9508]:{ package_name:'msg', msg_name:'horse_rd', name:msg.horse_rd, func:handler.on_horse_rd, func_name:'on_horse_rd', logtag:'[9508:horse_rd]' },
        [9509]:{ package_name:'msg', msg_name:'msg_horse_open_tongshi_ret', name:msg.msg_horse_open_tongshi_ret, func:handler.on_msg_horse_open_tongshi_ret, func_name:'on_msg_horse_open_tongshi_ret', logtag:'[9509:msg_horse_open_tongshi_ret]' },
        [9510]:{ package_name:'msg', msg_name:'horse_user_info', name:msg.horse_user_info, func:handler.on_horse_user_info, func_name:'on_horse_user_info', logtag:'[9510:horse_user_info]' },
        [9511]:{ package_name:'msg', msg_name:'horse_rank', name:msg.horse_rank, func:handler.on_horse_rank, func_name:'on_horse_rank', logtag:'[9511:horse_rank]' },
        [9512]:{ package_name:'msg', msg_name:'msg_horse_result', name:msg.msg_horse_result, func:handler.on_msg_horse_result, func_name:'on_msg_horse_result', logtag:'[9512:msg_horse_result]' },

    };
    module.exports = {
        name:"c_msg_horse_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
