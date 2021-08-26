var dd = cc.dd;
var scmj_net_handler_scmj = require( "scmj_net_handler_scmj" );
var scmj_desk_data_jbc = require("scmj_desk_data_jbc");

var DeskData = require('scmj_desk_data').DeskData;
var DeskEvent = require('scmj_desk_data').DeskEvent;
var DeskED = require('scmj_desk_data').DeskED;

var game_room = require( "game_room" );

var playerMgr = require('scmj_player_mgr');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require("scmj_userPlayer_data").Instance();

var xzmjjb_handler = cc.Class({

    extends: scmj_net_handler_scmj.constructor,
    ctor: function () {
        cc.log("scmj_net_handler_scmj 子类");
    },


    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_xzmj_ack_roomInit: function( msg ) {
        cc.log("jbc on_xzmj_ack_roomInit");
        RoomMgr.Instance().gameId = msg.deskinfo.desktype;
        RoomMgr.Instance().roomId = msg.deskinfo.passwrod;
        RoomMgr.Instance()._Rule = msg.deskinfo.createcfg;
        RoomMgr.Instance()._Rule.issanfang = RoomMgr.Instance()._Rule.reservedList[0] === 'true';
        RoomMgr.Instance()._Rule.isdiangangzimo = RoomMgr.Instance()._Rule.reservedList[1] === 'true';
        RoomMgr.Instance()._Rule.hujiaozhuanyizhuangen = RoomMgr.Instance()._Rule.reservedList[2] === 'true';
        RoomMgr.Instance()._Rule.duiduihu3fan = RoomMgr.Instance()._Rule.reservedList[3] === 'true';
        RoomMgr.Instance()._Rule.huan4zhang = RoomMgr.Instance()._Rule.reservedList[4] === 'true';
        RoomMgr.Instance()._Rule.jiaxinwu = RoomMgr.Instance()._Rule.reservedList[5] === 'true';
        RoomMgr.Instance()._Rule.yitiaolong = RoomMgr.Instance()._Rule.reservedList[6] === 'true';
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
    on_xzmj_ack_game_opening: function( msg ) {
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setIsStart( true );
        scmj_desk_data_jbc.getInstance().setIsStart( true );
        DeskData.Instance().setFirstMoPai( true );
        scmj_desk_data_jbc.getInstance().setIsMatching( false );

        if (!this.headerHandle(msg)) return;
        DeskData.Instance().banker = msg.bankerid;
        DeskData.Instance().remainCards = 108;
        DeskED.notifyEvent(DeskEvent.GAME_OPENING, []);
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_xzmj_ack_send_current_result: function( msg ) {
        this._super(msg);
        scmj_desk_data_jbc.getInstance().setIsStart(DeskData.Instance().isFriend()==false);
        DeskData.Instance().setIsStart( false );
    },

    /**
     * 断线重连
     * @param msg
     */
    on_xzmj_ack_reconnect: function( msg ) {
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
        scmj_desk_data_jbc.getInstance().setIsReconnect( true );
        scmj_desk_data_jbc.getInstance().setIsStart( true );
        DeskData.Instance().setIsStart( true );

        if(msg.jiaoinfosList.length){
            UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
        }

        this.configId = msg.deskrules.configid;
        var jlmjJbcCfgItem = game_room.getItem( function(item) {
            return item.key === this.configId;
        }.bind( this ) );
        scmj_desk_data_jbc.getInstance().setData( jlmjJbcCfgItem );

        this._super(msg);

        //发出事件 如果在房间内则直接刷新  如果在大厅 则先进入房间内在刷新
        cc.log("-------xzmjjbc 断线重连------1");
        // DeskED.notifyEvent(DeskEvent.RECOVER_DESK, msg.deskrules.desktype);
        cc.log("-------xzmjjbc 断线重连------2");

        cc.find("Canvas/layer_base_score").active = !DeskData.Instance().isGameStart;
        cc.find("Canvas/btn_match").active = !DeskData.Instance().isGameStart;
        cc.find("Canvas/messageBtn").getComponent(cc.Button).interactable = DeskData.Instance().isGameStart;
        DeskED.notifyEvent(DeskEvent.TUO_GUAN, false);
    },

    /**
     * 金币更新
     * @param msg
     */
    on_xzmj_ack_update_coin: function( msg ) {
        cc.log( msg.userid + "更新金币" );
        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){player.setCoin( msg.coin );}
    },

});

module.exports = new xzmjjb_handler();