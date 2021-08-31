let prefab_config = require('klb_friend_group_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
const club_sender = require('jlmj_net_msg_sender_club');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

let FG_STATUS = require('klb_friend_group_enum').FG_STATUS;

cc.Class({
    extends: cc.Component,

    properties: {
        title:{
            default: null,
            type: cc.Label,
            tooltip: "好友圈名称"
        },
        head:{
            default: null,
            type: cc.Sprite,
            tooltip: "头像"
        },
        titleID:{
            default: null,
            type: cc.Node,
            tooltip: "好友圈id标题"
        },
        id:{
            default: null,
            type: cc.Label,
            tooltip: "好友圈id"
        },
        playersCount:{
            default: null,
            type: cc.Label,
            tooltip: "人数"
        },
        tablesCount:{
            default: null,
            type: cc.Label,
            tooltip: "桌数"
        },

        bg:{
            default: null,
            type: cc.Sprite,
            tooltip: "背景"
        },

        createNode:{
            default: null,
            type: cc.Node,
            tooltip: "创建好友圈"
        },

        infoNode:{
            default: null,
            type: cc.Node,
            tooltip: "进入好友圈"
        },

        joinNode:{
            default: null,
            type: cc.Node,
            tooltip: "加入好友圈"
        },

        status:{
            default: null,
            type: cc.Sprite,
            tooltip: "状态"
        },

        labelColors:{
            default: [],
            type: [cc.Color],
            tooltip: "字体颜色"
        },

        bgSprites:{
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "背景图集"
        },

        statusSprite:{
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "状态图集"
        },

        tyIcon:{
            default: null,
            type: cc.Node,
            tooltip: "体验标志"
        },

        isOwner:{
            default: null,
            type: cc.Node,
            tooltip: "群主标志"
        },
    },

    onLoad(){
      // this.setToAdd()
    },

    onClickButton(){
        hall_audio_mgr.com_btn_click();

        switch(this._status){
            case FG_STATUS.ADD:
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CREATE_GROUP,function (ui) {});
                break;
            case FG_STATUS.ENTER:
                club_Mgr.setSelectClubId(this.data.clubid);
                club_sender.openClub(this.data.clubid);
                club_Ed.notifyEvent(club_Event.FRIEND_CHANGE_LOBBY);
                break;
            case FG_STATUS.APPLY:
                // this.setStatus(FG_STATUS.WAIT);
                break;
            case FG_STATUS.WAIT:
                // this.setStatus(FG_STATUS.APPLY);
                break;
            case FG_STATUS.JOIN:
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_JOIN_GROUP,function (ui) {});
                break;
        }
    },

    initHead(headurl){
        cc.dd.SysTools.loadWxheadH5(this.head, headurl);
    },

    setStatus(num){
        this._status = num;
        switch(num){
            case FG_STATUS.ADD:
                this.createNode.active = true;
                this.infoNode.active = false;
                this.joinNode.active = false;
                break;
            case FG_STATUS.JOIN:
                this.createNode.active = false;
                this.infoNode.active = false;
                this.joinNode.active = true;
                break;
            default:
                this.createNode.active = false;
                this.infoNode.active = true;
                this.joinNode.active = false;
                break;
        }

        this.bg.spriteFrame = this.bgSprites[this._status];
        this.title.node.color = this.labelColors[this._status];
        this.titleID.color = this.labelColors[this._status];
        this.status.spriteFrame = this.statusSprite[this._status];
    },

    setToAdd(){
        this.setStatus(FG_STATUS.ADD)
    },

    setToApply(){
        this.setStatus(FG_STATUS.JOIN)
    },

    updateUI(info){
        this.data = info;
        this.title.string = info.clubname;
        this.id.string = info.clubid;
        this.playersCount.string = info.curnum;
        this.tablesCount.string = info.deskWaitSum+info.deskWorkSum;
        this.tyIcon.active = info.type == 1;
        this.isOwner.active = info.owneruserid == cc.dd.user.id;
        this.initHead(info.headurl);
    },
});
