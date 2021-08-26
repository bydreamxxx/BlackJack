var JieSanData = require('base_mj_jiesan_data');

var HLMJJieSanData = cc.Class({
    extends: JieSanData.JieSanData,

    statics: {

        s_jiesan_data: null,

        Instance: function () {
            if(!this.s_jiesan_data){
                this.s_jiesan_data = new HLMJJieSanData();
            }
            return this.s_jiesan_data;
        },

        Destroy: function () {
            if(this.s_jiesan_data){
                this.s_jiesan_data = null;
            }
        },

    },
});

module.exports = {
    JieSanData:HLMJJieSanData,
    AgreeStatus:JieSanData.AgreeStatus,
};