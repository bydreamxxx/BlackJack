var jlmj_jiesuan_ui = require( "jlmj_jiesuan_ui" );
var jlmj_desk_jbc_data = require( "jlmj_desk_jbc_data" );
var deskData = require('jlmj_desk_data').DeskData;
var playerMgr = require('jlmj_player_mgr');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_jbc_prefab = require('jlmj_jbc_prefab_cfg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var UIZorder = require("mj_ui_zorder");

cc.Class({
    extends: jlmj_jiesuan_ui,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        preNewMatch: cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this._super();

    },

    onDestroy: function() {
        this.stopTime();
    },

    /**
     * 继续回调
     */
    goOnBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();

        this.sendReady();

    },

    /**
     * 分享回调
     */
    shardBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_jbc_prefab.JLMJ_SHARE, function(ui) {
            ui.zIndex = UIZorder.MJ_SHARE_UI;
        });
    },

    /**
     * 换桌 按钮 回调
     * @param event
     * @param data
     */
    onReplaceDesktop: function( event, data ) {
        jlmj_audio_mgr.com_btn_click();
        this.sendReplaceDesktop();
    },

    /**
     * 清理桌内
     */
    clearDesktop: function() {
        deskData.Instance().clear();
    },

    /**
     * 开启倒计时
     */
    startTime:function (ts) {
        //倒计时
        this._daojishiNum = ts || 20;
        this.goTimeTTF_1.string = this._daojishiNum;
        this.goTimeTTF.string   = this._daojishiNum;
        this.stopTime();
        this._goTimeID = setInterval(function () {
            this._daojishiNum  --;
            if(this._daojishiNum<0){
                this.stopTime();
                cc.log('金币场 倒计时结束');
                this.sendLeave();

            }else {
                this.goTimeTTF.string   = this._daojishiNum;
                this.goTimeTTF_1.string = this._daojishiNum
            }
        }.bind(this), 1000);
    },

    /**
     * 停止倒计时
     */
    stopTime: function() {
        clearInterval(this._goTimeID);
    },

    /**
     * 发送离开房间
     */
    sendLeave: function() {
        cc.log('发送离开 1');
        // 取消匹配状态
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomId );

        msg.setGameInfo( gameInfoPB );

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req,msg,"msg_leave_game_req", true);
    },

    closeJieSuan: function() {
        this.close();
    },

    /**
     *
     */
    sendReady: function() {
        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType( RoomMgr.Instance().gameId );
        gameInfoPB.setRoomId( RoomMgr.Instance().roomLv  );

        pbData.setGameInfo( gameInfoPB );

        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req,pbData,"msg_prepare_game_req", true);

        this.clearDesktop();
        playerMgr.Instance().clear();
        this.closeJieSuan();
    },

    /**
     * 发送换桌协议
     */
    sendReplaceDesktop: function() {


        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType( RoomMgr.Instance().gameId );
        pbData.setRoomCoinId( RoomMgr.Instance().roomId );

        cc.gateNet.Instance().sendMsg( cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true );

        this.clearDesktop();
        playerMgr.Instance().clear();
        this.closeJieSuan();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
