var dd = cc.dd;
var hallData = require('hall_common_data').HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
/**
 * 事件类型
 */
var PDK_Event = cc.Enum({
    INIT_ROOM: 'INIT_ROOM',                 //初始化房间
    HAND_POKER: 'HAND_POKER',               //发牌
    UPDATE_STATUS: 'UPDATE_STATUS',         //状态改变
    PLAY_POKER: 'PLAY_POKER',               //出牌返回
    AUTO_RET: 'AUTO_RET',                   //托管返回
    RESULT_RET: 'RESULT_RET',                //单局结算  
    RECONNECT: 'RECONNECT',                  //重连
    GAME_END: 'GAME_END',                    //游戏结束
    PLAYER_OFFLINE: 'PLAYER_OFFLINE',        //玩家掉线
    BG_CLICK: 'BG_CLICK',                    //点击背景
    MINGPAI: 'MINGPAI',                      //明牌(测试用)
    UPDATE_ROOM_PLAYER_NUM: 'UPDATE_PNUM',   //更新桌内玩家数量（用于隐藏邀请按钮）
    UPDATE_BASESCORE: 'UPDATE_BASESCORE',    //更新底分 (比赛场动态底分)
    UPDATE_NUMFULL: 'UPDATE_NUMFULL',        //淘汰人数已满
    PLAYER_READY: 'PLAYER_READY',            //玩家准备
    PLAYER_ENTER: 'PLAYER_ENTER',            //玩家进入
    PLAYER_EXIT: 'PLAYER_EXIT',              //玩家离开
    ZHANJI: 'ZHANJI',                       //战绩统计
    DISSOLVE: 'DISSOLVE',                   //解散
    DISSOLVE_RESULT: 'DISSOLVE_RESULT',     //解散结果
    PLAYER_ISONLINE: 'PLAYER_ISONLINE',     //玩家离线或者上线
    PYC_NEXT: 'PYC_NEXT',                   //朋友场继
    KONGPAI: 'KONGPAI',                     //控牌
    UPDATE_SCORE: 'UPDATE_SCORE',           //比赛场分享加积分
    SCORE_SHARE_RET: 'SCORE_SHARE_RET',     //分享返回
    UPDATE_TIMEOUT: 'UPDATE_TIMEOUT',       //更新出牌超时
});

/**
 * 事件管理
 */
var PDK_ED = new dd.EventDispatcher();

var PDK_Data = cc.Class({

    s_pdk_data: null,
    statics: {
        Instance: function () {
            if (!this.s_pdk_data) {
                this.s_pdk_data = new PDK_Data();
            }
            return this.s_pdk_data;
        },

        Destroy: function () {
            if (this.s_pdk_data) {
                this.s_pdk_data.clear();
                this.s_pdk_data = null;
            }
        },
    },

    /**
     * 初始化数据
     */
    ctor: function () {
        this.itemList = [1009, 1008, 1011, 1013, 1007, 1012, 1010];
        //几人游戏
        this.gamePlayerNum = 3;
        // 房间类型
        this.m_nKey = 0;
        // 游戏ID
        this.m_nGameId = 0;
        // 房间ID
        this.m_nRoomid = 0;
        // 房间标题
        this.m_strTitle = "";
        // 规则底分
        this.m_nBaseScore = 0;
        // 低于分数进入
        this.m_nUnderScore = 0;
        // 高于分数进入
        this.m_nExceedScore = 0;
        // 低于玩家人数
        this.m_nUnderPlayerNum = 0;
        // 高于玩家人数
        this.m_nExceedPlayerNum = 0;
        // 描述房间信息
        this.m_strDesc = "";

        // 是否匹配中
        this.m_bIsMatching = false;
        // 是否已开始
        this.m_bIsStart = false;
        // 是否已结算
        this.m_bIsEnd = false;
        // 是否断线重连
        this.m_bIsReconnect = false;

        //桌子信息
        this.deskInfo = null;
        //玩家信息
        this.playerInfo = null;
    },

    /**
     * 清除数据
     */
    clear: function () {
        //桌子信息
        this.deskInfo = null;
        //玩家信息
        this.playerInfo = null;
    },

    /**
     * 设置 金币场 数据
     * @param data
     */
    setData: function (data) {
        this.m_nKey = data.key;
        this.m_nGameId = data.gameid;
        this.m_nRoomid = data.roomid;
        this.m_strTitle = data.titel;
        this.m_nBaseScore = data.basescore;
        this.m_nUnderScore = data.entermin;
        this.m_nExceedScore = data.entermax;
        this.m_nUnderPlayerNum = data.playernummin;
        this.m_nExceedPlayerNum = data.playernummax;
        this.m_strDesc = data.desc;
    },

    /**
     * 获取游戏ID
     * @returns {*|number}
     */
    getGameId: function () {
        return this.m_nGameId;
    },

    /**
     * 获取游戏ID
     * @returns {*|number}
     */
    getRoomId: function () {
        return this.m_nRoomid;
    },


    /**
     * 设置是否匹配中
     * @param value
     */
    setIsMatching: function (value) {
        if (!cc.dd.Utils.isNull(value)) {
            this.m_bIsMatching = value;
        }
    },

    /**
     * 获取是否匹配中
     * @returns {*|number}
     */
    getIsMatching: function () {
        return this.m_bIsMatching;
    },

    /**
     * 设置是否已开始
     * @param value
     */
    setIsStart: function (value) {
        if (!cc.dd.Utils.isNull(value)) {
            this.m_bIsStart = value;
        }
    },

    /**
     * 获取是否已开始
     * @returns {*|number}
     */
    getIsStart: function () {
        return this.m_bIsStart;
    },

    /**
     * 设置是否已结算
     * @param value
     */
    setIsEnd: function (value) {
        if (!cc.dd.Utils.isNull(value)) {
            this.m_bIsEnd = value;
        }
    },

    /**
     * 获取是否已结算
     * @returns {*|number}
     */
    getIsEnd: function () {
        return this.m_bIsEnd;
    },

    updateScore(msg) {
        var userId = msg.userId;
        var curScore = msg.curScore;
        var player = this.getPlayer(userId);
        if (player) {
            var changeScore = curScore - player.score;
            player.score = curScore;
            PDK_ED.notifyEvent(PDK_Event.UPDATE_SCORE, [userId, changeScore, curScore]);
        }
    },

    //座位号转view ID
    seatToView: function (seat) {
        var playerID = hallData.getInstance().userId;
        var index = -1;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == playerID) {
                index = i;
                break;
            }
        }
        var view = seat - index;
        if (view < 0) {
            view += this.gamePlayerNum;
        }
        return view;
    },
    //玩家id转view ID
    idToView: function (id) {
        var index = -1;
        if (!this.playerInfo) {
            return null;
        }
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == id) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return null;
        }
        return this.seatToView(index);
    },

    //更新玩家数量（二人斗地主、三人、四人）
    updatePlayerNum: function () {
        this.gamePlayerNum = 3;//todo:改成实际人数
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId) {
                    this.playerExit(this.playerInfo[i].userId);
                }
            }
        }
        this.playerInfo = new Array(this.gamePlayerNum);
    },

    //房间是否满员
    getIsRoomFull: function () {
        var num = 0;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i]) {
                num++;
            }
        }
        return num == this.gamePlayerNum;
    },

    //玩家进入
    playerEnter: function (role_info) {
        var player = this.genPlayerData(role_info);
        this.playerInfo[player.site] = player;
        PDK_ED.notifyEvent(PDK_Event.PLAYER_ENTER, player);
        this.playerNumChanged();
    },
    //玩家离开
    playerExit: function (userId) {
        if (userId == cc.dd.user.id) {
            this.playerInfo = [];
            return;
        }
        var view = this.idToView(userId);
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                this.playerInfo[i] = null;
            }
        }
        PDK_ED.notifyEvent(PDK_Event.PLAYER_EXIT, view);
        this.playerNumChanged();
    },

    initGamePlayerData: function (playerList) {
        if (!this.playerInfo || !this.playerInfo.length)
            return;
        for (var i = 0; i < playerList.length; i++) {
            for (var j = 0; j < this.playerInfo.length; j++) {
                if (this.playerInfo[j] && this.playerInfo[j].userId == playerList[i].userId) {
                    this.playerInfo[j].score = playerList[i].score;
                    this.playerInfo[j].isAuto = playerList[i].isAuto;
                    this.playerInfo[j].handPokerNum = playerList[i].handPokerNum;
                    this.playerInfo[j].isPrepared = playerList[i].isPrepared;
                }
            }
        }
    },

    genPlayerData: function (role_info) {
        var playerData = {
            userId: role_info.userId,
            name: role_info.name,
            sex: role_info.sex,
            headUrl: role_info.headUrl,
            score: role_info.score ? role_info.score : 0,
            ip: null,
            site: role_info.seat,
            state: role_info.state,
            openId: role_info.openId,
            winTimes: role_info.winTimes,
            totalTimes: role_info.totalTimes,
            coin: role_info.coin,
            isReady: role_info.isReady,
            level: role_info.level,
            exp: role_info.exp,
            vipLevel: role_info.vipLevel,
            location: role_info.latlngInfo,
            isSwitch: role_info.isSwitch,
            netState: role_info.netState,
            setReady: function (isReady) {
                this.isReady = isReady;
                PDK_ED.notifyEvent(PDK_Event.PLAYER_READY, this);
            },
            setOnLine: function (isOnline) {
                PDK_ED.notifyEvent(PDK_Event.PLAYER_ISONLINE, [this, isOnline]);
            },
        }
        return playerData;
    },

    playerNumChanged: function () {
        PDK_ED.notifyEvent(PDK_Event.UPDATE_ROOM_PLAYER_NUM);
    },

    /**
     * 通过id获取用户
     */
    getPlayer: function (userId) {
        if (!this.playerInfo)
            return null;
        var player = null;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                player = this.playerInfo[i];
                break;
            }
        }
        return player;
    },

    getPlayerByView(viewId) {
        if (!this.playerInfo)
            return null;
        var player = null;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.idToView(this.playerInfo[i].userId) == viewId) {
                player = this.playerInfo[i];
                break;
            }
        }
        return player;
    },

    getPlayerList() {
        return this.playerInfo;
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

    //获取出牌倒计时
    getPlayerTimeout(id) {
        const times = [0, 15, 30, 60, 90, 15];
        var rule = RoomMgr.Instance()._Rule;
        if (rule && rule.playTimeout) {
            return times[rule.playTimeout];
        }
        return 15;
    },

    getPlayerTimeoutByView(view) {
        const times = [0, 15, 30, 60, 90, 15];
        var rule = RoomMgr.Instance()._Rule;
        if (rule && rule.playTimeout) {
            return times[rule.playTimeout];
        }
        return 15;
    },

    //判断是否可以开局
    getIsAllReady() {
        if (!this.playerInfo)
            return false;
        var rule = RoomMgr.Instance()._Rule;
        var minRoleNum = rule ? rule.roomRoleNum : 3;
        var playerNum = 0;
        var readyNum = 0;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i]) {
                playerNum++;
                if (this.playerInfo[i].isReady) {
                    readyNum++;
                }
            }
        }
        if (playerNum < 2)
            return false;
        if (readyNum < playerNum - 1)
            return false;
        if (playerNum < minRoleNum)
            return false;
        return true;
    },
});

module.exports = {
    PDK_Event: PDK_Event,
    PDK_ED: PDK_ED,
    PDK_Data: PDK_Data,
};
