var hall_audio_mgr = require('hall_audio_mgr').Instance();
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const game_List = require('klb_gameList');
let GetGameRules = require('GetGameRules');
let prefab_config = require('klb_friend_group_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
    },

    onLoad(){

    },

    show(wanfa, clubID, clubName, ownerName){
        this.wanfa = wanfa;
        this.clubID = clubID;
        this.clubName = clubName;
        this.ownerName = ownerName;

        this.info = club_Mgr.getRoomInfo(this.clubID, this.wanfa);

        this.gameName = '';
        let config = game_List.getItem(function (item) {
            return item.gameid == this.info.rule.gameInfo.gameType;
        }.bind(this));
        if(config){
            this.gameName = config.name
        }

        this.title.string = this.gameName;

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
        hall_audio_mgr.com_btn_click();
        this._close();
    },

    _close(){
        if(this._waitAdminAnima){
            return;
        }

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

    onClickShare(){
        hall_audio_mgr.com_btn_click();

        if (cc.sys.isNative) {
            let _gameRule = null;
            for (var attr in this.info.rule.rule) {
                if (attr.endsWith('ule') || attr.endsWith('uleNew')) {
                    _gameRule = this.info.rule.rule[attr];
                    break;
                }
            }
            let _ruleStr = GetGameRules.getRuleStr(this.info.rule.gameInfo.gameType, _gameRule);

            let today = new Date();

            let data = {
                clubName: this.clubName,
                clubID: this.clubID,
                ownerName: this.ownerName,
                title: this.gameName,
                rule: cc.dd.Utils.subChineseStr(_ruleStr.join(' '), 0, 110),
                delayTime: today.setDate(today.getDate() + 2),
                wanfa: this.wanfa,
            }

            cc.dd.native_wx.SendAppInvite(data, this.clubName, "【" + this.gameName + "】邀请你加入我的包厢和小伙伴一起愉快玩耍", 'http://dispense.yuejiegame.cn/circle', 0xFFFF);
        }
    },

    onClickBackName(){
        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CHANGE_BAOXIANG_NAME, function (ui) {
            let Component = ui.getComponent("klb_friend_group_changeBaoXiangName");
            Component.show(this.clubID, this.wanfa);
        }.bind(this));
        this._close();
    }
});
