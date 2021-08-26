var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_sender = require('jlmj_net_msg_sender_club');

cc.Class({
    extends: cc.Component,

    properties: {
        normalNode:{
            default: null,
            type: cc.Node,
            tooltip: "普通成员界面"
        },

        ownerNode:{
            default: null,
            type: cc.Node,
            tooltip: "群主界面"
        },

        editBox:{
            default: null,
            type: cc.EditBox,
            tooltip: "编辑框"
        },

        normalNotice:{
            default: null,
            type: cc.Label,
            tooltip: "玩家公告"
        },

        normalDefaultNotice:{
            default: null,
            type: cc.Node,
            tooltip: "玩家默认公告"
        },

        ownerNotice:{
            default: null,
            type: cc.Label,
            tooltip: "群主公告"
        },

        ownerDefaultNotice:{
            default: null,
            type: cc.Node,
            tooltip: "群主默认公告"
        },

        button:{
            default: null,
            type: cc.Sprite,
            tooltip: "公告按钮"
        },

        buttonSprite:{
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "按钮字图集"
        },

        _label:null,
        _defaultLabel:null,
    },

    onLoad(){
        club_Ed.addObserver(this);
    },

    onDestroy(){
        club_Ed.removeObserver(this);
    },

    show(notice, isOwner){
        this.isOwner = isOwner;

        if(isOwner){
            this.ownerNode.active = true;
            this.normalNode.active = false;

            this._label = this.ownerNotice;
            this._defaultLabel = this.ownerDefaultNotice;

            this.button.spriteFrame = this.buttonSprite[0];
            this.editBox.node.active = false;
        }else{
            this.ownerNode.active = false;
            this.normalNode.active = true;

            this._label = this.normalNotice;
            this._defaultLabel = this.normalDefaultNotice;
        }

        this.updateUI(notice)
    },

    updateUI(notice){
        if(cc.dd._.isString(notice) && notice != ""){
            notice = cc.dd.SysTools.decode64(decodeURIComponent(notice));
            this._label.string = notice;
            this._label.node.active = true;
            this._defaultLabel.active = false;
        }else{
            this._label.node.active = false;
            this._defaultLabel.active = true;
        }
        this.touch = false;
    },

    onClickChange(){
        hall_audio_mgr.com_btn_click();

        if(this.editBox.node.active){
            let str = this.editBox.string;

            if(str == ''){
                cc.dd.PromptBoxUtil.show('公告内容不能为空');
                return
            }else if(!this.isOwner){
                cc.dd.PromptBoxUtil.show('只有群主才能发公告');
                return
            }

            if(this.touch){
                return;
            }

            this.touch = true;

            str = cc.dd.Utils.filter(str);

            var base64dstr = cc.dd.SysTools.encode64(str);
            var encodeuri = encodeURIComponent(base64dstr);
            club_sender.editAnnounceMent(clubMgr.getSelectClubId(), encodeuri);

            this.button.spriteFrame = this.buttonSprite[0];
            this.editBox.node.active = false;
        }else{
            this.button.spriteFrame = this.buttonSprite[1];
            this.editBox.node.active = true;
            this._label.node.active = false;
            this._defaultLabel.active = false;
        }
    },

    /**
     * 关闭界面
     */
    onclose: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.FRIEND_GROUP_UPDATE_ANNOUNCEMENT:
                this.updateUI(data.notice);
                break;
            default:
                break;
        }
    },
});
