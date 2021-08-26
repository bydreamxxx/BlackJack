let mj_util = require('base_mj_util');

var pzmj_util = cc.Class({
    extends: mj_util,

    statics: {

        Instance: function () {
            if (!this.s_util) {
                this.s_util = new pzmj_util();
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
        cc.dd.SceneManager.enterRoomList(cc.dd.Define.GameType.PZMJ_GOLD);
    },

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    }
});

module.exports = pzmj_util;
