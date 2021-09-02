/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */
var Transition = cc.Enum({
    /**
     * !#en The none type.
     * !#zh 不做任何过渡
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * !#en The color type.
     * !#zh 颜色过渡
     * @property {Number} COLOR
     */
    COLOR: 1,

    /**
     * !#en The sprite type.
     * !#zh 精灵过渡
     * @property {Number} SPRITE
     */
    SPRITE: 2,
    /**
     * !#en The scale type
     * !#zh 缩放过渡
     * @property {Number} SCALE
     */
    SCALE: 3
});

cc.Class({
    extends: cc.Button,

    properties: {
        interact_cd: { default: 0.5, type: cc.Float, tooltip: '交互cd' },
        interact_audio: { default: null, type: cc.AudioSource, tooltip: '交互音效' },
        gray_effect_sprites: { default: [], type: [cc.Sprite], tooltip: '变灰精灵' },
    },

    // use this for initialization
    onLoad: function () {

    },

    // touch event handler
    _onTouchBegan: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;
        if(this._interactCding()) {
            return;
        };

        this._pressed = true;
        this._updateState();
        event.stopPropagation();
    },

    _onTouchMove: function (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
        if(this._interactCding()) {
            return;
        };
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        var touch = event.touch;
        var hit = this.node._hitTest(touch.getLocation());

        if(this.transition === Transition.SCALE && this.target) {
            if(hit) {
                this._fromScale = this._originalScale;
                this._toScale = this._originalScale * this.zoomScale;
                this._transitionFinished = false;
            } else {
                this.time = 0;
                this._transitionFinished = true;
                this.target.scale = this._originalScale;
            }
        } else {
            var state;
            if (hit) {
                state = 'pressed';
            } else {
                state = 'normal';
            }
            this._applyTransition(state);
        }
        event.stopPropagation();
    },

    _onTouchEnded: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;
        if(this._interactCding()) {
            return;
        };

        if (this._pressed) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();
        event.stopPropagation();

        var d = new Date();
        this.interact_last_time = d.getTime();

        this.playInteractAudio();
    },

    _onTouchCancel: function () {
        if (!this.interactable || !this.enabledInHierarchy) return;
        if(this._interactCding()) {
            return;
        };

        this._pressed = false;
        this._updateState();

        var d = new Date();
        this.interact_last_time = d.getTime();
    },

    /**
     * 是否在交互cd中
     * @private
     */
    _interactCding: function () {
        var d = new Date();
        if(this.interact_last_time){
            var interval = d.getTime()-this.interact_last_time;
            return interval<this.interact_cd*1000;
        }
        return false;
    },

    /**
     * 播放交互音效
     */
    playInteractAudio: function () {
        if(this.interact_audio){
            this.interact_audio.play();
        }
    },

    _updateDisabledState: function () {
        this.gray_effect_sprites.forEach(function (sprite) {
            sprite._sgNode.setState(0);
        });
        if(this.enableAutoGrayEffect && this.transition !== Transition.COLOR) {
            if(!(this.transition === Transition.SPRITE && this.disabledSprite)) {
                if(!this.interactable) {
                    this.gray_effect_sprites.forEach(function (sprite) {
                        sprite._sgNode.setState(1);
                    });
                }
            }
        }
    },

});
