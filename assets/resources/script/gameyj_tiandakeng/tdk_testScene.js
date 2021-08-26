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

    },
    
    click:function(){
        cc.dd.DialogBoxUtil.show(1,'我是2', '瓜李', '二娃', function () {
            // cc.director.loadScene('Test');
            cc.dd.NetWaitUtil.show('我是菊花测试……');
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
