var PlayerData = require("hlmj_player_data").PlayerData;

var hlmjUserPlayerData = cc.Class({

    extends: PlayerData,

    s_userPlayer: null,

    properties:{
        _isUserPlayer: {default:true, override:true},
    },

    statics: {

        Instance: function () {
            if(!this.s_userPlayer){
                this.s_userPlayer = new hlmjUserPlayerData();
            }
            return this.s_userPlayer;
        },

        Destroy: function () {
            if(this.s_userPlayer){
                this.s_userPlayer = null;
            }
        },
    },

    clearCtrlStatus(){
        this._super();
        this.isTempBaoTing = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;
    },
});

module.exports = hlmjUserPlayerData;
