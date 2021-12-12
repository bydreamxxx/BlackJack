
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [3300]:{ package_name:'msg', msg_name:'match_race_info', name:msg.match_race_info, func:handler.on_match_race_info, func_name:'on_match_race_info', logtag:'[3300:match_race_info ]' },
        [3301]:{ package_name:'msg', msg_name:'msg_match_race_list_req', name:msg.msg_match_race_list_req, func:handler.on_msg_match_race_list_req, func_name:'on_msg_match_race_list_req', logtag:'[3301:msg_match_race_list_req ]' },
        [3302]:{ package_name:'msg', msg_name:'msg_match_race_list_ret', name:msg.msg_match_race_list_ret, func:handler.on_msg_match_race_list_ret, func_name:'on_msg_match_race_list_ret', logtag:'[3302:msg_match_race_list_ret ]' },

    };
    module.exports = {
        name:"c_msg_race_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
