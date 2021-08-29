
    const msg = {};
    var handler = require('jlmj_net_handler_hall');
    var recvFuncs = {
        [5700]:{ package_name:'msg', msg_name:'activity_collect_word', name:msg.activity_collect_word, func:handler.on_activity_collect_word, func_name:'on_activity_collect_word', logtag:'[5700:activity_collect_word ]' },
        [5701]:{ package_name:'msg', msg_name:'activity_collect_info', name:msg.activity_collect_info, func:handler.on_activity_collect_info, func_name:'on_activity_collect_info', logtag:'[5701:activity_collect_info ]' },
        [5702]:{ package_name:'msg', msg_name:'is_open_activity_collect', name:msg.is_open_activity_collect, func:handler.on_is_open_activity_collect, func_name:'on_is_open_activity_collect', logtag:'[5702:is_open_activity_collect ]' },
        [5703]:{ package_name:'msg', msg_name:'get_activity_collect_list_req', name:msg.get_activity_collect_list_req, func:handler.on_get_activity_collect_list_req, func_name:'on_get_activity_collect_list_req', logtag:'[5703:get_activity_collect_list_req ]' },
        [5704]:{ package_name:'msg', msg_name:'get_activity_collect_list_ack', name:msg.get_activity_collect_list_ack, func:handler.on_get_activity_collect_list_ack, func_name:'on_get_activity_collect_list_ack', logtag:'[5704:get_activity_collect_list_ack ]' },
        [5705]:{ package_name:'msg', msg_name:'activity_collect_add_draw_times', name:msg.activity_collect_add_draw_times, func:handler.on_activity_collect_add_draw_times, func_name:'on_activity_collect_add_draw_times', logtag:'[5705:activity_collect_add_draw_times ]' },
        [5706]:{ package_name:'msg', msg_name:'activity_collect_draw_req', name:msg.activity_collect_draw_req, func:handler.on_activity_collect_draw_req, func_name:'on_activity_collect_draw_req', logtag:'[5706:activity_collect_draw_req]' },
        [5707]:{ package_name:'msg', msg_name:'activity_collect_draw_ack', name:msg.activity_collect_draw_ack, func:handler.on_activity_collect_draw_ack, func_name:'on_activity_collect_draw_ack', logtag:'[5707:activity_collect_draw_ack ]' },
        [5708]:{ package_name:'msg', msg_name:'activity_collect_open_box_req', name:msg.activity_collect_open_box_req, func:handler.on_activity_collect_open_box_req, func_name:'on_activity_collect_open_box_req', logtag:'[5708:activity_collect_open_box_req ]' },
        [5709]:{ package_name:'msg', msg_name:'activity_collect_open_box_ack', name:msg.activity_collect_open_box_ack, func:handler.on_activity_collect_open_box_ack, func_name:'on_activity_collect_open_box_ack', logtag:'[5709:activity_collect_open_box_ack ]' },

    };
    module.exports = {
        name:"c_msg_activity_collect_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
