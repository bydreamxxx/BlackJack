const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;

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
        this.bottomButton.active = false;

        BlackJackED.addObserver(this);
    },

    onDestroy() {
        BlackJackED.removeObserver(this);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            default:
                break;
        }
    },
});
