//二八杠 消息发送
module.exports = {
    /**
     * 下注
     * @param {Number} position 
     * @param {Number} num 
     */
    bet(position, num) {
        const req = new cc.pb.br_tb.msg_br_tb_bet_req();
        req.setBet(num);
        req.setBetId(position);
        cc.gateNet.Instance().sendMsg(cc.netCmd.br_tb.cmd_msg_br_tb_bet_req, req,
            'br_tb_bet_req', 'no');
    },

    /**
     * 申请上庄
     * @param {Number} type 1.下庄 2.上庄 
     * @param {Number} coin 上庄携带金币
     */
    bankReq(type, coin) {
        const req = new cc.pb.br_tb.msg_br_tb_banker_req();
        req.setType(type);
        req.setGold(coin);
        cc.gateNet.Instance().sendMsg(cc.netCmd.br_tb.cmd_msg_br_tb_banker_req, req,
            'br_tb_banker_req', 'no');
    },

    /**
     * 申请上位置
     * @param {Number} position 位置
     */
    deskSite(position) {
        const req = new cc.pb.br_tb.msg_get_site_req();
        req.setSiteId(position);
        cc.gateNet.Instance().sendMsg(cc.netCmd.br_tb.cmd_msg_get_site_req, req,
            'get_site_req', 'no');
    },
    /**
    * 玩家排行榜
    * @param {Number} type  // 排行榜  1  玩家输赢排行榜  2  庄家奖金榜   3  闲家奖金榜
    */
    rank(type) {
        const req = new cc.pb.br_tb.msg_br_tb_rank_req();
        req.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.br_tb.cmd_msg_br_tb_rank_req, req,
            'br_tb_rank_req', 'no');
    },
}