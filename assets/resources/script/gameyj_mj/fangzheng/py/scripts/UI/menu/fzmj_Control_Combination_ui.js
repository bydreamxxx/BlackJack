var jlmj_Control_Combination_ui = require( "base_mj_Control_Combination_ui" );

var sh_ControlCombinationUi = cc.Class({
    extends: jlmj_Control_Combination_ui,

    s_instance:null,

    statics: {

        Instance: function () {
            if (!this.s_instance) {
                this.s_instance = new sh_ControlCombinationUi();
            }
            return this.s_instance;
        },

        Destroy: function () {
            if (this.s_instance) {
                this.s_instance.close();
                this.s_instance = null;
            }
        },

    },

    initMJComponet(){
        return require('mjComponentValue').fzmj;
    }
});

module.exports = sh_ControlCombinationUi;