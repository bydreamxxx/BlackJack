var mj_shezhi_menu = require("base_mj_shezhi_menu");

cc.Class({
    extends: mj_shezhi_menu,

    /**
     * 托管
     */
    tuoguanFunc:function () {
        const req = new cc.pb.fangzhengmj.fangzheng_req_update_deposit();
        req.setIsdeposit(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_update_deposit,req,"fangzheng_req_update_deposit", true);

    },

    initMJComponet(){
        return require('mjComponentValue').fzmj;
    }
});
