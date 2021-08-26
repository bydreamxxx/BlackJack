var PlayerED = require("sdy_player_data").PlayerED;
var PlayerEvent = require("sdy_player_data").PlayerEvent;
var playerMgr = require('sdy_player_mgr').PlayerMgr;

var RoomEvent = require('sdy_room_data').RoomEvent;
var RoomED = require('sdy_room_data').RoomED;
var RoomData = require('sdy_room_data').RoomData;

var commonRoomED = require( "jlmj_room_mgr" ).RoomED;
var commonRoomEvent = require( "jlmj_room_mgr" ).RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var userList = cc.Class({
    extends: cc.Component,

    properties: {
        player_ui_arr: { default: [], type: [require('sdy_player_base_ui')], tooltip:"玩家ui"},
    },

    ctor: function () {

    },

    onLoad: function onLoad() {
        this.defaultSet();
        this.initUI();
        PlayerED.addObserver(this);
        RoomED.addObserver(this);
        commonRoomED.addObserver(this);
    },

    onDestroy: function () {
        PlayerED.removeObserver(this);
        RoomED.removeObserver(this);
        commonRoomED.removeObserver(this);
    },

    defaultSet: function () {
        for(var i=0; i<4; ++i){
            this.player_ui_arr[i].node.active = false;
            this.player_ui_arr[i].defaultSet();
        }
    },

    initUI: function () {
        playerMgr.Instance().playerList.forEach(function(player){
            if(player != null){
                this.player_ui_arr[player.view_idx].node.active = true;
                this.player_ui_arr[player.view_idx].initUI();
            }
        },this);
    },

    playerPrepare: function (data) {
        playerMgr.Instance().playerList.forEach(function(player){
            if(player){
                if(player.user_id == data.userId){
                    player.ready = true;
                }
                this.player_ui_arr[player.view_idx].prepare(player);
            }
        },this);

    },

    addPlayerNode: function (player) {
        this.player_ui_arr[player.view_idx].head.node.active = true;
        this.player_ui_arr[player.view_idx].head.setData(player);
    },

    removePlayerNode: function (player) {
        this.player_ui_arr[player.view_idx].head.node.active = false;
    },

    /**
     * 获取玩家头像ui数据
     * @param player
     */
    getUserHeadNode:function (userID) {
        for(var i=0; i< this.player_ui_arr.length; ++i){
            var player_ui = this.player_ui_arr[i];
            if(player_ui.head && player_ui.head.data && player_ui.head.data.user_id == userID){
                return player_ui.head;
            }
        }
        return null;
    },

    onEventMessage:function (event,data) {

        switch (event){
            case PlayerEvent.ENTER:
                // this.addPlayerNode(player);
                break;
            case PlayerEvent.EXIT:
                // this.removePlayerNode(player);
                break;
            case RoomEvent.SDY_ROOM_EVENT_CALLSCOREEND:
                for(var i=0; i<4; ++i){
                    this.player_ui_arr[i].callEnd();
                }
                break;
            case RoomEvent.SDY_ROOM_EVENT_WAVEEND:
                for(var i=0; i<4; ++i){
                    this.player_ui_arr[i].waveEnd();
                }
                break;
            case RoomEvent.SDY_ROOM_EVENT_GETSCORE:
                break;
            case RoomEvent.SDY_ROOM_EVENT_RECONNECT:
                for(var i=0; i<4; ++i){
                    this.player_ui_arr[i].node.active = true;
                    this.player_ui_arr[i].initUI();
                }
                break;
            case commonRoomEvent.on_room_replace: //换桌成功
                cc.dd.UIMgr.destroyUI('gameyj_sdy/jbc/prefab/sdy_jiesuan');
                this.defaultSet();
                break;
            case commonRoomEvent.on_room_ready:
                cc.dd.UIMgr.destroyUI('gameyj_sdy/jbc/prefab/sdy_jiesuan');
                this.playerPrepare(data);
                break;
            case commonRoomEvent.on_room_leave:
                if(data[0].userId == cc.dd.user.id){
                    for(var i=0; i<4; ++i){
                        this.player_ui_arr[i].play_timeout_ani = false;
                        this.player_ui_arr[i].endCD();
                    }
                    RoomData.Instance().clear();
                    playerMgr.Instance().clear();
                    cc.dd.SceneManager.replaceScene("kuaileba_hall");
                }else{
                    var player = RoomMgr.Instance().getPlayer(data[0].userId);
                    if(player){
                        this.removePlayerNode(player);
                    }
                }
                break;
            case commonRoomEvent.on_room_join:
                var player = RoomMgr.Instance().getPlayer(data[0].roleInfo.userId);
                if(player){
                    this.addPlayerNode(player);
                }
                break;
            default:
                break;
        }
    },

});

module.exports = userList;