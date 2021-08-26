var PlayerData = require("bcmj_player_data").PlayerData;

var bcmjUserPlayerData = cc.Class({

    extends: PlayerData,

    s_userPlayer: null,

    properties:{
        _isUserPlayer: {default:true, override:true},
    },

    statics: {

        Instance: function () {
            if(!this.s_userPlayer){
                this.s_userPlayer = new bcmjUserPlayerData();
            }
            return this.s_userPlayer;
        },

        Destroy: function () {
            if(this.s_userPlayer){
                this.s_userPlayer = null;
            }
        },
    },
});

module.exports = bcmjUserPlayerData;
