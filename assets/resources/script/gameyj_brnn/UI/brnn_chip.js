cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start() {},

    fly(startpos, endpos, parent, delay) {
        if (delay) {
            var seq = cc.sequence(cc.delayTime(delay),
                cc.callFunc(() => {
                    if (parent._sgNode)
                        parent.addChild(this.node);
                    this.node.getComponent(cc.Sprite).enabled = true;
                    this.node.setPosition(startpos);
                }),
                cc.moveTo(1, endpos).easing(cc.easeExponentialOut()));
            this.node.runAction(seq);
        }
        else {
            parent.addChild(this.node);
            this.node.getComponent(cc.Sprite).enabled = true;
            this.node.setPosition(startpos);
            var action = cc.moveTo(1, endpos).easing(cc.easeExponentialOut());
            this.node.runAction(action);
        }
    },

    fly2Remove(delay, time, endpos, pool, callback) {
        var node = this.node;
        if (delay) {
            var action = cc.sequence(cc.delayTime(delay), cc.moveTo(time, endpos).easing(cc.easeExponentialInOut()),
                cc.callFunc(() => { pool.put(node); if (callback) callback(); })
            );
        }
        else {
            var action = cc.sequence(cc.moveTo(time, endpos).easing(cc.easeExponentialInOut()),
                cc.callFunc(() => { pool.put(node); if (callback) callback(); })
            );
        }
        node.runAction(action);
    },
    // update (dt) {},
});
