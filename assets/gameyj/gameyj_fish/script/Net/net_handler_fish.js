// create by wj 2019/09/23
var gFishManager = require('FishManager').FishManager.Instance();
var playerManager = require('FishPlayerManager').CFishPlayerManager.Instance();

var handler ={
    on_msg_fish_room_info: function(msg){//玩家进入
        gFishManager.setRoomCfg(); //设置房间配置

        for(var player of msg.usersList){ //首先设置自己位置判定是否需要翻转
            if(player.userId == cc.dd.user.id){//玩家自己
                if(((player.seatId + 1) == 2) || ((player.seatId + 1) == 3)) //需要翻转
                    gFishManager.m_bFilp = true;
                gFishManager.m_nSite = gFishManager.toClientSite(player.seatId);
            }
        }

        for(var i = 0; i < msg.usersList.length; i++){ //设置玩家游戏数据
            var player = msg.usersList[i];
            gFishManager.buildPlayerData(player);
            if (i == msg.usersList.length - 1) {
                gFishManager.m_mainUI.onEnter();
            }
        }
    },

    on_msg_fish_set_bet_ret: function(msg){//加减注消息返回
        if(msg.retCode != 0)
            return;

        var player = playerManager.findPlayerByUserId(msg.userId); //查到玩家
        if(player){
            var playerGameData = player.getPlayerGameInfo();
            if(playerGameData)
                playerGameData.bet = msg.bet;
        }
        gFishManager.getMainUI().updateOnePlayerBetTimes(msg.userId, msg.bet); //更新界面倍率显示
    },

    on_msg_fish_bet_ret: function(msg){//射击鱼，消息返回
        if(msg.retCode !=0 )
            return;
        gFishManager.on_fish_bet(msg); //创建子弹，射击鱼
    },

    on_msg_fish_hit_ret: function(msg){//击中鱼，消息返回
        gFishManager.on_msg_fish_hit_2c(msg);
    },

    on_msg_fish_appear: function(msg){//生成鱼
       gFishManager.on_msg_fish_appear(msg);//生成鱼表现
    },

    on_msg_fish_clean: function(){//鱼阵出现，清理鱼
        gFishManager.on_msg_fish_clean();
    },

    on_msg_fish_array: function(msg){//鱼阵出现
        gFishManager.on_msg_fish_arry(msg);
    },

    on_msg_fish_coin_return: function(msg){//金币返还
        gFishManager.on_msg_fish_gold_return_2c(msg);
    },
};

module.exports = handler;
