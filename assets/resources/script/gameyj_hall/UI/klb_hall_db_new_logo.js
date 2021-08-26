var channel_2_index = [];
channel_2_index[10005] = 0;
channel_2_index[10007] = 1;
channel_2_index[10002] = 2;
channel_2_index[3] = 3;
channel_2_index[10009] = 3;
channel_2_index[10004] = 3;
channel_2_index[10011] = 4;
cc.Class({
    extends: cc.Component,

    properties: {
        logoList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var index = channel_2_index[cc.game_pid];
        if (index != null) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.logoList[index];
        }
    },

    start() {

    },

    // update (dt) {},
});
