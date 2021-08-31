
    const msg = {};
    var handler = require('jlmj_net_handler_roomMgr');
    var recvFuncs = {
        [4000]:{ package_name:'msg', msg_name:'xy_ddz_rule_info', name:msg.xy_ddz_rule_info, func:handler.on_xy_ddz_rule_info, func_name:'on_xy_ddz_rule_info', logtag:'[4000:xy_ddz_rule_info]' },
        [4001]:{ package_name:'msg', msg_name:'msg_get_room_desks_req', name:msg.msg_get_room_desks_req, func:handler.on_msg_get_room_desks_req, func_name:'on_msg_get_room_desks_req', logtag:'[4001:msg_get_room_desks_req]' },
        [4002]:{ package_name:'msg', msg_name:'common_desk', name:msg.common_desk, func:handler.on_common_desk, func_name:'on_common_desk', logtag:'[4002:common_desk]' },
        [4003]:{ package_name:'msg', msg_name:'msg_get_room_desks_ret', name:msg.msg_get_room_desks_ret, func:handler.on_msg_get_room_desks_ret, func_name:'on_msg_get_room_desks_ret', logtag:'[4003:msg_get_room_desks_ret]' },
        [4004]:{ package_name:'msg', msg_name:'msg_room_desk_info', name:msg.msg_room_desk_info, func:handler.on_msg_room_desk_info, func_name:'on_msg_room_desk_info', logtag:'[4004:msg_room_desk_info]' },
        [4005]:{ package_name:'msg', msg_name:'msg_leave_room_desks_req', name:msg.msg_leave_room_desks_req, func:handler.on_msg_leave_room_desks_req, func_name:'on_msg_leave_room_desks_req', logtag:'[4005:msg_leave_room_desks_req]' },
        [4006]:{ package_name:'msg', msg_name:'msg_card_charge_req', name:msg.msg_card_charge_req, func:handler.on_msg_card_charge_req, func_name:'on_msg_card_charge_req', logtag:'[4006:msg_card_charge_req ]' },
        [4007]:{ package_name:'msg', msg_name:'msg_card_charge_ret', name:msg.msg_card_charge_ret, func:handler.on_msg_card_charge_ret, func_name:'on_msg_card_charge_ret', logtag:'[4007:msg_card_charge_ret ]' },

    };
    module.exports = {
        name:"c_msg_game_rule_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
