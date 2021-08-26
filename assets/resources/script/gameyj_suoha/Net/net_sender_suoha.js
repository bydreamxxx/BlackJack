/**
 * Created by luke on 2018/12/6
 */
module.exports = {
    //准备
    sendReady() {
        const req = new cc.pb.suoha.msg_suoha_ready_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_ready_2s, req,
            'msg_suoha_ready_2s', 'no');
    },

    /**
     * 加注
     * @param {Number} bet 筹码数
     */
    Raise(bet) {
        const req = new cc.pb.suoha.msg_suoha_bet_2s();
        req.setOp(0);
        req.setBet(bet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_bet_2s, req,
            'msg_suoha_bet_2s【加注】', 'no');
    },

    //梭哈
    showHand() {
        const req = new cc.pb.suoha.msg_suoha_bet_2s();
        req.setOp(1);
        req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_bet_2s, req,
            'msg_suoha_bet_2s【梭哈】', 'no');
    },

    //弃牌
    disCard() {
        const req = new cc.pb.suoha.msg_suoha_bet_2s();
        req.setOp(2);
        req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_bet_2s, req,
            'msg_suoha_bet_2s【弃牌】', 'no');
    },

    //跟注
    Call() {
        const req = new cc.pb.suoha.msg_suoha_bet_2s();
        req.setOp(3);
        req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_bet_2s, req,
            'msg_suoha_bet_2s【跟注】', 'no');
    },

    //开牌
    openCard() {
        const req = new cc.pb.suoha.msg_suoha_bet_2s();
        req.setOp(4);
        req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_bet_2s, req,
            'msg_suoha_bet_2s【开牌】', 'no');
    },

    //过
    Pass() {
        const req = new cc.pb.suoha.msg_suoha_bet_2s();
        req.setOp(5);
        req.setBet(0);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_bet_2s, req,
            'msg_suoha_bet_2s【过】', 'no');
    },

    /**
     * 解散
     * @param {Boolean} agree 是否同意
     */
    Dissolve(agree) {
        const req = new cc.pb.suoha.msg_suoha_dissolve_agree_req();
        req.setIsAgree(agree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_dissolve_agree_req, req,
            'msg_suoha_dissolve_agree_req', 'no');

    },

    //看牌
    exposeCard() {
        if (!cc._suoha_look_rep) {
            cc._suoha_look_rep = true;
            const req = new cc.pb.suoha.msg_suoha_look_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.suoha.cmd_msg_suoha_look_req, req,
                'msg_suoha_look_req', 'true');
            setTimeout(function () { cc._suoha_look_rep = false; }, 3000);
        }
    },
}
