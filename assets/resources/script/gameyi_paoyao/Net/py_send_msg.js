
const sendMsg = {
    /**
     * 出牌
     * @param cards 出牌集合
     */
    sendCards: function (cards) {
        const req = new cc.pb.paoyao.msg_paoyao_act_req();
        req.setType(cards.length > 0 ? 2 : 1); //1:不出 2：出牌
        req.setPokerList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paoyao.cmd_msg_paoyao_act_req, req, 'msg_paoyao_act_req', 'no');
        //cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_paoyao_act_req');
    },

    /**
     * 请求雪
     * @param bl 是否请求雪
     */
    sendXue: function (bl) {
        const req = new cc.pb.paoyao.msg_paoyao_xue_req();
        req.setType(bl);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paoyao.cmd_msg_paoyao_xue_req, req, 'cmd_msg_paoyao_xue_req', 'no');
    },

    /**
     * 选幺
     * @param card_a A的数量
     * @param card_4 4的数量
     */
    sendYao: function (card_a, card_4) {
        const req = new cc.pb.paoyao.msg_paoyao_yao_req();
        req.setANum(card_a);
        req.setYNum(card_4);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paoyao.cmd_msg_paoyao_yao_req, req, 'cmd_msg_paoyao_yao_req', 'no');
    },

    /**
     * 准备
     * @param bl 加倍
     */
    sendRaady: function (bl) {
        const req = new cc.pb.paoyao.msg_paoyao_ready_req();
        req.setIsDouble(bl);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paoyao.cmd_msg_paoyao_ready_req, req, 'cmd_msg_paoyao_ready_req', 'no');
    },

    /**
     * 托管
     * @param bl 是否托管
     */
    sendTuoguan: function (bl) {
        const req = new cc.pb.paoyao.msg_paoyao_tuoguan_req();
        req.setIsTuoguan(bl);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paoyao.cmd_msg_paoyao_tuoguan_req, req, 'cmd_msg_paoyao_tuoguan_req', 'no');
    },

    /**
     * 喊话
     * @param id 喊话配置ID
     */
    sendChat: function (id) {
        const req = new cc.pb.paoyao.msg_paoyao_chat_req();
        req.setMsg(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paoyao.cmd_msg_paoyao_chat_req, req, 'cmd_msg_paoyao_chat_req', 'no');
    },

};

module.exports = sendMsg;