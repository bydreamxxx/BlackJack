
const Color_Normal = cc.color(255, 255, 255);
const Color_Gray = cc.color(96, 96, 96);

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
        this._labelOutline = this.node.getComponent(cc.LabelOutline);
        if (this._button) {
            this._buttonInteractable = this._button.interactable;
            this.setColor();
        }

    },

    update(dt) {
        if (this._button) {
            if (this._buttonInteractable != this._button.interactable) {
                this._buttonInteractable = this._button.interactable;
                this.setColor();
            }
        }
    },

    setColor() {
        if (this._button) {
            if (this._button.interactable) {
                this.node.color = Color_Normal;
                if (this._labelOutline) {
                    this._labelOutline.enabled = true;
                }
            }
            else {
                this.node.color = Color_Gray;
                if (this._labelOutline) {
                    this._labelOutline.enabled = false;
                }
            }
        }
    },
});
