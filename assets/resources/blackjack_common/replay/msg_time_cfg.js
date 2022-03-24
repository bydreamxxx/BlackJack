var cmd = require('c_msg_rummy_cmd');

/**
 * 通用消息时间
 * @type {number}
 */
var com_time = 1*1000;

/**
 * 特殊消息时间 (如包含动画的消息)
 * @type {*[]}
 */
var msg_time_cfg = [
    {id:cmd.cmd_msg_rm_info, time:10*1000},
];

var cfg = {
    /**
     * 获取消息播放时间
     * @param id
     */
    getMsgTime: function (id) {
        var time = com_time;
        msg_time_cfg.forEach(function (item) {
            if(item.id == id){
                time = com_time+item.time;
            }
        });
        return time;
    },
};



module.exports = cfg;