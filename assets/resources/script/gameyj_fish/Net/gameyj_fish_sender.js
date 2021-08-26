// create by wj 2019/09/23

module.exports = {
    betSender: function(type){//发送加减注操作类型
        var pbData = new cc.pb.fish.msg_fish_set_bet_req();
        pbData.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fish.cmd_msg_fish_set_bet_req, pbData, 'msg_fish_set_bet_req', true);
    },

    bulletBetSender: function(bulletId, dir, fishId){//发送射击鱼
        var pbData = new cc.pb.fish.msg_fish_bet_req();
        pbData.setBulletId(bulletId);
        pbData.setDir(dir);
        pbData.setType(fishId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fish.cmd_msg_fish_bet_req, pbData, 'msg_fish_bet_req', true);
    },

    fishHitSender: function(bulletId, buffId, fishes, userId){//客户端计算的击中 鱼的数据
        var pbData = new cc.pb.fish.msg_fish_hit_req();
        pbData.setBulletId(bulletId);
        pbData.setBuffId(buffId);
        pbData.setUserId(userId);
        var temp = [];
        if(fishes != null){
            for(var fish of fishes){
                var obData =  new cc.pb.fish.fish_hit_req_info();
                obData.setFishId(fish.fishId);
                obData.setPos(fish.pos);
                obData.setRelationList(fish.relationList);

                temp.push(obData);
            }
        }

        pbData.setFishsList(temp);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fish.cmd_msg_fish_hit_req, pbData, 'msg_fish_hit_req', true);
    },

    quitGame: function(){
        var pbData = new cc.pb.fish.msg_fish_room_quit_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.fish.cmd_msg_fish_room_quit_req, pbData, 'msg_fish_room_quit_req', true);

    },
}
