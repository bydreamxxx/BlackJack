/**
 * Created by luke on 2018/12/6
 */
let texas_Data = require('texas_data').texas_Data;
let TEXAS_ED = require('texas_data').TEXAS_ED;
let Texas_Event = require('texas_data').Texas_Event;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let game_room = require("game_room");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var hall_prefab = require('hall_prefab_cfg');

var BET_ERROR = {
    [-1]:'notturn',
    [-2]:'coinenough',
    [-3]:'notplayer',
    [-4]:'notbet',
    [-5]:'wrongstate',
    [-6]:'notbetstatus',
    [-7]:'Insufficientconditions',
}
module.exports = {
    //房间状态改变
    // on_msg_texas_room_state_notify(msg) {
    //     texas_Data.Instance().isGaming = true;
    //     let roomState = msg.roomState;
    //     let maxBet = msg.maxBet > 0 ? msg.maxBet : 0;
    //     let curRound = msg.curRound;
    //     texas_Data.Instance().roomStatus = roomState;
    //     texas_Data.Instance().maxBet = maxBet;
    //     if (curRound)
    //         texas_Data.Instance().curRound = curRound;
    //     //TODO:数据清理   当前轮下注、 总清理
    //     if (roomState == 0 || roomState == 1) {//等待状态
    //         texas_Data.Instance().resetGameData();
    //     }
    //     TEXAS_ED.notifyEvent(Texas_Event.ROOM_STATE, msg.roomState);
    // },
    on_msg_texas_room_state_notify(msg) {
        texas_Data.Instance().isGaming = true;
        texas_Data.Instance().roomStatus = msg.roomState;
        if (msg.roomState == 0) {//等待状态
            texas_Data.Instance().resetGameData();
        }
        TEXAS_ED.notifyEvent(Texas_Event.ROOM_STATE, msg.roomState);
    },

    // on_msg_texas_bet_state_notify(msg) {

    // },


    on_msg_texas_banker_notify(msg) {
        texas_Data.Instance().setBanker(msg);
        TEXAS_ED.notifyEvent(Texas_Event.BANKER, msg);
    },

    on_texas_player_list(msg) {
        texas_Data.Instance().setGameingPlayers(msg);
    },

    on_msg_texas_auto_ret(msg) {

    },

    // //玩家准备
    // on_msg_suoha_ready_2c(msg) {
    //     let round = msg.round;
    //     let userId = msg.userId;
    //     texas_Data.Instance().curRound = round;
    //     if (texas_Data.Instance().getPlayerById(userId)) {
    //         texas_Data.Instance().getPlayerById(userId).isReady = true;
    //     }
    //     TEXAS_ED.notifyEvent(Texas_Event.PLAYER_READY, userId);
    // },

    // //当前说话玩家
    on_msg_texas_operate_player_notify(msg) {
        let userId = msg.playerId;
        texas_Data.Instance().curPlayer = userId;
        TEXAS_ED.notifyEvent(Texas_Event.OVER_TURN, userId);
    },


    on_msg_texas_bet_resp(msg) {

    },

    //下注广播
    on_msg_texas_bet_notify(msg) {
        // let retCode = msg.retCode;
        let userId = msg.playerId;
        let player = texas_Data.Instance().getPlayerById(userId);
        if (!player) {
            cc.error('找不到玩家数据:' + userId);
            return;
        }
        // if (retCode != 0) {
        //     return;
        // }
        player.turnBet += msg.bet;
        player.state = msg.type;
        player.score = msg.curGold
        
        let op = msg.type;
        if(op==4 || op==5 || op==1 || op==0)
            player.curBet = msg.bet;
        switch (op) {
            case 4://加注
                // var add = msg.curBet - player.curBet;
                texas_Data.Instance().m_totalBet+=msg.bet;
                TEXAS_ED.notifyEvent(Texas_Event.BET_RAISE, { bet:msg.bet, userId: userId });
                texas_Data.Instance().m_lastBet = msg.bet;
                
                break;
            case 5://allin
                // var add = msg.curBet - player.curBet;
                texas_Data.Instance().m_totalBet+=msg.bet;
                TEXAS_ED.notifyEvent(Texas_Event.BET_SHOWHAND, { bet:msg.bet, userId: userId });
                texas_Data.Instance().m_lastBet = msg.bet;
                
                break;
            case 3://弃牌
                TEXAS_ED.notifyEvent(Texas_Event.BET_DISCARD, { userId: userId });
                break;
            case 1://跟注
                // var add = msg.curBet - player.curBet;
                texas_Data.Instance().m_totalBet+=msg.bet;
                TEXAS_ED.notifyEvent(Texas_Event.BET_CALL, {bet:msg.bet, userId: userId });
                texas_Data.Instance().m_lastBet = msg.bet;
                
                break;
            // case 4://开牌
            //     TEXAS_ED.notifyEvent(Texas_Event.BET_OPENCARD, { userId: userId });
            //     break;
            case 2://过
                TEXAS_ED.notifyEvent(Texas_Event.BET_PASS, { userId: userId });
                break;
            case 0: //底
                texas_Data.Instance().m_totalBet+=msg.bet;
                TEXAS_ED.notifyEvent(Texas_Event.BET_BOTTOM, {bet:msg.bet, userId: userId });
                texas_Data.Instance().m_lastBet = texas_Data.Instance().getBaseScore();
                
                break;
        }
        
    },

    //发牌
    on_msg_texas_common_poker_notify(msg) {
        RoomMgr.Instance().gameStart = true;
        texas_Data.Instance().updateCommonCards(msg);
        var total = texas_Data.Instance().getRoundTotalBet();
        texas_Data.Instance().clearBetRound();

        var selfplayer = texas_Data.Instance().getPlayerByViewIdx(0);
        if (selfplayer && selfplayer.joinGame) {
            selfplayer.winRate = msg.winRate;
        }

        if(total>0)
        {
            texas_Data.Instance().m_totalRoundBet += total;
            TEXAS_ED.notifyEvent(Texas_Event.UPDATE_ROUND_BET, total);
        }

        

    },



    //亮牌
    on_msg_texas_player_poker_notify(msg) {
        let cardInfoList = msg.cardsList;
        if (cardInfoList.length) {
            var selfplayer = texas_Data.Instance().getPlayerByViewIdx(0);
            if (selfplayer) {
                selfplayer.joinGame = 1;
                selfplayer.cardsList = cardInfoList;
                selfplayer.winRate = msg.winRate;
            }
            // for (var i = 0; i < cardInfoList.length; i++) {
            //     var userId = cardInfoList[i].userId;
            //     var cardsList = cardInfoList[i].cardsList;
            //     var type = cardInfoList[i].type;
            //     var player = texas_Data.Instance().getPlayerById(userId);
            //     if (player) {
            //         player.cardsList = cardsList;
            //         player.cardtype = type;
            //     }
            // }
            TEXAS_ED.notifyEvent(Texas_Event.SHOW_MY_CARD, msg);
            // setTimeout(() => {
            //     TEXAS_ED.notifyEvent(Texas_Event.SHOW_MY_CARD, msg);
            // }, 50);
            
        }
    },


    //单局结算
    on_msg_texas_results_notify(msg) {
        let resultsList = msg.resultList;
        var haveCards = false;
        for (var i = 0; i < resultsList.length; i++) {
            var player = texas_Data.Instance().getPlayerById(resultsList[i].playerId);
            if (player) {
                // if (texas_Data.Instance().isFriend)
                player.cardsList = resultsList[i].pokerList
                player.cardtype = resultsList[i].type
                // player.score += resultsList[i].win;
                // else
                // if (texas_Data.Instance().isFriendGold)
                //     player.coin += resultsList[i].winGold;
            }
            if(resultsList[i].pokerList.length>0)
                haveCards = true;
        }
        if(haveCards)
            TEXAS_ED.notifyEvent(Texas_Event.SHOW_CARD, msg);
        else{
            TEXAS_ED.notifyEvent(Texas_Event.NO_CARDS_RESULT, msg);
        }
        TEXAS_ED.notifyEvent(Texas_Event.CHANGE_ROOM_STATE_TO_RESULT_STATE, msg);
        RoomMgr.Instance().gameStart = false;
    },

    //战绩
    // on_msg_suoha_result_all_2c(msg) {
    //     TEXAS_ED.notifyEvent(Texas_Event.TOTAL_RESULT, msg);
    // },

    //恢复
    on_msg_texas_room(msg) {
        if(RoomMgr.Instance().configId == null)
        {
            //断线重连公共消息没有房间id
            //需要初始化
            var texasJbcCfgItem = game_room.getItem(function (item) {
                return item.key === msg.roomType;
            });
            texas_Data.Instance().setData(texasJbcCfgItem);
            TEXAS_ED.notifyEvent(Texas_Event.UPDATE_TITTLE);
            
        }

        texas_Data.Instance().isGaming = true;
        texas_Data.Instance().roomStatus = msg.state;
        // texas_Data.Instance().m_round = msg.round;
        texas_Data.Instance().configId = msg.roomType;
        
        texas_Data.Instance().curPlayer = msg.curOpPlayerId;
        texas_Data.Instance().curPlayerTime = msg.curOpPlayerTime;
        texas_Data.Instance().m_lastBet = msg.lastBet
        if(msg.state>0){
            texas_Data.Instance().m_totalBet=0;
            texas_Data.Instance().m_totalRoundBet=0;
        }

        var bigMangId = msg.bigBlindId;
        var smallMangId = msg.smallBlindId;
        var myWinRate = 0;
        // texas_Data.Instance().maxBet = msg.maxBet;
        for (var i = 0; i < msg.playersList.length; i++) {
            var player = texas_Data.Instance().getPlayerById(msg.playersList[i].playerId);
            if (player) {
                player.turnBet = msg.playersList[i].turnBet;
                player.totalBet = msg.playersList[i].totalBet;
                player.joinGame = msg.playersList[i].joinGame;
                if(msg.playersList[i].playerId == cc.dd.user.id)
                {
                    if(msg.playersList[i].autoFlag)
                        texas_Data.Instance().m_opflag = msg.playersList[i].autoType;

                    if(msg.playersList[i].winRate)
                        myWinRate = msg.playersList[i].winRate
                }

                if(msg.playersList[i].winRate)
                {
                    player.winRate = msg.playersList[i].winRate
                }

                //大小盲，第一轮除去底注
                if(msg.commonCardsList.length==0 
                    && player.joinGame 
                    && (msg.playersList[i].playerId==bigMangId || msg.playersList[i].playerId==smallMangId))
                    texas_Data.Instance().m_round = 0;
                    // player.curBet = math.max(0,msg.playersList[i].curBet - texas_Data.Instance().getBaseScore());
                else{
                    player.curBet = msg.playersList[i].curBet;
                }
                
                player.cardsList = msg.playersList[i].cardsList;
                // player.cardtype = msg.playersList[i].carInfo.type;
                player.isWatch = (msg.playersList[i].state == 0);
                player.state = msg.playersList[i].state;
                if (msg.playersList[i].coin != null) {
                    player.score = msg.playersList[i].coin;
                }
                player.isAllin = (msg.playersList[i].state == 5);
                player.isDiscard = (msg.playersList[i].state == 3);
                

                if(msg.state>0){
                    texas_Data.Instance().m_totalBet+=msg.playersList[i].totalBet;
                    texas_Data.Instance().m_totalRoundBet+=(msg.playersList[i].totalBet - msg.playersList[i].turnBet)
                }
            }
        }
        // texas_Data.Instance().agreesList = msg.agreesList;
        texas_Data.Instance().setBanker(msg);
        TEXAS_ED.notifyEvent(Texas_Event.RECONNECT, msg);

        if(msg.commonCardsList.length>0)
        {
            var data = {};
            data.pokerList=msg.commonCardsList;
            data.winRate = myWinRate
            texas_Data.Instance().updateCommonCards(data,true);
        }
        
    },

    // //解散
    // on_room_dissolve_agree_ack(msg) {
    //     TEXAS_ED.notifyEvent(Texas_Event.DISSOLVE, msg);
    // },

    // //解散结果
    // on_room_dissolve_agree_result(msg) {
    //     TEXAS_ED.notifyEvent(Texas_Event.DISSOLVE_RESULT, msg);
    // },

    // //准备
    // on_room_prepare_ack(msg) {
    //     var userId = msg.userId;
    //     var player = texas_Data.Instance().getPlayerById(userId);
    //     player.bready = true;
    //     RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
    //     TEXAS_ED.notifyEvent(Texas_Event.FRIEND_READY, userId);
    // },


    on_msg_texas_bet_ret(msg) {
        if(msg.result == 0)
        {
            var selfplayer = texas_Data.Instance().getPlayerByViewIdx(0);
            if (selfplayer) {
                selfplayer.score = msg.curGold;
            }
        }else
        {
            cc.dd.PromptBoxUtil.show(BET_ERROR[msg.result])
        }
        TEXAS_ED.notifyEvent(Texas_Event.UPDATE_PLAYER_GOLD);
    },

    on_msg_texas_sync_coin(msg) {
        let player = texas_Data.Instance().getPlayerById(msg.playerid);
        if (!player) {
            cc.error('找不到玩家数据:' + msg.playerid);
            return;
        }
        player.score = msg.coin
        TEXAS_ED.notifyEvent(Texas_Event.UPDATE_PLAYER_GOLD, msg);
        if(msg.playerid == cc.dd.user.id && msg.coin == 0)
        {
            texas_Data.Instance().checkAutoPickMoney();
        }
    },

    on_msg_texas_sync_game_status(msg) {
        for(var i=0;i<msg.listList.length;i++)
        {
            let player = texas_Data.Instance().getPlayerById(msg.listList[i].playerid);
            if (!player) {
                cc.error('找不到玩家数据:' + msg.listList[i].playerid);
                return;
            }
            player.joinGame = msg.listList[i].joinGame
        }
        // cc.log();
        // TEXAS_ED.notifyEvent(Texas_Event.UPDATE_PLAYER_GOLD, msg);
    },
    
    // 转轮赛结算
    on_msg_texas_wheel_result(msg) {
        TEXAS_ED.notifyEvent(Texas_Event.TEXAS_WHEEL_RESULT, msg);
        // function onBack() {
        //     console.log('on_msg_texas_wheel_result back')
        // }
        // for(let i=0; i<msg.usersList.length; i++) {
        //     let user = msg.usersList[i]
        //     if(user.userId === cc.dd.user.id){
        //         cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_WHEELRACE_RESULT, function (ui) {
        //             ui.getComponent('wheel_race_result').setResult(user, onBack);
        //         }.bind(this));
        //         break
        //     }
        // }
    }

    //////////////////////////测试代码用///////////////////
    // on_msg_texas_other_player_poker_notify(msg) {
    //     // cc.log();
    //     TEXAS_ED.notifyEvent(Texas_Event.SHOW_TEST_CARD, msg);
    // },

    // on_msg_texas_test_win_rate(msg) {
    //     // cc.log();
    //     TEXAS_ED.notifyEvent(Texas_Event.SHOW_TEST_RATE, msg);
    // },
};
