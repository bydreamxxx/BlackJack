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
        this.vipLevelLabel.string = `VIP${data.key}`
        this.expLabel.string = `${cc.dd.Utils.getNumToWordTransform(data.exp)}exp`
        this.coinAddLabel.string = `+${data.pay_coe}%`
        this.goldAwardLabel.string = cc.dd.Utils.getNumToWordTransform(data.gold)
        let items = data.items.split(';')
        if(items && items.length>0 && items[0]) {
            let item = items[0].split(',')
            cc.dd.ResLoader.loadAtlas("blackjack_hall/atals/itemIcon", function (atlas) {
                var sprite = atlas.getSpriteFrame(item[1]);
                this.giftAwardSprite.spriteFrame = sprite;
            }.bind(this));
            this.giftAwardLabel.string = `X${cc.dd.Utils.getNumToWordTransform(item[2])}`
        }
        
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    // update (dt) {},
});
