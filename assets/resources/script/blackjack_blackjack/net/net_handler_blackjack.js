const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const BlackJackPlayerED = require("BlackJackPlayerData").BlackJackPlayerED;
const BlackJackPlayerEvent = require("BlackJackPlayerData").BlackJackPlayerEvent;


var handler = {
    on_msg_bj_ready_ack(msg) {
        if(msg.result == 0){

        }else{

        }
    },
    on_msg_bj_action_change(msg) {
        BlackJackED.notifyEvent(BlackJackEvent.PLAYER_TURN, msg);
    },
    on_msg_bj_state_change_2c(msg) {
        BlackJackData.changeState(msg);
    },
    on_msg_bj_dissolve_agree_ack(msg) {

    },
    on_msg_bj_dissolve_agree_result(msg) {

    },
    on_msg_bj_info(msg) {
        RoomMgr.Instance().player_mgr.playerEnterGame();
        BlackJackData.setGameInfo(msg);
        BlackJackED.notifyEvent(BlackJackEvent.UPDATE_UI)
    },
    on_msg_bj_deal_poker(msg) {
        let player = BlackJackData.getPlayerById(msg.userId);
        if(player){
            let info = player.getBetInfo(msg.index);
            if(info){
                info.cardsList = info.cardsList.concat(msg.cardsList);
            }else{
                player.betInfosList.push({
                    index: msg.index,
                    cardsList: msg.cardsList.concat(),
                })
            }
        }

        BlackJackData.fapaiList.push(msg.userId);

        BlackJackED.notifyEvent(BlackJackEvent.DEAL_POKER, msg);
    },
    on_msg_bj_bet_ret(msg) {
        if(msg.retCode == 0){
            if(msg.type == 1 || msg.type == 2 || msg.type == 3 || msg.type == 7){
                if(msg.userId == cc.dd.user.id){
                    BlackJackED.notifyEvent(BlackJackEvent.CLOSE_BET_BUTTON);

                    if(msg.type == 1){
                        BlackJackData.lastBet = msg.betList[0].value;
                    }
                }
            }else{
                BlackJackED.notifyEvent(BlackJackEvent.RESET_CD, msg.userId);
            }

            let player = BlackJackData.getPlayerById(msg.userId);
            if(player){
                player.score = msg.showCoin;
                player.betInfosList = msg.betList.concat();
                BlackJackPlayerED.notifyEvent(BlackJackPlayerEvent.UPDATE_BET_INFO, [player, msg.type]);
            }else {
                cc.error(`用户不存在 ${msg.userId}`);
            }
        }
        cc.dd.NetWaitUtil.net_wait_end('onClickBet');
    },
    on_msg_bj_result(msg) {
        cc.gateNet.Instance().dispatchTimeOut(2);

        msg.resultsList.forEach(result=>{
            let player = BlackJackData.getPlayerById(result.userId);
            if(player){
                player.coin = result.allCoin;
                BlackJackED.notifyEvent(BlackJackEvent.SHOW_COIN, {viewIdx: player.viewIdx, result: result});

            }
        })
    },
    on_msg_bj_result_all_2c(msg) {

    },
};

module.exports = handler;