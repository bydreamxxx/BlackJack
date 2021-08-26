
    const msg = {};
    var handler = require('net_hadler_hbsl');
    var recvFuncs = {
        [6800]:{ package_name:'msg', msg_name:'hb_role', name:msg.hb_role, func:handler.on_hb_role, func_name:'on_hb_role', logtag:'[6800:hb_role]' },
        [6801]:{ package_name:'msg', msg_name:'mai_role', name:msg.mai_role, func:handler.on_mai_role, func_name:'on_mai_role', logtag:'[6801:mai_role]' },
        [6802]:{ package_name:'msg', msg_name:'hb_open', name:msg.hb_open, func:handler.on_hb_open, func_name:'on_hb_open', logtag:'[6802:hb_open]' },
        [6803]:{ package_name:'msg', msg_name:'hb_desk', name:msg.hb_desk, func:handler.on_hb_desk, func_name:'on_hb_desk', logtag:'[6803:hb_desk]' },
        [6804]:{ package_name:'msg', msg_name:'msg_hb_get_req', name:msg.msg_hb_get_req, func:handler.on_msg_hb_get_req, func_name:'on_msg_hb_get_req', logtag:'[6804:msg_hb_get_req]' },
        [6805]:{ package_name:'msg', msg_name:'msg_hb_get_ack', name:msg.msg_hb_get_ack, func:handler.on_msg_hb_get_ack, func_name:'on_msg_hb_get_ack', logtag:'[6805:msg_hb_get_ack]' },
        [6806]:{ package_name:'msg', msg_name:'msg_hb_list_req', name:msg.msg_hb_list_req, func:handler.on_msg_hb_list_req, func_name:'on_msg_hb_list_req', logtag:'[6806:msg_hb_list_req]' },
        [6807]:{ package_name:'msg', msg_name:'msg_hb_list_ack', name:msg.msg_hb_list_ack, func:handler.on_msg_hb_list_ack, func_name:'on_msg_hb_list_ack', logtag:'[6807:msg_hb_list_ack]' },
        [6808]:{ package_name:'msg', msg_name:'msg_hb_set_req', name:msg.msg_hb_set_req, func:handler.on_msg_hb_set_req, func_name:'on_msg_hb_set_req', logtag:'[6808:msg_hb_set_req]' },
        [6809]:{ package_name:'msg', msg_name:'msg_hb_set_ack', name:msg.msg_hb_set_ack, func:handler.on_msg_hb_set_ack, func_name:'on_msg_hb_set_ack', logtag:'[6809:msg_hb_set_ack]' },
        [6810]:{ package_name:'msg', msg_name:'msg_hb_get_notify', name:msg.msg_hb_get_notify, func:handler.on_msg_hb_get_notify, func_name:'on_msg_hb_get_notify', logtag:'[6810:msg_hb_get_notify]' },
        [6811]:{ package_name:'msg', msg_name:'msg_hb_open_notify', name:msg.msg_hb_open_notify, func:handler.on_msg_hb_open_notify, func_name:'on_msg_hb_open_notify', logtag:'[6811:msg_hb_open_notify]' },
        [6812]:{ package_name:'msg', msg_name:'HbPlayerFinalResult', name:msg.HbPlayerFinalResult, func:handler.on_HbPlayerFinalResult, func_name:'on_HbPlayerFinalResult', logtag:'[6812:HbPlayerFinalResult]' },
        [6813]:{ package_name:'msg', msg_name:'HbFinalResult', name:msg.HbFinalResult, func:handler.on_HbFinalResult, func_name:'on_HbFinalResult', logtag:'[6813:HbFinalResult]' },
        [6814]:{ package_name:'msg', msg_name:'msg_hb_enter_req', name:msg.msg_hb_enter_req, func:handler.on_msg_hb_enter_req, func_name:'on_msg_hb_enter_req', logtag:'[6814:msg_hb_enter_req]' },
        [6815]:{ package_name:'msg', msg_name:'msg_hb_enter_ack', name:msg.msg_hb_enter_ack, func:handler.on_msg_hb_enter_ack, func_name:'on_msg_hb_enter_ack', logtag:'[6815:msg_hb_enter_ack]' },
        [6816]:{ package_name:'msg', msg_name:'msg_hb_cancel_req', name:msg.msg_hb_cancel_req, func:handler.on_msg_hb_cancel_req, func_name:'on_msg_hb_cancel_req', logtag:'[6816:msg_hb_cancel_req]' },
        [6817]:{ package_name:'msg', msg_name:'msg_hb_cancel_ack', name:msg.msg_hb_cancel_ack, func:handler.on_msg_hb_cancel_ack, func_name:'on_msg_hb_cancel_ack', logtag:'[6817:msg_hb_cancel_ack]' },

    };
    module.exports = {
        name:"c_msg_hb_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
