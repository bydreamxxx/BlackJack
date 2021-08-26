

cc.Class({
    extends: cc.Component,

    properties: {
        beach:cc.Node,
    },

    onLoad(){
        this.scaleX = this.node.width / this.node.height;
    },

    start () {
        let windowSize=cc.winSize;//推荐  原因  短
        this.beach.scaleX = (windowSize.width / windowSize.height) / this.scaleX;
    },

    update(){
        let windowSize=cc.winSize;//推荐  原因  短
        this.beach.scaleX = (windowSize.width / windowSize.height) / this.scaleX;
    },
});
