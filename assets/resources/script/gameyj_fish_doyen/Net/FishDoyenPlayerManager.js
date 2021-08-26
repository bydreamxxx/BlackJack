// create by wj 2019/09/18
var defaultBetDir = [
    Math.PI / 2,
    -Math.PI / 2,
    -Math.PI / 2,
    -Math.PI / 2,
    Math.PI / 2,
    Math.PI / 2,];


////////////////////////////////////////////玩家操作通信信息枚举begin/////////////////////////////
var Fish_PlayerEvent = cc.Enum({
    Fish_PLAYER_ENTER: 'fish_player_enter', //玩家进入游戏
    Fish_PLAYER_EXIT: 'fish_player_exit', //玩家离开
    FISH_PLAYER_COIN_CHANGE: 'fish_player_coin_change', //玩家金币更新
    FISH_DESK_LIST_UPDATE: 'fish_desk_list_update', //桌子列表更新
    FISH_DESK_UPDATE: 'fish_desk_update', //单张桌子更新
    FISH_I_AM_COMING: 'FISH_I_AM_COMING', //玩家进入
});
////////////////////////////////////////////玩家操作通信信息枚举end/////////////////////////////

var Fish_PlayerED = new cc.dd.EventDispatcher();

// const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
var cloneDeep = function (obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = cloneDeep(obj[key]);   //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}


var Fish_PlayerData = cc.Class({
    properties: {
        userId: 0, //玩家id
        isRoomer: false, //是否为房主
        playerCommonInfo: null, //玩家通用信息
        fishPlayerInfo: null, //玩家游戏数据
        bEnterGame: false
    },

    //获取玩家基础信息
    getPlayerCommonInfo: function () {
        return this.playerCommonInfo;
    },

    //设置玩家游戏数据
    setPlayerGameInfo: function (roleInfo) {
        this.fishPlayerInfo = cloneDeep(roleInfo);
    },

    //获取玩家游戏数据
    getPlayerGameInfo: function () {
        return this.fishPlayerInfo;
    },

    enterGame: function () {
        if (!this.bEnterGame) {
            this.bEnterGame = true;
            Fish_PlayerED.notifyEvent(Fish_PlayerEvent.Fish_PLAYER_ENTER, this.playerCommonInfo.pos);
        }
    },

    exit: function () {
        Fish_PlayerED.notifyEvent(Fish_PlayerEvent.Fish_PLAYER_EXIT, this.userId);
    },

    updateCurCoin: function (curCoin) {
        this.fishPlayerInfo.coin = curCoin;
        Fish_PlayerED.notifyEvent(Fish_PlayerEvent.FISH_PLAYER_COIN_CHANGE, this.playerCommonInfo.pos);
    },
});


var FishPlayerManager = cc.Class({
    statics: {
        fishPlayerManager: null,

        Instance: function () {
            if (this.fishPlayerManager == null) {
                this.fishPlayerManager = new FishPlayerManager();
            }
            return this.fishPlayerManager;
        },

        Destroy: function () {
            if (this.fishPlayerManager) {
                this.fishPlayerManager = null;
            }
        },
    },

    ctor: function () {
        this.playerInfo = [];
        this.m_bFilp = false;
        this.m_tDeskList = [];
        this.m_bSenTag = true;
        this.m_nDeskIndex = 1;
        this.m_DeskTempList = [];
        this.m_tPosPlayerId = [];//保存位置的玩家id数组，玩家退出不清除，进入覆盖
    },

    updatePlayerNum: function () {//更新玩家数组
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId) {
                    this.playerInfo.splice(i, 1);
                }
            }
        }

        this.playerInfo = new Array(6);
    },

    playerEnter: function (role_info) { //玩家进入
        if (this.playerInfo == null)
            return;

        //清楚所有玩家数据，重新创建
        if (role_info.userId == cc.dd.user.id) {
            Fish_PlayerED.notifyEvent(Fish_PlayerEvent.FISH_I_AM_COMING, null);
        }

        if (this.findPlayerByUserId(role_info.userId)) {
            cc.log('捕鱼玩家已存在+=====' + role_info.userId)
            return;
        }
        var player = this.genPlayerData(role_info);
        var index = player.getPlayerCommonInfo().seat;
        if (index != -1)
            this.playerInfo[index] = player;

        this.sortPlayersPos(); //重排客户端座位
    },

    //重新安排玩家的座位
    sortPlayersPos: function () {
        var own = this.findPlayerByUserId(cc.dd.user.id);
        if (own) {
            this.playerInfo.forEach(function (player) {
                if (player) {
                    var index = player.getPlayerCommonInfo().seat; //服务器座位
                    if (player.userId == cc.dd.user.id && own.getPlayerCommonInfo().pos == null) { //自己位置未设置
                        cc.log('comm_seat==========' + own.getPlayerCommonInfo().seat);
                        // let maxSeat = HallCommonData.fishActivityState == 1 ? 2 : 3
                        if (own.getPlayerCommonInfo().seat >= 1 && own.getPlayerCommonInfo().seat <= 2)//位置翻转判定
                            this.m_bFilp = true;
                        var p = this.toClientSite(own.getPlayerCommonInfo().seat + 1);
                        this.playerInfo[index].getPlayerCommonInfo().pos = p;
                        this.m_tPosPlayerId[p] = player.userId;
                        this.playerInfo[index].enterGame();

                    }
                }

            }.bind(this));

            this.playerInfo.forEach(function (player) {
                if (player) {
                    var index = player.getPlayerCommonInfo().seat; //服务器座位
                    if (player.userId != cc.dd.user.id) {
                        if (own && this.playerInfo[index].getPlayerCommonInfo().pos == null) {
                            var p = this.toClientSite(index + 1);
                            this.playerInfo[index].getPlayerCommonInfo().pos = p;
                            this.m_tPosPlayerId[p] = player.userId;
                            this.playerInfo[index].enterGame();
                        }
                    }
                }

            }.bind(this));
        }
    },

    //玩家离开
    playerExit: function (userId) {
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                this.playerInfo[i].exit();
                //this.playerInfo[i] = null;
                break;
            }
        }
    },

    //删除玩家
    deletePlayer: function (userId) {
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                this.playerInfo[i] = null;
                break;
            }
        }
    },

    //设置玩家的游戏数据
    setPlayerGameData: function (player) {
        if (player == null)
            return;
        var playerInfo = this.findPlayerByUserId(player.userId);
        if (playerInfo) {//查询得到玩家房间管理器数据
            var cInfo = playerInfo.playerCommonInfo;
            player.lockFishID = -1; //锁定的鱼id
            player.bulletBetTime = 0; //子弹时间
            player.betDir = defaultBetDir[this.toClientSite(cInfo.seat + 1) - 1]; //方向弧度
            player.foldCoinNum = 0;
            player.buff_id = player.buffId;
            player.betDataid = player.betDataid;
            player.buff_end_time = player.buffTime;
            playerInfo.setPlayerGameInfo(player);
        } else {
            //创建一套假数据
            var roleInfo = {
                userId: player.userId,
                name: player.name,
                headUrl: player.headUrl,
                openId: player.openId,
                seat: player.seatId,
                coin: player.coin,
            }
            this.playerEnter(roleInfo);
            this.setPlayerGameData(player); //再次创建玩家游戏数据
        }

    },
    /**
     * 根据玩家id查询座位号，玩家可能已经退出
     */
    findPosByUserId(userId) {
        for (var i = 0; i < this.m_tPosPlayerId.length; i++) {
            if (this.m_tPosPlayerId[i] == userId) {
                return i;
            }
        }

        return -1;
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
     * 根据玩家id查询玩家数据
     */
    getAllPlayer: function (userId) {
        return this.playerInfo;
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
     * 玩家身上金币更新
     */
    playerCoinChange: function (userId, curScore) {
        var player = this.findPlayerByUserId(userId);
        if (!player)
            return;
        var playerData = player.getPlayerGameInfo();
        if (!playerData)
            return;
        player.startCoin += curScore;
        player.updateCurCoin(curScore);
    },

    toClientSite: function (serverSite) {//座位号翻转为客户端
        // if (serverSite > 2 && HallCommonData.fishActivityState == 1) serverSite += 1;
        if (serverSite > 2) serverSite += 1;
        if (this.m_bFilp)
            return (serverSite - 1 + 3) % 6 + 1;
        else
            return serverSite;
    },

    toClientDir: function (dir) {//方向角转换为客户端
        if (this.m_bFilp)
            return dir + Math.PI;
        else
            return dir;
    },

    /**
     * 实例化玩家基础数据
     */
    genPlayerData: function (role_info) {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        var playerData = new Fish_PlayerData;
        playerData.userId = role_info.userId;
        playerData.startCoin = role_info.coin;
        playerData.isRoomer = roomMgr.isRoomer(role_info.userId);
        playerData.playerCommonInfo = role_info;
        return playerData;
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

    setReady(r) { },
    setOnLine(ol) { },

    clearAllData: function () {
        if (this.playerInfo)
            this.playerInfo.splice(0, this.playerInfo.length);
        this.playerInfo = null;
        this.m_bFilp = false;
        this.m_bSenTag = false;
        this.m_tDeskList.splice(0, this.m_tDeskList.length);
        this.m_nDeskIndex = 1;
        this.m_DeskTempList.splice(0, this.m_DeskTempList.length);
    },

    updateDeskList: function (index, deskList) {//更新桌子列表
        this.m_DeskTempList.splice(0, this.m_DeskTempList.length);
        this.m_DeskTempList = deskList;

        if (deskList.length == 0)
            this.setCanGetListTag(false); //不能再向服务器请求数据
        else {
            this.setCanGetListTag(true);
            for (var desk of deskList) {
                this.m_tDeskList.push(desk); //保存桌子列表数据
            }
            this.updateIndex(index);
            Fish_PlayerED.notifyEvent(Fish_PlayerEvent.FISH_DESK_LIST_UPDATE);
        }
    },

    getDeskTempList: function () {
        return this.m_DeskTempList;
    },

    updateIndex: function (nIndex) {//更新请求索引
        this.m_nDeskIndex = nIndex;
    },

    getDeskIndex: function () {
        return this.m_nDeskIndex;
    },

    setCanGetListTag: function (bTag) {//设置是否可以请求消息
        this.m_bSenTag = bTag;
    },

    getCanGetListTag: function () {
        return this.m_bSenTag;
    },
    getAllDeskList: function () {
        return this.m_tDeskList;
    },

    findDeskInfoByRoomId: function (deskId) {
        for (var deskData of this.m_tDeskList) {
            if (deskData.roomId == deskId)
                return deskData;
        }
    },

    updateDeskInfo: function (opType, deskData) {//更新指定桌子的信息
        var deskInfo = this.findDeskInfoByRoomId(deskData.roomId);
        if (deskInfo) {
            if (opType == 1) {//加入玩家
                deskInfo.rolesList.push(deskData.rolesList[0]); //将玩家数据入栈
            } else if (opType == 2) {//玩家离开
                for (var i = 0; i < deskInfo.rolesList.length; i++) {
                    var role = deskInfo.rolesList[i]
                    if (role.userId == deskData.rolesList[0].userId) {
                        deskInfo.rolesList.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            if (opType == 1)//加入玩家
                this.m_tDeskList.push(deskData);
        }
        var data = {
            opType: opType,
            _tag: deskData.argsList[0],
            roomId: deskData.roomId,
        }
        Fish_PlayerED.notifyEvent(Fish_PlayerEvent.FISH_DESK_UPDATE, data); //广播更新消息
    },

    clearDeskDataByRoomId: function (roomId) {
        for (var i = 0; i < this.m_tDeskList.length; i++) {
            if (this.m_tDeskList[i].roomId == roomId)
                this.m_tDeskList.splice(i, 1);
        }
    },

    getPlayer: function (userid) {
        return null;
    },
});

module.exports = {
    CFishPlayerManager: FishPlayerManager,
    Fish_PlayerED: Fish_PlayerED,
    Fish_PlayerEvent: Fish_PlayerEvent,
};
