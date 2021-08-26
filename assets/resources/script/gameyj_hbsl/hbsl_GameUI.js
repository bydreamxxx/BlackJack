var HBSL_Data = require("hbslData").HBSL_Data;
const HBSL_ED = require('hbslData').HBSL_ED;
const HBSL_Event = require('hbslData').HBSL_Event;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var hbslsend = require('hbsl_send_msg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require('Define');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var jlmj_prefab = require('jlmj_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var Platform = require('Platform');
var AppCfg = require('AppConfig');
const dissolveUI = 'gameyj_hbsl/prefabs/hb_dissolve';
const hbpath = 'gameyj_hbsl/sound/hongbao';
const zdpath = 'gameyj_hbsl/sound/qhb_zd';
const jbpath = 'gameyj_hbsl/sound/jb';
const tzrth = 'gameyj_hbsl/prefabs/watching';
const wfth = 'gameyj_hbsl/prefabs/playintroduceUi';
var AutomaticRobMgr = require('hbslData').AutomaticRobMgr;

cc.Class({
    extends: cc.Component,
    properties: {
        hongbaoNum: { type: cc.Label, default: null, tooltip: "红包数量" },
        heihao: { type: cc.Label, default: null, tooltip: "黑号" },
        maileiNode: { type: cc.Node, default: null, tooltip: "埋雷玩家" },
        nextDjs: { type: cc.Node, default: null, tooltip: "倒计时节点" },
        nextTime: { type: cc.Label, default: null, tooltip: "倒计时数字" },
        hbCoin: { type: cc.Label, default: null, tooltip: "红包金额" },
        hbbeilbl: { type: cc.Node, default: null, tooltip: "红包倍数" },
        selfNode: { type: cc.Node, default: null, tooltip: "自己信息" },
        saoLeiNode: { type: cc.Node, default: [], tooltip: "扫雷玩家信息" },
        winNode: { default: null, type: sp.Skeleton, tooltip: '赢动画' },
        LoseNode: { default: null, type: sp.Skeleton, tooltip: '输动画' },
        fuziNode: { type: cc.Node, default: null, tooltip: "浮字" },
        hbbtn: { type: cc.Button, default: null, tooltip: "红包按钮" },
        friendNode: { type: cc.Node, default: null, tooltip: "朋友局信息" },
        weixinBtn: { type: cc.Node, default: null, tooltip: "邀请按钮" },
        friendBtn: { type: cc.Node, default: null, tooltip: "准备按钮" },
        hbNode: { type: cc.Node, default: null, tooltip: "红包" },
        winNode1: { default: null, type: sp.Skeleton, tooltip: '赢动画1' },
        LoseNode1: { default: null, type: sp.Skeleton, tooltip: '输动画1' },
        settlementNode: { type: cc.Node, default: null, tooltip: "数字父节点" },
        settlementlbl: { type: cc.Label, default: null, tooltip: "数字" },
        beilbl: { type: cc.Node, default: null, tooltip: "倍数" },
        zidongNode: { type: cc.Node, default: null, tooltip: "取消自动节点" },
        zidong: { type: cc.Node, default: null, tooltip: "自动节点" },
        zidonglbl: { type: cc.Label, default: null, tooltip: "自动抢包次数" },
        qinyouweixinBtn: { type: cc.Node, default: null, tooltip: "亲友圈邀请按钮" },
    },

    onLoad: function () {
        HBSL_ED.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        this.hbNode.active = false;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            this.friendNode.active = true;
            this.initUI();
            this.initInterface();
            //刷新扫雷玩家列表
            this.refreshSaolei();
            this.refreshSeflUI();
            this.initSaoleiUI();
            this.showWeixinUI();
        }
    },

    initSaoleiUI: function () {
        var saoleilist = HBSL_Data.Instance().getSaoLeiData();
        saoleilist.forEach(function (role) {
            var player = this.getSaoleiPlayer(role.userid)
            if (player)
                player.setReady(role.ready);
        }.bind(this));
        var selfData = HBSL_Data.Instance().getSelfInfoData();
        var selfPlayer = this.selfNode.getComponent('playerCommon');
        if (selfPlayer && selfData) {
            selfPlayer.setReady(selfData.ready);
            this.friendBtn.active = !selfData.ready;
        }
    },

    onDestroy: function () {
        HBSL_ED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        HBSL_Data.Destroy();
        AutomaticRobMgr.Destroy();
        RoomED.removeObserver(this);
    },

    /**
     * 界面初始化
     */
    initUI: function () {
        this.hongbaoNum.string = 0;
        this.heihao.string = 0;
        var maileiPlayer = this.maileiNode.getComponent('playerCommon');
        if (maileiPlayer) {
            maileiPlayer.initUI();
        }

        this.saoLeiNode.forEach(function (item) {
            item.active = false;
            var common = item.getComponent('playerCommon');
            if (common)
                common.initUI();
        }.bind(this));

        var selfPlayer = this.selfNode.getComponent('playerCommon');
        if (selfPlayer) {
            selfPlayer.resetUI();
        }
        this.hbbtn.node.active = true;
        this.nextDjs.active = false;
        this.nextTime.string = 0;
        this.hbCoin.string = 0;
        this.hbbeilbl.active = false;
        this.beilbl.active = false;
        this.settlementNode.active = false;
        this.winNode.node.active = false;
        this.LoseNode.node.active = false;
        this.winNode1.node.active = false;
        this.LoseNode1.node.active = false;
    },

    /**
     * 朋友场刷新局数
     */
    initInterface: function () {
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var rule = RoomMgr.Instance()._Rule;
            cc.find('topNode/btn_sqml_02', this.node).active = rule ? rule.zhuangType == 4 : false;
            var num = HBSL_Data.Instance().getRound();
            var round = cc.find('room_info/round/cur_round', this.node).getComponent(cc.Label);
            if (round)
                round.string = num;
            var roomNum = cc.find('room_info/round/room_num', this.node).getComponent(cc.Label);
            var str = rule && rule.zhuangType == 1 ? '轮' : '局';
            if (roomNum)
                roomNum.string = '/' + rule.roleCount + str;

            //玩法名称+人数+圈数+封顶+缺几人
            rule = '红包扫雷' + ' ' + rule.roleCount + str;
            this.qinyouweixinBtn.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule)
        }
    },

    setFriendGroupInvite(visible) {
        let node = this.qinyouweixinBtn;
        if (node) {
            if (visible) {
                node.active = RoomMgr.Instance().isClubRoom();
            } else {
                node.active = false;
            }
        }
    },

    /**
     * 朋友场初始化
     */
    initFriendUI: function () {
        this.initInterface();
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var rule = RoomMgr.Instance()._Rule;
            this.friendNode.active = false;
            this.saoLeiNode.forEach(function (item) {
                item.active = false;
                var role = item.getComponent('playerCommon');
                role.setReady(false);
            }.bind(this));
            var selfData = HBSL_Data.Instance().getSelfInfoData();
            if (rule.isJoin && selfData && !selfData.ready) {
                this.friendNode.active = true;
                cc.find('prepare/GuZe', this.friendNode).active = false;
                this.weixinBtn.active = false;
                this.setFriendGroupInvite(false);
            }
            var selfPlayer = this.selfNode.getComponent('playerCommon');
            if (selfPlayer) {
                selfPlayer.setReady(false);
            }
            this.friendBtn.active = false;
            var saolei = HBSL_Data.Instance().getSaoLeiData();
            if (saolei && saolei.length > 10) {
                this.friendBtn.active = false;
            }

        }
    },

    /**
     * 得到扫雷玩家
     */
    getSaoleiPlayer: function (userid) {
        var playerui = null;
        this.saoLeiNode.forEach(function (role) {
            var player = role.getComponent('playerCommon');
            if (player && player.userid == userid)
                playerui = player;
        }.bind(this))
        return playerui;
    },

    /**
   * 回调事件
   */
    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME: //断线恢复后当局已结算
                this.reconnectHall();
                break;
            case HBSL_Event.RECONNECT: //重连
                this.reconnectDissolve(data.dissolveTimeout, data.dissolveInfoList);
                break;
            case HBSL_Event.DESK_INIT: //初始化桌子
                this.showDeskInfo(data);
                break;
            case HBSL_Event.PLAYER_READY: //玩家准备
                this.showPlyaerReady(data);
                break;
            case HBSL_Event.PLAYER_ENTER: //玩家加入房间
                this.showPlayerEnter(data);
                break;
            case HBSL_Event.PLAYER_ROBHB: //广播玩家参与抢红包
                this.showradioPlayerRobHb(data);
                break;
            case HBSL_Event.PLAYER_ROB: //玩家抢红包返回
                this.shoWPlayerRobHB(data);
                break;
            case HBSL_Event.PULL_MINE: //拉取埋雷玩家列表
                this.showPullMine(data);
                break;
            case HBSL_Event.PLAYER_Exit://玩家退出房间
                this.showPlayeExit(data);
                break;
            case HBSL_Event.PLAYER_MAIHB: //埋红包
                this.showselfInfo(data);
                break;
            case HBSL_Event.OPEN_LOTTERY: //开奖
                this.openLottery(data);
                break;
            case HBSL_Event.UPDATECOIN: //更新金币
                this.refreshCoin(data.money);
                break;
            case HBSL_Event.SETTLEMENT://大结算
                this.showSettlement(data);
                break;
            case RoomEvent.on_room_leave: //解散
                this.on_room_leave(data[0]);
                break;
            case HBSL_Event.DISSOLVE: //解散申请
                this.onDissolve(data, 30);
                break;
            case HBSL_Event.DISSOLVE_RESULT: //解散结果
                this.dissolveResult(data);
                break;
            case HBSL_Event.OPEN_WUXIAN: //开启自动抢包功能
                this.onAutomaticRob();
                this.showAutomatic();
                this.showAutomaticTime();
                break;
        }
    },

    /**
     * 断线重连--解散申请
     * @param tiem 倒计时
     * @param dissolveInfolist 玩家解散数据数组
     */
    reconnectDissolve: function (tiem, dissolveInfolist) {
        if (dissolveInfolist.length == 0) {
            return;
        }
        for (var i = 0; i < dissolveInfolist.length; ++i) {
            this.onDissolve(dissolveInfolist[i], tiem);
        }
    },

    /**
     * 解散返回
     */
    dissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);

    },

    /**
     * 解散房间申请
     */
    onDissolve(msg, time) {
        this.closePopupView();
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('ddz_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = time ? time : 30;
                var playerList = HBSL_Data.Instance().GetPlayerInfo();
                ui.getComponent('ddz_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    closePopupView: function () {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
    },

    /**
     * 退出房间
     */
    on_room_leave: function (data) {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype != Define.GameType.HBSL_JBL) {
            return;
        }

        if (data.userId == cc.dd.user.id) {
            HBSL_Data.Destroy();
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
    },

    /**
     * 大结算
     */
    showSettlement: function (data) {
        HBSL_Data.Instance().isEnd = true;
        HBSL_Data.Instance().IsStart = false;
        if (!this.result)
            this.result = this.node.getComponentInChildren('hbsl_result');
        this.result.initResultInfo(data);
        var dissolveui = cc.dd.UIMgr.getUI(dissolveUI);
        if (dissolveui)
            dissolveui.active = false;
        var mineui = cc.dd.UIMgr.getUI('gameyj_hbsl/prefabs/mineUI');
        if (mineui)
            mineui.active = false;
    },

    /**
     * 玩家退出房间
     */
    showPlayeExit: function (userid) {
        if (userid == cc.dd.user.id) {
            this.backToHall();
        } else {
            //刷新扫雷玩家列表
            this.refreshSaolei();
            this.showWeixinUI();
        }
    },

    /**
     * 玩家加入房间
     */
    showPlayerEnter: function (role) {
        if (!role) return;
        if (role.userid == cc.dd.user.id) {
            this.initUI();
            this.refreshSeflUI();
        }
        //刷新扫雷玩家列表
        this.refreshSaolei();
        var gamestate = HBSL_Data.Instance().getGamestate();
        if (!gamestate) {
            this.initSaoleiUI();
        }
        this.showWeixinUI();
    },

    /**
     * 玩家准备
     */
    showPlyaerReady: function (role) {
        this.showWeixinUI();
        if (!role) return;
        if (role.userid == cc.dd.user.id) {
            var selfPlayer = this.selfNode.getComponent('playerCommon');
            if (selfPlayer) {
                selfPlayer.setReady(role.ready);
            }
            this.friendBtn.active = false;
        } else {
            var player = this.getSaoleiPlayer(role.userid);
            if (player) {
                player.setReady(role.ready);
            }
        }
    },

    showWeixinUI: function () {
        var gamestate = HBSL_Data.Instance().getGamestate();
        if (gamestate) {
            this.weixinBtn.active = false;
            this.setFriendGroupInvite(false);
            return;
        }
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var saolei = HBSL_Data.Instance().getSaoLeiData();
            cc.log('房间里总人数：', saolei.length);
            if (saolei.length >= 10) {
                this.weixinBtn.active = false;
                this.setFriendGroupInvite(false);
            } else {
                this.weixinBtn.active = true;
                this.setFriendGroupInvite(true);
            }

            var selfData = HBSL_Data.Instance().getSelfInfoData();
            if (selfData)
                this.friendBtn.active = !selfData.ready;
        }
    },

    /**
     * 刷新玩家金额
     */
    showselfInfo: function (data) {
        switch (data.code) {
            case 0:
                cc.dd.PromptBoxUtil.show('埋雷成功！');
                this.refreshCoin(data.money);
                break;
            case 1:
                cc.dd.PromptBoxUtil.show('当局埋雷玩家已满!');
                break;
            case 3:
                cc.dd.PromptBoxUtil.show('金币不足埋红包最低限额!');
                break;
        }
    },

    refreshCoin: function (num) {
        var selfPlayer = this.selfNode.getComponent('playerCommon');
        if (selfPlayer) {
            selfPlayer.refrshCoin(num);
        }
    },

    /**
     * 开奖
     */
    openLottery: function (data) {
        if (!this.saoLeiNode || !data) return;
        this.saoLeiNode.forEach(function (item) {
            var palyer = item.getComponent('playerCommon');
            if (!palyer) return;
            data.playersList.forEach(function (role) {
                if (role.id == palyer.userid)
                    palyer.setHbResults(role.money);
            }.bind(this));
        }.bind(this));
        var maileiPlayer = this.maileiNode.getComponent('playerCommon');
        if (maileiPlayer) {
            maileiPlayer.setHbResults(data.zhaung.result);
        }

        var selfPlayer = this.selfNode.getComponent('playerCommon');
        if (data.zhaung.id == cc.dd.user.id) {
            var self = HBSL_Data.Instance().getSelfInfoData();
            var num = self.money;
            selfPlayer.refrshCoin(num);
        } else {
            //selfPlayer.resetUI();
        }
        var cdTime = 3;
        var inituiTimer = function () {
            cdTime--;
            if (cdTime <= 0) {
                this.initUI();
                //刷新扫雷玩家列表
                if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
                    this.refreshSaolei();
                }
                this.unschedule(inituiTimer);
            }
        }.bind(this);
        this.unschedule(inituiTimer);
        this.schedule(inituiTimer, 1);
    },

    /**
     * 拉取埋雷玩家列表
     */
    showPullMine: function (data) {
        var mineui = cc.dd.UIMgr.getUI('gameyj_hbsl/prefabs/mineUI');
        if (mineui) {
            mineui.getComponent('hbsl_MineUI').setData(data);
        } else {
            cc.dd.UIMgr.openUI('gameyj_hbsl/prefabs/mineUI', function (ui) {
                ui.getComponent('hbsl_MineUI').setData(data);
            }.bind(this));
        }
    },

    /**
     * 玩家抢红包返回
     */
    shoWPlayerRobHB: function (data) {
        if (data.code == 1) {
            cc.dd.PromptBoxUtil.show('金币不足以抢该红包!');
            return;
        }
        var isopen = AutomaticRobMgr.Instance().getisOpen(); //是否开启自动抢红包功能
        if (isopen) {
            AutomaticRobMgr.Instance().reduceRobNum();
            this.showAutomatic();
        }
        if (!this.saoLeiNode) return;
        cc.log('玩家抢的红包数量:', data.money);
        var num = this.getResults(data.money);
        this.settlementNode.active = true;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            this.beilbl.active = true;
        }
        this.hbbtn.node.active = false;
        //特效
        if (num > 0) { //赢
            if (this.winNode) {
                AudioManager.getInstance().playSound(jbpath, false);
                this.winNode.node.active = true;
                this.winNode.setCompleteListener(function () {
                    this.winNode.node.active = false;
                    this.winNode1.node.active = true;
                    //this.winNode.setAnimation(0, 'shenglibaojinbi1', false);
                }.bind(this));
                this.winNode.setAnimation(0, 'shenglibaojinbi', false);
            }
        } else { //输
            if (this.LoseNode) {
                AudioManager.getInstance().playSound(zdpath, false);
                this.LoseNode.node.active = true;
                this.LoseNode.setCompleteListener(function () {
                    this.LoseNode.node.active = false;
                    this.LoseNode1.node.active = true;
                    //this.LoseNode.setAnimation(0, 'shibaizhadan1', false);
                }.bind(this));
                this.node.getComponent(cc.Animation).play('rocket_camera_1');
                this.LoseNode.setAnimation(0, 'shibaizhadan', false);
            }
        }

        //飘字
        if (this.fuziNode) {
            this.fuziNode.active = true;
            var item = this.fuziNode.getComponent('playerCommon');
            if (item) {
                item.setHbResults(num);
            }
            var seq = cc.sequence(cc.moveTo(2, cc.v2(0, 30)), cc.callFunc(function () {
                this.fuziNode.active = false;
                this.fuziNode.setPosition(0, -112);
            }.bind(this)));
            this.fuziNode.runAction(seq);
        }
    },

    /**
     * 刷新自己信息
     */
    refreshSeflUI: function () {
        //玩家自己信息
        var selfPlayer = this.selfNode.getComponent('playerCommon');
        if (selfPlayer) {
            selfPlayer.resetUI();
            selfPlayer.setPlayer(HBSL_Data.Instance().getSelfInfoData(), true);
        }
    },

    showDeskInfo: function (data) {
        cc.log('初始化桌子!')
        this.initUI();
        //玩家自己信息
        this.refreshSeflUI();
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            //检查桌子状态
            var bl = HBSL_Data.Instance().getDeskState();
            this.checkDesk(bl);
            if (bl) return;
        }
        this.initFriendUI();
        //埋雷玩家
        var maileiData = data.getMaiLeiData();
        var maileiPlayer = this.maileiNode.getComponent('playerCommon');
        if (maileiPlayer) {
            maileiPlayer.initUI();
        }
        if (maileiData && maileiPlayer) {
            this.hbNode.active = true;
            this.heihao.string = maileiData.num;
            maileiPlayer.setPlayer(maileiData.role);
            var hbnum = maileiData.money / 10000;
            this.hbCoin.string = hbnum;
            var beistr = maileiData.rate + '倍';
            if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
                this.hbbeilbl.active = true;
            }
            this.hbbeilbl.getComponent(cc.Label).string = beistr;
            this.beilbl.getComponent(cc.Label).string = beistr;
            maileiPlayer.resetUI();
            this.settlementNode.active = false;
            this.settlementlbl.string = hbnum;

        }
        if (maileiData.role) {
            //红包倒计时
            cc.log('红包倒计时：', data.getTime());
            var nexttime = data.getTime();
            if (nexttime < 0) {
                this.nextDjs.active = false;
            } else {
                var nextfun = function () {
                    nexttime--;
                    if (nexttime >= 0)
                        this.nextTime.string = nexttime;
                    else {
                        this.unschedule(nextfun);
                    }
                }.bind(this)
                this.unschedule(nextfun);
                this.nextDjs.active = true;
                this.nextTime.string = nexttime;
                this.schedule(nextfun, 1);
            }
        }

        //扫雷玩家信息
        this.refreshSaolei();
        //检查玩家是否需要埋雷
        this.checkSaolei();
        this.winNode.node.active = false;
        this.LoseNode.node.active = false;
        HBSL_Data.Instance().IsStart = true;
        this.winNode1.node.active = false;
        this.LoseNode1.node.active = false;
        //自动抢红包
        this.onAutomaticRob();
        this.showAutomatic();
    },

    /**
     * 检查桌子状态
     */
    checkDesk: function (bl) {
        var dengdaibg = cc.find('dengdai', this.node);
        if (dengdaibg)
            dengdaibg.active = bl;
    },

    /**
     * 检查玩家是否需要埋雷
     */
    checkSaolei: function () {
        var selfData = HBSL_Data.Instance().getSelfInfoData();
        if (!selfData) return;
        cc.log('玩家：', selfData.userid + ' 埋雷状态：', selfData.state);
        if (selfData.state == 1)
            hbslsend.sendMineInfo();
    },

    /**
     * 刷新扫雷列表
     */
    refreshSaolei: function () {
        //剩余红包数量
        this.hongbaoNum.string = HBSL_Data.Instance().getHongBaoNum();
        var saoLieData = HBSL_Data.Instance().getSaoLeiData();
        if (this.saoLeiNode && saoLieData) {
            this.saoLeiNode.forEach(function (item) {
                item.active = false;
                var role = item.getComponent('playerCommon');
                if (role)
                    role.initUI();
            }.bind(this));
            for (var i = 0; i < saoLieData.length; ++i) {
                var item = this.saoLeiNode[i];
                if (!item) return;
                item.active = true;
                var playerData = saoLieData[i];
                var player = item.getComponent('playerCommon');
                if (!player) return;
                player.setPlayer(playerData);
            }
        }
    },

    /**
     * 广播玩家抢红包
     */
    showradioPlayerRobHb: function (data) {
        this.refreshSaolei(); //刷新扫雷列表
        if (data && data.userid == cc.dd.user.id) {
            //玩家自己信息
            var selfPlayer = this.selfNode.getComponent('playerCommon');
            if (selfPlayer) {
                selfPlayer.setHbResults(data.result, true);
            }
        }
    },

    /**
     * 得到最后的结果
     */
    getResults: function (openMoney) {
        var mailei = HBSL_Data.Instance().getMaiLeiData();
        if (mailei) {
            var counNum = mailei.money * mailei.rate;
            var moneyNum = openMoney - counNum;
            var weihaoStr = (openMoney * 0.0001).toFixed(2);
            var weihao = parseInt(weihaoStr.charAt(weihaoStr.length - 1));
            cc.log('----尾号：', mailei.num + '---- :', weihao, '======:', moneyNum);
            if (weihao == mailei.num) {
                return moneyNum;
            }
        }
        return openMoney;
    },

    //重连时游戏已结束
    reconnectHall: function () {
        this.backToHall();
    },

    //返回大厅
    backToHall: function (event, data) {
        HBSL_Data.Destroy();
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 申请埋雷
     */
    onClickapplyMine: function () {
        if (!HBSL_Data.Instance().getGamestate()) {
            cc.dd.PromptBoxUtil.show('游戏未开始!');
            return;
        }
        hall_audio_mgr.com_btn_click();
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var selfData = HBSL_Data.Instance().getSelfInfoData();
            if (selfData && selfData.ready) {
                hbslsend.sendMineInfo();
            } else {
                cc.dd.PromptBoxUtil.show('旁观模式下，无法操作!');
            }
        } else {
            hbslsend.sendMineInfo();
        }
    },

    /**
     * 判断自己是否是旁观者
     */
    checkSelfPZ: function () {
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var selfData = HBSL_Data.Instance().getSelfInfoData();
            if (selfData && !selfData.ready) {
                cc.dd.PromptBoxUtil.show('旁观模式下，无法操作!');
                return true;
            }
        }
        return false;
    },

    /**
     * 抢红包
     */
    robHB: function () {
        if (this.checkSelfPZ())
            return;
        var bl = HBSL_Data.Instance().getDeskState();
        if (bl) {
            cc.dd.PromptBoxUtil.show('等待中!');
            return;
        }
        var selfData = HBSL_Data.Instance().getSelfInfoData();
        var maileiPlayer = HBSL_Data.Instance().getMaiLeiData();
        var maileiData = maileiPlayer ? maileiPlayer.role : null;
        if (!maileiData) return;
        if (cc.dd.user.id == maileiData.userid) {
            cc.dd.PromptBoxUtil.show('不能抢自己埋的雷！');
            return;
        }
        cc.log('抢红包：----------', RoomMgr.Instance().gameId, '-======: ', Define.GameType.HBSL_JBL);
        // if ((RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) && (selfData.money < maileiData.money)) {
        //     cc.dd.PromptBoxUtil.show('自身金币不低于红包总金额!');
        //     return;
        // }
        AudioManager.getInstance().playSound(hbpath, false);
        hbslsend.SendrobHB();
    },

    /**
     * 准备按钮事件
     */
    onClickPrepare: function () {
        hall_audio_mgr.com_btn_click();
        var state = HBSL_Data.Instance().getGamestate();
        if (!state) {
            var msg = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(RoomMgr.Instance().gameId);
            gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);
        } else {
            hbslsend.sendEnter();
        }

    },

    /**
     * 邀请微信按钮事件
     */
    onClickKiaju: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }

        hall_audio_mgr.com_btn_click();
        var data = HBSL_Data.Instance();
        var roomid = RoomMgr.Instance().roomId;
        var title = "【红包扫雷】房间号:" + roomid + '\n';
        var str = "玩法: " + data.getZhuangStr() + "规则: " + data.getModeStr();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(roomid, "", title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));

            let wanFa = [data.getZhuangStr(), data.getModeStr(), data.getBeiStr(), data.getMaiLeiStr()];

            let playerList = HBSL_Data.Instance().GetPlayerInfo();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: '红包扫雷',//房间名称
                content: wanFa,//游戏规则数组
                usercount: 11,//人数
                jushu: RoomMgr.Instance()._Rule.roleCount,//局\圈数
                jushutitle: RoomMgr.Instance()._Rule.zhuangType == 1 ? '轮数' : '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            cc.dd.native_wx.SendAppInvite(info, "", title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
        cc.log("邀请好友：", title + str);
    },

    /**
     * 投注人
     */
    onClickTouZhuren: function () {
        hall_audio_mgr.com_btn_click();
        var UI = cc.dd.UIMgr.getUI(tzrth);
        if (UI) {
            UI.getComponent('hbsl_watchingUI').initUI();
        }
        else {
            cc.dd.UIMgr.openUI(tzrth, function (ui) {
                ui.getComponent('hbsl_watchingUI').initUI();
            });
        }
    },

    /**
     * 玩法
     */
    onClikcWafa: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(wfth, function (ui) {

        });
    },

    /**
     * 打开自动抢包设置界面
     */
    onClickAutomaticRob: function () {
        if (!HBSL_Data.Instance().getGamestate()) {
            cc.dd.PromptBoxUtil.show('游戏未开始!');
            return;
        }
        if (this.checkSelfPZ())
            return;

        var automaticRobUI = cc.dd.UIMgr.getUI('gameyj_hbsl/prefabs/AutomaticRob');
        if (automaticRobUI) {
            automaticRobUI.getComponent('hbls_AutomaticRobUI').init();
        } else {
            cc.dd.UIMgr.openUI('gameyj_hbsl/prefabs/AutomaticRob', function (ui) {
                ui.getComponent('hbls_AutomaticRobUI').init();
            }.bind(this));
        }
    },

    /**
     * 取消自动抢包功能
     */
    onCancelAutomaticRob: function () {
        AutomaticRobMgr.Instance().cancelAutomaticRob();
        this.showAutomatic();
    },

    /**
     * 自动抢红包
     */
    onAutomaticRob: function () {
        AutomaticRobMgr.Instance().checkgood(); //检查金币是否足够
        var isopen = AutomaticRobMgr.Instance().getisOpen(); //是否开启自动抢红包功能
        if (!isopen)
            return;
        var num = AutomaticRobMgr.Instance().getRobNum();
        var numbl = (num == -1 || num > 0) ? true : false; //次数满足
        var maileiData = HBSL_Data.Instance().getMaiLeiData();
        if (!maileiData) return;
        var hbnum = maileiData.money / 10000;
        var moneybl = AutomaticRobMgr.Instance().checkHbMoney(hbnum); //判断是否可以抢该红包
        cc.log('maileiData.money:', maileiData.money, '  numbl：', numbl, ' moneybl:', moneybl)
        if (numbl && moneybl) {
            cc.log('自动开始抢')
            this.robHB();
        }
    },

    /**
     * 自动抢包按钮状态
     */
    showAutomatic: function () {
        var num = AutomaticRobMgr.Instance().getRobNum();
        var str = '';
        switch (num) {
            case -1:
                str = '无限次';
                break;
            case 0:
                str = ''
                break;
            default:
                str = num;
        }
        cc.log('次数：', num, 'str:', str);
        if (this.zidonglbl)
            this.zidonglbl.string = str;
        var isopen = AutomaticRobMgr.Instance().getisOpen();
        if (this.zidong)
            this.zidong.active = !isopen;
    },

    showAutomaticTime: function () {
        var isopen = AutomaticRobMgr.Instance().getisOpen();
        if (isopen && !this.zidongTime) {
            this.schedule(this.switchNoAutomatic, 0.5);
        }
    },

    switchNoAutomatic: function () {
        if (!this.zidongNode)
            return;
        this.zidongTime = true;
        if (this.zidongNode.active) {
            this.zidongNode.active = false;
        } else {
            this.zidongNode.active = true;
        }
        var isopen = AutomaticRobMgr.Instance().getisOpen();
        if (!isopen) {
            this.zidongTime = false;
            this.unschedule(this.switchNoAutomatic);
        }

    },
});