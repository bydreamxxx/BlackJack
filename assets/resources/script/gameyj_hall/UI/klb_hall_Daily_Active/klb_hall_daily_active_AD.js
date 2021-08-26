var hall_audio_mgr = require('hall_audio_mgr').Instance();
let Platform = require('Platform');
var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    close(){
        if(this.func){
            this.func();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    show: function(func){
        this.func = func;
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        this.close();
    },

    onClickDownload(){
        hall_audio_mgr.com_btn_click();
        cc.dd.native_systool.OpenUrl("http://www.klbgame.com/download/tdk.apk");
        this.close();
    }
});
