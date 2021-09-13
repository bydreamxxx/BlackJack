const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

GAME_STATE = cc.Enum({
    WAITING:1,//等待玩家状态
    BETTING:2,//初次下注阶段
    PROTECTING:3,//买保险阶段
    PLAYING:4,//牌局进行状态
    RESULTING:5//显示结果状态
});

cc.Class({
    extends: cc.Component,

    properties: {
        remindCardLabel: cc.Label,
        banker: require("blackjack_player_ui"),
        playerList: [require("blackjack_player_ui")],
        bottomButton: cc.Node,

        minBet: cc.Label,
        maxBet: cc.Label,

        cardPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.remindCardLabel.string = "";
        this.minBet.string = "";
        this.maxBet.string = "";
        this.bottomButton.active = false;

        RoomED.addObserver(this);
        BlackJackED.addObserver(this);
    },

    onDestroy() {
        cc.dd.ResLoader.releaseBundle("blackjack_blackjack");

        RoomED.addObserver(this);
        BlackJackED.removeObserver(this);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.on_coin_room_enter:
                break;
            case BlackJackEvent.UPDATE_UI:
                this.updateUI();
                break;
            case BlackJackEvent.UPDATE_STATE:
                this.updateState();
            default:
                break;
        }
    },

    updateUI(){
        this.playerList.forEach(player=>{
            player.cleanProgress();
        })

        if(BlackJackData.turn == 100){
            // this.banker
        }else if(BlackJackData.turn > 100){
            let player = BlackJackData.getPlayerById(BlackJackData.turn);
            this.playerList[player.viewIdx].setProgress(BlackJackData.lastTime);
        }
    },

    updateState(){
        switch(BlackJackData.state){
            case GAME_STATE.WAITING:
                break;
            case GAME_STATE.BETTING:
                break;
            case GAME_STATE.PROTECTING:
                break;
            case GAME_STATE.PLAYING:
                break;
            case GAME_STATE.RESULTING:
                break;
        }
    },
});
