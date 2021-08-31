//create by wj 2019/02/13
var PKMgr = require('pk_data_mgr').PK_Data_Mgr.Instance();
var PkEvent = require('pk_data_mgr').PK_MgrEvent;
var PkEd = require('pk_data_mgr').PK_MgrED;

var handler = {
    //游戏数据
    on_msg_pk_info: function(msg){
        PKMgr.setConfigId(msg.betId);
        PKMgr.setDeskData(msg.pkState);
        PKMgr.setLeftTime(msg.nextTime, msg.startTime);
        PKMgr.setReconnectTag(msg.isReconnect);

        PKMgr.setWaybillData(msg.way.iconsList);
        PKMgr.setRoundInfo(msg.way.juNumList);
        PKMgr.updateTotalBet(msg.allBet.allBet);
        PKMgr.setBetInfo(msg.allBet.betInfosList);
        PKMgr.setResultRankData(msg.ranksList);

        PKMgr.setOpenPokerData(msg.pokerList);
        if(msg.pokerList.length == 2)
            PKMgr.setReelType(13);
        else
            PKMgr.setReelType(msg.reelType);

        PKMgr.setSelfBetData(msg.selfInfo.betInfosList);
        PKMgr.setSelfWinNum(msg.selfInfo.win);
        PKMgr.updatePlayerCoin(msg.selfInfo.coin);
        PKMgr.setPlayerStartCoin(msg.selfInfo.coin);
        PKMgr.setOpenPokerPlayerInfo(msg.openUserId, msg.openName, 0);

        PkEd.notifyEvent(PkEvent.PK_INIT_UI_DATA);
    },

    // //路单
    // on_pk_waybill: function(msg){

    // },

    //全场压注数据
    on_pk_all_bet: function(msg){
        PKMgr.updateTotalBet(msg.allBet);
        PKMgr.setBetInfo(msg.betInfosList);
        PkEd.notifyEvent(PkEvent.PK_UPDATE_BET_INFO);
    },

    //个人压注数据
    on_pk_self_info: function(msg){
        PKMgr.getSelfBetData(msg.selfInfo.betInfosList);
        PKMgr.setSelfWinNum(msg.selfInfo.win);
        PKMgr.updatePlayerCoin(msg.selfInfo.coin);
        PkEd.notifyEvent(PkEvent.PK_UPDATE_SELF_BET_INFO);

    },

    //压注/撤销数据返回
    on_msg_pk_bet_ret: function(msg){
        if(msg.retCode == 0){
            PKMgr.updateTotalBet(msg.allBet.allBet);
            PKMgr.setBetInfo(msg.allBet.betInfosList);

            PKMgr.setSelfBetData(msg.betInfosList);
            if(msg.opType == 1)
                PkEd.notifyEvent(PkEvent.PK_BET);
            else{
                var newCoin = PKMgr.getPlayerCoin() + msg.value;
                PKMgr.updatePlayerCoin(newCoin);
                PkEd.notifyEvent(PkEvent.PK_CANCEL_BET);
                cc.dd.PromptBoxUtil.show('撤销投注成功，下注金币已经返还');
            }
        }else{
            var str = '';
            switch(msg.retCode){
                case 1:
                    str = '下注已截止，请勿操作';
                    break;
                case 2:
                    str = '金币不足，不能下注';
                    break;
                case 3:
                    str = '不能撤销当前下注';
                    break;
                case 4:
                    str = '非法下注';
                    break;
                case 5:
                    str = '当前下注已达最高下注额';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
        }
    },

    //当前局的消息返回
    on_msg_pk_result: function(msg){

        PKMgr.setOpenPokerData(msg.pokersList);
        PKMgr.setReelType(msg.reelType);
        PKMgr.setOpenPokerPlayerInfo(msg.openUserId, msg.name, msg.openUserType);
        PKMgr.setResultRankData(msg.ranksList);
        PKMgr.setSelfBetData(msg.self.betInfosList);
        PKMgr.setSelfWinNum(msg.self.win);
        PKMgr.updatePlayerCoin(msg.self.coin);
        PKMgr.setBetInfo(msg.betInfosList);

        // if(msg.isReset)
        //     PKMgr.setWaybillData(msg.way.iconsList);
        // else
        PKMgr.updateWaybillData(msg.pokersList, msg.reelType); 
        PKMgr.setRoundInfo(msg.way.juNumList);
        PKMgr.setLeftTime(msg.nextTime, msg.startTime);
        PkEd.notifyEvent(PkEvent.PK_RESULT_GET);
    },

    //游戏状态
    on_msg_pk_state: function(msg){
        PKMgr.setDeskData(msg.state);
        PKMgr.setLeftTime(msg.time, msg.startTime);
        PkEd.notifyEvent(PkEvent.PK_UPDATE_STATE);
    },

    //开牌消息广播
    on_msg_pk_open_cards_ret: function(msg){
        PkEd.notifyEvent(PkEvent.PK_OPEN_POKER);
    },
};
module.exports = handler;

