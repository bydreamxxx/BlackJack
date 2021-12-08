const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed =  require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        nameEditBox: cc.EditBox,
    },

    onLoad: function () {
        club_Ed.addObserver(this);
    },

    onDestroy:function () {
        club_Ed.removeObserver(this);
    },

    show(clubID, wanfa){
        this.clubId = clubID;
        this.wanfa = wanfa;
    },

    setClubId: function(clubId){
        this.clubId = clubId;
    },

    onClickConfirm: function(event, data){
        hall_audio_mgr.com_btn_click();

        if(this.nameEditBox.string.trim() == ''){
            cc.dd.DialogBoxUtil.show(0,'备注名不能为空', 'text33');
            return;
        } else if (!/(^[A-Za-z0-9\u4e00-\u9fa5]+$)/.test(this.nameEditBox.string)) {
            cc.dd.DialogBoxUtil.show(0,'请输入数字、汉字或字母', 'text33');
            return;
        }

        let info = club_Mgr.getRoomInfo(this.clubId, this.wanfa);
        if(info){
            info.backName = this.nameEditBox.string;
        }

        club_sender.changeBackName(this.nameEditBox.string, this.clubId, this.wanfa);
    },


    //关闭按钮
    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case club_Event.FRIEND_GROUP_CHANGE_BACK_NAME://打开管理界面
                cc.dd.UIMgr.destroyUI(this.node);
                break;
            default:
                break;
        }
    },
});
