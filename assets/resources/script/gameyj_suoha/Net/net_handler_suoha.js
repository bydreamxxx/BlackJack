/**
 * Created by luke on 2018/12/6
 */
let sh_Data = require('sh_data').sh_Data;
let SH_ED = require('sh_data').SH_ED;
let SH_Event = require('sh_data').SH_Event;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
module.exports = {
    //房间状态改变
    on_msg_suoha_state_change_2c(msg) {
        sh_Data.Instance().isGaming = true;
        let roomState = msg.roomState;
        let maxBet = msg.maxBet > 0 ? msg.maxBet : 0;
        let curRound = msg.curRound;
        sh_Data.Instance().roomStatus = roomState;
        sh_Data.Instance().maxBet = maxBet;
        if (curRound)
            sh_Data.Instance().curRound = curRound;
        //TODO:数据清理   当前轮下注、 总清理
        if (roomState == 0 || roomState == 1) {//等待状态
            sh_Data.Instance().resetGameData();
        }
        SH_ED.notifyEvent(SH_Event.ROOM_STATE, msg.roomState);
    },

    //玩家准备
    on_msg_suoha_ready_2c(msg) {
        let round = msg.round;
        let userId = msg.userId;
        sh_Data.Instance().curRound = round;
        if (sh_Data.Instance().getPlayerById(userId)) {
            sh_Data.Instance().getPlayerById(userId).isReady = true;
        }
        SH_ED.notifyEvent(SH_Event.PLAYER_READY, userId);
    },

    //当前说话玩家
    on_msg_suoha_cur_say_2c(msg) {
        let userId = msg.userId;
        sh_Data.Instance().curPlayer = userId;
        SH_ED.notifyEvent(SH_Event.OVER_TURN, userId);
    },

    //下注广播
    on_msg_suoha_bet_2c(msg) {
        let retCode = msg.retCode;
        let userId = msg.userId;
        let player = sh_Data.Instance().getPlayerById(userId);
        if (!player) {
            cc.error('找不到玩家数据:' + userId);
            return;
        }
        if (retCode != 0) {
            return;
        }
        player.allBet = msg.allBet;
        let op = msg.op;
        switch (op) {
            case 0://加注
                var add = msg.curBet - player.curBet;
                SH_ED.notifyEvent(SH_Event.BET_RAISE, { add: add, total: msg.allBet, userId: userId });
                break;
            case 1://梭哈
                var add = msg.curBet - player.curBet;
                SH_ED.notifyEvent(SH_Event.BET_SHOWHAND, { add: add, total: msg.allBet, userId: userId });
                break;
            case 2://弃牌
                player.isDiscard = true;
                SH_ED.notifyEvent(SH_Event.BET_DISCARD, { userId: userId });
                break;
            case 3://跟注
                var add = msg.curBet - player.curBet;
                SH_ED.notifyEvent(SH_Event.BET_CALL, { add: add, total: msg.allBet, userId: userId });
                break;
            case 4://开牌
                SH_ED.notifyEvent(SH_Event.BET_OPENCARD, { userId: userId });
                break;
            case 5://过
                SH_ED.notifyEvent(SH_Event.BET_PASS, { userId: userId });
                break;
        }
        player.curBet = msg.curBet;
    },

    //发牌
    on_msg_suoha_deal_card_2c(msg) {
        let cardInfoList = msg.cardInfoListList;
        for (var i = 0; i < cardInfoList.length; i++) {
            var userId = cardInfoList[i].userId;
            var cardsList = cardInfoList[i].cardsList;
            var player = sh_Data.Instance().getPlayerById(userId);
            if (player) {
                player.cardsList = cardsList;
                player.isWatch = false;
            }
        }
        SH_ED.notifyEvent(SH_Event.DEAL_CARD, msg);
    },

    //亮牌
    on_msg_suoha_show_card_2c(msg) {
        let cardInfoList = msg.cardInfoListList;
        if (cardInfoList.length) {
            for (var i = 0; i < cardInfoList.length; i++) {
                var userId = cardInfoList[i].userId;
                var cardsList = cardInfoList[i].cardsList;
                var type = cardInfoList[i].type;
                var player = sh_Data.Instance().getPlayerById(userId);
                if (player) {
                    player.cardsList = cardsList;
                    player.cardtype = type;
                }
            }
            SH_ED.notifyEvent(SH_Event.SHOW_CARD, msg);
        }
    },

    //单局结算
    on_msg_suoha_result_2c(msg) {
        let resultsList = msg.resultsList;
        for (var i = 0; i < resultsList.length; i++) {
            var player = sh_Data.Instance().getPlayerById(resultsList[i].userId);
            if (player) {
                // if (sh_Data.Instance().isFriend)
                player.score += resultsList[i].winGold;
                // else
                if (sh_Data.Instance().isFriendGold)
                    player.coin += resultsList[i].winGold;
            }
        }
        SH_ED.notifyEvent(SH_Event.RESULT, msg);
    },

    //战绩
    on_msg_suoha_result_all_2c(msg) {
        SH_ED.notifyEvent(SH_Event.TOTAL_RESULT, msg);
    },

    //恢复
    on_msg_suoha_resume_state_2c(msg) {
        sh_Data.Instance().isGaming = true;
        sh_Data.Instance().roomStatus = msg.roomState;
        sh_Data.Instance().curRound = msg.curRound;
        sh_Data.Instance().configId = msg.configId;
        sh_Data.Instance().curPlayer = msg.curSay;
        sh_Data.Instance().maxBet = msg.maxBet;
        for (var i = 0; i < msg.userStateList.length; i++) {
            var player = sh_Data.Instance().getPlayerById(msg.userStateList[i].userId);
            if (player) {
                player.allBet = msg.userStateList[i].bet;
                player.curBet = msg.userStateList[i].curBet;
                player.cardsList = msg.userStateList[i].carInfo.cardsList;
                player.cardtype = msg.userStateList[i].carInfo.type;
                player.isWatch = sh_Data.Instance().isFriend ? false : (msg.userStateList[i].state == 0);
                player.state = msg.userStateList[i].state;
                if (msg.userStateList[i].coin != null) {
                    player.score = msg.userStateList[i].coin;
                }
                player.isAllin = msg.userStateList[i].isAllin;
                player.isDiscard = msg.userStateList[i].isDiscard;
            }
        }
        sh_Data.Instance().agreesList = msg.agreesList;
        SH_ED.notifyEvent(SH_Event.RECONNECT, msg);
    },

    //解散
    on_room_dissolve_agree_ack(msg) {
        SH_ED.notifyEvent(SH_Event.DISSOLVE, msg);
    },

    //解散结果
    on_room_dissolve_agree_result(msg) {
        SH_ED.notifyEvent(SH_Event.DISSOLVE_RESULT, msg);
    },

    //准备
    on_room_prepare_ack(msg) {
        var userId = msg.userId;
        var player = sh_Data.Instance().getPlayerById(userId);
        player.bready = true;
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
        SH_ED.notifyEvent(SH_Event.FRIEND_READY, userId);
    },

    //看牌
    on_msg_suoha_look_ack(msg){
        SH_ED.notifyEvent(SH_Event.LOOK_CARD, msg.userId);
    },
};
