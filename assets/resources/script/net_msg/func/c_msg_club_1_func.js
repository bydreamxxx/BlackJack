
    const msg = {};
    var handler = require('jlmj_net_handler_club');
    var recvFuncs = {
        [3100]:{ package_name:'msg', msg_name:'club_room_rule', name:msg.club_room_rule, func:handler.on_club_room_rule, func_name:'on_club_room_rule', logtag:'[3100:club_room_rule ]' },
        [3101]:{ package_name:'msg', msg_name:'h2g_create_club_desk_req', name:msg.h2g_create_club_desk_req, func:handler.on_h2g_create_club_desk_req, func_name:'on_h2g_create_club_desk_req', logtag:'[3101:h2g_create_club_desk_req]' },
        [3102]:{ package_name:'msg', msg_name:'g2h_create_club_desk_ack', name:msg.g2h_create_club_desk_ack, func:handler.on_g2h_create_club_desk_ack, func_name:'on_g2h_create_club_desk_ack', logtag:'[3102:g2h_create_club_desk_ack]' },
        [3103]:{ package_name:'msg', msg_name:'g2h_sync_room_member_num', name:msg.g2h_sync_room_member_num, func:handler.on_g2h_sync_room_member_num, func_name:'on_g2h_sync_room_member_num', logtag:'[3103:g2h_sync_room_member_num]' },
        [3104]:{ package_name:'msg', msg_name:'g2h_sync_room_state', name:msg.g2h_sync_room_state, func:handler.on_g2h_sync_room_state, func_name:'on_g2h_sync_room_state', logtag:'[3104:g2h_sync_room_state]' },
        [3105]:{ package_name:'msg', msg_name:'sync_room_role_score_info', name:msg.sync_room_role_score_info, func:handler.on_sync_room_role_score_info, func_name:'on_sync_room_role_score_info', logtag:'[3105:sync_room_role_score_info]' },
        [3106]:{ package_name:'msg', msg_name:'g2h_sync_room_score', name:msg.g2h_sync_room_score, func:handler.on_g2h_sync_room_score, func_name:'on_g2h_sync_room_score', logtag:'[3106:g2h_sync_room_score]' },

    };
    module.exports = {
        name:"c_msg_club_1_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
