const bjMaxBet = require("bj_max_bet");

let BlackJackEvent = cc.Enum({
    UPDATE_UI: "UPDATE_UI",
    UPDATE_STATE: "UPDATE_STATE",
    CLOSE_BET_BUTTON: "CLOSE_BET_BUTTON",
    DEAL_POKER: "DEAL_POKER",
    UPDATE_BET: "UPDATE_BET",
    PLAYER_TURN: "PLAYER_TURN",
    RESET_CD: "RESET_CD",
    SHOW_COIN: "SHOW_COIN",
    SHOW_RESULT: "SHOW_RESULT",
    CHECK_BET_BUTTON: "CHECK_BET_BUTTON",
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
        this.playerList = new Array(5);
        this.lastBet = 0;
        this.playerNum = 0;
    },

    clear(){
        this.playerList = [];
        this.lastBet = 0;
        this.playerNum = 0;
        this.hasUserPlayer = false;
        this.roomInfo = null;
        this.lastState = 0;
        this.state = 0;
        this.fapaiList = [];
        this.roomConfigId = 0;
        this.turn = 0;
    },

    changeState(msg){
        this.lastState = this.state;
        this.state = msg.roomState;
        BlackJackED.notifyEvent(BlackJackEvent.UPDATE_STATE);
    },

    setRoomInfo(info){
      this.roomInfo = info;
    },

    setGameInfo(msg){
        this.lastState = this.state;
        this.state = msg.bjState;
        this.lastTime = msg.lastTime;
        // this.playerInfo = msg.usersInfoList;
        this.roomConfigId = msg.roomConfigId - cc.dd.Define.GameType.BLACKJACK_GOLD * 100;
        this.turn = msg.turn;

        let config = bjMaxBet.getItem(function (item) {
            return item.key == this.roomConfigId + 100;
        }.bind(this))
        if(config){
            let str = config.maxbet.split(";");
            this.maxBet = parseInt(str[1]);
            this.minBet = parseInt(str[0]);
        }else{
            this.maxBet = 3000;
            this.minBet = 1000;
        }

        this.betRate = 100 / (this.maxBet / this.minBet);

        this.hasUserPlayer = false;

        this.banker = new BlackJackPlayerData();
        this.banker.init({userId: 100, seat: -1});

        msg.usersInfoList.forEach(player=>{
            if(player.userId === 100){
                this.banker.setGameInfo(player.betInfosList.concat());
            }else{
                if(player.userId === cc.dd.user.id){
                    this.hasUserPlayer = true;
                }
                let _player = this.getPlayerById(player.userId);
                if(_player){
                    _player.setGameInfo(player.betInfosList.concat());
                }
            }
        })

        this.fapaiList = [];

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

    fapai(){
        cc.gateNet.Instance().pauseDispatch();

        let length = this.fapaiList.length * 2;
        let canvas  = cc.find("Canvas").getComponent(cc.Canvas);
        let i = 0;
        canvas.schedule(()=>{
            if(cc.isValid(this)){
                let id = this.fapaiList[i % this.fapaiList.length];
                if(id == 100){
                    this.banker.fapai();
                }else{
                    let player = this.getPlayerById(id);
                    if(player){
                        player.fapai();
                    }
                }
                i++;
                if(i === length){
                    this.fapaiList = [];
                    // cc.error(`清空发牌列表`);
                }
                if(i === length + 1){
                    // cc.error(`发完牌啦`)
                    cc.gateNet.Instance().startDispatch();
                }
            }
        }, 0.4, length);
    },

    /**
     * 注册房间内语音玩家
     */
    requesYuYinUserData: function () {
        cc.dd.AudioChat.clearUsers();
        if (this.playerList) {
            this.playerList.forEach(function (player) {
                if (player) {
                    if (player.userId != cc.dd.user.id) { // && player.isOnLine
                        cc.dd.AudioChat.addUser(player.userId);
                    }
                }
            }, this);
        }
    },
});

module.exports = {
    BlackJackEvent: BlackJackEvent,
    BlackJackED: BlackJackED,
    BlackJackData: BlackJackData,
};
