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
        // 适应字体文件
        let nm = this.chaneNumToStr(data.score)//cc.dd.Utils.getNumToWordTransform(data.score)
        nm = nm.replace('.',':').replace('K',';')
        this.coinLabel.string = nm
        this.rankLabel.string = data.rank
        for(let i=0; i<this.rankSprite.length; i++) {
            this.rankSprite[i].active = (i+1) === data.rank
        }
        
    },
    chaneNumToStr(num){
        if (num >= 10000) {
            str = (num / 1000.00).toFixed(2) + 'K';
        } else {
            str = num.toString();
        }
        return str
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
