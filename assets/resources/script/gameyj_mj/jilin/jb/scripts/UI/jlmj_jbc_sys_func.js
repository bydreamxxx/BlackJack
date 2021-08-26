var jlmj_sys_func = require( "jlmj_sys_func" );
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');

cc.Class({
    extends: jlmj_sys_func,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    /**
     * 消息
     * @param event
     * @param custom
     */
    onMessage: function( event, custom ) {
        if (event.type != "touchend"){
            return;
        }
        // jlmj_notice.notification(jlmj_emit.EMIT_CLICK_SPEAKBTN);
        jlmj_audio_mgr.com_btn_click();
        //正在聊天,不打开聊天界面
        if(this.playerHead_down.getComponent('jlmj_playerHead').isChating()){
            cc.log("正在聊天,不打开聊天界面");
            return;
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_CHAT);
    },


    // use this for initialization
    onLoad: function () {

    },


});
