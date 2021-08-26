var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();

var jlmj_popup_view = cc.Class({
    extends: cc.Component,

    properties: {
        root: { default: null, type: cc.Node, tooltip: '根节点用于显示', },
        content: { default: null, type: cc.Label, tooltip: '提示文字', },
        ok: { default: null, type: cc.Button, tooltip: '确定', },
        cancel: { default: null, type: cc.Button, tooltip: '取消', },

    },

    // use this for initialization
    onLoad: function () {
        this.node.active = false
    },

    ctor: function () {
        this.okCallback = null;
        this.destroyCallfunc = null;
    },

    onDestroy: function () {
        if (this.destroyCallfunc)
            this.destroyCallfunc();
    },

    show: function (content, callback, type, destroyCallfunc) {
        switch (type) {
            case 1:  //OK_CANCEL

                break;
            case 2: //OK
                this.cancel.node.active = false;
                this.ok.node.x = 0;
                break;
            case 3: //CANCEL
                this.ok.node.active = false;
                this.cancel.node.x = 0;
                break;
            default:

                break;
        }
        this.content.string = content;
        this.okCallback = callback;
        this.destroyCallfunc = destroyCallfunc;
        this.node.active = true;
    },

    hide: function () {
        if (this && this.node)
            this.node.destroy();
    },

    onOK: function () {
        jlmj_audio_mgr.com_btn_click();

        if (this.okCallback){
            this.okCallback();
            this.hide();
        }
        else
            this.onCacnel();
    },

    onCacnel: function () {
        jlmj_audio_mgr.com_btn_click();
        this.hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = jlmj_popup_view;
