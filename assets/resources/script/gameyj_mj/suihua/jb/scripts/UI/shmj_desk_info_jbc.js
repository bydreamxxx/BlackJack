var baseDeskInfo = require( "shmj_desk_info" );


var shmj_util = require("shmj_util");
var shmj_desk_data_jbc = require("shmj_desk_data_jbc");

var DeskEvent = require("shmj_desk_data").DeskEvent;
var DeskData = require('shmj_desk_data').DeskData;
var DeskED = require('shmj_desk_data').DeskED;

var hall_common_data = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var jlmj_audio_mgr = require("jlmj_audio_mgr").Instance();

var playerMgr = require('shmj_player_mgr');
var playerED = require("jlmj_player_data").PlayerED;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;
var RoomED = require( "jlmj_room_mgr" ).RoomED;
var RoomEvent = require( "jlmj_room_mgr" ).RoomEvent;

var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;

var Text = cc.dd.Text;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

var UIZorder = require("mj_ui_zorder");
var UserPlayer = require("shmj_userPlayer_data").Instance();
var PlayerState = require("shmj_player_data").PlayerState;

var baseDeskInfoJB = cc.Class({
    extends: baseDeskInfo,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        cc.log("shmj_desk_info_jbc onLoad");
        this._super();
        this.initDeskDataUI();
        this.initDeskData();
    },

    initDeskDataUI:function () {
        cc.find("Canvas/layer_base_score").active = true;
        cc.find("Canvas/btn_match").active = true;

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
        cc.find("Canvas/desk_node/baopai").active = false;

        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").zIndex = UIZorder.MJ_LAYER_UI;
        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").active = false;
        cc.find("Canvas/desk_node/down_head_button").active = false;
        cc.find("Canvas/toppanel/layer_tuo_guan").active = false;
        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = false;

        this.baopai = cc.find("Canvas/desk_node/baopai").getComponent('jlmj_pai');
        this.deskImage = cc.find("Canvas/zhuozi").getComponent(cc.Sprite);

        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        this.da_pai_prompt.active = false;

        this.zhinan = null;
        this._zhinan = cc.find("Canvas/desk_node/mj_zhinan");
        this._zhinan_2d = cc.find("Canvas/desk_node/mj_zhinan_2d");
        this.use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        if(this.use2D){
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = true;
        }else{
            this.zhinan = this._zhinan;
            this._zhinan.active = true;
            this._zhinan_2d.active = false;
        }
    },

    initDeskData: function() {
        var deskDataJBC= shmj_desk_data_jbc.getInstance();

        if(deskDataJBC.getBaseScore() === 0){
            cc.find("Canvas/layer_base_score").active = false;
            cc.find("Canvas/btn_match").active = false;
            return;
        }
        //显示房间信息
        //场次类型
        cc.find("Canvas/layer_base_score/name").getComponent(cc.Label).string = deskDataJBC.getTitle();
        //底分
        cc.find("Canvas/layer_base_score/base_score").getComponent(cc.Label).string = Text.TEXT_MJ_JBC_0+deskDataJBC.getBaseScore();
        //右上角底分
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/base_score_bg/base_score_2").getComponent(cc.Label).string = deskDataJBC.getBaseScore();
    },

    //初始化规则显示文本
    initGuiZeInfo:function () {
        var desk_leftinfo = cc.find("Canvas/toppanel/desk_leftinfo_fun").getComponent("mj_desk_leftinfo");

        var func = cc.callFunc(function () {
            if(DeskData.Instance().isFriend()){
                desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
            }else{
                desk_leftinfo.dfNode.active = desk_leftinfo.dfNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.dfNode.active == false;
            }
        }.bind(desk_leftinfo));
        desk_leftinfo.init([], func);
    },

    start: function () {
        if( shmj_desk_data_jbc.getInstance().getIsReconnect() ) {
            DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        }
    },

    onDestroy: function() {
        DeskED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        playerED.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        TaskED.removeObserver(this);
        shmj_desk_data_jbc.getInstance().destroy();
        this._super();
        RoomMgr.Destroy();
    },

    /**
     * 更新桌子信息
     */
    updateDesk: function () {
        this.update_player_info();
        this.update_remain_card();
        this.update_bao_pai();
        this.clean_tuo_guan();
    },

    onMatch: function() {
        if(this._test()){
            return;
        }

        cc.dd.mj_game_start = true;
        let match = cc.find("Canvas/btn_match");
        if(match)
            match.getComponent(cc.Button).interactable = false;

        jlmj_audio_mgr.com_btn_click();
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(RoomMgr.Instance().roomLv);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req,msg,"msg_enter_coin_game_req", true);
    },

    /**
     * 播放防作弊匹配动画
     */
    playMatchAnim: function() {
        cc.find("Canvas/layer_base_score").active = true;
        cc.find("Canvas/desk_node/anim_matching").active = true;
        cc.find("Canvas/desk_node/anim_matching").getComponent(dragonBones.ArmatureDisplay).playAnimation('FZZPPZ',-1);
    },

    jbc_ready:function () {
        cc.dd.mj_game_start = true;

        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomLv  );
        pbData.setGameInfo( gameInfoPB );
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req,pbData,"msg_prepare_game_req", true);

        var play_list = cc.find('Canvas/player_list').getComponent('shmj_player_list');
        if(play_list) {
            for(var i=0; i< play_list.player_ui_arr.length; ++i){
                var headinfo = play_list.player_ui_arr[i];
                if(headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id){
                    headinfo.head.node.active = false;
                }else{
                    headinfo.head.read.active = true;
                }
            }
        }
    },


    /**
     * 停止防作弊匹配动画
     */
    stopMatchAnim: function() {
        cc.find("Canvas/layer_base_score").active = false;
        cc.find("Canvas/desk_node/anim_matching").active = false;
    },

    on_room_replace:function (msg) {
        if( msg.retCode !== 0 ) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_POPUP_18;
                    this.popupEnterHall( str, this.jbc_matching_leave_room_req );
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_POPUP_19;
                    this.popupEnterHall( str, this.jbc_matching_leave_room_req );
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    this.popupEnterHall( str, null );
                    break;
                default:
                    break;
            }
        } else {
            var play_list = cc.find('Canvas/player_list').getComponent('shmj_player_list');
            if(play_list) {
                for(var i=0; i< play_list.player_ui_arr.length; ++i){
                    var headinfo = play_list.player_ui_arr[i];
                    if(headinfo && headinfo.head.player && headinfo.head.player.userId == cc.dd.user.id){
                        headinfo.head.read.active = false;
                    }
                }
            }
            playerMgr.Instance().clear();
            this.playMatchAnim();
            shmj_desk_data_jbc.getInstance().setIsMatching(true);
            this.tuo_guan(false);
            cc.find("Canvas/desk_node/jlmj_zhishiqi").active = false;
        }
    },

    on_coin_room_enter:function () {
        cc.log("shmj 播放防作弊");
        shmj_desk_data_jbc.getInstance().setIsMatching(true);
        let match = cc.find("Canvas/btn_match");

        if(match)
        {
            match.getComponent(cc.Button).interactable = true;
            match.active = false;
        }
        this.playMatchAnim();
        this.tuo_guan(false);
    },

    on_room_enter:function () {
        cc.log("shmj jbc desk on_room_enter--->"+(DeskData.Instance().isGameStart));

        cc.find("Canvas/layer_base_score").active = !DeskData.Instance().isGameStart;
        cc.find("Canvas/btn_match").active = !DeskData.Instance().isGameStart;
        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = DeskData.Instance().isGameStart;
        cc.find("Canvas/toppanel/desk_leftinfo_fun").active = true;
        this.tuo_guan(!DeskData.Instance().isGameStart);
        DeskData.Instance().isGameStart?this.stopMatchAnim():null;
        this.initDeskData();
    },

    recover_desk:function () {
        cc.log("shmj jbc desk recover_desk------执行0");
        this.on_room_enter();
        this.recoverDesk();
    },

    on_room_ready: function( msg ) {
        if( msg.retCode !== 0 ) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall( str, shmj_util.enterRoomList.bind(shmj_util) );
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall( str, shmj_util.enterRoomList.bind(shmj_util) );
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall( str, null );
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall( str, this.jbc_matching_leave_room_req);
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall( str, this.jbc_matching_leave_room_req);
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
            // if(msg.userId == cc.dd.user.id) {
            //     playerMgr.Instance().clear();
            //     playerMgr.Instance().clearAlldapaiCding();
            //
            //     var player = playerMgr.Instance().getPlayer(msg.userId);
            //     if (player) {
            //         player.setReady(1);
            //     }
            //
            //     shmj_desk_data_jbc.getInstance().setIsMatching(true);
            // }
        }
    },

    on_room_leave: function( msg ) {
        // this.jbc_matching_leave_room_req();
        if(msg.userId == cc.dd.user.id || !cc.dd._.isNumber(msg.userId))
            shmj_util.enterHall();
    },

    tuo_guan: function (isShow) {
        if(isShow){
            this.menu_list = cc.find("Canvas/game_menu_list");
            if(this.menu_list){
                this.menu_list.getComponent("shmj_game_menu_list").closeMenuAndOptions();
            }
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('shmj_player_down_ui');

            if(UserPlayer.state == PlayerState.DAPAI){
                player_down_ui.setShoupaiTouch(true);
            }
            player_down_ui.setShoupaiTingbiaoji(false);
            player_down_ui.touchCardMode = 1;
            player_down_ui.closeJiaoInfo();
        }
        cc.find("Canvas/toppanel/layer_tuo_guan").active = isShow;
    },

    /**
     * 取消托管
     */
    clean_tuo_guan:function () {
        if(DeskData.Instance().isoffline) {
            const req = new cc.pb.suihuamj.suihua_req_update_deposit();
            req.setIsdeposit(false);
            cc.gateNet.Instance().sendMsg(cc.netCmd.suihuamj.cmd_suihua_req_update_deposit, req, "suihua_req_update_deposit", true);
        }
    },

    game_opening:function () {
        shmj_desk_data_jbc.getInstance().setIsStart( true );
        shmj_desk_data_jbc.getInstance().setIsMatching( false );
        DeskData.Instance().player_read_gamne = false;
        cc.find("Canvas/layer_base_score").active = false;
        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = true;

        /*cc.find("Canvas/down_head_button").active = true;
         cc.find("Canvas/right_head_button").active = true;
         cc.find("Canvas/up_head_button").active = true;
         cc.find("Canvas/left_head_button").active = true;*/
        this.stopMatchAnim();
    },

    /**
     * 玩家数量更新
     */
    update_player_num:function (data) {},

    update_player_info:function () {
        var player_list = playerMgr.Instance().playerList;
        for(var i in player_list){
            if(!player_list[i]){
                continue;
            }
            if(player_list[i].viewIdx == 0){
                cc.find("Canvas/desk_node/jlmj_player_down_ui").active = true;
                cc.find("Canvas/desk_node/down_head_button").active = true;
            }
            if(player_list[i].viewIdx == 1){
                cc.find("Canvas/desk_node/jlmj_player_right_ui").active = true;
                cc.find("Canvas/desk_node/right_head_button").active = true
                cc.find("Canvas/desk_node/mj_playerHead_right").active = true;
            }
            if(player_list[i].viewIdx == 2) {
                cc.find("Canvas/desk_node/jlmj_player_up_ui").active = true;
                cc.find("Canvas/desk_node/up_head_button").active = true;
                cc.find("Canvas/desk_node/mj_playerHead_up").active = true;
            }
            if(player_list[i].viewIdx == 3) {
                cc.find("Canvas/desk_node/jlmj_player_left_ui").active = true;
                cc.find("Canvas/desk_node/left_head_button").active = true;
                cc.find("Canvas/desk_node/mj_playerHead_left").active = true;
            }
        }

        this.zhinan.getComponent("shmj_zhinan_ui").initDirection();
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
                this.game_opening( false );
                break;
            case DeskEvent.RECOVER_DESK:
                cc.log("shmj jbc recover_desk------ 开始0");
                this.recover_desk();
                break;
            case DeskEvent.JBC_READY://
                this.jbc_ready();
                break;
            default:
                break;
        }
    },
    // update (dt) {},

    _test(){
        return false;
    },
});
