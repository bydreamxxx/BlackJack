//created by luke on 2019/4/22
var AppConfig = require('AppConfig');
var com_replay_data = require('com_replay_data').REPLAY_DATA;
cc.Class({
    extends: cc.Component,

    properties: {
        gameid: cc.EditBox,       //游戏类型
        recordid: cc.EditBox,     //回放码
        round: cc.EditBox,        //局数
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (AppConfig.PID != 3 && cc.sys.isNative == false) {
            this.node.scaleX = 1;
            this.node.scaleY = 1;
        }
        else {
            this.node.active = false;
        }
    },

    watchReplay() {
        com_replay_data.Instance().totalRound = parseInt(this.round.string);
        com_replay_data.Instance().getRecordHttpReq(this.gameid.string, this.recordid.string);
    },

    // update (dt) {},
});
