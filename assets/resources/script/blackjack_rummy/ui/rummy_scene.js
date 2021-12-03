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

        this.cardPool = new cc.NodePool();
        for (var i = 0; i < 106; i++) {
            var node = cc.instantiate(this.cardPrefab);
            this.cardPool.put(node);
        }

        this.clear();
    },

    onDestroy() {
        RoomED.addObserver(this);
        RummyED.removeObserver(this);
        HallCommonEd.removeObserver(this);
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
});
