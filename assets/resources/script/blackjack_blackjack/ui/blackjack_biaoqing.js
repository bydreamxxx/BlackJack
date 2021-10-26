var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;

var hall_audio_mgr = require('hall_audio_mgr').Instance();

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    editor:{
        menu:"BlackJack/blackjack_biaoqing"
    },

    onLoad:function () {
        this.biaoqing_scrollView = cc.find("biaoqing_grid",this.node).getComponent(cc.ScrollView);
    },

    onClickBiaoQing: function (event, data) {
        hall_audio_mgr.com_btn_click();

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(RoomMgr.Instance().gameId);
        gameInfo.setRoomId(RoomMgr.Instance().roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(2);
        chatInfo.setId(Number(data));
        chatInfo.setToUserId(cc.dd.user.id);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        if(this.intervalTime){
            this.intervalTime(2);
        }
        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 2;
        chat_msg.id = Number(data);
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT,chat_msg);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickClose: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
