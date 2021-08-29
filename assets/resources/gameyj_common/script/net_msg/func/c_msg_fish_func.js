
    const msg = {};
    var handler = require('net_handler_fish');
    var recvFuncs = {
        [7700]:{ package_name:'msg', msg_name:'fish_user_info', name:msg.fish_user_info, func:handler.on_fish_user_info, func_name:'on_fish_user_info', logtag:'[7700:fish_user_info ]' },
        [7701]:{ package_name:'msg', msg_name:'msg_fish_room_info', name:msg.msg_fish_room_info, func:handler.on_msg_fish_room_info, func_name:'on_msg_fish_room_info', logtag:'[7701:msg_fish_room_info ]' },
        [7702]:{ package_name:'msg', msg_name:'msg_fish_set_bet_req', name:msg.msg_fish_set_bet_req, func:handler.on_msg_fish_set_bet_req, func_name:'on_msg_fish_set_bet_req', logtag:'[7702:msg_fish_set_bet_req ]' },
        [7703]:{ package_name:'msg', msg_name:'msg_fish_set_bet_ret', name:msg.msg_fish_set_bet_ret, func:handler.on_msg_fish_set_bet_ret, func_name:'on_msg_fish_set_bet_ret', logtag:'[7703:msg_fish_set_bet_ret]' },
        [7704]:{ package_name:'msg', msg_name:'msg_fish_bet_req', name:msg.msg_fish_bet_req, func:handler.on_msg_fish_bet_req, func_name:'on_msg_fish_bet_req', logtag:'[7704:msg_fish_bet_req]' },
        [7705]:{ package_name:'msg', msg_name:'msg_fish_bet_ret', name:msg.msg_fish_bet_ret, func:handler.on_msg_fish_bet_ret, func_name:'on_msg_fish_bet_ret', logtag:'[7705:msg_fish_bet_ret]' },
        [7706]:{ package_name:'msg', msg_name:'fish_hit_req_info', name:msg.fish_hit_req_info, func:handler.on_fish_hit_req_info, func_name:'on_fish_hit_req_info', logtag:'[7706:fish_hit_req_info]' },
        [7707]:{ package_name:'msg', msg_name:'msg_fish_hit_req', name:msg.msg_fish_hit_req, func:handler.on_msg_fish_hit_req, func_name:'on_msg_fish_hit_req', logtag:'[7707:msg_fish_hit_req]' },
        [7708]:{ package_name:'msg', msg_name:'fish_hit_info', name:msg.fish_hit_info, func:handler.on_fish_hit_info, func_name:'on_fish_hit_info', logtag:'[7708:fish_hit_info]' },
        [7709]:{ package_name:'msg', msg_name:'msg_fish_hit_ret', name:msg.msg_fish_hit_ret, func:handler.on_msg_fish_hit_ret, func_name:'on_msg_fish_hit_ret', logtag:'[7709:msg_fish_hit_ret]' },
        [7710]:{ package_name:'msg', msg_name:'msg_fish_appear', name:msg.msg_fish_appear, func:handler.on_msg_fish_appear, func_name:'on_msg_fish_appear', logtag:'[7710:msg_fish_appear ]' },
        [7711]:{ package_name:'msg', msg_name:'msg_fish_clean', name:msg.msg_fish_clean, func:handler.on_msg_fish_clean, func_name:'on_msg_fish_clean', logtag:'[7711:msg_fish_clean ]' },
        [7712]:{ package_name:'msg', msg_name:'msg_fish_array', name:msg.msg_fish_array, func:handler.on_msg_fish_array, func_name:'on_msg_fish_array', logtag:'[7712:msg_fish_array ]' },
        [7713]:{ package_name:'msg', msg_name:'msg_fish_coin_return', name:msg.msg_fish_coin_return, func:handler.on_msg_fish_coin_return, func_name:'on_msg_fish_coin_return', logtag:'[7713:msg_fish_coin_return ]' },
        [7714]:{ package_name:'msg', msg_name:'msg_fish_room_quit_req', name:msg.msg_fish_room_quit_req, func:handler.on_msg_fish_room_quit_req, func_name:'on_msg_fish_room_quit_req', logtag:'[7714:msg_fish_room_quit_req ]' },

    };
    module.exports = {
        name:"c_msg_fish_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
