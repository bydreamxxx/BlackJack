/**
 * Created by wang on 2017/6/26.
 */

var dd = cc.dd;
var tdk = dd.tdk;

var TdkDeskData = require('tdk_desk_data');
var DeskData = TdkDeskData.TdkDeskData;

var TdkPlayerMgrData = require('tdk_playerMgr_data');
var PlayerMgrData = TdkPlayerMgrData.TdkPlayerMgrData;

var TdkOperationData = require('tdk_operation_data');
var OperationData = TdkOperationData.TdkOperationData;

var TdkRoomEvent = cc.Enum({
    ZHAN_JI : 'tdk_room_zhan_ji', //游戏战绩
    JIE_SAN_SHEN_QING : 'tdk_room_jie_san_shen_qing', //解散房间申请
    JIE_SAN_JUE_DING : 'tdk_room_jie_san_jue_ding', //解散决定
    JIE_SAN_JIE_GUO : 'tdk_room_jie_san_jie_guo', //解散结果
    RETURN_GAME : 'tdk_room_return_game', //返回游戏
    INIT : 'tdk_room_init', //初始化
    LAN_GUO : 'tdk_room_lan_guo', //烂锅
    ROOM_ALREADY_JIE_SAN : 'tdk_room_already_jie_san', //房间已经解散
    ADD_VOTE_PLAYER : 'tdk_room_add_vote_player', //增加投票玩家
    CLEAR_VIEW:'tdk_room_clear',
});

var TdkRoomED = new dd.EventDispatcher();

var JieSanData = cc.Class({
    properties:{
        /**
         * 玩家id
         */
        userid:0,
        /**
         * 是否同意解散
         */
        desicion:false,
    },

    ctor:function () {

    },

    setMsgData:function (msg) {
        this.userid = msg.userid;
        this.desicion = msg.desicion;
    },
});

var TdkRoomData = cc.Class({

    _instance:null,

    statics:{
        Instance:function () {
            if(!this._instance){
                this._instance = new TdkRoomData();
            }
            return this._instance;
        },

        Destroy:function () {
            if(this._instance){
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
         * 消息接受玩家对象
         */
        userid:0,
        /**
         * 桌子基本数据
         */
        deskInfo:null,
        /**
         * 玩家管理数据对象
         */
        playerMgrData:null,
        /**
         * 游戏操作数据对象
         */
        operationData:null,
        /**
         * 当前游戏局数
         */
        currentGameCnt:0,

        /**
         * 战绩
         */
        zhanjiData:[],

        /**
         * 是否正在解散
         */
        disdeciding:false,
        /**
         * 解散发起人
         */
        disrequserid:0,
        /**
         * 解散房间申请数据
         */
        jiesanshenqingData:null,
        /**
         * 解散房间决定数据
         */
        jiesanjuedingData:null,
        /**
         * 解散房间结果数据
         */
        jiesanjieguoData:null,

        /**
         * 玩家解散选择结果列表
         */
        jiesanData_list:[],
        isReconnect:false,
        /**
         * 是否烂锅
         */
        isLanGuo:false,
        /**
         * 房间不存在
         */
        roomNonExist:false,

        /**
         * 解散倒计时
         */
        disVoteTime:0,

        intervalId:0,
    },

    ctor:function () {
        this.disVoteTime = 20;
        this.deskInfo = DeskData.Instance();
        this.playerMgrData = PlayerMgrData.Instance();
        this.operationData = OperationData.Instance();
    },

    /**
     * 刷新ui界面，ui层主动请求
     */
    freshView:function (userid) {

        if(tdk.GameData._selfId != userid){
            return;
        }

        if(this.roomNonExist){
            // this.resetData();
            TdkRoomED.notifyEvent(TdkRoomEvent.ROOM_ALREADY_JIE_SAN, this);
            return;
        }

        this.freshViewUserId = userid;
        TdkRoomED.notifyEvent(TdkRoomEvent.INIT, this);
        this.deskInfo.freshView(userid);
        this.playerMgrData.freshView(userid);
        this.operationData.freshView(userid);
        this.roomFreshView(userid);
    },

    roomFreshView:function (userid) {
        if(this.disdeciding){
            TdkRoomED.notifyEvent(TdkRoomEvent.JIE_SAN_SHEN_QING, this);
        }
        if(tdk.GameData.reconnect){
            tdk.GameData.reconnect = false;
            TdkRoomED.notifyEvent(TdkRoomEvent.RETURN_GAME, this);
        }
    },

    /**
     * 所有玩家已准备
     */
    playerAllReady:function () {
        this.currentGameCnt++;
    },

    /**
     * 设置玩家准备数据
     * @param msg
     */
    setPlayerReadyMsgData:function (msg) {
        if(msg.allready){
            cc.log('[data] tdk_room_data::所有玩家已准备！',msg);
            this.playerAllReady();
        }
        this.playerMgrData.setPlayerReadyMsgData(msg);
    },

    /**
     * 设置战绩数据
     * @param msg
     */
    setZhanjiMsgData:function (msg) {
        cc.log('[data] tdk_room_data::战绩:',msg);
        // tdk.GameData.resetData();
        this.roomNonExist = true;

        this.zhanjiData = msg;
        TdkRoomED.notifyEvent(TdkRoomEvent.ZHAN_JI, this);
        // this.resetData();
    },

    resetData:function () {
        cc.log('[data]tdk_room_data::resetData!')
        this.operationData.resetData();
        this.isLanGuo = false;
        this.disdeciding = false;
        this.roomNonExist = false;
        this.disVoteTime = 20;
        window.clearInterval(this.intervalId);
    },

    /**
     * 设置申请解散房间数据
     * @param msg
     */
    setJieSanShenQingMsgData:function (msg) {
        cc.log('[data] tdk_room_data::申请解散:',msg);
        this.jiesanshenqingData = msg;
        this.disdeciding = true;
        this.disrequserid = msg.userid;
        this.disVoteTime = msg.disvotetime;
        msg.disuserList.forEach(function (item) {
            var jsData = new JieSanData();
            jsData.setMsgData({
                userid:item,
                desicion:0,
            });
            this.jiesanData_list.push(jsData);
        }.bind(this));
        this.roomNonExist = msg.disnovote;
        TdkRoomED.notifyEvent(TdkRoomEvent.JIE_SAN_SHEN_QING, this);
    },

    /**
     * 设置解散决定数据
     * @param msg
     */
    setJieSanJueDingMsgData:function (msg) {
        cc.log('[data] tdk_room_data::解散决定:',msg);
        this.jiesanjuedingData = msg;
        for(var i=0; i<this.jiesanData_list.length; i++){
            var item = this.jiesanData_list[i];
            if(msg.userid == item.userid){
                item.desicion = msg.desicion;
                break;
            }
        }
        TdkRoomED.notifyEvent(TdkRoomEvent.JIE_SAN_JUE_DING, msg);
    },

    /**
     * 设置解散房间结果数据
     * @param msg
     */
    setJieSanJieGuo:function (msg) {
        cc.log('[data] tdk_room_data::解散结果:',msg);
        this.jiesanData_list = [];
        this.jiesanjieguoData = msg;
        TdkRoomED.notifyEvent(TdkRoomEvent.JIE_SAN_JIE_GUO, msg);
        if(msg.disresult){
            this.roomNonExist = true;
        }
    },

    /**
     * 玩家离开
     * @param msg
     */
    setLeaveDeskMsgData:function (msg) {
        var exit = this.playerMgrData.setLeaveDeskMsgData(msg);
        if(exit && tdk.GameData._selfId == msg.userid){
            // this.resetData();
        }
    },

    /**
     * 设置玩家返回数据
     * @param msg
     */
    setReturnMsgData:function (msg) {
        tdk.GameData._selfId = cc.dd.user.id;
        cc.dd.SceneManager.enterGame(Math.floor(msg.deskid / 10000));

        this.resetData();
        TdkRoomED.notifyEvent(TdkRoomEvent.CLEAR_VIEW, this);

        tdk.GameData.isGaming = true;
        if(tdk.GameData._selfId == msg.userid){
            tdk.GameData.reconnect = true;
            this.userid = msg.userid;
            if(msg.round == 'undefined'){
                msg.round = 1;
            }
            this.currentGameCnt = msg.round;
            tdk.GameData.curGameCnt = msg.round;

            this.deskInfo.setMsgData({
                gameCnt:msg.deskconfig.roundcount,
                playerCnt:msg.deskconfig.playercount,
                allinCnt:msg.deskconfig.allinrate,
                dizhu:msg.deskconfig.incbase,
                danzhu:msg.deskconfig.basecoin,
                roomNum:msg.deskid,
            });

            this.playerMgrData.setReconnectMsgData(msg.userdataList);
            this.playerMgrData.setReconnect(true);
            this.playerMgrData.setCurRound(msg.userid, msg.round);

            msg.userpokerList.forEach(function (item) {
                item.pokerlistList.forEach(function (poker) {
                    this.playerMgrData.setSendPokerMsgData({
                        userid:item.userid,
                        pokerid:poker,
                        borrow:item.borrow,
                        score:item.score,
                        totalscore:item.totalscore,
                    });
                }.bind(this));
            }.bind(this));

            var isReady = false;
            msg.userdataList.forEach(function (item) {
                if(item.userid == msg.userid){
                    isReady = item.already;
                }
            });
            this.operationData.setReturnMsgData({
                userid:msg.userid,
                actuserid:msg.actuserid,
                deskstatus:msg.deskstatus,
                genallin:msg.genallin,
                canallin:msg.canallin,
                betnum:msg.betnum,
                isReady:isReady,
            });

            tdk.GameData.maxBet = msg.maxbet;
            this.isLanGuo = msg.islanguo;
            this.disdeciding = msg.disdeciding;
            this.disVoteTime = msg.disvotetime;
            this.disrequserid = msg.disrequserid;
            this.jiesanData_list = msg.desicionList;
            this.jiesanshenqingData = this.jiesanshenqingData || {};
            this.jiesanshenqingData.disnovote = false;
            this.jiesanshenqingData.resultcode = 0 ;

            this.dissolveCountDown();

            if(this.disdeciding){
                TdkRoomED.notifyEvent(TdkRoomEvent.JIE_SAN_SHEN_QING, this);
            }

            TdkRoomED.notifyEvent(TdkRoomEvent.RETURN_GAME, this);
        }else{
            this.playerMgrData.playerReturn(msg.userid);
            if(msg.disdeciding){
                TdkRoomED.notifyEvent(TdkRoomEvent.ADD_VOTE_PLAYER, {userid:msg.userid});
            }
        }
    },

    dissolveCountDown:function () {
        if(typeof this.disVoteTime != 'undefined' && this.disVoteTime > 0){
            var self = this;
            var func = function () {
                self.disVoteTime--;
                if(self.disVoteTime == 0){
                    window.clearInterval(self.intervalId);
                }
            };
            self.intervalId = window.setInterval(func, 1000);
        }
    },
});

module.exports = {
    TdkRoomEvent:TdkRoomEvent,
    TdkRoomED:TdkRoomED,
    TdkRoomData:TdkRoomData,
};