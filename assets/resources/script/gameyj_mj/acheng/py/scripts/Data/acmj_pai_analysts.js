var jlmj_pai_analysts = require('base_mj_pai_analysts');

var sh_PaiAnalysts = cc.Class({

    extends:jlmj_pai_analysts,

    cc_s_analysts: null,

    statics: {

        Instance: function () {
            if(!this.cc_s_analysts){
                this.cc_s_analysts = new sh_PaiAnalysts();
            }
            return this.cc_s_analysts;
        },

        Destroy: function () {
            if(this.cc_s_analysts){
                this.cc_s_analysts = null;
            }
        },

    },

    initMJComponet(){
        return require("mjComponentValue").acmj;
    }

});

module.exports = sh_PaiAnalysts;