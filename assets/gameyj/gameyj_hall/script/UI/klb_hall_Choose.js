cc.Class({
    extends: cc.Component,

    properties: {
        playersNode: [cc.Node],    //玩家集合
    },

    // use this for initialization
    onLoad: function () {
    },

    onDestroy: function () {

    },

    onCloseUICallBack: function () {
        var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
        ani.off('stop', this.onCloseUICallBack, this);
        this.node.active = false;
    },

    /**
     * 关闭选座界面
     */
    onCloseCooseUI: function () {
        var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
        ani.play('klb_hall_closeChooseSeat');
        ani.on('stop', this.onCloseUICallBack, this);
    },

    /**
     * 检查座位上是否有人
     */
    checkSeatPlayer: function (seat) {
        if (!this.chosseData) return false;
        for (var i = 0; i < this.chosseData.length; ++i) {
            var player = this.chosseData[i];
            if (player && player.seat == seat) {
                return true;
            }
        }
        return false;
    },


    /**
     * 选择座位点击事件
     */
    onCooseSeat: function (event, data) {
        var seat = parseInt(data);
        if (seat >= 0 && this.chosseData) {
            if (this.checkSeatPlayer(seat))
                return;
            var enter_game_req = new cc.pb.room_mgr.msg_enter_game_req();
            var game_info = new cc.pb.room_mgr.common_game_header();
            game_info.setRoomId(this.chosseData.roomId);
            enter_game_req.setGameInfo(game_info);
            enter_game_req.setSeat(seat);
            if (cc.sys.isNative) {
                if (cc.sys.OS_ANDROID == cc.sys.os) {
                    var loc = new cc.pb.room_mgr.latlng();
                    var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                    var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                    loc.setLatitude(latitude);
                    loc.setLongitude(longitude);
                    cc.log("详细地址：经度 " + longitude);
                    cc.log("详细地址：纬度 " + latitude);
                    if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                        enter_game_req.setLatlngInfo(loc);
                    }
                } else if (cc.sys.OS_IOS == cc.sys.os) {
                    var loc = new cc.pb.room_mgr.latlng();
                    var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                    var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                    loc.setLatitude(Latitude);
                    loc.setLongitude(Longitude);
                    cc.log("详细地址：经度 " + Longitude);
                    cc.log("详细地址：纬度 " + Latitude);
                    if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                        enter_game_req.setLatlngInfo(loc);
                    }
                }
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, enter_game_req, 'cmd_msg_enter_game_req', true);
        }
    },

    /**
     * 显示界面
     */
    showChooseUI: function (data) {
        this.chosseData = data[0];
        this.node.active = true;
        var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
        if (ani) {
            ani.play('klb_hall_ChooseSeat');
            //ani.on('stop', this.onShowUICallBack, this);
            this.resetUI();
            this.showPlayerInfo();
        }
    },

    /**
     * 显示回调
     */
    onShowUICallBack: function () {
        var ani = this.node.getChildByName('actionnode').getComponent(cc.Animation);
        ani.off('stop', this.onShowUICallBack, this);

    },

    resetUI: function () {
        for (var i = 0; i < this.playersNode.length; ++i) {
            var palyer = this.playersNode[i];
            if (palyer) {
                cc.find('headNode', palyer).active = false;;
                cc.find('btn', palyer).active = true;
                cc.find('name', palyer).getComponent(cc.Label).string = '';
            }
        }
    },

    /**
     * 玩家信息
     */
    showPlayerInfo: function () {
        if (!this.chosseData || !this.playersNode)
            return;
        var palysers = this.chosseData.roleListList;
        if (!palysers) return;
        for (var i = 0; i < palysers.length; ++i) {
            var player = palysers[i];
            if (!player) continue;
            var item = this.playersNode[player.seat];
            this.playerItem(item, player);
        }
    },

    playerItem: function (item, data) {
        if (!item) return;
        cc.find('headNode', item).active = true;
        var head = cc.find('headNode/headSp', item).getComponent(cc.Sprite);
        cc.log('玩家头像 :', data.headUrl);
        if (head && data.headUrl) {
            cc.dd.SysTools.loadWxheadH5(head, data.headUrl);
        }
        cc.find('btn', item).active = false;
        cc.find('name', item).getComponent(cc.Label).string = cc.dd.Utils.substr(data.name, 0, 4);
        //cc.find('btn',item).getComponent(cc.Button).interactable = false;
    },

});
