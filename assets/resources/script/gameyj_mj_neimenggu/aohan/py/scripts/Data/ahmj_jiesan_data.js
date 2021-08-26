var JieSanData = require('jlmj_jiesan_data');

var AHMJJieSanData = cc.Class({
    extends: JieSanData.JieSanData,

    statics: {

        s_jiesan_data: null,

        Instance: function () {
            if(!this.s_jiesan_data){
                this.s_jiesan_data = new AHMJJieSanData();
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
    JieSanData:AHMJJieSanData,
    AgreeStatus:JieSanData.AgreeStatus,
};