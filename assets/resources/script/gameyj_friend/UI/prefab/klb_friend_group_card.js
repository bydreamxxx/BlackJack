// create by wj 2018/04/24
const club_sender = require('jlmj_net_msg_sender_club');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var HallPropData= require('hall_prop_data').HallPropData.getInstance();
const club_Ed =  require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        cardRichText : cc.Label,
        roomCardRichText: cc.Label,
    },

    onLoad: function() {
        this.checkCount = 10;
        this.clubId = 0;
        club_Ed.addObserver(this);
    },

    onDestroy:function () {
        club_Ed.removeObserver(this);
    },


    //初始化界面
    initUI: function(clubId){
        const clubInfo = clubMgr.getClubInfoByClubId(clubId);
        if(clubInfo){
            //背包中的房卡
            var str = (HallPropData.getRoomCard()|| 0) +'张';
            this.cardRichText.string = str;
            //俱乐部中的房卡余额
            var str1 = clubInfo.cards +'张';
            this.roomCardRichText.string = str1;
            this.clubId = clubInfo.clubid;
        }
    },

    //选择房卡数
    onSelectCardCount: function(event,  data){
        this.checkCount = parseInt(data);
    },

    //存入俱乐部
    onClickSave: function(event, data){
        hall_audio_mgr.com_btn_click();
        club_sender.saveCardToClub(this.checkCount, this.clubId);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case club_Event.CLUB_CARDS_UPDATE://俱乐部房卡存入更新
                cc.dd.UIMgr.destroyUI(this.node);
                break;
            default:
                break;
        }
    },

    //打开商城
    onClickShop: function (event, data) {
        if(cc._useChifengUI) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SHOP);
        }else if(cc._useCardUI){
            cc.dd.PromptBoxUtil.show('NOT YET OPEN');
        }else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                ui.getComponent('klb_hall_ShopLayer').gotoPage('FK');
                // ui.setLocalZOrder(5000);
            }.bind(this));
        }
    },
});
