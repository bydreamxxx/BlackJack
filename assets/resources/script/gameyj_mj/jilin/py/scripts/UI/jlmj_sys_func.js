var dd = cc.dd;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var jlmj_emit    = require('jlmj_emit_eventid');
var jlmj_notice  = require('jlmj_notice').getInstance();
var playerMgr = require('jlmj_player_mgr');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        playerHead_down: { default:null, type:cc.Node, toolTip:"用户玩家头像" },
        shezhi_menu: require('jlmj_shezhi_menu'),
    },

    onLoad: function () {
        //事件注册
        this.shezhi_menu.node.active = false;
    },

    onDestroy: function() {
        //销毁数据
    },

    onSetting: function(event,custom) {
        jlmj_audio_mgr.com_btn_click();
        this.shezhi_menu.node.active = !this.shezhi_menu.node.active;
        var ani = this.shezhi_menu.node.getComponent(cc.Animation);
        ani.play('mj_shezhi_act');
        this.shezhi_menu.updateUI();
    },

    /**
     * 消息
     * @param event
     * @param custom
     */
    onMessage: function( event, custom ) {
        if (event.type != "touchend"){
            return;
        }
        // jlmj_notice.notification(jlmj_emit.EMIT_CLICK_SPEAKBTN);
        jlmj_audio_mgr.com_btn_click();
        //正在聊天,不打开聊天界面
        if(this.playerHead_down.getComponent('jlmj_playerHead').isChating()){
            cc.log("正在聊天,不打开聊天界面");
            return;
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_CHAT);
    },

    /**
     * 战绩
     */
    onZhanJi: function( event, custom ) {
        if (event.type != "touchend"){
            return;
        }

        jlmj_audio_mgr.com_btn_click();
    },

    disabledLayerClick: function(event) {
        cc.log( "场景被中途恢复的时候禁止点击了" );
    },

});

