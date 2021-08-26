/**
 * Created by wang on 2017/6/24.
 */

var dd = cc.dd;
var tdk = dd.tdk;

var TdkDeskData = require('tdk_desk_data').TdkDeskData;
var LeaveDeskCode = require('tdk_base_pb').tdk_enum_leavedeskrsp;

var RoomED = require( "jlmj_room_mgr" ).RoomED;
var RoomEvent = require( "jlmj_room_mgr" ).RoomEvent;
var jlmj_room_mgr = require( "jlmj_room_mgr" ).RoomMgr;

var gameData = require('tdk_game_data');

var TdkPlayerEvent = cc.Enum({
    PLAYER_ENTER : 'tdk_player_enter', //玩家进入
    PLAYER_LEAVE : 'tdk_player_leave', //玩家离开
    PLAYER_EXIT : 'tdk_player_exit', //玩家退出
    ADD_POKER : 'tdk_player_add_poker', //玩家增加手牌
    RECONNECT_ADD_POKER : 'tdk_player_reconnect_add_poker', //断线重连玩家发牌
    PLAYER_FOLD : 'tdk_player_fold', //玩家扣牌
    PLAYER_READY : 'tdk_player_ready',  //玩家准备
    ALL_PLAYER_READY : 'tdk_player_all_ready', //所有玩家准备
    SHOW_ALL_POKER : 'tdk_player_show_all_poker', //展示玩家所有手牌
    FRESH_CHIP_AND_WIN : 'tdk_player_fresh_chip_and_win', //更新玩家下注和总输赢
    PLAYER_COME_BACK : 'tdk_player_come_back', //玩家回来
});

var TdkPlayerED = new dd.EventDispatcher();

/*****************************************PokerData*************************************************/

/**
 * 手牌数据
 * @type {Function}
 */
var PokerData = cc.Class({
    properties:{
        /**
         * 请求刷新视图的玩家
         */
        freshViewUserId:0,
        /**
         * 玩家id
         */
        userid:0,
        /**
         * 是否借牌
         */
        borrow:false,
        /**
         * 纸牌数字
         */
        pokerid:0,
        /**
         * 明牌分数
         */
        score:0,
        /**
         * 明牌最大分
         */
        maxpscore:0,
        /**
         * 所有手牌分数
         */
        totalscore:0,
    },

    ctor:function () {

    },

    setMsgData:function (msg) {
        this.setValue(msg);
        this.addPoker();
    },

    setValue:function (msg) {
        this.userid = msg.userid;
        this.borrow = msg.borrow;
        this.pokerid = msg.pokerid;
        this.score = msg.score;
        this.maxpscore = msg.maxpscore;
        this.totalscore = msg.totalscore;
    },

    /**
     * 改值
     * @param data
     */
    changValue:function (data) {
        this.setValue(data);
    },

    /**
     * 增加手牌
     */
    addPoker:function () {
        TdkPlayerED.notifyEvent(TdkPlayerEvent.ADD_POKER, this);
    },

    /**
     * 增加手牌
     */
    reconnectAddPoker:function () {
        TdkPlayerED.notifyEvent(TdkPlayerEvent.RECONNECT_ADD_POKER, this);
    },

    /**
     * 刷新ui界面，ui层主动请求
     */
    freshView:function (userid) {
        this.freshViewUserId = userid;
        this.reconnectAddPoker();
    },
});

/*****************************************ChipData*************************************************/

/**
 * 筹码数据
 * @type {Function}
 */
var ChipData = cc.Class({
    properties:{

    },

    ctor:function () {

    },

    setMsgData:function (msg) {

    },
});

/***************************************PlayerData***********************************************/

/**
 * 玩家数据
 * @type {Function}
 */
var PlayerData = cc.Class({
    properties:{
        /**
         * 请求刷新视图的玩家
         */
        freshViewUserId:0,
        /**
         * 玩家自己
         */
        selfId:0,
        /**
         * 玩家id
         */
        userId:0,
        /**
         * 玩家昵称
         */
        nick:'',
        /**
         * 玩家性别
         */
        sex:0,
        /**
         * 玩家座位
         */
        pos:0,
        /**
         * 是否离线
         */
        isLeaving:false,
        /**
         * 是否准备
         */
        isReady:false,
        /**
         * 是不是房主
         */
        isOwner:false,
        /**
         * 是否弃牌
         */
        isFold:false,
        /**
         * 玩家手牌列表
         */
        poker_list:[],
        /**
         * 手牌明牌分数
         */
        score:0,
        /**
         * 所有手牌分数
         */
        totalScore:0,
        /**
         * 与明牌最高分的差距
         */
        offsetScore:0,
        /**
         * 已下注数量
         */
        costChip:0,
        /**
         * 本局输赢
         */
        winNum:0,
        /**
         * 总输赢
         */
        totalWinNum:0,

        /**
         * 玩家历下注
         */
        costChip_list:[],
        /**
         * 头像地址
         */
        headUrl:'',
        /**
         * 微信授权用户唯一id
         */
        openId:0,
        city:'',
        unionId:'',
        /**
         * 当前第几局
         */
        deskround:0,
        /**
         * 语音账号
         */
        accid:'',
        /**
         * 是否allin
         */
        isAllIn: false,
        /**
         * 玩家携带的金币
         */
        gold: 0,
    },

    ctor:function () {
    },

    /**
     * 初始化ui配置数据
     */
    init:function () {
    },

    printWxInfo:function (userid, data) {
        cc.log('[data]微信数据:【openId:',data.openid,
                ', 昵称:',data.nickname,
                ', 头像地址:', data.headurl,
                ', 性别:',data.sex,
                ', 城市:', data.city,
                ', unionId:', data.unionid,
                ', 玩家id:', userid,'】');
    },

    setMsgData:function (msg) {
        this.openId = msg.wxinfo.openid;
        this.nick = msg.wxinfo.nickname;
        this.headUrl = msg.wxinfo.headurl;
        if(this.headUrl && this.headUrl.lastIndexOf('/')!=-1){
            this.headUrl= this.headUrl.substring(0,this.headUrl.lastIndexOf('/')+1)+"64";
        }
        this.sex = msg.wxinfo.sex;
        this.city = msg.wxinfo.city;
        this.unionId = msg.wxinfo.unionid;

        this.printWxInfo(msg.userid, msg.wxinfo);

        gameData.addPlayerWxInfo({userid:msg.userid,wx:msg.wxinfo});

        this.selfId = msg.selfId;
        this.userId = msg.userid;
        this.pos = msg.pos;
        this.isLeaving = msg.isleaving;
        this.isOwner = msg.isowner;
        this.isReady = msg.already;
        this.isFold = msg.fold;
        this.costChip = msg.betnum;
        this.totalWinNum = msg.score;
        if(typeof msg.bethisList != "undefined"){
            this.costChip_list = msg.bethisList;
        }

        if(gameData._selfId == msg.userid){
            gameData.isRoomOwner = msg.isowner;
        }
    },

    /**
     * 设置发牌数据
     * @param msg
     */
    setSendPokerMsgData:function (msg) {
        this.score = msg.score;
        this.totalScore = msg.totalscore;

        this.addPoker(msg);
    },

    /**
     * 设置所有手牌数据
     * @param msg
     */
    setPokerListMsgData:function (msg) {
        cc.log('[data] tdk_player_data::玩家:',this.userId,'所有手牌：',msg);
        this.score = msg.score;
        this.totalScore = msg.totalscore;
        this.isFold = msg.fold;

        this.poker_list.forEach(function (item, i) {
            msg.pokerid = msg.pokerlistList[i];
            item.changValue(msg);
        });

        TdkPlayerED.notifyEvent(TdkPlayerEvent.SHOW_ALL_POKER, msg);
    },

    createPokerData:function () {
        var pokerData = new PokerData();
        return pokerData;
    },

    /**
     * 判断玩家是不是自己
     */
    isSelf:function () {
        return (this.selfId == this.userId);
    },

    /**
     * 增加手牌
     */
    addPoker:function (data) {
        cc.log('[data] tdk_player_data::玩家:',this.userId,'增加手牌：',data);
        var pokerData = this.createPokerData();
        pokerData.setMsgData(data);
        this.poker_list.push(pokerData);
    },

    /**
     * 手牌个数
     * @returns {Number}
     */
    getPokerCount:function () {
        return this.poker_list.length;
    },

    /**
     * 玩家进入游戏
     */
    enterGame:function () {
        cc.log('[data] tdk_player_data::玩家:',this.userId,',位置：',this.pos,',进入游戏！');
        TdkPlayerED.notifyEvent(TdkPlayerEvent.PLAYER_ENTER, this);
        // this.isLeaving = false;
    },

    /**
     * 玩家离开游戏
     * @param userId
     */
    leaveGame:function () {
        cc.log('[data] tdk_player_data::玩家:',this.userId,'离开游戏！');
        this.isLeaving = true;
        TdkPlayerED.notifyEvent(TdkPlayerEvent.PLAYER_LEAVE, this);
    },

    /**
     * 玩家退出游戏
     */
    exitGame:function () {
        cc.log('[data] tdk_player_data::玩家:',this.userId,'退出游戏！');
        cc.dd.AudioChat.removeUser(this.openId);
        TdkPlayerED.notifyEvent(TdkPlayerEvent.PLAYER_EXIT, this);
    },

    /**
     * 玩家弃牌
     */
    foldGame:function () {
        cc.log('[data] tdk_player_data::玩家:',this.userId,'弃牌！');
        TdkPlayerED.notifyEvent(TdkPlayerEvent.PLAYER_FOLD, this);
    },

    /**
     * 清空数据
     */
    clearData:function () {
        this.poker_list.forEach(function (item) {
            item.clearData();
            item = null;
        });
        this.poker_list = [];
    },
    setReady: function(isReady){
        if(isReady){
            this.readyGame();
        }
    },
    /**
     * 准备
     */
    readyGame:function () {
        this.isReady = true;
        cc.log('[data] tdk_player_data::玩家:',this.userId,'已准备！');
        TdkPlayerED.notifyEvent(TdkPlayerEvent.PLAYER_READY, this);
    },

    /**
     * 设置玩家已下注
     * @param num
     */
    setCostChip:function (num) {
        this.costChip += num;
        cc.log('[data] tdk_player_data::玩家:',this.userId,'总下注:',this.costChip);
    },

    /**
     * 设置玩家输赢
     * @param data
     */
    setWinNum:function (num) {
        this.totalWinNum += num;
        cc.log('[data] tdk_player_data::玩家:',this.userId,'总输赢为:',this.totalWinNum);
    },

    /**
     * 玩家返回
     */
    comeBack:function () {
        if(this.isLeaving){
            this.isLeaving = false;
            TdkPlayerED.notifyEvent(TdkPlayerEvent.PLAYER_COME_BACK, this);
        }
    },

    /**
     * 刷新ui界面，ui层主动请求
     */
    freshView:function (userid) {
        this.freshViewUserId = userid;
        this.enterGame();

        if(this.isReady){
            this.readyGame();
        }

        this.poker_list.forEach(function (item) {
            if(item){
                item.freshView(userid);
            }
        });

        if(this.isFold){
            this.foldGame();
        }

        TdkPlayerED.notifyEvent(TdkPlayerEvent.FRESH_CHIP_AND_WIN, this);
    },

});

/**********************************************SelfPlayerData***********************************************/

/**
 * 玩家自己
 * @type {Function}
 */
var SelfPlayerData = cc.Class({

    extends:PlayerData,

    properties:{

    },

    ctor:function () {

    },
});

/**********************************************LeftPlayerData***********************************************/

/**
 * 左边玩家
 * @type {Function}
 */
var LeftPlayerData = cc.Class({

    extends:PlayerData,

    properties:{

    },

    ctor:function () {

    },
});

/**********************************************RightPlayerData***********************************************/

/**
 * 右边玩家
 * @type {Function}
 */
var RightPlayerData = cc.Class({

    extends:PlayerData,

    properties:{

    },

    ctor:function () {

    },
});

/**********************************TdkPlayerMgrData****************************************************/

/**
 * 所有玩家数据管理对象
 * @type {Function}
 */
var TdkPlayerMgrData = cc.Class({

    _instance:null,

    statics:{
        Instance:function () {
            if(!this._instance){
                cc.log('[data] TdkPlayerMgrData::Instance!');
                this._instance = new TdkPlayerMgrData();
            }
            return this._instance;
        },

        Destroy:function () {
            if(this._instance){
                cc.log('[data] TdkPlayerMgrData::Destroy!');
                this._instance = null;
            }
        },
    },

    properties:{
        /**
         * 请求刷新视图的玩家
         */
        freshViewUserId:0,
        /**
         * 房主
         */
        owner:0,
        /**
         * 玩家自己
         */
        selfId:0,
        /**
         * 玩家数据列表
         */
        playerData_list:[],
        /**
         * 玩家座位列表
         */
        playerPos_list:null,

        /**
         * 是否是断线重连
         */
        isReconnect:false,
    },

    ctor:function () {
        this.deskData = TdkDeskData.Instance();
        this.playerPos_list = new Array(this.deskData.playerCnt);

        RoomED.addObserver(this);
    },

    onDestroy: function(){
        RoomED.removeObserver(this);
        this.playerPos_list.splice(0, this.playerPos_list.length);
    },

    /**
     * 测试期间使用
     * @param id
     */
    setSelfId:function (id) {
        this.selfId = id;
    },

    setMsgData:function (msg) {
        cc.log('[data]playerMgr::setMsgData:',JSON.stringify(msg));
        this.selfId = dd.user.id;
        //this.resetPosList();
        this.deletePlayerById(msg[0].userid);
        this.setPosListData(msg);
        this.sortPos();


        this.playerPos_list.forEach(function (item) {
            if(item){
                this.addPlayer(item, false);
            }
        }.bind(this));
    },

    setReconnectMsgData: function(msg){
        cc.log('[data]playerMgr::setMsgData:',JSON.stringify(msg));
        this.selfId = dd.user.id;
        this.resetPosList();
        this.setReconnectPosListData(msg);
        this.sortPos();
        // msg.forEach(function(item){
        //     this.sortPos(item);
        // }.bind(this));

        this.playerPos_list.forEach(function (item) {
            if(item){
                this.addPlayer(item, true);
            }
        }.bind(this));

    },

    resetPosList:function () {
        this.playerPos_list = new Array(this.deskData.playerCnt);
    },

    /**
     * 玩家加入
     * @param data
     */
    playerEnter:function (data) {
        cc.log('[data]playerMgr::playerEnter:',JSON.stringify(data));
        // cc.log('[data] tdk_playerMgr_data:playerEnter:data=',data);
        // this.resetPosList();
        // this.sortPos(data);
        //
        // this.playerPos_list.forEach(function (item) {
        //     var player = this.findPlayerById(item.userid);
        //     if(!player){
        //         this.addPlayer(item);
        //     }else{
        //         player.comeBack();
        //     }
        // }.bind(this));

        var player = this.findPlayerById(data.userid);
        if(player){
            player.comeBack();
        }else{
            for(var i=0; i<this.playerPos_list.length; i++){
                var item = this.playerPos_list[i];
                if(!item){
                    data.pos = i;
                    this.playerPos_list[i] = data;
                    break;
                }
            }
            this.addPlayer(data);
        }
    },

    /**
     * 设置发牌数据
     */
    setSendPokerMsgData:function (msg) {
        cc.log('[data]playerMgr::setSendPokerMsgData:',JSON.stringify(this.playerData_list));
        var player = this.findPlayerById(msg.userid);
        player.setSendPokerMsgData(msg);
    },

    /**
     * 断线重连设置poslist；
     */
    setReconnectPosListData: function(msg){
        msg.forEach(function (item, i) {
            this.playerPos_list[i] = item;
        }.bind(this));
    },

    /**
     * 设置poslist
     */
    setPosListData: function(msg){
        msg.forEach(function (item) {
            this.playerPos_list.push(item);
        }.bind(this));
    },

    /**
     * 对客户端位置进行排序
     */
    sortPos:function () {
        var tmp_list = new Array();
        for(var i=0; i<this.playerPos_list.length; i++){
            var item = this.playerPos_list[i];
            if(item && item.userid == this.selfId){
                this.playerPos_list = this.playerPos_list.slice(i);
                break;
            }else{
                tmp_list.push(item);
            }
        }
        this.playerPos_list = this.playerPos_list.concat(tmp_list);

        this.playerPos_list.forEach(function (item, i) {
            if(item){
                item.pos = i;
            }
        });
        cc.log('[data] TdkPlayerMgrData::sortPos:list=',this.playerPos_list);
    },

    /**
     * 创建玩家数据对象
     */
    createPlayer:function (pos) {
        var playerData = null;
        if(0 == pos){//玩家自己
            playerData = new SelfPlayerData();
        }else if(1 == pos || 2 == pos){//右边玩家
            playerData = new RightPlayerData();
        }else if(3 == pos || 4 == pos){//左边玩家
            playerData = new LeftPlayerData();
        }
        return playerData;
    },

    /**
     * 增加玩家数据
     */
    addPlayer:function (data, needNew) {
        if(this.findPlayerById(data.userid)){
            if(needNew){
                this.removePlayerData(data.userid)
            }else{
                return;
            }
        }
        var playerData = this.createPlayer(data.pos);
        data.selfId = this.selfId;
        playerData.setMsgData(data);
        this.playerData_list.push(playerData);
        // this.setNullPlayer(playerData);
        playerData.enterGame();

        if(!playerData.isSelf()){
            cc.dd.AudioChat.addUser(playerData.openId);
        }
        // cc.dd.user.requestUserData([playerData.userId], function (list) {
        //     playerData.accid = list[0].AccId;
        //     if(!playerData.isSelf()){
        //         cc.dd.AudioChat.addUser(playerData.accid);
        //     }
        // });
    },

    /**
     * 从头开始找到第一个位置为空的数据对象
     */
    setNullPlayer:function (data) {
        for(var i=0; i<this.playerPos_list.length; i++){
            var item = this.playerPos_list[i];
            if(!item){
                data.pos = i;
                break;
            }
        }
    },
    /**
     * 查找位置数据是否存在
     */
    deletePlayerById:function (userId) {
        for(var i=0; i<this.playerPos_list.length; i++){
            var item = this.playerPos_list[i];
            if(item && item.userid == userId){
                this.playerPos_list.splice(i);
                i-- ;
            }
        }
    },

    getPlayer: function(userId){
        return this.findPlayerById(userId);
    },
    /**
     * 通过id找到玩家数据对象
     * @param userId
     */
    findPlayerById:function (userId) {
        var player = null;
        this.playerData_list.forEach(function (item) {
            if(item.userId == userId){
                player = item;
            }
        });
        if(!player){
            cc.log('[data] player:',userId,'不存在!');
        }
        return player;
    },

    /**
     * 玩家离开游戏
     * @param userId
     */
    leaveGame:function (userId) {
        var exit = false;
        var player = this.findPlayerById(userId);
        if(!gameData.isGaming && !player.isOwner){
            player.exitGame();
            if(gameData._selfId == userId){
                exit = true;
            }else{
                this.removePlayerData(userId);
            }
        }else{
            exit = true;
            player.leaveGame();
        }
        return exit;
    },

    /**
     * 清除玩家数据
     */
    removePlayerData:function (userid) {
        // for(var i=0; i<this.playerPos_list.length; i++){
        //     var item = this.playerPos_list[i];
        //     if(item && item.userid == userid){
        //         this.playerPos_list[i] = null;
        //         break;
        //     }
        // }

        for(var i=0; i<this.playerData_list.length; i++){
            var item = this.playerData_list[i];
            if(item && item.userId == userid){
                this.playerData_list.splice(i,1);
                break;
            }
        }
    },

    /**
     * 玩家退出游戏
     */
    exitGame:function (userId) {
        var player = this.findPlayerById(userId);
        player.exitGame();
        player = null;
    },

    /**
     * 刷新ui界面，ui层主动请求
     */
    freshView:function (userid) {
        this.freshViewUserId = userid;
        var readyCnt = 0;
        this.playerData_list.forEach(function (item) {
            item.freshView(userid);
            if(item.isReady){
                readyCnt++;
            }
        });

        if(readyCnt == this.deskData.pCnt){
            this.allPlayerReady();
        }

        this.isReconnect = false;
    },

    setReconnect:function (reconnect) {
        this.isReconnect = reconnect;
    },

    setCurRound:function (userid, round) {
        var player = this.findPlayerById(userid);
        player.deskround = round;
    },
    /**
     * 检查是否所有玩家都准备
     */
    checkAllPlayerReadyState: function(){
        if(this.deskData.playerCnt != this.playerData_list.length){
            return false;
        }else{
            var allReady = false;
            for(var i = 0; i < this.playerData_list.length; i++){
                var player = this.playerData_list[i];
                if(player.isReady){
                    allReady = true
                }else{
                    allReady = false;
                    return allReady;
                }
            }

            return allReady;
        }
    },
    /**
     * 所有玩家准备
     */
    allPlayerReady:function () {
        gameData.isGaming = true;
        TdkPlayerED.notifyEvent(TdkPlayerEvent.ALL_PLAYER_READY, this);
    },

    /**
     * 玩家准备
     */
    setPlayerReadyMsgData:function (msg) {
        var player = this.findPlayerById(msg.userid);
        player.deskround = msg.deskround;
        player.readyGame();
        if(this.checkAllPlayerReadyState()){
            this.allPlayerReady();
        }
    },

    /**
     * 设置玩家所有手牌数据
     * @param msg
     */
    setAllPokerMsgData:function (msg) {
        msg.userpokerList.forEach(function (item) {
            this.findPlayerById(item.userid).setPokerListMsgData(item);
        }.bind(this));
    },

    /**
     * 设置离开牌桌数据
     * @param msg
     */
    setLeaveDeskMsgData:function (msg) {
        if(msg.result != 0){
            cc.error('[data] 玩家:'+msg.userid+'离开房间失败!');
        }else{
            var player = this.findPlayerById(msg.userid);
            if(msg.type == LeaveDeskCode.LEAVEDESKTYPE_LEAVE){//退出
                this.removePlayerData(msg.userid);
                player.exitGame();
            }else if(msg.type == LeaveDeskCode.LEAVEDESKTYPE_OFFLINE){//离线
                player.leaveGame();
            }

            if(player.isOwner){
                var Own = this.findPlayerById(dd.user.id);
                if(Own){
                    this.removePlayerData(dd.user.id);
                    Own.exitGame();
                }

            }
        }
        return false;
        // return this.leaveGame(msg.userid);
    },

    /**
     * 设置玩家已下注
     * @param num
     */
    setCostChip:function (data) {
        var player = this.findPlayerById(data.userid);
        player.setCostChip(data.betnum);
    },

    /**
     * 设置玩家输赢
     * @param data
     */
    setWinNum:function (data) {
        var player = this.findPlayerById(data.userid);
        player.setWinNum(data.winnum);
    },

    playerReturn : function (userid) {
        var player = this.findPlayerById(userid);
        player.isLeaving = false;
        player.enterGame();
    },

    /**
     * 清除数据
     */
    clearArr:function () {
        for(var i=0; i<this.playerPos_list.length; i++){
           this.playerPos_list.splice(i);
        }

        this.playerData_list = [];
    },

    /**
     * 重置数据
     */
    resetData : function () {
        this.clearArr();
        this.isReconnect = false;
    },

    /**
     * 通过房间管理器设置玩家掉数据
     */
    setPlayerData: function(player_data){
        var player = [];
        player.userid = player_data._userId;
        player.score = player_data.coin;
        player.already = player_data._bready;
        player.fold = false;
        player.isowner = jlmj_room_mgr.Instance().isRoomer(player_data._userId);
        player.pos = player_data.idx;
        player.isleaving = !player_data.isOnLine;
        player.betnum = 0;
        player.bethis = 0;
        player.wxinfo = [];
        player.wxinfo.headurl = player_data.headurl;
        player.wxinfo.openid = player_data.openid;
        player.wxinfo.nickname = player_data._nickname;
        player.wxinfo.sex = player_data._sex;
        var userList = [];
        userList.push(player)
        this.setMsgData(userList);
    },

    /**
     * 通过房间管理器设置桌子的数据
     */
    setDeskData: function(){
        this.deskData.setMsgData({
            freshViewUserId:jlmj_room_mgr.Instance().game_info.userId,
            gameCnt:jlmj_room_mgr.Instance()._Rule.roundcount,
            playerCnt:jlmj_room_mgr.Instance()._Rule.playercount,
            allinCnt:jlmj_room_mgr.Instance()._Rule.allinrate,
            dizhu:jlmj_room_mgr.Instance()._Rule.incbase,
            danzhu:jlmj_room_mgr.Instance()._Rule.basecoin,
            roomNum:jlmj_room_mgr.Instance().game_info.roomId,
        });
    },

    /**
     * 通过房间管理器修改玩家准备状态
     */
    setPlayerReadyState: function(msg){
        var data = [];
        data.userid = msg.userId;
        //data.allready = this.checkAllPlayerReadyState();
        this.setPlayerReadyMsgData(data);
    },

    resetPlayerState: function(){
        this.playerData_list.forEach(function (item) {
            item.isReady = false
        });
        this.setReconnect(false);
    },

    /**
     * 玩家进入
     */
    playerEnter: function(role){
        var data = {
            _userId : role.userId,
            _nickname : role.name,
            _sex : role.sex,
            headurl : cc.dd.Utils.getWX64Url(role.headUrl),
            openid : role.openId,
            _bready : role.isReady ? 1 : 0,
            idx : role.seat,
            isOnLine : role.state == 1,
            coin : role.coin,
        }
        //设置玩家数据
        this.setPlayerData(data);
        //设置桌子数据
        this.setDeskData();
        
    },
    requesYuYinUserData: function(){

    },

    onEventMessage:function (event, data) {
        // switch(event){
        //     case RoomEvent.on_room_ready:
        //         if(data[0].retCode !== 0){
        //             return ;
        //         } else {
        //             if( data[0].gameInfo.gameType != 40 ) {
        //                 return;
        //             }
        //         }
        //         this.setPlayerReadyState(data[0]);
        //         break;
        //     case RoomEvent.on_room_leave:
        //         if(data[0].retCode !== 0){
        //             return ;
        //         } else {
        //             if( data[0].gameInfo.gameType != 40 ) {
        //                 return;
        //             }
        //         }
        //         var msgInfo = [];
        //         msgInfo.result = data[0].retCode;
        //         msgInfo.userid = data[0].userId;
        //         msgInfo.type = LeaveDeskCode.LEAVEDESKTYPE_LEAVE;
        //         this.setLeaveDeskMsgData(msgInfo);
        //         break;
        //     case RoomEvent.room_player_online:
        //         if(data[0].retCode !== 0){
        //             return ;
        //         } else {
        //             if( data[0].gameInfo.gameType != 40 ) {
        //                 return;
        //             }
        //         }
        //         var player = this.findPlayerById(data[0].userId);
        //         player.comeBack();
        //         break;
        // }
    },

    /*****************************************金币场*******************************************/
    setCoinMsgData: function(msg){
        cc.log('[data]playerMgr::setMsgData:',JSON.stringify(msg));
        this.resetPosList();
        this.sortPos(msg);

        this.playerPos_list.forEach(function (item) {
            if(item){
                this.addCoinPlayer(item);
            }
        }.bind(this));
    },

    addCoinPlayer: function(data){
        var playerData = this.createPlayer(data.pos);
        data.selfId = this.selfId;
        playerData.setCoinMsgData(data);
        this.playerData_list.push(playerData);
        playerData.enterGame();

        if(!playerData.isSelf()){
            cc.dd.AudioChat.addUser(playerData.openId);
        }
    }
    /*****************************************金币场*******************************************/
});

module.exports = {
    TdkPlayerEvent:TdkPlayerEvent,
    TdkPlayerED:TdkPlayerED,
    TdkPlayerMgrData:TdkPlayerMgrData,
};