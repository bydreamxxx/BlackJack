
    const msg = {};
    var handler = require('net_handler_westward_journey');
    var recvFuncs = {
        [9000]:{ package_name:'msg', msg_name:'msg_xiyou_room_info', name:msg.msg_xiyou_room_info, func:handler.on_msg_xiyou_room_info, func_name:'on_msg_xiyou_room_info', logtag:'[9000:msg_xiyou_room_info]' },
        [9001]:{ package_name:'msg', msg_name:'xiyou_record', name:msg.xiyou_record, func:handler.on_xiyou_record, func_name:'on_xiyou_record', logtag:'[9001:xiyou_record]' },
        [9002]:{ package_name:'msg', msg_name:'xiyou_user_info', name:msg.xiyou_user_info, func:handler.on_xiyou_user_info, func_name:'on_xiyou_user_info', logtag:'[9002:xiyou_user_info]' },
        [9003]:{ package_name:'msg', msg_name:'msg_xiyou_bet_req', name:msg.msg_xiyou_bet_req, func:handler.on_msg_xiyou_bet_req, func_name:'on_msg_xiyou_bet_req', logtag:'[9003:msg_xiyou_bet_req]' },
        [9004]:{ package_name:'msg', msg_name:'xiyou_bet_info', name:msg.xiyou_bet_info, func:handler.on_xiyou_bet_info, func_name:'on_xiyou_bet_info', logtag:'[9004:xiyou_bet_info]' },
        [9005]:{ package_name:'msg', msg_name:'msg_xiyou_bet_ret', name:msg.msg_xiyou_bet_ret, func:handler.on_msg_xiyou_bet_ret, func_name:'on_msg_xiyou_bet_ret', logtag:'[9005:msg_xiyou_bet_ret]' },
        [9006]:{ package_name:'msg', msg_name:'msg_xiyou_bet_update', name:msg.msg_xiyou_bet_update, func:handler.on_msg_xiyou_bet_update, func_name:'on_msg_xiyou_bet_update', logtag:'[9006:msg_xiyou_bet_update]' },
        [9007]:{ package_name:'msg', msg_name:'msg_xiyou_state_update', name:msg.msg_xiyou_state_update, func:handler.on_msg_xiyou_state_update, func_name:'on_msg_xiyou_state_update', logtag:'[9007:msg_xiyou_state_update]' },
        [9008]:{ package_name:'msg', msg_name:'msg_xiyou_result', name:msg.msg_xiyou_result, func:handler.on_msg_xiyou_result, func_name:'on_msg_xiyou_result', logtag:'[9008:msg_xiyou_result]' },
        [9009]:{ package_name:'msg', msg_name:'msg_xiyou_unbet_req', name:msg.msg_xiyou_unbet_req, func:handler.on_msg_xiyou_unbet_req, func_name:'on_msg_xiyou_unbet_req', logtag:'[9009:msg_xiyou_unbet_req]' },
        [9010]:{ package_name:'msg', msg_name:'msg_xiyou_unbet_ret', name:msg.msg_xiyou_unbet_ret, func:handler.on_msg_xiyou_unbet_ret, func_name:'on_msg_xiyou_unbet_ret', logtag:'[9010:msg_xiyou_unbet_ret]' },

    };
    module.exports = {
        name:"c_msg_xiyou_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
