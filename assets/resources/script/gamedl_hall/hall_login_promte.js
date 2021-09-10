
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

    /**
     * 立即体验
     */
    onclickTiYan: function () {
        hall_audio_mgr.com_btn_click();
        var url = 'https://www.yuejiegame.com/';
        cc.dd.native_systool.OpenUrl(url);
    },
});
