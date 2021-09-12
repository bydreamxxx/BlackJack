let BlackJackEvent = cc.Enum({
    UPDATE_UI: "UPDATE_UI",
});

let BlackJackED = new cc.dd.EventDispatcher();

const BlackJackPlayerData = require('BlackJackPlayerData').BlackJackPlayerData;

let BlackJackData = cc.Class({
    s_data: null,
    statics: {
        Instance() {
            if (!this.s_data) {
                this.s_data = new BlackJackData();
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
        this.playerList = [];
    },

    setRoomInfo(info){
      this.roomInfo = info;
    },

    setGameInfo(msg){
        this.state = msg.bjState;
        this.lastTime = msg.lastTime;
        // this.playerInfo = msg.usersInfoList;
        this.roomConfigId = msg.roomConfigId;
        this.turn = msg.turn;

        msg.usersInfoList.forEach(player=>{
            let _player = this.getPlayerById(player.userId);
            if(_player){
                _player.updateGameInfo(player.betInfosList.concat());
            }
        })
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
        let data = new BlackJackPlayerData();
        data.init(player);
        this.playerList[player.seat] = data;
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
        if (id == cc.dd.user.id) {
            this.playerList = [];
            return;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == id) {
                this.playerList[i] = null;
            }
        }
        // DDZ_ED.notifyEvent(DDZ_Event.PLAYER_EXIT, view);
        // this.playerNumChanged();
    },

    getPlayerById(id){
        let player = null;
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].userId == id){
                player = this.playerList[i];
                break;
            }
        }
        return player;
    }
});

module.exports = {
    BlackJackEvent: BlackJackEvent,
    BlackJackED: BlackJackED,
    BlackJackData: BlackJackData,
};
