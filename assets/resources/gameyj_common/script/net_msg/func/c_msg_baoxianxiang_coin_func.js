
    const msg = {};
    var handler = require('jlmj_net_handler_coinbank');
    var recvFuncs = {
        [5000]:{ package_name:'msg', msg_name:'msg_coin_bank_is_have_password_2c', name:msg.msg_coin_bank_is_have_password_2c, func:handler.on_msg_coin_bank_is_have_password_2c, func_name:'on_msg_coin_bank_is_have_password_2c', logtag:'[5000:msg_coin_bank_is_have_password_2c ]' },
        [5001]:{ package_name:'msg', msg_name:'msg_coin_bank_store_2s', name:msg.msg_coin_bank_store_2s, func:handler.on_msg_coin_bank_store_2s, func_name:'on_msg_coin_bank_store_2s', logtag:'[5001:msg_coin_bank_store_2s ]' },
        [5002]:{ package_name:'msg', msg_name:'msg_coin_bank_store_2c', name:msg.msg_coin_bank_store_2c, func:handler.on_msg_coin_bank_store_2c, func_name:'on_msg_coin_bank_store_2c', logtag:'[5002:msg_coin_bank_store_2c ]' },
        [5003]:{ package_name:'msg', msg_name:'msg_coin_bank_take_2s', name:msg.msg_coin_bank_take_2s, func:handler.on_msg_coin_bank_take_2s, func_name:'on_msg_coin_bank_take_2s', logtag:'[5003:msg_coin_bank_take_2s ]' },
        [5004]:{ package_name:'msg', msg_name:'msg_coin_bank_take_2c', name:msg.msg_coin_bank_take_2c, func:handler.on_msg_coin_bank_take_2c, func_name:'on_msg_coin_bank_take_2c', logtag:'[5004:msg_coin_bank_take_2c ]' },
        [5005]:{ package_name:'msg', msg_name:'msg_coin_bank_trans_2s', name:msg.msg_coin_bank_trans_2s, func:handler.on_msg_coin_bank_trans_2s, func_name:'on_msg_coin_bank_trans_2s', logtag:'[5005:msg_coin_bank_trans_2s ]' },
        [5006]:{ package_name:'msg', msg_name:'msg_coin_bank_trans_2c', name:msg.msg_coin_bank_trans_2c, func:handler.on_msg_coin_bank_trans_2c, func_name:'on_msg_coin_bank_trans_2c', logtag:'[5006:msg_coin_bank_trans_2c ]' },
        [5007]:{ package_name:'msg', msg_name:'nested_coin_bank_bill', name:msg.nested_coin_bank_bill, func:handler.on_nested_coin_bank_bill, func_name:'on_nested_coin_bank_bill', logtag:'[5007:nested_coin_bank_bill ]' },
        [5008]:{ package_name:'msg', msg_name:'msg_coin_bank_bill_list_2c', name:msg.msg_coin_bank_bill_list_2c, func:handler.on_msg_coin_bank_bill_list_2c, func_name:'on_msg_coin_bank_bill_list_2c', logtag:'[5008:msg_coin_bank_bill_list_2c ]' },
        [5009]:{ package_name:'msg', msg_name:'msg_coin_bank_update_bill_2c', name:msg.msg_coin_bank_update_bill_2c, func:handler.on_msg_coin_bank_update_bill_2c, func_name:'on_msg_coin_bank_update_bill_2c', logtag:'[5009:msg_coin_bank_update_bill_2c ]' },
        [5010]:{ package_name:'msg', msg_name:'msg_coin_bank_password_recovery_2s', name:msg.msg_coin_bank_password_recovery_2s, func:handler.on_msg_coin_bank_password_recovery_2s, func_name:'on_msg_coin_bank_password_recovery_2s', logtag:'[5010:msg_coin_bank_password_recovery_2s ]' },
        [5011]:{ package_name:'msg', msg_name:'msg_coin_bank_password_recovery_2c', name:msg.msg_coin_bank_password_recovery_2c, func:handler.on_msg_coin_bank_password_recovery_2c, func_name:'on_msg_coin_bank_password_recovery_2c', logtag:'[5011:msg_coin_bank_password_recovery_2c ]' },
        [5012]:{ package_name:'msg', msg_name:'msg_player_coin_and_bankcoin_2c', name:msg.msg_player_coin_and_bankcoin_2c, func:handler.on_msg_player_coin_and_bankcoin_2c, func_name:'on_msg_player_coin_and_bankcoin_2c', logtag:'[5012:msg_player_coin_and_bankcoin_2c ]' },
        [5013]:{ package_name:'msg', msg_name:'msg_update_coin_recharge_flag_2c', name:msg.msg_update_coin_recharge_flag_2c, func:handler.on_msg_update_coin_recharge_flag_2c, func_name:'on_msg_update_coin_recharge_flag_2c', logtag:'[5013:msg_update_coin_recharge_flag_2c ]' },
        [5014]:{ package_name:'msg', msg_name:'msg_set_coin_recharge_flag_2s', name:msg.msg_set_coin_recharge_flag_2s, func:handler.on_msg_set_coin_recharge_flag_2s, func_name:'on_msg_set_coin_recharge_flag_2s', logtag:'[5014:msg_set_coin_recharge_flag_2s ]' },
        [5015]:{ package_name:'msg', msg_name:'msg_yyl_notice_2c', name:msg.msg_yyl_notice_2c, func:handler.on_msg_yyl_notice_2c, func_name:'on_msg_yyl_notice_2c', logtag:'[5015:msg_yyl_notice_2c ]' },

    };
    module.exports = {
        name:"c_msg_baoxianxiang_coin_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
