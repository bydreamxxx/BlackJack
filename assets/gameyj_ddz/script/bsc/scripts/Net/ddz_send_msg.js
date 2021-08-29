

const sendMsg = {
    /**
     * 叫分
     */
    callScore: function (score) {
        const req = new cc.pb.doudizhu.ddz_call_score_req();
        req.setScore(score);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_call_score_req, req,
            'ddz_call_score_req', 'no');
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'ddz_callscore');
    },


    /**
     * 加倍
     */
    callDouble: function (bool) {
        const req = new cc.pb.doudizhu.ddz_double_score_req();
        req.setIsDouble(bool);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_double_score_req, req,
            'ddz_double_score_req', 'no');
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'ddz_double');
    },

    /**
     * 出牌
     */
    sendCards: function (cards) {
        const req = new cc.pb.doudizhu.ddz_play_poker_req();
        req.setPokersList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_play_poker_req, req,
            'ddz_play_poker_req', 'no');
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'ddz_sendcard');
    },

    /**
     * 托管
     */
    tuoGuan: function (isAuto) {
        const req = new cc.pb.doudizhu.ddz_player_auto_req();
        req.setIsAuto(isAuto);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_player_auto_req, req,
            'ddz_player_auto_req', 'no');
    },

    /**
     * 请求重连
     */
    sendReconnect: function () {
        const req = new cc.pb.doudizhu.ddz_reconnect_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_reconnect_req, req,
            'ddz_reconnect_req', 'no');
    },

    /**
     * 换三张
     * @param {*} cards 
     */
    sendExchange(cards) {
        const req = new cc.pb.doudizhu.ddz_change_poker_req();
        req.setPokersList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_change_poker_req, req,
            'ddz_change_poker_req', 'no');
    },

    /**
     * 明牌(测试用)
     */
    sendMingpai: function () {
        const req = new cc.pb.doudizhu.ddz_get_all_poker_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_get_all_poker_req, req,
            'ddz_get_all_poker_req', 'no');
    },
};

module.exports = sendMsg;