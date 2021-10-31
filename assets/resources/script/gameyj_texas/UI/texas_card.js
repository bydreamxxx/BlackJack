/**
 * Created by luke on 2019/1/8
 */
let texas_audio_cfg = require('texas_audio_cfg');
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

    onDisable(){
        this._toScale = null;
        this._toPosition = null;
        this._isShow = null;
        this._movePosition = null;
    },

    sendCard(node, delay, durTime, toPosition, toScale,toRotation, isShow) {
        let self = this;
        node.active = false;
        this.node.active = true;
        self._toScale = toScale;
        self._toPosition = toPosition;
        self._isShow = isShow;
        var tweenScale = cc.scaleTo(durTime, toScale.x, toScale.y).easing(cc.easeExponentialOut());
        var tweenPostion = cc.moveTo(durTime, toPosition).easing(cc.easeExponentialOut());
        var tweenRotation = cc.rotateTo(durTime, toRotation).easing(cc.easeExponentialOut());
        if (isShow)
            var action = cc.sequence(cc.delayTime(delay),
                //加一个cc.delayTime(0)是引擎原因造成有时候位置和缩放都不对
                cc.spawn(cc.delayTime(0),tweenScale, tweenPostion, tweenRotation,
                        cc.callFunc(() => { AudioManager.playSound(texas_audio_cfg.Deal, false) })),
                cc.callFunc(() => {
                    if (self._toScale != null) {
                        self.node.scaleX = self._toScale.x;
                        self.node.scaleY = self._toScale.y;
                    }
                    if (self._toPosition != null) {
                        self.node.setPosition(self._toPosition);
                    }
                    // self.node.rotation = 0;
                    if (self._isShow)
                    {
                        this.node.getComponent(cc.Animation).play('dipai_rotate');
                        cc.find('dipai_1/beimian', self.node).active = false;
                    }
                        
                    self._toScale = null;
                    self._toPosition = null;
                    self._isShow = null;
                }),
            );
        else
            var action = cc.sequence(cc.delayTime(delay),
                //加一个cc.delayTime(0)是引擎原因造成有时候位置和缩放都不对
                cc.spawn(cc.delayTime(0),tweenScale, tweenPostion, tweenRotation, 
                            cc.callFunc(() => { AudioManager.playSound(texas_audio_cfg.Deal, false) })),
                cc.callFunc(() => {
                    if (self._toScale != null) {
                        self.node.scaleX = self._toScale.x;
                        self.node.scaleY = self._toScale.y;
                    }
                    if (self._toPosition != null) {
                        self.node.setPosition(self._toPosition);
                    }
                    // self.node.rotation = 0;
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

    updateCard(isShow) {
        if(isShow!=null)
            this._isShow = isShow
            
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
            
            this.node.getComponent(cc.Animation).play('dipai_rotate');
            cc.find('dipai_1/beimian', this.node).active = false;
        }
        this._toScale = null;
        this._toPosition = null;
        this._isShow = null;
    },

    updateMoveCard(){
        this.updateCard();
        if(this._movePosition){
            this.node.setPosition(this._movePosition);
        }
        this._movePosition = null;
    },


    disAppearTo(endpos) {

        var action = null;
        // var tweenScale = cc.scaleTo(durTime, toScale.x, toScale.y).easing(cc.easeExponentialOut());
        var fade = cc.fadeOut(1.0);
        var tweenPostion = cc.moveTo(1, endpos).easing(cc.easeExponentialOut());
        var tweenRotation = cc.rotateTo(1, this.node.rotation + 360).easing(cc.easeExponentialOut());
        var self = this;
        action = cc.sequence(
        cc.spawn(fade,tweenRotation,tweenPostion),
        cc.delayTime(1),
        cc.callFunc(() => {
            self.node.opacity = 255;
            self.node.active=false;
        })
        )

        this.node.runAction(action);
    },
});
