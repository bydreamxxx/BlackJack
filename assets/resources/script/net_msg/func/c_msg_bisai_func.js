
    const msg = {};
    var handler = require('jlmj_net_handler_bsc');
    var recvFuncs = {
        [3000]:{ package_name:'msg', msg_name:'msg_challenge_round', name:msg.msg_challenge_round, func:handler.on_msg_challenge_round, func_name:'on_msg_challenge_round', logtag:'[3000:msg_challenge_round ]' },
        [3001]:{ package_name:'msg', msg_name:'msg_challenge_wait', name:msg.msg_challenge_wait, func:handler.on_msg_challenge_wait, func_name:'on_msg_challenge_wait', logtag:'[3001:msg_challenge_wait ]' },
        [3002]:{ package_name:'msg', msg_name:'msg_challenge_result', name:msg.msg_challenge_result, func:handler.on_msg_challenge_result, func_name:'on_msg_challenge_result', logtag:'[3002:msg_challenge_result ]' },
        [3003]:{ package_name:'msg', msg_name:'match_info', name:msg.match_info, func:handler.on_match_info, func_name:'on_match_info', logtag:'[3003:match_info ]' },
        [3004]:{ package_name:'msg', msg_name:'match_round_info', name:msg.match_round_info, func:handler.on_match_round_info, func_name:'on_match_round_info', logtag:'[3004:match_round_info ]' },
        [3005]:{ package_name:'msg', msg_name:'match_reward_item', name:msg.match_reward_item, func:handler.on_match_reward_item, func_name:'on_match_reward_item', logtag:'[3005:match_reward_item ]' },
        [3006]:{ package_name:'msg', msg_name:'match_reward_info', name:msg.match_reward_info, func:handler.on_match_reward_info, func_name:'on_match_reward_info', logtag:'[3006:match_reward_info ]' },
        [3007]:{ package_name:'msg', msg_name:'game_user_info', name:msg.game_user_info, func:handler.on_game_user_info, func_name:'on_game_user_info', logtag:'[3007:game_user_info ]' },
        [3008]:{ package_name:'msg', msg_name:'msg_h2g_challenge_info', name:msg.msg_h2g_challenge_info, func:handler.on_msg_h2g_challenge_info, func_name:'on_msg_h2g_challenge_info', logtag:'[3008:msg_h2g_challenge_info]' },
        [3009]:{ package_name:'msg', msg_name:'hall_match_info', name:msg.hall_match_info, func:handler.on_hall_match_info, func_name:'on_hall_match_info', logtag:'[3009:hall_match_info ]' },
        [3010]:{ package_name:'msg', msg_name:'msg_match_list_req', name:msg.msg_match_list_req, func:handler.on_msg_match_list_req, func_name:'on_msg_match_list_req', logtag:'[3010:msg_match_list_req ]' },
        [3011]:{ package_name:'msg', msg_name:'msg_match_list_ack', name:msg.msg_match_list_ack, func:handler.on_msg_match_list_ack, func_name:'on_msg_match_list_ack', logtag:'[3011:msg_match_list_ack ]' },
        [3012]:{ package_name:'msg', msg_name:'msg_update_match_free_times', name:msg.msg_update_match_free_times, func:handler.on_msg_update_match_free_times, func_name:'on_msg_update_match_free_times', logtag:'[3012:msg_update_match_free_times ]' },
        [3013]:{ package_name:'msg', msg_name:'msg_match_sign_req', name:msg.msg_match_sign_req, func:handler.on_msg_match_sign_req, func_name:'on_msg_match_sign_req', logtag:'[3013:msg_match_sign_req ]' },
        [3014]:{ package_name:'msg', msg_name:'msg_match_sign_ack', name:msg.msg_match_sign_ack, func:handler.on_msg_match_sign_ack, func_name:'on_msg_match_sign_ack', logtag:'[3014:msg_match_sign_ack ]' },
        [3015]:{ package_name:'msg', msg_name:'msg_match_unsign_req', name:msg.msg_match_unsign_req, func:handler.on_msg_match_unsign_req, func_name:'on_msg_match_unsign_req', logtag:'[3015:msg_match_unsign_req ]' },
        [3016]:{ package_name:'msg', msg_name:'msg_match_unsign_ack', name:msg.msg_match_unsign_ack, func:handler.on_msg_match_unsign_ack, func_name:'on_msg_match_unsign_ack', logtag:'[3016:msg_match_unsign_ack ]' },
        [3017]:{ package_name:'msg', msg_name:'msg_update_match_num', name:msg.msg_update_match_num, func:handler.on_msg_update_match_num, func_name:'on_msg_update_match_num', logtag:'[3017:msg_update_match_num ]' },
        [3018]:{ package_name:'msg', msg_name:'msg_match_beginning', name:msg.msg_match_beginning, func:handler.on_msg_match_beginning, func_name:'on_msg_match_beginning', logtag:'[3018:msg_match_beginning ]' },
        [3019]:{ package_name:'msg', msg_name:'msg_get_match_signed_num_req', name:msg.msg_get_match_signed_num_req, func:handler.on_msg_get_match_signed_num_req, func_name:'on_msg_get_match_signed_num_req', logtag:'[3019:msg_get_match_signed_num_req ]' },
        [3020]:{ package_name:'msg', msg_name:'msg_get_match_signed_num_ack', name:msg.msg_get_match_signed_num_ack, func:handler.on_msg_get_match_signed_num_ack, func_name:'on_msg_get_match_signed_num_ack', logtag:'[3020:msg_get_match_signed_num_ack ]' },
        [3021]:{ package_name:'msg', msg_name:'challenge_user_result', name:msg.challenge_user_result, func:handler.on_challenge_user_result, func_name:'on_challenge_user_result', logtag:'[3021:challenge_user_result ]' },
        [3022]:{ package_name:'msg', msg_name:'msg_g2h_challenge_result_info', name:msg.msg_g2h_challenge_result_info, func:handler.on_msg_g2h_challenge_result_info, func_name:'on_msg_g2h_challenge_result_info', logtag:'[3022:msg_g2h_challenge_result_info ]' },
        [3023]:{ package_name:'msg', msg_name:'msg_update_match_state', name:msg.msg_update_match_state, func:handler.on_msg_update_match_state, func_name:'on_msg_update_match_state', logtag:'[3023:msg_update_match_state ]' },
        [3024]:{ package_name:'msg', msg_name:'msg_coin_room_drop_reward', name:msg.msg_coin_room_drop_reward, func:handler.on_msg_coin_room_drop_reward, func_name:'on_msg_coin_room_drop_reward', logtag:'[3024:msg_coin_room_drop_reward ]' },
        [3025]:{ package_name:'msg', msg_name:'msg_match_info_req', name:msg.msg_match_info_req, func:handler.on_msg_match_info_req, func_name:'on_msg_match_info_req', logtag:'[3025:msg_match_info_req ]' },
        [3026]:{ package_name:'msg', msg_name:'msg_match_info_ret', name:msg.msg_match_info_ret, func:handler.on_msg_match_info_ret, func_name:'on_msg_match_info_ret', logtag:'[3026:msg_match_info_ret ]' },

    };
    module.exports = {
        name:"c_msg_bisai_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
