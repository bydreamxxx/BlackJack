/**
 * Created by luke on 2019/1/8
 */
let AudioManager = require('AudioManager');
let sh_audio_cfg = require('sh_audio_cfg');
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

    onDisable() {
        this._toScale = null;
        this._toPosition = null;
        this._isShow = null;
        this._movePosition = null;
    },

    //显示看牌动画
    showExposeCard() {
        const moveX = 30;
        const stayTime = 0.2;
        const durTime = 0.5;
        if (this._toPosition != null || this.node.getNumberOfRunningActions() > 0) {
            return;
        }
        var tweenPos1 = cc.moveBy(durTime, cc.v2(-moveX, 0)).easing(cc.easeExponentialOut());
        var tweenPos2 = cc.moveBy(durTime, cc.v2(moveX, 0)).easing(cc.easeExponentialOut());
        var action = cc.sequence(tweenPos1, cc.delayTime(stayTime), tweenPos2);
        this.node.runAction(action);
    },

    sendCard(node, delay, durTime, toPosition, toScale, isShow) {
        let self = this;
        node.active = false;
        this.node.active = true;
        self._toScale = toScale;
        self._toPosition = toPosition;
        self._isShow = isShow;
        var tweenScale = cc.scaleTo(durTime, toScale.x, toScale.y).easing(cc.easeExponentialOut());
        var tweenPostion = cc.moveTo(durTime, toPosition).easing(cc.easeExponentialOut());
        var tweenRotation = cc.rotateTo(durTime, 0).easing(cc.easeExponentialOut());
        if (isShow)
            var action = cc.sequence(cc.delayTime(delay),
                cc.spawn(tweenScale, tweenPostion, tweenRotation, cc.callFunc(() => { AudioManager.getInstance().playSound(sh_audio_cfg.Deal, false) })),
                cc.callFunc(() => {
                    if (self._toScale != null) {
                        self.node.scaleX = self._toScale.x;
                        self.node.scaleY = self._toScale.y;
                    }
                    if (self._toPosition != null) {
                        self.node.setPosition(self._toPosition);
                    }
                    self.node.rotation = 0;
                    if (self._isShow)
                        cc.find('beimian', self.node).active = false;
                    self._toScale = null;
                    self._toPosition = null;
                    self._isShow = null;
                }),
            );
        else
            var action = cc.sequence(cc.delayTime(delay),
                cc.spawn(tweenScale, tweenPostion, tweenRotation, cc.callFunc(() => { AudioManager.getInstance().playSound(sh_audio_cfg.Deal, false) })),
                cc.callFunc(() => {
                    if (self._toScale != null) {
                        self.node.scaleX = self._toScale.x;
                        self.node.scaleY = self._toScale.y;
                    }
                    if (self._toPosition != null) {
                        self.node.setPosition(self._toPosition);
                    }
                    self.node.rotation = 0;
                    self._toScale = null;
                    self._toPosition = null;
                    self._isShow = null;
                }),
            );
        this.node.runAction(action);
    },

    moveCard(delay, durTime, toPosition) {
        var self = this;
        self._movePosition = toPosition;
        var action = cc.sequence(cc.delayTime(delay - 0.1),
            cc.callFunc(() => {
                self.updateCard();
                var tweenPostion = cc.moveTo(durTime, toPosition).easing(cc.easeExponentialOut());
                self.node.runAction(tweenPostion);
            }));
        this.node.runAction(action);
    },

    updateCard() {
        this.node.stopAllActions();
        if (this._toScale != null) {
            this.node.scaleX = this._toScale.x;
            this.node.scaleY = this._toScale.y;
        }
        if (this._toPosition != null) {
            this.node.setPosition(this._toPosition);
        }
        this.node.rotation = 0;
        if (this._isShow) {
            cc.find('beimian', this.node).active = false;
        }
        this._toScale = null;
        this._toPosition = null;
        this._isShow = null;
    },

    updateMoveCard() {
        this.updateCard();
        if (this._movePosition) {
            this.node.setPosition(this._movePosition);
        }
        this._movePosition = null;
    },
});
