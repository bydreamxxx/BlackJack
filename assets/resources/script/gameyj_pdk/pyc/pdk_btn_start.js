var pdk_data = require('pdk_data').PDK_Data;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.btn = this.node.getComponent(cc.Button);
    },

    update(dt) {
        if (!pdk_data.Instance().getIsStart()) {
            this.btn.interactable = pdk_data.Instance().getIsAllReady();
        }
    },
});
