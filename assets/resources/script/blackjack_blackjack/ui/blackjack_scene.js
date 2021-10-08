const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;

var GAME_STATE = cc.Enum({
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

        sitBtn: cc.Node,
        standBtn: cc.Node,

        betButtonNode: cc.Node,
        sliderNode: cc.Node,
        betLabel: cc.Label,
        insureNode: cc.Node,
        actionButtonNode: cc.Node,

        repeateButton: cc.Button,
        splitButton: cc.Button,
        doubleButton: cc.Button,

        minBetLabel: cc.Label,
        maxBetLabel: cc.Label,
        minBetButtonLabel: cc.Label,
        maxBetButtonLabel: cc.Label,

        cardPrefab: cc.Prefab,

        tipsNode: cc.Node,
        startTips: cc.Node,
        stopTips: cc.Node,
        loadTips: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.remindCardLabel.string = "";
        this.minBetLabel.string = "";
        this.maxBetLabel.string = "";
        this.minBetButtonLabel.string = "MinBet";
        this.maxBetButtonLabel.string = "MaxBet";

        this.sitBtn.active = false;
        this.standBtn.active = false;

        this.betButtonNode.active = false;
        this.insureNode.active = false;
        this.actionButtonNode.active = false;

        this.tipsNode.active = true;
        this.startTips.active = false;
        this.stopTips.active = false;
        this.loadTips.active = true;

        this.sliderNode.active = false;

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
            case RoomEvent.on_room_join:
                this.playerJoin(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.on_player_stand:
                this.playerStand(data[0]);
                break;
            case BlackJackEvent.UPDATE_UI:
                this.updateUI();
                break;
            case BlackJackEvent.UPDATE_STATE:
                this.updateState();
                break;
            case BlackJackEvent.CLOSE_BET_BUTTON:
                this.sitBtn.active = false;
                this.standBtn.active = false;

                this.betButtonNode.active = false;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                this.playerList[0].stop_chupai_ani();
                break;
            case BlackJackEvent.RESET_CD:
                let player = BlackJackData.getPlayerById(data.userId);
                if(player) {
                    this.playerList[player.viewIdx].play_chupai_ani();
                }
                break;
            case BlackJackEvent.DEAL_POKER:
                if(data.userId === 100){
                    this.banker.updateCards(data.index, data.cardsList);
                }else{
                    let player = BlackJackData.getPlayerById(data.userId);
                    if(player){
                        this.playerList[player.viewIdx].updateCards(data.index, data.cardsList);
                    }
                }
                break;
            case BlackJackEvent.PLAYER_TURN:
                if(BlackJackData.state === GAME_STATE.PLAYING){
                    if(data.userId === cc.dd.user.id && BlackJackData.hasUserPlayer){
                        this.actionButtonNode.active = true;
                        let bidList = this.actionButtonNode.getComponentsInChildren("forbid_double_click");
                        bidList.forEach(bid=>{
                            if(bid._button){
                                bid.cleanCD();
                            }
                        })

                        let userPlayer = BlackJackData.getPlayerById(cc.dd.user.id);
                        this.splitButton.interactable = true;//userPlayer.canSplit(data.index);
                        this.doubleButton.interactable = userPlayer.canDouble(data.index);
                        this.betIndex = data.index;

                        this.playerList[0].showSplit(this.betIndex);
                    }else{
                        this.actionButtonNode.active = false;
                        this.playerList[0].closeSplit();
                    }

                    this.playerList.forEach(player=>{
                        player.stop_chupai_ani();
                    })

                    let player = BlackJackData.getPlayerById(data.userId);
                    if(player){
                        this.playerList[player.viewIdx].play_chupai_ani();
                    }
                }
                break;
            case BlackJackEvent.SHOW_COIN:
                this.playerList[data.viewIdx].head.showCoin(data.result);
                break;
            default:
                break;
        }
    },

    onClickMinBet(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setIndex(this.betIndex);
        msg.setBet(BlackJackData.minBet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickMaxBet(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setIndex(this.betIndex);
        msg.setBet(BlackJackData.maxBet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickBet(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setIndex(this.betIndex);
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
        if(BlackJackData.lastBet > 0){
            let msg = new cc.pb.blackjack.msg_bj_bet_req();
            msg.setType(1);
            msg.setIndex(this.betIndex);
            msg.setBet(BlackJackData.lastBet);
            cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
        }
    },

    onSliderRoll(event, data){
        if(typeof event.progress === "number"){
            // this.bet = Math.round(event.progress * 100) * BlackJackData.minBet;
            this.bet = Math.floor(event.progress * 100 / BlackJackData.betRate) * BlackJackData.minBet + BlackJackData.minBet;
            this.sliderNode.getComponentInChildren(cc.ProgressBar).progress = event.progress;
            if(this.bet > BlackJackData.maxBet){
                this.bet = BlackJackData.maxBet;
            }else if(this.bet < BlackJackData.minBet){
                this.bet = BlackJackData.minBet;
            }

            this.betLabel.string = this.bet;

        }
    },

    onClickInsure(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(3);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickCancel(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(7);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickSplit(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(5);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickDouble(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(2);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickHit(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(4);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickStand(event, data){
        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(6);
        msg.setIndex(this.betIndex);
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

    onClickStandUp(event, data){
        var msg = new cc.pb.room_mgr.msg_stand_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(BlackJackData.roomConfigId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_stand_game_req, msg, "msg_stand_game_req", true);
    },

    onClickSitDown(event, data){
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(BlackJackData.roomConfigId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    onClickChat(event, data){

    },

    onClickEmoj(event, data){

    },

    playerJoin(data){
        BlackJackData.otherPlayerEnter(data.roleInfo.userId);
    },

    playerLeave(data){
        if(data.userId == cc.dd.user.id || !data.hasOwnProperty("userId")){
            cc.dd.SceneManager.enterHall([],[],()=>{
                cc.dd.ResLoader.releaseBundle("blackjack_blackjack");
            });
        }
    },

    playerStand(data){
        if(data.userId == cc.dd.user.id){
            BlackJackData.hasUserPlayer = false;
            this.playerList[0].head.stand();

            this.sitBtn.active = true;
            this.standBtn.active = false;
        }else{
            BlackJackData.playerExit(data.userId);
        }
    },

    updateUI(){
        this.banker.clear();

        this.minBetLabel.string = BlackJackData.minBet;
        this.maxBetLabel.string = BlackJackData.maxBet;
        this.minBetButtonLabel.string = `MinBet: ${BlackJackData.minBet}`;
        this.maxBetButtonLabel.string = `MaxBet: ${BlackJackData.maxBet}`;
        this.betLabel.string = BlackJackData.minBet;

        this.bet = BlackJackData.minBet;
        this.sliderNode.getComponentInChildren(cc.Slider).progress = 0;
        this.sliderNode.getComponentInChildren(cc.ProgressBar).progress = 0;

        this.playerList.forEach(player=>{
            player.stop_chupai_ani();
        })

        if(BlackJackData.turn && BlackJackData.turn.userId == 100){
            // this.banker
        }else if(BlackJackData.turn && BlackJackData.turn.userId > 100){
            let player = BlackJackData.getPlayerById(BlackJackData.turn.userId);
            this.playerList[player.viewIdx].play_chupai_ani(BlackJackData.lastTime);
        }

        if(BlackJackData.state == 2 && BlackJackData.hasUserPlayer){
            this.playerList[0].play_chupai_ani(BlackJackData.lastTime);
        }

        this.updateState();
    },

    updateState(){
        switch(BlackJackData.state){
            case GAME_STATE.WAITING:
                this.banker.clear();
                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                this.betButtonNode.active = false;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                this.tipsNode.active = false;
                break;
            case GAME_STATE.BETTING:
                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                this.startTips.active = true;
                this.stopTips.active = false;
                this.loadTips.active = false;
                this.tipsNode.active = true;
                cc.tween(this.tipsNode)
                    .show()
                    .delay(1)
                    .hide()
                    .start();

                this.betIndex = 1;
                this.betButtonNode.active = BlackJackData.hasUserPlayer;
                this.repeateButton.interactable = BlackJackData.hasUserPlayer && BlackJackData.lastBet > 0;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                break;
            case GAME_STATE.PROTECTING:
                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                this.betButtonNode.active = false;
                this.insureNode.active = BlackJackData.hasUserPlayer;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                this.tipsNode.active = false;
                break;
            case GAME_STATE.PLAYING:
                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                if(BlackJackData.lastState != BlackJackData.state){
                    this.startTips.active = false;
                    this.stopTips.active = true;
                    this.loadTips.active = false;
                    this.tipsNode.active = true;

                    cc.tween(this.tipsNode)
                        .show()
                        .delay(1)
                        .hide()
                        .start();
                }
                this.betButtonNode.active = false;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                break;
            case GAME_STATE.RESULTING:
                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                this.betButtonNode.active = false;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                this.tipsNode.active = false;
                break;
        }
    },
});
