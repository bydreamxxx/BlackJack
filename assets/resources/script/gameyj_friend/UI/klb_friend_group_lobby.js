var hall_audio_mgr = require('hall_audio_mgr').Instance();
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
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
const klb_game_Confg = require('klb_gameList');
let GetGameRules = require('GetGameRules');
let MEMBER = require('klb_friend_group_enum').MEMBER;

const PLAYER_STATUS = {
    NORMAL: 0,
    OWNER: 1,
    ADMIN: 2,
}

// const SHOW_RANK_CLUB_LIST = [219231,467920,134803,104855,143257,115094,849858,619686,313491,468352,315333,651560,665697,501984,585057,589817,138311];
const SHOW_RANK_CLUB_LIST = [];
cc.Class({
    extends: cc.Component,

    properties: {
        tableNode:{
            default: null,
            type: cc.Node,
            tooltip: "桌子容器"
        },

        normalNode:{
            default: null,
            type: cc.Node,
            tooltip: "普通成员界面"
        },

        ownerNode:{
            default: null,
            type: cc.Node,
            tooltip: "群主界面"
        },

        clubTitle:{
            default: null,
            type: cc.Label,
            tooltip: "群标题"
        },

        clubId:{
            default: null,
            type: cc.Label,
            tooltip: "群ID"
        },

        gameTitle:{
            default: null,
            type: cc.Label,
            tooltip: "游戏标题"
        },

        gameRuleTitle:{
            default: null,
            type: cc.RichText,
            tooltip: "游戏规则"
        },

        applyButton:{
            default: null,
            type: cc.Node,
            tooltip: "申请按钮"
        },

        applyCountLabel:{
            default: null,
            type: cc.Label,
            tooltip: "申请消息数量"
        },

        card:{
            default: null,
            type: cc.Label,
            tooltip: "房卡"
        },

        gamingTable:{
            default: null,
            type: cc.Label,
            tooltip: "进行中桌子"
        },

        waitingTable:{
            default: null,
            type: cc.Label,
            tooltip: "等待中桌子"
        },

        chat:{
            default: null,
            type: cc.Node,
            tooltip: "聊天"
        },

        chatNote:{
            default: null,
            type: cc.Node,
            tooltip: "聊天红点",
        },

        chatCountLabel:{
            default: null,
            type: cc.Label,
            tooltip: "聊天消息数量",
        },

        scoreNote:{
            default: null,
            type: cc.Node,
            tooltip: "积分",
        },

        scoreLabel:{
            default: null,
            type: cc.Label,
            tooltip: "积分",
        },

        cfmjBattle:{
            default: null,
            type: cc.Widget,
            tooltip: "赤峰麻将战绩",
        },

        closeInfo:{
            default: null,
            type: cc.Node,
            tooltip: "已打烊",
        },

        cfmjChangeRoom:{
            default: null,
            type: cc.Node,
            tooltip: "包厢tip",
        },

        redbag:{
            default: null,
            type: cc.Node,
            tooltip: "红包",
        },

        shareBaoxiang:{
            default: null,
            type: cc.Node,
            tooltip: "包厢分享",
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tableNode.active = false;
        cc.find('noGame', this.ownerNode).active = false;
        cc.find('noGame', this.normalNode).active = false;

        this.applyButton.active = false;

        this.redbag.active = !cc._useChifengUI && !cc._useCardUI;

        this.chatNote.active = false;
        this.chatCountLabel.string = '0';
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

    onDestroy(){
      if(this.refreshTime){
          clearTimeout(this.refreshTime);
          this.refreshTime = null;
      }
    },

    /**
     * 更新UI
     */
    updateUI(){
        this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());

        // this.normalRankNode.active = SHOW_RANK_CLUB_LIST.indexOf(this.info.clubid) != -1;

        this.clubOpen = this.info.state != 2;
        this.closeInfo.active = !this.clubOpen;

        if (this.info.owneruserid == cc.dd.user.id) {
            this.status = PLAYER_STATUS.OWNER;
        }else  if (this.info.gameRightsList.length > 2 || cc.dd.user.clubJob == MEMBER.ADMIN) {
            this.status = PLAYER_STATUS.ADMIN;
        } else {
            this.status = PLAYER_STATUS.NORMAL;
        }

        if (this.status != PLAYER_STATUS.NORMAL){
            club_sender.applyClubListReq(1, clubMgr.getSelectClubId());
        }

        this.shareBaoxiang.active = this.status != PLAYER_STATUS.NORMAL && this.info.roomInfo && this.info.roomInfo.length > 0;

        this.scoreNote.active = this.info.type == 1 && this.status == PLAYER_STATUS.OWNER;
        this.scoreLabel.string = this.info.userScore;

        this.noGame = null;
        switch(this.status){
            case PLAYER_STATUS.OWNER:
            case PLAYER_STATUS.ADMIN:
                this.normalNode.active = false;
                this.ownerNode.active = true;

                this.cfmjBattle.right = 182.70;
                this.cfmjBattle.updateAlignment();

                this.noGame = cc.find('noGame', this.ownerNode);
                break;
            default:
                this.normalNode.active = true;
                this.ownerNode.active = false;

                this.cfmjBattle.right = 85.90;
                this.cfmjBattle.updateAlignment();

                this.noGame = cc.find('noGame', this.normalNode);
                break;
        }

        cc.find('noGame', this.ownerNode).active = false;
        cc.find('noGame', this.normalNode).active = false;

        this.gameTitle.string = "";
        this.gameRuleTitle.string = "";

        this.tableNode.active = false;
        this.applyButton.active = this.info.applyNum != 0 && this.status != PLAYER_STATUS.NORMAL;
        this.applyCountLabel.string = this.info.applyNum > 99 ? '99' : this.info.applyNum;

        this.clubTitle.string = this.info.clubname;
        this.clubId.string = this.info.clubid;

        this.card.string = this.info.cards;
        this.card.node.parent.active = this.info.type == 0 && this.status == PLAYER_STATUS.OWNER;

        this.gamingTable.string = cc.dd._.isNumber(this.info.deskWorkSum) ? this.info.deskWorkSum : 0;
        this.waitingTable.string = cc.dd._.isNumber(this.info.deskWaitSum) ? this.info.deskWaitSum : 0;

        this.cfmjChangeRoom.active = false;

        club_sender.getClubBaoFangList(this.info.clubid);
        this.initRoom = true;
        this.gameRule = null;
    },

    /**
     * 更新包厢UI
     */
    updateRoom(){
        // this.cfmjChangeRoom.active = this.status != PLAYER_STATUS.NORMAL ? this.info.roomInfo.length >= 1 : this.info.roomInfo.length >= 2;
        this.cfmjChangeRoom.active = this.info.roomInfo.length >= 1;
        this.shareBaoxiang.active = this.status != PLAYER_STATUS.NORMAL && this.info.roomInfo.length > 0;

        this.noGame.active = this.info.roomInfo.length == 0;
        if(this.info.roomInfo.length == 0){
            this.gameRule = null
        }
        this.tableNode.active = false;
        this.gameTitle.string = "";
        this.gameRuleTitle.string = "";

        if(this.initRoom){
            this.initRoom = false;

            // if(this.status != PLAYER_STATUS.NORMAL ? this.info.roomInfo.length >= 1 : this.info.roomInfo.length >= 2){
            if(this.info.roomInfo.length >= 1){
                this.cfmjChangeRoom.getComponent('klb_friend_group_changeRoom').show(this.info.roomInfo);
            }

            let func = ()=>{
                if(this.info.roomInfo.length >= 1) {
                    club_sender.enterClubBaoFang(this.info.clubid, this.info.roomInfo[0].id);
                }
            }

            let local_result = clubMgr.getLastRoomID();
            if(local_result){
                let roomif = clubMgr.getRoomInfo(this.info.clubid, local_result);
                if(roomif){
                    club_sender.enterClubBaoFang(this.info.clubid, local_result);
                }else{
                    func();
                }
            }else{
                func();
            }
        }
    },

    /**
     * 更新大厅桌子
     */
    updateRoomInfo(data){

        let gametype = data.rule.gameInfo.gameType;

        if(gametype == cc.dd.Define.GameType.SYMJ_FRIEND){
            if(data.rule.rule.mjSongyuanRule.symjtype == 2){
                gametype = cc.dd.Define.GameType.SYMJ_FRIEND_2
            }
        }

        let config = klb_game_Confg.getItem((item)=>{
            return item.gameid == gametype;
        });

        this.gameTitle.string = config.name;
        this.wanFaNum = data.id;
        this.gamingTable.string = cc.dd._.isNumber(data.deskWorkSum) ? data.deskWorkSum : 0;
        this.waitingTable.string = cc.dd._.isNumber(data.deskWaitSum) ? data.deskWaitSum : 0;

        let str = '';
        if(this.info.type == 1){
            if (gametype == 150) {
                const baseScore = [0, 10, 20, 50, 100];
                str+=' ' +baseScore[data.rule.rule.jlbPsRule.baseScore] * 20 + '分准入';
            }
            else if (gametype == 108) {
                str+=' 200分准入';
            }
        }

        this.gameRuleTitle.string = this.getGameRule(data.rule);

        this.tableNode.active = true;

        let roomList = [];
        roomList.length = 20;
        for(let i = 0; i < data.clubRoom.length; i++){
            roomList[data.clubRoom[i].desknum] = data.clubRoom[i];
        }

        this.tableNode.getComponent('klb_friend_group_table_content').initTableList(roomList, data, config.game_table, this.clubOpen);

        this.gameRule =  data.rule;
    },

    // update (dt) {},

    onClickCreateGame(){
        hall_audio_mgr.com_btn_click();
        if(this.status != PLAYER_STATUS.NORMAL){
            clubMgr.setClubCreateRoomType(1);
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CREATE_ROOM, function (ui) {
                let Component = ui.getComponent("klb_friend_group_createRoom");
                if (clubMgr.getClubInfoByClubId(this.info.clubid) && clubMgr.getClubInfoByClubId(this.info.clubid).type == 1) {
                    Component.showClubGameList();
                }
                else {
                    Component.showGameList(0, this.info);
                }
                var ani = ui.getChildByName('actionnode').getComponent(cc.Animation);
                ani.play('klb_hall_createRoom');
            }.bind(this));
        }else{
            cc.dd.PromptBoxUtil.show('没有权限');
        }
    },

    onClickAdmin(){
        hall_audio_mgr.com_btn_click();
        if(this.status != PLAYER_STATUS.NORMAL){
            let prefab = prefab_config.KLB_FG_ADMIN;
            cc.dd.UIMgr.openUI(prefab, function(ui){
                ui.getComponent('klb_friend_group_adminNode').show(this.info, this.clubOpen);
            }.bind(this));
        }else{
            cc.dd.PromptBoxUtil.show('没有权限');
        }
    },

    onClickNotice(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_ANNOUNCEMENT)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_ANNOUNCEMENT, function(ui){
                ui.getComponent('klb_friend_group_announcement').show(null, this.status != PLAYER_STATUS.NORMAL);
                club_sender.getAnnouncement(this.info.clubid);
            }.bind(this));
        }
    },

    onClickBattle(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_BATTLE_HISTORY)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_BATTLE_HISTORY, function(ui){
                let clubid = this.info.clubid;
                if(this.status == PLAYER_STATUS.ADMIN){//给服务器判断是不是管理员
                    clubid += 1000000;
                }
                club_sender.getClubBattleList(clubid);
            }.bind(this));
        }
    },

    onClickApply(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_MEMBER)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_MEMBER, function(ui){
                ui.getComponent('klb_friend_group_managerMember').setMemberStatus(-1);
                club_sender.applyClubListReq(1, this.info.clubid);
            }.bind(this));
        }
    },

    onClickQuitFriendGroup(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function(ui){
                ui.getComponent('klb_friend_group_notice').show('确定要退出该亲友圈吗?',()=>{
                    club_sender.quitClub(this.info.clubid);
                });
            }.bind(this));
        }
    },

    onClickMemebrList(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_MEMBER_LIST)){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_MEMBER_LIST, function(ui){
                ui.getComponent('klb_friend_group_memberList').show();
                club_sender.managerClubReq(this.info.clubid);
            }.bind(this));
        }
    },

    onClickRule(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_ROOM_RULE) && this.gameRule){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_ROOM_RULE, function(ui){
                ui.getComponent('klb_friend_group_roomRule').setRule(this.gameRule);
            }.bind(this));
        }
    },

    onClickRefresh(){
        hall_audio_mgr.com_btn_click();

        if(this.refreshTime){
            return;
        }
        this.refreshTime = setTimeout(()=>{
            this.refreshTime = null;
        }, 3000);
        club_sender.refreshClub(this.info.clubid, this.wanFaNum);
    },

    onClickBuyCard(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_BUY_CARD)) {
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_BUY_CARD, function (ui) {
                ui.getComponent('klb_friend_group_card').initUI(this.info.clubid);
            }.bind(this));
        }
    },

    onClickChat(){
        hall_audio_mgr.com_btn_click();
        this.chat.getComponent('klb_friend_group_chat').show();
        this.chatNote.active = false;
        this.chatCountLabel.string = '0';
    },

    onClickCallWX(){
        hall_audio_mgr.com_btn_click();

        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('com/anglegame/blackjack/AppActivity', 'callWX', '()V');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod( 'AppController', 'callWX');
        }
    },

    onClickRank(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_RANK)) {
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RANK, function (ui) {
                ui.getComponent('klb_friend_group_rank').show();
            }.bind(this));
        }
    },

    onClickInvite(){
        hall_audio_mgr.com_btn_click();
        if(!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_INVITE_NODE)) {
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_INVITE_NODE, function (ui) {
                ui.getComponent('klb_friend_group_invite_node').show(this.info.clubid, this.info.clubname, this.info.ownername);
            }.bind(this));
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case WxEvent.DOWNLOAD_HEAD:
                break;
            case club_Event.CLUB_MANAGER_OP://打开管理界面
                break;
            case club_Event.CLUB_DESK_DELETE_PLAYER: //请出玩家
                if(this.info.clubid == data.clubId && this.wanFaNum == data.wanfanum){
                    this.tableNode.getComponent('klb_friend_group_table_content').updateTablePlayer(data.deskId, data.kickUserId);
                }

                break;
            case club_Event.CLUB_DISSOLVE_GAME_DESK: //解散俱乐部桌子
                club_sender.refreshClub(this.info.clubid, this.wanFaNum);
                break;
            case club_Event.CLUB_CARDS_UPDATE://俱乐部房卡存入更新
                this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());
                this.card.string = data.cards;
                break;
            case club_Event.CLUB_CHANGE_RIGHTS: //俱乐部更新权限
                if(data[0] == cc.dd.user.id && this.info.clubid == data[2]){
                    this.updateUI();
                }
                break;
            case club_Event.CLUB_CREATE_MATCH_SUCCESS: //代开房间成功
                break;
            case club_Event.CLUB_CLOSE_MAINUI: //关掉主界面
                break;
            case club_Event.CLUB_kICK_PLAYER_OUT://被请出俱乐部
                break;
            case club_Event.CLUB_APPLY_NUM_CHANGE://俱乐部申请提示
                if (data == 1){
                    this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());
                    this.applyButton.active = this.info.applyNum != 0 && this.status != PLAYER_STATUS.NORMAL;
                    this.applyCountLabel.string = this.info.applyNum > 99 ? '99' : this.info.applyNum;
                } else if (data == 2) {
                    // this.tipsNode.active = false;
                    clubMgr.reseatApplyNum(clubMgr.getSelectClubId());
                }
                break;
            case club_Event.CLUB_CHANGE_SCORE:
                break;
            case club_Event.CLUB_UPDATE_SCORE:
                // let member = clubMgr.getClubMember(cc.dd.user.id);
                // if(member){
                //     this.scoreLabel.string = member.score
                // }else{
                //     this.scoreLabel.string = '0';
                // }
                this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());
                this.scoreLabel.string = this.info.userScore;
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                break;
            case RoomEvent.on_choose_seat:
                break;
            case club_Event.CLUB_REQ_APPLY_LIST: //请求申请列表返回
            case club_Event.CLUB_OP_APPLY_PLAYER: //操作玩家成功
                this.applyButton.active = clubMgr.getClubApplyList().length != 0 && this.status != PLAYER_STATUS.NORMAL;
                this.applyCountLabel.string = clubMgr.getClubApplyList().length > 99 ? '99' : clubMgr.getClubApplyList().length;
                break;
            case club_Event.CLUB_CHANGE_NAME:
                this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());
                this.clubTitle.string =this.info.clubname;
                    break;
            case club_Event.FRIEND_UPDATE_ROOM:
                this.updateRoom();
                break;
            case club_Event.FRIEND_CREATE_ROOM:
                if(this.status != PLAYER_STATUS.NORMAL){
                    this.initRoom = true;
                }
                club_sender.getClubBaoFangList(this.info.clubid);
                break;
            case club_Event.FRIEND_BAOFANG_DETAIL:
            case club_Event.CLUB_REFRESH_DESK://刷新俱乐部桌子列表
                this.info = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId());
                this.updateRoomInfo(data);
                break;
            case club_Event.FRIEND_GROUP_DELETE_ROOM:
                club_sender.getClubBaoFangList(this.info.clubid);
                this.initRoom = true;
                break;
            case club_Event.FRIEND_GROUP_CHAT_BROADCAST:
            case club_Event.FRIEND_GROUP_CHAT_DESK_BROADCAST:
                this.chatNote.active = !this.chat.getComponent('klb_friend_group_chat').isShow;
                if(this.chatNote.active){
                    this.chatCountLabel.string = (parseInt(this.chatCountLabel.string)+1).toString();
                }else{
                    this.chatCountLabel.string = '0';
                }
                break;
            case club_Event.FRIEND_GROUP_UPDATE_BAOFANG_INFO:
                if(this.info.clubid == data.clubId && this.wanFaNum == data.wanfanum){
                    this.tableNode.getComponent('klb_friend_group_table_content').updateTable(data);
                    this.gamingTable.string = cc.dd._.isNumber(data.deskWorkSum) ? data.deskWorkSum : 0;
                    this.waitingTable.string = cc.dd._.isNumber(data.deskWaitSum) ? data.deskWaitSum : 0;
                }
                break;
            case club_Event.FRIEND_GROUP_STATE:
                if(this.info.clubid == data.clubId){
                    this.clubOpen = data.state != 2;
                    this.info.state = data.state;

                    this.closeInfo.active = !this.clubOpen;
                    if(this.tableNode.active){
                        this.tableNode.getComponent('klb_friend_group_table_content').updateTableState(this.clubOpen);
                    }
                }
                break;
            default:
                break;
        }
    },

    getGameRule(rule){
        let _gameRule = null;
        for (var attr in rule.rule) {
            if (attr.endsWith('ule') || attr.endsWith('uleNew')) {
                _gameRule = rule.rule[attr];
                break;
            }
        }
        let strRule = GetGameRules.getRuleStr(rule.gameInfo.gameType, _gameRule);
        // strRule.unshift(rule.gameInfo.multiple+'倍场');
        let _rule = cc.dd.Utils.subChineseStr(strRule.join('/'), 0 , 30);
        let str = '<color=#FFFFFF>{0} </c><color=#EEEF86><u>详细规则</u></color>'.format([_rule]);
        return str;
    },

    onClickShare(){
        hall_audio_mgr.com_btn_click();
        if(this.status != PLAYER_STATUS.NORMAL){
            let prefab = prefab_config.KLB_FG_SHARE_ROOM;
            cc.dd.UIMgr.openUI(prefab, function(ui){
                ui.getComponent('klb_friend_group_shareNode').show(this.wanFaNum, this.info.clubid, this.info.clubname, this.info.ownername);
            }.bind(this));
        }else{
            cc.dd.PromptBoxUtil.show('没有权限');
        }
    }
});
