
cc.Class({
    extends: cc.Component,

    properties: {
        highestSprite: cc.Sprite,
        costSprite: cc.Sprite,
        
        highestLabel: cc.Label,
        costLabel: cc.Label,
        joinLabel: require('LanguageLabel'),

        highestSpriteFramse: [cc.SpriteFrame],
        costSpriteFrames: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start() {

    },

    setData(data) {
        this.rackData = data
        if(this.highestLabel) { // 奖池
            this.highestLabel.string = cc.dd.Utils.getNumToWordTransform(data.pool_num)
        }
        if(this.costLabel) { //报名费
            this.costLabel.string = cc.dd.Utils.getNumToWordTransform(data.sign_fee.num)
        }
        if(this.joinLabel) { //报名人数
            this.joinLabel.setText('peoplebattle', '', '', data.join_num)
        }
        if(data.game_type===0) {
            this.changeSprite(this.highestSprite, this.highestSpriteFramse[0]);
            this.changeSprite(this.costSprite, this.costSpriteFrames[0]);
        } else if(data.game_type===1) {
            this.changeSprite(this.highestSprite, this.highestSpriteFramse[1]);
            this.changeSprite(this.costSprite, this.costSpriteFrames[1]);
        } else if(data.game_type===2) {
            this.changeSprite(this.highestSprite, this.highestSpriteFramse[2]);
            this.changeSprite(this.costSprite, this.costSpriteFrames[2]);
        }
    },
    changeSprite(sprite, spriteFrame){
        if(sprite){
            sprite.spriteFrame = spriteFrame;
        }
    },
    // 报名
    onCompete() {
        // var msg = new cc.pb.room_mgr.msg_match_race_list_req();
        // msg.setGameType(data.hallGameid);
        // cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_match_race_list_req, msg, "msg_match_race_list_req", true);
    },
});
