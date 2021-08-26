var jlmj_player_list = require( "base_mj_player_list" );

var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr;
cc.Class({
    extends: jlmj_player_list,

    isClub(){
        return RoomMgr.Instance().gameId == cc.dd.Define.GameType.BCMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    }
});
