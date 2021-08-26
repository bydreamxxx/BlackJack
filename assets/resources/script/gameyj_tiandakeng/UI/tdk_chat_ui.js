var ChatCfg = require('jlmj_ChatCfg');
var audio = require('sdy_audio');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var chat_game_cfg = require('chat_game_cfg');
var chat_duanyu_item = require('chat_duanyu_item');

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
    
    },

    
    // use this for initialization
    onLoad: function () {
        var duanyu_list = chat_game_cfg.getItem(function (itrem) {
            if(itrem.game_id == 44){
                return itrem;
            }
        });

        var duanyu_item = [];
        chat_duanyu_item.getItem(function (itrem) {
            duanyu_item[itrem.duanyu_id] = itrem;
        });

        duanyu_list = duanyu_list.duanyu_id.split(';')

        for(var idx in duanyu_list){
            var item = cc.instantiate(this.node_duanyu);
            // this._itemList.push(item);
            item.parent = this.duanYuContentNode;
            item.active = true;
            item.x = 0;
            var dy_id = duanyu_list[idx];
            if(dy_id >= 0)
                item.getComponent('tdk_duanyu_item').setData(duanyu_item[dy_id]);
        }
        this.updateTab(0)


        // var duanyuCfg = null;
        // if(cc.dd.user.sex == 1){
        //     duanyuCfg = ChatCfg.BoyQuickMsgCfg;
        // }else{
        //     duanyuCfg = ChatCfg.GirlQuickMsgCfg;
        // }
        // for(var idx in duanyuCfg){
        //     var item = cc.instantiate(this.node_duanyu);
        //     // this._itemList.push(item);
        //     item.parent = this.duanYuContentNode;
        //     item.active = true;
        //     item.x = 0;
        //     item.getComponent('tdk_duanyu_item').setData(duanyuCfg[idx]);
        // }
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
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
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
        this.onClickClose();
    },

    onClickClose: function () {
        this.node.active = false;
    },

});
