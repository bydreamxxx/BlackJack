var HuType = require('jlmj_define').HuType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

let base_mj_net_handler_base_mj = require("base_mj_net_handler_base_mj");

var fz_handler = cc.Class({

    extends: base_mj_net_handler_base_mj.handler,

    ctor: function () {
        cc.log("acmj_net_handler_acmj 父类");
    },

    setReconnectRule(rule){
        RoomMgr.Instance()._Rule = rule;
        RoomMgr.Instance()._Rule.ishongzhongmaitianfei = RoomMgr.Instance()._Rule.reservedList[0] === 'true';
        RoomMgr.Instance()._Rule.isguadafeng = RoomMgr.Instance()._Rule.reservedList[1] === 'true';
        RoomMgr.Instance()._Rule.isduibao = RoomMgr.Instance()._Rule.reservedList[2] === 'true';
        RoomMgr.Instance()._Rule.iskaipaizha = RoomMgr.Instance()._Rule.reservedList[3] === 'true';
    },

    getJBC(){
        return cc.dd.Define.GameType.ACMJ_GOLD;
    },

    getFriend(){
        return cc.dd.Define.GameType.ACMJ_FRIEND;
    },

    checkSpecialHu(hutype){
        return hutype == HuType.JIA5_HU || hutype == HuType.DANDIAO_PIAOHU;;
    },

    on_mj_ack_game_dabao: function( msg ) {
        if (!this.headerHandle(msg)) return;
        this.require_DeskData.Instance().dabao(msg);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.MO_HUAN_BAO_PAI, [msg.baopaiindex, null]);
    },

    initMJComponet(){
        return require("mjComponentValue").acmj;
    },
});

module.exports = new fz_handler();