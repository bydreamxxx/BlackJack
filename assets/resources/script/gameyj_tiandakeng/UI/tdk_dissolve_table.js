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
        nick : cc.Label,
        result : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.setResult(false);
    },

    init : function (nick, result) {
        this.nick.string = nick;
        this.setResult(result);
    },

    setResult : function (result) {
        if(result){
            this.result.string = '同意';
            this.result.node.color = cc.color(91, 132, 32, 255);
        }else{
            this.result.string = '等待选择';
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
