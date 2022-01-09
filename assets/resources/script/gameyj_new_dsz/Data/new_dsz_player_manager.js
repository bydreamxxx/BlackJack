// create by wj 2019/3/29
var Define = require("Define");

////////////////////////////////////////////玩家操作通信信息枚举begin/////////////////////////////
var New_DSZ_PlayerEvent = cc.Enum({
    New_DSZ_PLAYER_COME_BACK: 'dsz_player_come_back', //玩家重连消息
    New_DSZ_PLAYER_ENTER: 'dsz_player_enter', //玩家进入游戏
    New_DSZ_PLAYER_READY: 'dsz_player_ready', //玩家准备消息
    New_DSZ_PLAYER_INIT_DATA: 'dsz_player_init_data', //实例化玩家游戏数据
    New_DSZ_PLAYER_OP_STATE: 'dsz_player_op_state', //玩家操作/状态更新
    New_DSZ_PLAYER_WATCH_POKER: 'dsz_player_watch_poker', //玩家看牌
    New_DSZ_PLYER_EXIT: 'dsz_player_exit', //玩家离开房间
    New_PLAYER_ISONLINE: 'dsz_player_isonline', //玩家在线
    New_DSZ_PLAYER_CLEAR: 'dsz_ player_clear', //游戏清除
    New_DSZ_PLAYER_COIN_CHANGE: 'dsz_player_coin_change', //金币充值修改
    New_DSZ_PLAYER_AUTO_CHANGE: 'dsz_player_auto_change', //斗三张托管状态
});
////////////////////////////////////////////玩家操作通信信息枚举end/////////////////////////////
var New_DSZ_PlayerED = new cc.dd.EventDispatcher();

////////////////////////////////////////////玩家基础信息Begin///////////////////////////////
var New_DSZ_PlayerData = cc.Class({
    properties: {
        userId: 0, //玩家id
        isRoomer: false, //是否为房主
        playerCommonInfo: null, //玩家通用信息
        dszPlayerInfo: null, //玩家游戏数据
        recordOriginPlayerCommonInfo: null, //回放使用的玩家初始数据
        recordOriginPlayerInfo: null, //回放使用的玩家初始游戏数据
    },

    //获取玩家基础信息
    getPlayerCommonInfo: function () {
        return this.playerCommonInfo;
    },

    //设置玩家游戏数据
    setPlayerGameInfo: function (roleInfo) {
        this.dszPlayerInfo = this.cloneDeep(roleInfo);
        if(roleInfo.userState == 11)
            this.playerCommonInfo.isReady = true;
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_INIT_DATA, this.userId);
        //this.recordOriginPlayerInfo = this.cloneDeep(roleInfo);
    },

    //获取玩家游戏数据
    getPlayerGameInfo: function () {
        return this.dszPlayerInfo;
    },

    //设置玩家的poker数据
    setPlayerPokers: function (pokers) {
        this.dszPlayerInfo.pokers = pokers;
        this.dszPlayerInfo.pokersState = 1;
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_WATCH_POKER, this.userId);
    },

    setPlayerRecordPokers: function (pokers) {
        this.dszPlayerInfo.pokersState = 1;
    },

    setPlayerResultPokers: function (pokers) {
        this.dszPlayerInfo.pokers = pokers;
        this.dszPlayerInfo.pokersState = 1;
    },

    //更新玩家总下注
    updatePlayerBet: function (bet) {
        cc.log('playerbetscore===========' + this.dszPlayerInfo.betScore);
        this.dszPlayerInfo.betScore += bet;
        cc.log('playerbetscore===========' + this.dszPlayerInfo.betScore);
    },

    //更新玩家上次操作下注
    updatePlayerLastBet: function (bet) {
        this.dszPlayerInfo.lastBet = bet;
    },

    //更新玩家身上筹码
    updatePlayerChips: function (bet) {
        this.dszPlayerInfo.curScore -= bet;
    },

    //更新玩家状态
    updatePlayerState: function (state) {
        this.dszPlayerInfo.userState = state;
        // DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.DSZ_PLAYER_OP_STATE, this.userId);
    },

    //更新玩家牌状态
    updatePlayerPokerState: function (state) {
        this.dszPlayerInfo.pokersState = state;
    },

    //重置个人的信息
    resetData: function () {
        if (this.dszPlayerInfo) {
            this.dszPlayerInfo.userState = 0; //重置玩家状态
            this.dszPlayerInfo.lastBet = 0; //重制玩家上手投注
            this.dszPlayerInfo.betScore = 0;//重置玩家下注
            this.dszPlayerInfo.pokersState = 0; //重置未看牌
        }

        this.playerCommonInfo.isReady = false; //重置玩家未准备
    },

    //获取玩家初始记录信息
    getPlayerRecordCommonInfo: function () {
        return this.recordOriginPlayerCommonInfo;
    },

    //获取玩家初始记录游戏数据
    getPlayerRecordGameInfo: function () {
        return this.recordOriginPlayerInfo;
    },

    cloneDeep: function (obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = this.cloneDeep(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },

    //将玩家数据全部重置
    reverseRecrodData: function () {
        this.dszPlayerInfo = null;
        // this.playerCommonInfo = this.cloneDeep(this.recordOriginPlayerCommonInfo);
        // this.dszPlayerInfo = this.cloneDeep(this.recordOriginPlayerInfo);
    },

    /////////////////////////////玩家通信操作begin///////////////////////////////////////
    /**
     * 玩家重连
     */
    comeBack: function () {
        cc.log('================ playercomback')
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_COME_BACK, this.userId);
    },

    /**
     * 玩家进入游戏
     */
    enterGame: function () {
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_ENTER, this.userId);
    },
    /**
     * 玩家准备
     */
    setReady: function (isReady) {
        this.playerCommonInfo.isReady = isReady;
        cc.log('====================ready');
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_READY, this.userId);
    },

    /**
     * 更新玩家在线
     */
    setOnLine: function (isOnline) {
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_PLAYER_ISONLINE, [this, isOnline]);
    },

    /**
     * 玩家离开房间
     */
    exit: function () {
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLYER_EXIT, this.playerCommonInfo);
    },

    /**
     * 金币更新
     */
    updateCoin: function(){
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_COIN_CHANGE, this.userId);
    },

    /**
     * 设置玩家托管状态
     */
    setPlayerAutoState: function(status){
        this.playerCommonInfo.autoFlag = status;
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.New_DSZ_PLAYER_AUTO_CHANGE, this.userId);
    },
    /////////////////////////////玩家通信操作end///////////////////////////////////////
});
////////////////////////////////////////////玩家基础信息End///////////////////////////////
///////////////////////////////////////////////玩家管理器Begin/////////////////////////////
var New_DSZ_PlayerMgr = cc.Class({
    s_new_dsz_player_data: null,
    statics: {
        Instance: function () {
            if (!this.s_new_dsz_player_data) {
                this.s_new_dsz_player_data = new New_DSZ_PlayerMgr();
            }
            return this.s_new_dsz_player_data;
        },

        Destroy: function () {
            if (this.s_new_dsz_player_data) {
                this.s_new_dsz_player_data = null;
            }
        },
    },

    /**
     * 初始化数据
     */
    ctor: function () {
        //玩家信息
        this.playerInfo = null;
        this.m_bIsSort = false;

        this.m_tLastRoundPlayer = [];
    },

    /**
     * 清除数据
     */
    clear: function () {
        this.playerInfo.splice(0, this.playerInfo.length);
        this.viewerInfo.splice(0, this.viewerInfo.length);
        this.m_tLastRoundPlayer.splice(0, this.m_tLastRoundPlayer.length);
        this.viewerInfo = null;
        this.playerInfo = null;
        this.m_bIsSort = false;
    },


    cloneDeep: function (obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = this.cloneDeep(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },

    /**
     * 实例化玩家基础数据
     */
    genPlayerData: function (role_info) {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        var playerData = new New_DSZ_PlayerData;
        playerData.userId = role_info.userId;
        playerData.isRoomer = roomMgr.isRoomer(role_info.userId);
        playerData.isLeave = false;
        playerData.playerCommonInfo = role_info;
        playerData.recordOriginPlayerCommonInfo = this.cloneDeep(role_info);
        return playerData;
    },

    /**
     * 根据玩家id查询玩家数据
     */
    findPlayerByUserId: function (userId) {
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                    return this.playerInfo[i];
                }
            }
        }
    },

    /**
     * 根据玩家id查询旁观玩家数据
     */
    findViewerByUserId: function (userId) {
        if (this.viewerInfo && this.viewerInfo.length) {
            for (var i = 0; i < this.viewerInfo.length; i++) {
                if (this.viewerInfo[i] && this.viewerInfo[i].userId == userId) {
                    return this.viewerInfo[i];
                }
            }
        }
    },

    /**
     * 获取玩家数据
     */
    getPlayer: function (userId) {
        return this.findPlayerByUserId(userId);
    },

    /**
     * 根据玩家客户端座位号获取玩家数据
     */
    findPlayerByUserPos: function (pos) {
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].getPlayerCommonInfo().pos == pos) {
                    return this.playerInfo[i];
                }
            }
        }
    },

    /**
     * 获取真实的玩家有几人
     */
    getRealPlayerCount: function () {
        var count = 0;
        this.playerInfo.forEach(function (player) {
            if (player && !player.isLeave)
                count += 1;
        });
        return count;
    },

    /**
     * 获取庄家位置
     */
    getBankerClientPos: function () {
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].getPlayerGameInfo().isBanker) {
                    return this.playerInfo[i].getPlayerCommonInfo().pos;
                }
            }
        }

    },

    //更新玩家数量
    /**
     * 可重写
     */
    updatePlayerNum: function () {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();
        var deskData = require('teenpatti_desk').Teenpatti_Desk_Data.Instance();

        if (roomMgr.gameId == 36)
            deskData.initFRoom();
        else if (roomMgr.gameId == 37)
            deskData.initCoinRoom();

        if (roomMgr.gameId == Define.GameType.NEW_DSZ_FRIEND)
            this.gamePlayerNum = roomMgr._Rule.roleNum;
        else
            this.gamePlayerNum = 6;
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId) {
                    this.playerInfo.splice(i, 1);
                }
            }
        }

        if (this.viewerInfo && this.viewerInfo.length) {
            for (var i = 0; i < this.viewerInfo.length; i++) {
                if (this.viewerInfo[i] && this.viewerInfo[i].userId) {
                    this.viewerInfo.splice(i, 1);
                }
            }
        }
        this.playerInfo = new Array(this.gamePlayerNum);
        this.viewerInfo = [];
        New_DSZ_PlayerED.notifyEvent(New_DSZ_PlayerEvent.DSZ_PLAYER_CLEAR);
    },


    //玩家进入
    playerEnter: function (role_info) {
        if(this.playerInfo == null)
            return;
        if (this.findPlayerByUserId(role_info.userId)) {//判定玩家是否为断线重连
            this.findPlayerByUserId(role_info.userId).comeBack();
            return;
        }
        var player = this.genPlayerData(role_info);
        var index = player.getPlayerCommonInfo().seat;
        if (index != -1)
            this.playerInfo[index] = player;
        else {
            var count = this.viewerInfo.length + 1;
            this.viewerInfo[count] = player;
        }
        this.sortPlayersPos(); //重排客户端座位
        //this.playerInfo[index].enterGame(); //通知当前新玩家进入
    },

    //重新安排玩家的座位
    sortPlayersPos: function () {
        var own = this.findPlayerByUserId(cc.dd.user.id);
        if (own) {
            this.playerInfo.forEach(function (player) {
                if (player) {
                    var index = player.getPlayerCommonInfo().seat;
                    if (player.userId != cc.dd.user.id) {
                        if (own && this.playerInfo[index].getPlayerCommonInfo().pos == null) {
                            this.playerInfo[index].getPlayerCommonInfo().pos = (index - own.getPlayerCommonInfo().seat + this.gamePlayerNum) % this.gamePlayerNum;
                            this.playerInfo[index].enterGame();
                        }
                    } else if (own.getPlayerCommonInfo().pos == null) { //自己位置默认为0
                        this.playerInfo[index].getPlayerCommonInfo().pos = 0;
                        this.playerInfo[index].enterGame();
                    }
                }

            }.bind(this));
        } else {
            own = this.findViewerByUserId(cc.dd.user.id);
            if (own) {
                this.playerInfo.forEach(function (player) {
                    if (player) {
                        var index = player.getPlayerCommonInfo().seat;
                        if (player.userId != cc.dd.user.id) {
                            this.playerInfo[index].getPlayerCommonInfo().pos = index
                            this.playerInfo[index].enterGame();
                        }
                    }

                }.bind(this));

            }
        }
    },

    /**
     * 检查所有玩家是否全部准备完成
     */
    checkPlayerAllReady: function () {
        var isReadyAll = true;
        this.playerInfo.forEach(function (player) {
            if (player && !player.isRoomer && !player.getPlayerCommonInfo().isReady && !player.isLeave)
                isReadyAll = false;
        });
        return isReadyAll;
    },

    /**
     * 检查所有玩家游戏中是否全部准备完成
     */
    checkPlayerAllGameReady: function () {
        var isReadyAll = true;
        this.playerInfo.forEach(function (player) {
            if (player && !player.isRoomer && player.getPlayerGameInfo() && player.getPlayerGameInfo().userState != 11 && !player.isLeave)
                isReadyAll = false;
        });
        return isReadyAll;
    },

    /**
     * 玩家总下注与筹码更新
     */
    playerUpdateChip: function (userId, bet) {
        var player = this.findPlayerByUserId(userId);
        if (player && player.getPlayerGameInfo()) {
            player.updatePlayerBet(bet);
            player.updatePlayerLastBet(bet);
            player.updatePlayerChips(bet);
        }
    },

    /**
     * 玩家状态更新
     */
    updatePlayerState: function (userId, state) {
        var player = this.findPlayerByUserId(userId);
        if (player && player.getPlayerGameInfo())
            player.updatePlayerState(state);
    },



    //玩家离开
    playerExit: function (userId) {
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                this.playerInfo[i].isLeave = true;
                this.playerInfo[i].exit();
                this.playerInfo[i] = null;
                break;
            }
        }

        for (var i = 0; i < this.viewerInfo.length; i++) {
            if (this.viewerInfo[i] && this.viewerInfo[i].userId == userId) {
                this.playerInfo[i].isLeave = true;
                this.viewerInfo[i].exit();
                this.viewerInfo.splice(i, 1);
                break;
            }
        }
        //this.playerNumChanged();
    },

    /**
     * 玩家poker信息
     */
    playerPokerInfo: function (poker) {
        var player = this.findPlayerByUserId(poker.userId);
        if (player)
            player.setPlayerPokers(poker)
    },

    playerRecordPokerInfo: function (poker) {
        var player = this.findPlayerByUserId(poker.userId);
        if (player)
            player.setPlayerRecordPokers(poker)
    },

    /**
     * 设置结算的玩家poker信息
     */
    playerResutPokerInfo: function (poker) {
        var player = this.findPlayerByUserId(poker.userId);
        if (player)
            player.setPlayerResultPokers(poker)
    },

    /**
     * 重置所有玩家的数据信息
     */
    resetAllPlayerData: function () {
        if(this.playerInfo == null)
            return;
        this.playerInfo.forEach(function (player) {
            if (player)
                player.resetData();
        });
    },

    /**
     * 保存上一局玩家
     */
    setLastRoundPlayer: function (tUserIdList) {
        this.m_tLastRoundPlayer.splice(0, this.m_tLastRoundPlayer.length);
        this.m_tLastRoundPlayer = tUserIdList;
    },

    /**
     * 更新玩家金币
     */
    updatePlayerCoin: function(userId, coin){
        var player = this.findPlayerByUserId(userId);
        if(player){
            var player_common_data = player.getPlayerCommonInfo();
            if(player_common_data){
                player_common_data.coin = coin;
            }

            var player_game_data = player.getPlayerGameInfo();
            if(player_game_data)
                player_game_data.curScore = coin;
        }
        player.updateCoin();
    },

    /**
     * 检测当前局玩家是否有变动
     */
    checkPlayerChanged: function () {
        if (this.m_tLastRoundPlayer.length < this.getRealPlayerCount())
            return true;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i]) {
                var flag = false;
                for (var j = 0; j < this.m_tLastRoundPlayer.length; j++) {
                    if (this.playerInfo[i] && this.m_tLastRoundPlayer[j] == this.playerInfo[i].userId) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false)
                    return true;
            }
        }
        return false;
    },

    /**
     * 注册房间内语音玩家
     */
    requesYuYinUserData: function () {
        cc.dd.AudioChat.clearUsers();
        if (this.playerInfo) {
            this.playerInfo.forEach(function (player) {
                if (player) {
                    if (player.userId != cc.dd.user.id) { // && player.isOnLine
                        cc.dd.AudioChat.addUser(player.userId);
                    }
                }
            }, this);
        }
    },

    ////////////////////////////////////////////////////回放功能Begin/////////////////////////////////////
    //更新玩家数量
    /**
     * 可重写
     */
    updateRecordPlayerNum: function () {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        this.gamePlayerNum = roomMgr._Rule.roleNum;
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId) {
                    this.playerInfo.splice(i, 1);
                }
            }
        }
        this.playerInfo = new Array(this.gamePlayerNum);
    },
    //玩家进入
    playerRecordEnter: function (role_info, ownEnter) {
        if (this.findPlayerByUserId(role_info.userId)) {//判定玩家是否为断线重连
            this.findPlayerByUserId(role_info.userId).comeBack();
            return;
        }
        var player = this.genPlayerData(role_info);
        var index = player.getPlayerCommonInfo().site; //位置字段区别       
        this.playerInfo[index] = player;
        this.sortRecordPlayersPos(ownEnter);
    },

    //重新安排玩家的座位
    sortRecordPlayersPos: function (ownEnter) {
        if (ownEnter) {
            var own = this.findPlayerByUserId(cc.dd.user.id);
            if (own) {
                this.playerInfo.forEach(function (player) {
                    if (player) {
                        var index = player.getPlayerCommonInfo().site;
                        if (player.userId != cc.dd.user.id) {
                            if (own && this.playerInfo[index].getPlayerCommonInfo().pos == null) {
                                this.playerInfo[index].getPlayerCommonInfo().pos = (index - own.getPlayerCommonInfo().site + this.gamePlayerNum) % this.gamePlayerNum;
                                this.playerInfo[index].getPlayerRecordCommonInfo().pos = this.playerInfo[index].getPlayerCommonInfo().pos;
                                this.playerInfo[index].enterGame();
                            }
                        } else if (own.getPlayerCommonInfo().pos == null) {
                            this.playerInfo[index].getPlayerCommonInfo().pos = 0;
                            this.playerInfo[index].enterGame();
                            this.playerInfo[index].getPlayerRecordCommonInfo().pos = 0;
                        }
                    }

                }.bind(this));
            }
        } else {
            this.playerInfo.forEach(function (player) {
                if (player) {
                    var index = player.getPlayerCommonInfo().site;
                    if (player.userId != cc.dd.user.id) {
                        if (this.playerInfo[index].getPlayerCommonInfo().pos == null) {
                            this.playerInfo[index].getPlayerCommonInfo().pos = this.playerInfo[index].getPlayerCommonInfo().site
                            this.playerInfo[index].getPlayerRecordCommonInfo().pos = this.playerInfo[index].getPlayerCommonInfo().pos;
                            this.playerInfo[index].enterGame();
                        }
                    }
                }
            }.bind(this));

        }
    },

    //重置初始状态
    reverseRecordData: function () {
        this.playerInfo.forEach(function (player) {
            if (player) {
                player.reverseRecrodData();
            }
        });
    },
    ////////////////////////////////////////////////////回放功能end///////////////////////////////////////

});

module.exports = {
    New_DSZ_PlayerMgr: New_DSZ_PlayerMgr,
    New_DSZ_PlayerED: New_DSZ_PlayerED,
    New_DSZ_PlayerEvent: New_DSZ_PlayerEvent,
};