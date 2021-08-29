// create by wj 2018/10/15
var deskData = require('dsz_desk_data').DSZ_Desk_Data.Instance();
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
var deskEvent = require('dsz_desk_data').DSZ_Desk_Event;
var deskEd = require('dsz_desk_data').DSZ_Desk_Ed;

var hanlder = {
    //断线重连/创建房间信息
    on_msg_pin3_state_info: function(msg){
        deskData.initDeskInfo(msg);
    },

    //看牌消息返回
    on_msg_pin3_watch_ret: function(msg){
        cc.dd.NetWaitUtil.net_wait_end('sendWatch');
        if(msg.retCode != 0)
            return;
        playerMgr.playerPokerInfo(msg.poker);
    },

    //比牌消息返回
    on_msg_pin3_cmp_ret: function(msg){
        cc.dd.NetWaitUtil.net_wait_end('sendCmpOp');
        if(msg.retCode != 0)
            return;
        switch(msg.cmpType){
            case 1://玩家比牌下注
                deskData.playerCmpOp(msg.userId, msg.bet);
                deskData.setLastOpUser(msg.userId);
                deskData.setCurOpUser(msg.nextOpUserId);
                deskEd.notifyEvent(deskEvent.DSZ_DEDSK_COMPARE, msg.userId);
                break;
            case 2: //比牌结果
                deskData.playerCmpResult(msg.userId, msg.cmpId, msg.winner, msg.bet);
                deskData.setLastOpUser(msg.userId);
                deskData.setCurOpUser(msg.nextOpUserId);
                deskEd.notifyEvent(deskEvent.DSZ_DEDSK_COMPARE_RESULT, msg);
                break;
        }
    },

    //孤注一掷消息返回
    on_msg_pin3_try_ret: function(msg){
        cc.dd.NetWaitUtil.net_wait_end('sendAllIn');
        if(msg.retCode != 0 )
            return;
        deskData.playerGambledOp(msg.userId, msg.bet, msg.isWin);
        deskData.setLastOpUser(deskData.getCurOpUser());
        deskData.setCurOpUser(msg.nextOpUserId);
        deskEd.notifyEvent(deskEvent.DSZ_DEDSK_ALL_IN, msg);
    },

    //火拼消息返回
    on_msg_pin3_fire_ret: function(msg){
        cc.dd.NetWaitUtil.net_wait_end('sendFire');
        if(msg.retCode != 0)
            return;
        deskData.playerFireOp(msg.userId, msg.fireBet);
        deskData.setFireBet(msg.fireBet);
        deskData.setLastOpUser(deskData.getCurOpUser());
        deskData.setCurOpUser(msg.nextOpUserId);
        deskEd.notifyEvent(deskEvent.DSZ_DEDSK_FIRE, msg.userId);
    },

    //操作消息返回
    on_msg_pin3_op_ret: function(msg){
        if(msg.retCode != 0){
            switch(msg.retCode){
                case 1:
                    cc.dd.PromptBoxUtil.show('当前属于其他玩家操作时间');
                    deskEd.notifyEvent(deskEvent.DSZ_DEDSK_ERROR);
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show('当前不可操作');
                    break;
            }
            return;
        }
        var opState = 1;
        var opBet = 0;
        var betLevel = 0;
        switch(msg.opType){
            case 1:
                opBet = msg.bet;
                opState = 3;
                betLevel = msg.betLevel;
                break;
            case 2:
                opBet = msg.bet;
                opState = 4;
                betLevel = msg.betLevel;
                break;
            case 3:
                opState = 13;
                break;
        }
        deskData.playerNormalOp(msg.userId, opBet, opState);
        deskData.setLastOpUser(msg.userId);
        deskData.setCurOpUser(msg.nextOpUserId);
        if(msg.opType != 3){
            deskData.setCurBetLevel(betLevel);
            deskEd.notifyEvent(deskEvent.DSZ_DEDSK_CALL, msg.userId);
        }
        else
            deskEd.notifyEvent(deskEvent.DSZ_DEDSK_FOLD, msg.userId);
    },

    //轮数更新
    on_msg_pin3_update: function(msg){
        deskData.setCurCircle(msg.value);
        deskEd.notifyEvent(deskEvent.DSZ_DEDSK_UPDATE_CIRCLE);
    },

    //结束结算
    on_msg_pin3_result: function(msg){
        if( msg.time == 0){ //单局结算
            deskData.setPlayerPokers(msg.pokersList);
           // deskData.setServerPay(msg.severPay);
            deskEd.notifyEvent(deskEvent.DSZ_DEDSK_SHOW_ROUND_RESULE, msg.scoreResultList);
        }else{ //总结算
            deskEd.notifyEvent(deskEvent.DSZ_DEDSK_SHOW_RESULE, msg);
        }  
    },

    //再次准备开始
    on_room_prepare_ack: function(msg){ 
        var player = playerMgr.getPlayer(msg.userId);
        if (player) {
            player.setReady(true);
        }
    },

    //解散请求
    on_room_dissolve_agree_ack: function(msg){
        deskEd.notifyEvent(deskEvent.DSZ_DEDSK_DISSOVlE, msg);
    },

    //解散请求结果
    on_room_dissolve_agree_result: function(msg){
        deskEd.notifyEvent(deskEvent.DSZ_DEDSK_DISSOVLE_RESULT, msg);
    },

    //金币场玩家数据消息
    on_pin3_user_info: function(msg){
        var player = playerMgr.getPlayer(msg.userId);
        if (player) {
            player.setPlayerGameInfo(msg);
        }
    },
};
module.exports = hanlder;
