const sendMsg = {
    /**
     * 出牌
     * @param cards 出牌集合
     */
    sendCards: function (cards,changCards) {
        const req = new cc.pb.gandengyan.msg_gdy_act_req();
        req.setType(cards.length > 0 ? 2 : 1); //1:不出 2：出牌
        req.setPokerList(cards);
        req.setChangePokerList(changCards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.gandengyan.cmd_msg_gdy_act_req, req, 'msg_gdy_act_req', 'no');
        //cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_paoyao_act_req');
    },

    /**
     * 托管
     * @param bl 是否托管
     */
    sendTuoguan: function (bl) {
        const req = new cc.pb.gandengyan.msg_gdy_tuoguan_req();
        req.setIsTuoguan(bl);
        cc.gateNet.Instance().sendMsg(cc.netCmd.gandengyan.cmd_msg_gdy_tuoguan_req, req, 'msg_gdy_tuoguan_req', 'no');
    },

};

module.exports = sendMsg;