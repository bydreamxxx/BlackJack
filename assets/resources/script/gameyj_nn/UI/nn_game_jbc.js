var nn_mgr = require('nn_mgr');
var nn_data = require('nn_data');
var nn_send_msg = require('douniu_send_msg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var nn_audio_cfg = require('nn_audio_cfg');
var jlmj_prefab = require('jlmj_prefab_cfg');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var HallPropData = require('hall_prop_data').HallPropData;
var game_room = require("game_room");
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var hallData = require("hall_common_data").HallCommonData;

cc.Class({
    extends: require('nn_game_pyc'),

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        RoomMgr.Instance().player_mgr = nn_data.Instance();
        nn_data.Instance().setPlayerNum(5);//修改成五人场
        RoomMgr.Instance().roomType = 2;
        RoomMgr.Instance()._Rule = null;
        this.anim_match = cc.find('anim_matching', this.node).getComponent(cc.Animation);
        this.btn_menu = cc.find('btns/menu', this.node).getComponent(cc.Button);
        this.btn_match = cc.find('btn_match', this.node).getComponent(cc.Button);
        this.node_guize = cc.find('guize', this.node);
        this.node_menu = cc.find('menu', this.node);
        this.node_roombase = cc.find('layer_base_score', this.node);
        this.node_setting = cc.find('setting', this.node);
        //----------------------
        this.cur_ju = cc.find('useless/lbl', this.node).getComponent(cc.Label);
        this.btn_jixu = cc.find('useless/lbl', this.node).getComponent(cc.Label);
        //----------------------
        this.initMusicAndSound();
        this.initRoomInfo();
        this.initZhuoBu();

        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
    },

    start() {
        nn_mgr.Instance().setGameUI(this);
    },

    update(dt) {
        this._super(dt);
    },

    onDestroy() {
        RoomED.removeObserver(this);
        HallCommonEd.removeObserver(this);

        nn_mgr.Instance().setGameUI(null);
        nn_data.Destroy();
        RoomMgr.Instance().clear();
        AudioManager.getInstance().stopMusic();
        AudioManager.getInstance().stopAllLoopSound();
        if (this.coinPool) {
            this.coinPool.clear();
        }
    },

    //返回游戏列表  
    backToRoomList() {
        nn_data.Destroy();
        cc.dd.SceneManager.enterRoomList();
    },

    /** 
     * 游戏开始  
    */
    gameStart() {
        nn_data.Instance().isMatching = false;
        nn_data.Instance().isEnd = false;
        this.anim_match.stop();
        this.anim_match.node.active = false;
        this.node_roombase.active = false;
        this.btn_match.node.active = false;
    },

    /**
     * 初始化房间名 底分
     */
    initRoomInfo() {
        var name_lbl = cc.find('layer_base_score/name', this.node).getComponent(cc.Label);
        var score_lbl = cc.find('layer_base_score/base_score', this.node).getComponent(cc.Label);
        var title_str = nn_data.Instance().m_strTitle ? nn_data.Instance().m_strTitle : '';
        var score_str = '底分: ' + (nn_data.Instance().m_nBaseScore ? nn_data.Instance().m_nBaseScore : '');
        name_lbl.string = title_str;
        score_lbl.string = score_str;
        cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
    },

    /**
     * 消息事件
     */
    onEventMessage(event, data) {
        switch (event) {
            case RoomEvent.on_coin_room_enter:
                this.showMatching();
                break;
            case RoomEvent.on_room_ready:
                this.onRoomReady(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.on_room_replace:
                this.onRoomReplace(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.backToHall();
                break;
            case RoomEvent.on_room_leave_plan:
                var strs = ['本局结束后您将自动退出游戏', '房间不存在', '不在此房间内', '不能离开房间'];
                var str = strs[data[0].retCode];
                if (data[0].retCode == 0) {
                    this._nextHuanZhuo = false;
                }
                cc.dd.PromptBoxUtil.show(str);
                break;
            case RoomEvent.on_room_join:
                var player = nn_data.Instance().getPlayerById(data[0].roleInfo.userId);
                player.isWatch = true;
                this.refreshDengIcon();
                break;
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
        if (nn_data.Instance().isMatching) {
            this.sendLeaveRoom();
        } else {
            if (nn_data.Instance().isGaming) {
                var self = nn_data.Instance().getPlayerById(cc.dd.user.id);
                if (self.isWatch) {
                    this.sendLeaveRoom();
                }
                else if (nn_data.Instance().isResult) {
                    cc.dd.DialogBoxUtil.show(0, '正在游戏中，退出后系统自动操作，是否退出', '确定', '取消', this.sendLeaveRoom, null, '退出游戏');
                }
                else {
                    // cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    //     ui.getComponent("jlmj_popup_view").show('正在游戏中，退出后系统自动出牌，是否退出?', this.sendLeaveRoom, 1);
                    // }.bind(this));
                    cc.dd.DialogBoxUtil.show(0, '正在游戏中，退出后系统自动操作，是否退出', '下局退出', '确定', this.sendLeaveRoomPlan, this.sendLeaveRoom, '退出游戏');
                    cc.dd.DialogBoxUtil.setBgCancel();
                }
            } else {
                this.backToHall();
            }
        }
    },

    /**
     * 开始按钮
     */
    onMatch(event, custom) {
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        var gameType = nn_data.Instance().getGameId();
        var roomId = nn_data.Instance().getRoomId();
        msg.setGameType(gameType);
        msg.setRoomId(roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    /**
     * 继续
     */
    onNextGame(event, custom) {
        var gameType = nn_data.Instance().getGameId();
        var roomId = nn_data.Instance().getRoomId();
        nn_send_msg.nextgame(gameType, roomId);
    },

    /**
     * 换桌
     */
    onReplaceTable(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.node_menu.active = false;
        this.menu_show = false;
        this.btn_menu.interactable = true;
        //this.sendReplaceRoom();
        if (nn_data.Instance().isMatching) {
            this.sendReplaceRoom();
        } else {
            if (nn_data.Instance().isGaming) {
                var self = nn_data.Instance().getPlayerById(cc.dd.user.id);
                if (self.isWatch) {
                    this.sendReplaceRoom();
                }
                else {
                    cc.dd.PromptBoxUtil.show('换桌成功，本局结束后将为您自动换桌');
                    this._nextHuanZhuo = true;
                    //cc.dd.DialogBoxUtil.show(0, '游戏中不能换桌，请您等待本局结束', '确定', null, null, null, '换桌失败');
                }
            } else {
                this.sendReplaceRoom();
            }
        }
    },

    //继续
    onRoomReady(msg) {
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
                this.resetGameUI();
                nn_data.Instance().isMatching = true;
                //this.node_roombase.active = true;
                this.anim_match.node.active = false;
                this.anim_match.stop();
            }
        }
    },

    /**
     * 换桌
     */
    onRoomReplace(msg) {
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
            this.resetGameUI();

            nn_data.Instance().isMatching = true;
            nn_data.Instance().clear();
            this.node_roombase.active = true;
            this.anim_match.node.active = true;
            this.anim_match.play();
            cc.dd.PromptBoxUtil.show('换桌成功');

            cc.find('menu/rank', this.node).getComponent(cc.Button).interactable = false;
            cc.dd.ShaderUtil.setGrayShader(cc.find('menu/rank', this.node));
            cc.find('menu/rank/New Label', this.node).color = cc.color(72, 72, 72);
            this.scheduleOnce(function () {
                cc.find('menu/rank', this.node).getComponent(cc.Button).interactable = true;
                cc.dd.ShaderUtil.setNormalShader(cc.find('menu/rank', this.node));
                cc.find('menu/rank/New Label', this.node).color = cc.color(255, 255, 255);
            }.bind(this), 30);
        }
    },

    /**
     * 玩家离开
     */
    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '您的金币小于此房间最低金币限制';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '由于长时间未操作，您已离开游戏';
                        break;
                    case 4:
                        str = '当前禁止该游戏，请联系管理员';
                        break;
                }
                var func = function () {
                    nn_data.Destroy();
                    this.backToHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                nn_data.Destroy();
                this.backToHall();
            }
        }
        else {
            this.refreshWinner();
        }
    },

    reconnectGame() {
        RoomMgr.Instance().roomType = 2;
        var configId = nn_data.Instance().configId;
        var ccmjJbcCfgItem = game_room.getItem(function (item) {
            return item.key === configId;
        });
        nn_data.Instance().setData(ccmjJbcCfgItem);
        RoomMgr.Instance().roomLv = ccmjJbcCfgItem.roomid;
        var players = nn_data.Instance().getPlayerList();
        players.forEach(player => {
            if (player && player.state == 0) {
                player.isWatch = true;
            }
            else {
                player.isWatch = false;
            }
        });
        this._super();
        this.initRoomInfo();
    },

    refreshWinner() {
        for (var i = 0; i < 5; i++) {
            cc.find('head_node/head_' + i, this.node).getChildByName('winner').active = false;
        }
        var playerList = nn_data.Instance().getPlayerList();
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i] && playerList[i].isWinner) {
                var view = this.getView(playerList[i].userId);
                cc.find('head_node/head_' + view, this.node).getChildByName('winner').active = true;
                break;
            }
        }
    },

    /**
    * 离开房间
    */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = nn_data.Instance().getGameId();
        var roomId = nn_data.Instance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    sendLeaveRoomPlan() {
        var msg = new cc.pb.room_mgr.msg_plan_leave_game_req();
        var gameType = nn_data.Instance().getGameId();
        var roomId = nn_data.Instance().getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_plan_leave_game_req, msg, "msg_plan_leave_game_req", true);
    },

    sendReplaceRoom() {
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(nn_data.Instance().getGameId());
        pbData.setRoomCoinId(nn_data.Instance().getRoomId());
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },

    setReady() {

    },

    /**
    * 匹配中
    */
    showMatching: function () {
        nn_data.Instance().isMatching = true;
        this.btn_match.node.active = false;
        this.anim_match.node.active = true;
        this.anim_match.play();
    },

    showResult() {
        var self = this;
        var list = nn_data.Instance().resultsList;
        // var score_node = cc.find('result/score', this.node);
        // score_node.active = false;
        // score_node.children.forEach(element => {
        //     element.getChildByName('lbl').getComponent(cc.Label).string = '';
        //     element.getChildByName('lose_di').active = false;
        //     element.getChildByName('win_di').active = false;
        // });
        this.playerUI.forEach(ui => {
            ui.win_gold.getChildByName('lbl').getComponent(cc.Label).string = '';
            ui.win_gold.getChildByName('lose_di').active = false;
            ui.win_gold.getChildByName('win_di').active = false;
        });
        var self_wingold = 0;
        var bankerWin = [];
        var bankerLost = [];
        var bankerView = -1;
        var isWatch = nn_data.Instance().getPlayerById(cc.dd.user.id).isWatch;
        for (var i = 0; i < list.length; i++) {
            if (list[i].userId == cc.dd.user.id) {
                self_wingold = list[i].winGold;
            }
            if (list[i].winGold < 0) {
                this.playerUI[list[i].view].win_gold.getChildByName('lose_di').active = true;
                this.playerUI[list[i].view].win_gold.getChildByName('win_di').active = false;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).font = this.lose_font;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(list[i].winGold);
            }
            else {
                this.playerUI[list[i].view].win_gold.getChildByName('lose_di').active = false;
                this.playerUI[list[i].view].win_gold.getChildByName('win_di').active = true;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).font = this.win_font;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(list[i].winGold);
            }
            var view = this.getView(list[i].userId);
            if (view != null && view > -1 && view < 5) {
                var isBanker = nn_data.Instance().getPlayerById(list[i].userId).isBanker;
                if (!isBanker) {
                    if (list[i].winGold > 0) {
                        bankerLost.push(view);
                    }
                    else {
                        bankerWin.push(view);
                    }
                }
                else {
                    bankerView = view;
                }
                nn_data.Instance().getPlayerById(list[i].userId).isBanker = false;
            }
        }
        var result_node = cc.find('result', this.node);
        var win_node = cc.find('result/win', this.node);
        var lose_node = cc.find('result/lose', this.node);
        var next_node = cc.find('result/next', this.node);
        win_node.active = false;
        lose_node.active = false;
        next_node.active = false;
        result_node.active = true;
        var playFinished = function (event) {
            if (event) {
                event.target.off('finished', null);
            }
            nn_data.Instance().isMatching = true;
            nn_data.Instance().isResult = false;
            if (self._nextHuanZhuo) {
                self._nextHuanZhuo = false;
                self.sendReplaceRoom();
                //self.scheduleOnce(function () { self.sendReplaceRoom(); }, 1);
            }
        };

        var showCoinFly = function (list1, list2) {
            const totalTime = 1;
            const flyTime = 0.5;
            const coinCount = 20;
            const posOffset = 5;
            const timeOffset = 0.04;
            if (list1.length && list2.length) {
                for (var i = 0; i < list1.length; i++) {
                    var sv = list1[i][0];
                    var tv = list1[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, null);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
                for (var i = 0; i < list2.length; i++) {
                    var sv = list2[i][0];
                    var tv = list2[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = totalTime + 0.1 + (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list2.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else if (list1.length) {
                for (var i = 0; i < list1.length; i++) {
                    var sv = list1[i][0];
                    var tv = list1[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list1.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else if (list2.length) {
                for (var i = 0; i < list2.length; i++) {
                    var sv = list2[i][0];
                    var tv = list2[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list2.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else {
                play2ndAni();
            }
        };

        var playCoinFly = function (event) {
            // cc.find('zi/win', result_node.parent).getComponent(cc.Animation).off('finished', playCoinFly);
            // //cc.find('zi/ani', result_node.parent).active = false;
            // cc.find('zi/lose', result_node.parent).getComponent(cc.Animation).off('finished', playCoinFly);
            // //cc.find('zi/ani2', result_node.parent).active = false;
            // if (bankerWin.length > 0 && bankerView != -1) {
            //     for (var i = 0; i < bankerWin.length; i++) {
            //         cc.find('coin_fly/coin_fly_' + bankerWin[i] + '_' + bankerView, result_node.parent).getComponent(cc.Animation).off('finished');
            //         if (i == bankerWin.length - 1) {
            //             cc.find('coin_fly/coin_fly_' + bankerWin[i] + '_' + bankerView, result_node.parent).getComponent(cc.Animation).on('finished', play2ndCoinFly);
            //         }
            //         cc.find('coin_fly/coin_fly_' + bankerWin[i] + '_' + bankerView, result_node.parent).getComponent(cc.Animation).play();
            //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
            //     }
            // }
            // else {
            //     play2ndCoinFly();
            // }
            if (event) {
                event.target.off('finished', playCoinFly);
            }

            var list1 = [], list2 = [];
            for (var i = 0; i < bankerWin.length; i++) {
                var list = [bankerWin[i], bankerView];
                list1.push(list);
            }
            for (var i = 0; i < bankerLost.length; i++) {
                var list = [bankerView, bankerLost[i]];
                list2.push(list);
            }
            showCoinFly(list1, list2);
        };
        var play2ndCoinFly = function (event) {
            // if (event) {
            //     event.target.off('finished', null);
            // }
            // if (bankerLost.length > 0 && bankerView != -1) {
            //     for (var i = 0; i < bankerLost.length; i++) {
            //         cc.find('coin_fly/coin_fly_' + bankerView + '_' + bankerLost[i], result_node.parent).getComponent(cc.Animation).off('finished');
            //         if (i == bankerLost.length - 1) {
            //             cc.find('coin_fly/coin_fly_' + bankerView + '_' + bankerLost[i], result_node.parent).getComponent(cc.Animation).on('finished', play2ndAni);
            //         }
            //         cc.find('coin_fly/coin_fly_' + bankerView + '_' + bankerLost[i], result_node.parent).getComponent(cc.Animation).play();
            //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
            //     }
            // }
            // else {
            //     play2ndAni();
            // }
        };
        var play2ndAni = function (event) {
            if (event) {
                event.target.off('finished', null);
            }
            RoomED.notifyEvent(RoomEvent.on_room_game_start, []);//刷新金币显示
            for (var i = 0; i < list.length; i++) {
                if (nn_data.Instance().getPlayerById(list[i].userId) && nn_data.Instance().getPlayerById(list[i].userId).isWinner) {
                    var view = self.getView(list[i].userId);
                    cc.find('head_node/head_' + view, self.node).getChildByName('winner').active = true;
                    break;
                }
            }
            result_node.parent.getChildByName('head_node').getComponent(cc.Animation).on('finished', playFinished, this);
            result_node.parent.getChildByName('head_node').getComponent(cc.Animation).play('result');

        };
        if (self_wingold < 0) {//输
            if (bankerView == 0) {
                if (bankerLost.length > 1 && bankerWin.length == 0) {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.AllLose, false);
                }
                else {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.LOSE, false);
                }
            }
            else {
                AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.LOSE, false);
            }
            cc.find('zi/lose', this.node).active = true;
            cc.find('zi/lose', this.node).getComponent(cc.Animation).off('finished', playCoinFly);
            cc.find('zi/lose', this.node).getComponent(cc.Animation).on('finished', playCoinFly);
            cc.find('zi/lose', this.node).getComponent(cc.Animation).play();
        }
        else {//赢
            if (isWatch) {
                playCoinFly();
            }
            else {
                if (bankerView == 0) {
                    if (bankerLost.length == 0 && bankerWin.length > 1) {
                        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.AllWin, false);
                    }
                    else {
                        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.WIN, false);
                    }
                }
                else {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.WIN, false);
                }
                cc.find('zi/win', this.node).active = true;
                cc.find('zi/win', this.node).getComponent(cc.Animation).off('finished', playCoinFly);
                cc.find('zi/win', this.node).getComponent(cc.Animation).on('finished', playCoinFly);
                cc.find('zi/win', this.node).getComponent(cc.Animation).play();
            }

        }
    },

    /**
     * 玩家数量改变 金币场不作处理
     */
    updateRoomPlayerNum() {

    },

    initAutobetButton() { },
});
