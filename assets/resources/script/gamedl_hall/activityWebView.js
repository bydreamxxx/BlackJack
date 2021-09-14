
var hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,
    properties: {

    },

    start() {

    },

    onClose() {
        hall_audio_mgr.com_btn_click();
        this.node.destroy();
    },
});
