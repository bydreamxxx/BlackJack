// create by wj 2018/04/24
const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed =  require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        nameEditBox: cc.EditBox,
        clubId: 0,
    },

    onLoad: function () {
        club_Ed.addObserver(this);
    },

    onDestroy:function () {
        club_Ed.removeObserver(this);
    },

    //设置俱乐部id
    setClubId: function(clubId){
        this.clubId = clubId;
    },
    //确定按钮
    onClickConfirm: function(event, data){
        hall_audio_mgr.com_btn_click();
        club_sender.changeClubName(this.nameEditBox.string,this.clubId)
    },


    //关闭按钮
    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case club_Event.CLUB_CHANGE_NAME://打开管理界面
                cc.dd.UIMgr.destroyUI(this.node);
                break;
            default:
                break;
        }
    },
});
