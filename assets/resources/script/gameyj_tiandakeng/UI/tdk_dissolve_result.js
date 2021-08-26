var tdk = cc.dd.tdk;
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
        btnClickCallback : null,
        nick : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_IN);
    },

    popupInActFinished : function () {
        cc.log('tdk_dissolve_result::popupInActFinished!');
    },

    popupOutActFinished : function () {
        this.node.removeFromParent();
        this.node.destroy();
        cc.log('tdk_dissolve_result::popupOutActFinished!');
    },

    init : function (userid) {
        this.nick.string = '玩家【'+userid+'】：';
    },
    
    agreeBtnClick : function(){
        if(this.btnClickCallback){
            this.btnClickCallback();
        }
        this.close();
    },

    addBtnClickListener : function (cb) {
        if(typeof cb == 'function'){
            this.btnClickCallback = cb;
        }else{
            cc.warn('tdk_dissolve_result::addBtnclickListener: cb not function!');
        }
    },

    close : function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.POPUP_OUT);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
