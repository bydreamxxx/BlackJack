var zjh_protoId = require("c_msg_zhajinhua_cmd");

var sender = { 
    /********************************炸金花消息发送处理************************************/

    requestGameZJH: function(roomType){
        var pbObj = new cc.pb.zhajinhua.msg_zhajinhua_match_2s();
        pbObj.setRoomType(roomType);
        cc.gateNet.Instance().sendMsg(zjh_protoId.cmd_msg_zhajinhua_match_2s, pbObj, 'msg_zhajinhua_match_2s', true)
    },


    requestOp2s: function(op,value){
        var pbObj = new cc.pb.zhajinhua.msg_zhajinhua_op_2s();
        pbObj.setOp(op);
        pbObj.setValue(value);
        cc.gateNet.Instance().sendMsg(zjh_protoId.cmd_msg_zhajinhua_op_2s, pbObj, 'msg_zhajinhua_op_2s', true)
    },

    requestReady: function(op,value){
        var pbObj = new cc.pb.zhajinhua.msg_zhajinhua_ready_2s();
        cc.gateNet.Instance().sendMsg(zjh_protoId.cmd_msg_zhajinhua_ready_2s, pbObj, 'msg_zhajinhua_ready_2s', true)
    },

    requestQuitGame: function(){
        var pbObj = new cc.pb.zhajinhua.msg_zhajinhua_quit_2s();
        cc.gateNet.Instance().sendMsg(zjh_protoId.cmd_msg_zhajinhua_quit_2s, pbObj, 'msg_zhajinhua_quit_2s', true)
    },

    requestAutoChips:function(value){
        var pbObj = new cc.pb.zhajinhua.msg_zhajinhua_set_anto_clips_2s();
        pbObj.setClips(value);
        cc.gateNet.Instance().sendMsg(zjh_protoId.cmd_msg_zhajinhua_set_anto_clips_2s, pbObj, 'msg_zhajinhua_set_anto_clips_2s', true)
    },


};
module.exports = sender;

