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

        _idx:0,
        _flagItem:[],
        flagNode:cc.Node,
        timeLbl:cc.Label,
        bgNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._flagItem = this.flagNode.children;
        cc.log('CommonRecord::onLoad:', this._flagItem);
    },

    init:function (time, symbol, cb) {
        this.bgNode.width = 100;
        if(symbol > 0){
            this.timeLbl.node.x = 65;
        }else{
            this.timeLbl.node.x = -65;
        }
        this.bgNode.width += time*10;
        this.timeLbl.node.x += time*5*symbol;
        this.timeLbl.string = time+'"';
        this.schedule(this._doAct, 0.2);

        this.scheduleOnce(function (dt) {
            this.close();
            cb();
        }, time);
    },

    _doAct:function (dt) {
        if(this._idx == this._flagItem.length){
            this._hiddenAllFlagItem();
        }else{
            this._flagItem[this._idx++].active = true;
        }
    },

    _hiddenAllFlagItem:function () {
        this._idx = 0;
        this._flagItem.forEach(function (item) {
            item.active = false;
        });
    },

    close:function () {
        this._hiddenAllFlagItem();
        this.unschedule(this._doAct);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
