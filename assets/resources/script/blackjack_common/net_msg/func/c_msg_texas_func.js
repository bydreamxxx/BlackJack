
    const msg = {};
    var handler = require('net_handler_texas');
    var recvFuncs = {
        [9700]:{ package_name:'msg', msg_name:'msg_texas_banker_notify', name:msg.msg_texas_banker_notify, func:handler.on_msg_texas_banker_notify, func_name:'on_msg_texas_banker_notify', logtag:'[9700:msg_texas_banker_notify]' },
        [9701]:{ package_name:'msg', msg_name:'msg_texas_player_poker_notify', name:msg.msg_texas_player_poker_notify, func:handler.on_msg_texas_player_poker_notify, func_name:'on_msg_texas_player_poker_notify', logtag:'[9701:msg_texas_player_poker_notify]' },
        [9702]:{ package_name:'msg', msg_name:'msg_texas_common_poker_notify', name:msg.msg_texas_common_poker_notify, func:handler.on_msg_texas_common_poker_notify, func_name:'on_msg_texas_common_poker_notify', logtag:'[9702:msg_texas_common_poker_notify]' },
        [9703]:{ package_name:'msg', msg_name:'msg_texas_bet_notify', name:msg.msg_texas_bet_notify, func:handler.on_msg_texas_bet_notify, func_name:'on_msg_texas_bet_notify', logtag:'[9703:msg_texas_bet_notify]' },
        [9704]:{ package_name:'msg', msg_name:'msg_texas_operate_player_notify', name:msg.msg_texas_operate_player_notify, func:handler.on_msg_texas_operate_player_notify, func_name:'on_msg_texas_operate_player_notify', logtag:'[9704:msg_texas_operate_player_notify]' },
        [9705]:{ package_name:'msg', msg_name:'msg_texas_bet_req', name:msg.msg_texas_bet_req, func:handler.on_msg_texas_bet_req, func_name:'on_msg_texas_bet_req', logtag:'[9705:msg_texas_bet_req]' },
        [9706]:{ package_name:'msg', msg_name:'msg_texas_bet_ret', name:msg.msg_texas_bet_ret, func:handler.on_msg_texas_bet_ret, func_name:'on_msg_texas_bet_ret', logtag:'[9706:msg_texas_bet_ret]' },
        [9707]:{ package_name:'msg', msg_name:'msg_texas_auto_req', name:msg.msg_texas_auto_req, func:handler.on_msg_texas_auto_req, func_name:'on_msg_texas_auto_req', logtag:'[9707:msg_texas_auto_req ]' },
        [9708]:{ package_name:'msg', msg_name:'msg_texas_auto_ret', name:msg.msg_texas_auto_ret, func:handler.on_msg_texas_auto_ret, func_name:'on_msg_texas_auto_ret', logtag:'[9708:msg_texas_auto_ret ]' },
        [9709]:{ package_name:'msg', msg_name:'nested_texas_user_info', name:msg.nested_texas_user_info, func:handler.on_nested_texas_user_info, func_name:'on_nested_texas_user_info', logtag:'[9709:nested_texas_user_info ]' },
        [9710]:{ package_name:'msg', msg_name:'msg_texas_room', name:msg.msg_texas_room, func:handler.on_msg_texas_room, func_name:'on_msg_texas_room', logtag:'[9710:msg_texas_room ]' },
        [9711]:{ package_name:'msg', msg_name:'texas_table_result', name:msg.texas_table_result, func:handler.on_texas_table_result, func_name:'on_texas_table_result', logtag:'[9711:texas_table_result]' },
        [9712]:{ package_name:'msg', msg_name:'msg_texas_results_notify', name:msg.msg_texas_results_notify, func:handler.on_msg_texas_results_notify, func_name:'on_msg_texas_results_notify', logtag:'[9712:msg_texas_results_notify ]' },
        [9713]:{ package_name:'msg', msg_name:'msg_texas_room_state_notify', name:msg.msg_texas_room_state_notify, func:handler.on_msg_texas_room_state_notify, func_name:'on_msg_texas_room_state_notify', logtag:'[9713:msg_texas_room_state_notify ]' },
        [9714]:{ package_name:'msg', msg_name:'nested_texas_player_poker', name:msg.nested_texas_player_poker, func:handler.on_nested_texas_player_poker, func_name:'on_nested_texas_player_poker', logtag:'[9714:nested_texas_player_poker ]' },
        [9715]:{ package_name:'msg', msg_name:'msg_texas_other_player_poker_notify', name:msg.msg_texas_other_player_poker_notify, func:handler.on_msg_texas_other_player_poker_notify, func_name:'on_msg_texas_other_player_poker_notify', logtag:'[9715:msg_texas_other_player_poker_notify]' },
        [9716]:{ package_name:'msg', msg_name:'msg_texas_sync_coin', name:msg.msg_texas_sync_coin, func:handler.on_msg_texas_sync_coin, func_name:'on_msg_texas_sync_coin', logtag:'[9716:msg_texas_sync_coin ]' },
        [9717]:{ package_name:'msg', msg_name:'texas_player_win_rate', name:msg.texas_player_win_rate, func:handler.on_texas_player_win_rate, func_name:'on_texas_player_win_rate', logtag:'[9717:texas_player_win_rate ]' },
        [9718]:{ package_name:'msg', msg_name:'msg_texas_test_win_rate', name:msg.msg_texas_test_win_rate, func:handler.on_msg_texas_test_win_rate, func_name:'on_msg_texas_test_win_rate', logtag:'[9718:msg_texas_test_win_rate ]' },
        [9719]:{ package_name:'msg', msg_name:'texas_sync_game_status', name:msg.texas_sync_game_status, func:handler.on_texas_sync_game_status, func_name:'on_texas_sync_game_status', logtag:'[9719:texas_sync_game_status ]' },
        [9720]:{ package_name:'msg', msg_name:'msg_texas_sync_game_status', name:msg.msg_texas_sync_game_status, func:handler.on_msg_texas_sync_game_status, func_name:'on_msg_texas_sync_game_status', logtag:'[9720:msg_texas_sync_game_status ]' },
        [9721]:{ package_name:'msg', msg_name:'texas_player_poker_type', name:msg.texas_player_poker_type, func:handler.on_texas_player_poker_type, func_name:'on_texas_player_poker_type', logtag:'[9721:texas_player_poker_type ]' },
        [9722]:{ package_name:'msg', msg_name:'texas_player_list', name:msg.texas_player_list, func:handler.on_texas_player_list, func_name:'on_texas_player_list', logtag:'[9722:texas_player_list ]' },
        [9723]:{ package_name:'msg', msg_name:'texas_tips_req', name:msg.texas_tips_req, func:handler.on_texas_tips_req, func_name:'on_texas_tips_req', logtag:'[9723:texas_tips_req]' },
        [9724]:{ package_name:'msg', msg_name:'texas_tips_ack', name:msg.texas_tips_ack, func:handler.on_texas_tips_ack, func_name:'on_texas_tips_ack', logtag:'[9724:texas_tips_ack]' },
        [9725]:{ package_name:'msg', msg_name:'texas_wheel_user', name:msg.texas_wheel_user, func:handler.on_texas_wheel_user, func_name:'on_texas_wheel_user', logtag:'[9725:texas_wheel_user]' },
        [9726]:{ package_name:'msg', msg_name:'msg_texas_wheel_result', name:msg.msg_texas_wheel_result, func:handler.on_msg_texas_wheel_result, func_name:'on_msg_texas_wheel_result', logtag:'[9726:msg_texas_wheel_result]' },

    };
    module.exports = {
        name:"c_msg_texas_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
