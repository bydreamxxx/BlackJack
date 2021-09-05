cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    fly(startpos, endpos, parent, delay,remove,useIn) {
        if (delay) {
            var seq = null;
            if(remove)
            {
                seq = cc.sequence(cc.delayTime(delay),
                cc.callFunc(() => {
                    parent.addChild(this.node);
                    this.node.getComponent(cc.Sprite).enabled = true;
                    this.node.setPosition(startpos);
                }),
                cc.moveTo(1, endpos).easing(useIn?cc.easeExponentialInOut():cc.easeExponentialOut()),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.node.removeFromParent();
                })
                );
            }else
            {
                seq = cc.sequence(cc.delayTime(delay),
                cc.callFunc(() => {
                    parent.addChild(this.node);
                    this.node.getComponent(cc.Sprite).enabled = true;
                    this.node.setPosition(startpos);
                }),
                cc.moveTo(1, endpos).easing(useIn?cc.easeExponentialInOut():cc.easeExponentialOut())
                );
            }
            this.node.runAction(seq);
        }
        else {
            parent.addChild(this.node);
            this.node.getComponent(cc.Sprite).enabled = true;
            this.node.setPosition(startpos);
            var action = null;
            if(remove)
                action = cc.sequence(
                cc.moveTo(1, endpos).easing(useIn?cc.easeExponentialInOut():cc.easeExponentialOut()),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.node.removeFromParent();
                })
                )
            else
                cc.moveTo(1, endpos).easing(useIn?cc.easeExponentialInOut():cc.easeExponentialOut());
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

    setAction(delay, pos, time, parent, callback) {
        this.callback = callback;
        var startpos = this.node.position;
        var vec2 = pos.sub(startpos);
        var ratio = 0.2;
        var contr1 = startpos.add(vec2.mul(ratio));
        contr1.y += 100;
        var contr2 = pos.sub(vec2.mul(ratio));
        contr2.y += 100;
        var self = this;
        var seq = cc.sequence(
            cc.delayTime(delay),
            cc.callFunc(function () {
                self.node.opacity = 255;
                if(parent &&  self.node)
                    parent.addChild(self.node);
            }),
            cc.bezierTo(time, [contr1, contr2, pos]),
            cc.delayTime(0.3),
            cc.callFunc(function () {
                if (self.callback) {
                    self.callback();
                }
                self.node.opacity = 0;
                self.node.removeFromParent();
                // pool.put(self.node);
            }));
        this.node.runAction(seq);
    },
});
