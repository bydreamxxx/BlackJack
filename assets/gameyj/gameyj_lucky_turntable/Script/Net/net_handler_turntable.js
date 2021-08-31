// create by 2020/06/03
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
var game_Ed = require('lucky_turntable_data').Lucky_Turntable_Ed;
var game_Event = require('lucky_turntable_data').Lucky_Turntable_Event;

var hanlder = {
    //初始化信息
    on_msg_turn_info: function(msg){
        game_Data.setGameState(msg.turnState); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime); //设置剩余时间
        game_Data.setBetAreaList(msg.betAreaList); //下注去筹码
        game_Data.setBillWayList(msg.wayBillList); //路单
        game_Data.setPlayerLsit(msg.rank5List); //玩家前8
        game_Data.setCurCoin(msg.curCoin); //玩家身上金币
        game_Data.setRoomConfigId(msg.roomConfigId); //房间配置id
        game_Ed.notifyEvent(game_Event.LUCKY_TURNTABLE_INIT);
        game_Data.setStartCoin(msg.curCoin); //初始金币
        game_Data.setIssue(msg.gameNum); 
    },

    //下注返回
    on_msg_turn_bet_ret: function(msg){
        if(msg.retCode != 0){
            var str = '';
            switch(msg.retCode){
                case 1:
                    str = '下注错误';
                    break;
                case 2:
                    str = '不在游戏房间内，不能进行操作';
                    break;
                case 3:
                    str = '金币不足，下注失败';
                    break;
                case 4:
                    str = '下注超过该房间最大值';
                    break;
                case 5:
                    str = '下注截止，请勿下注';
                    break;
                case 6:
                    str = '当前下注已经达到该区域可下注最大值';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);

            return;
        }
        if(msg.bet.id != 100){
            game_Data.addBetAreaByIndex(msg.bet.id, msg.bet.value);
            game_Ed.notifyEvent(game_Event.LUCKY_TURNTABLE_BET, msg);
        }else{
            game_Data.clearOwnBetArea();
            var newCoin = game_Data.getCurCoin();
            newCoin += msg.bet.selfValue;
            game_Data.setCurCoin(newCoin);
            game_Ed.notifyEvent(game_Event.LUCKY_TURNTABLE_CANCEL_BET);
            cc.dd.PromptBoxUtil.show('撤销投注成功，下注金币已经返还');
        }
    },

    //下注区间更新
    on_msg_turn_bet_area_update: function(msg){
        game_Data.updateBetArea(msg.betAreaList); //下注区筹码
    },

    //游戏状态更新
    on_msg_turn_state_update: function(msg){
        game_Data.setGameState(msg.state); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime); //设置剩余时间
       // game_Data.updatePlayer(msg.rank8List); //玩家前8
        game_Ed.notifyEvent(game_Event.LUCKY_TURNTABLE_UPDATE_GAME);
    },

    //结果消息
    on_msg_turn_result: function(msg){
        msg.resultList.forEach(function(data) {//更新路单
            game_Data.updateBillWayList(msg.type, data)
        });
        game_Data.setResultType(msg.type);
        
        game_Data.setResultList(msg.resultList);
        game_Data.setWinAreaList(msg.areaList);
        game_Data.setWinnerList(msg.rank5List);
        game_Data.setPlayerLsit(msg.rank5List); //玩家前8
        game_Data.setCurCoin(msg.coin);
        game_Data.setWinCoin(msg.win);
        game_Ed.notifyEvent(game_Event.LUCKY_TURNTABLE_STOP_BET);
    },

    //往期记录消息返回
    on_msg_turn_self_record_ack: function(msg){
        if(msg.retCode == 0){
            game_Data.setRecordGameData(msg.recordsList);
        }
    },
};

module.exports = hanlder;
