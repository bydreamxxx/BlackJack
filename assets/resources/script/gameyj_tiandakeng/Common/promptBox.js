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
    },

    // use this for initialization
    onLoad: function () {
        this.duration = 1;
    },

    show:function (text, bgFrame) {
        var bgNode = cc.find('bg', this.node);
        if(arguments[1]){
            bgNode.getComponent(cc.Sprite).spriteFrame = bgFrame;
        }
        var lblCpt = cc.find('lbl', bgNode).getComponent(cc.Label);
        lblCpt.string = text;

        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.PROMPT_BOX_IN);
    },

    actInFinished:function () {
        this.scheduleOnce(function (dt) {
            var ani = this.node.getComponent(cc.Animation);
            ani.play(tdk_ani.PROMPT_BOX_OUT);
        }, this.duration);
    },

    actOutFinished:function () {
        this.close();
    },

    close : function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
