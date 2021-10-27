const BlackJackData = require("BlackJackData").BlackJackData.Instance();
const BlackJackED = require("BlackJackData").BlackJackED;
const BlackJackEvent = require("BlackJackData").BlackJackEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;

var hall_audio_mgr = require('hall_audio_mgr').Instance();

var GAME_STATE = cc.Enum({
    WAITING:1,//等待玩家状态
    BETTING:2,//初次下注阶段
    PROTECTING:3,//买保险阶段
    PLAYING:4,//牌局进行状态
    RESULTING:5,//显示结果状态
    FAPAI:7,//发牌状态
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
        minBetButtonLabel: require("LanguageLabel"),
        maxBetButtonLabel: require("LanguageLabel"),

        cardPrefab: cc.Prefab,

        tipsNode: cc.Node,
        startTips: cc.Node,
        stopTips: cc.Node,
        loadTips: cc.Node,
    },

    editor:{
        menu:"BlackJack/blackjack_scene"
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.remindCardLabel.string = "";
        this.minBetLabel.string = "";
        this.maxBetLabel.string = "";
        this.minBetButtonLabel.setText("MinBet");
        this.maxBetButtonLabel.setText("MaxBet");

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

        this.banker.clear();
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
                let player = BlackJackData.getPlayerById(data);
                if(player) {
                    if(BlackJackData.state === GAME_STATE.BETTING){
                        if(player.viewIdx == 0){
                            this.playerList[player.viewIdx].play_chupai_ani();
                        }
                    }else{
                        this.playerList[player.viewIdx].play_chupai_ani();
                    }


                    if(player.viewId == 0){
                        this.splitButton.interactable = userPlayer.canSplit(this.betIndex);
                        this.doubleButton.interactable = player.canDouble(this.betIndex);
                    }
                }
                break;
            case BlackJackEvent.DEAL_POKER:
                if(data.userId === 100){
                    this.banker.dealPoker(data.index, data.cardsList, BlackJackData.state === GAME_STATE.PLAYING);
                }else{
                    let player = BlackJackData.getPlayerById(data.userId);
                    if(player){
                        this.playerList[player.viewIdx].dealPoker(data.index, data.cardsList, BlackJackData.state === GAME_STATE.PLAYING, data.type == 1);
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
                        this.splitButton.interactable = userPlayer.canSplit(data.index);
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
            case BlackJackEvent.SHOW_RESULT:
                this.playerList[data.viewIdx].showResult(data.result);

                let hasBJ = false;
                for(let i = 0; i < this.playerList.length; i++){
                    if(this.playerList[i].isBJ()){
                        hasBJ = true;
                        break;
                    }
                }

                if(hasBJ){
                    this.banker.head.play_banker_duanyu("Congratulations on the blackjack", 3);
                }
                break;
            case BlackJackEvent.SHOW_COIN:
                this.playerList[data.viewIdx].showCoin(data.result);
                break;
            default:
                break;
        }
    },

    onClickMinBet(event, data){
        AudioManager.playSound("blackjack_blackjack/audio/chip_button_click");

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setIndex(this.betIndex);
        msg.setBet(BlackJackData.minBet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickMaxBet(event, data){
        AudioManager.playSound("blackjack_blackjack/audio/chip_button_click");

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setIndex(this.betIndex);
        msg.setBet(BlackJackData.maxBet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickBet(event, data){
        AudioManager.playSound("blackjack_blackjack/audio/chip_button_click");

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(1);
        msg.setIndex(this.betIndex);
        msg.setBet(this.bet);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickShowSlider(){
        hall_audio_mgr.com_btn_click();

        this.sliderNode.active = true;
    },

    onClickCloseSlider(){
        hall_audio_mgr.com_btn_click();

        this.sliderNode.active = true;
    },

    onClickRepeatBet(event, data){
        AudioManager.playSound("blackjack_blackjack/audio/chip_button_click");

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
        AudioManager.playSound("blackjack_blackjack/audio/insurance_confirm");

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(3);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickCancel(event, data){
        AudioManager.playSound("blackjack_blackjack/audio/insurance_decline");

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(7);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickSplit(event, data){
        hall_audio_mgr.com_btn_click();

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(5);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickDouble(event, data){
        hall_audio_mgr.com_btn_click();

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(2);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickHit(event, data){
        hall_audio_mgr.com_btn_click();

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(4);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickStand(event, data){
        hall_audio_mgr.com_btn_click();

        let msg = new cc.pb.blackjack.msg_bj_bet_req();
        msg.setType(6);
        msg.setIndex(this.betIndex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.blackjack.cmd_msg_bj_bet_req, msg, 'msg_bj_bet_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickBet');
    },

    onClickMore(event, data){
        hall_audio_mgr.com_btn_click();

    },

    onClickRule(event, data){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI("blackjack_blackjack/prefab/blackjack_rule");
    },

    onClickSetting(event, data){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI("blackjack_blackjack/prefab/blackjack_setting");
    },

    onClickExit(event, data){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(BlackJackData.roomConfigId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    onClickStandUp(event, data){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_stand_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(BlackJackData.roomConfigId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_stand_game_req, msg, "msg_stand_game_req", true);
    },

    onClickSitDown(event, data){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(BlackJackData.roomConfigId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    onClickChat(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_blackjack/prefab/chat");
    },

    onClickEmoj(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_blackjack/prefab/biaoqing");
    },

    playerJoin(data){
        BlackJackData.otherPlayerEnter(data.roleInfo.userId);
    },

    playerLeave(data){
        if(data.userId == cc.dd.user.id || !data.hasOwnProperty("userId")){
            cc.dd.SceneManager.enterHall([],[],()=>{
                // cc.dd.ResLoader.releaseBundle("blackjack_blackjack");
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
        this.minBetLabel.string = BlackJackData.minBet;
        this.maxBetLabel.string = BlackJackData.maxBet;
        this.minBetButtonLabel.setText("MinBet","", `: ${BlackJackData.minBet}`);
        this.maxBetButtonLabel.setText("MaxBet","", `: ${BlackJackData.maxBet}`);
        this.betLabel.string = BlackJackData.minBet;

        this.bet = BlackJackData.minBet;
        this.sliderNode.getComponentInChildren(cc.Slider).progress = 0;
        this.sliderNode.getComponentInChildren(cc.ProgressBar).progress = 0;

        this.playerList.forEach(player=>{
            player.stop_chupai_ani();
        })

        this.updateState();

        if(BlackJackData.turn && BlackJackData.turn.userId == 100){
            // this.banker
        }else if(BlackJackData.turn && BlackJackData.turn.userId > 100){
            let player = BlackJackData.getPlayerById(BlackJackData.turn.userId);
            this.playerList[player.viewIdx].play_chupai_ani(BlackJackData.lastTime);
        }

        if(BlackJackData.state == GAME_STATE.BETTING && BlackJackData.hasUserPlayer){
            this.playerList[0].play_chupai_ani(BlackJackData.lastTime);
        }else if(BlackJackData.state === GAME_STATE.PLAYING){
            if(BlackJackData.turn.userId === cc.dd.user.id && BlackJackData.hasUserPlayer){
                this.actionButtonNode.active = true;
                let bidList = this.actionButtonNode.getComponentsInChildren("forbid_double_click");
                bidList.forEach(bid=>{
                    if(bid._button){
                        bid.cleanCD();
                    }
                })

                let userPlayer = BlackJackData.getPlayerById(cc.dd.user.id);
                this.splitButton.interactable = userPlayer.canSplit(BlackJackData.turn.index);
                this.doubleButton.interactable = userPlayer.canDouble(BlackJackData.turn.index);
                this.betIndex = BlackJackData.turn.index;

                this.playerList[0].showSplit(this.betIndex);
            }else{
                this.actionButtonNode.active = false;
                this.playerList[0].closeSplit();
            }

            this.playerList.forEach(player=>{
                player.stop_chupai_ani();
            })

            let player = BlackJackData.getPlayerById(BlackJackData.turn.userId);
            if(player){
                this.playerList[player.viewIdx].play_chupai_ani(BlackJackData.lastTime);
            }
        }
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
                cc.error(`下注`)
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

                if(BlackJackData.hasUserPlayer){
                    this.banker.head.play_banker_duanyu("PLACE YOUR BETS", 3);
                }

                this.betButtonNode.active = BlackJackData.hasUserPlayer;
                this.repeateButton.interactable = BlackJackData.hasUserPlayer && BlackJackData.lastBet > 0;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                break;
            case GAME_STATE.PROTECTING:
                cc.error(`保险`)
                this.startTips.active = false;
                this.stopTips.active = false;
                this.loadTips.active = false;
                this.tipsNode.active = false;

                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                this.betButtonNode.active = false;

                // cc.tween(this.node)
                //     .delay(BlackJackData.fapaiList.length * 2 * 1.4)
                //     .call(()=>{
                        this.insureNode.active = BlackJackData.hasUserPlayer;
                    // })
                    // .start();

                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                break;
            case GAME_STATE.PLAYING:
                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                if(BlackJackData.lastState === GAME_STATE.PROTECTING){
                    cc.error(`收走保险`);
                    this.playerList.forEach(player=>{
                        player.loseInsure();
                    });
                }

                this.startTips.active = false;
                this.stopTips.active = false;
                this.loadTips.active = false;
                this.tipsNode.active = false;

                this.betButtonNode.active = false;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                break;
            case GAME_STATE.RESULTING:
                cc.error(`结算`)
                if(BlackJackData.lastState === GAME_STATE.PROTECTING){
                    cc.error(`收走保险`);
                    this.playerList.forEach(player=>{
                        player.winInsure();
                    });
                }

                this.banker.head.play_banker_duanyu("Dealer bust!", 3);


                this.sitBtn.active = !BlackJackData.hasUserPlayer;
                this.standBtn.active = BlackJackData.hasUserPlayer;

                this.betButtonNode.active = false;
                this.insureNode.active = false;
                this.actionButtonNode.active = false;
                this.sliderNode.active = false;
                this.tipsNode.active = false;
                break;
            case GAME_STATE.FAPAI:
                if(BlackJackData.lastState === GAME_STATE.BETTING) {
                    cc.error(`发牌`);
                    BlackJackData.fapai();

                    this.banker.head.play_banker_duanyu("Heads up！", BlackJackData.fapaiList.length * 2 * 1.4);

                    this.playerList.forEach(player => {
                        player.changeChipPos();
                    })

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
                break;
        }
    },
});
