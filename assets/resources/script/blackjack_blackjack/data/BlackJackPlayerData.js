let BlackJackPlayerEvent = cc.Enum({
    PLAYER_ENTER: "PLAYER_ENTER",
    PLAYER_EXIT: "PLAYER_EXIT",
    PLAYER_GAME_INFO: "PLAYER_GAME_INFO",
});

let BlackJackPlayerED = new cc.dd.EventDispatcher();

let BlackJackPlayerData = cc.Class({
    userId :0,
    playerName :'',
    sex :0,
    headUrl :'',
    openId :0,

    seat :0,
    state :'',
    coin :0,

    netState :0,
    score :0,

    level :0,
    exp :0,
    vipLevel :0,

    viewIdx :0,

    betInfosList: [],

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
    }
});

module.exports = {
    BlackJackPlayerEvent: BlackJackPlayerEvent,
    BlackJackPlayerED: BlackJackPlayerED,
    BlackJackPlayerData: BlackJackPlayerData,
};
