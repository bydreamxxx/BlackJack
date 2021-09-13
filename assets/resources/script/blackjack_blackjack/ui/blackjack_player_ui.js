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
        endTime:0,
        CDTime: 10,

        cardNode: cc.Node,

        giftBtn: cc.Node,

        viewIdx: 0,

        cardPrefab: cc.Prefab,

        isbanker: false,
    },


    _fixedTimeStep: 1/30,
    _lastTime: 0,

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.clear();

        BlackJackPlayerED.addObserver(this);

        this.node.active = false;
    },

    onDestroy() {
        BlackJackPlayerED.removeObserver(this);
    },

    update(dt){
        this._lastTime += dt;
        let fixedTime = this._lastTime / this._fixedTimeStep;
        for (let i = 0; i < fixedTime; i++) {
            this.fixedUpdate();
        }
        this._lastTime = this._lastTime % this._fixedTimeStep;
    },

    fixedUpdate(){
        if(this.timerProgress.node.active){
            let tempTime = (this.endTime - new Date().getTime()) / 1000;
            if(tempTime < 0){
                this.timerProgress.node.active = false;
                this.timerLabel.string = "";
                return;
            }
            this.timerProgress.progress = tempTime / this.CDTime;
            this.timerLabel.string = Math.floor(tempTime).toString();
        }
    },

    clear() {
        if (this.nameLabel)
            this.nameLabel.string = '';
        if (this.score)
            this.score.string = '';
        if (this.coin)
            this.coin.string = '';

        this.cleanProgress();

        this.cardNode.removeAllChildren();

        this.cardNodeList = [];

        if (this.giftBtn)
            this.giftBtn.active = false;
    },

    cleanProgress(){
        if (this.timerProgress)
            this.timerProgress.node.active = false;
        if (this.timerLabel)
            this.timerLabel.string = "";
        this.endTime = 0;
    },

    playerEnter(data) {
        this.playerData = data;
        if (!this.isbanker) {
            this.nameLabel.string = cc.dd.Utils.subChineseStr(data.playerName, 0, 14);
            this.coin.string = data.score;
            this.headSp.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl);

            this.giftBtn.active = false;

            this.chipZone.removeAllChildren();
        }

        this.cardNode.removeAllChildren();

        this.node.active = true;
    },

    setProgress(targetTime){
        this.endTime = new Date(new Date().getTime() + targetTime * 1000).getTime();
        this.timerProgress.progress = targetTime / this.CDTime;
        this.timerLabel.string = targetTime.toString();

        this.timerProgress.node.active = true;
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
                this.playerEnter(data);
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
