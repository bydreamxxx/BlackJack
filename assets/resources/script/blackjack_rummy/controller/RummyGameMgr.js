const RummyED = require("RummyData").RummyED;
const RummyEvent = require("RummyData").RummyEvent;
const RummyRoomMgr = require("RummyRoomMgr");

let RummyGameMgr = cc.Class({
    s_data: null,
    statics: {
        Instance() {
            if (!this.s_data) {
                this.s_data = new RummyGameMgr();
            }
            return this.s_data;
        },

        Destroy() {
            if (this.s_data) {
                this.s_data = null;
            }
        }
    },

    updateUI(){
        if(cc.dd.SceneManager.isGameSceneExit(cc.dd.Define.GameType.RUMMY)){
            RummyED.notifyEvent(RummyEvent.UPDATE_UI);
        }else{
            this.needUpdateUI = true;
        }
    },

    changeState(){
        RummyED.notifyEvent(RummyEvent.UPDATE_STATE);
    },

    actionChange(msg){
        let player = RummyRoomMgr.getPlayerById(msg.userId);
        if(player){
            player.resetCD();
        }
        RummyED.notifyEvent(RummyEvent.PLAYER_TURN);
    },
});

module.exports = RummyGameMgr.Instance();