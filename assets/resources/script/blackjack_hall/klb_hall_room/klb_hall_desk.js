
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const hallGameList = require("klb_hall_GameList").HallGameList.Instance();
let GAME_ITME_TYPE = require("klb_hall_GameItem").GameType;
const klb_game_Confg = require('klb_gameList');
const Hall = require('jlmj_halldata');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var game_room_list = require('game_room');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');
var hallData = require('hall_common_data').HallCommonData;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var klb_game_list_config = require('klb_gameList');
var HallCommonData = require("hall_common_data").HallCommonData;

const MAX_DESK = 32;
const TABLE_TYPE = {
    THREE: 0,
    FOUR: 1,
    BIG_FIVE: 2,
    BIG_NINE: 3,
    BIG_ELEVEN: 4,
    HUNDRED: 5,
    SIX: 6,
    SINGLE: 7,
    TWO: 8,
}

cc.Class({
    extends: cc.Component,

    properties: {
        oneItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "一人桌子(财神)"
        },

        twoItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "二人桌桌子(麻将)"
        },

        threeItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "三人桌(斗地主)"
        },
        fourItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "四人桌"
        },

        fiveItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "五人桌"
        },
        nineItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "九人桌(德州)"
        },

        leftArrow: {
            default: null,
            type: cc.Node,
            tooltip: "左箭头"
        },
        rightArrow: {
            default: null,
            type: cc.Node,
            tooltip: "右箭头"
        },

        deskAtlas: cc.SpriteAtlas,

        gameListContent: cc.Node,
        gamelistItem: cc.Node,


        deskContent: cc.Node,
        deskScrollView: cc.ScrollView,

        downNode: cc.Node,
        downBtns: [cc.Node],
        downBtnEmptyNode: cc.Node,

        userinfoNode: cc.Node,
        passToggle: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        RoomMgr.Instance().clearAllData();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosX = 0;
        this.itemList = [];
        this.toggleList = [];
        this.m_nCountIndex = 1;
        this.m_nMoveInitX = this.deskContent.x;
        this.move_x = this.deskContent.x;
        var fastJson = cc.sys.localStorage.getItem('HALL_DESK_PASSWORD');
        if (fastJson && fastJson != '') {
            RoomMgr.Instance().m_deskPass = fastJson
            this.passToggle.isChecked = true;
        } else {
            this.passToggle.isChecked = false;
        }
        if (this.leftArrow)
            this.leftArrow.active = false;

        if (this.rightArrow)
            this.rightArrow.active = true;
        Hall.HallED.addObserver(this);
        RoomED.addObserver(this);
        this.loadGame();
        this.deskScrollView.node.on('scroll-ended', this.onScrollEnded.bind(this), this);

    },
    scrollEvent: function (sender, event) {
        switch (event) {
            case 0:
                // cc.error("Scroll to Top");
                break;
            case 1:
                // cc.error("Scroll to Bottom");
                break;
            case 2:
                // cc.error("Scroll to Left");
                this.leftEnd = true;
                break;
            case 3:
                // cc.error("Scroll to Right");
                this.rightEnd = true;
                break;
            case 4:
                // cc.error("Scrolling");
                if (this.leftArrow)
                    this.leftArrow.active = true;
                if (this.rightArrow)
                    this.rightArrow.active = true;
                break;
            case 5:
                // cc.error("Bounce Top");
                break;
            case 6:
                // cc.error("Bounce bottom");
                break;
            case 7:
                // cc.error("Bounce left");
                this.leftEnd = true;
                break;
            case 8:
                // cc.error("Bounce right");
                this.rightEnd = true;
                break;
            case 9:
                // cc.error("Auto scroll ended");
                if (this.leftEnd && this.leftEnd) {
                    this.leftArrow.active = false;
                }
                if (this.rightEnd && this.rightArrow) {
                    this.rightArrow.active = false;
                }
                this.leftEnd = false;
                this.rightEnd = false;
                break;
        }
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
        RoomED.removeObserver(this);
    },

    start: function () {//因为需要 获取玩家是不是游戏中，，， 为啥不在登录时带回  而需要重新发 而且是每次都发
        this.setUserInfo(hallData.getInstance());
    },
    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        var userinfo = this.userinfoNode.getComponent('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    //加载左侧游戏按钮
    loadGame() {
        this.gameListContent.removeAllChildren(true);
        var hasClan = (hallData.getInstance().preGuildid || hallData.getInstance().guildid)
        var gameList = [];
        for (var i = 0; i < hallGameList.gameList.length; i++) {
            // if (hallGameList.gameList[i].game_id != 129) {
                gameList.push(hallGameList.gameList[i]);
            // }
        }

        for (let index = 0; index < gameList.length; index++) {
            if (gameList[index].game_list) { //合集

            } else {
                if (gameList[index].type == GAME_ITME_TYPE.RedBag_FUNCTION) {

                } else if (gameList[index].isdefault || hasClan) {
                    var gameItemNode = cc.instantiate(this.gamelistItem);
                    gameItemNode.active = true;
                    gameItemNode.tag = gameList[index]._game_id
                    var gameItemUI = gameItemNode.getComponent("klb_hall_desk_game_item");
                    gameItemUI.setData(gameList[index], null);
                    this.gameListContent.addChild(gameItemNode);
                    // if(index == 0)
                    // {
                    //     gameItemUI.getComponent(cc.Toggle).check();
                    // }
                }
            }
        }
    },

    //请求游戏房间返回
    updateRoomList: function (data) {
        this.m_roomListData = data.roomlistList;
        this.m_gameId = data.hallGameid;
        this.clearAllDesk();
        this.requestDeskInfo(this.m_gameId);
        this.manulSelectGame(this.m_gameId);
        this.initDownNode();
        // this.setRoomData(data,data.hallGameid);
    },

    manulSelectGame: function (gameid) {
        var child = this.gameListContent.children;
        for (var i = 0; i < child.length; i++) {
            if (child[i].tag == gameid) {
                var tog = child[i].getComponent(cc.Toggle);
                tog.isChecked = true;
                break;
            }
        }
        this.passToggle.node.active = gameid != 102;
    },

    //请求房间桌子信息
    requestDeskInfo: function (gameid, gametype) {
        var msg = new cc.pb.game_rule.msg_get_room_desks_req();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        var roomID = gametype;
        if (roomID == null) {
            cc.log();
            roomID = this.getTheBigestRoomId();//gameid == 202?this.getTheBigestRoomId():this.m_roomListData[0].fangjianid
            // if(gameid != 202)
            //     this.onSelectGameLevel(null,0)
        }
        gameInfo.setGameType(gameid == null ? this.m_gameId : gameid);
        gameInfo.setRoomId(roomID);
        msg.setGameInfo(gameInfo);
        msg.setIndex(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req, msg,
            '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);
    },

    getTheBigestRoomId() {
        var idx = this.m_roomListData[0].fangjianid
        var playerGold = HallPropData.getCoin();
        for (var i = this.m_roomListData.length - 1; i >= 0; i--) {
            var data = game_room_list.getItem(function (item) {
                if (item.gameid == this.m_gameId && item.roomid == this.m_roomListData[i].fangjianid)
                    return playerGold >= item.entermin;
            }.bind(this));

            if (data) {
                idx = this.m_roomListData[i].fangjianid;
                break;
            }
        }

        this.onSelectGameLevel(null, idx - 1)
        return idx;
    },

    requestLeaveDesk() {
        var msg = new cc.pb.game_rule.msg_leave_room_desks_req();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(this.m_gameId);
        gameInfo.setRoomId(this.m_nRoomId);
        msg.setGameInfo(gameInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_leave_room_desks_req, msg,
            '发送协议[cmd_msg_leave_room_desks_req][离开房间信息]', true);
    },

    //选择房间等级(初级，中级等)
    onSelectGameLevel: function (event, data) {
        RoomMgr.Instance().clearAllData()
        var idx = parseInt(data);
        var index = this.getRoomIdData(idx + 1);
        if (event) {
            this.requestLeaveDesk();
            this.requestDeskInfo(null, this.m_roomListData[index].fangjianid);
        } else {
            for (var i = 0; i < this.downBtns.length; i++) {
                this.downBtns[i].getComponent(cc.Toggle).isChecked = idx == i;
            }
        }

    },

    getRoomIdData(fangjianid) {
        for (var i = 0; i < this.m_roomListData.length; i++) {
            if (this.m_roomListData[i].fangjianid == fangjianid)
                return i;
        }
        return 0;
    },

    // 设置当前房间等级的配置信息
    setRoomData: function (roomid, gameId) {
        game_room_list.items.forEach(function (roomItem) {
            if (gameId == roomItem.gameid && roomItem.roomid == roomid) {
                RoomMgr.Instance().roomItem = roomItem;
            }
        }.bind(this));
    },

    //初始化房间等级 显示
    initDownNode: function () {

        for (var i = 0; i < this.downBtns.length; i++)
            this.downBtns[i].active = false;

        for (var i = 0; i < this.m_roomListData.length; i++) {
            var data = game_room_list.getItem(function (item) {
                if (item.gameid == this.m_gameId && item.roomid == this.m_roomListData[i].fangjianid)
                    return true;
            }.bind(this));
            this.downBtns[this.m_roomListData[i].fangjianid - 1].active = true;
            if (data) {
                var des = cc.find('txt', this.downBtns[data.roomid - 1]).getComponent(cc.Label);
                des.string = '携带:' + data.desc;
                switch (this.m_gameId) {
                    //德州
                    case 202:
                        // cc.find('mang', this.downBtns[data.roomid - 1]).active = true;
                        // cc.find('select/mang', this.downBtns[data.roomid - 1]).active = true;
                        var mang = cc.find('mang', this.downBtns[data.roomid - 1]).getComponent(cc.Label);
                        var str = '盲注:' + this.convertNumToStr(parseInt(data.basescore / 2)) + '-' + this.convertNumToStr(data.basescore);
                        mang.string = str
                        mang = cc.find('select/mang', this.downBtns[data.roomid - 1]).getComponent(cc.Label);
                        mang.string = str
                        break;
                    default:
                        var mang = cc.find('mang', this.downBtns[data.roomid - 1]).getComponent(cc.Label);
                        mang.string = data.titel
                        mang = cc.find('select/mang', this.downBtns[data.roomid - 1]).getComponent(cc.Label);
                        mang.string = data.titel
                        break;
                }
            }


        }
        this.downBtnEmptyNode.active = this.m_roomListData.length < 5;

    },

    convertNumToStr(num) {
        if (num < 10000) {
            return num.toString();
        }
        else if (num < 100000000) {
            return Math.round(num / 1000) / 10 + '万';
        }
        else {
            return Math.round(num / 10000000) / 10 + '亿';
        }
    },

    clearAllDesk: function () {
        for (var i = 0; i < this.itemList.length; i++) {
            this.itemList[i].destroy();
        }
        this.deskContent.removeAllChildren(true);
        this.deskScrollView.scrollToLeft();
        this.itemList = [];

    },

    //显示 桌子
    initDeskNodeList: function (roomid, gameid, indexcount) {
        if (this.m_nRoomId != roomid || this.m_gameId != gameid) {
            this.clearAllDesk();
            this.m_nCountIndex = 1;
            this.deskContent.x = this.m_nMoveInitX;

            this.m_nRoomId = roomid;
            this.m_gameId = gameid;
            this.move_x = this.deskContent.x;
        }

        let config = klb_game_Confg.getItem((item) => {
            return item.gameid == gameid;
        });
        let itemPrefab = null;
        // this.downNode.active = config.game_table != TABLE_TYPE.SINGLE;


        switch (config.game_table) {
            case TABLE_TYPE.SINGLE:
                itemPrefab = this.oneItem;
                this.startX = 20;
                this.startY = 190;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 20;
                this.spaceY = -30;
                this.col = 2;//每列几个
                this.pageNum = 8;
                this.maxPage = 4;
                break;
            case TABLE_TYPE.TWO:
                itemPrefab = this.twoItem;
                this.startX = 50;
                this.startY = 180;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 30;
                this.spaceY = -30;
                this.col = 2;//每列几个
                this.pageNum = 6;
                this.maxPage = 6;
                break;
            case TABLE_TYPE.THREE:
                itemPrefab = this.threeItem;
                this.startX = 50;
                this.startY = 180;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 50;
                this.spaceY = -10;
                this.col = 2;//每列几个
                this.pageNum = 6;
                this.maxPage = 6;
                break;
            case TABLE_TYPE.FOUR:
                itemPrefab = this.fourItem;
                this.startX = 30;
                this.startY = 180;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 40;
                this.spaceY = 0;
                this.col = 2;//每列几个
                this.pageNum = 6;
                this.maxPage = 6;
                break;
            case TABLE_TYPE.BIG_FIVE:
                itemPrefab = this.fiveItem;
                this.startX = 20;
                this.startY = 180;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 25;
                this.spaceY = -10;
                this.col = 2;//每列几个
                this.pageNum = 6;
                this.maxPage = 6;
                break;
            case TABLE_TYPE.BIG_NINE:
                itemPrefab = this.nineItem;
                this.startX = 50;
                this.startY = 200;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 120;
                this.spaceY = 0;
                this.col = 2;//每列几个
                this.pageNum = 6;
                this.maxPage = 6;
                break;
            case TABLE_TYPE.SIX:
                itemPrefab = this.fourItem;
                this.startX = 50;
                this.startY = 200;
                this.spawnCount = 8;//每次向服务请求个数
                this.spaceX = 100;
                this.spaceY = 5;
                this.col = 2;//每列几个
                this.pageNum = 6;
                this.maxPage = 6;
                break;
            default:
                break;
        }

        this.itemWidth = itemPrefab.data.width;
        this.itemHeight = itemPrefab.data.height


        var count = this.pageNum;
        // if(this.pageNum * indexcount > this.spawnCount)
        //     count = this.pageNum * indexcount - this.spawnCount;
        var scrollWidth = this.deskScrollView.node.width;
        for (var i = 0; i < count; i++) {

            var deskTag = i + 1 + (indexcount - 1) * this.pageNum;
            if (deskTag > MAX_DESK)
                break;
            var deskNode = cc.instantiate(itemPrefab);

            deskNode._tag = deskTag
            this.itemList.push(deskNode);
            deskNode.active = true;
            // var numNode = cc.dd.Utils.seekNodeByName(deskNode, "deskIndx");
            // if(numNode)
            //     numNode.getComponent(cc.Label).string = deskTag < 10 ? '0' + deskTag : deskTag;
            this.deskContent.addChild(deskNode);
            var cpt = deskNode.getComponent('klb_hall_desk_table');
            if (cpt)//初始化
                cpt.updateDeskNodeInfo(null, this.m_gameId, this.m_nRoomId, deskTag);

            var cnt = this.itemList.length;
            //界面排列
            var x = (Math.ceil(cnt / this.col) - 0.5) * this.itemWidth + (Math.ceil(cnt / this.col) - 0.5) * this.spaceX;
            deskNode.x = x;
            var index = (cnt % this.col);
            var y = this.startY + this.itemHeight * (index - 1) + (index - 1) * this.spaceY;
            deskNode.y = y;

            this.deskContent.width = Math.ceil(cnt / this.col) * this.itemWidth + Math.ceil(cnt / this.col + 1) * this.spaceX;
            cc.log("create desk tag:" + deskTag + ' x:' + x + ' y:' + y);
        }

        if (this.deskContent.width < scrollWidth && this.m_nCountIndex < this.maxPage) {
            this.onScrollEnded(null, true);
        }


    },

    //获取 桌子
    getDeskNode: function (deskIndex) {
        for (var node of this.itemList) {
            if (node._tag == deskIndex)
                return node;
        }
        return null;
    },

    //获取 桌子
    getDeskNodeByRoomID: function (roomid) {
        for (var node of this.itemList) {
            if (node._roomId == roomid)
                return node;
        }
        return null;
    },

    //动态创建，更新桌子列表显示
    updateDeskList: function (data) {
        if (this.deskContent.childrenCount <= 0 || this.m_nRoomId != data.gameInfo.roomId || this.m_gameId != data.gameInfo.gameType)
            this.initDeskNodeList(data.gameInfo.roomId, data.gameInfo.gameType, data.index)
        this.updateAllDeskList();
        this.setRoomData(data.gameInfo.roomId, data.gameInfo.gameType);
    },

    //更新现有所有桌子
    updateAllDeskList: function () {
        var deskDataList = RoomMgr.Instance().getAllDeskList();
        for (var deskData of deskDataList) {
            var deskNode = this.getDeskNode(deskData.argsList[0]); //获取节点
            if (deskNode) {
                deskNode._roomId = deskData.roomId;
                var cpt = deskNode.getComponent('klb_hall_desk_table');
                if (cpt)
                    cpt.updateDeskNodeInfo(deskData, this.m_gameId, this.m_nRoomId); //更新桌子信息
            }
        }
    },
    //更新一个桌子
    updateADesk: function (data) {
        var deskData = RoomMgr.Instance().findDeskInfoByRoomId(data.desk.roomId);
        if (deskData) {
            var deskNode = this.getDeskNode(data.desk.argsList[0]); //获取节点
            if (deskNode) {
                var cpt = deskNode.getComponent('klb_hall_desk_table');
                if (cpt)
                    cpt.updateDeskNodeInfo(deskData, this.m_gameId, this.m_nRoomId); //更新桌子信息
            } else {
                // cc.log("没找到桌子节点");
            }
        } else {
            cc.log("没找到桌子数据");
        }

    },

    unLockADesk: function (data) {
        var deskData = RoomMgr.Instance().findDeskInfoByRoomId(data.roomid);
        if (deskData) {
            var deskNode = this.getDeskNode(data.roomIndex); //获取节点
            if (deskNode) {
                var cpt = deskNode.getComponent('klb_hall_desk_table');
                if (cpt)
                    cpt.updateDeskNodeInfo(deskData, this.m_gameId, this.m_nRoomId); //更新桌子信息
            } else {
                // cc.log("没找到桌子节点");
            }
        } else {
            cc.log("没找到桌子数据");
        }

    },

    updateDeskState: function (data) {
        var deskData = RoomMgr.Instance().findDeskInfoByRoomId(data.gameInfo.roomId);
        if (deskData) {
            // deskData.roomStatus = data.roomState
            deskData.isPlaying = (data.roomState == 1)
            var deskNode = this.getDeskNodeByRoomID(data.gameInfo.roomId); //获取节点
            if (deskNode) {
                var cpt = deskNode.getComponent('klb_hall_desk_table');
                if (cpt)
                    cpt.updateDeskNodeInfo(deskData, this.m_gameId, this.m_nRoomId); //更新桌子信息
            }
        }


    },

    //请求更多桌子信息
    loadScrollRecode: function () {
        var msg = new cc.pb.game_rule.msg_get_room_desks_req();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(this.m_gameId);
        gameInfo.setRoomId(this.m_nRoomId);
        msg.setGameInfo(gameInfo);
        msg.setIndex(RoomMgr.Instance().getDeskIndex() + 1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req, msg,
            '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);

    },

    //桌子滑动结束回调
    onScrollEnded: function (event, force) {
        // if(playerManager.getCanGetListTag() == false)
        //     return;
        var isRight = (this.deskContent.x < this.move_x);
        var cnt = this.itemList.length;
        // var needOffset = (Math.ceil(cnt / this.pageNum)) *this.itemWidth+((Math.ceil(cnt / this.pageNum)) + 1)*this.spaceX - this.deskScrollView.node.getContentSize().width;

        if (isRight || force) {

            if (this.m_nCountIndex + 1 > this.maxPage)
                return;
            this.m_nCountIndex += 1;
            // var moveOffsetX = Math.abs(this.deskContent.x - this.m_nMoveInitX);
            // if(moveOffsetX <= needOffset){
            // if( cnt%this.spawnCount+this.pageNum>this.spawnCount){
            if (cnt >= RoomMgr.Instance().getDeskIndex() * this.spawnCount) {
                this.move_x = this.deskContent.x;
                this.loadScrollRecode();
            }
            this.initDeskNodeList(this.m_nRoomId, this.m_gameId, this.m_nCountIndex);
            this.updateAllDeskList();
        }

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


    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.GET_GAME_DESK_DATA:
                this.updateDeskList(data);
                break;
            case Hall.HallEvent.UPDATE_GAME_DESK_DATA:
                this.updateADesk(data);
                break;
            case Hall.HallEvent.UPDATE_GAME_DESK_UNLOCK:
                this.unLockADesk(data);
                break;
            case Hall.HallEvent.UPDATE_GAME_DESK_STATE:
                this.updateDeskState(data);
                break;
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter(data[0]);
                break;
        }
    },

    on_coin_room_enter: function () {
        switch (this.m_gameId) {
            case 32:
                cc.gateNet.Instance().pauseDispatch();
                this.checkIsEnterCommon(this.m_gameId, this.sendDDZEnterMsg.bind(this));
                break;
            case 129:
                cc.gateNet.Instance().pauseDispatch();
                this.checkIsEnterCommon(this.m_gameId, this.sendPDKEnterMsg.bind(this));
                break;
            default:
                if (cc.dd.CheckGames.isMJ(this.m_gameId)) {
                    cc.gateNet.Instance().pauseDispatch();

                    game_room_list.items.forEach(function (roomItem) {
                        if (RoomMgr.Instance().configId == roomItem.key) {
                            RoomMgr.Instance().roomItem = roomItem;
                        }
                    }.bind(this));

                    this.checkIsEnterCommon(this.m_gameId, this.sendMJEnterMsg.bind(this));
                }
                break;

        }
    },

    /**
     * 麻将
     */
    sendMJEnterMsg(gameid) {
        let scriptData = null;
        switch (gameid) {
            case cc.dd.Define.GameType.CCMJ_GOLD:
                scriptData = require("ccmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.JLMJ_GOLD:
                scriptData = require("jlmj_desk_jbc_data").getInstance();
                break;
            case cc.dd.Define.GameType.NAMJ_GOLD:
                scriptData = require("namj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.FXMJ_GOLD:
                scriptData = require("fxmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.SYMJ_GOLD:
                scriptData = require("symj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.XZMJ_GOLD:
            case cc.dd.Define.GameType.XLMJ_GOLD:
                scriptData = require("scmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.SHMJ_GOLD:
                scriptData = require("shmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.TDHMJ_GOLD:
                scriptData = require("tdhmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.CFMJ_GOLD:
                scriptData = require("cfmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.AHMJ_GOLD:
                scriptData = require("ahmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.FZMJ_GOLD:
                scriptData = require("fzmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.WDMJ_GOLD:
                scriptData = require("wdmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.PZMJ_GOLD:
                scriptData = require("pzmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.BCMJ_GOLD:
                scriptData = require("bcmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.ACMJ_GOLD:
                scriptData = require("acmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.HLMJ_GOLD:
                scriptData = require("hlmj_desk_data_jbc").getInstance();
                break;
            case cc.dd.Define.GameType.JSMJ_GOLD:
                scriptData = require("jsmj_desk_data_jbc").getInstance();
                break;
        }

        if (scriptData != null) {
            scriptData.setData(RoomMgr.Instance().roomItem);
            cc.dd.AppCfg.GAME_ID = gameid;
            cc.dd.SceneManager.enterGame(gameid);
        } else {
            cc.gateNet.Instance().startDispatch();
        }
    },

    /**
    * 斗地主
    */
    sendDDZEnterMsg: function (gameid) {
        var scriptData = require('ddz_data').DDZ_Data.Instance();
        scriptData.setData(RoomMgr.Instance().roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        cc.dd.SceneManager.enterGame(this.m_gameId);
    },


    /**
    * 跑得快
    */
    sendPDKEnterMsg: function (gameid) {
        var scriptData = require('pdk_data').PDK_Data.Instance();
        scriptData.setData(RoomMgr.Instance().roomItem);
        cc.dd.AppCfg.GAME_ID = gameid;
        cc.dd.SceneManager.enterGame(this.m_gameId);
    },


    /**
     * 检查金币是否可以进入房间，通用
     */
    checkIsEnterCommon: function (gameId, callFunc) {
        RoomMgr.Instance().gameId = this.m_gameId;
        RoomMgr.Instance().roomLv = this.m_nRoomId;

        callFunc(gameId);
    },


    // onClickLeft(){
    //     let percent = Math.floor(this.deskScrollView.getScrollOffset().x) / Math.floor(this.deskScrollView.getMaxScrollOffset().x);
    //     cc.log(percent);
    //     this.deskScrollView.scrollToPercentHorizontal(Math.abs(percent)-0.3, 0.2);
    //     percent = Math.floor(this.deskScrollView.getScrollOffset().x) / Math.floor(this.deskScrollView.getMaxScrollOffset().x);
    //     cc.log(percent);
    // },

    // onClickRight(){
    //     let percent = Math.floor(this.deskScrollView.getScrollOffset().x) / Math.floor(this.deskScrollView.getMaxScrollOffset().x);
    //     cc.log(percent);
    //     this.deskScrollView.scrollToPercentHorizontal(Math.abs(percent)+0.3, 0.2);
    //     percent = Math.floor(this.deskScrollView.getScrollOffset().x) / Math.floor(this.deskScrollView.getMaxScrollOffset().x);
    //     cc.log(percent);
    // },

    //关闭按钮
    close: function () {
        RoomMgr.Instance().clearAllData();
        hall_audio_mgr.com_btn_click();
        this.requestLeaveDesk();

        cc.dd.UIMgr.destroyUI(this.node);

        // playerManager.clearAllData();
    },

    // 快捷 取钱 存钱
    openQuickPickMoney(entermin, entermax) {
        cc.dd.UIMgr.openUI('gameyj_hall/prefabs/room_table/klb_hall_pick_money', function (prefab) {
            var scr = prefab.getComponent('klb_hall_pick_money');
            scr.setData(entermin, entermax)
            scr.setCallBack(this.onQuickStart.bind(this))
        }.bind(this));

    },
    onClickQuickStart() {
        switch (this.m_gameId) {
            //百人游戏
            case 109://疯狂拼十
            case 104: //飞禽走兽
            case 105: //西游记
            case 106://幸运转盘
            case 201://二八杠
            case 205://单人二八杠
            case 203: // 百人炸金花
            case 103://单挑
            case 204://百人推Poker
                return;
            default:
                break;
        }

        if (this.m_gameId == 102) { //财神留机处理
            var roomData = RoomMgr.Instance().findMineLockedRoom();
            if (!roomData) {
                var jsonstr = cc.sys.localStorage.getItem('liuji_room_info_' + cc.dd.user.id);
                if (jsonstr) {
                    roomData = JSON.parse(jsonstr);
                    var curtime = new Date().getTime();
                    if (curtime - roomData.time > roomData.liujiTime * 1000) {
                        roomData = null;
                    }
                }
            }
            if (roomData) {
                cc.dd.DialogBoxUtil.show(0, "您已留机，是否立即前往？", "前往", "取消", function () {
                    var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                    msg.setGameType(roomData.gameId);
                    msg.setRoomId(roomData.roomId);
                    msg.setSeat(0);//roomData.seat;
                    msg.setDeskId(roomData.deskData.argsList[0]);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                    cc.sys.localStorage.setItem('requestEnterGame_cache', JSON.stringify({ gameId: roomData.gameId, roomId: roomData.roomId, seat: 0, deskId: roomData.deskData.argsList[0] }));

                }, null);
                return;
            }
        }

        var coin = HallPropData.getCoin();
        var bankCoin = HallPropData.getBankCoin();
        var entermin = RoomMgr.Instance().roomItem.entermin
        var entermax = RoomMgr.Instance().roomItem.entermax
        if (coin < entermin) {
            if ((bankCoin + coin) < entermin) {
                // 金币不足 弹窗  跳转商城
                cc.dd.DialogBoxUtil.show(1, '您的金币不足' + this.convertNumToStr(entermin) + '，无法上座!是否充值?', '确定', '取消', function () {
                    if (!cc._is_shop)
                        return;
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                        var type = "ZS";
                        ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
                    }.bind(this));

                }, null);
            } else {
                this.openQuickPickMoney(entermin, entermax)
            }
            return;
        }

        if (coin > entermax) {
            this.openQuickPickMoney(entermin, entermax)
            return;
        }

        this.onQuickStart();
    },
    //快速开始
    //因为没有其他房间等级的桌子信息，只能请求当前桌子空位进入
    onQuickStart: function () {
        hall_audio_mgr.com_btn_click();

        var enterfunc = function () {
            var msg = new cc.pb.room_base.msg_quick_entery_req();
            msg.setGameType(this.m_gameId);
            msg.setRoomCoinId(this.m_nRoomId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_base.cmd_msg_quick_entery_req, msg,
                '发送协议[msg_quick_entery_req]', true);
        }.bind(this);

        if (/*this.m_gameId == 32 && */HallCommonData.getInstance().gameId > 0) {    //游戏恢复
            var gameItem = klb_game_list_config.getItem(function (item) {
                if (item.gameid == HallCommonData.getInstance().gameId)
                    return item
            })
            var str = '您还在[' + gameItem.name + ']游戏中，约30秒后退出成功...'
            cc.dd.DialogBoxUtil.show(0, str, '回到房间', '取消', function () {

                this.requestLeaveDesk();

                var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
                msg.setGameType(HallCommonData.getInstance().gameId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRoom');
                this.m_gameId = HallCommonData.getInstance().gameId;
            }.bind(this), function () {
                this.m_gameId = this.m_nGameType;
            }.bind(this));
            cc.dd.DialogBoxUtil.setWaitGameEnd(enterfunc);
            return;
        }
        enterfunc();

        // cc.dd.UIMgr.destroyUI(this.node);


        // var coin = HallPropData.getCoin();
        // if(coin >= RoomMgr.Instance().roomItem.entermin)
        // {

        //     for(var deskNode of this.itemList){
        //         var cpt = deskNode.getComponent('klb_hall_desk_table');
        //         if(cpt.tryEnterGame())
        //             break;
        //     }

        // }else
        // {
        //     cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
        //         var jiuji = ui.getComponent('klb_hall_jiuji');
        //         if (jiuji != null) {
        //             jiuji.update_buy_list(RoomMgr.Instance().roomItem.entermin);
        //         }
        //     });
        // }

    },


    savePass: function (pass) {
        RoomMgr.Instance().m_deskPass = pass;
        cc.sys.localStorage.setItem('HALL_DESK_PASSWORD', RoomMgr.Instance().m_deskPass);
        if (pass == "") {
            this.passToggle.isChecked = false;
        }
    },

    onSwitchPass: function (event, data) {
        var tg = event.target.getComponent(cc.Toggle);
        if (tg.isChecked) {
            cc.dd.UIMgr.openUI('gameyj_common/prefab/com_game_menu_lock_room', function (prefab) {
                var scr = prefab.getComponent('com_game_menu_lock_unlock');
                scr.setData(this.savePass, event.target);//this.m_roomId,this.m_gameType)
            }.bind(this));

        } else {
            this.savePass('')
        }

    },

});
