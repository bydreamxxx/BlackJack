const BlackJackPlayerED = require("BlackJackPlayerData").BlackJackPlayerED;
const BlackJackPlayerEvent = require("BlackJackPlayerData").BlackJackPlayerEvent;

let blackjack_player_ui = cc.Class({
    extends: cc.Component,

    properties: {
        cardNode: cc.Node,

        giftBtn: cc.Node,

        viewIdx: 0,

        cardPrefab: cc.Prefab,

        isbanker: false,

        _fixedTimeStep: 1/30,
        _lastTime: 0,

        head: require("blackjack_head"),

        fapaiNode: cc.Node,

        betIndex: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.clear();

        BlackJackPlayerED.addObserver(this);

        if(!this.isbanker){
            this.node.active = false;
        }
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

    },

    clear() {
        cc.log(`座位号${this.viewIdx} clear`);
        if(!this.isbanker){
            this.head.clear();

            this.giftBtn.active = false;

            this.playerData = null;
        }

        this.cardNode.removeAllChildren();

        this.cardNodeList = [];
    },

    fapai(){
        cc.error(`player UI fapai ${this.viewIdx}`);
        this.cardNodeList[this.betIndex - 1].fapai(this.fapaiNode);
    },

    playerEnter(data) {
        this.clear();

        if (!this.isbanker) {
            this.head.init(data);

            this.giftBtn.active = false;
        }

        this.cardNode.removeAllChildren();

        this.node.active = true;
    },

    setGameInfo(data){
        this.head.sit();

        this.cardNodeList = [];
        this.cardNode.removeAllChildren();

        data.betInfosList.forEach(betInfo=>{
           let node = cc.instantiate(this.cardPrefab);
           this.cardNode.addChild(node);
           node.getComponent("blackjack_cardNode").init(betInfo, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0, true);
           node.x = (betInfo.index - 1) * 180;
           this.cardNodeList[betInfo.index - 1] = node.getComponent("blackjack_cardNode");
        });
    },

    /**
     * 更新手牌
     * @param index
     * @param cardsList
     * @param show
     */
    updateCards(index, cardsList, show){
        this.betIndex = index;
        if(this.isbanker){
            if(this.cardNodeList.length == 0){//banker未初始化
                let node = cc.instantiate(this.cardPrefab);
                this.cardNode.addChild(node);
                this.cardNodeList[index - 1] = node.getComponent("blackjack_cardNode");
                node.getComponent("blackjack_cardNode").init(cardsList, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0, show);
                return;
            }
        }

        if(this.cardNodeList[index - 1]){//已经有对应index的牌堆
            this.cardNodeList[index - 1].updateCards(cardsList, cardsList.length <= 2 && show);
            if(cardsList.length >2){
                this.fapai();
            }
        }else{//没有对应index的牌堆，做拆分处理
            let bet = 0;
            if(this.cardNodeList[0]){
                bet = this.cardNodeList[0].betInfo.value;
            }
            let node = cc.instantiate(this.cardPrefab);
            this.cardNode.addChild(node);
            this.cardNodeList[index - 1] = node.getComponent("blackjack_cardNode");
            node.x = (index - 1) * 180;
            node.getComponent("blackjack_cardNode").splitInfo(cardsList, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0, index, bet);
        }
    },

    /**
     * 更新下注及手牌信息
     * @param data
     */
    updateBetInfo(data){
        data.betInfosList.forEach(betInfo=>{
            if(!this.cardNodeList[betInfo.index - 1]){
                let node = cc.instantiate(this.cardPrefab);
                this.cardNode.addChild(node);
                this.cardNodeList[betInfo.index - 1] = node.getComponent("blackjack_cardNode");
                node.x = (betInfo.index - 1) * 180;
                node.getComponent("blackjack_cardNode").init(betInfo, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0, true);
            }else{
                this.cardNodeList[betInfo.index - 1].getComponent("blackjack_cardNode").updateInfo(betInfo);
            }

        });
    },

    showSplit(index){
        this.betIndex = index;
        this.cardNodeList.forEach(cardNode=>{
            if(cardNode.index == index){
                cardNode.showChoose();
            }else{
                cardNode.hideChoose();
            }
        })
    },

    closeSplit(){
        this.cardNodeList.forEach(cardNode=>{
            cardNode.hideChoose();
        })
    },

    onEventMessage: function (event, data) {
        if(data && data.viewIdx !== this.viewIdx){
            return;
        }
        this.playerData = data;

        switch (event) {
            case BlackJackPlayerEvent.PLAYER_ENTER:
                this.playerEnter(data);
                break;
            case BlackJackPlayerEvent.PLAYER_EXIT:
                this.clear();
                this.node.active = false;
                break;
            case BlackJackPlayerEvent.PLAYER_GAME_INFO:
                this.setGameInfo(data)
                break;
            case BlackJackPlayerEvent.UPDATE_BET_INFO:
                this.updateBetInfo(data);
                break;
            case BlackJackPlayerEvent.PLAYER_FAPAI:
                this.fapai();
            default:
                break;
        }
    },

    play_chupai_ani(cd){
        this.head.play_chupai_ani(cd);
    },

    stop_chupai_ani(){
        this.head.stop_chupai_ani();
    }
});

module.exports = blackjack_player_ui;
