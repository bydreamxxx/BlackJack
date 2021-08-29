
    const msg = {};
    var handler = require('jlmj_net_handler_hall');
    var recvFuncs = {
        [1600]:{ package_name:'msg', msg_name:'nested_variant_data', name:msg.nested_variant_data, func:handler.on_nested_variant_data, func_name:'on_nested_variant_data', logtag:'[1600:nested_variant_data ]' },
        [1601]:{ package_name:'msg', msg_name:'msg_variant_data_set_2c', name:msg.msg_variant_data_set_2c, func:handler.on_msg_variant_data_set_2c, func_name:'on_msg_variant_data_set_2c', logtag:'[1601:msg_variant_data_set_2c ]' },

    };
    module.exports = {
        name:"c_msg_player_world_var_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
