
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    onLoad(){
        if(cc._applyForPayment){
            let serviceButton = cc.find('bg/serviceButton', this.node);
            if(serviceButton){
                serviceButton.active = false;
            }
        }
    },

    setCloseFunc(func){
        this._func = func;
    },

    close: function(event, data){
        hall_audio_mgr.com_btn_click();
        if(this._func){
            this._func();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickKefu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if(cc._chifengGame) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
        }else if(cc.game_pid == 2){
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
                prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            });
        }else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
            //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            // });
            let Platform = require('Platform');
            let AppCfg = require('AppConfig');
            cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
