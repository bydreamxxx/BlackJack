//create by wj 2018/10/15
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
const dsz_userState = require('dsz_config').DSZ_UserState;
const dsz_config = require('pin3');

var DSZ_DeskEvent = cc.Enum({
    DSZ_DEDSK_SEND_POKER: 'dsz_desk_send_poker',//发牌
    DSZ_DEDSK_CALL: 'dsz_desk_call', //跟注
    DSZ_DEDSK_UPDATE_CIRCLE: 'dsz_desk_update_circle', //更新轮数
    DSZ_DEDSK_COMPARE: 'dsz_desk_compare', //玩家比牌
    DSZ_DEDSK_COMPARE_RESULT: 'dsz_desk_compare_result', //比牌结果
    DSZ_DEDSK_FOLD: 'dsz_desk_fold', //弃牌
    DSZ_DEDSK_FIRE: 'dsz_desk_fire', //火拼
    DSZ_DEDSK_ALL_IN: 'dsz_desk_all_in',//孤注一掷
    DSZ_DEDSK_SHOW_ROUND_RESULE: 'dsz_desk_show_round_result', //显示单局结算
    DSZ_DEDSK_SHOW_RESULE: 'dsz_desk_show_result', //显示总结算
    DSZ_DEDSK_DISSOVlE: 'dsz_desk_dissovle', //解散消息
    DSZ_DEDSK_DISSOVLE_RESULT: 'dsz_desk_dissovle_reslut', //解散结果
    CHECK_PLAYER_ALL_READY:'dsz_chck_player_all_ready', //朋友场断线重连检查玩家是否全部准备
    DSZ_DEDSK_ERROR:'dsz_desk_op_error',//玩家操作出错
});

var DSZ_DeskED = new cc.dd.EventDispatcher();

var DSZ_Desk_Data = cc.Class({
    s_dsz_desk_data: null,
    statics: {
        Instance: function () {
            if (!this.s_dsz_desk_data) {
                this.s_dsz_desk_data = new DSZ_Desk_Data();
            }
            return this.s_dsz_desk_data;
        },

        Destroy: function () {
            if (this.s_dsz_desk_data) {
                this.s_dsz_desk_data.clear();
                this.s_dsz_desk_data = null;
            }
        },
    },

    //属性数据
    properties: {
        curBet: 0, //当前桌子总押注
        curCircle: 0, //当前桌子轮数
        curOpUserId: 0,//当前操作玩家id
        curOpTime: 0,//当前操作剩余时限
        curBetLevel: 0,//当前下注档位
        curGameState: 3,//当前桌子状态，默认为：0 游戏中， 1 结束， 2 火拼中， 3 未开始
        fireBet: 0, //火拼下注值
        curRound: 0, //当前桌子局数
        configId: 0, //桌子配置表id
        playerCount: 5, //玩家人数
        roundTotalCount: 0, //总局数
        circleTotalCount: 0, //总轮数
        isReconnectTag: false, //是否断线重连
        lastOpUserId: 0,//上一个操作玩家
        roomId: 0, //房间号
        isWatchPoker: false, //是否结束看所有人牌
        isEnd: false, //场次是否结束
        isStart: false, //游戏是否开始
        coinRoomId: 0, //金币场配置房间id
        totalBetLimit: 0, //总锅底
        serverPay: 0, //服务费
        isGiveUp: false, //到时弃牌
        dissolvesList: [], //解散投票
    },
    /**
     * 清除数据
     */
    clear: function () {
        this.isEnd = false;
        this.isStart = false;
        //this.playerCount = 0;
        this.curCircle = 0;
        this.configId = 0;
        this.curRound = 0;
        this.circleTotalCount = 0;
        this.roundTotalCount = 0;
    },

    //朋友场初始化
    init: function(){
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        this.playerCount = roomMgr._Rule.roleNum;
        this.circleTotalCount = roomMgr._Rule.circleNum;;
        this.roundTotalCount = roomMgr._Rule.boardsCout;
        this.configId = roomMgr._Rule.playRule;
        this.roomId = roomMgr.roomId;
        this.isWatchPoker = roomMgr._Rule.isWatchall;
        this.totalBetLimit = roomMgr._Rule.limitScore;
        this.isGiveUp = roomMgr._Rule.isGiveup
    },

    //金币场初始化
    initCoin: function(roomId){
        this.playerCount = 5;
        this.coinRoomId = roomId;

        this.configId = parseInt(135 + '0' + this.coinRoomId);
        this.circleTotalCount = this.getConfigData().limit_circle;
    },

    //初始化桌子数据信息
    initDeskInfo: function(data){
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        //桌子基础信息
        this.curBet = data.curBet;
        this.curCircle = data.curCircle;
        this.curOpUserId = data.curOpUserId;
        this.lastOpUserId = data.lastOpUserId;
        this.curOpTime = data.curOpTime;
        this.curBetLevel = data.curBetLevel;
        this.curGameState = data.curGameState;
        this.fireBet = data.fireBet;
        this.curRound = data.curRound;
        this.configId = data.configId;
        this.isReconnectTag = data.isReconnect;
        this.roomId = roomMgr.roomId;
        if(this.circleTotalCount == 0)
            this.circleTotalCount = this.getConfigData().limit_circle;
        this.coinRoomId = this.configId % 13500;
        this.dissolvesList = data.dissolvesList;
        this.dissolveTime = data.disvotetime;



        //玩家游戏数据信息
        var userInfo = playerMgr.findPlayerByUserId(data.userInfo.userId);
        if(userInfo)
            userInfo.setPlayerGameInfo(data.userInfo);
        //其他玩家游戏数据信息
        data.otherInfosList.forEach(function(otherUser, index){
            var otherInfo = playerMgr.findPlayerByUserId(otherUser.userId);
            if(otherInfo)
                otherInfo.setPlayerGameInfo(otherUser);
            if(index == data.otherInfosList.length - 1 && data.userInfo.userState != 1 && !this.isReconnectTag){
                setTimeout(function() {
                    DSZ_DeskED.notifyEvent(DSZ_DeskEvent.DSZ_DEDSK_SEND_POKER);
                }.bind(this), 1500);
            }else if(index == data.otherInfosList.length - 1  && this.isReconnectTag){
                setTimeout(function() {
                    DSZ_DeskED.notifyEvent(DSZ_DeskEvent.CHECK_PLAYER_ALL_READY);
                }.bind(this), 1500);
            }
        }.bind(this));
    },

    //初始化回放桌子数据
    initRecordDesk: function(data){
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        //桌子基础信息
        this.curBet = data.curBet;
        this.curCircle = data.curCircle;
        this.curOpUserId = data.curOpUserId;
        this.lastOpUserId = data.lastOpUserId;
        this.curOpTime = data.curOpTime;
        this.curBetLevel = data.curBetLevel;
        this.curGameState = data.curGameState;
        this.fireBet = data.fireBet;
        this.curRound = data.curRound;
        this.configId = data.configId;
        this.isReconnectTag = data.isReconnect;
        this.roomId = roomMgr.roomId;
        if(this.circleTotalCount == 0)
            this.circleTotalCount = this.getConfigData().limit_circle;
        this.dissolvesList = data.dissolvesList;
        this.dissolveTime = data.disvotetime;



        //玩家游戏数据信息
        var userInfo = playerMgr.findPlayerByUserId(data.userInfo.userId);
        if(userInfo)
            userInfo.setPlayerGameInfo(data.userInfo);
        //其他玩家游戏数据信息
        data.otherInfosList.forEach(function(otherUser, index){
            var otherInfo = playerMgr.findPlayerByUserId(otherUser.userId);
            if(otherInfo)
                otherInfo.setPlayerGameInfo(otherUser);
        }.bind(this));
    },

    /**
     * 
     * 获取玩家总人数
     */
    getPlayerCount: function(){
        return this.playerCount;
    },

    /**
     * 
     * 获取总局数 
     */
    getTotalRoundCount: function(){
        return this.roundTotalCount;
    },

    /**
     * 
     * 获取总轮数
     */
    getTotalCircleCount: function(){
        return this.circleTotalCount;
    },

    /**
     * 
     * 锅底限制
     */
    getTotalScroLimit: function(){
        return this.totalBetLimit;
    },

    /**
     * 设置当前桌子总押注
     */
    setCurBet: function(totalBet){
        this.curBet = totalBet;
    },

    /**
     * 获取当前桌子总押注
     */
    getCurBet: function(){
        return this.curBet;
    },

    /**
     * 更新当前桌子总压注
     */
    updateCurBet: function(bet){
        this.curBet += bet;
    },

    /**
     * 设置当前轮数
    */
   setCurCircle: function(circle){
       this.curCircle = circle;
   },

   /**
    * 获取当前轮数
    */
   getCurCircle: function(){
       return this.curCircle;
   },

   /**
    * 设置当前操作人
    */
   setCurOpUser: function(userId){
        this.curOpUserId = userId;
   },

   /**
    * 设置上一个操作人
    */
   setLastOpUser: function(userId){
        this.lastOpUserId = userId;
   },

   /**
    * 获取上个操作玩家
    */
   getLastOpUser:function(){
        return this.lastOpUserId;
   },
   /**
    * 获取当前操作人
    */
   getCurOpUser: function(){
       return this.curOpUserId;
   },

   /**
    * 设置当前操作剩余时间
    */
   setCurOpTime: function(timer){
        this.curOpTime = timer;
   },

   /**
    * 获取当前操作剩余时间
    */
   getCurOpTime: function(){
       return this.curOpTime;
   },

   /**
    * 设置当前下注档位
    */
   setCurBetLevel: function(betLevel){
       this.curBetLevel = betLevel;
   },

   /**
    * 获取当前下注档位
    */
   getCurBetLevel: function(){
       return this.curBetLevel;
   },

   /**
    * 设置当前桌子状态
    */
   setCurDeskState: function(state){
       this.curGameState = state;
   },

   /**
    * 获取当前桌子状态
    */
   getCurDeskState: function(){
       return this.curGameState;
   },

   /**
    *设置当前火拼值
    */
   setFireBet: function(fireBet){
       this.fireBet = fireBet;
   },

   /**
    * 获取当前火拼值
    */
   getFireBet: function(){
        return this.fireBet;
   },

   /**
    * 设置当前局数
    */
   setCurRound: function(round){
       this.curRound = round;
   },

   /**
    * 获取当前局数
    */
   getCurRound: function(){
       return this.curRound;
   },

   /**
    * 获取配置表数据
    */
   getConfigData: function(){
        //通过id查询数据
        var self = this;
        const data = dsz_config.getItem(function(item){
            if(item.key == self.configId)
                return item; 
        });
        if(data)
            return data
        return null;
   },   

   /**
    * 获取是否为断线重连标记
    */
   getIsReconnectTag: function(){
        return this.isReconnectTag;
   },

   /**
    * 获取房间id
    */
   getRoomId: function(){
       return this.roomId;
   },

   /**
    * 获取是否结算看所有人牌
    */
   getWatchAll: function(){
        return this.isWatchPoker;
   },

   /**
    * 获取到时弃牌
    */
   getIsGiveUp: function(){
        return this.isGiveUp;
   },

   /**
    * 获取金币场配置房间id
    */
   getCoinRoomId: function(){
        return this.coinRoomId;
   },

    /**
    * 获取服务费
    */
   setServerPay: function(serverPay){
    this.serverPay = serverPay;
},

   /**
    * 获取服务费
    */
   getServerPay: function(){
        return this.serverPay;
   },

   /**
    * 返回解散列表
    */
   getDissolveList: function(){
        return this.dissolvesList;
   },

   /**
    * 返回解散剩余时间
    */
   getDissolveTime: function(){
       return this.dissolveTime;
   },

   /**
    * 检查是否需要解散房间
    */
   checkDissolve: function(){
        if(this.dissolvesList.length != 0)
            return true;
        return false;
   },
   /**
    * 重置桌子的数据
    */
   resetDeskData:function(){
        this.curBet = 0; //重置当前总筹码
        this.curBetLevel = 0; //重置当前下注档位
        this.curCircle = 0; //重置当前轮数
        this.curOpUserId = 0; //重置当前操作玩家
        this.lastOpUserId = 0; //重制上一个操作玩家
        this.dissolvesList.splice(0, this.dissolvesList.length);
    },
   //////////////////////////////////玩家桌子操作///////////////////////////
    /**
     * 玩家比牌下注操作 
     */
    playerCmpOp: function(userId, bet){
        playerMgr.playerUpdateChip(userId, bet);
    },

    /**
     * 玩家比牌胜负
     */
    playerCmpResult: function(userId, cmpUserId, winnerId, bet){
        playerMgr.playerUpdateChip(userId, bet);

        if(userId != winnerId)
            playerMgr.updatePlayerState(userId, dsz_userState.UserStateLost);
        else
            playerMgr.updatePlayerState(cmpUserId, dsz_userState.UserStateLost);
    },

    /**
     * 玩家孤注一掷
     */
    playerGambledOp: function(userId, bet, iswin){
        playerMgr.playerUpdateChip(userId, bet);
        if(!iswin)
            playerMgr.updatePlayerState(userId, dsz_userState.UserStateLost);
    },

    /**
     * 玩家火拼消息返回
     */
    playerFireOp: function(userId, bet){
        var player = playerMgr.findPlayerByUserId(userId);
        if(player){
            var coefficient = (player.getPlayerGameInfo().pokersState == 0 ? 1: 2);
            playerMgr.playerUpdateChip(userId, bet * coefficient);
        }
        playerMgr.updatePlayerState(userId, dsz_userState.UserStateFire);
    },

    /**
     * 玩家跟注/加注/弃牌
     */
    playerNormalOp: function(userId, bet, opType){
        playerMgr.playerUpdateChip(userId, bet);
        playerMgr.updatePlayerState(userId, opType);
    },

    /**
     * 结算设置玩家的poker数据
     */
    setPlayerPokers: function(pokerList){
        pokerList.forEach(function(infos){
            playerMgr.playerResutPokerInfo(infos);
        });
    },
});

module.exports = {
    DSZ_Desk_Data : DSZ_Desk_Data,
    DSZ_Desk_Ed: DSZ_DeskED,
    DSZ_Desk_Event: DSZ_DeskEvent,
};
