
    const msg = {};
    var handler = require('jlmj_net_handler_hall');
    var recvFuncs = {
        [2300]:{ package_name:'msg', msg_name:'msg_register_server_req', name:msg.msg_register_server_req, func:handler.on_msg_register_server_req, func_name:'on_msg_register_server_req', logtag:'[2300:msg_register_server_req ]' },
        [2301]:{ package_name:'msg', msg_name:'msg_register_server_ack', name:msg.msg_register_server_ack, func:handler.on_msg_register_server_ack, func_name:'on_msg_register_server_ack', logtag:'[2301:msg_register_server_ack ]' },
        [2302]:{ package_name:'msg', msg_name:'msg_update_server_req', name:msg.msg_update_server_req, func:handler.on_msg_update_server_req, func_name:'on_msg_update_server_req', logtag:'[2302:msg_update_server_req ]' },
        [2303]:{ package_name:'msg', msg_name:'nested_user_battle_result', name:msg.nested_user_battle_result, func:handler.on_nested_user_battle_result, func_name:'on_nested_user_battle_result', logtag:'[2303:nested_user_battle_result ]' },
        [2304]:{ package_name:'msg', msg_name:'msg_g2h_setUserGameStatus', name:msg.msg_g2h_setUserGameStatus, func:handler.on_msg_g2h_setUserGameStatus, func_name:'on_msg_g2h_setUserGameStatus', logtag:'[2304:msg_g2h_setUserGameStatus ]' },
        [2305]:{ package_name:'msg', msg_name:'msg_g2h_resetUserGameStatus', name:msg.msg_g2h_resetUserGameStatus, func:handler.on_msg_g2h_resetUserGameStatus, func_name:'on_msg_g2h_resetUserGameStatus', logtag:'[2305:msg_g2h_resetUserGameStatus ]' },
        [2306]:{ package_name:'msg', msg_name:'msg_h2g_syncUserToken', name:msg.msg_h2g_syncUserToken, func:handler.on_msg_h2g_syncUserToken, func_name:'on_msg_h2g_syncUserToken', logtag:'[2306:msg_h2g_syncUserToken ]' },
        [2307]:{ package_name:'msg', msg_name:'msg_g2h_handleUserItem', name:msg.msg_g2h_handleUserItem, func:handler.on_msg_g2h_handleUserItem, func_name:'on_msg_g2h_handleUserItem', logtag:'[2307:msg_g2h_handleUserItem ]' },
        [2308]:{ package_name:'msg', msg_name:'nested_user_battle_record', name:msg.nested_user_battle_record, func:handler.on_nested_user_battle_record, func_name:'on_nested_user_battle_record', logtag:'[2308:nested_user_battle_record ]' },
        [2309]:{ package_name:'msg', msg_name:'msg_g2h_user_battle_history', name:msg.msg_g2h_user_battle_history, func:handler.on_msg_g2h_user_battle_history, func_name:'on_msg_g2h_user_battle_history', logtag:'[2309:msg_g2h_user_battle_history ]' },
        [2310]:{ package_name:'msg', msg_name:'msg_kick_user', name:msg.msg_kick_user, func:handler.on_msg_kick_user, func_name:'on_msg_kick_user', logtag:'[2310:msg_kick_user ]' },
        [2311]:{ package_name:'msg', msg_name:'msg_user_info', name:msg.msg_user_info, func:handler.on_msg_user_info, func_name:'on_msg_user_info', logtag:'[2311:msg_user_info ]' },
        [2312]:{ package_name:'msg', msg_name:'msg_test', name:msg.msg_test, func:handler.on_msg_test, func_name:'on_msg_test', logtag:'[2312:msg_test ]' },

    };
    module.exports = {
        name:"c_msg_cluster_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
