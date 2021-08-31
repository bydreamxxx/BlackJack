// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    },

    setAction(delay, pos, time, pool, callback) {
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
            }),
            cc.bezierTo(time, [contr1, contr2, pos]),
            cc.delayTime(0.3),
            cc.callFunc(function () {
                if (self.callback) {
                    self.callback();
                }
                self.node.opacity = 0;
                pool.put(self.node);
            }));
        this.node.runAction(seq);
    },
    // update (dt) {},
});
