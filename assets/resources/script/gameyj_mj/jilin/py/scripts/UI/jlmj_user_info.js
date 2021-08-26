var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        nick_name:{ default:null, type:cc.Label, tooltip:'昵称' },
        ID:{ default:null, type:cc.Label, tooltip:'ID' },
        locale:{ default:null, type:cc.Label, tooltip:'定位' },
        IP:{ default:null, type:cc.Label, tooltip:'IP' },
        head_icon:{ default:null, type:cc.Sprite, tooltip:'玩家头像' },
    },

    onLoad: function () {

    },

    onEnable: function () {

    },

    updateUI: function (player) {
        if(player){
            this.nick_name.string = cc.dd.Utils.substr(player.nickname, 0, 4 ); ;
            this.ID.string = player.userId;
            this.head_icon.spriteFrame = this.getUserHeadForID(player.userId);
            this.userId = player.userId;
        }
    },

    sendMagicProp: function (event,data) {
        if(this.userId == cc.dd.user.id){
            cc.log('不能对自己使用道具！');
            return;
        }

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(RoomMgr.Instance().gameId);
        gameInfo.setRoomId(RoomMgr.Instance().roomLv);
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

    closeSelf: function () {
        cc.dd.UIMgr.closeUI(this.node);
    },

    /**
     * 获取玩家head
     */
    getUserHeadForID:function (userID) {
        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        if(play_list) {
            var headinfo = play_list.getUserHeadNode(userID);
            if(headinfo){
                return  headinfo.head.getHeadSp();
            }
        }
        return null;
    },

});
