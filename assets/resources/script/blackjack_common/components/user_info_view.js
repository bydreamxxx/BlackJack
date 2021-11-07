var playerExp = require('playerExp');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var ChatEd = require('jlmj_chat_data').ChatEd;
var hall_prefab = require('hall_prefab_cfg');
var RoomMgr = require("jlmj_room_mgr").RoomMgr;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
const game_List = require('klb_gameList');

cc.Class({
    extends: cc.Component,

    properties: {
        userId: 0,
        gameType: 0,
        roomId: 0,
        roomLv: 0,
        isFriend: true,
        btn_MagicProp: [],
        btn_MagicPropSum: [],
    },

    onLoad: function () {
        this.lab_name = cc.find('bg/name', this.node).getComponent(cc.Label);
        this.lab_coin = cc.find('bg/coinBG/coin', this.node).getComponent(cc.Label);
        this.lab_level = cc.find('bg/level', this.node).getComponent(cc.Label);
        this.lab_exp = cc.find('bg/exp', this.node).getComponent(cc.Label);
        this.lab_vip = cc.find('bg/vip', this.node).getComponent(cc.Label);
        this.btn_vip = cc.find('bg/vip_btn', this.node).getComponent(cc.Button);
        this.lab_win = cc.find('bg/battle/win', this.node).getComponent(cc.Label);
        this.lab_total = cc.find('bg/battle/total', this.node).getComponent(cc.Label);
        this.lab_rate = cc.find('bg/battle/rate', this.node).getComponent(cc.Label);
        this.lab_id = cc.find('bg/id', this.node).getComponent(cc.Label);
        this.spr_head = cc.find('bg/head_mask/head', this.node).getComponent(cc.Sprite);
        this.gold_node = cc.find('bg/coinBG/gold', this.node);
        this.silver_node = cc.find('bg/coinBG/silver', this.node);
        this.btn_tiren = cc.find('bg/btn-tiren', this.node);
        this.lab_adress = cc.find('bg/adress', this.node);
        this.coinBG = cc.find('bg/coinBG', this.node);

        this.copyBtnNode = cc.find('bg/copyButton', this.node);

        this.id2Item = [1007, 1008, 1036, 1037, 1038, 1020, 1021, 1022, 1023, 1024, 1025, 1039, 1040, 1041, 1042, 1043];

        var self = this;
        for (var i = 0; i < this.id2Item.length; i++) {
            this.btn_MagicProp[i] = cc.find('scrollView/view/content/biaoqiang_' + i, this.node).getComponent(cc.Button);
            this.btn_MagicProp[i].node.tagname = i;
            this.btn_MagicProp[i].node.on('click', function () {
                //发送魔法表情
                if (self.userId == cc.dd.user.id) {
                    cc.log('不能对自己使用道具！');
                    return;
                }
                const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
                var dataINfo = hall_prop_data.getItemInfoByDataId(self.id2Item[this.tagname]);
                if (dataINfo == undefined || dataINfo.count < 1) {
                    cc.log('道具数量不足!');
                    cc.dd.PromptBoxUtil.show('道具数量不足! 可以通过金币兑换。');
                    return;
                }

                var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
                var chatInfo = new cc.pb.room_mgr.chat_info();
                var gameInfo = new cc.pb.room_mgr.common_game_header();
                gameInfo.setGameType(self.gameType);
                gameInfo.setRoomId(self.roomId);
                chatInfo.setGameInfo(gameInfo);
                chatInfo.setMsgType(3);
                chatInfo.setId(self.id2Item[this.tagname]);
                chatInfo.setToUserId(self.userId);
                pbObj.setChatInfo(chatInfo);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

                //玩家自己的做成单机,避免聊天按钮开关bug
                var chat_msg = {};
                chat_msg.msgtype = 3;
                chat_msg.id = self.id2Item[this.tagname];
                chat_msg.toUserId = self.userId;
                chat_msg.sendUserId = cc.dd.user.id;
                ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
                // cc.find('user_info', this.node).active = false;
                self.node.active = false;
            })
        }
        for (var i = 0; i < this.id2Item.length; i++) {
            this.btn_MagicPropSum[i] = cc.find('scrollView/view/content/biaoqiang_' + i + '/sum', this.node).getComponent(cc.Label);
        }
        RoomED.addObserver(this);
    },

    onDestroy() {
        RoomED.removeObserver(this);
    },

    setData: function (gameId, roomId, roomLv, isFriend, data) {
        this.gameType = gameId;
        this.roomId = roomId;
        this.roomLv = roomLv;
        this.isFriend = isFriend;
        this.lab_name.string = cc.dd.Utils.subChineseStr(data.name, 0, 14);//cc.dd.Utils.substr(data.name, 0, 4);
        this.lab_coin.string = data.coin;
        // this.lab_level.string = 'Lv.' + data.level;

        // var expItem = playerExp.getItem(function (item) { return item.key == data.level; });
        // this.lab_exp.string = '(' + data.exp.toString() + '/' + expItem.exp.toString() + ')';
        // this.lab_exp.string = '';

        // this.lab_vip.string = data.vipLevel;
        this.lab_win.string = data.winTimes;
        this.lab_total.string = data.totalTimes;

        if (data.totalTimes == 0) {
            this.lab_rate.string = "0%";
        }
        else {
            var div = data.winTimes / data.totalTimes;
            var rate = Math.round(div * 10000) / 100;
            this.lab_rate.string = rate.toString() + '%';
        }

        let gameConfig = game_List.getItem(function (item) {
            return item.gameid == this.gameType;
        }.bind(this));

        if (gameConfig) {
            if (gameConfig.isfriend == 1) {
                this.lab_id.string = data.userId;
                if (this.copyBtnNode) {
                    this.copyBtnNode.active = true;
                }
            } else {
                if (data.userId == cc.dd.user.id) {
                    this.lab_id.string = data.userId;
                } else {
                    this.lab_id.string = '';
                }
                if (this.copyBtnNode) {
                    this.copyBtnNode.active = data.userId == cc.dd.user.id;
                }
            }
        } else {
            if (data.userId == cc.dd.user.id) {
                this.lab_id.string = data.userId;
            } else {
                this.lab_id.string = '';
            }
            if (this.copyBtnNode) {
                this.copyBtnNode.active = data.userId == cc.dd.user.id;
            }
        }
        this.userId = data.userId;
        this.location = data.location;
        this.spr_head.spriteFrame = null;
        // if(data.address){
        //     this.lab_adress.active = RoomMgr.Instance()._Rule.gps;
        //     this.lab_adress.getComponent(cc.Label).string = data.address;
        // }
        // var self = this;
        cc.dd.SysTools.loadWxheadH5(this.spr_head, data.headUrl);

        this.updateItemSum();

        if (this.gameType == 108 || this.gameType == 150) {
            this.silver_node.active = true;
            this.gold_node.active = false;
        }
        else {
            this.silver_node.active = false;
            this.gold_node.active = true;
        }

        // this.lab_coin.node.active = false;
        this.lab_level.node.active = false;
        this.lab_exp.node.active = false;
        this.lab_vip.node.active = false;
        this.btn_vip.node.active = false;
        // this.gold_node.active = false;
        // this.silver_node.active = false;
        this.lab_adress.active = false;
    },

    setGpsData: function (playerList) {
        cc.find('bg/battle', this.node).active = false;
        // this.lab_coin.node.active = false;
        // this.gold_node.active = false;
        // this.silver_node.active = false;
        this.coinBG.active = false;

        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i] && this.userId == playerList[i].userId) {
                this.location = playerList[i].location;
                break;
            }
        }
        if (!cc.dd._.isUndefined(this.location) && !cc.dd._.isNull(this.location)) {
            if (!this.location.hasOwnProperty('latitude') || !this.location.hasOwnProperty('longitude')) {
                this.location = null;
            }
        }
        if (!this.location || !RoomMgr.Instance()._Rule || !RoomMgr.Instance()._Rule.gps || !RoomMgr.Instance().player_mgr.getPlayerList()) {
            cc.find('bg/gps/mask/content', this.node).active = false;
            cc.find('bg/gps/no_gps', this.node).active = true;
        }
        else {
            cc.find('bg/gps/mask/content', this.node).removeAllChildren(true);
            var item = cc.find('bg/gps/item', this.node);
            for (var i = 0; i < playerList.length; i++) {
                if (playerList[i] && playerList[i].userId != this.userId) {
                    var node = cc.instantiate(item);
                    var spr_head = node.getChildByName('head').getComponent(cc.Sprite);
                    var lbl = node.getChildByName('lbl').getComponent(cc.Label);
                    var headUrl = playerList[i].headUrl;
                    var name = playerList[i].name;
                    var location = playerList[i].location;
                    cc.dd.SysTools.loadWxheadH5(spr_head, headUrl);//朋友场没有机器人  不用处理机器人头像
                    var str = '';
                    var color = cc.color(0, 0, 0);
                    if (this.checkLocation(location) && this.checkLocation(this.location)) {
                        var distance = parseInt(this.getDistance(this.location, location));
                        if (distance < 100) {
                            color = cc.color(192, 0, 0);
                        }
                        else {
                            color = cc.color(237, 93, 27);
                        }
                        str = '距[{0}]\n{1}米'.format(cc.dd.Utils.substr(name, 0, 4), distance);
                    }
                    else {
                        str = '[{0}]\n无GPS信号'.format(cc.dd.Utils.substr(name, 0, 4));
                        color = cc.color(192, 0, 0);
                    }
                    lbl.string = str;
                    lbl.node.color = color;
                    node.active = true;
                    cc.find('bg/gps/mask/content', this.node).addChild(node);
                    node.x = 0;
                }
            }
            cc.find('bg/gps/no_gps', this.node).active = false;
            cc.find('bg/gps/mask/content', this.node).active = true;
        }
        cc.find('bg/gps', this.node).active = true;
    },

    checkLocation(location) {
        return location && cc.dd._.isNumber(location.latitude) && cc.dd._.isNumber(location.longitude) && (location.latitude != 0 || location.longitude != 0);
    },

    getDistance: function (locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离userInfo:++++++' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离userInfo:++++++' + distance);
            return distance;
        }
    },

    show: function () {
        this.node.active = true;
    },

    updateItemSum: function () {
        for (var j = 0; j < this.id2Item.length; j++) {
            this.btn_MagicPropSum[j].string = "X0";
            //this.btn_MagicProp[j].node.zIndex = 0;
        }
        const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
        for (var i = 0; i < hall_prop_data.propList.length; i++) {
            var data = hall_prop_data.propList[i];
            for (var j = 0; j < this.id2Item.length; j++) {
                if (data.dataId == this.id2Item[j]) {
                    this.btn_MagicPropSum[j].string = 'X' + data.count;
                    //this.btn_MagicProp[j].node.zIndex = data.count;
                }
            }
        }
    },

    /**
     * 刷新整个UI
     */
    updateUI: function (player) {
        this.gameType = RoomMgr.Instance().gameId;
        this.roomId = RoomMgr.Instance().roomId;
        this.roomLv = RoomMgr.Instance().roomLv;
        this.isFriend = RoomMgr.Instance().roomType == 1;
        this.lab_name.string = cc.dd.Utils.subChineseStr(player.name, 0, 14); //cc.dd.Utils.substr(player.name, 0, 4);
        if (this.lab_coin)
            this.lab_coin.string = player.coin;
        // this.lab_level.string = 'Lv.' + player.level;

        // var expItem = playerExp.getItem(function (item) { return item.key == player.level; });
        // this.lab_exp.string = '(' + player.exp.toString() + '/' + expItem.exp.toString() + ')';
        // this.lab_exp.string = '';

        // this.lab_vip.string = player.vipLevel;
        this.lab_win.string = player.winTimes;
        this.lab_total.string = player.totalTimes;

        if (player.totalTimes == 0) {
            this.lab_rate.string = "0%";
        }
        else {
            var div = player.winTimes / player.totalTimes;
            var rate = Math.round(div * 10000) / 100;
            this.lab_rate.string = rate.toString() + '%';
        }

        let gameConfig = game_List.getItem(function (item) {
            return item.gameid == this.gameType;
        }.bind(this));

        if (gameConfig) {
            if (gameConfig.isfriend == 1) {
                this.lab_id.string = 'ID.' + player.userId;
                if (this.copyBtnNode) {
                    this.copyBtnNode.active = true;
                }
            } else {
                if (player.userId == cc.dd.user.id) {
                    this.lab_id.string = 'ID.' + player.userId;
                } else {
                    this.lab_id.string = '';
                }
                if (this.copyBtnNode) {
                    this.copyBtnNode.active = player.userId == cc.dd.user.id;
                }
            }
        } else {
            if (player.userId == cc.dd.user.id) {
                this.lab_id.string = 'ID.' + player.userId;
            } else {
                this.lab_id.string = '';
            }
            if (this.copyBtnNode) {
                this.copyBtnNode.active = player.userId == cc.dd.user.id;
            }
        }
        this.userId = player.userId;
        this.location = player.location;
        this.spr_head.spriteFrame = null;
        var self = this;
        cc.dd.SysTools.loadWxheadH5(this.spr_head, player.headUrl);

        this.updateItemSum();

        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps && RoomMgr.Instance().player_mgr.getPlayerList()) {
            this.setGpsData(RoomMgr.Instance().player_mgr.getPlayerList());
        }

        if (this.gameType == 108 || this.gameType == 150) {
            this.silver_node.active = true;
            this.gold_node.active = false;
            this.lab_coin.string = player.score.toString();
        }
        else {
            this.silver_node.active = false;
            this.gold_node.active = true;
        }

        // this.lab_coin.node.active = false;
        this.lab_level.node.active = false;
        this.lab_exp.node.active = false;
        this.lab_vip.node.active = false;
        this.btn_vip.node.active = false;
        // this.gold_node.active = false;
        // this.silver_node.active = false;
        this.lab_adress.active = false;
    },

    /**
     * 刷新ui 是否显示魔法表情
     * @param {*} player 
     * @param {*} show 
     */
    updateUIWithMagic(player, show) {
        show = show || false;
        this.updateUI(player);
        cc.find('scrollView', this.node).active = show;
    },
    /**
     * 点击vip介绍
     */
    onClickVipBtn: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
            prefab.getComponent('klb_hall_daily_activeUI').showUI(4);
        });
    },

    onClickClose: function () {
        this.node.removeFromParent();
    },

    onEventMessage(event, data) {
        switch (event) {
            case RoomEvent.update_player_location:
                if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps && RoomMgr.Instance().player_mgr.getPlayerList())
                    this.setGpsData(RoomMgr.Instance().player_mgr.getPlayerList());
                break;
        }
    },

    onClickCopy() {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.userId);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    //显示踢人
    showKickBtns(show) {
        this.btn_tiren.active = show
    },
    //踢人回调
    onClickKick() {

    },
});
