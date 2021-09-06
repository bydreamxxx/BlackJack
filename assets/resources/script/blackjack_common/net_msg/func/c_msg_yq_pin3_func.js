
    const msg = {};
    var handler = require('net_handler_new_dsz');
    var recvFuncs = {
        [7000]:{ package_name:'msg', msg_name:'yq_pin3_user_info', name:msg.yq_pin3_user_info, func:handler.on_yq_pin3_user_info, func_name:'on_yq_pin3_user_info', logtag:'[7000:yq_pin3_user_info]' },
        [7001]:{ package_name:'msg', msg_name:'yq_pin3_dissolve_info', name:msg.yq_pin3_dissolve_info, func:handler.on_yq_pin3_dissolve_info, func_name:'on_yq_pin3_dissolve_info', logtag:'[7001:yq_pin3_dissolve_info]' },
        [7002]:{ package_name:'msg', msg_name:'msg_yq_pin3_state_info', name:msg.msg_yq_pin3_state_info, func:handler.on_msg_yq_pin3_state_info, func_name:'on_msg_yq_pin3_state_info', logtag:'[7002:msg_yq_pin3_state_info]' },
        [7003]:{ package_name:'msg', msg_name:'yq_pin3_poker', name:msg.yq_pin3_poker, func:handler.on_yq_pin3_poker, func_name:'on_yq_pin3_poker', logtag:'[7003:yq_pin3_poker]' },
        [7004]:{ package_name:'msg', msg_name:'msg_yq_pin3_watch_req', name:msg.msg_yq_pin3_watch_req, func:handler.on_msg_yq_pin3_watch_req, func_name:'on_msg_yq_pin3_watch_req', logtag:'[7004:msg_yq_pin3_watch_req]' },
        [7005]:{ package_name:'msg', msg_name:'msg_yq_pin3_watch_ret', name:msg.msg_yq_pin3_watch_ret, func:handler.on_msg_yq_pin3_watch_ret, func_name:'on_msg_yq_pin3_watch_ret', logtag:'[7005:msg_yq_pin3_watch_ret]' },
        [7006]:{ package_name:'msg', msg_name:'yq_pin3_cmp_poker', name:msg.yq_pin3_cmp_poker, func:handler.on_yq_pin3_cmp_poker, func_name:'on_yq_pin3_cmp_poker', logtag:'[7006:yq_pin3_cmp_poker]' },
        [7007]:{ package_name:'msg', msg_name:'msg_yq_pin3_cmp_req', name:msg.msg_yq_pin3_cmp_req, func:handler.on_msg_yq_pin3_cmp_req, func_name:'on_msg_yq_pin3_cmp_req', logtag:'[7007:msg_yq_pin3_cmp_req]' },
        [7008]:{ package_name:'msg', msg_name:'msg_yq_pin3_cmp_ret', name:msg.msg_yq_pin3_cmp_ret, func:handler.on_msg_yq_pin3_cmp_ret, func_name:'on_msg_yq_pin3_cmp_ret', logtag:'[7008:msg_yq_pin3_cmp_ret]' },
        [7009]:{ package_name:'msg', msg_name:'msg_yq_pin3_op_req', name:msg.msg_yq_pin3_op_req, func:handler.on_msg_yq_pin3_op_req, func_name:'on_msg_yq_pin3_op_req', logtag:'[7009:msg_yq_pin3_op_req ]' },
        [7010]:{ package_name:'msg', msg_name:'msg_yq_pin3_op_ret', name:msg.msg_yq_pin3_op_ret, func:handler.on_msg_yq_pin3_op_ret, func_name:'on_msg_yq_pin3_op_ret', logtag:'[7010:msg_yq_pin3_op_ret ]' },
        [7011]:{ package_name:'msg', msg_name:'msg_yq_pin3_update', name:msg.msg_yq_pin3_update, func:handler.on_msg_yq_pin3_update, func_name:'on_msg_yq_pin3_update', logtag:'[7011:msg_yq_pin3_update]' },
        [7012]:{ package_name:'msg', msg_name:'yq_pin3_result', name:msg.yq_pin3_result, func:handler.on_yq_pin3_result, func_name:'on_yq_pin3_result', logtag:'[7012:yq_pin3_result ]' },
        [7013]:{ package_name:'msg', msg_name:'msg_yq_pin3_result', name:msg.msg_yq_pin3_result, func:handler.on_msg_yq_pin3_result, func_name:'on_msg_yq_pin3_result', logtag:'[7013:msg_yq_pin3_result]' },
        [7014]:{ package_name:'msg', msg_name:'msg_yq_pin3_recharge_req', name:msg.msg_yq_pin3_recharge_req, func:handler.on_msg_yq_pin3_recharge_req, func_name:'on_msg_yq_pin3_recharge_req', logtag:'[7014:msg_yq_pin3_recharge_req]' },
        [7015]:{ package_name:'msg', msg_name:'msg_yq_pin3_recharge_ret', name:msg.msg_yq_pin3_recharge_ret, func:handler.on_msg_yq_pin3_recharge_ret, func_name:'on_msg_yq_pin3_recharge_ret', logtag:'[7015:msg_yq_pin3_recharge_ret]' },
        [7016]:{ package_name:'msg', msg_name:'msg_yq_pin3_cancel_auto_req', name:msg.msg_yq_pin3_cancel_auto_req, func:handler.on_msg_yq_pin3_cancel_auto_req, func_name:'on_msg_yq_pin3_cancel_auto_req', logtag:'[7016:msg_yq_pin3_cancel_auto_req]' },
        [7017]:{ package_name:'msg', msg_name:'msg_yq_pin3_cancel_auto_ret', name:msg.msg_yq_pin3_cancel_auto_ret, func:handler.on_msg_yq_pin3_cancel_auto_ret, func_name:'on_msg_yq_pin3_cancel_auto_ret', logtag:'[7017:msg_yq_pin3_cancel_auto_ret]' },
        [7018]:{ package_name:'msg', msg_name:'msg_yq_pin3_auto_status', name:msg.msg_yq_pin3_auto_status, func:handler.on_msg_yq_pin3_auto_status, func_name:'on_msg_yq_pin3_auto_status', logtag:'[7018:msg_yq_pin3_auto_status ]' },

    };
    module.exports = {
        name:"c_msg_yq_pin3_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
