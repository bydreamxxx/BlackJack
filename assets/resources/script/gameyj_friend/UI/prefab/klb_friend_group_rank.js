var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        actionNode:{
            default: null,
            type: cc.Node,
            tooltip: "动画节点"
        },

        toggles:{
            default: [],
            type: cc.Toggle,
            tooltip: "单选按钮"
        },

        checkedColor:{
            default: new cc.Color(),
            tooltip: "选中颜色"
        },

        unCheckedColor:{
            default: new cc.Color(),
            tooltip: "未选中颜色"
        },

        contents:{
            default: [],
            type: require('klb_friend_group_rankScrollView'),
            tooltip: "容器"
        },

        gameButton:{
            default: null,
            type: cc.Node,
            tooltip: "游戏按钮"
        },

        gameButtonLabel:{
            default: null,
            type: cc.Label,
            tooltip: "游戏按钮"
        },

        gameToggle:{
            default: null,
            type: cc.Toggle,
            tooltip: "选择游戏"
        },

        gameScrollview:{
            default: null,
            type: cc.Node,
            tooltip: "游戏列表"
        },

        gameTip:{
            default: null,
            type: cc.Node,
            tooltip: "箭头"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        club_Ed.addObserver(this);
    },

    onDestroy(){
        club_Ed.removeObserver(this);
    },

    start () {
    },

    show(){
        if(this._waitAdminAnima){
            return;
        }

        this.actionNode.active = true;
        // this.actionNode.scaleX = 0;
        // this.actionNode.scaleY = 0;

        this._waitAdminAnima = true;
        this.actionNode.stopAllActions();
        this.actionNode.runAction(cc.sequence(
            // cc.scaleTo(0.2, 1, 1),
            cc.callFunc(()=>{
                let gameInfo = this.gameScrollview.getComponent('klb_friend_group_rankGameScrollView').getFirstInfo();
                this.gameType = gameInfo.gameType;
                this.gameButtonLabel.string = gameInfo.gameName;

                this.gameToggle.uncheck();
                this.toggles[0].check();
                this.updateToggle();
                this.chooseToggle = 1;
            }),
            cc.delayTime(0.1),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                this.getRank();
            })
        ));
    },

    //关闭按钮
    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    updateToggle(){
        this.toggles.forEach((toggle)=>{
            let label = cc.find('New Label', toggle.node);
            let background = cc.find('Background', toggle.node);
            if(toggle.isChecked){
                label.color = this.checkedColor;
                background.active = false;
            }else{
                label.color = this.unCheckedColor;
                background.active = true;
            }
        })
    },

    onClickToggle(event, data){
        this.updateToggle();
        this.chooseToggle = parseInt(data);
        this.getRank();
    },

    onClickGameToggle(){
        if(this.gameToggle.isChecked){
            this.gameScrollview.active = true;

            // this.gameScrollview.stopAllActions();
            // this.gameScrollview.scaleY = 0;
            // this.gameTip.scaleY = -1;
            // this.gameScrollview.runAction(cc.sequence(
            //     cc.scaleTo(0.1, 1, 1),
            //     cc.callFunc(()=>{
                    this.gameTip.scaleY = 1;
                // })
            // ));

            this.toggles.forEach((toggle)=>{
                toggle.interactable = false;
            });
        }else{
            this.gameScrollview.active = false;

            // this.gameScrollview.stopAllActions();
            // this.gameScrollview.scaleY = 1;
            // this.gameTip.scaleY = 1;
            // this.gameScrollview.runAction(cc.sequence(
            //     cc.scaleTo(0.1, 1, 0),
            //     cc.callFunc(()=>{
                    this.gameTip.scaleY = -1;
                // })
            // ));

            this.toggles.forEach((toggle)=>{
                toggle.interactable = true;
            });
        }
    },

    onClickButton(event, data){
        hall_audio_mgr.com_btn_click();

        this.gameType = event.target.tagname.gameType;
        this.gameButtonLabel.string = event.target.tagname.gameName;
        this.gameToggle.uncheck();

        this.getRank();
    },

    getRank(){
        let rank = club_Mgr.getRankList(club_Mgr.getSelectClubId(), this.gameType, this.chooseToggle)
        if(cc.dd._.isNull(rank)){
            this.contents[0].setData(null, 1);
            this.contents[1].setData(null, 2);
            this.contents[2].setData(null, 3);
            club_sender.getRank(club_Mgr.getSelectClubId(), this.chooseToggle, this.gameType)
        }else{
            this.updateRank(rank);
        }
    },

    updateRank(rank, rankType){
        if(cc.dd._.isNumber(rankType)){//单独更新
            this.contents[rankType-1].setData(rank, rankType);
        }else{
            this.contents[0].setData(rank, 1);
            this.contents[1].setData(rank, 2);
            this.contents[2].setData(rank, 3);
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
            case club_Event.FRIEND_GROUP_UPDATE_RANK:
                let rank = club_Mgr.getRankList(club_Mgr.getSelectClubId(), this.gameType, this.chooseToggle)
                this.updateRank(rank, data.rankType);
                break;
            default:
                break;
        }
    },
});
