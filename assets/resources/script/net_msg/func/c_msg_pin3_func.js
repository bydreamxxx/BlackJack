
    const msg = {};
    var handler = require('net_handler_dsz');
    var recvFuncs = {
        [6100]:{ package_name:'msg', msg_name:'pin3_user_info', name:msg.pin3_user_info, func:handler.on_pin3_user_info, func_name:'on_pin3_user_info', logtag:'[6100:pin3_user_info]' },
        [6101]:{ package_name:'msg', msg_name:'pin3_dissolve_info', name:msg.pin3_dissolve_info, func:handler.on_pin3_dissolve_info, func_name:'on_pin3_dissolve_info', logtag:'[6101:pin3_dissolve_info]' },
        [6102]:{ package_name:'msg', msg_name:'msg_pin3_state_info', name:msg.msg_pin3_state_info, func:handler.on_msg_pin3_state_info, func_name:'on_msg_pin3_state_info', logtag:'[6102:msg_pin3_state_info]' },
        [6103]:{ package_name:'msg', msg_name:'pin3_poker', name:msg.pin3_poker, func:handler.on_pin3_poker, func_name:'on_pin3_poker', logtag:'[6103:pin3_poker]' },
        [6104]:{ package_name:'msg', msg_name:'msg_pin3_watch_req', name:msg.msg_pin3_watch_req, func:handler.on_msg_pin3_watch_req, func_name:'on_msg_pin3_watch_req', logtag:'[6104:msg_pin3_watch_req]' },
        [6105]:{ package_name:'msg', msg_name:'msg_pin3_watch_ret', name:msg.msg_pin3_watch_ret, func:handler.on_msg_pin3_watch_ret, func_name:'on_msg_pin3_watch_ret', logtag:'[6105:msg_pin3_watch_ret]' },
        [6106]:{ package_name:'msg', msg_name:'pin3_cmp_poker', name:msg.pin3_cmp_poker, func:handler.on_pin3_cmp_poker, func_name:'on_pin3_cmp_poker', logtag:'[6106:pin3_cmp_poker]' },
        [6107]:{ package_name:'msg', msg_name:'msg_pin3_cmp_req', name:msg.msg_pin3_cmp_req, func:handler.on_msg_pin3_cmp_req, func_name:'on_msg_pin3_cmp_req', logtag:'[6107:msg_pin3_cmp_req]' },
        [6108]:{ package_name:'msg', msg_name:'msg_pin3_cmp_ret', name:msg.msg_pin3_cmp_ret, func:handler.on_msg_pin3_cmp_ret, func_name:'on_msg_pin3_cmp_ret', logtag:'[6108:msg_pin3_cmp_ret]' },
        [6109]:{ package_name:'msg', msg_name:'msg_pin3_try_req', name:msg.msg_pin3_try_req, func:handler.on_msg_pin3_try_req, func_name:'on_msg_pin3_try_req', logtag:'[6109:msg_pin3_try_req]' },
        [6110]:{ package_name:'msg', msg_name:'msg_pin3_try_ret', name:msg.msg_pin3_try_ret, func:handler.on_msg_pin3_try_ret, func_name:'on_msg_pin3_try_ret', logtag:'[6110:msg_pin3_try_ret]' },
        [6111]:{ package_name:'msg', msg_name:'msg_pin3_fire_req', name:msg.msg_pin3_fire_req, func:handler.on_msg_pin3_fire_req, func_name:'on_msg_pin3_fire_req', logtag:'[6111:msg_pin3_fire_req]' },
        [6112]:{ package_name:'msg', msg_name:'msg_pin3_fire_ret', name:msg.msg_pin3_fire_ret, func:handler.on_msg_pin3_fire_ret, func_name:'on_msg_pin3_fire_ret', logtag:'[6112:msg_pin3_fire_ret]' },
        [6113]:{ package_name:'msg', msg_name:'msg_pin3_op_req', name:msg.msg_pin3_op_req, func:handler.on_msg_pin3_op_req, func_name:'on_msg_pin3_op_req', logtag:'[6113:msg_pin3_op_req ]' },
        [6114]:{ package_name:'msg', msg_name:'msg_pin3_op_ret', name:msg.msg_pin3_op_ret, func:handler.on_msg_pin3_op_ret, func_name:'on_msg_pin3_op_ret', logtag:'[6114:msg_pin3_op_ret ]' },
        [6115]:{ package_name:'msg', msg_name:'msg_pin3_update', name:msg.msg_pin3_update, func:handler.on_msg_pin3_update, func_name:'on_msg_pin3_update', logtag:'[6115:msg_pin3_update]' },
        [6116]:{ package_name:'msg', msg_name:'msg_pin3_result_req', name:msg.msg_pin3_result_req, func:handler.on_msg_pin3_result_req, func_name:'on_msg_pin3_result_req', logtag:'[6116:msg_pin3_result_req ]' },
        [6117]:{ package_name:'msg', msg_name:'pin3_result', name:msg.pin3_result, func:handler.on_pin3_result, func_name:'on_pin3_result', logtag:'[6117:pin3_result ]' },
        [6118]:{ package_name:'msg', msg_name:'msg_pin3_result', name:msg.msg_pin3_result, func:handler.on_msg_pin3_result, func_name:'on_msg_pin3_result', logtag:'[6118:msg_pin3_result]' },

    };
    module.exports = {
        name:"c_msg_pin3_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
