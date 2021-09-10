let BlackJackEvent = cc.Enum({
    UPDATE_UI: "UPDATE_UI",
});

let BlackJackED = new cc.dd.EventDispatcher();

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

    },

    setRoomInfo(info){
      this.roomInfo = info;
    },

    setGameInfo(msg){
        this.state = msg.bjState;
        this.lastTime = msg.lastTime;
        this.playerInfo = msg.usersInfoList;
        this.roomConfigId = msg.roomConfigId;
        this.turn = msg.turn;
    },
});

module.exports = {
    BlackJackEvent: BlackJackEvent,
    BlackJackED: BlackJackED,
    BlackJackData: BlackJackData,
};
