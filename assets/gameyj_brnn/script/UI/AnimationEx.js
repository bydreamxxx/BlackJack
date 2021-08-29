cc.Class({
    extends: cc.Animation,

    properties: {

    },

    playNormal(event, name) {
        if (!name || name === '') {
            if (this._defaultClip) {
                name = this._defaultClip.name;
            }
            else {
                return;
            }
        }
        this.getAnimationState(name).wrapMode = cc.WrapMode.Normal;
        this.play(name);
    },

    playReverse(event, name) {
        if (!name || name === '') {
            if (this._defaultClip) {
                name = this._defaultClip.name;
            }
            else {
                return;
            }
        }
        this.getAnimationState(name).wrapMode = cc.WrapMode.Reverse;
        this.play(name);
    },
});
