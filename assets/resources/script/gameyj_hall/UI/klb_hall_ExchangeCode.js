var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        cashTxt: cc.RichText,
        CodeTXt: cc.Label,
        desc: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        if(cc._isKuaiLeBaTianDaKeng){
            if(this.desc){
                this.desc.string = '微信公众号：快乐吧棋牌'
            }
        }
    },

    onDestroy:function () {
    },

    setData: function(data){
        this.cashTxt.string =  '<color=#8f4f13>已经成功提取现金</c>' + '<color=#cc0000>'+ (data.exchangeMoney / 100) +'</color>'+'<color=#8f4f13>元</c>';
        this.CodeTXt.string = data.code;
    },

    copy: function(event, data){
        hall_audio_mgr.com_btn_click();

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.CodeTXt.string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
