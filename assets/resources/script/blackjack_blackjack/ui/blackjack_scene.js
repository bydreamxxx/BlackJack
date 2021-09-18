const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;

GAME_STATE = cc.Enum({
    WAITING:1,//等待玩家状态
    BETTING:2,//初次下注阶段
    PROTECTING:3,//买保险阶段
    PLAYING:4,//牌局进行状态
    RESULTING:5//显示结果状态
});

cc.Class({
    extends: cc.Component,

    properties: {
        remindCardLabel: cc.Label,
        banker: require("blackjack_player_ui"),
        playerList: [require("blackjack_player_ui")],
        betButtonNode: cc.Node,
        sliderNode: cc.Node,
        actionButtonNode: cc.Node,

        minBet: cc.Label,
        maxBet: cc.Label,

        cardPrefab: cc.Prefab,

        tipsNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.remindCardLabel.string = "";
        this.minBet.string = "";
        this.maxBet.string = "";
        this.betButtonNode.active = false;
        this.actionButtonNode.active = false;
        this.tipsNode.active = false;

        RoomED.addObserver(this);
        BlackJackED.addObserver(this);
    },

    onDestroy() {
        RoomED.addObserver(this);
        BlackJackED.removeObserver(this);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case RoomEvent.on_coin_room_enter:
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case BlackJackEvent.UPDATE_UI:
                this.updateUI();
                break;
            case BlackJackEvent.UPDATE_STATE:
                this.updateState();
            default:
                break;
        }
    },

    onClickMinBet(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setBet(BlackJackData.minBet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickMaxBet(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setBet(BlackJackData.maxBet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickBet(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setBet(this.bet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickShowSlider(){
        this.sliderNode.active = true;
    },

    onClickCloseSlider(){
        this.sliderNode.active = true;
    },

    onClickRepeatBet(event, data){
        if(BlackJackData.lastBet){
            let msg = cc.pb.blackjack.msg_bj_bet_req();
            msg.setType(1);
            msg.setBet(BlackJackData.lastBet);
            cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
        }
    },

    onSliderRoll(event, data){
        this.bet = Math.round(event.progress * 100) * BlackJackData.minBet;
        if(this.bet > BlackJackData.maxBet){
            this.bet = BlackJackData.maxBet;
        }else if(this.bet < BlackJackData.minBet){
            this.bet = BlackJackData.minBet;
        }
    },

    onClickSplit(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(5);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickDouble(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(2);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickHit(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(4);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickStand(event, data){
        let msg = cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(6);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickMore(event, data){

    },

    onClickRule(event, data){

    },

    onClickSetting(event, data){

    },

    onClickExit(event, data){
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(BlackJackData.roomConfigId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    onClickChat(event, data){

    },

    onClickEmoj(event, data){

    },

    playerLeave(data){
        if(data.userId == cc.dd.user.id){
            cc.dd.SceneManager.enterHall([],[],()=>{
                cc.dd.ResLoader.releaseBundle("blackjack_blackjack");
            });
        }
    },

    updateUI(){
        this.playerList.forEach(player=>{
            player.cleanProgress();
        })

        if(BlackJackData.turn == 100){
            // this.banker
        }else if(BlackJackData.turn > 100){
            let player = BlackJackData.getPlayerById(BlackJackData.turn);
            this.playerList[player.viewIdx].setProgress(BlackJackData.lastTime);
        }
    },

    updateState(){
        switch(BlackJackData.state){
            case GAME_STATE.WAITING:
                break;
            case GAME_STATE.BETTING:
                break;
            case GAME_STATE.PROTECTING:
                break;
            case GAME_STATE.PLAYING:
                break;
            case GAME_STATE.RESULTING:
                break;
        }
    },
});
