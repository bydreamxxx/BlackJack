var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties:{
        timeLabel: cc.Label
    },

    show(time){
        this.timeLabel.string = time;
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
