var mj_shezhi_menu = require("base_mj_shezhi_menu");

cc.Class({
    extends: mj_shezhi_menu,

    initMJComponet(){
        return require('mjComponentValue').hlmj;
    }
});
