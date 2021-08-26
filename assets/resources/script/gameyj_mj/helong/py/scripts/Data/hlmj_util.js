let mj_util = require('base_mj_util');


var hlmj_util = cc.Class({
    extends: mj_util,

    statics: {

        Instance: function () {
            if (!this.s_util) {
                this.s_util = new hlmj_util();
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
        cc.dd.SceneManager.enterRoomList(cc.dd.Define.GameType.HLMJ_GOLD);
    },

    initMJComponet(){
        return require("mjComponentValue").hlmj;
    }
});

module.exports = hlmj_util;
