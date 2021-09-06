
    const msg = {};
    var handler = require('jlmj_net_handler_match');
    var recvFuncs = {
        [3700]:{ package_name:'msg', msg_name:'msg_match_start', name:msg.msg_match_start, func:handler.on_msg_match_start, func_name:'on_msg_match_start', logtag:'[3700:msg_match_start ]' },
        [3701]:{ package_name:'msg', msg_name:'msg_match_round_info', name:msg.msg_match_round_info, func:handler.on_msg_match_round_info, func_name:'on_msg_match_round_info', logtag:'[3701:msg_match_round_info ]' },
        [3702]:{ package_name:'msg', msg_name:'msg_match_rank_info', name:msg.msg_match_rank_info, func:handler.on_msg_match_rank_info, func_name:'on_msg_match_rank_info', logtag:'[3702:msg_match_rank_info ]' },
        [3703]:{ package_name:'msg', msg_name:'msg_match_round_num_full', name:msg.msg_match_round_num_full, func:handler.on_msg_match_round_num_full, func_name:'on_msg_match_round_num_full', logtag:'[3703:msg_match_round_num_full ]' },
        [3704]:{ package_name:'msg', msg_name:'msg_match_round_end_line_req', name:msg.msg_match_round_end_line_req, func:handler.on_msg_match_round_end_line_req, func_name:'on_msg_match_round_end_line_req', logtag:'[3704:msg_match_round_end_line_req ]' },
        [3705]:{ package_name:'msg', msg_name:'msg_match_round_end_line_ret', name:msg.msg_match_round_end_line_ret, func:handler.on_msg_match_round_end_line_ret, func_name:'on_msg_match_round_end_line_ret', logtag:'[3705:msg_match_round_end_line_ret ]' },
        [3706]:{ package_name:'msg', msg_name:'msg_match_round_end_line', name:msg.msg_match_round_end_line, func:handler.on_msg_match_round_end_line, func_name:'on_msg_match_round_end_line', logtag:'[3706:msg_match_round_end_line ]' },
        [3707]:{ package_name:'msg', msg_name:'msg_match_reward_info', name:msg.msg_match_reward_info, func:handler.on_msg_match_reward_info, func_name:'on_msg_match_reward_info', logtag:'[3707:msg_match_reward_info ]' },
        [3708]:{ package_name:'msg', msg_name:'msg_match_end', name:msg.msg_match_end, func:handler.on_msg_match_end, func_name:'on_msg_match_end', logtag:'[3708:msg_match_end ]' },
        [3709]:{ package_name:'msg', msg_name:'match_wx_share_req', name:msg.match_wx_share_req, func:handler.on_match_wx_share_req, func_name:'on_match_wx_share_req', logtag:'[3709:match_wx_share_req]' },
        [3710]:{ package_name:'msg', msg_name:'match_wx_share_ret', name:msg.match_wx_share_ret, func:handler.on_match_wx_share_ret, func_name:'on_match_wx_share_ret', logtag:'[3710:match_wx_share_ret]' },
        [3711]:{ package_name:'msg', msg_name:'msg_room_update_score', name:msg.msg_room_update_score, func:handler.on_msg_room_update_score, func_name:'on_msg_room_update_score', logtag:'[3711:msg_room_update_score ]' },
        [3712]:{ package_name:'msg', msg_name:'msg_match_round_countdown', name:msg.msg_match_round_countdown, func:handler.on_msg_match_round_countdown, func_name:'on_msg_match_round_countdown', logtag:'[3712:msg_match_round_countdown ]' },
        [3713]:{ package_name:'msg', msg_name:'msg_is_match_shared', name:msg.msg_is_match_shared, func:handler.on_msg_is_match_shared, func_name:'on_msg_is_match_shared', logtag:'[3713:msg_is_match_shared ]' },
        [3714]:{ package_name:'msg', msg_name:'msg_h2g_room_update_score', name:msg.msg_h2g_room_update_score, func:handler.on_msg_h2g_room_update_score, func_name:'on_msg_h2g_room_update_score', logtag:'[3714:msg_h2g_room_update_score ]' },
        [3715]:{ package_name:'msg', msg_name:'msg_match_round_null', name:msg.msg_match_round_null, func:handler.on_msg_match_round_null, func_name:'on_msg_match_round_null', logtag:'[3715:msg_match_round_null ]' },
        [3716]:{ package_name:'msg', msg_name:'msg_get_match_reward_pool_req', name:msg.msg_get_match_reward_pool_req, func:handler.on_msg_get_match_reward_pool_req, func_name:'on_msg_get_match_reward_pool_req', logtag:'[3716:msg_get_match_reward_pool_req ]' },
        [3717]:{ package_name:'msg', msg_name:'msg_get_match_reward_pool_ret', name:msg.msg_get_match_reward_pool_ret, func:handler.on_msg_get_match_reward_pool_ret, func_name:'on_msg_get_match_reward_pool_ret', logtag:'[3717:msg_get_match_reward_pool_ret ]' },
        [3718]:{ package_name:'msg', msg_name:'msg_match_dead_ret', name:msg.msg_match_dead_ret, func:handler.on_msg_match_dead_ret, func_name:'on_msg_match_dead_ret', logtag:'[3718:msg_match_dead_ret ]' },
        [3719]:{ package_name:'msg', msg_name:'msg_match_reborn_req', name:msg.msg_match_reborn_req, func:handler.on_msg_match_reborn_req, func_name:'on_msg_match_reborn_req', logtag:'[3719:msg_match_reborn_req ]' },
        [3720]:{ package_name:'msg', msg_name:'msg_match_reborn_ret', name:msg.msg_match_reborn_ret, func:handler.on_msg_match_reborn_ret, func_name:'on_msg_match_reborn_ret', logtag:'[3720:msg_match_reborn_ret ]' },
        [3721]:{ package_name:'msg', msg_name:'msg_match_join_req', name:msg.msg_match_join_req, func:handler.on_msg_match_join_req, func_name:'on_msg_match_join_req', logtag:'[3721:msg_match_join_req ]' },
        [3722]:{ package_name:'msg', msg_name:'msg_match_join_ret', name:msg.msg_match_join_ret, func:handler.on_msg_match_join_ret, func_name:'on_msg_match_join_ret', logtag:'[3722:msg_match_join_ret ]' },
        [3723]:{ package_name:'msg', msg_name:'msg_user_match_rank_info', name:msg.msg_user_match_rank_info, func:handler.on_msg_user_match_rank_info, func_name:'on_msg_user_match_rank_info', logtag:'[3723:msg_user_match_rank_info ]' },
        [3724]:{ package_name:'msg', msg_name:'msg_get_match_rank_history_list_req', name:msg.msg_get_match_rank_history_list_req, func:handler.on_msg_get_match_rank_history_list_req, func_name:'on_msg_get_match_rank_history_list_req', logtag:'[3724:msg_get_match_rank_history_list_req ]' },
        [3725]:{ package_name:'msg', msg_name:'msg_get_match_rank_history_list_ret', name:msg.msg_get_match_rank_history_list_ret, func:handler.on_msg_get_match_rank_history_list_ret, func_name:'on_msg_get_match_rank_history_list_ret', logtag:'[3725:msg_get_match_rank_history_list_ret ]' },
        [3726]:{ package_name:'msg', msg_name:'msg_get_match_rank_history_detail_req', name:msg.msg_get_match_rank_history_detail_req, func:handler.on_msg_get_match_rank_history_detail_req, func_name:'on_msg_get_match_rank_history_detail_req', logtag:'[3726:msg_get_match_rank_history_detail_req ]' },
        [3727]:{ package_name:'msg', msg_name:'msg_user_match_detail', name:msg.msg_user_match_detail, func:handler.on_msg_user_match_detail, func_name:'on_msg_user_match_detail', logtag:'[3727:msg_user_match_detail ]' },
        [3728]:{ package_name:'msg', msg_name:'msg_get_match_rank_history_detail_ret', name:msg.msg_get_match_rank_history_detail_ret, func:handler.on_msg_get_match_rank_history_detail_ret, func_name:'on_msg_get_match_rank_history_detail_ret', logtag:'[3728:msg_get_match_rank_history_detail_ret ]' },
        [3729]:{ package_name:'msg', msg_name:'msg_match_win_result', name:msg.msg_match_win_result, func:handler.on_msg_match_win_result, func_name:'on_msg_match_win_result', logtag:'[3729:msg_match_win_result ]' },
        [3730]:{ package_name:'msg', msg_name:'msg_match_room_win_result', name:msg.msg_match_room_win_result, func:handler.on_msg_match_room_win_result, func_name:'on_msg_match_room_win_result', logtag:'[3730:msg_match_room_win_result ]' },

    };
    module.exports = {
        name:"c_msg_match_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
