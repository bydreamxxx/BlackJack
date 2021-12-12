

cc.Class({
    extends: cc.Component,

    properties: {
        highestSprite: cc.Sprite,
        costSprite: cc.Sprite,
        
        highestLabel: cc.Label,
        costLabel: cc.Label,
        joinLabel: cc.Label,

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
            this.highestLabel.string = data.pool_num
        }
        if(this.costLabel) { //报名费
            this.costLabel.string = data.sign_fee
        }
        if(this.joinLabel) { //报名人数
            this.joinLabel.string = data.join_num
        }
        let type = 0
        if(type===0) {
            this.changeSprite(this.highestSprite, this.highestSpriteFramse[0]);
            this.changeSprite(this.costSprite, this.costSpriteFrames[0]);
        } else if(type===1) {
            this.changeSprite(this.highestSprite, this.highestSpriteFramse[1]);
            this.changeSprite(this.costSprite, this.costSpriteFrames[1]);
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
