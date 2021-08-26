var sh_Data = require('sh_data').sh_Data;
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.btn = this.node.getComponent(cc.Button);
    },

    update(dt) {
        if (!sh_Data.Instance().isGaming) {
            this.btn.interactable = sh_Data.Instance().getIsAllReady();
        }
    },
});
