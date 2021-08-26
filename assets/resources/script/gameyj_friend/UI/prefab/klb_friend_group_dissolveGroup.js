var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,
    properties:{
      content: cc.Label,
    },
    onLoad(){
        if(cc._useChifengUI){
            this.content.string = `1、亲友圈内有正在进行的游戏时，无法解散
2、解散后，将关闭亲友圈，所有玩家将被踢出亲友圈，
      以邮件的形式告知。
3、解散后，返回所有存在亲友圈的房卡。`
        }
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickDissolve(){
        hall_audio_mgr.com_btn_click();
        club_sender.dissolveClub(clubMgr.getSelectClubId());
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
