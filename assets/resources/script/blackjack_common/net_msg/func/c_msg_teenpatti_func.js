
    const msg = {};
    var handler = require('net_handler_teenpatti');
    var recvFuncs = {
        [9900]:{ package_name:'msg', msg_name:'teenpatti_user_info', name:msg.teenpatti_user_info, func:handler.on_teenpatti_user_info, func_name:'on_teenpatti_user_info', logtag:'[9900:teenpatti_user_info]' },
        [9901]:{ package_name:'msg', msg_name:'teenpatti_dissolve_info', name:msg.teenpatti_dissolve_info, func:handler.on_teenpatti_dissolve_info, func_name:'on_teenpatti_dissolve_info', logtag:'[9901:teenpatti_dissolve_info]' },
        [9902]:{ package_name:'msg', msg_name:'msg_teenpatti_state_info', name:msg.msg_teenpatti_state_info, func:handler.on_msg_teenpatti_state_info, func_name:'on_msg_teenpatti_state_info', logtag:'[9902:msg_teenpatti_state_info]' },
        [9903]:{ package_name:'msg', msg_name:'teenpatti_poker', name:msg.teenpatti_poker, func:handler.on_teenpatti_poker, func_name:'on_teenpatti_poker', logtag:'[9903:teenpatti_poker]' },
        [9904]:{ package_name:'msg', msg_name:'msg_teenpatti_watch_req', name:msg.msg_teenpatti_watch_req, func:handler.on_msg_teenpatti_watch_req, func_name:'on_msg_teenpatti_watch_req', logtag:'[9904:msg_teenpatti_watch_req]' },
        [9905]:{ package_name:'msg', msg_name:'msg_teenpatti_watch_ret', name:msg.msg_teenpatti_watch_ret, func:handler.on_msg_teenpatti_watch_ret, func_name:'on_msg_teenpatti_watch_ret', logtag:'[9905:msg_teenpatti_watch_ret]' },
        [9906]:{ package_name:'msg', msg_name:'teenpatti_cmp_poker', name:msg.teenpatti_cmp_poker, func:handler.on_teenpatti_cmp_poker, func_name:'on_teenpatti_cmp_poker', logtag:'[9906:teenpatti_cmp_poker]' },
        [9907]:{ package_name:'msg', msg_name:'msg_teenpatti_cmp_req', name:msg.msg_teenpatti_cmp_req, func:handler.on_msg_teenpatti_cmp_req, func_name:'on_msg_teenpatti_cmp_req', logtag:'[9907:msg_teenpatti_cmp_req]' },
        [9908]:{ package_name:'msg', msg_name:'msg_teenpatti_cmp_ret', name:msg.msg_teenpatti_cmp_ret, func:handler.on_msg_teenpatti_cmp_ret, func_name:'on_msg_teenpatti_cmp_ret', logtag:'[9908:msg_teenpatti_cmp_ret]' },
        [9909]:{ package_name:'msg', msg_name:'msg_cmp_broadcast', name:msg.msg_cmp_broadcast, func:handler.on_msg_cmp_broadcast, func_name:'on_msg_cmp_broadcast', logtag:'[9909:msg_cmp_broadcast]' },
        [9910]:{ package_name:'msg', msg_name:'msg_cmp_agree_req', name:msg.msg_cmp_agree_req, func:handler.on_msg_cmp_agree_req, func_name:'on_msg_cmp_agree_req', logtag:'[9910:msg_cmp_agree_req]' },
        [9911]:{ package_name:'msg', msg_name:'msg_cmp_agree_ack', name:msg.msg_cmp_agree_ack, func:handler.on_msg_cmp_agree_ack, func_name:'on_msg_cmp_agree_ack', logtag:'[9911:msg_cmp_agree_ack]' },
        [9912]:{ package_name:'msg', msg_name:'msg_teenpatti_op_req', name:msg.msg_teenpatti_op_req, func:handler.on_msg_teenpatti_op_req, func_name:'on_msg_teenpatti_op_req', logtag:'[9912:msg_teenpatti_op_req ]' },
        [9913]:{ package_name:'msg', msg_name:'msg_teenpatti_op_ret', name:msg.msg_teenpatti_op_ret, func:handler.on_msg_teenpatti_op_ret, func_name:'on_msg_teenpatti_op_ret', logtag:'[9913:msg_teenpatti_op_ret ]' },
        [9914]:{ package_name:'msg', msg_name:'msg_teenpatti_update', name:msg.msg_teenpatti_update, func:handler.on_msg_teenpatti_update, func_name:'on_msg_teenpatti_update', logtag:'[9914:msg_teenpatti_update]' },
        [9915]:{ package_name:'msg', msg_name:'teenpatti_result', name:msg.teenpatti_result, func:handler.on_teenpatti_result, func_name:'on_teenpatti_result', logtag:'[9915:teenpatti_result ]' },
        [9916]:{ package_name:'msg', msg_name:'msg_teenpatti_result', name:msg.msg_teenpatti_result, func:handler.on_msg_teenpatti_result, func_name:'on_msg_teenpatti_result', logtag:'[9916:msg_teenpatti_result]' },
        [9917]:{ package_name:'msg', msg_name:'msg_teenpatti_recharge_req', name:msg.msg_teenpatti_recharge_req, func:handler.on_msg_teenpatti_recharge_req, func_name:'on_msg_teenpatti_recharge_req', logtag:'[9917:msg_teenpatti_recharge_req]' },
        [9918]:{ package_name:'msg', msg_name:'msg_teenpatti_recharge_ret', name:msg.msg_teenpatti_recharge_ret, func:handler.on_msg_teenpatti_recharge_ret, func_name:'on_msg_teenpatti_recharge_ret', logtag:'[9918:msg_teenpatti_recharge_ret]' },
        [9919]:{ package_name:'msg', msg_name:'msg_teenpatti_cancel_auto_req', name:msg.msg_teenpatti_cancel_auto_req, func:handler.on_msg_teenpatti_cancel_auto_req, func_name:'on_msg_teenpatti_cancel_auto_req', logtag:'[9919:msg_teenpatti_cancel_auto_req]' },
        [9920]:{ package_name:'msg', msg_name:'msg_teenpatti_cancel_auto_ret', name:msg.msg_teenpatti_cancel_auto_ret, func:handler.on_msg_teenpatti_cancel_auto_ret, func_name:'on_msg_teenpatti_cancel_auto_ret', logtag:'[9920:msg_teenpatti_cancel_auto_ret]' },
        [9921]:{ package_name:'msg', msg_name:'msg_teenpatti_auto_status', name:msg.msg_teenpatti_auto_status, func:handler.on_msg_teenpatti_auto_status, func_name:'on_msg_teenpatti_auto_status', logtag:'[9921:msg_teenpatti_auto_status ]' },
        [9922]:{ package_name:'msg', msg_name:'msg_show_card_req', name:msg.msg_show_card_req, func:handler.on_msg_show_card_req, func_name:'on_msg_show_card_req', logtag:'[9922:msg_show_card_req]' },
        [9923]:{ package_name:'msg', msg_name:'msg_show_card_ack', name:msg.msg_show_card_ack, func:handler.on_msg_show_card_ack, func_name:'on_msg_show_card_ack', logtag:'[9923:msg_show_card_ack]' },

    };
    module.exports = {
        name:"c_msg_teenpatti_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
