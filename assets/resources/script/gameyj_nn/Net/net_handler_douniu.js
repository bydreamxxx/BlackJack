var nn_data = require('nn_data');
var nn_mgr = require('nn_mgr');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const roomStatus = {
    Wait: 0,
    Bank: 1,
    Bet: 2,
    Group: 3,
    Result: 4,
}
module.exports = {
    //游戏状态改变
    on_msg_bullfight_state_change_2c(msg) {
        nn_data.Instance().roomStatus = msg.roomState;
        nn_mgr.Instance().changeStatus(msg.roomState);
    },

    //抢庄广播
    on_msg_bullfight_rob_bull_2c(msg) {
        if (msg.retCode == 0) {
            var userId = msg.userId;
            var bet = msg.bet;
            var player = nn_data.Instance().getPlayerById(userId);
            if (!player) {
                cc.log('抢庄返回, 找不到玩家, id:' + userId);
            }
            player.betOne = bet;
            var view = nn_data.Instance().getViewById(userId);
            var sex = player.sex;
            nn_mgr.Instance().bankRet(userId, bet, view, sex);
        }
    },

    //抢庄结果
    on_msg_bullfight_banker_2c(msg) {
        var bankerId = msg.userId;
        nn_data.Instance().getPlayerById(bankerId).isBanker = true;
        var view = nn_data.Instance().getViewById(bankerId);
        nn_mgr.Instance().bankComp(bankerId, view);
    },

    //下注广播
    on_msg_bullfight_bet_2c(msg) {
        if (msg.retCode == 0) {
            var userId = msg.userId;
            var bet = msg.bet;
            nn_data.Instance().getPlayerById(userId).betTwo = bet;
            var view = nn_data.Instance().getViewById(userId);
            nn_mgr.Instance().betRet(userId, bet, view);
        }
    },

    //发牌
    on_msg_bullfight_deal_card_2c(msg) {
        var data = msg.cardInfoListList;
        var round = msg.round;
        nn_data.Instance().curRound = round;
        data.forEach(element => {
            var player = nn_data.Instance().getPlayerById(element.userId);
            player.handCards = element.cardsList;
            player.isWatch = false;
        });
        //if (nn_data.Instance().roomStatus == roomStatus.Wait || nn_data.Instance().roomStatus == roomStatus.Result) {//第一次发牌
        RoomMgr.Instance().gameStart = true;
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
        nn_data.Instance().isStart = true;
        nn_data.Instance().isGaming = true;
        nn_mgr.Instance().gameStart();
        nn_mgr.Instance().sendPoker(data);
        //}
        // else {//翻牌
        //     nn_mgr.Instance().send2ndPoker(data);
        // }
    },

    //开牌
    on_msg_bullfight_show_card_2c(msg) {
        var data = msg.cardInfoListList;
        data.forEach(element => {
            var player = nn_data.Instance().getPlayerById(element.userId);
            if (!player) {
                cc.log('开牌， 找不到玩家, id:' + element.userId);
            }
            player.handCards = element.cardsList;
            player.orderCardsList = element.orderCardsList;
            player.cardtype = element.type;
        });
        nn_mgr.Instance().scanPoker(data);
    },

    //组牌广播
    on_msg_bullfight_op_over_2c(msg) {
        var userId = msg.userId;
        var type = msg.type;
        var orderCardsList = msg.cardsList;
        var player = nn_data.Instance().getPlayerById(userId);
        player.cardtype = type;
        player.orderCardsList = orderCardsList;
        var view = nn_data.Instance().getViewById(userId);
        nn_mgr.Instance().completedGroup(userId, type, view);
    },

    //结算
    on_msg_bullfight_result_2c(msg) {
        nn_data.Instance().isResult = true;
        var resultsList = msg.resultsList;
        nn_data.Instance().resultsList = resultsList;
        var maxWin = 0;
        var winList = [];
        resultsList.forEach(result => {
            result.view = nn_data.Instance().getViewById(result.userId);
            var player = nn_data.Instance().getPlayerById(result.userId);
            if (player == null) {
                cc.log('结算, 找不到玩家, id:' + result.userId);
            }
            var winGold = result.winGold;
            if (player.score != null) {
                player.score += winGold;
            }
            else {
                player.coin += winGold;
            }
            player.bready = false;
            player.isWinner = false;
            if (winGold > maxWin) {
                maxWin = winGold;
                winList = [];
                winList.push(result.userId);
            }
            else if (winGold == maxWin) {
                winList.push(result.userId);
            }
        });
        winList.sort(function (a, b) { return b - a });
        var winner = nn_data.Instance().getPlayerById(winList[0]);
        winner.isWinner = true;
        RoomMgr.Instance().gameStart = false;
    },

    //战绩
    on_msg_bullfight_result_all_2c(msg) {
        nn_data.Instance().isEnd = true;
        nn_mgr.Instance().showResultTotal(msg);
    },

    //重连
    on_msg_resume_state_2c(msg) {
        var roomState = msg.roomState;
        var leftTime = msg.leftTime;
        var userStateList = msg.userStateList;
        nn_data.Instance().roomStatus = roomState;
        nn_data.Instance().leftTime = leftTime;
        nn_data.Instance().curRound = msg.curRound;
        nn_data.Instance().configId = msg.configId;
        nn_data.Instance().agreesList = msg.agreesList;
        nn_data.Instance().autoBet = msg.autoBet;
        nn_data.Instance().autoBank = msg.autoBank;
        userStateList.forEach(element => {
            var player = nn_data.Instance().getPlayerById(element.userId);
            player.isBanker = element.isbanker && roomState != 1 && roomState != 0;
            player.isOpt = element.isopt;
            player.betOne = element.betone;
            player.betTwo = element.bettwo;
            player.handCards = element.carInfo.cardsList;
            player.cardType = element.carInfo.type;
            player.state = element.state;
            player.isAuto = element.isAuto;
            if (element.coin != null) {
                player.score = element.coin;
            }
        });
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
        nn_mgr.Instance().reconnectGame();
    },

    on_msg_auto_bank_bet_2c(msg) {
        var code = msg.retCode;
        if (code == 0) {
            nn_data.Instance().autoBet = msg.autoBet;
            nn_data.Instance().autoBank = msg.autoBank;
            nn_mgr.Instance().autoBetRet();
        }
    },

    //解散
    on_room_dissolve_agree_ack(msg) {
        nn_mgr.Instance().dissolveRet(msg);
    },

    //解散结果
    on_room_dissolve_agree_result(msg) {
        nn_mgr.Instance().dissolveResult(msg);
    },

    //玩家准备
    on_room_prepare_ack(msg) {
        var userId = msg.userId;
        var player = nn_data.Instance().getPlayerById(userId);
        player.bready = true;
        nn_mgr.Instance().playerReady(userId);
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
    },

    //托管广播
    on_bullfight_player_auto_ack(msg) {
        var userId = msg.userId;
        var player = nn_data.Instance().getPlayerById(userId);
        player.isAuto = msg.isAuto;
        nn_mgr.Instance().playerAuto(msg);
    },

    msg_bullfight_ready_2c(msg) {
        
    },
}