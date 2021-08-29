
    const msg = {};
    var handler = require('net_handler_horse_racing');
    var recvFuncs = {
        [9400]:{ package_name:'msg', msg_name:'horse_info', name:msg.horse_info, func:handler.on_horse_info, func_name:'on_horse_info', logtag:'[9400:horse_info]' },
        [9401]:{ package_name:'msg', msg_name:'horse_bet_info', name:msg.horse_bet_info, func:handler.on_horse_bet_info, func_name:'on_horse_bet_info', logtag:'[9401:horse_bet_info]' },
        [9402]:{ package_name:'msg', msg_name:'msg_horse_info', name:msg.msg_horse_info, func:handler.on_msg_horse_info, func_name:'on_msg_horse_info', logtag:'[9402:msg_horse_info]' },
        [9403]:{ package_name:'msg', msg_name:'msg_horse_begin', name:msg.msg_horse_begin, func:handler.on_msg_horse_begin, func_name:'on_msg_horse_begin', logtag:'[9403:msg_horse_begin]' },
        [9404]:{ package_name:'msg', msg_name:'msg_horse_update', name:msg.msg_horse_update, func:handler.on_msg_horse_update, func_name:'on_msg_horse_update', logtag:'[9404:msg_horse_update]' },
        [9405]:{ package_name:'msg', msg_name:'msg_horse_bet_req', name:msg.msg_horse_bet_req, func:handler.on_msg_horse_bet_req, func_name:'on_msg_horse_bet_req', logtag:'[9405:msg_horse_bet_req]' },
        [9406]:{ package_name:'msg', msg_name:'msg_horse_bet_ret', name:msg.msg_horse_bet_ret, func:handler.on_msg_horse_bet_ret, func_name:'on_msg_horse_bet_ret', logtag:'[9406:msg_horse_bet_ret]' },
        [9407]:{ package_name:'msg', msg_name:'msg_horse_open_tongshi_req', name:msg.msg_horse_open_tongshi_req, func:handler.on_msg_horse_open_tongshi_req, func_name:'on_msg_horse_open_tongshi_req', logtag:'[9407:msg_horse_open_tongshi_req]' },
        [9408]:{ package_name:'msg', msg_name:'horse_rd', name:msg.horse_rd, func:handler.on_horse_rd, func_name:'on_horse_rd', logtag:'[9408:horse_rd]' },
        [9409]:{ package_name:'msg', msg_name:'msg_horse_open_tongshi_ret', name:msg.msg_horse_open_tongshi_ret, func:handler.on_msg_horse_open_tongshi_ret, func_name:'on_msg_horse_open_tongshi_ret', logtag:'[9409:msg_horse_open_tongshi_ret]' },
        [9410]:{ package_name:'msg', msg_name:'horse_user_info', name:msg.horse_user_info, func:handler.on_horse_user_info, func_name:'on_horse_user_info', logtag:'[9410:horse_user_info]' },
        [9411]:{ package_name:'msg', msg_name:'horse_rank', name:msg.horse_rank, func:handler.on_horse_rank, func_name:'on_horse_rank', logtag:'[9411:horse_rank]' },
        [9412]:{ package_name:'msg', msg_name:'msg_horse_result', name:msg.msg_horse_result, func:handler.on_msg_horse_result, func_name:'on_msg_horse_result', logtag:'[9412:msg_horse_result]' },

    };
    module.exports = {
        name:"c_msg_horse_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
