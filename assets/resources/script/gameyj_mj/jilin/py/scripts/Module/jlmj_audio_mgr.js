var AudioPath = require( "jlmj_audio_path" );

var jlmj_audio_mgr = cc.Class({

    statics: {
        s_jlmj_audio_mgr: null,

        Instance: function () {
            if(!this.s_jlmj_audio_mgr){
                this.s_jlmj_audio_mgr = new jlmj_audio_mgr();
            }
            return this.s_jlmj_audio_mgr;
        },

        Destroy: function () {
            if(this.s_jlmj_audio_mgr){
                this.s_jlmj_audio_mgr = null;
            }
        },
    },

    ctor: function () {

    },

    // 按钮通用音效
    com_btn_click: function() {
        AudioManager.playSound( AudioPath.Sound_ClickedButton );
    },



});

module.exports = jlmj_audio_mgr;