/**
 * Created by wj on 2018/1/5.
 */

var dd = cc.dd;
var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();
var gameData = require('tdk_game_data');

/**
 * 桌子事件类型
 * @type {any}
 */
var TdkDeskEvent = cc.Enum({
    INIT : 'tdk_desk_init',  //牌桌数据初始化
});
/**
 * 事件管理器
 */
var TdkDeskED = new dd.EventDispatcher();

/**
 * 桌子数据
 * @type {Function}
 */
var TdkDeskData = cc.Class({

    _instance:null,

    statics:{
        Instance:function () {
            if(!this._instance){
                this._instance = new TdkDeskData();
            }
            return this._instance;
        },

        Destroy:function () {
            if(this._instance){
                this._instance = null;
            }
        },
    },

    properties:{
        /**
         * 请求刷新视图的玩家
         */
        freshViewUserId:0,
        /**
         * 游戏总局数
         */
        gameCnt:0,
        /**
         * 人数
         */
        playerCnt:0,
        /**
         * 全押
         */
        allinCnt:0,
        /**
         * 基注
         */
        dizhu:0,
        /**
         * 单注
         */
        danzhu:0,
        /**
         * 房间号
         */
        roomNum:'',
    },

    ctor:function () {

    },

    setMsgData:function (msg) {
        this.freshViewUserId = msg.freshViewUserId;
        this.gameCnt = msg.gameCnt;
        this.playerCnt = msg.playerCnt;
        this.allinCnt = msg.allinCnt;
        this.dizhu = msg.dizhu;
        this.danzhu = msg.danzhu;
        this.roomNum = msg.roomNum;

        gameData.gameId = 40;
        gameData.roomId = msg.roomNum;
       // TdkDeskED.notifyEvent(TdkDeskEvent.INIT, this);
    },

    /**
     * 刷新ui界面，ui层主动请求
     */
    freshView:function (userid) {
        this.freshViewUserId = userid;
        TdkDeskED.notifyEvent(TdkDeskEvent.INIT, this);
    },
});

module.exports = {
    TdkDeskEvent:TdkDeskEvent,
    TdkDeskED:TdkDeskED,
    TdkDeskData:TdkDeskData,
};