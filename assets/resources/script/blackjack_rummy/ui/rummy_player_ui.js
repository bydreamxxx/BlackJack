const RummyPlayerED = require("RummyPlayerData").RummyPlayerED;
const RummyPlayerEvent = require("RummyPlayerData").RummyPlayerEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;
const RummyData = require("RummyData").RummyData.Instance();

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
        chip: cc.Prefab,

        centerChipNode: cc.Node,
        heguan: cc.Node,

        winNode: cc.Node,
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
                this.giveUpPoker(data[1], data[2]);
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
                this.play_chupai_ani(data[1]);
                break;
            case RummyPlayerEvent.PLAYER_STOP_CD:
                this.stop_chupai_ani();
                break;
            case RummyPlayerEvent.UPDATE_BAIDA:
                this.updateBaida();
                break;
            case RummyPlayerEvent.SET_PAI_TOUCH:
                this.setPaiTouch(data[1]);
                break;
            case RummyPlayerEvent.CHECK_CAN_MOPAI:
                this.checkCanMopai();
                break;
            case RummyPlayerEvent.SHOW_CARD:
                this.showCard(data[1], data[2]);
                break;
            case RummyPlayerEvent.SHOW_INVALIDSHOW:
                this.showInvalidShow();
                break;
            case RummyPlayerEvent.LOSE_GAME:
                this.loseGame();
                break;
            case RummyPlayerEvent.LOST_COIN:
                this.flyCoin(data[1], false);
                break;
            case RummyPlayerEvent.WIN_COIN:
                this.flyCoin(data[1], true);
                break;
            case RummyPlayerEvent.GIVE_TIPS:
                this.giveTips();
                break;
            case RummyPlayerEvent.SET_ON_LINE:
                this.head.offline.active = !data[1];
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

        this.winNode.active = false;

        if(this.viewIdx == 0){
            this.shoupaiNode.getComponent("rummy_group_ui").clear();
        }
    },

    checkCanMopai(){
        if(this.viewIdx == 0){
            this.shoupaiNode.getComponent("rummy_group_ui").checkCanMopai(this.playerData.handsList.length === 13 && this.playerData.userId === RummyData.turn);
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

        type = parseInt(type);

        if(AudioManager.getAudioID("blackjack_rummy/audio/rummyPickDiscard") == -1) {
            AudioManager.playSound("blackjack_rummy/audio/rummyPickDiscard");
        }

        if(type === 0){
            cardNode = cc.instantiate(this.card);
            cardNode.getComponent("rummy_card").init(cardList[0]);

            cardNode.scaleX = 0.538;
            cardNode.scaleY= 0.538;
            this.cardNode.addChild(cardNode);

            endPos = this.cardNode.convertToNodeSpaceAR(worldPos);

        }else{
            if(!RoomMgr.Instance().player_mgr.isUserPlaying()){
                cardList[0] = 172;
            }

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

            endPos = this.discardNode.convertToNodeSpaceAR(worldPos);
        }

        if(cardNode){
            cc.tween(cardNode)
                .to(0.3 * RummyData.PLAY_SPEED, {scale: 0.385, position: endPos}, { easing: 'quartOut'})
                .delay(0.5 * RummyData.PLAY_SPEED)
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
            this.shoupaiNode.getComponent("rummy_group_ui").showFapai(this.playerData.pokersList, handCardList);
        }
    },

    flyCoin(coin, win){
        if(win){
            cc.tween(this.node)
                .delay(1.2 * RummyData.PLAY_SPEED)
                .call(()=> {
                    let worldPos = this.centerChipNode.parent.convertToWorldSpaceAR(this.centerChipNode.position);
                    let startPos = this.node.convertToNodeSpaceAR(worldPos);

                    let loseChip = cc.instantiate(this.chip);
                    this.node.addChild(loseChip);
                    loseChip.position = startPos;

                    let centerLabel = this.centerChipNode.getComponentInChildren(cc.Label);
                    let coin = parseInt(centerLabel.string);
                    centerLabel.string = "";

                    loseChip.getComponent("rummy_fly_coin").play(coin, () => {
                        cc.tween(loseChip)
                            .delay(0.2 * RummyData.PLAY_SPEED)
                            .to(0.4 * RummyData.PLAY_SPEED, {position: cc.v2(0, 0)}, {easing: 'circOut'})
                            .call(() => {
                                this.centerChipNode.active = false;
                                this.head.changeCoin(this.playerData.score);
                            })
                            .delay(1.5 * RummyData.PLAY_SPEED)
                            .call(() => {
                                loseChip.destroy();
                            })
                            .start();
                    }, true);

                })
                .start();
        }else{
            if(coin !== 0){
                let worldPos = this.centerChipNode.parent.convertToWorldSpaceAR(this.centerChipNode.position);
                let endPos = this.node.convertToNodeSpaceAR(worldPos);

                let loseChip = cc.instantiate(this.chip);
                this.node.addChild(loseChip);
                loseChip.getComponent("rummy_fly_coin").play(Math.abs(coin), ()=>{
                    cc.tween(loseChip)
                        .delay(0.2 * RummyData.PLAY_SPEED)
                        .to(0.4 * RummyData.PLAY_SPEED, {position: endPos}, { easing: 'circOut'})
                        .call(()=>{
                            loseChip.destroy();
                            this.head.changeCoin(this.playerData.score);

                            let centerLabel = this.centerChipNode.getComponentInChildren(cc.Label);
                            if(centerLabel.string === "0"){
                                this.centerChipNode.active = true;
                            }
                            centerLabel.string = parseInt(centerLabel.string) + Math.abs(coin);
                        })
                        .start();
                });
            }else{
                this.head.changeCoin(this.playerData.score);
            }
        }
    },

    giveTips(){
        let worldPos = this.centerChipNode.parent.convertToWorldSpaceAR(this.heguan.position);
        let endPos = this.node.convertToNodeSpaceAR(worldPos);

        let loseChip = cc.instantiate(this.chip);
        this.node.addChild(loseChip);

        loseChip.getComponent("rummy_fly_coin").play(100, () => {
            cc.tween(loseChip)
                .to(0.4 * RummyData.PLAY_SPEED, {position: endPos}, {easing: 'circOut'})
                .call(() => {
                    loseChip.destroy();
                })
                .start();
        }, true);
    },

    /**
     * 打牌
     * @param card
     */
    giveUpPoker(card, playerHasCard){
        if(this.viewIdx !== 0){
            if(!RoomMgr.Instance().player_mgr.isUserPlaying()){
                card = 172;
            }

            let worldPos = this.shoupaiNode.convertToWorldSpaceAR(cc.v2(0, 0));
            let startPos = this.discardNode.convertToNodeSpaceAR(worldPos);

            let cardNode = cc.instantiate(this.card);
            cardNode.getComponent("rummy_card").init(card);
            cardNode.scaleX = 0.385;
            cardNode.scaleY = 0.385;

            this.discardNode.addChild(cardNode);
            cardNode.position = startPos;

            cc.tween(cardNode)
                .delay(0.4 * RummyData.PLAY_SPEED)
                .to(0.4 * RummyData.PLAY_SPEED, {scale:0.538, position: cc.v2(0, 0)}, { easing: 'quartOut'})
                .start();
        }else{
            let cardNode = this.discardNode.children[this.discardNode.childrenCount - 1]
            if(cardNode && cardNode.getComponent("rummy_card").getCard() === card){
            }else{
                if(playerHasCard){
                    this.shoupaiNode.getComponent("rummy_group_ui").giveUpPoker(card);
                }else{
                    cc.error(`打牌错误 ${card}`)

                    let cardNode = cc.instantiate(this.card);
                    cardNode.getComponent("rummy_card").init(card);
                    cardNode.scaleX = 0.538;
                    cardNode.scaleY = 0.538;

                    this.discardNode.addChild(cardNode);
                }
            }
            this.shoupaiNode.getComponent("rummy_group_ui").checkButton();
        }
    },

    loseGame(){
        if(this.viewIdx === 0){
            this.shoupaiNode.getComponent("rummy_group_ui").resetSelected();
            this.shoupaiNode.getComponent("rummy_group_ui").mask.active = true;
            this.shoupaiNode.getComponent("rummy_group_ui").setPaiTouch(false);
        }

        let worldPos = this.centerChipNode.parent.convertToWorldSpaceAR(this.centerChipNode.position);
        let endPos = this.node.convertToNodeSpaceAR(worldPos);

        let loseChip = cc.instantiate(this.chip);
        this.node.addChild(loseChip);

        let coin = this.playerData.dropCoin;

        loseChip.getComponent("rummy_fly_coin").play(coin, ()=>{
            cc.tween(loseChip)
                .delay(0.2 * RummyData.PLAY_SPEED)
                .to(0.4 * RummyData.PLAY_SPEED, {position: endPos}, { easing: 'circOut'})
                .call(()=>{
                    loseChip.destroy();

                    let centerLabel = this.centerChipNode.getComponentInChildren(cc.Label);
                    if(centerLabel.string === "0"){
                        this.centerChipNode.active = true;
                    }
                    centerLabel.string = parseInt(centerLabel.string) + coin;

                    if(this.playerData.userId !== cc.dd.user.id){
                        this.head.stand();
                    }

                    this.head.changeCoin(this.playerData.score);
                })
                .start();
        });
    },

    /**
     * 摸牌
     * @param type
     * @param card
     */
    moPai(type, card){
        if(this.viewIdx == 0){
            if(type === 0){
                this.shoupaiNode.getComponent("rummy_group_ui").showMoPai(card, type);
            }else{
                let cardNode = this.discardNode.children[this.discardNode.childrenCount - 1]
                if(cardNode){
                    if(cardNode.getComponent("rummy_card").getCard() !== card){
                        cc.error(`弃牌堆错误 ${cardNode.getComponent("rummy_card").getCard()} ${card}`)
                        return;
                    }
                }else{
                    cc.error(`弃牌堆错误 弃牌堆无牌 ${card}`)
                    return;
                }
                cardNode.destroy();
                this.shoupaiNode.getComponent("rummy_group_ui").showMoPai(card, type);
            }
        }
    },

    playerEnter(data) {
        this.clear();
        this.playerData = data;

        this.head.init(data);
        this.node.active = true;

        if(this.viewIdx === 0 && this.playerData.pokersList.length !== 0){
            this.shoupaiNode.getComponent("rummy_group_ui").showFapaiDirect(this.playerData.pokersList);
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

    showCard(card, playerHasCard){
        this.winNode.active = true;
        this.winNode.getComponent(cc.Animation).play('dzpk_js_nyl');
        this.winNode.getComponent(cc.Animation).setCurrentTime(0);

        if(AudioManager.getAudioID("blackjack_rummy/audio/rummyWin") == -1) {
            AudioManager.playSound("blackjack_rummy/audio/rummyWin");
        }

        if(this.viewIdx === 0){
            if(playerHasCard){
                this.shoupaiNode.getComponent("rummy_group_ui").showCard(card);
            }
            this.shoupaiNode.getComponent("rummy_group_ui").setPaiTouch(false);
        }else{
            let worldPos = this.shoupaiNode.convertToWorldSpaceAR(cc.v2(0, 0));
            let startPos = this.showCardNode.convertToNodeSpaceAR(worldPos);

            if(!RoomMgr.Instance().player_mgr.isUserPlaying()){
                card = 172;
            }

            let cardNode = cc.instantiate(this.card);
            cardNode.getComponent("rummy_card").init(card);
            cardNode.scaleX = 0.385;
            cardNode.scaleY = 0.385;

            this.showCardNode.addChild(cardNode);
            cardNode.position = startPos;

            cc.tween(cardNode)
                .delay(0.4 * RummyData.PLAY_SPEED)
                .to(0.4 * RummyData.PLAY_SPEED, {scale:0.538, position: cc.v2(0, 0)}, { easing: 'quartOut'})
                .start();
        }
    },

    showInvalidShow(){
        if(this.viewIdx === 0){
            this.shoupaiNode.getComponent("rummy_group_ui").showInvalidShow();
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
            this.shoupaiNode.getComponent("rummy_group_ui").showFapaiDirect(this.playerData.pokersList);
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