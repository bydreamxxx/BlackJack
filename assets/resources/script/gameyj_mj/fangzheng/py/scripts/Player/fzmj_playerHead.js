var PlayerHead = cc.Class({
    extends: require('base_mj_playerHead'),

    notFriend:function () {
        var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr.Instance();
        return RoomMgr.gameId != cc.dd.Define.GameType.FZMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").fzmj;
    }
});

module.exports = PlayerHead;
