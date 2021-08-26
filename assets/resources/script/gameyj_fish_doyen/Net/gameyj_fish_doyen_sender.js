// create by wj 2019/09/23

module.exports = {
    betSender: function (type, itemId) {//发送加减注操作类型
        var pbData = new cc.pb.qka_fish_master.msg_qka_fish_master_set_bet_req();
        // pbData.setType(type);
        pbData.setBetDataid(itemId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.qka_fish_master.cmd_msg_qka_fish_master_set_bet_req, pbData, 'msg_qka_fish_master_set_bet_req', true);
    },

    bulletBetSender: function (bulletId, dir, fishId, isSub) {//发送射击鱼
        var pbData = new cc.pb.qka_fish_master.msg_qka_fish_master_bet_req();
        pbData.setBulletId(bulletId);
        pbData.setDir(dir);
        pbData.setType(fishId);
        pbData.setIsSubBullet(isSub || false);
        cc.gateNet.Instance().sendMsg(cc.netCmd.qka_fish_master.cmd_msg_qka_fish_master_bet_req, pbData, 'msg_qka_fish_master_bet_req', true);
    },

    fishHitSender: function (bulletId, buffId, fishes, userId) {//客户端计算的击中 鱼的数据
        var pbData = new cc.pb.qka_fish_master.msg_qka_fish_master_hit_req();
        pbData.setBulletId(bulletId);
        pbData.setBuffId(buffId);
        pbData.setUserId(userId);
        var temp = [];
        if (fishes != null) {
            for (var fish of fishes) {
                var obData = new cc.pb.qka_fish_master.qka_fish_master_hit_req_info();
                obData.setFishId(fish.fishId);
                obData.setPos(fish.pos);
                obData.setRelationList(fish.relationList);

                temp.push(obData);
            }
        }

        pbData.setFishsList(temp);
        cc.gateNet.Instance().sendMsg(cc.netCmd.qka_fish_master.cmd_msg_qka_fish_master_hit_req, pbData, 'msg_qka_fish_master_hit_req', true);
    },

    //1:冰冻, 2:瞄准镜
    userItem: function (type) {
        var pbData = new cc.pb.qka_fish_master.msg_qka_fish_use_item_req();
        pbData.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.qka_fish_master.cmd_msg_qka_fish_use_item_req, pbData, 'msg_qka_fish_use_item_req', true);
    },

    requestBuyItem: function (id) {
        var pbData = new cc.pb.qka_fish_master.msg_qka_buy_item_req();
        pbData.setItemDataId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.qka_fish_master.cmd_msg_qka_buy_item_req, pbData, 'msg_qka_buy_item_req', true);

    },


    quitGame: function () {
        var pbData = new cc.pb.qka_fish_master.msg_qka_fish_master_room_quit_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.qka_fish_master.cmd_msg_qka_fish_master_room_quit_req, pbData, 'msg_qka_fish_master_room_quit_req', true);

    },
    fishGift: function (data) {
        var pbData = new cc.pb.hall.hall_req_fish_gift();
        pbData.setId(data.id);
        pbData.setRoomid(data.roomid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_fish_gift, pbData, 'cmd_hall_req_fish_gift', true);
    },
    fishGiftexchange: function (data) {
        var pbData = new cc.pb.hall.hall_req_fish_gift_exchange();
        pbData.setId(data.id);
        pbData.setType(data.type);
        pbData.setZfbAccount(data.zfbAccount);
        pbData.setZfbUsername(data.zfbUsername);
        pbData.setJdkAddr(data.jdkAddr);
        pbData.setJdkPhone(data.jdkPhone);
        pbData.setJdkUsername(data.jdkUsername);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_fish_gift_exchange, pbData, 'cmd_hall_req_fish_gift_exchange', true);
    },
    exchangeRecord: function (id) {
        var pbData = new cc.pb.hall.hall_req_log_gift_exchange();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_log_gift_exchange, pbData, 'cmd_hall_req_log_gift_exchange', true);
    },
}
