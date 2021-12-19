// VIP

cc.Class({
    extends: cc.Component,

    properties: {
        vipLevelLabel: cc.Label,
        expLabel: cc.Label,
        coinAddLabel: cc.Label,
        goldAwardLabel: cc.Label,
        giftAwardLabel: cc.Label,
        giftAwardSprite: cc.Sprite,
    },

    setData( data) {
        this.vipLevelLabel.string = "VIP"+data.level
        this.expLabel.string = data.level
        this.coinAddLabel.string = data.level
        this.goldAwardLabel.string = cc.dd.Utils.getNumToWordTransform(data.level)
        this.giftAwardLabel.string = "X"+data.level
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    // update (dt) {},
});
