var cfmj_util = require('cfmj_util');
var cfmj_desk_info = require( "cfmj_desk_info" );
var cfmj_desk_data_jbc = require( "cfmj_desk_data_jbc" );

var DeskEvent = require("cfmj_desk_data").DeskEvent;
var DeskED = require("cfmj_desk_data").DeskED;
var DeskData = require('cfmj_desk_data').DeskData;
var Define = require( "Define" );
var DingRobot = require('DingRobot');

var GateNet = require( "GateNet" );
var game_room = require("game_room");

var jlmj_prefab = require('nmmj_prefab_cfg');
var jlmj_audio_mgr = require('nmmj_audio_mgr').Instance();
var jlmj_audio_path = require( "nmmj_audio_path" );
var jlmj_layer_zorder = require( "jlmj_layer_zorder" );

var playerMgr = require('cfmj_player_mgr');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var SysED = require("com_sys_data").SysED;
var Text = cc.dd.Text;
var com_replay_data = require('com_replay_data').REPLAY_DATA;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var playerED = require("cfmj_player_data").PlayerED;
var RoomED = require("jlmj_room_mgr").RoomED;
var Hall = require("jlmj_halldata");

var PopupType = {
    OK_CANCEL: 1,
    OK: 2,
    CANCEL: 3,
};

cc.Class({
    extends: cfmj_desk_info,

    //初始化按键显示
    initShowBtn:function () {
        this.baopai.node.active = false;
        this.zhinanNode.active = true;
        this.guizeNode.active = false;
    },

    onLoad :function() {
        cc.log("cfmj_desk_info_replay onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-chifeng").getComponent(cc.Sprite);

        this.run_score = cc.find("Canvas/cfmj_run_score");
        this.run_score.active = false;

        this.run_scoreTips = cc.find("Canvas/desk_node/run_score_prompt");
        this.run_scoreTipsLabel = cc.find("Canvas/desk_node/run_score_prompt/prompt_label").getComponent(cc.Label);
        this.run_scoreTips.active = false;

        this.gameready = cc.find("Canvas/desk_node/beforeGame");
        this.gameready.active = false;

        this.initDeskDataUI();
        this.initDeskData();
        this.initLocalData();
        this.initGuiZeInfo();
        this.update_curr_round();
        this.update_total_round();
        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }

        HallCommonEd.addObserver(this);
        DeskED.addObserver(this);
        playerED.addObserver(this);
        SysED.addObserver(this);
        RoomED.addObserver(this);
        Hall.HallED.addObserver(this);
    },

    onDestroy: function() {
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
        this._super();
    },

    initDeskDataUI:function () {
        cc.find("Canvas/desk_node/jlmj_player_down_ui").active = true;
        cc.find("Canvas/desk_node/jlmj_player_right_ui").active = false;
        cc.find("Canvas/desk_node/jlmj_player_up_ui").active = true;
        cc.find("Canvas/desk_node/jlmj_player_left_ui").active = false;

        cc.find("Canvas/desk_node/down_head_button").active = false;
        cc.find("Canvas/desk_node/right_head_button").active = false;
        cc.find("Canvas/desk_node/up_head_button").active = false;
        cc.find("Canvas/desk_node/left_head_button").active = false;

        cc.find("Canvas/kai_ju_ani").active = false;
        cc.find("Canvas/huang_zhuang_ani").active = false;

        cc.find("Canvas/desk_node/dahuanbao").active = false;
        cc.find("Canvas/desk_node/jlmj_zhishiqi").active = false;
        cc.find("Canvas/desk_node/baopai").active = false;

        cc.find("Canvas/desk_node/down_head_button").active = false;


        // cc.find("Canvas/room_num").active = false;
        cc.find("Canvas/toppanel/gzNode/shuNode/room_num").active = true;

        this.zhinan = null;
        this._zhinan = cc.find("Canvas/desk_node/mj_zhinan");
        this._zhinan_2d = cc.find("Canvas/desk_node/mj_zhinan_2d");
        this.use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
        if(this.use2D){
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = true;
        }else{
            this.zhinan = this._zhinan;
            this._zhinan.active = true;
            this._zhinan_2d.active = false;
        }


        this.baopai = cc.find("Canvas/desk_node/baopai").getComponent('jlmj_pai');
        this.deskImage = cc.find("Canvas/zhuozi");

        //初始化人数
        DingRobot.set_ding_type(1);
        this.update_player_num(playerMgr.Instance().getPlayerNum());

        //如果桌子已解散,弹窗提示玩家
        if(DeskData.Instance().desk_dissolved){
            var content = cc.dd.Text.TEXT_DESK_INFO_5;
            this.popViewTips(content, function(){
                cfmj_util.enterHall();
            }.bind( this ), PopupType.OK);
        }

        //结算窗口
        if(DeskData.Instance().jiesuanMsg){
            var msg = DeskData.Instance().jiesuanMsg;
            DeskData.Instance().jiesuanMsg = null;
            this.jiesuan([msg]);
        }

        this.update_player_info();
    },

    initDeskData:function () {
        var roomNum = RoomMgr.Instance().roomId;
        //当前局数
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu").getComponent(cc.Label).string = com_replay_data.Instance().curRound;
        //总局数
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju").getComponent(cc.Label).string = com_replay_data.Instance().totalRound;
        //房号
        cc.find("Canvas/toppanel/gzNode/shuNode/room_num/room_id").getComponent(cc.Label).string = roomNum;
    },

    //初始化规则显示文本
    initGuiZeInfo: function() {
        cc.find("Canvas/toppanel/gzNode").active = true;
        var mj_guize = cc.find("Canvas/toppanel/gzNode").getComponent("mj_guize");
        var cur_rule = RoomMgr.Instance()._Rule;
        cur_rule.roomId = RoomMgr.Instance().roomId;

        this.gz_arr_box = [];
        this.gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_120.format([RoomMgr.Instance()._Rule.usercountlimit]));
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.is37jia ? Text.TEXT_PY_RULE_121 : '');
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(RoomMgr.Instance()._Rule.paofen) : (RoomMgr.Instance()._Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123));

        this.gz_arr_info = [];
        var juquan_txt = RoomMgr.Instance()._Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;

        this.gz_arr_info.push({ str: Text.TEXT_PY_RULE_120.format([RoomMgr.Instance()._Rule.usercountlimit]), nodetype: 0 });
        this.gz_arr_info.push({ str: juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]), nodetype: 0 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.is37jia ? Text.TEXT_PY_RULE_121 : '', nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(RoomMgr.Instance()._Rule.paofen) : (RoomMgr.Instance()._Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123), nodetype: 1 });

        mj_guize.addGuize(this.gz_arr_info, false);
    },

    //更新玩家ui
    update_player_info:function () {
        var player_list = RoomMgr.Instance().player_mgr.playerList;
        for(var i in player_list){
            if(player_list[i].viewIdx == 0){
                cc.find("Canvas/desk_node/jlmj_player_down_ui").active = true;
            }
            if(player_list[i].viewIdx == 1){
                cc.find("Canvas/desk_node/jlmj_player_right_ui").active = true;
            }
            if(player_list[i].viewIdx == 2) {
                cc.find("Canvas/desk_node/jlmj_player_up_ui").active = true;
            }
            if(player_list[i].viewIdx == 3) {
                cc.find("Canvas/desk_node/jlmj_player_left_ui").active = true;
            }
        }
        var play_list = cc.find('Canvas/player_list').getComponent('cfmj_player_list');
        play_list.playerUpdateUI();
        play_list.refreshGPSWarn();
    },

    /**
     * 清理桌子
     */
    clear: function (data) {
        cc.find("Canvas/desk_node/baopai").active = false;
        this.closeResponseDissolveView();
        this.closePopupView();
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);

        if(cc.dd.mj_change_2d_next_time){
            cc.dd.mj_change_2d_next_time = false;
            this._change2D();
        }
    },

    /**
     * 播放分张特效
     */
    fen_zhang_ani: function () {    //回放不播放分张动画

    },

    /**
     * 删除分张牌
     * @param index 下标
     */
    mo_pai_fen_zhang: function () {     //回放不播放分张动画

    },

    update_hall_data: function( msg ) {
        if(cc.replay_looker_id){
            cc.dd.user.id = cc.replay_looker_id;    //旁观者作为第一视角
        }
        cc.log('前后台切换,长春麻将回放场景中不返回大厅');
        return;
    },

    /**
     * 玩家数量更新
     */
    update_player_num:function (data) {

    },
    /**
     * 更新剩余牌数
     * @param cardNum 牌数量 如果为null就去取数据层的数据
     */
    update_remain_card: function(cardNum) {
        if (!cardNum) {
            cardNum = DeskData.Instance().remainCards;
        }
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/pai_num").getComponent(cc.Label).string = cardNum;
    },
    /**
     * 更新总圈数
     * @param totalValue 总圈数 如果为null就去取数据层的数据
     */
    update_total_round: function (totalValue) {
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju").getComponent(cc.Label).string = com_replay_data.Instance().totalRound;
    },

    /**
     * 更新当前圈数
     * @param currValue 当前圈数 如果为null就去取数据层的数据
     */
    update_curr_round: function (currValue) {
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu").getComponent(cc.Label).string = com_replay_data.Instance().curRound;
    },

    onKeyDown: function (event) {
        if(event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape) {
            cc.replay_gamedata_scrolling = false;
            jlmj_audio_mgr.com_btn_click();
            cfmj_util.enterHall();
        }
    }
});
