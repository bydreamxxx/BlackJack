var RoomData = require('sdy_room_data').RoomData;
var RoomEvent = require('sdy_room_data').RoomEvent;
var RoomED = require('sdy_room_data').RoomED;
var jlmj_audio_mgr = require('jlmj_audio_mgr');
var commonRoomED = require( "jlmj_room_mgr" ).RoomED;
var commonRoomEvent = require( "jlmj_room_mgr" ).RoomEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        btn_start: cc.Button,
        txt_matching: cc.Label,
    },


    onLoad: function (){
        this.defaultSet();
        this.initUI();
        RoomED.addObserver(this);
        commonRoomED.addObserver(this);
    },

    onDestroy: function () {
        RoomED.removeObserver(this);
        commonRoomED.removeObserver(this);
    },

    defaultSet: function () {
        this.btn_start.node.active = true;
        this.txt_matching.node.active = false;
    },

    initUI: function () {
        if(RoomData.Instance().game_started){
            this.node.active = false;
        }else{
            this.node.active = true;
        }
    },

    onClickStart: function () {
        jlmj_audio_mgr.Instance().com_btn_click();
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();

        msg.setGameType( RoomData.Instance().game_type );
        msg.setRoomId( RoomData.Instance().room_lv );

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req,msg,"msg_enter_coin_game_req", true);

        this.btn_start.node.active = false;
        this.txt_matching.node.active = true;

        RoomData.Instance().matching = true;
    },

    onEventMessage:function (event,data) {
        switch (event){
            case RoomEvent.SDY_ROOM_EVENT_GAMESTART:
                this.node.active = false;
                break;
            case commonRoomEvent.on_room_replace:   //换桌成功
                this.node.active = true;
                this.btn_start.node.active = false;
                this.txt_matching.node.active = true;
                break;
            default:
                break;
        }
    },

});
