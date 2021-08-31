
    const msg = {};
    var handler = require('net_handler_pk');
    var recvFuncs = {
        [6700]:{ package_name:'msg', msg_name:'msg_pk_info', name:msg.msg_pk_info, func:handler.on_msg_pk_info, func_name:'on_msg_pk_info', logtag:'[6700:msg_pk_info]' },
        [6701]:{ package_name:'msg', msg_name:'pk_waybill', name:msg.pk_waybill, func:handler.on_pk_waybill, func_name:'on_pk_waybill', logtag:'[6701:pk_waybill]' },
        [6702]:{ package_name:'msg', msg_name:'pk_all_bet', name:msg.pk_all_bet, func:handler.on_pk_all_bet, func_name:'on_pk_all_bet', logtag:'[6702:pk_all_bet]' },
        [6703]:{ package_name:'msg', msg_name:'pk_self_info', name:msg.pk_self_info, func:handler.on_pk_self_info, func_name:'on_pk_self_info', logtag:'[6703:pk_self_info]' },
        [6704]:{ package_name:'msg', msg_name:'msg_pk_bet_req', name:msg.msg_pk_bet_req, func:handler.on_msg_pk_bet_req, func_name:'on_msg_pk_bet_req', logtag:'[6704:msg_pk_bet_req]' },
        [6705]:{ package_name:'msg', msg_name:'msg_pk_bet_ret', name:msg.msg_pk_bet_ret, func:handler.on_msg_pk_bet_ret, func_name:'on_msg_pk_bet_ret', logtag:'[6705:msg_pk_bet_ret]' },
        [6706]:{ package_name:'msg', msg_name:'msg_pk_result', name:msg.msg_pk_result, func:handler.on_msg_pk_result, func_name:'on_msg_pk_result', logtag:'[6706:msg_pk_result]' },
        [6707]:{ package_name:'msg', msg_name:'pk_rank_info', name:msg.pk_rank_info, func:handler.on_pk_rank_info, func_name:'on_pk_rank_info', logtag:'[6707:pk_rank_info]' },
        [6708]:{ package_name:'msg', msg_name:'msg_pk_state', name:msg.msg_pk_state, func:handler.on_msg_pk_state, func_name:'on_msg_pk_state', logtag:'[6708:msg_pk_state]' },
        [6709]:{ package_name:'msg', msg_name:'msg_pk_open_cards_req', name:msg.msg_pk_open_cards_req, func:handler.on_msg_pk_open_cards_req, func_name:'on_msg_pk_open_cards_req', logtag:'[6709:msg_pk_open_cards_req]' },
        [6710]:{ package_name:'msg', msg_name:'msg_pk_open_cards_ret', name:msg.msg_pk_open_cards_ret, func:handler.on_msg_pk_open_cards_ret, func_name:'on_msg_pk_open_cards_ret', logtag:'[6710:msg_pk_open_cards_ret]' },

    };
    module.exports = {
        name:"c_msg_pk_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
