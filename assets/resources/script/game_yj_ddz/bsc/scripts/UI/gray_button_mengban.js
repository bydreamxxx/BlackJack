
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
        this._button = this.node.parent.getComponent(cc.Button);
        this._sprite = this.node.getComponent(cc.Sprite);
        if (this._button) {
            this._buttonInteractable = this._button.interactable;
            this.setSprite();
        }

    },

    update(dt) {
        if (this._button) {
            if (this._buttonInteractable != this._button.interactable) {
                this._buttonInteractable = this._button.interactable;
                this.setSprite();
            }
        }
    },

    setSprite() {
        if (this._button) {
            if (this._button.interactable) {
                this._sprite.enabled = false;
            }
            else {
                this._sprite.enabled = true;
            }
        }
    },
});
