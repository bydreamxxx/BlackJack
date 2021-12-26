const RummyData = require("RummyData").RummyData.Instance();
const RummyGameMgr = require("RummyGameMgr");
const RoomMgr = require('jlmj_room_mgr').RoomMgr;

var handler = {
    on_msg_rm_ready_ack(msg) {

    },

    on_msg_rm_action_change(msg) {
        RummyData.turn = msg.userId;
        RummyGameMgr.actionChange(msg);
    },

    on_msg_rm_state_change_2c(msg) {
        RummyData.changeState(msg);
        RummyGameMgr.changeState();
    },

    on_msg_rm_info(msg) {
        RoomMgr.Instance().player_mgr.updatePlayerGameInfo(msg.usersList, msg.banker);
        RoomMgr.Instance().player_mgr.playerEnterGame();
        RummyData.setGameInfo(msg);
        RummyGameMgr.updateUI();
    },

    on_msg_rm_poker_ack(msg) {
        if(msg.ret === 0){
        }else{
            RummyData.cardType = null;

            let str = msg.ret;
            switch (msg.ret){
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '不是该玩家的回合';
                    break;
                case 3:
                    str = '不能拿这张牌';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
        }
    },

    on_msg_rm_deal_poker(msg) {
        RummyGameMgr.faPai(msg);
    },

    on_msg_rm_deal_poker_broadcast(msg) {
        RummyGameMgr.dealPoker(msg);
    },

    on_msg_rm_give_up_poker_ack(msg) {
        if(msg.ret === 0){
            RummyGameMgr.giveUpPoker({userId: cc.dd.user.id, card: msg.card});
        }else{
            let str = msg.ret;
            switch (msg.ret){
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '不是该玩家的回合';
                    break;
                case 3:
                    str = '没有这张牌';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);

            var msg = new cc.pb.rummy.msg_rm_sort_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_sort_req, msg, "msg_rm_sort_req", true);
        }
    },

    on_msg_rm_give_up_poker_broadcast(msg) {
        RummyGameMgr.giveUpPoker(msg);
    },

    on_msg_rm_syn_giveup_poker(msg) {
        RummyGameMgr.synGiveupPoker(msg);
    },

    on_msg_rm_show_ack(msg) {
        if(msg.ret === 0){
            RummyGameMgr.showCard(msg);
        }else{
            let str = msg.ret;
            switch (msg.ret){
                case -1:
                    if(msg.userId === cc.dd.user.id){
                        RummyGameMgr.showInvalidShow();
                        RummyGameMgr.loseGame();
                    }
                    return;
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '不是该玩家的回合';
                    break;
                case 3:
                    str = '没有这张牌';
                    break;
                case 4:
                    str = '牌组不对';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);

            var msg = new cc.pb.rummy.msg_rm_sort_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_sort_req, msg, "msg_rm_sort_req", true);
        }
    },

    on_msg_rm_group_ack(msg) {
        if(msg.ret === 0) {
        }
    },

    on_msg_rm_commit_ack(msg) {
        if(msg.ret === 0) {
            RummyGameMgr.commit(msg);
        }
    },

    on_msg_rm_sort_ack(msg) {
        if(msg.ret === 0){
            RummyGameMgr.updatePoker(msg.groupsList);
        }else{
            let str = msg.ret;
            switch (msg.ret){
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '请求过于频繁';
                    break;
                case 3:
                    str = '非法用户';
                    break;
                case 4:
                    str = '已经结算';
                    break;
            }
            // cc.dd.PromptBoxUtil.show(str);
            cc.error(`on_msg_rm_sort_ack ${str}`);
        }
    },

    on_msg_rm_drop_ack(msg) {
        if(msg.ret === 0) {
            RummyGameMgr.loseGame(msg.userId);
        }
    },

    on_msg_drop_score(msg){
        RummyGameMgr.updateDropCoin(msg.score);
    },

    on_msg_rm_result(msg) {
        RummyGameMgr.gameResult(msg);
    },

    on_rm_tips_ack(msg){
        if(msg.result === 0){
            RummyGameMgr.giveTips(msg);
        }
    }
};

module.exports = handler;