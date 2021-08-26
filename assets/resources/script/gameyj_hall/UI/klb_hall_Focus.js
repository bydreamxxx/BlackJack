var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        this.contentTxt = '巷乐game';
    },

    copy:function(event,data){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.contentTxt);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    //关闭
    close: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
 
});