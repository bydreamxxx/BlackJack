// create by wj 2018/10/31
var deskData = require('dsz_desk_data').DSZ_Desk_Data.Instance();
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
var playerEd = require('dsz_player_mgr').DSZ_PlayerED;
var playerEvent = require('dsz_player_mgr').DSZ_PlayerEvent;
var deskEd = require('dsz_desk_data').DSZ_Desk_Ed;
var deskEvent = require('dsz_desk_data').DSZ_Desk_Event;
var config_state = require('dsz_config').DSZ_UserState;
var config = require('dsz_config');
var dsz_chat_cfg = config.DSZ_Chat_Config;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;

const Prefix = 'gameyj_dsz/common/audio/';

var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

var commonRoomED = require("jlmj_room_mgr").RoomED;
var commonRoomEvent = require("jlmj_room_mgr").RoomEvent;

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var DingRobot = require('DingRobot');



cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerList: [],
        m_tChipStartNode: [],
        m_nIndex: 0,
        m_bContinue: false,
        m_oFireUI: cc.Node,
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
        m_bInitChip: false,
        m_oWaitNode: cc.Node,
        m_bIsCompare: false,
        compareUINode: cc.Node,
        allUINode: cc.Node,
        m_nHuoPinCount: 0,
        m_oAllInActNode: cc.Node,
        m_oAllCompareNode: cc.Node,
        chat_item: cc.Prefab,
        allCompare: false,
        m_bPlayAct: false,
        m_bClearChip: false,
        m_bIsAllIn: false,
        m_bClearUI: false,
        m_bNeedDelay: true,
        m_bNeedRoundCallBack: false,
        m_oRoundData: null,
    },

    onLoad: function () {
        DingRobot.set_ding_type(4);
        playerEd.addObserver(this);
        deskEd.addObserver(this);
        commonRoomED.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        //deskData.init();
        this.m_nBaskChip = 0;
        //总筹码
        this.m_oTotalChipsTxt = cc.dd.Utils.seekNodeByName(this.node, "total_chips").getComponent(cc.Label);
        //底注
        //this.m_oBaseChipTxt = cc.dd.Utils.seekNodeByName(this.node, "min_chip").getComponent(cc.Label);
        //轮数
        this.m_oDescTxt = cc.dd.Utils.seekNodeByName(this.node, "desk_Desc").getComponent(cc.Label);
        //玩家列表/筹码起始点
        var playercount = deskData.getPlayerCount();
        for (var i = 0; i < 5; i++) {
            this.m_tPlayerList[i] = cc.dd.Utils.seekNodeByName(this.node, "player_" + i);
            this.m_tPlayerList[i].active = false;

            this.m_tChipStartNode[i] = cc.dd.Utils.seekNodeByName(this.node, "chipNode" + i);
        }

        //筹码区域
        this.m_oChipAreaNode = cc.dd.Utils.seekNodeByName(this.node, 'chipArea');
        //按钮区域
        this.m_oMenuNode = cc.dd.Utils.seekNodeByName(this.node, 'btnPanle');
        this.m_oMenuNode.active = false;

        this.node_guize = cc.find('guize', this.node);
        this.node_menu = cc.find('menu', this.node);
        this.node_setting = cc.find('setting', this.node);
        this.btn_menu = cc.find('btns/menu', this.node).getComponent(cc.Button);

        cc.find('chat', this.node).getComponent(cc.Animation).on('play', function () { this.chatAni = true; }.bind(this), this);
        cc.find('chat', this.node).getComponent(cc.Animation).on('finished', function () { this.chatAni = false; }.bind(this), this);

        //this.updateDeskData();
        //this.initZhuoBu();
        this.initMusicAndSound();
        this.initPlayer();
        this.initChat();
        this.initZhuoBu();
        //AudioManager.getInstance().playMusic(Prefix + 'zjh_gamebg');
    },

    onDestroy: function () {
        playerEd.removeObserver(this);
        deskEd.removeObserver(this);
        commonRoomED.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
    },

    //桌子数据更新
    updateDeskData: function () {
        //总筹码
        this.m_oTotalChipsTxt.string = deskData.getCurBet();
        //底注
        var configData = deskData.getConfigData();
        if (configData) {
            var list = configData.anzhu.split(';');
            var base = list[0].split(',');
            //this.m_oBaseChipTxt.string = base[1];
            this.m_nBaskChip = parseInt(base[1]);
            //轮数
            this.m_oDescTxt.string = '底注:' + this.m_nBaskChip + '  轮数:' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
        }
        //轮数
        //this.m_oCircleTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
    },

    //初始玩家数据
    initPlayer: function () {
        var self = this;
        if (playerMgr.playerInfo) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player)
                    self.playerEnter(player.userId);
            });
        }
    },

    //////////////////////////////////////////////////////////玩家操作begin//////////////////////////////////////////////////////
    //玩家进入/断线重连均使用这个
    playerEnter: function (userId) {
        cc.log('m_bClearUI============+++++' + this.m_bClearUI);

        if (!this.m_bClearUI) {
            this.clearMainUI();
            this.m_bClearUI = true;
            cc.log('m_bClearUI============++++++++=============' + this.m_bClearUI);
        }
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var commonData = player.getPlayerCommonInfo(); //获取通用数据
            var pos = commonData.pos; //玩家座位；

            var playerNode = this.m_tPlayerList[pos];

            // playerNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr( commonData.name, 8, 4 ); //玩家名字
            playerNode.getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(commonData.coin); //朋友场玩家进入金币

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
            headNode.getChildByName('head').active = true;
            playerNode.active = true;
            if (userId == cc.dd.user.id) //玩家自己进入，初始化桌子数据
                this.updateDeskData();
            // if(commonData.isReady)
            //     playerNode.getChildByName('readyTag').active = true;
        }
    },
    //玩家准备
    playerReady_Rsp: function (userId) {
        // this.startTime();
    },

    //跟注/加注操作
    playerAddChip_Rsp: function (userId, playAudio) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_game_data = player.getPlayerGameInfo();
            if (player_game_data) {
                if (playAudio)
                    this.synOtherPlayerOperate(userId, player_game_data.userState);
                AudioManager.getInstance().playSound(Prefix + 'pt_chouma', false);
                this.freshPlayerCostChipInfo(player, player_game_data.lastBet, true);
                this.freshDeskTotalChip(parseInt(player_game_data.lastBet));
            }
            if (playAudio)
                this.showCurOperateBtns();
        }
    },

    //玩家弃牌
    playerFold_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateFold);
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').fold(); //玩家弃牌
            }
            player.updatePlayerPokerState(3);
        }
        this.showCurOperateBtns();
    },

    //玩家看牌
    playerWatch_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateWacth);
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                if (userId == cc.dd.user.id) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').watch(); //玩家看牌
                    if (deskData.getCurOpUser() == cc.dd.user.id)
                        this.m_oMenuNode.getComponent('dsz_game_menu').analysisJbcPlayerOpBtn();//更新按钮显示
                } else
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerPokerState(2); //玩家已经看牌
            }
            this.showCurOperateBtns();
        }
    },

    //是否剩余两个玩家，进行默认的选中
    ckeckDefalutSelect: function () {
        var playercount = playerMgr.getRealPlayerCount(); //桌子上的玩家数量
        var leftPlayer = null;
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_game_data = player.getPlayerGameInfo();
                if (player_game_data.userState == config_state.UserStateFold || player_game_data.userState == config_state.UserStateLost || player_game_data.userState == config_state.UserStateWait)
                    playercount = playercount - 1;
                else {
                    if (player.userId != cc.dd.user.id)
                        leftPlayer = player;
                }
            }
        });
        if (playercount == 2) {
            this.m_bIsCompare = true;
            var player_common_data = leftPlayer.getPlayerCommonInfo();
            this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').sendComp(null, null); //发送比牌消息
            return true;
        } else
            return false;
    },
    //玩家比牌下注
    playerCmp_Rsp: function () {
        if (this.ckeckDefalutSelect())
            return;
        this.m_bIsSelectCmp = true;
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                if (player.userId != cc.dd.user.id) {
                    var player_common_data = player.getPlayerCommonInfo();
                    var player_game_data = player.getPlayerGameInfo();
                    if (player_common_data && player_game_data && (player_game_data.userState != config_state.UserStateFold && player_game_data.userState != config_state.UserStateLost && player_game_data.userState != config_state.UserStateWait)) {
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(true); //玩家设置为可被选中
                    }
                }
            }
        }.bind(this))
    },

    //玩家比牌结果
    playerCmpResult_Rsp: function (userId, cmpUserId, WinnerId) {
        cc._pauseLMAni = true;
        this.m_bIsCompare = true;
        this.playerAddChip_Rsp(userId, false);//比牌需要下注
        this.synOtherPlayerOperate(userId, config_state.UserStateCmp);
        var playerNode1 = null;
        var playerNode2 = null;
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                    if (userId == player.userId)
                        playerNode1 = this.m_tPlayerList[player_common_data.pos];
                    else if (cmpUserId == player.userId)
                        playerNode2 = this.m_tPlayerList[player_common_data.pos];
                }
            }
        }.bind(this))
        playerNode1.getChildByName('headbg').active = false;
        playerNode2.getChildByName('headbg').active = false;
        var self = this;
        var callBack = function () {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        if ((userId == player.userId && userId != WinnerId) || (cmpUserId == player.userId && cmpUserId != WinnerId))
                            self.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerPokerState(3); //玩家比牌输
                    }
                }
            });
            self.m_bIsCompare = false;
            if (self.m_bNeedRoundCallBack)
                self.roundResut_Rsp(self.m_oRoundData);
            else
                self.showCurOperateBtns();
        }

        cc.dd.UIMgr.openUI('gameyj_dsz/common/prefab/dsz_compare', function (ui) {
            var cpt = ui.getComponent('dsz_compare_ui');
            cpt.playerCompareAct(userId, cmpUserId, WinnerId, playerNode1, playerNode2, callBack);

        }.bind(this));

        // // 动画
        // this.compareUINode.active = true;
        // var cpt = this.compareUINode.getComponent('dsz_compare_ui');
        // cpt.playerCompareAct(userId, cmpUserId, WinnerId, playerNode1, playerNode2, callBack);
        // this.m_bIsCompare = true;
    },

    //取消比牌选择
    cancelCmpSelect: function () {
        if (this.m_bIsSelectCmp) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                    }
                }
            }.bind(this))
            this.m_bIsSelectCmp = false;
        }
    },

    //玩家火拼
    playerFire_Rsp: function (userId) {
        this.m_nFireMusicId = Prefix + 'huopin_music';
        AudioManager.getInstance().playMusic(Prefix + 'huopin_music');
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            this.m_nHuoPinCount += 1;
            this.playerAddChip_Rsp(userId, false);//比牌需要下注
            this.synOtherPlayerOperate(userId, config_state.UserStateFire);
            AudioManager.getInstance().playSound(Prefix + 'xp_chouma', false);
            if (this.m_nHuoPinCount == 1) {
                var self = this;
                this.m_oFireUI.active = true;   //显示火拼的大动画
                var huopinAnim = this.m_oFireUI.getChildByName('huopin');
                huopinAnim.getComponent(sp.Skeleton).clearTracks();
                huopinAnim.getComponent(sp.Skeleton).setAnimation(0, 'CC', false);
                huopinAnim.getComponent(sp.Skeleton).loop = false;
                huopinAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
                    huopinAnim.getComponent(sp.Skeleton).setAnimation(0, 'XH', false);
                    huopinAnim.getComponent(sp.Skeleton).loop = false;
                    huopinAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
                        self.m_oFireUI.active = false;
                        //if(userId != cc.dd.user.id)
                        self.showCurOperateBtns();
                    }.bind(this));
                });
            }//else if(this.m_nHuoPinCount > 1){//全场比牌
            //     this.m_oFireUI.active = false;
            //     this.m_oAllCompareNode.active = true;
            //     var allCompareAnim = this.m_oAllCompareNode.getChildByName('quanchangbipai');
            //     allCompareAnim.getComponent(sp.Skeleton).clearTracks();
            //     allCompareAnim.getComponent(sp.Skeleton).setAnimation(0, 'quanchangbipai', false);
            //     allCompareAnim.getComponent(sp.Skeleton).loop = false;
            // }   
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setFireState(); //设置为火拼状态
            }
        }
    },

    //孤注一掷动画
    playAllInAct: function (data) {
        if (this.m_bIsAllIn) {
            var self = this;
            this.m_nAllInId = setTimeout(function () {
                this.m_bIsAllIn = false;
                self.playAllInAct(data);
                clearTimeout(self.m_nAllInId);
            }, 2000);
            return;
        }
        cc._pauseLMAni = true;
        var player = playerMgr.findPlayerByUserId(data.userId);
        this.playerAddChip_Rsp(data.userId, false);//比牌需要下注
        if (player)
            this.synOtherPlayerOperate(data.userId, config_state.UserStateTry);

        this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();

        this.m_bIsAllIn = true;
        this.m_oAllInActNode.active = true;   //显示allin的大动画
        var allInAnim = this.m_oAllInActNode.getChildByName('allIn');
        allInAnim.getComponent(sp.Skeleton).clearTracks();
        allInAnim.getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
        allInAnim.getComponent(sp.Skeleton).loop = false;
        allInAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
            this.m_oAllInActNode.active = false;
            this.playerAllIn_Rsp(data);
        }.bind(this));
    },

    //孤注一掷
    playerAllIn_Rsp: function (data) {
        var self = this;
        var player = playerMgr.findPlayerByUserId(data.userId);
        if (player) {
            var ownCommonData = player.getPlayerCommonInfo();
            var self = this;
            var callBack = function () {
                self.m_bIsAllIn = false;
                if (data.userId == cc.dd.user.id) {//孤注一掷对象是自己
                    if (!data.isWin)
                        self.m_tPlayerList[ownCommonData.pos].getComponent('dsz_player_ui').setPlayerPokerState(3); //玩家比牌输
                }
                else if (data.userId != cc.dd.user.id && !data.isWin) {//非自己孤注一掷，玩家输了
                    var player_common_data = player.getPlayerCommonInfo();
                    self.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerPokerState(3); //玩家比牌输
                    //self.showCurOperateBtns();
                }

                playerMgr.playerInfo.forEach(function (playerCmp) {
                    if (playerCmp) {
                        var player_common_data = playerCmp.getPlayerCommonInfo();
                        self.m_tPlayerList[player_common_data.pos].getChildByName('headbg').active = true;
                    }
                });
                if (self.m_bNeedRoundCallBack)
                    self.roundResut_Rsp(self.m_oRoundData);
                else
                    self.showCurOperateBtns();
            }

            var tPlayerNode = [];
            var self = this;
            playerMgr.playerInfo.forEach(function (playerCmp, index) {
                if (playerCmp) {
                    if (playerCmp.userId != data.userId) {
                        var gameData = playerCmp.getPlayerGameInfo();
                        var player_common_data = playerCmp.getPlayerCommonInfo();
                        if (gameData.userState != config_state.UserStateFold && gameData.userState != config_state.UserStateLost && gameData.userState != config_state.UserStateWait) {
                            tPlayerNode.push(self.m_tPlayerList[player_common_data.pos]);
                            self.m_tPlayerList[player_common_data.pos].getChildByName('headbg').active = false;
                        }
                    }
                }
            });
            this.m_tPlayerList[ownCommonData.pos].getChildByName('headbg').active = false;
            var ownNode = this.m_tPlayerList[ownCommonData.pos];
            cc.dd.UIMgr.openUI('gameyj_dsz/common/prefab/dsz_allIn', function (ui) {
                var cpt = ui.getComponent('dsz_allIn_ui');
                cpt.playerAllInAct(data.userId, data.isWin, ownNode, tPlayerNode, callBack);

            }.bind(this));
        }
    },

    //单局结算
    roundResut_Rsp: function (data) {
        cc._pauseLMAni = true;

        this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();
        this.m_oMenuNode.active = false;
        var desk_config = deskData.getConfigData();
        if (deskData.getCurCircle() >= desk_config.limit_circle || deskData.getCurBet() >= desk_config.limit_score && !this.allCompare) {
            this.allCompare = true;
        }
        var self = this;
        if (this.m_bIsCompare) {
            this.m_bNeedRoundCallBack = true;
            this.m_oRoundData = data;
            // self.roundResut_id = setTimeout(function() {
            //     self.roundResut_Rsp(data);
            // }, 2500);
            this.m_bIsCompare = false;
            //this.m_bNeedDelay = false;
        } else if (self.m_bIsAllIn) {
            this.m_bNeedRoundCallBack = true;
            this.m_oRoundData = data;

            // self.roundResut_id = setTimeout(function() {
            //     self.roundResut_Rsp(data);
            // }, 4500);
            //this.m_bNeedDelay = false;
        } else if (this.m_nHuoPinCount > 1 || (this.allCompare && !this.m_bPlayAct)) {
            this.m_bPlayAct = true
            if (this.m_nFireMusicId) {
                cc.audioEngine.stop(AudioManager.getAudioID(this.m_nFireMusicId));
                AudioManager.getInstance().stopMusic();
            }
            this.m_oFireUI.active = false;
            this.m_oAllCompareNode.active = true;
            var allCompareAnim = this.m_oAllCompareNode.getChildByName('quanchangbipai');
            allCompareAnim.getComponent(sp.Skeleton).clearTracks();
            allCompareAnim.getComponent(sp.Skeleton).setAnimation(0, 'quanchangbipai', false);
            allCompareAnim.getComponent(sp.Skeleton).loop = false;
            allCompareAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
                this.m_oAllCompareNode.active = false;
                self.roundResut_Rsp(data);
            }.bind(this));

            // self.roundResut_id = setTimeout(function() {
            // }, 2500);
            this.m_bIsCompare = false;
            this.m_nHuoPinCount = 0;
            //this.m_bNeedDelay = false;
        } else {
            this.m_bNeedRoundCallBack = false;
            this.m_oRoundData = null;

            this.m_oFireUI.active = false;   //显示火拼的大动画
            this.m_oAllCompareNode.active = false;
            this.m_oAllInActNode.active = false;
            this.allCompare = false;
            this.m_bPlayAct = false;
            this.m_nHuoPinCount = 0;

            this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();
            this.m_oMenuNode.active = false;

            data.forEach(function (info) {
                var player = playerMgr.findPlayerByUserId(info.userId);
                if (player) {
                    if (player.userId == cc.dd.user.id) {
                        if (info.isWin)
                            AudioManager.getInstance().playSound(Prefix + 'finalWin', false);
                    }
                    var player_common_data = player.getPlayerCommonInfo();
                    if (info.score < 0)
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setResult(info.score); //设置单人的结算
                    else
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setResult(info.score - player.getPlayerGameInfo().betScore); //设置单人的结算

                    //if(deskData.getWatchAll())
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showPokerFace(); //开牌
                    if (info.isWin) {
                        this.m_oChipAreaNode.getComponent('dsz_chip_ui').result(player_common_data.pos); //收筹码的动画
                        player.getPlayerGameInfo().curScore += info.score;
                    }
                    player.getPlayerGameInfo().curScore -= info.severPay;
                    if (player.getPlayerGameInfo().curScore <= 0)
                        player.getPlayerGameInfo().curScore = 0;

                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').freshPlayerChip();//刷新玩家身上筹码值

                }
            }.bind(this));
            this.m_bClearUI = false;
            var time = 4000;
            if (!this.m_bNeedDelay) {
                time = 4000;
                this.m_bNeedDelay = true;
            }

            self.roundResutCall_id = setTimeout(function () {
                self.checkPlayerCoin();
                self.resetDeskData();
                cc._pauseLMAni = false;
                clearTimeout(self.roundResutCall_id);
                self.roundResutCall_id = 0
            }, time);
        }
    },

    //玩家离开操作
    playerLeave_Rsp: function (data) {
        if (data.userId == cc.dd.user.id) {
            if (this.sendPoker_id)
                clearTimeout(this.sendPoker_id);
            // if(this.checkPlayerCoin()){
            //     this.node.stopAllActions();
            //     this.clear();
            //     this.backToHall();
            // }
        } else {
            this.m_tPlayerList[data.pos].active = false;
            cc.log('clear==========');
            this.m_tPlayerList[data.pos].getComponent('dsz_player_ui').clearUI();
        }
    },

    //玩家在线状态
    playerOnline: function (data) {
        var player = playerMgr.findPlayerByUserId(data[0].userId);
        var common_player_data = player.getPlayerCommonInfo();
        this.m_tPlayerList[common_player_data.pos].getComponent('dsz_player_ui').showOffline(!data[1]);
    },
    //////////////////////////////////////////////////////////玩家操作end//////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////桌子/玩家数据更新begin////////////////////////////////
    //实例化玩家数据
    initPlayerGameData: function (userId) {
        if (!this.m_bInitChip) {
            this.m_oChipAreaNode.getComponent('dsz_chip_ui').initChip();
            this.updateDeskData();
            this.m_oWaitNode.active = false;
        }
        this.m_bInitChip = true;
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_game_data = player.getPlayerGameInfo();
            var player_common_data = player.getPlayerCommonInfo();
            //如果为断线重连
            if (deskData.getIsReconnectTag()) {
                if (!this.m_bClearChip) {
                    this.m_oChipAreaNode.getComponent('dsz_chip_ui').clear(); //下注筹码动画
                    this.m_bClearChip = true;
                }
                var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui');
                if (player_game_data.userState != config_state.UserStateWait) {
                    cpt.initData(player_game_data);//玩家游戏数据
                    cpt.showPoker();
                    this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
                    if (player.userId == cc.dd.user.id)
                        this.showCurOperateBtns();
                }
            } else {//非断线重连
                if (userId == cc.dd.user.id) {//玩家自己
                    this.m_oWaitNode.active = false;
                    var ownInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (ownInfo.getPlayerGameInfo().userState == config_state.UserStateWait) {//自己本身为观众
                        this.m_tPlayerList[player_common_data.pos].getChildByName('readyTag').active = true;
                        //this.m_oMenuNode.getComponent('dsz_game_menu').showChangeBtn();
                        return;
                    }
                }
                if (player_game_data.userState != config_state.UserStateWait && player_game_data.userState != 0) { //游戏中
                    this.m_oMenuNode.getComponent('dsz_game_menu').clearChangeBtnState();
                    this.m_tPlayerList[player_common_data.pos].getChildByName('readyTag').active = false;
                    var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui')
                    cpt.setPlayerData(player_game_data);//玩家游戏数据
                    var ownInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (ownInfo.getPlayerGameInfo().userState == config_state.UserStateWait) {//自己本身为观众
                        cpt.showPoker();
                        this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //默认玩家下注
                    } else {
                        this.freshPlayerCostChipInfo(player, this.m_nBaskChip, true); //默认玩家下注
                    }
                    this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注

                }
            }
        }
    },

    //更新玩家下注数据/玩家身上筹码
    freshPlayerCostChipInfo: function (player, bet, isAct) {
        var pos = player.getPlayerCommonInfo().pos; //获取位置点
        this.m_oChipAreaNode.getComponent('dsz_chip_ui').bet(pos, bet, isAct); //下注筹码动画
        this.m_tPlayerList[pos].getComponent('dsz_player_ui').freshPlayerChip();//玩家更新筹码数据/玩家身上筹码
    },

    //更新桌子总的下注
    freshDeskTotalChip: function (bet) {
        deskData.updateCurBet(bet); //更新当前桌子总压注
        this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
    },

    /////////////////////////////////////////////////////////桌子/玩家数据更新end////////////////////////////////

    /////////////////////////////////////////////////////////桌子/玩家数据更新end////////////////////////////////

    //发牌动画
    sendPoker: function () {
        var playercount = deskData.getPlayerCount();
        this.m_nIndex += 1;
        if (this.m_nIndex > playercount) {
            this.m_nIndex = 0;
            // this.node.stopAllActions();
            this.m_oWaitNode.active = false;
            this.showCurOperateBtns();
            return;
        }
        var pos = playerMgr.getBankerClientPos();

        //执行发牌
        var clientPos = (pos + this.m_nIndex) % playercount;
        var player = playerMgr.findPlayerByUserPos(clientPos);
        if (player) {
            if (player.getPlayerGameInfo().userState != config_state.UserStateWait) {
                var cpt = this.m_tPlayerList[clientPos].getComponent('dsz_player_ui');
                if (cpt) {
                    cpt.sendPoker();
                    AudioManager.getInstance().playSound(Prefix + 'fapai', false);
                }
                var self = this;
                // var action = cc.sequence(cc.delayTime(1), cc.callFunc(function(){
                //     self.sendPoker();
                // }));

                self.sendPoker_id = setTimeout(function () {
                    self.sendPoker();
                }, 800);

                //this.node.runAction(action);
            } else
                this.sendPoker();
        } else {
            this.sendPoker();
        }

    },

    //显示当前按钮
    showCurOperateBtns: function () {
        this.m_oWaitNode.active = false;
        if (playerMgr.playerInfo) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                    }
                }
            }.bind(this))
        }


        this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
        var self = this

        if (cc.dd.user.id == deskData.getCurOpUser()) {//下一个操作玩家是自己
            this.m_oMenuNode.active = true;
            this.m_oMenuNode.getComponent('dsz_game_menu').analysisJbcPlayerOpBtn();
        } else {
            var playerData = playerMgr.findPlayerByUserId(cc.dd.user.id)
            if (playerData) {
                var ownData = playerData.getPlayerGameInfo();
                if (ownData) {
                    this.m_oMenuNode.active = true;
                    if (ownData.userState != config_state.UserStateFold && ownData.userState != config_state.UserStateLost && ownData.userState != config_state.UserStateFire && ownData.userState != config_state.UserStateWait)
                        this.m_oMenuNode.getComponent('dsz_game_menu').showAutoOpBtn();
                    else if (ownData.userState == config_state.UserStateWait || ownData.userState == config_state.UserStateFold || ownData.userState == config_state.UserStateLost) {
                        this.m_oMenuNode.getComponent('dsz_game_menu').showChangeBtn();
                    } else
                        this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();
                }
            }
        }
    },

    //更换下一个操作玩家
    changeActivePlayer: function (userid, nextuserid) {
        this.activePlayer(userid, false);
        this.activePlayer(nextuserid, true);
    },

    //玩家操作倒计时
    activePlayer: function (userid, state) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerState(state, true); //玩家操作状态
            }
        }
    },

    //更新桌子轮数
    updateDeskCircle: function (isUpdate) {
        //轮数
        this.m_oDescTxt.string = '底注:' + this.m_nBaskChip + '  轮数:' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
        //this.m_oCircleTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showWatchPokerDesc(); //刷新看牌描述
            }
        }

        if (isUpdate)
            this.showCurOperateBtns();
    },

    //检查玩家的金币是否充足
    checkPlayerCoin: function () {
        var room_config = require('game_room');
        var configId = 135 * 100 + deskData.getCoinRoomId();

        var data = room_config.getItem(function (item) {
            if (item.key == configId)
                return item;
        });
        var self = this;

        var playerData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
        if (playerData) {
            var curScore = playerData.curScore;
            if (curScore != null && curScore < data.entermin) {
                cc.dd.DialogBoxUtil.show(1, '您的金币不足，不能匹配新的房间，是否前往商城购买！', "text33", 'text31', function () {
                    self.clear();
                    cc.dd.SceneManager.enterHallRecharge();
                },
                    function () {
                        self.clear();
                        cc.dd.SceneManager.enterHall();
                    });
                return false;
            }
            return true;
        }
        return true;
    },

    //重置桌面的数据
    resetDeskData: function () {
        this.m_bClearUI = false;
        cc.log('m_bClearUI============' + this.m_bClearUI);
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').resetPlayerUI(); //重置界面
                }
            }
        }.bind(this));
        deskData.resetDeskData();
        playerMgr.resetAllPlayerData();
        this.m_oMenuNode.getComponent('dsz_game_menu').resetAuto();
        this.m_tPlayerList[0].getChildByName('readyTag').active = false;
        this.updateDeskData();
        // if(this.checkPlayerCoin())
        this.startTime();

        // this.gc_id = setTimeout(function(){
        //     clearTimeout(this.gc_id);
        // }.bind(this), 1000);
    },

    //换桌清理
    clear: function () {
        this.m_bClearUI = false;
        this.m_tPlayerList.forEach(function (ui) {
            ui.active = false;
        })
        //重置桌面显示
        if (playerMgr.playerInfo) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        this.m_tPlayerList[player_common_data.pos].active = false;
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').clearUI(); //重置界面
                    }
                }
            }.bind(this));
            playerMgr.resetAllPlayerData();
            playerMgr.clear();
        }
        this.m_tPlayerList[0].getChildByName('readyTag').active = false;
        deskData.resetDeskData();

        this.updateDeskData();
        this.m_oDescTxt.string = '';
        //require('dsz_player_mgr').DSZ_PlayerMgr.Destroy();
        require('dsz_desk_data').DSZ_Desk_Data.Destroy();
        this.m_oChipAreaNode.getComponent('dsz_chip_ui').clear();
        this.m_bClearChip = false;

    },

    //清理桌子
    clearMainUI: function () {
        this.m_tPlayerList.forEach(function (ui) {
            ui.active = false;
        });
        this.m_oMenuNode.active = false;
    },

    backToHall(event, data) {
        //cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.getInstance().stopMusic();
        cc.dd.SceneManager.enterHall();
    },


    /**
     * 开始倒计时
     */
    startTime: function () {
        this.m_oChipAreaNode.getComponent('dsz_chip_ui').clear();
        this.m_oWaitNode.active = true;
        //var timeout = 9;
        var timeanim = this.m_oWaitNode.getChildByName('timeNode').getComponent(cc.Animation);
        timeanim.node.active = true;
        timeanim.play();
        // this.timeFunc = setInterval(function () {
        //     if (timeout < 0) {
        //         // this.stopTime();
        //         this.sendLeaveRoom();
        //         clearTimeout(this.timeFunc);
        //     } 
        //     --timeout;
        // }.bind(this), 1000);
    },
    //////////////////////////////////////////////////////////////////语音处理begin////////////////////////////////////////

    getSpeakVoice: function (userid, key) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            var sex = player_common_data.sex != 1 ? 0 : 1;
            var voiceArr = config.DSZ_Audio[sex][key];
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
        var text = '';
        var path = '';
        switch (state) {
            case config_state.UserStateFollow:
                text = config.speakText.GZ;
                path = this.getSpeakVoice(userid, 'AUDIO_CALL');
                break;
            case config_state.UserStateAdd:
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
            case config_state.UserStateCmp:
                text = config.speakText.BP;
                path = this.getSpeakVoice(userid, 'AUDIO_CMP');
                break;
            case config_state.UserStateFold:
                text = config.speakText.QP;
                path = this.getSpeakVoice(userid, 'AUDIO_FOLD');
                break;
            case config_state.UserStateWacth:
                text = config.speakText.KP;
                path = this.getSpeakVoice(userid, 'AUDIO_WATCH');
                break;
            default:
                cc.error('dsz_coin_room_ui::synOtherPlayerOperate:为何没有上一个玩家状态！');
                return;
        }
        AudioManager.getInstance().playSound(Prefix + path + '', false);
        //tdk_am.playEffect(path);
        this.activePlayerSpeak(userid, text, state);
    },

    activePlayerSpeak: function (userid, text, state) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var commonData = player.getPlayerCommonInfo();
            this.m_tPlayerList[commonData.pos].getComponent('dsz_player_ui').doSpeak(text, state);
        }
    },
    //////////////////////////////////////////////////////////////////语音处理end////////////////////////////////////////


    /**
     * 点击菜单
     */
    onMenu(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (!this.menu_show) {
            cc.find('menu', this.node).active = true;
            event.target.getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            if (ani._nameToState[ani._defaultClip.name]) {
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
            }
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = true;
        }
        else {
            event.target.getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
    },

    /**
     * 显示设置
     */
    onSetting(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            this.node_setting.active = false;
        }
        else {
            this.menu_show = false;
            this.node_setting.active = true;
            this.node_menu.active = false;
            this.btn_menu.interactable = true;
        }
    },

    /**
     * 显示规则
     */
    onGuize(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            this.node_guize.active = false;
        }
        else {
            this.menu_show = false;
            this.node_menu.active = false;
            this.btn_menu.interactable = true;
            this.node_guize.active = true;
        }
    },

    /**
     * 退出按钮
     */
    onExit(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.node_menu.active = false;
        this.menu_show = false;
        this.btn_menu.interactable = true;
        var selfInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
        var gamedata = selfInfo.getPlayerGameInfo();
        if (gamedata && gamedata.userState == config_state.UserStateWait) {
            this.sendLeaveRoom();
        } else {
            cc.dd.DialogBoxUtil.show(0, '正在游戏中，退出后系统自动操作，是否退出', 'text33', 'Cancel', this.sendLeaveRoom, null, '退出游戏');
        }
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = 135;
        var roomId = roomMgr.roomId;
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
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
            AudioManager.getInstance().onMusic(Prefix + 'zjh_gamebg');
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
                        // var move = cc.moveTo(duration, cc.v2(-50, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', music_Node).active = false;
                        //     cc.find('tao/b', music_Node).active = true;
                        //     cc.find('label_guan', music_Node).active = true;
                        //     AudioManager.getInstance().offMusic();
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
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
                        // cc.find('tao', music_Node).runAction(action);
                        cc.tween(cc.find('tao', music_Node))
                            .to(duration, { position: cc.v2(-50, 0) })
                            .call(function () {
                                cc.find('tao/y', music_Node).active = false;
                                cc.find('tao/b', music_Node).active = true;
                                cc.find('label_guan', music_Node).active = true;
                                AudioManager.getInstance().offMusic();
                            }.bind(this))
                            .start();
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', music_Node).active = true;
                        //     cc.find('tao/b', music_Node).active = false;
                        //     cc.find('label_kai', music_Node).active = true;
                        //     AudioManager.getInstance().onMusic(Prefix + 'zjh_gamebg');
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
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
                        // cc.find('tao', music_Node).runAction(action);
                        cc.tween(cc.find('tao', music_Node))
                            .to(duration, { position: cc.v2(46.6, 0) })
                            .call(function () {
                                cc.find('tao/y', music_Node).active = true;
                                cc.find('tao/b', music_Node).active = false;
                                cc.find('label_kai', music_Node).active = true;
                                AudioManager.getInstance().onRawMusic(this.music_clip);
                            }.bind(this))
                            .start();
                    }
                }
                break;
            case 'sound':
                var sound_Node = this.sound_Node;
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(-50, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', sound_Node).active = false;
                        //     cc.find('tao/b', sound_Node).active = true;
                        //     cc.find('label_guan', sound_Node).active = true;
                        //     AudioManager.getInstance().offSound();
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
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
                        // cc.find('tao', sound_Node).runAction(action);
                        cc.tween(cc.find('tao', sound_Node))
                            .to(duration, { position: cc.v2(-50, 0) })
                            .call(function () {
                                cc.find('tao/y', sound_Node).active = false;
                                cc.find('tao/b', sound_Node).active = true;
                                cc.find('label_guan', sound_Node).active = true;
                                AudioManager.getInstance().offSound();
                            }.bind(this))
                            .start();
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(43, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', sound_Node).active = true;
                        //     cc.find('tao/b', sound_Node).active = false;
                        //     cc.find('label_kai', sound_Node).active = true;
                        //     AudioManager.getInstance().onSound();
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
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
                        // cc.find('tao', sound_Node).runAction(action);
                        cc.tween(cc.find('tao', sound_Node))
                            .to(duration, { position: cc.v2(43, 0) })
                            .call(function () {
                                cc.find('tao/y', sound_Node).active = true;
                                cc.find('tao/b', sound_Node).active = false;
                                cc.find('label_kai', sound_Node).active = true;
                                AudioManager.getInstance().onSound();
                            }.bind(this))
                            .start();
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

    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('dsz_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
                cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
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
                // var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                // this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                cc.tween(this.contentZm)
                    .to(1, { position: { value: cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)), easing: "quintOut" } })
                    .call(func)
                    .start();
            }
        }
    },
    preZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm - 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                // var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                // this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                cc.tween(this.contentZm)
                    .to(1, { position: { value: cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)), easing: "quintOut" } })
                    .call(func)
                    .start();
            }
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
                    this.m_bShowChat = false;
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
        if (this.m_bShowChat) {
            cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            this.m_bShowChat = false;
        }
        // if (cc.find('player_down/beilv/detail', this.node).active == true) {`
        //     cc.find('player_down/beilv/detail', this.node).active = false;
        // }
    },

    /**
     * 退出房间
     */
    on_room_leave: function (data) {
        if (data.userId == cc.dd.user.id) {
            this.clear();
            cc.dd.SceneManager.enterHall();
        }
    },

    /**
     * 聊天按钮
     */
    onClickChat: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            if (player.getPlayerGameInfo().userState == config_state.UserStateWait) {
                cc.dd.PromptBoxUtil.show('观战状态不能聊天');
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
            user_info.setData(135, deskData.getCoinRoomId(), null, false, playerData);
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

            var gameType = 135;
            var roomId = deskData.getCoinRoomId();

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
            var gameType = 135;
            var roomId = deskData.getCoinRoomId();
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
                var cfg = config.DSZ_Audio;

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
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showChat(str);
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
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showEmoji(data.id);
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
        // var view = this.idToView(id);
        // var head = this.getHeadByView(view);
        // var pos = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
        // return pos;
    },

    //转换筹码字
    convertChipNum: function (num) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(2) + '万';
        } else if (num >= 100000000)
            str = Math.ceil(num / 100000000).toFixed(2) + '亿';
        return str
    },


    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case playerEvent.DSZ_PLAYER_ENTER: //玩家进入
                this.playerEnter(data);
                break;
            case playerEvent.DSZ_PLAYER_READY: //玩家准备
                this.playerReady_Rsp(data);
                break;
            case playerEvent.DSZ_PLAYER_INIT_DATA: //玩家数据实例化
                this.initPlayerGameData(data);
                break;
            case playerEvent.DSZ_PLAYER_WATCH_POKER: //玩家看牌
                this.playerWatch_Rsp(data);
                break;
            case playerEvent.DSZ_PLYER_EXIT: //玩家离开
                this.playerLeave_Rsp(data);
                break;
            case playerEvent.PLAYER_ISONLINE: //玩家在线状态
                this.playerOnline(data);
                break;
            case playerEvent.DSZ_PLAYER_CLEAR:
                cc.log('mseg==========clearui++++' + this.m_bClearUI)
                this.m_bClearUI = false;
                this.m_oChipAreaNode.getComponent('dsz_chip_ui').clear();
                break;
            case deskEvent.DSZ_DEDSK_SEND_POKER: //发牌
                this.updateDeskCircle(false);
                this.sendPoker();
                break;
            case deskEvent.DSZ_DEDSK_CALL: //跟注
                this.playerAddChip_Rsp(data, true);
                break;
            case deskEvent.DSZ_DEDSK_UPDATE_CIRCLE: //更新轮数
                this.updateDeskCircle(true);
                break;
            case deskEvent.DSZ_DEDSK_COMPARE: //比牌
                this.playerCmp_Rsp();
                break;
            case deskEvent.DSZ_DEDSK_COMPARE_RESULT: //比牌结果
                this.playerCmpResult_Rsp(data.userId, data.cmpId, data.winner);
                break;
            case deskEvent.DSZ_DEDSK_FOLD: //弃牌
                this.playerFold_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_FIRE://火拼
                this.playerFire_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_ALL_IN://孤注一掷
                this.playAllInAct(data);
                break;
            case deskEvent.DSZ_DEDSK_SHOW_ROUND_RESULE: //单局结算
                this.roundResut_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_SHOW_RESULE: //总结算
                this.showResultTotal_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_DISSOVlE: //解散消息
                this.showDissolve(data);
                break;
            case deskEvent.DSZ_DEDSK_DISSOVLE_RESULT: //解散结果
                this.showDissolveResult(data);
                break;
            case deskEvent.DSZ_DEDSK_ERROR:
                this.m_oMenuNode.getComponent('dsz_game_menu').showAutoOpBtn();
                break;
            case deskEvent.CHECK_PLAYER_ALL_READY:
                this.m_bClearChip = false;
                break;
            case commonRoomEvent.on_room_replace: //换桌成功
                if (data[0].retCode == 0)
                    this.clear();
                else if (data[0].retCode == 1)
                    this.checkPlayerCoin();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                // this.node.stopAllActions();
                this.clear();
                this.backToHall();
                break;
            case RoomEvent.on_room_leave:
                if (data[0].retCode == 0) {
                    if (data[0].userId == cc.dd.user.id) {
                        var str = '';
                        if (data[0].coinRetCode == null) {
                            // this.node.stopAllActions();
                            this.clear();
                            this.backToHall();
                            return;
                        }
                        switch (data[0].coinRetCode) {
                            case 0:
                                // this.node.stopAllActions();
                                this.clear();
                                this.backToHall();
                                return;
                            case 1:
                                str = '您的金币小于该房间最低金币限制';
                                break;
                            case 2:

                                str = '金币超过当前房间最大值，请选择其他高倍房间';
                                break;
                            case 3:
                                str = '由于您长时间未操作，系统将您切换到大厅';
                                break;
                        }

                        cc.dd.DialogBoxUtil.show(0, str, "text33", null, function () {
                            // this.node.stopAllActions();
                            this.clear();
                            this.backToHall();
                        }.bind(this), null);
                    }
                }
                break;
        }
    },
});
