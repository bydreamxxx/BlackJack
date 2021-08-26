var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
let sh_Data = require('sh_data').sh_Data;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        this.is_interval = false;
    },

    onMessage: function( event, custom ) {
        if (event.type != "touchend"){
            return;
        }
        if(this.is_interval){
            cc.log("正在聊天,不打开聊天界面");
            return;
        }
        jlmj_audio_mgr.com_btn_click();
        var prefab = jlmj_prefab.COM_CHAT;
        if (sh_Data.Instance().getWatchPlayer(cc.dd.user.id)) {
            prefab = jlmj_prefab.COM_EMOJI;
        }
        cc.dd.UIMgr.openUI(prefab,function(prefab){
            prefab.getComponent('com_chat').intervalTimeCallBack(this.setIntervalTime.bind(this));
            prefab.getComponent('com_chat').initChat();
        }.bind(this));
    },
    setIntervalTime:function (time) {
        this.is_interval = true;
        setTimeout(function () {
            this.is_interval = false;
        }.bind(this),time*1000);
    }
    // update (dt) {},
});
