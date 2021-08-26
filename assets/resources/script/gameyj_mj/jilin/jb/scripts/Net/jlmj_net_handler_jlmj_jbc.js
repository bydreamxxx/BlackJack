var jlmj_net_handler_jlmj = require( "jlmj_net_handler_jlmj" );
var DeskData = require('jlmj_desk_data').DeskData;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var jlmj_desk_jbc_data = require( "jlmj_desk_jbc_data" );
var UserPlayer = require("jlmj_userPlayer_data").Instance();
var game_room = require( "game_room" );
var playerMgr = require('jlmj_player_mgr');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var handler = cc.Class({
    extends: jlmj_net_handler_jlmj.constructor,

    ctor: function() {
        cc.log( "jlmj_net_handler_jlmj 子类" )
    },

    /**
     * 开局
     * @param msg
     */
    on_p17_ack_game_opening: function( msg ) {
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setIsStart( true );
        jlmj_desk_jbc_data.getInstance().setIsStart( true );
        DeskData.Instance().setFirstMoPai( true );
        jlmj_desk_jbc_data.getInstance().setIsMatching( false );

        if (!this.headerHandle(msg)) return;
        DeskData.Instance().banker = msg.bankerid;
        DeskData.Instance().remainCards = 136;
        DeskED.notifyEvent(DeskEvent.GAME_OPENING, []);
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_p17_ack_send_current_result: function( msg ) {
        this._super(msg);
        jlmj_desk_jbc_data.getInstance().setIsStart(DeskData.Instance().isFriend()==false);
        DeskData.Instance().setIsStart( false );
    },

    /**
     * 断线重连
     * @param msg
     */
    on_p17_ack_reconnect: function( msg ) {
        cc.dd.mj_game_start = true;

        RoomMgr.Instance().gameId = msg.deskrules.desktype;

        for( var i = 0; i < msg.playerinfoList.length; ++ i ) {
            var id = msg.playerinfoList[i].userid;
            if( cc.dd.user.id === id ) {
                var selfIndex = msg.playerinfoList[i].site;
                DeskED.notifyEvent(DeskEvent.INIT_ZHINAN, [selfIndex]);
                break;
            }
        }
        jlmj_desk_jbc_data.getInstance().setIsReconnect( true );
        jlmj_desk_jbc_data.getInstance().setIsStart( true );
        DeskData.Instance().setIsStart( true );

        if(msg.jiaoinfosList.length){
            UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
        }

        this.configId = msg.deskrules.configid;
        var jlmjJbcCfgItem = game_room.getItem( function(item) {
            return item.key === this.configId;
        }.bind( this ) );
        jlmj_desk_jbc_data.getInstance().setData( jlmjJbcCfgItem );

        this._super(msg);

        //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
        // DeskED.notifyEvent(DeskEvent.RECOVER_DESK, msg.deskrules.desktype);
        cc.log("-------jbc 断线重连------");
    },

    /**
     * 金币更新
     * @param msg
     */
    on_p17_ack_update_coin: function( msg ) {
        cc.log( msg.userid + "更新金币" );
        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){player.setCoin( msg.coin );}
    },

    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_p17_ack_roomInit: function( msg ) {
        RoomMgr.Instance().gameId = msg.deskinfo.desktype;
        RoomMgr.Instance().roomId = msg.deskinfo.passwrod;
        RoomMgr.Instance()._Rule = msg.deskinfo.createcfg;
        RoomMgr.Instance()._Rule.fengding = parseInt(RoomMgr.Instance()._Rule.reservedList[0]);
        if(!RoomMgr.Instance()._Rule.reservedList || RoomMgr.Instance()._Rule.reservedList.length == 0){
            switch(RoomMgr.Instance()._Rule.guangguotype){
                case 0:
                    RoomMgr.Instance()._Rule.fengding = 16;
                    break;
                case 1:
                case 3:
                    RoomMgr.Instance()._Rule.fengding = 32;
                    break;
                case 2:
                case 4:
                    RoomMgr.Instance()._Rule.fengding = 64;
                    break;
            }
        }else{
            RoomMgr.Instance()._Rule.fengding = parseInt(RoomMgr.Instance()._Rule.reservedList[0]);
        }

        for( var i = 0; i < msg.playersList.length; ++ i ) {
            var id = msg.playersList[i].userid;
            if( cc.dd.user.id === id ) {
                var selfIndex = msg.playersList[i].site;
                DeskED.notifyEvent(DeskEvent.INIT_ZHINAN, [selfIndex]);
                break;
            }
        }


        for( var i = 0; i < msg.playersList.length; ++ i ) {
            var id = msg.playersList[i].userid;
            if( msg.playersList[i].isbanker ) {
                DeskData.Instance().banker = id;
                break;
            }
        }

        this._super( msg );
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = new handler();
