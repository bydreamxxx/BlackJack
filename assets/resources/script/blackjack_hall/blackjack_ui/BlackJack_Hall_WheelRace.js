// 转轮赛报名
cc.Class({
    extends: cc.Component,

    properties: {
        // 标签头
        toggleList: [cc.Toggle],
        // 标签页
        togglePanel: [cc.Node]
    },

    // 报名
    compete() {

    },
    // 关闭
    close() {
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },


    // update (dt) {},
});
