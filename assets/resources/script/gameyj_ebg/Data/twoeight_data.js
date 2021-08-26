
/**
 * 事件管理
 */
var TE_Event = cc.Enum({
    ROOM_STATE: 'TE_ROOM_STATE',      //房间状态
    PLAYER_JOIN: 'TE_PLAYER_JOIN',    //玩家进入
    PLAYER_EXIT: 'PLAYER_EXIT',         //玩家离开
    BET: 'TE_BET',                    //下注
    BET_OTHER: 'TE_BET_OTHER',        //其他人下注
    BANKER_RET: 'TE_BANKER_RET',      //上庄返回
    RESULT: 'TE_RESULT',              //结算
    RECONNECT: 'TE_RECONNECT',        //重连
    UPDATE_REQ_BANKER: 'TE_R_BANKER', //申请上庄人数刷新
    UPDATE_BANKER_LISET: 'UPDATE_BANKER_LISET',  //更新庄家
    UPDATE_BATTLE: 'UPDATE_BATTLE',     //战绩更新
    UPDATE_SITE: 'UPDATE_SITE',     //上座位置更新
    CHIPS_ANIM: 'CHIPS_ANIM',     //座位上玩家投注飞筹码
    RANK_LIST: 'RANK_LIST',     //排行榜
    SITE_PLAYER: 'SITE_PLAYER',   //座位上玩家赢
    UPDATE_GOLD: 'UPDATE_GOLD',   //金币同步
});
var TE_ED = new cc.dd.EventDispatcher();

var twoeight_Data = cc.Class({
    s_twoeight_data: null,
    statics: {
        Instance: function () {
            if (!this.s_twoeight_data) {
                this.s_twoeight_data = new twoeight_Data();
            }
            return this.s_twoeight_data;
        },

        Destroy: function () {
            if (this.s_twoeight_data) {
                this.s_twoeight_data.clear();
                this.s_twoeight_data = null;
            }
        },
    },
    clear() {
        this.playerList = [];
        this.bankerList = [];
        this.battleHistory = [];
        this.reqBankerlist = [];
        this.sitelist = [];
        this.winStreaklist = [];
        this.bigwinnerlist = [];
        this.roomStatus = 0;
        this.curRound = 0;
        this.posBetMe = [-1, 0, 0, 0];
        this.historyBet = [-1, 0, 0, 0];
        this.posBetTotal = [-1, 0, 0, 0];
        this.betChipArea = [[], [], []];
        this.resultPokerList = [];
        // this.resultWinList = null;
        this.myBankerRank = 0;
        this.lotteryGold = 0;
        this.bankerJackpot = 0;
        this.playerJackpot = 0;
        this.sitePlayerWin = [];

    },

    ctor() {
        this.playerList = [];
        this.bankerList = [];
        this.battleHistory = [];
        this.reqBankerlist = [];
        this.sitelist = [];
        this.winStreaklist = [];
        this.bigwinnerlist = [];
        this.roomStatus = 0;
        this.curRound = 0;
        this.posBetMe = [-1, 0, 0, 0];
        this.historyBet = [-1, 0, 0, 0];
        this.posBetTotal = [-1, 0, 0, 0];
        this.betChipArea = [[], [], []];
        this.resultPokerList = [];
        // this.resultWinList = null;
        this.myBankerRank = 0;
        this.lotteryGold = 0;
        this.bankerJackpot = 0;
        this.playerJackpot = 0;
        this.sitePlayerWin = [];
    },
    resetData() {
        this.lotteryGold = 0;
        this.sitePlayerWin = [];
        this.winStreaklist = [];
        this.betChipArea = [[], [], []];
        // this.reqBankerlist = [];
        this.posBetMe = [-1, 0, 0, 0];
        this.posBetTotal = [-1, 0, 0, 0];
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
            //-------------游戏内数据---------------
            setReady(r) { },
            setOnLine(ol) { },
        }
        return playerData;
    },

    /**
        * 庄闲人数
        * @param {Boolean} isBanker 
        */
    getBankerNum(isBanker) {
        let sum = 0;
        this.playerList.forEach(player => {
            if (player.isBanker == isBanker)
                ++sum;
        });
        return sum;
    },
    /**
     * 获取下注分数
     * @param {Number} pos 
     */
    getBetScore(pos) {
        var bet_all = this.posBetTotal[1] + this.posBetTotal[2] + this.posBetTotal[3];
        return { me: this.posBetMe[pos], total: this.posBetTotal[pos], all: bet_all };
    },

    getPlayer(id) {
        return this.getPlayerById(id);
    },
    //是否在申请上庄列表
    getBanker(id) {
        let state = false
        for (let i = 0; i < this.reqBankerlist.length; i++) {
            let item = this.reqBankerlist[i]
            if (item.userId == id) {
                state = true
                break
            }
        }
        return state;
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
     * 获取庄闲列表
     * @param {Boolean} isBanker true为庄家列表 false为闲家列表
     */
    getBankerList(isBanker) {
        let list = [];
        this.playerList.forEach(player => {
            if (player.isBanker == isBanker)
                list.push(player);
        });
        return list;
    },

    /**
     * 获取我的小计
     * @param {Number} pos  位置1-4
     */
    getMyPosResult(pos) {
        let myresult = this.resultMineList;
        if (myresult && myresult.length) {
            for (var i = 0; i < myresult.length; i++) {
                if (myresult[i].id == pos) {
                    return myresult[i].sum;
                }
            }
        }
        return null;
    },

    //获取自己下注总和
    getMyBetTotal() {
        let all = 0;
        for (i = 1; i < 4; i++) {
            all += this.posBetMe[i];
        }
        return all;
    },
    /**
   * 玩家进入
   * @param {player_common_data} role_info 
   */
    playerEnter(role_info) {
        var p = this.getPlayerById(role_info.userId);
        var isBanker = p ? p.isBanker : false;
        this.deletePlayerData(role_info.userId);
        var player = this.createCommonPlayer(role_info);
        player.isBanker = isBanker;
        this.playerList.push(player);
        TE_ED.notifyEvent(TE_Event.PLAYER_JOIN, player);
    },

    deletePlayerData(id) {
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == id) {
                this.playerList.splice(i, 1);
                break;
            }
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
        TE_ED.notifyEvent(TE_Event.PLAYER_EXIT, null);
    },
    /**
    * 设置申请上庄列表
    * @param {*} data 
    */
    setBankerList(data) {
        let { type, gold, userId } = data;
        if (type == 1) {
            this.reqBankerlist.push({ userId, gold });
        } else {
            for (var i = 0; i < this.reqBankerlist.length; i++) {
                if (this.reqBankerlist[i].userId == userId) {
                    this.reqBankerlist.splice(i, 1);
                    break;
                }
            }
        }

    },
    getBattleList() {
        return this.battleHistory;
    },
    //获取游戏ID
    getGameId() {
        return this.m_nGameId;
    },

    //获取房间ID
    getRoomId() {
        return this.m_nRoomid;
    },
    //获取三副牌的输赢 
    getIsWinBankerList() {
        let list = [];
        this.resultPokerList.forEach(element => {
            if (element.id != 0) {
                var data = { id: element.id, isWinBanker: element.isWinBanker };
                list.push(data);
            }
        });

        list = list.sort((a, b) => { return a.id - b.id; });
        return list;
    },
    /**
  * 获取结算牌堆
  * @param {*} id 
  */
    getPokersById(id) {
        if (this.resultPokerList) {
            for (var i = 0; i < this.resultPokerList.length; i++) {
                if (this.resultPokerList[i].id == id) {
                    return { pokers: this.resultPokerList[i].pokersList, type: this.resultPokerList[i].pokerType };
                }
            }
        }
        return null;
    },
    setPokerList(pokerlist) {
        let winTimes = 0;
        for (var i = 0; i < pokerlist.length; i++) {
            pokerlist[i].pokerType = this.setCardType(pokerlist[i].pokersList);
            if (pokerlist[i].id != 0) {
                if (pokerlist[i].isWinBanker == 1) {
                    winTimes++;
                }
            }
        }
        this.resultPokerList = pokerlist;
        this._winBankerTimes = winTimes;
    },
    //设置牌型
    setCardType(pokersList) {
        let poker1 = Math.floor(pokersList[0] / 10);
        let poker2 = Math.floor(pokersList[1] / 10);
        if (poker1 == poker2) {
            return 10
        } else {
            let sum = poker1 + poker2;
            if (sum < 10) {
                return sum
            } else if (sum == 10) {
                return poker1 == 2 || poker1 == 8 ? 11 : 0;
            } else {
                if (poker1 > 9 && poker2 > 9) {
                    return 0
                } else if (poker1 > 9 || poker2 > 9) {
                    let min = Math.min(poker1, poker2);
                    return min;
                } else {
                    return (sum % 10)
                }
            }
        }
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
    updatePlayerNum() { },
    requesYuYinUserData() { },
})

module.exports = {
    twoeight_Data: twoeight_Data,
    TE_ED: TE_ED,
    TE_Event: TE_Event,
};