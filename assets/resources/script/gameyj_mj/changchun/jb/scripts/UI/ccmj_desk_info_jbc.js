var baseDeskInfo = require("ccmj_desk_info");

var ccmj_util = require("ccmj_util");
var ccmj_desk_data_jbc = require("ccmj_desk_data_jbc");

var DeskEvent = require("ccmj_desk_data").DeskEvent;
var DeskData = require('ccmj_desk_data').DeskData;
var DeskED = require('ccmj_desk_data').DeskED;

var hall_common_data = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var jlmj_audio_mgr = require("jlmj_audio_mgr").Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var hall_prefab = require('hall_prefab_cfg');

var playerMgr = require('ccmj_player_mgr');
var playerED = require("jlmj_player_data").PlayerED;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;

var Text = cc.dd.Text;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

var UIZorder = require("mj_ui_zorder");

const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;

var baseDeskInfoJB = cc.Class({
    extends: baseDeskInfo,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.log("ccmj_desk_info_jbc onLoad");
        this._super();
        BSC_ED.addObserver(this);
        this.initDeskDataUI();
        this.initDeskData();
    },

    initDeskDataUI: function () {
        cc.find("Canvas/layer_base_score").active = !DeskData.Instance().isMatch();
        cc.find("Canvas/btn_match").active = !DeskData.Instance().isMatch();

        cc.find("Canvas/desk_node/jlmj_player_down_ui").active = false;
        cc.find("Canvas/desk_node/jlmj_player_right_ui").active = false;
        cc.find("Canvas/desk_node/jlmj_player_up_ui").active = false;
        cc.find("Canvas/desk_node/jlmj_player_left_ui").active = false;
        cc.find("Canvas/desk_node/mj_playerHead_right").active = false;
        cc.find("Canvas/desk_node/mj_playerHead_left").active = false;
        cc.find("Canvas/desk_node/mj_playerHead_up").active = false;

        cc.find("Canvas/desk_node/down_head_button").active = false;
        cc.find("Canvas/desk_node/right_head_button").active = false;
        cc.find("Canvas/desk_node/up_head_button").active = false;
        cc.find("Canvas/desk_node/left_head_button").active = false;

        cc.find("Canvas/desk_node/anim_matching").active = false;
        cc.find("Canvas/kai_ju_ani").active = false;
        cc.find("Canvas/huang_zhuang_ani").active = false;

        cc.find("Canvas/desk_node/dahuanbao").active = false;
        cc.find("Canvas/desk_node/jlmj_zhishiqi").active = false;
        cc.find("Canvas/desk_node/new_baopai/baopai").active = false;

        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").zIndex = UIZorder.MJ_LAYER_UI;
        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").active = false;
        cc.find("Canvas/desk_node/down_head_button").active = false;
        cc.find("Canvas/toppanel/layer_tuo_guan").active = false;
        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = false;

        cc.find("Canvas/toppanel/com_lucky_money").active = !(cc.game_pid == 2) && !cc._applyForPayment;

        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        this.da_pai_prompt.active = false;

        if (DeskData.Instance().isMatch()) {
            this.da_pai_prompt_label.string = '请等待其他玩家';
            this.da_pai_prompt.active = true;
        }

        let matchLayout = cc.find("Canvas/desk_node/matchLayout");
        this.baopai = cc.find("Canvas/desk_node/new_baopai/baopai").getComponent('jlmj_pai');
        this.deskImage = cc.find("Canvas/zhuozi").getComponent(cc.Sprite);

        this.zhinan = null;
        this._zhinan = cc.find("Canvas/desk_node/mj_zhinan");
        this._zhinan_2d = cc.find("Canvas/desk_node/mj_zhinan_2d");
        this.use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';

        this.new_25D.active = !this.use2D;
        this.new_2D.active = this.use2D;

        if (this.use2D) {
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = true;
            this.baopai.node.x = 117.4;
            this.baopai.node.y = 29.5;
            if (matchLayout) {
                matchLayout.skewX = 0;
                matchLayout.x = -124.3;
                matchLayout.y = 33;
            }
        } else {
            this.zhinan = this._zhinan;
            this._zhinan.active = true;
            this._zhinan_2d.active = false;
            this.baopai.node.x = 146;
            this.baopai.node.y = 56;
            if (matchLayout) {
                matchLayout.skewX = 8.2;
                matchLayout.x = -139.8;
                matchLayout.y = 51.9;
            }
        }

        cc.find("Canvas/desk_node/matchLayout").active = DeskData.Instance().isMatch();
        cc.find("Canvas/toppanel/gweixin").active = DeskData.Instance().isMatch() && !this.weixinNotShow && !cc._isHuaweiGame;
        this.rank = cc.find("Canvas/desk_node/matchLayout/rank").getComponentInChildren(cc.Label);
    },

    initDeskData: function () {
        if (DeskData.Instance().isJBC()) {
            var deskDataJBC = ccmj_desk_data_jbc.getInstance();

            if (deskDataJBC.getBaseScore() === 0) {
                cc.find("Canvas/layer_base_score").active = false;
                cc.find("Canvas/btn_match").active = false;
                return;
            }
            //显示房间信息
            //场次类型
            cc.find("Canvas/layer_base_score/name").getComponent(cc.Label).string = deskDataJBC.getTitle();
            //底分
            cc.find("Canvas/layer_base_score/base_score").getComponent(cc.Label).string = Text.TEXT_MJ_JBC_0 + deskDataJBC.getBaseScore();
            //右上角底分
            cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/base_score_bg/base_score_2").getComponent(cc.Label).string = deskDataJBC.getBaseScore();

            cc.find("Canvas/desk_node/new_2D/quan/quan").getComponent(cc.Label).string = '底分:';
            cc.find("Canvas/desk_node/new_2D/quan/count").getComponent(cc.Label).string = deskDataJBC.getBaseScore();
        } else {
            cc.find("Canvas/desk_node/new_2D/quan").active = false;
            cc.find("Canvas/desk_node/new_2D/left").active = false;
        }
    },

    //初始化规则显示文本
    initGuiZeInfo: function () {
        var desk_leftinfo = cc.find("Canvas/toppanel/desk_leftinfo_fun").getComponent("mj_desk_leftinfo");

        var func = cc.callFunc(function () {
            if (!DeskData.Instance().isJBC()) {
                desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
            } else {
                desk_leftinfo.dfNode.active = desk_leftinfo.dfNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.dfNode.active == false;
            }
        }.bind(desk_leftinfo));
        desk_leftinfo.init([], func);
    },

    start: function () {
        DeskED.addObserver(this);
        HallCommonEd.addObserver(this);
        playerED.addObserver(this);
        RoomED.addObserver(this);
        SysED.addObserver(this);
        TaskED.addObserver(this);
        if (ccmj_desk_data_jbc.getInstance().getIsReconnect()) {
            DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        }
    },

    onDestroy: function () {
        DeskED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        playerED.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        TaskED.removeObserver(this);
        BSC_ED.removeObserver(this);
        ccmj_desk_data_jbc.getInstance().destroy();
        this._super();
        //RoomMgr.Destroy();
    },

    /**
     * 更新桌子信息
     */
    updateDesk: function () {
        this.update_remain_card();
        this.update_bao_pai();
        this.clean_tuo_guan();
        this.update_player_info();
    },

    onMatch: function () {
        cc.dd.mj_game_start = true;
        let match = cc.find("Canvas/btn_match");
        if (match)
            match.getComponent(cc.Button).interactable = false;

        jlmj_audio_mgr.com_btn_click();
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(RoomMgr.Instance().roomLv);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    /**
     * 播放防作弊匹配动画
     */
    playMatchAnim: function () {
        cc.find("Canvas/layer_base_score").active = true;
        cc.find("Canvas/desk_node/anim_matching").active = true;
        cc.find("Canvas/desk_node/anim_matching").getComponent(dragonBones.ArmatureDisplay).playAnimation('FZZPPZ', -1);
    },

    jbc_ready: function () {
        cc.dd.mj_game_start = true;

        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomLv);
        pbData.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);

        var play_list = cc.find('Canvas/player_list').getComponent('ccmj_player_list');
        if (play_list) {
            for (var i = 0; i < play_list.player_ui_arr.length; ++i) {
                var headinfo = play_list.player_ui_arr[i];
                if (headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id) {
                    headinfo.head.node.active = false;
                } else {
                    headinfo.head.read.active = true;
                }
            }
        }
    },


    /**
     * 停止防作弊匹配动画
     */
    stopMatchAnim: function () {
        cc.find("Canvas/layer_base_score").active = false;
        cc.find("Canvas/desk_node/anim_matching").active = false;
    },

    on_room_replace: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_POPUP_18;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_POPUP_19;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    this.popupEnterHall(str, null);
                    break;
                default:
                    break;
            }
        } else {
            var play_list = cc.find('Canvas/player_list').getComponent('ccmj_player_list');
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
            ccmj_desk_data_jbc.getInstance().setIsMatching(true);
            this.tuo_guan(false);
            cc.find("Canvas/desk_node/jlmj_zhishiqi").active = false;
        }
    },

    on_coin_room_enter: function () {
        cc.log("ccmj 播放防作弊");
        ccmj_desk_data_jbc.getInstance().setIsMatching(true);
        let match = cc.find("Canvas/btn_match");

        if (match) {
            match.getComponent(cc.Button).interactable = true;
            match.active = false;
        }
        this.playMatchAnim();
        this.tuo_guan(false);
    },

    on_room_enter: function () {
        cc.log("ccmj jbc desk on_room_enter--->" + (DeskData.Instance().isGameStart));

        let wait_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM);
        if (wait_node) {
            cc.dd.UIMgr.destroyUI(wait_node);
        }

        cc.find("Canvas/layer_base_score").active = !DeskData.Instance().isGameStart && !DeskData.Instance().isMatch();
        cc.find("Canvas/btn_match").active = !DeskData.Instance().isGameStart && !DeskData.Instance().isMatch();
        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = DeskData.Instance().isGameStart;
        cc.find("Canvas/toppanel/desk_leftinfo_fun").active = true;
        this.tuo_guan(!DeskData.Instance().isGameStart);
        DeskData.Instance().isGameStart ? this.stopMatchAnim() : null;
        this.initDeskData();

        cc.find("Canvas/desk_node/matchLayout").active = DeskData.Instance().isMatch();
        cc.find("Canvas/toppanel/gweixin").active = DeskData.Instance().isMatch() && !this.weixinNotShow && !cc._isHuaweiGame;

        if (DeskData.Instance().isGameStart) {
            if (this._jiesuan) {
                this._jiesuan.close();
                this._jiesuan = null;
            }
            if (this.jiesuan_TimeID) {
                this.unschedule(this.jiesuan_TimeID);
            }
            cc.find("Canvas/desk_node/new_2D/left").active = !DeskData.Instance().isMatch();
            cc.find("Canvas/desk_node/new_2D/quan").active = !DeskData.Instance().isMatch();
        } else {
            cc.find("Canvas/desk_node/new_2D/left").active = false;
            cc.find("Canvas/desk_node/new_2D/quan").active = false;
        }
    },

    recover_desk: function () {
        cc.log("ccmj jbc desk recover_desk------执行0");
        this.on_room_enter();
        //this.recoverDesk();
    },

    on_room_ready: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall(str, ccmj_util.enterRoomList.bind(ccmj_util));
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall(str, ccmj_util.enterRoomList.bind(ccmj_util));
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall(str, null);
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                default:
                    break;
            }
        } else {
            if (cc.dd.mj_game_start) {
                let playerList = playerMgr.Instance().playerList;
                playerList.forEach(function (playerMsg, idx) {
                    if (playerMsg && playerMsg.userid) {
                        var pd = playerMgr.Instance().getPlayer(playerMsg.userid);
                        pd.setReady(0);
                    }
                }, this);
            }
            // if(msg.userId == cc.dd.user.id) {
            //     playerMgr.Instance().clear();
            //     playerMgr.Instance().clearAlldapaiCding();
            //
            //     var player = playerMgr.Instance().getPlayer(msg.userId);
            //     if (player) {
            //         player.setReady(1);
            //     }
            //
            //     ccmj_desk_data_jbc.getInstance().setIsMatching(true);
            // }
        }
    },

    on_room_leave: function (msg) {
        // this.jbc_matching_leave_room_req();
        if (this.enterHallMatch) {
            ccmj_util.enterMatch();
        } else if (cc.dd._.isNumber(this.enterOtherGame)) {
            ccmj_util.enterGame(this.enterOtherGame);
        } else {
            if (msg.userId == cc.dd.user.id || !cc.dd._.isNumber(msg.userId))
                ccmj_util.enterHall();
        }
    },

    tuo_guan: function (isShow) {
        if (isShow) {
            this.menu_list = cc.find("Canvas/game_menu_list");
            if (this.menu_list) {
                this.menu_list.getComponent("ccmj_game_menu_list").closeMenuAndOptions();
            }
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('ccmj_player_down_ui');

            player_down_ui.setShoupaiTouch(true);
            player_down_ui.setShoupaiTingbiaoji(false);
            player_down_ui.touchCardMode = 1;
            player_down_ui.closeJiaoInfo();
        }
        cc.find("Canvas/toppanel/layer_tuo_guan").active = isShow;
    },

    /**
     * 取消托管
     */
    clean_tuo_guan: function () {
        if (DeskData.Instance().isoffline) {
            const req = new cc.pb.changchunmajiang.p16_req_update_deposit();
            req.setIsdeposit(false);
            cc.gateNet.Instance().sendMsg(cc.netCmd.changchunmajiang.cmd_p16_req_update_deposit, req, "p16_req_update_deposit", true);
        }
    },

    game_opening: function () {
        if (!DeskData.Instance().inJueSai) {
            this.weixinNotShow = false;
        }

        ccmj_desk_data_jbc.getInstance().setIsStart(true);
        ccmj_desk_data_jbc.getInstance().setIsMatching(false);
        DeskData.Instance().player_read_gamne = false;
        cc.find("Canvas/layer_base_score").active = false;
        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = true;
        cc.find("Canvas/toppanel/messageBtn").active = true;

        cc.find("Canvas/desk_node/matchLayout").active = DeskData.Instance().isMatch();
        cc.find("Canvas/toppanel/gweixin").active = DeskData.Instance().isMatch() && !this.weixinNotShow && !cc._isHuaweiGame;
        /*cc.find("Canvas/down_head_button").active = true;
        cc.find("Canvas/right_head_button").active = true;
        cc.find("Canvas/up_head_button").active = true;
        cc.find("Canvas/left_head_button").active = true;*/
        this.stopMatchAnim();
    },

    /**
     * 玩家数量更新
     */
    update_player_num: function (data) {
    },

    update_player_info: function () {

        var player_list = playerMgr.Instance().playerList;
        for (var i in player_list) {
            if (!player_list[i]) {
                continue;
            }
            if (player_list[i].viewIdx == 0) {
                cc.find("Canvas/desk_node/jlmj_player_down_ui").active = true;
                cc.find("Canvas/desk_node/down_head_button").active = true;
            }
            if (player_list[i].viewIdx == 1) {
                cc.find("Canvas/desk_node/jlmj_player_right_ui").active = true;
                cc.find("Canvas/desk_node/right_head_button").active = true
                cc.find("Canvas/desk_node/mj_playerHead_right").active = true;
            }
            if (player_list[i].viewIdx == 2) {
                cc.find("Canvas/desk_node/jlmj_player_up_ui").active = true;
                cc.find("Canvas/desk_node/up_head_button").active = true;
                cc.find("Canvas/desk_node/mj_playerHead_up").active = true;
            }
            if (player_list[i].viewIdx == 3) {
                cc.find("Canvas/desk_node/jlmj_player_left_ui").active = true;
                cc.find("Canvas/desk_node/left_head_button").active = true;
                cc.find("Canvas/desk_node/mj_playerHead_left").active = true;
            }
        }

        this.zhinan.getComponent("ccmj_zhinan_ui").initDirection();
        var play_list = cc.find('Canvas/player_list').getComponent('ccmj_player_list');


        /*cc.find("Canvas/jlmj_player_down_ui").active = true;
        cc.find("Canvas/jlmj_player_right_ui").active = true;
        cc.find("Canvas/jlmj_player_up_ui").active = true;
        cc.find("Canvas/jlmj_player_left_ui").active = true;

        cc.find("Canvas/down_head_button").active = true;
        cc.find("Canvas/right_head_button").active = true;
        cc.find("Canvas/up_head_button").active = true;
        cc.find("Canvas/left_head_button").active = true;

        var play_list = cc.find('Canvas/player_list').getComponent('ccmj_player_list');
        //play_list.playerUpdateUI();
        play_list.refreshGPSWarn();*/
    },

    onEventMessage: function (event, data) {
        this._super(event, data);
        switch (event) {
            case DeskEvent.TUO_GUAN:
                this.tuo_guan(data);
                break;
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter();
                break;
            case RoomEvent.on_room_enter:
                this.on_room_enter();
                break;
            case DeskEvent.GAME_OPENING:
                this.game_opening(false);
                break;
            case DeskEvent.RECOVER_DESK:
                cc.log("ccmj jbc recover_desk------ 开始0");
                this.recover_desk();
                break;
            case DeskEvent.JBC_READY://
                this.jbc_ready();
                break;
            case BSC_Event.PLAY_ROUND:
                // if(!cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM)){
                //     cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_WAITROOM, function(ui){
                //     }.bind(this));
                // }
                this.updateMatch(data);
                break;
            case BSC_Event.RECONNECT_LINE:
                this.da_pai_prompt.active = false;
                this.matchRound = data.roundNum;
                // //当前局数
                cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu").getComponent(cc.Label).string = '1';
                // //总局数
                cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju").getComponent(cc.Label).string = '1';
                this.endLineInfo = data;
                if (!cc.dd.mj_game_start && DeskData.Instance().isMatch() && !DeskData.Instance().inJueSai) {
                    if (!DeskData.Instance().waitJiesuan) {
                        cc.find("Canvas/desk_node/matchLayout").active = false;
                        cc.find("Canvas/toppanel/gweixin").active = false;

                        cc.find("Canvas/layer_base_score").active = false;
                        cc.find("Canvas/btn_match").active = false;

                        let wait_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM);
                        if (!wait_node) {
                            cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_WAITROOM, function (ui) {
                                ui.getComponent('klb_match_waitroom').show(data, this.lastJiesuan);
                            }.bind(this));
                        } else {
                            wait_node.getComponent('klb_match_waitroom').show(data, this.lastJiesuan);
                        }
                    }
                }
                break;
            case BSC_Event.SHOW_TIME:
                if (!DeskData.Instance().getIsStart() && DeskData.Instance().isMatch() && !DeskData.Instance().inJueSai) {
                    if (this._jiesuan && !this.isLastJiesuan) {
                        this._jiesuan.openMatchWithOutReq();
                        this._jiesuan = null;
                    }

                    cc.find("Canvas/desk_node/matchLayout").active = false;
                    cc.find("Canvas/toppanel/gweixin").active = false;

                    cc.find("Canvas/layer_base_score").active = false;
                    cc.find("Canvas/btn_match").active = false;

                    let wait_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM);
                    if (!wait_node) {
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_WAITROOM, function (ui) {
                            if (this.endLineInfo) {
                                ui.getComponent('klb_match_waitroom').show(this.endLineInfo, this.lastJiesuan);
                                this.endLineInfo = null;
                            }
                            ui.getComponent('klb_match_waitroom').showTime(data, this.lastJiesuan);
                        }.bind(this));
                    } else {
                        if (this.endLineInfo) {
                            wait_node.getComponent('klb_match_waitroom').show(this.endLineInfo, this.lastJiesuan);
                            this.endLineInfo = null;
                        }
                        wait_node.getComponent('klb_match_waitroom').showTime(data, this.lastJiesuan);
                    }
                }
                break;
            case BSC_Event.GAME_END:
                if (DeskData.Instance().isMatch()) {
                    let waittime = 0;
                    if (DeskData.Instance().waitJiesuan) {
                        waittime = 5000;
                    }
                    this.endTime = setTimeout(() => {
                        let end_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_END);
                        if (!end_node) {
                            cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_END, function (ui) {
                                ui.getComponent('klb_match_end').show(data);
                            }.bind(this));
                        } else {
                            end_node.getComponent('klb_match_end').show(data);
                        }
                    }, waittime)
                }

                break;
            case BSC_Event.RANK_INFO:
                this.updateRank(data);
                break;
            case BSC_Event.SCORE_SHARE_RET:
                this.scoreShareRet();
                break;
            case BSC_Event.UPDATE_SCORE:
                this.scoreUpdate(data);
                break;
            case BSC_Event.IS_SHARED:
                this.weixinNotShow = data;
                cc.find("Canvas/toppanel/gweixin").active = DeskData.Instance().isMatch() && !data && !cc._isHuaweiGame;
                break;
            default:
                break;
        }
    },
    // update (dt) {},

    //积分分享
    onScoreShare(event, data) {
        if (!this._jiesuan) {
            let Platform = require('Platform');
            let login_module = require('LoginModule');
            if (cc._isKuaiLeBaTianDaKeng) {
                cc.dd.native_wx.SendAppContent('', '【快乐吧填大坑】长春麻将比赛场！抢红包！最高可领100元', '【快乐吧填大坑】快来玩，免费参赛，送红包！送金币！人人有份！速来>>>', Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), 1);
            } else {
                cc.dd.native_wx.SendAppContent('', '【巷乐游戏】长春麻将比赛场！抢红包！最高可领100元', '【巷乐游戏】快来玩，免费参赛，送红包！送金币！人人有份！速来>>>', Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), 1);
            }
        }
    },

    updateRank(data) {
        this.rank.string = "第" + data.rank + "名"
    },

    updateMatch(data) {
        let title = cc.find("Canvas/desk_node/matchLayout/title").getComponentInChildren(cc.Label)
        switch (data.roundType) {
            case 1:
            case 2:
                title.string = "预赛"
                DeskData.Instance().inJueSai = false;
                break;
            case 3:
                title.string = "晋级赛"
                DeskData.Instance().inJueSai = false;
                break;
            case 4:
            case 5:
                title.string = "决赛"
                DeskData.Instance().inJueSai = true;
                break;

        }

        this.matchRound = data.roundNum;
        this.totalNum = data.gameNum;

        if (!DeskData.Instance().inJueSai) {
            DeskData.Instance().setCurrRound(data.curGame);
            if (data.roundNum == 0) {
                cc.find("Canvas/desk_node/matchLayout/match").getComponentInChildren(cc.Label).string = DeskData.Instance().currPlayCount + "/4局";
            } else {
                cc.find("Canvas/desk_node/matchLayout/match").getComponentInChildren(cc.Label).string = "第" + data.roundNum + "轮"
            }

            // //当前局数
            cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu").getComponent(cc.Label).string = data.curGame;
            // //总局数
            cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju").getComponent(cc.Label).string = data.gameNum;
        }

    },

    clear() {
        cc.find("Canvas/desk_node/matchLayout").active = false;
        cc.find("Canvas/toppanel/gweixin").active = false;
        this._super();
    },

    /**
     * 发牌
     */
    fapai: function () {
        if (DeskData.Instance().isMatch()) {
            cc.dd.UIMgr.destroyUI(hall_prefab.KLB_MATCH_WAITROOM);
            this.da_pai_prompt.active = false;

            if (!cc.dd._.isNumber(this.matchRound)) {
                this.matchRound = 1;
            }

            let bisaiNode = cc.find("Canvas/bisai_ani")
            if (bisaiNode) {
                bisaiNode.active = true;
                let spine = bisaiNode.getComponent(sp.Skeleton);
                spine.clearTracks();
                spine.setCompleteListener(() => {
                    bisaiNode.active = false;
                });

                switch (this.matchRound) {
                    case 1:
                        spine.setAnimation(0, 'diyi', false);
                        AudioManager.playSound("gameyj_hall/audios/pk_loading");
                        break;
                    case 2:
                        spine.setAnimation(0, 'dier', false);
                        break;
                    case 3:
                        spine.setAnimation(0, 'disan', false);
                        break;
                    case 0:
                        if (DeskData.Instance().currPlayCount == 1) {
                            spine.setAnimation(0, 'juesai', false);
                        } else {
                            bisaiNode.active = false;
                        }
                        break;
                }
            }

            let ani = this.use2D ? "jlmj_fapai_ani_2d" : "jlmj_fapai_ani";

            cc.find("Canvas/desk_node").getComponent(cc.Animation).play(ani);
            cc.find("Canvas/desk_node").getComponent(cc.Animation).setCurrentTime(0, ani);

        } else {
            this._super();
        }
    },

    hide_desk_ready() {
        this.isLastJiesuan = null;

        cc.dd.UIMgr.destroyUI(hall_prefab.KLB_MATCH_WAITROOM);
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
        cc.gateNet.Instance().clearDispatchTimeout();
    },

    update_curr_round: function (currValue) {
        this._super(currValue);

        if (DeskData.Instance().isMatch() && DeskData.Instance().inJueSai) {
            let list = playerMgr.Instance().getPlayerList();
            let _list = [];
            for (let i = 0; i < list.length; i++) {
                let player = list[i];
                _list.push({ id: player.userId, coin: player.coin })
            }
            _list.sort((a, b) => {
                if (a.coin <= b.coin) {
                    return 1;
                } else {
                    return -1;
                }
            })
            for (let i = 0; i < _list.length; i++) {
                if (cc.dd.user.id == _list[i].id) {
                    this.rank.string = "第" + (i + 1) + "名"
                    break;
                }
            }
            cc.find("Canvas/desk_node/matchLayout/match").getComponentInChildren(cc.Label).string = DeskData.Instance().currPlayCount + "/" + this.totalNum + "局";
        }

    },

    scoreShareRet: function () {
        this.weixinNotShow = true;
        cc.find("Canvas/toppanel/gweixin").active = false;
    },

    scoreUpdate(data) {
        var player = playerMgr.Instance().getPlayer(data[0]);
        if (player) {
            let view = player.viewIdx;
            var node = cc.find('Canvas/desk_node/update_score');
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('lbl').getComponent(cc.Label).string = data[1].toString();
            node.getChildByName('score' + view).getChildByName('ani').getComponent(cc.Animation).play();
        }
    },
});
