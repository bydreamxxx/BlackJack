const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
const DDZ_Data = require('ddz_data').DDZ_Data;
const Bsc = require('bsc_data');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

module.exports = {
    //比赛开始  拉入游戏
    on_msg_match_start: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Bsc.BSC_Data.Instance().resetSignStatus();
        if (msg.gameType == 31) {//斗地主比赛场
            if (cc.director.getScene().name != 'ddz_game_bsc') {
                cc.dd.SceneManager.replaceScene('ddz_game_bsc', null, null, function () {
                    const req = new cc.pb.room_mgr.room_prepare_req();
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
                        'room_prepare_req', 'no');
                });
            }
            else {
                const req = new cc.pb.room_mgr.room_prepare_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
                    'room_prepare_req', 'no');
            }
            if (cc.dd.DialogBoxUtil.dialogBox && cc.dd.DialogBoxUtil.dialogBox.title_text.string == '报名成功') {
                cc.dd.DialogBoxUtil.dialogBox.close();
            }
        }
    },

    //房间信息
    on_ddz_room_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_Data.Instance().deskInfo = msg.deskInfo;
        // if (msg.deskInfo.gameType != 33) {//朋友场玩家数据已存在
        //     DDZ_Data.Instance().playerInfo = msg.playerInfoList.sort(function (a, b) { return a.site - b.site });
        // }
        DDZ_Data.Instance().initGamePlayerData(msg.playerInfoList);
        for (var i = 0; i < msg.deskInfo.playTimeoutList.length; i++) {
            var userId = msg.deskInfo.playTimeoutList[i].playUserId;
            var player = DDZ_Data.Instance().getPlayer(userId);
            if (player) {
                player.cardTime = msg.deskInfo.playTimeoutList[i].playTimeout;
            }
        }
        DDZ_Data.Instance().curRound = msg.curRound;
        DDZ_ED.notifyEvent(DDZ_Event.INIT_ROOM, null);
    },

    //更新状态
    on_ddz_update_desk_status: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.UPDATE_STATUS, msg);
    },

    //发牌
    on_ddz_hand_poker_list: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.HAND_POKER, msg);
    },

    //叫分结果
    on_ddz_call_score_result: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.SHOW_LORD, msg);
    },

    //叫分返回
    on_ddz_call_score_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        if (msg.score > DDZ_Data.Instance().maxScore) {
            DDZ_Data.Instance().maxScore = msg.score;
        }
        cc.dd.NetWaitUtil.net_wait_end('ddz_callscore');
        DDZ_ED.notifyEvent(DDZ_Event.CALLSCORE_RET, msg);
    },

    //加倍返回
    on_ddz_double_score_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        cc.dd.NetWaitUtil.net_wait_end('ddz_double');
        DDZ_ED.notifyEvent(DDZ_Event.DOUBLE_RET, msg);
    },

    //出牌返回
    on_ddz_play_poker_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        cc.dd.NetWaitUtil.net_wait_end('ddz_sendcard');
        DDZ_ED.notifyEvent(DDZ_Event.PLAY_POKER, msg);
    },

    //托管返回
    on_ddz_player_auto_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.AUTO_RET, msg);
    },

    //单局结算
    on_ddz_play_result: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.RESULT_RET, msg);
        if (DDZ_Data.Instance().isSceneChangeing) {
            DDZ_Data.Instance().reconnectResult = msg;
        }
    },

    on_ddz_play_poker_timeout: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        let userId = msg.playUserId;
        var player = DDZ_Data.Instance().getPlayer(userId);
        if (player) {
            player.cardTime = msg.playTimeout;
        }
        DDZ_ED.notifyEvent(DDZ_Event.UPDATE_TIMEOUT, msg);
    },

    //单局信息
    on_ddz_play_round_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_Data.Instance().setIsStart(false);
        Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.PLAY_ROUND, msg);
    },

    //排名
    on_msg_match_rank_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_Data.Instance().rankInfo = msg;
        Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.RANK_INFO, msg);
    },

    //重连
    on_ddz_reconnect_room_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Bsc.BSC_Data.Instance().resetSignStatus();
        DDZ_Data.Instance().deskInfo = msg.deskInfo;
        DDZ_Data.Instance().initGamePlayerData(msg.playerInfoList);
        for (var i = 0; i < msg.deskInfo.playTimeoutList.length; i++) {
            var userId = msg.deskInfo.playTimeoutList[i].playUserId;
            var player = DDZ_Data.Instance().getPlayer(userId);
            if (player) {
                player.cardTime = msg.deskInfo.playTimeoutList[i].playTimeout;
            }
        }
        //DDZ_Data.Instance().playerInfo = msg.playerInfoList.sort(function (a, b) { return a.site - b.site });
        var game_type = msg.deskInfo.gameType;
        var sceneName = '';
        if (game_type == 31) {//比赛场
            sceneName = 'ddz_game_bsc';
        }
        else if (game_type == 32) {//金币场
            sceneName = 'ddz_game_jbc';
        }
        else if (game_type == 33) {//朋友场
            sceneName = 'ddz_game_pyc';
        }
        else if (game_type == 34) {//朋友场
            sceneName = 'xyddz_pyc';
        }
        //数据同步
        if (game_type == 33) {
            RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId, msg.deskInfo.clubId);
            RoomMgr.Instance()._Rule = msg.deskInfo.deskRule;
            DDZ_Data.Instance().requesYuYinUserData();
        }
        if (game_type == 34) {
            RoomMgr.Instance().setGameCommonInfo(msg.deskInfo.gameType, msg.deskInfo.password, msg.deskInfo.ownerId, msg.deskInfo.clubId);
            RoomMgr.Instance()._Rule = msg.deskInfo.xyDeskRule;
            DDZ_Data.Instance().requesYuYinUserData();

        }
        if (cc.director.getScene().name != sceneName) {
            DDZ_Data.Instance().isSceneChangeing = true;
            if (sceneName == cc.dd.SceneManager.replaceName) {
                cc.dd.SceneManager.endcallEx = function () {
                    DDZ_Data.Instance().isSceneChangeing = false;
                    DDZ_ED.notifyEvent(DDZ_Event.RECONNECT, msg);
                    //DDZ_Data.Instance().initFinish = true;
                    // var ddz_send_msg = require('ddz_send_msg');
                    // ddz_send_msg.sendReconnect();
                }
            }
            else {
                cc.dd.SceneManager.replaceScene(sceneName, null, null, function () {
                    DDZ_Data.Instance().isSceneChangeing = false;
                    DDZ_ED.notifyEvent(DDZ_Event.RECONNECT, msg);
                    // DDZ_Data.Instance().initFinish = true;
                    // var ddz_send_msg = require('ddz_send_msg');
                    // ddz_send_msg.sendReconnect();
                });
            }
        }
        else {
            DDZ_ED.notifyEvent(DDZ_Event.RECONNECT, msg);
            // DDZ_Data.Instance().initFinish = false;
        }
    },

    //排队中
    on_ddz_match_line: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
        if (!UpdateMgr.isGameInstalled(32)) {
            cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + "斗地主", 'text33', null, function () {
                cc.dd.SceneManager.replaceScene("kuaileba_hall");
            }, null);
            return;
        }
        if (cc.director.getScene().name != "ddz_game_bsc") {
            DDZ_Data.Instance().isSceneChangeing = true;
            cc.dd.SceneManager.replaceScene("ddz_game_bsc", null, null, function () {
                DDZ_Data.Instance().isSceneChangeing = false;
                Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.RECONNECT_LINE, msg);
            });
        }
        else {
            Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.RECONNECT_LINE, msg);
        }
    },

    //结束
    on_msg_match_end: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.GAME_END, msg);
        if (DDZ_Data.Instance().isSceneChangeing) {
            DDZ_Data.Instance().reconnectMatchEnd = msg;
        }
    },

    //离线
    on_ddz_player_offline_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.PLAYER_OFFLINE, msg);
    },

    //明牌
    on_ddz_get_all_poker_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.MINGPAI, msg);
    },

    //更新底分
    on_ddz_update_base_score: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.UPDATE_BASESCORE, msg);
    },

    //淘汰人数已满
    on_msg_match_round_num_full: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.UPDATE_NUMFULL, msg);
    },

    //分摞发牌
    on_ddz_stack_poker_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.STACK_POKER, msg);
    },


    //战绩统计
    on_ddz_friend_last_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.ZHANJI, msg);
        if (DDZ_Data.Instance().isSceneChangeing) {
            DDZ_Data.Instance().reconnectZhanji = msg;
        }
    },

    //解散返回
    on_room_dissolve_agree_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.DISSOLVE, msg);
    },

    //解散结果
    on_room_dissolve_agree_result: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.DISSOLVE_RESULT, msg);
    },

    //玩家选择换三张
    on_ddz_change_poker_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.PLAYER_EXCHANGE, msg);
    },

    //换三张结果
    on_ddz_change_poker_result: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.EXCHANGE_RESULT, msg);
    },

    //朋友场继续
    on_room_prepare_ack: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.PYC_NEXT, msg);
    },

    //控牌
    on_ddz_control_poker_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        DDZ_ED.notifyEvent(DDZ_Event.KONGPAI, msg);
    },

    on_match_wx_share_ret(msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('领取成功');
                Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.SCORE_SHARE_RET, null);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('抱歉，当局游戏已结束，领取失败');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('您已领取当前奖励，不能重复领取');
                break;
        }
    },

    on_msg_room_update_score(msg) {
        var userId = msg.userId;
        var curScore = msg.curScore;
        var player = DDZ_Data.Instance().getPlayer(userId);
        if (player) {
            var changeScore = curScore - player.score;
            player.score = curScore;
            Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.UPDATE_SCORE, [userId, changeScore, curScore]);
        }
    },

    headerHandle: function (msg) {
        //无header,直接返回
        if (cc.dd._.isUndefined(msg.header)) {
            return true;
        }
        if (msg.header.code != 0) {
            cc.error(msg.header.error + " code = " + msg.header.code);
            return false;
        }
        return true;
    },
}