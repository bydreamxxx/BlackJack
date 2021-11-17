// create by wj

const RecordEd = require('AudioChat').RecordEd;
var replay_data = require('com_blackjack_replay_data').REPLAY_DATA;
var REPLAY_ED = require('com_blackjack_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_blackjack_replay_data').REPLAY_EVENT;
const proto_id = require('c_msg_texas_cmd');
const replayProto = {
    initPlayer: 'cmd_record_room_info',             //初始化玩家
    banker: 'cmd_msg_texas_banker_notify',            //庄家，大/小盲确定
    poker: 'cmd_msg_texas_player_poker_notify',         //玩家手牌
    commonPoker: 'cmd_msg_texas_common_poker_notify',    //公牌数据
    opbet: 'cmd_msg_texas_bet_notify',                     //玩家下注
    nextPlayer: 'cmd_msg_texas_operate_player_notify',         //下一个操作玩家
    result: 'cmd_msg_texas_results_notify',                   //结算
    otherPoker:'cmd_msg_texas_other_player_poker_notify',    //其余玩家牌型
    playerList:'cmd_texas_player_list',                     //玩家列表
};

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
