const RummyED = require("RummyData").RummyED;
const RummyEvent = require("RummyData").RummyEvent;
const RoomMgr = require('jlmj_room_mgr').RoomMgr;
const RummyData = require("RummyData").RummyData.Instance();

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

    actionChange(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.resetCD();
        }
        RummyED.notifyEvent(RummyEvent.PLAYER_TURN);
    },

    changeState(){
        RummyED.notifyEvent(RummyEvent.UPDATE_STATE);
    },

    dealPoker(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.dealPoker(msg.type, msg.cardList);
        }
    },

    faPai(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            if(RummyData.state === 1){
                player.faPai(msg);
            }else{
                player.moPai(RummyData.cardType, msg);
            }
        }
    },

    gameResult(msg){
        RummyData.clearGameInfo();
        RummyED.notifyEvent(RummyEvent.SHOW_RESULT, msg);
    },

    giveUpPoker(msg){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(msg.userId);
        if(player){
            player.giveUpPoker(msg.card);
        }
    },

    updateUI(){
        if(cc.dd.SceneManager.isGameSceneExit(cc.dd.Define.GameType.RUMMY)){
            RummyED.notifyEvent(RummyEvent.UPDATE_UI);
        }else{
            this.needUpdateUI = true;
        }
    },

    synGiveupPoker(msg){
        RummyData.xcard = msg.xcard;
        RummyData.giveUp = msg.giveupCard;
        RummyED.notifyEvent(RummyEvent.SYN_DESK);
    },

    updatePoker(groupList){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){
            player.updatePoker(groupList);
        }
    },
});

module.exports = RummyGameMgr.Instance();