var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
const club_sender = require('jlmj_net_msg_sender_club');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        title:{
            default: null,
            type: cc.Label,
            tooltip: "包厢名称"
        },

        subtitle:{
            default: null,
            type: cc.Label,
            tooltip: "包厢副标题"
        },

        bg:{
            default: null,
            type: cc.Sprite,
            tooltip: "背景"
        },


        bgSprites:{
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "背景图集"
        },

        deleteButton:{
            default: null,
            type: cc.Node,
            tooltip: "删除按钮"
        }
    },

    onLoad(){
        club_Ed.addObserver(this);
    },

    onDestroy(){
        club_Ed.removeObserver(this);
    },

    initUI(idx, wanfanum, isOwner, func, gameName, backName){
        this.isAdd = false;
        this.wanfanum = wanfanum;

        let local_result = club_Mgr.getLastRoomID();
        this.title.string = gameName;
        // if(wanfanum > 999){
        //     this.subtitle.string = '包厢号:***';
        // }else{
        //     this.subtitle.string = '包厢号:'+wanfanum;
        // }
        this.subtitle.string = backName;
        this.bg.spriteFrame = this.bgSprites[this.wanfanum == parseInt(local_result) ? 1 : 0];

        this.deleteButton.active = isOwner;

        this._func = func;
    },

    initAdd(func){
        this.isAdd = true;
        this.title.string = '';
        this.subtitle.string = '';
        this.deleteButton.active = false;
        this.bg.spriteFrame = this.bgSprites[2];
        this._func = func;
    },

    onClickDelete(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function(ui){
                ui.getComponent('klb_friend_group_notice').show('确定要删除'+this.title.string+'吗?',()=>{
                    club_sender.deleteBaoFang(club_Mgr.getSelectClubId(), this.wanfanum);
                });
            }.bind(this));
        }
        // this.node.removeFromParent(true);
    },

    onClickButton(){
        hall_audio_mgr.com_btn_click();
        if(this.isAdd){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CREATE_ROOM, function (ui) {
                let Component = ui.getComponent("klb_friend_group_createRoom");
                let clubID = club_Mgr.getSelectClubId()
                if (club_Mgr.getClubInfoByClubId(clubID) && club_Mgr.getClubInfoByClubId(clubID).type == 1) {
                    Component.showClubGameList();
                }
                else {
                    Component.showGameList(0,  club_Mgr.getClubInfoByClubId(clubID));
                }
                var ani = ui.getChildByName('actionnode').getComponent(cc.Animation);
                ani.play('klb_hall_createRoom');
            }.bind(this));
        }else{
            let checkEnter = true;
            let local_result = club_Mgr.getLastRoomID();
            checkEnter = local_result && parseInt(local_result) != this.wanfanum;

            if(checkEnter){
                club_sender.enterClubBaoFang(club_Mgr.getSelectClubId(), this.wanfanum);
            }
        }
        if(this._func){
            this._func();
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.FRIEND_GROUP_DELETE_ROOM:
                if(data.clubId == club_Mgr.getSelectClubId() && this.wanfanum == data.wanfanum){
                    this.node.removeFromParent(true);
                }
                break;
            case club_Event.FRIEND_BAOFANG_DETAIL:
                let local_result = club_Mgr.getLastRoomID();
                if(!this.isAdd){
                    this.bg.spriteFrame = this.bgSprites[this.wanfanum == parseInt(local_result) ? 1 : 0];
                }
                break;
            case club_Event.FRIEND_GROUP_CHANGE_BACK_NAME://打开管理界面
                if(data.clubId == club_Mgr.getSelectClubId() && this.wanfanum == data.wanfanum){
                    this.subtitle.string = data.name;
                }
                break;
            default:
                break;
        }
    },
});
