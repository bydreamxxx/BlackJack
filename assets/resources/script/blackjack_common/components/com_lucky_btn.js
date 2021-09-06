let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
let hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onClick() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('blackjack_common/prefab/com_my_luckybag');
        HallCommonEd.notifyEvent(HallCommonEvent.LUCKY_STOP_TIMER, null);
    },

    // update (dt) {},
});
