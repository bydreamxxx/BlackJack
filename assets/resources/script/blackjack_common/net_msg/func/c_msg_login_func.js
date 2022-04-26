
    const msg = {};
    var handler = require('jlmj_net_handler_login');
    var recvFuncs = {
        [2900]:{ package_name:'msg', msg_name:'wx_login_by_code_req', name:msg.wx_login_by_code_req, func:handler.on_wx_login_by_code_req, func_name:'on_wx_login_by_code_req', logtag:'[2900:wx_login_by_code_req ]' },
        [2901]:{ package_name:'msg', msg_name:'login_by_refresh_token_req', name:msg.login_by_refresh_token_req, func:handler.on_login_by_refresh_token_req, func_name:'on_login_by_refresh_token_req', logtag:'[2901:login_by_refresh_token_req ]' },
        [2902]:{ package_name:'msg', msg_name:'googlePlay_login_by_code_req', name:msg.googlePlay_login_by_code_req, func:handler.on_googlePlay_login_by_code_req, func_name:'on_googlePlay_login_by_code_req', logtag:'[2902:googlePlay_login_by_code_req ]' },
        [2903]:{ package_name:'msg', msg_name:'common_login_ack', name:msg.common_login_ack, func:handler.on_common_login_ack, func_name:'on_common_login_ack', logtag:'[2903:common_login_ack ]' },
        [2904]:{ package_name:'msg', msg_name:'common_token_ack', name:msg.common_token_ack, func:handler.on_common_token_ack, func_name:'on_common_token_ack', logtag:'[2904:common_token_ack ]' },
        [2905]:{ package_name:'msg', msg_name:'common_refresh_notify', name:msg.common_refresh_notify, func:handler.on_common_refresh_notify, func_name:'on_common_refresh_notify', logtag:'[2905:common_refresh_notify ]' },
        [2906]:{ package_name:'msg', msg_name:'common_refresh_req', name:msg.common_refresh_req, func:handler.on_common_refresh_req, func_name:'on_common_refresh_req', logtag:'[2906:common_refresh_req ]' },
        [2907]:{ package_name:'msg', msg_name:'yj_login_by_token_req', name:msg.yj_login_by_token_req, func:handler.on_yj_login_by_token_req, func_name:'on_yj_login_by_token_req', logtag:'[2907:yj_login_by_token_req ]' },
        [2908]:{ package_name:'msg', msg_name:'wx_mini_program_login_by_code_req', name:msg.wx_mini_program_login_by_code_req, func:handler.on_wx_mini_program_login_by_code_req, func_name:'on_wx_mini_program_login_by_code_req', logtag:'[2908:wx_mini_program_login_by_code_req ]' },
        [2909]:{ package_name:'msg', msg_name:'login_by_user_id_req', name:msg.login_by_user_id_req, func:handler.on_login_by_user_id_req, func_name:'on_login_by_user_id_req', logtag:'[2909:login_by_user_id_req ]' },
        [2910]:{ package_name:'msg', msg_name:'hw_login_req', name:msg.hw_login_req, func:handler.on_hw_login_req, func_name:'on_hw_login_req', logtag:'[2910:hw_login_req ]' },
        [2911]:{ package_name:'msg', msg_name:'vivo_login_req', name:msg.vivo_login_req, func:handler.on_vivo_login_req, func_name:'on_vivo_login_req', logtag:'[2911:vivo_login_req ]' },
        [2912]:{ package_name:'msg', msg_name:'oppo_login_req', name:msg.oppo_login_req, func:handler.on_oppo_login_req, func_name:'on_oppo_login_req', logtag:'[2912:oppo_login_req ]' },
        [2913]:{ package_name:'msg', msg_name:'mi_login_req', name:msg.mi_login_req, func:handler.on_mi_login_req, func_name:'on_mi_login_req', logtag:'[2913:mi_login_req ]' },

    };
    module.exports = {
        name:"c_msg_login_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
