const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        remindCardLabel: cc.Label,
        banker: cc.Node,
        playerList: [cc.Node],
        bottomButton: cc.Node,

        minBet: cc.Label,
        maxBet: cc.Label,

        cardPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.remindCardLabel.string = "";
        this.playerList.forEach(player => {
            player.active = false;
        });
        this.bottomButton.active = false;
    },

    start() {

    },

    // update (dt) {},
});
