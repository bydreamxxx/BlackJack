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
        m_oCoinAnim: cc.Node,
        m_nIndex: 0,

        bigWinNode: cc.Node,
        score: cc.Label,
        anim: cc.Animation,

        closeButton: cc.Button,
    },

    init() {
        this.bigWinNode.scaleX = 0;
        this.bigWinNode.scaleY = 0;
        this.node.active = false;
        this.closeButton.interactable = false;
    },

    playCoinAnim: function (totalCount, delayTimer) {
        if (this.m_nIndex >= totalCount)
            return;
        var self = this;
        var node = cc.instantiate(this.m_oCoinAnim);
        node.active = true;
        node.getComponent(cc.Animation).play('drawlotteryCoinRotateAnim');
        var x = Math.floor(Math.random() * (640 - 0 + 1) + 0);
        var tag = Math.round(Math.random());
        if (tag == 0)
            x = -x;
        parseInt(Math.random() * (720 - 360 + 1) + 360, 10);
        var q1_y = Math.floor(Math.random() * (720 - 360 + 1) + 360);
        parseInt(Math.random() * (360 - 290 + 1) + 290, 10);
        var q2_y = Math.floor(Math.random() * (360 - 290 + 1) + 290);
        var q1 = cc.v2(x, q1_y);
        var q2 = cc.v2(x, q2_y);
        var coin_endPos = cc.v2(x, - 360);
        // var bezier = [q1, q2, coin_endPos];
        var time = 1;
        // var bezierAct = cc.bezierTo(time, bezier);
        node.scaleX = 0.6;
        node.scaleY = 0.6;
        var scale = parseInt(Math.random() * (14 - 11) + 11, 10) / 10;
        // var scaleAct = cc.scaleTo(0.5, scale);
        // node.runAction(cc.sequence(cc.spawn(bezierAct, scaleAct, cc.sequence(cc.delayTime(delayTimer), cc.callFunc(function () {
        //     self.playCoinAnim(totalCount, delayTimer);
        //     self.m_nIndex += 1;
        // }))), cc.callFunc(function () {
        //     node.active = false;
        //     node.removeFromParent();
        //     if (self.m_nIndex >= totalCount) {
        //         var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
        //             //self.quitWindow();
        //             node.stopAllActions();
        //         }));
        //         self.node.runAction(seq);
        //     }
        // })));

        let t = cc.tween(node)
            .parallel(
                cc.tween().bezierTo(time, q1, q2, coin_endPos),
                cc.tween().to(0.5, { scale: scale }),
                cc.tween().delay(delayTimer).call(function () {
                    self.playCoinAnim(totalCount, delayTimer);
                    self.m_nIndex += 1;
                })
            )
            .call(function () {
                node.active = false;
                node.removeFromParent();
                if (self.m_nIndex >= totalCount) {
                    cc.tween(self.node)
                        .delay(1)
                        .call(function () {
                            //self.quitWindow();
                            t.stop();
                        })
                        .start();
                }
            })
            .start();

        node.parent = this.m_oCoinAnim.parent;
    },

    onClickClose() {
        this.anim.play('drawlotteryBigwinClose');
        this.anim.setCurrentTime(0, 'drawlotteryBigwinClose');

        this.closeButton.interactable = false;
    },

    show(score, endCall) {
        this.node.active = true;
        this.score.string = score;
        this.endCall = endCall;

        this.anim.play('drawlotteryBigwinOpen');
        this.anim.setCurrentTime(0, 'drawlotteryBigwinOpen');

        AudioManager.playSound('gameyj_hall/audios/drawlotterybigwin', false);

        this.m_nIndex = 0;
        this.playCoinAnim(240, 0.02);
        this.playCoinAnim(240, 0.02);
        this.playCoinAnim(240, 0.02);
    },

    bigWinEnd() {
        if (this.endCall) {
            this.endCall();
        }

        this.init();
    },

    showBigwin() {
        this.closeButton.interactable = true;
        this.anim.play('drawlotteryBigwin');
        this.anim.setCurrentTime(0, 'drawlotteryBigwin');
    }
});
