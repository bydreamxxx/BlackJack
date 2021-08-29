
    const msg = {};
    var handler = require('net_handler_douniu');
    var recvFuncs = {
        [3500]:{ package_name:'msg', msg_name:'msg_bullfight_state_change_2c', name:msg.msg_bullfight_state_change_2c, func:handler.on_msg_bullfight_state_change_2c, func_name:'on_msg_bullfight_state_change_2c', logtag:'[3500:msg_bullfight_state_change_2c ]' },
        [3501]:{ package_name:'msg', msg_name:'msg_bullfight_ready_2s', name:msg.msg_bullfight_ready_2s, func:handler.on_msg_bullfight_ready_2s, func_name:'on_msg_bullfight_ready_2s', logtag:'[3501:msg_bullfight_ready_2s ]' },
        [3502]:{ package_name:'msg', msg_name:'msg_bullfight_ready_2c', name:msg.msg_bullfight_ready_2c, func:handler.on_msg_bullfight_ready_2c, func_name:'on_msg_bullfight_ready_2c', logtag:'[3502:msg_bullfight_ready_2c ]' },
        [3503]:{ package_name:'msg', msg_name:'msg_bullfight_rob_bull_2s', name:msg.msg_bullfight_rob_bull_2s, func:handler.on_msg_bullfight_rob_bull_2s, func_name:'on_msg_bullfight_rob_bull_2s', logtag:'[3503:msg_bullfight_rob_bull_2s ]' },
        [3504]:{ package_name:'msg', msg_name:'msg_bullfight_rob_bull_2c', name:msg.msg_bullfight_rob_bull_2c, func:handler.on_msg_bullfight_rob_bull_2c, func_name:'on_msg_bullfight_rob_bull_2c', logtag:'[3504:msg_bullfight_rob_bull_2c ]' },
        [3505]:{ package_name:'msg', msg_name:'msg_bullfight_banker_2c', name:msg.msg_bullfight_banker_2c, func:handler.on_msg_bullfight_banker_2c, func_name:'on_msg_bullfight_banker_2c', logtag:'[3505:msg_bullfight_banker_2c ]' },
        [3506]:{ package_name:'msg', msg_name:'msg_bullfight_bet_2s', name:msg.msg_bullfight_bet_2s, func:handler.on_msg_bullfight_bet_2s, func_name:'on_msg_bullfight_bet_2s', logtag:'[3506:msg_bullfight_bet_2s ]' },
        [3507]:{ package_name:'msg', msg_name:'msg_bullfight_bet_2c', name:msg.msg_bullfight_bet_2c, func:handler.on_msg_bullfight_bet_2c, func_name:'on_msg_bullfight_bet_2c', logtag:'[3507:msg_bullfight_bet_2c ]' },
        [3508]:{ package_name:'msg', msg_name:'nested_bullfight_card_info', name:msg.nested_bullfight_card_info, func:handler.on_nested_bullfight_card_info, func_name:'on_nested_bullfight_card_info', logtag:'[3508:nested_bullfight_card_info ]' },
        [3509]:{ package_name:'msg', msg_name:'nested_bullfight_card_info_type', name:msg.nested_bullfight_card_info_type, func:handler.on_nested_bullfight_card_info_type, func_name:'on_nested_bullfight_card_info_type', logtag:'[3509:nested_bullfight_card_info_type ]' },
        [3510]:{ package_name:'msg', msg_name:'msg_bullfight_deal_card_2c', name:msg.msg_bullfight_deal_card_2c, func:handler.on_msg_bullfight_deal_card_2c, func_name:'on_msg_bullfight_deal_card_2c', logtag:'[3510:msg_bullfight_deal_card_2c ]' },
        [3511]:{ package_name:'msg', msg_name:'msg_bullfight_show_card_2c', name:msg.msg_bullfight_show_card_2c, func:handler.on_msg_bullfight_show_card_2c, func_name:'on_msg_bullfight_show_card_2c', logtag:'[3511:msg_bullfight_show_card_2c ]' },
        [3512]:{ package_name:'msg', msg_name:'nested_bullfight_result', name:msg.nested_bullfight_result, func:handler.on_nested_bullfight_result, func_name:'on_nested_bullfight_result', logtag:'[3512:nested_bullfight_result ]' },
        [3513]:{ package_name:'msg', msg_name:'msg_bullfight_result_2c', name:msg.msg_bullfight_result_2c, func:handler.on_msg_bullfight_result_2c, func_name:'on_msg_bullfight_result_2c', logtag:'[3513:msg_bullfight_result_2c ]' },
        [3514]:{ package_name:'msg', msg_name:'msg_bullfight_result_all_2c', name:msg.msg_bullfight_result_all_2c, func:handler.on_msg_bullfight_result_all_2c, func_name:'on_msg_bullfight_result_all_2c', logtag:'[3514:msg_bullfight_result_all_2c ]' },
        [3515]:{ package_name:'msg', msg_name:'user_cur_state', name:msg.user_cur_state, func:handler.on_user_cur_state, func_name:'on_user_cur_state', logtag:'[3515:user_cur_state ]' },
        [3516]:{ package_name:'msg', msg_name:'msg_resume_state_2c', name:msg.msg_resume_state_2c, func:handler.on_msg_resume_state_2c, func_name:'on_msg_resume_state_2c', logtag:'[3516:msg_resume_state_2c ]' },
        [3517]:{ package_name:'msg', msg_name:'msg_bullfight_dissolve_agree_req', name:msg.msg_bullfight_dissolve_agree_req, func:handler.on_msg_bullfight_dissolve_agree_req, func_name:'on_msg_bullfight_dissolve_agree_req', logtag:'[3517:msg_bullfight_dissolve_agree_req ]' },
        [3518]:{ package_name:'msg', msg_name:'msg_bullfight_dissolve_agree_ack', name:msg.msg_bullfight_dissolve_agree_ack, func:handler.on_msg_bullfight_dissolve_agree_ack, func_name:'on_msg_bullfight_dissolve_agree_ack', logtag:'[3518:msg_bullfight_dissolve_agree_ack ]' },
        [3519]:{ package_name:'msg', msg_name:'msg_bullfight_dissolve_agree_result', name:msg.msg_bullfight_dissolve_agree_result, func:handler.on_msg_bullfight_dissolve_agree_result, func_name:'on_msg_bullfight_dissolve_agree_result', logtag:'[3519:msg_bullfight_dissolve_agree_result ]' },
        [3520]:{ package_name:'msg', msg_name:'msg_auto_bank_bet_2s', name:msg.msg_auto_bank_bet_2s, func:handler.on_msg_auto_bank_bet_2s, func_name:'on_msg_auto_bank_bet_2s', logtag:'[3520:msg_auto_bank_bet_2s ]' },
        [3521]:{ package_name:'msg', msg_name:'msg_auto_bank_bet_2c', name:msg.msg_auto_bank_bet_2c, func:handler.on_msg_auto_bank_bet_2c, func_name:'on_msg_auto_bank_bet_2c', logtag:'[3521:msg_auto_bank_bet_2c ]' },
        [3522]:{ package_name:'msg', msg_name:'bullfight_player_auto_req', name:msg.bullfight_player_auto_req, func:handler.on_bullfight_player_auto_req, func_name:'on_bullfight_player_auto_req', logtag:'[3522:bullfight_player_auto_req ]' },
        [3523]:{ package_name:'msg', msg_name:'bullfight_player_auto_ack', name:msg.bullfight_player_auto_ack, func:handler.on_bullfight_player_auto_ack, func_name:'on_bullfight_player_auto_ack', logtag:'[3523:bullfight_player_auto_ack ]' },

    };
    module.exports = {
        name:"c_msg_douniu_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
