var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

module.exports = {
    //创建房间的消息
    sendCreateRoom: function (data, isProxy) {
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DSZ_FRIEND, cc.dd.clientAction.CREARTE);

        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var pbRule = new cc.pb.room_mgr.pin3_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();
        pbCommon.setGameType(35);
        if (isProxy) {
            pbCommon.setClubCreateType(2);
        }
        //如果是俱乐部创建房间
        if (club_Mgr.getClubOpenCreateUITag()) {
            pbCommon.setClubId(club_Mgr.getSelectClubId());
            pbCommon.setClubCreateType(club_Mgr.getClubCreateRoomType());
        }
        pbRule.setRoleNum(data.rs);//人数
        pbRule.setBoardsCout(data.js);//局数
        pbRule.setCircleNum(data.ls);//轮数
        pbRule.setPlayRule(data.wf); //玩法
        pbRule.setLimitRule(data.gz); //规则
        pbRule.setLimitWatch(data.watch);
        pbRule.setLimitCmp(data.cmp);
        pbRule.setLimitScore(data.sx); //上限
        pbRule.setLimitTalk(!data.yy); //语音
        pbRule.setIsGps(data.gps);
        pbRule.setIsGiveup(data.qp);//超时弃牌
        pbRule.setIsWatchall(data.dp); //亮底牌

        pbData.setGameInfo(pbCommon);
        rule.setPin3Rule(pbRule);
        pbData.setRule(rule);
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
            }
        }
        if(!cc.dd.Utils.checkGPS(pbData)){
            cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
            }, null);
            return;
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, pbData, 'msg_create_game_req', true);
    },

    ///常规操作消息 加注（封顶）/跟注/弃牌
    sendNormalOp: function (bet, userId, type) {
        var pbData = new cc.pb.pin3.msg_pin3_op_req();
        pbData.setOpType(type);
        pbData.setUserId(userId);
        pbData.setValue(bet)
        cc.gateNet.Instance().sendMsg(cc.netCmd.pin3.cmd_msg_pin3_op_req, pbData, 'msg_pin3_op_req', true);
    },

    //比牌操作
    sendCmpOp: function (type, userId, cmpId) {
        var pbData = new cc.pb.pin3.msg_pin3_cmp_req();
        pbData.setCmpType(type);
        pbData.setUserId(userId);
        pbData.setCmpId(cmpId)
        cc.gateNet.Instance().sendMsg(cc.netCmd.pin3.cmd_msg_pin3_cmp_req, pbData, 'msg_pin3_cmp_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendCmpOp');
    },

    //火拼操作
    sendFire: function (userId) {
        var pbData = new cc.pb.pin3.msg_pin3_fire_req();
        pbData.setUserId(userId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.pin3.cmd_msg_pin3_fire_req, pbData, 'msg_pin3_fire_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendFire');
    },

    //孤注一掷
    sendAllIn: function () {
        var pbData = new cc.pb.pin3.msg_pin3_try_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.pin3.cmd_msg_pin3_try_req, pbData, 'msg_pin3_try_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendAllIn');
    },

    //看牌操作
    sendWatch: function (userId) {
        var pbData = new cc.pb.pin3.msg_pin3_watch_req();
        pbData.setUserId(userId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.pin3.cmd_msg_pin3_watch_req, pbData, 'msg_pin3_watch_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendWatch');

    },


    //解散消息发送
    dissolve: function (isAgree) {
        const req = new cc.pb.room_mgr.room_dissolve_agree_req();
        req.setIsAgree(isAgree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, req,
            'room_dissolve_agree_req', 'no');
    },

    /**
     * 发送换桌协议
     */
    sendReplaceDesktop: function (gameId, roomId) {
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(gameId);
        pbData.setRoomCoinId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },
};
