var PlayerData = require("jsmj_player_data").PlayerData;

var jsmjUserPlayerData = cc.Class({

    extends: PlayerData,

    s_userPlayer: null,

    properties:{
        _isUserPlayer: {default:true, override:true},
    },

    statics: {

        Instance: function () {
            if(!this.s_userPlayer){
                this.s_userPlayer = new jsmjUserPlayerData();
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

module.exports = jsmjUserPlayerData;
