const rmBet = require("rm_bet");

let RummyEvent = cc.Enum({
    UPDATE_UI: "UPDATE_UI",
    UPDATE_STATE: "UPDATE_STATE",
    PLAYER_TURN: "PLAYER_TURN",
    SYN_DESK: "SYN_DESK",
    CHECK_BUTTON: "CHECK_BUTTON",
    LOSE_GAME: "LOSE_GAME",
    UPDATE_DROP_COIN: "UPDATE_DROP_COIN",
    PLAYER_COMMIT: "PLAYER_COMMIT",
    PLAYER_WIN: "PLAYER_WIN",
    PLAYER_LOST: "PLAYER_LOST",
    GIVE_TIPS: "GIVE_TIPS",
});

let RummyED = new cc.dd.EventDispatcher();

const GAME_STATE = cc.Enum({
    WAITING:0,//等待玩家状态
    DEALING:1,//发牌状态
    PLAYING:2,//牌局进行状态
    GROUPING:3,//已经有赢家，但是还可以组牌
    RESULTING:4,//显示结果状态
});

const GROUP_STATE = cc.Enum({
    PURE_STRAIGHT: 1,
    IMPURE_STRAIGHT: 2,
    STRAIGHT: 3,
    SET: 4,
    NOT_CORRECT: 5,
    NO_GROUP: 6
});


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
        this.state = -1;
        this.lastState = -1;
        this.lastTime = 0;
        this.roomConfigId = 0;
        this.turn = 0;
        this.turnLeftTime = 0;
        this.banker = 0;
        this.xcard = -1;
        this.giveUp =-1;
        this.dropCoin = 0;
        // this.selfState = 3;
        this.roomInfo = null;
        this.dropScores = 0;
    },

    clear(){
        this.clearGameInfo();
        this.roomInfo = null;
    },

    clearGameInfo(){
        this.state = -1;
        this.lastState = -1;
        this.lastTime = 0;
        this.roomConfigId = 0;
        this.turn = 0;
        this.turnLeftTime = 0;
        this.banker = 0;
        this.xcard = -1;
        this.giveUp = -1;
        this.dropCoin = 0;
        this.dropScores = 0;
    },

    changeState(msg){
        this.lastState = this.state;
        this.state = msg.roomState;
        this.banker = msg.banker;
    },

    isBaida(card){
        return Math.floor(card / 10) === Math.floor(this.xcard / 10) || card === 172;
    },

    setGameInfo(data){
        this.lastState = this.state;
        this.state = data.bjState;
        this.lastTime = data.lastTime;
        this.roomConfigId = data.roomConfigId;
        this.turn = data.turn;
        this.turnLeftTime = data.turnLeftTime;
        this.banker = data.banker;
        this.xcard = data.xcard;
        this.giveUp = data.giveUp;
        // this.dropCoin = data.diropCoin;
        // this.selfState = data.selfState;
        this.dropScores = data.dropScores;

        let betConfig = rmBet.getItem(function (item) {
            return item.key == this.roomConfigId;
        }.bind(this))
        if(betConfig){
            this.perPoint = 80;
            this.maxWin = betConfig.bet * 80;
        }else{
            this.perPoint = 80;
            this.maxWin = 8000;
        }
    },

    setRoomInfo(info){
        this.roomInfo = info;
    },
});

module.exports = {
    RummyEvent: RummyEvent,
    RummyED: RummyED,
    RummyData: RummyData,
    GAME_STATE: GAME_STATE,
    GROUP_STATE: GROUP_STATE,
};