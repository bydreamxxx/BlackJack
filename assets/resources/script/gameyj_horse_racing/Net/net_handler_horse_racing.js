//create by wj 2020/12/02
var game_Data = require('horse_racing_Data').Horse_Racing_Data.Instance();
var game_Ed = require('horse_racing_Data').Horse_Racing_Ed;
var game_Event = require('horse_racing_Data').Horse_Racing_Event;

var hanlder = {
    //初始游戏信息
    on_msg_horse_info: function(msg){
        game_Data.setGameState(msg.state); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime, true); //设置剩余时间
        game_Data.setRoundId(msg.id); //设置场次
        game_Data.setAllBet(msg.allBet); //设置总下注金额
        game_Data.setBetAreaList(msg.betInfoList); //设置下注信息
        game_Data.setHorseList(msg.horseList); //设置马信息
        game_Data.setCoin(msg.coin);
        game_Data.setStartCoin(msg.coin);
        game_Data.setConfigId(msg.configId);
        game_Ed.notifyEvent(game_Event.HORSE_RACING_INIT); //游戏初始化
    },

    //场次更新
    on_msg_horse_begin: function(msg){
        game_Data.setGameState(msg.state); //设置游戏状态
        game_Data.setRoundId(msg.id); //设置场次
        game_Data.setBetAreaList(msg.betInfoList); //设置下注信息
        game_Data.setHorseList(msg.horseList); //设置马信息
        game_Data.setLeftTime(25); //设置剩余时间
        game_Ed.notifyEvent(game_Event.HORSE_RACING_UPDATE); //游戏状态数据更新
    },

    //下注信息更新
    on_msg_horse_update: function(msg){
        game_Data.setAllBet(msg.allBet); //设置总下注金额
        game_Data.updateBetArea(msg.betInfoList);//更新下注信息
        game_Ed.notifyEvent(game_Event.HORSE_RACING_UPDATE_BET_AREA); //更新下注信息
    },

    //下注消息返回
    on_msg_horse_bet_ret: function(msg){
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
        if(msg.retCode == 0){
            if(msg.opType == 1){
                game_Data.updateOwnBetArea(msg.betInfo.id, msg.betInfo.sfBet);
                game_Data.setCoin(msg.coin);
                game_Data.clearLastOwnBetList();
                game_Ed.notifyEvent(game_Event.HORSE_RACING_UPDATE_BET, msg.betInfo.id); //自己下注
            }else{
                game_Data.clearOwnBet();//清理跟人下注
                game_Data.setCoin(msg.coin);
            }
        }
    },

    //结算消息返回
    on_msg_horse_result: function(msg){
        game_Data.setResultType(msg.type);
        game_Data.setResultList(msg.winHorsesList);
        game_Data.setRunRankList(msg.hRankList);
        game_Data.setWin(msg.win);
        game_Data.setCoin(msg.coin);
        game_Data.setWinnerList(msg.rank5List);
    },
};

module.exports = hanlder;
