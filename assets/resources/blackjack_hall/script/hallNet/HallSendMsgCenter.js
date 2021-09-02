const dd= cc.dd;

var HallSendMsgCenter =  cc.Class({
    extends: cc.Component,

    statics:{
        instance:null,
        getInstance:function () {
            if(this.instance == null){
                this.instance = new HallSendMsgCenter();
            }
            return this.instance;
        },
    },

    properties: {

    },

    /**
     * 请求背包物品列表
     */
    sendBagItemList:function () {
        //废弃
        // var bagItem = new cc.pb.hall.hall_req_bag_items();
        // cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_bag_items,bagItem,
        //     '发送协议 cmd_hall_req_bag_items [背包物品列表]');
    },

    /**
     * 请求购买商品
     */
    sendBuyShop:function (id, count) {
        dd.NetWaitUtil.show('正在为您购买商品');
        var buy = new cc.pb.hall.hall_req_goods_buy();
        buy.setGoodsId(id);
        buy.setGoodsNum(count ? count : 1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_goods_buy,buy,
            '发送协议 cmd_hall_req_goods_buy [购买商品]');
    },

    /**
     * isCreateRoom : false 加入房间   true 创建房间
     * gameid        gameid
     * roomNum      :房间num
     * isClueEnter: fals 非俱乐部加入   true 俱乐部加入
     */
    getGameUrlInfo:function(isCreateRoom,gameid,roomNum, isClueEnter)
    {
        cc.log("getGameUrlInfo     isCreateRoom:"+isCreateRoom + "   gameid:"+gameid);
        if(typeof(gameid) != 'number' ){
            gameid = Number(gameid);
        }
        if( isCreateRoom)
        {
            this.sendGetGameServerInfo(gameid);
        }
        else if(roomNum) {
            cc.log("getGameUrlInfo     roomNum:"+roomNum);
            if(typeof(roomNum) != 'string' ){
                roomNum = roomNum.toString();
            }
            this.sendGetGameServerInfoByNmber(gameid,roomNum);
            cc.gateNet.Instance()._getClubUserData().setIsClubEnterMJ(isClueEnter);
        }
    },

    /**
     * 获取创建房间游戏服务器URL
     */
    sendGetGameServerInfo:function (gameid) {
        //dd.NetWaitUtil.show('正在请求数据');
        var req = new cc.pb.hall.get_play_game_server_info_req();
        req.setGameType(gameid);

        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_play_game_server_info_req,req,
            '发送协议[cmd_get_play_game_server_info_req][获取创建房间游戏服务器]');
    },

    /**
     * 获取加入房间游戏服务器URL
     */
    sendGetGameServerInfoByNmber:function (gameid ,number) {
        var req = new cc.pb.hall.get_play_game_server_info_by_roomnum_req();
        req.setRoomnum(number);
        req.setGameType(gameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_play_game_server_info_by_roomnum_req,req,
            '发送协议[cmd_get_play_game_server_info_by_roomnum_req][获取加入房间游戏服务器]');

    },

    /**
     * 发送获取玩家是否在游戏中 是否需要断线重连
     */
    requestCheckReconnect:function () {
        dd.NetWaitUtil.show('正在请求数据');
        var req = new cc.pb.hall.get_play_game_server_info_by_roomnum_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_play_game_server_info_by_roomnum_req, req,
            '发送协议[cmd_get_play_game_server_info_by_roomnum_req][请求检查是否重连]');
    },

    /**
     * 默认跑马灯信息
     */
    sendDefaultBroadcastInfo:function () {
        var bagItem = new cc.pb.hall.hall_req_config_broadcast();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_broadcast,bagItem,
            '发送协议[cmd_hall_req_config_broadcast][默认跑马灯信息]',true);
        //cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendDefaultBroadcastInfo');
    },

    /**
     * 发送获取战绩信息
     */
    sendBattleHistory: function(gameID){
        dd.NetWaitUtil.show('正在请求数据');
        var req = new cc.pb.hall.get_battle_history_req();
        req.setGameId(gameID);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_battle_history_req, req,
            '发送协议[cmd_get_battle_history_req]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendBattleHistory');
    },

    /**
     * 发送战绩每场具体信息
     */
    sendBattleRecordDetail: function(historyId){
        dd.NetWaitUtil.show('正在请求数据');
        var req = new cc.pb.hall.get_battle_record_req();
        req.setHistoryId(historyId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_battle_record_req, req,
            '发送协议[cmd_get_battle_record_req]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendBattleRecordDetail');

    },

    //////////////////////////////////////////////////////国庆活动消息发送begin//////////////////////////////////////////////

    /**
     * 发送国庆活动翻牌请求
     */
    sendNationalDayActiveDraw: function(){
        var req = new cc.pb.activity_collect.activity_collect_draw_req();
        req.setActivityId(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.activity_collect.cmd_activity_collect_draw_req, req,
            '发送协议[activity_collect_draw_req]', true);

    },

    /**
     * 发送国庆开宝箱请求
     */
    sendNationalDayActiveOpenBox: function(pos){
        var req = new cc.pb.activity_collect.activity_collect_open_box_req();
        req.setActivityId(1);
        req.setPos(pos);
        cc.gateNet.Instance().sendMsg(cc.netCmd.activity_collect.cmd_activity_collect_open_box_req, req,
            '发送协议[activity_collect_open_box_req]', true);

    },

//////////////////////////////////////////////////////国庆活动消息发送end//////////////////////////////////////////////


});

module.exports = HallSendMsgCenter;
