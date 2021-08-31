
    const msg = {};
    var handler = require('net_handler_pdk');
    var recvFuncs = {
        [9100]:{ package_name:'msg', msg_name:'paodekuai_rule_info', name:msg.paodekuai_rule_info, func:handler.on_paodekuai_rule_info, func_name:'on_paodekuai_rule_info', logtag:'[9100:paodekuai_rule_info]' },
        [9101]:{ package_name:'msg', msg_name:'pdk_desk_info', name:msg.pdk_desk_info, func:handler.on_pdk_desk_info, func_name:'on_pdk_desk_info', logtag:'[9101:pdk_desk_info ]' },
        [9102]:{ package_name:'msg', msg_name:'pdk_player_info', name:msg.pdk_player_info, func:handler.on_pdk_player_info, func_name:'on_pdk_player_info', logtag:'[9102:pdk_player_info ]' },
        [9103]:{ package_name:'msg', msg_name:'pdk_room_info', name:msg.pdk_room_info, func:handler.on_pdk_room_info, func_name:'on_pdk_room_info', logtag:'[9103:pdk_room_info ]' },
        [9104]:{ package_name:'msg', msg_name:'pdk_reconnect_room_info', name:msg.pdk_reconnect_room_info, func:handler.on_pdk_reconnect_room_info, func_name:'on_pdk_reconnect_room_info', logtag:'[9104:pdk_reconnect_room_info ]' },
        [9105]:{ package_name:'msg', msg_name:'pdk_update_desk_status', name:msg.pdk_update_desk_status, func:handler.on_pdk_update_desk_status, func_name:'on_pdk_update_desk_status', logtag:'[9105:pdk_update_desk_status ]' },
        [9106]:{ package_name:'msg', msg_name:'pdk_hand_poker_list', name:msg.pdk_hand_poker_list, func:handler.on_pdk_hand_poker_list, func_name:'on_pdk_hand_poker_list', logtag:'[9106:pdk_hand_poker_list ]' },
        [9107]:{ package_name:'msg', msg_name:'pdk_play_role_score_change_detail', name:msg.pdk_play_role_score_change_detail, func:handler.on_pdk_play_role_score_change_detail, func_name:'on_pdk_play_role_score_change_detail', logtag:'[9107:pdk_play_role_score_change_detail ]' },
        [9108]:{ package_name:'msg', msg_name:'pdk_play_role_score_change_info', name:msg.pdk_play_role_score_change_info, func:handler.on_pdk_play_role_score_change_info, func_name:'on_pdk_play_role_score_change_info', logtag:'[9108:pdk_play_role_score_change_info ]' },
        [9109]:{ package_name:'msg', msg_name:'pdk_play_result', name:msg.pdk_play_result, func:handler.on_pdk_play_result, func_name:'on_pdk_play_result', logtag:'[9109:pdk_play_result ]' },
        [9110]:{ package_name:'msg', msg_name:'pdk_player_offline_ack', name:msg.pdk_player_offline_ack, func:handler.on_pdk_player_offline_ack, func_name:'on_pdk_player_offline_ack', logtag:'[9110:pdk_player_offline_ack ]' },
        [9111]:{ package_name:'msg', msg_name:'pdk_player_auto_req', name:msg.pdk_player_auto_req, func:handler.on_pdk_player_auto_req, func_name:'on_pdk_player_auto_req', logtag:'[9111:pdk_player_auto_req ]' },
        [9112]:{ package_name:'msg', msg_name:'pdk_player_auto_ack', name:msg.pdk_player_auto_ack, func:handler.on_pdk_player_auto_ack, func_name:'on_pdk_player_auto_ack', logtag:'[9112:pdk_player_auto_ack ]' },
        [9113]:{ package_name:'msg', msg_name:'pdk_play_poker_req', name:msg.pdk_play_poker_req, func:handler.on_pdk_play_poker_req, func_name:'on_pdk_play_poker_req', logtag:'[9113:pdk_play_poker_req ]' },
        [9114]:{ package_name:'msg', msg_name:'pdk_play_poker_ack', name:msg.pdk_play_poker_ack, func:handler.on_pdk_play_poker_ack, func_name:'on_pdk_play_poker_ack', logtag:'[9114:pdk_play_poker_ack ]' },
        [9115]:{ package_name:'msg', msg_name:'pdk_reconnect_req', name:msg.pdk_reconnect_req, func:handler.on_pdk_reconnect_req, func_name:'on_pdk_reconnect_req', logtag:'[9115:pdk_reconnect_req]' },
        [9116]:{ package_name:'msg', msg_name:'pdk_last_player_info', name:msg.pdk_last_player_info, func:handler.on_pdk_last_player_info, func_name:'on_pdk_last_player_info', logtag:'[9116:pdk_last_player_info ]' },
        [9117]:{ package_name:'msg', msg_name:'pdk_last_info', name:msg.pdk_last_info, func:handler.on_pdk_last_info, func_name:'on_pdk_last_info', logtag:'[9117:pdk_last_info ]' },

    };
    module.exports = {
        name:"c_msg_paodekuai_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
