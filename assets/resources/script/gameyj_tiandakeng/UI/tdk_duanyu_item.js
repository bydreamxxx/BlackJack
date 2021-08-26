var audio = require('sdy_audio');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var dd = cc.dd;
var tdk = dd.tdk;

cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    setData: function (data) {
        this.data = data;
        this.text.string = cc.dd.Utils.substr(data.text, 0, 9);
    },




    onClick: function () {
        audio.com_btn_click();
        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(1);
        chatInfo.setId(this.data.duanyu_id);
        chatInfo.setToUserId(cc.dd.user.id);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 1;
        chat_msg.id = this.data.duanyu_id;
        // chat_msg.toUserId = msg.chatInfo.toUserId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT,chat_msg);
        cc.find('Canvas/tdk_coin_room/tdk_chat').active = false;
        //cc.dd.UIMgr.closeUI('gameyj_tiandakeng/Prefab/tdk_chat');
    },
});