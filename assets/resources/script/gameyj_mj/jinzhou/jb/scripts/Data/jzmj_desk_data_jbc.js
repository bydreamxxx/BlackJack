var jlmj_desk_jbc_data = require("jlmj_desk_jbc_data");
var instance = null;

var JZMJDeskDataJBC = cc.Class({
    extends: jlmj_desk_jbc_data,

    statics: {
        /**
         * 获取实例
         */
        getInstance: function() {
            if( cc.dd.Utils.isNull( instance ) ) {
                instance = new JZMJDeskDataJBC();
            }
            return instance;
        },
    },

    clear:function () {

    },
});

module.exports = JZMJDeskDataJBC;
