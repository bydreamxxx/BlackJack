var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        contentLbl:cc.Label,
        contentTxt: null,
    },

    // use this for initialization
    onLoad: function () {

    },

    init:function(name,content){
        this.contentLbl.string= name + ':' + content;
        this.contentTxt = content;
    },

    copy:function(event,data){
        hall_audio_mgr.com_btn_click();

        cc.dd.native_systool.SetClipBoardContent(this.contentTxt);
        cc.dd.PromptBoxUtil.show("复制成功");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});