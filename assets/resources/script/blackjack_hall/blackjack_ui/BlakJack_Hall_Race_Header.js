// 头像

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        headIcon: cc.Sprite,
        nameLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start() {

    },

    setData(data) {
        if(this.coinLabel) {
            this.coinLabel.string = data.score
        }
        if(this.headIcon) {
            this.headIcon.string = data.head_url
        }
        if(this.nameLabel) {
            this.nameLabel.string = data.name
        }
    },
    
    initHead:function (openId, headUrl, fromFileName) {
        this.openId = openId;
        this.headSp.node.active = true;
        cc.dd.SysTools.loadWxheadH5(this.headSp, cc.dd.Utils.getWX64Url(headUrl));
    },
});
