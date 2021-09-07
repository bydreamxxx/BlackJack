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
        _selectNode:cc.Node,
        flagNode:cc.Node,
        startRecordNode:cc.Node,
        stopRecordNode:cc.Node,
        cancelRecordNode:cc.Node,
        recordingAni:cc.Animation,
    },

    // use this for initialization
    onLoad: function () {
        this.record_timer_ani = cc.find("bg/yuyin-guang",this.node).getComponent(cc.Animation);
        this.record_timer_ani.node.active = false;
    },


    /**
     * 开始录音
     */
    startRecord:function () {
        this._select(this.startRecordNode);
        this.recordingAni.play();
    },

    /**
     * 时长无效
     */
    stopRecord:function () {
        this._select(this.stopRecordNode);
    },

    /**
     * 移动取消
     */
    cancelRecord:function () {
        this.recordingAni.stop();
        this._select(this.cancelRecordNode);
    },

    reset:function () {

    },

    _select:function (node) {
        if(this._selectNode){
            this._selectNode.active = false;
        }
        this._selectNode = node;
        this._selectNode.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
