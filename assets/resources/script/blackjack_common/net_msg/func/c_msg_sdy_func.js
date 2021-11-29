
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [5100]:{ package_name:'msg', msg_name:'sdy_user_info', name:msg.sdy_user_info, func:handler.on_sdy_user_info, func_name:'on_sdy_user_info', logtag:'[5100:sdy_user_info]' },
        [5101]:{ package_name:'msg', msg_name:'sdy_room_info', name:msg.sdy_room_info, func:handler.on_sdy_room_info, func_name:'on_sdy_room_info', logtag:'[5101:sdy_room_info]' },
        [5102]:{ package_name:'msg', msg_name:'sdy_op_info', name:msg.sdy_op_info, func:handler.on_sdy_op_info, func_name:'on_sdy_op_info', logtag:'[5102:sdy_op_info]' },
        [5103]:{ package_name:'msg', msg_name:'sdy_base_pokers_info', name:msg.sdy_base_pokers_info, func:handler.on_sdy_base_pokers_info, func_name:'on_sdy_base_pokers_info', logtag:'[5103:sdy_base_pokers_info]' },
        [5104]:{ package_name:'msg', msg_name:'msg_sdy_room_init', name:msg.msg_sdy_room_init, func:handler.on_msg_sdy_room_init, func_name:'on_msg_sdy_room_init', logtag:'[5104:msg_sdy_room_init]' },
        [5105]:{ package_name:'msg', msg_name:'msg_sdy_call_score_req', name:msg.msg_sdy_call_score_req, func:handler.on_msg_sdy_call_score_req, func_name:'on_msg_sdy_call_score_req', logtag:'[5105:msg_sdy_call_score_req]' },
        [5106]:{ package_name:'msg', msg_name:'msg_sdy_call_score_ret', name:msg.msg_sdy_call_score_ret, func:handler.on_msg_sdy_call_score_ret, func_name:'on_msg_sdy_call_score_ret', logtag:'[5106:msg_sdy_call_score_ret]' },
        [5107]:{ package_name:'msg', msg_name:'msg_sdy_deal_bottom', name:msg.msg_sdy_deal_bottom, func:handler.on_msg_sdy_deal_bottom, func_name:'on_msg_sdy_deal_bottom', logtag:'[5107:msg_sdy_deal_bottom]' },
        [5108]:{ package_name:'msg', msg_name:'msg_sdy_deal', name:msg.msg_sdy_deal, func:handler.on_msg_sdy_deal, func_name:'on_msg_sdy_deal', logtag:'[5108:msg_sdy_deal]' },
        [5109]:{ package_name:'msg', msg_name:'msg_sdy_choice_color_req', name:msg.msg_sdy_choice_color_req, func:handler.on_msg_sdy_choice_color_req, func_name:'on_msg_sdy_choice_color_req', logtag:'[5109:msg_sdy_choice_color_req]' },
        [5110]:{ package_name:'msg', msg_name:'msg_sdy_choice_color_ret', name:msg.msg_sdy_choice_color_ret, func:handler.on_msg_sdy_choice_color_ret, func_name:'on_msg_sdy_choice_color_ret', logtag:'[5110:msg_sdy_choice_color_ret]' },
        [5111]:{ package_name:'msg', msg_name:'msg_sdy_kou_pokers_req', name:msg.msg_sdy_kou_pokers_req, func:handler.on_msg_sdy_kou_pokers_req, func_name:'on_msg_sdy_kou_pokers_req', logtag:'[5111:msg_sdy_kou_pokers_req]' },
        [5112]:{ package_name:'msg', msg_name:'msg_sdy_kou_pokers_ret', name:msg.msg_sdy_kou_pokers_ret, func:handler.on_msg_sdy_kou_pokers_ret, func_name:'on_msg_sdy_kou_pokers_ret', logtag:'[5112:msg_sdy_kou_pokers_ret]' },
        [5113]:{ package_name:'msg', msg_name:'msg_sdy_user_poker_req', name:msg.msg_sdy_user_poker_req, func:handler.on_msg_sdy_user_poker_req, func_name:'on_msg_sdy_user_poker_req', logtag:'[5113:msg_sdy_user_poker_req]' },
        [5114]:{ package_name:'msg', msg_name:'msg_sdy_user_poker_ret', name:msg.msg_sdy_user_poker_ret, func:handler.on_msg_sdy_user_poker_ret, func_name:'on_msg_sdy_user_poker_ret', logtag:'[5114:msg_sdy_user_poker_ret]' },
        [5115]:{ package_name:'msg', msg_name:'msg_sdy_score_pokers', name:msg.msg_sdy_score_pokers, func:handler.on_msg_sdy_score_pokers, func_name:'on_msg_sdy_score_pokers', logtag:'[5115:msg_sdy_score_pokers]' },
        [5116]:{ package_name:'msg', msg_name:'msg_sdy_auto_req', name:msg.msg_sdy_auto_req, func:handler.on_msg_sdy_auto_req, func_name:'on_msg_sdy_auto_req', logtag:'[5116:msg_sdy_auto_req]' },
        [5117]:{ package_name:'msg', msg_name:'msg_sdy_auto_ret', name:msg.msg_sdy_auto_ret, func:handler.on_msg_sdy_auto_ret, func_name:'on_msg_sdy_auto_ret', logtag:'[5117:msg_sdy_auto_ret]' },
        [5118]:{ package_name:'msg', msg_name:'sdy_result_info', name:msg.sdy_result_info, func:handler.on_sdy_result_info, func_name:'on_sdy_result_info', logtag:'[5118:sdy_result_info]' },
        [5119]:{ package_name:'msg', msg_name:'sdy_win_info', name:msg.sdy_win_info, func:handler.on_sdy_win_info, func_name:'on_sdy_win_info', logtag:'[5119:sdy_win_info]' },
        [5120]:{ package_name:'msg', msg_name:'msg_sdy_result', name:msg.msg_sdy_result, func:handler.on_msg_sdy_result, func_name:'on_msg_sdy_result', logtag:'[5120:msg_sdy_result]' },
        [5121]:{ package_name:'msg', msg_name:'msg_sdy_continue_req', name:msg.msg_sdy_continue_req, func:handler.on_msg_sdy_continue_req, func_name:'on_msg_sdy_continue_req', logtag:'[5121:msg_sdy_continue_req]' },
        [5122]:{ package_name:'msg', msg_name:'msg_sdy_continue_ret', name:msg.msg_sdy_continue_ret, func:handler.on_msg_sdy_continue_ret, func_name:'on_msg_sdy_continue_ret', logtag:'[5122:msg_sdy_continue_ret]' },
        [5123]:{ package_name:'msg', msg_name:'msg_sdy_dissolve_req', name:msg.msg_sdy_dissolve_req, func:handler.on_msg_sdy_dissolve_req, func_name:'on_msg_sdy_dissolve_req', logtag:'[5123:msg_sdy_dissolve_req]' },
        [5124]:{ package_name:'msg', msg_name:'msg_sdy_dissolve_ret', name:msg.msg_sdy_dissolve_ret, func:handler.on_msg_sdy_dissolve_ret, func_name:'on_msg_sdy_dissolve_ret', logtag:'[5124:msg_sdy_dissolve_ret]' },
        [5125]:{ package_name:'msg', msg_name:'msg_sdy_vote_dissolve_req', name:msg.msg_sdy_vote_dissolve_req, func:handler.on_msg_sdy_vote_dissolve_req, func_name:'on_msg_sdy_vote_dissolve_req', logtag:'[5125:msg_sdy_vote_dissolve_req]' },
        [5126]:{ package_name:'msg', msg_name:'msg_sdy_vote_dissolve_ret', name:msg.msg_sdy_vote_dissolve_ret, func:handler.on_msg_sdy_vote_dissolve_ret, func_name:'on_msg_sdy_vote_dissolve_ret', logtag:'[5126:msg_sdy_vote_dissolve_ret]' },
        [5127]:{ package_name:'msg', msg_name:'sdy_friend_result_info', name:msg.sdy_friend_result_info, func:handler.on_sdy_friend_result_info, func_name:'on_sdy_friend_result_info', logtag:'[5127:sdy_friend_result_info]' },
        [5128]:{ package_name:'msg', msg_name:'msg_sdy_friend_result', name:msg.msg_sdy_friend_result, func:handler.on_msg_sdy_friend_result, func_name:'on_msg_sdy_friend_result', logtag:'[5128:msg_sdy_friend_result]' },

    };
    module.exports = {
        name:"c_msg_sdy_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
