const RummyData = require("RummyData").RummyData.Instance();
const RummyED = require("RummyData").RummyED;
const RummyEvent = require("RummyData").RummyEvent;
const GAME_STATE = require("RummyData").GAME_STATE;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
const RummyGameMgr = require("RummyGameMgr");

var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        perPointLabel: cc.Label,
        maxWinLabel: cc.Label,

        bottomNode: cc.Node,
        tipsLabel: cc.Label,
        tipsNode: cc.Node,
        switchButtonNode: cc.Node,

        showcardNode: cc.Node,
        cardsNode: cc.Node,
        discardNode: cc.Node,

        dropNode: cc.Node,
        invalidShowNode: cc.Node,
        showNode: cc.Node,

        cardPrefab: cc.Prefab,

        _fixedTimeStep: 1/30,
        _lastTime: 0,
    },

    editor:{
        menu:"Rummy/rummy_scene"
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        RoomED.addObserver(this);
        RummyED.addObserver(this);
        HallCommonEd.addObserver(this);

        this.perPointLabel.string = "";
        this.maxWinLabel.string = "";

        this.clear();
    },

    onDestroy() {
        RoomED.addObserver(this);
        RummyED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    update(dt){
        this._lastTime += dt;
        let fixedTime = this._lastTime / this._fixedTimeStep;
        for (let i = 0; i < fixedTime; i++) {
            this.fixedUpdate();
        }
        this._lastTime = this._lastTime % this._fixedTimeStep;

        if(RummyData.state === GAME_STATE.WAITING){
            if(this.lastTime >= 0){
                this.lastTime -= dt;

                this.tipsLabel.string = Math.floor(RummyData.lastTime);
            }
        }
    },

    fixedUpdate(){

    },

    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                RummyData.clear();
                cc.dd.SceneManager.enterHall();
                break;
            case RoomEvent.on_coin_room_enter:
                break;
            case RoomEvent.on_room_join:
                this.playerJoin(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.on_player_stand:
                this.playerStand(data[0]);
                break;
            case RummyEvent.UPDATE_UI:
                this.updateUI();
                break;
            default:
                break;
        }
    },

    clear(){
        this.showcardNode.removeAllChildren();
        this.cardsNode.removeAllChildren();
        this.discardNode.removeAllChildren();

        this.bottomNode.active = false;
        this.tipsNode.active = false;
        this.switchButtonNode.active = false;

        this.dropNode.active = false;
        this.invalidShowNode.active = false;
        this.showNode.active = false;
    },

    playerJoin(data){
        RummyGameMgr.otherPlayerEnter(data.roleInfo.userId);
    },

    playerLeave(data){
        if(data.userId == cc.dd.user.id || !data.hasOwnProperty("userId")){
            RummyData.clear();
            cc.dd.SceneManager.enterHall();
        }
    },

    playerStand(data){
        if(data.userId == cc.dd.user.id){
            RummyData.hasUserPlayer = false;
            this.playerList[0].head.stand();

            // this.sitBtn.active = true;
            // this.standBtn.active = false;
        }else{
            RummyGameMgr.playerExit(data.userId);
        }
    },

    updateUI(){
        this.clear();

        this.perPointLabel.string = "";
        this.maxWinLabel.string = "";

        switch(RummyData.state){
            case GAME_STATE.WAITING:
                this.tipsNode.active = true;
                this.tipsLabel.string = RummyData.lastTime;
                this.lastTime = RummyData.lastTime;
                this.switchButtonNode.active = true;
                break;
            case GAME_STATE.PLAYING:
                if(RoomMgr.getInstance().player_mgr.isUserPlaying()){
                    this.bottomNode.active = true;
                }else{
                    this.tipsNode.active = true;
                    this.tipsLabel.string = "";
                }

                this.cardsNode.active = true;
                this.showcardNode.active = true;
                this.discardNode.active = true;


                break;
            case GAME_STATE.GROUPING:
                break;
            case GAME_STATE.RESULTING:
                break;
        }
    },


    createDiscard(cardID){
        let node = cc.instantiate(this.cardPrefab);
        node.scaleX = 0.538;
        node.scaleY= 0.538;
        this.discardNode.add(node);

        if(!RoomMgr.getInstance().player_mgr.isUserPlaying()){
            cardID = cardID === 0 ? 0 : 172;
        }

        node.getComponent("blackjack_card").init(cardID)
    }
});
