
var ED = require("EventDispatcher");
var hallData = require('hall_common_data').HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var game_room_cfg = require('game_room');
/**
 * 事件管理
 */
var GDY_Event = cc.Enum({
    PLAYER_ENTER: 'PLAYER_ENTER', //玩家进入
    PLAYER_EXIT: 'PLAYER_EXIT', //玩家离开
    PLAYER_DISSOLUTION: 'PLAYER_DISSOLUTION', //自己离开房间
    PLAYER_READY: 'PLAYER_READY', //玩家准备
    PLAYER_ISONLINE: 'PLAYER_ISONLINE', //玩家离线或者上线
    RECONNECT: 'RECONNECT', //重连
    DISSOLVE: 'DISSOLVE', //解散
    DISSOLVE_RESULT: 'DISSOLVE_RESULT',     //解散结果
    DESK_INIT: 'DESK_INIT', //桌子初始化
    HAND_POKER: 'HAND_POKER', //发牌
    CHANGE_GUAN: 'CHANGE_GUAN',//玩家关状态改变
    TUOGUAN: 'TUOGUAN',//托管状态改变
    ACT_ACK: 'ACT_ACK', //玩家操作返回
    CHANGE_RATE: 'CHANGE_RATE', //改变桌面倍数
    RESULT_RET: 'RESULT_RET', //小结算
    TOTAL_RESULT: 'TOTAL_RESULT', //大结算
});

var GDY_ED = new ED();
var instance = null;
var GDY_Data = cc.Class({
    statics: {
        /**
         * 获取实例
         */
        Instance: function () {
            if (cc.dd.Utils.isNull(instance)) {
                instance = new GDY_Data();
            }
            return instance;
        },

        Destroy: function () {
            if (instance) {
                instance = null;
            }
        },
    },

    /**
    * 构造函数
    */
    ctor: function () {
        //玩家信息
        this.playerInfo = null;
        //底分
        this.underScore = 0;
        //当前局数
        this.currentnNum = 1;
        //公共倍数
        this.rateNum = 0;
        //房间号
        this.roomid = null;
        //桌子牌剩余张数
        this.cardNum = 0;
        //增加的手牌
        this.handPoker = null;
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
            bready: role_info.isReady,
            level: role_info.level,
            exp: role_info.exp,
            vipLevel: role_info.vipLevel,
            location: role_info.latlngInfo,
            isSwitch: role_info.isSwitch,
            netState: role_info.netState,
            viewidx: null,
            isAuto: false,
            isOnLine: true,

            setReady: function (isReady) {
                this.bready = isReady;
                GDY_ED.notifyEvent(GDY_Event.PLAYER_READY, this);
            },
            setOnLine: function (isOnline) {
                this.isOnLine = isOnline;
                GDY_ED.notifyEvent(GDY_Event.PLAYER_ISONLINE, [this, isOnline]);
            },

            setisAuto : function(bl){
                this.isAuto = bl;
                GDY_ED.notifyEvent(GDY_Event.TUOGUAN,this);
            }
        }
        return playerData;
    },

    //玩家id转view ID
    idToView: function (id) {
        var index = -1;
        if (!this.playerInfo)
            return null;

        for (var i = 0; i < this.playerInfo.length; i++) {
            if (this.playerInfo[i] && this.playerInfo[i].userId == id) {
                index = this.playerInfo[i].site;
                break;
            }
        }
        if (index == -1)
            return null;
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
        if (view < 0)
            view += this.getPlayerNum();
        return view;
    },

    /**
     * 根据玩家视觉座位号获取玩家数据
     * @param viewid 视觉座位号
     */
    getPlayerByViewIdx: function (viewid) {
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            if (player && player.viewidx == viewid) {
                return player;
            }
        }
        //cc.log("玩家视角座位号错误 viewIdx=" + viewid + " 无法获取玩家");
    },

    /**
     * 获取玩家列表
     */
    getPlayerList: function () {
        return this.playerInfo;
    },

    /**
     * 是否满座
     */
    isFullSeat: function () {
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            if (!player) return false;
        }
        return true;
    },

    /**
     * 获取玩家信息
     */
    getPlayer: function (userId) {
        for (var i = 0; i < this.playerInfo.length; ++i) {
            var player = this.playerInfo[i];
            if (player && player.userId == userId)
                return player;
        }
        cc.log('没找到玩家信息 UserID:', userId);
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
    /**
     * 玩家进入房间
     */
    playerEnter: function (roleInfo) {
        var player = this.genPlayerData(roleInfo);
        this.playerInfo[player.site] = player;
        var view = this.idToView(player.userId);
        player.viewidx = view;
        cc.log("------进入的玩家ID： ", player.userId);
        GDY_ED.notifyEvent(GDY_Event.PLAYER_ENTER, player);
    },

    //玩家离开
    playerExit: function (userId) {
        if (userId == cc.dd.user.id) {
            this.playerInfo = [];
            GDY_ED.notifyEvent(GDY_Event.PLAYER_DISSOLUTION, view);
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
        cc.log("------离开玩家ID： ", userId);
        GDY_ED.notifyEvent(GDY_Event.PLAYER_EXIT, view);
    },

    /**
    * 注册房间内语音玩家
    */
    requesYuYinUserData() {
        cc.dd.AudioChat.clearUsers();
        if (this.playerInfo) {
            this.playerInfo.forEach(function (player) {
                if (player) {
                    if (player.userId != cc.dd.user.id) {
                        cc.dd.AudioChat.addUser(player.userId);
                    }
                }
            }, this);
        }
    },

    /**
     * 刷新房间数据
     */
    updatePlayerNum: function (msg) {
        if (this.playerInfo) {
            for (var i = 0; i < this.playerInfo.length; i++) {
                if (this.playerInfo[i] && this.playerInfo[i].userId) {
                    this.playerExit(this.playerInfo[i].userId);
                }
            }
        }
        var playernum = this.getPlayerNum();
        this.playerInfo = new Array(playernum);
    },

    /**
     * 刷新玩家状态信息
     */
    refreshPlayeInfo: function (rolelist) {
        if (!rolelist) return;
        for (var i = 0; i < rolelist.length; ++i) {
            var role = rolelist[i];
            if (!role) continue;
            var player = this.getPlayer(role.id);
            if (player) {
                player.isAuto = role.isAuto; //托管
                player.bready = role.ready; //准备
                player.isOnLine = role.isOnline; //在线
                player.guan = role.guan; //是否被关
                player.score = role.score; //分数
            }
        }
    },

    /**
     * 桌子数据
     */
    setDeskData: function (msg) {
        this.currentnNum = msg.curCircle; //当前局数
        this.rateNum = msg.rate; //公共倍数
        this.cardNum = msg.lastCardNum; //剩余牌张数
        var room_cfg = game_room_cfg.getItem(function (item) {
            return item.key == msg.configRoomId;
        });
        if (room_cfg) {
            this.roomid = room_cfg.roomid;
            this.underScore = room_cfg.entermin;
        }
        //刷新玩家状态信息
        this.refreshPlayeInfo(msg.roleListList)
    },

    /**
     * 开始发牌数据
     */
    setSendPoker: function (msg) {
        this.cardNum -= msg.cardNum; //发牌张数
        this.handPoker = msg.listList;
        cc.log('开始发牌数据', this.handPoker);
    },

    /**
     * 玩家准备返回
     */
    setRoomReady: function (msg) {
        var player = this.getPlayer(msg.userId);
        if (player)
            player.setReady(true);
    },

    /**
     * 托管
     */
    setisAuto : function(msg){
        var player = this.getPlayer(msg.id);
        if (player)
            player.setisAuto(msg.isTuoguan);
    },

    getRoomInfo: function () {
        return '干瞪眼-' + this.getPlayerNum() + '人';
    },

    /**
     * 房间玩家人数
     */
    getPlayerNum: function () {
        return RoomMgr.Instance()._Rule.roleCount ? RoomMgr.Instance()._Rule.roleCount : 3;
    },

    /**
     * 当前第几局
     */
    GetCurrentnNum: function () {
        return this.currentnNum;
    },

    /**
     * 公共倍数
     */
    GetRateNum: function () {
        return this.rateNum;
    },

    /**
     * 显示圈数
     */
    GetBureauNum: function () {
        var rule = RoomMgr.Instance()._Rule;
        return rule && rule.circleNum ? rule.circleNum : 1;
    },

    /**
     * 游戏底分
     */
    getScore: function () {
        return this.underScore > 0 ? this.underScore : 1;
    },

    /**
     * 房间号
     */
    GetRoomid: function () {
        return this.roomid ? this.roomid : RoomMgr.Instance().roomId;
    },

    /**
     * 桌子牌剩余张数
     */
    GetCardNum: function () {
        return this.cardNum;
    },

    /**
     * 玩家增加的手牌
     */
    getHandPoker: function () {
        cc.log('玩家增加的手牌', this.handPoker);
        return this.handPoker;
    },

    /**
     * 规则信息
     */
    getGuzeInfo: function () {
        var str = '';
        var rule = RoomMgr.Instance()._Rule;
        if (!rule)
            return str;
        str += rule.maxScore == 0 ? '无限倍' : rule.maxScore + "倍";
        if (rule.ruanSan)
            str += '，三张不为软炸';
        if (rule.biCard)
            str += '，有牌必出';
        if (rule.quanguan)
            str += '，全关';
        if (rule.wangDouble)
            str += '，手中剩单王x2,双王x8倍';
        if (rule.bombDouble)
            str += '，手中剩炸翻倍';
        return str;
    },

    /**
     * 规则多少倍
     */
    getGuzeBei: function () {
        var str = '';
        var rule = RoomMgr.Instance()._Rule;
        if (!rule) return str;
        if (rule.maxScore == 0)
            str += '不限';
        else
            str += rule.maxScore + '倍';
        return str;
    },

    /**
     * 是否全关
     */
    getQuanGuan: function () {
        var rule = RoomMgr.Instance()._Rule;
        return rule && rule.quanguan ? rule.quanguan : true;
    },
});

module.exports = {
    GDY_Data: GDY_Data,
    GDY_ED: GDY_ED,
    GDY_Event: GDY_Event,
};