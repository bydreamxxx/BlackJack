//create by wj 2019/3/29
const dsz_config = require('yq_pin3');
const dsz_userState = require('dsz_config').DSZ_UserState;

var New_DSZ_DeskEvent = cc.Enum({
    New_DSZ_DEDSK_SEND_POKER: 'dsz_desk_send_poker',//发牌
    New_DSZ_DEDSK_CALL: 'dsz_desk_call', //跟注
    New_DSZ_DEDSK_UPDATE_CIRCLE: 'dsz_desk_update_circle', //更新轮数
    New_DSZ_DEDSK_COMPARE: 'dsz_desk_compare', //玩家比牌
    New_DSZ_DEDSK_COMPARE_RESULT: 'dsz_desk_compare_result', //比牌结果
    New_DSZ_DEDSK_FOLD: 'dsz_desk_fold', //弃牌
    New_DSZ_DEDSK_SHOW_ROUND_RESULE: 'dsz_desk_show_round_result', //显示单局结算
    New_DSZ_DEDSK_SHOW_RESULE: 'dsz_desk_show_result', //显示总结算
    New_DSZ_DEDSK_DISSOVlE: 'dsz_desk_dissovle', //解散消息
    New_DSZ_DEDSK_DISSOVLE_RESULT: 'dsz_desk_dissovle_reslut', //解散结果
    New_CHECK_PLAYER_ALL_READY:'dsz_chck_player_all_ready', //朋友场断线重连检查玩家是否全部准备
    New_DSZ_DEDSK_ERROR:'dsz_desk_op_error',//玩家操作出错
    New_DSZ_DEDSK_QUICK_RECHARGE: 'dsz_desk_quick_recharge', //快速充值
    New_DSZ_DEDSK_RECONNECT: 'dsz_desk_reconnect', //断线重连
    New_DSZ_RESETPLAYERUI: 'dsz_desk_resetplayerui', //重新设置玩家ui
});

var New_DSZ_DeskED = new cc.dd.EventDispatcher();

var New_DSZ_Desk_Data = cc.Class({
    s_new_dsz_desk_data: null,
    statics: {
        Instance: function () {
            if (!this.s_new_dsz_desk_data) {
                this.s_new_dsz_desk_data = new New_DSZ_Desk_Data();
            }
            return this.s_new_dsz_desk_data;
        },

        Destroy: function () {
            if (this.s_new_dsz_desk_data) {
                this.s_new_dsz_desk_data.clear();
                this.s_new_dsz_desk_data = null;
            }
        },
    },

    properties: {
        curBet: 0, //当前桌子总押注
        curCircle: 0, //当前桌子轮数
        curOpUserId: 0,//当前操作玩家id
        curOpTime: 0,//当前操作剩余时限
        curBetLevel: 0,//当前下注档位
        curGameState: 3,//当前桌子状态，默认为：0 游戏中， 1 结束， 3 未开始
        curRound: 0, //当前桌子局数
        configId: 0, //桌子配置表id
        playerCount: 9, //玩家人数
        roundTotalCount: 0, //总局数
        circleTotalCount: 0, //总轮数
        isReconnectTag: false, //是否断线重连
        lastOpUserId: 0,//上一个操作玩家
        roomId: 0, //房间号
        isEnd: true, //场次是否结束
        isStart: false, //游戏是否开始
        coinRoomId: 0, //金币场配置房间id
        serverPay: 0, //服务费
        isGiveUp: false, //到时弃牌
        dissolvesList: [], //解散投票
        playRule: [],//玩法
        playModle: 1, //玩法模式
        isGps: false,//Gps定位
        gameId: 0, //游戏id：36：朋友场  136：金币场  37:金币自建
        isMidwayAdd: false,

        //朋友场专用
        luckyType: 4, //喜分类型
        luckyPay: 0, //喜分赔付
        luckPokers: 0, //喜分牌型
        fadeTime: 0,//弃牌倒计时

        isRecharge: false,
        isFristEnter: true,
        roundResult: false,
    },

    /**
     * 清除数据
     */
    clear: function () {
        this.curBet = 0;
        this.curCircle = 0;
        this.curOpUserId = 0;
        this.curOpTime = 0;
        this.curBetLevel = 0;
        this.curRound = 0;
        this.lastOpUserId = 0;
        this.dissolvesList.splice(0, this.dissolvesList.length);
        this.playRule.splice(0, this.playRule.length);
        this.playModle = 1;
        this.luckyType = 4;
        this.isStart = false;
        this.isEnd = true;
        this.m_oReconnectData = null;
        this.limitWatch = 0;
    },

    /**
     * 朋友场房间初始化
     */
    initFRoom: function(){
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        this.playerCount = roomMgr._Rule.roleNum;
        this.circleTotalCount = roomMgr._Rule.circleNum;;
        this.roundTotalCount = roomMgr._Rule.boardsCout;
        this.configId = roomMgr._Rule.limitCmp; //暂时该字段作为配置表类型
        this.roomId = roomMgr.roomId;
        this.playModle = roomMgr._Rule.playMod;
        this.playRule = roomMgr._Rule.playRuleList;
        this.isGps = roomMgr._Rule.isGps;
        this.limitWatch = roomMgr._Rule.limitWatch;
        this.luckyType = roomMgr._Rule.luckyType;
        this.luckyPay = roomMgr._Rule.luckyPay;
        this.luckPokers = roomMgr._Rule.luckPokers;
        this.fadeTime = roomMgr._Rule.opTime;
        this.gameId = roomMgr.gameId;
        this.isEnd = false;
        this.isMidwayAdd = roomMgr._Rule.isMidwayAdd;
    },

    /**
     * 金币自建房间初始化
     */
    initCoinRoom: function(){
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        this.playerCount = roomMgr._Rule.roleNum;
        this.configId = roomMgr._Rule.baseScore;
        this.playModle = roomMgr._Rule.playMod;
        this.playRule = roomMgr._Rule.playRuleList;
        this.limitEnter = roomMgr._Rule.limitEnter;
        this.limitLeave = roomMgr._Rule.limitLeave;
        this.limitWatch = roomMgr._Rule.limitWatch;

        this.circleTotalCount = this.getConfigData().limit_circle;

        this.roomId = roomMgr.roomId;
        this.gameId = roomMgr.gameId;
    },

    //金币场初始化
    initCoin: function(roomId){
        this.playerCount = 9;
        this.configId = 13600 + roomId;
        this.coinRoomId = roomId;
        this.circleTotalCount = this.getConfigData().limit_circle;
        this.gameId = 136;
        this.playModle = this.getConfigData().play_type;
        this.playRule = this.getConfigData().play_rule.split(';');
    },


    //对象拷贝
    deepCopy(obj) {
        if (typeof obj != 'object' || obj == null) {
            return obj;
        }
        if (obj instanceof Array) {
            var newobj = [];
        }
        else {
            var newobj = {};
        }
        for (var attr in obj) {
            newobj[attr] = this.deepCopy(obj[attr]);
        }
        return newobj;
    },

    /**
     * 初始化桌子数据
     */
    initDeskData: function(data){
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();

        //桌子基础信息
        this.curBet = data.curBet;
        this.curCircle = data.curCircle;
        this.curOpUserId = data.curOpUserId;
        this.lastOpUserId = data.lastOpUserId;
        this.curOpTime = data.curOpTime;
        this.curBetLevel = data.curBetLevel;
        this.curGameState = data.curGameState;
        this.curRound = data.curRound;
        this.configId = data.configId;
        this.isReconnectTag = data.isReconnect;
        this.roomId = roomMgr.roomId;
        this.dissolvesList = data.dissolvesList;
        this.dissolveTime = data.disvotetime;
        this.gameId = roomMgr.gameId;
        if(this.gameId == 136){
            this.circleTotalCount = this.getConfigData().limit_circle;
            this.playModle = this.getConfigData().play_type;
            this.playRule = this.getConfigData().play_rule.split(';');
            this.coinRoomId = this.configId % 13600;
        }

        if(this.isReconnectTag){
            this.m_oReconnectData = data;
            New_DSZ_DeskED.notifyEvent(New_DSZ_DeskEvent.New_DSZ_DEDSK_RECONNECT);
            return;
        }
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
                    New_DSZ_DeskED.notifyEvent(New_DSZ_DeskEvent.New_DSZ_DEDSK_SEND_POKER);
                }.bind(this), 300);
            }
        }.bind(this));
    },


    /***
     * 断线重连数据
     */
    initDeskReconnectData:function(){
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
        //玩家游戏数据信息
        var userInfo = playerMgr.findPlayerByUserId(this.m_oReconnectData.userInfo.userId);
        if(userInfo)
            userInfo.setPlayerGameInfo(this.m_oReconnectData.userInfo);
        //其他玩家游戏数据信息
        this.m_oReconnectData.otherInfosList.forEach(function(otherUser, index){
            var otherInfo = playerMgr.findPlayerByUserId(otherUser.userId);
            if(otherInfo)
                otherInfo.setPlayerGameInfo(otherUser);
            if(index == this.m_oReconnectData.otherInfosList.length - 1  && this.isReconnectTag){
                setTimeout(function() {
                    //New_DSZ_DeskED.notifyEvent(New_DSZ_DeskEvent.New_DSZ_DEDSK_RECONNECT);
                    New_DSZ_DeskED.notifyEvent(New_DSZ_DeskEvent.New_CHECK_PLAYER_ALL_READY);
                }.bind(this), 1500);
            }
        }.bind(this));
    },


    /**
     * 初始化回放桌子数据
     */
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
        this.curRound = data.curRound;
        this.configId = data.configId;
        this.isReconnectTag = data.isReconnect;
        this.roomId = roomMgr.roomId;
        this.dissolvesList = data.dissolvesList;
        this.dissolveTime = data.disvotetime;
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();

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
    * 获取金币场配置房间id
    */
   getCoinRoomId: function(){
        return this.coinRoomId;
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
     * 获取游戏ID
     */
    getGameId: function(){
        return this.gameId;
    },
    /**
     * 检查是否为朋友场
     */
    checkGameIsFriendType: function(){
        return this.gameId == 36;
    },

    /**
     * 检查是否为金币自建房
     */
    checkGameIsCoinCreateType: function(){
        return this.gameId == 37;
    },

    /**
     * 喜分类型
     */
    getLuckyType: function(){
        return this.luckyType;
    },

    /**
     * 喜分牌型
     */
    getLuckyPoker: function(){
        return this.luckPokers;
    },

    /**
     * 喜分分值
     */
    getLuckyNum: function(){
        return this.luckyPay;
    },

    /**
     * 游戏模式
     */
    getPlayModel: function(){
        return this.playModle;
    },

    /**
     * 弃牌时间
     */
    getFoldTime: function(){
        return this.fadeTime;
    },

    /**
     * 玩法
     */
    getPlayRule: function(){
        return this.playRule;
    },

    /**
     * 闷牌
     */
    getLimitWatch: function(){
        return this.limitWatch;
    },

    /**
     * 获取是否亮底牌
     */
    getWatchAll: function(){
        var canWatch = false;
        this.playRule.forEach(function(type){
            if(type == 4)
                canWatch = true;
        })
        return canWatch;
    },

    /**
     * 检查是否两倍比牌
     */
    getDoubleCompare: function(){
        var isDouble = false;
        this.playRule.forEach(function(type){
            if(type == 3)
                isDouble = true;
        })
        return isDouble;
    },

    /**
     * 是否允许中途加入
     */
    getCanMidwayAdd: function(){
        return this.isMidwayAdd;
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

    /**
     * 玩家比牌下注操作 
     */
    playerCmpOp: function(userId, bet){
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
        playerMgr.playerUpdateChip(userId, bet);
    },

    /**
     * 玩家比牌胜负
     */
    playerCmpResult: function(userId, cmpUserId, winnerId, bet){
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
        playerMgr.playerUpdateChip(userId, bet);

        if(userId != winnerId)
            playerMgr.updatePlayerState(userId, dsz_userState.UserStateLost);
        else
            playerMgr.updatePlayerState(cmpUserId, dsz_userState.UserStateLost);
    },

    /**
     * 玩家跟注/加注/弃牌
     */
    playerNormalOp: function(userId, bet, opType){
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
        playerMgr.playerUpdateChip(userId, bet);
        playerMgr.updatePlayerState(userId, opType);
    },

    /**
     * 结算设置玩家的poker数据
     */
    setPlayerPokers: function(pokerList){
        var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
        pokerList.forEach(function(infos){
            playerMgr.playerResutPokerInfo(infos);
        });
    },

});

module.exports = {
    New_DSZ_Desk_Data : New_DSZ_Desk_Data,
    New_DSZ_Desk_Ed: New_DSZ_DeskED,
    New_DSZ_Desk_Event: New_DSZ_DeskEvent,
};