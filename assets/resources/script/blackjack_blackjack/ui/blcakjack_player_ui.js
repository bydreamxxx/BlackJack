const BlackJackPlayerED = require("BlackJackPlayerData").BlackJackPlayerED;
const BlackJackPlayerEvent = require("BlackJackPlayerData").BlackJackPlayerEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        headSp: cc.Node,
        nameLabel: cc.Label,
        score: cc.Label,
        coin: cc.Label,
        point: cc.Label,

        chipLabel: cc.Label,

        chipZone: cc.Node,
        cardZone: cc.Node,

        giftBtn: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.clear();

        BlackJackPlayerED.addObserver(this);

        this.node.active = false;
    },

    onDestroy() {
        BlackJackPlayerED.removeObserver(this);
    },

    clear() {
        if (this.nameLabel)
            this.nameLabel.string = '';
        if (this.score)
            this.score.string = '';
        if (this.coin)
            this.coin.string = '';

        this.point.string = '0';
        this.chipLabel.string = '0';

        if (this.chipZone)
            this.chipZone.removeAllChildren();

        this.cardZone.removeAllChildren();

        if (this.giftBtn)
            this.giftBtn.active = false;
    },

    init(data, isbanker) {
        this.playerData = data;
        if (!isbanker) {
            this.nameLabel.string = cc.dd.Utils.subChineseStr(data.name, 0, 14);
            this.coin.string = data.coin;
            this.chipLabel.string = data.chip;

            this.giftBtn.active = false;

            this.chipZone.removeAllChildren();
        }

        this.point.string = data.point;
        this.cardZone.removeAllChildren();

        this.node.active = true;
    },

    onEventMessage: function (event, data) {
        switch (event) {
            default:
                break;
        }
    },
});
