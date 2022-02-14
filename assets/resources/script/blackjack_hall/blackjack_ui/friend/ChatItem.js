var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
const hallData = require('hall_common_data').HallCommonData.getInstance();
// var FriendData = require('hall_friend').FriendData.Instance();
// var FriendED = require('hall_friend').FriendED;
// var FriendEvent = require('hall_friend').FriendEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        leftHeadNode: cc.Node,
        leftHeadIcon: require('klb_hall_Player_Head'),
        leftMsgLabel: cc.Label,
        leftTextNode: cc.Node,
        leftEmojiNode: cc.Node,
        leftEmojiAnimation: cc.Animation,

        rightHeadNode: cc.Node,
        rightHeadIcon: require('klb_hall_Player_Head'),
        rightTextNode: cc.Node,
        rightMsgLabel: cc.Label,
        rightEmojiNode: cc.Node,
        rightEmojiAnimation: cc.Animation,

        maxLength: 734
    },

    // 设置聊天数据
    setData(msgData, userData) {
        let isSelf = msgData.fromUserId ? false: true
        this.uid = msgData.fromUserId ? msgData.fromUserId : msgData.toUserId
        this.leftHeadNode.active = !isSelf
        this.rightHeadNode.active = isSelf
        
        if(isSelf) {
            this.rightHeadIcon.initHead(0, hallData.headUrl)
            this.rightTextNode.active = msgData.msgType === 3
            this.rightEmojiNode.active = msgData.msgType === 2
            if(msgData.msgType === 2) {
                this.rightEmojiAnimation.play("em" + (msgData.id - 1));
            } else if(msgData.msgType === 3) {
                this.rightMsgLabel.overflow = cc.Label.Overflow.NONE
                this.rightMsgLabel.string = msgData.msg
            }
        } else {
            this.leftHeadIcon.initHead(0, userData.head)
            this.leftTextNode.active = msgData.msgType === 3
            this.leftEmojiNode.active = msgData.msgType === 2
            if(msgData.msgType === 2) {
                this.leftEmojiAnimation.play("em" + (msgData.id - 1));
            } else if(msgData.msgType === 3) {
                this.leftMsgLabel.overflow = cc.Label.Overflow.NONE
                this.leftMsgLabel.string = msgData.msg
            }
            
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    update (dt) {
        if(this.rightMsgLabel.node.width >= this.maxLength) {
            this.rightMsgLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT
            this.rightMsgLabel.node.width = this.maxLength
        } else {
            this.rightMsgLabel.overflow = cc.Label.Overflow.NONE
        }

        if(this.leftMsgLabel.node.width >= this.maxLength) {
            this.leftMsgLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT
            this.leftMsgLabel.node.width = this.maxLength
        } else {
            this.leftMsgLabel.overflow = cc.Label.Overflow.NONE
        }
    },
});
