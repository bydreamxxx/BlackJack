module.exports = {
    /**
     * 抢庄
     * @param {Number} bet 
     */
    banker(bet) {
        const req = new cc.pb.douniu.msg_bullfight_rob_bull_2s();
        req.setBet(bet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.douniu.cmd_msg_bullfight_rob_bull_2s, req,
            'msg_bullfight_rob_bull_2s', 'no');
    },

    /**
     * 下注
     * @param {Number} num 
     */
    bet(num) {
        const req = new cc.pb.douniu.msg_bullfight_bet_2s();
        req.setBet(num);
        cc.gateNet.Instance().sendMsg(cc.netCmd.douniu.cmd_msg_bullfight_bet_2s, req,
            'msg_bullfight_bet_2s', 'no');
    },

    /**
     * 组牌
     * @param {Array<Number>} cards 
     */
    groupcard(cards) {
        const req = new cc.pb.douniu.msg_bullfight_op_over_2s();
        req.setCardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.douniu.cmd_msg_bullfight_op_over_2s, req,
            'msg_bullfight_op_over_2s', 'no');
    },

    /**
     * 准备
     */
    ready() {
        const req = new cc.pb.room_mgr.room_prepare_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
            'room_prepare_req', 'no');
    },

    /**
     * 开始游戏
     */
    startgame() {
        const req = new cc.pb.douniu.msg_bullfight_start_game_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.douniu.cmd_msg_bullfight_start_game_2s, req,
            'msg_bullfight_start_game_2s', 'no');
    },

    /**
     * 离开房间
     */
    leave(gameid, roomid) {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameid);
        gameInfoPB.setRoomId(roomid);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    /**
     * 解散房间
     * @param {Boolean} isAgree 
     */
    dissolve(isAgree) {
        const req = new cc.pb.room_mgr.room_dissolve_agree_req();
        req.setIsAgree(isAgree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, req,
            'room_dissolve_agree_req', 'no');
    },

    /**
    * 准备
    */
    nextgame(gameid, roomid) {
        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameid);
        gameInfoPB.setRoomId(roomid);
        pbData.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);
    },

    //挂机设置
    autobet(bank,bet){
        const req = new cc.pb.douniu.msg_auto_bank_bet_2s();
        req.setAutoBank(bank);
        req.setAutoBet(bet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.douniu.cmd_msg_auto_bank_bet_2s, req,
            'msg_auto_bank_bet_2s', 'no');
    },

    tuoguan(bool){
        const req = new cc.pb.douniu.bullfight_player_auto_req();
        req.setIsAuto(bool);
        cc.gateNet.Instance().sendMsg(cc.netCmd.douniu.cmd_bullfight_player_auto_req, req,
            'bullfight_player_auto_req', 'no');
    },

    /**
     * 发送换桌协议
     */
    sendReplaceDesktop: function () {
        //todo:清空桌面
        //this.clearPlayerList(false);
        if (!this.CD) {
            this.CD = true;
            this.scheduleOnce(function () {
                this.CD = false;
            }.bind(this), 1);
            var pbData = new cc.pb.room_mgr.msg_change_room_req();
            pbData.setGameType(DDZ_Data.Instance().getGameId());
            pbData.setRoomCoinId(DDZ_Data.Instance().getRoomId());
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
        }
    },
};