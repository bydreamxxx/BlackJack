let prefab_config = require('klb_friend_group_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const WxED = require("com_wx_data").WxED;
const WxEvent = require("com_wx_data").WxEvent;
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
const club_sender = require('jlmj_net_msg_sender_club');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let FG_STATUS = require('klb_friend_group_enum').FG_STATUS;
cc.Class({
    extends: cc.Component,

    properties: {
        useMine:{
            default: null,
            type: cc.Toggle,
            tooltip: "我创建优先"
        },

        prefabItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "亲友圈组件"
        },

        content:cc.Node,
        scrollView:cc.Node,
    },

    onLoad() {
        this._firstShow = true;

        this.scrollView.active = false;
        this.content.active = true;

        this.useMine.isChecked = true;
    },

    onEnable(){
        HallCommonEd.addObserver(this);
        WxED.addObserver(this);
        club_Ed.addObserver(this);
        RoomED.addObserver(this);
    },

    onDisable(){
        HallCommonEd.removeObserver(this);
        WxED.removeObserver(this);
        club_Ed.removeObserver(this);
        RoomED.removeObserver(this);
    },

    updateUI(){
        let mineClub = 0;
        let rootNode;
        let targetItem = 4;

        let createLimit = 3;
        let addLimit = 2;

        if(cc.game_pid == 10003 || cc.game_pid == 10004){
            createLimit = 4;
            addLimit = 3;
        }

        if(clubMgr.club_List.length + clubMgr.club_apply_List.length < targetItem){
            this.scrollView.active = false;
            this.content.active = true;

            rootNode = this.content;
        }else{
            this.scrollView.active = true;
            this.content.active = false;
            rootNode = this.scrollView.getComponent(cc.ScrollView).content;
        }

        if(rootNode.childrenCount > 0){
            rootNode.removeAllChildren();
        }

        if(this.useMine.isChecked){
            clubMgr.club_List.sort((a,b)=>{
                if(a.owneruserid == cc.dd.user.id && b.owneruserid != cc.dd.user.id){
                    return -1;
                }else if(a.owneruserid != cc.dd.user.id && b.owneruserid == cc.dd.user.id){
                    return 1;
                }else{
                    return a.idx - b.idx;
                }
            })
        }else{
            clubMgr.club_List.sort((a,b)=>{
                return a.idx - b.idx;
            })
        }

        for(let i = 0; i < clubMgr.club_List.length; i++){
            if(clubMgr.club_List[i].owneruserid == cc.dd.user.id){
                mineClub++;
            }

            let item = cc.instantiate(this.prefabItem);
            let status = FG_STATUS.WAIT;
            if(clubMgr.club_List[i].isjoin || clubMgr.club_List[i].owneruserid == cc.dd.user.id){
                status = FG_STATUS.ENTER;
            }
            item.getComponent('klb_friend_group_friendGroup').setStatus(status);
            item.getComponent('klb_friend_group_friendGroup').updateUI(clubMgr.club_List[i])
            rootNode.addChild(item);
        }

        for(let i = 0; i < clubMgr.club_apply_List.length; i++){
            if(clubMgr.club_apply_List[i].owneruserid == cc.dd.user.id){
                mineClub++;
            }

            let item = cc.instantiate(this.prefabItem);
            let status = FG_STATUS.WAIT;
            item.getComponent('klb_friend_group_friendGroup').setStatus(status);
            item.getComponent('klb_friend_group_friendGroup').updateUI(clubMgr.club_apply_List[i])
            rootNode.addChild(item);
        }

        if(mineClub<createLimit && (clubMgr.club_List.length + clubMgr.club_apply_List.length)<=(createLimit+addLimit)){
            let item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_friendGroup').setToAdd();
            rootNode.addChild(item);
        }

        if((clubMgr.club_List.length + clubMgr.club_apply_List.length)<=(createLimit+addLimit)){
            let item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_friendGroup').setToApply();
            rootNode.addChild(item);
        }

        if(rootNode.childrenCount <= 1 && this._firstShow){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_JOIN_GROUP,function (ui) {});
        }
        this._firstShow = false;

        if (cc.dd._.isString(cc.wx_enter_club_id) && cc.wx_enter_club_id != ""){
            if(cc.dd.UIMgr.getUI(prefab_config.KLB_FG_JOIN_GROUP)){
                cc.dd.UIMgr.destroyUI(prefab_config.KLB_FG_JOIN_GROUP);
            }

            club_sender.joinClubReq(parseInt(cc.wx_enter_club_id));
            cc.wx_enter_club_id = null;
        }
    },

    onClickCreateGroup(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CREATE_GROUP,function (ui) {});
    },

    onClickJoinGroup(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_JOIN_GROUP,function (ui) {});
    },

    //"我创建优先"按钮
    onClickToggle(){
        hall_audio_mgr.com_btn_click();
        if(this.touch){
            return;
        }
        this.touch = true;
        this.useMine.interactable = false;
        this.updateUI();
        setTimeout(()=>{
            this.touch = false;
            this.useMine.interactable = true;
        },500);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case WxEvent.DOWNLOAD_HEAD:
                break;
            case club_Event.CLUB_MANAGER_OP://打开管理界面
                break;
            case club_Event.CLUB_REFRESH_DESK://刷新俱乐部桌子列表
            case club_Event.CLUB_DISSOLVE_GAME_DESK: //解散俱乐部桌子
            case club_Event.CLUB_DESK_DELETE_PLAYER: //请出玩家
                break;
            case club_Event.CLUB_CARDS_UPDATE://俱乐部房卡存入更新
                break;
            case club_Event.CLUB_CHANGE_RIGHTS: //俱乐部更新权限
                //TODO
                // this.updateClubRightsBtn(data);
                break;
            case club_Event.CLUB_CREATE_MATCH_SUCCESS: //代开房间成功
                break;
            case club_Event.CLUB_CLOSE_MAINUI: //关掉主界面
                break;
            case club_Event.CLUB_kICK_PLAYER_OUT://被请出俱乐部
                break;
            case club_Event.FRIEND_APPLY_SUCCESS://俱乐部申请提示
                club_sender.requireALlClubList();
                break;
            case club_Event.CLUB_CHANGE_SCORE:
                break;
            case club_Event.CLUB_UPDATE_SCORE:
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                break;
            case RoomEvent.on_choose_seat:
                break;
            case club_Event.CLUB_CHANGE_NAME:
                this.updateUI();
                break
            default:
                break;
        }
    },
});
