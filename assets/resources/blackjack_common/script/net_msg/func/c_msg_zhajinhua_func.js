
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [5200]:{ package_name:'msg', msg_name:'msg_zhajinhua_match_2s', name:msg.msg_zhajinhua_match_2s, func:handler.on_msg_zhajinhua_match_2s, func_name:'on_msg_zhajinhua_match_2s', logtag:'[5200:msg_zhajinhua_match_2s ]' },
        [5201]:{ package_name:'msg', msg_name:'msg_zhajinhua_match_2c', name:msg.msg_zhajinhua_match_2c, func:handler.on_msg_zhajinhua_match_2c, func_name:'on_msg_zhajinhua_match_2c', logtag:'[5201:msg_zhajinhua_match_2c ]' },
        [5202]:{ package_name:'msg', msg_name:'msg_zhajinhua_quit_2s', name:msg.msg_zhajinhua_quit_2s, func:handler.on_msg_zhajinhua_quit_2s, func_name:'on_msg_zhajinhua_quit_2s', logtag:'[5202:msg_zhajinhua_quit_2s ]' },
        [5203]:{ package_name:'msg', msg_name:'msg_zhajinhua_quit_2c', name:msg.msg_zhajinhua_quit_2c, func:handler.on_msg_zhajinhua_quit_2c, func_name:'on_msg_zhajinhua_quit_2c', logtag:'[5203:msg_zhajinhua_quit_2c ]' },
        [5204]:{ package_name:'msg', msg_name:'msg_zhajinhua_change_room_2s', name:msg.msg_zhajinhua_change_room_2s, func:handler.on_msg_zhajinhua_change_room_2s, func_name:'on_msg_zhajinhua_change_room_2s', logtag:'[5204:msg_zhajinhua_change_room_2s ]' },
        [5205]:{ package_name:'msg', msg_name:'msg_zhajinhua_change_room_2c', name:msg.msg_zhajinhua_change_room_2c, func:handler.on_msg_zhajinhua_change_room_2c, func_name:'on_msg_zhajinhua_change_room_2c', logtag:'[5205:msg_zhajinhua_change_room_2c ]' },
        [5206]:{ package_name:'msg', msg_name:'nested_zhajinhua_player', name:msg.nested_zhajinhua_player, func:handler.on_nested_zhajinhua_player, func_name:'on_nested_zhajinhua_player', logtag:'[5206:nested_zhajinhua_player ]' },
        [5207]:{ package_name:'msg', msg_name:'msg_zhajinhua_room_info_2c', name:msg.msg_zhajinhua_room_info_2c, func:handler.on_msg_zhajinhua_room_info_2c, func_name:'on_msg_zhajinhua_room_info_2c', logtag:'[5207:msg_zhajinhua_room_info_2c ]' },
        [5208]:{ package_name:'msg', msg_name:'msg_zhajinhua_player_enter_2c', name:msg.msg_zhajinhua_player_enter_2c, func:handler.on_msg_zhajinhua_player_enter_2c, func_name:'on_msg_zhajinhua_player_enter_2c', logtag:'[5208:msg_zhajinhua_player_enter_2c ]' },
        [5209]:{ package_name:'msg', msg_name:'msg_zhajinhua_player_quit_2c', name:msg.msg_zhajinhua_player_quit_2c, func:handler.on_msg_zhajinhua_player_quit_2c, func_name:'on_msg_zhajinhua_player_quit_2c', logtag:'[5209:msg_zhajinhua_player_quit_2c ]' },
        [5210]:{ package_name:'msg', msg_name:'msg_zhajinhua_state_change_2c', name:msg.msg_zhajinhua_state_change_2c, func:handler.on_msg_zhajinhua_state_change_2c, func_name:'on_msg_zhajinhua_state_change_2c', logtag:'[5210:msg_zhajinhua_state_change_2c ]' },
        [5211]:{ package_name:'msg', msg_name:'msg_zhajinhua_ready_2s', name:msg.msg_zhajinhua_ready_2s, func:handler.on_msg_zhajinhua_ready_2s, func_name:'on_msg_zhajinhua_ready_2s', logtag:'[5211:msg_zhajinhua_ready_2s ]' },
        [5212]:{ package_name:'msg', msg_name:'msg_zhajinhua_ready_2c', name:msg.msg_zhajinhua_ready_2c, func:handler.on_msg_zhajinhua_ready_2c, func_name:'on_msg_zhajinhua_ready_2c', logtag:'[5212:msg_zhajinhua_ready_2c ]' },
        [5213]:{ package_name:'msg', msg_name:'msg_zhajinhua_join_game_sites_2c', name:msg.msg_zhajinhua_join_game_sites_2c, func:handler.on_msg_zhajinhua_join_game_sites_2c, func_name:'on_msg_zhajinhua_join_game_sites_2c', logtag:'[5213:msg_zhajinhua_join_game_sites_2c ]' },
        [5214]:{ package_name:'msg', msg_name:'msg_zhajinhua_op_site_2c', name:msg.msg_zhajinhua_op_site_2c, func:handler.on_msg_zhajinhua_op_site_2c, func_name:'on_msg_zhajinhua_op_site_2c', logtag:'[5214:msg_zhajinhua_op_site_2c ]' },
        [5215]:{ package_name:'msg', msg_name:'msg_zhajinhua_op_2s', name:msg.msg_zhajinhua_op_2s, func:handler.on_msg_zhajinhua_op_2s, func_name:'on_msg_zhajinhua_op_2s', logtag:'[5215:msg_zhajinhua_op_2s ]' },
        [5216]:{ package_name:'msg', msg_name:'msg_zhajinhua_op_2c', name:msg.msg_zhajinhua_op_2c, func:handler.on_msg_zhajinhua_op_2c, func_name:'on_msg_zhajinhua_op_2c', logtag:'[5216:msg_zhajinhua_op_2c ]' },
        [5217]:{ package_name:'msg', msg_name:'nested_zhajinhua_back_clip', name:msg.nested_zhajinhua_back_clip, func:handler.on_nested_zhajinhua_back_clip, func_name:'on_nested_zhajinhua_back_clip', logtag:'[5217:nested_zhajinhua_back_clip ]' },
        [5218]:{ package_name:'msg', msg_name:'nested_zhajinhua_result', name:msg.nested_zhajinhua_result, func:handler.on_nested_zhajinhua_result, func_name:'on_nested_zhajinhua_result', logtag:'[5218:nested_zhajinhua_result ]' },
        [5219]:{ package_name:'msg', msg_name:'msg_zhajinhua_result_2c', name:msg.msg_zhajinhua_result_2c, func:handler.on_msg_zhajinhua_result_2c, func_name:'on_msg_zhajinhua_result_2c', logtag:'[5219:msg_zhajinhua_result_2c ]' },
        [5220]:{ package_name:'msg', msg_name:'msg_zhajinhua_set_anto_clips_2s', name:msg.msg_zhajinhua_set_anto_clips_2s, func:handler.on_msg_zhajinhua_set_anto_clips_2s, func_name:'on_msg_zhajinhua_set_anto_clips_2s', logtag:'[5220:msg_zhajinhua_set_anto_clips_2s ]' },
        [5221]:{ package_name:'msg', msg_name:'msg_zhajinhua_set_anto_clips_2c', name:msg.msg_zhajinhua_set_anto_clips_2c, func:handler.on_msg_zhajinhua_set_anto_clips_2c, func_name:'on_msg_zhajinhua_set_anto_clips_2c', logtag:'[5221:msg_zhajinhua_set_anto_clips_2c ]' },
        [5222]:{ package_name:'msg', msg_name:'msg_zhajinhua_clips_update_2c', name:msg.msg_zhajinhua_clips_update_2c, func:handler.on_msg_zhajinhua_clips_update_2c, func_name:'on_msg_zhajinhua_clips_update_2c', logtag:'[5222:msg_zhajinhua_clips_update_2c ]' },
        [5223]:{ package_name:'msg', msg_name:'msg_zhajinhua_dashang_2s', name:msg.msg_zhajinhua_dashang_2s, func:handler.on_msg_zhajinhua_dashang_2s, func_name:'on_msg_zhajinhua_dashang_2s', logtag:'[5223:msg_zhajinhua_dashang_2s ]' },
        [5224]:{ package_name:'msg', msg_name:'msg_zhajinhua_dashang_2c', name:msg.msg_zhajinhua_dashang_2c, func:handler.on_msg_zhajinhua_dashang_2c, func_name:'on_msg_zhajinhua_dashang_2c', logtag:'[5224:msg_zhajinhua_dashang_2c ]' },

    };
    module.exports = {
        name:"c_msg_zhajinhua_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
