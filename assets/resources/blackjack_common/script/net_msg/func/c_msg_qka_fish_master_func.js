
    const msg = {};
    var handler = require('net_handler_fish_doyen');
    var recvFuncs = {
        [9200]:{ package_name:'msg', msg_name:'qka_fish_master_user_info', name:msg.qka_fish_master_user_info, func:handler.on_qka_fish_master_user_info, func_name:'on_qka_fish_master_user_info', logtag:'[9200:qka_fish_master_user_info ]' },
        [9201]:{ package_name:'msg', msg_name:'msg_qka_fish_master_room_info', name:msg.msg_qka_fish_master_room_info, func:handler.on_msg_qka_fish_master_room_info, func_name:'on_msg_qka_fish_master_room_info', logtag:'[9201:msg_qka_fish_master_room_info ]' },
        [9202]:{ package_name:'msg', msg_name:'msg_qka_fish_master_set_bet_req', name:msg.msg_qka_fish_master_set_bet_req, func:handler.on_msg_qka_fish_master_set_bet_req, func_name:'on_msg_qka_fish_master_set_bet_req', logtag:'[9202:msg_qka_fish_master_set_bet_req ]' },
        [9203]:{ package_name:'msg', msg_name:'msg_qka_fish_master_set_bet_ret', name:msg.msg_qka_fish_master_set_bet_ret, func:handler.on_msg_qka_fish_master_set_bet_ret, func_name:'on_msg_qka_fish_master_set_bet_ret', logtag:'[9203:msg_qka_fish_master_set_bet_ret]' },
        [9204]:{ package_name:'msg', msg_name:'msg_qka_fish_master_bet_req', name:msg.msg_qka_fish_master_bet_req, func:handler.on_msg_qka_fish_master_bet_req, func_name:'on_msg_qka_fish_master_bet_req', logtag:'[9204:msg_qka_fish_master_bet_req]' },
        [9205]:{ package_name:'msg', msg_name:'msg_qka_fish_master_bet_ret', name:msg.msg_qka_fish_master_bet_ret, func:handler.on_msg_qka_fish_master_bet_ret, func_name:'on_msg_qka_fish_master_bet_ret', logtag:'[9205:msg_qka_fish_master_bet_ret]' },
        [9206]:{ package_name:'msg', msg_name:'qka_fish_master_hit_req_info', name:msg.qka_fish_master_hit_req_info, func:handler.on_qka_fish_master_hit_req_info, func_name:'on_qka_fish_master_hit_req_info', logtag:'[9206:qka_fish_master_hit_req_info]' },
        [9207]:{ package_name:'msg', msg_name:'msg_qka_fish_master_hit_req', name:msg.msg_qka_fish_master_hit_req, func:handler.on_msg_qka_fish_master_hit_req, func_name:'on_msg_qka_fish_master_hit_req', logtag:'[9207:msg_qka_fish_master_hit_req]' },
        [9208]:{ package_name:'msg', msg_name:'qka_fish_master_hit_info', name:msg.qka_fish_master_hit_info, func:handler.on_qka_fish_master_hit_info, func_name:'on_qka_fish_master_hit_info', logtag:'[9208:qka_fish_master_hit_info]' },
        [9209]:{ package_name:'msg', msg_name:'msg_qka_fish_master_hit_ret', name:msg.msg_qka_fish_master_hit_ret, func:handler.on_msg_qka_fish_master_hit_ret, func_name:'on_msg_qka_fish_master_hit_ret', logtag:'[9209:msg_qka_fish_master_hit_ret]' },
        [9210]:{ package_name:'msg', msg_name:'msg_qka_fish_master_appear', name:msg.msg_qka_fish_master_appear, func:handler.on_msg_qka_fish_master_appear, func_name:'on_msg_qka_fish_master_appear', logtag:'[9210:msg_qka_fish_master_appear ]' },
        [9211]:{ package_name:'msg', msg_name:'msg_qka_fish_master_clean', name:msg.msg_qka_fish_master_clean, func:handler.on_msg_qka_fish_master_clean, func_name:'on_msg_qka_fish_master_clean', logtag:'[9211:msg_qka_fish_master_clean ]' },
        [9212]:{ package_name:'msg', msg_name:'msg_qka_fish_master_array', name:msg.msg_qka_fish_master_array, func:handler.on_msg_qka_fish_master_array, func_name:'on_msg_qka_fish_master_array', logtag:'[9212:msg_qka_fish_master_array ]' },
        [9213]:{ package_name:'msg', msg_name:'msg_qka_fish_master_coin_return', name:msg.msg_qka_fish_master_coin_return, func:handler.on_msg_qka_fish_master_coin_return, func_name:'on_msg_qka_fish_master_coin_return', logtag:'[9213:msg_qka_fish_master_coin_return ]' },
        [9214]:{ package_name:'msg', msg_name:'msg_qka_fish_master_room_quit_req', name:msg.msg_qka_fish_master_room_quit_req, func:handler.on_msg_qka_fish_master_room_quit_req, func_name:'on_msg_qka_fish_master_room_quit_req', logtag:'[9214:msg_qka_fish_master_room_quit_req ]' },
        [9215]:{ package_name:'msg', msg_name:'msg_qka_fish_use_item_req', name:msg.msg_qka_fish_use_item_req, func:handler.on_msg_qka_fish_use_item_req, func_name:'on_msg_qka_fish_use_item_req', logtag:'[9215:msg_qka_fish_use_item_req ]' },
        [9216]:{ package_name:'msg', msg_name:'msg_qka_fish_use_item_ret', name:msg.msg_qka_fish_use_item_ret, func:handler.on_msg_qka_fish_use_item_ret, func_name:'on_msg_qka_fish_use_item_ret', logtag:'[9216:msg_qka_fish_use_item_ret ]' },
        [9217]:{ package_name:'msg', msg_name:'msg_qka_fish_effect', name:msg.msg_qka_fish_effect, func:handler.on_msg_qka_fish_effect, func_name:'on_msg_qka_fish_effect', logtag:'[9217:msg_qka_fish_effect ]' },
        [9218]:{ package_name:'msg', msg_name:'msg_qka_buy_item_req', name:msg.msg_qka_buy_item_req, func:handler.on_msg_qka_buy_item_req, func_name:'on_msg_qka_buy_item_req', logtag:'[9218:msg_qka_buy_item_req ]' },
        [9219]:{ package_name:'msg', msg_name:'msg_qka_buy_item_ret', name:msg.msg_qka_buy_item_ret, func:handler.on_msg_qka_buy_item_ret, func_name:'on_msg_qka_buy_item_ret', logtag:'[9219:msg_qka_buy_item_ret ]' },
        [9220]:{ package_name:'msg', msg_name:'msg_qka_sync_coin', name:msg.msg_qka_sync_coin, func:handler.on_msg_qka_sync_coin, func_name:'on_msg_qka_sync_coin', logtag:'[9220:msg_qka_sync_coin ]' },
        [9221]:{ package_name:'msg', msg_name:'msg_qka_fish_info', name:msg.msg_qka_fish_info, func:handler.on_msg_qka_fish_info, func_name:'on_msg_qka_fish_info', logtag:'[9221:msg_qka_fish_info ]' },

    };
    module.exports = {
        name:"c_msg_qka_fish_master_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
