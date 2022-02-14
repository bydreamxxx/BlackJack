
    const msg = {};
    var handler = require('net_handler_friend');
    var recvFuncs = {
        [3400]:{ package_name:'msg', msg_name:'friend_info2', name:msg.friend_info2, func:handler.on_friend_info2, func_name:'on_friend_info2', logtag:'[3400:friend_info2 ]' },
        [3401]:{ package_name:'msg', msg_name:'friend_apply_info', name:msg.friend_apply_info, func:handler.on_friend_apply_info, func_name:'on_friend_apply_info', logtag:'[3401:friend_apply_info ]' },
        [3402]:{ package_name:'msg', msg_name:'friend_message_info', name:msg.friend_message_info, func:handler.on_friend_message_info, func_name:'on_friend_message_info', logtag:'[3402:friend_message_info ]' },
        [3403]:{ package_name:'msg', msg_name:'friend_game_info', name:msg.friend_game_info, func:handler.on_friend_game_info, func_name:'on_friend_game_info', logtag:'[3403:friend_game_info ]' },
        [3404]:{ package_name:'msg', msg_name:'friend_champion_info', name:msg.friend_champion_info, func:handler.on_friend_champion_info, func_name:'on_friend_champion_info', logtag:'[3404:friend_champion_info ]' },
        [3405]:{ package_name:'msg', msg_name:'friend_detail_info', name:msg.friend_detail_info, func:handler.on_friend_detail_info, func_name:'on_friend_detail_info', logtag:'[3405:friend_detail_info ]' },
        [3406]:{ package_name:'msg', msg_name:'msg_friend_list_req', name:msg.msg_friend_list_req, func:handler.on_msg_friend_list_req, func_name:'on_msg_friend_list_req', logtag:'[3406:msg_friend_list_req ]' },
        [3407]:{ package_name:'msg', msg_name:'msg_friend_list_ret', name:msg.msg_friend_list_ret, func:handler.on_msg_friend_list_ret, func_name:'on_msg_friend_list_ret', logtag:'[3407:msg_friend_list_ret ]' },
        [3408]:{ package_name:'msg', msg_name:'msg_friend_apply_list_req', name:msg.msg_friend_apply_list_req, func:handler.on_msg_friend_apply_list_req, func_name:'on_msg_friend_apply_list_req', logtag:'[3408:msg_friend_apply_list_req ]' },
        [3409]:{ package_name:'msg', msg_name:'msg_friend_apply_list_ret', name:msg.msg_friend_apply_list_ret, func:handler.on_msg_friend_apply_list_ret, func_name:'on_msg_friend_apply_list_ret', logtag:'[3409:msg_friend_apply_list_ret ]' },
        [3410]:{ package_name:'msg', msg_name:'msg_friend_detail_info_req', name:msg.msg_friend_detail_info_req, func:handler.on_msg_friend_detail_info_req, func_name:'on_msg_friend_detail_info_req', logtag:'[3410:msg_friend_detail_info_req ]' },
        [3411]:{ package_name:'msg', msg_name:'msg_friend_detail_info_ret', name:msg.msg_friend_detail_info_ret, func:handler.on_msg_friend_detail_info_ret, func_name:'on_msg_friend_detail_info_ret', logtag:'[3411:msg_friend_detail_info_ret ]' },
        [3412]:{ package_name:'msg', msg_name:'msg_lookup_friend_req', name:msg.msg_lookup_friend_req, func:handler.on_msg_lookup_friend_req, func_name:'on_msg_lookup_friend_req', logtag:'[3412:msg_lookup_friend_req ]' },
        [3413]:{ package_name:'msg', msg_name:'msg_lookup_friend_ret', name:msg.msg_lookup_friend_ret, func:handler.on_msg_lookup_friend_ret, func_name:'on_msg_lookup_friend_ret', logtag:'[3413:msg_lookup_friend_ret ]' },
        [3414]:{ package_name:'msg', msg_name:'msg_add_friend_req', name:msg.msg_add_friend_req, func:handler.on_msg_add_friend_req, func_name:'on_msg_add_friend_req', logtag:'[3414:msg_add_friend_req ]' },
        [3415]:{ package_name:'msg', msg_name:'msg_add_friend_ret', name:msg.msg_add_friend_ret, func:handler.on_msg_add_friend_ret, func_name:'on_msg_add_friend_ret', logtag:'[3415:msg_add_friend_ret ]' },
        [3416]:{ package_name:'msg', msg_name:'msg_be_add_friend', name:msg.msg_be_add_friend, func:handler.on_msg_be_add_friend, func_name:'on_msg_be_add_friend', logtag:'[3416:msg_be_add_friend ]' },
        [3417]:{ package_name:'msg', msg_name:'msg_reply_add_friend_req', name:msg.msg_reply_add_friend_req, func:handler.on_msg_reply_add_friend_req, func_name:'on_msg_reply_add_friend_req', logtag:'[3417:msg_reply_add_friend_req ]' },
        [3418]:{ package_name:'msg', msg_name:'msg_reply_add_friend_ret', name:msg.msg_reply_add_friend_ret, func:handler.on_msg_reply_add_friend_ret, func_name:'on_msg_reply_add_friend_ret', logtag:'[3418:msg_reply_add_friend_ret ]' },
        [3419]:{ package_name:'msg', msg_name:'msg_add_friend_succ', name:msg.msg_add_friend_succ, func:handler.on_msg_add_friend_succ, func_name:'on_msg_add_friend_succ', logtag:'[3419:msg_add_friend_succ ]' },
        [3420]:{ package_name:'msg', msg_name:'msg_del_friend_req', name:msg.msg_del_friend_req, func:handler.on_msg_del_friend_req, func_name:'on_msg_del_friend_req', logtag:'[3420:msg_del_friend_req ]' },
        [3421]:{ package_name:'msg', msg_name:'msg_del_friend_ret', name:msg.msg_del_friend_ret, func:handler.on_msg_del_friend_ret, func_name:'on_msg_del_friend_ret', logtag:'[3421:msg_del_friend_ret ]' },
        [3422]:{ package_name:'msg', msg_name:'msg_be_del_friend_ret', name:msg.msg_be_del_friend_ret, func:handler.on_msg_be_del_friend_ret, func_name:'on_msg_be_del_friend_ret', logtag:'[3422:msg_be_del_friend_ret ]' },
        [3423]:{ package_name:'msg', msg_name:'msg_send_friend_coin_req', name:msg.msg_send_friend_coin_req, func:handler.on_msg_send_friend_coin_req, func_name:'on_msg_send_friend_coin_req', logtag:'[3423:msg_send_friend_coin_req ]' },
        [3424]:{ package_name:'msg', msg_name:'msg_send_friend_coin_ret', name:msg.msg_send_friend_coin_ret, func:handler.on_msg_send_friend_coin_ret, func_name:'on_msg_send_friend_coin_ret', logtag:'[3424:msg_send_friend_coin_ret ]' },
        [3425]:{ package_name:'msg', msg_name:'msg_chat_friend_req', name:msg.msg_chat_friend_req, func:handler.on_msg_chat_friend_req, func_name:'on_msg_chat_friend_req', logtag:'[3425:msg_chat_friend_req ]' },
        [3426]:{ package_name:'msg', msg_name:'msg_chat_friend_ret', name:msg.msg_chat_friend_ret, func:handler.on_msg_chat_friend_ret, func_name:'on_msg_chat_friend_ret', logtag:'[3426:msg_chat_friend_ret ]' },
        [3427]:{ package_name:'msg', msg_name:'msg_friend_messages_list_req', name:msg.msg_friend_messages_list_req, func:handler.on_msg_friend_messages_list_req, func_name:'on_msg_friend_messages_list_req', logtag:'[3427:msg_friend_messages_list_req ]' },
        [3428]:{ package_name:'msg', msg_name:'msg_friend_messages_list_ret', name:msg.msg_friend_messages_list_ret, func:handler.on_msg_friend_messages_list_ret, func_name:'on_msg_friend_messages_list_ret', logtag:'[3428:msg_friend_messages_list_ret ]' },
        [3429]:{ package_name:'msg', msg_name:'msg_friend_modify_mood_req', name:msg.msg_friend_modify_mood_req, func:handler.on_msg_friend_modify_mood_req, func_name:'on_msg_friend_modify_mood_req', logtag:'[3429:msg_friend_modify_mood_req ]' },
        [3430]:{ package_name:'msg', msg_name:'msg_friend_modify_mood_ret', name:msg.msg_friend_modify_mood_ret, func:handler.on_msg_friend_modify_mood_ret, func_name:'on_msg_friend_modify_mood_ret', logtag:'[3430:msg_friend_modify_mood_ret ]' },

    };
    module.exports = {
        name:"c_msg_friend_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
