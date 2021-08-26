var cmd = require('c_msg_jilinmajiang_cmd');

/**
 * 通用消息时间
 * @type {number}
 */
var com_time = 0.2*1000;

/**
 * 特殊消息时间 (如包含动画的消息)
 * @type {*[]}
 */
var msg_time_cfg = [
    {id:cmd.cmd_p17_ack_game_send_out_card, time:0.2*1000},
    {id:cmd.cmd_p17_ack_game_dabao, time:2.5*1000},
    {id:cmd.cmd_p17_ack_game_changbao, time:2.5*1000},
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