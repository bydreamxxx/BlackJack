var hall_audio_mgr = cc.Class({

    statics: {
        s_hall_audio_mgr: null,

        Instance: function () {
            if (!this.s_hall_audio_mgr) {
                this.s_hall_audio_mgr = new hall_audio_mgr();
            }
            return this.s_hall_audio_mgr;
        },

        Destroy: function () {
            if (this.s_hall_audio_mgr) {
                this.s_hall_audio_mgr = null;
            }
        },
    },

    ctor: function () {

    },

    // 按钮通用音效
    com_btn_click: function () {
        AudioManager.playSound("gameyj_hall/audios/Hall_ClickedButton");
    },

});

module.exports = hall_audio_mgr;
