var jlmj_player_list = require( "base_mj_player_list" );

let mjConfigValue = null;

var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr;
cc.Class({
    extends: jlmj_player_list,

    ctor(){
        mjConfigValue = this.initMJConfig();
    },

    playerExit: function (player) {
        if(this.player_ui_arr[player.viewIdx].playerLocation){
            this.player_ui_arr[player.viewIdx].playerLocation.active = false;
        }

        this._super(player);
    },

    /**
     * 更新GPS警报
     */
    refreshGPSWarn: function () {
        if(!this.require_DeskData.Instance().isFriend()){
            return;
        }

        if(this.waitRefresh != null){
            return;
        }

        if (RoomMgr.Instance()._Rule.gps) {
            this.waitRefresh = setTimeout(()=>{
                this.waitRefresh = null;
            }, 1000);

            var gpsList = [];
            var playerInfo = this.require_playerMgr.Instance().playerList;
            cc.log("gps关闭开始");
            for (var i = 0; i < playerInfo.length; i++) {
                if(playerInfo[i]){
                    cc.log("gps开始关闭");
                    this.player_ui_arr[playerInfo[i].viewIdx].head.gps_warn.active = false;
                    if (playerInfo[i] && playerInfo[i].location) {
                        gpsList.push({ viewIdx: playerInfo[i].viewIdx, location: playerInfo[i].location });
                    }
                }
            }
        }
    },


    //位置更新
    on_player_location_change: function(msg) {
        if(!this.require_DeskData.Instance().isFriend()){
            return;
        }
        this._super(msg);
        var jlmj_prefab = require(mjConfigValue.prefabCfg);
        var gps = cc.dd.UIMgr.getUI(jlmj_prefab.NMMJ_GPS);
        if (gps) {
            gps.getComponent('jlmj_gps').setGpsData(this.require_playerMgr.Instance().playerList);
        }
    },

    isClub(){
        return RoomMgr.Instance().gameId == cc.dd.Define.GameType.PZMJ_FRIEND;
    },

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    },

    initMJConfig(){
        return require('mjConfigValue').nmmj;
    },
});
