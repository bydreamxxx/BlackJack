// 头像

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        headIcon: require('klb_hall_Player_Head'),
        nameLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start() {

    },

    setData(data) {
        if(this.coinLabel) {
            this.coinLabel.string = cc.dd.Utils.getNumToWordTransform(data.score)
        }
        if(this.headIcon) {
            this.headIcon.initHead (0, data.head_url)
        }
        if(this.nameLabel) {
            this.nameLabel.string = data.name
        }
    },
    
});
