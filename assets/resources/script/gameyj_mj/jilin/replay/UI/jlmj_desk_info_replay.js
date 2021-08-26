var jlmj_desk_info = require( "jlmj_desk_info" );
var playerED = require("jlmj_player_data").PlayerED;
var SysED = require("com_sys_data").SysED;
var jlmj_desk_jbc_data = require( "jlmj_desk_jbc_data" );
var Define = require( "Define" );
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_audio_path = require( "jlmj_audio_path" );
var jlmj_prefab = require('jlmj_jbc_prefab_cfg');
var jlmj_layer_zorder = require( "jlmj_layer_zorder" );
var GateNet = require( "GateNet" );
var RoomED = require( "jlmj_room_mgr" ).RoomED;
var RoomEvent = require( "jlmj_room_mgr" ).RoomEvent;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskData = require('jlmj_desk_data').DeskData;
var playerMgr = require('jlmj_player_mgr');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var jlmj_Control_Combination_ui = require( "jlmj_Control_Combination_ui" );
var UserPlayer = require('jlmj_userPlayer_data').Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var game_room = require("game_room");
var jlmj_util = require('jlmj_util');

cc.Class({
    extends: jlmj_desk_info,

    //初始化按键显示
    initShowBtn:function () {
        this.baopai.node.active = false;
        //this.tingPaiBtn.node.active = false;
        this.guizeNode.active = false;

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
    nLoad :function() {
        cc.log("jlmj_desk_info_replay onLoad");
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
    /**
     * 播放分张特效
     */
    playerFenZhangAni: function () {    //回放不播放分张动画

    },

    /**
     * 删除分张牌
     * @param index 下标
     */
    hideFenZhangCard: function () {     //回放不播放分张动画

    },

    update_hall_data: function( msg ) {
        if(cc.replay_looker_id){
            cc.dd.user.id = cc.replay_looker_id;    //旁观者作为第一视角
        }
        cc.log('前后台切换,吉林麻将回放场景中不返回大厅');
        return;
    },

    onKeyDown: function (event) {
        if(event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape) {
            cc.replay_gamedata_scrolling = false;
            jlmj_audio_mgr.com_btn_click();
            jlmj_util.enterHall();
        }
    }
});
