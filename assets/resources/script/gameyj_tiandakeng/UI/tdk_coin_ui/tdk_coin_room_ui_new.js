//create by wj 2018/1/31
var dd = cc.dd;
var tdk = dd.tdk;

var tdk_speak = tdk.constant_cfg.SPEAK_TEXT;
var tdk_audio = tdk.constant_cfg.AUDIO_TYPE;

var TDkCDeskData = require('tdk_coin_desk_data');
var CDeskData = TDkCDeskData.TdkCDeskData;
var CDeskEvent = TDkCDeskData.TdkCDeskEvent;
var CDeskEd = TDkCDeskData.TdkCDeskED;

var TdkCPlayerData = require('tdk_coin_player_data');
var CPlayerData = TdkCPlayerData.TdkCPlayerMgrData;
var CPlayerEvent = TdkCPlayerData.TdkCPlayerEvent;
var CPlayerEd = TdkCPlayerData.TdkCPlayerED;

var TdkOperationData = require('tdk_operation_data');
var tdkOperationData = TdkOperationData.TdkOperationData;
var OperationEvent = TdkOperationData.TdkOperationEvent;
var OperationED = TdkOperationData.TdkOperationED;

var gameType = require('Define').GameType;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;


var tdk_am = require("../../Common/tdk_audio_manager").Instance();


var TdkSender = require('jlmj_net_msg_sender_tdk');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
const dissolveUI = 'gameyj_nn/prefab/nn_dissolve';
const gzUI = 'gameyj_tiandakeng/Prefab/pgzUI';

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var AudioManager = require('AudioManager');

var Platform = require('Platform');
var AppCfg = require('AppConfig');
var DingRobot = require('DingRobot');

cc.Class({
    extends: cc.Component,

    properties: {
        allinLbl: {
            default: null,
            type: cc.Label,
            tooltip: 'allin封顶',
        },
        bottomNoteLbl: {
            default: null,
            type: cc.Label,
            tooltip: '底注',
        },
        singleNoteLbl: {
            default: null,
            type: cc.Label,
            tooltip: '单注',
        },
        chatToggle: {
            default: null,
            type: cc.Toggle,
            tooltip: '语音复选框'
        },
        chipTotalLbl: {
            default: null,
            type: cc.Label,
            tooltip: '总投注',
        },
        matchBtn: {
            default: null,
            type: cc.Node,
            tooltip: '匹配按钮',
        },

        prepareNode: {
            default: null,
            type: cc.Node,
            tooltip: '准备界面',
        },

        prepareBtn: {
            default: null,
            type: cc.Node,
            tooltip: '准备按钮',
        },

        changeDeskBtn: {
            default: null,
            type: cc.Node,
            tooltip: '换桌按钮',
        },

        tuoguanNode: {
            default: null,
            type: cc.Node,
            tooltip: '托管遮罩',
        },
        anim_match: { default: null, type: dragonBones.ArmatureDisplay, tooltip: "匹配中动画" },
        operation: { default: [], type: cc.SpriteFrame, tooltip: '操作' },
        gpsBG: { default: null, type: cc.SpriteFrame, tooltip: 'GPS背景' },
        guanzhanNode: { default: null, type: cc.Node, tooltip: "观战人数节点" },
        languoNode: { default: null, type: cc.Node, tooltip: "烂锅节点" },
        xifenlbl: { default: null, type: cc.Label, tooltip: "喜分" },
        maxPlayerCnt: 5,  //玩家数量上限
        totalCostChip: 0, //本局游戏总下注
        lastPokerList: [], //记录每个玩家当前最后一张手牌
        foldPlayerCnt: 0, //扣牌人数

        totalResCnt: 0, //总资源个数
        loadResCnt: 0, //已加载资源个数

        player_list: [], //保存玩家实例
        audioCache_list: [], //音效音乐缓存
        foldPlayer_list: [], //弃牌玩家
        leavePlayer_list: [], //离开的玩家

        seatArrName: '', //位置父节点名字

        _matchCountDown: 20, //匹配倒计时


    },

    onLoad: function () {
        cc.game.setFrameRate(60);
        DingRobot.set_ding_type(6);
        tdk.popupParent = cc.find('Canvas');
        this.loadRoomRes();
        this.gameStart();
        this.schedule(this.sendLocationInfo, 30);//发送位置信息
    },

    onDestroy: function () {
        this.removeObserver();
        tdkOperationData.Destroy()
        CDeskData.Destroy();
        CPlayerData.Destroy();
        AudioManager.getInstance().stopAllLoopSound();
    },

    addObserver: function () {
        CPlayerEd.addObserver(this);
        CDeskEd.addObserver(this);
        OperationED.addObserver(this);
        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);
    },

    removeObserver: function () {
        RoomED.removeObserver(this);
        CPlayerEd.removeObserver(this);
        CDeskEd.removeObserver(this);
        OperationED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
    },

    loadRoomRes: function () {
        var preRes = dd.tdk_resCfg.PREFAB;
        var atlRes = dd.tdk_resCfg.ATLASS;
        var fonRes = dd.tdk_resCfg.FONT;
        var resArr = [
            { path: atlRes.ATS_CHIPS, type: cc.SpriteAtlas },
            { path: atlRes.ATS_POKER, type: cc.SpriteAtlas },
            { path: atlRes.ATS_SETTING, type: cc.SpriteAtlas },
            { path: preRes.PRE_POKER, type: cc.Prefab },
            { path: preRes.PRE_SHIELD, type: cc.Prefab },
            { path: preRes.PRE_COUNTDOWN, type: cc.Prefab },
            { path: preRes.PRE_COUNTDOWN_V2, type: cc.Prefab },
            { path: preRes.PRE_ROOM_MENU, type: cc.Prefab },
            { path: preRes.PRE_DISSOLVE_ROOM, type: cc.Prefab },
            { path: preRes.PRE_DISSOLVE_RESULT, type: cc.Prefab },
            { path: preRes.PRE_EXIT_CHOICE, type: cc.Prefab },
            { path: preRes.PRE_INTEGRAL, type: cc.Prefab },
            { path: preRes.PRE_AUDIO_SET, type: cc.Prefab },
            { path: preRes.PRE_XIAZHU, type: cc.Prefab },
            { path: preRes.PRE_GAME_COIN_MENU, type: cc.Prefab },
            // {path:preRes.PRE_CROWN, type:cc.Prefab},
            { path: preRes.PRE_CHIP, type: cc.Prefab },
            { path: preRes.PRE_INTEGRAL_V2, type: cc.Prefab },
            { path: preRes.PRE_SEAT_ARR_3, type: cc.Prefab },
            { path: preRes.PRE_GAME_BEGIN, type: cc.Prefab },
            { path: preRes.PRE_SEAT_ARR_4, type: cc.Prefab },
            { path: preRes.PRE_SEAT_ARR_5, type: cc.Prefab },
            { path: preRes.PRE_PROMPT_BOX, type: cc.Prefab },
            { path: preRes.PRE_DISSOLVE_CONFIRM, type: cc.Prefab },
            { path: preRes.PRE_MESSAGE_BOX, type: cc.Prefab },
            { path: preRes.PRE_PLAYER_V2, type: cc.Prefab },
            { path: preRes.PRE_GAME_RESULTACTION, type: cc.Prefab },
            { path: preRes.PRE_CHAT, type: cc.Prefab },
            { path: fonRes.FONT_ROUND_WIN, type: cc.Font },
            { path: fonRes.FONT_ROUND_FAILED, type: cc.Font },
            { path: fonRes.FONT_TOTAL_WIN, type: cc.Font },
            { path: fonRes.FONT_TOTAL_FAILED, type: cc.Font },
        ];
        this.totalResCnt = resArr.length;
        for (var i = 0; i < resArr.length; i++) {
            var item = resArr[i];
            dd.ResLoader.preloadSceneStaticRes(item.path, item.type, this.loadResSuccess.bind(this));
        }
    },

    //资源加载
    loadResSuccess: function () {
        this.loadResCnt++;
        var progress = Math.floor(1 / this.totalResCnt * this.loadResCnt * 100);
        var node = cc.find('Canvas/loadRes/lbl');
        if (node) {
            var cpt = node.getComponent(cc.Label);
            cpt.string = '正在加载图片资源(' + progress + '%)';
        }
        if (this.loadResCnt == this.totalResCnt) {
            this.loadAudioRes();
        }
    },

    loadAudioRes: function () {
        var audioRes = dd.tdk_resCfg.AUDIO;
        var resArr = new Array();
        for (var i = 0; i < audioRes.length; i++) {
            var item = audioRes[i];
            for (const key in item) {
                var kvalue = item[key];
                for (var j = 0; j < kvalue.length; j++) {
                    resArr.push(kvalue[j]);
                }
            }
        }

        var commonAudioRes = dd.tdk_resCfg.AUDIO_COMMON;
        for (const key in commonAudioRes) {
            resArr.push(commonAudioRes[key]);
        }

        var node = cc.find('Canvas/loadRes/lbl');
        if (node) {
            var cpt = node.getComponent(cc.Label);
            tdk_am.preload(resArr, function (progress) {
                cpt.string = '正在加载声音资源(' + progress + '%)';
            }, function () {
                node.parent.removeFromParent();
                node.parent.destroy();
            });
            this.audioCache_list = resArr;
        }
    },

    gameStart: function () {
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.roleCount == 9) {
            this.seatArrName = 'seatArr_9';
            this.node.getChildByName('seatArr_5').active = false;
            this.node.getChildByName(this.seatArrName).active = true;
        }
        else
            this.seatArrName = 'seatArr_5';
        this.addObserver();
        this.initUI();
        this.showOnlookers();
    },

    initUI: function () {
        this.initStat();
        this.deskInit();
        var gameid = RoomMgr.Instance().gameId;
        if (gameid == gameType.TDK_FRIEND ||
            gameid == gameType.TDK_FRIEND_LIU) {
            if (this.player_list.length == 0) {
                CPlayerData.Instance().initPlayer();
                CPlayerData.Instance().initPokerInfo();
                CPlayerData.Instance().initChipInfo();
                this.playerIndex = 0;
                this.pokerIndex = 0;
                this.count = -1;
                this.seedCardNum = 0;
                this.playAddPokerAction(true);
                this._addpokerbet = false;
            }
        }
    },



    //显示房间左上角按钮菜单
    showRoomMenu: function (event, data) {
        cc.log("点击按钮-------this.menu_show : ", this.menu_show, '=====  :', event.target.name)
        if (!this.menu_show) {
            cc.find('menu', this.node).active = true;
            cc.find('room_info/xiala', this.node).getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            if (ani._nameToState[ani._defaultClip.name]) {
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
            }
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = true;
            cc.find('menu/toun', this.node).active = true;
        }
        else {
            cc.find('room_info/xiala', this.node).getComponent(cc.Button).interactable = true;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = false;
            cc.find('menu/toun', this.node).active = false;
        }
    },

    //显示聊天加盟
    showChatUI: function () {
        var bl = CPlayerData.Instance().checkPlayerSurvival();
        if (!bl) return;
        var chat = cc.find('tdk_chat', this.node);
        if (chat)
            chat.active = true;
    },

    /**
     * 显示玩家状态
     */
    showPlayeState: function () {
        CPlayerData.Instance().TdkCPlayerList.forEach(function (player) {
            if (player.fold) {
                player.foldGame();
            }
            player.caculateScore();
        }.bind(this));
    },

    /**
     * 检查牌组发牌
     */
    checkSendPoker: function () {
        var bl = false;
        CPlayerData.Instance().TdkCPlayerList.forEach(function (player) {
            if (player && player.client_PokerList.length > 0) {
                bl = true;
            }
        }.bind(this));
        return bl;
    },

    //控制发牌动画节奏
    playAddPokerAction: function (isAct) {
        if (this.count == 0 || CPlayerData.Instance().TdkCPlayerList.length == 0) {
            this.showPlayeState();
            this.playerIndex = 1;
            this.pokerIndex = 0;
            if (this.count == 0) {
                var data = {
                    userid: tdkOperationData.Instance().userid,
                    deskstatus: tdkOperationData.Instance().deskstatus,
                    time: tdkOperationData.Instance().time,
                }
                cc.log('发牌结束');
                this._addpokering = false;
                this.startBet_rsp(data);
                CPlayerData.Instance().caculateOffsetScore();
            }
            return;
        }
        //检查牌组
        var issend = this.checkSendPoker();
        if (!issend) {
            cc.log('牌组为空');
            return;
        }
        this._addpokering = true;
        if (this.count == -1) {
            this.count = 0;
            CPlayerData.Instance().TdkCPlayerList.forEach(function (player) {
                this.count += player.client_PokerList.length;
            }.bind(this))
        }
        cc.log('金币场 41==：', CPlayerData.Instance().getGameId())
        var player = CPlayerData.Instance().TdkCPlayerList[this.playerIndex];
        cc.log('发牌集合 count :', this.count, '  -----playerIndex : ', this.playerIndex, '   =====pokerIndex : ', this.pokerIndex);
        if (player)
            cc.log('玩家ID: ' + player.userid + ' ====client_PokerList : ', player.client_PokerList.length);

        this.playerIndex += 1;
        if (player && player.client_PokerList.length != 0) {
            if (this.pokerIndex < player.client_PokerList.length) {
                var pokerid = player.client_PokerList[this.pokerIndex].pokerid;
                var isAct = player.client_PokerList[this.pokerIndex].isAct;
                var borrow = player.client_PokerList[this.pokerIndex].borrow;
                var data = {
                    userid: player.userid,
                    pokerid: pokerid,
                    borrow: borrow,
                    isAct: isAct,
                }
                player.addPoker(data);
                this.count -= 1;
            }
            this.seedCardNum += 1;
            if (this.seedCardNum == CPlayerData.Instance().getstartPlayer()) {
                this.pokerIndex += 1;
                this.seedCardNum = 0;
            }
        }

        if (this.playerIndex == RoomMgr.Instance()._Rule.roleCount) {
            this.playerIndex = 0;
        }

        if (isAct && (player && player.client_PokerList.length)) {
            var seq = cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                this.playAddPokerAction(true);
            }.bind(this)));
            this.node.runAction(seq);
        } else {
            this.playAddPokerAction(isAct ? isAct : false);
        }

    },

    //桌子数据初始化
    deskInit: function () {
        if (CPlayerData.Instance().getGameId() == gameType.TDK_COIN) {
            cc.find('difengditu/panel1/difen/fen', this.node).getComponent(cc.Label).string = CPlayerData.Instance().m_BaseScore ? CPlayerData.Instance().m_BaseScore : 0;
            this.showwaitingNode(false);
            if (CPlayerData.Instance().TdkCPlayerList.length == 0)
                this.sendGameReq();
        }
    },

    //发送准备消息
    onclickPrepare: function (event, data) {
        const req = new cc.pb.room_mgr.room_prepare_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
            'room_prepare_req', true);
    },


    //发送换桌消息
    onclickChange: function (event, data) {
        clearInterval(this.wave_end_id);
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        var gameid = CPlayerData.Instance().getGameId();
        var roomid = CPlayerData.Instance().getRoomId();
        pbData.setGameType(gameid);
        pbData.setRoomCoinId(roomid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
        //this.match();
        this.ChangeCD();

    },

    /**
     * 换桌返回
     */
    changeDesk: function (data) {
        if (data[0].retCode == 0) {
            this.releaseUi();
        } else if (data[0].retCode == 1) {
            var str = '金币与房间限制金币不匹配!';
            cc.dd.DialogBoxUtil.show(0, str, "确定", null, function () {
                this.sendLeaveRoom();
            }.bind(this), null);
        } else {
            cc.log('换桌失败！');
        }
    },

    ChangeCD: function () {
        this.prepareNode.active = false;
        this.changeCDTime = 5;
        this.unschedule(this.changeTimer);
        this.schedule(this.changeTimer, 1);
    },

    changeTimer: function () {
        this.changeCDTime--;
        cc.log('-------------changeCDTime : ', this.changeCDTime);
        if (this.changeCDTime < 0) {
            this.changeCDTime = null;
            this.unschedule(this.changeTimer);
            this.showChangeDeskBtn();
        }
    },

    //找到本轮操作的玩家
    findPlayer: function (userid) {
        var player = null;
        for (var i = 0; i < this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item && item.userId == userid) {
                player = item;
            }
        }
        if (!player) {
            cc.warn('tdk_coin_player_ui::findPlayer: 没有找到玩家:', userid);
        }
        return player;
    },

    onStop: function () {
        cc.log("onStop----")
        this.showLanguo(false);
        var islanguo = tdkOperationData.Instance().getEndtype();
        if (!islanguo) {
            this.player_list.forEach(function (item, index) {
                if (item) {
                    item.doBet(CDeskData.Instance().dizhu);
                    this.totalCostChip += CDeskData.Instance().dizhu;
                }
            }.bind(this));
        }
        if (this.languoNode)
            this.languoNode.active = islanguo ? islanguo : false;

        this.player_list.forEach(function (player) {
            player.cleandanChip();
            player.freshCostChip();
        }.bind(this));


        this.freshTotalCostChip();
        this.sendPokerAction();

        var data = {
            userid: CPlayerData.Instance().pokerInfo.nextuserid,
            deskstatus: CPlayerData.Instance().pokerInfo.deskstatus,
            type: 0,
            time: CPlayerData.Instance().pokerInfo.time,
        }
        tdkOperationData.Instance().setCoinMsgData(data);
    },

    //游戏开始
    gameStart_rsp: function (data) {
        CDeskData.Instance().isEnd = false;
        CDeskData.Instance().IsMatching = false;
        CDeskData.Instance().IsStart = true;
        this.initStat();
        this.player_list.forEach(function (item) {
            item.setReadOkUI(false);
            item.clearPoker();
        });
        this.unschedule(this.clearAllChipInfo);
        // var prefab = cc.loader.getRes(dd.tdk_resCfg.PREFAB.PRE_GAME_BEGIN, cc.Prefab);
        // var window = cc.instantiate(prefab);
        // window.parent = this.node;
        // var ani = window.getChildByName('bg').getComponent(cc.Animation);
        // ani.play('gameBegin');
        // ani.on('stop', this.onStop, this);
        this.onStop();
        this.prepareNode.active = false;
        this.showDengdai(false);
        this.unschedule(this.changeTimer); //停止换桌CD

        this.GameInfo();
    },

    setFriendGroupInvite(visible) {
        let node = cc.find("room_info/klb_friend_group_invite_btn", this.node);
        if (node) {
            if (visible) {
                var bl = RoomMgr.Instance().isClubRoom();
                node.active = bl;
            } else {
                node.active = false;
            }
        }
    },

    initStat: function () {
        cc.find('room_info/Botton', this.node).active = false;
        if (cc.find('weixin', this.node))
            cc.find('weixin', this.node).active = false;
        var prepareBtn = cc.find('room_info/prepareBtn', this.node);
        if (prepareBtn)
            prepareBtn.active = false;
        this.setFriendGroupInvite(false);
        cc.find('room_info/room', this.node).active = false;
        var xifen = tdkOperationData.Instance().roundEndData.getXifen();
        this.showXifen(xifen);
    },

    showRoomInfo: function () {
        var isGame = CPlayerData.Instance().getIsGame();
        if (CPlayerData.Instance().getPlayerNum() == RoomMgr.Instance()._Rule.roleCount || isGame) {
            if (cc.find('weixin/show', this.node))
                cc.find('weixin/show', this.node).active = false;
            this.setFriendGroupInvite(false);
        } else {
            if (cc.find('weixin/show', this.node))
                cc.find('weixin/show', this.node).active = true;
            this.setFriendGroupInvite(true);
        }
    },

    showInfo: function (data) {
        var gameid = CPlayerData.Instance().getGameId();
        if (gameid == gameType.TDK_FRIEND || gameid == gameType.TDK_FRIEND_LIU) {
            var isGame = CPlayerData.Instance().getIsGame();
            this.showRoomInfo();
            if (data.userid == CPlayerData.Instance().selfId) {
                if (CDeskData.Instance().CurrentJuShu == 0) {
                    cc.log('游戏是否开始：', isGame);
                    cc.find('room_info/room', this.node).active = true;
                    var bottonNode = cc.find('room_info/Botton', this.node);
                    if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                        bottonNode.active = true;
                        if (cc.find('weixin', this.node))
                            cc.find('weixin', this.node).active = true;
                        this.showStartBtn(!data.already)
                    } else if (RoomMgr.Instance().isClubRoom() && !isGame) { //亲友圈
                        bottonNode.active = true;
                        if (cc.find('weixin', this.node))
                            cc.find('weixin', this.node).active = true;
                        if (cc.find('weixin/show', this.node))
                            cc.find('weixin/show', this.node).active = true;
                        cc.find('fzweixin', bottonNode).active = true;
                        cc.find('start', bottonNode).active = !data.already;
                        this.setFriendGroupInvite(true);
                    } else if (!isGame) {
                        bottonNode.active = false;
                        if (cc.find('weixin', this.node))
                            cc.find('weixin', this.node).active = false;
                        cc.find('room_info/prepareBtn', this.node).active = true;
                    }
                } else {
                    //var bl = CDeskData.Instance().CurrentJuShu >= 1 && data.origPokerList.length <= 0 && !data.already;
                    var isStart = CDeskData.Instance().getDeskState() == 1;
                    var role = CPlayerData.Instance().getUserById(cc.dd.user.id);
                    var bl = (data.origPokerList.length <= 0 && role != null && !role.already && isStart) ? true : false;
                    //var bl = data.origPokerList.length <= 0;
                    cc.log('showInfo-------bl:', bl);
                    this.showprepareBtn(bl);

                }
                cc.find('room_info/round/cur_round', this.node).getComponent(cc.Label).string = CDeskData.Instance().CurrentJuShu;
            }
        } else if (CPlayerData.Instance().getGameId() == gameType.TDK_COIN) {
            cc.find('difengditu/panel1/difen/fen', this.node).getComponent(cc.Label).string = CPlayerData.Instance().m_BaseScore ? CPlayerData.Instance().m_BaseScore : 0;
            this.showwaitingNode(false);
            this.anim_match.node.active = false;
        }

        if (data.userid == CPlayerData.Instance().selfId) {
            this.showTuoGuan(false);
            this.closeChip();
        }
        this.GameInfo();

        var chatNode = cc.find('biaoqing', this.node);
        var voiceNode = cc.find('voice', this.node);
        var gameid = CPlayerData.Instance().getGameId();
        if (gameid == gameType.TDK_FRIEND ||
            gameid == gameType.TDK_FRIEND_LIU) {
            if (voiceNode)
                voiceNode.active = true;
        }
        if (chatNode)
            chatNode.active = true;
    },

    /**
     * 游戏信息
     */
    GameInfo: function () {
        var jushu = CDeskData.Instance().CurrentJuShu;
        var layoutnode = cc.find('layout/deskInfo', this.node);
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) {
            return;
        }
        cc.find('jushu', layoutnode).getComponent(cc.Label).string = jushu + '/' + Rule.roundCount;
        cc.find('fanghao', layoutnode).getComponent(cc.Label).string = CPlayerData.Instance().getRoomId();
        var dizhu = CDeskData.Instance().dizhu;
        var bei = (tdkOperationData.Instance().roundEndData.endtype && Rule.lanDouble) ? 2 : 1; //烂锅加倍
        var lanNum = 1;
        if (Rule.lanDouble)
            lanNum = tdkOperationData.Instance().roundEndData.getLanNum(); //烂锅次数
        //lanNum = lanNum > 4 ? 4 : lanNum;
        cc.find('dizhu', layoutnode).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(dizhu);
        cc.find('fengding', layoutnode).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(Rule.baseScore * Rule.maxScore * lanNum);
        cc.find('layout/wafa', layoutnode).getComponent(cc.Label).string = CDeskData.Instance().getPlayTypeStr(Rule.playType);
        cc.find('layout/daiwang', layoutnode).active = Rule.hasJoker;
        cc.find('layout/sixiaowang', layoutnode).active = Rule.sixiaowang;
        cc.find('layout/huxuanti', layoutnode).active = Rule.huixuanti;
        cc.find('layout/mofan', layoutnode).active = Rule.motifanbei;
        cc.find('layout/qsd', layoutnode).active = Rule.qinsandui;
        cc.find('layout/lianxi', layoutnode).active = Rule.lianxian;
        cc.find('layout/wangzhongpao', layoutnode).active = Rule.jokerPao;
        cc.find('layout/apao', layoutnode).active = Rule.aPao;
        cc.find('layout/gong', layoutnode).getComponent(cc.Label).string = Rule.shareType ? ',公张随豹' : ',公张随点';
        cc.find('layout/languofanbei', layoutnode).active = Rule.lanDouble;
        cc.find('layout/genfu', layoutnode).active = Rule.genfu;
        cc.find('layout/liangdi', layoutnode).active = Rule.isOpen;
        cc.find('layout/busuoqiang', layoutnode).active = Rule.busuoqiang;
        cc.find('layout/shunzi', layoutnode).active = Rule.shunzi;
        cc.find('layout/renman', layoutnode).active = Rule.autoStart;
        cc.find('layout/bati', layoutnode).getComponent(cc.Label).string = !Rule.huixuanti ? (Rule.bati ? ',把踢' : ',末踢') : '';
        cc.find('layout/gps', layoutnode).active = Rule.gps;
        cc.find('layout/gpsInfo', this.node).active = Rule.gps;
        cc.find('layout', layoutnode).active = true;

        let btnnode = cc.find('room_info/klb_friend_group_invite_btn', this.node);
        var gameName = '填大坑';
        var isfz = RoomMgr.Instance().gameId == gameType.TDK_FRIEND_LIU ? true : false;
        if (isfz)
            gameName = '方正填大坑';
        //玩法名称+人数+圈数+封顶+缺几人
        let rule = gameName + ' ' + Rule.roundCount + '局';
        if (btnnode)
            btnnode.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule)
    },



    //根据玩家的座位号来获取玩家
    findPlayerBySeatId: function (seatId) {
        var playerData = null;
        this.player_list.forEach(function (player) {
            if (player.seatId == seatId) {
                playerData = player;
            }
        })
        return playerData;
    },

    checkPlayerList: function (userid) {
        for (var i = 0; i < this.player_list.length; ++i) {
            var player = this.player_list[i];
            if (player && player.userId == userid)
                return true;
        }
        return false;
    },

    //玩家进入消息处理
    playerEnter: function (data) {
        if (this.checkPlayerList(data.userid))
            return;
        var pos = data.seatId;
        if (!this.seatArrName) return;
        var playerGroupNode = this.node.getChildByName(this.seatArrName);
        var seatNode = playerGroupNode.getChildByName('seat' + pos);
        seatNode.active = true;
        var player = seatNode.getComponent('tdk_coin_player_ui');
        player.seatId = pos;
        player.userId = data.userid;
        player.nick = data.nick;
        player.bet = data.gold;
        player.headUrl = data.headUrl;
        player.initHeadUI();
        player.isReplacePlayer = true;
        if (this.findPlayerBySeatId(data.seatId)) {
            var playerdata = this.findPlayerBySeatId(data.seatId);
            playerdata.userId = player.userId;
            playerdata.nick = player.nick;
            playerdata.bet = player.bet;
            playerdata.headUrl = player.headUrl;
            playerdata.isReplacePlayer = true;
        } else {
            this.player_list.push(player);
        }
        //设置状态显示
        player.initData();
        player.setReadOkUI(data.already);
        player.showOffline(true);
        if (data.already && data.userid == cc.dd.user.id) {
            var prepare = cc.find('gaming/prepareNode', this.node);
            prepare.active = false;
        }
        // if (player.join) {
        //     this.showPlayerPoker();
        // }
        if (data.userid == cc.dd.user.id) {
            var startNode = cc.find('gaming/startBtn', this.node);
            startNode.active = false;
        }
        this.showInfo(data);
        cc.log('玩家GPS代码更新.............');
        this.refreshGPSWarn();
        var gameid = RoomMgr.Instance().gameId;
        var deskstate = CDeskData.Instance().getDeskState();
        cc.log('显示玩家准备状态-----:', deskstate);
        if ((gameid == gameType.TDK_FRIEND || gameid == gameType.TDK_FRIEND_LIU) &&
            deskstate == 2 && data.userid == cc.dd.user.id) {
            this.initStat();
            this.showprepareBtn(false);
        }
    },

    //玩家准备
    playerReady: function (data) {
        if (data.userid == cc.dd.user.id) {
            this.player_list.forEach(function (item) {
                item.clearPoker(true);
            });
            this.prepareNode.active = false;
            this.showStartBtn(false);
        }
        var player = this.findPlayer(data.userid);
        if (player) {
            player.setReadOkUI(data.already);
        }
    },
    //玩家离开游戏
    playerExitGame: function (data) {
        for (var i = 0; i < this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item.userId == data.userid) {
                if (CDeskData.Instance().deskState != 2) {
                    item.clearPlayer();
                    item.clearPoker();
                    item = null;
                    this.player_list.splice(i, 1);
                } else {
                    this.leavePlayer_list.push(data.userid);
                }
            }
        }

        // if (dd.user.id == data.userid) {
        //     this.exitGame();
        // }
        this.refreshGPSWarn();
    },

    //玩家发牌动画
    sendPokerAction: function () {
        for (var k = 0; k < 3; k++) {
            cc.log('k:', k);
            if (k < 2) {
                CPlayerData.Instance().TdkCPlayerList.forEach(function (player) {
                    if (CPlayerData.Instance().checkSendPokerPlayer(player.userid)) {
                        var data = {
                            pokerid: -1,
                            isAct: true,
                        }
                        player.client_PokerList.push(data);
                    }
                }.bind(this))
            } else {
                if (CPlayerData.Instance().pokerInfo.pokerlistList) {
                    CPlayerData.Instance().pokerInfo.pokerlistList.forEach(function (poker) {
                        var player = CPlayerData.Instance().getUserById(poker.userid);
                        if (player) {
                            var data = {
                                pokerid: poker.pokerid,
                                isAct: true,
                            }
                            player.client_PokerList.push(data);
                        }
                    }.bind(this))
                }

            }
        }
        this.playerIndex = CPlayerData.Instance().getStartSendPoker();
        this.pokerIndex = 0;
        this.count = -1;
        this.seedCardNum = 0;
        this.playAddPokerAction(true);
        this._addpokerbet = false;
        cc.log("_addpokerbet: false. sendPokerAction");
        //CPlayerData.Instance().caculateOffsetScore();
    },
    //显示玩家的poker
    showPlayerPoker: function () {
        var scoreList = [];
        for (var k = 0; k < CPlayerData.Instance().TdkCPlayerList.length; k++) {
            var playerdata = CPlayerData.Instance().TdkCPlayerList[k]
            var userpokerList = playerdata.pokerlis;
            var player = this.findPlayer(playerdata.userid);
            for (var i = 0; i < userpokerList.length; i++) {
                var pokerId = userpokerList[i];
                //显示玩家牌
                if (i == userpokerList.length) {
                    player.addPoker(pokerId, playerdata.borrow, false);
                } else {
                    player.addPoker(pokerId, false, false);
                }
                scoreList.push({ obj: player, score: playerdata.score });
            }
        }


        var tmpArr = [];
        for (var i = 0; i < scoreList.length; i++) {
            tmpArr.push(scoreList[i].score);
        }
        tmpArr.sort(function (a, b) {
            return b - a;
        });
        var maxNum = tmpArr[0];
        for (var i = 0; i < scoreList.length; i++) {
            var item = scoreList[i];
            var offset = item.score - maxNum;
            item.obj.showScore(item.score, offset);
        }
    },
    //监听玩家下注
    addCostChipListener: function (option, userid) {
        var player = this.findPlayer(userid);
        option.addCostChipListener(function (num) {
            this.freshAllCostChipInfo(player, num);
        }.bind(this));
    },
    /**
     * 显示玩家投注数据
     */
    showPlayerChip: function (data) {
        var player = this.findPlayer(data.userid);
        this.freshAllCostChipInfo(player, data.bet, false);
    },

    //刷新玩家下注金额和所有玩家下注金额
    freshAllCostChipInfo: function (player, num, isAct) {
        if (player) {
            player.doBet(num, isAct);
        }
        this.totalCostChip += num;
        this.freshTotalCostChip();
    },

    //更新总下注
    freshTotalCostChip: function () {
        this.chipTotalLbl.node.active = true;
        this.chipTotalLbl.node.getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(this.totalCostChip);
    },

    /**
     * 清理总下注
     */
    closeChip: function () {
        this.chipTotalLbl.node.getComponent(cc.Label).string = 0;
    },

    //改变操作玩家标志
    changeActivePlayer: function (userid, nextuserid) {
        this.activePlayer(userid, false);
        this.activePlayer(nextuserid, true);
    },

    //设置玩家操作标志
    activePlayer: function (userid, state) {
        this.clearPlayerState();
        var player = this.findPlayer(userid);
        if (player) {
            player.setPlayerStata(state);
        }
    },

    /**
     * 删除界面的操作按钮
     */
    removOperat: function () {
        this.hiddenMenu();
        var box = cc.find('xiazhu', tdk.popupParent);
        if (box) {
            box.removeFromParent();
            box.destroy();
        }
    },

    //显示当前可操作按钮
    showCurOperateBtns: function (data) {
        this.removOperat();
        var gameid = CPlayerData.Instance().getGameId();
        if (gameid == gameType.TDK_FRIEND ||
            gameid == gameType.TDK_FRIEND_LIU) {
            if (!RoomMgr.Instance()._Rule.bati) { // 末踢
                var player = this.findPlayer(data.nextuserid)
                if (player && player.pokerNum_list.length < 5 && data.deskstatus == 34)
                    return;
            }
        }
        this.showCutdown(data.nextuserid, data.time);
        this.changeActivePlayer(data.userid, data.nextuserid);
        if (this._addpokering) {
            this._addpokerbet = true;
            cc.log("_addpokerbet: true");
        }
        if (cc.dd.user.id == data.nextuserid) {
            var func = function (option) {
                option.betNum = data.betnum;
                option.deskStatus = data.deskstatus;
                this.addCostChipListener(option, data.nextuserid);
                option.analysisDeskSattus();
            }.bind(this);
            this.loadGameMenu(func);
        }
    },
    //刷新其他玩家的下注金额
    freshOtherPlayerCostChip: function (data) {
        for (var i = 0; i < this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item && item.userId == data.userid) {
                this.freshAllCostChipInfo(item, data.betnum);
            }
        }
    },

    //加载游戏操作按钮
    loadGameMenu: function (cb) {
        var record = CPlayerData.Instance().GetIsRecord();
        if (record) return;
        var gameCoinMenu = cc.find('gameCoinMenu', this.node);
        if (gameCoinMenu) {
            gameCoinMenu.active = true;
            this.option = gameCoinMenu.getComponent('tdk_coin_game_mennu');
            cb(this.option);
        }
    },

    /**
     * 隐藏操作按钮
     */
    hiddenMenu: function () {
        var gameCoinMenu = cc.find('gameCoinMenu', this.node);
        if (gameCoinMenu)
            gameCoinMenu.active = false;
    },

    //判断玩家当前明牌手牌与最高分直接的差距
    setPlayerScore: function (data) {
        this.player_list.forEach(function (player) {
            var playerInfo = CPlayerData.Instance().getUserById(player.userId);
            if (playerInfo && playerInfo.pokerlist.length != 0) {
                player.showScore(playerInfo.totalScore, playerInfo.offsetScore);
            }
        }.bind(this))
    },
    //初始化牌桌的筹码
    initPlayerChip: function (data) {
        var playerInfo = CPlayerData.Instance().getUserById(data.userid);
        var player = this.findPlayer(data.userid)
        if (player && playerInfo && playerInfo.client_PokerList.length != 0) {
            this.totalCostChip += playerInfo.bet;
            player.doBet(playerInfo.bet, false);
        }
        this.freshTotalCostChip();
    },

    releaseUi: function () {
        this.clearArr(this.player_list);
        this.closeChip();
        this.removeWin();
        this.hiddenMenu();
        this.totalCostChip = 0;
        this.initDesk()
    },

    initDesk: function () {
        var islanguo = tdkOperationData.Instance().roundEndData.endtype;
        if (this.languoNode)
            this.languoNode.active = islanguo ? islanguo : false;
    },

    /**
     * 清空玩家操作标识
     */
    clearPlayerState: function () {
        if (!this.player_list) return;
        this.player_list.forEach(function (player) {
            player.setPlayerStata(false);
        }.bind(this));
    },

    clearArr: function (arr) {
        cc.log('清理桌面')
        arr.forEach(function (item) {
            if (item.node) {
                item.clearPoker();
                item.clearChipInfo();
                item.setPlayerStata(false);
                item.node.active = false;
            }
        });

        arr.splice(0, arr.length);
        arr = [];
    },

    exitGame: function () {
        CPlayerData.Instance().clearAllData();
        this.releaseUi();
        cc.dd.SceneManager.enterHall();
    },

    /*******************************************操作消息处理*************************************************/
    getSpeakVoice: function (userid, key) {
        var player = this.findPlayer(userid);
        if (player) {
            var voiceArr = dd.tdk_resCfg.AUDIO[player.sexIdx][key];
            var cnt = voiceArr.length;
            var random = Math.random();
            var num = Math.floor(random * 10);
            var remainder = num % cnt;
            return voiceArr[remainder];
        } else {
            cc.error('tdk_coin_player_ui::getSpeakVoice:玩家', userid, '没有找到!');
        }
    },

    //同步其他客户端玩家操作
    synOtherPlayerOperate: function (userid, state) {
        //cc.log('synOtherPlayerOperate');
        var text = '';
        var path = null;
        switch (state) {
            case 1:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_XZ);
                break;
            case 2:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_TI);
                break;
            case 3:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_FT);
                break;
            case 4:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_KAI);
                break;
            case 6:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_BT);
                break;
            case 7:
                text = null
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_KOU);
                break;
            case 8:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_GEN);
                break;
            case 5:
                text = this.operation[state - 1];
                path = this.getSpeakVoice(userid, tdk_audio.AUDIO_AI);
                break;
            default:
                cc.error('tdk_coin_player_ui::synOtherPlayerOperate:为何没有上一个玩家状态！');
                return;
        }
        if (path != null) {
            tdk_am.playEffect(path);
            this.activePlayerSpeak(userid, text);
        }
    },

    activePlayerSpeak: function (userid, text) {
        var player = this.findPlayer(userid);
        if (player) {
            player.doSpeak(text);
        }
    },

    //开始下注
    startBet_rsp: function (data) {
        if (this._addpokerbet) {
            cc.log('发牌时已经下注,跳过开始下注');
            return;
        }
        cc.log('开始下注:', data.userid);
        this.activePlayer(data.userid, true);
        this.showCutdown(data.userid, data.time);
        if (cc.dd.user.id == data.userid) {
            var func = function (option) {
                this.addCostChipListener(option, data.userid);
                option.deskStatus = data.deskstatus;
                option.analysisDeskSattus();
            }.bind(this);
            this.loadGameMenu(func);
        } else {
            this.hiddenMenu();
        }
    },

    //下注
    bet_rsp: function (data) {
        this.synOtherPlayerOperate(data.userid, data.predeskstatus);
        this.freshOtherPlayerCostChip(data);
        this.showCurOperateBtns(data);
    },
    //开牌
    doKaiPai: function (data) {
        if (data.nextuserid == 0) {
            this.activePlayer(data.userid);
            return;
        }
        this.changeActivePlayer(data.userid, data.nextuserid);
        if (cc.dd.user.id == data.nextuserid) {
            var func = function (option) {
                option.deskStatus = data.deskstatus;
                option.analysisDeskSattus();
            };
            this.loadGameMenu(func);
        }
    },

    //不踢
    pass_rsp: function (data) {
        this.activePlayerSpeak(data.userid, this.operation[5]);
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_BT);
        tdk_am.playEffect(path);

        this.showCurOperateBtns(data);
    },

    showFoldUI: function (userid) {
        this.foldPlayerCnt++;
        //显示扣牌ui
        cc.log("showFoldUI 玩家ID：", userid, '扣牌');
        this.player_list.forEach(function (item) {
            if (!item)
                cc.log('扣牌桌子中玩家没有玩家')
            cc.log('桌子中玩家:ID ', item.userId)
            if (item.userId == userid) {
                this.foldPlayer_list.push(userid);
                item.setFold(true);
                this.activePlayerSpeak(userid, this.operation[6]);
                if (userid == cc.dd.user.id) {
                    this.hiddenMenu();
                    if (RoomMgr.Instance().gameId == gameType.TDK_COIN) {
                        this.showChangeDeskBtn();
                    }
                }
                return;
            }
        }.bind(this));

    },

    //弃牌
    fold_rsp: function (data) {
        this.showFoldUI(data.userid);
        CPlayerData.Instance().setFold(data.userid);
        var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_KOU);
        tdk_am.playEffect(path);

        this.showCurOperateBtns(data);
    },
    //allIn
    allIn_rsp: function (data) {
        this.synOtherPlayerOperate(data.userid, data.predeskstatus);
        this.freshOtherPlayerCostChip(data);
        this.showCurOperateBtns(data);
    },
    //开牌消息
    kaipai_rsp: function (data) {
        var selfplayer = this.findPlayerBySeatId(1);
        if (selfplayer && selfplayer.userId == data.userid) {
            var path = this.getSpeakVoice(data.userid, tdk_audio.AUDIO_KAI);
            tdk_am.playEffect(path);
        }

        this.activePlayerSpeak(data.userid, this.operation[3]);

        var player = this.findPlayer(data.userid);
        if (!player) return;
        player.showTishi(false);
        CPlayerData.Instance().setClickPoker(false);
        if (RoomMgr.Instance()._Rule.isOpen || CDeskData.Instance().Huifang) {
            player.showBackPoker(data.getAllPoker());
            player.foldNode.active = false;
            player.changePokerScore(true);
        } else if (!data.fold) {
            player.showBackPoker(data.getAllPoker());
        }
    },

    /**
     * 显示烂锅
     */
    showLanguo: function (bl) {
        var languo = cc.find('languo', this.node);
        if (languo)
            languo.active = bl;
    },

    //本轮游戏结束
    roundEnd_rsp: function (data) {
        if (!data) return;
        this.removOperat();
        if (data.endtype) {//烂锅
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_LANGUO);
        }
        cc.log('烂锅状态：', data.endtype);
        this.showLanguo(data.endtype);

        this.foldPlayerCnt = 0;
        this.foldPlayer_list.splice(0, this.foldPlayer_list.length);
        this.foldPlayer_list = [];
        if (data.endtype) {//烂锅
            if (!CDeskData.Instance().Huifang) {
                this.unschedule(this.clearAllChipInfo);
                this.scheduleOnce(this.clearAllChipInfo, 4);
            }
        } else {
            this.changeDeskBtn.active = false;
            this.findWinner(data);
        }
        //this.showTuoGuan(false);
        this.showXifen(data.xifen);
        this.iscunzai = true;
    },

    findWinner: function (data) {
        var endPos = null;
        var callFunc = function () {
            this.showResultAction(data.userid);
        }.bind(this);

        this.player_list.forEach(function (player) {
            if (player.userId != data.userid) {
                //if (data.userid == cc.dd.user.id) {
                var own = this.findPlayer(player.userId);
                if (own.isJoinGame()) {
                    player.showResult((-player.costChip), false, null);
                }
                //}
            } else {
                var xinfen = 0;
                if (data.languo) {
                    var num = tdkOperationData.Instance().roundEndData.lanNum + 1;
                    num = num > 4 ? 4 : num;
                    xinfen = RoomMgr.Instance()._Rule ? RoomMgr.Instance()._Rule.xifengNum * num : 0;
                    cc.log('扣取喜分：', xinfen);
                }
                player.showResult(this.totalCostChip - xinfen, true, callFunc);
                endPos = player.getPlayerPos();
            }
        }.bind(this));
    },

    removeWin: function () {
        var windui = cc.find('resultAction', this.node);
        if (windui) {
            var ani = windui.getComponent(cc.Animation);
            windui.active = false;
            windui.removeFromParent(true);
        }
    },

    //显示结果动画
    showResultAction: function (userId) {
        var winRole = this.findPlayer(userId);
        var endPos = winRole.getPlayerPos();
        this.playerGetChips(endPos);
    },

    //收筹码动画
    playerGetChips: function (endPos) {
        if (!this.player_list) return;
        for (var k = 0; k < this.player_list.length; k++) {
            var player = this.player_list[k];
            if (player)
                player.winnerGetCost(endPos, null);
        }
        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CHIP_END);
        /**
         * 1.结算时，当局结果与准备按钮同时出。
           2.结算时，当局结果出来，总积分也要同时变化。
         */
        // this.unschedule(this.showsettlement);
        // this.schedule(this.showsettlement, 2); 

        this.showsettlement();

        //旁观者
        if (CPlayerData.Instance().selfId != cc.dd.user.id) {
            var func = function () {
                this.clearAllChipInfo();
                var gameid = RoomMgr.Instance().gameId;
                if (gameid == gameType.TDK_FRIEND ||
                    gameid == gameType.TDK_FRIEND_LIU) {
                    if (CDeskData.Instance().CurrentJuShu < RoomMgr.Instance()._Rule.roundCount) {
                        //this.prepareBtn.active = true;
                    } else {
                        CDeskData.Instance().isEnd = true;
                        CDeskData.Instance().IsStart = false;
                        this.unschedule(this.showResult);//总结算
                        this.schedule(this.showResult, 1);
                    }
                }
            }.bind(this);
            var player = this.findPlayer(CPlayerData.Instance().selfId);
            if (player)
                player.winnerGetCost(endPos, func);
        }
    },

    showsettlement: function () {
        var userPlayer = this.findPlayer(cc.dd.user.id);
        if (userPlayer) {
            this.unschedule(this.clearAllChipInfo);
            this.scheduleOnce(this.clearAllChipInfo, 0.7);
            var gameid = RoomMgr.Instance().gameId;
            if (gameid == gameType.TDK_FRIEND ||
                gameid == gameType.TDK_FRIEND_LIU) {
                this.changeDeskBtn.active = false;
                if (CDeskData.Instance().CurrentJuShu < RoomMgr.Instance()._Rule.roundCount) {
                    this.showprepareBtn(true);
                } else {
                    CDeskData.Instance().isEnd = true;
                    CDeskData.Instance().IsStart = false;
                    this.unschedule(this.showResult);//总结算
                    this.schedule(this.showResult, 1);
                    //this.showResult();//总结算
                    this.showprepareBtn(false);
                }
            } else if (RoomMgr.Instance().gameId == gameType.TDK_COIN) {
                this.showTimer();
                this.showPrepareNodeBtn();
            }

        }

        /**
         * 1.结算时，当局结果与准备按钮同时出。
           2.结算时，当局结果出来，总积分也要同时变化。
         */
        //this.unschedule(this.showsettlement);
    },


    /**
     * 倒计时
     */
    timer: function () {
        this.nextGameTime--;
        cc.log('结算倒计时时间：', this.nextGameTime);
        if (this.nextGameTime < 0) {
            this.nextGameTime = 0;
            clearInterval(this.wave_end_id);
            var roomtype = RoomMgr.Instance().gameId;
            console.log("timer :" + roomtype);
            // if (roomtype == gameType.TDK_COIN)
            //     this.sendLeaveRoom();
        }
        this.showTimeStr();
    },

    showTimeStr: function () {
        var djsnode = cc.find('tdk_djs/time_red', this.prepareBtn);
        if (djsnode) {
            djsnode.getComponent(cc.Label).string = this.nextGameTime.toString();
        }
    },

    /**
     * 显示倒计时
     */
    showTimer: function () {
        this.nextGameTime = 15;
        this.showTimeStr();
        // cc.find('tdk_djs/time_red', this.prepareBtn).getComponent(cc.Label).string = this.nextGameTime.toString();
        this.wave_end_id = setInterval(function () {
            this.timer();
        }.bind(this), 1000)
    },

    /**
    * 离开房间
    */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    /**
     * 游戏马上开始动画
     */
    showGameAnimation: function () {
        this.showwaitingNode(true);
        var waiting = cc.find('waitingNode/timeNode', this.node).getComponent(cc.Animation);
        waiting.play();
        this.showDengdai(false);
    },

    showwaitingNode: function (bl) {
        if (RoomMgr.Instance().gameId == gameType.TDK_COIN)
            cc.find('waitingNode', this.node).active = bl;
    },

    //清除上局筹码信息
    clearAllChipInfo: function () {
        var languo = cc.find('languo', this.node);
        var act = languo.activeInHierarchy;
        if (!act) {
            this.totalCostChip = 0;
            this.freshTotalCostChip();
        }
        //CPlayerData.Instance().clearPokerList();
        this.player_list.forEach(function (item) {
            if (!act) {
                item.clearChipInfo();
            } else {
                item.clearPoker();
            }
        });
        this.unschedule(this.clearAllChipInfo);
    },

    //发牌消息
    sendPoker_rsp: function (data) {
        for (var i = 0; i < this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item.userId == data.userid) {
                if (typeof data.isAct == 'undefined' || data.isAct) {
                    item.addPoker(data.pokerid, data.borrow, true);
                } else {
                    item.addPoker(data.pokerid, data.borrow, false);
                }
            }
        }
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 1000000) {
            str = (num / 1000000.00) + '万';
        }
        else if (num >= 100000) {
            str = (num / 100000.00) + '万';
        } else if (num >= 10000) {
            str = (num / 10000.00) + '万';
        } else if (num >= 1000) {
            str = (num / 1000.0) + '千';
        } else {
            str = num;
        }
        return str;
    },

    /*******************************************操作消息处理*************************************************/
    onEventMessage: function (event, data) {
        switch (event) {
            case CDeskEvent.INIT:
                break;
            case CPlayerEvent.INITUI: //界面初始化
                this.releaseUi();
                break;
            case CPlayerEvent.PLAYER_ENTER://玩家进入消息
                this.playerEnter(data);
                break;
            case CPlayerEvent.ADD_POKER:
                this.sendPoker_rsp(data);
                break;
            case CPlayerEvent.PLAYER_READY:
                this.playerReady(data);
                break;
            case CPlayerEvent.PLAYER_EXIT:
                this.playerExitGame(data);
                break;
            case CPlayerEvent.PLATE_EXIT_OK:
                this.showRoomInfo();
                break;
            case CPlayerEvent.ALL_PLAYER_READY:
                this.gameStart_rsp(data);
                break;
            case CPlayerEvent.PLAYER_OPEN_POKER:
                this.kaipai_rsp(data);
                break;
            case CPlayerEvent.PLAYER_SHOW_SCORE:
                this.setPlayerScore(data);
                break;
            case CPlayerEvent.PLAYER_INIT_BET:
                this.initPlayerChip(data);
                break;
            case CPlayerEvent.PLAYER_FOLD:
                this.showFoldUI(data.userid);
                break;
            case CPlayerEvent.GAME_START:
                CDeskData.Instance().IsStart = true;
                this.initStat();
                break;
            case CPlayerEvent.PLAYER_INIT_POKER:
                CDeskData.Instance().IsStart = true;
                CDeskData.Instance().IsMatching = false;
                this.playerIndex = 0;
                this.pokerIndex = 0;
                this.count = -1;
                this.seedCardNum = 0;
                this.playAddPokerAction(false);
                this._addpokerbet = false;
                this.initStat();
                this.refrshOption();
                break;
            case CPlayerEvent.PLAYER_NORMAL_SEND_POKER:
                this.playerIndex = CPlayerData.Instance().getStartSendPoker();
                cc.log('发牌座位顺序号=======:', this.playerIndex);
                this.pokerIndex = 0;
                this.count = -1;
                this.seedCardNum = 0;
                this.cleanChip();
                this.playAddPokerAction(true);
                this._addpokerbet = false;
                cc.log("_addpokerbet: false.  CPlayerEvent.PLAYER_NORMAL_SEND_POKER");
                break;
            case OperationEvent.BET: //下注
                this.bet_rsp(data);
                break;
            case OperationEvent.GEN: //跟注
                this.bet_rsp(data);
                break;
            case OperationEvent.FAN_TI: //反踢
                this.bet_rsp(data);
                break;
            case OperationEvent.QI_JIAO: //起脚
                this.bet_rsp(data);
                break;
            case OperationEvent.PASS: //不踢
                this.pass_rsp(data);
                break;
            case OperationEvent.FOLD: //扣牌
                this.fold_rsp(data);
                break;
            case OperationEvent.ALL_IN:
                this.allIn_rsp(data);
                break;
            case OperationEvent.ROUND_END: //小结算
                this.roundEnd_rsp(data);
                break;
            case OperationEvent.REFRSHOPERATION: //刷新操作
                break;
            case RoomEvent.on_room_ready: //准备 继续
                this.RoomReady(data[0]);
                break;
            case RoomEvent.on_room_leave: //解散
                this.on_room_leave(data[0]);
                break;
            case CPlayerEvent.TDK_FINALRESULT: //总结算
                this.resultData = data;
                break;
            case CPlayerEvent.DISSLOVE: //解散申请返回
                this.onDissolve(data, 120);
                break;
            case CPlayerEvent.JOINROOM: //金币场加入已开始的桌子
                this.joinRoom();
                break;
            case CPlayerEvent.DISSOLVE_RESULT: //解散结果
                this.dissolveResult(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
            case RoomEvent.on_coin_room_enter: //匹配
                this.on_coin_room_enter();
                break
            case CPlayerEvent.TUOGUAN: //托管
                {
                    if (data.userid == cc.dd.user.id) {
                        this.showTuoGuan(data.isTuoguan);
                    }
                    var player = this.findPlayer(data.userid);
                    if (player)
                        player.showTuoguan(data.isTuoguan);
                    break;
                }
            case CPlayerEvent.OFFLINE: //离线
                this.showOffline(data);
                break;
            case cc.dd.native_gvoice_event.PLAY_GVOICE: //播放语音
                this.showYuying(data[0], true);
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE: //停止语音
                this.showYuying(data[0], false);
                break;
            case CPlayerEvent.PLAYEROPERATION: //重连玩家操作
                cc.log('重连玩家操作');
                this.startBet_rsp(data);
                break;
            // case CPlayerEvent.LANGUOGAME: //烂锅重新开局
            //     this.sendPokerAction();
            //     break;
            case CPlayerEvent.KAIPAI: //看牌玩家
                this.showKaiPai(data);
                break;
            case RoomEvent.update_player_location:
                this.on_player_location_change(data[0]);
                break;
            case RoomEvent.on_room_replace: //换桌成功
                this.changeDesk(data);
                break;
            case CPlayerEvent.PLAYER_BEN_BET: //本轮下注
                this.refrshBenBet();
                break;
            case CPlayerEvent.REFRSHOLOOKERS: //刷新旁观者
                this.showOnlookers();
                break;
        }
    },

    /**
     * 倒计时
     */
    showCutdown: function (userid, time) {
        cc.log('玩家ID:', userid, '倒计时：', time);
        for (var i = 0; i < this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item) {
                item.closeTime();
            }
        }
        var player = this.findPlayer(userid);
        if (player)
            player.showTimeNode(time);
    },
    /**
     * 断线重连刷新本轮下注
     */
    refrshBenBet: function () {
        CPlayerData.Instance().TdkCPlayerList.forEach(function (player) {
            var item = this.findPlayer(player.userid);
            if (item) {
                item.setDanChip(player.roundBet);
            }
        }.bind(this));
    },

    //位置更新
    on_player_location_change(msg) {
        var userId = msg.userId;
        var latlngInfo = msg.latlngInfo;
        var player = CPlayerData.Instance().getCommonData(userId);
        if (player) {
            player.ip = msg.ip;
            player.address = msg.address;
            player.location = latlngInfo;
        }
        this.refreshGPSWarn();
        var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        if (UI) {
            UI.getComponent('user_info_view').setGpsData(CPlayerData.Instance().GetPlayerConmmonData());
        }
    },

    /**
     * 看牌玩家
     */
    showKaiPai: function (data) {
        var player = this.findPlayer(data.userid);
        if (player)
            player.showKaiPai(data.userid);
    },

    /**
     * 清理本轮下注筹码
     */
    cleanChip: function () {
        for (var i = 0; i < this.player_list.length; i++) {
            var item = this.player_list[i];
            if (item) {
                item.cleandanChip();
            }
        }
    },

    /**
     * 金币场加入已开房间
     */
    joinRoom: function () {
        if (RoomMgr.Instance().gameId == gameType.TDK_COIN) {
            this.showDengdai(true);
            if (!this.changeCDTime)
                this.showChangeDeskBtn();
        }
    },

    /**
     * 等待下局开始
     */
    showDengdai: function (bl) {
        if (RoomMgr.Instance().gameId == gameType.TDK_COIN)
            cc.find('dengdai', this.node).active = bl;
    },

    /**
     * 语音
     */
    showYuying: function (data, bl) {
        var player = this.findPlayer(data);
        if (player)
            player.showYuying(bl);
    },

    /**
     * 离线
     */
    showOffline: function (data) {
        var player = this.findPlayer(data.userid);
        if (player)
            player.showOffline(data.join);
    },

    /**
     * 托管
     */
    showTuoGuan: function (bl) {
        var gameid = RoomMgr.Instance().gameId;
        if (gameid == gameType.TDK_COIN)
            cc.find('tuoguan_node', this.node).active = bl;
        else if (gameid == gameType.TDK_FRIEND || gameid == gameType.TDK_FRIEND_LIU)
            this.tuoguanNode.active = bl;
        // var player = this.findPlayer(cc.dd.user.id);
        // if (player)
        //     player.showTuoguan(bl);

    },

    //重连时游戏已结束
    reconnectHall: function () {
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 刷新桌面操作
     */
    refrshOption: function () {
        CPlayerData.Instance().TdkCPlayerList.forEach(function (player) {
            var opType = player.GetopType();
            if (opType && opType != 7) {
                var text = this.operation[opType - 1]
                this.activePlayerSpeak(player.userid, text);
            }
        }.bind(this));
    },

    /**
     * 显示总结算
     */
    showResult: function () {
        this.unschedule(this.showResult);//总结算
        cc.log('显示总结算:showResult');
        var resultNode = cc.find('result', this.node);
        if (resultNode) {
            var result = resultNode.getComponent('tdk_result');
            if (!result || !this.resultData) return;
            this.removOperat();
            result.initResultInfo(this.resultData);
            this.resultData = null;
            for (var i = 0; i < this.player_list.length; i++) {
                var item = this.player_list[i];
                if (item) {
                    item.closeTime();
                }
            }
        }
    },

    /**
     * 退出房间
     */
    on_room_leave: function (data) {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == gameType.TDK_COIN) {
            if (data.retCode == 0) {
                if (data.userId == cc.dd.user.id) {
                    var str = '';
                    if (data.coinRetCode == null) {
                        this.node.stopAllActions();
                        this.backToHall();
                        return;
                    }
                    switch (data.coinRetCode) {
                        case 0:
                            this.node.stopAllActions();
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

                    cc.dd.DialogBoxUtil.show(0, str, "确定", null, function () {
                        this.backToHall();
                    }.bind(this), null);
                }
            }
        } else {
            if (data.userId == cc.dd.user.id) {
                cc.dd.SceneManager.enterHall();
            }
            else {
                if (data.userId == RoomMgr.Instance().roomerId) {
                    cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", '确定', null, function () {
                        // 返回大厅
                        cc.dd.SceneManager.enterHall();
                    }, function () {
                    });
                }
            }
        }
    },

    backToHall(event, data) {
        //cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.getInstance().stopMusic();
        if (cc.dd._.isNumber(cc.go_to_xiaociji)) {
            cc.dd.NetWaitUtil.show('正在请求数据');
            var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            protoNewRoomList.setHallGameid(cc.go_to_xiaociji);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
                '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
            cc.go_to_xiaociji = null
        } else {
            cc.dd.SceneManager.enterHall();
        }
    },

    /**
    * 解散房间申请
    */
    onDissolve(msg, time) {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('nn_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = msg.remainTime ? msg.remainTime : (time ? time : 30);
                var playerList = CPlayerData.Instance().GetPlayerConmmonData();
                ui.getComponent('nn_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    /**
     * 解散返回
     */
    dissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
            this.resultCDTime = 5;
            var showTimer = function () {
                this.resultCDTime--;
                if (this.resultCDTime < 0 || this.resultData) {
                    this.resultCDTime = 0;
                    this.unschedule(showTimer);
                    this.showResult();
                }
            }.bind(this);
            this.unschedule(showTimer);
            this.schedule(showTimer, 1);

        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);

    },

    /**
     * 准备
     */
    RoomReady: function (data) {
        if (data.userId == cc.dd.user.id) {
            this.player_list.forEach(function (item) {
                item.clearPoker(true);
            });
            this.prepareNode.active = false;
            this.showStartBtn(false);
            this.showDengdai(false);
        }
        var player = this.findPlayer(data.userId);
        if (player) {
            player.setReadOkUI(true);
        }
    },

    showStartBtn: function (bl) {
        var gameid = CPlayerData.Instance().getGameId();
        if (gameid == gameType.TDK_FRIEND ||
            gameid == gameType.TDK_FRIEND_LIU) {
            if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                var startnode = cc.find('room_info/Botton/start', this.node);
                if (startnode)
                    startnode.active = bl;
            } else {
                var prepareNode = cc.find('room_info/prepareBtn', this.node);
                if (prepareNode) {
                    prepareNode.active = bl;
                }
            }

            if (bl == false) {
                var startnode = cc.find('room_info/Botton/start', this.node);
                if (startnode)
                    startnode.active = bl;
                var prepareNode = cc.find('room_info/prepareBtn', this.node);
                if (prepareNode) {
                    prepareNode.active = bl;
                }
            }
        }
    },


    /**
     * 邀请微信好友
     */
    onInvaite: function onInvaite(event, custom) {
        if (event.type != "touchend") {
            return;
        }

        hall_audio_mgr.com_btn_click();
        // if (!cc.sys.isNative) {
        //     return;
        // }
        var room = RoomMgr.Instance().roomId;
        if (cc.sys.isNative || cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            // cc.dd.native_wx.SendAppContent(room, "填大坑", "房间号:" + room + ",不要走,决战到天亮!", Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            var Rule = RoomMgr.Instance()._Rule;
            if (!Rule) {
                return;
            }

            var dizhu = CDeskData.Instance().dizhu;
            var bei = (tdkOperationData.Instance().roundEndData.endtype && Rule.lanDouble) ? 2 : 1; //烂锅加倍

            let wanFa = ['底注:' + cc.dd.Utils.getNumToWordTransform(dizhu), '封顶：' + cc.dd.Utils.getNumToWordTransform(dizhu * bei * 5), CDeskData.Instance().getPlayTypeStr(Rule.playType)];
            if (Rule.hasJoker) {
                wanFa.push('带王');
            }
            if (Rule.jokerPao) {
                wanFa.push('王中炮');
            }
            if (Rule.aPao) {
                wanFa.push('抓A必炮');
            }
            wanFa.push(Rule.shareType ? '公张随豹' : '公张随点');
            if (Rule.lanDouble) {
                wanFa.push('烂锅翻倍');
            }
            if (Rule.genfu) {
                wanFa.push('末脚踢服');
            }
            if (Rule.isOpen) {
                wanFa.push('亮底');
            }
            wanFa.push(Rule.bati ? '把踢' : '末踢');

            let playerList = CPlayerData.Instance().TdkCPlayerList;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userid) {
                    playerName.push(playerMsg.nick);
                }
            }, this);

            let info = {
                gameid: CPlayerData.Instance().getGameId(),//游戏ID
                roomid: CPlayerData.Instance().getRoomId(),//房间号
                title: '填大坑',//房间名称
                content: wanFa,//游戏规则数组
                usercount: CDeskData.Instance().playerCnt,//人数
                jushu: Rule.roundCount,//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            if (custom == 'xianliao') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink('【填大坑】', "房间号:" + room + ",不要走,决战到天亮!", url);
            }
            else
                cc.dd.native_wx.SendAppInvite(info, "填大坑", "房间号:" + room + ",不要走,决战到天亮!", Platform.wxShareGameUrl[AppCfg.PID]);
        }
    },

    /**
     * 准备
     */
    onReady: function () {
        clearInterval(this.wave_end_id);
        hall_audio_mgr.com_btn_click();
        this.checkFriendStar();
    },

    seedPrepareGameReq: function () {
        var msg = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        var gameid = CPlayerData.Instance().getGameId();
        var roomid = CPlayerData.Instance().getRoomId();
        gameInfoPB.setGameType(gameid);
        gameInfoPB.setRoomId(roomid);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);
    },

    /**
     * 匹配申请
     */
    sendGameReq: function () {
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        var gameType = CPlayerData.Instance().getGameId();
        var roomId = CPlayerData.Instance().getRoomId();
        msg.setGameType(gameType);
        msg.setRoomId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    /**
     * 匹配中
     */
    on_coin_room_enter: function () {
        CDeskData.Instance().IsMatching = true;
        //金币场开始游戏按钮
        this.matchBtn.active = false;
        this.match();
        this.prepareNode.active = false;
    },

    /**
     * 播放匹配动画
     */
    match: function () {
        if (RoomMgr.Instance().gameId == gameType.TDK_COIN) {
            this.anim_match.node.active = true;
            this.anim_match.playAnimation('FZZPPZ', -1);
            this.showDengdai(false);
            this.showwaitingNode(false);
        }
        var languo = cc.find('languo', this.node);
        languo.active = false;
    },

    /**
     * 发送托管协议
     */
    onTuoGuan: function () {
        TdkSender.onTuoGuan(false);
    },

    /**
     * 显示换桌按钮
     */
    showChangeDeskBtn: function () {
        this.prepareNode.active = true;
        this.changeDeskBtn.active = true;
        this.prepareBtn.active = false;
    },

    showPrepareNodeBtn: function () {
        this.prepareNode.active = true;
        this.changeDeskBtn.active = true;
        this.prepareBtn.active = true;
    },

    /**
     * 显示准备按钮
     */
    showprepareBtn: function (bl) {
        this.prepareNode.active = true;
        this.changeDeskBtn.active = false;
        this.prepareBtn.active = bl;
    },

    refreshGPSWarn: function () {
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps) {
            var gpsList = [];
            var playerInfo = CPlayerData.Instance().GetPlayerConmmonData();
            if (!playerInfo) return;
            for (var i = 0; i < playerInfo.length; i++) {
                var player = this.findPlayer(playerInfo[i].userId);
                if (player) {
                    cc.find('gps_bj', player.node).active = false;
                    if (playerInfo[i] && playerInfo[i].location) {
                        gpsList.push({ name: playerInfo[i].name, userId: playerInfo[i].userId, location: playerInfo[i].location });
                    }
                }
            }

            // for (var i = 0; i < gpsList.length - 1; i++) {
            //     for (var j = i; j < gpsList.length - 1; j++) {
            //         if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
            //             openGPS = true;
            //             var player1 = this.findPlayer(gpsList[j].userId);
            //             if (player1)
            //                 cc.find('gps_bj', player1.node).active = true;
            //             var player2 = this.findPlayer(gpsList[j + 1].userId);
            //             if (player2)
            //                 cc.find('gps_bj', player2.node).active = true;
            //         }
            //     }
            // }
            this.playergpslist = [];
            for (var i = 0; i < gpsList.length - 1; ++i) {
                var gpsarr = [];
                gpsarr.push(gpsList[i]);
                for (var j = i; j < gpsList.length - 1; j++) {
                    if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
                        gpsarr.push(gpsList[j + 1]);
                    }
                }
                this.playergpslist.push(gpsarr);
            }
            cc.log('玩家gps集合：', gpsList.length);
            this.playergpslist.sort(function (a, b) { return b.length - a.length; });
            var opengps = this.playergpslist[0] && this.playergpslist[0].length > 1 ? true : false;
            this.initGPS(opengps);
        }
    },

    getDistance(locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            return distance;
        }
    },

    shareZhanji(event, data) {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('zhanjitongji/gongzhonghao', this.node).active = true;
            if (data == 'wechat') {
                cc.dd.native_wx.SendScreenShot(canvasNode);
            }
            else {
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            }
            cc.find('zhanjitongji/gongzhonghao', this.node).active = false;
        }
    },

    /**
     * 是否开启
     */
    initGPS: function (bl) {
        this.unschedule(this.switchGps);
        var gpsNode = cc.find('layout/gpsInfo/gps', this.node);
        if (!gpsNode) return;
        if (gpsNode.active) {
            gpsNode.active = false;
        }
        if (bl)
            this.schedule(this.switchGps, 1);
    },

    /**
     * gps闪烁
     */
    switchGps: function () {
        var gpsNode = cc.find('layout/gpsInfo/gps', this.node);
        if (!gpsNode) return;
        if (gpsNode.active) {
            gpsNode.active = false;
        } else {
            gpsNode.active = true;
        }
    },

    /**
     * 反作弊提示
     */

    onClickGPS: function () {
        var list = this.playergpslist[0];
        if (list && list.length > 1) {
            var str = list[0] ? cc.dd.Utils.substr(list[0].name, 0, 4) : '';
            str += '与';
            for (var i = 1; i < list.length; ++i) {
                var player = list[i];
                if (player)
                    str += cc.dd.Utils.substr(player.name, 0, 4) + ' ';
            }
            str += '距离很近,请注意!'
            var bgwidth = str.length * 24 + 50;
            cc.dd.PromptBoxUtil.show(str, this.gpsBG, 1, bgwidth);
        };
    },

    /**
     * 观战人数
     */
    showOnlookers: function () {
        if (!this.guanzhanNode) return;
        var num = CPlayerData.Instance().getOnlookersList();
        var lbl = cc.find('guanzhanbg/lbl', this.guanzhanNode).getComponent(cc.Label);
        if (num > 0) {
            this.guanzhanNode.active = true;
            lbl.string = '观战人数:' + num;
        } else
            this.guanzhanNode.active = false;
    },
    /**
     * 打开观战列表
     */
    onClickOnlookers: function () {
        hall_audio_mgr.com_btn_click();
        var UI = cc.dd.UIMgr.getUI(gzUI);
        if (UI) {
            UI.getComponent('tdk_gzUI').initUI();
        }
        else {
            cc.dd.UIMgr.openUI(gzUI, function (ui) {
                ui.getComponent('tdk_gzUI').initUI();
            });
        }
    },

    /**
     * 显示喜分
     */
    showXifen: function (num) {
        if (this.xifenlbl)
            this.xifenlbl.string = num ? num : 0;
    },

    /**
     * 复制房间号
     */
    onClickFuzhi: function () {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            var roomid = CPlayerData.Instance().getRoomId();
            cc.dd.native_systool.SetClipBoardContent(roomid);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    /**
     * 判断朋友局开始状态
     */
    checkFriendStar: function () {
        if (CPlayerData.Instance().getGameId() != gameType.TDK_COIN) {
            var num = CPlayerData.Instance().getPlayerNum();
            cc.log('朋友局人数：', num);
            if (num == 2) {
                cc.dd.DialogBoxUtil.show(1, '房间只有2人，确定开局吗', '确定', '取消',
                    function () {
                        this.seedPrepareGameReq();
                    }.bind(this), null
                );
            } else {
                this.seedPrepareGameReq();
            }
        } else {
            this.seedPrepareGameReq();
        }
    },

    //更新经纬度
    sendLocationInfo() {
        if (CPlayerData.Instance().getGameId() == gameType.TDK_COIN) return;
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

    checkNotPlayGame() {
        return this.prepareNode.active;
    }

});
