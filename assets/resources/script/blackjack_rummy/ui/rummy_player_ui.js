const RummyPlayerED = require("RummyPlayerData").RummyPlayerED;
const RummyPlayerEvent = require("RummyPlayerData").RummyPlayerEvent;

let rummy_player_ui = cc.Class({
    extends: cc.Component,

    properties: {
        viewIdx: 0,

        head: require("rummy_head"),

        _fixedTimeStep: 1/30,
        _lastTime: 0,
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
                this.faPai(data[1])
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
      //TODO
    },

    /**
     * 自己摸牌
     */
    faPai(card){

    },

    /**
     * 打牌
     * @param card
     */
    giveUpPoker(card){
        //TODO
    },

    playerEnter(data) {
        this.clear();

        this.head.init(data);
        this.node.active = true;
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