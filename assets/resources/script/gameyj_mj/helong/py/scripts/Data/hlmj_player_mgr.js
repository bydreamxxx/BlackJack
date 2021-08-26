var jlmj_player_mgr = require('base_mj_player_mgr');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var PlayerMgr = cc.Class({
    s_playerMgr: null,
    extends:jlmj_player_mgr,
    statics: {
        Instance: function () {
            if(!this.s_playerMgr){
                this.s_playerMgr = new PlayerMgr();
            }
            return this.s_playerMgr;
        },
        Destroy: function () {
            if(this.s_playerMgr){
                this.s_playerMgr.clear();
                this.s_playerMgr = null;
            }
        },
    },

    getDefaultFriendScore(){
        return 0;
    },

    isFriend(){
        return RoomMgr.Instance().gameId == cc.dd.Define.GameType.HLMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").hlmj;
    }
});

module.exports = PlayerMgr;
