//created by luke on 2019/8/13
var hallData = require('hall_common_data').HallCommonData;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        headSP: cc.Sprite,//头像
        nameLBL: cc.Label,//昵称
        idLBL: cc.Label,//id
        cardLBL: cc.Label,//房卡
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setUserInfo(hallData.getInstance());
        HallCommonEd.addObserver(this);
    },

    onDestroy() {
        HallCommonEd.removeObserver(this);
    },

    setUserInfo(userInfo) {
        if (this.headSP)
            cc.dd.SysTools.loadWxheadH5(this.headSP, userInfo.headUrl);
        if (this.nameLBL)
            this.nameLBL.string = cc.dd.Utils.substr(userInfo.nick, 0, 4);
        if (this.idLBL)
            this.idLBL.string = userInfo.userId + '';
        if (this.cardLBL)
            this.cardLBL.string = HallPropData.getRoomCard() || '0';
    },

    updateCoinAndCard(coin, card) {
        if (this.cardLBL)
            this.cardLBL.string = card + '';
    },

    onEventMessage(event, data) {
        switch (event) {
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.updateCoinAndCard(data.getCoin(), data.getRoomCard());
                break;
            default:
                break;
        }
    },

    closeBtn(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // update (dt) {},
});
