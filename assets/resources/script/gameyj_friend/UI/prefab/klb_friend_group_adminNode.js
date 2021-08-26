let prefab_config = require('klb_friend_group_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties:{
        todayCard: {
            default: null,
            type: cc.Label,
            tooltip: '今日已用房卡'
        },
        lastCard: {
            default: null,
            type: cc.Label,
            tooltip: '剩余房卡'
        },
        cardNode:{
            default: null,
            type: cc.Node,
            tooltip: '房卡节点'
        },
        scoreNdoe:{
            default: null,
            type: cc.Node,
            tooltip: '积分节点'
        },
        score:{
            default: null,
            type: cc.Label,
            tooltip: '剩余积分'
        },

        itemTitle1:{
            default: null,
            type: cc.Label,
            tooltip: '组件名称'
        },

        openButton:{
            default: null,
            type: cc.Node,
            tooltip: '开张'
        },

        closeButton:{
            default: null,
            type: cc.Node,
            tooltip: '打烊'
        }
    },

    onLoad(){
        if(this.openButton){
            this.openButton.active = false;
        }
        if(this.closeButton){
            this.closeButton.active = false;
        }
    },

    show(data, clubOpen){
        this.info = data;

        if(this.openButton){
            this.openButton.active = !clubOpen;
        }
        if(this.closeButton){
            this.closeButton.active = clubOpen;
        }

        this.cardNode.active = this.info.type == 0;
        this.scoreNdoe.active = this.info.type == 1;
        this.itemTitle1.string = this.info.type == 0 ? '存入房卡' : '积分管理';

        this.score.string = this.info.clubScore;
        this.lastCard.string = this.info.cards+'张';
        this.todayCard.string = '0'+'张';

        if(this._waitAdminAnima){
            return;
        }
        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.node.active = true;
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
            })
        ));
    },

    close(){
        if(this._waitAdminAnima){
            return;
        }
        hall_audio_mgr.com_btn_click();

        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.node.scaleX = 1;
        this.node.scaleY = 1;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                cc.dd.UIMgr.closeUI(prefab_config.KLB_FG_ADMIN);
            })
        ))
    },

    onClickChangeName(){
        this.close();

        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CHANGE_CLUB_NAME, function(ui){
            ui.getComponent('klb_friend_group_changeClubName').setClubId(this.info.clubid);
        }.bind(this));
    },

    onClickMember(){
        this.close();

        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_MEMBER, function(ui){
            ui.getComponent('klb_friend_group_managerMember').setMemberStatus(0);
            club_sender.managerClubReq(this.info.clubid);
        }.bind(this));
    },

    onClickDissolve(){
        this.close();
        if(cc.dd.user.clubJob == MEMBER.OWNER){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_DISSOLVE);
        }else{
            cc.dd.PromptBoxUtil.show('没有权限，不能解散亲友圈');
        }
    },

    onClickCard(){
        if(cc.dd.user.clubJob == MEMBER.OWNER){
            if(this.info.type == 0){
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_BUY_CARD, function(ui){
                    ui.getComponent('klb_friend_group_card').initUI(this.info.clubid);
                }.bind(this));
            }else{
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_MEMBER, function(ui){
                    ui.getComponent('klb_friend_group_managerMember').setMemberStatus(1);
                    club_sender.managerClubReq(this.info.clubid);
                }.bind(this));
            }
        }else{
            cc.dd.PromptBoxUtil.show('没有权限，不能操作房卡');
        }
        this.close();
    },

    onClickOpenClose(event, data){
        this.close();
        if(data == 'open'){
            club_sender.openTable(this.info.clubid);
        }else{
            club_sender.closeTable(this.info.clubid);
        }
    }
});
