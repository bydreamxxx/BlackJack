// create by wj 2018/04/24
const club_sender = require('jlmj_net_msg_sender_club');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        actionNode: cc.Node,
        nameEditBox: cc.EditBox,
        clubId: 0,
    },

    onLoad: function () {
    },

    onDestroy:function () {
    },

    //设置俱乐部id
    setClubId: function(clubId){
        this.clubId = clubId;

        if(this._waitAdminAnima){
            return;
        }

        this.actionNode.active = true;
        this.actionNode.scaleX = 0;
        this.actionNode.scaleY = 0;

        this._waitAdminAnima = true;
        this.actionNode.stopAllActions();
        this.actionNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1, 1),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
            })
        ));
    },
    //确定按钮
    onClickConfirm: function(event, data){
        hall_audio_mgr.com_btn_click();
        club_sender.invite(this.clubId, this.nameEditBox.string)
        cc.dd.UIMgr.destroyUI(this.node);
    },


    //关闭按钮
    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
