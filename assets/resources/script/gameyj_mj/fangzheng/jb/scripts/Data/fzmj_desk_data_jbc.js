var jlmj_desk_jbc_data = require("base_mj_desk_data_jbc");
var instance = null;

var FZMJDeskDataJBC = cc.Class({
    extends: jlmj_desk_jbc_data,

    statics: {
        /**
         * 获取实例
         */
        getInstance: function() {
            if( cc.dd.Utils.isNull( instance ) ) {
                instance = new FZMJDeskDataJBC();
            }
            return instance;
        },
    },

    clear:function () {

    },
});

module.exports = FZMJDeskDataJBC;
