const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;
const BSC_Data = require('bsc_data').BSC_Data;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const game_List = require('klb_gameList');
const GameType = cc.dd.Define.GameType;
module.exports = {
    deskData: null,

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

    on_msg_match_start: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        cc._matchRoomInfo = msg;
        BSC_Data.Instance().resetSignStatus();
        let beforeLoadFunc = null;
        switch (msg.gameType) {
            case GameType.DDZ_MATCH:
                this.deskData = require('ddz_data').DDZ_Data;
                break;
            case GameType.CCMJ_MATCH:
                break;
            case GameType.WDMJ_MATCH:
                break;
            case GameType.AHMJ_MATCH:
                break;
        }
        cc.dd.AppCfg.GAME_ID = msg.gameType;
        if (cc.director.getScene().name != cc.dd.Define.GameId[msg.gameType]) {
            if (!cc.dd._.isNull(beforeLoadFunc)) {
                beforeLoadFunc();
            }
            cc.dd.SceneManager.replaceScene(cc.dd.Define.GameId[msg.gameType], null, null, function () {
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
    },

    //单局信息
    on_msg_match_round_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        switch (RoomMgr.Instance().gameId) {
            case GameType.DDZ_MATCH:
                if (!cc.dd._.isNull(this.deskData)) {
                    this.deskData.Instance().setIsStart(false);
                }
                break;
        }
        BSC_ED.notifyEvent(BSC_Event.PLAY_ROUND, msg);
    },

    //排名
    on_msg_match_rank_info: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        BSC_Data.Instance().setRankInfo(msg);
        BSC_ED.notifyEvent(BSC_Event.RANK_INFO, msg);
    },

    //淘汰人数已满
    on_msg_match_round_num_full: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        BSC_ED.notifyEvent(BSC_Event.UPDATE_NUMFULL, msg);
    },

    //排队中
    on_msg_match_round_end_line: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();

        let gameType = msg.gameType;
        let checkUpdate = gameType;
        let beforeLoadFunc = null;
        let afterLoadFunc = null;
        switch (gameType) {
            case GameType.DDZ_MATCH:
                checkUpdate = GameType.DDZ_GOLD;
                if (cc.dd._.isNull(this.deskData)) {
                    this.deskData = require('ddz_data').DDZ_Data;
                }
                beforeLoadFunc = () => {
                    this.deskData.Instance().isSceneChangeing = true;
                }
                afterLoadFunc = () => {
                    this.deskData.Instance().isSceneChangeing = false;
                }
                break;
            case GameType.CCMJ_MATCH:
                break;
            case GameType.WDMJ_MATCH:
                break;
            case GameType.AHMJ_MATCH:
                break;
        }

        if (!UpdateMgr.isGameInstalled(checkUpdate)) {

            let config = game_List.getItem(function (item) {
                return item.gameid == checkUpdate;
            });
            let name = '';
            if (config) {
                name = config.name
            }
            cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + name, '确定', null, function () {
                cc.dd.SceneManager.enterHall();
            }, null);
            return;
        }

        msg.next = false;
        if (cc.director.getScene().name != cc.dd.Define.GameId[gameType]) {
            if (!cc.dd._.isNull(beforeLoadFunc)) {
                beforeLoadFunc();
            }
            cc.dd.SceneManager.replaceScene(cc.dd.Define.GameId[gameType], null, null, function () {
                if (!cc.dd._.isNull(afterLoadFunc)) {
                    afterLoadFunc();
                }
                BSC_ED.notifyEvent(BSC_Event.RECONNECT_LINE, msg);
            });
        }
        else {
            BSC_ED.notifyEvent(BSC_Event.RECONNECT_LINE, msg);
        }
    },

    on_msg_match_round_end_line_ret: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        msg.next = true;
        BSC_ED.notifyEvent(BSC_Event.RECONNECT_LINE, msg);
    },

    //结束
    on_msg_match_end: function (msg) {
        if (!this.headerHandle(msg)) {
            return;
        }
        BSC_Data.Instance().clearData();
        BSC_ED.notifyEvent(BSC_Event.GAME_END, msg);
        switch (RoomMgr.Instance().gameId) {
            case GameType.DDZ_MATCH:
                if (!cc.dd._.isNull(this.deskData)) {
                    if (this.deskData.Instance().isSceneChangeing) {
                        this.deskData.Instance().reconnectMatchEnd = msg;
                    }
                }
                break;
        }
    },

    on_match_wx_share_ret(msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('lingquchenggong');
                BSC_ED.notifyEvent(BSC_Event.SCORE_SHARE_RET, null);
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
        switch (RoomMgr.Instance().gameId) {
            case GameType.DDZ_MATCH:
                if (!cc.dd._.isNull(this.deskData)) {
                    var player = this.deskData.Instance().getPlayer(userId);
                    if (player) {
                        var changeScore = curScore - player.score;
                        player.score = curScore;
                        BSC_ED.notifyEvent(BSC_Event.UPDATE_SCORE, [userId, changeScore, curScore]);
                    }
                }
                break;
            // case GameType.CCMJ_MATCH:
            //     let playerMgr = require('ccmj_player_mgr');
            //     let player = playerMgr.Instance().getPlayer(msg.userId);
            //     if(player){
            //         var changeScore = curScore - player.coin;
            //         player.setCoin( msg.curScore );
            //         BSC_ED.notifyEvent(BSC_Event.UPDATE_SCORE, [userId, changeScore, curScore]);
            //     }
            //     break;
            case GameType.NEW_DSZ_GOLD:
            case GameType.NEW_DSZ_GOLD_CREATE:
                var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
                playerMgr.updatePlayerCoin(userId, curScore);
                break;
            case GameType.BIRDS_AND_ANIMALS:
                var gameData = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();
                gameData.updateCurCoin(curScore);
                break;
            case GameType.DT_GOLD://单挑
                var PK_MgrObj = require('pk_data_mgr').PK_Data_Mgr.Instance();
                PK_MgrObj.playerCoinChange(curScore);
                break;
            case GameType.LKFISH_GOLD://捕鱼
                var gFishPlayerMgr = require('FishPlayerManager').CFishPlayerManager.Instance();
                gFishPlayerMgr.playerCoinChange(userId, curScore);
                break;
            case GameType.WESTWARD_GOLd: //西游记   
                var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
                game_Data.updateCurCoin(curScore);
                break;
            case GameType.PDK_FRIEND:
                var pdkData = require('pdk_data').PDK_Data.Instance().updateScore(msg);
                break;
            case GameType.LUCKY_TURNTABLE:
                gameData = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
                gameData.updateCurCoin(curScore);
                break;
            case GameType.HJSM:
                gameData = require('horse_racing_Data').Horse_Racing_Data.Instance();
                gameData.updateCurCoin(curScore);
                break;
    
        }
        if (msg.userId == cc.dd.user.id) {
            BSC_Data.Instance().setScore(msg.curScore);
        }
    },

    on_msg_match_round_countdown(msg) {
        BSC_Data.Instance()._nextRoundNum = msg.nextRoundNum;//晋级到下轮人数
        BSC_ED.notifyEvent(BSC_Event.SHOW_TIME, msg.seconds);
    },

    on_msg_is_match_shared(msg) {
        BSC_ED.notifyEvent(BSC_Event.IS_SHARED, msg.isShare);
    },

    //比赛场奖池数量
    on_msg_get_match_reward_pool_ret(msg) {
        BSC_ED.notifyEvent(BSC_Event.BSC_REWARD_POOL_UPDATE, msg);
    },

    //定时赛战绩
    on_msg_get_match_rank_history_list_ret(msg) {
        BSC_ED.notifyEvent(BSC_Event.BSC_DINGSHI_HISTORY, msg);
    },

    //战绩详情
    on_msg_get_match_rank_history_detail_ret(msg) {
        BSC_ED.notifyEvent(BSC_Event.BSC_DINGSHI_HISTORY_DETAIL, msg);
    },

    //本轮轮空
    on_msg_match_round_null(msg) {
        BSC_ED.notifyEvent(BSC_Event.BSC_DINGSHI_LUNKONG, msg);
        cc.dd.PromptBoxUtil.show('本轮轮空，直接晋级下一轮，请稍等...');
    },

    //预赛复活消耗
    on_msg_match_dead_ret(msg) {
        BSC_ED.notifyEvent(BSC_Event.BSC_DINGSHI_DEAD_RET, msg);
    },

    //复活是否成功
    on_msg_match_reborn_ret(msg) {
        BSC_ED.notifyEvent(BSC_Event.BSC_DINGSHI_REBORN_RET, msg);
    },

    //输赢累计分数
    on_msg_match_room_win_result(msg){
        BSC_ED.notifyEvent(BSC_Event.BSC_ROOM_WIN_RESULT, msg);
    },

    on_msg_match_join_ret(msg) {
        switch (msg.retCode) {
            case 0:
                cc.dd.PromptBoxUtil.show('报名成功');
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('报名费不足');
                break;
            case 2:
                cc.dd.PromptBoxUtil.show('报名时间已过');
                break;
        }
    },
}