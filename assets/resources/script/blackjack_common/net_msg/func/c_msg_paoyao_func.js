
    const msg = {};
    var handler = require('net_handler_paoyao');
    var recvFuncs = {
        [5500]:{ package_name:'msg', msg_name:'py_team', name:msg.py_team, func:handler.on_py_team, func_name:'on_py_team', logtag:'[5500:py_team]' },
        [5501]:{ package_name:'msg', msg_name:'py_role', name:msg.py_role, func:handler.on_py_role, func_name:'on_py_role', logtag:'[5501:py_role]' },
        [5502]:{ package_name:'msg', msg_name:'py_card_info', name:msg.py_card_info, func:handler.on_py_card_info, func_name:'on_py_card_info', logtag:'[5502:py_card_info]' },
        [5503]:{ package_name:'msg', msg_name:'py_desk', name:msg.py_desk, func:handler.on_py_desk, func_name:'on_py_desk', logtag:'[5503:py_desk]' },
        [5504]:{ package_name:'msg', msg_name:'py_player_poker', name:msg.py_player_poker, func:handler.on_py_player_poker, func_name:'on_py_player_poker', logtag:'[5504:py_player_poker]' },
        [5505]:{ package_name:'msg', msg_name:'msg_paoyao_send_poker', name:msg.msg_paoyao_send_poker, func:handler.on_msg_paoyao_send_poker, func_name:'on_msg_paoyao_send_poker', logtag:'[5505:msg_paoyao_send_poker]' },
        [5506]:{ package_name:'msg', msg_name:'msg_paoyao_ready_req', name:msg.msg_paoyao_ready_req, func:handler.on_msg_paoyao_ready_req, func_name:'on_msg_paoyao_ready_req', logtag:'[5506:msg_paoyao_ready_req]' },
        [5507]:{ package_name:'msg', msg_name:'msg_paoyao_ready_ack', name:msg.msg_paoyao_ready_ack, func:handler.on_msg_paoyao_ready_ack, func_name:'on_msg_paoyao_ready_ack', logtag:'[5507:msg_paoyao_ready_ack]' },
        [5508]:{ package_name:'msg', msg_name:'msg_paoyao_yao_req', name:msg.msg_paoyao_yao_req, func:handler.on_msg_paoyao_yao_req, func_name:'on_msg_paoyao_yao_req', logtag:'[5508:msg_paoyao_yao_req]' },
        [5509]:{ package_name:'msg', msg_name:'msg_paoyao_yao_ack', name:msg.msg_paoyao_yao_ack, func:handler.on_msg_paoyao_yao_ack, func_name:'on_msg_paoyao_yao_ack', logtag:'[5509:msg_paoyao_yao_ack]' },
        [5510]:{ package_name:'msg', msg_name:'paoyao_player_yao', name:msg.paoyao_player_yao, func:handler.on_paoyao_player_yao, func_name:'on_paoyao_player_yao', logtag:'[5510:paoyao_player_yao]' },
        [5511]:{ package_name:'msg', msg_name:'msg_paoyao_yao_notify', name:msg.msg_paoyao_yao_notify, func:handler.on_msg_paoyao_yao_notify, func_name:'on_msg_paoyao_yao_notify', logtag:'[5511:msg_paoyao_yao_notify]' },
        [5512]:{ package_name:'msg', msg_name:'msg_paoyao_yao_change', name:msg.msg_paoyao_yao_change, func:handler.on_msg_paoyao_yao_change, func_name:'on_msg_paoyao_yao_change', logtag:'[5512:msg_paoyao_yao_change]' },
        [5513]:{ package_name:'msg', msg_name:'msg_paoyao_act_req', name:msg.msg_paoyao_act_req, func:handler.on_msg_paoyao_act_req, func_name:'on_msg_paoyao_act_req', logtag:'[5513:msg_paoyao_act_req]' },
        [5514]:{ package_name:'msg', msg_name:'msg_paoyao_act_ack', name:msg.msg_paoyao_act_ack, func:handler.on_msg_paoyao_act_ack, func_name:'on_msg_paoyao_act_ack', logtag:'[5514:msg_paoyao_act_ack]' },
        [5515]:{ package_name:'msg', msg_name:'msg_paoyao_xue_notify', name:msg.msg_paoyao_xue_notify, func:handler.on_msg_paoyao_xue_notify, func_name:'on_msg_paoyao_xue_notify', logtag:'[5515:msg_paoyao_xue_notify]' },
        [5516]:{ package_name:'msg', msg_name:'msg_paoyao_xue_req', name:msg.msg_paoyao_xue_req, func:handler.on_msg_paoyao_xue_req, func_name:'on_msg_paoyao_xue_req', logtag:'[5516:msg_paoyao_xue_req]' },
        [5517]:{ package_name:'msg', msg_name:'msg_paoyao_xue_ack', name:msg.msg_paoyao_xue_ack, func:handler.on_msg_paoyao_xue_ack, func_name:'on_msg_paoyao_xue_ack', logtag:'[5517:msg_paoyao_xue_ack]' },
        [5518]:{ package_name:'msg', msg_name:'msg_state_change', name:msg.msg_state_change, func:handler.on_msg_state_change, func_name:'on_msg_state_change', logtag:'[5518:msg_state_change]' },
        [5519]:{ package_name:'msg', msg_name:'msg_paoyao_score_change', name:msg.msg_paoyao_score_change, func:handler.on_msg_paoyao_score_change, func_name:'on_msg_paoyao_score_change', logtag:'[5519:msg_paoyao_score_change]' },
        [5520]:{ package_name:'msg', msg_name:'msg_paoyao_dscore_change', name:msg.msg_paoyao_dscore_change, func:handler.on_msg_paoyao_dscore_change, func_name:'on_msg_paoyao_dscore_change', logtag:'[5520:msg_paoyao_dscore_change]' },
        [5521]:{ package_name:'msg', msg_name:'msg_paoyao_result', name:msg.msg_paoyao_result, func:handler.on_msg_paoyao_result, func_name:'on_msg_paoyao_result', logtag:'[5521:msg_paoyao_result]' },
        [5522]:{ package_name:'msg', msg_name:'py_player_result', name:msg.py_player_result, func:handler.on_py_player_result, func_name:'on_py_player_result', logtag:'[5522:py_player_result]' },
        [5523]:{ package_name:'msg', msg_name:'py_player_final_result', name:msg.py_player_final_result, func:handler.on_py_player_final_result, func_name:'on_py_player_final_result', logtag:'[5523:py_player_final_result]' },
        [5524]:{ package_name:'msg', msg_name:'msg_paoyao_final_result', name:msg.msg_paoyao_final_result, func:handler.on_msg_paoyao_final_result, func_name:'on_msg_paoyao_final_result', logtag:'[5524:msg_paoyao_final_result]' },
        [5525]:{ package_name:'msg', msg_name:'msg_paoyao_other_poker', name:msg.msg_paoyao_other_poker, func:handler.on_msg_paoyao_other_poker, func_name:'on_msg_paoyao_other_poker', logtag:'[5525:msg_paoyao_other_poker]' },
        [5526]:{ package_name:'msg', msg_name:'msg_paoyao_tuoguan_req', name:msg.msg_paoyao_tuoguan_req, func:handler.on_msg_paoyao_tuoguan_req, func_name:'on_msg_paoyao_tuoguan_req', logtag:'[5526:msg_paoyao_tuoguan_req]' },
        [5527]:{ package_name:'msg', msg_name:'msg_paoyao_tuoguan_change', name:msg.msg_paoyao_tuoguan_change, func:handler.on_msg_paoyao_tuoguan_change, func_name:'on_msg_paoyao_tuoguan_change', logtag:'[5527:msg_paoyao_tuoguan_change]' },
        [5528]:{ package_name:'msg', msg_name:'msg_paoyao_chat_req', name:msg.msg_paoyao_chat_req, func:handler.on_msg_paoyao_chat_req, func_name:'on_msg_paoyao_chat_req', logtag:'[5528:msg_paoyao_chat_req]' },
        [5529]:{ package_name:'msg', msg_name:'msg_paoyao_chat_ack', name:msg.msg_paoyao_chat_ack, func:handler.on_msg_paoyao_chat_ack, func_name:'on_msg_paoyao_chat_ack', logtag:'[5529:msg_paoyao_chat_ack]' },

    };
    module.exports = {
        name:"c_msg_paoyao_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
