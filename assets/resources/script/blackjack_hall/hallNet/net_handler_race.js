// 转轮赛
var wheelRaceData = require('hall_wheelRace').wheelRaceData.Instance();
 
module.exports = {
    on_msg_match_race_list_ret: function(msg) {
        wheelRaceData.initData(msg)
    }
 };
 