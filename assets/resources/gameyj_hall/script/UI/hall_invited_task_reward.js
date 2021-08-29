var hall_audio_mgr = require('hall_audio_mgr');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    updateUI(coin) {
        cc.find("reward1", this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin) + "金币";
        cc.find("reward2", this.node).getComponent(cc.Label).string = "恭喜你获得" + cc.dd.Utils.getNumToWordTransform(coin) + "金币";
    },

    // update (dt) {},

    onClickClose() {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickGoMatch() {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        //todo 斗地主1元红包赛报名接口,报名成功打开报名界面
        var Bsc = require('bsc_data');
        Bsc.BSC_Data.Instance().clearData();
        cc.dd.quickMatchType = 'ddz_kuai_su_sai';
        cc.dd.SceneManager.enterHallMatch();
    },

});
