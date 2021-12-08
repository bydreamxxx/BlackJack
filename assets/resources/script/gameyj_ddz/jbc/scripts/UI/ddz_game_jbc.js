const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
const DDZ_Data = require('ddz_data').DDZ_Data;
var ddz = require('ddz_util');
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('ddz_audio_cfg');
var ddz_chat_cfg = require('ddz_chat_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];
var PropAudioCfg = require('jlmj_ChatCfg').PropAudioCfg;
var FortuneHallManager = require('FortuneHallManager').Instance();
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const hall_prop_data = require('hall_prop_data').HallPropData;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var game_room = require("game_room");
var hall_prefab = require('hall_prefab_cfg');
var playerExp = require('playerExp');
var DingRobot = require('DingRobot');
var AppCfg = require('AppConfig');
var Platform = require('Platform');
var jlmj_prefab = require('jlmj_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const HallCommonData = require('hall_common_data').HallCommonData;
const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;

const test_version = false;
//房间状态
const roomStatus = {
    STATE_ENTER: 1,         //进入房间
    STATE_PREPARE: 2,       //准备
    STATE_DEAL_POKER: 3,    //发牌
    STATE_CALL_SCORE: 4,    //叫分
    STATE_DOUBLE: 5,        //加倍
    STATE_PLAYING: 6,       //出牌
    STATE_ENDING: 7,        //结算中
};

const soundType = {
    JIAOFEN: 1,             //叫分
    JIABEI: 2,              //加倍
    DAN: 3,                 //单
    DUI: 4,                 //对
    SAN: 5,                 //三
    KILL: 6,                //压死
    PASS: 7,                //不出
    THREE_YI: 8,            //三带一
    THREE_DUI: 9,           //三带对
    FOUR_ER: 10,            //四带二
    FOUR_DUI: 11,           //四带二对
    SHUNZI: 12,             //顺子
    LIANDUI: 13,            //连对
    BOMB: 14,               //炸弹
    ROCKET: 15,             //王炸
    AIRPLANE: 16,           //飞机
    REMAIN: 17,             //警告
    CHAT: 18,               //聊天
};

cc.Class({
    extends: cc.Component,

    properties: {
        chat_item: cc.Prefab,
        win_pic: cc.SpriteFrame,
        lose_pic: cc.SpriteFrame,
        win_font: { type: cc.Font, default: null, tooltip: '胜利字' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字' },
        paiAtlas: { type: cc.SpriteAtlas, default: null, tooltip: "牌图集" },
        atlas_game: { type: cc.SpriteAtlas, default: null, tooltip: "游戏图集" },
        match: { default: null, type: cc.Button, tooltip: "匹配按钮" },
        room_base: { default: null, type: cc.Node, tooltip: "房间底分/房间类型" },
        anim_match: { default: null, type: dragonBones.ArmatureDisplay, tooltip: "匹配中动画" },
        magic_atlas: { type: cc.SpriteAtlas, default: null, tooltip: '魔法道具' },
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        default_head: { default: null, type: cc.SpriteFrame, tooltip: '默认头像' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
        double_splist: [cc.SpriteFrame],
        callscore_splist: [cc.SpriteFrame],
        addsub: [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        DingRobot.set_ding_type(3);
        this.timeStamp = Math.floor(new Date().getTime() / 1000);

        this.initZhuoBu();
        this.initUiScript(true);
        this.initMusicAndSound();
        this.initChat();
        this.initBaseScore();
        //cc.find('top/dipai_info/jipaiqi', this.node).active = HallCommonData.getInstance().isMemoryCard(33);

        DDZ_ED.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        BSC_ED.addObserver(this);

        cc.find('chat', this.node).getComponent(cc.Animation).on('play', function () { this.chatAni = true; }.bind(this), this);
        cc.find('chat', this.node).getComponent(cc.Animation).on('finished', function () { this.chatAni = false; }.bind(this), this);
        this.schedule(function () {
            this.setTime();
        }.bind(this), 0.2);

        // if (test_version) {
        //     cc.find('test', this.node).active = true;
        //     this.pokerPrefab = this._uiComponents[0].paiPre;
        // }
        let size = cc.view.getVisibleSize();
        if (size.width / size.height > 1.9) {
            cc.find('player_down/op_jiaofen', this.node).y -= 20;
        }
        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }
    },

    testCards(list){
        return ddz.analysisCards(list);
    },

    onDestroy: function () {
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
        this.initUiScript(false);
        DDZ_ED.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        BSC_ED.removeObserver(this);
        RoomMgr.Instance().clear();
        AudioManager.getInstance().stopAllLoopSound();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case DDZ_Event.INIT_ROOM:
                this.match.node.active = false;
                this.initGame();
                break;
            case DDZ_Event.HAND_POKER:
                this.handPoker(data);
                break;
            case DDZ_Event.UPDATE_STATUS:
                this.updateStatus(data);
                break;
            case DDZ_Event.CALLSCORE_RET:
                this.callScoreRet(data);
                break;
            case DDZ_Event.SHOW_LORD:
                this.showLord(data);
                break;
            case DDZ_Event.DOUBLE_RET:
                this.doubleRet(data);
                break;
            case DDZ_Event.PLAY_POKER:
                this.playPoker(data);
                break;
            case DDZ_Event.AUTO_RET:
                this.autoRet(data);
                break;
            case DDZ_Event.RESULT_RET:
                this.showResult(data);
                break;
            case BSC_Event.PLAY_ROUND:
                this.playRound(data);
                break;
            case BSC_Event.RANK_INFO:
                this.showRank(data);
                break;
            case DDZ_Event.RECONNECT:
                this.reconnect(data);
                break;
            case BSC_Event.GAME_END:
                break;
            case BSC_Event.RECONNECT_LINE:
                this.waitLine(data);
                break;
            case DDZ_Event.PLAYER_OFFLINE:
                this.playerOffline(data);
                break;
            case DDZ_Event.BG_CLICK:
                this.onBgClick();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case DDZ_Event.MINGPAI:
                this.onMingpai(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.hallUpdateCoin();
                break;
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter(data[0]);
                break;
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
            case RoomEvent.on_room_ready:
                this.on_room_ready(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.on_room_leave(data[0]);
                break;
            case RoomEvent.player_signal_state:
                this.on_player_signal_state(data[0]);
                break;
            case DDZ_Event.KONGPAI:
                // if (test_version) {
                //     this.kongpai(data);
                // }
                break;
            case DDZ_Event.PLAYER_ISONLINE:
                this.playerOnline(data);
                break;
            case DDZ_Event.UPDATE_TIMEOUT:
                this.updateTimeout(data);
                break;
        }
    },

    updateTimeout(msg) {
        let userId = msg.playUserId;
        let timeout = msg.playTimeout;
        if (cc.dd.user.id == userId) {
            cc.dd.PromptBoxUtil.show('您已多轮出牌缓慢，出牌时间缩短为' + timeout + '秒!');
        };
    },

    playerOnline: function (data) {
        var view = this.idToView(data[0].userId);
        cc.find('weak', this._uiComponents[view].headnode).active = false;
        this._uiComponents[view].showOffline(!data[1]);
    },

    kongpai(msg) {
        var userId = msg.userId;
        var controlLevel = msg.controlLevel;
        for (var i = 0; i < this._uiComponents.length; i++) {
            if (i == this.idToView(userId)) {
                cc.find('kongpai', this._uiComponents[i].headnode).getComponent(cc.Label).string = controlLevel.toString();
                cc.find('kongpai', this._uiComponents[i].headnode).active = true;
            }
            else {
                cc.find('kongpai', this._uiComponents[i].headnode).active = false;
            }
        }
    },

    on_player_signal_state(msg) {
        var userId = msg.userId;
        var isWeak = msg.isWeak;
        var cnt = msg.cnt;
        if (cnt) {
            var player = this.getPlayerById(userId);
            if (player) {
                player.netState = cnt;
            }
        }
        var view = this.idToView(userId);
        if (view != null) {
            if (cc.find('offline', this._uiComponents[view].headnode).active == false) {
                cc.find('weak', this._uiComponents[view].headnode).active = isWeak;
            }
        }
    },

    //更新金币
    hallUpdateCoin() {
        var coin = hall_prop_data.getInstance().getCoin();
        this._uiComponents[0].goldlbl.string = cc.dd.Utils.getNumToWordTransform(coin);
        var playerList = DDZ_Data.Instance().playerInfo;
        if (playerList && playerList.length) {
            for (var i = 0; i < playerList.length; i++) {
                if (playerList[i].userId == cc.dd.user.id) {
                    playerList[i].coin = coin;
                }
            }
        }
    },

    popupEnterHall: function (text, callfunc) {
        // cc.dd.DialogBoxUtil.show(0, text, 'text33', null, function () {
        //     callfunc();
        // }, function () { });
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 2);
        }.bind(this));
    },

    /**
     * 匹配中
     */
    on_coin_room_enter: function () {
        DDZ_Data.Instance().setIsMatching(true);
        this.match.node.active = false;
        this.playMatchAnim();
    },

    /**
     * 换桌
     */
    on_room_replace: function (msg) {
        this.clearScene();
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_POPUP_18;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_POPUP_19;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    this.popupEnterHall(str, null);
                    break;
                default:
                    break;
            }
        } else {
            DDZ_Data.Instance().setIsMatching(true);
            DDZ_Data.Instance().clear();
            this.room_base.active = true;
            this.playMatchAnim();
        }
    },

    /**
     * 准备 继续
     */
    on_room_ready: function (msg) {
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].resetUI();
        }
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall(str, this.backToRoomList);
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall(str, this.backToRoomList);
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall(str, null);
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall(str, this.sendLeaveRoom);
                    break;
                default:
                    break;
            }
        } else {
            if (msg.userId === cc.dd.user.id) {
                DDZ_Data.Instance().setIsMatching(true);
                DDZ_Data.Instance().clear();
                this.room_base.active = true;
                this.stopMatchAnim();
            }
        }

    },

    //打完一局之后清理场景
    clearScene: function () {
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].resetUI();
            if (i != 0) {
                this._uiComponents[i].showUI(false);
                this._uiComponents[i].headsp.spriteFrame = this.default_head;
            }
        }
    },

    /**
     * 退出房间
     */
    on_room_leave: function (msg) {
        this.backToHall();
    },

    /**
     * 播放匹配动画
    */
    playMatchAnim() {
        this.anim_match.node.active = true;
        this.anim_match.playAnimation('FZZPPZ', -1);
    },

    /**
     * 停止匹配动画
     */
    stopMatchAnim() {
        this.anim_match.node.active = false;
        //this.anim_match.stop();
    },

    //重连时游戏已结束
    reconnectHall: function () {
        this.backToHall();
    },

    setTime() {
        if (this.timeStamp) {
            var nowTime = Math.floor(new Date().getTime() / 1000);
            var time = nowTime - this.timeStamp;
            var hour = Math.floor(time / 3600);
            var min = Math.floor((time - hour * 3600) / 60);
            var sec = time % 60;
            var str = hour.toString() + ':';
            str += min > 9 ? min.toString() : ('0' + min.toString());
            str += ':';
            str += sec > 9 ? sec.toString() : ('0' + sec.toString());
            cc.find('top/dipai_info/time', this.node).getComponent(cc.Label).string = str;
        }

    },

    idToView: function (id) {
        return DDZ_Data.Instance().idToView(id);
    },

    //初始化房间
    initGame: function () {
        var playerInfo = DDZ_Data.Instance().playerInfo;
        DDZ_Data.Instance().maxScore = 0;
        if (!playerInfo) {
            cc.error('playerInfo is null');
            return;
        }
        for (var i = 0; i < playerInfo.length; i++) {
            this._uiComponents[this.idToView(playerInfo[i].userId)].initPlayerInfo(playerInfo[i]);
            this._uiComponents[this.idToView(playerInfo[i].userId)].resetUI();
        }
        for (var i = 0; i < 3; i++) {
            this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), 0);
            cc.find('top/dipai_info/beilv/layout/spe', this.node).active = false;
        }
        for (var i = 0; i < 3; i++) {
            this.setPoker(cc.find('top/dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node), 0);
        }
        this.hideResult();
        this.onGameOpening();
    },

    onGameOpening: function () {
        this.JipaiCards = [];
        this.refreshJipaiqi();
        DDZ_Data.Instance().setIsStart(true);
        DDZ_Data.Instance().setIsMatching(false);
        DDZ_Data.Instance().setIsEnd(false);
        this.room_base.active = false;
        //this.chat.interactable = true;
        this.stopMatchAnim();
    },

    //初始化聊天
    initChat: function () {
        var cfg = null;
        var parent = cc.find('chat/panel/text/view/content', this.node);
        parent.removeAllChildren(true);
        if (cc.dd.user.sex == 1) {
            cfg = ddz_chat_cfg.Man;
        }
        else {
            cfg = ddz_chat_cfg.Woman;
        }
        for (var i = 0; i < cfg.length; i++) {
            var node = cc.instantiate(this.chat_item);
            node.tagname = i;
            node.getComponentInChildren(cc.Label).string = cfg[i];
            node.on('click', this.onQuickChatClick, this);
            parent.addChild(node);
        }
    },

    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('ddz_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
                cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
        }
        var bg_item = cc.find('setting/bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('setting/bg/content/zhuomian/toggles/tog', this.node);
        this.zhuobu.forEach(element => {
            var bg = cc.instantiate(bg_item);
            bg.getComponent(cc.Sprite).spriteFrame = element;
            bg.active = true;
            bg_item.parent.addChild(bg);
            var tog = cc.instantiate(tog_item);
            tog.active = true;
            tog_item.parent.addChild(tog);
        });
        this.nextBgBtn = cc.find('setting/bg/content/next_BG', this.node).getComponent(cc.Button);
        this.preBgBtn = cc.find('setting/bg/content/pre_BG', this.node).getComponent(cc.Button);
        this.idxZm = idx;
        this.contentZm = bg_item.parent;
        this.toggleZm = tog_item.parent;
        this.toggleZm.children[idx + 1].getChildByName('lv').active = true;
        this.zmWidth = bg_item.width;
        this.zmSpacingX = this.contentZm.getComponent(cc.Layout).spacingX;
        this.contentZm.x = - idx * (this.zmSpacingX + this.zmWidth);
        this.freshNextPreBtn();
    },
    freshNextPreBtn() {
        this.nextBgBtn.interactable = this.idxZm < (this.zhuobu.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },
    nextZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm + 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },
    preZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm - 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('ddz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },

    //初始化音乐音效设置
    initMusicAndSound: function () {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('setting/bg/content/music/mask', this.node).width = 0;
            cc.find('setting/bg/content/music/tao', this.node).x = -50;
            cc.find('setting/bg/content/music/tao/b', this.node).active = true;
            cc.find('setting/bg/content/music/tao/y', this.node).active = false;
            cc.find('setting/bg/content/music/label_kai', this.node).active = false;
            cc.find('setting/bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onMusic(ddz_audio_cfg.GAME_MUSIC);
        }
        if (!sound) {
            cc.find('setting/bg/content/sound/mask', this.node).width = 0;
            cc.find('setting/bg/content/sound/tao', this.node).x = -50;
            cc.find('setting/bg/content/sound/tao/b', this.node).active = true;
            cc.find('setting/bg/content/sound/tao/y', this.node).active = false;
            cc.find('setting/bg/content/sound/label_kai', this.node).active = false;
            cc.find('setting/bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    //发牌
    handPoker: function (data) {
        this._uiComponents[0].showBeilv();
        var cards = data.handPokersList;
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].playSendCards(cards);
            cc.find('callscore', this.getHeadByView(i)).active = false;//叫分隐藏
        }
        for (var i = 0; i < 3; i++) {
            this.setPoker(cc.find('top/dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node), 0);
        }
        cc.find('top/dipai_info/bottomcard_ani', this.node).getComponent(cc.Animation).play('dipai_reset');
        cc.find('top/dipai_info/beilv/layout/spe', this.node).active = false;
        DDZ_Data.Instance().maxScore = 0;
        // if (test_version) {
        //     var ddz_send_msg = require('ddz_send_msg');
        //     ddz_send_msg.sendMingpai();
        // }
    },

    //更新状态
    updateStatus: function (data) {
        var status = data.deskStatus;
        var id = data.curPlayer;
        switch (status) {
            case roomStatus.STATE_CALL_SCORE://叫分
                var callTime = DDZ_Data.Instance().deskInfo.callScoreTimeout;
                var maxScore = DDZ_Data.Instance().maxScore;
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        this._uiComponents[i].showCallScoreOp(callTime, maxScore);
                    }
                    else {
                        this._uiComponents[i].hideCallScoreOp();
                    }
                }
                break;
            case roomStatus.STATE_PLAYING://出牌
                var playTime = DDZ_Data.Instance().getPlayerTimeout(id);
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(id)) {
                        DDZ_Data.Instance().lastCards = [];
                        DDZ_Data.Instance().lastPlayer = -1;
                        this.curPlayer = i;
                        this._uiComponents[i].showPlaying(playTime);
                        // if (i == 0) {
                        //     this._uiComponents[i].clearAllSelectCards();
                        // }
                    }
                }
                break;
        }
    },

    //叫分返回
    callScoreRet: function (data) {
        var id = data.userId;
        var score = data.score;
        this._uiComponents[this.idToView(id)].callScoreRet(score, this.callscore_splist);
        this._uiComponents[this.idToView(id)].hideCallScoreOp();

        var sex = this.getPlayerById(id).sex;
        this.playSound(sex, soundType.JIAOFEN, score);
    },

    //显示地主和底牌
    showLord: function (data) {
        var bottomCards = data.bottomPokersList;
        var lordId = data.landholderId;
        // if (test_version) {
        //     this.addMingpaiList(lordId, bottomCards);
        // }
        var times = data.bottomPokersTimes;
        DDZ_Data.Instance().lordId = lordId;
        DDZ_Data.Instance().bottomPokersTimes = times;
        this.total_bei = DDZ_Data.Instance().maxScore * times;
        this.bomb_bei = 1;
        this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times });
        for (var i = 0; i < this._uiComponents.length; i++) {//显示地主 隐藏叫分
            this.scheduleOnce(function () {
                for (var j = 0; j < this._uiComponents.length; j++) {
                    cc.find('callscore', this.getHeadByView(j)).active = false;
                }
            }.bind(this), 1);
            if (i == this.idToView(lordId)) {
                cc.find('lord', this.getHeadByView(this.idToView(lordId))).active = true;
                this._uiComponents[this.idToView(lordId)].showBottomCard(bottomCards);
                // var showButtom = function () {
                //     cc.find('lord_cap', this.node).getComponent(cc.Animation).off('finished', showButtom);
                //     cc.find('head/lord', this._uiComponents[this.idToView(lordId)].node).active = true;
                //     this._uiComponents[this.idToView(lordId)].showBottomCard(bottomCards);
                // }.bind(this);
                // cc.find('lord_cap', this.node).getComponent(cc.Animation).on('finished', showButtom);
                // cc.find('lord_cap', this.node).getComponent(cc.Animation).play('lord_cap' + i.toString());
            }
            else {
                cc.find('lord', this.getHeadByView(i)).active = false;
            }
        }
        this._uiComponents[0].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout);
    },

    //加倍返回
    doubleRet: function (data) {
        var id = data.userId;
        var isDouble = data.isDouble;
        if (isDouble) {
            var jiabei_ani = cc.find('jiabei_ani', this.getHeadByView(this.idToView(id)));
            var jiabei_node = cc.find('jiabei', this.getHeadByView(this.idToView(id)));
            jiabei_ani.active = true;
            var spine = jiabei_ani.getComponent(sp.Skeleton);
            spine.setCompleteListener((trackEntry, loopCount) => {
                jiabei_node.active = true;
                jiabei_ani.active = false;
            });
            spine.setAnimation(0, 'animation', false);
            //cc.find('jiabei', this.getHeadByView(this.idToView(id))).active = true;
            cc.find('double', this.getHeadByView(this.idToView(id))).getComponent(cc.Sprite).spriteFrame = null;//this.double_splist[1];
        }
        else {
            cc.find('double', this.getHeadByView(this.idToView(id))).getComponent(cc.Sprite).spriteFrame = null;//this.double_splist[0];
        }
        cc.find('double', this.getHeadByView(this.idToView(id))).active = true;
        this.scheduleOnce(function () {
            cc.find('double', this.getHeadByView(this.idToView(id))).active = false;
        }.bind(this), 1);
        if (this.idToView(id) == 0) {
            this._uiComponents[0].showOperation(-1);
            //this.total_bei *= isDouble ? 2 : 1;
            this._uiComponents[0].showBeilv({ total: this.total_bei, jiabei: isDouble ? 2 : null });
        }

        var sex = this.getPlayerById(id).sex;
        this.playSound(sex, soundType.JIABEI, isDouble ? 1 : 0);
    },

    /**
     * 出牌消息
     */
    playPoker: function (data) {
        var id = data.userId;
        var pokers = data.pokersList;
        // if (test_version) {
        //     if (pokers.length > 0) {
        //         this.subMingpaiList(id, pokers);
        //     }
        // }
        for (var i = 0; i < pokers.length; i++) {
            this.JipaiCards.push(pokers[i]);
        }
        this.refreshJipaiqi();
        this.outCardSound(id, pokers);
        var remainNum = this._uiComponents[this.idToView(id)].remainCard;
        if (pokers.length > 0 && remainNum - pokers.length <= 2 && remainNum - pokers.length > 0) {
            var sex = this.getPlayerById(id).sex;
            this.scheduleOnce(function () { this.playSound(sex, soundType.REMAIN, remainNum - pokers.length); }.bind(this), 0.2);//延迟播放报警
        }
        if (pokers.length > 0) {
            DDZ_Data.Instance().lastCards = pokers;
            DDZ_Data.Instance().lastPlayer = this.idToView(id);
        }
        this._uiComponents[this.idToView(id)].showOutCard(pokers, DDZ_Data.Instance().lordId == id);
        if (this._uiComponents[this.idToView(id)].getHandCardNum() != 0) {
            var nextPlayer = this.getNextPlayer(this.idToView(id));
            this.curPlayer = nextPlayer;
            if (this.curPlayer == DDZ_Data.Instance().lastPlayer) {
                DDZ_Data.Instance().lastCards = [];
            }
            var playTime = DDZ_Data.Instance().getPlayerTimeoutByView(nextPlayer);
            this._uiComponents[nextPlayer].showPlaying(playTime);
        }
        if (ddz.analysisCards(pokers).type >= 10) {//炸弹
            this.total_bei *= 2;
            this.bomb_bei *= 2;
            this._uiComponents[0].showBeilv({ total: this.total_bei, zhadan: this.bomb_bei });
        }
    },

    //出牌音效
    outCardSound: function (id, pokers) {
        if (!this.getPlayerById(id))
            return;
        var sex = this.getPlayerById(id).sex;
        if (pokers.length > 0) {
            if (DDZ_Data.Instance().lastPlayer == this.idToView(id) || !DDZ_Data.Instance().lastCards || DDZ_Data.Instance().lastCards.length == 0) {
                var analysis = ddz.analysisCards(pokers);
                switch (analysis.type) {
                    case 1://单牌
                        if (analysis.index == 17) {
                            this.playSound(sex, soundType.DAN, pokers[0]);
                        }
                        else {
                            this.playSound(sex, soundType.DAN, analysis.index);
                        }
                        break;
                    case 2://对子
                        this.playSound(sex, soundType.DUI, analysis.index);
                        break;
                    case 3://三张
                        this.playSound(sex, soundType.SAN, analysis.index);
                        break;
                    case 4://三带
                        if (pokers.length == 4) {
                            this.playSound(sex, soundType.THREE_YI, null);
                        }
                        else {
                            this.playSound(sex, soundType.THREE_DUI, null);
                        }
                        break;
                    case 5://顺子
                        if (analysis.index != 14) {
                            this.playSound(sex, soundType.SHUNZI, null);
                        }
                        break;
                    case 6://连对
                        this.playSound(sex, soundType.LIANDUI, null);
                        break;
                    case 7://飞机不带
                    case 8://飞机带一或对
                        this.playSound(sex, soundType.AIRPLANE, null);
                        break;
                    case 9://四带
                        if (pokers.length == 6) {
                            this.playSound(sex, soundType.FOUR_ER, null);
                        }
                        else {
                            this.playSound(sex, soundType.FOUR_DUI, null);
                        }
                        break;
                    case 10://炸弹
                        this.playSound(sex, soundType.BOMB, null);
                        break;
                    case 11://王炸
                        this.playSound(sex, soundType.ROCKET, null);
                        break;
                }
            }
            else {
                var analysis = ddz.analysisCards(pokers);
                var lastanalysis = ddz.analysisCards(DDZ_Data.Instance().lastCards);
                var typeSame = analysis.type == lastanalysis.type;
                switch (analysis.type) {
                    case 1://单牌
                        if (analysis.index == 17) {
                            this.playSound(sex, soundType.DAN, pokers[0]);
                        }
                        else {
                            this.playSound(sex, soundType.DAN, analysis.index);
                        }
                        break;
                    case 2://对子
                        this.playSound(sex, soundType.DUI, analysis.index);
                        break;
                    case 3://三张
                        this.playSound(sex, soundType.SAN, analysis.index);
                        break;
                    case 4://三带
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            if (pokers.length == 4) {
                                this.playSound(sex, soundType.THREE_YI, null);
                            }
                            else {
                                this.playSound(sex, soundType.THREE_DUI, null);
                            }
                        }
                        break;
                    case 5://顺子
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.SHUNZI, null);
                        }
                        break;
                    case 6://连对
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.LIANDUI, null);
                        }
                        break;
                    case 7://飞机不带
                    case 8://飞机带一或对
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.AIRPLANE, null);
                        }
                        break;
                    case 9://四带
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            if (pokers.length == 6) {
                                this.playSound(sex, soundType.FOUR_ER, null);
                            }
                            else {
                                this.playSound(sex, soundType.FOUR_DUI, null);
                            }
                        }
                        break;
                    case 10://炸弹
                        if (typeSame) {
                            this.playSound(sex, soundType.KILL, null);
                        }
                        else {
                            this.playSound(sex, soundType.BOMB, null);
                        }
                        break;
                    case 11://王炸
                        this.playSound(sex, soundType.ROCKET, null);
                        break;
                }
            }
        }
        else {
            this.playSound(sex, soundType.PASS, null);
        }
    },

    /**
     * 托管消息 
     */
    autoRet: function (data) {
        var id = data.userId;
        var isAuto = data.isAuto;
        this._uiComponents[this.idToView(id)].showAuto(isAuto);
    },

    //春天特效
    playSpring: function () {
        var bone = cc.find('spring_ani/Spring01_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        bone.playAnimation('Spring', 1);
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SPRING, false);
    },

    /**
     * 单局结算 
     */
    showResult: function (data) {
        cc.find('setting', this.node).active = false;
        DDZ_Data.Instance().setIsStart(false);
        DDZ_Data.Instance().setIsMatching(true);
        if (data.isGod > 0) {
            this.playSpring();
            this.total_bei *= 2;
            this._uiComponents[0].showBeilv({ total: this.total_bei, chuntian: 2 });
        }
        for (var i = 0; i < this._uiComponents.length; i++) {
            this._uiComponents[i].showAuto(false);
            cc.find('op', this._uiComponents[i].node).active = false;
        }
        for (var i = 0; i < this._uiComponents.length; i++) {
            cc.find('Canvas/root/result_ani/score' + i.toString() + '/jiabei').active = cc.find('jiabei', this.getHeadByView(i)).active;
        }

        var nodes = [];
        nodes.push(cc.find('result_ani/detail/jiaofen', this.node));
        nodes.push(cc.find('result_ani/detail/dipai', this.node));
        nodes.push(cc.find('result_ani/detail/zhadan', this.node));
        nodes.push(cc.find('result_ani/detail/chuntian', this.node));
        nodes.push(cc.find('result_ani/detail/total', this.node));
        var idx = 0;
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].active = false;
        }
        var jiaofen = DDZ_Data.Instance().maxScore;
        var dipai = DDZ_Data.Instance().bottomPokersTimes;
        var zhadan = Math.pow(2, data.zhadanNum);
        var total = jiaofen * dipai * zhadan * (data.isGod > 0 ? 2 : 1);
        if (isNaN(total)) {
            total = 0;
        }
        nodes[idx].getChildByName('name').getComponent(cc.Label).string = '总倍数 x';
        nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = total.toString();
        nodes[idx++].active = true;

        nodes[idx].getChildByName('name').getComponent(cc.Label).string = '叫分 x';
        nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = jiaofen.toString();
        nodes[idx++].active = true;

        if (dipai > 1) {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '底牌 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = dipai.toString();
            nodes[idx++].active = true;
        }

        if (zhadan > 1) {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '炸弹 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = zhadan.toString();
            nodes[idx++].active = true;
        }
        if (data.isGod == 0) {

        }
        else if (data.isGod == 1) {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '春天 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = '2';
            nodes[idx++].active = true;
        }
        else {
            nodes[idx].getChildByName('name').getComponent(cc.Label).string = '反春 x';
            nodes[idx].getChildByName('lbl').getComponent(cc.Label).string = '2';
            nodes[idx++].active = true;
        }

        var changeList = data.changeListList.sort(function (a, b) { return DDZ_Data.Instance().idToView(a.userId) - DDZ_Data.Instance().idToView(b.userId) });
        for (var i = 0; i < changeList.length; i++) {
            if (changeList[i].changeScore > 0) {
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/bg').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('win_di');
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.addsub[0];
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).font = this.win_font;
            }
            else {
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/bg').getComponent(cc.Sprite).spriteFrame = this.atlas_game.getSpriteFrame('lose_di');
                if (changeList[i].changeScore == 0)
                    cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = null;
                else
                    cc.find('Canvas/root/result_ani/score' + i.toString() + '/score').getComponent(cc.Sprite).spriteFrame = this.addsub[1];
                cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).font = this.lose_font;
            }
            cc.find('Canvas/root/result_ani/score' + i.toString() + '/lbl').getComponent(cc.Label).string = Math.abs(changeList[i].changeScore).toString();
        }

        var roomcfg = game_room.getItem(function (item) {
            return item.gameid == RoomMgr.Instance().gameId && item.roomid == RoomMgr.Instance().roomLv;
        }.bind(this));
        var tax = roomcfg.tax;
        cc.log('房费:' + tax);

        this.scheduleOnce(function () {
            //显示手牌
            for (var i = 0; i < data.changeListList.length; i++) {
                if (this.idToView(data.changeListList[i].userId) != 0) {
                    if (data.changeListList[i].leftHandPokerList.length > 0) {
                        this._uiComponents[this.idToView(data.changeListList[i].userId)].showOutCard(data.changeListList[i].leftHandPokerList, DDZ_Data.Instance().lordId == data.changeListList[i].userId, true);
                    }
                }
            }
            //修改玩家分数
            for (var i = 0; i < data.changeListList.length; i++) {
                for (var j = 0; j < DDZ_Data.Instance().playerInfo.length; j++) {
                    if (data.changeListList[i].userId == DDZ_Data.Instance().playerInfo[j].userId) {
                        DDZ_Data.Instance().playerInfo[j].score += data.changeListList[i].changeScore;
                        var view = this.idToView(data.changeListList[i].userId);
                        if (view != 0) {
                            cc.find('info/gold', this.getHeadByView(view)).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform((DDZ_Data.Instance().playerInfo[j].score - tax));
                        }
                        break;
                    }
                }
            }
        }.bind(this), 1);

        this.scheduleOnce(function () {
            var node = cc.find('Canvas/root/result_ani');
            node.getComponent(cc.Animation).play();
            this.scheduleOnce(function () {
                node.active = true;
            }, 0.05);
        }.bind(this), 1.5);

        this.scheduleOnce(function () {
            cc.find('Canvas/root/result_ani/btns').active = true;
            if (HallPropData.getInstance().getCoin() < DDZ_Data.Instance().m_nUnderScore) {
                cc.find('Canvas/root/result_ani').getComponent('ddz_jiesuan_jbc').stopTime();
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_XIAOQIAN, function (ui) {
                    var mj_huaqian = ui.getComponent("mj_huaqian");
                    mj_huaqian.setEntermin(DDZ_Data.Instance().m_nUnderScore);
                });
            }
            else {
                cc.find('Canvas/root/result_ani').getComponent('ddz_jiesuan_jbc').startTime();
            }
        }, 3);
        cc.find('Canvas/root/result_ani').getComponent('ddz_jiesuan_jbc').time.string = '15';
    },
    hideResult: function () {
        cc.find('Canvas/root/result_ani').active = false;
    },

    initBaseScore: function () {
        var name_lbl = cc.find('layer_base_score/name', this.node).getComponent(cc.Label);
        var score_lbl = cc.find('layer_base_score/base_score', this.node).getComponent(cc.Label);
        var title_str = DDZ_Data.Instance().m_strTitle;
        var score_str = '底分: ' + DDZ_Data.Instance().m_nBaseScore;
        name_lbl.string = title_str;
        score_lbl.string = score_str;
        cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
    },

    /**
     * 断线重连
     */
    reconnect: function (data) {
        this.configId = data.configRoomId;
        var ccmjJbcCfgItem = game_room.getItem(function (item) {
            return item.key === this.configId;
        }.bind(this));
        DDZ_Data.Instance().setData(ccmjJbcCfgItem);
        RoomMgr.Instance().roomLv = ccmjJbcCfgItem.roomid;

        this.match.node.active = false;
        this.initGame();
        this.initBaseScore();
        this.JipaiCards = data.playedPokersList || [];
        this.refreshJipaiqi();
        for (var j = 0; j < this._uiComponents.length; j++) {
            cc.find('callscore', this.getHeadByView(j)).active = false;
        }
        for (var i = 1; i < 4; i++) {
            cc.find('top/dipai_info/bottomcard_ani/pic' + i.toString(), this.node).active = false;
            cc.find('top/dipai_info/bottomcard_ani/dipai_' + i.toString(), this.node).scaleX = 0;
            cc.find('top/dipai_info/bottomcard_ani/dipai_' + i.toString(), this.node).scaleX = 0;
            cc.find('top/dipai_info/dipai_' + i.toString(), this.node).scale = 1;
        }
        for (var i = 0; i < this._uiComponents.length; i++) {
            if (i == 0) {
                this._uiComponents[i].showOperation(-1);
            }
            else {
                this._uiComponents[i].hideTimer();
            }
        }

        var bottomPokers = data.bottomPokersList;
        if (bottomPokers.length) {
            var cards = ddz.sortShowCards(bottomPokers);
            for (var i = 0; i < cards.length; i++) {
                this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), cards[i]);
                cc.find('top/dipai_info/beilv/layout/spe', this.node).active = false;
                this._uiComponents[0].calSpecialBottom(bottomPokers);
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.setDipai(cc.find('top/dipai_info/dipai_' + (i + 1).toString(), this.node), 0);
            }
            cc.find('top/dipai_info/beilv/layout/spe', this.node).active = false;
        }

        var playerInfo = DDZ_Data.Instance().playerInfo;
        for (var i = 0; i < playerInfo.length; i++) {
            var isDouble = playerInfo[i].isDouble;
            var isAuto = playerInfo[i].isAuto;
            var isLord = playerInfo[i].identify;
            var isOffline = playerInfo[i].state != 1;
            var isWeak = playerInfo[i].netState < 3;
            cc.find('lord', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isLord || false;
            cc.find('tuoguan', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isAuto || false;
            cc.find('jiabei', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isDouble || false;
            cc.find('offline', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isOffline || false;
            cc.find('weak', this.getHeadByView(this.idToView(playerInfo[i].userId))).active = isWeak;
            if (this.idToView(playerInfo[i].userId) == 0) {
                cc.find('tuoguan_node', this._uiComponents[0].node).active = isAuto || false;
            }
        }

        cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = '底分:' + DDZ_Data.Instance().deskInfo.baseScore.toString();
        //cc.find('top/dipai_info/default_score', this.node).getComponent(cc.Label).string = '淘汰分:' + DDZ_Data.Instance().deskInfo.outScore.toString();
        switch (DDZ_Data.Instance().deskInfo.deskStatus) {
            case roomStatus.STATE_CALL_SCORE:
                cc.find('top/dipai_info/bottomcard_ani', this.node).getComponent(cc.Animation).play('dipai_reset');
                var callTime = DDZ_Data.Instance().deskInfo.callScoreTimeout;
                DDZ_Data.Instance().maxScore = data.curCallScore;
                var curPlayer = data.curPlayer;
                var curTime = data.timeout;
                for (var i = 0; i < this._uiComponents.length; i++) {
                    if (i == this.idToView(curPlayer)) {
                        this._uiComponents[i].showCallScoreOp(callTime, DDZ_Data.Instance().maxScore, curTime);
                    }
                    else {
                        this._uiComponents[i].hideCallScoreOp();
                    }
                }
                this._uiComponents[0].showBeilv();
                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }
                for (var i = 0; i < playerInfo.length; i++) {
                    if (playerInfo[i].callScore > -1) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].callScoreRet(playerInfo[i].callScore, this.callscore_splist);
                    }
                }
                break;
            case roomStatus.STATE_DOUBLE:

                var curTime = data.timeout;
                var unSelect = false;
                var myDouble = null;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (0 == this.idToView(playerInfo[i].userId)) {
                        if (cc.dd._.isUndefined(playerInfo[i].isDouble)) {
                            unSelect = true;
                        }
                        else {
                            myDouble = playerInfo[i].isDouble;
                        }
                    }
                }
                if (unSelect) {
                    this._uiComponents[0].showDouble(DDZ_Data.Instance().deskInfo.doubleTimeout, curTime);
                }

                DDZ_Data.Instance().maxScore = data.curCallScore;
                var times = data.bottomPokersTimes;
                DDZ_Data.Instance().bottomPokersTimes = times;
                this.bomb_bei = 1;
                if (unSelect) {
                    this.total_bei = DDZ_Data.Instance().maxScore * times;
                    this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times });
                }
                else {
                    this.total_bei = DDZ_Data.Instance().maxScore * times;
                    //this.total_bei *= myDouble ? 2 : 1;
                    this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times, jiabei: myDouble ? 2 : null });
                }

                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }

                break;
            case roomStatus.STATE_PLAYING:

                var curTime = data.timeout;
                var playTime = DDZ_Data.Instance().getPlayerTimeout(data.curPlayer);
                var myDouble = null;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (0 == this.idToView(playerInfo[i].userId)) {
                        myDouble = playerInfo[i].isDouble;
                    }
                }
                DDZ_Data.Instance().maxScore = data.curCallScore;
                var times = data.bottomPokersTimes;
                DDZ_Data.Instance().bottomPokersTimes = times;
                var bombNum = data.curZhaDanNum;
                this.bomb_bei = Math.pow(2, bombNum);
                this.total_bei = DDZ_Data.Instance().maxScore * times * this.bomb_bei;
                //this.total_bei *= myDouble ? 2 : 1;
                this._uiComponents[0].showBeilv({ total: this.total_bei, jiaofen: DDZ_Data.Instance().maxScore, dipai: times, jiabei: myDouble ? 2 : null, zhadan: this.bomb_bei });


                this._uiComponents[0].playSendCards(data.handPokersList, 0);
                var playerInfo = DDZ_Data.Instance().playerInfo;
                for (var i = 0; i < playerInfo.length; i++) {
                    if (this.idToView(playerInfo[i].userId) != 0) {
                        this._uiComponents[this.idToView(playerInfo[i].userId)].playSendCards({ length: playerInfo[i].handPokerNum });
                    }
                }

                var recentPlay = data.recentPlayList;
                if (recentPlay[0]) {
                    if (recentPlay[0].pokersList.length > 0) {
                        DDZ_Data.Instance().lastCards = recentPlay[0].pokersList;
                        DDZ_Data.Instance().lastPlayer = this.idToView(recentPlay[0].userId);
                    }
                    else if (recentPlay[1] && recentPlay[1].pokersList.length > 0) {
                        DDZ_Data.Instance().lastCards = recentPlay[1].pokersList;
                        DDZ_Data.Instance().lastPlayer = this.idToView(recentPlay[1].userId);
                    }
                    else {
                        DDZ_Data.Instance().lastCards = [];
                    }
                    for (var i = 0; i < recentPlay.length; i++) {
                        this._uiComponents[this.idToView(recentPlay[i].userId)].displayOutCard(recentPlay[i].pokersList);
                    }
                }
                else {
                    DDZ_Data.Instance().lastCards = [];
                }
                this.curPlayer = this.idToView(data.curPlayer);
                this._uiComponents[this.curPlayer].showPlaying(playTime, curTime);
                break;
        }
        if (DDZ_Data.Instance().reconnectResult) {
            this.showResult(DDZ_Data.Instance().reconnectResult);
            DDZ_Data.Instance().reconnectResult = null;
        }
    },

    /**
     * 初始化UI脚本
     */
    initUiScript: function (bool) {
        this._uiComponents = [];
        if (bool) {
            this._uiComponents.push(this.node.getComponentInChildren('ddz_jbc_down_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('ddz_jbc_right_ui'));
            this._uiComponents.push(this.node.getComponentInChildren('ddz_jbc_left_ui'));
        }
    },

    //播放炸弹特效
    playBombAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('bomb_camera_' + str);
        var bone = cc.find('bomb_ani/ddz_zhadan_ske' + str, this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('zha', 1);
            var finish = function () {
                cc.find('dilie' + str, bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
                bone.enabled = false;
            }
            cc.find('dilie' + str, bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
            cc.find('dilie' + str, bone.node.parent).getComponent(cc.Animation).play();
        }.bind(this);
        bone.playAnimation('lujing' + str, 1);
        bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    //播放炸弹特效
    playBombAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('bomb_camera_' + str);
        var bone = cc.find('bomb_ani/ddz_zhadan_ske_' + str, this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('zha', 1);
            var finish = function () {
                cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
                bone.enabled = false;
            }
            cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
            cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).play();
        }.bind(this);
        bone.playAnimation('lujing' + str, 1);
        bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    //播放火箭特效
    playRocketAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('rocket_camera_' + str);
        var bone = cc.find('rocket_ani/huojian01_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            //bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('huojianzha', 1);
            bone.scheduleOnce(function () {
                cc.find('dilie', bone.node.parent).getComponent(cc.Animation).play();
                bone.enabled = false;
            }.bind(this), 1);
        }.bind(this);
        bone.playAnimation('huojianfei' + str, 1);
        this.scheduleOnce(playFinish, 0.5);
        //bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    //销毁骨骼动画
    clearBones: function () {
        if (this.springNode) {
            this.springNode.destroy();
            this.springNode = null;
        }
        if (this.rocketNode) {
            this.rocketNode.destroy();
            this.rocketNode = null;
        }
        if (this.bombNode) {
            this.bombNode.destroy();
            this.bombNode = null;
        }
    },

    playShunziAnimation: function (node, pos) {
        // var prefab = null;
        // if (this.shunziPool.size() > 0) {
        //     prefab = this.shunziPool.get();
        // }
        // else {
        //     prefab = cc.instantiate(this.shunzi_prefab);
        // }
        // //node.parent.addChild(prefab);
        // node.addChild(prefab);
        // prefab.getComponent(sp.Skeleton).clearTrack(0);
        // prefab.getComponent(sp.Skeleton).setAnimation(0, 'shunzi', false);
        // // prefab.x = node.x;
        // // prefab.y = node.y + 40;
        // prefab.x = pos.x;
        // prefab.y = pos.y + 40;
        // AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
    },

    playTopCard1: function (node, pos) {
        // var prefab = null;
        // cc.log('topPool size:' + this.topcardPool.size());
        // if (this.topcardPool.size() > 0) {
        //     prefab = this.topcardPool.get();
        // }
        // else {
        //     prefab = cc.instantiate(this.topcard1_prefab);
        // }
        // node.addChild(prefab);
        // prefab.getComponent(sp.Skeleton).clearTrack(0);
        // prefab.getComponent(sp.Skeleton).setAnimation(0, 'dingpai1', false);
        // prefab.setSiblingIndex(0);
        // prefab.x = pos.x;
        // prefab.y = pos.y;
    },

    playLianduiAnimation: function (node, pos) {
        // var prefab = null;
        // if (this.lianduiPool.size() > 0) {
        //     prefab = this.lianduiPool.get();
        // }
        // else {
        //     prefab = cc.instantiate(this.liandui_prefab);
        // }
        // node.addChild(prefab);
        // prefab.getComponent(sp.Skeleton).clearTrack(0);
        // prefab.getComponent(sp.Skeleton).setAnimation(0, 'liandui', false);
        // prefab.x = pos.x;
        // prefab.y = pos.y + 40;
        // AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
    },

    //播放飞机特效
    playAirplaneAnimation: function () {
        cc.find('Canvas/root/effect_airplane').getComponent(cc.Animation).play();
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.FEIJI, false);
    },

    //获取下一个玩家
    getNextPlayer: function (curPlayer) {
        return this.curPlayer + 1 < 3 ? this.curPlayer + 1 : 0;
    },

    //玩家掉线
    playerOffline: function (data) {
        var userId = data.userId;
        var isOffline = data.isOffline;
        this._uiComponents[this.idToView(userId)].showOffline(isOffline);
    },

    //开始按钮
    onMatch(event, target) {
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();
        msg.setGameType(gameType);
        msg.setRoomId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    //btns点击
    onButtonClick: function (event, data) {
        switch (data) {
            case 'menu'://菜单
                hall_audio_mgr.com_btn_click();
                if (!this.menu_show) {
                    cc.find('menu', this.node).active = true;
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    if (ani._nameToState[ani._defaultClip.name]) {
                        ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                    }
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = true;
                }
                else {
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = null;
                }
                break;
            case 'tuoguan'://托管
                hall_audio_mgr.com_btn_click();
                this._uiComponents[0].sendTuoGuan();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'setting'://设置
                hall_audio_mgr.com_btn_click();
                cc.find('setting', this.node).active = true;
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'chat'://聊天
                hall_audio_mgr.com_btn_click();
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_in');
                }
                break;
            case 'vip'://vip介绍
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP);
                break;
            case 'exit'://退出
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                if (DDZ_Data.Instance().getIsMatching()) {
                    // 取消匹配状态
                    this.sendLeaveRoom();
                } else {
                    if (DDZ_Data.Instance().getIsStart()) {
                        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                            ui.getComponent("jlmj_popup_view").show('正在游戏中，退出后系统自动出牌，是否退出?', this.sendLeaveRoom, 1);
                        }.bind(this));
                        // cc.dd.DialogBoxUtil.show(0, '正在游戏中，退出后系统自动出牌，是否退出？', 'text33', 'Cancel', function () {
                        //     this.sendLeaveRoom();
                        // }.bind(this), function () {
                        // }.bind(this));
                    } else {
                        this.backToHall();
                    }
                }
                break;
        }
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },



    //显示玩家信息
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('jlmj_prefab_cfg');
        var view = parseInt(data);
        var playerInfo = this.getPlayerByView(view);
        if (!playerInfo)
            return;
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
            user_info.setData(DDZ_Data.Instance().getGameId(), DDZ_Data.Instance().getRoomId(), null, false, playerInfo);
            user_info.show();
        }.bind(this));
    },

    //快捷文字
    onQuickChatClick: function (event) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            hall_audio_mgr.com_btn_click();
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }

            var gameType = DDZ_Data.Instance().getGameId();
            var roomId = DDZ_Data.Instance().getRoomId();

            var id = parseInt(event.target.tagname);
            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(1);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 1;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
        else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },

    //表情点击
    onEmojiClick: function (event, data) {
        if (!this.emojiCD) {
            hall_audio_mgr.com_btn_click();
            this.emojiCD = true;
            setTimeout(function () {
                this.emojiCD = false;
            }.bind(this), 3 * 1000);
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }
            var gameType = DDZ_Data.Instance().getGameId();
            var roomId = DDZ_Data.Instance().getRoomId();
            var id = parseInt(data);

            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(2);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 2;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
    },

    idToItem(id) {
        var list = DDZ_Data.Instance().itemList;
        return list[id];
    },

    itemToPlayId(itemid) {
        var list = DDZ_Data.Instance().itemList;
        return list.indexOf(itemid);
    },

    //魔法表情
    sendMagicProp: function (event, data) {
        if (this.userId == cc.dd.user.id) {
            cc.log('不能对自己使用道具！');
            return;
        }

        const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
        var dataINfo = hall_prop_data.getItemInfoByDataId(this.id2Item(Number(data)));
        if (dataINfo == undefined || dataINfo.count < 1) {
            cc.log('道具数量不足!');
            cc.dd.PromptBoxUtil.show('道具数量不足! 可以通过金币兑换。');
            return;
        }

        var gameType = DDZ_Data.Instance().getGameId();
        var roomId = DDZ_Data.Instance().getRoomId();

        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(3);
        chatInfo.setId(this.id2Item(Number(data)));
        chatInfo.setToUserId(this.userId);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = 3;
        chat_msg.id = this.id2Item(Number(data));
        chat_msg.toUserId = this.userId;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        cc.find('user_info', this.node).active = false;
    },

    onChat: function (data) {
        if (DDZ_Data.Instance().playerInfo) {
            if (data.msgtype == 1) {//短语
                var view = this.idToView(data.sendUserId);
                var sex = this.getPlayerById(data.sendUserId).sex;
                this.playSound(sex, soundType.CHAT, data.id);
                var cfg = null;
                if (sex == 1) {
                    cfg = ddz_chat_cfg.Man;
                }
                else {
                    cfg = ddz_chat_cfg.Woman;
                }
                var str = cfg[data.id];
                this._uiComponents[view].showChat(str);
            }
            else if (data.msgtype == 2) {//表情
                var view = this.idToView(data.sendUserId);
                this._uiComponents[view].showEmoji(data.id);
            }
            else if (data.msgtype == 3) {//魔法表情
                this.playMagicProp(data.id, data.sendUserId, data.toUserId);
            }
        }
    },

    //播放魔法表
    playMagicProp: function (id, send, to) {
        // var magicIcon = this.createMagicPropIcon(id);
        // var startPos = this.getPlayerHeadPos(send);
        // var endPos = this.getPlayerHeadPos(to);
        // cc.log('startPos:' + startPos + '   endPos:' + endPos);
        // magicIcon.tag = this.getTargetNode(to);
        // magicIcon.setPosition(startPos);
        // var moveTo = cc.moveTo(1.0, endPos);
        // magicIcon.runAction(cc.sequence(
        //     moveTo
        //     , cc.callFunc(function () {
        //         this.playPropEffect(id, magicIcon);
        //     }.bind(this))
        // ));
        //var mj_xbq = cc.find('xinbiaoqing', this.node);
        //var xinbiaoqing = mj_xbq.getComponent('mj_xinbiaoqing');
        var sPos = this.getPlayerHeadPos(send);
        var ePos = this.getPlayerHeadPos(to);
        //xinbiaoqing.playeXinBiaoQing(id, cc.find('magic_layer', this.node), sPos, ePos);

        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        magic_prop.playMagicPropAni(id, sPos, ePos);
    },

    createMagicPropIcon: function (idx) {
        var atlas = this.magic_atlas;
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = atlas.getSpriteFrame(magicIcons[idx]);
        magicIcon.parent = cc.find('magic_layer', this.node);
        // this.magicIcons.push(magicIcon);
        return magicIcon;
    },
    getPlayerHeadPos: function (id) {
        var view = this.idToView(id);
        var head = this.getHeadByView(view);
        var pos = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
        return pos;
    },
    getTargetNode: function (id) {
        var view = this.idToView(id);
        var head = cc.find('mask', this.getHeadByView(view));
        return head;
    },
    playPropEffect: function (idx, magicIcon) {
        var node = magicIcon.tagname;
        magicIcon.destroy();
        var magic_prop_ani_node = cc.instantiate(this.magic_prop);
        var magic_prop_ani = magic_prop_ani_node.getComponent(cc.Animation);
        magic_prop_ani.node.active = true;
        magic_prop_ani.node.parent = node;
        magic_prop_ani.play('magic_prop_' + idx);
        magic_prop_ani.on('finished', function () {
            magic_prop_ani.node.destroy();
        });
        AudioManager.getInstance().playSound(PropAudioCfg[idx]);
    },

    //快捷聊天
    onChatToggle: function (event, data) {
        if (data == 'text') {
            cc.find('chat/panel/text', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = true;
            cc.find('chat/panel/emoji', this.node).active = false;
        }
        else {
            cc.find('chat/panel/emoji', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = false;
            cc.find('chat/panel/emoji', this.node).active = true;
        }
    },

    //关闭按钮
    onCloseClick: function (event, data) {
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
            case 'chat':
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                }
                break;
            case 'userinfo':
                cc.find('user_info', this.node).active = false;
                break;
        }
    },

    //点击背景
    onBgClick: function () {
        if (this.menu_show) {
            cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true; }.bind(this), this);
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
        // if (cc.find('player_down/beilv/detail', this.node).active == true) {
        //     cc.find('player_down/beilv/detail', this.node).active = false;
        // }
    },

    //返回大厅
    backToHall: function (event, data) {
        DDZ_Data.Destroy();
        if(cc.dd._.isNumber(cc.go_to_xiaociji)) {
            cc.dd.NetWaitUtil.show('正在请求数据');
            var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            protoNewRoomList.setHallGameid(cc.go_to_xiaociji);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
                '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
            cc.go_to_xiaociji = null
        }else if(cc.ddz_go_to_match){
            cc.ddz_go_to_match = null;
            cc.dd.SceneManager.enterHallMatch();
        }else{
            cc.dd.SceneManager.enterHall();
        }
    },
    backToRoomList: function () {
        DDZ_Data.Destroy();
        cc.dd.SceneManager.enterRoomList();
    },

    /**
     * 分享到朋友圈
     */
    PYQBtnCallBack: function () {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');

            let xiaociji = cc.find('result_ani/btns/klb_hall_xiaocijiBtn', this.node);
            let freecoin = cc.find('result_ani/btns/freeCoinBtn', this.node);
            if(xiaociji){
                xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(false);
            }
            if(freecoin){
                freecoin.active = false;
            }

            cc.find('result_ani/gongzhonghao', this.node).active = true;
            cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            cc.find('result_ani/gongzhonghao', this.node).active = false;

            if(xiaociji){
                xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(true);
            }
            if(freecoin){
                freecoin.active = true;
            }

        }
    },

    //设置音乐音效
    onSetMusic: function (event, data) {
        var duration = 0.3;
        var step = 0.05;
        switch (data) {
            case 'music':
                var music_Node = this.music_Node;
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = false;
                            cc.find('tao/b', music_Node).active = true;
                            cc.find('label_guan', music_Node).active = true;
                            AudioManager.getInstance().offMusic();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', music_Node).width;
                        var time = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', music_Node).width = width * time / duration;
                            if (time == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = true;
                            cc.find('tao/b', music_Node).active = false;
                            cc.find('label_kai', music_Node).active = true;
                            AudioManager.getInstance().onMusic(ddz_audio_cfg.GAME_MUSIC);
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time1 = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time1 -= step;
                            if (time1 < 0)
                                time1 = 0;
                            cc.find('mask', music_Node).width = width * (1 - time1 / duration);
                            if (time1 == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                break;
            case 'sound':
                var sound_Node = this.sound_Node;
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = false;
                            cc.find('tao/b', sound_Node).active = true;
                            cc.find('label_guan', sound_Node).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', sound_Node).width;
                        var time2 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time2 -= step;
                            if (time2 < 0)
                                time2 = 0;
                            cc.find('mask', sound_Node).width = width * time2 / duration;
                            if (time2 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = true;
                            cc.find('tao/b', sound_Node).active = false;
                            cc.find('label_kai', sound_Node).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time3 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time3 -= step;
                            if (time3 < 0)
                                time3 = 0;
                            cc.find('mask', sound_Node).width = width * (1 - time3 / duration);
                            if (time3 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(1);
                    AudioManager.getInstance().setMusicVolume(1);
                    this.mute = false;
                }
                else {
                    AudioManager.getInstance().setSoundVolume(0);
                    AudioManager.getInstance().setMusicVolume(0);
                    this.mute = true;
                }
                break;
            case 'fangyan':
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },

    //获取player
    getPlayerById: function (id) {
        var playerInfo = DDZ_Data.Instance().playerInfo;
        if (playerInfo == null) {
            return null;
        }
        for (var i = 0; i < playerInfo.length; i++) {
            if (playerInfo[i].userId == id) {
                return playerInfo[i];
            }
        }
        return null;
    },
    getPlayerByView: function (view) {
        var playerList = DDZ_Data.Instance().playerInfo;
        if (playerList) {
            for (var i = 0; i < playerList.length; i++) {
                if (this.idToView(playerList[i].userId) == view) {
                    return playerList[i];
                }
            }
        }
        return null;
    },

    //播放音效
    playSound: function (sex, type, kind) {
        var path = '';
        var cfg = null;
        if (sex == 1) {//男
            cfg = ddz_audio_cfg.MAN;
        }
        else {
            cfg = ddz_audio_cfg.WOMAN;
        }
        switch (type) {
            case soundType.JIAOFEN:
                path = cfg.JIAOFEN[kind];
                break;
            case soundType.JIABEI:
                path = cfg.JIABEI[kind];
                break;
            case soundType.DAN:
                path = cfg.DAN[kind];
                break;
            case soundType.DUI:
                path = cfg.DUI[kind];
                break;
            case soundType.SAN:
                path = cfg.SAN[kind];
                break;
            case soundType.KILL:
                var random = Math.floor(Math.random() * 3);
                path = cfg.KILL[random];
                break;
            case soundType.PASS:
                var random = Math.floor(Math.random() * 4);
                path = cfg.PASS[random];
                break;
            case soundType.THREE_YI:
                path = cfg.THREE_YI;
                break;
            case soundType.THREE_DUI:
                path = cfg.THREE_DUI;
                break;
            case soundType.FOUR_ER:
                path = cfg.FOUR_ER;
                break;
            case soundType.FOUR_DUI:
                path = cfg.FOUR_DUI;
                break;
            case soundType.SHUNZI:
                path = cfg.SHUNZI;
                break;
            case soundType.LIANDUI:
                path = cfg.LIANDUI;
                break;
            case soundType.BOMB:
                path = cfg.BOMB;
                break;
            case soundType.ROCKET:
                path = cfg.ROCKET;
                break;
            case soundType.AIRPLANE:
                path = cfg.AIRPLANE;
                break;
            case soundType.REMAIN:
                path = cfg.REMAIN[kind];
                break;
            case soundType.CHAT:
                path = cfg.CHAT[kind];
                break;
        }
        AudioManager.getInstance().playSound(path, false);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        prefab.getChildByName('lord').active = false;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = prefab.getChildByName('hua_xiao');
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        switch (value) {
            case 0:
                prefab.getChildByName('beimian').active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 14:
            case 16:
            case 11:
            case 12:
            case 13:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        var beimian = prefab.getChildByName('beimian');
        var joker = prefab.getChildByName('joker');
        switch (value) {
            case 0:
                beimian.active = true;
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
                beimian.active = false;
                joker.active = false;
                num.active = true;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.active = true;
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                break;
            case 17:
                beimian.active = false;
                joker.active = true;
                num.active = false;
                if (flower % 2 == 0) {
                    joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r18');
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    joker.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r19');
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_da.active = true;
                break;
        }
    },

    onMingpaiBtn: function (event, data) {
        var ddz_send_msg = require('ddz_send_msg');
        ddz_send_msg.sendMingpai();
    },

    onMingpai: function (msg) {
        for (var i = 0; i < msg.rolePokerList.length; i++) {
            this.setMingpaiList(msg.rolePokerList[i].userId, msg.rolePokerList[i].pokersList);
        }
    },

    setMingpaiList: function (id, cards) {
        // if (test_version) {
        //     var view = this.idToView(id);
        //     var node = null;
        //     if (view == 1) {
        //         node = cc.find('test/right_card', this.node);
        //     }
        //     else if (view == 2) {
        //         node = cc.find('test/left_card', this.node);
        //     }
        //     else {
        //         return;
        //     }
        //     node.removeAllChildren(true);
        //     var sortcards = ddz.sortShowCards(cards);
        //     for (var i = 0; i < sortcards.length; i++) {
        //         var card = cc.instantiate(this.pokerPrefab);
        //         card.scaleX = 0.3;
        //         card.scaleY = 0.3;
        //         card.name = sortcards[i].toString();
        //         this.setPoker(card, sortcards[i]);
        //         node.addChild(card);
        //     }
        // }
    },

    subMingpaiList: function (id, cards) {
        // if (test_version) {
        //     var view = this.idToView(id);
        //     var node = null;
        //     if (view == 1) {
        //         node = cc.find('test/right_card', this.node);
        //     }
        //     else if (view == 2) {
        //         node = cc.find('test/left_card', this.node);
        //     }
        //     else {
        //         return;
        //     }
        //     for (var i = node.childrenCount - 1; i > -1; i--) {
        //         if (cards.indexOf(parseInt(node.children[i].name)) != -1) {
        //             node.children[i].removeFromParent(true);
        //         }
        //     }
        // }
    },

    addMingpaiList: function (id, cards) {
        // if (test_version) {
        //     var view = this.idToView(id);
        //     var node = null;
        //     if (view == 1) {
        //         node = cc.find('test/right_card', this.node);
        //     }
        //     else if (view == 2) {
        //         node = cc.find('test/left_card', this.node);
        //     }
        //     else {
        //         return;
        //     }
        //     var list = [];
        //     for (var i = 0; i < node.childrenCount; i++) {
        //         list.push(parseInt(node.children[i].name));
        //     }
        //     for (var i = 0; i < cards.length; i++) {
        //         list.push(cards[i]);
        //     }
        //     node.removeAllChildren(true);
        //     var sortcards = ddz.sortShowCards(list);
        //     for (var i = 0; i < sortcards.length; i++) {
        //         var card = cc.instantiate(this.pokerPrefab);
        //         card.scaleX = 0.3;
        //         card.scaleY = 0.3;
        //         card.name = sortcards[i].toString();
        //         this.setPoker(card, sortcards[i]);
        //         node.addChild(card);
        //     }
        // }
    },

    getHeadByView: function (view) {
        var node = null;
        switch (view) {
            case 0:
                node = cc.find('head_node/head_down', this.node);
                break;
            case 1:
                node = cc.find('head_node/head_right', this.node);
                break;
            case 2:
                node = cc.find('head_node/head_left', this.node);
                break;
        }
        return node;
    },

    refreshJipaiqi() {
        var counts = ddz.countRepeatCards(this.JipaiCards);
        for (var i = 3; i < 17; i++) {
            var node = cc.find('top/dipai_info/jipaiqi/bg/' + i + '_num', this.node);
            if (node) {
                node.getComponent(cc.Label).string = counts[i].toString();
            }
        }
        var jokerda = 0, jokerxiao = 0;
        for (var i = 0; i < this.JipaiCards.length; i++) {
            if (this.JipaiCards[i] == 172)
                jokerda = 1;
            if (this.JipaiCards[i] == 171)
                jokerxiao = 1;
        }
        cc.find('top/dipai_info/jipaiqi/bg/172_num', this.node).getComponent(cc.Label).string = jokerda.toString();
        cc.find('top/dipai_info/jipaiqi/bg/171_num', this.node).getComponent(cc.Label).string = jokerxiao.toString();
    },

    //显示关闭记牌器
    switchJipaiqi(event, data) {
        var node = event.target.getChildByName('bg');
        if (node.active == true) {
            node.active = false;
        }
        else {
            if (HallCommonData.getInstance().isMemoryCard(33))
                node.active = true;
            else
                cc.dd.PromptBoxUtil.show('请在游戏商城中购买记牌器道具.');
        }

    },
});
