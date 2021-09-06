
    const msg = {};
    var handler = require('jlmj_net_handler_bank');
    var recvFuncs = {
        [2000]:{ package_name:'msg', msg_name:'msg_bank_is_have_password_2c', name:msg.msg_bank_is_have_password_2c, func:handler.on_msg_bank_is_have_password_2c, func_name:'on_msg_bank_is_have_password_2c', logtag:'[2000:msg_bank_is_have_password_2c ]' },
        [2001]:{ package_name:'msg', msg_name:'msg_bank_store_2s', name:msg.msg_bank_store_2s, func:handler.on_msg_bank_store_2s, func_name:'on_msg_bank_store_2s', logtag:'[2001:msg_bank_store_2s ]' },
        [2002]:{ package_name:'msg', msg_name:'msg_bank_store_2c', name:msg.msg_bank_store_2c, func:handler.on_msg_bank_store_2c, func_name:'on_msg_bank_store_2c', logtag:'[2002:msg_bank_store_2c ]' },
        [2003]:{ package_name:'msg', msg_name:'msg_bank_take_2s', name:msg.msg_bank_take_2s, func:handler.on_msg_bank_take_2s, func_name:'on_msg_bank_take_2s', logtag:'[2003:msg_bank_take_2s ]' },
        [2004]:{ package_name:'msg', msg_name:'msg_bank_take_2c', name:msg.msg_bank_take_2c, func:handler.on_msg_bank_take_2c, func_name:'on_msg_bank_take_2c', logtag:'[2004:msg_bank_take_2c ]' },
        [2005]:{ package_name:'msg', msg_name:'msg_bank_password_recovery_2s', name:msg.msg_bank_password_recovery_2s, func:handler.on_msg_bank_password_recovery_2s, func_name:'on_msg_bank_password_recovery_2s', logtag:'[2005:msg_bank_password_recovery_2s ]' },
        [2006]:{ package_name:'msg', msg_name:'msg_bank_password_recovery_2c', name:msg.msg_bank_password_recovery_2c, func:handler.on_msg_bank_password_recovery_2c, func_name:'on_msg_bank_password_recovery_2c', logtag:'[2006:msg_bank_password_recovery_2c ]' },
        [2007]:{ package_name:'msg', msg_name:'msg_player_gold_change_2c', name:msg.msg_player_gold_change_2c, func:handler.on_msg_player_gold_change_2c, func_name:'on_msg_player_gold_change_2c', logtag:'[2007:msg_player_gold_change_2c ]' },
        [2008]:{ package_name:'msg', msg_name:'msg_player_gold_and_bankgold_2c', name:msg.msg_player_gold_and_bankgold_2c, func:handler.on_msg_player_gold_and_bankgold_2c, func_name:'on_msg_player_gold_and_bankgold_2c', logtag:'[2008:msg_player_gold_and_bankgold_2c ]' },
        [2009]:{ package_name:'msg', msg_name:'msg_sync_room_gold_2c', name:msg.msg_sync_room_gold_2c, func:handler.on_msg_sync_room_gold_2c, func_name:'on_msg_sync_room_gold_2c', logtag:'[2009:msg_sync_room_gold_2c ]' },
        [2010]:{ package_name:'msg', msg_name:'msg_h2g_rescue_room', name:msg.msg_h2g_rescue_room, func:handler.on_msg_h2g_rescue_room, func_name:'on_msg_h2g_rescue_room', logtag:'[2010:msg_h2g_rescue_room ]' },

    };
    module.exports = {
        name:"c_msg_baoxianxiang_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
