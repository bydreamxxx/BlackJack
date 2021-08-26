var PlayerED = require("sdy_player_data").PlayerED;
var PlayerEvent = require("sdy_player_data").PlayerEvent;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;

var RoomEvent = require('sdy_room_data').RoomEvent;
var RoomED = require('sdy_room_data').RoomED;
var RoomData = require('sdy_room_data').RoomData;

var commonRoomED = require( "jlmj_room_mgr" ).RoomED;
var commonRoomEvent = require( "jlmj_room_mgr" ).RoomEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: require('sdy_player_list_ui'),

    properties: {

    },

    initUI: function () {
        RoomMgr.Instance().player_mgr.playerList.forEach(function(player){
            if(player != null){
                this.player_ui_arr[player.view_idx].node.active = true;
                this.player_ui_arr[player.view_idx].initUI();
            }
        },this);
    },

    onEventMessage:function (event,data) {

        switch (event){
            case PlayerEvent.ENTER:
                this.addPlayerNode(data[0]);
                break;
            case PlayerEvent.EXIT:
                this.removePlayerNode(data[0]);
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
            // case commonRoomEvent.on_room_replace: //换桌成功
            //     cc.dd.UIMgr.destroyUI('gameyj_sdy/jbc/prefab/sdy_jiesuan');
            //     this.defaultSet();
            //     break;
            case commonRoomEvent.on_room_ready:
                var player = PlayerMgr.Instance().getPlayer(data[0].userId);
                if(player){
                    this.player_ui_arr[player.view_idx].head.setReady(true);
                }
                break;
            case commonRoomEvent.on_room_leave:
                if(data[0].userId == cc.dd.user.id){
                    for(var i=0; i<4; ++i){
                        this.player_ui_arr[i].play_timeout_ani = false;
                        this.player_ui_arr[i].endCD();
                    }
                    RoomData.Instance().clear();
                    PlayerMgr.Instance().clear();
                    cc.dd.SceneManager.replaceScene("kuaileba_hall");
                }else{
                    var player = PlayerMgr.Instance().getPlayer(data[0].userId);
                    if(player){
                        this.removePlayerNode(player);
                    }
                }
                break;
            case commonRoomEvent.on_room_join:
                var player = PlayerMgr.Instance().getPlayer(data[0].roleInfo.userId);
                if(player){
                    this.addPlayerNode(player);
                }
                break;
            default:
                break;
        }
    },
});
