var dd = cc.dd;
/**
 * 桌子事件类型
 * @type {any}
 */
var TdkCDeskEvent = cc.Enum({
    INIT: 'tdk_desk_init',  //牌桌数据初始化
});
/**
 * 事件管理器
 */
var TdkCDeskED = new dd.EventDispatcher();

var gameRoomData = require('game_room');

var TdkCDeskData = cc.Class({
    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new TdkCDeskData();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },

    properties: {
        /**
         * 人数
         */
        playerCnt: 5,
        /**
         * 全押
         */
        allinCnt: 0,
        /**
         * 基注
         */
        dizhu: 0,
        /**
         * 单注
         */
        danzhu: 0,
        /**
         * 房间号
         */
        roomNum: 1,
        /**
         * 是否烂锅
         */
        isLanGuo: false,
        /**
         * 桌子操作状态
         */
        deskstatus: 0,
        /**
         * 操作的玩家
         */
        actUserId: 0,
        /**
         * 桌上下注筹码数
         */
        betList: [],
        /**
         * 操作剩余时间
         */
        time: 0,
        /**
         * 桌子当前的状态
         */
        deskState: 0,

        /**
         * 当前局数
         */
        CurrentJuShu: 0,
    },
    /**
     * 设置桌面基础数据
     */


    setRoomData: function (roomType, configRoomid) {
        if (roomType == 41) {
            for (var k = 0; k < gameRoomData.items.length; k++) {
                var info = gameRoomData.items[k]
                if (info.gameid == 41 && configRoomid == info.key) {
                    this.allinCnt = info.allin;
                    this.dizhu = info.basescore;
                    this.danzhu = info.basescore;
                    this.roomNum = info.roomid;
                }
            }
        } else {
            this.allinCnt = 0;
            this.dizhu = 1;
            this.danzhu = 1;
            this.roomNum = 3;
        }
    },
    /**
     * 设置桌子特殊数据
     */
    setMsgData: function (msg) {
        this.isLanGuo = msg.islanguo;
        this.deskstatus = msg.deskstatus;
        this.actUserId = msg.actuserid;
        this.betList = msg.betlistList;
        this.time = msg.time;
        this.deskState = msg.roomState;
    },

    /**
     * 玩法
     */
    getPlayTypeStr: function (type) {
        switch (type) {
            case 1: return '半坑(满5人10起)';
            case 2: return '半坑(满5人9起)';
            case 3: return '半坑(满4人J起)';
            case 4: return '全坑(2-A)';
            case 5: return '8-A，无王，共28张';
            case 6: return '全坑(2-A)，满9人'
        }
        return '';
    },

    /**
     * 设置桌子状态
     */
    setDeskState: function (type) {
        this.deskState = type;
    },

    /**
     * 当前桌子状态
     */
    getDeskState: function () {
        return this.deskState;
    },

    setMinBet(bet, force) {
        if (force) {
            this.minBet = bet;
            return;
        }
        var min = this.minBet || 0;
        var RoomMgr = require('jlmj_room_mgr').RoomMgr;
        if (bet > min && RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.busuoqiang) {
            this.minBet = bet;
        }
    },

    getMinBet() {
        var min = this.minBet || 0;
        return min;
    },

    /**
     * 当前局数
     */
    setCurrentJuShu: function (num) {
        this.CurrentJuShu = num;
    },

    /**
     * 当前局数
     */
    getCurrentJuShu: function () {
        return this.CurrentJuShu
    },
});

module.exports = {
    TdkCDeskEvent: TdkCDeskEvent,
    TdkCDeskED: TdkCDeskED,
    TdkCDeskData: TdkCDeskData,
};
