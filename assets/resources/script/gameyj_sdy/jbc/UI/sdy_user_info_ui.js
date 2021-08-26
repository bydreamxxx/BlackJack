var audio = require('sdy_audio');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomData = require('sdy_room_data').RoomData;

cc.Class({
    extends: cc.Component,

    properties: {
        sp_head: cc.Sprite,
        txt_id: cc.Label,
        txt_name: cc.Label,
        txt_coin: cc.Label,
        txt_honor: cc.Label,
        txt_honor_exp: cc.Label,
        txt_vip: cc.Label,
        txt_shengju: cc.Label,
        txt_duiju: cc.Label,
        txt_shenglv: cc.Label,
    },

    onLoad: function () {

    },

    setData: function (player) {
        if(player){
            this.txt_name.string = cc.dd.Utils.substr(player.name, 0, 4 ); ;
            this.txt_id.string = player.user_id;
            cc.dd.SysTools.loadWxheadH5(this.sp_head,player.head_url);
            this.userId = player.user_id;
            this.txt_coin.string = player.coin;
            // this.txt_vip.string =
        }
    },

    sendMagicProp: function (event,data) {
        audio.com_btn_click();
        if(this.userId == cc.dd.user.id){
            cc.log('不能对自己使用道具！');
            return;
        }

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(RoomData.Instance().game_type);
        gameInfo.setRoomId(RoomData.Instance().room_id);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(3);
        chatInfo.setId(Number(data));
        chatInfo.setToUserId(this.userId);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 3;
        chat_msg.id = Number(data);
        chat_msg.toUserId = this.userId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT,chat_msg);
        cc.dd.UIMgr.closeUI(this.node);
    },

    onClickClose: function () {
        audio.com_btn_click();
        cc.dd.UIMgr.closeUI(this.node);
    },
});
