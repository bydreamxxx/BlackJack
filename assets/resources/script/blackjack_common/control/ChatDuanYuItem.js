var hall_audio_mgr = require('hall_audio_mgr').Instance();
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.show_text = cc.find("LanguageLabel",this.node).getComponent(cc.Label);
    },

    setData: function (data, callback) {
        this.data = data;
        this.call_back = callback;
        this.show_text.setText(data.text);
        this.show_text.setSubstr(0, 12);
    },

    intervalTimeCallBack:function (interval) {
        this.interval = interval;
    },

    onClick: function () {
        hall_audio_mgr.com_btn_click();

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(RoomMgr.Instance().gameId);
        gameInfo.setRoomId(RoomMgr.Instance().roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(1);
        chatInfo.setId(this.data.duanyu_id);
        chatInfo.setToUserId(cc.dd.user.id);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        if(this.interval){
            this.interval(2);
        }

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 1;
        chat_msg.id = this.data.duanyu_id;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT,chat_msg);
        this.call_back?this.call_back():null;
    },

});
