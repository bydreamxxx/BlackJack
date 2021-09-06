/**
 * 事件管理
 */
var BRNN_Event = cc.Enum({
    ROOM_STATE: 'BRNN_ROOM_STATE',      //房间状态
    PLAYER_JOIN: 'BRNN_PLAYER_JOIN',    //玩家进入
    PLAYER_EXIT: 'PLAYER_EXIT',         //玩家离开
    BET: 'BRNN_BET',                    //下注
    BET_OTHER: 'BRNN_BET_OTHER',        //其他人下注
    BANKER_RET: 'BRNN_BANKER_RET',      //上庄返回
    BANKER_ADD: 'BRNN_BANKER_ADD',      //上庄
    BANKER_DEL: 'BRNN_BANKER_DEL',      //下庄
    RESULT: 'BRNN_RESULT',              //结算
    RECONNECT: 'BRNN_RECONNECT',        //重连
    UPDATE_REQ_BANKER: 'BRNN_R_BANKER', //申请上庄人数刷新
    UPDATE_BANKER_LISET: 'UPDATE_BANKER_LISET',  //更新庄家
    UPDATE_BATTLE: 'UPDATE_BATTLE',     //战绩更新
});
var BRNN_ED = new cc.dd.EventDispatcher();

const CardType = {  //牌类型
    Invalid: -1,            //无效
    Niu_0: 0,               //无牛
    Niu_1: 1,               //牛1
    Niu_2: 2,               //牛2
    Niu_3: 3,               //牛3
    Niu_4: 4,               //牛4
    Niu_5: 5,               //牛5
    Niu_6: 6,               //牛6
    Niu_7: 7,               //牛7
    Niu_8: 8,               //牛8
    Niu_9: 9,               //牛9
    Niu_10: 10,             //牛牛
    Three: 11,              //三条
    Line: 12,               //顺子
    Color: 13,              //同花
    Silver: 14,             //银牛
    Hulu: 15,               //葫芦
    Gold: 16,               //金牛
    Bomb: 17,               //炸弹
    Small: 18,              //五小牛
    ColorLine: 19,          //同花顺
};

var brnn_Data = cc.Class({
    s_nn_data: null,
    statics: {
        Instance: function () {
            if (!this.s_nn_data) {
                this.s_nn_data = new brnn_Data();
            }
            return this.s_nn_data;
        },

        Destroy: function () {
            if (this.s_nn_data) {
                this.s_nn_data.clear();
                this.s_nn_data = null;
            }
        },
    },

    clear() {
        this.playerList = [];
        this.battleHistory = [];
        this.roomStatus = 0;
        this.posBetMe = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.posBetTotal = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.resultPokerList = null;
        this.resultWinList = null;
        this.reqBankerNum = 0;
        this.myBankerRank = 0;
    },

    ctor() {
        this.playerList = [];
        this.battleHistory = [];
        this.roomStatus = 0;
        this.posBetMe = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.posBetTotal = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.resultPokerList = null;
        this.resultWinList = null;
        this.reqBankerNum = 0;
        this.myBankerRank = 0;
    },

    resetData() {
        this.reqBankerNum = 0;
        this.posBetMe = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.posBetTotal = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    },

    //添加战绩(结算时)
    addBattleHistory(pokerlist) {
        let list = [];
        var self = this;
        pokerlist.forEach(element => {
            if (element.id != 0) {
                var data = { id: element.id, isOk: element.isWinBanker == 1 ? 1 : 0 };
                list.push(data);
            }
            else {
                var hong = self.getHongCardNum(element.pokersList);
                var data = { id: 5, isOk: hong };
                list.push(data);
            }
        });
        if (this.battleHistory.length == 10) {
            this.battleHistory.shift();
        }
        this.battleHistory.push(list);
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


    getBattleList() {
        return this.battleHistory;
    },

    /**
     * 获取下注分数
     * @param {Number} pos 
     */
    getBetScore(pos) {
        var bet_all = this.posBetTotal[1] + this.posBetTotal[2] + this.posBetTotal[3] + this.posBetTotal[4];
        return { me: this.posBetMe[pos], total: this.posBetTotal[pos], all: bet_all };
    },

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
     * 获取是否庄家
     * @param {*} userId 
     */
    getIsBanker(userId) {
        return this.getPlayerById(userId) ? this.getPlayerById(userId).isBanker : false;
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

    getHongCardNum(cards) {
        var hong = 0;
        cards.forEach(card => {
            var value = Math.floor(card / 10);
            var flower = card % 10;
            if (value < 17) {
                if (flower == 1 || flower == 3)
                    ++hong;
            }
            else {
                if (flower == 2)
                    ++hong;
            }
        });
        return hong;
    },

    //获取游戏ID
    getGameId() {
        return this.m_nGameId;
    },

    //获取房间ID
    getRoomId() {
        return this.m_nRoomid;
    },

    //获取四副牌的输赢
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

    //获取自己下注总和
    getMyBetTotal() {
        let all = 0;
        for (i = 1; i < 5; i++) {
            all += this.posBetMe[i];
        }
        return all;
    },

    //获取自己猜红总和
    getMyCaihongTotal() {
        let all = 0;
        for (i = 5; i < 11; i++) {
            all += this.posBetMe[i];
        }
        return all;
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

    /**
     * 获取结算牌堆
     * @param {*} id 
     */
    getPokersById(id) {
        if (this.resultPokerList) {
            for (var i = 0; i < this.resultPokerList.length; i++) {
                if (this.resultPokerList[i].id == id) {
                    return { pokers: this.resultPokerList[i].pokersList, kings: this.resultPokerList[i].kingsList, type: this.resultPokerList[i].pokerType };
                }
            }
        }
        return null;
    },

    //获取排序之后的庄家牌
    getSortedBankerCard() {
        if (this.resultPokerList) {
            for (var i = 0; i < this.resultPokerList.length; i++) {
                if (this.resultPokerList[i].id == 0) {
                    let plist = this.resultPokerList[i];
                    if (plist.kingsList && plist.kingsList.length > 0) {
                        var idx = 0; var jokers = [];
                        for (var j = 0; j < plist.pokersList.length; j++) {//王替换成变化牌
                            if (Math.floor(plist.pokersList[j] / 10) == 17) {
                                jokers.push(plist.pokersList[j]);
                                plist.pokersList.splice(j, 1, plist.kingsList[idx++]);
                            }
                        }
                        var newpokers = this.getSortedCards(plist.pokersList, plist.pokerType);//排序
                        if (plist.kingsList.length == 2) {
                            if (newpokers.indexOf(plist.kingsList[0]) > newpokers.indexOf(plist.kingsList[1])) {
                                let tmp = plist.kingsList[0];
                                plist.kingsList[0] = plist.kingsList[1];
                                plist.kingsList[1] = tmp;
                            }
                        }
                        let changedList = [];
                        for (var j = 0; j < newpokers.length; j++) {//变化牌还原成王
                            var j_idx = plist.kingsList.indexOf(newpokers[j]);
                            if (j_idx != -1 && changedList.indexOf(j_idx) == -1) {
                                newpokers.splice(j, 1, jokers[j_idx]);
                                changedList.push(j_idx);
                            }
                        }
                        return { pokers: newpokers, kings: plist.kingsList, type: plist.pokerType };
                    }
                    else {
                        return { pokers: this.getSortedCards(plist.pokersList, plist.pokerType), kings: [], type: plist.pokerType };
                    }
                }
            }
        }
        return null;
    },

    /**
     * 获取排序后的牌
     * @param {Array<Number>} cards 
     * @param {Number} type
     */
    getSortedCards(cards, type) {
        var getValue = function (card) {
            var value = parseInt(card / 10);
            if (value < 1 || value > 17) {
                cc.log('无效牌:' + card);
                return value;
            }
            else if (value < 11 || value == 17) {
                return value;
            }
            else if (value < 14) {
                return 10;
            }
        };
        var list = [];
        var repeats = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        cards.forEach(element => {
            repeats[Math.floor(element / 10)]++;
        });
        switch (type) {
            case CardType.ColorLine://同花顺
            case CardType.Line://顺子
            case CardType.Color://同花
            case CardType.Silver://银牛
            case CardType.Gold://金牛
            case CardType.Small://五小牛
            case CardType.Niu_0://无牛
                return cards.sort(function (a, b) { return b - a });
                break;
            case CardType.Bomb://炸弹
                var sortlist = cards.sort(function (a, b) { return b - a });
                if (Math.floor(sortlist[0] / 10) == Math.floor(sortlist[1] / 10)) {
                    return sortlist;
                }
                else {
                    return [sortlist[1], sortlist[2], sortlist[3], sortlist[4], sortlist[0]];
                }
                break;
            case CardType.Hulu://葫芦
                var sortlist = cards.sort(function (a, b) { return b - a });
                if (repeats[Math.floor(sortlist[0] / 10)] == 3) {
                    return sortlist;
                }
                else {
                    return [sortlist[2], sortlist[3], sortlist[4], sortlist[0], sortlist[1]];
                }
                break;
            case CardType.Three://三条
                var sortlist = cards.sort(function (a, b) { return b - a });
                if (repeats[Math.floor(sortlist[0] / 10)] == 3) {
                    return sortlist;
                }
                else if (repeats[Math.floor(sortlist[1] / 10)] == 3) {
                    return [sortlist[1], sortlist[2], sortlist[3], sortlist[0], sortlist[4]];
                }
                else {
                    return [sortlist[2], sortlist[3], sortlist[4], sortlist[0], sortlist[1]];
                }
                break;
            case CardType.Niu_10:
            case CardType.Niu_9:
            case CardType.Niu_8:
            case CardType.Niu_7:
            case CardType.Niu_6:
            case CardType.Niu_5:
            case CardType.Niu_4:
            case CardType.Niu_3:
            case CardType.Niu_2:
            case CardType.Niu_1:
                var sortlist = cards.sort(function (a, b) { return b - a });
                for (var i = 0; i < 3; i++) {
                    for (var j = i + 1; j < 4; j++) {
                        for (var k = j + 1; k < 5; k++) {
                            var total = getValue(sortlist[i]) + getValue(sortlist[j]) + getValue(sortlist[k]);
                            if (total % 10 == 0) {
                                list[0] = sortlist[i];
                                list[1] = sortlist[j];
                                list[2] = sortlist[k];
                                var index = 3;
                                for (var l = 0; l < 5; l++) {
                                    if (l == i || l == j || l == k) {
                                        continue;
                                    }
                                    list[index++] = sortlist[l];
                                }
                                return list;
                            }
                        }
                    }
                }
                break;
        }
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
        BRNN_ED.notifyEvent(BRNN_Event.PLAYER_JOIN, player);
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
        BRNN_ED.notifyEvent(BRNN_Event.PLAYER_EXIT, null);
    },

    /**
     * 设置战绩
     * @param {*} data 
     */
    setBattleHistory(data) {
        this.battleHistory = [];
        for (var i = 0; i < data[0].isokList.length; i++) {
            var list = [];
            for (var j = 0; j < data.length; j++) {
                list.push({ id: data[j].id, isOk: data[j].isokList[i] });
            }
            if (this.battleHistory.length == 10) {
                this.battleHistory.shift();
            }
            this.battleHistory.push(list);
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

    /**
     * 天地玄黄手牌排序
     * @param {*} pokerlist 
     */
    setPokerList(pokerlist) {
        let winTimes = 0;
        for (var i = 0; i < pokerlist.length; i++) {
            if (pokerlist[i].id != 0) {
                if (pokerlist[i].kingsList && pokerlist[i].kingsList.length > 0) {
                    var idx = 0; var jokers = [];
                    for (var j = 0; j < pokerlist[i].pokersList.length; j++) {//王替换成变化牌
                        if (Math.floor(pokerlist[i].pokersList[j] / 10) == 17) {
                            jokers.push(pokerlist[i].pokersList[j]);
                            pokerlist[i].pokersList.splice(j, 1, pokerlist[i].kingsList[idx++]);
                        }
                    }
                    pokerlist[i].pokersList = this.getSortedCards(pokerlist[i].pokersList, pokerlist[i].pokerType);//排序
                    if (pokerlist[i].kingsList.length == 2) {//双王 变牌排序
                        if (pokerlist[i].pokersList.indexOf(pokerlist[i].kingsList[0]) > pokerlist[i].pokersList.indexOf(pokerlist[i].kingsList[1])) {
                            let tmp = pokerlist[i].kingsList[1];
                            pokerlist[i].kingsList[1] = pokerlist[i].kingsList[0];
                            pokerlist[i].kingsList[0] = tmp;
                        }
                    }
                    let changedList = [];
                    for (var j = 0; j < pokerlist[i].pokersList.length; j++) {//变化牌还原成王
                        var j_idx = pokerlist[i].kingsList.indexOf(pokerlist[i].pokersList[j]);
                        if (j_idx != -1 && changedList.indexOf(j_idx) == -1) {
                            pokerlist[i].pokersList.splice(j, 1, jokers[j_idx]);
                            changedList.push(j_idx);
                        }
                    }
                }
                else {
                    pokerlist[i].pokersList = this.getSortedCards(pokerlist[i].pokersList, pokerlist[i].pokerType);
                }
                if (pokerlist[i].isWinBanker == 1) {
                    winTimes++;
                }
            }
        }
        this.resultPokerList = pokerlist;
        this._winBankerTimes = winTimes;
    },
    updatePlayerNum() { },
    requesYuYinUserData() { },
});
module.exports = {
    brnn_Data: brnn_Data,
    BRNN_ED: BRNN_ED,
    BRNN_Event: BRNN_Event,
};