var mj_shezhi_menu = require("base_mj_shezhi_menu");

cc.Class({
    extends: mj_shezhi_menu,


    upDateUI:function () {
        this._super();
        this.tuoguanBtn.interactable = true;
    },

    /**
     * 托管
     */
    tuoguanFunc:function () {
        const req = new cc.pb.wudanmj.wudan_req_update_deposit();
        req.setIsdeposit(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.wudanmj.cmd_wudan_req_update_deposit,req,"p16_req_update_deposit", true);
    },

    onClickGPS() {
        this.require_jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(this.require_jlmj_prefab.NMMJ_GPS, (ui) => {
            ui.getComponent('jlmj_gps').setGpsData(this.require_playerMgr.Instance().playerList);
        });
        this.closeBtnCallBack();
    },

    initMJComponet(){
        return require('mjComponentValue').wdmj;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },
});
