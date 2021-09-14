const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;

var handler = {
    on_msg_bj_ready_ack(msg) {
        if(msg.result == 0){

        }else{

        }
    },
    on_msg_bj_action_change(msg) {

    },
    on_msg_bj_state_change_2c(msg) {
        BlackJackData.changeState(msg);
    },
    on_msg_bj_dissolve_agree_ack(msg) {

    },
    on_msg_bj_dissolve_agree_result(msg) {

    },
    on_msg_bj_info(msg) {
        BlackJackData.setGameInfo(msg);
        BlackJackED.notifyEvent(BlackJackEvent.UPDATE_UI)
    },
    on_msg_bj_deal_poker(msg) {

    },
    on_msg_bj_bet_ret(msg) {
        if(msg.retCode == 0){

        }
        cc.dd.NetWaitUtil.net_wait_end('onClickBet');
    },
    on_msg_bj_result(msg) {

    },
    on_msg_bj_result_all_2c(msg) {

    },
};

module.exports = handler;