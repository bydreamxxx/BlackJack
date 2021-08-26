const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
const club_sender = require('jlmj_net_msg_sender_club');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        animation: {
            default: null,
            type: sp.Skeleton,
            tooltip: '动画',
        },

        icon: {
            default: null,
            type: cc.Node,
            tooltip: 'icon'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        club_Ed.addObserver(this);

        this.animation.node.active = false;
        this.icon.active = true;
    },

    onDestroy(){
        club_Ed.removeObserver(this);
    },

    ShowAnimation(){
        this.animation.node.active = true;
        this.icon.active = false;
    },

    CloseAnimatino(){
        this.animation.node.active = false;
        this.icon.active = true;
    },

    onClickRedBag(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_RED_BAG_CONTENT)) {
            this.CloseAnimatino();
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RED_BAG_CONTENT, function (ui) {
                club_Mgr.setRedBagPage(1, 1);
                club_sender.getAllRedBagList(club_Mgr.getSelectClubId() ,1);
            }.bind(this));
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        //dd.NetWaitUtil.close();
        switch (event) {
            case club_Event.FRIEND_GROUP_SHOW_RED_BAG_ANIM:
                this.ShowAnimation();
                break;
            case club_Event.FRIEND_GROUP_CLOSE_RED_BAG_ANIM:
                this.CloseAnimatino();
                break;
            default:
                break;
        }
    },
});
