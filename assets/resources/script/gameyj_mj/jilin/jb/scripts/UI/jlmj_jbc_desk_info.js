var Define = require("Define");
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskData = require('jlmj_desk_data').DeskData;

var game_room = require("game_room");
var GateNet = require("GateNet");

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;

var jlmj_Control_Combination_ui = require("jlmj_Control_Combination_ui");
var jlmj_util = require('jlmj_util');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_audio_path = require("jlmj_audio_path");
var jlmj_prefab = require('jlmj_jbc_prefab_cfg');
var jlmj_layer_zorder = require("jlmj_layer_zorder");
var jlmj_desk_info = require("jlmj_desk_info");
var jlmj_desk_jbc_data = require("jlmj_desk_jbc_data");

var playerMgr = require('jlmj_player_mgr');
var playerED = require("jlmj_player_data").PlayerED;

var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var SysED = require("com_sys_data").SysED;

var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

var UserPlayer = require('jlmj_userPlayer_data').Instance();

cc.Class({
    extends: jlmj_desk_info,

    properties: {
        preBaseScore: cc.Node, //底分
        button_message: cc.Button,
        btn_match: cc.Button,
        labelBaseScore: cc.Label,
        anim_matching: dragonBones.ArmatureDisplay,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.upDateDeskInfo();

        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        this.da_pai_prompt.active = false;
    },

    initReady: function () {

    },

    upDateDeskInfo: function () {
        cc.log("jbc desk upDateDeskInfo--->" + (DeskData.Instance().isGameStart));
        if (DeskData.Instance().isGameStart) {
            this.preBaseScore.active = false;
            this.btn_match.node.active = false;
            this.button_message.interactable = true;
            this.stopMatchAnim();
            this.onShowTG(false);
        } else {
            this.button_message.interactable = false;
        }
        this.labelBaseScore.string = jlmj_desk_jbc_data.getInstance().getBaseScore();
        this.preBaseScore.getComponent('jlmj_jbc_base_score').initView();


        var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        play_list.playerUpdateUI();
        play_list.refreshGPSWarn();
        // var desk_info = cc.find('Canvas/desk_info').getComponent('jlmj_desk_info');
        // desk_info.recoverDesk();
    },

    onDestroy: function () {
        HallCommonEd.removeObserver(this);
        TaskED.removeObserver(this);
        this._super();
        jlmj_desk_jbc_data.getInstance().destroy();
        //RoomMgr.Destroy();
    },

    start: function () {
        DeskED.addObserver(this);
        playerED.addObserver(this);
        SysED.addObserver(this);
        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
        TaskED.addObserver(this);
        if (jlmj_desk_jbc_data.getInstance().getIsReconnect()) {
            DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        }
        this.updateDesk();
    },

    /**
     * 更新桌子信息
     */
    updateDesk: function () {
        this.updateRemainCard();
        this.updateBaoPai();
        this.cleanTuoGuanBtnCallBack();
    },

    /**
     * 结算
     * @param data
     */
    //jiesuan: function (data) {},

    /**
     * 显示托管节点
     */
    onShowTG: function (isShow) {
        if (isShow) {
            jlmj_Control_Combination_ui.Instance().onCloseCombinationUi();
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jlmj_player_down_ui');
            if (player_down_ui.touchCardMode == 3) {
                player_down_ui.setShoupaiTouch(true);
                player_down_ui.setShoupaiTingbiaoji(false);
                player_down_ui.touchCardMode = 1;
                player_down_ui.closeJiaoInfo();
                //UserPlayer.isTempBaoTing = false;
            }
        }
        this.tuGuanNode.active = isShow;
    },


    initGuiZeInfo: function () {
        var desk_leftinfo = cc.find("Canvas/toppanel/desk_leftinfo_fun").getComponent("mj_desk_leftinfo");
        var func = cc.callFunc(function () {
            if (DeskData.Instance().isFriend()) {
                desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
            } else {
                desk_leftinfo.dfNode.active = desk_leftinfo.dfNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.dfNode.active == false;
            }
        }.bind(desk_leftinfo));
        desk_leftinfo.init([], func);
    },
    /**
     * 回调 匹配按钮
     * @param event
     * @param data
     */
    onMatch: function (event, data) {
        cc.dd.mj_game_start = true;

        // cc.log('测试截图');
        // var canvasNode = cc.find('Canvas');
        // cc.dd.native_wx.SendScreenShot(canvasNode);
        // return;
        jlmj_audio_mgr.com_btn_click();
        this.btn_match.interactable = false;

        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();

        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(RoomMgr.Instance().roomLv);

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    /**
     * 刷新人数
     * @param num
     */
    updatePlayerNum: function (num) {

    },

    /**
     * 退出房间
     * @param msg
     */
    on_room_leave: function (msg) {
        // this.jbcGameMatchinglveRoom();
        jlmj_util.enterHall();
    },

    /**
     * 取消托管
     */
    cleanTuoGuanBtnCallBack: function () {
        if (DeskData.Instance().isoffline) {
            const req = new cc.pb.jilinmajiang.p17_req_update_deposit();
            req.setIsdeposit(false);
            cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_update_deposit, req, "p17_req_update_deposit", true);
        }
    },


    updateCurrRound: function (currValue) {

    },

    updateTotalRound: function (totalValue) {

    },

    updateGameStatus: function (status) {

    },

    onGameOpening: function () {
        jlmj_desk_jbc_data.getInstance().setIsStart(true);
        jlmj_desk_jbc_data.getInstance().setIsMatching(false);
        this.preBaseScore.active = false;
        this.button_message.interactable = true;
        this.stopMatchAnim();
    },

    /**
     * 发送离开房间
     */
    sendLeaveRoom: function () {
        cc.log('发送离开 5');
        // 取消匹配状态
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);

        msg.setGameInfo(gameInfoPB);

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    popupEnterHall: function (text, callfunc) {
        cc.dd.DialogBoxUtil.show(0, text, '确定', null, function () {
            if(callfunc){
                callfunc();
            }
        }, function () { });
    },


    on_room_ready: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall(str, jlmj_util.enterRoomList.bind(jlmj_util));
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall(str, jlmj_util.enterRoomList.bind(jlmj_util));
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
            if(cc.dd.mj_game_start){
                let playerList = playerMgr.Instance().playerList;
                playerList.forEach(function (playerMsg,idx) {
                    if(playerMsg&&playerMsg.userid){
                        var pd = playerMgr.Instance().getPlayer(playerMsg.userid);
                        pd.setReady(0);
                    }
                },this);
            }
            // if (msg.userId == cc.dd.user.id) {
            //     // this.playMatchAnim();
            //     playerMgr.Instance().clear();
            //     playerMgr.Instance().clearAlldapaiCding();
            //
            //     var player = playerMgr.Instance().getPlayer(msg.userId);
            //     if (player) {
            //         player.setReady(1);
            //     }
            //
            //     jlmj_desk_jbc_data.getInstance().setIsMatching(true);
            // }
        }
    },

    on_room_replace: function (msg) {
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
            var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
            if (play_list) {
                for (var i = 0; i < play_list.player_ui_arr.length; ++i) {
                    var headinfo = play_list.player_ui_arr[i];
                    if (headinfo && headinfo.head.player && headinfo.head.player.userId == cc.dd.user.id) {
                        headinfo.head.read.active = false;
                    }
                }
            }
            playerMgr.Instance().clear();
            this.playMatchAnim();
            jlmj_desk_jbc_data.getInstance().setIsMatching(true);
            this.onShowTG(false);
        }
    },

    /**
     * 播放防作弊匹配动画
     */
    playMatchAnim: function () {
        this.preBaseScore.active = true;
        this.anim_matching.node.active = true;
        this.anim_matching.playAnimation('FZZPPZ',-1);
    },

    /**
     * 停止防作弊匹配动画
     */
    stopMatchAnim: function () {
        this.preBaseScore.active = false;
        this.anim_matching.node.active = false;
    },

    /**
     * 匹配开始成功
     */
    on_coin_room_enter: function () {
        jlmj_desk_jbc_data.getInstance().setIsMatching(true);
        this.btn_match.node.active = false;
        this.btn_match.interactable = true;
        this.playMatchAnim();
        this.onShowTG(false);
    },

    /**
     * 设置准备
     * @param userId
     */
    setRead: function (userId) {

    },

    onEventMessage: function (event, data) {
        this._super(event, data);
        switch (event) {
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter();
                break;
            case RoomEvent.on_room_enter:
                this.upDateDeskInfo();
                break;
            case DeskEvent.RECOVER_DESK:
                this.upDateDeskInfo();
                break;
            case DeskEvent.TUO_GUAN://朋友桌不显示托管
                this.onShowTG(data);
                break;
            default:
                break;
        }
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
