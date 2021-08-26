/**
 * Created by luke on 2018/12/6
 */
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
var SH_Event = cc.Enum({
    ROOM_STATE: 'SH_ROOM_STATE',        //房间状态
    PLAYER_READY: 'SH_PLAYER_READY',    //玩家准备
    OVER_TURN: 'SH_OVER_TURN',          //话事
    PLAYER_JOIN: 'SH_PLAYER_JOIN',      //玩家进入
    PLAYER_EXIT: 'SH_PLAYER_EXIT',      //玩家离开
    BET_RAISE: 'SH_BET_RAISE',          //加注
    BET_SHOWHAND: 'SH_BET_SHOWHAND',    //梭哈
    BET_DISCARD: 'SH_BET_DISCARD',      //弃牌
    BET_CALL: 'SH_BET_CALL',            //跟注
    BET_OPENCARD: 'SH_BET_OPENCARD',    //开牌
    BET_PASS: 'SH_BET_PASS',            //过
    DEAL_CARD: 'SH_DEAL_CARD',          //发牌
    SHOW_CARD: 'SH_SHOW_CARD',          //显示牌
    RESULT: 'SH_RESULT',                //结算
    TOTAL_RESULT: 'SH_TOTAL_RESULT',    //战绩统计
    RECONNECT: 'SH_RECONNECT',          //重连
    DISSOLVE: 'SH_DISSOLVE',            //解散
    DISSOLVE_RESULT: 'DISSOLVE_RESULT', //解散结果
    FRIEND_READY: 'SH_FRIEND_READY',    //朋友场准备
    UPDATE_SEAT_ROOM: 'SH_UPDATE_SEAT', //刷新桌子
    UPDATE_SEAT_INFO: 'SH_SEAT_INFO',   //刷新某一桌子
    LOOK_CARD: 'SH_LOOK_CARD',          //玩家看牌       
});
var SH_ED = new cc.dd.EventDispatcher();

const CardType = {  //牌类型
    Invalid: -1,                //无效
    SANPAI: 1,                  //散牌  
    DUI_1: 2,                   //对子
    DUI_2: 3,                   //两对
    SANTIAO: 4,                 //三条
    SHUNZI: 5,                  //顺子
    JINHUA: 6,                  //金花
    HULU: 7,                    //葫芦
    SITIAO: 8,                  //四条
    THS: 9,                     //同花顺
};

const PLAYER_NUM = 5;           //玩家人数

var sh_Data = cc.Class({
    s_sh_data: null,
    statics: {
        Instance: function () {
            if (!this.s_sh_data) {
                this.s_sh_data = new sh_Data();
            }
            return this.s_sh_data;
        },

        Destroy: function () {
            if (this.s_sh_data) {
                this.s_sh_data.clear();
                this.s_sh_data = null;
            }
        },
    },

    clear() {
        this.isFriendGold = null;
        this.isFriend = null;
        this.playerList = [];
        this.watchList = [];
        this.roomStatus = 0;
        this.resultPokerList = null;
        this.resultWinList = null;
    },

    ctor() {
        this.playerList = [];
        this.watchList = [];
        this.roomStatus = 0;
    },

    //重置游戏数据
    resetGameData() {
        this.curPlayer = null;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i]) {
                this.playerList[i].curBet = 0;
                this.playerList[i].allBet = 0;
                this.playerList[i].isDiscard = false;
                this.playerList[i].cardsList = [];
                this.playerList[i].cardtype = null;
                this.playerList[i].isAllin = false;
            }
        }
    },

    /**
    * 初始化玩家公共数据
    * @param {player_common_data} role_info 
    */
    createCommonPlayer(role_info) {
        var playerData = {
            userId: role_info.userId,
            name: role_info.name,
            sex: role_info.sex,
            headUrl: role_info.headUrl,
            score: role_info.score,
            ip: null,
            seat: role_info.seat,
            isOnLine: role_info.state == 1,
            openId: role_info.openId,
            winTimes: role_info.winTimes,
            totalTimes: role_info.totalTimes,
            coin: role_info.coin,
            bready: role_info.isReady,
            level: role_info.level,
            exp: role_info.exp,
            vipLevel: role_info.vipLevel,
            location: role_info.latlngInfo,
            isSwitch: role_info.isSwitch,
            netState: role_info.netState,
            isBanker: false,
            setReady(r) { this.bready = r; },
            setOnLine(ol) { this.isOnLine = ol; },
            //-------------游戏内数据---------------
            isBanker: false,        //是否庄家
            curBet: 0,              //当前轮下注
            allBet: 0,              //总下注
            cardsList: [],          //手牌列表
            cardtype: -1,           //手牌类型
            isAllin: false,         //梭哈
            isDiscard: false,       //弃牌
            lookPlayer: role_info.lookPlayer,   //观战玩家id
        }
        return playerData;
    },

    //获取最大玩家下注
    getMaxAllBet() {
        let max = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].allBet > max)
                max = this.playerList[i].allBet;
        }
        return max;
    },
    getMaxCurBet() {
        let max = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].curBet > max)
                max = this.playerList[i].curBet;
        }
        return max;
    },
    getMaxCurBetWithout(id) {
        let max = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].curBet > max && this.playerList[i].userId != id)
                max = this.playerList[i].curBet;
        }
        return max;
    },
    getTotalBet() {
        let total = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            total += this.playerList[i].allBet;
        }
        return total;
    },

    /**
     * 通过view获取玩家数据
     * @param {Number} view 
     */
    getPlayerByViewIdx(view) {
        if (this.selfSeat > -1) {
            for (var i = 0; i < this.playerList.length; i++) {
                var pview = -1;
                if (this.playerList[i].seat >= this.selfSeat) {
                    pview = this.playerList[i].seat - this.selfSeat;
                }
                else {
                    pview = this.playerList[i].seat - this.selfSeat + PLAYER_NUM;
                }
                if (view == pview)
                    return this.playerList[i];
            }
        }
        return null;
    },

    getPlayerList() {
        return this.playerList;
    },

    //获取玩家数据
    getPlayer(id) {
        return this.getPlayerById(id);
    },

    /**
     * 通过id获取玩家数据
     * @param {Number} id 
     */
    getPlayerById(id) {
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == id) {
                return this.playerList[i];
            }
        }
        return null;
    },

    /**
     * 获取玩家视觉座位号
     * @param {Number} id 
     */
    getViewById(id) {
        if (this.selfSeat < 0) {
            return -1;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == id) {
                if (this.playerList[i].seat >= this.selfSeat) {
                    return this.playerList[i].seat - this.selfSeat;
                }
                else {
                    return this.playerList[i].seat - this.selfSeat + PLAYER_NUM;
                }
            }
        }
    },

    //获取游戏ID
    getGameId() {
        return this.m_nGameId || RoomMgr.Instance().gameId;
    },

    //获取房间ID
    getRoomId() {
        return this.m_nRoomid || RoomMgr.Instance().roomId;
    },

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
        var player = this.createCommonPlayer(role_info);
        if (player.userId == cc.dd.user.id) {
            if (!player.lookPlayer)
                this.selfSeat = player.seat;
            else
                this.selfSeat = 0;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == player.userId) {
                this.playerList.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.watchList.length; i++) {
            if (this.watchList[i].userId == player.userId) {
                this.watchList.splice(i, 1);
                break;
            }
        }
        if (player.lookPlayer)
            this.watchList.push(player);
        else {
            this.playerList.push(player);
            SH_ED.notifyEvent(SH_Event.PLAYER_JOIN, player);
        }
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
        if (userId == cc.dd.user.id) {
            return;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == userId) {
                this.playerList.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.watchList.length; i++) {
            if (this.watchList[i].userId == userId) {
                this.watchList.splice(i, 1);
                break;
            }
        }
        SH_ED.notifyEvent(SH_Event.PLAYER_EXIT, null);
    },

    //判断是否可以开局
    getIsAllReady() {
        var playerNum = 0;
        var readyNum = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i]) {
                playerNum++;
                if (this.playerList[i].bready) {
                    readyNum++;
                }
            }
        }
        if (playerNum < 2)
            return false;
        if (readyNum < playerNum - 1)
            return false;
        return true;
    },

    /**
     * 设置 金币场 数据
     * @param data
     */
    setData: function (data) {
        this.m_coinData = data;
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

    getBaseScore() {
        let pycBase = 1;
        return this.m_nBaseScore || pycBase;
    },

    //获取是否满员
    getIsRoomFull(max) {
        return this.playerList.length >= max;
    },

    updatePlayerNum() {
        this.playerList = [];
        this.watchList = [];
    },

    requesYuYinUserData() {
        cc.dd.AudioChat.clearUsers();
        if (this.playerList) {
            this.playerList.forEach(function (player) {
                if (player) {
                    if (player.userId != cc.dd.user.id) { // && player.isOnLine
                        cc.dd.AudioChat.addUser(player.userId);
                    }
                }
            });
        }
    },

    updateDeskList(index, deskList) {//更新桌子列表
        this.m_tDeskList = deskList;
        SH_ED.notifyEvent(SH_Event.UPDATE_SEAT_ROOM, deskList);
    },

    updateDeskInfo(opType, deskData) {//更新指定桌子的信息
        // var deskInfo = this.findDeskInfoByRoomId(deskData.roomId);
        // if (deskInfo) {
        //     if (opType == 1) {//加入玩家
        //         deskInfo.rolesList.push(deskData.rolesList[0]); //将玩家数据入栈
        //     } else if (opType == 2) {//玩家离开
        //         for (var i = 0; i < deskInfo.rolesList.length; i++) {
        //             var role = deskInfo.rolesList[i]
        //             if (role.userId == deskData.rolesList[0].userId) {
        //                 deskInfo.rolesList.splice(i, 1);
        //                 break;
        //             }
        //         }
        //     }
        // } else {
        //     if (opType == 1)//加入玩家
        //         this.m_tDeskList.push(deskData);
        // }
        var data = {
            opType: opType,
            _tag: deskData.argsList[0],
            roomId: deskData.roomId,
            role: deskData.rolesList[0],
        }
        SH_ED.notifyEvent(SH_Event.UPDATE_SEAT_INFO, data); //广播更新消息
    },

    findDeskInfoByRoomId(deskId) {
        // for (var deskData of this.m_tDeskList) {
        //     if (deskData.roomId == deskId)
        //         return deskData;
        // }
    },

    //获取观战玩家信息
    getWatchPlayer(id){
        for(var i=0;i<this.watchList.length;i++){
            if(this.watchList[i].userId==id){
                return this.watchList[i];
            }
        }
        return null;
    },
});
module.exports = {
    sh_Data: sh_Data,
    SH_ED: SH_ED,
    SH_Event: SH_Event,
};