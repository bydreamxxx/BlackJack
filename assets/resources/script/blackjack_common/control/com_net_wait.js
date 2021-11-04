
var aniName = require('ConstantCfg').AnimationName;

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
        lbl:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    show:function(text, text1){
        if(typeof (text1) !== "string"){
            text1 = "";
        }
        var ani = this.node.getComponent(cc.Animation);
        //ani.play(aniName.NET_WAIT);
        ani.play('Loading');
        this.lbl.node.getComponent("LanguageLabel").setText(text,'',text1);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onDestroy:function () {
        cc.log('com_net_wait::菊花转被销毁!');
    },
});
