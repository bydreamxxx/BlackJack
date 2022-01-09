module.exports = {
    ///常规操作消息 加注（封顶）/跟注/弃
    sendNormalOp: function(bet, userId, type){
        var pbData = new cc.pb.tpi.msg_teenpatti_op_req();
        pbData.setOpType(type);
        pbData.setUserId(userId);
        pbData.setValue(bet)
        cc.gateNet.Instance().sendMsg(cc.netCmd.tpi.cmd_msg_teenpatti_op_req, pbData, 'msg_teenpatti_op_req', true);
    },

    //比牌操作
    sendCmpOp: function(type, userId, cmpId){
        var pbData = new cc.pb.tpi.msg_teenpatti_cmp_req();
        pbData.setCmpType(type);
        pbData.setUserId(userId);
        pbData.setCmpId(cmpId)
        cc.gateNet.Instance().sendMsg(cc.netCmd.tpi.cmd_msg_teenpatti_cmp_req, pbData, 'msg_teenpatti_cmp_req', true);
    },


    //看牌操作
    sendWatch: function(userId){
        var pbData = new cc.pb.tpi.msg_teenpatti_watch_req();
        pbData.setUserId(userId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.tpi.cmd_msg_teenpatti_watch_req, pbData, 'msg_teenpatti_watch_req', true);
    },


    //解散消息发送
    dissolve: function(isAgree){
        const req = new cc.pb.room_mgr.room_dissolve_agree_req();
        req.setIsAgree(isAgree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, req,
            'room_dissolve_agree_req', 'no');
    },

    /**
     * 发送换桌协议
     */
    sendReplaceDesktop: function (gameId, roomId) {
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(gameId);
        pbData.setRoomCoinId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },

    /**
     * 发送充值协议
     */
    sendQuickRecharge: function(){
        var pbData = new cc.pb.tpi.msg_teenpatti_recharge_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.tpi.cmd_msg_teenpatti_recharge_req, pbData, 'msg_teenpatti_recharge_req', true);
    },

    /**
     * 发送取消托管协议
     */
    sendCancelAuto: function(type, roomId){
        var pbData = new cc.pb.tpi.msg_teenpatti_cancel_auto_req();
        pbData.setGameType(type);
        pbData.setRoomId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.tpi.cmd_msg_teenpatti_cancel_auto_req, pbData, 'msg_teenpatti_cancel_auto_req', true);
    },
};
