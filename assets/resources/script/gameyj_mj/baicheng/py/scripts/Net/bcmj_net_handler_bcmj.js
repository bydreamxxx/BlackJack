var HuType = require('jlmj_define').HuType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");

var fz_handler = cc.Class({

    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("bcmj_net_handler_bcmj 父类");
    },

    setReconnectRule(rule){
        RoomMgr.Instance()._Rule = rule;
        RoomMgr.Instance()._Rule.iszangang = rule.reservedList[0] === 'true';
        RoomMgr.Instance()._Rule.isgangjiafan = rule.reservedList[1] === 'true';
        RoomMgr.Instance()._Rule.isxiaojifeidan = rule.reservedList[2] === 'true';
        let fengding = parseInt(RoomMgr.Instance()._Rule.reservedList[3]);
        RoomMgr.Instance()._Rule.fengding = cc.dd._.isNumber(fengding) && !isNaN(fengding) ? fengding : 1;
    },

    getJBC(){
        return cc.dd.Define.GameType.BCMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.BCMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return false;
    },

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    },
});

module.exports = new fz_handler();