//create by wj 2019/04/17
var game_room_list = require('game_room');
var klb_game_list_config = require('klb_gameList');
var yq_config = require('yq_pin3');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hallData = require('hall_common_data').HallCommonData;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');
var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollNode: cc.Node,    //总共场数的列表节点
        contentNode: cc.Node,
        spaceY: 5,
        spaceX: 50,
        spaceHeight: 380,
        itemHeight: 102,
        itemWidth: 1258,
        itemList: [],
        configRoomList: [],
        titleSp: cc.Label,
        game_name: '',
        game_id: '',
        fudaiShineNode: cc.Node,
        taskTip: cc.Node,
        activeTip: cc.Node,
        m_oNationalDayIcon: cc.Node,
        ksbtncc: cc.Node,
        m_tBaseText: {default: [], type: cc.Label},
        m_tLimitEnterTxt: {default: [], type: cc.Label},
        m_tLimitLeaveTxt: {default: [], type: cc.Label},
        m_tRuleTxt: {default: [], type: cc.Label},
        m_nRoomIndex: 0,
    },

    onLoad () {
        RoomED.addObserver(this);
        var content = cc.dd.Utils.seekNodeByName(this.scrollNode, 'content');
        this.start_y = content.y;
        this.move_y = content.y;

        this.scrollNode.on('scroll-ended', this.onScrollEnded.bind(this), this);
        this.onClickUpdateRoomList(null, null);
        this.setUserInfo(hallData.getInstance());

    },

    onDestroy: function () {
        RoomED.removeObserver(this);
    },

    /**
     * 初始化随机房间界面
     */
    initRoomUI: function(data){
        this.configRoomList.splice(0, this.configRoomList.length);
        klb_game_list_config.items.forEach(function (gameItem) {
            if (gameItem.gameid == data.hallGameid) {
                this.titleSp.string = gameItem.name;
                this.game_name = gameItem.name;
                this.game_id = gameItem.gameid;
            }
        }.bind(this));
        var self = this;
        for(var i = 0; i < data.roomlistList.length; i++){
            var dataInfo = data.roomlistList[i];
            if(dataInfo){
                var gameData = game_room_list.getItem(function(item){
                    if(item.roomid == dataInfo.fangjianid && self.game_id == item.gameid)
                        return item;
                });
                this.m_tBaseText[i].node.parent.parent.getComponent('new_dsz_roomItem').setCoinData(dataInfo, data.hallGameid);

                this.m_tBaseText[i].string = gameData.basescore; //设置底注
                var itemdata = yq_config.getItem(function(info){
                    if(info.key == gameData.key)
                        return info;
                });

                this.m_tLimitEnterTxt[i].string = this.convertChipNum(itemdata.add_limit);//进入限制
                this.m_tLimitLeaveTxt[i].string = this.convertChipNum(itemdata.leave_limit);//进入限制

                this.m_tRuleTxt[i].string = this.analysisRule(itemdata.play_type, itemdata.play_rule);//规则
                this.configRoomList.push(gameData);
            }
        }
    },

    /**
     * 解析游戏规则
     */
    analysisRule: function(playModel, playRuleList){
        var ruleStr = playModel == 1 ? '标准模式' : '大牌模式(无2-8)';
        var playRule = playRuleList.split(',');
        if(playRule.length > 0){
            playRule.forEach(function(rule){
                switch(parseInt(rule)){
                    case 1:
                        ruleStr += '/必闷三轮'
                        break;
                    case 2:
                        ruleStr += '/癞子玩法'
                        break;
                    case 3:
                        ruleStr += '/双倍比牌'
                        break;
                    case 4:
                        ruleStr += '/亮底牌'
                        break;
                }
            });
        }
        return ruleStr;
    },

    /**
     * 设置自建房
     */
    initCreateRoomList: function(data){
        if(data.index == 1){
            for (var i in this.itemList) {
                this.itemList[i].removeFromParent();
                this.itemList[i].destroy();
            }
            this.itemList.splice(0, this.itemList.length);
            this.contentNode.removeAllChildren(true);
        }
        if(data.roomListList.length != 0)
            this.m_nRoomIndex = data.index;

        cc.dd.ResLoader.loadPrefab("blackjack_teenpatti/common/prefab/new_dsz_roomItem", function (prefab) {
            //房间列表
            for (var i = 0; i < data.roomListList.length; i++) {
                var dataInfo = data.roomListList[i];
                if (dataInfo) {
                    var item = cc.instantiate(prefab);
                    this.itemList.push(item);
                    item.parent = this.contentNode;
                    item.getComponent('new_dsz_roomItem').setData(dataInfo);
                }
            }
            this.contentNode.parent.height = this.itemHeight * (this.itemList.length - 1) + this.itemHeight / 2 + this.spaceHeight;
        }.bind(this));

    },

    onScrollEnded: function(){
        var content = cc.dd.Utils.seekNodeByName(this.scrollNode, "content")
        var isDwon = content.y > this.move_y;
        var cnt = this.itemList.length;
        var offset = cnt *this.itemHeight+(cnt + 1)*this.spaceY - this.scrollNode.getContentSize().height;

        if(isDwon){
            var moveOffsetY = content.y - this.start_y;
            if(moveOffsetY >= offset){
                this.move_y = content.y
                this.loadScrollRecode();
            }
        }
    },

    loadScrollRecode: function(){
        var msg = new cc.pb.room_mgr.msg_get_room_self_build_req();
        msg.setGameType(37);
        msg.setIndex(this.m_nRoomIndex + 1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_get_room_self_build_req, msg, "msg_get_room_self_build_req", true);

    },

    onClickUpdateRoomList: function(event, data){
        var msg = new cc.pb.room_mgr.msg_get_room_self_build_req();
        msg.setGameType(37);
        msg.setIndex(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_get_room_self_build_req, msg, "msg_get_room_self_build_req", true);

    },

    /**
     * 创建房间
     */
    onCreateCoinRoom: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('blackjack_teenpatti/common/prefab/jbc_create_room', function (prefab) {
        });
    },


    //关闭界面
    closeUICallBack: function () {
        hall_audio_mgr.com_btn_click();

        this.node.removeFromParent();
        this.onDestroy();
        var scene = cc.director.getScene();
        if(!cc._useChifengUI || cc.game_pid == 10006){
            scene.getChildByName('Canvas').getComponent('klb_hallScene').updateActiveTip();
        }
    },

    /**
     * 打开规则界面
     */
    openSelectGameRule: function() {
        var self = this;
        var gameData = klb_game_list_config.getItem(function(item) {
            if (item.gameid == self.game_id)
                return item;
        })

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function(ui) {
            var itemData = {
                _game_id: gameData.gameid,
            }
            var cpt = ui.getComponent('klb_hall_Rule');
            cpt.clickTagCallBack(itemData);
            //cpt.InitGameList();

        }.bind(this));
    },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        var userinfo = this.node.getComponentInChildren('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    //快速开始
    onClickKSRoom: function () {
        var coin = HallPropData.getCoin();
        var entermin = 0;
        for (var i = 0; i < this.itemList.length ; i++) {
            var roomData = this.itemList[i].getComponent('new_dsz_roomItem');
            if(roomData.checkCanQuickEnter()){
                if ((coin >= roomData.m_nEnterLimit)) {
                    this.sendDSZEnterMsg(37, roomData.m_nRoomId);
                    return;
                } 
            }
        }
        cc.dd.UIMgr.openUI('blackjack_teenpatti/common/prefab/new_dsz_dialogBox', function (prefab) {
            var cpt = prefab.getComponent('new_dsz_dialog_box');
            if(cpt)
                cpt.show(0, "没有可加入的房间", 'text33', null, function () {
                }, function () {
            });
        });
    },

    //加入金币场房间
    sendDSZEnterMsg: function (gameid, roomId) {
        var msg = new cc.pb.room_mgr.msg_enter_game_req();
        var game_info = new cc.pb.room_mgr.common_game_header();
        game_info.setRoomId(roomId);
        msg.setGameInfo(game_info);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_game_req, msg, 'cmd_msg_enter_game_req',true);
    },

    //转换筹码字
    convertChipNum: function(num){
        var str = num;
        if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(0) + '万';
        }else if(num >= 100000000)
            str = Math.ceil(num / 100000000).toFixed(1) + '亿';
        return str 
    },

    onEventMessage: function (event, data) {
        switch(event){
            case RoomEvent.room_create_by_self:
                if(this.m_nRoomIndex != 0)
                    cc.dd.PromptBoxUtil.show('刷新房间列表成功');
                this.initCreateRoomList(data);
                break;
        }
    },
});
