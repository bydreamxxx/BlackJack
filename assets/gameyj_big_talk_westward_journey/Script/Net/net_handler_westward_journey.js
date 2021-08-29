// create by wj 2019/12/03
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;
var hallData = require('hall_common_data').HallCommonData;
var gameIconConfig = require('westward_Journey_Config').IconConfg;

var hanlder = {
    on_msg_xiyou_room_info: function(msg){//进入游戏初始化信息
        game_Data.setGameState(msg.state); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime); //设置剩余时间
        game_Data.setBetAreaList(msg.betList); //下注去筹码
        game_Data.setBillWayList(msg.recordsList); //路单
        game_Data.setPlayerLsit(msg.rank8List); //玩家前8
        game_Data.setCurCoin(hallData.getInstance().coin); //玩家身上金币
        game_Data.setRoomConfigId(msg.configId); //房间配置id
        game_Ed.notifyEvent(game_Event.Westward_Journey_INIT);
        game_Data.setStartCoin(hallData.getInstance().coin); //初始金币
    },

    on_msg_xiyou_bet_ret: function(msg){//下注消息返回
        if(msg.retCode != 0){
            var str = '';
            switch(msg.retCode){
                case 1:
                    str = '当前不能下注';
                    break;
                case 2:
                    str = '系统错误';
                    break;
                case 3:
                    str = '玩家不存在';
                    break;
                case 4:
                    str = '金币不足，不能下注';
                    break;
                case 5:
                    str = '押注已达到最大值';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);

            return;
        }
        for(var betInfo of msg.betList){
            game_Data.addBetAreaByIndex(betInfo.betId, betInfo.betSelf);
        }
        game_Ed.notifyEvent(game_Event.Westward_Journey_Bet, msg);
    },

    on_msg_xiyou_bet_update: function(msg){//下注更新
        game_Data.updateBetArea(msg.betList); //下注区筹码
    },

    on_msg_xiyou_state_update: function(msg){//游戏状态更新
        game_Data.setGameState(msg.state); //设置游戏状态
        game_Data.setLeftTime(msg.lastTime); //设置剩余时间
        game_Data.updatePlayer(msg.rank8List); //玩家前8
        game_Ed.notifyEvent(game_Event.Westward_Journey_UPDATE_GAME);
    },

    on_msg_xiyou_result: function(msg){//结算
        if(msg.type == 0){
            msg.indexsList.forEach(function(data) {//更新路单
                var record = new cc.pb.xiyou.xiyou_record;
                record.type = msg.type;
                var index = gameIconConfig.getItem(function(item){
                    for(var ob of item.indexList){
                        if(ob == data)
                            return item;
                    }
                });
                var list = [];
                list.push(index.id);
                record.setIconsList(list);
                game_Data.updateBillWayList(msg.type, record)
            });
        }else{//开月光宝盒
            var record = new cc.pb.xiyou.xiyou_record;
            record.type = msg.type;
            var iconsList = [];
            iconsList.push(12);
            record.setIconsList(iconsList);
            game_Data.updateBillWayList(msg.type, record)
        }
        game_Data.setResultType(msg.type);
        game_Data.setResultList(msg.indexsList);
        game_Data.setWinAreaList(msg.betList);
        game_Data.setWinnerList(msg.rank5List);
        game_Data.setPlayerLsit(msg.rank8List); //玩家前8
        game_Data.setCurCoin(msg.coin);
        game_Data.setWinCoin(msg.win);
        game_Data.setWinType(msg.winType);
        game_Data.setJuBao(msg.jubaoCoin);

    },
};

module.exports = hanlder;
