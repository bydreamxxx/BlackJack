var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        headIcon: require('klb_hall_Player_Head'),
        nameLabel: cc.Label,

        selectedBg: cc.Node,

        gameStatePanel: cc.Node,
        addFriendPanel: cc.Node,

        lookupNode: cc.Node,
        chatNode: cc.Node,

        redPointNode: cc.Node,
        redPointLabel: cc.Label,
    },

    setData(data,  type) {
        this.uid = data.uid
        if(this.coinLabel) {
            this.coinLabel.string = cc.dd.Utils.getNumToWordTransform(data.score)
        }
        if(this.headIcon) {
            this.headIcon.initHead (0, data.head_url)
        }
        if(this.nameLabel) {
            this.nameLabel.string = cc.dd.Utils.subChineseStr(data.name, 0, 10);
        }
        this.type = type
        if(type === 1) {  //好友
            this.gameStatePanel.active = true
            this.addFriendPanel.active = false
            this.lookupNode.active = false
            this.chatNode.active = true
        } else if(type===2) {  //请求添加
            this.gameStatePanel.active = false
            this.addFriendPanel.active = true
            this.lookupNode.active = false
            this.chatNode.active = true
        } else if(type===3) {  //查找添加
            this.gameStatePanel.active = true
            this.addFriendPanel.active = false
            this.lookupNode.active = true
            this.chatNode.active = false
        }
    },

    onChat() {
        FriendED.notifyEvent(FriendEvent.OPEN_FRIEND_CHAT, this.uid);
        this.setRedCound(0)
    },

    onLookup() {
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_LOOKUP_FRIEND, function (prefab) {
            prefab.getComponent('LookupFriend').showUI(this.uid);
        });
    },

    onSelected() {
        if(this.type===1) {
            FriendED.notifyEvent(FriendEvent.OPEN_LOOKUP_FRIEND, this.uid);
        } else if(this.type===2) {
            FriendED.notifyEvent(FriendEvent.OPEN_LOOKUP_REQUESTER, this.uid);
        }
        
        var msg = new cc.pb.friend.msg_friend_detail_info_req();
        msg.friendId = this.uid
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_detail_info_req, msg, "msg_friend_detail_info_req", true);
    },

    // 设置选中状态
    setSelected(isSelected) {
        this.selectedBg.active = isSelected
    },

    onAcceptFriend() {
        var msg = new cc.pb.friend.msg_reply_add_friend_req();
        msg.friendId = this.uid
        msg.isAgree = true
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_reply_add_friend_req, msg, "msg_reply_add_friend_req", true);
    },
    onRefuseFriend() {
        var msg = new cc.pb.friend.msg_reply_add_friend_req();
        msg.friendId = this.uid
        msg.isAgree = false
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_reply_add_friend_req, msg, "msg_reply_add_friend_req", true);
    },

    // 设置红点
    setRedCound(count) {
        this.count =  count
        this.redPointLabel.string = '+'+this.count
        this.redPointNode.active = this.count > 0
    },
    // 红点+1
    addRedPoint() {
        if(!this.count) {
            this.count = 0
        }
        this.count = this.count + 1
        this.setRedCound(this.count)
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    // update (dt) {},
});
