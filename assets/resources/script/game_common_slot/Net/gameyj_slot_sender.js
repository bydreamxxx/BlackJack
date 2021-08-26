const dd = cc.dd;

var slotSender = cc.Class({
    extends: cc.Component,

    statics:{
        instance:null,
        getInstance:function () {
            if(this.instance == null){
                this.instance = new slotSender();
            }
            return this.instance;
        },
    },

    properties: {

    },
    //进入老虎机游戏房间选择协议
    enterSlotRoom: function(game_type, room_type){
        var req = new cc.pb.slot.msg_slot_enter_2s();
        req.setGameType(game_type);
        req.setRoomType(room_type);

        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_enter_2s,req,
            '发送协议[cmd_msg_slot_enter_2s][加入老虎机房间]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_enter_2s');
    },

    //老虎机下注
    betSlot: function(line_num, line_bet){
        var req = new cc.pb.slot.msg_slot_bet_2s();
        req.setLineNum(line_num);
        req.setLineBet(line_bet);

        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_bet_2s,req,
            '发送协议[cmd_msg_slot_bet_2s][老虎机下注]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_bet_2s');
    },

    //请求退出老虎机
    quiSlot: function(game_type, room_type){
        var req = new cc.pb.slot.msg_slot_quit_2s();
        req.setGameType(game_type);
        req.setRoomType(room_type);

        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_quit_2s,req,
            '发送协议[cmd_msg_slot_quit_2s][加入老虎机房间]', true);

        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_quit_2s');
    },

    //检测是否有小游戏
    checkSmallGame: function(){
        var req = new cc.pb.slot.msg_slot_reconnect_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_reconnect_2s,req,
            '发送协议[cmd_msg_slot_reconnect_2s][检测小游戏]', true);
    },

    //水浒老虎机得分操作
    getScore: function(){
        var req = new cc.pb.slot.msg_slot_get_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_get_2s,req,
            '发送协议[cmd_msg_slot_get_2s][得分]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_get_2s');
    },

    //水浒小游戏开始
    startTinyGame: function(){
        var req = new cc.pb.slot.msg_slot_mini_game_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_mini_game_2s,req,
            '发送协议[cmd_msg_slot_mini_game_2s][玛丽机]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_mini_game_2s');

    },

    //比倍小游戏下注
    startCompareGame: function(ntype){
        var req = new cc.pb.slot.msg_slot_compare_2s();
        req.setChoice(ntype);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_compare_2s,req,
            '发送协议[cmd_msg_slot_compare_2s][比倍]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_compare_2s');
    },

    //比倍小游戏下注类型
    compareType: function(ntype){
        var req = new cc.pb.slot.msg_slot_choice_comapre_2s();
        req.setChoice(ntype);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_choice_comapre_2s,req,
            '发送协议[cmd_msg_slot_choice_comapre_2s][比倍类型]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_choice_comapre_2s');
    },

    //拉取数据信息
    getAllWinOrOnlineList: function(gameType, roomType, type, index){
        var req = new cc.pb.slot.msg_slot_op_2s();
        req.setGameType(gameType);
        req.setRoomType(roomType);
        req.setOpType(type);
        req.setIndex(index);

        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_op_2s,req,
            '发送协议[cmd_msg_slot_op_2s][拉取数据信息]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_slot_op_2s');
    },

    ////////////////////////////////////////////财神老虎机begin/////////////////////////////////////////////
    openBox: function(boxId){
        var req = new cc.pb.slot.msg_slot_mammon_open_box_2s();
        req.setSeatId(boxId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_mammon_open_box_2s,req,
            '发送协议[cmd_msg_slot_mammon_open_box_2s][开宝箱]', true);
    },

    reconnectMammonslotTinyGame: function(){
        var req = new cc.pb.slot.msg_slot_mammon_reconnet_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_mammon_reconnet_2s,req,
            '发送协议[cmd_msg_slot_mammon_reconnet_2s][财神小游戏重连]', true);

    }
    ////////////////////////////////////////////财神老虎机end/////////////////////////////////////////////

});

module.exports = {
    SlotSender : slotSender
};