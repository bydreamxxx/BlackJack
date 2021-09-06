
cc.Class({
    extends: cc.Component,

    properties: {
        ruleText: cc.Label,
        roomId: 0,
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     * 设置房间规则
     * @param ruleString  房间规则
     * @param roomId      房间id，服务器会携带发送的
     */
    setRuleShow: function(ruleString, roomId){
        this.ruleText.string = ruleString;
        this.roomId = roomId;
    },
 

    /**
     * 发送进入房间
     * @param roonum
     */
    onSendEnterMsg: function () {
        var msg = new hall_room_pb.msg_enter_game_req();
        var game_info = new hall_room_pb.common_game_header();

        game_info.setRoomtype(1);
        game_info.setRoomId(this.room_id);
        msg.setGameInfo(game_info);
        
        //hall_net.Instance().sendMsg(hall_room_pb.room_base_protoId.CMD_MSG_ENTER_GAME_REQ, msg, 'msg_enter_game_req',true);
    },

    /**
     * 关闭房间规则界面
     */
    onCloseRoomRule: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
