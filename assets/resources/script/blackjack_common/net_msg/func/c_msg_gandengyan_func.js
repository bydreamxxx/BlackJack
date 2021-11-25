
    const msg = {};
    var handler = require('net_handler_gdy');
    var recvFuncs = {
        [6500]:{ package_name:'msg', msg_name:'gdy_role', name:msg.gdy_role, func:handler.on_gdy_role, func_name:'on_gdy_role', logtag:'[6500:gdy_role]' },
        [6501]:{ package_name:'msg', msg_name:'gdy_desk', name:msg.gdy_desk, func:handler.on_gdy_desk, func_name:'on_gdy_desk', logtag:'[6501:gdy_desk]' },
        [6502]:{ package_name:'msg', msg_name:'gdy_player_poker', name:msg.gdy_player_poker, func:handler.on_gdy_player_poker, func_name:'on_gdy_player_poker', logtag:'[6502:gdy_player_poker]' },
        [6503]:{ package_name:'msg', msg_name:'msg_gdy_send_poker', name:msg.msg_gdy_send_poker, func:handler.on_msg_gdy_send_poker, func_name:'on_msg_gdy_send_poker', logtag:'[6503:msg_gdy_send_poker]' },
        [6504]:{ package_name:'msg', msg_name:'msg_gdy_guan_change', name:msg.msg_gdy_guan_change, func:handler.on_msg_gdy_guan_change, func_name:'on_msg_gdy_guan_change', logtag:'[6504:msg_gdy_guan_change]' },
        [6505]:{ package_name:'msg', msg_name:'msg_gdy_act_req', name:msg.msg_gdy_act_req, func:handler.on_msg_gdy_act_req, func_name:'on_msg_gdy_act_req', logtag:'[6505:msg_gdy_act_req]' },
        [6506]:{ package_name:'msg', msg_name:'msg_gdy_act_ack', name:msg.msg_gdy_act_ack, func:handler.on_msg_gdy_act_ack, func_name:'on_msg_gdy_act_ack', logtag:'[6506:msg_gdy_act_ack]' },
        [6507]:{ package_name:'msg', msg_name:'gdy_player_result', name:msg.gdy_player_result, func:handler.on_gdy_player_result, func_name:'on_gdy_player_result', logtag:'[6507:gdy_player_result]' },
        [6508]:{ package_name:'msg', msg_name:'msg_gdy_result', name:msg.msg_gdy_result, func:handler.on_msg_gdy_result, func_name:'on_msg_gdy_result', logtag:'[6508:msg_gdy_result]' },
        [6509]:{ package_name:'msg', msg_name:'gdy_player_final_result', name:msg.gdy_player_final_result, func:handler.on_gdy_player_final_result, func_name:'on_gdy_player_final_result', logtag:'[6509:gdy_player_final_result]' },
        [6510]:{ package_name:'msg', msg_name:'msg_gdy_final_result', name:msg.msg_gdy_final_result, func:handler.on_msg_gdy_final_result, func_name:'on_msg_gdy_final_result', logtag:'[6510:msg_gdy_final_result]' },
        [6511]:{ package_name:'msg', msg_name:'msg_gdy_tuoguan_req', name:msg.msg_gdy_tuoguan_req, func:handler.on_msg_gdy_tuoguan_req, func_name:'on_msg_gdy_tuoguan_req', logtag:'[6511:msg_gdy_tuoguan_req]' },
        [6512]:{ package_name:'msg', msg_name:'msg_gdy_tuoguan_change', name:msg.msg_gdy_tuoguan_change, func:handler.on_msg_gdy_tuoguan_change, func_name:'on_msg_gdy_tuoguan_change', logtag:'[6512:msg_gdy_tuoguan_change]' },
        [6513]:{ package_name:'msg', msg_name:'msg_gdy_rate_notify', name:msg.msg_gdy_rate_notify, func:handler.on_msg_gdy_rate_notify, func_name:'on_msg_gdy_rate_notify', logtag:'[6513:msg_gdy_rate_notify]' },

    };
    module.exports = {
        name:"c_msg_gandengyan_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
