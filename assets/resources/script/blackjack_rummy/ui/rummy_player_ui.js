const RummyPlayerED = require("RummyPlayerData").RummyPlayerED;
const RummyPlayerEvent = require("RummyPlayerData").RummyPlayerEvent;

let rummy_player_ui = cc.Class({
    extends: cc.Component,

    properties: {
        viewIdx: 0,

        head: require("rummy_head"),

        _fixedTimeStep: 1/30,
        _lastTime: 0,

        cardNode: cc.Node,
        showCardNode: cc.Node,
        discardNode: cc.Node,
        shoupaiNode: cc.Node,

        card: cc.Prefab,
    },

    editor:{
        menu:"Rummy/rummy_player_ui"
    },

    onLoad() {
        this.clear();

        this.node.active = this.viewIdx === 0;

        RummyPlayerED.addObserver(this);
    },

    onDestroy() {
        RummyPlayerED.removeObserver(this);
    },

    onEventMessage: function (event, data) {
        if(data[0] && data[0].viewIdx !== this.viewIdx){
            return;
        }
        this.playerData = data[0];

        switch (event) {
            case RummyPlayerEvent.PLAYER_ENTER:
                this.playerEnter(data[0]);
                break;
            case RummyPlayerEvent.PLAYER_EXIT:
                this.clear();
                this.node.active = false;
                break;
            case RummyPlayerEvent.GIVE_UP_POKER:
                this.giveUpPoker(data[1]);
                break;
            case RummyPlayerEvent.UPDATE_POKER:
                this.updatePoker();
                break;
            case RummyPlayerEvent.DEAL_POKER:
                this.dealPoker(data[1], data[2]);
                break;
            case RummyPlayerEvent.FA_PAI:
                this.faPai(data[1], data[2]);
                break;
            case RummyPlayerEvent.MO_PAI:
                this.moPai(data[1], data[2]);
                break;
            case RummyPlayerEvent.PLAYER_RESET_CD:
                this.play_chupai_ani();
                break;
            default:
                break;
        }
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

    clear(){
        this.head.clear();
        this.playerData = null;
    },

    /**
     * 摸牌
     * @param type
     * @param cardList
     */
    dealPoker(type, cardList){
        let cardNode = null;

        let worldPos = this.shoupaiNode.convertToWorldSpace(cc.v2(0, 0));
        let endPos = cc.v2(0, 0);

        if(type === "0"){
            cardNode = cc.instantiate(this.card);
            cardNode.getComponent("blackjack_card").init(cardList[0]);

            cardNode.scaleX = 0.538;
            cardNode.scaleY= 0.538;
            this.cardNode.addChild(cardNode);

            endPos = this.cardNode.convertToNodeSpace(worldPos);

        }else{
            cardNode = this.discardNode.children[this.discardNode.childrenCount - 1]
            if(cardNode){
                if(cardNode.getComponent("blackjack_card").getCard() !== cardList[0]){
                    cc.error(`弃牌堆错误 ${cardNode.getComponent("blackjack_card").getCard()} ${cardList[0]}`)
                    return;
                }
            }else{
                cc.error(`弃牌堆错误 弃牌堆无牌 ${cardList[0]}`)
                return;
            }

            endPos = this.discardNode.convertToNodeSpace(worldPos);
        }

        if(cardNode){
            cc.tween(cardNode)
                .to(0.3, {scale: 0.385, position: endPos}, { easing: 'quartOut'})
                .delay(0.5)
                .call(()=>{
                    cardNode.destroy();
                })
                .start();
        }
    },

    /**
     * 自己摸牌
     */
    faPai(type, card){
        if(!cc.dd._.isString(type)){
            cc.error('发牌错误');
            return;
        }

        if(type === "0"){

        }else{

        }
    },

    /**
     * 打牌
     * @param card
     */
    giveUpPoker(card){
        if(this.viewIdx !== 0){
            let worldPos = this.shoupaiNode.convertToWorldSpace(cc.v2(0, 0));
            let startPos = this.discardNode.convertToNodeSpace(worldPos);

            let cardNode = cc.instantiate(this.card);
            cardNode.getComponent("blackjack_card").init(card);
            cardNode.scaleX =  0.385;
            cardNode.scaleY=  0.385;

            this.discardNode.addChild(cardNode);
            cardNode.position = startPos;

            cc.tween(cardNode)
                .delay(0.4)
                .to(0.4, {scale:0.538, position: cc.v2(0, 0)}, { easing: 'quartIn'})
                .start();
        }else{
            let cardNode = this.discardNode.children[this.discardNode.childrenCount - 1]
            if(cardNode){
                if(cardNode.getComponent("blackjack_card").getCard() !== card){
                    cc.error(`打牌错误 ${cardNode.getComponent("blackjack_card").getCard()} ${card}`)

                    let cardNode = cc.instantiate(this.card);
                    cardNode.getComponent("blackjack_card").init(card);
                    cardNode.scaleX =  0.538;
                    cardNode.scaleY=  0.538;

                    this.discardNode.addChild(cardNode);
                }
            }else{
                cc.error(`打牌错误 没有弃牌堆 ${card}`)

                let cardNode = cc.instantiate(this.card);
                cardNode.getComponent("blackjack_card").init(card);
                cardNode.scaleX =  0.538;
                cardNode.scaleY=  0.538;

                this.discardNode.addChild(cardNode);
            }
        }
    },

    moPai(type, card){
        if(!cc.dd._.isString(type)){
            cc.error('发牌错误');
            return;
        }

        if(type === "0"){

        }else{

        }
    },

    playerEnter(data) {
        this.clear();

        this.head.init(data);
        this.node.active = true;

        if(this.viewIdx === 0 && data.pokersList.length !== 0){
            //TODO
        }
    },

    /**
     * 倒计时
     * @param cd
     */
    play_chupai_ani(cd){
        this.head.play_chupai_ani(cd);
    },

    /**
     * 停止倒计时
     */
    stop_chupai_ani(){
        this.head.stop_chupai_ani();
    },

    /**
     * 更新手牌
     */
    updatePoker(){
        //TODO
    }
});

module.exports = rummy_player_ui;