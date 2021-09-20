let BlackJackPlayerEvent = cc.Enum({
    PLAYER_ENTER: "PLAYER_ENTER",
    PLAYER_EXIT: "PLAYER_EXIT",
    PLAYER_GAME_INFO: "PLAYER_GAME_INFO",
});

let BlackJackPlayerED = new cc.dd.EventDispatcher();

let BlackJackPlayerData = cc.Class({
    ctor(){
        this.userId =0;
        this.playerName ='';
        this.sex =0;
        this.headUrl ='';
        this.openId =0;

        this.seat =0;
        this.state ='';
        this.coin =0;

        this.netState =0;
        this.score =0;

        this.level =0;
        this.exp =0;
        this.vipLevel =0;

        this.viewIdx =0;

        this.betInfosList= [];
    },

    init(data){
        this.userId = data.userId;
        this.playerName = data.name;
        this.sex = data.sex;
        this.headUrl = data.headUrl;
        this.openId = data.openId;

        this.seat = data.seat;
        this.state = data.state;
        this.coin = data.coin;

        this.netState = data.netState;
        this.score = data.score;

        this.level = data.level;
        this.exp = data.exp;
        this.vipLevel = data.vipLevel;

        this.viewIdx = data.seat;
    },

    playerEnter(){
        BlackJackPlayerED.notifyEvent(BlackJackPlayerEvent.PLAYER_ENTER, this);
    },

    updateGameInfo(betInfosList){
        this.betInfosList = betInfosList;
        BlackJackPlayerED.notifyEvent(BlackJackPlayerEvent.PLAYER_GAME_INFO, this);
    },

    setReady(ready){

    },
});

module.exports = {
    BlackJackPlayerEvent: BlackJackPlayerEvent,
    BlackJackPlayerED: BlackJackPlayerED,
    BlackJackPlayerData: BlackJackPlayerData,
};
