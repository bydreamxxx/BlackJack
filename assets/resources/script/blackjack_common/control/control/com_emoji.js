var chat_duanyu_item = require('chat_duanyu_item');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        // emojiItem: { default: null, type: cc.Prefab, tooltip: "表情" },
        duanyuItem: { default: null, type: cc.Prefab, tooltip: "快捷短语" },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // ChatEd.addObserver(this);
        this.initQuickChat();
        // this.msgToggle = cc.find("bg/btnGroup/toggle3", this.node)
    },

    onDestroy() {
        // ChatEd.removeObserver(this);
    },

    //初始化短语
    initQuickChat() {
        let parent = cc.find('bg/text/view/content', this.node)
        chat_duanyu_item.items.forEach(item => {
            let duanyuItem = cc.instantiate(this.duanyuItem)
            duanyuItem.getChildByName("Label").getComponent(cc.Label).string = item.text;
            duanyuItem.tag = item.duanyu_id;
            duanyuItem.on('click', this.onQuickChatClick, this);
            duanyuItem.parent = parent;
        })
    },

    //切换标签
    onChatToggle: function (event, data) {
        if (data == 'text') {
            // cc.find('bg/text', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('bg/text', this.node).active = true;
            cc.find('bg/emoji', this.node).active = false;
        }
        else {
            // cc.find('bg/emoji', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('bg/text', this.node).active = false;
            cc.find('bg/emoji', this.node).active = true;
        }
    },
    //表情
    onEmojiClick(event, custom) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            hall_audio_mgr.com_btn_click();
            var gameType = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomId;

            var id = parseInt(custom);
            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(2);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 2;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
            this.node.active = false;
        }
        else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },



    //快捷文字
    onQuickChatClick(event) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            hall_audio_mgr.com_btn_click();
            // if (!this.chatAni) {
            //     cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            // }

            var gameType = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomId;

            var id = parseInt(event.target.tag);
            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(1);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 1;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
            this.node.active = false;
        }
        else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },

    onBulletScreen(event,data){

    },

    onClose()
    {
        this.node.active = false;
    },

    // //聊天消息
    // onChat(data) {
    //     if (data.msgtype == 3) {//魔法表情

    //     } else {
    //         let isChecked = this.msgToggle.getComponent(cc.Toggle).isChecked
    //         if (isChecked) {
    //             let name = twoeight_Data.getPlayer(data.sendUserId).name
    //             var canvs= cc.find('Canvas');
    //             if(canvs)
    //             {
    //                 if (data.msgtype == 1) {
    //                     let message = cc.instantiate(this.messagePrefab)
    //                     message.parent = canvs
    //                     let text = chat_duanyu_item.items.find(item => item.duanyu_id == data.id)
    //                     message.getComponent('BulletScreen').spawnBullets(name, text.text);
    //                 } else {
    //                     let emoji = cc.instantiate(this.emojiItem)
    //                     emoji.parent = canvs
    //                     emoji.getComponent('BulletScreen').spawnEmoji(name, data.id);
    //                 }
    //             }
                
    //         }
    //     }
    // },


    // onEventMessage(event, data) {
    //     switch (event) {
    //         case ChatEvent.CHAT:
    //         this.onChat(data);
    //         break;
    //     }
    // },
});
