let twoeight_Data = require('twoeight_data').twoeight_Data;
let TE_ED = require('twoeight_data').TE_ED;
let TE_Event = require('twoeight_data').TE_Event;
module.exports = {
    // 玩家进入/重连通报
    on_msg_br_tb_player_enter_notify(msg) {
        twoeight_Data.Instance().roomStatus = msg.roomState;
        twoeight_Data.Instance().leftTime = msg.leftTime;
        twoeight_Data.Instance().reqBankerlist = msg.reqBankerList;
        // twoeight_Data.Instance().configId = msg.configId;//需服务器添加
        twoeight_Data.Instance()._remainBankRound = msg.bankerTimes;
        twoeight_Data.Instance().isJoin = msg.isJoin;
        twoeight_Data.Instance().sitelist = msg.siteListList;
        twoeight_Data.Instance().battleHistory = msg.battleRecodeList;
        twoeight_Data.Instance().curRound = msg.curRound;
        twoeight_Data.Instance().timestamp = msg.timestamp;
        let player = twoeight_Data.Instance().getPlayerById(cc.dd.user.id)
        player.coin = msg.gold
        if (msg.roomState == 1) {
            msg.otherBetList.forEach(element => {
                twoeight_Data.Instance().posBetTotal[element.id] = element.sum;
            });
            msg.myBetList.forEach(element => {
                twoeight_Data.Instance().posBetMe[element.id] = element.sum;
            });
        }
        twoeight_Data.Instance().bankerList = msg.bankersList;
        if (twoeight_Data.Instance().playerList) {
            twoeight_Data.Instance().playerList.forEach(player => {
                player.isBanker = false;
                for (let i = 0; i < msg.bankersList.length; i++) {
                    if (msg.bankersList[i].userId == player.userId) {
                        player.isBanker = true;
                        break;
                    }
                }
            });
        }
        // msg.bankersList.forEach(p => {
        //     if (!twoeight_Data.Instance().getPlayerById(p.userId)) {
        //         cc.error('庄家 ' + p.userId + '找不到');
        //     }
        // });
        TE_ED.notifyEvent(TE_Event.RECONNECT, null);
    },

    //房间状态
    on_msg_br_tb_state_notify(msg) {
        let roomState = msg.roomState;
        twoeight_Data.Instance().roomStatus = roomState;

        TE_ED.notifyEvent(TE_Event.ROOM_STATE, roomState);

    },

    //押注响应
    on_msg_br_tb_bet_resp(msg) {
        let result = msg.result;
        let bet_pos = msg.betId;
        let add = msg.betAdd;
        let all = msg.betSum;
        if (result == -4) {
            cc.dd.PromptBoxUtil.show('下注已达上限')
            return
        }
        if (result == 0 || result == -1) {
            if (add > 0) {
                twoeight_Data.Instance().posBetMe[bet_pos] = all;
                twoeight_Data.Instance().posBetTotal[bet_pos] += add;
            }
        }
        TE_ED.notifyEvent(TE_Event.BET, msg);
    },
    //別人下注
    on_msg_br_tb_bet_info_notify(msg) {
        let betInfoList = msg.betInfoList;
        if (betInfoList.length > 0) {
            betInfoList.forEach(item => {
                item.betAdd = item.betSum - twoeight_Data.Instance().posBetTotal[item.betId];
                twoeight_Data.Instance().posBetTotal[item.betId] = item.betSum;
                TE_ED.notifyEvent(TE_Event.BET_OTHER, item);
            })
        }
    },
    //战绩结算通报
    on_msg_br_tb_results_notify(msg) {
        let player = twoeight_Data.Instance().getPlayerById(cc.dd.user.id)
        // if (player.isBanker && twoeight_Data.Instance()._remainBankRound > 0) {
        //     --twoeight_Data.Instance()._remainBankRound;
        // }
        twoeight_Data.Instance().resultMineList = msg.meList;   //我的输赢
        twoeight_Data.Instance().meWin = msg.meWin;   //我的输赢
        twoeight_Data.Instance().setPokerList(msg.pokersList);  //牌列表
        TE_ED.notifyEvent(TE_Event.RESULT, msg);
    },

    //广播战绩  历史战绩
    on_msg_br_tb_battle_record_notify(msg) {
        twoeight_Data.Instance().battleHistory = msg.infoList;
        TE_ED.notifyEvent(TE_Event.UPDATE_BATTLE, null);
    },
    //申请上庄回复
    on_msg_br_tb_banker_resp(msg) {
        let result = msg.result;
        if (result == 0) {
            if (msg.type == 1) {
                twoeight_Data.Instance().myBankerRank = 1;
                // twoeight_Data.Instance()._remainBankRound = 6;//连续上庄局数
            } else if (msg.type == 2) {//下庄

                cc.dd.PromptBoxUtil.show('您已经下庄')
                twoeight_Data.Instance().myBankerRank = - 1;
                // twoeight_Data.Instance()._remainBankRound = -1;
            }
        }
        TE_ED.notifyEvent(TE_Event.BANKER_RET, msg);
    },
    //申请上庄通报 
    on_msg_br_tb_banker_req_notify(msg) {
        twoeight_Data.Instance().setBankerList(msg);
        TE_ED.notifyEvent(TE_Event.UPDATE_REQ_BANKER, msg);
    },
    //申请上庄列表
    on_msg_br_tb_req_banker_list_notify(msg) {
        twoeight_Data.Instance().reqBankerlist = msg.bankersList;
    },
    //庄家列表
    on_msg_br_tb_banker_list_notify(msg) {
        twoeight_Data.Instance().bankerList = msg.bankersList;
        if (twoeight_Data.Instance().playerList) {
            twoeight_Data.Instance().playerList.forEach(player => {
                player.isBanker = false;
                if (msg.bankersList.length > 0) {
                    try {
                        msg.bankersList.forEach(item => {
                            if (item.userId == player.userId) {
                                player.isBanker = true;
                                throw new Error('break');
                            }
                        })
                    } catch (err) {
                    }
                }
            });
        }
        msg.bankersList.forEach(p => {
            if (!twoeight_Data.Instance().getPlayerById(p.userId)) {
                cc.error('同步庄家 ' + userId + ' 找不到');
            }
        });
        TE_ED.notifyEvent(TE_Event.UPDATE_BANKER_LISET, null);
    },
    //座位置响应
    on_msg_get_site_resp(msg) {
        switch (msg.result) {
            case 0:
                try {
                    twoeight_Data.Instance().sitelist.forEach(item => {
                        if (item.siteId == msg.siteId) {
                            item.userId = cc.dd.user.id;
                            throw new Error('break');
                        }
                    })
                } catch (err) {
                }
                TE_ED.notifyEvent(TE_Event.UPDATE_SITE, msg);
                break;
            case -1:
                cc.dd.PromptBoxUtil.show('位置错误');
                break;
            case -2:
                cc.dd.PromptBoxUtil.show('金币不足');
                break;
        }
    },
    //座位位置通报
    on_msg_get_site_notify(msg) {
        try {
            twoeight_Data.Instance().sitelist.forEach(item => {
                if (item.siteId == msg.siteId) {
                    item.userId = msg.userId;
                    throw new Error('break');
                }
            })
        } catch (err) {
        }
        TE_ED.notifyEvent(TE_Event.UPDATE_SITE, msg);
    },
    //座位上玩家金币
    on_msg_player_gold_notify(msg) {
        twoeight_Data.Instance().getPlayerById(msg.userId).coin = msg.gold
    },
    //自身金币同步
    on_msg_self_gold_notify(msg) {
        let player = twoeight_Data.Instance().getPlayerById(cc.dd.user.id)
        if (player) {
            player.coin = msg.gold
        }
    },
    //庄家奖池
    on_msg_banker_gold_pool_notify(msg) {
        twoeight_Data.Instance().bankerJackpot = msg.gold;
    },
    //玩家奖池
    on_msg_player_gold_pool_notify(msg) {
        twoeight_Data.Instance().playerJackpot = msg.gold;
    },
    // 玩家排行榜
    on_msg_br_tb_rank_resp(msg) {
        TE_ED.notifyEvent(TE_Event.RANK_LIST, msg);
    },
    //奖池奖金通报
    on_msg_lottery_gold_notify(msg) {
        twoeight_Data.Instance().lotteryGold = msg.gold;
    },
    //连续中奖
    on_msg_br_tb_continue_win_notify(msg) {
        twoeight_Data.Instance().winStreaklist = msg.listList;
    },
    //座位上玩家投注
    on_msg_br_tb_site_player_bet_notify(msg) {
        TE_ED.notifyEvent(TE_Event.CHIPS_ANIM, msg);
    },
    //座位上玩家输赢
    on_msg_br_tb_site_player_win_notify(msg) {
        twoeight_Data.Instance().sitePlayerWin.push(msg)
        TE_ED.notifyEvent(TE_Event.SITE_PLAYER, msg);
    },
    //自身金币同步
    on_msg_self_gold_notify(msg) {
        TE_ED.notifyEvent(TE_Event.UPDATE_GOLD, msg);
    }
}