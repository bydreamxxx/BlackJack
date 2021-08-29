var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_sender = require('jlmj_net_msg_sender_club');
let MEMBER = require('klb_friend_group_enum').MEMBER;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();

const GOLD = [18888, 88888, 188888, 888888];
const RED_BAG = [10, 50, 100, 500];

cc.Class({
    extends: cc.Component,

    properties: {
        mask:{
            default: null,
            type: cc.Node,
            tooltip: '遮罩'
        },

        coinLabel:{
            default: null,
            type: cc.Label,
            tooltip: '我的余额'
        },

        changeButton:{
            default: null,
            type: cc.Sprite,
            tooltip: '切换按钮'
        },

        changeButtonSprites:{
            default: [],
            type: cc.SpriteFrame,
            tooltip: '切换按钮图集'
        },

        coinEditbox:{
            default: null,
            type: cc.EditBox,
            tooltip: '发放金额'
        },

        redBagEditbox:{
            default: null,
            type: cc.EditBox,
            tooltip: '红包个数'
        },

        playerCount:{
            default: null,
            type: cc.Label,
            tooltip: '玩家人数'
        },

        coinButton:{
            default: [],
            type: cc.Label,
            tooltip: '玩家人数'
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isGold = true;
        this.memberCount = 0;
        this.updateUI();
    },

    updateUI(){
        this.config = this.isGold ? GOLD : RED_BAG;
        for(let i = 0; i < this.coinButton.length; i++){
            this.coinButton[i].string = this.config[i];
        }

        this.coinEditbox.string = '';
        this.redBagEditbox.string = '';

        if(this.isGold){
            this.changeButton.spriteFrame = this.changeButtonSprites[0];
            this.coinEditbox.placeholder = '不得小于10000';
            this.coinLabel.string = '我的余额：'+HallPropData.getCoin();
        }else{
            this.changeButton.spriteFrame = this.changeButtonSprites[1];
            this.coinEditbox.placeholder = '不得小于1';
            this.coinLabel.string = '我的余额：'+(HallPropData.getItemInfoByDataId(1004).count / 100).toFixed(1);
        }
    },

    show(){
        if(this._waitAdminAnima){
            return;
        }
        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.isGold = true;
        this.memberCount = 0;
        this.updateUI();

        this.mask.active = false;
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        this.node.active = true;

        this.changeButton.node.active = cc.dd.user.clubJob == MEMBER.OWNER;
        let clubInfo = clubMgr.getClubInfoByClubId(clubMgr.getSelectClubId())
        if(clubInfo){
            this.memberCount = clubInfo.memberLength;
        }else{
            this.memberCount = 1;
        }
        this.playerCount.string = '共'+this.memberCount+'人';

        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(()=>{
                this.mask.active = true;
                this._waitAdminAnima = false;
            })
        ));
    },

    close(){
        if(this._waitAdminAnima){
            return;
        }

        this.mask.active = false;
        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.node.scaleX = 1;
        this.node.scaleY = 1;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                cc.dd.UIMgr.destroyUI(this.node);
            })
        ))
    },

    onClickCoinButton(target, data){
        hall_audio_mgr.com_btn_click();
        this.coinEditbox.string = this.config[parseInt(data)];
    },

    onClickRedBagButton(target, data){
        hall_audio_mgr.com_btn_click();
        if(data != '-1' && parseInt(data) < this.memberCount){
            this.redBagEditbox.string = data;
        }else{
            this.redBagEditbox.string = this.memberCount;
        }
    },

    onClickSendRedBag(){
        hall_audio_mgr.com_btn_click();

        if(this.coinEditbox.string.length == 0){
            cc.dd.PromptBoxUtil.show('发放金额不能为空');
            return;
        }else if(this.redBagEditbox.string.length == 0){
            cc.dd.PromptBoxUtil.show('发放人数不能为空');
            return;
        }

        let coins = 0;

        if(this.isGold){
            coins = parseInt(this.coinEditbox.string);
            if(coins < 10000){
                cc.dd.PromptBoxUtil.show('发放金额不能少于10000');
                return;
            }else if(coins > HallPropData.getCoin()){
                cc.dd.PromptBoxUtil.show('发放金额不能大于所持金额');
                return;
            }
        }else{
            coins = parseFloat(this.coinEditbox.string).toFixed(2);

            if(coins < 1){
                cc.dd.PromptBoxUtil.show('发放金额不能少于1');
                return;
            }else if(coins * 100 > HallPropData.getItemInfoByDataId(1004).count){
                cc.dd.PromptBoxUtil.show('发放金额不能大于所持红包券');
                return;
            }
        }

        let _sum = parseInt(this.redBagEditbox.string);

        if(_sum <= 0){
            cc.dd.PromptBoxUtil.show('发放人数不能为0');
            return;
        }else if(_sum > this.memberCount){
            cc.dd.PromptBoxUtil.show('发放人数不能超过最大人数');
            return;
        // }else if(_sum == this.memberCount){
        //     _sum = 0;
        }
        club_sender.sendRedBag(clubMgr.getSelectClubId(), this.isGold ? 1 : 2, this.isGold ? coins : coins * 100, _sum);

        this.close();
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        this.close();
    },

    onClickChangeState(){
        hall_audio_mgr.com_btn_click();
        this.isGold = !this.isGold;
        this.updateUI();
    }
});
