const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

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
        cc.dd.ResLoader.loadAtlas("blackjack_blackjack/atlas/cards", ()=>{});

        this.remindCardLabel.string = "";
        this.minBet.string = "";
        this.maxBet.string = "";
        this.bottomButton.active = false;

        RoomED.addObserver(this);
        BlackJackED.addObserver(this);
    },

    onDestroy() {
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
            default:
                break;
        }
    },

    updateUI(){

    }
});
