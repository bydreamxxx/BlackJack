var ChatCfg = require('jlmj_ChatCfg');
var audio = require('sdy_audio');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomData = require('sdy_room_data').RoomData;

cc.Class({
    extends: cc.Component,

    properties: {
        duanyu_scrollView: {default:null,type:cc.ScrollView,tooltip:"短语滚动视图"},
        biaoqing_scrollView: {default:null,type:cc.ScrollView,tooltip:"表情滚动视图"},
        duanyu_title: {default:null,type:cc.Toggle,tooltip:"短语标题"},
        biaoqing_title: {default:null,type:cc.Toggle,tooltip:"表情标题"},

        //短语
        duanYuContentNode: cc.Node,
        node_duanyu: cc.Node,
        // _itemList: [],
    },

    // use this for initialization
    onLoad: function () {
        var duanyuCfg = null;
        if(cc.dd.user.sex == 1){
            duanyuCfg = ChatCfg.BoyQuickMsgCfg;
        }else{
            duanyuCfg = ChatCfg.GirlQuickMsgCfg;
        }
        for(var idx in duanyuCfg){
            var item = cc.instantiate(this.node_duanyu);
            // this._itemList.push(item);
            item.parent = this.duanYuContentNode;
            item.active = true;
            item.getComponent('sdy_duanyu_item').setData(duanyuCfg[idx]);
        }
        this.updateTab(0);
        // this.duanyu_list.forEach(function (duanyu_item,idx) {
        //     duanyu_item.setData(duanyuCfg[idx]);
        // });
        // this.updateTab(0);
    },

    /**
     * 标签点击回调
     * @param toggle
     * @param data
     */
    onClickTab: function (toggle, data) {
        audio.com_btn_click();
        var idx = Number(data);
        this.updateTab(idx);
    },

    /**
     * 短语=0,表情=1
     * @param idx
     */
    updateTab: function (idx) {
        this.duanyu_title.isChecked = idx == 0;
        this.duanyu_scrollView.node.active = idx == 0;
        this.biaoqing_title.isChecked = idx == 1;
        this.biaoqing_scrollView.node.active = idx == 1;
    },

    onClickBiaoQing: function (event, data) {
        audio.com_btn_click();

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(RoomData.Instance().game_type);
        gameInfo.setRoomId(RoomData.Instance().room_id);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(2);
        chatInfo.setId(Number(data));
        chatInfo.setToUserId(cc.dd.user.id);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 2;
        chat_msg.id = Number(data);
        // chat_msg.toUserId = msg.chatInfo.toUserId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT,chat_msg);
        cc.dd.UIMgr.closeUI(this.node);
    },

    onClickClose: function () {
        cc.dd.UIMgr.closeUI(this.node);
    },

});
