// 转轮赛
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var wheelRaceData = require('hall_wheelRace').wheelRaceData.Instance();
// var TEXAS_ED = new cc.dd.EventDispatcher();
 
module.exports = {
    on_msg_match_race_list_ret: function(msg) {
        wheelRaceData.initData(msg)
    },
    on_msg_match_race_reward: function(msg) {
        RoomED.notifyEvent(RoomEvent.on_match_race_reward, msg);
    }
 };
 