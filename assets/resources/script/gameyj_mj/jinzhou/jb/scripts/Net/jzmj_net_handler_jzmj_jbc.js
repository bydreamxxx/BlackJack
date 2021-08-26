var dd = cc.dd;
var jzmj_net_handler_jzmj = require( "jzmj_net_handler_jzmj" );
var jzmj_desk_data_jbc = require("jzmj_desk_data_jbc");

var DeskData = require('jzmj_desk_data').DeskData;
var DeskEvent = require('jzmj_desk_data').DeskEvent;
var DeskED = require('jzmj_desk_data').DeskED;

var game_room = require( "game_room" );

var playerMgr = require('jzmj_player_mgr');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require("jzmj_userPlayer_data").Instance();

var ccjb_handler = cc.Class({

    extends: jzmj_net_handler_jzmj.constructor,
    ctor: function () {
        cc.log("jzmj_net_handler_jzmj 子类");
    },


    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_jinzhou_ack_roomInit: function( msg ) {
        cc.log("jbc on_jinzhou_ack_roomInit");
        RoomMgr.Instance().gameId = msg.deskinfo.desktype;
        RoomMgr.Instance().roomId = msg.deskinfo.passwrod;
        RoomMgr.Instance()._Rule = msg.deskinfo.createcfg;

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

    /**
     * 开局
     * @param msg
     */
    on_jinzhou_ack_game_opening: function( msg ) {
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setIsStart( true );
        jzmj_desk_data_jbc.getInstance().setIsStart( true );
        DeskData.Instance().setFirstMoPai( true );
        jzmj_desk_data_jbc.getInstance().setIsMatching( false );

        if (!this.headerHandle(msg)) return;
        DeskData.Instance().banker = msg.bankerid;
        DeskData.Instance().remainCards = 112;
        DeskED.notifyEvent(DeskEvent.GAME_OPENING, []);
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_jinzhou_ack_send_current_result: function( msg ) {
        this._super(msg);
        jzmj_desk_data_jbc.getInstance().setIsStart(DeskData.Instance().isFriend()==false);
        DeskData.Instance().setIsStart( false );
    },

    /**
     * 断线重连
     * @param msg
     */
    on_jinzhou_ack_reconnect: function( msg ) {
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
        jzmj_desk_data_jbc.getInstance().setIsReconnect( true );
        jzmj_desk_data_jbc.getInstance().setIsStart( true );
        DeskData.Instance().setIsStart( true );

        if(msg.jiaoinfosList.length){
            UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
        }

        this.configId = msg.deskrules.configid;
        var jlmjJbcCfgItem = game_room.getItem( function(item) {
            return item.key === this.configId;
        }.bind( this ) );
        jzmj_desk_data_jbc.getInstance().setData( jlmjJbcCfgItem );

        this._super(msg);

        //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
        cc.log("-------ccjbc 断线重连------1");
        // DeskED.notifyEvent(DeskEvent.RECOVER_DESK, msg.deskrules.desktype);
        cc.log("-------ccjbc 断线重连------2");
    },

    /**
     * 金币更新
     * @param msg
     */
    on_jinzhou_ack_update_coin: function( msg ) {
        cc.log( msg.userid + "更新金币" );
        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){player.setCoin( msg.coin );}
    },

});

module.exports = new ccjb_handler();