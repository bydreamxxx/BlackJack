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
        tipsLabel: require('LanguageLabel'),
        tipsNode: cc.Node,
        switchButtonNode: cc.Node,
        betNode: cc.Node,
        betLabel: cc.Label,

        showcardNode: cc.Node,
        cardsNode: cc.Node,
        discardNode: cc.Node,

        dropNode: cc.Node,
        invalidShowNode: cc.Node,
        showNode: cc.Node,

        dropButton: cc.Button,
        dropLabel: cc.Label,
        showButton: cc.Button,


        cardPrefab: cc.Prefab,
        cardListNode: cc.Prefab,

        _fixedTimeStep: 1/30,
        _lastTime: 0,
    },

    editor:{
        menu:"Rummy/rummy_scene"
    },

    // LIFE-CYCLE CALLBACKS:

    start(){
        let handler = require("net_handler_rummy");
        cc.tween(this.node)
            .delay(1)
            .call(()=>{
                console.error('on_msg_rm_info')
                handler.on_msg_rm_info({ usersList:
                        [ { pokersList: [],
                            userId: cc.dd.user.id,
                            userState: 1,
                            dropCoin: 1000 },
                            { pokersList: [],
                                userId: 419432432,
                                userState: 1,
                                dropCoin: 1000 },
                            { pokersList: [],
                                userId: 704645120,
                                userState: 1,
                                dropCoin: 1000 },
                            { pokersList: [],
                                userId: 553651326,
                                userState: 1,
                                dropCoin: 1000 }],
                    bjState: 0,
                    lastTime: 5,
                    roomConfigId: 18501,
                    turn: cc.dd.user.id,
                    turnLeftTime: 5,
                    banker: cc.dd.user.id,
                    xcard: 0,
                    giveUp: 0 });
            })
            .delay(5)
            .call(()=>{
                console.error('on_msg_rm_info')
                handler.on_msg_rm_info({ usersList: [ { pokersList: [],
                        userId: cc.dd.user.id,
                        userState: 1,
                        dropCoin: 1000 },
                        { pokersList: [],
                            userId: 419432432,
                            userState: 1,
                            dropCoin: 1000 },
                        { pokersList: [],
                            userId: 704645120,
                            userState: 1,
                            dropCoin: 1000 },
                        { pokersList: [],
                            userId: 553651326,
                            userState: 1,
                            dropCoin: 1000 }],
                    bjState: 1,
                    lastTime: 10,
                    roomConfigId: 18502,
                    turn: cc.dd.user.id,
                    turnLeftTime: 15,
                    banker: cc.dd.user.id,
                    xcard: 11,
                    giveUp: 103 });
            })
            .delay(0.1)
            .call(()=>{
                console.error('on_msg_rm_deal_poker')
                handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 83], [44] ],
                    handCardsList: [ 132, 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44 ],
                    userId: cc.dd.user.id });
            })
            .delay(10)
            .call(()=>{
                console.error('msg_rm_state_change_2c')
                handler.on_msg_rm_state_change_2c({ roomState: 2, curRound: 0, banker: cc.dd.user.id });
            })
            .delay(0.1)
            .call(()=>{
                console.error('msg_rm_action_change')
                handler.on_msg_rm_action_change({ userId: cc.dd.user.id });
            })
            .delay(1)
            .call(()=>{
                RummyData.cardType="0";
                console.error('on_msg_rm_deal_poker')
                handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 83], [44, 54] ],
                    handCardsList: [ 132, 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44, 54 ],
                    card: 54,
                    userId: cc.dd.user.id });
            })
            .start()
    },


    onLoad() {
        RoomED.addObserver(this);
        RummyED.addObserver(this);
        HallCommonEd.addObserver(this);

        this.perPointLabel.string = "";
        this.maxWinLabel.string = "";

        this.clear();
    },

    onDestroy() {
        RoomED.removeObserver(this);
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

                this.tipsLabel.setText('GAMESTARTIN', '', '', Math.floor(this.lastTime));
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
            case RummyEvent.UPDATE_STATE:
                this.updateState();
                break;
            case RummyEvent.SYN_DESK:
                this.updateDesk();
                break;
            case RummyEvent.SHOW_RESULT:
                this.showResult(data);
                break;
            case RummyEvent.PLAYER_TURN:
                break;
            case RummyEvent.CHECK_BUTTON:
                this.checkButton();
                break;
            default:
                break;
        }
    },

    clear(){
        this.cardsNode.removeAllChildren();
        this.discardNode.removeAllChildren();

        this.cardsNode.active = false;
        this.showcardNode.active = false;
        this.discardNode.active = false;

        this.bottomNode.active = false;
        this.tipsNode.active = false;
        this.switchButtonNode.active = false;

        this.betNode.active = false;
        this.betLabel.string = '0';

        this.dropNode.active = false;
        this.invalidShowNode.active = false;
        this.showNode.active = false;
    },

    checkButton(){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player && RummyData.turn === cc.dd.user.id){
            let handCards = [].concat(...player.pokersList);
            this.dropButton.interactable = handCards.length === 13 && RummyData.state === GAME_STATE.PLAYING;
            this.showButton.interactable = handCards.length === 14 && RummyData.state === GAME_STATE.PLAYING;
        }else{
            this.dropButton.interactable = false;
            this.showButton.interactable = false;
        }
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
        gameInfoPB.setRoomId(RummyData.roomConfigId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    onClickChat(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_common/prefab/chat/blackjack_chat", ui=>{
            let widget = cc.find('duanyu_list', ui).getComponent(cc.Widget);
            widget.top = 123.92;
            widget.isAlignTop = true;
            widget.isAlignBottom = false;
            widget.updateAlignment();
        });
    },

    onClickEmoj(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_common/prefab/chat/blackjack_biaoqing", ui=>{
            let widget = cc.find('biaoqing_grid', ui).getComponent(cc.Widget);
            widget.top = 116.44;
            widget.isAlignTop = true;
            widget.isAlignBottom = false;
            widget.updateAlignment();
        });
    },

    onClickBet(event, data){
        hall_audio_mgr.com_btn_click();

    },

    onClickSwitch(event, data){
        hall_audio_mgr.com_btn_click();

    },

    onClickShowDrop(event, data){
        hall_audio_mgr.com_btn_click();
        this.dropNode.active = true;
    },

    onClickShowShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.showNode.active = true;
    },

    onClickCloseDrop(event, data){
        hall_audio_mgr.com_btn_click();
        this.dropNode.active = false;
    },

    onClickCloseShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.showNode.active = false;
    },

    onClickCloseInvalidShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.invalidShowNode.active = true;
    },

    onClickDrop(event, data){
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.rummy.msg_rm_drop_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_drop_req, msg, "msg_rm_drop_req", true);
    },

    playerJoin(data){
        RoomMgr.Instance().player_mgr.otherPlayerEnter(data.roleInfo.userId);
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

    showResult(data){
      //TODO
    },

    /**
     * 初始化桌子
     */
    updateUI(){
        this.clear();

        this.perPointLabel.string = "";
        this.maxWinLabel.string = "";

        let user = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(user){
            this.dropLabel.string = user.dropCoin;
        }

        if(RummyData.state === GAME_STATE.WAITING) {
            this.tipsNode.active = true;
            this.tipsLabel.setText('GAMESTARTIN', '', '', RummyData.lastTime);
            this.lastTime = RummyData.lastTime;
            this.switchButtonNode.active = true;
        }else{
            this.cardsNode.active = true;
            this.showcardNode.active = true;
            this.discardNode.active = true;

            if(RoomMgr.Instance().player_mgr.isUserPlaying()){
                if(RummyData.state !== GAME_STATE.DEALING){
                    this.bottomNode.active = true;
                }

                if(RummyData.lastState === GAME_STATE.WAITING && RummyData.state === GAME_STATE.DEALING){
                    let cardsPos = this.cardsNode.position;

                    this.cardsNode.position = this.showcardNode.position;

                    let paidui1 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui1);
                    paidui1.y = -4;

                    let node = cc.instantiate(this.cardPrefab);
                    node.scaleX = 0.538;
                    node.scaleY= 0.538;
                    node.name = "baida";
                    this.cardsNode.addChild(node);
                    node.getComponent("rummy_card").init(0);

                    let paidui2 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui2);

                    let discard = cc.instantiate(this.cardPrefab);
                    discard.scaleX = 0.538;
                    discard.scaleY= 0.538;
                    this.discardNode.addChild(discard);
                    discard.getComponent("rummy_card").init(0);

                    let worldPos = this.showcardNode.convertToWorldSpaceAR(cc.v2(0, 0));
                    let startPos = this.discardNode.convertToNodeSpaceAR(worldPos);
                    discard.position = startPos;

                    let discardTween = cc.tween(discard)
                        .parallel(
                            cc.tween().to(0.5, {position: cc.v2(0, 0)}, { easing: 'quadOut'}),
                            cc.tween().to(0.25, {scaleX: 0, scaleY: 0.5918}).call(()=>{
                                discard.getComponent("rummy_card").init(RummyData.giveUp);
                            }).to(0.25, {scaleX: 0.538, scaleY: 0.538})
                        );

                    let cardsNodeTween = cc.tween(this.cardsNode)
                        .to(0.5, {position: cardsPos}, { easing: 'quadOut'});

                    let baidaNodeTween = cc.tween(node)
                        .to(0.5, {position: cc.v2(-130, 0)}, { easing: 'expoOut'})
                        .call(()=>{
                            node.zIndex = 0;
                        })
                        .delay(0.5)
                        .to(0.2, {scale: 0.5918}, { easing: 'quintIn'})
                        .to(0.25, {scaleX: 0})
                        .call(()=> {
                            node.getComponent("rummy_card").init(RummyData.xcard);
                            node.getComponent("rummy_card").showMask();
                        })
                        .to(0.25, {scaleX: 0.5918})
                        .to(0.2, {scale: 0.538}, { easing: 'quintOut'})
                        .delay(0.3)
                        .to(0.6, {position: cc.v2(-28.66, -1.144), angle: 11.5}, { easing: 'sineInOut'})

                    cc.tween(this.showcardNode)
                        .delay(5)
                        .call(()=>{
                            discardTween.start()
                        })
                        .delay(0.8)
                        .call(()=>{
                            cardsNodeTween.start()
                        })
                        .delay(1)
                        .call(()=>{
                            baidaNodeTween.start()
                        })
                        .start();
                }else{
                    let discard = cc.instantiate(this.cardPrefab);
                    discard.scaleX = 0.538;
                    discard.scaleY= 0.538;
                    this.discardNode.addChild(discard);

                    discard.getComponent("rummy_card").init(RummyData.giveUp);

                    let node = cc.instantiate(this.cardPrefab);
                    this.cardsNode.addChild(node);
                    node.scaleX = 0.538;
                    node.scaleY= 0.538;
                    node.x = -28.66;
                    node.y = -1.144;
                    node.angle = -11.5;
                    node.name = "baida";

                    node.getComponent("rummy_card").init(RummyData.xcard);
                    node.getComponent("rummy_card").showMask();

                    let paidui1 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui1);
                    paidui1.y = -4;

                    let paidui2 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui2);

                    let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
                    if(player){
                        player.setPaiTouch(RummyData.state === 2 || RummyData.state === 3)
                    }
                }
            }else{
                this.tipsNode.active = true;
                this.tipsLabel.setText('WAITING');

                let discard = cc.instantiate(this.cardPrefab);
                discard.scaleX = 0.538;
                discard.scaleY= 0.538;
                this.discardNode.addChild(discard);

                discard.getComponent("rummy_card").init(172);

                let node = cc.instantiate(this.cardPrefab);
                node.scaleX = 0.538;
                node.scaleY= 0.538;
                this.cardsNode.addChild(node);

                node.getComponent("rummy_card").init(172);
            }
        }
    },

    /**
     * 更新状态
     */
    updateState(){
        // this.bottomNode.active = false;
        // this.tipsNode.active = false;
        // this.switchButtonNode.active = false;
        //
        // this.dropNode.active = false;
        // this.invalidShowNode.active = false;
        // this.showNode.active = false;
        //
        // this.cardsNode.active = false;
        // this.showcardNode.active = false;
        // this.discardNode.active = false;
        //
        switch(RummyData.state){
        //     case GAME_STATE.WAITING:
        //         this.bottomNode.active = false;
        //
        //         this.dropNode.active = false;
        //         this.invalidShowNode.active = false;
        //         this.showNode.active = false;
        //
        //         this.cardsNode.active = false;
        //         this.showcardNode.active = false;
        //         this.discardNode.active = false;
        //
        //         this.tipsNode.active = true;
        //         this.tipsLabel.setText('GAMESTARTIN', '', '', RummyData.lastTime);
        //         this.lastTime = RummyData.lastTime;
        //         this.switchButtonNode.active = true;
        //         break;
            case GAME_STATE.PLAYING:
                RummyGameMgr.updateBaida();
                this.bottomNode.active = false;
                this.tipsNode.active = false;
                this.switchButtonNode.active = false;

                this.dropNode.active = false;
                this.invalidShowNode.active = false;
                this.showNode.active = false;

                if(RoomMgr.Instance().player_mgr.isUserPlaying()){
                    this.bottomNode.active = true;
                }else{
                    this.tipsNode.active = true;
                    this.tipsLabel.setText('WAITING');
                }

                this.cardsNode.active = true;
                this.showcardNode.active = true;
                this.discardNode.active = true;
                break;
        //     case GAME_STATE.GROUPING:
        //         break;
        //     case GAME_STATE.RESULTING:
        //         break;
        }
    },

    /**
     * 同步牌堆、弃牌
     */
    updateDesk(){
        this.cardsNode.removeAllChildren();
        this.discardNode.removeAllChildren();

        if(RoomMgr.Instance().player_mgr.isUserPlaying()){
            let discard = cc.instantiate(this.cardPrefab);
            discard.scaleX = 0.538;
            discard.scaleY= 0.538;
            this.discardNode.addChild(discard);

            discard.getComponent("rummy_card").init(RummyData.giveUp);

            let node = cc.instantiate(this.cardPrefab);
            this.cardsNode.addChild(node);
            node.scaleX = 0.538;
            node.scaleY= 0.538;
            node.x = -28.66;
            node.y = -1.144;
            node.angle = -11.5;

            node.getComponent("rummy_card").init(RummyData.xcard);
            node.getComponent("rummy_card").showMask();

            let paidui1 = cc.instantiate(this.cardListNode);
            this.cardsNode.addChild(paidui1);
            paidui1.y = -4;

            let paidui2 = cc.instantiate(this.cardListNode);
            this.cardsNode.addChild(paidui2);

            RummyGameMgr.updateBaida();
        }else{
            let discard = cc.instantiate(this.cardPrefab);
            discard.scaleX = 0.538;
            discard.scaleY= 0.538;
            this.discardNode.addChild(discard);

            discard.getComponent("rummy_card").init(172);

            let node = cc.instantiate(this.cardPrefab);
            node.scaleX = 0.538;
            node.scaleY= 0.538;
            this.cardsNode.addChild(node);

            node.getComponent("rummy_card").init(172);
        }

    },
});
