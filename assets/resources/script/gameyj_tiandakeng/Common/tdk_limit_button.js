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
        interval : 1,
        isValidClick : true,
        clickHandler : null,
    },

    // use this for initialization
    onLoad: function () {
        var btn = this.node.getComponent(cc.Button);
        if(btn){
            var clickList = btn.clickEvents;
            this.clickHandler = clickList[0].handler;
            this.node.on('touchstart', this.touchBegan.bind(this));
        }else{
            cc.error('此节点没有Button控件!');
        }
    },

    touchBegan : function (ev) {
        var target = ev.target;
        var clickList = target.getComponent(cc.Button).clickEvents;
        var self = this;
        if(this.isValidClick){
            this.isValidClick = false;
            this.scheduleOnce(function (dt) {
                self.isValidClick = true;
                clickList[0].handler = self.clickHandler;
            }, this.interval);
        }else{
            clickList[0].handler = null;
        }
    },

    onDisable: function () {
        this.node.off('touchstart', this.touchBegan.bind(this));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
