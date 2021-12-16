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
                this.faPai(data[1]);
                break;
            case RummyPlayerEvent.MO_PAI:
                this.moPai(data[1], data[2]);
                break;
            case RummyPlayerEvent.PLAYER_RESET_CD:
                this.play_chupai_ani();
                break;
            case RummyPlayerEvent.UPDATE_BAIDA:
                this.updateBaida();
                break;
            case RummyPlayerEvent.SET_PAI_TOUCH:
                this.setPaiTouch(data[1]);
                break;
            case RummyPlayerEvent.CHECK_CAN_MOPAI:
                this.checkCanMopai();
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

        if(this.viewIdx == 0){
            this.shoupaiNode.getComponent("rummy_group_ui").clear();
        }
    },

    checkCanMopai(){
        if(this.viewIdx == 0){
            this.shoupaiNode.getComponent("rummy_group_ui").checkCanMopai(this.playerData.pokersList);
        }
    },

    /**
     * 摸牌
     * @param type
     * @param cardList
     */
    dealPoker(type, cardList){
        let cardNode = null;

        let worldPos = this.shoupaiNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let endPos = cc.v2(0, 0);

        if(type === "0"){
            cardNode = cc.instantiate(this.card);
            cardNode.getComponent("rummy_card").init(cardList[0]);

            cardNode.scaleX = 0.538;
            cardNode.scaleY= 0.538;
            this.cardNode.addChild(cardNode);

            endPos = this.cardNode.convertToNodeSpace(worldPos);

        }else{
            cardNode = this.discardNode.children[this.discardNode.childrenCount - 1]
            if(cardNode){
                if(cardNode.getComponent("rummy_card").getCard() !== cardList[0]){
                    cc.error(`弃牌堆错误 ${cardNode.getComponent("rummy_card").getCard()} ${cardList[0]}`)
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
     * 发牌
     */
    faPai(handCardList){
        if(this.viewIdx == 0){
            this.shoupaiNode.getComponent("rummy_group_ui").showFapai(this.playerData.pokersList, this.card, this.showCardNode, handCardList);
        }
    },

    /**
     * 打牌
     * @param card
     */
    giveUpPoker(card, playerHasCard){
        if(this.viewIdx !== 0){
            let worldPos = this.shoupaiNode.convertToWorldSpaceAR(cc.v2(0, 0));
            let startPos = this.discardNode.convertToNodeSpaceAR(worldPos);

            let cardNode = cc.instantiate(this.card);
            cardNode.getComponent("rummy_card").init(card);
            cardNode.scaleX = 0.385;
            cardNode.scaleY = 0.385;

            this.discardNode.addChild(cardNode);
            cardNode.position = startPos;

            cc.tween(cardNode)
                .delay(0.4)
                .to(0.4, {scale:0.538, position: cc.v2(0, 0)}, { easing: 'quartIn'})
                .start();
        }else{
            let cardNode = this.discardNode.children[this.discardNode.childrenCount - 1]
            if(cardNode && cardNode.getComponent("rummy_card").getCard() === card){
            }else{
                if(playerHasCard){
                    this.shoupaiNode.getComponent("rummy_group_ui").giveUpPoker(card, this.card, this.discardNode);
                }else{
                    cc.error(`打牌错误 ${card}`)

                    let cardNode = cc.instantiate(this.card);
                    cardNode.getComponent("rummy_card").init(card);
                    cardNode.scaleX = 0.538;
                    cardNode.scaleY = 0.538;

                    this.discardNode.addChild(cardNode);
                }
            }
        }
    },

    /**
     * 摸牌
     * @param type
     * @param card
     */
    moPai(type, card){
        if(this.viewIdx == 0){
            if(!cc.dd._.isString(type)){
                cc.error('发牌错误');
                return;
            }

            if(type === "0"){
                this.shoupaiNode.getComponent("rummy_group_ui").showMoPai(card, this.card, this.cardNode);
            }else{
                this.shoupaiNode.getComponent("rummy_group_ui").showMoPai(card, this.card, this.discardNode);
            }
        }

    },

    playerEnter(data) {
        this.clear();

        this.head.init(data);
        this.node.active = true;

        if(this.viewIdx === 0 && data.pokersList.length !== 0){
            this.shoupaiNode.getComponent("rummy_group_ui").showFapaiDirect(this.playerData.pokersList, this.card);
        }
    },

    /**
     * 倒计时
     * @param cd
     */
    play_chupai_ani(cd){
        this.head.play_chupai_ani(cd);
    },

    setPaiTouch(enable){
        if(this.viewIdx === 0 && this.playerData.pokersList.length !== 0){
            this.shoupaiNode.getComponent("rummy_group_ui").setPaiTouch(enable);
        }
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
        if(this.viewIdx === 0 && this.playerData.pokersList.length !== 0){
            this.shoupaiNode.getComponent("rummy_group_ui").clear();
            this.shoupaiNode.getComponent("rummy_group_ui").showFapaiDirect(this.playerData.pokersList, this.card);
        }
    },

    /**
     * 更新手牌中百搭牌的状态
     */
    updateBaida(){
        if(this.viewIdx == 0){
            this.shoupaiNode.getComponent("rummy_group_ui").updateBaida();
        }
    },
});

module.exports = rummy_player_ui;