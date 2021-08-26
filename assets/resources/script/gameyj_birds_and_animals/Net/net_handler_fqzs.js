// create by 2019/07/30
var game_Data = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();
var game_Ed = require('birds_and_animals_data').Birds_And_Animals_Ed;
var game_Event = require('birds_and_animals_data').Birds_And_Animals_Event;

var hanlder = {
    //初始化信息
    on_msg_fqzs_info: function(msg){
        game_Data.setGameState(msg.fqzsState); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime); //设置剩余时间
        game_Data.setBetAreaList(msg.betAreaList); //下注去筹码
        game_Data.setBillWayList(msg.wayBillList); //路单
        game_Data.setPlayerLsit(msg.rank8List); //玩家前8
        game_Data.setCurCoin(msg.curCoin); //玩家身上金币
        game_Data.setRoomConfigId(msg.roomConfigId); //房间配置id
        game_Ed.notifyEvent(game_Event.BAA_INIT);
        game_Data.setStartCoin(msg.curCoin); //初始金币
    },

    //下注返回
    on_msg_fqzs_bet_ret: function(msg){
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
            }
            cc.dd.PromptBoxUtil.show(str);

            return;
        }
        game_Data.addBetAreaByIndex(msg.bet.id, msg.bet.value);
        game_Ed.notifyEvent(game_Event.BAA_BET, msg);

        //game_Data.updatePlayerCoin(msg.userId, msg.bet);
    },

    //下注区间更新
    on_msg_fqzs_bet_area_update: function(msg){
        // for(var i = 0; i < msg.betAreaList.length; i++){
        //     msg.betAreaList[i].value = msg.betAreaList[i].value / 10000;
        // }
        game_Data.updateBetArea(msg.betAreaList); //下注区筹码
    },

    //游戏状态更新
    on_msg_fqzs_state_update: function(msg){
        game_Data.setGameState(msg.state); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime); //设置剩余时间
        game_Data.updatePlayer(msg.rank8List); //玩家前8
        game_Ed.notifyEvent(game_Event.BAA_UPDATE_GAME);
    },

    //结果消息
    on_msg_fqzs_result: function(msg){
        msg.resultList.forEach(function(data) {//更新路单
            game_Data.updateBillWayList(msg.type, data)
        });
        game_Data.setResultType(msg.type);
        
        game_Data.setResultList(msg.resultList);
        game_Data.setWinAreaList(msg.areaList);
        game_Data.setWinnerList(msg.rank5List);
        game_Data.setPlayerLsit(msg.rank8List); //玩家前8
        game_Data.setCurCoin(msg.coin);
        game_Data.setWinCoin(msg.win);
        game_Ed.notifyEvent(game_Event.BAA_STOP_BET);
    },
};

module.exports = hanlder;
