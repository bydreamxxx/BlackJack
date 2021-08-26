var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');

cc.Class({
    extends: cc.Component,


    setData(player, wanfa, desk, roomID, gameType){
        this.player = player;
        this.wanfa = wanfa;
        this.desk = desk;
        this.roomID = roomID;
        this.gameType = gameType;
    },

    onClickKickOut(){
        hall_audio_mgr.com_btn_click();
        if(this.player){
            if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)){
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function(ui){
                    ui.getComponent('klb_friend_group_notice').show('确定要踢出该玩家吗?',()=>{
                        club_sender.kickOutDesk(clubMgr.getSelectClubId(), this.wanfa, this.desk, this.roomID, this.player.userid, this.gameType);
                    });
                }.bind(this));
            }
        }
    }
});
