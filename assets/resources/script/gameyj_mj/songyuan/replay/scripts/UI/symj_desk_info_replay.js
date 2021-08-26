var symj_util = require('symj_util');
var symj_desk_info = require( "symj_desk_info" );
var symj_desk_data_jbc = require( "symj_desk_data_jbc" );

var DeskEvent = require("symj_desk_data").DeskEvent;
var DeskED = require("symj_desk_data").DeskED;
var DeskData = require('symj_desk_data').DeskData;
var Define = require( "Define" );
var DingRobot = require('DingRobot');

var GateNet = require( "GateNet" );
var game_room = require("game_room");

var jlmj_prefab = require('jlmj_prefab_cfg');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_audio_path = require( "jlmj_audio_path" );
var jlmj_layer_zorder = require( "jlmj_layer_zorder" );

var playerMgr = require('symj_player_mgr');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var SysED = require("com_sys_data").SysED;

var PopupType = {
    OK_CANCEL: 1,
    OK: 2,
    CANCEL: 3,
};

cc.Class({
    extends: symj_desk_info,

    //初始化按键显示
    initShowBtn:function () {
        this.baopai.node.active = false;
        this.zhinanNode.active = true;
        this.guizeNode.active = false;
    },

    onLoad :function() {
        cc.log("symj_desk_info_replay onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-songyuan").getComponent(cc.Sprite);

        this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        // this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;

        this.initDeskDataUI();
        this.initLocalData();
        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }
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

        cc.find("Canvas/desk_node/jlmj_zhishiqi").active = false;

        cc.find("Canvas/desk_node/down_head_button").active = false;

        cc.find("Canvas/room_num").active = false;

        this.baopai = cc.find("Canvas/desk_node/baopai").getComponent('jlmj_pai');
        this.deskImage = cc.find("Canvas/zhuozi");

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


        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        this.da_pai_prompt.active = false;

        //初始化人数
        DingRobot.set_ding_type(1);
        this.update_player_num(playerMgr.Instance().getPlayerNum());

        //如果桌子已解散,弹窗提示玩家
        if(DeskData.Instance().desk_dissolved){
            var content = cc.dd.Text.TEXT_DESK_INFO_5;
            this.popViewTips(content, function(){
                symj_util.enterHall();
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
        var play_list = cc.find('Canvas/player_list').getComponent('symj_player_list');
        play_list.playerUpdateUI();
        play_list.refreshGPSWarn();
    },

    /**
     * 清理桌子
     */
    clear: function (data) {
        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;

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
        cc.log('前后台切换,农安麻将回放场景中不返回大厅');
        return;
    },

    /**
     * 玩家数量更新
     */
    update_player_num:function (data) {

    },

    /**
     * 更新总圈数
     * @param totalValue 总圈数 如果为null就去取数据层的数据
     */
    update_total_round: function (totalValue) {

    },

    /**
     * 更新当前圈数
     * @param currValue 当前圈数 如果为null就去取数据层的数据
     */
    update_curr_round: function (currValue) {

    },

    onKeyDown: function (event) {
        if(event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape) {
            cc.replay_gamedata_scrolling = false;
            jlmj_audio_mgr.com_btn_click();
            symj_util.enterHall();
        }
    }
});
