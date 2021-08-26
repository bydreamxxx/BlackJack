var DeskData = require('cfmj_desk_data').DeskData;
var DeskED = require('cfmj_desk_data').DeskED;
var DeskEvent = require('cfmj_desk_data').DeskEvent;

var jlmj_player_list = require( "jlmj_player_list" );
var cfmj_util = require('cfmj_util');

var PlayerMgr = require('cfmj_player_mgr');

var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr;
cc.Class({
    extends: jlmj_player_list,

    properties: {
        player_ui_arr: { default: [], type: [require('cfmj_player_base_ui')], tooltip:"玩家ui 顺序为下右上左", override: true},
    },
    initUI: function () {
        PlayerMgr.Instance().playerList.forEach(function(player){
            if(player){
                this.playerEnter(player);
            }
        },this);
    },

    playerEnter: function (player) {
        if(RoomMgr.Instance()._Rule) {
            this.player_ui_arr[player.viewIdx].initUI(player);
            if (RoomMgr.Instance()._Rule.usercountlimit == 2) {
                this.player_ui_arr[1].node.active = false;
                this.player_ui_arr[3].node.active = false;

                this.player_ui_arr[1].head.node.active = false;
                this.player_ui_arr[3].head.node.active = false;
            }
            if (RoomMgr.Instance()._Rule.usercountlimit == 3) {
                var view_idx = PlayerMgr.Instance().get3RenMjNoExistViewIdx();
                cc.log('三人,剩下座位=', view_idx);
                this.player_ui_arr[view_idx].node.active = false;
                this.player_ui_arr[view_idx].head.node.active = false;
            }
        }
        this.refreshGPSWarn();
    },


    playerExit: function (player) {
        this.player_ui_arr[player.viewIdx].head.node.active = false;
        if(this.player_ui_arr[player.viewIdx].playerLocation){
            this.player_ui_arr[player.viewIdx].playerLocation.active = false;
        }

        DeskData.Instance().closePopTips();
        if( DeskData.Instance().isFriend() ) {
            if( player.userId === cc.dd.user.id ) {
                cfmj_util.enterHall();
            }else{
                if( RoomMgr.Instance().isRoomer( player.userId ) && !RoomMgr.Instance().isDaiKai()) {
                    cc.dd.DialogBoxUtil.show(0, "房主已解散房间，请重新加入房间", '确定', null, function () {
                        // 返回大厅
                        cfmj_util.enterHall();
                    }, function () {
                    });
                }
            }
        } else if( RoomMgr.Instance().gameId == 11 ) {
            if( player.userId === cc.dd.user.id ) {
                // 返回俱乐部
                cfmj_util.enterHall();
            }
        }

        this.refreshGPSWarn();
    },

    removeAllPlayer: function() {
        for( var i = 0; i < PlayerMgr.Instance().playerList.length; ++i ) {
            this.player_ui_arr[i].head.node.active = false;
        }
    },

    playerNumChanged:function(){
        var num = PlayerMgr.Instance().playerList.length;
        DeskED.notifyEvent(DeskEvent.UPDATE_PLAYER_NUM,num);
        cc.log('更新玩家数量:'+num);
    },

    /**
     * 刷新玩家
     * @param playerList
     */
    updatePlayerList: function( playerList ) {
        DeskData.Instance().isGameStart = false;
        this.removeAllPlayer();
        this.initUI();
    },

    /**
     * 更新GPS警报
     */
    refreshGPSWarn: function () {
        if(!DeskData.Instance().isFriend()){
            return;
        }

        if(this.waitRefresh != null){
            return;
        }

        if (RoomMgr.Instance()._Rule.gps) {
            this.waitRefresh = setTimeout(()=>{
                this.waitRefresh = null;
            }, 1000);

            var gpsList = [];
            var playerInfo = PlayerMgr.Instance().playerList;
            cc.log("gps关闭开始");
            for (var i = 0; i < playerInfo.length; i++) {
                if(playerInfo[i]){
                    cc.log("gps开始关闭");
                    cc.find('head_node/img_gps', this.player_ui_arr[playerInfo[i].viewIdx].head.node).active = false;
                    if (playerInfo[i] && playerInfo[i].location) {
                        gpsList.push({ viewIdx: playerInfo[i].viewIdx, location: playerInfo[i].location });
                    }
                }
            }
            for (var i = 0; i < gpsList.length - 1; i++) {
                for (var j = i; j < gpsList.length - 1; j++) {
                    if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
                        // cc.find('head_node/img_gps', this.player_ui_arr[gpsList[i].viewIdx].head.node).active = true;
                        // cc.find('head_node/img_gps', this.player_ui_arr[gpsList[j + 1].viewIdx].head.node).active = true;
                    }
                }
            }
        }
    },

    /**
     * 关闭GPS
     */
    closeGPSWarn: function () {
        if(!DeskData.Instance().isFriend()){
            return;
        }
        this.player_ui_arr.forEach(function (player_ui) {
            cc.find('head_node/img_gps', player_ui.head.node).active = false;
        });
    },

    /**
     * 更新玩家出牌时头像转圈动画
     */
    updatePlayerCdAni: function () {
        PlayerMgr.Instance().playerList.forEach(function (player) {
            if(player){
                if(player.hasMoPai()){
                    var maxCD = 30;
                    if(DeskData.Instance().isJBC()){
                        maxCD = 15;
                    }
                    this.player_ui_arr[player.viewIdx].head.play_chupai_ani(maxCD,player.dapaiCD);
                }else{
                    this.player_ui_arr[player.viewIdx].head.stop_chupai_ani();
                }
            }
        }.bind(this));
    },

    /**
     * 玩家信号状态更新
     * @param msg
     */
    on_player_signal_state: function(msg) {
        var userId = msg.userId;
        var isWeak = msg.isWeak;
        var player = PlayerMgr.Instance().getPlayer(userId);
        if(player){
            if(isWeak && !this.player_ui_arr[player.viewIdx].head.lixianNode.active) {
                cc.find('head_node/weak', this.player_ui_arr[player.viewIdx].head.node).active = isWeak;
            }
        }
    },

    //位置更新
    on_player_location_change: function(msg) {
        if(!DeskData.Instance().isFriend()){
            return;
        }
        var userId = msg.userId;
        var latlngInfo = msg.latlngInfo;
        let address = msg.address;
        var player = PlayerMgr.Instance().getPlayer(userId);
        if (player) {
            if(latlngInfo && cc.dd._.isNumber(latlngInfo.latitude) && cc.dd._.isNumber(latlngInfo.longitude)){//如果latlngInfo不为null，更新location
                player.location = latlngInfo;
            }else{
                if(!player.oldlocation){//如果latlngInfo和oldlocation都为null，表示玩家可能关了GPS，可以更新location
                    player.location = latlngInfo;
                }//如果latlngInfo为null而oldlocation不为null，表示可能暂时没有获取的位置，先不更新location
            }
            if(address){
                player.address = address;
            }
            player.oldlocation = latlngInfo;
        }
        this.refreshGPSWarn();
        var jlmj_prefab = require('nmmj_prefab_cfg');
        var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        if (UI) {
            UI.getComponent('user_info_view').setGpsData(PlayerMgr.Instance().playerList);
        }
        var gps = cc.dd.UIMgr.getUI(jlmj_prefab.NMMJ_GPS);
        if (gps) {
            gps.getComponent('jlmj_gps').setGpsData(PlayerMgr.Instance().playerList);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},

    changePaiUI(){
        this.player_ui_arr.forEach(function (player_ui) {
            player_ui.changePaiConfig();
        });
    },
});
