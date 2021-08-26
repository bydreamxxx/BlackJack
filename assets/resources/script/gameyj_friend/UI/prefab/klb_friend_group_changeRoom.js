var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
const club_sender = require('jlmj_net_msg_sender_club');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const klb_game_Confg = require('klb_gameList');
let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem:{
            default: null,
            type: cc.Prefab,
            tooltip: '组件'
        },

        content:{
            default: null,
            type: cc.Node,
            tooltip: '容器'
        },
    },

    show(roomInfo){
        this.content.removeAllChildren();
        let clubInfo = club_Mgr.getClubInfoByClubId(club_Mgr.getSelectClubId());
        if(clubInfo){
            for(let i = 0; i < roomInfo.length; i++){
                let gameInfo = roomInfo[i].rule.gameInfo;

                let gametype = gameInfo.gameType;

                if(gametype == cc.dd.Define.GameType.SYMJ_FRIEND){
                    if(roomInfo[i].rule.rule.mjSongyuanRule.symjtype == 2){
                        gametype = cc.dd.Define.GameType.SYMJ_FRIEND_2
                    }
                }
                let config = klb_game_Confg.getItem((item)=>{
                    return item.gameid == gametype;
                });

                let gameName;
                if(config){
                    gameName = config.name;
                }

                let addItem = cc.instantiate(this.prefabItem);
                addItem.getComponent('klb_friend_group_changeRoomItem').initUI(i, roomInfo[i].id, cc.dd.user.clubJob != MEMBER.NORMAL, null, gameName, roomInfo[i].backName);
                this.content.addChild(addItem);
            }

            if(cc.dd.user.clubJob != MEMBER.NORMAL && roomInfo.length < 5){
                let addItem = cc.instantiate(this.prefabItem);
                addItem.getComponent('klb_friend_group_changeRoomItem').initAdd();
                this.content.addChild(addItem);
            }
        }
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
