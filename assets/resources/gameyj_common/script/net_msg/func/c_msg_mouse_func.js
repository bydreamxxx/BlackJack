
    const msg = {};
    var handler = require('net_handler_mouse');
    var recvFuncs = {
        [9600]:{ package_name:'msg', msg_name:'msg_mouse_room_info', name:msg.msg_mouse_room_info, func:handler.on_msg_mouse_room_info, func_name:'on_msg_mouse_room_info', logtag:'[9600:msg_mouse_room_info]' },
        [9601]:{ package_name:'msg', msg_name:'mouse_hole_info', name:msg.mouse_hole_info, func:handler.on_mouse_hole_info, func_name:'on_mouse_hole_info', logtag:'[9601:mouse_hole_info]' },
        [9602]:{ package_name:'msg', msg_name:'msg_mouse_show', name:msg.msg_mouse_show, func:handler.on_msg_mouse_show, func_name:'on_msg_mouse_show', logtag:'[9602:msg_mouse_show]' },
        [9603]:{ package_name:'msg', msg_name:'msg_use_hammer_req', name:msg.msg_use_hammer_req, func:handler.on_msg_use_hammer_req, func_name:'on_msg_use_hammer_req', logtag:'[9603:msg_use_hammer_req]' },
        [9604]:{ package_name:'msg', msg_name:'mouse_hammer', name:msg.mouse_hammer, func:handler.on_mouse_hammer, func_name:'on_mouse_hammer', logtag:'[9604:mouse_hammer]' },
        [9605]:{ package_name:'msg', msg_name:'msg_use_hammer_ret', name:msg.msg_use_hammer_ret, func:handler.on_msg_use_hammer_ret, func_name:'on_msg_use_hammer_ret', logtag:'[9605:msg_use_hammer_ret]' },
        [9606]:{ package_name:'msg', msg_name:'msg_choose_redbag_req', name:msg.msg_choose_redbag_req, func:handler.on_msg_choose_redbag_req, func_name:'on_msg_choose_redbag_req', logtag:'[9606:msg_choose_redbag_req]' },
        [9607]:{ package_name:'msg', msg_name:'msg_choose_redbag_ret', name:msg.msg_choose_redbag_ret, func:handler.on_msg_choose_redbag_ret, func_name:'on_msg_choose_redbag_ret', logtag:'[9607:msg_choose_redbag_ret]' },
        [9608]:{ package_name:'msg', msg_name:'msg_mouse_record_req', name:msg.msg_mouse_record_req, func:handler.on_msg_mouse_record_req, func_name:'on_msg_mouse_record_req', logtag:'[9608:msg_mouse_record_req]' },
        [9609]:{ package_name:'msg', msg_name:'mouse_record', name:msg.mouse_record, func:handler.on_mouse_record, func_name:'on_mouse_record', logtag:'[9609:mouse_record]' },
        [9610]:{ package_name:'msg', msg_name:'msg_mouse_record_ret', name:msg.msg_mouse_record_ret, func:handler.on_msg_mouse_record_ret, func_name:'on_msg_mouse_record_ret', logtag:'[9610:msg_mouse_record_ret]' },
        [9611]:{ package_name:'msg', msg_name:'msg_mouse_task_req', name:msg.msg_mouse_task_req, func:handler.on_msg_mouse_task_req, func_name:'on_msg_mouse_task_req', logtag:'[9611:msg_mouse_task_req]' },
        [9612]:{ package_name:'msg', msg_name:'mouse_task', name:msg.mouse_task, func:handler.on_mouse_task, func_name:'on_mouse_task', logtag:'[9612:mouse_task]' },
        [9613]:{ package_name:'msg', msg_name:'msg_mouse_task_ret', name:msg.msg_mouse_task_ret, func:handler.on_msg_mouse_task_ret, func_name:'on_msg_mouse_task_ret', logtag:'[9613:msg_mouse_task_ret]' },
        [9614]:{ package_name:'msg', msg_name:'msg_mouse_power', name:msg.msg_mouse_power, func:handler.on_msg_mouse_power, func_name:'on_msg_mouse_power', logtag:'[9614:msg_mouse_power]' },

    };
    module.exports = {
        name:"c_msg_mouse_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
