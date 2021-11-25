let RummyEvent = cc.Enum({

});

let RummyED = new cc.dd.EventDispatcher();

var GAME_STATE = cc.Enum({
    WAITING:1,//等待玩家状态
    PLAYING:2,//牌局进行状态
    GROUPING:3,//已经有赢家，但是还可以组牌
    RESULTING:4,//显示结果状态
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
    }
});

module.exports = {
    RummyEvent: RummyEvent,
    RummyED: RummyED,
    RummyData: RummyData,
    GAME_STATE: GAME_STATE,
};