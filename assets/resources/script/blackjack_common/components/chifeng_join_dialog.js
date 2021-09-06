cc.Class({
    extends: require('com_dialog_box'),

    properties:{
        cancel_sprite: cc.Sprite,
        ok_sprite: cc.Sprite,
    },

    setButtonInteractable(type) {
        switch (type) {
            case 0:
                this.cancel_btn.getComponent(cc.Button).interactable = false;
                this.cancel_sprite._sgNode.setState(1);
                break;
            case 1:
                this.ok_btn.getComponent(cc.Button).interactable = false;
                this.ok_sprite._sgNode.setState(1);
                break;
        }
    },

    resetUI() {
        this.cancel_btn.getComponent(cc.Button).interactable = true;
        this.cancel_sprite._sgNode.setState(0);
        this.ok_btn.getComponent(cc.Button).interactable = true;
        this.ok_sprite._sgNode.setState(0);
    },
});
