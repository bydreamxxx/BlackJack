// create by wj 2019/04/28

var deskData = require('new_dsz_desk').New_DSZ_Desk_Data.Instance();
var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
var playerEd = require('new_dsz_player_manager').New_DSZ_PlayerED;
var playerEvent = require('new_dsz_player_manager').New_DSZ_PlayerEvent;
var deskEd = require('new_dsz_desk').New_DSZ_Desk_Ed;
var deskEvent = require('new_dsz_desk').New_DSZ_Desk_Event;

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

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
const hall_prop_data = require('hall_prop_data').HallPropData;

var replay_data = require('com_replay_data').REPLAY_DATA;
var REPLAY_ED = require('com_replay_data').REPLAY_ED;
var REPLAY_EVENT = require('com_replay_data').REPLAY_EVENT;
const proto_id = require('c_msg_yq_pin3_cmd');
const ddz_proto_id = require('c_msg_doudizhu_cmd');

const replayProto = {
    initPlayer: 'cmd_record_room_info',             //初始化玩家
    initGame: 'cmd_msg_yq_pin3_state_info',            //初始化游戏
    op: 'cmd_msg_yq_pin3_op_ret',                       //游戏操作
    watch: 'cmd_msg_yq_pin3_watch_ret',                 //看牌
    cmp: 'cmd_msg_yq_pin3_cmp_ret',                     //比牌
    update: 'cmd_msg_yq_pin3_update',                   //轮数更新
    result: 'cmd_yq_pin3_result',                   //结算

};

const stepTime = 1;//单步间隔


cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerList: [],
        m_tChipStartNode: [],
        m_tPlayerPanel: { default: [], type: cc.Node, tooltip: '人数Panel' },
        m_tBtnPanel: { default: [], type: cc.Node, tooltip: '按钮Panel' },

        m_nIndex: 0,//发牌索引计数
        m_bContinue: false,
        m_bCanTotalResult: true,

        slider_bar: { type: cc.Node, default: null },
        handler_bar: { type: cc.Node, default: null },
        m_oBetList: [],
        bgNode: cc.Node,
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

        deskData.initFRoom();
        this.m_nBaskChip = 0;
        //总筹码
        this.m_oTotalChipsTxt = cc.dd.Utils.seekNodeByName(this.node, "totaleBet").getComponent(cc.Label);
        //轮数
        this.m_oDescTxt = cc.dd.Utils.seekNodeByName(this.node, "round").getComponent(cc.Label);
        //底注
        this.m_oBaseBet = cc.dd.Utils.seekNodeByName(this.node, "baseBet").getComponent(cc.Label);
        //游戏规则
        this.m_oRuleTxt = cc.dd.Utils.seekNodeByName(this.node, "ruleDesc").getComponent(cc.Label);
        //玩家列表/筹码起始点
        var playercount = deskData.getPlayerCount();
        var index = playercount == 6 ? 0 : 1;
        if (playercount == 6) {
            this.m_tPlayerPanel[0].active = true;
            this.m_tPlayerPanel[1].active = false;
            this.m_tBtnPanel[0].active = true;
            this.m_tBtnPanel[1].active = false;
        } else {
            this.m_tPlayerPanel[1].active = true;
            this.m_tPlayerPanel[0].active = true;
            this.m_tBtnPanel[1].active = true;
            this.m_tBtnPanel[0].active = true;
        }

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
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').initChip();
        //按钮区域
        this.m_oMenuNode = cc.dd.Utils.seekNodeByName(this.node, 'btnPanel');
        this.m_oMenuNode.active = true;
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

        this.init(); //初始化数据
        //this.initPlayer();//初始化玩家数据
        AudioManager.getInstance().onMusic(Prefix + 'yqp3_bgm');

        this.slider_bar.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.slider_bar.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this));
        this.slider_bar.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        REPLAY_ED.addObserver(this);

    },

    onDestroy: function () {
        playerEd.removeObserver(this);
        deskEd.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        ChatEd.removeObserver(this);
        RecordEd.removeObserver(this);
        REPLAY_ED.removeObserver(this);
    },

    init: function () {
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();
        this._playIndex = 0;
        var data = replay_data.Instance().getMsgList();
        this._replayData = this.filterMsgList(data);
        this.initData(this._replayData);
        this.initRoundList();
        this.initHandler();
        this.freshSceneByIndex(this._playIndex, true);
        this.initPlay();
        this.updateDeskData();
        this.initPlayer();
    },

    //初始化回放协议
    initData: function (data) {
        var initMsg = this.getMsgByProto(replayProto.initPlayer);
        playerMgr.updatePlayerNum(); //更新玩家管理器
        var ownenter = false;
        for (var i = 0; i < initMsg.playerInfoList.length; i++) {
            var player = initMsg.playerInfoList[i];
            if (player && player.userId == cc.dd.user.id) {
                ownenter = true;
                break;
            }
        }
        initMsg.playerInfoList.forEach(function (role_Info) {
            playerMgr.playerRecordEnter(role_Info, ownenter); //模拟玩家进入，刷新界面
        })
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
            this.m_nBaskChip = parseInt(base[1]);
            this.m_oBaseBet.string = this.m_nBaskChip; //底注
            this.m_oDescTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount(); //轮数
        }
        //房间号
        var ruleStr = '房间号:' + deskData.getRoomId() + '\n' + this.analysisRule();

        this.m_oRuleTxt.string = ruleStr;
    },

    //初始玩家数据
    initPlayer: function () {
        var self = this;
        if (playerMgr.playerInfo) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player)
                    self.playerEnter(player.userId);
            });
            this.updateDeskData();
        }
    },

    //玩家进入/断线重连均使用这个
    playerEnter: function (userId) {
        cc.dd.Utils.seekNodeByName(this.node, 'preparedesc').active = false;
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

            cc.dd.Utils.seekNodeByName(playerNode, 'name').getComponent(cc.Label).string = cc.dd.Utils.substr(commonData.name, 0, 4); //玩家名字
            var coin = deskData.checkGameIsFriendType() ? 0 : commonData.coin; //朋友场默认为0， 金币场默认为玩家身上金币
            cc.dd.Utils.seekNodeByName(playerNode, 'coin').getComponent(cc.Label).string = coin; //玩家进入金币
        }
    },

    //发牌动画
    sendPoker: function () {
        var playercount = playerMgr.getRealPlayerCount();
        playerMgr.playerInfo.forEach(function (player, index) {
            if (player) {
                if (player.getPlayerGameInfo().userState != config_state.UserStateWait) { //玩家不是旁观状态
                    var commonData = player.getPlayerCommonInfo();
                    var cpt = this.m_tPlayerList[commonData.pos].getComponent('new_dsz_player_ui');
                    if (cpt) {
                        cpt.sendPokerRecord(); //发牌
                        AudioManager.getInstance().playSound(Prefix + 'yqp3_fapai', false);
                    }
                }
            }
            if (index == playercount - 1) {
                this.node.stopAllActions();
                this.showCurOperateBtns();
                AudioManager.getInstance().playSound(Prefix + 'yqp3_kaishi', false);
            }
        }.bind(this));

    },

    //跟注/加注操作
    playerAddChip_Rsp: function (userId, playAudio) {
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            var player_game_data = player.getPlayerGameInfo(); //游戏数据
            if (player_game_data) {
                if (playAudio) //如果需要播放跟注/加注音效
                    this.synOtherPlayerOperate(userId, player_game_data.userState);
                AudioManager.getInstance().playSound(Prefix + 'yqp3_genzhu', false); //抛筹码音效
                this.freshPlayerCostChipInfo(player, player_game_data.lastBet, true); //更新玩家筹码显示
                this.freshDeskTotalChip(parseInt(player_game_data.lastBet)); //更新桌子筹码显示
            }
            if (playAudio)
                this.showCurOperateBtns();
        }
    },

    //玩家弃牌
    playerFold_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId); //获取玩家数据
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateFold); //解析弃牌操作
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').fold(); //玩家弃牌
            }
            player.updatePlayerPokerState(3);
        }
        this.showCurOperateBtns(); //显示按钮
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
            if (self.m_bNeedRoundCallBack)
                self.roundResut_Rsp(self.m_oRoundData);
            else
                self.showCurOperateBtns();
        }

        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_compare', function (ui) {
            var cpt = ui.getComponent('new_dsz_compare_ui');
            cpt.playerCompareAct(userId, cmpUserId, WinnerId, callBack);

        }.bind(this));
    },


    //单局结算
    roundResut_Rsp: function (data) {
        cc._pauseLMAni = true;
        this.m_bCanTotalResult = false;

        this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
        if (deskData.getCurCircle() >= deskData.getTotalCircleCount() && !this.allCompare) {
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
        } else {
            this.m_bNeedRoundCallBack = false;
            this.m_oRoundData = null;

            this.allCompare = false;
            this.m_bPlayAct = false;

            data.forEach(function (info) {
                var player = playerMgr.findPlayerByUserId(info.userId);
                if (player) {
                    if (player.userId == cc.dd.user.id) {
                        //if(info.isWin)
                        //AudioManager.getInstance().playSound(Prefix + 'finalWin' , false);
                    }
                    var player_common_data = player.getPlayerCommonInfo();
                    if (info.score < 0)
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setResult(info.score, info.luckyScore); //设置单人的结算
                    else
                        this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setResult(info.score - player.getPlayerGameInfo().betScore, info.luckyScore); //设置单人的结算

                    //if(deskData.getWatchAll())
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showPokerFace(); //开牌
                    if (info.isWin) {
                        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').result(player_common_data.pos); //收筹码的动画
                        player.getPlayerGameInfo().curScore += info.score;
                    }
                    player.getPlayerGameInfo().curScore -= info.severPay;
                    if (player.getPlayerGameInfo().curScore <= 0)
                        player.getPlayerGameInfo().curScore = 0;

                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').freshPlayerChip();//刷新玩家身上筹码值

                }
            }.bind(this));
            this.m_bClearUI = false;
            var time = 4000;
            if (!this.m_bNeedDelay) {
                time = 4000;
                this.m_bNeedDelay = true;
            }

            self.roundResutCall_id = setTimeout(function () {
                self.resetFDeskData(); //清理朋友场桌子
                self.m_bCanTotalResult = true;

                cc._pauseLMAni = false;
                clearTimeout(self.roundResutCall_id);
                self.roundResutCall_id = 0
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
        var generateTimeStr = function (date) {
            var pad2 = function (n) { return n < 10 ? '0' + n : n };
            return date.getFullYear().toString() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + '  ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
        };

        var zjNode = cc.find('zhanjitongji', this.node);
        zjNode.active = true;

        var roomId = deskData.getRoomId();
        var totalRound = deskData.getTotalRoundCount();
        var strTime = generateTimeStr(new Date(msg.time * 1000));
        cc.find('time/room_number', zjNode).getComponent(cc.Label).string = roomId.toString();
        cc.find('time/total_round', zjNode).getComponent(cc.Label).string = '共' + totalRound.toString() + '局';
        cc.find('time/time_lbl', zjNode).getComponent(cc.Label).string = strTime;

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
            this.clear();
            this.backToHall();
        } else {
            var player = playerMgr.findPlayerByUserId(data.userId)
            if (player.isRoomer) {//房主解散房间
                this.clear();
                cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", 'text33', null, function () {
                    cc.dd.SceneManager.enterHall();
                }, function () {
                });
            } else {//玩家离开房间
                this.m_tPlayerList[data.pos].active = false;
                this.m_tPlayerList[data.pos].getComponent('new_dsz_player_ui').clearUI();
                this.m_oStartBtn.getComponent(cc.Button).interactable = false;
            }
        }
    },


    /////////////////////////////////////////////////////////玩家操作end//////////////////////////////////////////

    /////////////////////////////////////////////////////////桌子/玩家数据更新begin////////////////////////////////
    //实例化玩家数据
    initPlayerGameData: function (userId, act) {
        this.m_bInitChip = true;

        if (userId == cc.dd.user.id) {
            this.m_oStartBtn.active = false;
            this.m_oPrepareBtn.active = false;
            this.m_oreStartBtn.active = false;
            this.m_orePrepareBtn.active = false;
        }

        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_game_data = player.getPlayerGameInfo();
            var player_common_data = player.getPlayerCommonInfo();

            if (act) {//如果不需要动画
                var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui')
                cpt.setPlayerData(player_game_data);//玩家游戏数据
                //cpt.showWatchPokerDesc();
                this.freshPlayerCostChipInfo(player, this.m_nBaskChip, true); //默认玩家下注
                this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
            } else {
                this.m_bContinue = true;

                if (deskData.getCurDeskState() != 1) {//游戏已经开始
                    var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui');
                    cpt.initData(player_game_data);//玩家游戏数据
                    cpt.showPokerFace();
                    cpt.freshPlayerChip();//玩家更新筹码数据/玩家身上筹码
                    if (player_game_data.pokersState == 1) {
                        cpt.getComponent('new_dsz_player_ui').watchRecord(); //玩家看牌
                        if (player.userId != cc.dd.user.id)
                            cpt.setPlayerPokerState(2)
                    }

                    //this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
                    if (player.userId == cc.dd.user.id)
                        this.showCurOperateBtns();
                    this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
                }
            }
        }
    },

    //显示当前按钮
    showCurOperateBtns: function () {
        this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
        this.m_oMenuNode.active = false;

        // if(cc.dd.user.id == deskData.getCurOpUser()){//下一个操作玩家是自己
        //     this.m_oMenuNode.getComponent('new_dsz_menu').analysisPlayerOpBtn();
        // }else{
        //     var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
        //     if(ownData.userState != config_state.UserStateFold && ownData.userState != config_state.UserStateLost && ownData.userState != config_state.UserStateWait){
        //         this.m_oMenuNode.getComponent('new_dsz_menu').enabelAllBtn(false);
        //     }
        //     else
        //         this.m_oMenuNode.getComponent('new_dsz_menu').hideAllBtn();
        //}
    },

    //更新玩家下注数据/玩家身上筹码
    freshPlayerCostChipInfo: function (player, bet, isAct) {
        var pos = player.getPlayerCommonInfo().pos; //获取位置点
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').bet(pos, bet, isAct); //下注筹码动画
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
                if (userid == cc.dd.user.id) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc();
                }

                if (deskData.getFoldTime() == 0)
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerState(state, false); //玩家操作状态
                else
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').setPlayerState(state, true); //玩家操作状态
            }
        }
    },

    //更新桌子轮数
    updateDeskCircle: function (isUpdate) {
        //轮数
        this.m_oDescTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount(); //轮数
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').showWatchPokerDesc(); //刷新看牌描述
            }
        }

        if (isUpdate)
            this.showCurOperateBtns();
    },

    //规则解析
    analysisRule: function () {
        var playmodel = deskData.getPlayModel() //游戏模式
        var luckyType = deskData.getLuckyType() //喜分类型
        var ruleList = deskData.getPlayRule(); //玩法

        var ruleStr = playmodel == 1 ? '标准模式/' : '大牌模式(无2-8)/';
        ruleList.forEach(function (rule) {
            switch (rule) {
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

    clear: function () {
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').clearRecordUI(); //重置界面
                }
            }
        }.bind(this));
        this.m_bClearChip = false;
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();
    },

    //返回大厅
    backToHall(event, data) {
        //cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.getInstance().stopMusic();
        cc.dd.SceneManager.enterHall();
    },

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
                path = this.getSpeakVoice(userid, 'AUDIO_CALL');
                break;
            case config_state.UserStateAdd: //加注
                path = this.getSpeakVoice(userid, 'AUDIO_ADD');
                break;
            case config_state.UserStateFire:
                path = this.getSpeakVoice(userid, 'AUDIO_FIRE');
                break;
            case config_state.UserStateTry:
                path = this.getSpeakVoice(userid, 'AUDIO_ALLIN');
                break;
            case config_state.UserStateCmp: //比牌
                path = this.getSpeakVoice(userid, 'AUDIO_CMP');
                break;
            case config_state.UserStateFold: //弃牌
                path = this.getSpeakVoice(userid, 'AUDIO_FOLD');
                break;
            case config_state.UserStateWacth: //看牌
                path = this.getSpeakVoice(userid, 'AUDIO_WATCH');
                break;
            default:
                cc.error('dsz_coin_room_ui::synOtherPlayerOperate:为何没有上一个玩家状态！');
                return;
        }
        AudioManager.getInstance().playSound(Prefix + path + '', false);
        //tdk_am.playEffect(path);
        //this.activePlayerSpeak(userid, text, state);
    },

    //////////////////////////////////////////////////////////////////语音处理end////////////////////////////////////////

    //////////////////////////////////////////播放器操作begin/////////////////////////////////

    /**
     * 获取指定消息
     * @param {String} str 
     */
    getMsgByProto(str) {
        for (var i = 0; i < this._replayData.length; i++) {
            if (this._replayData[i].id == ddz_proto_id[str]) {
                return this._replayData[i].content;
            } else if (this._replayData[i].id == proto_id[str]) {
                return this._replayData[i].content;
            }
        }
        return null;
    },

    //初始化局数列表
    initRoundList() {
        var parent = cc.dd.Utils.seekNodeByName(this.node, 'content');
        for (var i = parent.childrenCount - 1; i > -1; i--) {
            var rNode = parent.children[i];
            if (rNode.name != 'back') {
                rNode.removeFromParent();
                rNode.destroy();
            }
        }

        var round = replay_data.Instance().totalRound;
        var template = cc.dd.Utils.seekNodeByName(this.node, 'back');
        for (var i = 1; i < round + 1; i++) {
            var newNode = cc.instantiate(template);
            newNode.name = i.toString();
            // if (newNode.name == this.dangqian_ju.string) {
            //     newNode.getComponent(cc.Button).interactable = false;
            // }
            newNode.getChildByName('label').getComponent(cc.Label).string = i.toString();
            parent.addChild(newNode);
        }
    },

    //显示局数列表
    onOpenRoundList(event, data) {
        hall_audio_mgr.com_btn_click();
        this.showRoundList(true);
    },

    //换局
    onChangeRound(event, data) {
        hall_audio_mgr.com_btn_click();
        if (event.target.name == 'back') {
            this.showRoundList(false);
        }
        else {
            var round = parseInt(event.target.name);
            replay_data.Instance().changeRound(round);
        }
    },

    //显示局数列表 !bool 关闭
    showRoundList(bool) {
        if (bool) {
            if (!this._ani_menu) {
                this._ani_menu = true;
                var ani = cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation);
                if (ani._nameToState[ani._defaultClip.name]) {
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                }
                var func = function () {
                    cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation).off('finished', func, this);
                    cc.dd.Utils.seekNodeByName(this.node, 'changeRound').active = false;
                    this._ani_menu = false;
                    this.roundListActive = true;
                }.bind(this);
                cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation).on('finished', func, this);
                cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation).play();
            }
        }
        else {
            if (!this._ani_menu) {
                this._ani_menu = true;
                var ani = cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation);
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                var func = function () {
                    cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation).off('finished', func, this);
                    cc.dd.Utils.seekNodeByName(this.node, 'changeRound').active = true;
                    this._ani_menu = false;
                    this.roundListActive = false;
                }.bind(this);
                cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation).on('finished', func, this);
                cc.dd.Utils.seekNodeByName(this.node, 'roundlist').getComponent(cc.Animation).play();
            }
        }
    },
    /**
     * 播放器按钮点击
     * @param {*} event 
     * @param {*} data 
     */
    onPlayBtn(event, data) {
        switch (data) {
            case 'play':
                if (cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string == this.totalStep.toString()) {
                    return;
                }
                this._pause = !this._pause;
                this.showPlayBtn(this._pause);
                break;
            case 'forward':                    //快进(前进一步并暂停)
                this._pause = true;
                this.showPlayBtn(this._pause);
                if (this._playIndex < this.totalStep) {
                    var step = ++this._playIndex;
                    cc.dd.Utils.seekNodeByName(this.node, 'slider').getComponent(cc.Slider).progress = step / this.totalStep;
                    cc.dd.Utils.seekNodeByName(this.node, 'progressbar').getComponent(cc.ProgressBar).progress = step / this.totalStep;
                    cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = this._playIndex.toString();
                    this.freshSceneByIndex(step, false);
                }
                break;
            case 'backward':                    //快退(后退一步并暂停)
                this._pause = true;
                this.showPlayBtn(this._pause);
                if (this._playIndex > 1) {
                    var step = --this._playIndex;
                    cc.dd.Utils.seekNodeByName(this.node, 'slider').getComponent(cc.Slider).progress = step / this.totalStep;
                    cc.dd.Utils.seekNodeByName(this.node, 'progressbar').getComponent(cc.ProgressBar).progress = step / this.totalStep;
                    cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = this._playIndex.toString();
                    this.freshSceneByIndex(step, false);
                }
                break;
        }
    },

    //初始化进度条
    initHandler() {
        this._pause = false;
        this.showPlayBtn(this._pause);
        this.totalStep = this._replayData.length - 1;
        cc.dd.Utils.seekNodeByName(this.node, 'slider').getComponent(cc.Slider).progress = 0;
        cc.dd.Utils.seekNodeByName(this.node, 'progressbar').getComponent(cc.ProgressBar).progress = 0;
        cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = '0';
        cc.dd.Utils.seekNodeByName(this.node, 'total_num').getComponent(cc.Label).string = this.totalStep.toString();
    },

    /**
     * 初始化播放
     */
    initPlay() {
        this.unschedule(this.runStep);
        this.scheduleOnce(function () {
            this.schedule(this.runStep, stepTime);
        }.bind(this), stepTime);
    },

    //单步播放
    runStep() {
        if (!this._pause) {
            if (this._playIndex < this.totalStep) {
                var msg = this._replayData[++this._playIndex];
                this.stepBy(msg);       //数据同步
                this.handlerMsg(msg);   //播放消息
                //进度条滚动
                this.handler_time = 0;
                var timer = 0.05;
                var handlerRun = function () {
                    if (this._pause) {
                        this.unschedule(handlerRun);
                        return;
                    }
                    this.handler_time += timer;
                    cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = (this._playIndex - 1).toString();
                    if (this.handler_time >= stepTime) {
                        this.handler_time = stepTime;
                        cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = this._playIndex.toString();
                        this.unschedule(handlerRun);
                        if (this._playIndex == this.totalStep) {
                            this._pause = true;
                            this.showPlayBtn(this._pause);
                        }
                    }
                    cc.dd.Utils.seekNodeByName(this.node, 'slider').getComponent(cc.Slider).progress = (1 / this.totalStep * (this._playIndex - 1)) + (1 / this.totalStep) * (this.handler_time / stepTime);
                    this.node.getComponentInChildren('syncPbarSlider').sync();
                }.bind(this);
                this.unschedule(handlerRun);
                this.schedule(handlerRun, timer);
            }
        }
    },

    //播单步操作
    handlerMsg(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.initGame]://初始游戏数据
                deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_SEND_POKER);
                break;
            case proto_id[replayProto.op]://操作
                if (msg.content.opType != 3)
                    deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_CALL, msg.content.userId);
                else
                    deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_FOLD, msg.content.userId);
                break;
            case proto_id[replayProto.cmp]://比牌
                deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_COMPARE_RESULT, msg.content);
                break;
            case proto_id[replayProto.result]://结算
                deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_SHOW_ROUND_RESULE, msg.content.scoreResultList);
                break;
            case proto_id[replayProto.update]://更新轮数
                deskEd.notifyEvent(deskEvent.New_DSZ_DEDSK_UPDATE_CIRCLE);
                break;
            case proto_id[replayProto.watch]://看牌
                playerEd.notifyEvent(playerEvent.New_DSZ_PLAYER_WATCH_POKER, msg.content.poker.userId);
                break;
        }
    },

    bgClick() {
        if (this.roundListActive == true) {
            this.showRoundList(false);
            return;
        }
        this.handler_bar.active = !this.handler_bar.active;
    },

    //进度条拖动
    onSliderMove(event, data) {
        this._pause = true;
        this.showPlayBtn(this._pause);
        // var progress = event.progress;
        // var step = Math.floor(progress * this.totalStep);
        // if (this._playIndex != step) {
        //     this._playIndex = step;
        //     cc.find('btns/handler_bar/cur_num', this.node).getComponent(cc.Label).string = this._playIndex.toString();
        //     this.freshSceneByIndex(step);
        // }
        var progress = event.progress;
        var step = Math.floor(progress * this.totalStep);
        cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = step.toString();
        if (!this.progress_bar_scrolling) {
            this.touchEnd(null, 1);
        }
    },

    touchStart: function () {
        this.progress_bar_scrolling = true;
    },
    touchMove: function () {
        this.progress_bar_scrolling = true;
    },
    touchEnd(event, data) {
        this.progress_bar_scrolling = false;
        var progress = this.slider_bar.parent.getComponent(cc.Slider).progress;
        var step = Math.floor(progress * this.totalStep);
        if (this._playIndex != step) {
            this._playIndex = step;
            cc.dd.Utils.seekNodeByName(this.node, 'cur_num').getComponent(cc.Label).string = this._playIndex.toString();
            if (step == 0)
                step = 1;
            this.freshSceneByIndex(step, false);
        }
    },

    //退出
    onExit(event, data) {
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 显示播放 暂停按钮   
     * True显示播放  False显示暂停
     * @param {Boolean} bool 
     */
    showPlayBtn(bool) {
        if (bool) {
            cc.dd.Utils.seekNodeByName(this.node, 'play').active = true;
            cc.dd.Utils.seekNodeByName(this.node, 'pause').active = false;
        }
        else {
            cc.dd.Utils.seekNodeByName(this.node, 'play').active = false;
            cc.dd.Utils.seekNodeByName(this.node, 'pause').active = true;
        }
    },

    /**
     * 刷新界面到指定步数
     * @param {Number} index 
     */
    freshSceneByIndex(index, isStart) {
        cc.dd.NetWaitUtil.show('正在缓冲');
        var startTime = new Date().getTime();
        this.genDataByIndex(index);
        // if(!isStart){
        //     this.clear();
        //     playerMgr.playerInfo.forEach(function(player){
        //         if(player)
        //             this.initPlayerGameData(player.userId, false);
        //     }.bind(this));

        //     this.m_oBetList.forEach(function(num, index){
        //         this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').bet(null, num, false); //下注筹码动画
        //         if(index > 2)
        //             this.freshDeskTotalChip(num);
        //     }.bind(this));
        // }
        // var status = this.playingData.playStatus;
        // if (status == replayProto.result) {
        //     this.showResult(this.playingData.resultMsg, false);
        // }
        // else {
        //     cc.find('result_ani', this.node).active = false;
        // }
        // for (var i = 0; i < this.playingData.bottomPokers.length; i++) {
        //     var dipai_node = cc.dd.Utils.seekNodeByName(this.node, 'dipai_info/dipai_' + (i+1).toString);
        //     this.setDipai(dipai_node, this.playingData.bottomPokers[i]);
        // }
        // this.calSpecialBottom(this.playingData.bottomPokers.length);
        // this._uiComponents[0].showBeilv({ total: this.playingData.beishu, });
        // for (var i = 0; i < this.playingData.playerList.length; i++) {
        //     var view = this.idToView(this.playingData.playerList[i].userId);
        //     this._uiComponents[view].refreshPlayerUI(status, this.playingData.playerList[i])
        // }
        var endTime = new Date().getTime();
        cc.log('刷新到' + index + '步,消耗' + (endTime - startTime) + 'ms');
        cc.dd.NetWaitUtil.close();
    },

    /**
     * 生成指定步数的数据
     * @param {Number} index
     */
    genDataByIndex(index) {
        this.resetPlayingDataToOrigin();
        for (var i = 0; i < index; i++) {
            var msg = this._replayData[i + 1];
            this.stepBy(msg);
        }
    },

    /**
     * 单步数据处理
     * @param {*} msg 
     */
    stepBy(msg) {
        var id = msg.id;
        switch (id) {
            case proto_id[replayProto.initGame]://游戏初始化
                deskData.initRecordDesk(msg.content);
                for (var i = 0; i < playerMgr.getRealPlayerCount(); i++)
                    this.m_oBetList.push(this.m_nBaskChip);
                break;
            case proto_id[replayProto.op]://操作
                var opState = 1;
                var opBet = 0;
                var betLevel = 0;
                switch (msg.content.opType) {
                    case 1:
                        opBet = msg.content.bet;
                        opState = 3;
                        betLevel = msg.content.betLevel;
                        break;
                    case 2:
                        opBet = msg.content.bet;
                        opState = 4;
                        betLevel = msg.content.betLevel;
                        break;
                    case 3:
                        opState = 13;
                        break;
                }
                deskData.playerNormalOp(msg.content.userId, opBet, opState);
                if (this._pause) {
                    var player = playerMgr.findPlayerByUserId(msg.content.userId)
                    if (player) {
                        this.m_oBetList.push(opBet);
                    }
                }
                deskData.setLastOpUser(msg.content.userId);
                deskData.setCurOpUser(msg.content.nextOpUserId);
                if (msg.content.opType != 3)
                    deskData.setCurBetLevel(betLevel);
                break;
            case proto_id[replayProto.cmp]://比牌
                deskData.playerCmpResult(msg.content.userId, msg.content.cmpId, msg.content.winner, msg.content.bet);
                if (this._pause) {
                    var player = playerMgr.findPlayerByUserId(msg.content.userId)
                    if (player) {
                        this.m_oBetList.push(msg.content.bet);
                    }
                }
                deskData.setLastOpUser(msg.content.userId);
                deskData.setCurOpUser(msg.content.nextOpUserId);
                break;
            case proto_id[replayProto.result]://结算
                deskData.setPlayerPokers(msg.content.pokersList);

                break;
            case proto_id[replayProto.update]://更新轮数
                deskData.setCurCircle(msg.content.value);
                break;
            case proto_id[replayProto.watch]://看牌
                playerMgr.playerRecordPokerInfo(msg.content.poker);
                break;
        }
    },

    //重置播放数据初始化
    resetPlayingDataToOrigin() {
        this.m_oBetList.splice(0, this.m_oBetList.length);
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('new_dsz_player_ui').clearRecordUI(); //重置界面
                }
            }
        }.bind(this));
        playerMgr.reverseRecordData();
        deskData.resetDeskData();
        this.m_oChipAreaNode.getComponent('new_dsz_chip_ui').clear();

    },

    //对象拷贝
    deepCopy(obj) {
        if (typeof obj != 'object' || obj == null) {
            return obj;
        }
        if (obj instanceof Array) {
            var newobj = [];
        }
        else {
            var newobj = {};
        }
        for (var attr in obj) {
            newobj[attr] = this.deepCopy(obj[attr]);
        }
        return newobj;
    },

    /**
     * 消息过滤 保留需要用的消息
     * 保留replayProto中的消息
     * @param {*} msglist 
     */
    filterMsgList: function (msglist) {
        var list = [];
        var filterIds = [];
        for (var i in replayProto) {
            if (replayProto[i] == replayProto.initPlayer)
                filterIds.push(ddz_proto_id[replayProto[i]]);
            else
                filterIds.push(proto_id[replayProto[i]]);
        }
        for (var i = 0; i < msglist.length; i++) {
            if (filterIds.indexOf(msglist[i].id) != -1) {
                if (msglist[i].id == proto_id[replayProto.initGame]) {
                    if (msglist[i].content.userInfo.userId == cc.dd.user.id) {
                        var have = false;
                        for (var k = 0; k < list.length; k++) {
                            if (list[k].id == msglist[i].id)
                                have = true;
                        }
                        if (!have)
                            list.push(msglist[i]);
                    } else {
                        var have = false;
                        for (var k = 0; k < list.length; k++) {
                            if (list[k].id == msglist[i].id)
                                have = true;
                        }
                        if (!have)
                            list.push(msglist[i]);
                    }
                } else {
                    list.push(msglist[i]);
                    if (msglist[i].id == proto_id[replayProto.result])
                        break;
                }
            }
        }
        return list;
    },

    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        if (cc.director.getScene().name != 'new_dsz_replay_scene') {
            return;
        }
        switch (event) {
            case playerEvent.New_DSZ_PLAYER_ENTER: //玩家进入
                this.playerEnter(data);
                break;
            case playerEvent.New_DSZ_PLAYER_INIT_DATA: //玩家数据实例化
                if (!this._pause)
                    this.initPlayerGameData(data, true);
                break;
            case playerEvent.New_DSZ_PLAYER_WATCH_POKER: //玩家看牌
                this.playerWatch_Rsp(data);
                break;
            case playerEvent.New_DSZ_PLYER_EXIT: //玩家离开
                this.playerLeave_Rsp(data);
                break;
            case deskEvent.New_DSZ_DEDSK_SEND_POKER: //发牌
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
                this.sendPoker();
                break;
            case deskEvent.New_DSZ_DEDSK_CALL: //跟注
                this.playerAddChip_Rsp(data, true);
                break;
            case deskEvent.New_DSZ_DEDSK_UPDATE_CIRCLE: //更新轮数
                this.updateDeskCircle(true);
                break;
            case deskEvent.New_DSZ_DEDSK_COMPARE: //比牌
                this.playerCmp_Rsp();
                break;
            case deskEvent.New_DSZ_DEDSK_COMPARE_RESULT: //比牌结果
                this.playerCmpResult_Rsp(data.userId, data.cmpId, data.winner);
                break;
            case deskEvent.New_DSZ_DEDSK_FOLD: //弃牌
                this.playerFold_Rsp(data);
                break;
            case deskEvent.New_DSZ_DEDSK_SHOW_ROUND_RESULE: //单局结算
                this.roundResut_Rsp(data);
                break;
            case deskEvent.New_DSZ_DEDSK_SHOW_RESULE: //总结算
                this.showResultTotal_Rsp(data);
                break;
            case REPLAY_EVENT.ON_GET_DATA:
                this.init();
                break;
        }
    },

});
