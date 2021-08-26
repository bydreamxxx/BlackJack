

const sendMsg = {
    /**
     * 出牌
     */
    sendCards: function (cards) {
        const req = new cc.pb.paodekuai.pdk_play_poker_req();
        req.setPokersList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paodekuai.cmd_pdk_play_poker_req, req,
            'pdk_play_poker_req', 'no');
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'pdk_sendcard');
    },

    /**
     * 托管
     */
    tuoGuan: function (isAuto) {
        const req = new cc.pb.paodekuai.pdk_player_auto_req();
        req.setIsAuto(isAuto);
        cc.gateNet.Instance().sendMsg(cc.netCmd.paodekuai.cmd_pdk_player_auto_req, req,
            'pdk_player_auto_req', 'no');
    },

    /**
     * 请求重连
     */
    sendReconnect: function () {
        const req = new cc.pb.paodekuai.pdk_reconnect_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.paodekuai.cmd_pdk_reconnect_req, req,
            'pdk_reconnect_req', 'no');
    },
};

module.exports = sendMsg;