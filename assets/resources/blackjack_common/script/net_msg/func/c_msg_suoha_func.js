
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [6300]:{ package_name:'msg', msg_name:'msg_suoha_state_change_2c', name:msg.msg_suoha_state_change_2c, func:handler.on_msg_suoha_state_change_2c, func_name:'on_msg_suoha_state_change_2c', logtag:'[6300:msg_suoha_state_change_2c ]' },
        [6301]:{ package_name:'msg', msg_name:'msg_suoha_ready_2s', name:msg.msg_suoha_ready_2s, func:handler.on_msg_suoha_ready_2s, func_name:'on_msg_suoha_ready_2s', logtag:'[6301:msg_suoha_ready_2s ]' },
        [6302]:{ package_name:'msg', msg_name:'msg_suoha_ready_2c', name:msg.msg_suoha_ready_2c, func:handler.on_msg_suoha_ready_2c, func_name:'on_msg_suoha_ready_2c', logtag:'[6302:msg_suoha_ready_2c ]' },
        [6303]:{ package_name:'msg', msg_name:'msg_suoha_cur_say_2c', name:msg.msg_suoha_cur_say_2c, func:handler.on_msg_suoha_cur_say_2c, func_name:'on_msg_suoha_cur_say_2c', logtag:'[6303:msg_suoha_cur_say_2c ]' },
        [6304]:{ package_name:'msg', msg_name:'msg_suoha_bet_2s', name:msg.msg_suoha_bet_2s, func:handler.on_msg_suoha_bet_2s, func_name:'on_msg_suoha_bet_2s', logtag:'[6304:msg_suoha_bet_2s ]' },
        [6305]:{ package_name:'msg', msg_name:'msg_suoha_bet_2c', name:msg.msg_suoha_bet_2c, func:handler.on_msg_suoha_bet_2c, func_name:'on_msg_suoha_bet_2c', logtag:'[6305:msg_suoha_bet_2c ]' },
        [6306]:{ package_name:'msg', msg_name:'nested_suoha_card_info', name:msg.nested_suoha_card_info, func:handler.on_nested_suoha_card_info, func_name:'on_nested_suoha_card_info', logtag:'[6306:nested_suoha_card_info ]' },
        [6307]:{ package_name:'msg', msg_name:'nested_suoha_card_info_type', name:msg.nested_suoha_card_info_type, func:handler.on_nested_suoha_card_info_type, func_name:'on_nested_suoha_card_info_type', logtag:'[6307:nested_suoha_card_info_type ]' },
        [6308]:{ package_name:'msg', msg_name:'msg_suoha_deal_card_2c', name:msg.msg_suoha_deal_card_2c, func:handler.on_msg_suoha_deal_card_2c, func_name:'on_msg_suoha_deal_card_2c', logtag:'[6308:msg_suoha_deal_card_2c ]' },
        [6309]:{ package_name:'msg', msg_name:'msg_suoha_show_card_2c', name:msg.msg_suoha_show_card_2c, func:handler.on_msg_suoha_show_card_2c, func_name:'on_msg_suoha_show_card_2c', logtag:'[6309:msg_suoha_show_card_2c ]' },
        [6310]:{ package_name:'msg', msg_name:'nested_suoha_result', name:msg.nested_suoha_result, func:handler.on_nested_suoha_result, func_name:'on_nested_suoha_result', logtag:'[6310:nested_suoha_result ]' },
        [6311]:{ package_name:'msg', msg_name:'msg_suoha_result_2c', name:msg.msg_suoha_result_2c, func:handler.on_msg_suoha_result_2c, func_name:'on_msg_suoha_result_2c', logtag:'[6311:msg_suoha_result_2c ]' },
        [6312]:{ package_name:'msg', msg_name:'msg_suoha_result_all_2c', name:msg.msg_suoha_result_all_2c, func:handler.on_msg_suoha_result_all_2c, func_name:'on_msg_suoha_result_all_2c', logtag:'[6312:msg_suoha_result_all_2c ]' },
        [6313]:{ package_name:'msg', msg_name:'user_suoha_cur_state', name:msg.user_suoha_cur_state, func:handler.on_user_suoha_cur_state, func_name:'on_user_suoha_cur_state', logtag:'[6313:user_suoha_cur_state ]' },
        [6314]:{ package_name:'msg', msg_name:'msg_suoha_resume_state_2c', name:msg.msg_suoha_resume_state_2c, func:handler.on_msg_suoha_resume_state_2c, func_name:'on_msg_suoha_resume_state_2c', logtag:'[6314:msg_suoha_resume_state_2c ]' },
        [6315]:{ package_name:'msg', msg_name:'msg_suoha_dissolve_agree_req', name:msg.msg_suoha_dissolve_agree_req, func:handler.on_msg_suoha_dissolve_agree_req, func_name:'on_msg_suoha_dissolve_agree_req', logtag:'[6315:msg_suoha_dissolve_agree_req ]' },
        [6316]:{ package_name:'msg', msg_name:'msg_suoha_dissolve_agree_ack', name:msg.msg_suoha_dissolve_agree_ack, func:handler.on_msg_suoha_dissolve_agree_ack, func_name:'on_msg_suoha_dissolve_agree_ack', logtag:'[6316:msg_suoha_dissolve_agree_ack ]' },
        [6317]:{ package_name:'msg', msg_name:'msg_suoha_dissolve_agree_result', name:msg.msg_suoha_dissolve_agree_result, func:handler.on_msg_suoha_dissolve_agree_result, func_name:'on_msg_suoha_dissolve_agree_result', logtag:'[6317:msg_suoha_dissolve_agree_result ]' },
        [6318]:{ package_name:'msg', msg_name:'msg_suoha_look_req', name:msg.msg_suoha_look_req, func:handler.on_msg_suoha_look_req, func_name:'on_msg_suoha_look_req', logtag:'[6318:msg_suoha_look_req ]' },
        [6319]:{ package_name:'msg', msg_name:'msg_suoha_look_ack', name:msg.msg_suoha_look_ack, func:handler.on_msg_suoha_look_ack, func_name:'on_msg_suoha_look_ack', logtag:'[6319:msg_suoha_look_ack ]' },

    };
    module.exports = {
        name:"c_msg_suoha_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
