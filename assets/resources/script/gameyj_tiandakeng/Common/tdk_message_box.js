var dd = cc.dd;
var tdk = dd.tdk;
var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;
cc.Class({
    extends: cc.Component,

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
        /**
         * 点击确定按钮代理
         */
        okBtnClickHandler:null,
        /**
         * 消息框文字
         */
        messageLbl:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_IN);
    },

    popupInActFinished : function () {
    },

    popupOutActFinished : function () {
        this.node.removeFromParent();
        this.node.destroy();
    },


    show:function (text) {
        this.messageLbl.string = text;
    },

    okBtnClickCallback : function () {
        if(this.okBtnClickHandler){
            this.okBtnClickHandler();
        }
        this.close();
    },

    addOkBtnClickListener:function (cb) {
        this.okBtnClickHandler = cb;
    },

    close : function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
