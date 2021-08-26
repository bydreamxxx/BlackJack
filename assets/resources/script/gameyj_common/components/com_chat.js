var chat_game_cfg = require('chat_game_cfg');
var chat_duanyu_item = require('chat_duanyu_item');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;

var Define = require("Define");

var hall_audio_mgr = require('hall_audio_mgr').Instance();

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad:function () {
        this.duanyu_scrollView = cc.find("duanyu_list",this.node).getComponent(cc.ScrollView);
        this.biaoqing_scrollView = cc.find("biaoqing_grid",this.node).getComponent(cc.ScrollView);
        this.duan_yu_contentNode = cc.find("duanyu_list/view/content",this.node);
        this.duan_yu_item = cc.find("duanyu_item",this.node);
    },
    initChat: function () {
        var duanyu_list = chat_game_cfg.getItem(function (itrem) {
            if(itrem.game_id == RoomMgr.Instance().gameId){
                return itrem;
            }
        });

        var duanyu_item = [];
        chat_duanyu_item.getItem(function (itrem) {
            duanyu_item[itrem.duanyu_id] = itrem;
        });

        duanyu_list = duanyu_list.duanyu_id.split(';')

        for(var i = 0, len = duanyu_list.length; i < len; ++i){
            var dy_id = duanyu_list[i];
            var item = cc.instantiate(this.duan_yu_item);
            item.active = true;
            item.parent = this.duan_yu_contentNode;
            item.x = 0;
            var item_ui = item.getComponent('ChatDuanYuItem');
            item_ui.setData(duanyu_item[dy_id], this.onClickClose.bind(this));
            item_ui.intervalTimeCallBack(this.intervalTime);
        }
        // this.updateTab(0);
    },

    intervalTimeCallBack:function (interval) {
        this.intervalTime = interval;
    },

    /**
     * 标签点击回调
     * @param toggle
     * @param data
     */
    onClickTab: function (toggle, data) {
        hall_audio_mgr.com_btn_click();
        var idx = Number(data);
        this.updateTab(idx);
    },

    /**
     * 短语=0,表情=1
     * @param idx
     */
    updateTab: function (idx) {
        this.duanyu_scrollView.node.active = idx == 0;
        this.biaoqing_scrollView.node.active = idx == 1;
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
