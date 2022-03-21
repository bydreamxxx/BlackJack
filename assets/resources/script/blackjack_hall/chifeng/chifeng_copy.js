//created by luke on 2019/8/13
cc.Class({
    extends: cc.Component,

    properties: {
        copy_lbl: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.on('click', this.onCopy, this);
    },

    // update (dt) {},
    onCopy() {
        if (this.copy_lbl) {
            // if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
                cc.dd.native_systool.SetClipBoardContent(this.copy_lbl.string);
                cc.dd.PromptBoxUtil.show("Copy successfully");
            // }
        }
    },
});
