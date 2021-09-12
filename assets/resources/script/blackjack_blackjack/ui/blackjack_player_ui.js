const BlackJackPlayerED = require("BlackJackPlayerData").BlackJackPlayerED;
const BlackJackPlayerEvent = require("BlackJackPlayerData").BlackJackPlayerEvent;

let blackjack_player_ui = cc.Class({
    extends: cc.Component,

    properties: {
        headSp: cc.Node,
        nameLabel: cc.Label,
        score: cc.Label,
        coin: cc.Label,

        timerProgress: cc.ProgressBar,
        timerLabel: cc.Label,

        cardNode: cc.Node,

        giftBtn: cc.Node,

        viewIdx: 0,

        cardPrefab: cc.Prefab,
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

        if (this.timerProgress)
            this.timerProgress.node.active = false;
        if (this.timerLabel)
            this.timerLabel.string = "";

        this.cardNode.removeAllChildren();

        this.cardNodeList = [];

        if (this.giftBtn)
            this.giftBtn.active = false;
    },

    playerEnter(data, isbanker) {
        this.playerData = data;
        if (!isbanker) {
            this.nameLabel.string = cc.dd.Utils.subChineseStr(data.playerName, 0, 14);
            this.coin.string = data.score;
            this.headSp.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl);

            this.giftBtn.active = false;

            this.chipZone.removeAllChildren();
        }

        this.cardNode.removeAllChildren();

        this.node.active = true;
    },

    updateCard(data){
        this.cardNodeList = [];

        data.forEach(betInfo=>{
           let node = cc.instantiate(this.cardPrefab);
           this.cardNode.addChild(node);
           node.getComponent("blackjack_cardNode").init(betInfo);

           this.cardNodeList.push(node);
        });
    },

    onEventMessage: function (event, data) {
        if(data && data.viewIdx !== this.viewIdx){
            return;
        }
        switch (event) {
            case BlackJackPlayerEvent.PLAYER_ENTER:
                this.playerEnter(data, false);
                break;
            case BlackJackPlayerEvent.PLAYER_GAME_INFO:
                this.updateCard(data)
                break;
            default:
                break;
        }
    },
});

module.exports = blackjack_player_ui;
