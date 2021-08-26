// create by wj 2019/09/23
var gFishManager = require('FishDoyenManager').FishManager.Instance();
var playerManager = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();
const HallCommonData = require('hall_common_data').HallCommonData;
const Hall = require('jlmj_halldata');
var itemCfg = require('item')
var handler = {
    on_msg_qka_fish_master_room_info: function (msg) {//玩家进入
        //会发多次
        gFishManager.setRoomType(msg.roomType);
        gFishManager.setRoomCfg(); //设置房间配置


        //为了处理是否是断线重连
        // for(var i = 0; i < msg.usersList.length; i++){ //设置玩家游戏数据
        //     var player = msg.usersList[i];
        //     if(player.userId == cc.dd.user.id){//是玩家自己进入房间消息，而不是其他玩家
        //         if(gFishManager.getIsInit())//是切后台前台的断线重连
        //         {
        //             gFishManager.reconnectClear();
        //         }
        //     }
        // }


        // for(var player of msg.usersList){ //首先设置自己位置判定是否需要翻转
        //     if(player.userId == cc.dd.user.id){//玩家自己
        //         // if(((player.seatId + 1) == 2) || ((player.seatId + 1) == 3)) //需要翻转
        //         //     gFishManager.m_bFilp = true;
        //         gFishManager.m_nSite = gFishManager.toClientSite(player.seatId);
        //     }
        // }
        var containSelf = false;
        for (var i = 0; i < msg.usersList.length; i++) { //设置玩家游戏数据
            var player = msg.usersList[i];
            player.coin = player.coin * gFishManager.getRoomRate();
            gFishManager.buildPlayerData(player);
            if (player.userId == cc.dd.user.id) {//玩家自己
                let CommonData = HallCommonData.getInstance()
                // let maxSeat = HallCommonData.fishActivityState == 1 ? 2 : 3
                if ((player.seatId >= 1) && (player.seatId <= 2))//需要翻转
                    gFishManager.m_bFilp = true;
                gFishManager.m_nSite = gFishManager.toClientSite(player.seatId + 1);
                containSelf = true;

                CommonData.fishGiftLevel = player.fishGiftLevel
                Hall.HallED.notifyEvent(Hall.HallEvent.FISH_GIFT, { type: 0 });
            }
            if (containSelf && i == (msg.usersList.length - 1)) {
                gFishManager.m_mainUI.onEnter();
                gFishManager.on_reconnect_syn_array(msg.arrayFishListList);
                gFishManager.on_reconnect_syn_fish(msg.commonFishListList);
            }
            // if(player.effectType == 1)
            // {

            // }
        }
        // gFishManager.on_reconnect_syn_fish(msg.commonFishListList);

    },

    on_msg_qka_fish_master_set_bet_ret: function (msg) {//加减注消息返回
        if (msg.retCode != 0) {
            return;
        }

        var player = playerManager.findPlayerByUserId(msg.userId); //查到玩家
        if (player) {
            var playerGameData = player.getPlayerGameInfo();
            if (playerGameData) {
                var itm = itemCfg.getItem(function (element) {
                    if (element.key == msg.betDataid)
                        return true;
                }.bind(this));
                playerGameData.bet = itm.p1;
                playerGameData.betDataid = msg.betDataid;
            }
            if (cc.dd.user.id == msg.userId) {
                gFishManager.m_currentGunId = msg.betDataid;
            }
        }
        gFishManager.getMainUI().updateOnePlayerBetTimes(msg.userId, msg.betDataid); //更新界面倍率显示
    },

    on_msg_qka_fish_master_bet_ret: function (msg) {//射击鱼，消息返回
        if (msg.retCode != 0) {
            var str = '';
            switch (msg.retCode) {
                case 1:
                    str = '鱼不存在，金币已退回';
                    break;
                case 2:
                    str = '子弹太多，金币已退回';
                    break;
                case 3:
                    str = '子弹无效，金币已退回';
                    break;
                case 4:
                    str = '金币不足';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
            return;
        }
        gFishManager.on_fish_bet(msg); //创建子弹，射击鱼
    },

    on_msg_qka_fish_master_hit_ret: function (msg) {//击中鱼，消息返回
        gFishManager.on_msg_fish_hit_2c(msg);
    },

    on_msg_qka_fish_master_appear: function (msg) {//生成鱼
        gFishManager.on_msg_fish_appear(msg);//生成鱼表现
    },

    on_msg_qka_fish_master_clean: function () {//鱼阵出现，清理鱼
        gFishManager.on_msg_fish_clean();
    },

    on_msg_qka_fish_master_array: function (msg) {//鱼阵出现
        gFishManager.on_msg_fish_arry(msg);
    },

    on_msg_qka_fish_master_coin_return: function (msg) {//金币返还
        gFishManager.on_msg_fish_gold_return_2c(msg);
    },

    on_msg_qka_fish_use_item_ret: function (msg) {//使用道具
        gFishManager.on_msg_qka_fish_use_item_ret(msg);
    },

    on_msg_qka_fish_effect: function (msg) {//别人使用道具
        gFishManager.on_msg_qka_fish_effect(msg);
    },

    on_msg_qka_buy_item_ret: function (msg) {//购买道具
        var str = '';
        switch (msg.retCode) {
            case 1:
                str = '购买成功';
                break;
            case 2:
                str = '商品找不到';
                break;
            case 3:
                str = '请使用人民币购买';
                break;
            case 4:
                str = '消耗道具不足';
                break;
            case 5:
                str = '系统错误';
                break;
            case 6:
                str = '消耗物品使用失败';
                break;
            case 7:
                str = '系统错误';
                break;
            case 8:
                str = '物品发放失败';
                break;
        }
        cc.dd.PromptBoxUtil.show(str);
        return;
    },
    on_msg_qka_sync_coin: function (msg) {//使用道具
        gFishManager.on_msg_qka_sync_coin(msg);
    },
};

module.exports = handler;
