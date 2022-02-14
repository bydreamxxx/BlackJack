// create by wj 2019/03/28
var deskData = require('teenpatti_desk').Teenpatti_Desk_Data.Instance();
var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
var playerEd = require('teenpatti_player_manager').Teenpatti_PlayerED;
var playerEvent = require('teenpatti_player_manager').Teenpatti_PlayerEvent;
var deskEd = require('teenpatti_desk').Teenpatti_Desk_Ed;
var deskEvent = require('teenpatti_desk').Teenpatti_Desk_Event;

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

var DingRobot = require('DingRobot');
const Prefix = 'gameyj_new_dsz/common/audio/';
var config = require('dsz_config');
var config_state = require('dsz_config').DSZ_UserState;
var dsz_chat_cfg = require('dsz_config').New_DSZ_Chat_Config;
var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var jlmj_prefab = require('jlmj_prefab_cfg');
var hall_prefab = require('hall_prefab_cfg');

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
const hall_prop_data = require('hall_prop_data').HallPropData;
var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;

var AppCfg = require('AppConfig');
var Platform = require('Platform');

var dsz_send_msg = require('teenpatti_send_msg');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerList: [],
        m_tChipStartNode: [],
        m_tPlayerPanel: { default: [], type: cc.Node, tooltip: '人数Panel' },
        m_tBtnPanel: { default: [], type: cc.Node, tooltip: '按钮Panel' },
        m_nIndex: 0,//发牌索引计数
        m_bContinue: false,
        chat_item: cc.Prefab,
        m_bCanTotalResult: true,
        m_oGpsNode: cc.Node,
        m_oGpsWarnNode: cc.Node,
        m_tWarnGroup: [],
        m_tIpRepeatGroup: [],
        m_tGpsRepeatGroup: [],
        m_oStartParticle: sp.Skeleton,
        m_nPrepareTime: 15,
        m_tNodeList: [],
        m_bClearChip: false,
        m_tPlayerOp: [],
        m_tReadyPlayer: [],
        m_bRoundResult: false,
        m_bCheckGps: false,
        //m_oVioceNode: cc.Node,
        bgNode: cc.Node,
        sendpokerAct: false,
        m_bReconnect: false,
        m_tChipIcon:[],
    },


    onLoad() {
        this.scaleX = this.node.width / this.node.height;
        let windowSize = cc.winSize;//推荐  原因  短
        this.bgNode.scaleX = (windowSize.width / windowSize.height) / this.scaleX;

        DingRobot.set_ding_type(4);
        playerEd.addObserver(this);
        deskEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        ChatEd.addObserver(this);
        RecordEd.addObserver(this);
        SysED.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        // if (roomMgr.gameId == 136)
        //     this.m_oVioceNode.active = false;

        this.m_nBaskChip = 0;
        //总筹码
        this.m_oTotalChipsTxt = cc.dd.Utils.seekNodeByName(this.node, "totaleBet").getComponent(cc.Label);
        //轮数
        // this.m_oDescTxt = cc.dd.Utils.seekNodeByName(this.node, "round").getComponent(cc.Label);
        //最低下注注
        this.m_oMinBet = cc.dd.Utils.seekNodeByName(this.node, "baseBet").getComponent(cc.Label);
        //最高下注
        this.m_oMaxBet = cc.dd.Utils.seekNodeByName(this.node, "maxBet").getComponent(cc.Label);
        //游戏规则
        this.m_oRuleTxt = cc.dd.Utils.seekNodeByName(this.node, "ruleDesc").getComponent(cc.Label);
        //玩家列表/筹码起始点
        var playercount = deskData.getPlayerCount();
        var index = 0;
        this.m_tPlayerPanel[0].active = true;
        this.m_tBtnPanel[0].active = true;

        for (var i = 0; i < playercount; i++) {
            this.m_tPlayerList[i] = cc.dd.Utils.seekNodeByName(this.m_tPlayerPanel[index], "player" + i);
            this.m_tPlayerList[i].active = false;

            this.m_tChipStartNode[i] = cc.dd.Utils.seekNodeByName(this.m_tPlayerPanel[index], "chipNode" + i);
        }

        //筹码区域
        if (playercount == 6)
            this.m_oChipAreaNode = cc.dd.Utils.seekNodeByName(this.node, 'chipArea');
        else
            this.m_oChipAreaNode = cc.dd.Utils.seekNodeByName(this.node, 'chipArea_9');
        //按钮区域
        this.m_oMenuNode = cc.dd.Utils.seekNodeByName(this.node, 'btnPanel');
        this.m_oMenuNode.active = false;
        this.m_oMenuNode.getComponent('new_dsz_menu').setPath(playercount == 6 ? 1 : 2);
        //准备按钮
        this.m_oPrepareBtn = cc.dd.Utils.seekNodeByName(this.node, "prepareBtn");
        this.m_oPrepareBtn.active = false;

        //开始按钮
        this.m_oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "startBtn");
        this.m_oStartBtn.active = false;

        //重新开始按钮
        this.m_oreStartBtn = cc.dd.Utils.seekNodeByName(this.node, "reStartBtn");
        this.m_oreStartBtn.active = false;

        //重新准备按钮
        this.m_orePrepareBtn = cc.dd.Utils.seekNodeByName(this.node, "rePrepareBtn");
        this.m_orePrepareBtn.active = false;

        this.m_oPrepareDesc = cc.dd.Utils.seekNodeByName(this.node, 'preparedesc');

        for(var i = 0; i < 12; i++){
            this.m_tChipIcon[i] = cc.dd.Utils.seekNodeByName(this.node, 'dsz_chouma_' + i);
            this.m_tChipIcon[i].active = false;
        }

        // cc.find('chat', this.node).getComponent(cc.Animation).on('play', function () { this.chatAni = true; }.bind(this), this);
        // cc.find('chat', this.node).getComponent(cc.Animation).on('finished', function () { this.chatAni = false; }.bind(this), this);

        this.initPlayer();//初始化玩家数据
        //this.initChat();
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        if (music)
            AudioManager.getInstance().onMusic(Prefix + 'yqp3_bgm');
    },

    onDestroy: function () {
        if (this.roundResutCall_id)
            clearTimeout(this.roundResutCall_id);
        playerEd.removeObserver(this);
        deskEd.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        ChatEd.removeObserver(this);
        RecordEd.removeObserver(this);
        SysED.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
    },

    /**
     * 返回按键
     * @param event
     */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back: {
                if (!this.__showbox) {
                    this.__showbox = true;
                    this.keyDownTextShow();
                }
            }
                break;
            default:
                break;
        }
    },

    keyDownTextShow: function () {
        if (deskData.checkGameIsFriendType()) {
            var content = "";
            var callfunc = null;
            //已经结束
            if (deskData.isEnd == true) {
                cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                    var cpt = prefab.getComponent('new_dsz_dialog_box');
                    if (cpt)
                        cpt.show(0, cc.dd.Text.TEXT_LEAVE_ROOM_3, 'text33', 'Cancel', this.sendLeaveRoom, null);
                }.bind(this));
                this.__showbox = false;
                return;
            }
            // 已经开始
            if (deskData.isStart) {
                var player = playerMgr.findPlayerByUserId(cc.dd.user.id)
                if (player) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
                    callfunc = this.reqSponsorDissolveRoom;
                } else {//旁观者离开
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.sendLeaveRoom;
                }
            } else {
                if (playerMgr.findPlayerByUserId(cc.dd.user.id) && playerMgr.findPlayerByUserId(cc.dd.user.id).isRoomer) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                    callfunc = this.sendLeaveRoom;
                } else {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.sendLeaveRoom;
                }
            }
            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                var cpt = prefab.getComponent('new_dsz_dialog_box');
                if (cpt)
                    cpt.show(0, content, 'text33', 'Cancel', callfunc, null);
            }.bind(this));
            this.__showbox = false;
        } else {
            var selfInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
            var gamedata = selfInfo.getPlayerGameInfo();
            var text = '正在游戏中，退出后系统自动操作，是否退出';
            if (gamedata && (gamedata.userState == config_state.UserStateWait || gamedata.userState == 0)) {
                text = 'quitthegame';
            } else if (!gamedata) {
                text = 'quitthegame';
            }

            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                var cpt = prefab.getComponent('new_dsz_dialog_box');
                if (cpt)
                    cpt.show(0, text, 'text33', 'Cancel', this.sendLeaveRoom, null);
            }.bind(this));
            this.__showbox = false;
        }
    },

    //初始化聊天
    initChat: function () {
        var cfg = null;
        var parent = cc.find('chat/panel/text/view/content', this.node);
        parent.removeAllChildren(true);

        if (cc.dd.user.sex == 1) {
            cfg = dsz_chat_cfg.Man;
        }
        else {
            cfg = dsz_chat_cfg.Woman;
        }
        for (var i = 0; i < cfg.length; i++) {
            var node = cc.instantiate(this.chat_item);
            node.tagname = i;
            node.getComponentInChildren(cc.Label).string = cfg[i];
            node.on('click', this.onQuickChatClick, this);
            parent.addChild(node);
        }
    },

    /*************************************************************数据操作Begin***************************************************************/
    //规则解析
    analysisRule: function () {
        var playmodel = deskData.getPlayModel() //游戏模式
        var luckyType = deskData.getLuckyType() //喜分类型
        var ruleList = deskData.getPlayRule(); //玩法

        var ruleStr = playmodel == 1 ? '标准模式/' : '大牌模式(无2-8)/';
        ruleList.forEach(function (rule) {
            switch (parseInt(rule)) {
                case 1:
                    ruleStr += '必闷三轮/'
                    break;
                case 2:
                    ruleStr += '癞子玩法/'
                    break;
                case 3:
                    ruleStr += '双倍比牌/'
                    break;
                case 4:
                    ruleStr += '亮底牌/'
                    break;
            }
        });
        switch (luckyType) {
            case 1:
                ruleStr += '闷吃喜分/'
                break;
            case 2:
                ruleStr += '都吃喜分/'
                break;
            case 3:
                ruleStr += '赢吃喜分/'
                break;
            case 4:
                break;
        }

        ruleStr += deskData.getPlayerCount() == 6 ? '六人' : '九人';
        return ruleStr;
    },
    //初始显示金币场桌子信息
    updateCoinDeskData: function () {
        //总筹码
        this.m_oTotalChipsTxt.string = 0;

        //底注
        var configData = deskData.getConfigData();
        if (configData) {
            var list = configData.anzhu.split(';');
            var base = list[0].split(',');
            this.m_nBaskChip = parseInt(base[1]);
            this.m_oMinBet.string = cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip)

            var max = list[4].split(',');
            this.m_nMaxChip = parseInt(max[1]);
            this.m_oMaxBet.string = cc.dd.Utils.getNumToWordTransform(this.m_nMaxChip)
            // this.m_oDescTxt.node.active = false;
            // this.m_oDescTxt.node.parent.getChildByName('rounddesc').active = false;
        }

        var ruleStr = '';
        //房间号
        if (deskData.checkGameIsCoinCreateType())
            ruleStr = '房间号:' + deskData.getRoomId() + '\n' + this.analysisRule();
        else
            ruleStr = this.analysisRule();

        this.m_oRuleTxt.string = ruleStr;
    },

    //桌子数据更新
    updateDeskData: function () {
        //总筹码
        if (deskData.getCurDeskState() != 1)
            this.m_oTotalChipsTxt.string = deskData.getCurBet();
        else
            this.m_oTotalChipsTxt.string = 0;
        //底注
        var configData = deskData.getConfigData();
        if (configData) {
            var list = configData.anzhu.split(';');
            var base = list[0].split(',');
            this.m_nBaskChip = parseInt(base[1]);
            this.m_oMinBet.string = cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip)

            var max = list[4].split(',');
            this.m_nMaxChip = parseInt(max[1]);
            this.m_oMaxBet.string = cc.dd.Utils.getNumToWordTransform(this.m_nMaxChip)

            // this.m_oDescTxt.node.active = true;
            // this.m_oDescTxt.node.parent.getChildByName('rounddesc').active = true;
            // if (!deskData.checkGameIsFriendType())
            //     this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount(); //底注
            // else {
            //     if (deskData.getCurDeskState() != 1)
            //         this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount() + '  局数:' + deskData.getCurRound() + '/' + deskData.getTotalRoundCount(); //轮数
            //     else
            //         this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + '0/' + deskData.getTotalCircleCount() + '  局数:' + deskData.getCurRound() + '/' + deskData.getTotalRoundCount(); //轮数
            // }
        }
        var ruleStr = '';
        //房间号
        if (deskData.checkGameIsFriendType() || deskData.checkGameIsCoinCreateType())
            ruleStr = '房间号:' + deskData.getRoomId() + '\n' + this.analysisRule();
        else
            ruleStr = this.analysisRule();

        this.m_oRuleTxt.string = ruleStr;
    },

    //初始玩家数据
    initPlayer: function () {
        var self = this;
        if (playerMgr.playerInfo) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player){
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data.seat != -1)
                        self.playerEnter(player.userId);
                }
            });
            if (deskData.checkGameIsFriendType())
                this.updateDeskData();
            else
                this.updateCoinDeskData();
            // this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').initChip();
        }

        //this.refreshGPSWarn();
    },

    //实例化朋友场玩家数据
    initPlayerFData: function (userId) {
        // deskData.isFristEnter = false;
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            var player_game_data = player.getPlayerGameInfo(); //游戏数据
            var player_common_data = player.getPlayerCommonInfo(); //通用数据
            var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');

            if (deskData.getCurDeskState() != 1) {//游戏已经开始
                if (player_game_data.userState != config_state.UserStateWait) {//玩家不是旁观
                    cpt.initData(player_game_data);//玩家游戏数据
                    cpt.showPoker();
                    if (!this.sendpokerAct)
                        this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
                    else
                        this.freshPlayerCostChipInfo(player, this.m_nBaskChip, false); //玩家下注数据
                    if (player.userId == cc.dd.user.id) {
                        this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
                        this.showCurOperateBtns();
                    }
                } else {
                    cpt.setPlayerPokerState(4);//旁观标记
                }
            } else {//游戏未开始
                if (player_game_data.userState != config_state.UserStatePrepare) {//朋友场玩家未准备
                    if (userId == cc.dd.user.id) {
                        if (player.isRoomer) {//玩家是房主
                            this.m_oreStartBtn.getComponent(cc.Button).interactable = false;
                            this.m_oreStartBtn.active = true;
                            this.m_oStartBtn.active = false;
                        } else {//玩家不是房主
                            this.m_orePrepareBtn.active = true;
                        }
                    }
                    cpt.setPlayerReady(false);
                } else {
                    cpt.setPlayerReady(true);
                }
            }
        }

    },

    //实例化玩家数据
    initPlayerGameData: function (userId) {
        if (!this.m_bInitChip) {
            this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').initChip();
            this.updateDeskData();
        }
        //this.updateDeskCircle(false);
        this.sendpokerAct = false;
        this.m_bInitChip = true;
        if (deskData.getCurDeskState() != 1)
            deskData.isStart = true;
        this.hideEmptySeat();

        if (userId == cc.dd.user.id) {
            // if (deskData.getGameId() == 36 && deskData.getCurRound() < 3) {//朋友场前2局检测
            //     this.sendLocationInfo();
            // } else if (playerMgr.checkPlayerChanged()) { //有人员变动
            //     if (deskData.getGameId() != 136) {
            //         this.sendLocationInfo();
            //     }
            // }
            this.m_oStartBtn.active = false;
            this.m_oPrepareBtn.active = false;
            this.m_oreStartBtn.active = false;
            this.m_orePrepareBtn.active = false;
        }
        // if (!deskData.checkGameIsFriendType()) {
        //     this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount(); //底注
        // } else {
        //     if (deskData.getCurDeskState() != 1)
        //         this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount() + '  局数:' + deskData.getCurRound() + '/' + deskData.getTotalRoundCount(); //轮数
        //     else
        //         this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + '0/' + deskData.getTotalCircleCount() + '  局数:' + deskData.getCurRound() + '/' + deskData.getTotalRoundCount(); //轮数
        // }
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            var player_game_data = player.getPlayerGameInfo(); //游戏数据
            var player_common_data = player.getPlayerCommonInfo(); //通用数据
            var readyNode = cc.dd.Utils.seekNodeByName(this.m_tPlayerList[player_common_data.pos], 'readyBg');//准备标记
            readyNode.active = false;

            //如果为断线重连
            if (deskData.getIsReconnectTag()) {
                var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');
                //cpt.setPlayerState(false);
                this.m_bContinue = true;
                if (deskData.checkGameIsFriendType()) {//朋友场
                    this.initFPlayerReconnectData(userId);
                } else {
                    if (player_game_data.userState != config_state.UserStateWait) {
                        cpt.initData(player_game_data);//玩家游戏数据
                        cpt.showPoker();
                        this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
                        if (player.userId == cc.dd.user.id && userId == deskData.getCurOpUser())
                            this.showCurOperateBtns();
                    } else {
                        cpt.setPlayerPokerState(4);
                    }
                }
            } else {//非断线重连
                if (deskData.getCurDeskState() == 1) {
                    if (deskData.checkGameIsFriendType()) {//朋友场
                        //重置桌面显示
                        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();
                        playerMgr.playerInfo.forEach(function (player) {
                            if (player) {
                                var player_common_data = player.getPlayerCommonInfo();
                                if (player_common_data)
                                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').resetPlayerUI(); //重置界面
                            }
                        }.bind(this));
                        this.initPlayerFData(userId);
                    }
                } else {
                    if (userId == cc.dd.user.id) {//玩家自己
                        var ownInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
                        if (ownInfo && ownInfo.getPlayerGameInfo().userState == config_state.UserStateWait) {//自己本身为观众
                            var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');
                            cpt.setPlayerPokerState(4);
                            return;
                        }
                    }
                    if (player_game_data.userState != config_state.UserStateWait && player_game_data.userState != 0) { //游戏中
                        var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');
                        cpt.initData(player_game_data);
                        var ownInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
                        if (ownInfo && ownInfo.getPlayerGameInfo().userState == config_state.UserStateWait) {//自己本身为观众
                            cpt.showPoker();
                            this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //默认玩家下注
                            this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
                        }//else{
                        //     this.freshPlayerCostChipInfo(player, this.m_nBaskChip, true); //默认玩家下注
                        // }

                    } else if (player_game_data.userState == config_state.UserStateWait) { //旁观
                        var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');
                        cpt.setPlayerPokerState(4);
                    }
                }
            }
        }
    },

    //显示当前按钮
    showCurOperateBtns: function () {
        this.cancelCmpSelect();
        this.m_oMenuNode.active = true;

        if (cc.dd.user.id == deskData.getCurOpUser()) {//下一个操作玩家是自己
            var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
            if (player) {
                var commonData = player.getPlayerCommonInfo();
                if (!commonData.autoFlag)
                    this.m_oMenuNode.getComponent('new_dsz_menu').analysisPlayerOpBtn();
                else
                    this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
            }
        } else {
            var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
            if (player) {
                var ownData = player.getPlayerGameInfo();
                var commonData = player.getPlayerCommonInfo();
                if (ownData && ownData.userState != config_state.UserStateFold && ownData.userState != config_state.UserStateLost && ownData.userState != config_state.UserStateWait && !commonData.autoFlag) {
                    this.m_oMenuNode.getComponent('new_dsz_menu').enabelAllBtn(false);
                }
                else
                    this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
            } else
                this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
        }
    },

    //更新玩家下注数据/玩家身上筹码
    freshPlayerCostChipInfo: function (player, bet, isAct) {
        var pos = player.getPlayerCommonInfo().pos; //获取位置点
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').bet(pos, bet, isAct); //下注筹码动画
        cc.log("pos=====" + pos)
        this.m_tPlayerList[pos].getComponent('new_dsz_player_ui').freshPlayerChip();//玩家更新筹码数据/玩家身上筹码
    },

    //更新桌子总的下注
    freshDeskTotalChip: function (bet) {
        deskData.updateCurBet(bet); //更新当前桌子总压注
        this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
    },

    //更换下一个操作玩家
    changeActivePlayer: function (userid, nextuserid) {
        this.activePlayer(userid, false); //当前玩家取消状态
        this.activePlayer(nextuserid, true); //下个操作玩家上状态
    },

    //玩家操作倒计时
    activePlayer: function (userid, state) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                if (player.userId == cc.dd.user.id) {
                    if (!player_common_data.autoFlag)
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc();
                    else
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPlayerIsAuto(player_common_data.autoFlag, true);
                }


                if (deskData.getFoldTime() == 0)
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerState(state, false); //玩家操作状态
                else {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerState(state, true); //玩家操作状态
                }
            }
        }
    },

    //更新桌子轮数
    updateDeskCircle: function (isUpdate) {
        //轮数
        // if (!deskData.checkGameIsFriendType())
        //     this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount(); //底注
        // //this.m_oDescTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount(); //轮数
        // else
        //     this.m_oBaseBet.string = '底注：' + cc.dd.Utils.getNumToWordTransform(this.m_nBaskChip) + '  轮数：' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount() + '  局数:' + deskData.getCurRound() + '/' + deskData.getTotalRoundCount(); //轮数
        //this.m_oDescTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount() + '    局数:' + deskData.getCurRound() + '/' + deskData.getTotalRoundCount(); //轮数
        var iconCount = deskData.getCurCircle() * 3;
        iconCount = iconCount > 12 ? 12 : iconCount;
        for(var i = 0 ; i < iconCount; i++)
            this.m_tChipIcon[i].active = true;
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                if (player.userId == cc.dd.user.id) {
                    if (!player_common_data.autoFlag)
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc();
                    else
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPlayerIsAuto(player_common_data.autoFlag, true);
                } else
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc(); //刷新看牌描述
            }
        }

        if (isUpdate) {
            this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
            this.showCurOperateBtns();
        }
    },

    //更新玩家身上金币
    updatePlayerCoin: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').freshPlayerChip(); //更新玩家筹码最新信息
        }
        deskData.isRecharge = false;
    },

    //玩家托管状态切换
    changePlayerAutoState: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            var player_game_data = player.getPlayerGameInfo();
            this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPlayerIsAuto(player_common_data.autoFlag, userId == cc.dd.user.id); //更新玩家筹码最新信息
            if (player_game_data && userId == cc.dd.user.id && player_game_data.userState != 0 && !this.m_bRoundResult && !player_common_data.autoFlag) {
                this.showCurOperateBtns();
                if (cc.dd.user.id == deskData.getCurOpUser()) {//下一个操作玩家是自己
                    this.m_oMenuNode.getComponent('new_dsz_menu').analysisPlayerOpBtn();
                }
                this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc();
            }
        }
    },

    /*************************************************************数据操作End***************************************************************/

    /**************************************************************玩家操作begin***********************************************************/
    //检索是否有空位进行邀请
    checkEmptySeat: function () {
        var playercount = deskData.getPlayerCount();
        for (var i = 1; i < playercount; i++) {
            var player = playerMgr.findPlayerByUserPos(i);
            if (!player) {
                this.m_tPlayerList[i].getComponent('new_dsz_player_ui').clearUI();
                this.m_tPlayerList[i].active = true;
                //this.m_tPlayerList[i].getChildByName('invitePlayer').active = true;
                return;
            } else {
                //this.m_tPlayerList[i].getChildByName('invitePlayer').active = false;
            }
        }
    },

    //隐藏所有邀请按钮
    hideEmptySeat: function () {
        // var playercount = deskData.getPlayerCount();
        // for (var i = 1; i < playercount; i++) {
        //     this.m_tPlayerList[i].getChildByName('invitePlayer').active = false;
        // }
    },

    //朋友场玩家按钮切换
    playerFBtnState: function (player) {
        this.m_oPrepareDesc.active = false;
        var commonData = player.getPlayerCommonInfo(); //获取玩家通用数据
        if (player.isRoomer)
            this.playerReady_Rsp(player.userId, true); //房主默认准备
        else
            this.playerReady_Rsp(player.userId, commonData.isReady);
        if (player.userId == cc.dd.user.id) {//加入房间的为玩家自己
            if (player.isRoomer && !deskData.getIsReconnectTag()) {//玩家为房主
                var canOpen = playerMgr.checkPlayerAllReady(); //所有玩家都准备
                if (canOpen && playerMgr.getRealPlayerCount() > 1)//所有玩家都准备，且玩家人数超过2人
                    this.m_oStartBtn.getComponent(cc.Button).interactable = true;
                else
                    this.m_oStartBtn.getComponent(cc.Button).interactable = false;
                this.m_oStartBtn.active = true;
                this.m_oPrepareBtn.active = false;
            } else if (player.isRoomer && deskData.getIsReconnectTag()) {
                var canOpen = playerMgr.checkPlayerAllGameReady();
                if (canOpen && playerMgr.getRealPlayerCount() > 1) {
                    this.m_oreStartBtn.getComponent(cc.Button).interactable = true;
                    cc.log('m_oreStartBtn =============== playerFBtnState')
                }
                this.m_oreStartBtn.active = true;
            } else {
                if (!commonData.isReady) { //玩家未准备
                    this.m_oPrepareBtn.active = true;
                    this.m_oStartBtn.active = false;
                }
            }
        } else {//其他玩家加入
            var own = playerMgr.findPlayerByUserId(cc.dd.user.id)
            if (own) {
                var ownCommonData = own.getPlayerCommonInfo();
                if (ownCommonData && own.isRoomer && !deskData.getIsReconnectTag() && !deskData.isStart) {
                    var canOpen = playerMgr.checkPlayerAllReady(); //所有玩家都准备
                    if (canOpen && playerMgr.getRealPlayerCount() >= 1)//所有玩家都准备，且玩家人数超过2人
                        this.m_oStartBtn.getComponent(cc.Button).interactable = true;
                    else
                        this.m_oStartBtn.getComponent(cc.Button).interactable = false;
                    this.m_oStartBtn.active = true;
                    this.m_oPrepareBtn.active = false;
                }
            } else if (ownCommonData && own.isRoomer && deskData.getIsReconnectTag() && !deskData.isStart) {
                var canOpen = playerMgr.checkPlayerAllGameReady();
                if (canOpen) {
                    this.m_oreStartBtn.getComponent(cc.Button).interactable = true;
                    cc.log('m_oreStartBtn =============== playerFBtnState')
                }
                this.m_oreStartBtn.active = true;
            }
        }
    },

    //自建房玩家按钮切换
    playerCoinCreateBtnState: function (player) {
        this.m_oPrepareDesc.active = false;
        var commonData = player.getPlayerCommonInfo(); //获取玩家通用数据
        if (player.isRoomer && player.userId == cc.dd.user.id) {
            this.playerReady_Rsp(player.userId, commonData.isReady); //房主默认准备
            if (!commonData.isReady)
                this.m_oPrepareBtn.active = true;
        } else {
            this.playerReady_Rsp(player.userId, commonData.isReady);
            if (player.userId == cc.dd.user.id) {//加入房间的为玩家自己
                if (!commonData.isReady) { //玩家未准备
                    this.m_oPrepareBtn.active = true;
                    this.m_oStartBtn.active = false;
                }
            }
        }
    },

    //玩家进入/断线重连均使用这个
    playerEnter: function (userId) {
        this.m_bClearChip = false;
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            if (userId == cc.dd.user.id) {
                var UI = cc.dd.UIMgr.getUI('gameyj_new_dsz/common/prefab/new_dsz_compare');
                if (UI) {
                    UI.getComponent('new_dsz_compare_ui').onClose();
                }
            }
            var commonData = player.getPlayerCommonInfo(); //房间管理器玩家通用数据
            var pos = commonData.pos; //客户端转化座位号

            var playerNode = this.m_tPlayerList[pos];//座位节点
            playerNode.active = true;

            var headBg = cc.dd.Utils.seekNodeByName(playerNode, 'headBg')
            headBg.active = true; //玩家头像显示
            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headNode'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'new_dsz_head_init');
            headNode.getChildByName('head').active = true;

            cc.dd.Utils.seekNodeByName(playerNode, 'name').getComponent(cc.Label).string = cc.dd.Utils.substr(commonData.name, 0, 7); //玩家名字
            var coin = deskData.checkGameIsFriendType() ? 0 : commonData.coin; //朋友场默认为0， 金币场默认为玩家身上金币
            cc.dd.Utils.seekNodeByName(playerNode, 'coin').getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin); //玩家进入金币
            playerNode.getComponent('new_dsz_player_ui').showPlayerIsAuto(commonData.autoFlag, cc.dd.user.id == userId);

            if (deskData.checkGameIsFriendType()) { //朋友场，进行按钮操作切换
                this.playerFBtnState(player);
                if (!deskData.isStart) {
                    this.hideEmptySeat();
                    this.checkEmptySeat();
                }
            } else if (deskData.checkGameIsCoinCreateType()) {//自建金币场
                this.playerCoinCreateBtnState(player);
                if (!deskData.isStart) {
                    this.hideEmptySeat();
                    this.checkEmptySeat();
                }
            } else {//金币场默认玩家均为已准备
                this.playerReady_Rsp(userId, true);
                this.m_oPrepareDesc.active = false;
            }
        }
    },
    //玩家准备
    playerReady_Rsp: function (userId, isReady) {
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            var commonData = player.getPlayerCommonInfo(); //获取通用数据
            commonData.isReady = isReady;
            var pos = commonData.pos; //玩家座位；
            this.m_tPlayerList[pos].getComponent('new_dsz_player_ui').setPlayerReady(isReady);
            if (isReady && userId == cc.dd.user.id) {
                this.m_oPrepareBtn.active = false;
                this.m_orePrepareBtn.active = false;
                this.m_oPrepareDesc.active = false;
                if (this.m_oPrepareTimeOut)
                    clearTimeout(this.m_oPrepareTimeOut);
            }
        }
    },

    //跟注/加注操作
    playerAddChip_Rsp: function (userId, playAudio) {
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            var player_game_data = player.getPlayerGameInfo(); //游戏数据
            if (player_game_data) {
                if (playAudio) { //如果需要播放跟注/加注音效
                    this.synOtherPlayerOperate(userId, player_game_data.userState);
                    var index = this.m_tPlayerOp.shift();
                    cc.log('===========1==' + index);
                    if (this.m_bNeedOpRoundCallBack)
                        this.roundResut_Rsp(this.m_oRoundData);
                }
                AudioManager.getInstance().playSound(Prefix + 'yqp3_genzhu', false); //抛筹码音效
                this.freshPlayerCostChipInfo(player, player_game_data.lastBet, true); //更新玩家筹码显示
                this.freshDeskTotalChip(parseInt(player_game_data.lastBet)); //更新桌子筹码显示
            }
            if (playAudio) {
                this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
                this.showCurOperateBtns();
            }

        }
    },

    //所有玩家准备完成  仅针对于房主本人操作(朋友场)
    playerAllReady_Rsp: function () {
        if (!this.m_bContinue) {//判定是否为非第一局
            this.m_oStartBtn.active = true;
            this.m_oStartBtn.getComponent(cc.Button).interactable = true;
            this.m_oreStartBtn.active = false;
        } else {
            cc.log('m_oreStartBtn =============== playerAllReady_Rsp')
            this.m_oreStartBtn.active = true;
            this.m_oreStartBtn.getComponent(cc.Button).interactable = true;
            this.m_oStartBtn.active = false;
        }
    },

    //玩家弃牌
    playerFold_Rsp: function (userId) {
        this.cancelCmpSelect();
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateFold); //解析弃牌操作
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').fold(); //玩家弃牌
            }
            player.updatePlayerPokerState(3); //状态设置有问题-----
        }
        if (userId == deskData.getLastOpUser()) {
            this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
            this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
        }
        if (deskData.getLastOpUser() != cc.dd.user.id)
            this.showCurOperateBtns(); //显示按钮
        var index = this.m_tPlayerOp.shift();
        cc.log('===========3==' + index);

        if (this.m_bNeedOpRoundCallBack)
            this.roundResut_Rsp(this.m_oRoundData);
    },

    //玩家看牌
    playerWatch_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateWacth); //解析看牌操作
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                if (userId == cc.dd.user.id) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').watch(); //玩家看牌
                    if (deskData.getCurOpUser() == cc.dd.user.id)
                        this.m_oMenuNode.getComponent('new_dsz_menu').analysisPlayerOpBtn();//更新按钮显示
                } else
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerPokerState(2); //玩家已经看牌
            }
            this.showCurOperateBtns();
            var index = this.m_tPlayerOp.shift();
            cc.log('===========4==' + index);
            if (this.m_bNeedOpRoundCallBack)
                this.roundResut_Rsp(this.m_oRoundData);
        }
    },

    //玩家操作show牌
    playerShow_Rsp: function(data){
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerPokerState(6); //玩家show牌
            }
            var index = this.m_tPlayerOp.shift();
            cc.log('===========6==' + index);
            if (this.m_bNeedOpRoundCallBack)
                this.roundResut_Rsp(this.m_oRoundData);
        }
    },



    //玩家比牌请求发送
    playerCmp_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId) //获取请求比牌的玩家
        if(player){
            dd.DialogBoxUtil.show(1, 'Cmpdesc', 'Agree', 'Disagree',
            function () {
                dsz_send_msg.sendCmpAgree(0)
            }.bind(this),
            function () {
                dsz_send_msg.sendCmpAgree(1)
            }.bind(this));
        }
    },

    //玩家比牌结果
    playerCmpResult_Rsp: function (userId, cmpUserId, WinnerId) {
        cc._pauseLMAni = true;
        this.m_bIsCompare = true;
        this.playerAddChip_Rsp(userId, false);//比牌需要下注
        this.synOtherPlayerOperate(userId, config_state.UserStateCmp);

        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                }
            }
        }.bind(this))

        var self = this;
        var callBack = function () {
            if (self.m_bChangeDesk) {
                self.m_bChangeDesk = null;
                self.m_bRoundResult = false;
                deskData.isRecharge = false;
                cc._pauseLMAni = false;
                self.roundResutCall_id = 0
                self.m_bNeedDelay = false;
                deskData.roundResult = false;
                self.m_bContinue = false
                self.sendpokerAct = false;
                self.m_bReconnect = false;
                return;
            }
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        if ((userId == player.userId && userId != WinnerId) || (cmpUserId == player.userId && cmpUserId != WinnerId))
                            self.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerPokerState(1); //玩家比牌输
                    }
                }
            });
            self.m_bIsCompare = false;
            if (self.m_bNeedRoundCallBack) {
                cc.log('============camp_end=========')
                self.roundResut_Rsp(self.m_oRoundData);
            } else {
                cc.log('============camp_end1111=========')
                self.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
                self.showCurOperateBtns();
            }
        }

        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_compare', function (ui) {
            AudioManager.getInstance().playSound(Prefix + 'yqp3_bipai', false); //比牌音效

            var cpt = ui.getComponent('new_dsz_compare_ui');
            cpt.playerCompareAct(userId, cmpUserId, WinnerId, callBack);

        }.bind(this));
    },

    //取消比牌选择
    cancelCmpSelect: function () {
        if (this.m_bIsSelectCmp) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                    }
                }
            }.bind(this))
            this.m_bIsSelectCmp = false;
        }
    },

    //发牌动画
    sendPoker: function (playercount) {
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();
        var playerList = [];
        playerMgr.playerInfo.forEach(function (player, index) {
            if (player) {
                if (player.getPlayerGameInfo().userState != config_state.UserStateWait) { //玩家不是旁观状态
                    var commonData = player.getPlayerCommonInfo();
                    var cpt = this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui');
                    if (cpt) {
                        cpt.sendPoker(commonData.pos); //发牌
                        if (player.userId == cc.dd.user.id) {
                            if (!commonData.autoFlag)
                                this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc();
                            else
                                this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui').showPlayerIsAuto(commonData.autoFlag, true);
                        } else
                            cpt.showWatchPokerDesc();
                        AudioManager.getInstance().playSound(Prefix + 'yqp3_fapai', false);
                    }
                }
                playerList.push(player.userId);
            }
        }.bind(this));
        playerMgr.setLastRoundPlayer(playerList);

        var self = this;
        self.sendpokerTime = setTimeout(function () {
            if (self.sendpokerTime)
                clearTimeout(self.sendpokerTime);
            self.node.stopAllActions();
            self.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    // if (!deskData.getIsReconnectTag())
                    //     self.betBaseBet();
                    //总筹码
                self.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
                self.showCurOperateBtns();
            })))
        }.bind(this), 500);

    },

    //下底注
    betBaseBet: function () {
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_game_data = player.getPlayerGameInfo();
                if (player_game_data && player_game_data.userState != config_state.UserStateWait)
                    this.freshPlayerCostChipInfo(player, this.m_nBaskChip, true); //默认玩家下注
            }
        }.bind(this))
        
        var self = this;
        self.m_oStartParticle.node.active = true;
        self.m_oStartParticle.setAnimation(0, 'kaishi', false);
        self.m_oStartParticle.setCompleteListener(function () {
            self.m_oStartParticle.node.active = false;
            var playercount = playerMgr.getRealPlayerCount();
            self.sendPoker(playercount);

            //总筹码
            self.m_oTotalChipsTxt.string = deskData.getCurBet();
            self.m_oStartParticle.setCompleteListener(null);
        });
        AudioManager.getInstance().playSound(Prefix + 'yqp3_kaishi', false);
    },

    //单局结算
    roundResut_Rsp: function (data) {
        cc.log('================round_result')
        this.m_bContinue = true;
        this.m_bReconnect = false;
        cc._pauseLMAni = true;
        this.m_bCanTotalResult = false;
        this.m_oRoundData = data;
        this.m_bRoundResult = true;
        deskData.roundResult = true;

        this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
        if (deskData.getCurCircle() >= deskData.getTotalCircleCount() && !this.allCompare) {
            this.allCompare = true;
        }
        var self = this;

        if (this.m_bIsCompare) {
            cc.log('compare=======')
            this.m_bNeedRoundCallBack = true;
            this.m_oRoundData = data;
            // self.roundResut_id = setTimeout(function() {
            //     self.roundResut_Rsp(data);
            // }, 2500);
            this.m_bIsCompare = false;
            this.m_bChangeDesk = false;
            //this.m_bNeedDelay = false;
        } else if (this.m_tPlayerOp.length > 0) {
            cc.log('op=======')

            this.m_bNeedOpRoundCallBack = true;
            this.m_oRoundData = data;
        } else {
            this.m_bNeedRoundCallBack = false;
            this.m_bNeedOpRoundCallBack = false;
            this.m_oRoundData = null;

            this.allCompare = false;
            this.m_bPlayAct = false;
            if (this.m_bChangeDesk)
                return;
            cc.log('op=======111111111')
            data.forEach(function (info) {
                var player = playerMgr.findPlayerByUserId(info.userId);
                if (player) {
                    if (player.userId == cc.dd.user.id) {
                        if (info.isWin)
                            cc.dd.PromptBoxUtil.show('胜利');
                        else
                            cc.dd.PromptBoxUtil.show('失败');
                    }
                    var player_common_data = player.getPlayerCommonInfo();
                    if (info.score < 0)
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setResult(info.score, info.luckyScore); //设置单人的结算
                    else
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setResult(info.score - player.getPlayerGameInfo().betScore, info.luckyScore); //设置单人的结算

                    var player_game_data = player.getPlayerGameInfo();
                    if (deskData.getWatchAll() && deskData.getGameId() == 36) //如果亮底牌
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPokerFace(); //开牌
                    else
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPokerFace(); //开牌
                    if (player_game_data.pokers != null && player_game_data.pokers.pokersList.length != 0)
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').playWatchPokerAnim(cc.dd.user.id == player.userId);
                    if (info.isWin) {
                        AudioManager.getInstance().playSound(Prefix + 'yqp3_ReceiveCoin', false); //抛筹码音效
                        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').result(player_common_data.pos); //收筹码的动画
                        player.getPlayerGameInfo().curScore += info.score;
                    }
                    if (deskData.getGameId() == 136) {
                        cc.log('cur_socre111 + ' + player.getPlayerGameInfo().curScore);
                        player.getPlayerGameInfo().curScore -= info.severPay;
                        cc.log('cur_socre + ' + player.getPlayerGameInfo().curScore);
                        if (player.getPlayerGameInfo().curScore <= 0)
                            player.getPlayerGameInfo().curScore = 0;
                    }
                    if (info.luckyScore)//喜分
                        player.getPlayerGameInfo().curScore += info.luckyScore;
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').freshPlayerChip();//刷新玩家身上筹码值

                }
            }.bind(this));
            this.m_bClearUI = false;
            var time = 3000;
            if (!this.m_bNeedDelay) {
                time = 3000;
                this.m_bNeedDelay = true;
            }

            self.roundResutCall_id = setTimeout(function () {
                if (!deskData.checkGameIsFriendType()) {//如果为金币场
                    self.checkPlayerCoin(); //检查玩家金币是否足够
                    self.resetCoinDeskData(); //清理金币场桌子
                } else {
                    self.resetFDeskData(); //清理朋友场桌子
                    self.m_bCanTotalResult = true;
                }


                self.m_tReadyPlayer.forEach(function (userId, index) {
                    if (userId) {
                        self.playerReady_Rsp(userId, true);
                    }
                });
                if (self.m_tReadyPlayer.length != 0 && deskData.checkGameIsFriendType()) {
                    var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (own && own.isRoomer && data != own.userId) {//检查玩家是否为房主
                        var canOpen = playerMgr.checkPlayerAllReady();
                        cc.log('canopen==============+++' + canOpen)
                        if (canOpen)
                            self.playerAllReady_Rsp(); //所有玩家准备好，开始按钮显示
                    }
                }

                self.m_tReadyPlayer.splice(0, self.m_tPlayerList.length);
                self.m_bRoundResult = false;
                deskData.isRecharge = false;
                cc._pauseLMAni = false;
                clearTimeout(self.roundResutCall_id);
                self.roundResutCall_id = 0
                self.m_bNeedDelay = false;
                deskData.roundResult = false;
            }, time);
        }
    },

    /**
 * 战绩统计
 * @param {*} msg 
 */
    showResultTotal_Rsp(msg) {
        var self = this;
        if (!self.m_bCanTotalResult) {
            this.node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(function () {
                self.showResultTotal_Rsp(msg);
            })));
            return;
        }
        deskData.isEnd = true;
        deskData.isStart = false;
        var generateTimeStr = function (date) {
            var pad2 = function (n) { return n < 10 ? '0' + n : n };
            return date.getFullYear().toString() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + '  ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
        };

        var zjNode = cc.find('zhanjitongji', this.node);
        zjNode.zIndex = 400;
        zjNode.active = true;

        var roomId = deskData.getRoomId();
        var totalRound = deskData.getTotalRoundCount();
        var strTime = generateTimeStr(new Date(msg.time * 1000));
        cc.find('time/room_number', zjNode).getComponent(cc.Label).string = roomId.toString();
        cc.find('time/total_round', zjNode).getComponent(cc.Label).string = '共' + totalRound.toString() + '局';
        cc.find('time/time_lbl', zjNode).getComponent(cc.Label).string = strTime;
        var multiple = cc.find('multiple', zjNode);

        if (roomMgr.isClubRoom()) {
            multiple.active = false;
            // multiple.getComponentInChildren(cc.Label).string = roomMgr.multiple+'倍场';
        } else {
            multiple.active = false;
        }

        var playList = msg.scoreResultList;
        var bigWinScore = 0;
        var selfIdx = -1;
        for (var i = 0; i < playList.length; i++) {
            if (playList[i].isWin) {
                bigWinScore = playList[i].score;
            }
            if (playList[i].userId == cc.dd.user.id) {
                selfIdx = i;
            }
        }
        var layout_node = cc.dd.Utils.seekNodeByName(zjNode, 'player_layout');
        layout_node.removeAllChildren();
        var setData = function (data) {
            if (data.userId == cc.dd.user.id) {
                var newNode = cc.find('userNode_self', zjNode);
            }
            else {
                var newNode = cc.find('userNode_other', zjNode);
            }
            var pNode = cc.instantiate(newNode);
            var player = playerMgr.findPlayerByUserId(data.userId).getPlayerCommonInfo();
            var nick = cc.dd.Utils.substr(player.name, 0, 4);
            var headUrl = player.headUrl;
            var headsp = cc.find('headNode/head', pNode).getComponent(cc.Sprite);
            var score = data.score;

            if (headUrl && headUrl != '') {
                cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
            }
            //}
            cc.find('layout/userName', pNode).getComponent(cc.Label).string = nick;
            cc.find('layout/fangzhu', pNode).active = player.isRoomer;
            cc.find('ID', pNode).getComponent(cc.Label).string = data.userId.toString();

            if (score > -1) {
                cc.find('mark', pNode).color = cc.color(192, 0, 0);
                cc.find('mark', pNode).getComponent(cc.Label).string = '+' + score.toString();
            }
            else {
                cc.find('mark', pNode).color = cc.color(0, 192, 0);
                cc.find('mark', pNode).getComponent(cc.Label).string = score.toString();
            }
            if (bigWinScore > 0 && score == bigWinScore) {
                cc.find('dayingjia', pNode).active = true;
            }
            pNode.active = true;
            layout_node.addChild(pNode);
        }.bind(this);
        if (selfIdx != -1)
            setData(playList[selfIdx]);
        for (var i = 0; i < playList.length; i++) {
            if (i != selfIdx) {
                setData(playList[i]);
            }
        }
    },

    //玩家离开操作
    playerLeave_Rsp: function (data) {
        if (data.userId == cc.dd.user.id) {
            deskData.isEnd = true;
            deskData.isStart = false;
            this.sendpokerAct = false;
            //deskData.isFristEnter = true
            this.backToHall();
        } else if (data.seat == -1) {
            this.m_tPlayerOp.shift();
            if (this.m_bNeedOpRoundCallBack)
                this.roundResut_Rsp(this.m_oRoundData);
            return;
        } else {
            var player = playerMgr.findPlayerByUserId(data.userId)
            if (player && player.isRoomer && deskData.getGameId() == 36) {//房主解散房间
                this.clear();
                cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                    var cpt = prefab.getComponent('new_dsz_dialog_box');
                    if (cpt)
                        cpt.show(0, "房主已解散房间,请重新加入房间", 'text33', null, function () {
                            cc.dd.SceneManager.enterHall();
                        }, function () {
                        });
                });
            } else {//玩家离开房间
                //var viewPlayer = playerMgr.findViewerByUserId(data.userId);
                this.m_tPlayerList[data.pos].active = false;
                this.m_tPlayerList[data.pos].getComponent('new_dsz_player_ui').clearUI();
                this.m_oStartBtn.getComponent(cc.Button).interactable = false;

                if (!deskData.isStart && deskData.getGameId() == 36) {
                    var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (own && own.isRoomer && data.userId != own.userId) {//检查玩家是否为房主
                        var canOpen = playerMgr.checkPlayerAllReady();
                        if (canOpen && playerMgr.getRealPlayerCount() > 1)
                            this.playerAllReady_Rsp(); //所有玩家准备好，开始按钮显示
                    }
                }
            }
        }
        this.m_tPlayerOp.shift();
        if (this.m_bNeedOpRoundCallBack)
            this.roundResut_Rsp(this.m_oRoundData);
    },

    //清理朋友场桌子
    resetFDeskData: function () {
        deskData.resetDeskData();
        playerMgr.resetAllPlayerData();

        this.updateDeskData();
        var self = this;
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    self.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerReady(false); //全部未准备
                    if (player.userId == cc.dd.user.id) {
                        if (player.isRoomer) {//玩家是房主
                            self.m_oreStartBtn.getComponent(cc.Button).interactable = false;
                            self.m_oreStartBtn.active = true;
                        } else {//玩家不是房主
                            if (player_common_data.autoFlag == false)
                                self.m_orePrepareBtn.active = true;
                        }
                    }
                }
            }
        }.bind(this));
        if (deskData.getCanMidwayAdd() && deskData.checkGameIsFriendType()) {
            this.hideEmptySeat();
            this.checkEmptySeat();
        }
    },

    //清理金币场桌子
    resetCoinDeskData: function () {
        deskData.resetDeskData();
        playerMgr.resetAllPlayerData();

        this.updateCoinDeskData();
        var self = this;
        this.m_nPrepareTime = 15;
        self.m_oPrepareDesc.getComponent(cc.Label).string = '请在' + self.m_nPrepareTime + '秒内准备';
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    self.m_bContinue = true;
                    //self.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').resetPlayerUI(); //重置界面
                    if (player.userId == cc.dd.user.id) {
                        self.m_oPrepareDesc.active = false;
                        var setPrepareDescTime = function () {
                            if (self.m_oPrepareTimeOut)
                                clearTimeout(self.m_oPrepareTimeOut);
                            self.m_nPrepareTime -= 1;
                            self.m_oPrepareTimeOut = setTimeout(function () {
                                if (self.m_nPrepareTime > 0) {
                                    self.m_oPrepareDesc.getComponent(cc.Label).string = '请在' + self.m_nPrepareTime + '秒内准备';
                                    setPrepareDescTime();
                                } else {
                                    if (self.m_oPrepareTimeOut)
                                        clearTimeout(self.m_oPrepareTimeOut);
                                    self.sendLeaveRoom();
                                }
                            }, 1000);
                        }
                        self.m_oPrepareTimeOut = setTimeout(function () {
                            setPrepareDescTime();
                        }, 1000);
                        self.m_oPrepareBtn.active = false;
                    }
                }
            }
        }.bind(this));
        if (deskData.checkGameIsCoinCreateType()) {
            this.hideEmptySeat();
            this.checkEmptySeat();
        }

        for(var i = 0 ; i < 12; i++)
            this.m_tChipIcon[i].active = false;
    },

    //检查玩家的金币是否充足
    checkPlayerCoin: function () {
        var data = deskData.getConfigData();

        var self = this;

        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            var playerData = player.getPlayerGameInfo();
            var curScore = playerData.curScore;
            if (curScore != null && curScore < data.leave_limit) {

                cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                    var cpt = prefab.getComponent('new_dsz_dialog_box');
                    if (cpt)
                        cpt.show(0, "您的金币不足，不能匹配新的房间，是否前往商城购买！", 'text33', 'Cancel', function () {
                            self.sendLeaveRoom();
                        }, function () {
                        });
                });
                return false;
            }
            return true;
        }
        return true;
    },
    //玩家快速充值表现
    playerRechargeState: function (data) {
        var player_common_data = playerMgr.findPlayerByUserId(data.userId).getPlayerCommonInfo();
        if (player_common_data)
            this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerRechargeState(data.opTime); //增加充值延时
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = roomMgr.gameId;
        var roomId = roomMgr.roomId;
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },
    /**
     * 发起解散
     */
    reqSponsorDissolveRoom: function () {
        var msg = new cc.pb.room_mgr.room_dissolve_agree_req();
        msg.setIsAgree(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, msg, "room_dissolve_agree_req", true);
    },

    /**
     * 显示解散
     * @param {*} msg 
     */
    showDissolve(data) {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
        var UI = cc.dd.UIMgr.getUI('gameyj_new_dsz/common/prefab/ddz_dissolve');
        if (UI) {
            UI.getComponent('dsz_dissolve').setData(data);
        }
        else {
            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/ddz_dissolve', function (ui) {
                var timeout = 30;
                var playerList = playerMgr.playerInfo;
                ui.getComponent('dsz_dissolve').setStartData(timeout, playerList, data);
            });
        }
    },

    /**
     * 解散列表（重连）
     * @param {*} msglist 
     * @param {*} time 
     */
    showDissolveList(msglist, time) {
        var UI = cc.dd.UIMgr.getUI('gameyj_new_dsz/common/prefab/ddz_dissolve');
        if (!UI) {
            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/ddz_dissolve', function (ui) {
                var playerList = playerMgr.playerInfo;
                for (var i = 0; i < msglist.length; i++) {
                    if (i == 0) {
                        ui.getComponent('dsz_dissolve').setStartData(time, playerList, msglist[i]);
                    }
                    else {
                        ui.getComponent('dsz_dissolve').setData(msglist[i]);
                    }
                }
            })
        }
        else {
            for (var i = 0; i < msglist.length; i++) {
                var playerList = playerMgr.playerInfo;
                for (var i = 0; i < msglist.length; i++) {
                    if (i == 0) {
                        UI.getComponent('dsz_dissolve').setStartData(time, playerList, msglist[i]);
                    }
                    else {
                        UI.getComponent('dsz_dissolve').setData(msglist[i]);
                    }
                }
            }
        }
    },

    /**
     * 解散结果
     * @param {*} msg 
     */
    showDissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        //nn_data.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI('gameyj_new_dsz/common/prefab/ddz_dissolve');
    },

    clear: function () {
        this.m_tPlayerList.forEach(function (ui) {
            ui.active = false;
        })
        this.m_tPlayerOp.splice(0, this.m_tPlayerOp.length);
        this.m_tReadyPlayer.splice(0, this.m_tReadyPlayer.length);

        this.m_bRoundResult = false;
        deskData.isRecharge = false;
        clearTimeout(this.roundResutCall_id);
        this.roundResutCall_id = 0
        this.m_bNeedDelay = false;
        deskData.roundResult = false;

        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').clearUI(); //重置界面
                }
            }
        }.bind(this));
        playerMgr.resetAllPlayerData();
        playerMgr.clear();
        deskData.clear();

        this.m_bClearChip = false;
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();
        this.m_oStartBtn.active = false;
        this.m_oPrepareBtn.active = false;
        this.m_oreStartBtn.active = false;
        this.m_orePrepareBtn.active = false;
    },


    /**
     * 战绩按钮点击
     */
    onZhanji(event, data) {
        hall_audio_mgr.com_btn_click();
        cc.find('zhanjitongji', this.node).active = false;
        this.clear();
        this.backToHall();
    },

    //返回大厅
    backToHall(event, data) {
        //cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.getInstance().stopMusic();
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 准备 继续
     */
    on_room_ready: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    break;
                default:
                    break;
            }

            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                var cpt = prefab.getComponent('new_dsz_dialog_box');
                if (cpt)
                    cpt.show(0, str, 'text33', 'Cancel', this.sendLeaveRoom, null);
            }.bind(this));
        }
    },

    //玩家在线状态
    playerOnline: function (data) {
        var player = playerMgr.findPlayerByUserId(data[0].userId);
        var common_player_data = player.getPlayerCommonInfo();
        this.m_tPlayerList[common_player_data.pos].getComponent('new_dsz_player_ui').showOffline(!data[1]);
    },


    /**************************************************************玩家操作end***********************************************************/

    //////////////////////////////////////////////////////////////////语音处理begin////////////////////////////////////////

    getSpeakVoice: function (userid, key) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            var sex = player_common_data.sex != 1 ? 0 : 1;
            var voiceArr = config.New_DSZ_Audio[sex][key];
            var cnt = voiceArr.length;
            var random = Math.random();
            var num = Math.floor(random * 10);
            var remainder = num % cnt;
            return voiceArr[remainder];
        };
    },

    //同步其他客户端玩家操作
    synOtherPlayerOperate: function (userid, state) {
        cc.log('synOtherPlayerOperate');
        var path = '';
        switch (state) {
            case config_state.UserStateFollow: //跟注
                text = config.speakText.GZ;
                path = this.getSpeakVoice(userid, 'AUDIO_CALL');
                break;
            case config_state.UserStateAdd: //加注
                text = config.speakText.JZ;
                path = this.getSpeakVoice(userid, 'AUDIO_ADD');
                break;
            case config_state.UserStateFire:
                text = config.speakText.HP;
                path = this.getSpeakVoice(userid, 'AUDIO_FIRE');
                break;
            case config_state.UserStateTry:
                text = config.speakText.GZYZ;
                path = this.getSpeakVoice(userid, 'AUDIO_ALLIN');
                break;
            case config_state.UserStateCmp: //比牌
                text = config.speakText.BP;
                path = this.getSpeakVoice(userid, 'AUDIO_CMP');
                break;
            case config_state.UserStateFold: //弃牌
                text = config.speakText.QP;
                path = this.getSpeakVoice(userid, 'AUDIO_FOLD');
                break;
            case config_state.UserStateWacth: //看牌
                text = config.speakText.KP;
                path = this.getSpeakVoice(userid, 'AUDIO_WATCH');
                break;
            default:
                cc.error('dsz_coin_room_ui::synOtherPlayerOperate:为何没有上一个玩家状态！');
                return;
        }
        //AudioManager.getInstance().playSound(Prefix + path + '', false);
        //tdk_am.playEffect(path);
        this.activePlayerSpeak(userid, text, state);
    },

    activePlayerSpeak: function (userid, text, state) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var commonData = player.getPlayerCommonInfo();
            this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui').doSpeak(text, state); //显示操作文字
        }
    },
    //////////////////////////////////////////////////////////////////语音处理end////////////////////////////////////////

    ///////////////////////////////////////////语音/表情处理//////////////////////////////////
    //显示玩家信息
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('jlmj_prefab_cfg');

        var playerInfo = playerMgr.findPlayerByUserPos(parseInt(data));
        if (!playerInfo)
            return;
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
            var playerData = playerInfo.getPlayerCommonInfo();
            user_info.setData(deskData.getGameId(), deskData.getRoomId(), null, false, playerData);
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
                this.m_bShowChat = false;
            }

            var gameType = deskData.getGameId();
            var roomId = deskData.getRoomId();

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
                this.m_bShowChat = false;
            }
            var gameType = deskData.getGameId();
            var roomId = deskData.getRoomId();
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

    onChat: function (data) {
        if (data.msgtype == 1) {//短语
            var player = playerMgr.findPlayerByUserId(data.sendUserId);
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                var sex = player_common_data.sex;
                //this.playSound(sex, soundType.CHAT, data.id);
                var cfg = config.New_DSZ_Audio;

                var path = Prefix + cfg[sex]['CHAT'][data.id] + '';
                AudioManager.getInstance().playSound(path, false);
                var cfg1 = null;
                if (sex == 1) {
                    cfg1 = dsz_chat_cfg.Man;
                }
                else {
                    cfg1 = dsz_chat_cfg.Woman;
                }
                var str = cfg1[data.id];
                this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showChat(str);
            }
            // var view = this.idToView(data.sendUserId);
            // var sex = this.getPlayerById(data.sendUserId).sex;
            // this.playSound(sex, soundType.CHAT, data.id);
            // var cfg = null;
            // if (sex == 1) {
            //     cfg = ddz_chat_cfg.Man;
            // }
            // else {
            //     cfg = ddz_chat_cfg.Woman;
            // }
            // var str = cfg[data.id];
            // this._uiComponents[view].showChat(str);
        }
        else if (data.msgtype == 2) {//表情
            var player = playerMgr.findPlayerByUserId(data.sendUserId);
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showEmoji(data.id);
            }
            // var view = this.idToView(data.sendUserId);
            // this._uiComponents[view].showEmoji(data.id);
        }
        else if (data.msgtype == 3) {//魔法表情
            this.playMagicProp(data.id, data.sendUserId, data.toUserId);
        }
    },

    //播放魔法表
    playMagicProp: function (id, send, to) {
        var sPos = this.getPlayerHeadPos(send);
        var ePos = this.getPlayerHeadPos(to);

        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        magic_prop.playMagicPropAni(id, sPos, ePos);
    },

    getPlayerHeadPos: function (id) {
        var player = playerMgr.findPlayerByUserId(id);
        if (player) {
            var pos = player.getPlayerCommonInfo().pos;
            var head = cc.dd.Utils.seekNodeByName(this.m_tPlayerList[pos], 'head');
            var postion = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
            return postion;
        }
    },

    /**
     * 聊天按钮
     */
    onClickChat: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            if (deskData.getCurDeskState() == 3 || deskData.getCurDeskState() == 1) {
                cc.dd.PromptBoxUtil.show('游戏尚未开始，不能聊天');
                return;
            }
            if (player.getPlayerGameInfo() && player.getPlayerGameInfo().userState == config_state.UserStateWait) {
                cc.dd.PromptBoxUtil.show('观战状态不能聊天');
                return;
            } else if (!player.getPlayerGameInfo() || player.getPlayerGameInfo() == null) {
                cc.dd.PromptBoxUtil.show('游戏尚未开始，不能聊天');
                return;
            }
        }
        if (!this.chatAni) {
            cc.find('chat', this.node).getComponent(cc.Animation).play('chat_in');
            this.m_bShowChat = true;
        }
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

    onClickSetting: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHEZHI, function (prefab) {
            prefab.getComponent("blackjack_setting").showBtn(false)
        });
    },

    onClickRule: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_rule_ui', function (prefab) {
            prefab.zIndex = 400;
        });
    },

    //邀请玩家
    onClickInvite: function (event, data) {
        if (roomMgr.isClubRoom()) {
            cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_inviteBox', function (prefab) {
            });
            return;
        }


        var num = deskData.getPlayerCount() - playerMgr.getRealPlayerCount();

        hall_audio_mgr.com_btn_click();
        var title = "房间号:" + deskData.getRoomId() + '\n';
        var str = this.analysisRule();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(roomMgr.roomId, "【" + deskData.getPlayerCount() + "人逗三张】" + '  差' + num + '人', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [];

            wanFa.push('底注:' + this.m_nBaskChip);
            wanFa.push('共:' + deskData.getTotalRoundCount() + '局');

            let playerList = playerMgr.playerInfo;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.playerCommonInfo.name);
                }
            }, this);

            var playmodel = deskData.getPlayModel() //游戏模式
            var luckyType = deskData.getLuckyType() //喜分类型
            var ruleList = deskData.getPlayRule(); //玩法
            if (playmodel == 1)
                wanFa.push('标准模式')
            else
                wanFa.push('大牌模式(无2-8)')

            ruleList.forEach(function (rule) {
                switch (rule) {
                    case 1:
                        wanFa.push('必闷三轮');
                        break;
                    case 2:
                        wanFa.push('癞子玩法');
                        break;
                    case 3:
                        wanFa.push('双倍比牌');
                        break;
                    case 4:
                        wanFa.push('亮底牌');
                        break;
                }
            });
            switch (luckyType) {
                case 1:
                    wanFa.push('闷吃喜分');
                    break;
                case 2:
                    wanFa.push('都吃喜分');
                    break;
                case 3:
                    wanFa.push('赢吃喜分');
                    break;
            }

            let info = {
                gameid: deskData.getGameId(),//游戏ID
                roomid: deskData.getRoomId(),//房间号
                title: deskData.getPlayerCount() + "人逗三张",//房间名称
                content: wanFa,//游戏规则数组
                usercount: deskData.getPlayerCount(),//人数
                jushu: deskData.getTotalRoundCount(),//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            cc.dd.native_wx.SendAppInvite(info, "【" + deskData.getPlayerCount() + "人逗三张】" + '  差' + num + '人', title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
    },

    /**
     * 分享战绩点击
     */
    onShareZhanji(event, data) {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('zhanjitongji/gongzhonghao', this.node).active = true;

            if (data == 'wechat') {
                cc.dd.native_wx.SendScreenShot(canvasNode, 2);
            }
            else if (data == 'xianliao') {
                cc.dd.native_wx.sendXlScreenShot(canvasNode);
            }
            else {
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode, 2);
            }
            cc.find('zhanjitongji/gongzhonghao', this.node).active = false;
        }
    },

    //关闭按钮
    onCloseClick: function (event, data) {
        switch (data) {
            case 'chat':
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                    this.m_bShowChat = false;
                }
                break;
        }
    },

        //退出游戏
    onClickLeave: function (event, data) {
        if (deskData.checkGameIsFriendType()) {
            var content = "";
            var callfunc = null;
            //已经结束
            if (deskData.isEnd == true) {
                this.sendLeaveRoom();
                return;
            }
            // 已经开始
            if (deskData.isStart || deskData.getIsReconnectTag()) {
                var player = playerMgr.findPlayerByUserId(cc.dd.user.id)
                if (player) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
                    callfunc = this.reqSponsorDissolveRoom;
                } else {//旁观者离开
                    this.sendLeaveRoom();
                    return;
                }
            }
            else {
                if (playerMgr.findPlayerByUserId(cc.dd.user.id) && playerMgr.findPlayerByUserId(cc.dd.user.id).isRoomer) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                    callfunc = this.sendLeaveRoom;
                } else {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.sendLeaveRoom;
                }
            }
            this.popupOKcancel(content, callfunc);
        } else {
            var selfInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
            var gamedata = selfInfo.getPlayerGameInfo();
            if (gamedata && (gamedata.userState == config_state.UserStateWait || gamedata.userState != config_state.UserStateFold || gamedata.userState != config_state.UserStateLost || gamedata.userState == 0)) {
                this.sendLeaveRoom();
            } else if (!gamedata) {
                this.sendLeaveRoom();
            } else {
                cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                    var cpt = prefab.getComponent('new_dsz_dialog_box');
                    if (cpt)
                        cpt.show(0, "正在游戏中，退出后系统自动操作，是否退出", 'text33', 'Cancel', this.sendLeaveRoom, null);
                }.bind(this));
            }
        }
    },

    /////////////////////////////////////////gps定位处理begin//////////////////////////////////
    //更新经纬度
    sendLocationInfo() {
        var pbData = new cc.pb.room_mgr.msg_player_location_req();
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                var adress;
                if (typeof (latitude) != 'undefined' && typeof (longitude) != 'undefined')
                    adress = jsb.reflection.callStaticMethod('game/SystemTool', "getAdress", "()Ljava/lang/String;");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                cc.log("详细地址：位置 " + adress);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);

            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                var adress = jsb.reflection.callStaticMethod('SystemTool', "getAdress");
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                cc.log("详细地址：位置 " + adress);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_player_location_req, pbData, 'msg_player_location_req', true);
        }
    },

    //位置更新
    on_player_location_change(msg) {
        var userId = msg.userId;
        var latlngInfo = msg.latlngInfo;
        cc.log('on_player_location_change===============' + msg.userId)
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            player.getPlayerCommonInfo().latlngInfo = latlngInfo;
            player.getPlayerCommonInfo().ip = msg.ip;
            player.getPlayerCommonInfo().address = msg.address;
        }
        cc.log('on_player_location_change=================')
        // var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        // if (UI) {
        //     UI.getComponent('user_info_view').setGpsData(DDZ_Data.Instance().playerInfo);
        // }
    },

    refreshGPSWarn: function () {
        // cc.log('refreshGPSWarn=================')
        // if (roomMgr._Rule.isGps) {
        //     cc.log('checkGps=================')
        //     var gpsList = [];
        //     for (var i = 0; i < playerMgr.playerInfo.length; i++) {
        //         var player = playerMgr.playerInfo[i];
        //         if (player) {
        //             var commonData = player.getPlayerCommonInfo(); //通用数据
        //             if (commonData) {
        //                 gpsList.push({ userId: player.userId, location: commonData.latlngInfo, ip: commonData.ip });
        //             }
        //         }
        //     }
        //     cc.log('pushGpsList=================')
        //     var gpsRepeatGroup = [];
        //     var ipRepeatGroup = [];
        //     var warnGroup = [];
        //     for (var i = 0; i < gpsList.length; i++) {
        //         var temp = [];
        //         var temp1 = [];
        //         for (var j = 0; j < gpsList.length; j++) {
        //             if (cc.dd._.isUndefined(gpsList[i].location) || cc.dd._.isUndefined(gpsList[i].location.latitude) || cc.dd._.isUndefined(gpsList[i].location.longitude))
        //                 warnGroup.push(gpsList[i].userId)
        //             else if (cc.dd._.isUndefined(gpsList[j].location) || cc.dd._.isUndefined(gpsList[j].location.latitude) || cc.dd._.isUndefined(gpsList[j].location.longitude)) {
        //                 warnGroup.push(gpsList[j].userId)
        //             } else {
        //                 if (i != j && this.getDistance(gpsList[i].location, gpsList[j].location) < 100) {//检查距离太近
        //                     temp.push(gpsList[j].userId); //保存异常位置的id
        //                 }

        //                 if (i != j && gpsList[i].ip == gpsList[j].ip && gpsList[i].ip != '') //检测ip是否一样
        //                     temp1.push(gpsList[j].userId);
        //             }
        //         }
        //         if (temp.length != 0) {
        //             temp.push(gpsList[i].userId);
        //             gpsRepeatGroup.push(temp);
        //         }

        //         if (temp1.length != 0) { //如果ip有异常
        //             temp1.push(gpsList[i].userId);
        //             ipRepeatGroup.push(temp1);
        //         }
        //     }
        //     cc.log('ipRepeatGroup=================' + ipRepeatGroup.length)
        //     cc.log('gpsRepeatGroup=================' + gpsRepeatGroup.length)
        //     cc.log('warnGroup=================' + warnGroup.length)

        //     this.playerGpsCheckAnim(warnGroup, gpsRepeatGroup, ipRepeatGroup);
        //     if (warnGroup.length == 0 && gpsRepeatGroup.length == 0 && ipRepeatGroup.length == 0) {
        //         this.m_oGpsWarnNode.getChildByName('warnSp').active = false;
        //         this.m_oGpsWarnNode.getChildByName('saveSp').active = true;
        //     } else {
        //         var warnNode = this.m_oGpsWarnNode.getChildByName('warnSp');
        //         warnNode.active = true;
        //         var seq = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
        //         warnNode.runAction(cc.repeatForever(seq));
        //         this.m_oGpsWarnNode.getChildByName('saveSp').active = false;
        //     }
        // }
    },
    getDistance(locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        }
    },

    //删除重复数据
    deleteRepeatArr: function (arr) {
        var temp = [arr[0]];
        for (var i = 0; i < arr.length; i++) {
            arr[i].sort();
            if (arr[i].toString !== temp[temp.length - 1].toString) {
                temp.push(arr[i]);
            }
        }
        return temp;
    },

    //播放动画
    // showActInfo: function (index, gpsWarn, ipWarn) {
    //     cc.log('showActInfo=============' + index)
    //     var node = this.m_oGpsNode.getChildByName('infoNode');
    //     var cloneNode = cc.instantiate(node);
    //     this.m_tNodeList.push(cloneNode);
    //     cloneNode.active = true;
    //     cloneNode.parent = this.m_oGpsNode;
    //     var str = 'GPS检测中:'
    //     if (index == 1)
    //         str = 'IP检测中:'
    //     else if (index == 2)
    //         str = '外挂检测中'
    //     cloneNode.getChildByName('info_desc').getComponent(cc.Label).string = str;
    //     var moveTo = cc.moveTo(0.5, cc.v2(0, 90));
    //     var self = this;
    //     cloneNode.runAction(cc.sequence(moveTo, cc.callFunc(function () {
    //         cloneNode.getChildByName('info').getComponent(cc.Label).string = '完成';
    //         if ((index == 0 && gpsWarn) || (index == 1 && ipWarn))
    //             cloneNode.getChildByName('warn').active = true;
    //         index += 1;
    //         if (index < 3)
    //             self.showActInfo(index, gpsWarn, ipWarn);
    //         var moveTo1 = cc.moveTo(0.8, cc.v2(0, 170));
    //         cloneNode.runAction(cc.sequence(moveTo1, cc.callFunc(function () {
    //             if (index == 3) {
    //                 for (var i = 0; i < self.m_tNodeList.length; i++) {
    //                     var node = self.m_tNodeList[i];
    //                     node.active = false;
    //                     node.removeFromParent(true);
    //                     self.m_oGpsNode.active = false;
    //                     if (i == self.m_tNodeList.length - 1)
    //                         self.m_tNodeList.splice(0, self.m_tNodeList.length);
    //                 }
    //             }
    //         })));
    //     })))
    // },

    //gps检测动画
    // playerGpsCheckAnim: function (twarnGroup, tGpsGroup, tIpGroup) {
    //     cc.log('playerGpsCheckAnim=================')
    //     this.m_oGpsWarnNode.active = true;
    //     this.m_tGpsRepeatGroup.splice(0, this.m_tGpsRepeatGroup.length);
    //     this.m_tIpRepeatGroup.splice(0, this.m_tIpRepeatGroup.length);
    //     this.m_tWarnGroup.splice(0, this.m_tWarnGroup.length);
    //     this.m_tNodeList.splice(0, this.m_tNodeList.length);

    //     var gpsWarn = false;
    //     var ipWarn = false;
    //     if (tGpsGroup.length != 0) {
    //         this.m_tGpsRepeatGroup = this.deleteRepeatArr(tGpsGroup);
    //         gpsWarn = true;
    //     }

    //     if (twarnGroup.length != 0) {
    //         gpsWarn = true;
    //         var delet = function (arr) {
    //             var temp = [arr[0]];
    //             for (var i = 0; i < arr.length; i++) {
    //                 if (arr[i] != temp[temp.length - 1]) {
    //                     temp.push(arr[i]);
    //                 }
    //             }
    //             return temp;

    //         }
    //         this.m_tWarnGroup = delet(twarnGroup);
    //     }
    //     if (tIpGroup.length != 0) {
    //         this.m_tIpRepeatGroup = this.deleteRepeatArr(tIpGroup);
    //         ipWarn = true;
    //     }

    //     this.m_oGpsNode.active = true;
    //     this.showActInfo(0, gpsWarn, ipWarn);
    // },

    //打开gps检测结果
    onClickGpsWarnUI: function (event, data) {
        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/dsz_gps_warn_ui', function (ui) {
            var cpt = ui.getComponent('new_dsz_gps_warn');
            cpt.setWarnData(this.m_tWarnGroup, this.m_tIpRepeatGroup, this.m_tGpsRepeatGroup);

        }.bind(this));

    },
    /////////////////////////////////////////gps定位处理end//////////////////////////////////

    ////////////////////////////////////////断线重连相关begin/////////////////////////////////
    playerCombackFBtnState: function (player) {//断线重连玩家朋友场按钮显示
        if (player.userId == cc.dd.user.id) { //如果为断线重连为自己
            this.m_oPrepareDesc.active = false;
            var gameData = player.getPlayerGameInfo(); //获取游戏数据
            if (player.isRoomer && deskData.getIsReconnectTag()) {
                var canOpen = playerMgr.checkPlayerAllGameReady();
                if (canOpen) {
                    this.m_oreStartBtn.getComponent(cc.Button).interactable = true;
                }
                this.m_oreStartBtn.active = true;
            } else {
                if (gameData && gameData.userState != 11) { //玩家未准备
                    this.m_orePrepareBtn.active = true;
                }
            }
        } else {
            var ownInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);//获取个人信息
            if (ownInfo) {
                if (ownInfo.isRoomer && deskData.getIsReconnectTag()) {
                    var canOpen = playerMgr.checkPlayerAllGameReady();
                    if (canOpen) {
                        this.m_oreStartBtn.getComponent(cc.Button).interactable = true;
                    } else {
                        this.m_oreStartBtn.getComponent(cc.Button).interactable = false;
                    }
                    this.m_oreStartBtn.active = true;

                }
            }
        }
    },

    //断线重连金币自建房
    playerCombackSelfBtnState: function (player) {
        if (player.userId == cc.dd.user.id) { //如果为断线重连为自己
            this.m_oPrepareDesc.active = false;
            var commonData = player.getPlayerCommonInfo(); //获取玩家通用数据
            this.playerReady_Rsp(player.userId, commonData.isReady);
            if (player.isRoomer && player.userId == cc.dd.user.id) {
                if (!commonData.isReady)
                    this.m_oPrepareBtn.active = true;
            } else {
                if (player.userId == cc.dd.user.id) {//加入房间的为玩家自己
                    if (!commonData.isReady) { //玩家未准备
                        this.m_oPrepareBtn.active = true;
                        this.m_oStartBtn.active = false;
                    }
                }
            }
        }
    },

    //玩家断线重连重进
    playerCombackEnter: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            var commonData = player.getPlayerCommonInfo(); //房间管理器玩家通用数据
            var pos = commonData.pos; //客户端转化座位号

            var playerNode = this.m_tPlayerList[pos];//座位节点
            playerNode.active = true;

            var headBg = cc.dd.Utils.seekNodeByName(playerNode, 'headBg')
            headBg.active = true; //玩家头像显示
            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headNode'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'new_dsz_head_init');
            headNode.getChildByName('head').active = true;

            cc.dd.Utils.seekNodeByName(playerNode, 'name').getComponent(cc.Label).string = cc.dd.Utils.substr(commonData.name, 0, 7); //玩家名字
            var coin = deskData.checkGameIsFriendType() ? 0 : commonData.coin; //朋友场默认为0， 金币场默认为玩家身上金币
            cc.dd.Utils.seekNodeByName(playerNode, 'coin').getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin); //玩家进入金币

            // if(deskData.checkGameIsFriendType()){ //朋友场，进行按钮操作切换
            //     this.playerCombackFBtnState(player);
            // }else if(deskData.checkGameIsCoinCreateType()){//自建金币场
            //     this.playerCombackSelfBtnState(player);
            // }else{//金币场默认玩家均为已准备
            //     this.playerReady_Rsp(userId, true);
            //     this.m_oPrepareDesc.active = false;
            // }
        }
    },

    //断线重连重新刷新玩家信息
    combackInitPlayer: function () {
        var UI = cc.dd.UIMgr.getUI('gameyj_new_dsz/common/prefab/new_dsz_compare');
        if (UI) {
            UI.getComponent('new_dsz_compare_ui').onClose();
        }
        var self = this;
        if (playerMgr.playerInfo) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player)
                    var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data.seat != -1)
                    self.playerCombackEnter(player.userId);
            });
            if (!deskData.checkGameIsFriendType())
                this.updateCoinDeskData();
            this.resetPlayerUI();
        }
    },


    //实例化朋友场断线重连玩家数据
    initFPlayerReconnectData: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {

            var player_game_data = player.getPlayerGameInfo(); //游戏数据
            var player_common_data = player.getPlayerCommonInfo(); //通用数据
            var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');

            if (deskData.checkDissolve())
                this.showDissolveList(deskData.getDissolveList(), deskData.getDissolveTime());

            this.m_bContinue = true;

            if (deskData.getCurDeskState() != 1) {//游戏已经开始
                if (player_game_data.userState != config_state.UserStateWait) {//玩家不是旁观
                    cc.log('initFPlayerReconnectData===============')
                    cpt.initData(player_game_data);//玩家游戏数据
                    cpt.showPoker();
                    this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
                    if (player.userId == cc.dd.user.id) {
                        this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
                        this.showCurOperateBtns();
                    }
                } else {
                    cpt.setPlayerPokerState(4);//旁观标记
                }
            } else {//游戏未开始
                if (player_game_data.userState != config_state.UserStatePrepare) {//朋友场玩家未准备
                    this.playerCombackFBtnState(player);
                    cpt.setPlayerReady(false);
                    var coin = player_game_data.curScore; //朋友场默认为0， 金币场默认为玩家身上金币
                    cc.dd.Utils.seekNodeByName(this.m_tPlayerList[player_common_data.pos], 'coin').getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin); //玩家进入金币

                } else {
                    cpt.setPlayerReady(true);
                }
            }
        }
    },

    //切后台有压栈消息处理玩家初始数据
    initPlayerDefaultData: function () {
        this.m_bReconnect = false;
        var self = this;
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                cc.log('==================1' + player.userId);
                var player_game_data = player.getPlayerGameInfo(); //游戏数据
                var player_common_data = player.getPlayerCommonInfo(); //通用数据

                var cpt = self.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');
                //cpt.setPlayerState(false);
                if (deskData.checkGameIsFriendType()) {//朋友场
                    if (deskData.getIsReconnectTag())
                        self.initFPlayerReconnectData(player.userId);
                    else {
                        self.initPlayerFData(player.userId);
                    }
                } else {
                    if (player_game_data.userState != config_state.UserStateWait) {
                        cpt.initData(player_game_data);//玩家游戏数据
                        cpt.showPoker();
                        self.freshPlayerCostChipInfo(player, self.m_nBaskChip, false); //玩家下注数据
                        if (player.userId == cc.dd.user.id && player.userId == deskData.getCurOpUser())
                            self.showCurOperateBtns();
                    } else {
                        cpt.setPlayerPokerState(4);
                    }
                }
            }
        });
    },

    //断线重连清理玩家显示
    connectClear: function () {
        for (var i = 0; i < deskData.getPlayerCount(); i++) {
            this.m_tPlayerList[i].active = false;
        }
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].active = true;
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').resetPlayerUI();
                    cc.log('reconnectclear===============')
                }
            }
        }.bind(this));
        this.hideEmptySeat();
        this.checkEmptySeat();
    },

    //断线重连清理所有界面显示相关数据
    reconnectClearAllUI: function () {
        this.m_bContinue = true;
        if (this.sendpokerTime)
            clearTimeout(this.sendpokerTime);
        this.node.stopAllActions();
        this.m_tPlayerOp.splice(0, this.m_tPlayerOp.length);
        this.connectClear();
        this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn(); //屏蔽所有界面显示的按钮
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();
        this.combackInitPlayer();
        this.updateDeskData();
        deskData.initDeskReconnectData();
    },

    resetPlayerUI: function () {
        var self = this;
        playerMgr.playerInfo.forEach(function (playerData) {
            if (playerData) {
                var player_common_data = playerData.getPlayerCommonInfo();
                if (player_common_data) {
                    self.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').resetPlayerUI(); //重置界面
                    if (playerData.userId == cc.dd.user.id && player_common_data.autoFlag) {
                        self.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPlayerIsAuto(true, false)
                    }
                }
            }
        });
    },
    ////////////////////////////////////////断线重连相关end/////////////////////////////////

    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case playerEvent.TEENPATTI_PLAYER_ENTER: //玩家进入
                this.playerEnter(data);
                break;
            case playerEvent.TEENPATTI_PLAYER_READY: //玩家准备
                if (!this.m_bRoundResult) {
                    this.playerReady_Rsp(data, true);
                    if (deskData.checkGameIsFriendType()) {//如果为朋友场
                        var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                        if (own && own.isRoomer && data != own.userId) {//检查玩家是否为房主
                            var canOpen = playerMgr.checkPlayerAllReady();
                            cc.log('canopen==============' + canOpen)
                            if (canOpen)
                                this.playerAllReady_Rsp(); //所有玩家准备好，开始按钮显示
                        }
                    }
                    if (data == cc.dd.user.id)
                        this.resetPlayerUI();
                } else {
                    this.m_tReadyPlayer.push(data);
                }
                break;
            case playerEvent.TEENPATTI_PLAYER_INIT_DATA: //玩家数据实例化
                this.initPlayerGameData(data);
                this.m_bChangeDesk = false;
                break;
            case playerEvent.New_PLAYER_ISONLINE: //玩家在线状态
                this.playerOnline(data);
                break;
            case playerEvent.TEENPATTI_PLAYER_COME_BACK: //玩家断线重连回来
                cc.log('playercombackenter=============' + data);
                this.playerCombackEnter(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_CALL: //跟注
                this.sendpokerAct = true;
                this.m_tPlayerOp.push(1);
                cc.log('push==============1')
                this.playerAddChip_Rsp(data, true);
                break;
            case deskEvent.TEENPATTI_DEDSK_FOLD: //弃牌
                this.sendpokerAct = true;
                this.m_tPlayerOp.push(3);
                cc.log('push==============3')
                this.playerFold_Rsp(data);
                break;
            // case deskEvent.TEENPATTI_RESETPLAYERUI://重新设置界面
            //     this.resetPlayerUI();
            //     break;
            case playerEvent.TEENPATTI_PLAYER_WATCH_POKER: //玩家看牌
                this.sendpokerAct = true;
                this.m_tPlayerOp.push(4);
                cc.log('push==============4')
                this.playerWatch_Rsp(data);
                break;
            case playerEvent.TEENPATTI_PLYER_EXIT: //玩家离开
                this.sendpokerAct = true;
                this.m_tPlayerOp.push(5);
                cc.log('push==============5')
                this.playerLeave_Rsp(data);
                break;
            case playerEvent.TEEENPATTI_PLAYER_SHOW_POKER: //玩家show牌
                this.m_tPlayerOp.push(6);
                cc.log('push==============6')
                this.playerShow_Rsp(data);
                break;
            case playerEvent.TEENPATTI_PLAYER_AUTO_CHANGE://玩家托管状态切换
                this.changePlayerAutoState(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_SEND_POKER: //发牌
                this.resetPlayerUI();
                if (!this.m_bRoundResult && !this.sendpokerAct && !deskData.getIsReconnectTag()) {//玩家不切换后台或者断线重连
                    var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (player) {
                        var player_common_data = player.getPlayerCommonInfo();
                        var sex = player_common_data.sex != 1 ? 0 : 1;
                        if (sex == 1)
                            AudioManager.getInstance().playSound(Prefix + 'yqp3_Man_kaishi', false);
                        else
                            AudioManager.getInstance().playSound(Prefix + 'yqp3_Woman_kaishi', false);
                    }
                    this.updateDeskCircle(false);

                    if (deskData.getGameId() == 36 && deskData.getCurCircle() < 3) {//朋友场前2局检测
                        this.refreshGPSWarn();
                    } else if (playerMgr.checkPlayerChanged()) {
                        if (deskData.getGameId() == 136)
                            this.playerGpsCheckAnim([], [], []);
                        else
                            this.refreshGPSWarn(); //gps检测动画
                    }
                    cc.log('sendpoker=================');
                    if (!deskData.getIsReconnectTag())
                        this.betBaseBet();
                } else if (deskData.getIsReconnectTag()) {//玩家切后台或者断线重连
                    this.initPlayerDefaultData();
                }
                break;
            case deskEvent.TEENPATTI_DEDSK_COMPARE: //比牌
                this.playerCmp_Rsp(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_COMPARE_AGREE: //比牌请求消息返回
                if(data.ret != 0)
                cc.dd.PromptBoxUtil.show('CmpDisagree');
                break;
            case deskEvent.TEENPATTI_DEDSK_COMPARE_RESULT: //比牌结果
                this.playerCmpResult_Rsp(data.userId, data.cmpId, data.winner);
                break;
            case deskEvent.TEENPATTI_DEDSK_SHOW_ROUND_RESULE: //单局结算
                cc.log('result=================');
                this.roundResut_Rsp(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_SHOW_RESULE: //总结算
                this.showResultTotal_Rsp(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_DISSOVlE: //解散消息
                if (playerMgr.findPlayerByUserId(cc.dd.user.id))
                    this.showDissolve(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_DISSOVLE_RESULT: //解散结果
                this.showDissolveResult(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_UPDATE_CIRCLE: //更新轮数
                this.updateDeskCircle(true);
                break;
            case deskEvent.New_CHECK_PLAYER_ALL_READY: //检测玩家是否全部准备，断线重连检测
                var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                if (own && own.isRoomer) {
                    var canOpen = playerMgr.checkPlayerAllGameReady();
                    if (canOpen)
                        this.playerAllReady_Rsp();
                }
                break;
            case deskEvent.TEENPATTI_DEDSK_QUICK_RECHARGE://快速充值
                this.playerRechargeState(data);
                break;
            case deskEvent.TEENPATTI_DEDSK_RECONNECT: //断线重连
                this.reconnectClearAllUI();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                if (!deskData.checkGameIsFriendType()) {
                    this.sendLeaveRoom();
                    this.clear();
                    this.backToHall();
                } else {
                    this.clear();
                    this.backToHall();
                }
                break;
            case playerEvent.TEENPATTI_PLAYER_COIN_CHANGE:
                this.updatePlayerCoin(data);
                break;
            case RoomEvent.on_room_replace: //换桌成功
                if (data[0].retCode == 0) {
                    this.m_bNeedRoundCallBack = false;
                    this.m_bChangeDesk = true;
                    this.clear();
                } else if (data[0].retCode == 1)
                    this.checkPlayerCoin();
                break;
            // case RoomEvent.on_room_leave: //离开
            //     if(deskData.checkGameIsFriendType()){
            //         var player = playerMgr.findPlayerByUserId(data.userId);
            //         if(player && player.getPlayerGameInfo().seat == -1){
            //             return;
            //         }
            //         var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
            //         if(own && own.isRoomer && data != own.userId){//检查玩家是否为房主
            //             var canOpen = playerMgr.checkPlayerAllReady();
            //             if(canOpen)
            //                 this.playerAllReady_Rsp(); //所有玩家准备好，开始按钮显示
            //         }
            //     }
            //     break;
            case RoomEvent.on_room_enter:
                // if(!deskData.isStart && !deskData.isFristEnter){
                if (!deskData.isStart) {
                    //this.m_bReconnect = true;
                    var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (own && own.isRoomer && deskData.checkGameIsFriendType()) {
                        var canOpen = playerMgr.checkPlayerAllReady();
                        if (canOpen && playerMgr.getRealPlayerCount() > 1)
                            this.playerAllReady_Rsp();
                    }
                    this.connectClear();
                    //this.m_bReconnect = false;
                } else if (deskData.isStart) {
                    if (deskData.checkGameIsCoinCreateType()) {
                        //this.reconnectClearCoinAllUI();
                    }
                }
                break;
            case RoomEvent.update_player_location:
                this.on_player_location_change(data[0]);
                break;
            case RoomEvent.on_room_ready:
                this.on_room_ready(data[0]);
                break;

            case RecordEvent.PLAY_RECORD:
                for (var i = 0; i < playerMgr.playerInfo.length; i++) {
                    var player = playerMgr.playerInfo[i];
                    if (player && player.userId) {
                        if (data.accid.toLowerCase() == (cc.dd.prefix + player.userId).toLowerCase()) {
                            var commonData = player.getPlayerCommonInfo();
                            this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui').play_yuyin(data.duration);
                        }
                    }
                }
                break;
            //GVoice 语音
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                var player = playerMgr.findPlayerByUserId(parseInt(data[0]));
                if (player && player.userId) {
                    if (data[0] == player.userId) {
                        var commonData = player.getPlayerCommonInfo();
                        var cpt = this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui');
                        cpt.yuyin_laba.node.active = true;
                        cpt.yuyin_laba.yuyin_size.node.active = false;
                    }
                }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                var player = playerMgr.findPlayerByUserId(parseInt(data[0]));
                if (player && player.userId) {
                    if (data[0] == player.userId) {
                        var commonData = player.getPlayerCommonInfo();
                        var cpt = this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui');
                        cpt.yuyin_laba.node.active = false;
                        cpt.yuyin_laba.yuyin_size.node.active = false;
                    }
                }
                break;
            case SysEvent.PAUSE:
                cc.log('暂停 倒计时');
                this.sendpokerAct = true;
                break;
            case SysEvent.RESUME:

                break;
        }
    }
});
