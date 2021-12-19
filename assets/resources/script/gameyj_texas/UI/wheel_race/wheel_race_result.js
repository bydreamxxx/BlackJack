// 转轮赛结果

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        rankLabel: cc.Label,
        rankSprite: [cc.Node]
    },

    setResult(data, onBack) {
        this.node.active = true
        this.onBackCall = onBack
        this.coinLabel.string = data.coin
        this.rankLabel.string = data.rank
        for(let i=0; i<this.rankSprite.length; i++) {
            this.rankSprite[i].active = (i+1) === data.rank
        }
        
    },

    onShare() {
        this.node.active = false
    },
    onBack() {
        this.node.active = false
        if(this.onBackCall) {
            this.onBackCall()
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    // update (dt) {},
});
