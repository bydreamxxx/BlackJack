/**
 * Created by luke on 2018/12/10
 */
let hall_audio_mgr = require('hall_audio_mgr').Instance();
const hall_common_data = require('hall_common_data').HallCommonData;
let TEXAS_ED = require('texas_data').TEXAS_ED;
let Texas_Event = require('texas_data').Texas_Event;
let texas_Data = require('texas_data').texas_Data;
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let AudioManager = require('AudioManager');
let game_room = require("game_room");
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let jlmj_prefab = require('jlmj_prefab_cfg');
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
let texas_op = require('texas_op');
let texas_game_head = require('texas_game_head');
let texas_audio_cfg = require('texas_audio_cfg');
var Platform = require('Platform');
var AppConfig = require('AppConfig');
let sender = require('net_sender_texas');

var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var chat_duanyu_item = require('chat_duanyu_item');

/**
 * 操作类型
 */
const OP_TYPE = {
    discard: 0x0001,        //弃牌
    pass: 0x0002,           //过
    showhand: 0x0004,       //梭哈
    add: 0x0008,            //加注
    follow: 0x0010,         //跟注
    opencard: 0x0020,       //开牌
    WATCH: 0x0000,         //旁观操作
    NOT_MY_TURN: 0xFFFF,      //不该我操作
    MY_TURN: 0xCCCC,         //该我操作
    ADD_BET: 0xDDDD,         //加注操作
    EXCHANGE: 0xEEEE,       //换桌操作
};

const OP_TIME = 12;
const MIDDLE_EFFECT_NAME = [
    'px_hl','dzpk_px_st','px_ths','px_hjths_begin'
];

const MIDDLE_EFFECT_XH_NAME = [
    'px_hl_xh','dzpk_px_st_xh','px_ths_xh','px_hjths_xh'
];

cc.Class({
    extends: cc.Component,

    properties: {
        head_list: [texas_game_head],          //头像
        texas_op: texas_op,                       //op脚本
        chipPrefab: cc.Prefab,              //筹码预制体
        chip_splist: [cc.SpriteFrame],      //筹码sp列表
        result_fonts: [cc.Font],            //结算字体
        result_bg: [cc.SpriteFrame],               //结算背景
        type_splist: [cc.SpriteFrame],      //牌类型
        type_splist_gray: [cc.SpriteFrame], //牌类型(灰色)
        tpye_ani_prefab:[cc.Prefab],        //赢家牌类型动画
        win_ani_prefab:cc.Prefab,        //赢家动画(不亮牌)

        middle_effect:[cc.Node],        //中间大动画特效0:你赢了 1:葫芦 2四条 3同花顺 4皇家同花顺

        heguanSk:sp.Skeleton,

        player_state_type: [cc.SpriteFrame], //玩家表态显示（0:思考中 1:跟  2:过  3:弃牌(无)  4:加注  5:全压）

        pokerAtlas: cc.SpriteAtlas,         //牌图集
        menu_funcs:cc.Node,                 //菜单
        common_cards:cc.Node,               //公共牌
        emojiNode:cc.Node,
        title:cc.Label,                     //底分xxx
        roomIdLb:cc.Label,                  //房间id
        roomMangLb:cc.Label,                 //盲注
        addBtnLabel:cc.Label,               //加注按钮的字
        anim_match: { default: null, type: dragonBones.ArmatureDisplay, tooltip: "匹配中动画" },

        emojiItem: { default: null, type: cc.Prefab, tooltip: "表情(弹幕)" },
        messagePrefab: { default: null, type: cc.Prefab, tooltip: "快捷短语(弹幕)" }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.dd.SysTools.setLandscape();
        TEXAS_ED.addObserver(this);
        ChatEd.addObserver(this);
        RoomED.addObserver(this);
        
        HallCommonEd.addObserver(this);
        RoomMgr.Instance().roomType = 2;
        //************************ 筹码对象池 ****************************/
        this.msgToggle = cc.find("emoticon/bg/btnGroup/toggle3", this.node)

        this.initCardPosition();
        
        this.initTitle();
        this.updateDeskScore();
        // cc.gateNet.Instance().startDispatch();
        // this.test();
    },
    onDestroy() {
        TEXAS_ED.removeObserver(this);
        RoomED.removeObserver(this);
        
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        texas_Data.Destroy();
    },


    test(){
        var mycards = [73, 94];
        var common = [142, 102, 82,84,92];
        var tp = texas_Data.Instance().getCardType(mycards,common)[0];
        cc.log("tp:",tp);
        this.head_list[0].showMyCardType(tp)
    },

    initTitle()
    {
        var configId = texas_Data.Instance().getConfigId();
        if (configId) {
            var texasJbcCfgItem = game_room.getItem(function (item) {
                return item.key === configId;
            });
            texas_Data.Instance().setData(texasJbcCfgItem);
            
        }else
        {
            cc.log("configid is  null");
            return;
        }
        
        this.updateTitle();
    },

    updateTitle()
    {
        this.roomIdLb.string = RoomMgr.Instance().roomId;
        this.roomMangLb.string = parseInt(texas_Data.Instance().m_nBaseScore/2) +'/'+(texas_Data.Instance().m_nBaseScore);
    },

    initCardPosition(){
        this.cardPosition = [];
        this.cardRotation = [];
        this.commonCardPosition = [];
        for(var i=0;i<this.head_list.length;i++)
        {
            var cardParent = null;
            if(i==0)
            {
                cardParent = cc.find('card',this.head_list[i].node)
            }else
            {
                cardParent = cc.find('card_display',this.head_list[i].node)
            }


            var card = cc.find('card0',cardParent)

            
            this.cardPosition[i] = [];
            this.cardPosition[i][0] = card.position;

            this.cardRotation[i] = [];
            this.cardRotation[i][0] = card.rotation;

            card = cc.find('card1',cardParent)
            this.cardPosition[i][1] = card.position;

            this.cardRotation[i][1] = card.rotation;

            if(i<5)
            {
                this.commonCardPosition[i] = this.common_cards.children[i].position
            }

        }

        
    },

    //初始化音乐音效设置
    initMusicAndSound() {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {

        }
        else {
            // AudioManager.getInstance().onMusic(tw_audio_cfg.GAME_MUSIC);
        }
    },

    playBackGround: function () {
        // AudioManager.getInstance().onMusic(tw_audio_cfg.GAME_MUSIC);
    },
    //最新声音更改
    onOpenSettingMusic: function (event,data) {
        var scp = event.target.getComponent('com_game_menu')
        scp.setOpenMusicCallBack(this.playBackGround)
    },

    //分享按钮
    onClickShareBtn(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.native_wx.SendAppContent('', '【众喜游戏】', '【众喜游戏】快来玩，送金币！人人有份！速来>>>', Platform.shareGameUrl, 1);
    },

    //客服按钮
    onClickKefuBtn(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppConfig.PID]+'?user_id='+cc.dd.user.id);
    },

    //聊天表情符号
    showEmoticon(event,data) {
        this.emojiNode.active = data!=null;
    },


    onMenu:function(event,data)
    {
        this.menu_funcs.active = data!=null;
    },
    

    start() {
        this._fapaiqi = cc.find('fapaiqi', this.node).getComponent('texas_fapaiqi');
    },

    /**
     * 播放匹配动画
    */
    playMatchAnim() {
        // if (this.anim_match) {
        //     this.anim_match.node.active = true;
        //     this.anim_match.playAnimation('FZZPPZ', -1);
        // }
    },

    /**
     * 停止匹配动画
     */
    stopMatchAnim() {
        if (this.anim_match)
            this.anim_match.node.active = false;
        //this.anim_match.stop();
    },



    //事件处理
    onEventMessage(event, data) {
        switch (event) {
            case Texas_Event.ROOM_STATE://房间状态改变
                this.onRoomStatus(data);
                break;
            case Texas_Event.PLAYER_READY://玩家准备
                break;
            case Texas_Event.OVER_TURN://话事
                this.clearScore();
                this.onOverTurn(data);
                break;
            case Texas_Event.BET_RAISE://加注
                this.onBetRaise(data);
                this.updateDeskScore();
                break;
            case Texas_Event.BET_SHOWHAND://allin
                this.onShowHand(data);
                this.updateDeskScore();
                break;
            case Texas_Event.BET_DISCARD://弃牌
                this.onDiscard(data);
                break;
            case Texas_Event.BET_CALL://跟注
                this.onBetCall(data);
                this.updateDeskScore();
                break;
            case Texas_Event.BET_BOTTOM://底注
                this.onBetCall(data,true);
                this.updateDeskScore();
                break;
            // case Texas_Event.BET_OPENCARD://开牌
            //     this.onBetOpencard(data);
            //     break;
            case Texas_Event.BET_PASS://过
                this.onPass(data);
                break;
            // case Texas_Event.DEAL_CARD://发牌
            //     this.onDealCard(data);
            //     break;
            case Texas_Event.BANKER:
                this.onBanker(data);
                break;
            case Texas_Event.SHOW_CARD://亮牌
                this.onShowCard(data);
                break;
            case Texas_Event.SHOW_MY_CARD://亮牌
                // this.onShowMyCard(data);
                this.onDealCard(data);
                break;
            case Texas_Event.UPDATE_ROUND_BET:
                this.updateRoundBet(data);
                break;
            case Texas_Event.RESULT://结算
                this.onResult(data);
                break;
            case Texas_Event.NO_CARDS_RESULT://结算
                this.onResult(data,true);
                break;
            case Texas_Event.RECONNECT://重连
                this.onReconnect(data);
                break;
            case Texas_Event.DEAL_COMMON_CARD:
                this.showCommonCards(data);
                break;
            case Texas_Event.DEAL_SINGLE_COMMON_CARD:
                this.showCommonCards(data);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                var end_node = cc.find('zhanjitongji', this.node);
                if (end_node && end_node.active == true) {
                    return;
                }
                this.backToHall();
                break;
            case RoomEvent.update_poker_back:
                this.changePokerBack(data);
                break;
            case RoomEvent.on_coin_room_enter:
                // this.playMatchAnim();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case Texas_Event.UPDATE_PLAYER_GOLD://data 为空表示自己
                this.updatePlayerGold(data);
                break;
            case Texas_Event.UPDATE_TITTLE:
                this.updateTitle();
                break;
            /////test
            case Texas_Event.SHOW_TEST_CARD:
                this.showOtherPlayerCard(data);
                break;
            case Texas_Event.SHOW_TEST_RATE:
                this.showOtherWinRate(data);
                break;
            
        }
    },
    
    updatePlayerGold(data){
        if(data)
        {
            let view = texas_Data.Instance().getViewById(data.playerid);
            let player = texas_Data.Instance().getPlayerById(data.playerid);
            if(player)
                this.head_list[view].updateUI();
            else
                cc.log("null player");
            //当前说话玩家是自己，更新金币的时候可能是取钱，需要重置操作按钮
            if(texas_Data.Instance().curPlayer == cc.dd.user.id && view == 0 && player.joinGame)
            {
                this.onOverTurn(null,true)
                cc.log('重置操作按钮');
            }
        }else
        {
            this.head_list[0].updateUI();
        }

    },

    //聊天消息
    onChat(data) {
        if (data.msgtype == 3) {//魔法表情

        } else {
            let isChecked = this.msgToggle.getComponent(cc.Toggle).isChecked
            if (isChecked) {
                let name = texas_Data.Instance().getPlayerById(data.sendUserId).name
                var canvs= cc.find('Canvas');
                if(canvs)
                {
                    if (data.msgtype == 1) {
                        let message = cc.instantiate(this.messagePrefab)
                        message.parent = canvs
                        let text = chat_duanyu_item.items.find(item => item.duanyu_id == data.id)
                        message.getComponent('BulletScreen').spawnBullets(name, text.text);
                    } else {
                        let emoji = cc.instantiate(this.emojiItem)
                        emoji.parent = canvs
                        emoji.getComponent('BulletScreen').spawnEmoji(name, data.id);
                    }
                }
                
            }
        }
    },

    changePokerBack(sprite) {
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].setCardSprite(sprite);
        }
    },

    //加注
    onBetRaise(data) {
        let userId = data.userId;
        let view = texas_Data.Instance().getViewById(userId);
        if (view == 0) this.texas_op.hideOp();
        this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
        let player = texas_Data.Instance().getPlayerById(userId);
        if(player)
            this.head_list[view].setTurnBet(player.turnBet);
        else
            cc.log("null player");
        this.playChips(view, data.bet);
        // if (texas_Data.Instance().getMaxCurBetWithout(userId) > 0) {
            this.allStopSay();
            this.head_list[view].say(this.player_state_type[4]);
            if (texas_Data.Instance().getPlayerById(userId).sex == 1)
                AudioManager.getInstance().playSound(texas_audio_cfg.MAN.Raise, false);
            else
                AudioManager.getInstance().playSound(texas_audio_cfg.WOMAN.Raise, false);
        // }
        // else {
        //     this.allStopSay();
        //     this.head_list[view].say('下注');
        //     if (texas_Data.Instance().getPlayerById(userId).sex == 1)
        //         AudioManager.getInstance().playSound(texas_audio_cfg.MAN.Xiazhu, false);
        //     else
        //         AudioManager.getInstance().playSound(texas_audio_cfg.WOMAN.Xiazhu, false);
        // }
        // this.updateRoundScore();
    },

    //梭哈
    onShowHand(data) {
        let userId = data.userId;
        let view = texas_Data.Instance().getViewById(userId);
        if (view == 0) 
            this.texas_op.hideOp();
        let player = texas_Data.Instance().getPlayerById(userId);
        this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
        if(player)
            this.head_list[view].setTurnBet(player.turnBet);
        else
            cc.log('null player');
        this.playChips(view, data.bet);
        this.allStopSay();
        this.head_list[view].say(this.player_state_type[5]);
        var allin = cc.find('allin', this.head_list[view].node);
        allin.active = true;
        var ani = allin.getComponentInChildren(cc.Animation) ;
        if(ani)
        {
            ani.play();
        }  

        if (texas_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(texas_audio_cfg.MAN.ShowHand, false);
        else
            AudioManager.getInstance().playSound(texas_audio_cfg.WOMAN.ShowHand, false);
        // this.updateRoundScore();
    },

    //弃牌
    onDiscard(data) {
        let userId = data.userId;
        cc.find('add', this.node).active = false;
        let view = texas_Data.Instance().getViewById(userId);
        if (view == 0) 
            this.texas_op.showOp(OP_TYPE.EXCHANGE);
        this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
        cc.find('bet', this.head_list[view].node).active = false;
        if(view==0)
        {

        }else
        {
            var card_display =cc.find('card_display', this.head_list[view].node)
            var endP = this.heguanSk.node.parent.convertToWorldSpaceAR(cc.p(0,0));
            endP = card_display.convertToNodeSpaceAR(endP)
            for(var i=0;i<card_display.childrenCount;i++)
            {
                card_display.children[i].getComponent('texas_card').disAppearTo(endP);
            }
        }
        
        // for (var i = 0; i < 2; i++) {
        //     var node = cc.find('card/card' + i, this.head_list[view].node);
        //     node.getComponent('texas_card').updateMoveCard();
        // }
        this.head_list[view].showDiscard(true,view==0);
        this.allStopSay();
        // this.head_list[view].say('弃牌');
        if (texas_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(texas_audio_cfg.MAN.Discard, false);
        else
            AudioManager.getInstance().playSound(texas_audio_cfg.WOMAN.Discard, false);
        // this.updateRoundScore();
        AudioManager.getInstance().playSound(texas_audio_cfg.Sound_Turn_card_4, false);
    },

    //跟注
    onBetCall(data,isBottom) {
        let userId = data.userId;
        let view = texas_Data.Instance().getViewById(userId);
        let player = texas_Data.Instance().getPlayerById(userId);

        if (view == 0) this.texas_op.hideOp();
        this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
        
        if(player)
            this.head_list[view].setTurnBet(player.turnBet);
        else
            cc.log('null player')
        this.playChips(view, data.bet);
        this.allStopSay();
        if(isBottom)
        {

        }
        else{
            this.head_list[view].say(this.player_state_type[1]);
            if (texas_Data.Instance().getPlayerById(userId).sex == 1)
                AudioManager.getInstance().playSound(texas_audio_cfg.MAN.Call, false);
            else
                AudioManager.getInstance().playSound(texas_audio_cfg.WOMAN.Call, false);
        }
        // this.updateRoundScore();
    },


    //过
    onPass(data) {
        let userId = data.userId;
        let view = texas_Data.Instance().getViewById(userId);
        if (view == 0) this.texas_op.hideOp();
        this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
        this.allStopSay();
        this.head_list[view].say(this.player_state_type[2]);
        if (texas_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(texas_audio_cfg.MAN.Pass, false);
        else
            AudioManager.getInstance().playSound(texas_audio_cfg.WOMAN.Pass, false);
    },
    onBanker(msg,isReconnect){
        if(isReconnect)
        {

        }else
        {
            this.resetCommonCards();
        }

        let view = texas_Data.Instance().getViewById(texas_Data.Instance().bankerId);
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].setBanker(msg,view == i);
            var player = texas_Data.Instance().getPlayerByViewIdx(i);
            if (player) {
                cc.find('bet', this.head_list[i].node).active = player.joinGame;
            }
        }
    },
    //发牌
    onDealCard(msg) {
        cc.log("开始发牌");
        const stepTime = 0.2;
        const durTime = 0.5;
        var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0);
        var cardInfoList = [];
        if(selfPlayer.joinGame)
        {
            cardInfoList = msg.cardsList;
            this.head_list[0].node.opacity = 255;
        }else
        {
            this.head_list[0].node.opacity = 180;
            this.head_list[0].showWait();
        }
        
        var bankerView = texas_Data.Instance().getViewById(texas_Data.Instance().bankerId);
        bankerView -= 1;//从庄家下一家发牌
        var delay = 0;


        this.heguanSk.clearTracks();
        this.heguanSk.setAnimation(0, 'dz_hg_deal', true);
        var playerNum = this.head_list.length;
        for (var j = bankerView; j > bankerView-playerNum; j--) {
            var i =j<0?(j+playerNum):j;
            var player = texas_Data.Instance().getPlayerByViewIdx(i);
            if (player && player.joinGame) {
                delay += stepTime
            }else
            {
                continue;
            }
            var card = this._fapaiqi.getCard();
            // card.active = true;
            // var view = texas_Data.Instance().getViewById(cardInfoList[i].userId);
            var toScale = cc.v2(0.22, 0.22);
            var cardnode = null;
            if (i == 0) 
            {
                toScale = cc.v2(0.67, 0.67);
                cardnode = cc.find('card', this.head_list[i].node);
            }else
            {
                cardnode = cc.find('card_display', this.head_list[i].node);
            }
            cardnode.active = true;
            
            var toPosition0 = this.cardPosition[i][0]; //cardnode.children[0].position;
            var toRotation0 = this.cardRotation[i][0];
           
            var node0 = cc.find('card0', cardnode);
            node0.scaleX = card.scaleX;
            node0.scaleY = card.scaleY;
            node0.rotation = card.rotation;
            var nodepos0 = node0.convertToWorldSpaceAR(cc.v2(0, 0));
            var cardpos0 = card.convertToWorldSpaceAR(cc.v2(0, 0));
            node0.x += (cardpos0.x - nodepos0.x);
            node0.y += (cardpos0.y - nodepos0.y);
            if(i==0 && selfPlayer.joinGame)
                this.setPokerBack(node0, cardInfoList[0]);
            node0.getComponent('texas_card').sendCard(card, delay, durTime, toPosition0, toScale,toRotation0, i==0);//明牌 后面改回来
        }

        for (var j = bankerView; j > bankerView - playerNum; j--) {
            var i =j<0?(j+playerNum):j;
            var player = texas_Data.Instance().getPlayerByViewIdx(i);
            if (player && player.joinGame) {
                delay += stepTime
            }else
            {
                continue;
            }
            var card = this._fapaiqi.getCard();
            // card.active = true;
            // var view = texas_Data.Instance().getViewById(cardInfoList[i].userId);
            var toScale = cc.v2(0.22, 0.22);
            var cardnode = null;
            if (i == 0) 
            {
                toScale = cc.v2(0.67, 0.67);
                cardnode = cc.find('card', this.head_list[i].node);
            }else
            {
                cardnode = cc.find('card_display', this.head_list[i].node);
            }
            cardnode.active = true;
            var toPosition1 = this.cardPosition[i][1];//cardnode.children[1].position;
            var toRotation1 = this.cardRotation[i][1];
            var node1 = cc.find('card1', cardnode);
            node1.scaleX = card.scaleX;
            node1.scaleY = card.scaleY;
            node1.rotation = card.rotation;
            var nodepos0 = node1.convertToWorldSpaceAR(cc.v2(0, 0));
            var cardpos0 = card.convertToWorldSpaceAR(cc.v2(0, 0));
            node1.x += (cardpos0.x - nodepos0.x);
            node1.y += (cardpos0.y - nodepos0.y);
            if(i==0 && selfPlayer.joinGame)
                this.setPokerBack(node1, cardInfoList[1]);
            node1.getComponent('texas_card').sendCard(card, delay, durTime, toPosition1, toScale, toRotation1,i==0);//明牌 后面改回来
        }
        var myWinRate = msg?msg.winRate:0
        this.node.runAction(cc.sequence(
            cc.delayTime(delay + durTime),
            cc.callFunc(function () {
                this.heguanSk.clearTracks();
                this.heguanSk.setAnimation(0, 'dz_hg_standby', true);
                
                if(selfPlayer.joinGame){
                    this.head_list[0].showMyCardType(texas_Data.Instance().getCardType(cardInfoList)[0]);
                    this.head_list[0].showMyWinRate(myWinRate);
                    
                }
            }.bind(this)),
            ));


        // this.updateRoundScore(); 
    },

    onShowMyCard(msg) {
        var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0);
        if (selfPlayer) {
            var cardnode = cc.find('card', this.head_list[0].node);
            for (var j = 0; j < 2; j++) {
                this.setPokerBack(cardnode.children[j], selfPlayer.cardsList[j]);
            }
        }
    },

    //亮牌
    onShowCard(msg) {
        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function () {
                let cardInfoListList = msg.resultList;
                for (var i = 0; i < cardInfoListList.length; i++) {
                    if(cardInfoListList[i].pokerList.length<=0)
                        continue;

                    var isWin = cardInfoListList[i].win > 0;
                    var player = texas_Data.Instance().getPlayerById(cardInfoListList[i].playerId);         
                    if (player && (player.state!=3)) {
                        var view = texas_Data.Instance().getViewById(cardInfoListList[i].playerId);
                        this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
                        var cardnode = cc.find('card', this.head_list[view].node);
                        cardnode.active = true;
                        cc.find('card_display', this.head_list[view].node).active = false;
                        cc.find('allin', this.head_list[view].node).active = false;
                        this.head_list[view].stopSay()

                        for (var j = 0; j < player.cardsList.length; j++) {
                            cardnode.children[j].active = true;
                            this.setPokerBack(cardnode.children[j], player.cardsList[j],true);
                        }
                        if (isWin) {
                            if(view == 0)
                            {
                                this.showMiddleWinEffect(player.cardtype);
                            }else
                            {
                                this.head_list[view].showCardType(this.tpye_ani_prefab[player.cardtype - 1],this.type_splist[player.cardtype - 1],false,player.cardtype);
                            }
                        }
                        else
                            this.head_list[view].showCardType(null,this.type_splist[player.cardtype - 1],true,player.cardtype);
                    }
                }

            }.bind(this)),
            cc.delayTime(1), 
            cc.callFunc(function () {
                TEXAS_ED.notifyEvent(Texas_Event.RESULT, msg);
            }.bind(this))));
        
    },
    showOtherWinRate(msg) {
        for (var i = 0; i < msg.listList.length; i++) {
            var player = texas_Data.Instance().getPlayerById(msg.listList[i].playerid);
            var view = texas_Data.Instance().getViewById(msg.listList[i].playerid);
            if (view!=0 && player && (player.state!=3)) {
                this.head_list[view].showMyWinRate(msg.listList[i].winRate);
            }
            cc.log();
        }
    },

    showOtherPlayerCard(msg) {
        this.node.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function () {
        let cardInfoListList = msg.listList;
        for (var i = 0; i < cardInfoListList.length; i++) {
            var player = texas_Data.Instance().getPlayerById(cardInfoListList[i].playerid);
            var view = texas_Data.Instance().getViewById(cardInfoListList[i].playerid);
            if (player && (player.state!=3)) {
                
                // var cardnode = cc.find('card', this.head_list[view].node);
                // cardnode.active = true;
                // for (var j = 0; j < cardInfoListList[i].cardsList.length; j++) {
                //     this.setPokerBack(cardnode.children[j], cardInfoListList[i].cardsList[j]);
                //     cc.find('dipai_1/beimian', cardnode.children[j]).active = false;
                // }
                var cardnode = cc.find('card', this.head_list[view].node);
                cardnode.active = true;
                cc.find('card_display', this.head_list[view].node).active = false;
                cc.find('allin', this.head_list[view].node).active = false;
                for (var j = 0; j < cardInfoListList[i].cardsList.length; j++) {
                    cardnode.children[j].active = true;
                    this.setPokerBack(cardnode.children[j], cardInfoListList[i].cardsList[j],true);
                }
                        
            }
        }
        }.bind(this)
        )));
    },

    //结算
    onResult(msg,noCards) {
        //客户端做一个延迟，等待公共牌发完再结算
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            this.onResultFinish(msg,noCards);
        }.bind(this))));
        
    },

    showNYL()
    {
        var effectNode = cc.find('effectNode',this.node)
        effectNode.active = true;

        this.middle_effect[0].active = true;
        var ani = this.middle_effect[0].getComponent(cc.Animation);
        if(ani)
        {
            var xhCallBack = function () {
                ani.off('finished', xhCallBack);
                ani.play('dzpk_js_nyl_xh',0);
            }
            ani.on('finished', xhCallBack, this);
            ani.play('dzpk_js_nyl',0);

            this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function () {
                this.clearEffectNode();
            }.bind(this))));
        }  
        AudioManager.getInstance().playSound(texas_audio_cfg.Win, false);
    },
    onResultFinish(msg,noCards) {
         // cc.find('add', this.node).active = false;
         this._resultMSG = msg;
         var winView = [];//赢家view
         
         for (var i = 0; i < msg.resultList.length; i++) {
             
             var view = texas_Data.Instance().getViewById(msg.resultList[i].playerId);
             
             if (view != null) {
                cc.find('allin', this.head_list[view].node).active = false;
                this.head_list[view].node.getComponentInChildren('texas_timer').setActive(false);
                 var score = cc.find('score/txt', this.head_list[view].node);
                 var scoreBg = cc.find('score', this.head_list[view].node);
                 if (msg.resultList[i].win <= 0){
                     score.getComponent(cc.Label).font = this.result_fonts[1];
                     scoreBg.getComponent(cc.Sprite).spriteFrame= this.result_bg[1];
                 }else {
                     score.getComponent(cc.Label).font = this.result_fonts[0];
                     scoreBg.getComponent(cc.Sprite).spriteFrame= this.result_bg[0];
                     winView.push(view);
                     if(noCards && view == 0)
                     {
                        this.showNYL();
                     }
                 }
                 
                 score.getComponent(cc.Label).string = ':' + Math.abs(msg.resultList[i].win);
                 
             }
         }

         if(winView.length>0){
            this.showCoinFly(winView)

            for(var i=0;i<winView.length;i++)
            {
                var winnode = cc.find('win', this.head_list[winView[i]].node)
                if(winnode.childrenCount>0)//有牌型的特效
                    continue;

                var effct = cc.instantiate(this.win_ani_prefab);
                winnode.removeAllChildren(true);
                winnode.active = true;
                winnode.addChild(effct);
                var animation = winnode.getComponent(cc.Animation);
                if(animation)
                {
                    animation.play();
                }
            }
           
         }else
            cc.log("winview  null");

         
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
        if (this._resultMSG) {
            var msg = this._resultMSG;
            for (var i = 0; i < msg.resultList.length; i++) {
                var view = texas_Data.Instance().getViewById(msg.resultList[i].playerId);
                if (view != null) {
                    var score = cc.find('score', this.head_list[view].node);
                    score.active = true;
                    score.y=-44.3;
                    var move = cc.moveBy(0.3, cc.p(0, 60));
                    score.runAction(move);
                    cc.log();
                }
            }
        }
        if (!this._totalResult)
            this.texas_op.showOp(OP_TYPE.EXCHANGE);//RESULT);
    },

    showMiddleWinEffect(cardType)
    {
        

        var effectNode = cc.find('effectNode',this.node)
        effectNode.active = true;
        //葫芦以下
        if(cardType<7)
        {
            this.showNYL();
        }else
        {
            this.middle_effect[cardType-6].active = true;
            var sk = this.middle_effect[cardType-6].getComponent(sp.Skeleton) ;
            if(sk)
            {
                sk.clearTracks();
                sk.loop = false;
                sk.setAnimation(0, MIDDLE_EFFECT_NAME[cardType-7],false);
                
                sk.setCompleteListener(function () {
                    // sk.clearTracks();
                    sk.setAnimation(0, MIDDLE_EFFECT_XH_NAME[cardType-7],true);
                    sk.loop = true;
                    sk.setCompleteListener(null);
                }.bind(this));
            }
            AudioManager.getInstance().playSound(texas_audio_cfg.Win, false);
        }

        
        
    },

    showCoinFly(winList) {
        AudioManager.getInstance().playSound(texas_audio_cfg.Sound_Win_Clips, false);
        const totalTime = 1;
        const flyTime = 0.5;
        const coinCount = 20;
        const posOffset = 5;
        const timeOffset = 0.04;
        var betChip = cc.find('info/betChip/icon', this.node);
        if (winList.length ) {
            for (var i = 0; i < winList.length; i++) {
                var tv = winList[i];
                var posStart = betChip.parent.convertToWorldSpaceAR(betChip.position);
                posStart = this.head_list[tv].node.convertToNodeSpaceAR(posStart)

                var posTo = cc.find('head/gold', this.head_list[tv].node).position;
                for (var j = 0; j < coinCount; j++) {
                    var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                    var offsetP = cc.p(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                    var node = this.getChipNode();
                    node.position = posStart;
                    var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                    node.getComponent('texas_chip').setAction(delay, posTo.add(offsetP), flyTime, this.head_list[tv].node, null);
                }
                // AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
            }

        }
    },

    clearScore() {
        for (var i = 0; i < this.head_list.length; i++) {
            var score = cc.find('score', this.head_list[i].node);
            if (score)
                score.active = false;
        }
    },

    //重连
    onReconnect(msg) {
        // this.showReadys(false);
        this.resetGameUI();
        this.stopMatchAnim();
        if(this.title.string == '')
            this.initTitle();
        this.updateRoundScore();
        this.updateDeskScore();


        // let totalCardNum = 0;
        for (var i = 0; i < this.head_list.length; i++) {
            var player = texas_Data.Instance().getPlayerByViewIdx(i);
            if (player) {
                var cardnode = cc.find('card', this.head_list[i].node);
                var noCards = ( player.cardsList.length <=0)
                if(noCards)
                {
                    cardnode = cc.find('card_display', this.head_list[i].node);
                }

                if(i==0 && player.joinGame==1)
                {
                    this.head_list[0].showMyCardType(texas_Data.Instance().getCardType(player.cardsList,msg.commonCardsList)[0]);
                    if(texas_Data.Instance().haveWinRateCard())
                    {
                        if(msg.commonCardsList.length>0)
                        {
                            var winRate = texas_Data.Instance().calWinRate(player.cardsList,msg.commonCardsList)
                            this.head_list[0].showMyWinRate(parseInt(winRate*10000) );
                        }else
                        {
                            this.head_list[0].showMyWinRate(player.winRate);
                        }
                    }
                    
                    
                }

                // totalCardNum += player.cardsList.length;
                var showCards = (i==0?true:player.state!=3)
                for (var j = 0; j < 2; j++) {
                    if(player.joinGame==1 && showCards){
                        cardnode.active = true;
                        if(cardnode.children[j]){
                            cardnode.children[j].position = this.cardPosition[i][j]
                            cardnode.children[j].active = true;
                            // cc.log('显示玩家牌:'+player.userId);
                        }
                        if(noCards){
                            continue;
                        }
                        this.setPokerBack(cardnode.children[j], player.cardsList[j]);
                        if(i==0)
                        {
                            cc.find('dipai_1/beimian', cardnode.children[j]).active = false;
                        }
                    }
                    else {
                        if(cardnode.children[j])
                            cardnode.children[j].active = false;
                    }
                }
                //是否弃牌
                this.head_list[i].showDiscard(player.state==3,i==0);
                if (player.joinGame==0)
                {
                    this.head_list[i].showWait();
                }else if(player.state==5)
                {
                    //是否allin
                    var allin = cc.find('allin', this.head_list[i].node);
                    allin.active = true;
                    var ani = allin.getComponentInChildren(cc.Animation) ;
                    if(ani)
                    {
                        ani.play();
                    } 
                }
                 
                cc.find('bet', this.head_list[i].node).active = player.joinGame!=0;
                this.head_list[i].setTurnBet(player.turnBet);
                
            }
        }
        // this._fapaiqi.resumeCard(totalCardNum);//发牌器重置
        var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0);
        if (selfPlayer && (selfPlayer.joinGame!=1|| selfPlayer.state == 3 || selfPlayer.state == 5)) {
            this.texas_op.showOp(OP_TYPE.EXCHANGE);
        }
        switch (texas_Data.Instance().roomStatus) {
            case 3:
                // this.onOverTurn(texas_Data.Instance().curPlayer, msg.leftTime > 0 ? msg.leftTime : null);
                break;
            case 0:
                this.resetGameUI();
                break;
            case 1:
                this.onBanker(msg,true);
                TEXAS_ED.notifyEvent(Texas_Event.OVER_TURN);
                break;
        }
    },

    onGuize(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            cc.find('guize', this.node).active = false;
        }
        else {
            cc.find('guize', this.node).active = true;
        }
    },

    clearRoundBet(){
        for (var i = 0; i < this.head_list.length; i++) {
            var player = texas_Data.Instance().getPlayerByViewIdx(i);
            if (player  && player.joinGame) {
                this.head_list[i].setTurnBet(player.turnBet);
            }
        }
    },

    updateRoundBet(data) {
        
        for (var i = 0; i < this.head_list.length; i++) {
            var player = texas_Data.Instance().getPlayerByViewIdx(i);
            if (player && player.joinGame) {
                cc.find('bet', this.head_list[i].node).active = true;

                var betArea = cc.find('info/betChip/icon', this.node);
                var chipIcon = cc.find('bet/icon', this.head_list[i].node);
                // var startpos = this.head_list[view].node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
                // var startpos = betArea.position;//chipIcon.parent.convertToWorldSpaceAR(chipIcon.position);
                var endpos = betArea.parent.convertToWorldSpaceAR(betArea.position);
                endpos = chipIcon.parent.convertToNodeSpaceAR(endpos);
                let node = this.getChipNode();

                node.getComponent('texas_chip').fly(chipIcon.position, endpos, chipIcon.parent,null,true,true);
            }
        }

        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            this.updateRoundScore();
            this.clearRoundBet();
        }.bind(this))));
    },

    //实时更新
    updateDeskScore(data) {
        let total = texas_Data.Instance().convertNumToStr(texas_Data.Instance().m_totalBet);
        this.title.string = '底池：'+total;
    },
    //每轮更新一次
    updateRoundScore(data)
    {
        let total = data || texas_Data.Instance().m_totalBet;
        cc.find('info/betChip/bet', this.node).getComponent(cc.Label).string = total.toString();
    },

    gameStart() {
        this.stopMatchAnim();
    },

    showCommonCards:function(msg)
    {
        const durTime = 0.5;
        const stepTime = 0.2;
        var cards = [];
        cc.log();
        // if(msg.pokerList.length>1)
        //     cards = texas_Data.Instance().t_commonCards;
        // else
        cards = msg.pokerList;
        var idx = this.getNeedShowCommonCards();
        if(idx == -1)
            idx = 0;
        for (var j = idx; j < idx + cards.length; j++) {
            if(j > 4)
            {
                cc.error("error common Cards");
                return;
            }
            var cNode = this.common_cards.children[j];
            // var idx = msg.round == 1?j:(msg.round + 1)
            cNode.active = true;
            // cc.find('dipai_1/beimian', this.common_cards.children[j]).active = false;
            this.setPokerBack(cNode, cards[j-idx]);
            var card = this._fapaiqi.getCard();
            card.active = true;
            var toScale = cc.v2(1.05, 1.05);
            
            var toPosition0 = this.commonCardPosition[j];//this.common_cards.children[j].position;

            cNode.scaleX = card.scaleX;
            cNode.scaleY = card.scaleY;
            cNode.rotation = card.rotation;
            var nodepos0 = cNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var cardpos0 = card.convertToWorldSpaceAR(cc.v2(0, 0));
            cNode.x += (cardpos0.x - nodepos0.x);
            cNode.y += (cardpos0.y - nodepos0.y);
            cNode.getComponent('texas_card').sendCard(card, (j-idx) * stepTime, durTime, toPosition0, toScale,0, true);
        }
        var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0);
        if(selfPlayer.joinGame && selfPlayer.state != 3){
            if(msg.cardType!=null)//服务器发了牌类型
            {
                this.head_list[0].showMyCardType(msg.pokerType);
            }else//客户端算
            {
                this.head_list[0].showMyCardType(texas_Data.Instance().getCardType(selfPlayer.cardsList,texas_Data.Instance().t_commonCards)[0]);
            }
            if(texas_Data.Instance().haveWinRateCard())
            {
                var winRate = texas_Data.Instance().calWinRate(selfPlayer.cardsList,texas_Data.Instance().t_commonCards)
                this.head_list[0].showMyWinRate(parseInt(winRate*10000))
            }
            // this.head_list[0].showMyWinRate(msg.winRate);
            // cc.log('客户端计算胜率是:'+texas_Data.Instance().calWinRate(selfPlayer.cardsList,texas_Data.Instance().t_commonCards));
            
        }
        AudioManager.getInstance().playSound(texas_audio_cfg.Sound_See_Card, false);
    },

    getNeedShowCommonCards:function()
    {
        var idx = -1;
        for (var j = 0; j < 5; j++) {
            if(!this.common_cards.children[j].active){
                idx = j;
                break;
            }
        }

        return idx;
    },


    resetCommonCards:function()
    {
        for (var j = 0; j < this.common_cards.children.length; j++) {
            this.common_cards.children[j].active = false;
            cc.find('dipai_1/beimian', this.common_cards.children[j]).active = true;
        }
    },

    //状态改变
    onRoomStatus(status) {
        this.gameStart();
        // this.updateRoundScore();
        switch (status) {
            case 0://等待
                this.resetGameUI();
                this._fapaiqi.resetCards();
                // this.updateRoundScore();
                break;
            case 1://开始
                var selfplayer = texas_Data.Instance().getPlayerByViewIdx(0);
                if (!selfplayer.joinGame) {
                    this.onDealCard();
                }
                break;
            
        }
    },

    //清理桌面
    resetGameUI() {
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].resetUI();
        }
        this.clearEffectNode();
        this.texas_op.resetOp();
        this.resetCommonCards();
        this.updateRoundScore();
        this.updateDeskScore();
    },

    clearEffectNode()
    {
        var effectNode = cc.find('effectNode',this.node);
        effectNode.active = false;
        for(var i=0;i<effectNode.childrenCount;i++)
        {
            effectNode.children[i].active = false;
        }
    },

    //该谁说话
    onOverTurn(userId, noTime) {
        let view = texas_Data.Instance().getViewById(userId || texas_Data.Instance().curPlayer);
        var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0)
        let playGold = selfPlayer.score;
        let curBet = texas_Data.Instance().getMaxCurBet();
        let turnBet = texas_Data.Instance().getMaxTurnBet();
        if (view == 0) {//自己
            
            let optype = 0;
            // let max = texas_Data.Instance().getMaxAllBet();
            //texas_Data.Instance().maxBet;
            
            cc.log('玩家金币:' + playGold + '   当前最大下注' + curBet+"   当前轮最大下注:"+turnBet);
            optype |= OP_TYPE.discard;

            var canFollow = playGold>=curBet
            var isPick = false;
            //玩家all in后服务器不会让此玩家表态
            if(canFollow)
            {
                if(selfPlayer.turnBet==turnBet){
                    optype |= OP_TYPE.pass;
                    // if(texas_Data.Instance().m_round == 0 && texas_Data.Instance().bigBlindId == selfPlayer.userId)
                    // {
                    //     //大盲第一次表态不能跟
                    // }else{
                    //     if(curBet!=0)
                    //         optype |= OP_TYPE.follow;
                    //     else if(texas_Data.Instance().bigBlindId != selfPlayer.userId){
                    //         optype |= OP_TYPE.follow;
                    //     }
                    // }
                }else {
                    if(curBet!=0){
                        optype |= OP_TYPE.follow;
                    } else if(texas_Data.Instance().bigBlindId != selfPlayer.userId){
                        optype |= OP_TYPE.follow;
                    }
                }
                optype |= OP_TYPE.add;
                var minbet = Math.max(0,2*texas_Data.Instance().m_lastBet);
                var percent = (playGold<minbet?100:0)
                this.node.getComponentInChildren('texas_bet_slider').setData(minbet , playGold, texas_Data.Instance().getBaseScore(), percent,texas_Data.Instance().m_totalBet,this.addBtnLabel);
            }else if(texas_Data.Instance().m_bAutoPickMoney)
            {
                texas_Data.Instance().checkAutoPickMoney();
                isPick = true;
                optype |= OP_TYPE.showhand;
            }
            else
            {
                optype |= OP_TYPE.showhand;
            }

            if(texas_Data.Instance().m_opflag == -1 && turnBet == texas_Data.Instance().m_followBet)//客户端判断自动跟特定注
            {
                if(canFollow)//钱够自动跟
                {
                    if(playGold==curBet)
                        sender.allIn();
                    else
                        sender.Call();
                }else if(texas_Data.Instance().m_bAutoPickMoney)
                {
                    if(!isPick)
                        texas_Data.Instance().checkAutoPickMoney();
                    this.texas_op.showOp(OP_TYPE.MY_TURN, optype,turnBet);
                }
                else//不够allin
                {
                    sender.allIn();
                }
                texas_Data.Instance().m_opflag = 0;//取消自动跟特定注

            }else
            {
                var minbet = Math.max(0,2*texas_Data.Instance().m_lastBet);
                this.texas_op.setCanAdd(playGold>=minbet,minbet);
                this.texas_op.showOp(OP_TYPE.MY_TURN, optype,turnBet);
            }

            AudioManager.getInstance().playSound(texas_audio_cfg.Talk_own, false);
        }else if(selfPlayer.joinGame!=1 || selfPlayer.state == 3 || selfPlayer.state == 5)//旁观
        {
            this.texas_op.showOp(OP_TYPE.WATCH);
        }
        else {//其他人
            let optype = 0;
            optype |= OP_TYPE.discard;
            var canFollow = playGold>=curBet
            //玩家all in后服务器不会让此玩家表态
            if(canFollow)
            {
                optype |= OP_TYPE.follow;
                if(selfPlayer.curBet==curBet)
                    optype |= OP_TYPE.pass;
            }
            this.texas_op.showOp(OP_TYPE.NOT_MY_TURN, optype,turnBet,null,selfPlayer.turnBet);
        }
        this.head_list[view].say(this.player_state_type[0]);
        if(noTime)
        {

        }else{
            if(texas_Data.Instance().curPlayerTime>0)
            {
                this.head_list[view].node.getComponentInChildren('texas_timer').play(texas_Data.Instance().curPlayerTime, null, null);
                texas_Data.Instance().curPlayerTime = 0;
            }else
            {
                this.head_list[view].node.getComponentInChildren('texas_timer').play(OP_TIME, null, null);
            }
            
        }
    },

    //获取筹码节点
    getChipNode() {
        let node = null;//this._chipPool.get();
        if (!node) {
            node = cc.instantiate(this.chipPrefab);
        }
        return node;
    },

    //播放筹码动画
    playChips(view, add) {
        // let chips = [];//筹码列表(贪心法)
        // for (var i = chipList.length - 1; i > -1 && add > 0; i--) {
        //     if (add >= chipList[i]) {
        //         var num = Math.floor(add / chipList[i]);
        //         for (var j = 0; j < num; j++) {
        //             chips.push(chipList[i]);
        //         }
        //         add -= num * chipList[i];
        //     }
        // }
        // for (var i = chips.length - 1; i > -1; i--) {
            this.singleBet(view,add);
        // }
        // if (chips.length > 0) {
        //     if (chips.length > 5)
        //         AudioManager.getInstance().playSound(texas_audio_cfg.Chip_HE, false);
        //     else
                AudioManager.getInstance().playSound(texas_audio_cfg.Chip, false);
        // }
    },


    //单个筹码飞出
    //fromMoney:从头像下面金币处开始
    singleBet(view, value) {
        cc.find('bet', this.head_list[view].node).active = true;

        // var betArea = cc.find('bet', this.head_list[view].node);
        var chipIcon = cc.find('bet/icon', this.head_list[view].node);
        var startpos = cc.find('head/gold', this.head_list[view].node).position;//this.head_list[view].node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
        var endpos = chipIcon.parent.convertToWorldSpaceAR(chipIcon.position);
        endpos = this.head_list[view].node.convertToNodeSpaceAR(endpos);
        let node = this.getChipNode();
        // node.tag = value;
        var player = texas_Data.Instance().getPlayerByViewIdx(view);
        // if(player)
        // {
        //     cc.find('bank',node).active = texas_Data.Instance().bankerId == player.userId
        // }
        node.getComponent('texas_chip').fly(startpos, endpos, this.head_list[view].node,null,true);
    },


    //背面牌
    setPokerBack(node, cardValue,isShow) {
        let paiAtlas = this.pokerAtlas;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = cc.find("dipai_1/hua_xiao",node);//node.getChildByName('hua_xiao');
        var hua_da = cc.find("dipai_1/hua_da",node);//node.getChildByName('hua_da');
        var num = cc.find("dipai_1/num",node);//node.getChildByName('num');
        if (value == 2) value = 16;
        if (value == 1) value = 14;
        if (value < 17) {
            switch (flower) {
                case 1:
                    flower = 4;
                    break;
                case 2:
                    flower = 3;
                    break;
                case 3:
                    flower = 2;
                    break;
                case 4:
                    flower = 1;
                    break;
            }
        }

        switch (value) {
            case 0:
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 16:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                var isJQK = (value>=11&&value<=13);
                hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString()+(isJQK?('_'+value):''));

                hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }

        if(isShow)
        {
            node.getComponent('texas_card').updateCard(true);
        }

    },

    //退出
    onExit() {
        hall_audio_mgr.com_btn_click();
        // if (texas_Data.Instance().isGaming) {
        //     var self = texas_Data.Instance().getPlayerById(cc.dd.user.id);
        //     if (self.isWatch) {
        //         this.sendLeaveRoom();
        //     }
        //     else if (self.state == 3) {
        //         this.sendLeaveRoom();
        //     }
        //     else {
        //         cc.dd.DialogBoxUtil.show(0, '游戏正在进行中，退出后将由系统操作，确定退出？', '确定', '取消', this.sendLeaveRoom, null, '退出游戏');
        //     }
        // }
        // // else if (hall_common_data.getInstance().gameId == 163) {
        // //     this.sendLeaveRoom();
        // // }
        // else {
            this.sendLeaveRoom();
            this.backToHall();
        // }
        //}
    },
    /**
    * 离开房间
    */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '持有金币低于房间限制，即将被移出房间';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '您长时间未操作，系统暂时将您移除房间';
                        break;
                    case 4:
                        str = '当前禁止该游戏，请联系管理员';
                        break;
                }
                var func = function () {
                    this.backToHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                this.backToHall();
            }
        }
    },

    allStopSay() {
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].stopSay();
        }
    },

    backToHall() {
        cc.dd.SceneManager.enterHall();
    }
});
