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

        cardsNodeButton: cc.Node,
        discardNodeButton: cc.Node,

        dropNode: cc.Node,
        invalidShowNode: cc.Node,
        showNode: cc.Node,

        dropButton: cc.Button,
        dropLabel: cc.Label,
        showButton: cc.Button,
        groupButton: cc.Button,
        discardButton: cc.Button,

        cardPrefab: cc.Prefab,
        cardListNode: cc.Prefab,

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

                this.tipsLabel.setText('GAMESTARTIN', '', '', Math.floor(RummyData.lastTime));
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

        this.cardsNodeButton.active = false;
        this.discardNodeButton.active = false;

        this.bottomNode.active = false;
        this.tipsNode.active = false;
        this.switchButtonNode.active = false;

        this.betNode.active = false;
        this.betLabel.string = '0';

        this.dropNode.active = false;
        this.invalidShowNode.active = false;
        this.showNode.active = false;
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

    onClickGetCard(event, data){
        hall_audio_mgr.com_btn_click();

        RummyData.cardType = data;

        var msg = new cc.pb.rummy.msg_rm_poker_req();
        msg.setType(data);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_poker_req, msg, "msg_rm_poker_req", true);
    },

    onClickShowDrop(event, data){
        hall_audio_mgr.com_btn_click();
        this.dropNode.active = true;
    },

    onClickShowShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.showNode.active = true;
    },

    onClickGroup(event, data){
        hall_audio_mgr.com_btn_click();

    },

    onClickDiscard(event, data){
        hall_audio_mgr.com_btn_click();

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

    onClickShow(event, data){
        hall_audio_mgr.com_btn_click();

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
                    node.getComponent("blackjack_card").init(0);

                    let paidui2 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui2);

                    let discard = cc.instantiate(this.cardPrefab);
                    discard.scaleX = 0.538;
                    discard.scaleY= 0.538;
                    this.discardNode.addChild(discard);
                    discard.getComponent("blackjack_card").init(0);

                    let worldPos = this.showcardNode.convertToWorldSpace(cc.v2(0, 0));
                    let startPos = this.discardNode.convertToNodeSpace(worldPos);
                    discard.position = startPos;

                    let discardTween = cc.tween(discard)
                        .parallel(
                            cc.tween().to(0.5, {position: cc.v2(0, 0)}, { easing: 'quadOut'}),
                            cc.tween().to(0.25, {scaleX: 0, scaleY: 0.5918}).call(()=>{
                                discard.getComponent("blackjack_card").init(11);
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
                            node.getComponent("blackjack_card").init(12);
                        })
                        .to(0.25, {scaleX: 0.5918})
                        .to(0.2, {scale: 0.538}, { easing: 'quintOut'})
                        .delay(0.3)
                        .to(0.6, {position: cc.v2(-28.66, -1.144), rotation: -11.5}, { easing: 'sineInOut'});

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

                    discard.getComponent("blackjack_card").init(RummyData.giveUp);

                    let node = cc.instantiate(this.cardPrefab);
                    this.cardsNode.addChild(node);
                    node.scaleX = 0.538;
                    node.scaleY= 0.538;
                    node.x = -28.66;
                    node.y = -1.144;
                    node.rotation = -11.5;
                    node.name = "baida";

                    node.getComponent("blackjack_card").init(RummyData.xcard);

                    let paidui1 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui1);
                    paidui1.y = -4;

                    let paidui2 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui2);
                }
            }else{
                this.tipsNode.active = true;
                this.tipsLabel.setText('WAITING');

                let discard = cc.instantiate(this.cardPrefab);
                discard.scaleX = 0.538;
                discard.scaleY= 0.538;
                this.discardNode.addChild(discard);

                discard.getComponent("blackjack_card").init(172);

                let node = cc.instantiate(this.cardPrefab);
                node.scaleX = 0.538;
                node.scaleY= 0.538;
                this.cardsNode.addChild(node);

                node.getComponent("blackjack_card").init(172);
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
        // switch(RummyData.state){
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
        //     case GAME_STATE.PLAYING:
        //         this.bottomNode.active = false;
        //         this.tipsNode.active = false;
        //         this.switchButtonNode.active = false;
        //
        //         this.dropNode.active = false;
        //         this.invalidShowNode.active = false;
        //         this.showNode.active = false;
        //
        //         if(RoomMgr.Instance().player_mgr.isUserPlaying()){
        //             this.bottomNode.active = true;
        //         }else{
        //             this.tipsNode.active = true;
        //             this.tipsLabel.setText('WAITING');
        //         }
        //
        //         this.cardsNode.active = true;
        //         this.showcardNode.active = true;
        //         this.discardNode.active = true;
        //         break;
        //     case GAME_STATE.GROUPING:
        //         break;
        //     case GAME_STATE.RESULTING:
        //         break;
        // }
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

            discard.getComponent("blackjack_card").init(RummyData.giveUp);

            let node = cc.instantiate(this.cardPrefab);
            this.cardsNode.addChild(node);
            node.scaleX = 0.538;
            node.scaleY= 0.538;
            node.x = -28.66;
            node.y = -1.144;
            node.rotation = -11.5;

            node.getComponent("blackjack_card").init(RummyData.xcard);

            let paidui1 = cc.instantiate(this.cardListNode);
            this.cardsNode.addChild(paidui1);
            paidui1.y = -4;

            let paidui2 = cc.instantiate(this.cardListNode);
            this.cardsNode.addChild(paidui2);
        }else{
            let discard = cc.instantiate(this.cardPrefab);
            discard.scaleX = 0.538;
            discard.scaleY= 0.538;
            this.discardNode.addChild(discard);

            discard.getComponent("blackjack_card").init(172);

            let node = cc.instantiate(this.cardPrefab);
            node.scaleX = 0.538;
            node.scaleY= 0.538;
            this.cardsNode.addChild(node);

            node.getComponent("blackjack_card").init(172);
        }

    },
});
