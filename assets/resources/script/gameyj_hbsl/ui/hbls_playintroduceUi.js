var hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad: function () {

    },

    onDestroy: function () {
    },


    onColse: function () {
        hall_audio_mgr.com_btn_click();
        this.node.removeFromParent();
        this.node.destroy();
    },

});