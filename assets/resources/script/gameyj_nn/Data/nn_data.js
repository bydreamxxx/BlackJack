var nn_mgr = require('nn_mgr');
var game_room = require("game_room");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var PLAYER_NUM = 9;
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
    Line: 14,               //顺子
    Color: 15,              //同花
    Silver: 12,             //银牛
    Hulu: 16,               //葫芦
    Gold: 13,               //金牛
    Bomb: 17,               //炸弹
    Small: 19,              //五小牛
    ColorLine: 18,          //同花顺
};
var nn_Data = cc.Class({

    s_nn_data: null,
    statics: {
        Instance: function () {
            if (!this.s_nn_data) {
                this.s_nn_data = new nn_Data();
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


    /**
     * 计算牌型
     * @param {Array<Number>} cards 
     */
    analysisCards(cards) {
        //获取牌值
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
        //获取真实牌值
        var getRealValue = function (card) {
            return parseInt(card / 10);
        };
        //是否有牛
        var isNiu = function (cards) {
            for (var i = 0; i < 3; i++) {
                for (var j = i + 1; j < 4; j++) {
                    for (var k = j + 1; k < 5; k++) {
                        var total = getValue(cards[i]) + getValue(cards[j]) + getValue(cards[k]);
                        if (total % 10 == 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        if (!cards || cards.length != 5) {
            cc.log('拼牛失败，牌数据错误:' + cards);
            return CardType.Invalid;
        }
        else {
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] == 0) {
                    cc.log('拼牛失败，牌数据错误:' + cards);
                    return CardType.Invalid;
                }
            }
        }
        var joker_num = 0;
        for (var i = 0; i < cards.length; i++) {
            if (getValue(cards[i]) == 17) {
                joker_num++;
            }
        }
        /***************** 无癞子 *******************/
        if (joker_num == 0) {
            var sum = 0;
            var max_same = 0;
            var list = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0];
            cards.forEach(card => {
                sum += getValue(card);
                var realvalue = getRealValue(card);
                list[realvalue]++;
                max_same = list[realvalue] > max_same ? list[realvalue] : max_same;
            });
            if (sum < 11 && card[0] < 50 && card[1] < 50 && card[2] < 50 && card[3] < 50 && card[4] < 50) {//五小牛
                return CardType.XiaoNiu_5;
            }
            else if ((list[11] + list[12] + list[13]) == 5) {//五花牛
                return CardType.HuaNiu_5;
            }
            else if ((list[11] + list[12] + list[13]) == 4 && list[10] == 1) {//四花牛
                return CardType.HuaNiu_4;
            }
            else if (max_same == 4) {//炸弹
                return CardType.Bomb;
            }
            else {//普通牌型
                if (isNiu(cards)) {
                    var niu = sum % 10;
                    if (niu == 0) {
                        return CardType.Niu_10;
                    }
                    return CardType['Niu_' + niu];
                }
                else {
                    return CardType.Niu_0;
                }
            }
        }
        /***************** 单癞子 *******************/
        else if (joker_num == 1) {
            //TODO
        }
        /***************** 双癞子 *******************/
        else if (joker_num == 2) {
            //TODO
        }
    },

    /**
     * 三张是否组成牛
     * @param {Array<Number>} niu_cards 
     */
    analysisNiu(niu_cards) {
        //获取牌值
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
            else if (value == 14) {
                return 1;
            }
        };
        var joker_num = 0;
        for (var i = 0; i < niu_cards.length; i++) {
            if (getValue(niu_cards[i]) == 17) {
                joker_num++;
            }
        }
        if (joker_num == 0) {
            var total = getValue(niu_cards[0]) + getValue(niu_cards[1]) + getValue(niu_cards[2]);
            if (total % 10 == 0) {
                return true;
            }
            return false;
        }
        else {
            return true;
        }
    },

    /**
     * 清除数据
     */
    clear: function () {
        this.playerList = null;
        this.selfSeat = -1;
        this.roomStatus = 0;
        this.curRound = -1;
        this.autoBet = 0;
        this.autoBank = 0;
        PLAYER_NUM = 9;
    },

    setPlayerNum(num){
        PLAYER_NUM = num;
    },

    /**
     * 初始化数据
     */
    ctor: function () {
        this.playerList = [];
        this.roomStatus = 0;
        this.selfSeat = -1;
        this.curRound = 0;
        this.autoBet = 0;
        this.autoBank = 0;
        PLAYER_NUM = 9;
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
            setReady: function (isReady) {
                this.bready = isReady;
                nn_mgr.Instance().setReady(this.userId);
                //nn_mgr.Instance().updatePlayerHead(this.userId);
            },
            setOnLine: function (isOnline) {
                this.isOnLine = isOnline;
                //nn_mgr.Instance().updatePlayerHead(this.userId);
            },
            //-------------游戏内数据---------------
            isBanker: false,        //是否庄家
            isOpt: false,           //组牌完成
            betOne: -1,             //抢庄倍数
            betTwo: -1,             //下注倍数
            handCards: [],          //手牌列表
            cardtype: -1,           //手牌类型
        }
        return playerData;
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

    //判断是否可以开局
    getIsAllReady() {
        var playerNum = 0;
        var readyNum = 0;
        var rule = RoomMgr.Instance()._Rule;
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
        if (rule && rule.renman && playerNum < 9)
            return false;
        return true;
    },

    //房间是否满员
    getIsRoomFull() {
        var num = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i]) {
                num++;
            }
        }
        return num == this.gamePlayerNum;
    },

    /**
     * 获取最大抢庄倍数（金币场）
     */
    getMaxBank() {
        var getNum = function () {
            var num = 0;
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i] && !this.playerList[i].isWatch) {
                    num++;
                }
            }
            return num;
        }.bind(this);
        var roomcfg = game_room.getItem(function (item) {
            return item.gameid == RoomMgr.Instance().gameId && item.roomid == RoomMgr.Instance().roomLv;
        }.bind(this));
        var tax = roomcfg.tax;
        var basescore = roomcfg.basescore;
        var player_self = this.getPlayerByViewIdx(0);
        const maxType = 10;//五小牛
        const maxBet = 1;
        var maxBank = Math.floor((player_self.coin - tax) / (getNum() - 1) / maxBet / maxType / basescore);
        return maxBank;
    },
    getMaxBankClub() {
        var getNum = function () {
            var num = 0;
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i] && !this.playerList[i].isWatch) {
                    num++;
                }
            }
            return num;
        }.bind(this);
        var basescore = this.m_nBaseScore;
        var player_self = this.getPlayerByViewIdx(0);
        const maxType = 10;//五小牛
        const maxBet = 1;
        var maxBank = Math.floor(player_self.score / (getNum() - 1) / maxBet / maxType / basescore);
        return maxBank;
    },

    /** 
     * 获取最大下注倍数（金币场)
    */
    getMaxBet() {
        var getBank = function () {
            var num = 0;
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i] && this.playerList[i].isBanker) {
                    num = this.playerList[i].betOne;
                    break;
                }
            }
            return num > 0 ? num : 1;
        }.bind(this);
        var roomcfg = game_room.getItem(function (item) {
            return item.gameid == RoomMgr.Instance().gameId && item.roomid == RoomMgr.Instance().roomLv;
        }.bind(this));
        var tax = roomcfg.tax;
        var basescore = roomcfg.basescore;
        var player_self = this.getPlayerByViewIdx(0);
        const maxType = 10;//五小牛
        var maxBet = Math.floor((player_self.coin - tax) / getBank() / maxType / basescore);
        return maxBet;
    },

    getMaxBetClub() {
        var getBank = function () {
            var num = 0;
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i] && this.playerList[i].isBanker) {
                    num = this.playerList[i].betOne;
                    break;
                }
            }
            return num > 0 ? num : 1;
        }.bind(this);
        var basescore = this.m_nBaseScore;
        var player_self = this.getPlayerByViewIdx(0);
        const maxType = 10;//五小牛
        var maxBet = Math.floor(player_self.score / getBank() / maxType / basescore);
        return maxBet;
    },

    /**
     * 获取组成牛的牌
     * @param {Array<Number>} cards 
     */
    getNiuCards(cards) {
        //获取牌值
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
        var joker_num = 0;
        for (var i = 0; i < cards.length; i++) {
            if (getValue(cards[i]) == 17) {
                joker_num++;
            }
        }
        /***************** 无癞子 *******************/
        if (joker_num == 0) {
            for (var i = 0; i < 3; i++) {
                for (var j = i + 1; j < 4; j++) {
                    for (var k = j + 1; k < 5; k++) {
                        var total = getValue(cards[i]) + getValue(cards[j]) + getValue(cards[k]);
                        if (total % 10 == 0) {
                            return [cards[i], cards[j], cards[k]];
                        }
                    }
                }
            }
        }
        /***************** 单癞子 *******************/
        else if (joker_num == 1) {
            //TODO
        }
        /***************** 双癞子 *******************/
        else if (joker_num == 2) {
            //TODO
        }
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
     * 通过view获取玩家数据
     * @param {Number} view 
     */
    getPlayerByViewIdx(view) {
        if (this.selfSeat > -1) {
            return this.playerList[(this.selfSeat + view) % PLAYER_NUM];
        }
        return null;
    },


    getPlayerList() {
        return this.playerList;
    },

    /**
     * 获取随机庄列表
     */
    getRandomBankList() {
        var max = 0;
        var list = [];
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].betOne) {
                max = this.playerList[i].betOne > max ? this.playerList[i].betOne : max;
            }
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].betOne == max) {
                list.push(this.playerList[i].userId);
            }
        }
        return list;
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

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
        var player = this.createCommonPlayer(role_info);
        if (player.userId == cc.dd.user.id) {
            this.selfSeat = player.seat;
        }
        this.playerList[player.seat] = player;
        //nn_mgr.Instance().updatePlayerHead(player.userId);
        nn_mgr.Instance().updateRoomPlayerNum();
    },

    /**
     * 玩家离开
     * @param {Number} userId 
     */
    playerExit(userId) {
        if (userId == cc.dd.user.id) {
            this.playerList = [];
            return;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == userId) {
                if (this.playerList[i].isWinner) {
                    for (var j = 1; j < 5; j++) {
                        var x = i - j;
                        x < 0 && (x += 5);
                        if (this.playerList[x] && !this.playerList[x].isWatch) {
                            this.playerList[x].isWinner = true;
                            break;
                        }
                    }
                }
                this.playerList[i] = null;
            }
        }
        nn_mgr.Instance().updateRoomPlayerNum();
    },

    /**
     * 注册房间内语音玩家
     */
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
        PLAYER_NUM = 5;
    },


    /**
     * 排序牌  3+2
     * @param {Array<Number>} cards 
     */
    sortCards(cards, orderCards) {
        var newlist = [];
        if (orderCards && orderCards.length == 3) {
            for (var i = 0; i < 3; i++) {
                newlist.push(orderCards[i]);
            }
            cards.forEach(element => {
                if (newlist.indexOf(element) == -1)
                    newlist.push(element);
            });
            return newlist;
        }
        else {
            cards.forEach(element => {
                newlist.push(element);
            });
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
            for (var i = 0; i < 3; i++) {
                for (var j = i + 1; j < 4; j++) {
                    for (var k = j + 1; k < 5; k++) {
                        var total = getValue(cards[i]) + getValue(cards[j]) + getValue(cards[k]);
                        if (total % 10 == 0) {
                            newlist[0] = cards[i];
                            newlist[1] = cards[j];
                            newlist[2] = cards[k];
                            var index = 3;
                            for (var l = 0; l < 5; l++) {
                                if (l == i || l == j || l == k) {
                                    continue;
                                }
                                newlist[index++] = cards[l];
                            }
                            return newlist;
                        }
                    }
                }
            }
            return newlist;
        }
    },

    //更新玩家数量
    updatePlayerNum() {
        this.gamePlayerNum = 9;//todo:改成实际人数
        if (this.playerList && this.playerList.length) {
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i] && this.playerList[i].userId) {
                    this.playerExit(this.playerList[i].userId);
                }
            }
        }
        this.playerList = new Array(this.gamePlayerNum);
    },

});

module.exports = nn_Data;
