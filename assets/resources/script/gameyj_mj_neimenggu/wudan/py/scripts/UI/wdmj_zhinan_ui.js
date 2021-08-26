var mj_zhinan_ui = require('base_mj_zhinan_ui');

let mjzhinan = cc.Class({
    extends: mj_zhinan_ui,

    initMJComponet() {
        return require("mjComponentValue").wdmj;
    }
});
module.exports = mjzhinan;