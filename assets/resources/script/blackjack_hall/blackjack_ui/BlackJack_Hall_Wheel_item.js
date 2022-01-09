var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var game_room_list = require('game_room');

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

    setRoomData(data){
        game_room_list.items.forEach(function (roomItem) {
            if (data.gameType == roomItem.gameid && roomItem.roomid == data.roomCoinId) {
                this.roomItem = roomItem;
                // this.titleTxt.setText(roomItem.titel);
                // this.baseScoreTxt.string = roomItem.basescore;
                // this.playerNumTxt.string = data.fangjianrenshu;
                // this.descTxt.setText(roomItem.desc);
                // var index = roomItem.roomid;

                // if (index > 4) {
                //     index = 4;
                // }
                // this.bg.spriteFrame = this.bgSprites[index - 1];
                // this.tubiaoBg.spriteFrame = this.tubiaoSprites[index - 1];
                // this.roleBg.spriteFrame = this.roleBgSprites[index - 1];

                // this.roomid = roomItem.roomid;
                // this.gameid = roomItem.gameid;
            }
        }.bind(this));
    },

    setData(data) {
        this.rackData = data
        this.setRoomData(data)
        if(this.highestLabel) { // 奖池
            // 适应字体文件
            let nm = this.chaneNumToStr(data.poolNum)//cc.dd.Utils.getNumToWordTransform(data.poolNum)
            nm = nm.replace('.',':').replace('K',';')
            this.highestLabel.string = nm
        }
        if(this.costLabel) { //报名费
            this.costLabel.string = cc.dd.Utils.getNumToWordTransform(data.signFeeList[0].num)
        }
        if(this.joinLabel) { //报名人数
            this.joinLabel.setText('peoplebattle', '', '', data.joinNum)
        }
        // if(data.gameType===0) {
        //     this.changeSprite(this.highestSprite, this.highestSpriteFramse[0]);
        //     this.changeSprite(this.costSprite, this.costSpriteFrames[0]);
        // } else if(data.gameType===1) {
        //     this.changeSprite(this.highestSprite, this.highestSpriteFramse[1]);
        //     this.changeSprite(this.costSprite, this.costSpriteFrames[1]);
        // } else if(data.gameType===2) {
        //     this.changeSprite(this.highestSprite, this.highestSpriteFramse[2]);
        //     this.changeSprite(this.costSprite, this.costSpriteFrames[2]);
        // }
    },
    chaneNumToStr(num){
        if (num >= 10000) {
            str = (num / 1000.00).toFixed(2) + 'K';
        } else {
            str = num.toString();
        }
        return str
    },
    changeSprite(sprite, spriteFrame){
        if(sprite){
            sprite.spriteFrame = spriteFrame;
        }
    },
    // 报名
    onCompete() {
        if (HallPropData.getCoin() < this.rackData.sign_fee) {
            var tipsText = '金币不足' + entermin + ',不能进入';
            cc.dd.DialogBoxUtil.show(0, tipsText, "text33");
        }
        
        var scriptData = require('texas_data').texas_Data.Instance();
        scriptData.setData(this.roomItem);
        scriptData.configId = this.roomItem.key

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(this.rackData.gameType);
        msg.setRoomId(this.rackData.roomCoinId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },
});
