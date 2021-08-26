/**
 * 刨幺数据
 */

var PY_EnumData = require("paoyao_type").EnumData.Instance();
var PY_Enum = require("paoyao_type");
var ED = require("EventDispatcher");
var hallData = require('hall_common_data').HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require("Define");
var py = require('paoyao_util');
var game_room_cfg = require('game_room');

/**
 * 事件管理
 */
var PY_Event = cc.Enum({
    INIT_ROOM: 'INIT_ROOM',  //初始化房间
    CHAR_REQ: 'CHAR_REQ', //喊话
    PLAYER_ENTER: 'PLAYER_ENTER', //玩家进入
    PLAYER_EXIT: 'PLAYER_EXIT', //玩家离开
    RESULT_RET: 'RESULT_RET', //单局结算
    TOTAL_RESULT: 'TOTAL_RESULT', //总结算
    HAND_POKER: 'HAND_POKER', //发牌
    CHOOSE_YAO: 'CHOOSE_YAO', //选幺返回
    CHOOSE_YAOEND: 'CHOOSE_YAOEND', //选幺结束
    CHANGE_YAO: 'CHANGE_YAO', //玩家幺改变
    PLAYER_READY: 'PLAYER_READY', //玩家准备
    PLAYER_ISONLINE: 'PLAYER_ISONLINE', //玩家离线或者上线
    PLAY_POKER: 'PLAY_POKER', //出牌返回
    PLAY_XUE: 'PLAY_XUE', //通知雪
    XUE_CALLBACK: 'XUE_CALLBACK', // 请求雪回调
    UPDELE_SCORE: 'UPDELE_SCORE', // 更新桌面积分
    UPDELE_TOOLSCORE: 'UPDELE_TOOLSCORE', //更新队伍总积分
    CHANGE_DESK: 'CHANGE_DESK', //桌子状态发生改变
    OTHER_POKER: 'OTHER_POKER', //队友手牌
    READY_REQ: 'READY_REQ', //准备
    COLLOCATION: 'COLLOCATION', //托管
    DISSOLVE: 'DISSOLVE', //解散
    DISSOLVE_RESULT: 'DISSOLVE_RESULT',     //解散结果
    RECONNECT: 'RECONNECT', //重连
    REFRESH_FEN: 'REFRESH_FEN', //刷新积分牌
    RATHOLING: 'RATHOLING', //换桌
    CONTINUE_GAME: 'CONTINUE_GAME', //继续
});

var PY_ED = new ED();
var instance = null;
var PaoYao_Data = cc.Class({

    statics: {
        /**
         * 获取实例
         */
        getInstance: function () {
            if (cc.dd.Utils.isNull(instance)) {
                instance = new PaoYao_Data();
            }
            return instance;
        },
    },

    /**
    * 构造函数
    */
    ctor: function () {
        //底分
        this.m_BaseScore = 0;
        //人数
        this.m_Population = 4;
        //局数
        this.m_BureauNum = 0;
        //玩法
        this.m_Play = 0;
        //规则
        this.m_Rule = 0;
        //房间类型
        this.m_GameType = 0;
        // 游戏ID
        this.m_nGameId = 0;
        // 房间ID
        this.m_nRoomid = 0;
        // 房间标题
        this.m_strTitle = "";
        // 是否匹配中
        this.m_bIsMatching = false;
        // 是否已开始
        this.m_bIsStart = false;
        //桌子积分
        this.m_Score = 0;
        //房间状态(0等待准备，1游戏中，2等待雪,3等待幺)
        this.m_State = 0;
        //当前操作玩家ID
        this.m_Next_ID = 0,
            //当前局数
            this.curCircle = 0,
            //下一次操作结束时间戳
            this.m_Time = 0;
        //队伍列表
        this.TeamInfo = null;
        //玩家信息
        this.playerInfo = null;
        //桌子信息
        this.deskInfo = null;
        //转幺玩家交换列表
        this.exchangeList = null;
        //pass数量
        this.cardPassNum = 0;
        //分数牌集合
        this.fenCards = null;
        //玩家是否离线状态
        this.is_online = false;

    },
    /**
     * 销毁
     */
    Destroy: function () {
        //队伍列表
        this.TeamInfo = null;
        //玩家信息
        this.playerInfo = null;

        if (!cc.dd.Utils.isNull(instance)) {
            instance = null;
        }
    },

    /**
     * 清除数据
     */
    clear: function () {
        //桌子信息
        this.TeamInfo = null;
        //玩家信息
        this.playerInfo = null;
    },

    /**
     * 设置 金币场 数据
     * @param data 
     */
    setData: function (data) {
        this.m_GameType = data.key;
        this.m_nGameId = data.gameid;
        this.m_nRoomid = data.roomid;
        this.m_BaseScore = data.basescore;
        this.m_strTitle = data.titel;
        this.m_nUnderScore = data.entermin;
    },

    //部署数据
    SetDeskData: function (data) {
        if (data == null)
            return;
        var room_cfg = game_room_cfg.getItem(function (item) {
            return item.key == data.configRoomId;
        });
        if (room_cfg) {
            this.m_nRoomid = room_cfg.roomid;
            this.m_nUnderScore = room_cfg.entermin;
        }


        this.m_State = data.state;
        this.m_Next_ID = data.opId;
        this.m_Time = data.nextTime;
        if (data.rule) { //规则
            this.m_BaseScore = data.rule.baseScore;
            this.m_Population = 4;
            this.m_BureauNum = data.rule.circleNum;
            if (data.rule.isMing)
                this.m_Play = PY_Enum.PlayEnum.BRIGHT_YAO;
            else
                this.m_Play = PY_Enum.PlayEnum.DARK_YAO;
            //data.rule.is_dui
            this.m_Rule = PY_Enum.RuleEnum.HAVE_3;
        }
        this.m_Score = data.score;
        this.m_GameType = data.gameType;
        this.curCircle = data.curCircle;
        this.setTeamData(data.teamList);
        this.setDeskInfo(data.roleListList);
        this.setFenCards(data.cardInfo);

    },

    /**
     * 桌子信息
     */
    setDeskInfo: function (desk) {
        this.deskInfo = desk;
        this.initGamePlayerData();
    },

    /**
     * 分数牌
     * @param cards 分数牌集合
     */
    setFenCards: function (cards) {
        this.fenCards = cards;
        PY_ED.notifyEvent(PY_Event.REFRESH_FEN);
    },

    /**
     * 更新分数牌集合
     * @param cards 牌的集合
     */
    RefreshFenCard: function (cards) {
        if (!cards || !this.fenCards)
            return;
        for (var i = 0; i < cards.length; ++i) {
            var value = py.getCardValue(cards[i]);
            if (value == 5 && this.fenCards.card5 >= 0) {
                ++this.fenCards.card5;
            } else if (value == 10 && this.fenCards.card10 >= 0) {
                ++this.fenCards.card10;
            } else if (value == 13 && this.fenCards.cardk >= 0) {
                ++this.fenCards.cardk;
            }
        }
        PY_ED.notifyEvent(PY_Event.REFRESH_FEN);
    },

    /**
     * 重置分数牌集合
     */
    resetFenCard: function () {
        if (!this.fenCards)
            return;
        this.fenCards.card5 = 0;
        this.fenCards.card10 = 0;
        this.fenCards.cardk = 0;
    },

    /**
     * 获取分数牌集合
     */
    GetFenCards: function () {
        return this.fenCards;
    },

    /**
     * 发牌后信息
     */
    SetsendPoker: function (msg) {
        this.SetState(msg.state);
        this.SetNextID(msg.nextId);
        this.SetTime(msg.time);
        this.setTeamData(msg.teamList);
        this.setTeamID(msg.listList);
        this.setExchangeList(msg.changeListList);
    },

    /**
     * 转幺玩家交换列表
     * @param list交换列表数组
     */
    setExchangeList: function (list) {
        this.exchangeList = list;
    },

    /**
     * 转幺刷新玩家信息列表
     */
    RefreshPlayerInfo: function () {
        if (!this.exchangeList || this.exchangeList.length <= 0 || !this.deskInfo)
            return false;
        if (!this.playerInfo) return false;
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            console.log('交换之前玩家位置 site:' + player.site + "  ID: " + player.userId);
        }

        var exchangeList = [];
        for (var i = 0; i < this.exchangeList.length; ++i) {
            var index = this.exchangeList[i];
            var player = this.playerInfo[index];
            if (player) {
                player.site = index;
                exchangeList.push(player);
            }
        }

        var max = exchangeList.length - 1;
        if (max > 0) {
            console.log("交换位置的玩家IP:" + exchangeList[0].userId + "另一个玩家IP:" + exchangeList[max].userId);
            this.playerInfo[this.exchangeList[0]] = exchangeList[max];
            this.playerInfo[this.exchangeList[max]] = exchangeList[0];
        }

        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            console.log('交换之后玩家位置 site:' + player.site + "  ID: " + player.userId);
        }

        return true;
    },


    /**
     * 刨幺玩家结构
     */
    initGamePlayerData: function () {
        if (!this.deskInfo || !this.playerInfo)
            return;
        for (var i = 0; i < this.deskInfo.length; ++i) {
            for (var j = 0; j < this.playerInfo.length; ++j) {
                var roledata = this.deskInfo[i];
                var playerdata = this.playerInfo[j];
                if (playerdata && roledata.id == playerdata.userId) {
                    playerdata.score = roledata.totalScore * 0.1; //玩家积分
                    playerdata.team_id = roledata.teamId; //队伍ID
                    playerdata.poker = roledata.poker; //手牌
                    playerdata.a_num = roledata.aNum; //A的数量
                    playerdata.y_num = roledata.yNum; //4的数量
                    playerdata.out_index = roledata.outIndex; //出完牌的顺序
                    playerdata.is_auto = roledata.isAuto; // 是否托管
                    playerdata.is_online = roledata.isOnline; //是否在线
                    playerdata.poker_num = roledata.pokerNum; //手牌的数量
                    playerdata.coin = roledata.totalScore; //金币数量
                    playerdata.ready = roledata.ready; //是否准备
                    playerdata.double = roledata.double; //是否加倍
                    playerdata.xue = roledata.xue; //雪
                    playerdata.yao = roledata.yao;//是否选幺
                    playerdata.out_poker = roledata.outPokerList; //牌值（不要时候值为【16#FF）
                }
            }
        }
    },

    /**
    * 通过id获取用户
    * @param uiserid 玩家ID
    */
    getPlayer: function (userId) {
        var player = null;
        if (!this.playerInfo) return player;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                player = this.playerInfo[i];
                break;
            }
        }
        return player;
    },

    /**
     * 获取玩家信息
     * @param Viewid 座位号
     */
    getPlayerByViewID: function (viewid) {
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var view = this.idToView(this.playerInfo[i].userId);
            if (view == viewid)
                return this.playerInfo[i];
        }
    },

    getPlayerList() {
        return this.playerInfo;
    },

    /**
     * 设置队伍ID
     * @param teamInfo 队伍信息
     */
    setTeamID: function (teamInfo) {
        for (var i = 0; i < teamInfo.length; ++i) {
            for (var j = 0; j < this.playerInfo.length; ++j) {
                var teamdata = teamInfo[i];
                var playerdata = this.playerInfo[j];
                if (teamdata.id == playerdata.userId) {
                    playerdata.team_id = teamdata.teamId; //队伍ID
                }
            }
        }
    },

    /**
     * 得到队友的信息
     * @param userid 玩家userid
     */
    GetTeammateInfo: function (userid) {
        var teamid = this.getPlayer(userid).team_id;
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            if (teamid == player.team_id && userid != player.userId) {
                return player;
            }
        }
    },

    /**
     * 判断是不是队友
     */
    getTeammateStr: function (userid) {
        if (userid == cc.dd.user.id) return '自己';
        var teamid1 = this.getPlayer(cc.dd.user.id).team_id;
        var teamid2 = this.getPlayer(userid).team_id;
        return teamid1 == teamid2 ? '己方' : '对方';
    },

    /**
     * 判断是不是队友
     */
    checkTeammate: function (userid) {
        if (!this.checkIsTeammate()) return false;
        if (userid == cc.dd.user.id) return true;
        var teamid1 = this.getPlayer(cc.dd.user.id).team_id;
        var teamid2 = this.getPlayer(userid).team_id;
        return teamid1 == teamid2 ? true : false;
    },

    /**
     * 判断是否有队伍
     */
    checkIsTeammate: function () {
        var isTeammate = false;
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            if (player.team_id > 0) {
                isTeammate = true;
            }
        }
        return isTeammate;
    },

    /**
     * 设置是否加倍
     * @param 玩家userid
     * @param isDoble 是否加倍
     */
    setDouble: function (userid, isDoble) {
        var player = this.getPlayer(userid);
        if (player)
            player.double = isDoble;
    },

    /**
     * 设置是否准备
     * @param userid 玩家userid
     * @param idReady 是否准备
     */
    setReady: function (userid, isReady) {
        var player = this.getPlayer(userid);
        if (player)
            player.ready = isReady;
    },

    /**
     * 重置出完牌顺序
     * @param userid 玩家userid
     */
    ResetOutIndex: function (userid) {
        var player = this.getPlayer(userid);
        if (player)
            player.out_index = 0;
    },

    /**
     * 得到房间类型
     */
    GetGameType: function () {
        return this.m_GameType;
    },

    /**
     * 得到底分
     */
    GetScore: function () {
        return this.m_BaseScore ? this.m_BaseScore : 0;
    },

    /**
     * 当前局数
     */
    GetCurCircle: function () {
        return this.curCircle > 0 ? this.curCircle : 1;
    },

    /**
     * 下一局
     */
    AddCurCircle: function () {
        ++this.curCircle;
    },

    /**
     * 减少局数
     */
    ReduceCurCircle: function () {
        --this.curCircle;
    },

    /**
     * 设置房间状态
     */
    SetState: function (state) {
        this.m_State = state;
    },

    /**
     * 得到房间状态
     */
    GetState: function () {
        return this.m_State;
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
     * 增加出牌pass数量
     */
    refreshcardPassNum: function (bl) {
        if (bl)
            ++this.cardPassNum;
        else
            this.cardPassNum = 0;
    },

    /**
     * 获取一圈pass数量
     */
    getcardPassNum: function () {
        return this.cardPassNum;
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

    /**
     * 设置当前操作玩家ID
     */
    SetNextID: function (next_id) {
        this.m_Next_ID = next_id;
    },

    /**
     * 获取当前操作玩家ID
     */
    GetNextID: function () {
        return this.m_Next_ID;
    },

    /**
     * 获取队伍信息
     */
    GetTeamInfo: function () {
        return this.TeamInfo;
    },

    /**
     * 重置队伍分数
     */
    resetTeamInfo: function () {
        for (var i = 0; i < this.TeamInfo.length; ++i) {
            this.TeamInfo[i].score = 0;
        }
        PY_ED.notifyEvent(PY_Event.UPDELE_TOOLSCORE);
    },

    /**
     * 设置队伍积分
     */
    setPlayerScore: function (listscore) {
        var roomtype = RoomMgr.Instance().gameId;
        for (var i = 0; i < listscore.length; ++i) {
            for (var j = 0; j < this.playerInfo.length; ++j) {
                var listdata = listscore[i];
                var playerdata = this.playerInfo[j];
                if (listdata.id == playerdata.userId) {
                    if (roomtype == Define.GameType.PAOYAO_GOLD)
                        playerdata.coin += listdata.score;
                    else
                        playerdata.score += listdata.score;
                }
            }
        }
    },

    /**
     * 更新队伍积分
     * @param teamID 队伍ID
     * @param score 分数
     */
    updeleTeamInfo: function (teamId, score) {
        for (var i = 0; i < this.TeamInfo.length; ++i) {
            if (this.TeamInfo[i].id == teamId) {
                this.TeamInfo[i].score = score;
                PY_ED.notifyEvent(PY_Event.UPDELE_TOOLSCORE);
            }
        }
    },

    /**
     * 获取队伍积分
     * @param teamID 队伍ID
     */
    getTeamScoreByID: function (teamId) {
        for (var i = 0; i < this.TeamInfo.length; ++i) {
            if (this.TeamInfo[i].id == teamId) {
                return this.TeamInfo[i].score;
            }
        }
        return 0;
    },

    /**
     * 自己队伍的ID
     */
    GetPlayerTeamID: function () {
        var playerID = hallData.getInstance().userId;
        for (var i = 0; i < this.playerInfo.length; ++i) {
            if (this.playerInfo[i].userId == playerID) {
                return this.playerInfo[i].team_id;
            }
        }
    },

    /**
     * 设置下一次操作结束时间戳
     */
    SetTime: function (time) {
        this.m_Time = time;
    },

    /**
     * 获取下一次操作结束时间戳
     */
    GetTime: function () {
        return this.m_Time < 0 ? 20 : this.m_Time;
    },

    /**
     * 显示人数
     */
    GetPopulationStr: function () {
        return this.m_Population ? '东北刨幺-' + 4 + '人' : '';
    },

    GetPopulation: function () {
        return this.m_Population;
    },
    /**
     * 显示圈数
     */
    GetBureauNum: function () {
        return RoomMgr.Instance()._Rule.circleNum ? "共" + RoomMgr.Instance()._Rule.circleNum + "局" : "";
    },

    /**
     * 玩法
     */
    GetPlay: function () {
        var play = RoomMgr.Instance()._Rule.isMing;
        if (play)
            return '明幺';
        else
            return '暗幺';
    },

    /**
     * 规则1
     */
    GetRule1: function () {
        var isDui = RoomMgr.Instance()._Rule.isDui;
        var hasSan = RoomMgr.Instance()._Rule.hasSan;
        var issan = RoomMgr.Instance()._Rule.isSan;
        if (!isDui)
            return PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.TRUN_YAO);
        else if (hasSan) {
            if (issan)
                return PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.HAVE_3);
            else
                return PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.SMALL_3);
        } else
            return PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.NOHAVE_3);
    },

    /**
     * 规则2
     */
    GetRule2: function () {
        var hasSan = RoomMgr.Instance()._Rule.hasSan;
        if (!hasSan)
            return '';
        var issan = RoomMgr.Instance()._Rule.isSan;
        if (issan)
            return '3比2大'
        else
            return '3比2小';
    },

    /**
     * 规则3
     */
    GetRule3: function () {
        var isDui = RoomMgr.Instance()._Rule.isDui;
        if (isDui) return '';
        var hasSan = RoomMgr.Instance()._Rule.hasSan;
        if (!hasSan)
            return '无3';
        else
            return '有3';
    },

    /**
     * 规则4
     */
    GetRule4: function () {
        var str = ''
        var isDui = RoomMgr.Instance()._Rule.isDui;
        if (isDui) str += '经典玩法';
        else str += '转幺'
        var hasSan = RoomMgr.Instance()._Rule.hasSan;
        if (!hasSan)
            str += ',无3';
        else {
            var issan = RoomMgr.Instance()._Rule.isSan;
            if (issan)
                str += ',3比2大'
            else
                str += ',3比2小';
        }
        return str;
    },

    /**
     * 刷新房间数据
     */
    updatePlayerNum: function (msg) {
        if (this.playerInfo && this.playerInfo.length) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId) {
                    this.playerExit(this.playerInfo[i].userId);
                }
            }
        }

        this.playerInfo = new Array(this.m_Population);
    },

    /**
     * 房间玩家集合
     */
    GetPlayerInfo: function () {
        return this.playerInfo;
    },

    /**
     * 获取房间内玩家数据
     * @param view 顺序座位号
     */
    GetPlayerData: function (view) {
        if (!this.playerInfo)
            return;
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var palyer = this.playerInfo[i];
            if (palyer && this.idToView(palyer.userId) == view) {
                return palyer;
            }
        }
        return null;
    },

    /**
     * 相差多少人满员
     */
    DifferPersonnel: function () {
        if (this.playerInfo) {
            return this.m_Population - this.playerInfo.length;
        }
        return this.m_Population;
    },

    /**
     * 检查座位是否坐满
     */
    checkPlayer: function () {
        for (var i = 0; i < this.m_Population; ++i) {
            if (!this.playerInfo[i])
                return false;
        }
        return true;
    },

    /**
     * 玩家进入房间
     */
    playerEnter: function (roleInfo) {
        var player = this.genPlayerData(roleInfo);
        this.playerInfo[player.site] = player;
        if (this.getGameId() == Define.GameType.PAOYAO_GOLD) { //特殊处理（金币场玩家信息和桌子协议时序问题）
            if (this.checkPlayer()) {
                this.initGamePlayerData();
                PY_ED.notifyEvent(PY_Event.INIT_ROOM);
            }
        } else {
            cc.log("------进入的玩家： ", player.userId);
            PY_ED.notifyEvent(PY_Event.PLAYER_ENTER, player);
        }
    },

    addPlayer: function (player) {
        var playerData = {
            userId: player.userId,
            name: player.nickName,
            sex: player.sex == 1 ? 1 : 0,
            headUrl: player.headUrl,
            score: player.score,
            site: player.site - 1,
        }
        if (!this.playerInfo)
            this.playerInfo = new Array(this.m_Population);
        this.playerInfo[playerData.site] = playerData;
        if (this.checkPlayer()) {
            for (var i = 0; i < this.playerInfo.length; ++i) {
                PY_ED.notifyEvent(PY_Event.PLAYER_ENTER, this.playerInfo[i]);
            }
        }
    },

    /**
    * 注册房间内语音玩家
    */
    requesYuYinUserData() {
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

    //玩家离开
    playerExit: function (userId) {
        if (userId == cc.dd.user.id) {
            this.playerInfo = [];
            return;
        }

        var view = this.idToView(userId);
        if (this.playerInfo != null) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId == userId) {
                    this.playerInfo[i] = null;
                }
            }
        }
        PY_ED.notifyEvent(PY_Event.PLAYER_EXIT, view);

    },

    //刨幺队伍
    setTeamData: function (team_info) {
        if (!team_info)
            return;
        this.TeamInfo = team_info;
    },


    //玩家信息
    genPlayerData: function (role_info) {
        var playerData = {
            userId: role_info.userId,
            name: role_info.name,
            sex: role_info.sex == 1 ? 1 : 0,
            headUrl: role_info.headUrl,
            score: 0,
            ip: null,
            site: role_info.seat,
            state: role_info.state,
            openId: role_info.openId,
            winTimes: role_info.winTimes,
            totalTimes: role_info.totalTimes,
            coin: role_info.coin,
            ready: role_info.isReady,
            level: role_info.level,
            exp: role_info.exp,
            vipLevel: role_info.vipLevel,
            location: role_info.latlngInfo,
            isSwitch: role_info.isSwitch,
            netState: role_info.netState,

            setReady: function (isReady) {
                this.ready = isReady;
                PY_ED.notifyEvent(PY_Event.PLAYER_READY, this);
            },
            setOnLine: function (isOnline) {
                this.is_online = isOnline;
                PY_ED.notifyEvent(PY_Event.PLAYER_ISONLINE, [this, isOnline]);
            },
        }
        return playerData;
    },

    //玩家id转view ID
    idToView: function (id) {
        var index = -1;
        if (!this.playerInfo) {
            return null;
        }
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == id) {
                index = this.playerInfo[i].site;
                break;
            }
        }
        if (index == -1) {
            return null;
        }
        return this.seatToView(index);
    },


    //座位号转view ID
    seatToView: function (seat) {
        var playerID = hallData.getInstance().userId;
        var index = -1;
        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == playerID) {
                index = this.playerInfo[i].site;
                break;
            }
        }
        var view = seat - index;
        if (view < 0) {
            view += this.m_Population;
        }
        return view;
    },
});

module.exports = {
    PaoYao_Data: PaoYao_Data,
    PY_ED: PY_ED,
    PY_Event: PY_Event,
};
