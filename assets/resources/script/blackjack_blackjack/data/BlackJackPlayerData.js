let BlackJackPlayerEvent = cc.Enum({
    PLAYER_ENTER: "PLAYER_ENTER",
    PLAYER_EXIT: "PLAYER_EXIT",
    PLAYER_GAME_INFO: "PLAYER_GAME_INFO",
    UPDATE_BET_INFO: "UPDATE_BET_INFO",
    PLAYER_FAPAI: "PLAYER_FAPAI",
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

    playerExit(){
        BlackJackPlayerED.notifyEvent(BlackJackPlayerEvent.PLAYER_EXIT, this);

    },

    setGameInfo(betInfosList){
        this.betInfosList = betInfosList;
        BlackJackPlayerED.notifyEvent(BlackJackPlayerEvent.PLAYER_GAME_INFO, this);
    },

    setReady(ready){

    },

    getBetInfo(index){
        for(let i = 0; i<this.betInfosList.length; i++){
            if(this.betInfosList[i].index === index){
                return this.betInfosList[i];
            }
        }

        return null;
    },

    isBlackJack(index){
        let info = this.getBetInfo(index);
        if(info){
            let isBlackJack = false;
            if(info.cardsList.length == 2){
                if(info.cardsList[0] != 0 && info.cardsList[0] < 20 && info.cardsList[1] > 100){
                    isBlackJack = true;
                }else if(info.cardsList[1] != 0 && info.cardsList[1] < 20 && info.cardsList[2] > 100){
                    isBlackJack = true;
                }
            }

            return isBlackJack;
        }else{
            return false;
        }
    },

    canSplit(index){
        let info = this.getBetInfo(index);
        if(info){
            return this.betInfosList.length < 2 && info.cardsList.length == 2 && cc.dd.Utils.translate21(info.cardsList[0]) == cc.dd.Utils.translate21(info.cardsList[1]);
        }else{
            return false;
        }
    },

    canDouble(index){
        let info = this.getBetInfo(index);
        if(info){
            return info.cardsList.length == 2 && !this.isBlackJack(index);
        }else{
            return false;
        }
    },

    fapai(){
        cc.error(`player fapai ${this.viewIdx}`);
        BlackJackPlayerED.notifyEvent(BlackJackPlayerEvent.PLAYER_FAPAI, this);
    }
});

module.exports = {
    BlackJackPlayerEvent: BlackJackPlayerEvent,
    BlackJackPlayerED: BlackJackPlayerED,
    BlackJackPlayerData: BlackJackPlayerData,
};
