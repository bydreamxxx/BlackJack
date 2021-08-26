var PlayerHead = cc.Class({
    extends: require('base_mj_playerHead'),

    notFriend:function () {
        var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr.Instance();
        return RoomMgr.gameId != cc.dd.Define.GameType.ACMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").acmj;
    }
});

module.exports = PlayerHead;
