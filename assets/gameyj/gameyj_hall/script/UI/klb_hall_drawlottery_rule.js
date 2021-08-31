var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        time1: cc.Label,
        time2: cc.Label,
    },

    show(begtime, endtime){
        this.time1.string = '时间:' + begtime.format("yyyy/MM/dd") + '-' + endtime.format("yyyy/MM/dd");
        this.time2.string = '时间:' + begtime.format("yyyy/MM/dd") + '-' + endtime.format("yyyy/MM/dd");
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
