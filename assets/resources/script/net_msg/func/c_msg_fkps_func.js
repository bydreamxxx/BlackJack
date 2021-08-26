
    const msg = {};
    var handler = require('net_handler_brnn');
    var recvFuncs = {
        [5800]:{ package_name:'msg', msg_name:'fkps_battle', name:msg.fkps_battle, func:handler.on_fkps_battle, func_name:'on_fkps_battle', logtag:'[5800:fkps_battle ]' },
        [5801]:{ package_name:'msg', msg_name:'fkps_pokers', name:msg.fkps_pokers, func:handler.on_fkps_pokers, func_name:'on_fkps_pokers', logtag:'[5801:fkps_pokers ]' },
        [5802]:{ package_name:'msg', msg_name:'fkps_beted', name:msg.fkps_beted, func:handler.on_fkps_beted, func_name:'on_fkps_beted', logtag:'[5802:fkps_beted ]' },
        [5803]:{ package_name:'msg', msg_name:'msg_fkps_resume_state_2c', name:msg.msg_fkps_resume_state_2c, func:handler.on_msg_fkps_resume_state_2c, func_name:'on_msg_fkps_resume_state_2c', logtag:'[5803:msg_fkps_resume_state_2c ]' },
        [5804]:{ package_name:'msg', msg_name:'msg_fkps_state_2c', name:msg.msg_fkps_state_2c, func:handler.on_msg_fkps_state_2c, func_name:'on_msg_fkps_state_2c', logtag:'[5804:msg_fkps_state_2c ]' },
        [5805]:{ package_name:'msg', msg_name:'fkps_bet_2s', name:msg.fkps_bet_2s, func:handler.on_fkps_bet_2s, func_name:'on_fkps_bet_2s', logtag:'[5805:fkps_bet_2s ]' },
        [5806]:{ package_name:'msg', msg_name:'fkps_bet_2c', name:msg.fkps_bet_2c, func:handler.on_fkps_bet_2c, func_name:'on_fkps_bet_2c', logtag:'[5806:fkps_bet_2c ]' },
        [5807]:{ package_name:'msg', msg_name:'fkps_bet_broadcast', name:msg.fkps_bet_broadcast, func:handler.on_fkps_bet_broadcast, func_name:'on_fkps_bet_broadcast', logtag:'[5807:fkps_bet_broadcast ]' },
        [5808]:{ package_name:'msg', msg_name:'fkps_req_banker_2s', name:msg.fkps_req_banker_2s, func:handler.on_fkps_req_banker_2s, func_name:'on_fkps_req_banker_2s', logtag:'[5808:fkps_req_banker_2s ]' },
        [5809]:{ package_name:'msg', msg_name:'fkps_req_banker_2c', name:msg.fkps_req_banker_2c, func:handler.on_fkps_req_banker_2c, func_name:'on_fkps_req_banker_2c', logtag:'[5809:fkps_req_banker_2c ]' },
        [5810]:{ package_name:'msg', msg_name:'fkps_req_banker_sum_broadcast', name:msg.fkps_req_banker_sum_broadcast, func:handler.on_fkps_req_banker_sum_broadcast, func_name:'on_fkps_req_banker_sum_broadcast', logtag:'[5810:fkps_req_banker_sum_broadcast ]' },
        [5811]:{ package_name:'msg', msg_name:'fkps_req_banker_num_broadcast', name:msg.fkps_req_banker_num_broadcast, func:handler.on_fkps_req_banker_num_broadcast, func_name:'on_fkps_req_banker_num_broadcast', logtag:'[5811:fkps_req_banker_num_broadcast ]' },
        [5812]:{ package_name:'msg', msg_name:'fkps_banker_add_2c', name:msg.fkps_banker_add_2c, func:handler.on_fkps_banker_add_2c, func_name:'on_fkps_banker_add_2c', logtag:'[5812:fkps_banker_add_2c ]' },
        [5813]:{ package_name:'msg', msg_name:'fkps_banker_del_2c', name:msg.fkps_banker_del_2c, func:handler.on_fkps_banker_del_2c, func_name:'on_fkps_banker_del_2c', logtag:'[5813:fkps_banker_del_2c ]' },
        [5814]:{ package_name:'msg', msg_name:'fkps_banker_lists', name:msg.fkps_banker_lists, func:handler.on_fkps_banker_lists, func_name:'on_fkps_banker_lists', logtag:'[5814:fkps_banker_lists ]' },
        [5815]:{ package_name:'msg', msg_name:'fkps_winer', name:msg.fkps_winer, func:handler.on_fkps_winer, func_name:'on_fkps_winer', logtag:'[5815:fkps_winer ]' },
        [5816]:{ package_name:'msg', msg_name:'fkps_battle_lists', name:msg.fkps_battle_lists, func:handler.on_fkps_battle_lists, func_name:'on_fkps_battle_lists', logtag:'[5816:fkps_battle_lists ]' },
        [5817]:{ package_name:'msg', msg_name:'fkps_result', name:msg.fkps_result, func:handler.on_fkps_result, func_name:'on_fkps_result', logtag:'[5817:fkps_result ]' },
        [5818]:{ package_name:'msg', msg_name:'fkps_results_2c', name:msg.fkps_results_2c, func:handler.on_fkps_results_2c, func_name:'on_fkps_results_2c', logtag:'[5818:fkps_results_2c ]' },

    };
    module.exports = {
        name:"c_msg_fkps_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
