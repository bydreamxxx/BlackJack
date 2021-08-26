let brnn_Data = require('brnn_data').brnn_Data;
let BRNN_ED = require('brnn_data').BRNN_ED;
let BRNN_Event = require('brnn_data').BRNN_Event;
module.exports = {
    //断线重连
    on_msg_fkps_resume_state_2c(msg) {
        brnn_Data.Instance().roomStatus = msg.roomState;
        brnn_Data.Instance().leftTime = msg.leftTime;
        brnn_Data.Instance().reqBankerNum = msg.reqBankerSum;
        brnn_Data.Instance().configId = msg.configId;//需服务器添加
        brnn_Data.Instance()._remainBankRound = msg.bankerTimes;
        brnn_Data.Instance().isJoin = msg.isJoin;
        if (msg.roomState == 1) {
            msg.betedList.forEach(element => {
                brnn_Data.Instance().posBetTotal[element.id] = element.sum;
            });
            msg.myBetedList.forEach(element => {
                brnn_Data.Instance().posBetMe[element.id] = element.sum;
            });
        }
        brnn_Data.Instance().setBattleHistory(msg.battleInfoList);
        if (brnn_Data.Instance().playerList) {
            brnn_Data.Instance().playerList.forEach(player => {
                if (msg.bankersList.indexOf(player.userId) != -1) {
                    player.isBanker = true;
                }
                else {
                    player.isBanker = false;
                }
            });
        }
        msg.bankersList.forEach(p => {
            if (!brnn_Data.Instance().getPlayerById(p)) {
                cc.error('庄家 ' + p + '找不到');
            }
        });
        let pokersList = msg.pokersList;
        if (pokersList && pokersList.length) {//暂时不更新牌
            // brnn_Data.Instance().addBattleHistory(pokersList); //战绩
            // brnn_Data.Instance().setPokerList(pokersList);  //牌列表
        }
        BRNN_ED.notifyEvent(BRNN_Event.RECONNECT, null);
    },

    //广播状态
    on_msg_fkps_state_2c(msg) {
        let roomState = msg.roomState;
        brnn_Data.Instance().roomStatus = roomState;
        BRNN_ED.notifyEvent(BRNN_Event.ROOM_STATE, roomState);
    },

    //自己下注
    on_fkps_bet_2c(msg) {
        let result = msg.result;
        let bet_pos = msg.betId;
        let add = msg.betAdd;
        let all = msg.beted;
        if (result == 0 || result == -1) {
            if (add > 0) {
                brnn_Data.Instance().posBetMe[bet_pos] = all;
                brnn_Data.Instance().posBetTotal[bet_pos] += add;
            }
        }
        BRNN_ED.notifyEvent(BRNN_Event.BET, msg);
    },

    //其他人下注
    on_fkps_bet_broadcast(msg) {
        let bet_pos = msg.betId;
        msg.betAdd = 0;
        if (msg.beted > brnn_Data.Instance().posBetTotal[bet_pos]) {
            msg.betAdd = msg.beted - brnn_Data.Instance().posBetTotal[bet_pos];
        }
        brnn_Data.Instance().posBetTotal[bet_pos] = msg.beted;
        BRNN_ED.notifyEvent(BRNN_Event.BET_OTHER, msg);
    },

    //广播上庄
    on_fkps_banker_add_2c(msg) {
        let player = brnn_Data.Instance().getPlayerById(msg.id);
        if (player) {
            player.isBanker = true;
            if (msg.id == cc.dd.user.id) {
                brnn_Data.Instance().myBankerRank = 0;
                brnn_Data.Instance()._remainBankRound = 20;//连续上庄局数
            }
            BRNN_ED.notifyEvent(BRNN_Event.BANKER_ADD, msg);
        }
        else {
            cc.error('上庄玩家 ' + msg.id + ' 找不到');
        }
    },

    //广播下庄
    on_fkps_banker_del_2c(msg) {
        let player = brnn_Data.Instance().getPlayerById(msg.id);
        if (player) {
            player.isBanker = false;
            if (msg.id == cc.dd.user.id) {
                brnn_Data.Instance()._remainBankRound = -1;//连续上庄局数
                brnn_Data.Instance().myBankerRank = -1;
            }
            BRNN_ED.notifyEvent(BRNN_Event.BANKER_DEL, msg);
        }
        else {
            cc.error('下庄玩家 ' + msg.id + ' 找不到');
        }
    },

    //申请上庄返回
    on_fkps_req_banker_2c(msg) {
        if (msg.type == 1) {//上庄
            let result = msg.result;
            let num = msg.num;
            if (result == 0) {
                brnn_Data.Instance().myBankerRank = num;
            }
            BRNN_ED.notifyEvent(BRNN_Event.BANKER_RET, msg);
        }
        else if (msg.type == 2) {//下庄
            if (msg.result == 0) {
                brnn_Data.Instance().myBankerRank = -1;
                BRNN_ED.notifyEvent(BRNN_Event.BANKER_RET, msg);
            }
        }
    },

    //申请上庄人数变化
    on_fkps_req_banker_sum_broadcast(msg) {
        let sum = msg.sum;
        brnn_Data.Instance().reqBankerNum = sum;
        BRNN_ED.notifyEvent(BRNN_Event.UPDATE_REQ_BANKER, null);
    },

    //自己在上庄人数中的排名
    on_fkps_req_banker_num_broadcast(msg) {
        let num = msg.num;
        brnn_Data.Instance().myBankerRank = num;
        BRNN_ED.notifyEvent(BRNN_Event.UPDATE_REQ_BANKER, null);
    },

    on_fkps_banker_lists(msg) {
        if (brnn_Data.Instance().playerList) {
            brnn_Data.Instance().playerList.forEach(player => {
                if (msg.idList.indexOf(player.userId) != -1) {
                    player.isBanker = true;
                }
                else {
                    player.isBanker = false;
                }
            });
        }
        msg.idList.forEach(p => {
            if (!brnn_Data.Instance().getPlayerById(p)) {
                cc.error('同步庄家 ' + p + ' 找不到');
            }
        });
        BRNN_ED.notifyEvent(BRNN_Event.UPDATE_BANKER_LISET, null);
    },

    on_fkps_battle_lists(msg) {
        brnn_Data.Instance().setBattleHistory(msg.infoList);
        BRNN_ED.notifyEvent(BRNN_Event.UPDATE_BATTLE, null);
    },

    //结算
    on_fkps_results_2c(msg) {
        if (brnn_Data.Instance()._remainBankRound > 0) {
            --brnn_Data.Instance()._remainBankRound;
        }
        let meList = msg.meList;
        let winersList = msg.winersList.sort((a, b) => { return b.sum - a.sum; });
        let pokersList = msg.pokersList;
        let meTotal = 0;
        for (var i = meList.length - 1; i > -1; i--) {
            if (meList[i].sum == 0) {
                meList.splice(i, 1);
            }
        }
        let isBanker = brnn_Data.Instance().getPlayerById(cc.dd.user.id).isBanker;
        if (isBanker) {
            for (var i = meList.length - 1; i > -1; i--) {
                if (meList[i].id > 4) {
                    meList.splice(i, 1);
                }
            }
        }
        brnn_Data.Instance().resultMineList = meList;   //我的输赢
        brnn_Data.Instance().addBattleHistory(pokersList); //战绩
        brnn_Data.Instance().setPokerList(pokersList);  //牌列表
        brnn_Data.Instance().resultWinList = winersList;    //输赢列表
        meList.forEach(element => {
            meTotal += element.sum;
        });
        BRNN_ED.notifyEvent(BRNN_Event.RESULT, msg);
    },
}