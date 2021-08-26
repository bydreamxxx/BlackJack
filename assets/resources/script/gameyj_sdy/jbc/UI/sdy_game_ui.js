var PlayerEvent = require('sdy_player_data').PlayerEvent;
var PlayerED = require('sdy_player_data').PlayerED;
var RoomData = require('sdy_room_data').RoomData;

cc.Class({
    extends: cc.Component,

    properties: {
        //游戏消息
        node_game_msg: cc.Node,
        sp_game_msg: cc.Sprite,
        spf_other_calling: cc.SpriteFrame,
        spf_other_selecting: cc.SpriteFrame,
    },

    onLoad: function () {
        this.defaultSet();
        this.initUI();
        PlayerED.addObserver(this);

        //断线重连 解散判断
        if(RoomData.Instance().state == 6){
            cc.dd.UIMgr.openUI('gameyj_sdy/pyc/prefab/sdy_jiesan');
        }
    },

    onDestroy: function () {
        PlayerED.removeObserver(this);
    },

    defaultSet: function () {
        this.node_game_msg.active = false;
    },

    initUI: function () {

    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case PlayerEvent.SDY_PLAYER_EVENT_CALLING:
                var player = data[0];
                if(player.view_idx == 0){
                    this.node_game_msg.active = false;
                }else{
                    this.node_game_msg.active = true;
                    this.sp_game_msg.spriteFrame = this.spf_other_calling;
                }
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_CALLED:
                this.node_game_msg.active = false;
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SELECTING:
                var player = data[0];
                if(player.view_idx == 0){
                    this.node_game_msg.active = false;
                }else{
                    this.node_game_msg.active = true;
                    this.sp_game_msg.spriteFrame = this.spf_other_selecting;
                }
                break;
            case PlayerEvent.SDY_PLAYER_EVENT_SELECTED:
                this.node_game_msg.active = false;
                break;
            default:
                break;
        }
    }

});
