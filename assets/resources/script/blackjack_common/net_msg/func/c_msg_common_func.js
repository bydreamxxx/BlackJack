
    const msg = {};
    var handler = require('jlmj_net_handler_hall');
    var recvFuncs = {
        [2800]:{ package_name:'msg', msg_name:'ProtoHeader', name:msg.ProtoHeader, func:handler.on_ProtoHeader, func_name:'on_ProtoHeader', logtag:'[2800:ProtoHeader ]' },
        [2801]:{ package_name:'msg', msg_name:'ServerInfo', name:msg.ServerInfo, func:handler.on_ServerInfo, func_name:'on_ServerInfo', logtag:'[2801:ServerInfo ]' },
        [2802]:{ package_name:'msg', msg_name:'NetIMInfo', name:msg.NetIMInfo, func:handler.on_NetIMInfo, func_name:'on_NetIMInfo', logtag:'[2802:NetIMInfo]' },
        [2803]:{ package_name:'msg', msg_name:'QuickConn', name:msg.QuickConn, func:handler.on_QuickConn, func_name:'on_QuickConn', logtag:'[2803:QuickConn ]' },
        [2804]:{ package_name:'msg', msg_name:'AckQuickConn', name:msg.AckQuickConn, func:handler.on_AckQuickConn, func_name:'on_AckQuickConn', logtag:'[2804:AckQuickConn ]' },
        [2805]:{ package_name:'msg', msg_name:'WeixinInfo', name:msg.WeixinInfo, func:handler.on_WeixinInfo, func_name:'on_WeixinInfo', logtag:'[2805:WeixinInfo ]' },
        [2806]:{ package_name:'msg', msg_name:'common_req_reg', name:msg.common_req_reg, func:handler.on_common_req_reg, func_name:'on_common_req_reg', logtag:'[2806:common_req_reg ]' },
        [2807]:{ package_name:'msg', msg_name:'common_ack_reg', name:msg.common_ack_reg, func:handler.on_common_ack_reg, func_name:'on_common_ack_reg', logtag:'[2807:common_ack_reg ]' },
        [2808]:{ package_name:'msg', msg_name:'cm_offline', name:msg.cm_offline, func:handler.on_cm_offline, func_name:'on_cm_offline', logtag:'[2808:cm_offline ]' },
        [2809]:{ package_name:'msg', msg_name:'cm_hearbeat', name:msg.cm_hearbeat, func:handler.on_cm_hearbeat, func_name:'on_cm_hearbeat', logtag:'[2809:cm_hearbeat ]' },
        [2810]:{ package_name:'msg', msg_name:'common_req_message', name:msg.common_req_message, func:handler.on_common_req_message, func_name:'on_common_req_message', logtag:'[2810:common_req_message ]' },
        [2811]:{ package_name:'msg', msg_name:'common_bc', name:msg.common_bc, func:handler.on_common_bc, func_name:'on_common_bc', logtag:'[2811:common_bc ]' },
        [2812]:{ package_name:'msg', msg_name:'ComUseItem', name:msg.ComUseItem, func:handler.on_ComUseItem, func_name:'on_ComUseItem', logtag:'[2812:ComUseItem ]' },
        [2813]:{ package_name:'msg', msg_name:'ComUseItemRsp', name:msg.ComUseItemRsp, func:handler.on_ComUseItemRsp, func_name:'on_ComUseItemRsp', logtag:'[2813:ComUseItemRsp ]' },
        [2814]:{ package_name:'msg', msg_name:'net_down_reason', name:msg.net_down_reason, func:handler.on_net_down_reason, func_name:'on_net_down_reason', logtag:'[2814:net_down_reason ]' },
        [2815]:{ package_name:'msg', msg_name:'msg_hearbeat_num', name:msg.msg_hearbeat_num, func:handler.on_msg_hearbeat_num, func_name:'on_msg_hearbeat_num', logtag:'[2815:msg_hearbeat_num ]' },
        [2816]:{ package_name:'msg', msg_name:'msg_switch_client', name:msg.msg_switch_client, func:handler.on_msg_switch_client, func_name:'on_msg_switch_client', logtag:'[2816:msg_switch_client ]' },
        [2817]:{ package_name:'msg', msg_name:'msg_notify_client_log', name:msg.msg_notify_client_log, func:handler.on_msg_notify_client_log, func_name:'on_msg_notify_client_log', logtag:'[2817:msg_notify_client_log ]' },

    };
    module.exports = {
        name:"c_msg_common_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
