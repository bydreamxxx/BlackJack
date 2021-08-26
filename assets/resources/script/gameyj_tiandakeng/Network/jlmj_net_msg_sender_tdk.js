var jlmj_room_mgr = require('jlmj_room_mgr').RoomMgr;
var sender = {
    /**
     * 房间管理其中解散牌桌
     */
    onDissolveTdkDeskInRoom: function () {
        var gameType = jlmj_room_mgr.Instance().game_info.gameType;
        var roomId = jlmj_room_mgr.Instance().game_info.roomId;

        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);

        msg.setGameInfo(gameInfoPB);

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);

    },

    /**申请解散牌桌 */
    onDissolveTdkDesk: function (data) {
        cc.log('tdk_net::dissolveDesk :' + 'data:' + JSON.stringify(data));

        var pbObj = new cc.pb.tiandakeng.TdkDissolveDeskReq();
        pbObj.setUserid(data.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.tiandakeng.cmd_TdkDissolveDeskReq, pbObj, 'cmd_TdkDissolveDeskReq', true)
    },

    /**投票解散 */
    onDisTdkDeskDecision: function (data) {
        cc.log('tdk_net::dissolveDeskDesicion :' + ',data:' + JSON.stringify(data));

        var pbObj = new cc.pb.tiandakeng.TdkDisDeskDesicionReq();
        pbObj.setUserid(data.id);
        pbObj.setDesicion(data.des);
        cc.gateNet.Instance().sendMsg(cc.netCmd.tiandakeng.cmd_TdkDisDeskDesicionReq, pbObj, 'cmd_TdkDisDeskDesicionReq', true)
    },

    /**
     * all in 消息发送
     */
    onTdkCBet: function (data) {
        cc.log('tdk_net::TdkCBet :' + ',data:' + JSON.stringify(data));

        var pbObj = new cc.pb.tiandakeng.TdkCBet();
        pbObj.setType(data.type);
        pbObj.setNum(data.betNum);
        cc.gateNet.Instance().sendMsg(cc.netCmd.tiandakeng.cmd_TdkCBet, pbObj, 'cmd_TdkCBet', true)
    },

    /**
     * 托管
     */
    onTuoGuan: function (bl) {
        var pbObj = new cc.pb.tiandakeng.TdkTuoGuan();
        pbObj.setType(bl);
        cc.gateNet.Instance().sendMsg(cc.netCmd.tiandakeng.cmd_TdkTuoGuan, pbObj, 'cmd_TdkTuoGuan', true)
    },

    /**
     * 玩家看牌
     */
    onTdkKanPaiReq: function () {
        var pbObj = new cc.pb.tiandakeng.TdkKanPaiReq();
        cc.gateNet.Instance().sendMsg(cc.netCmd.tiandakeng.cmd_TdkKanPaiReq, pbObj, 'cmd_TdkKanPaiReq', true)
    },

};
module.exports = sender;

