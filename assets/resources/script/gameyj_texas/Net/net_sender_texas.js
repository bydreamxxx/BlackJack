/**
 * Created by luke on 2018/12/6
 */
module.exports = {
    //准备
    sendReady() {
        const req = new cc.pb.texas.msg_texas_ready_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_ready_2s, req,
            'msg_texas_ready_2s', 'no');
    },

    /**
     * 加注
     * @param {Number} bet 筹码数
     */
    Raise(bet) {
        const req = new cc.pb.texas.msg_texas_bet_req();
        req.setType(4);
        req.setBet(bet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_bet_req, req,
            'msg_texas_bet_req【加注】', 'no');
    },

    //allin
    allIn() {
        cc.log();
        const req = new cc.pb.texas.msg_texas_bet_req();
        req.setType(5);
        req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_bet_req, req,
            'msg_texas_bet_req【allin】', 'no');
    },

    //弃牌
    disCard() {
        const req = new cc.pb.texas.msg_texas_bet_req();
        req.setType(3);
        // req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_bet_req, req,
            'msg_texas_bet_req【弃牌】', 'no');
    },

    //跟注
    Call() {
        const req = new cc.pb.texas.msg_texas_bet_req();
        req.setType(1);
        // req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_bet_req, req,
            'msg_texas_bet_req【跟注】', 'no');
    },


    //过
    Pass() {
        const req = new cc.pb.texas.msg_texas_bet_req();
        req.setType(2);
        // req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_bet_req, req,
            'msg_texas_bet_req【过】', 'no');
    },

    /**
     * 解散
     * @param {Boolean} agree 是否同意
     */
    Dissolve(agree) {
        const req = new cc.pb.texas.msg_texas_dissolve_agree_req();
        req.setIsAgree(agree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_dissolve_agree_req, req,
            'msg_texas_dissolve_agree_req', 'no');

    },

    /**
     * 自动操作//1:自动弃, 2:自动跟, 3:自动过
     */
    AutoOp(op,flag) {
        const req = new cc.pb.texas.msg_texas_auto_req();
        req.setType(op);
        req.setFlag(flag);
        cc.gateNet.Instance().sendMsg(cc.netCmd.texas.cmd_msg_texas_auto_req, req,
            'msg_texas_auto_req', 'no');

    },

    /**
     * 换桌
     */
    sendReplaceDesktop(gameId, roomId){
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(gameId);
        pbData.setRoomCoinId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },
    
}
