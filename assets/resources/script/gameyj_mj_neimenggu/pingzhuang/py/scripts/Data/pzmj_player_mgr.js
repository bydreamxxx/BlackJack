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

    setThreeSeat: function (player) {
        //三人麻将 视觉座位号
        if(this.require_UserPlayer.idx == 0){
            if(player.idx == 1){
                player.viewIdx = 1;
            }else{
                player.viewIdx = 2;
            }
        }else if(this.require_UserPlayer.idx == 1){
            if(player.idx == 2){
                player.viewIdx = 1;
            }else{
                player.viewIdx = 2;
            }
        }else{
            if(player.idx == 0){
                player.viewIdx = 1;
            }else{
                player.viewIdx = 2;
            }
        }
    },

    getDefaultFriendScore(){
        return 1000;
    },

    isFriend(){
        return RoomMgr.Instance().gameId == cc.dd.Define.GameType.PZMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    }
});

module.exports = PlayerMgr;
