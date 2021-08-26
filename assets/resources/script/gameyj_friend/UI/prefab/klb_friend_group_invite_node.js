let prefab_config = require('klb_friend_group_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var Platform = require("Platform");
const AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        bg:cc.Node,
    },

    onLoad(){
        this.bg.cascadeOpacity = false;
        this.bg.active = false;
    },

    show(clubID, clubName, ownerName){
        this.clubID = clubID;
        this.clubName = clubName;
        this.ownerName = ownerName;

        if(this._waitAdminAnima){
            return;
        }
        this._waitAdminAnima = true;
        this.bg.stopAllActions();

        this.bg.active = true;
        this.bg.y = 299.9;
        this.bg.runAction(cc.sequence(
            cc.moveTo(0.2, this.bg.x, 229.1).easing(cc.easeQuadraticActionOut()),
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
        this.bg.stopAllActions();

        this.bg.y = 229.1;
        this.bg.runAction(cc.sequence(
            cc.moveTo(0.2, this.bg.x, 299.9).easing(cc.easeQuadraticActionIn()),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                cc.dd.UIMgr.destroyUI(prefab_config.KLB_FG_INVITE_NODE);
            })
        ))
    },

    onClickInvite(){
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_INVITE)) {
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_INVITE, function (ui) {
                ui.getComponent('klb_friend_group_invite').setClubId(this.clubID);
            }.bind(this));
        }
        this.close();
    },

    onClickWXInvite(){
        if (cc.sys.isNative) {
            let info = {
                relativesid: this.clubID,
                relativesnam: this.clubName,
                relativesmainname: this.ownerName,
            }

            cc.dd.native_wx.SendFriendGroupInvite(info, '亲友圈ID:' + this.clubID, '【' + this.clubName + '】，快来加入我的Family', Platform.wxShareFriendGroupUrl[AppCfg.PID]);
        }
        this.close();
    }
});
