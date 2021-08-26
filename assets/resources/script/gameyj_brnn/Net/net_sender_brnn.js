//疯狂拼十 消息发送
module.exports = {
    /**
     * 下注
     * @param {Number} position 
     * @param {Number} num 
     */
    bet(position, num) {
        const req = new cc.pb.fkps.fkps_bet_2s();
        req.setBet(num);
        req.setBetId(position);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fkps.cmd_fkps_bet_2s, req,
            'fkps_bet_2s', 'no');
    },

    /**
     * 申请上庄
     * @param {Number} type 1.下庄 2.上庄
     */
    bankReq(type) {
        const req = new cc.pb.fkps.fkps_req_banker_2s();
        req.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fkps.cmd_fkps_req_banker_2s, req,
            'fkps_req_banker_2s', 'no');
    },
}