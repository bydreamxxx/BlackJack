cc.Class({
    extends: cc.Component,

    editor: {
        requireComponent: cc.Button,
    },

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back:
                var cEs = this.node.getComponent(cc.Button).clickEvents;
                // for (var i = 0; i < cEs.length; i++) {
                //     var target = cEs[i].target;
                //     var component = cEs[i].component;
                //     var handler = cEs[i].handler;
                //     var args = cEs[i].customEventData;
                //     target.getComponent(component)[handler](null, args);
                // }
                cc.Component.EventHandler.emitEvents(cEs, null);
                this.node.emit('click', this);
                break;
            default:
                break;
        }
    },
    // update (dt) {},
});
