let RummyEvent = cc.Enum({

});

let RummyED = new cc.dd.EventDispatcher();

const GAME_STATE = cc.Enum({
    WAITING:1,//等待玩家状态
    PLAYING:2,//牌局进行状态
    GROUPING:3,//已经有赢家，但是还可以组牌
    RESULTING:4,//显示结果状态
});

const RummyPlayerData = require('RummyPlayerData').RummyPlayerData;

let RummyData = cc.Class({
    s_data: null,
    statics: {
        Instance() {
            if (!this.s_data) {
                this.s_data = new RummyData();
            }
            return this.s_data;
        },

        Destroy() {
            if (this.s_data) {
                this.s_data.clear();
                this.s_data = null;
            }
        }
    },

    ctor() {
        this.state = 1;
        this.lastState = 1;
        this.lastTime = 0;
        this.roomConfigId = 0;
        this.turn = 0;
        this.turnLeftTime = 0;
        this.banker = 0;
        this.xcard = -1;
        this.giveUp =-1;
        this.dropCoin = 0;
        this.selfState = 3;
        this.roomInfo = null;

        this.playerList = new Array(5);
        this.playerNum = 0;
    },

    clear(){
        this.state = 1;
        this.lastState = 1;
        this.lastTime = 0;
        this.roomConfigId = 0;
        this.turn = 0;
        this.turnLeftTime = 0;
        this.banker = 0;
        this.xcard = -1;
        this.giveUp =-1;
        this.dropCoin = 0;
        this.selfState = 3;
        this.roomInfo = null;
    },

    setRoomInfo(info){
        this.roomInfo = info;
    },

    setGameInfo(data){
        this.lastState = this.state;
        this.state = data.state;
        this.lastTime = data.lastTime;
        this.roomConfigId = data.roomConfigId;
        this.turn = data.turn;
        this.turnLeftTime = data.turnLeftTime;
        this.banker = data.banker;
        this.xcard = data.xcard;
        this.giveUp = data.giveUp;
        this.dropCoin = data.diropCoin;
        this.selfState = data.selfState;
    },

    changeState(msg){
        this.lastState = this.state;
        this.state = msg.roomState;
        this.banker = msg.banker;
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

        player.playerEnter();
    },

    otherPlayerEnter(playerId){
        // let mainUser =  this.getPlayerById(cc.dd.user.id);
        let player =  this.getPlayerById(playerId);
        // if(mainUser){
        //     let offset = mainUser.seat;
        //     player.viewIdx = player.seat - offset;
        //     if(player.viewIdx < 0){
        //         player.viewIdx += 5;
        //     }
        //     player.playerEnter();
        // }else{
            player.playerEnter();
        // }
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

module.exports = {
    RummyEvent: RummyEvent,
    RummyED: RummyED,
    RummyData: RummyData,
    GAME_STATE: GAME_STATE,
};