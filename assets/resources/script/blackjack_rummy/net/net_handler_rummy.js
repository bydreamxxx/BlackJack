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
            let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
            if(player){
                player.updatePoker();
            }
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
            cc.dd.PromptBoxUtil.show(str);
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

    }
};

module.exports = handler;


/**
 * 【LOG】[2021/12/8 下午10:28:30] 【GateNet 网络-接收】[9805:msg_rm_info]
 { usersList: [],
  bjState: 2,
  lastTime: 689,
  roomConfigId: 18502,
  turn: 1638971058,
  turnLeftTime: 15,
  banker: 184552571,
  xcard: 172,
  giveUp: 103 }
 【LOG】[2021/12/8 下午10:28:44] 【GateNet 网络-接收】[9811:msg_rm_give_up_poker_ack]
 { ret: 0, card: 61 }
 【LOG】[2021/12/8 下午10:28:45] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 61 ], userId: 184552571, type: 1 }
 【LOG】[2021/12/8 下午10:28:46] 【GateNet 网络-接收】[9812:msg_rm_give_up_poker_broadcast]
 { userId: 184552571, card: 54 }
 【LOG】[2021/12/8 下午10:28:47] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 0 ], userId: 603982777, type: 0 }
 【LOG】[2021/12/8 下午10:28:48] 【GateNet 网络-接收】[9812:msg_rm_give_up_poker_broadcast]
 { userId: 603982777, card: 23 }
 【LOG】[2021/12/8 下午10:29:09] 【GateNet 网络-接收】[9807:msg_rm_poker_ack]
 { ret: 0 }
 【LOG】[2021/12/8 下午10:29:09] 【GateNet 网络-接收】[9808:msg_rm_deal_poker]
 { cardsList: [ 132, 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44, 111 ],
  userId: 1638971058 }
 【LOG】[2021/12/8 下午10:29:09] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 0 ], userId: 1638971058, type: 0 }
 【LOG】[2021/12/8 下午10:29:29] 【GateNet 网络-接收】[9811:msg_rm_give_up_poker_ack]
 { ret: 0, card: 132 }
 【LOG】[2021/12/8 下午10:29:30] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 0 ], userId: 184552571, type: 0 }
 【LOG】[2021/12/8 下午10:29:31] 【GateNet 网络-接收】[9812:msg_rm_give_up_poker_broadcast]
 { userId: 184552571, card: 74 }
 【LOG】[2021/12/8 下午10:29:32] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 74 ], userId: 603982777, type: 1 }
 【LOG】[2021/12/8 下午10:29:34] 【GateNet 网络-接收】[9812:msg_rm_give_up_poker_broadcast]
 { userId: 603982777, card: 32 }
 【LOG】[2021/12/8 下午10:29:55] 【GateNet 网络-接收】[9807:msg_rm_poker_ack]
 { ret: 0 }
 【LOG】[2021/12/8 下午10:29:55] 【GateNet 网络-接收】[9808:msg_rm_deal_poker]
 { cardsList: [ 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44, 111, 34 ],
  userId: 1638971058 }
 【LOG】[2021/12/8 下午10:29:55] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 0 ], userId: 1638971058, type: 0 }
 【LOG】[2021/12/8 下午10:30:16] 【GateNet 网络-接收】[9811:msg_rm_give_up_poker_ack]
 { ret: 0, card: 83 }
 【LOG】[2021/12/8 下午10:30:17] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 0 ], userId: 184552571, type: 0 }
 【LOG】[2021/12/8 下午10:30:18] 【GateNet 网络-接收】[9812:msg_rm_give_up_poker_broadcast]
 { userId: 184552571, card: 11 }
 【LOG】[2021/12/8 下午10:30:19] 【GateNet 网络-接收】[9809:msg_rm_deal_poker_broadcast]
 { cardList: [ 0 ], userId: 603982777, type: 0 }
 【LOG】[2021/12/8 下午10:30:20] 【GateNet 网络-接收】[9812:msg_rm_give_up_poker_broadcast]
 { userId: 603982777, card: 102 }
 */