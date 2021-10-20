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

    editor:{
        menu:"BlackJack/blackjack_player_ui"
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
        cc.error(`座位号${this.viewIdx} clear`);
        if(!this.isbanker){
            this.head.clear();

            this.giftBtn.active = false;

            this.playerData = null;
        }

        this.cardNode.removeAllChildren();

        this.cardNodeList = [];
    },

    fapai(isDouble, func){
        cc.log(`player UI fapai ${this.viewIdx}`);
        this.cardNodeList[this.betIndex - 1].fapai(this.fapaiNode, func, isDouble);
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

    changeChipPos(){
        this.cardNodeList.forEach(cardNode=>{
            cardNode.changeChipPos();
        });
    },

    /**
     * msg_bj_info初始化
     * @param data
     */
    setGameInfo(data){
        if(!this.isbanker){
            this.head.sit();
        }

        this.cardNodeList = [];
        this.cardNode.removeAllChildren();

        data.betInfosList.forEach(betInfo=>{
           let node = cc.instantiate(this.cardPrefab);
           this.cardNode.addChild(node);
           node.getComponent("blackjack_cardNode").init(betInfo, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0);
           node.x = (betInfo.index - 1) * 180;
           this.cardNodeList[betInfo.index - 1] = node.getComponent("blackjack_cardNode");
        });
    },

    /**
     * msg_bj_deal_poker更新手牌
     * @param index
     * @param cardsList
     * @param needFapai
     */
    dealPoker(index, cardsList, needFapai, isDouble){
        this.betIndex = index;
        if(this.isbanker){
            if(this.cardNodeList.length == 0){//banker未初始化
                let node = cc.instantiate(this.cardPrefab);
                this.cardNode.addChild(node);
                this.cardNodeList[index - 1] = node.getComponent("blackjack_cardNode");
                node.getComponent("blackjack_cardNode").init({cardsList:[]}, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0);
            }
        }

        if(this.cardNodeList[index - 1]){//已经有对应index的牌堆
            this.cardNodeList[index - 1].updateCards(cardsList, true, isDouble);
            if(cardsList.length >= 2 && needFapai){
                cc.gateNet.Instance().dispatchTimeOut(4);
                this.fapai(isDouble, ()=>{
                    cc.gateNet.Instance().clearDispatchTimeout();
                });
            }
        }else{//没有对应index的牌堆，做拆分处理
            cc.error(`没有分牌`);
            // let bet = 0;
            // if(this.cardNodeList[0]){
            //     bet = this.cardNodeList[0].betInfo.value + this.cardNodeList[0].betInfo.insure;
            // }
            // let node = cc.instantiate(this.cardPrefab);
            // this.cardNode.addChild(node);
            // this.cardNodeList[index - 1] = node.getComponent("blackjack_cardNode");
            // node.x = (index - 1) * 180;
            // node.getComponent("blackjack_cardNode").splitInfo(cardsList, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0, index, bet);
        }
    },

    /**
     * msg_bj_bet_ret更新下注及手牌信息
     * @param data
     */
    updateBetInfo(data, isSplit){
        if(!this.isbanker){
            this.head.changeCoin(data.score);
        }

        if(isSplit){
            cc.gateNet.Instance().dispatchTimeOut(1);

            let first = {
                cardsList:[data.betInfosList[0].cardsList[0]],
                index: 1,
                value: data.betInfosList[0].value,
                insure: data.betInfosList[0].insure,
            }
            this.cardNodeList[0].getComponent("blackjack_cardNode").updateInfo(first);
            this.cardNodeList[0].x -= 90;

            let second = {
                cardsList:[data.betInfosList[0].cardsList[1]],
                index: 2,
                value: data.betInfosList[0].value,
                insure: data.betInfosList[0].insure,
            }

            let node = cc.instantiate(this.cardPrefab);
            this.cardNode.addChild(node);
            this.cardNodeList[1] = node.getComponent("blackjack_cardNode");
            node.x = 90;
            node.getComponent("blackjack_cardNode").init(second, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0);
        }else{
            data.betInfosList.forEach(betInfo=>{
                if(!this.cardNodeList[betInfo.index - 1]){
                    let node = cc.instantiate(this.cardPrefab);
                    this.cardNode.addChild(node);
                    this.cardNodeList[betInfo.index - 1] = node.getComponent("blackjack_cardNode");
                    node.x = (betInfo.index - 1) * 180;
                    node.getComponent("blackjack_cardNode").init(betInfo, this.viewIdx == 3 || this.viewIdx == 4, this.isbanker, this.viewIdx == 0);
                }else{
                    this.cardNodeList[betInfo.index - 1].getComponent("blackjack_cardNode").updateInfo(betInfo);
                }

            });
        }
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
        let data1 = null;
        if(cc.dd._.isArray(data)){
            data1 = data[1];
            data = data[0];
        }
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
                this.updateBetInfo(data, data1);
                break;
            case BlackJackPlayerEvent.PLAYER_FAPAI:
                this.fapai(false, data1);
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
