var hall_audio_mgr = require('hall_audio_mgr').Instance();
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
const club_sender = require('jlmj_net_msg_sender_club');

cc.Class({
    extends: cc.Component,

    properties: {
        buttonNode: cc.Node,
        label: cc.Label,
    },

    onDestroy(){
      this.unscheduleAllCallbacks();
    },

    setInfo(roomID, rule){
        this.roomId = roomID;
        this.rule = rule;
    },

    onCliCkInvite(){
        hall_audio_mgr.com_btn_click();
        if(this.touch){
            return;
        }

        this.touch = true;

        var base64dstr = cc.dd.SysTools.encode64(this.rule);
        var encodeuri = encodeURIComponent(base64dstr);

        club_sender.sendDeskInviteChat(this.roomId, encodeuri);

        this.buttonNode.active = false;
        let count = 10;
        this.label.string = count;
        this.label.node.active = true;

        let func = ()=>{
            count--;
            this.label.string = count;
            if(count == 0){
                this.touch = false;

                this.buttonNode.active = true;
                this.label.node.active = false;
            }
        }

        this.schedule(func,1, 10, 1)
    }
});
