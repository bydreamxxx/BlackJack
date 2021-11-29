const RummyPlayerData = require('RummyPlayerData').RummyPlayerData;

let RummyRoomMgr = cc.Class({
    s_data: null,
    statics: {
        Instance() {
            if (!this.s_data) {
                this.s_data = new RummyRoomMgr();
            }
            return this.s_data;
        },

        Destroy() {
            if (this.s_data) {
                this.s_data = null;
            }
        }
    },

    ctor(){
        this.playerList = new Array(5);
        this.playerNum = 0;
    },

    updatePlayerNum: function () {
        this.gamePlayerNum = 5;
        if (this.playerList && this.playerList.length) {
            for (let i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i] && this.playerList[i].userId) {
                    this.playerExit(this.playerList[i].userId);
                }
            }
        }
        this.playerList = new Array(this.gamePlayerNum);
    },

    playerEnter(player){
        let data = new RummyPlayerData();
        data.init(player);
        this.playerList[player.seat] = data;
        this.playerNum++;
    },

    otherPlayerEnter(playerId){
        let mainUser =  this.getPlayerById(cc.dd.user.id);
        let player =  this.getPlayerById(playerId);
        if(mainUser){
            let offset = mainUser.seat;
            player.viewIdx = player.seat - offset;
            if(player.viewIdx < 0){
                player.viewIdx += 5;
            }
            player.playerEnter();
        }else{
            player.playerEnter();
        }
    },

    playerEnterGame(){
        let mainUser =  this.getPlayerById(cc.dd.user.id);
        if(mainUser){
            mainUser.viewIdx = 0;
            this.playerList.forEach(player=>{
                if(player.userId !== mainUser.userId){

                    let offset = mainUser.seat;
                    player.viewIdx = player.seat - offset;
                    if(player.viewIdx < 0){
                        player.viewIdx += 5;
                    }
                }

                player.playerEnter();
            });
        }else{
            this.playerList.forEach(player=>{
                player.playerEnter();
            });
        }
    },

    playerExit(id){
        this.playerNum--;
        if (id == cc.dd.user.id) {
            this.playerList = [];
            this.playerNum = 0;
            return;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == id) {
                this.playerList[i].playerExit();
                this.playerList[i] = null;
            }
        }
        // DDZ_ED.notifyEvent(DDZ_Event.PLAYER_EXIT, view);
        // this.playerNumChanged();
    },

    getPlayer(id){
        return this.getPlayerById(id);
    },

    getPlayerById(id){
        let player = null;
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i] && this.playerList[i].userId == id){
                player = this.playerList[i];
                break;
            }
        }
        return player;
    },
});

module.exports = RummyRoomMgr.Instance();