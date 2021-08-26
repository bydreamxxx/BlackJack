// create by wj 2018/1/31
var dd = cc.dd;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var gameType = require('Define').GameType;
var gameRoomData = require('game_room').items;
var TDkCDeskData = require('tdk_coin_desk_data');
const { type } = require('os');
var CDeskData = TDkCDeskData.TdkCDeskData;


var TdkCPlayerEvent = cc.Enum({
    PLAYER_ENTER: 'tdk_player_enter', //玩家进入
    PLAYER_LEAVE: 'tdk_player_leave', //玩家离开
    PLAYER_EXIT: 'tdk_player_exit', //玩家退出
    PLATE_EXIT_OK: 'tdk_player_exitok', //玩家已退出
    ADD_POKER: 'tdk_player_add_poker', //玩家增加手牌
    RECONNECT_ADD_POKER: 'tdk_player_reconnect_add_poker', //断线重连玩家发牌
    PLAYER_FOLD: 'tdk_player_fold', //玩家扣牌
    PLAYER_READY: 'tdk_player_ready',  //玩家准备
    ALL_PLAYER_READY: 'tdk_player_all_ready', //所有玩家准备
    SHOW_ALL_POKER: 'tdk_player_show_all_poker', //展示玩家所有手牌
    FRESH_CHIP_AND_WIN: 'tdk_player_fresh_chip_and_win', //更新玩家下注和总输赢
    PLAYER_COME_BACK: 'tdk_player_come_back', //玩家回来
    PLAYER_OPEN_POKER: 'tdk_player_open_poker',//玩家开牌
    PLAYER_SHOW_SCORE: 'tdk_player_show_score', //显示玩家分数值
    PLAYER_INIT_BET: 'tdk_player_init_bet',//初始化筹码
    GAME_START: 'tdk_game_start', //游戏开始
    PLAYER_INIT_POKER: 'tdk_player_init_poker', //初始化牌
    PLAYER_BEN_BET: 'player_ben_bet', //本轮下注
    PLAYER_NORMAL_SEND_POKER: 'tdk_player_normal_send_poker', //初始化牌
    TDK_FINALRESULT: 'tdk_FinalResult', //总结算
    DISSLOVE: 'disslove', //解散申请
    DISSOLVE_RESULT: 'disslove_reeult', //解散结果
    TUOGUAN: 'TuoGuan', //托管
    OFFLINE: 'offline', //离线
    JOINROOM: 'joinRoom', //加入已经开始的房间
    INITUI: 'initUi', //初始化界面
    PLAYEROPERATION: 'playerOperation', //断线重连玩家操作
    LANGUOGAME: 'LanguoGame',//金币场烂锅
    KAIPAI: 'Kanpai', //玩家看牌
    REFRSHOLOOKERS: 'REFRSHOLOOKERS', //刷新旁观者
});

var TdkCPlayerED = new dd.EventDispatcher();

/*****************************************PokerData*************************************************/

/**
 * 手牌数据
 * @type {Function}
 */
var PokerData = cc.Class({
    properties: {
        /**
         * 请求刷新视图的玩家
         */
        freshViewUserId: 0,
        /**
         * 玩家id
         */
        userid: 0,
        /**
         * 是否借牌
         */
        borrow: false,
        /**
         * 纸牌数字
         */
        pokerid: 0,
        /**
         * 明牌分数
         */
        score: 0,
        /**
         * 明牌最大分
         */
        maxpscore: 0,
        /**
         * 所有手牌分数
         */
        totalscore: 0,
    },

    ctor: function () {

    },

    setMsgData: function (msg) {
        this.setValue(msg);
        this.addPoker();
    },

    setValue: function (msg) {
        this.userid = msg.userid;
        this.borrow = msg.borrow;
        this.pokerid = msg.pokerid;
        this.isAct = msg.isAct;
        // this.score = msg.score;
        // this.maxpscore = msg.maxpscore;
        // this.totalscore = msg.totalscore;
    },

    /**
     * 改值
     * @param data
     */
    changValue: function (data) {
        this.setValue(data);
    },

    /**
     * 增加手牌
     */
    addPoker: function () {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.ADD_POKER, this);
    },
});

/**
 * 玩家数据
 * @type {Function}
 */
var PlayerData = cc.Class({
    properties: {
        /**
         * 玩家自己
         */
        selfId: 0,
        /**
         * 玩家id
         */
        userid: 0,

        headUrl: null,
        /**
         * 玩家昵称
         */
        nick: '',
        /**
         * 玩家带的金币数
         */
        gold: 0,
        /**
         * 玩家座位
         */
        pos: 0,
        /**
         * 玩家ui界面实际座位
         */
        seatId: 1,
        /**
         * 是否准备
         */
        already: false,
        /**
         * 是否弃牌
         */
        fold: false,
        /**
         * 手牌明牌分数
         */
        score: 0,
        /**
         * 所有手牌分数
         */
        totalScore: 0,
        /**
         * 与明牌最高分的差距
         */
        offsetScore: 0,
        /**
         * 已下注数量
         */
        bet: 0,
        /**
         * 本轮下注数量
         */
        roundBet: 0,
        /**
         * 本局输赢
         */
        winnum: 0,
        /**
         * 总输赢
         */
        totalWinNum: 0,

        /**
         * 是否借牌
         */
        borrow: false,
        /**
         * 是否allin
         */
        allin: false,
        /**
         * 是否游戏中
         */
        join: false,
        /**
         * 微信数据
         */
        wxinfo: null,
        /**
         * 玩家明牌数据
         */
        pokerlist: [],
        /**
         * 玩家客户端设置的poker列表
         */
        client_PokerList: [],
        /**
         * 原始的服务器数据
         */
        origPokerList: [],
        /**
         * 玩家暗牌数据（仅自己有）
         */
        hidelist: [],
        /**
         * 是否满足抓A必炮条件
         */
        isApao: false,

        /**
         * 是否托管
         */
        isTuoguan: false,

        /**
         * 反踢次数
         */
        fanTiNum: 0,

        /**
         * 是否重连状态
         */
        isStart: 0,
        /**
         * 玩家操作
         */
        opType: 0,
    },

    getStart: function () {
        return this.isStart;
    },


    GetfanTiNum: function () {
        return this.fanTiNum;
    },

    setfantiNum: function (num) {
        this.fanTiNum = num;
    },


    setReady: function (bl) {
        this.already = bl;
    },

    //是否在线
    setOnLine: function (bl) {
        this.join = bl;
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.OFFLINE, this);
    },

    /**
     * 设置托管
     */
    setTuoGuan: function (bl) {
        this.isTuoguan = bl;
        cc.log('[data] tdk_player_data::玩家:', this.userid, '托管状态：', bl);
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.TUOGUAN, this);
    },

    /**
     * 玩家所有手牌真实数据
     */
    getAllPoker: function () {
        var list = this.pokerlist.slice(2, this.pokerlist.length);
        var allpoker = [];
        this.hidelist.forEach(function (pokerid) {
            allpoker.push(pokerid);
        }.bind(this));
        for (var i = 0; i < list.length; ++i) {
            if (list[i].pokerid != -1)
                allpoker.push(list[i].pokerid);
        }
        return allpoker;
    },

    GetopType: function () {
        return this.opType;
    },

    setDeskData: function (msg) {
        this.already = msg.already;
        this.fold = msg.fold;
        this.bet = msg.bet;
        this.roundBet = msg.roundBet;
        this.gold = msg.score;
        this.winnum = msg.winnum;
        this.totalWinNum = msg.totalnum;
        this.borrow = msg.borrow;
        //this.allin = msg.allin;
        this.isTuoguan = msg.isAuto;
        this.fanTiNum = msg.fantiTimes;
        this.opType = msg.opType;
        this.origPokerList = msg.pokerlistList;
        msg.pokerlistList.forEach(function (poker) {
            var data = {
                pokerid: poker,
                isAct: false,
            }
            this.client_PokerList.push(data);
        }.bind(this));

        this.hidelist = msg.hidelistList;
        //设置明牌的分数
        this.caculateScore();
    },

    /**
     * 本轮下注
     */
    getRoundBet: function () {
        return this.roundBet;
    },

    /**
     * 判断是否已经参加过游戏
     */
    checkInGame: function () {
        return this.winnum > 0 || this.totalWinNum > 0
    },

    setMsgData: function (msg) {
        this.wxinfo = [];
        this.nick = msg.name;
        this.selfId = cc.dd.user.id;
        this.userid = msg.userId;
        this.pos = msg.seat + 1;
        this.headUrl = msg.headUrl;
        this.already = msg.isReady;
        if (msg.isReady)
            this.readyGame();
    },

    recordMsgData: function (msg) {
        this.wxinfo = [];
        this.nick = msg.nickName;
        this.selfId = cc.dd.user.id;
        this.userid = msg.userId;
        this.pos = msg.site + 1;
        this.headUrl = msg.headUrl;
    },

    /**
     * 判断玩家是不是自己
     */
    isSelf: function () {
        return (this.selfId == this.userId);
    },

    createPokerData: function () {
        var pokerData = new PokerData();
        return pokerData;
    },
    /**
     * 增加手牌
     */
    addPoker: function (data) {
        cc.log('[data] tdk_player_data::玩家:', this.userid, '增加手牌：', data);
        var pokerData = this.createPokerData();
        pokerData.setMsgData(data);
        this.pokerlist.push(pokerData);
    },

    /**
     * 明牌个数
     * @returns {Number}
     */
    getPokerCount: function () {
        return this.pokerlist.length;
    },

    /**
     * 玩家进入游戏
     */
    enterGame: function () {
        cc.log('[data] tdk_player_data::玩家:', this.userid, ',位置：', this.seatId, ',进入游戏！');
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_ENTER, this);
    },


    /**
     * 玩家退出游戏
     */
    exitGame: function () {
        cc.log('[data] tdk_player_data::玩家:', this.userid, '退出游戏！', '---:openId', this.openId);
        cc.dd.AudioChat.removeUser(this.openId);
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_EXIT, this);
    },

    /**
     * 玩家弃牌
     */
    foldGame: function () {
        cc.log('[data] tdk_player_data::玩家:', this.userid, '弃牌！');
        this.fold = true;
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_FOLD, this);
    },

    /**
     * 准备
     */
    readyGame: function () {
        this.already = true;
        cc.log('[data] tdk_player_data::玩家:', this.userid, '已准备！');
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_READY, this);
    },

    /**
     * 设置玩家已下注
     * @param num
     */
    setCostChip: function (num) {
        this.bet += num;
        cc.log('[data] tdk_player_data::玩家:', this.userid, '总下注:', this.bet);
    },

    /**
     * 玩家开牌
     */
    openPoker: function () {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_OPEN_POKER, this);
    },

    /**
     * 设置玩家输赢
     * @param data
     */
    setWinNum: function (num) {
        this.totalWinNum += num;
        cc.log('[data] tdk_player_data::玩家:', this.userid, '总输赢为:', this.totalWinNum);
    },

    /**
     * 设置玩家分数值
     */
    setScore: function () {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_SHOW_SCORE, this);
    },

    /**
     * 初始化玩家牌桌筹码
     */
    doBet: function () {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_INIT_BET, this);
    },

    /**
     * 计算明牌分数（五张）
     */
    getWUScore: function () {
        var data = [
            { type: 15, count: 0, isAct: false, flower: [] },
            { type: 14, count: 0, isAct: false, flower: [] }, //小王
            { type: 13, count: 0, isAct: false, flower: [] },
            { type: 12, count: 0, isAct: false, flower: [] },
            { type: 11, count: 0, isAct: false, flower: [] },
            { type: 10, count: 0, isAct: false, flower: [] },
            { type: 9, count: 0, isAct: false, flower: [] },
            { type: 8, count: 0, isAct: false, flower: [] },
            { type: 7, count: 0, isAct: false, flower: [] },
            { type: 6, count: 0, isAct: false, flower: [] },
            { type: 5, count: 0, isAct: false, flower: [] },
            { type: 4, count: 0, isAct: false, flower: [] },
            { type: 3, count: 0, isAct: false, flower: [] },
            { type: 2, count: 0, isAct: false, flower: [] },
            { type: 0, count: 0, isAct: false, flower: [] }, //大王
        ];
        this.score = 0;
        this.pokerlist.forEach(function (item) {
            if (item.pokerid != -1) {
                this.score += (item.pokerid % 16) == 0 ? 16 : ((item.pokerid % 16) == 14 ? 14 : (item.pokerid % 16));
                if (RoomMgr.Instance()._Rule.shareType) {//公张随豹
                    for (var k = 0; k < data.length; k++) {
                        if (item.pokerid % 16 == data[k].type) {
                            data[k].count += 1;
                            data[k].flower.push(Math.floor(item.pokerid / 16));
                        }
                    }
                } else if (item.isAct == false) { //公张随点
                    for (var k = 0; k < data.length; k++) {
                        if (item.pokerid % 16 == data[k].type) {
                            data[k].count += 1;
                            data[k].flower.push(Math.floor(item.pokerid / 16));
                        }
                    }
                }

            }
        }.bind(this))

        for (var k = 0; k < data.length; k++) {
            if (4 == data[k].count) {
                this.score += 60;
            } else if (3 == data[k].count) {
                this.score += 30;
            }
        }

        if (data[1].count > 0 && data[14].count > 0) {//对王
            this.score += 30;
        }

        var shunNum = this.getShunziNum(data);
        this.score += 10 * shunNum;

        this.totalScore = this.score;
    },

    getShunziNum(data) {
        var num = 0;
        if (!RoomMgr.Instance()._Rule.shunzi) {
            return num;
        }
        var newdata = [];
        data.forEach(e => {
            if (e.type > 0 && e.type != 14) {
                var item = { type: e.type, count: e.count, isAct: e.isAct, flower: [] };
                e.flower.forEach(f => {
                    item.flower.push(f);
                })
                newdata.push(item);
            }
        });
        newdata.push({ type: 0, count: 0, isAct: false, flower: [] });
        var shunzi = [];
        var start = -1;
        for (var i = 0; i < newdata.length; i++) {
            if (newdata[i].count == 0) {
                if (start == -1)
                    continue;
                if (i - start > 2) {
                    shunzi.push({ start: start, end: i - 1 });
                    start = -1;
                }
            }
            else {
                if (start == -1)
                    start = i;
                continue;
            }
        }
        for (var i = 0; i < shunzi.length; i++) {
            var st = shunzi[i].start;
            var ed = shunzi[i].end;
            for (var len = 3; len < ed - st + 2; len++) {
                if (len <= num)
                    continue;
                for (var idx = st; idx < ed - len + 2; idx++) {
                    for (var flower = 0; flower < 5; flower++) {
                        var total = 0;
                        for (var k = 0; k < len; k++) {
                            if (newdata[idx + k].flower.indexOf(flower) != -1)
                                total++;
                        }
                        if (total == len) {
                            if (len > num) num = len;
                            break;
                        }
                    }
                    if (len <= num)
                        break;
                }
            }
        }
        return num;
    },

    /**
     * 计算明牌分数（六张）
     */
    getLIUScore: function () {
        var data = [
            { type: 15, count: 0, isAct: false },
            { type: 14, count: 0, isAct: false }, //小王
            { type: 13, count: 0, isAct: false },
            { type: 12, count: 0, isAct: false },
            { type: 11, count: 0, isAct: false },
            { type: 10, count: 0, isAct: false },
            { type: 9, count: 0, isAct: false },
            { type: 8, count: 0, isAct: false },
            { type: 7, count: 0, isAct: false },
            { type: 6, count: 0, isAct: false },
            { type: 5, count: 0, isAct: false },
            { type: 4, count: 0, isAct: false },
            { type: 3, count: 0, isAct: false },
            { type: 2, count: 0, isAct: false },
            { type: 0, count: 0, isAct: false }, //大王
        ];
        this.score = 0;
        this.pokerlist.forEach(function (item) {
            if (item.pokerid != -1) {
                this.score += (item.pokerid % 16) == 15 ? 14 : (item.pokerid % 16);
                for (var k = 0; k < data.length; k++) {
                    if (item.pokerid % 16 == data[k].type) {
                        data[k].count += 1;
                    }
                }
            }
        }.bind(this))

        //三张 四张
        for (var k = 0; k < data.length; k++) {
            if (4 == data[k].count) {
                this.score = 999;
            } else if (3 == data[k].count) {
                this.score += 30;
            }
        }

        this.totalScore = this.score;
    },

    chcekShunZi: function (data, ret, index) {
        for (var i = 0; i < data.length; ++i) {
            if (data[i].count == index) {
                ret.start = data[i].type;
                break;
            }
        }
        for (var i = data.length - 1; i >= 0; --i) {
            if (data[i].count == index) {
                ret.end = data[i].type;
                break;
            }
        }
        cc.log('chcekShunZi : start:', ret.start + 'end :', ret.end);
        for (var i = ret.start - 1; i < ret.end; ++i) {
            if (i == 13)
                continue;
            if (!data[i] || data[i].count != index) {
                ret.bl = false;
            }
        }
        if (ret.end == 15)
            ret.end = 14;
        cc.log('chcekShunZi : start:', ret.start + 'end :', ret.end, 'bl:', ret.bl);
        return ret;
    },

    /**
     * 计算明牌分数
     */
    caculateScore: function () {
        if (RoomMgr.Instance().gameId == gameType.TDK_FRIEND_LIU)
            this.getLIUScore();
        else
            this.getWUScore();
    },

    /**
     * 计算总分(五张)
     */
    getWuTotallateScore: function () {
        var data = [
            { type: 15, count: 0, flower: [] },
            { type: 14, count: 0, flower: [] },
            { type: 13, count: 0, flower: [] },
            { type: 12, count: 0, flower: [] },
            { type: 11, count: 0, flower: [] },
            { type: 10, count: 0, flower: [] },
            { type: 9, count: 0, flower: [] },
            { type: 8, count: 0, flower: [] },
            { type: 7, count: 0, flower: [] },
            { type: 6, count: 0, flower: [] },
            { type: 5, count: 0, flower: [] },
            { type: 4, count: 0, flower: [] },
            { type: 3, count: 0, flower: [] },
            { type: 2, count: 0, flower: [] },
            { type: 0, count: 0, flower: [] },
        ];
        this.totalScore = 0;
        this.pokerlist.forEach(function (item) {
            if (item.pokerid != -1) {
                this.totalScore += (item.pokerid % 16) == 0 ? 16 : ((item.pokerid % 16) == 14 ? 14 : (item.pokerid % 16));
                if (RoomMgr.Instance()._Rule.shareType) {//公张随豹
                    for (var k = 0; k < data.length; k++) {
                        if (item.pokerid % 16 == data[k].type) {
                            data[k].count += 1;
                            data[k].flower.push(Math.floor(item.pokerid / 16));
                        }
                    }
                } else if (item.isAct == false) { //公张随点
                    for (var k = 0; k < data.length; k++) {
                        if (item.pokerid % 16 == data[k].type) {
                            data[k].count += 1;
                            data[k].flower.push(Math.floor(item.pokerid / 16));
                        }
                    }
                }
            }
        }.bind(this))

        if (!CDeskData.Instance().Huifang) {
            this.hidelist.forEach(function (item) {
                if (item.pokerid != -1) {
                    this.totalScore += (item % 16) == 0 ? 16 : ((item % 16) == 14 ? 14 : (item % 16));
                    for (var k = 0; k < data.length; k++) {
                        if (item % 16 == data[k].type) {
                            data[k].count += 1;
                            data[k].flower.push(Math.floor(item / 16));
                        }
                    }
                }
            }.bind(this))
        }


        var jokerPao = false;
        for (var k = 0; k < data.length; k++) {
            cc.log('k :', k + ' data[k] :', data[k].count)
            if (4 == data[k].count) {
                this.totalScore += 60;
            } else if (3 == data[k].count) {
                this.totalScore += 30;
                jokerPao = true;
            }
        }

        if (data[1].count > 0 && data[14].count > 0) {//对王
            this.totalScore += 30;
            if (RoomMgr.Instance()._Rule.jokerPao && jokerPao) { //王中炮
                this.totalScore += 60;
            }
        }

        var shunNum = this.getShunziNum(data);
        this.totalScore += 10 * shunNum;

        cc.log('玩家ID:' + cc.dd.user.id + '总分数：', this.totalScore)
    },

    /**
     * 计算总分(六张)
     */
    getLIUTotallateScore: function () {
        var data = [
            { type: 15, count: 0 },
            { type: 14, count: 0 },
            { type: 13, count: 0 },
            { type: 12, count: 0 },
            { type: 11, count: 0 },
            { type: 10, count: 0 },
            { type: 9, count: 0 },
            { type: 8, count: 0 },
            { type: 7, count: 0 },
            { type: 6, count: 0 },
            { type: 5, count: 0 },
            { type: 4, count: 0 },
            { type: 3, count: 0 },
            { type: 2, count: 0 },
            { type: 0, count: 0 },
        ];
        this.totalScore = 0;
        this.pokerlist.forEach(function (item) {
            if (item.pokerid != -1) {
                this.totalScore += (item.pokerid % 16) == 15 ? 14 : (item.pokerid % 16);
                for (var k = 0; k < data.length; k++) {
                    if (item.pokerid % 16 == data[k].type) {
                        data[k].count += 1;
                    }
                }
            }
        }.bind(this))
        if (!CDeskData.Instance().Huifang) {
            this.hidelist.forEach(function (item) {
                if (item.pokerid != -1) {
                    this.totalScore += (item % 16) == 15 ? 14 : (item % 16);
                    for (var k = 0; k < data.length; k++) {
                        if (item % 16 == data[k].type) {
                            data[k].count += 1;
                        }
                    }
                }
            }.bind(this))
        }


        data.sort(function (a, b) { return a.type - b.type; });
        if (RoomMgr.Instance()._Rule.qinsandui) {
            //亲三对
            var ret = { start: 0, end: 0, bl: true };
            ret = this.chcekShunZi(data, ret, 2);
            var num = ret.end - ret.start;
            if (ret.bl && num == 2)
                this.totalScore += 30;
        }

        //三对
        var index = 0;
        for (var i = 0; i < data.length; ++i) {
            cc.log(' i: ', i + "type: ", data[i].type + "count: ", data[i].count)
            if (data[i].count == 2) {
                index++;
            }
        }
        if (index == 3)
            this.totalScore += 30;


        if (RoomMgr.Instance()._Rule.lianxian) {
            //连线
            var szret = { start: 0, end: 0, bl: true };
            szret = this.chcekShunZi(data, szret, 1);
            var num = szret.end - szret.start;
            if (szret.bl && num == 5)
                this.totalScore += 60
        }

        //三张 四张
        for (var k = 0; k < data.length; k++) {
            if (4 == data[k].count) {
                this.totalScore = 999;
            } else if (3 == data[k].count) {
                this.totalScore += 30;
            }
        }
    },

    /**
     * 计算总的分数
     */
    cacuTotallateScore: function () {
        if (RoomMgr.Instance().gameId == gameType.TDK_FRIEND_LIU)
            this.getLIUTotallateScore();
        else
            this.getWuTotallateScore();
    },

    /**
     * 刷新ui界面，ui层主动请求
     */
    freshView: function (userid) {
        this.freshViewUserId = userid;
        this.enterGame();

        if (this.isReady) {
            this.readyGame();
        }

        this.poker_list.forEach(function (item) {
            if (item) {
                item.freshView(userid);
            }
        });

        if (this.isFold) {
            this.foldGame();
        }

        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.FRESH_CHIP_AND_WIN, this);
    },
});

var TdkCPlayerMgrData = cc.Class({
    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                cc.log('[data] TdkCPlayerMgrData::Instance!');
                this._instance = new TdkCPlayerMgrData();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                cc.log('[data] TdkCPlayerMgrData::Destroy!');
                this._instance = null;
            }
        },
    },
    properties: {
        /**
         * 自己的id
         */
        selfId: 0,
        /**
         * 玩家列表
         */
        TdkCPlayerList: [],
        /**
         * 玩家所有的牌信息
         */
        pokerInfo: null,

        /**
         * 首家发牌ID
         */
        startID: null,

        /**
         * 本局参加游戏多少人
         */
        gameNum: 0,

        /**
         * 游戏是否开始
         */
        isGame: false,

        /**
         * 旁观者玩家集合
         */
        onlookersList: [],
    },
    /**
     * 解析服务器数据
     */
    setMsgData: function (msg, isrecord) {
        this.isGame = true;
        this.clearPokerList();
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.INITUI, this);
        if (this.getGameId() == 41)
            RoomMgr.Instance()._Rule = msg.rule;

        this.isRecord = isrecord;

        this.roomState = msg.roomState;
        this.setClickPoker(msg.roomState == 2);
        this.m_BaseScore = msg.rule.baseScore;
        this.setTdkCPlayerList(msg.userdataList);
        this.setStar(msg.roomState);
        this.reconnectionSetData(msg.roomtype, msg.configRoomId);

        if (msg.rule.aPao == true && msg.betlistList.length == 0) {//抓a必炮
            for (var i = 0; i < msg.userdataList.length; ++i) {
                var player = msg.userdataList[i];
                if (player && player.userid == msg.actuserid && player.pokerlistList.length == 1) {
                    var playerItem = this.getUserById(msg.actuserid);
                    if (playerItem)
                        playerItem.isApao = player.pokerlistList[0] % 16 == 15;
                }
            }
        }

        if (msg.roomState == 2) { //下注
            if (!isrecord) {
                this.initPokerInfo();
            }
            if (msg.actuserid != 0)
                TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_INIT_POKER, this);
            this.initChipInfo();
            this.joinRoom(msg);
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_BEN_BET, this);
        } else {
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.GAME_START, this);
        }
        this.caculateOffsetScore();

    },

    /**
     * 玩家扣牌
     */
    setFold: function (userid) {
        var player = this.getUserById(userid);
        if (player)
            player.fold = true;
    },

    /**
     * 旁观人数
     */
    getOnlookersList: function () {
        return this.onlookersList.length;
    },

    /**
     * 游戏是否开始
     */
    getIsGame: function () {
        return this.isGame;
    },

    /**
     * 游戏处于状态
     */
    setStar: function (start) {
        var playerInfo = this.getUserById(cc.dd.user.id);
        if (playerInfo) {
            playerInfo.isStart = start;
        }
    },

    /**
    * 是否是回放
    */
    GetIsRecord: function () {
        return this.isRecord ? this.isRecord : false;
    },

    setClickPoker: function (state) {
        this.ClickPoker = state;
    },

    /**
     * 是否可以点击牌
     */
    IsClickPoker: function () {
        return this.ClickPoker;
    },

    /**
     * 金币场加入已开房间
     */
    joinRoom: function (msg) {
        var players = msg.userdataList;
        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            if (player.userid == cc.dd.user.id && player.hidelistList.length == 0 && msg.actuserid > 0)
                TdkCPlayerED.notifyEvent(TdkCPlayerEvent.JOINROOM);
        }

        if (msg.actuserid == cc.dd.user.id) {
            var data = {
                userid: msg.actuserid,
                deskstatus: msg.deskstatus,
                time: msg.time,
            }
            cc.log('joinRoom:', msg.actuserid);
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYEROPERATION, data);
        }
    },

    /**
     * 托管服务器数据
     */
    setTuoGuanData: function (msg) {
        var player = this.getPlayer(msg.userId);
        if (player)
            player.setTuoGuan(msg.type);
    },



    /**
     * 设置玩家列表数据
     */
    setTdkCPlayerList: function (userList) {
        //this.checkdeckplayer(userList);
        userList.forEach(function (player) {
            var playerInfo = this.getUserById(player.userid);
            if (playerInfo) {
                playerInfo.setDeskData(player);
            }
        }.bind(this));
        var selfplayer = this.getUserById(cc.dd.user.id);
        if (selfplayer)
            this.selfId = cc.dd.user.id;
        else
            this.selfId = this.TdkCPlayerList[0].userid;
        this.sortPos();
    },

    /**
     * 检查自己是否在桌子里
     */
    checkdeckplayer: function (list) {

    },

    /**
     * 金币场配置信息
     */
    setData: function (data) {
        this.m_GameType = data.key;
        this.m_nGameId = data.gameid;
        this.m_nRoomid = data.roomid;
        this.m_BaseScore = data.basescore;
        this.m_strTitle = data.titel;
        this.m_nUnderScore = data.entermin;
    },

    /**
     * 重连金币场配置信息
     */
    reconnectionSetData: function (roomType, configRoomid) {
        if (roomType == 41) {
            for (var k = 0; k < gameRoomData.length; k++) {
                var info = gameRoomData[k]
                if (info.gameid == 41 && configRoomid == info.key) {
                    this.m_nRoomid = info.roomid;
                    this.m_nGameId = info.gameid;
                }
            }
        }
    },

    /**
     * 获取游戏ID
     * @returns {*|number}
     */
    getGameId: function () {
        return this.m_nGameId > 0 ? this.m_nGameId : RoomMgr.Instance().gameId;
    },

    /**
     * 获取房间ID
     * @returns {*|number}
     */
    getRoomId: function () {
        return this.m_nRoomid > 0 ? this.m_nRoomid : RoomMgr.Instance().roomId;
    },

    /**
     * 初始化扑克数据
     */
    initPokerInfo: function () {
        this.TdkCPlayerList.forEach(function (player) {
            if (player.origPokerList.length != 0) {
                player.client_PokerList.splice(0, player.client_PokerList.length);
                for (var k = 0; k < 2; k++) {
                    var data = {
                        pokerid: -1,
                        isAct: false,
                    }
                    player.client_PokerList.splice(k, 1, data);
                }
                player.origPokerList.forEach(function (info) {
                    var data = {
                        pokerid: info,
                        isAct: false,
                    }
                    player.client_PokerList.push(data);
                })
            }
        });
    },

    /**
     * 初始化筹码数据
     */
    initChipInfo: function () {
        this.TdkCPlayerList.forEach(function (player) {
            if (player.bet != 0) {
                player.doBet();
            }
        })
    },

    /**
     * 初始化玩家
     */
    initPlayer: function () {
        this.TdkCPlayerList.forEach(function (player) {
            player.enterGame();
        })
    },

    /**
     * 转化玩家ui界面的位置
     */
    sortPos: function () {
        var selfplayer = this.getUserById(this.selfId);
        if (!selfplayer) {
            cc.log('没找到玩家：', this.selfId);
            return;
        }
        this.selfSeatId = selfplayer.pos;
        cc.log('玩家列表：', this.TdkCPlayerList.length)
        for (var k = 0; k < this.TdkCPlayerList.length; k++) {
            var player = this.TdkCPlayerList[k];
            if (player.userid != this.selfId) {
                if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.roleCount == 9)
                    player.seatId = ((10 - this.selfSeatId + player.pos) % 9);
                else
                    player.seatId = ((6 - this.selfSeatId + player.pos) % 5);
            } else {
                player.seatId = 1;
            }
            player.enterGame();
        }
    },
    /**
     * 根据userId查找玩家
     */
    getUserById: function (userid) {
        for (var k = 0; k < this.TdkCPlayerList.length; k++) {
            var player = this.TdkCPlayerList[k];
            if (player.userid == userid) {
                return player;
            }
        }
        return null;
    },

    getPlayer: function (userid) {
        return this.getUserById(userid);
    },

    /**
     * 获取房间里正在游戏中玩家的人数
     */
    getstartPlayer: function () {
        this.gameNum = 0;
        this.TdkCPlayerList.forEach(function (player) {
            if (player.client_PokerList.length > 0)
                this.gameNum += 1;
        }.bind(this));
        return this.gameNum ? this.gameNum : 0;
    },

    /**
     * 房间里玩家人数
     */
    getPlayerNum: function () {
        if (this.TdkCPlayerList)
            return this.TdkCPlayerList.length;
        return 0;
    },
    /**
     * 删除指定玩家数据 by userid
     */
    deleteUserById: function (userid) {
        for (var k = 0; k < this.TdkCPlayerList.length; k++) {
            var player = this.TdkCPlayerList[k];
            if (player.userid == userid) {
                this.TdkCPlayerList.splice(k, 1);
                TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLATE_EXIT_OK, this);
                return;
            }
        }
        cc.log('delete user error:' + userid);
    },

    updatePlayerNum: function () {
        this.clearAllData();
    },

    //玩家信息
    genPlayerData: function (role_info) {
        var playerData = {
            userId: role_info.userId,
            name: role_info.name,
            sex: role_info.sex,
            headUrl: role_info.headUrl,
            score: 0,
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
        }
        if (!this.PlayerCommonData)
            this.PlayerCommonData = [];

        for (var i = 0; i < this.PlayerCommonData.length; ++i) {
            var player = this.PlayerCommonData[i];
            if (player.userId == playerData.userId)
                return;
        }
        this.PlayerCommonData.push(playerData);
    },

    /**
     * 信息面板通用数据
     */
    GetPlayerConmmonData: function () {
        return this.PlayerCommonData;
    },

    /**
     * 获取玩家列表
     */
    getPlayerList: function () {
        return this.PlayerCommonData;
    },

    /**
     * 获取玩家通用数据
     */
    getCommonData: function (userid) {
        if (!this.PlayerCommonData) return;
        for (var i = 0; i < this.PlayerCommonData.length; ++i) {
            var player = this.PlayerCommonData[i];
            if (player && player.userId == userid) {
                return player;
            }
        }
        return null;
    },

    /**
     * 判断旁观者是否存在
     */
    addOnlookers: function (role) {
        if (!this.onlookersList) return;
        for (var i = 0; i < this.onlookersList.length; ++i) {
            var player = this.onlookersList[i];
            if (player && player.userId == role.userId) {
                return;
            }
        }
        this.onlookersList.push(role);
    },


    /**
     * 玩家进入
     */
    playerEnter: function (player) {
        if (player.seat == -1) {
            this.addOnlookers(player);
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.REFRSHOLOOKERS);
            return;
        }
        cc.log('playerEnter-----------玩家进入房间：', player.userId, '-------: ', cc.dd.user.id)
        var playerItme = this.getPlayer(player.userId);
        if (playerItme) {
            return;
        }
        this.genPlayerData(player);
        cc.log('房间内玩家人数：', this.TdkCPlayerList.length);
        if (this.TdkCPlayerList.length < 9) {
            if (!this.selfId)
                this.selfId = cc.dd.user.id;

            var player_new = this.createPlayer(player);
            this.TdkCPlayerList.push(player_new);
            if (this.getGameId() == gameType.TDK_FRIEND_LIU || this.getGameId() == gameType.TDK_FRIEND)
                this.sortPos();
            if (this.gameCoinstate)
                this.sortPos();
        }
    },

    /**
     * 得到位置为1的玩家
     */
    getstarplayer: function () {
        this.TdkCPlayerList.sort(function (a, b) { return a.pos - b.pos; });
        return this.TdkCPlayerList[0];
    },

    /**
     * 金币场加入
     */
    playerCoinEnter: function () {
        if (!this.selfId)
            this.selfId = cc.dd.user.id;
        this.sortPos();
        this.gameCoinstate = true;
    },

    /**
     * 回放添加玩家
     */
    addPlayer: function (player) {
        var playerItme = this.getPlayer(player.userId);
        if (playerItme) {
            playerItme.readyGame(player.isReady);
            return;
        }
        this.genPlayerData(player);
        if (!this.selfId)
            this.selfId = cc.dd.user.id;

        var playerData = new PlayerData();
        playerData.recordMsgData(player);
        this.TdkCPlayerList.push(playerData);
    },

    /**
     * 创建玩家
     */
    createPlayer: function (player) {
        var playerData = new PlayerData();
        playerData.setMsgData(player);
        return playerData;
    },

    /**
     * 语音
     */
    requesYuYinUserData: function () {
        cc.dd.AudioChat.clearUsers();
        if (this.TdkCPlayerList) {
            this.TdkCPlayerList.forEach(function (player) {
                if (player) {
                    if (player.userid != cc.dd.user.id) {
                        cc.dd.AudioChat.addUser(player.userid);
                    }
                }
            }, this);
        }
    },

    /**
     * 玩家离开
     */
    playerExit: function (userid) {
        cc.log('玩家退出--playerExit 玩家ID:', userid);
        var player = this.getUserById(userid);
        if (player) {
            player.exitGame();
            this.deleteUserById(userid);
        } else {
            var data = { userid: userid };
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_EXIT, data);
        }

        for (var i = 0; i < this.onlookersList.length; ++i) {
            var role = this.onlookersList[i];
            if (role && role.userId == userid) {
                this.onlookersList.splice(i, 1);
                TdkCPlayerED.notifyEvent(TdkCPlayerEvent.REFRSHOLOOKERS);
                return;
            }
        }
    },

    /**
     * 判断玩家是否在游戏中
     */
    checkPlayerSurvival: function () {
        var bl = false;
        this.TdkCPlayerList.forEach(function (player) {
            if (player.userid == cc.dd.user.id)
                bl = true;
        }.bind(this));
        return bl;
    },

    /**
     * 判断抓A必炮
     */
    checkAPao: function (msg) {
        if (!RoomMgr.Instance()._Rule || !RoomMgr.Instance()._Rule.aPao) return;
        for (var i = 0; i < msg.pokerlistList.length; ++i) {
            var player = msg.pokerlistList[i];
            if (player && player.userid == msg.nextuserid) {
                var playerItem = this.getUserById(msg.nextuserid);
                if (playerItem)
                    playerItem.isApao = player.pokerid % 16 == 15;
            }
        }
    },

    getApao: function () {
        var player = this.getUserById(cc.dd.user.id);
        if (player) {
            cc.log('玩家：', cc.dd.user.id, '必炮：', player.isApao);
            return player.isApao;
        }

    },

    setApao: function (bl) {
        var player = this.getUserById(cc.dd.user.id);
        if (player) {
            cc.log('玩家：', cc.dd.user.id, '必炮：', player.isApao);
            player.isApao = bl;
        }

    },

    /**
     * 首家发牌座位号
     */
    getStartSendPoker: function () {
        cc.log("首家发牌座位号： ", this.startID);
        this.TdkCPlayerList.sort(function (a, b) { return a.pos - b.pos; });
        for (var i = 0; i < this.TdkCPlayerList.length; ++i) {
            cc.log('首家发牌后排序后 玩家ID:' + this.TdkCPlayerList[i].userid + ' 玩家pos: ', this.TdkCPlayerList[i].pos);
        }
        for (var i = 0; i < this.TdkCPlayerList.length; ++i) {
            var player = this.TdkCPlayerList[i];
            if (player && player.userid == this.startID)
                return i;
        }
        cc.log("没找到发牌的首个玩家！！！");
        return 0;
    },



    /**
     * 返回看牌玩家
     */
    TdkKanPaiRsp: function (msg) {
        var player = this.getPlayer(msg.userId);
        if (player && !player.fold)
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.KAIPAI, player);
    },

    /**
     * 检查该玩家是否有手牌
     */
    checkSendPokerPlayer: function (userid) {
        if (!this.pokerInfo) return;
        var list = this.pokerInfo.pokerlistList;
        for (var i = 0; i < list.length; ++i) {
            var poker = list[i];
            if (poker && userid == poker.userid) {
                return true;
            }
        }
        return false;
    },

    /**
     * 发牌消息处理
     */
    sendPoker: function (msg) {
        this.TdkCPlayerList.forEach(function (player) {
            player.client_PokerList.splice(0, player.client_PokerList.length);
        }.bind(this));
        this.startID = msg.startid;
        //if (msg.selflistList.length != 0) {
        if (msg.isFirst) {
            this.checkAPao(msg);
            this.pokerInfo = msg;
            var player = this.getUserById(cc.dd.user.id);
            if (player)
                player.hidelist = msg.selflistList;

            this.TdkCPlayerList.forEach(function (player) {
                player.fold = false;
            }.bind(this));
            this.clearPokerList();
            TdkCPlayerED.notifyEvent(TdkCPlayerEvent.ALL_PLAYER_READY, this);
        } else {
            msg.pokerlistList.forEach(function (pokerInfo) {
                var player = this.getUserById(pokerInfo.userid);
                if (player) {
                    var data = {
                        pokerid: pokerInfo.pokerid,
                        borrow: pokerInfo.borrow,
                        isAct: true,
                    }
                    player.client_PokerList.push(data);
                }
            }.bind(this));

            var nextPlayer = this.getUserById(msg.nextuserid);
            if (nextPlayer && nextPlayer.pokerlist.length <= 0) {
                this.initCoinPoker(msg.pokerlistList);
            }
            if (msg.pokerlistList.length > 0)
                TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_NORMAL_SEND_POKER, this);
            this.caculateOffsetScore();
        }
    },

    initCoinPoker: function (pokerlistList) {
        this.setClickPoker(false);
        pokerlistList.forEach(function (item) {
            var player = this.getUserById(item.userid);
            if (player && player.origPokerList.length != 0) {
                player.client_PokerList.splice(0, player.client_PokerList.length);
                for (var k = 0; k < 2; k++) {
                    var data = {
                        pokerid: -1,
                        isAct: false,
                    }
                    player.client_PokerList.splice(k, 1, data);
                }

                player.origPokerList.forEach(function (info) {
                    var data = {
                        pokerid: info,
                        isAct: false,
                    }
                    player.client_PokerList.push(data);
                })
            }
        }.bind(this));
    },

    /**
     * 计算与最高分数的差距
     */
    caculateOffsetScore: function () {
        var tmpArr = new Array();
        for (var i = 0; i < this.TdkCPlayerList.length; i++) {
            tmpArr.push(this.TdkCPlayerList[i].totalScore);
        }
        tmpArr.sort(function (a, b) {
            return b - a;
        });

        var maxScore = tmpArr[0];
        this.TdkCPlayerList.forEach(function (player) {
            player.offsetScore = player.totalScore - maxScore;
            player.setScore();
        })
    },

    /**
     * 刷新界面玩家数据显示
     */
    refreshPlayerUI: function () {
        this.TdkCPlayerList.forEach(function (player) {
            player.enterGame();
        })
    },
    /**
     * 玩家准备消息
     */
    playerReady: function (userid) {
        var player = this.getUserById(userid);
        if (player) {
            player.readyGame();
        }
    },

    /**
     * 总结算
     */
    FinalResult: function (msg) {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.TDK_FINALRESULT, msg);
    },

    /**
     * 解散申请返回
     */
    DissLove: function (msg, time) {
        if (time != null) {
            msg.remainTime = time;
        }
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.DISSLOVE, msg);
    },

    /**
     * 解散结果返回
     */
    DissoLveResult: function (msg) {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.DISSOLVE_RESULT, msg);
    },

    /**
     * 设置玩家已下注
     * @param num
     */
    setCostChip: function (data) {
        var player = this.getUserById(data.userid);
        if (player)
            player.setCostChip(data.betnum);
    },

    /**
     * 设置玩家反踢次数
     */
    setFanTiNum: function (data) {
        var player = this.getUserById(data.userid);
        if (player && data.num > 0)
            player.setfantiNum(data.num);
    },

    /**
     * 设置玩家的暗牌
     */
    setHidePoker: function (msg) {
        msg.pokerList.forEach(function (hideInfo) {
            var player = this.getUserById(hideInfo.userid);
            if (player) {
                player.hidelist = hideInfo.pokeridList;
                player.cacuTotallateScore();
                player.openPoker();
            }
        }.bind(this));
        this.caculateOffsetScore();
    },
    /**
     * 检查玩家是否加入游戏
     */
    checkPlayerJoinState: function (userid) {
        var player = this.getUserById(userid);
        if (player) {
            if (!player.already && player.pokerlist.length == 0) {
                return false;
            }
            return true;
        }
        return true;
    },

    /**
     * 清除玩家数据
     */
    clearAllData: function () {
        cc.log('清除所有玩家数据')
        this.gameCoinstate = null;
        this.TdkCPlayerList.splice(0, this.TdkCPlayerList.length);
        this.pokerInfo = null;
        this.PlayerCommonData = null;
    },

    /**
     * 清除当前玩家的poker 数据
     */
    clearPokerList: function () {
        this.TdkCPlayerList.forEach(function (player) {
            // if (this.getGameId() == gameType.TDK_COIN) {
            //     player.fold = false;
            // }
            player.fanTiNum = 0;

            player.client_PokerList.splice(0, player.client_PokerList.length);
            player.pokerlist.splice(0, player.pokerlist.length);
        }.bind(this));
    },

    /***************************  回放数据处理 **************************/

    /**
     * 回放-桌子回调
     */
    recordDeskData: function (msg) {
        this.clearPokerList();
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.INITUI, this);
        //this.selfId = cc.dd.user.id;
        this.m_BaseScore = msg.rule.baseScore;
        for (var i = 0; i < msg.userdataList.length; ++i) {
            var player = msg.userdataList[i];
            if (player) {
                for (var j = player.hidelistList.length - 1; j >= 0; --j) {
                    var hide = player.hidelistList[j];
                    if (hide)
                        player.pokerlistList.unshift(hide);
                }
                player.hidelistList = [];
            }
        }
        this.setTdkCPlayerList(msg.userdataList);

        this.caculateOffsetScore();
    },

    seedInitPoker: function () {
        TdkCPlayerED.notifyEvent(TdkCPlayerEvent.PLAYER_INIT_POKER, this);
    },

    /**
     * 回放-发牌
     */
    recordSendPoker: function (msg) {
        msg.pokerlistList.forEach(function (pokerInfo) {
            var player = this.getUserById(pokerInfo.userid);
            if (player) {
                var data = {
                    pokerid: pokerInfo.pokerid,
                    isAct: true,
                }
                player.client_PokerList.push(data);
            }
        }.bind(this));
        this.caculateOffsetScore();

    },

    /**
     * 回放-操作
     */
    recordBetRsp: function (msg) {
        var player = this.getUserById(msg.userid);
        if (player && msg.num > 0)
            player.setCostChip(msg.num);
        if (msg.type == 7)
            player.foldGame();
    },

    /**
     * 回放-开牌
     */
    recordopenPoker: function (msg) {
        var pokerlist = msg.pokerList;
        for (var i = 0; i < pokerlist.length; ++i) {
            var hideInfo = pokerlist[i];
            var player = this.getUserById(hideInfo.userid);
            if (player) {
                player.hidelist = hideInfo.pokeridList;
                player.cacuTotallateScore();
                player.openPoker();
            }
        }
        this.caculateOffsetScore();
    },
});


module.exports = {
    TdkCPlayerEvent: TdkCPlayerEvent,
    TdkCPlayerED: TdkCPlayerED,
    TdkCPlayerMgrData: TdkCPlayerMgrData,

};
