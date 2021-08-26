var Define = require('Define');
var ED = require("EventDispatcher");
var HBSL_ED = new ED();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;


/**
 * 事件管理
 */
var HBSL_Event = cc.Enum({
    DESK_INIT: 'DESK_INIT', //桌子初始化
    PLAYER_READY: 'PLAYER_READY', //玩家准备
    PLAYER_ENTER: 'PLAYER_ENTER', //朋友场玩家参加游戏
    PLAYER_ROBHB: 'PLAYER_ROBHB', //广播玩家抢红包
    PLAYER_Exit: 'PLAYER_Exit', //玩家退出房间
    PLAYER_ROB: 'PLAYER_ROB', //玩家抢红包
    PLAYER_MAIHB: 'PLAYER_MAIHB', //玩家埋红包
    PULL_MINE: 'PULL_MINE', //拉取埋雷玩家列表
    OPEN_LOTTERY: 'OPEN_LOTTERY', //开奖
    SETTLEMENT: 'SETTLEMENT', //大结算
    DISSOLVE: 'DISSOLVE', //结算返回
    DISSOLVE_RESULT: 'DISSOLVE_RESULT', //结算结果
    RECONNECT: 'RECONNECT', //重连
    CANCLEMAILEI: 'CANCLEMAILEI', //取消埋雷
    UPDATECOIN: 'UPDATECOIN', //更新金币
    CLICK_ITME: 'CLICK_ITME', //点击面板
    OPEN_WUXIAN: 'OPEN_WUXIAN', //开启自动抢包功能

});

var HBSL_Data = cc.Class({
    instance: null,
    statics: {
        Instance: function () {
            if (!this.instance) {
                this.instance = new HBSL_Data();
            }
            return this.instance;
        },

        Destroy: function () {
            this.saoLeiInfo = [];
            if (this.instance) {
                this.instance = null;
            }
        },
    },

    /**
    * 构造函数
    */
    ctor: function () {
        /**
         * 红包倒计时
         */
        this.time = 0;
        /**
         * 埋雷玩家信息
         */
        this.maiLeiInfo = null;
        /**
         * 参与扫雷玩家列表
         */
        this.saoLeiInfo = [];
        /**
         * 玩家自己的信息
         */
        this.selfInfo = null;
        /**
         * 当前多少局
         */
        this.round = 0;
        /**
         * 游戏状态
         */
        this.gamestate = false;
        /**
         * 红包状态
         */
        this.deskState = false;
    },

    getTime: function () {
        return this.time;
    },

    getMaiLeiData: function () {
        return this.maiLeiInfo;
    },

    getSaoLeiData: function () {
        return this.saoLeiInfo;
    },

    getSelfInfoData: function () {
        return this.selfInfo;
    },

    getDeskState: function () {
        return this.deskState;
    },

    getHongBaoNum: function () {
        if (!this.gamestate || !this.maiLeiInfo || !this.maiLeiInfo.role) return 0;
        var rule = RoomMgr.Instance()._Rule;
        var num = 10;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL)
            num = rule.maxBaonum;
        var count = this.robHBPlayer();
        return num - count >= 0 ? num - count : 0;
    },

    /**
     * 已经抢红包的人数
     */
    robHBPlayer: function () {
        var num = 0;
        var list = this.getAllPlaye();
        list.forEach(function (role) {
            if (role.openMoney != 0)
                num++;
        }.bind(this));
        return num;
    },

    /**
     * 所有玩家
     */
    getAllPlaye: function () {
        var list = [];
        var fun = function (role) {
            if (!role) return;
            var bl = false;
            list.forEach(function (item) {
                if (item.userid == role.userid)
                    bl = true;
            }.bind(this));
            if (!bl)
                list.push(role);
        }.bind(this);

        this.saoLeiInfo.forEach(function (role) {
            fun(role);
        }.bind(this));

        fun(this.selfInfo);
        if (this.maiLeiInfo && this.maiLeiInfo.role) {
            fun(this.maiLeiInfo.role);
        }
        return list;
    },

    getRound: function () {
        return this.round;
    },

    getGamestate: function () {
        return this.gamestate;
    },

    getPlayerData: function (userid) {
        var role = null;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var playelist = this.getAllPlaye();
            playelist.forEach(function (player) {
                if (player.userid == userid) {
                    role = player;
                    return;
                }
            }.bind(this));
        } else if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            this.goodPlayerList.forEach(function (player) {
                if (player.userid == userid) {
                    role = player;
                    return;
                }
            }.bind(this));
        }
        return role;
        cc.log('----- 没有找到该玩家 ID:', userid);
    },

    updatePlayerNum: function () {
        this.saoLeiInfo = [];
    },

    /**
     * 获取观战列表
     */
    getWatchingPlayer: function () {
        var list = [];
        var allplayer = this.getAllPlaye();
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            allplayer.forEach(function (player) {
                list.push(player);
            }.bind(this));
        } else if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            allplayer.forEach(function (player) {
                this.addGoodSaoleiInfo(player);
            }.bind(this));
            this.goodPlayerList.forEach(function (player) {
                list.push(player);
            }.bind(this))
        }
        return list;
    },


    /**
     * 朋友场玩家参加游戏
     */
    playerEnter: function (player) {
        cc.log('玩家进入房间', player.userId, '位置：', player.seat);
        var role = new RoleData();
        role.setAddRoleData(player);
        if (player.userId == cc.dd.user.id) {
            this.selfInfo = role;
        }
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            if (player.userId != cc.dd.user.id && player.seat != -1) {
                this.addSaoLeiInfo(role);
            }
            HBSL_ED.notifyEvent(HBSL_Event.PLAYER_ENTER, role);
        } else {
            this.addGoodSaoleiInfo(role);
        }
    },

    playerExit: function (userId) {
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            for (var i = 0; i < this.goodPlayerList.length; ++i) {
                var role = this.goodPlayerList[i];
                if (role.userid == userId)
                    this.goodPlayerList.splice(i, 1);
            }
        } else {
            for (var i = 0; i < this.saoLeiInfo.length; ++i) {
                var role = this.saoLeiInfo[i];
                if (role.userid == userId)
                    this.saoLeiInfo.splice(i, 1);
            }
        }
        HBSL_ED.notifyEvent(HBSL_Event.PLAYER_Exit, userId);
    },

    requesYuYinUserData: function () {
        cc.dd.AudioChat.clearUsers();
    },

    /**
     * 桌子消息
     */
    setDeskData: function (msg) {
        if (!msg) return;
        this.saoLeiInfo = [];
        this.time = msg.nextTime; //红包倒计时
        this.deskState = msg.state == 2 ? false : true;
        this.maiLeiInfo = new MaiLeiData();
        this.maiLeiInfo.setMaiLeiData(msg.zhuang);
        this.gamestate = true;
        msg.playersList.forEach(function (player) {
            var role = new RoleData();
            role.setRoleData(player);
            if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
                if (role.userid == cc.dd.user.id) {
                    this.selfInfo = role;
                } else if (player.ready) {
                    this.addSaoLeiInfo(role);
                }
            }
        }.bind(this));
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            this.selfInfo = new RoleData();
            this.selfInfo.setRoleData(msg.self);
        }

        this.round = msg.round;
        HBSL_ED.notifyEvent(HBSL_Event.DESK_INIT, this);
    },

    /**
     * 添加扫雷玩家
     */
    addSaoLeiInfo: function (role) {
        var bl = false;
        this.saoLeiInfo.forEach(function (player) {
            if (player.userid == role.userid) {
                player = role;
                bl = true;
            }
        }.bind(this))
        if (!bl)
            this.saoLeiInfo.push(role);
    },

    /**
     * 金币场添加玩家
     */
    addGoodSaoleiInfo: function (role) {
        if (!this.goodPlayerList)
            this.goodPlayerList = [];
        var bl = false;
        this.goodPlayerList.forEach(function (player) {
            if (player.userid == role.userid) {
                player.money = role.money;
                bl = true;
            }
        }.bind(this));
        if (!bl)
            this.goodPlayerList.push(role);
    },

    setReadyData: function (msg) {
        var player = this.getPlayer(msg.id);
        if (player)
            player.setReady(true);
    },

    getPlayer: function (userid) {
        return this.getPlayerData(userid);
    },

    /**
     * 解散玩家集合
     */
    GetPlayerInfo: function () {
        var list = this.getAllPlaye();
        list.forEach(function (role) {
            role.userId = role.userid;
        }.bind(this));
        return list;
    },

    /**
     * 拉取埋雷玩家信息
     */
    pullMaiLeiData: function (msg) {
        if (!msg) return;
        var list = [];
        msg.playersList.forEach(function (player) {
            var item = new MaiLeiData();
            item.setMaiLeiData(player);
            list.push(item);
        }.bind(this));
        HBSL_ED.notifyEvent(HBSL_Event.PULL_MINE, list);
    },

    /**
     * 广播添加扫雷玩家
     */
    addSaoLeiPlyaer: function (player) {
        var role = new RoleData();
        role.setRoleData(player);
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            if (role.userid == cc.dd.user.id)
                this.selfInfo = role;
            else
                this.addSaoLeiInfo(role);
        } else {
            this.addSaoLeiInfo(role);
        }
        HBSL_ED.notifyEvent(HBSL_Event.PLAYER_ROBHB, role);
    },

    /**
     * 自己扫雷
     */
    addSelfPlayer: function (msg) {
        //this.selfInfo.money += msg.money;
        HBSL_ED.notifyEvent(HBSL_Event.PLAYER_ROB, msg);
    },

    /**
     * 开奖
     */
    updateSettlement: function (msg) {
        this.maiLeiInfo = null;
        this.time = 0;
        this.robHBList = [];
        this.deskState = true;
        this.saoLeiInfo.forEach(function (role) {
            if (role.userid == msg.zhaung.id) {
                role.money += msg.zhaung.result;
            }
        }.bind(this));

        if (msg.zhaung.id == this.selfInfo.userid)
            this.selfInfo.money += msg.zhaung.result;
        
        msg.playersList.forEach(function (role){
            var player = this.getPlayer(role.id);
            if(player){
                player.money += role.money;
            }
        }.bind(this));

        HBSL_ED.notifyEvent(HBSL_Event.OPEN_LOTTERY, msg);
    },

    /**
     * 旁观者准备
     */
    onlookersReady: function (msg) {
        if (!msg) return;
        var role = this.getPlayer(msg.id);
        if (role)
            role.setReady(true);
    },

    /**
     * 庄类型
     */
    getZhuangStr: function () {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return;
        var str = '';
        switch (Rule.zhuangType) {
            case 1:
                str = '轮庄';
                break;
            case 2:
                str = '最佳手气';
                break;
            case 3:
                str = '最差手气';
                break;
            case 4:
                str = '抢庄';
                break;
            case 5:
                str = '固定庄';
                break;
        }
        return str;
    },

    /**
     * 最大倍数
     */
    getBeiStr: function () {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return;
        return '最大' + Rule.maxRate + '倍';
    },

    /**
     * 最低埋雷
     */
    getMaiLeiStr: function () {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return;
        return '最低埋雷数 ' + Rule.mailei / 10000;
    },

    /**
     * 模式
     */
    getModeStr: function () {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return;
        return Rule.model ? '必抢' : '选抢';
    },

});

var MaiLeiData = cc.Class({
    properties: {
        role: null,
        money: 0,
        num: 0,
        rate: 0,
        id: 0, //唯一标识
    },

    ctor: function () {

    },

    setMaiLeiData: function (msg) {
        if (!msg) return;
        this.id = msg.id;
        this.num = msg.num;
        this.money = msg.money;
        this.role = new RoleData();
        this.role.setRoleData(msg.role);
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            this.rate = msg.rate;
        } else {
            this.rate = msg.rate * 0.1;
        }
    },
});

var RoleData = cc.Class({
    properties: {
        userid: 0,
        money: 0,
        headUrl: null,
        name: '',
        openMoney: 0,
        result: 0,
        state: 0,
        ready: false,
    },

    //玩家准备
    setReady: function (bl) {
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            this.ready = bl;
            cc.log('玩家 ：', this.userid + '准备', bl);
            HBSL_ED.notifyEvent(HBSL_Event.PLAYER_READY, this);
        }
    },

    //玩家离线
    setOnLine: function (bl) {
        cc.log('玩家 ：', this.userid + '离线！');
    },

    /**
     * 更新玩家金币
     */
    setMoney: function (num) {
        this.money = num;
        if (this.userid == cc.dd.user.id)
            HBSL_ED.notifyEvent(HBSL_Event.UPDATECOIN, this);
    },

    ctor: function () {

    },

    setRoleData: function (msg) {
        if (!msg) return;
        this.userid = msg.id;
        this.money = msg.money;
        this.headUrl = msg.head;
        this.name = msg.name;
        this.openMoney = msg.openMoney;
        this.result = msg.result;
        this.state = msg.state;
        this.ready = msg.ready;
    },

    /**
     * 加入房间玩家
     */
    setAddRoleData: function (msg) {
        if (!msg) return;
        this.userid = msg.userId;
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL)
            this.money = msg.score;
        else
            this.money = msg.coin;
        this.headUrl = msg.headUrl;
        this.name = msg.name;
        this.ready = msg.isReady;
    },


});

//自动抢红包
var AutomaticRobMgr = cc.Class({
    instance: null,
    statics: {
        Instance: function () {
            if (!this.instance) {
                this.instance = new AutomaticRobMgr();
            }
            return this.instance;
        },

        Destroy: function () {
            if (this.instance) {
                this.instance = null;
            }
        },
    },
    /**
    * 构造函数
    */
    ctor: function () {
        //抢红包金额集合
        this.hbMoneyArr = [];
        //抢红包次数( -1:无限次)
        this.RobNum = 0;
        //是否开启功能
        this.isOpen = false;
    },

    setRobNum: function (num) {
        this.RobNum = num;
        if (this.RobNum > 0 || num == -1)
            this.isOpen = true;
        for (var i = 0; i < this.hbMoneyArr.length; ++i) {
            var num = this.hbMoneyArr[i];
            cc.log(';抢红包数：', num)
        }
    },

    addHbMoney: function (money) {
        var isare = true;
        for (var i = 0; i < this.hbMoneyArr.length; ++i) {
            var num = this.hbMoneyArr[i];
            if (num == money)
                isare = false;
        }
        if (isare)
            this.hbMoneyArr.push(money);
    },

    deleteHbMoney: function (money) {
        for (var i = 0; i < this.hbMoneyArr.length; ++i) {
            var num = this.hbMoneyArr[i];
            if (num == money)
                this.hbMoneyArr.splice(i, 1);
        }
    },

    /**
     * 金币是否足够
     */
    checkgood: function () {
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL)
            return;
        var minnum = 300;
        for (var i = 0; i < this.hbMoneyArr.length; ++i) {
            var num = this.hbMoneyArr[i];
            if (minnum > num)
                minnum = num;
        }
        var selfdata = HBSL_Data.Instance().getSelfInfoData();
        var money = 0;
        if (selfdata)
            money = selfdata.money * 0.0001;
        if (money < minnum){
            this.cancelAutomaticRob();
        }   
    },

    /**
     * 判断是否可以抢该红包
     */
    checkHbMoney: function (num) {
        var bl = false;
        for (var i = 0; i < this.hbMoneyArr.length; ++i) {
            var money = this.hbMoneyArr[i];
            if (money == num)
                bl = true;
        }
        return bl;
    },

    getRobNum: function () {
        return this.RobNum;
    },

    getisOpen: function () {
        return this.isOpen;
    },

    reduceRobNum: function () {
        if (this.RobNum == -1)
            return;
        if (this.isOpen)
            --this.RobNum;
        if (this.RobNum <= 0)
            this.isOpen = false;
    },

    /**
     * 取消该功能
     */
    cancelAutomaticRob: function () {
        this.hbMoneyArr = [];
        this.RobNum = 0;
        this.isOpen = false;
    }

});

module.exports = {
    HBSL_Data: HBSL_Data,
    HBSL_ED: HBSL_ED,
    HBSL_Event: HBSL_Event,
    AutomaticRobMgr: AutomaticRobMgr,
};

