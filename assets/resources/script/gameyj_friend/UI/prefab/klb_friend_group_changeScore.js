var hall_audio_mgr = require('hall_audio_mgr').Instance();
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        playerScore:{
            default: null,
            type: cc.Label,
            tooltip: "玩家分数",
        },

        groupScore:{
            default: null,
            type: cc.Label,
            tooltip: "亲友圈分数",
        },

        icon:{
            default: null,
            type: cc.Sprite,
            tooltip: "增减图标",
        },

        iconSprite:{
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "图标图集",
        },

        editBox:{
            default: null,
            type: cc.EditBox,
            tooltip: "输入框",
        },

        title:{
            default: null,
            type: cc.Label,
            tooltip: "标题",
        },

        button:{
            default: null,
            type: cc.Sprite,
            tooltip: "按钮",
        },

        buttonSprite:{
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "按钮图集",
        }
    },

    onLoad(){
        club_Ed.addObserver(this);
    },

    onDestroy(){
        club_Ed.removeObserver(this);
    },

    setInfo(playerData, clubId, status){
        this.clubInfo = clubMgr.getClubInfoByClubId(clubId);
        this.playerData = playerData;
        this.status = status;
        if(status == 3){
            this.title.string = '增加分数';
            this.icon.spriteFrame = this.iconSprite[0];
            this.button.spriteFrame = this.buttonSprite[0];
        }else{
            this.title.string = '减少分数';
            this.icon.spriteFrame = this.iconSprite[1];
            this.button.spriteFrame = this.buttonSprite[1];
        }

        this.groupScore.string = this.clubInfo.clubScore;
        this.playerScore.string = this.playerData.score;
    },

    onClickButton(){
        if (this.editBox.string == '' || parseInt(this.editBox.string) <= 0) {
            cc.dd.PromptBoxUtil.show('请输入正确的金额');
            return;
        }else if(this.status == 3 && parseInt(this.editBox.string) > this.clubInfo.clubScore){
            cc.dd.PromptBoxUtil.show('不能超出亲友圈分数');
            return;
        }else if(this.status != 3 && this.playerData.score < parseInt(this.editBox.string)){
            cc.dd.PromptBoxUtil.show('玩家分数不能低于0分');
            return;
        }
        hall_audio_mgr.com_btn_click();
        let add = parseInt(this.editBox.string);
        let score = this.status != 3 ? -add : add;
        var obj = new cc.pb.club.msg_club_change_score_req();
        obj.setClubId(this.clubInfo.clubid);
        obj.setUserId(this.playerData.userid);
        obj.setScore(score);
        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_change_score_req, obj, 'msg_club_change_score_req', true);
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    changeScore(data){
        this.groupScore.string = data.clubScore;
        this.playerScore.string = data.userScore;
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.CLUB_CHANGE_SCORE:
                this.changeScore(data);
                break;
            default:
                break;
        }
    },
});
