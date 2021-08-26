var dd = cc.dd;
var PlayerED = require("jlmj_player_data").PlayerED;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;
var PlayerMgr = require('jlmj_player_mgr');
var RoomED = require( "jlmj_room_mgr" ).RoomED;
var RoomEvent = require( "jlmj_room_mgr" ).RoomEvent;
var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr;
var DeskData = require('jlmj_desk_data').DeskData;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var jlmj_util = require('jlmj_util');

var userList = cc.Class({
    extends: cc.Component,

    properties: {
        player_ui_arr: { default: [], type: [require('jlmj_player_base_ui')], tooltip:"玩家ui"},
    },

    ctor: function () {

    },

    onLoad: function onLoad() {
        this.waitRefresh = null

        this.initUI();
        PlayerED.addObserver(this);
        RoomED.addObserver(this);
        DeskED.addObserver(this);
        this.schedule(this.sendLocationInfo, 30);//发送位置信息

    },

    onDestroy: function () {
        if(this.waitRefresh != null){
            clearTimeout(this.waitRefresh);
            this.waitRefresh = null;
        }

        PlayerED.removeObserver(this);
        RoomED.removeObserver(this);
        DeskED.removeObserver(this);
        this.unschedule(this.sendLocationInfo, this);
    },

    //更新经纬度
    sendLocationInfo: function() {
        var pbData = new cc.pb.room_mgr.msg_player_location_req();
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                var adress;
                if(typeof(latitude) != 'undefined' && typeof(longitude) != 'undefined')
                    adress = jsb.reflection.callStaticMethod('game/SystemTool', "getAdress", "()Ljava/lang/String;");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                cc.log("详细地址：位置 " + adress);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);

            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                var adress = jsb.reflection.callStaticMethod('SystemTool', "getAdress");
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                cc.log("详细地址：位置 " + adress);
                if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            }
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_player_location_req, pbData, 'msg_player_location_req', true);
    },

    initUI: function () {
        PlayerMgr.Instance().playerList.forEach(function(player){
            if(player){
                this.playerEnter(player);
            }
        },this);
    },

    playerEnter: function (player) {
        if(RoomMgr.Instance()._Rule){
            this.player_ui_arr[player.viewIdx].initUI(player);
            if(RoomMgr.Instance()._Rule.usercountlimit == 2){
                this.player_ui_arr[1].node.active = false;
                this.player_ui_arr[3].node.active = false;

                this.player_ui_arr[1].head.node.active = false;
                this.player_ui_arr[3].head.node.active = false;
            }
            if(RoomMgr.Instance()._Rule.usercountlimit == 3){
                var view_idx = PlayerMgr.Instance().get3RenMjNoExistViewIdx();
                cc.log('三人,剩下座位=',view_idx);
                this.player_ui_arr[view_idx].node.active = false;
                this.player_ui_arr[view_idx].head.node.active = false;
            }
        }

        this.refreshGPSWarn();
    },

    playerExit: function (player) {
        this.player_ui_arr[player.viewIdx].head.node.active = false;

        DeskData.Instance().closePopTips();
        if( DeskData.Instance().isFriend() ) {
            if( player.userId === cc.dd.user.id ) {
                jlmj_util.enterHall();
            }else{
                if( RoomMgr.Instance().isRoomer( player.userId ) ) {
                    cc.dd.DialogBoxUtil.show(0, "房主已解散房间，请重新加入房间", '确定', null, function () {
                        // 返回大厅
                        jlmj_util.enterHall();
                    }, function () {
                    });
                }
            }
        } else if( RoomMgr.Instance().gameId == cc.dd.Define.GameType.JLMJ_CLUB ) {
            if( player.userId === cc.dd.user.id ) {
                // 返回俱乐部
                jlmj_util.enterHall();
            }
        }

        this.refreshGPSWarn();
    },

    /**
     * 获取玩家头像ui数据
     * @param player
     */
    //废弃
    getUserHeadNode:function (userID) {
        for(var i=0; i< this.player_ui_arr.length; ++i){
            var headinfo = this.player_ui_arr[i];
            if(headinfo && headinfo.head.player && headinfo.head.player.userId == userID){
                return headinfo;
            }
        }
        return null;
    },

    /**
     * 获取list
     * @param player
     */
    getUserList:function () {
      return this.player_ui_arr;
    },

    removeAllPlayer: function() {
        for( var i = 0; i < PlayerMgr.Instance().playerList.length; ++i ) {
            this.player_ui_arr[i].head.node.active = false;
        }
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

    playerNumChanged:function(){
        var num = PlayerMgr.Instance().playerList.length;
        DeskED.notifyEvent(DeskEvent.UPDATE_PLAYER_NUM,num);
        cc.log('更新玩家数量:'+num);
    },

    playerBiaojiBaoPai: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.biaojiBaoPai();
            }
        });
    },

    playerHideModePai: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.hideModepai();
            }
        });
    },

    playerUpdateHeadUI: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.updateHeadUI();
            }
        });
    },

    playerUpdateShouPaiUI: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.updateShouPai();
            }
        });
    },

    playerUpdateUI: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.initUI();
            }
        });
    },

    /**
     * 停止出牌动画
     */
    playerStopChuPaiAni: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.stop_chupai_ani();
            }
        });
    },

    /**
     * 更新指示器
     */
    playerUpdateZsq: function () {
        this.player_ui_arr.forEach(function (player_ui) {
            if(player_ui.node.active){
                player_ui.updateZsq();
            }
        });
    },

    /**
     * 获取距离
     * @param locA
     * @param locB
     * @returns {*}
     */
    getDistance: function(locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        }
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
                    cc.find('img_gps', this.player_ui_arr[playerInfo[i].viewIdx].head.node).active = false;
                    if (playerInfo[i] && playerInfo[i].location) {
                        gpsList.push({ viewIdx: playerInfo[i].viewIdx, location: playerInfo[i].location });
                    }
                }
            }
            for (var i = 0; i < gpsList.length - 1; i++) {
                for (var j = i; j < gpsList.length - 1; j++) {
                    if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
                        cc.find('img_gps', this.player_ui_arr[gpsList[i].viewIdx].head.node).active = true;
                        cc.find('img_gps', this.player_ui_arr[gpsList[j + 1].viewIdx].head.node).active = true;
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
            cc.find('img_gps', player_ui.head.node).active = false;
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
            if(isWeak && !this.player_ui_arr[player.viewIdx].head.lixianNode.active){
                cc.find('weak', this.player_ui_arr[player.viewIdx].head.node).active = isWeak;
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
        var jlmj_prefab = require('jlmj_prefab_cfg');
        var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        if (UI) {
            UI.getComponent('user_info_view').setGpsData(PlayerMgr.Instance().playerList);
        }
    },

    onEventMessage:function (event,data) {
        if(cc.replay_gamedata_scrolling){
            return;
        }
        if(! data || !data instanceof Array){
            return;
        }
        var player = data[0];

        switch (event){
            case PlayerEvent.ENTER:
                this.playerEnter(player);
                this.playerNumChanged();
                break;
            case PlayerEvent.EXIT:
                this.playerExit(player);
                break;
            case RoomEvent.room_recover:
                this.updatePlayerList();
                break;
            case DeskEvent.BIAOJI_BAOPAI:
                this.playerBiaojiBaoPai();
                break;
            case DeskEvent.START:
                this.playerUpdateHeadUI();
                break;
            case RoomEvent.player_signal_state:
                this.on_player_signal_state(data[0]);
                break;
            case RoomEvent.update_player_location:
                this.on_player_location_change(data[0]);
                break;
            default:
                break;
        }
    },

    changePaiUI(){
        this.player_ui_arr.forEach(function (player_ui) {
            player_ui.changePaiConfig();
        });
    },
});

module.exports = userList;