let mj_util = require('base_mj_util');


var fzmj_util = cc.Class({
    extends: mj_util,

    statics: {

        Instance: function () {
            if (!this.s_util) {
                this.s_util = new fzmj_util();
            }
            return this.s_util;
        },

        Destroy: function () {
            if (this.s_util) {
                this.s_util = null;
            }
        },

    },

    _enterRoomList(){
        cc.dd.SceneManager.enterRoomList(cc.dd.Define.GameType.FZMJ_GOLD);
    },

    initMJComponet(){
        return require("mjComponentValue").fzmj;
    }
});

module.exports = fzmj_util;
