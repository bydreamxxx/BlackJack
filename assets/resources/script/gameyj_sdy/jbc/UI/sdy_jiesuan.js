var jlmj_audio_mgr = require('jlmj_audio_mgr');
var RoomData = require('sdy_room_data').RoomData;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;
var type_des_arr = [
    "叫牌",
    "光牌",
    "上车",
    "破牌",
    "扣底",
    "连扣带破",
    "王扣"
];

cc.Class({
    extends: cc.Component,

    properties: {
        txt_type_arr: [cc.RichText],
        pre_shuying_arr: [require('sdy_shuying_ui')],
        node_info: cc.Node,
    },

    onLoad: function () {

    },

    setInfo: function (msg) {
        this.node_info.active = true;
        for(var i=0; i<this.txt_type_arr.length; ++i){
            if(i<msg.winInfoList.length){
                this.txt_type_arr[i].node.active = true;
                this.txt_type_arr[i].string = "<color=#ffffff>"+type_des_arr[msg.winInfoList[i].type]+'</c>'+"<color=#EF4942>"+'x'+msg.winInfoList[i].value+'</c>';
                // this.txt_value_arr[i].string = 'x'+msg.winInfoList[i].value;
            }else{
                this.txt_type_arr[i].node.active = false;
            }
        }
        msg.resultInfoList.forEach(function (info) {
            var player = PlayerMgr.Instance().getPlayer(info.userId);
            if(player){
                this.pre_shuying_arr[player.view_idx].setNum(info.score);
            }else{
                cc.error('结算找不到玩家数据 id=',info.userId);
            }
        }.bind(this));
    },

    onClickQuit: function () {
        jlmj_audio_mgr.Instance().com_btn_click();

        // 取消匹配状态
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameType = RoomData.Instance().game_type;
        var roomId = RoomData.Instance().room_id;
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( gameType );
        gameInfoPB.setRoomId( roomId );

        msg.setGameInfo( gameInfoPB );

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req,msg,"msg_leave_game_req", true);

        cc.dd.UIMgr.closeUI(this.node);
    },

    onClickChange: function () {
        jlmj_audio_mgr.Instance().com_btn_click();
        var msg = new cc.pb.room_mgr.msg_change_room_req();
        var gameType = RoomData.Instance().game_type;
        var roomId = RoomData.Instance().room_lv;
        msg.setGameType(gameType);
        msg.setRoomCoinId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req,msg,"msg_change_room_req", true);
    },

    onClickContinue: function () {
        jlmj_audio_mgr.Instance().com_btn_click();
        var msg = new cc.pb.room_mgr.msg_prepare_game_req();
        var game = new cc.pb.room_mgr.common_game_header();
        var gameType = RoomData.Instance().game_type;
        var roomId = RoomData.Instance().room_lv;
        game.setGameType(gameType);
        game.setRoomId(roomId);
        msg.setGameInfo(game);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req,msg,"msg_prepare_game_req", true);
    },

    closeInfo: function () {
        this.node_info.active = false;
        // var jiesuan_mask = cc.find('Canvas/jiesuan_mask');
        // if(jiesuan_mask){
        //     jiesuan_mask.active = false;
        // }
    },

});
