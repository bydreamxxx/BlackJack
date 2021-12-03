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

        RummyPlayerED.addObserver(this);
    },

    onDestroy() {
        RummyPlayerED.removeObserver(this);
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
            case RummyPlayerEvent.PLAYER_ENTER:
                this.playerEnter(data);
                break;
            case RummyPlayerEvent.PLAYER_EXIT:
                this.clear();
                this.node.active = false;
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

    playerEnter(data) {
        this.clear();

        this.head.init(data);
        this.node.active = true;
    },
});

module.exports = rummy_player_ui;