var texas_Data = require('texas_data').texas_Data;
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
        if (!texas_Data.Instance().isGaming) {
            this.btn.interactable = texas_Data.Instance().getIsAllReady();
        }
    },
});
