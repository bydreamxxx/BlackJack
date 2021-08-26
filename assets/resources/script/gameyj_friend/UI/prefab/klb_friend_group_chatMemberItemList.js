let MEMBER = require('klb_friend_group_enum').MEMBER;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        playername: cc.Label,
        buttonLabel: cc.RichText,
    },

    //初始化玩家数据信息
    initPlayerInfo: function(player){
        this.buttonLabel.node.active = cc.dd.user.clubJob != MEMBER.NORMAL;

        this.playerData = player;

        let discount = 0;
        if(cc.dd.user.clubJob != MEMBER.NORMAL){
            this.buttonLabel.node.active = true;
            discount =  12;
            this.playername.node.width = 211.6;
        }else{
            this.buttonLabel.node.active = false;
            discount =  20;
            this.playername.node.width = 302;
        }

        this.playername.string = cc.dd.Utils.subChineseStr(player.name, 0 , discount);


        if(player.state == 0){
            this.buttonLabel.string = '<color=#f05d1d><u>禁言</u></color>';
        }else{
            this.buttonLabel.string = '<color=#178e2b><u>解禁</u></color>';
        }
    },

    onClickBan(){
        hall_audio_mgr.com_btn_click();
        club_sender.banPlayer(club_Mgr.getSelectClubId(), this.playerData.id, this.playerData.state == 0, false);
    }
});
