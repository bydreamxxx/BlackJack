var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode:{
            default: null,
            type: cc.Node,
            tooltip:'背景',
        },
        maskNode:{
            default: null,
            type: cc.Node,
            tooltip:'遮罩',
        },
        editBox:{
            default: null,
            type: cc.EditBox,
            tooltip: '输入框'
        },

        emojiNode:{
            default: null,
            type: cc.Node,
            tooltip:'表情',
        },
        playersCount:{
            default: null,
            type: cc.Label,
            tooltip:'人数',
        },
        sendButton:{
            default: null,
            type: cc.Button,
            tooltip:'发送按钮',
        },
        iconSprite:{
            default: null,
            type: cc.Sprite,
            tooltip:'发送按钮',
        }
    },

    onLoad(){
        club_Ed.addObserver(this);
    },

    onDestroy(){
        club_Ed.removeObserver(this);
        this.unscheduleAllCallbacks();
    },

    show(){
        if(this._waitAdminAnima){
            return;
        }
        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.isShow = true;
        this.node.active = true;
        this.maskNode.active = true;
        this.bgNode.x = this.node.width / 2 + this.bgNode.width / 2;
        this.bgNode.runAction(cc.sequence(
            cc.moveTo(0.2, this.node.width / 2 - this.bgNode.width / 2, 0).easing(cc.easeSineIn()),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
            })
        ));
    },

    close(){
        if(this._waitAdminAnima){
            return;
        }
        hall_audio_mgr.com_btn_click();

        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.maskNode.active = false;
        this.bgNode.x = this.node.width / 2 - this.bgNode.width / 2;

        this.bgNode.runAction(cc.sequence(
            cc.moveTo(0.2, this.node.width / 2 + this.bgNode.width / 2, 0).easing(cc.easeSineOut()),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                this.node.active = false;
                this.isShow = false;
            })
        ))
    },

    onClickBiaoQing: function (event, data) {
        hall_audio_mgr.com_btn_click();

        if(this.editBox.string.length <= this.editBox.maxLength - 2){
            this.editBox.string += ('#'+data);
        }
        // var base64dstr = cc.dd.SysTools.encode64('#'+data);
        // var encodeuri = encodeURIComponent(base64dstr);
        // club_sender.sendChat(clubMgr.getSelectClubId(), encodeuri);
        this.closEmoji();
    },

    onClickSend(){
        if(this.editBox.string.length <= 0){
            cc.dd.PromptBoxUtil.show('输入内容不能为空');
            return
        }

        this.sendButton.interactable = false;
        this.iconSprite._sgNode.setState(1);

        let str = this.editBox.string;

        str = cc.dd.Utils.filter(str);

        var base64dstr = cc.dd.SysTools.encode64(str);
        var encodeuri = encodeURIComponent(base64dstr);
        this.editBox.string = '';

        club_sender.sendChat(clubMgr.getSelectClubId(), encodeuri);

        let count = 3;
        let func = ()=>{
            count--;
            if(count == 0){
                this.sendButton.interactable = true;
                this.iconSprite._sgNode.setState(0);
            }
        }

        this.schedule(func,1, 3, 1)
    },

    onClickEmoji(){
        hall_audio_mgr.com_btn_click();

        if(this._waitAdminAnima){
            return;
        }
        this._waitAdminAnima = true;
        this.emojiNode.stopAllActions();

        this.emojiNode.active = true;
        this.emojiNode.scaleX = 0;
        this.emojiNode.scaleY = 0;
        this.emojiNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
            })
        ));
    },

    onClickCloseEmoji(){
        hall_audio_mgr.com_btn_click();
        this.closEmoji();
    },

    onClickChatPlayer(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_CHAT_LIST)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CHAT_LIST, function(ui){
                ui.getComponent('klb_friend_group_chatMemberList').show();
                club_sender.getChatPlayer(clubMgr.getSelectClubId());
            }.bind(this));
        }
    },

    closEmoji(){
        if(this._waitAdminAnima){
            return;
        }

        this._waitAdminAnima = true;
        this.emojiNode.stopAllActions();

        this.emojiNode.scaleX = 1;
        this.emojiNode.scaleY = 1;
        this.emojiNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                this.emojiNode.active = false;
            })
        ))
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.FRIEND_GROUP_CHAT_UPDATE:
                if(data.clubId == clubMgr.getSelectClubId()){
                    this.playersCount.string = data.onlineSum;
                }
                break;
            case club_Event.FRIEND_GROUP_CHAT_MEMBER:
                this.playersCount.string = clubMgr.getChatMembersList(clubMgr.getSelectClubId()).length;
                break;
            default:
                break;
        }
    },
});
