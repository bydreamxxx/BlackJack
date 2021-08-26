var dd = cc.dd;
var ccmj_net_handler_ccmj = require( "ccmj_net_handler_ccmj" );
var ccmj_desk_data_jbc = require("ccmj_desk_data_jbc");

var DeskData = require('ccmj_desk_data').DeskData;
var DeskEvent = require('ccmj_desk_data').DeskEvent;
var DeskED = require('ccmj_desk_data').DeskED;

const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;

var game_room = require( "game_room" );

var playerMgr = require('ccmj_player_mgr');

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var UserPlayer = require("ccmj_userPlayer_data").Instance();

var ccjb_handler = cc.Class({

    extends: ccmj_net_handler_ccmj.constructor,
    ctor: function () {
        cc.log("ccmj_net_handler_ccmj 子类");
    },


    /**
     * 初始化桌子 消息
     * @param msg
     */
    on_p16_ack_roomInit: function( msg ) {
        cc.log("jbc on_p16_ack_roomInit");
        RoomMgr.Instance().gameId = msg.deskinfo.desktype;
        RoomMgr.Instance().roomId = msg.deskinfo.passwrod;
        RoomMgr.Instance()._Rule = msg.deskinfo.createcfg;
        RoomMgr.Instance()._Rule.ismingdanzhanli = RoomMgr.Instance()._Rule.reservedList[0] === 'true';
        RoomMgr.Instance()._Rule.islixiantuoguan = RoomMgr.Instance()._Rule.reservedList[1] === 'true' ? '45' : RoomMgr.Instance()._Rule.reservedList[1];

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
    on_p16_ack_game_opening: function( msg ) {
        this.needClean = true;

        DeskData.Instance().waitJiesuan = false;
        DeskData.Instance().isGameStart = true;
        DeskData.Instance().setIsStart( true );
        ccmj_desk_data_jbc.getInstance().setIsStart( true );
        DeskData.Instance().setFirstMoPai( true );
        ccmj_desk_data_jbc.getInstance().setIsMatching( false );

        if (!this.headerHandle(msg)) return;
        DeskData.Instance().banker = msg.bankerid;
        DeskData.Instance().remainCards = 136;
        DeskED.notifyEvent(DeskEvent.GAME_OPENING, []);

        if(DeskData.Instance().inJueSai && DeskData.Instance().isMatch()){
            cc.gateNet.Instance().dispatchTimeOut(4);
            playerMgr.Instance().setBanker(msg.bankerid);
            DeskData.Instance().setLianzhuang(msg.oldbankerid == msg.bankerid ? msg.bankerid : 0);//设置连庄
            DeskData.Instance().startGame();
            if (msg.currplaycount > DeskData.Instance().currPlayCount) {//正常玩时每圈显示一次， 断线重连每次显示
                DeskData.Instance().setCurrRound(msg.currplaycount);
            }
        }
    },

    /**
     * 小结算 消息
     * @param msg
     */
    on_p16_ack_send_current_result: function( msg ) {
        this._super(msg);
        ccmj_desk_data_jbc.getInstance().setIsStart(DeskData.Instance().isFriend()==false);
        DeskData.Instance().setIsStart( false );
    },

    /**
     * 断线重连
     * @param msg
     */
    on_p16_ack_reconnect: function( msg ) {
        DeskData.Instance().waitJiesuan = false;

        if(msg.deskrules.desktype == cc.dd.Define.GameType.CCMJ_MATCH){
            this._super(msg);
            return;
        }

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
        ccmj_desk_data_jbc.getInstance().setIsReconnect( true );
        ccmj_desk_data_jbc.getInstance().setIsStart( true );
        DeskData.Instance().setIsStart( true );

        if(msg.jiaoinfosList.length){
            UserPlayer.setJiaoPaiMsg(msg.jiaoinfosList);
        }

        this.configId = msg.deskrules.configid;
        var jlmjJbcCfgItem = game_room.getItem( function(item) {
            return item.key === this.configId;
        }.bind( this ) );
        ccmj_desk_data_jbc.getInstance().setData( jlmjJbcCfgItem );

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
    on_p16_ack_update_coin: function( msg ) {
        cc.log( msg.userid + "更新金币 JBC" );
        var player = playerMgr.Instance().getPlayer(msg.userid);
        if(player){
            if(DeskData.Instance().isMatch()){
                var changeScore = msg.coin - player.coin;
                player.setCoin( msg.coin );
                BSC_ED.notifyEvent(BSC_Event.UPDATE_SCORE, [msg.userid, changeScore, msg.coin]);
            }else{
                player.setCoin( msg.coin );
            }
        }
    },

    on_p16_ack_ready: function( msg ) {
        if(DeskData.Instance().inJueSai && DeskData.Instance().isMatch() && this.needClean == true){
            this.needClean = false;
            DeskData.Instance().clear();
            playerMgr.Instance().clear();
        }
        this._super();
    },

    on_p16_ack_update_deposit: function( msg ) {
        if (!this.headerHandle(msg)) return;

        var isoffline = msg.isdeposit;
        DeskData.Instance().isoffline = isoffline;

        //发出事件
        DeskED.notifyEvent(DeskEvent.TUO_GUAN, isoffline);
    },
});

module.exports = new ccjb_handler();