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
        isGrey : cc.Boolean,
        touchShieldCallback:null,
    },

    // use this for initialization
    onLoad: function () {
        if(this.isGrey){
            this.node.opacity = 100;
        }
        this.node.on('touchstart', this.touchCallBack.bind(this));
    },

    touchCallBack : function (event) {
        if(this.touchShieldCallback){
            this.touchShieldCallback();
        }
        event.stopPropagation();
    },

    onDestroy : function () {
        this.node.off('touchstart', this.touchCallBack.bind(this));
    },

    addTouchShieldCallback : function (cb) {
        cc.log('ssssss:',typeof cb);
        if(typeof cb == 'function'){
            this.touchShieldCallback = cb;
        }else{
            cc.warn('shield_ui::addTouchShieldCallback error:cb not Function!');
        }
    },

    setGrey : function (state) {
        if(!state){
            this.node.opacity = 0;
        }
    },

    close : function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
