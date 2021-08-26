var AudioPath = require( "nmmj_audio_path" );

var nmmj_audio_mgr = cc.Class({

    statics: {
        s_jlmj_audio_mgr: null,

        Instance: function () {
            if(!this.s_jlmj_audio_mgr){
                this.s_jlmj_audio_mgr = new nmmj_audio_mgr();
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

module.exports = nmmj_audio_mgr;