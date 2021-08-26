/**
 * Created by wang on 2017/6/27.
 */

var dd = cc.dd;
var tdk = dd.tdk;
var TdkCPlayerMgrData = require('tdk_coin_player_data').TdkCPlayerMgrData;
var CDeskData = require('tdk_coin_desk_data').TdkCDeskData;

var TdkOperationEvent = cc.Enum({
    START_BET: 'tdk_operation_start_bet',  //开始下注
    BET: 'tdk_operation_bet', //下注
    GEN: 'tdk_operation_gen', //跟注
    QI_JIAO: 'tdk_operation_qi_jiao', //起脚
    FAN_TI: 'tdk_operation_fan_ti', //反踢
    FOLD: 'tdk_operation_fold', //弃牌
    PASS: 'tdk_operation_pass', //不踢
    KAI_PAI: 'tdk_operation_kai_pai', //开牌
    ZHAN_JI: 'tdk_operation_zhan_ji', //战绩统计
    ROUND_END: 'tdk_operation_round_end', //本局结束
    JIE_SAN: 'tdk_operation_jie_san', //游戏解散
    READY: 'tdk_operation_ready', //游戏准备
    HUAN_ZHUO: 'tdk_operation_huan_zhuo', //换桌
    ON_RECONNECT: 'tdk_operation_on_reconnect', //
    ALL_IN: 'tdk_operation_all_in',
    SHOW_CUTDOWN: 'tdk_operation_show_cutdow', //显示倒计时
    HIDE_CUTDOWN: 'tdk_operation_hide_cutdow', //隐藏倒计时
    REFRSHOPERATION: 'tdk_operation_refresh', //刷新操作
});

var TdkOperationED = new dd.EventDispatcher();

/********************************************RoundEndData********************************************/

var RoundEndData = cc.Class({

    properties: {
        userid: 0,
        numlistList: [],
        endtype: 0,
        deskend: false,
        languo: false,
        xifen: 0,
        lanNum: 0,
    },

    ctor: function () {

    },

    setMsgData: function (msg) {
        this.userid = msg.userid;
        this.numlistList = msg.numlistList;
        this.endtype = msg.endtype;
        this.deskend = msg.deskend;
        this.languo = msg.deskstatus;
        this.xifen = msg.xifen;
        this.lanNum = msg.lanNum;
        this.roundEnd();
    },

    /**
     * 烂锅次数
     */
    getLanNum: function () {
        var num = this.lanNum > 2 ? 2 : this.lanNum;
        return Math.pow(2, num);
    },

    /**
     * 喜分
     */
    getXifen: function () {
        return this.xifen;
    },

    /**
     * 本局结束
     */
    roundEnd: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.ROUND_END, this);
    },
});

/***************************************TdkOperationData*************************************************/

var TdkOperationData = cc.Class({
    _instance: null,
    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new TdkOperationData();
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
         * 请求刷新视图的玩家
         */
        freshViewUserId: 0,
        /**
         * 玩家id
         */
        userid: 0,
        /**
         * 错误码
         */
        resultcode: 0,
        /**
         * 牌桌状态
         */
        deskstatus: 0,
        /**
         * 筹码数量
         */
        betnum: 0,
        /**
         * 下一个操作玩家
         */
        nextuserid: 0,
        /**
         * 是否跟注allin
         */
        genallin: false,
        /**
         * 下注是否可以allin
         */
        canallin: false,
        /**
         * 上一个玩家状态
         */
        predeskstatus: 0,
        /**
         * 下注等级
         */
        betlevelList: [],

        /**
         * 本局结束数据对象
         */
        roundEndData: null,
        /**
         * 当前操作玩家
         */
        actuserid: 0,

        isReady: false,
        /**
         * 操作时间
         */
        time: 0,
        upstate: false,
    },

    onLoad: function () {

    },

    ctor: function () {
        this.roundEndData = new RoundEndData();
        this.eventType = [
            'tdk_operation_start_bet',
            'tdk_operation_bet',
            'tdk_operation_qi_jiao',
            'tdk_operation_fan_ti',
            'tdk_operation_kai_pai',
            'tdk_operation_all_in',
            'tdk_operation_pass',
            'tdk_operation_fold',
            'tdk_operation_gen',
        ];
    },

    setMsgData: function (msg, event) {
        this.userid = msg.userid;
        this.resultcode = msg.resultcode;
        this.deskstatus = msg.deskstatus;
        this.betnum = msg.betnum;
        this.nextuserid = msg.nextuserid;
        this.genallin = msg.genallin;
        this.canallin = msg.canallin;
        this.predeskstatus = msg.predeskstatus;
        this.betlevelList = msg.betlevelList;

        if (typeof msg.maxbet != 'undefined') {
            tdk.GameData.maxBet = msg.maxbet;
        }

        if (typeof this.betnum == 'undefined') {
            this.betnum = 0;
        }
        TdkOperationED.notifyEvent(event, this);

        cc.log('[data] tdk_operation_data::setMsgData:', this);
    },

    /**
     * 开始下注
     */
    startBet: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.START_BET, this);
    },

    /**
     * 主动下注
     */
    bet: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.BET, this);
    },

    /**
     * 起脚
     */
    qijiao: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.QI_JIAO, this);
    },

    /**
     * 反踢
     */
    fanti: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.FAN_TI, this);
    },

    /**
     * 不踢
     */
    pass: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.PASS, this);
    },

    /**
     * 弃牌
     */
    fold: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.FOLD, this);
    },

    /**
     * 开牌
     */
    kaipai: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.KAI_PAI, this);
    },

    /**
     * 跟注
     */
    genzhu: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.GEN, this);
    },

    /**
     * 战绩
     */
    zhanji: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.ZHAN_JI, this);
    },

    /**
     * 显示倒计时
     */
    showCutDown: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.SHOW_CUTDOWN, this);
    },

    /**
     * 取消倒计时
     */
    StopCutDown: function () {
        TdkOperationED.notifyEvent(TdkOperationEvent.HIDE_CUTDOWN, this);
    },

    /**
     * 单局结束
     * @param msg
     */
    setRoundEndMsgData: function (msg) {
        this.roundEndData.setMsgData(msg);
    },

    /**
     * 刷新视图
     * @param userid
     */
    freshView: function (userid) {
        cc.log('[data] tdk_operation_data::freshView:', this);
        if (typeof this.deskstatus != 'undefined') {
            TdkOperationED.notifyEvent(TdkOperationEvent.ON_RECONNECT, this);
        }
    },

    debugInfo: function () {
        var data = {
            userid: this.userid,
            resultcode: this.resultcode,
            deskstatus: this.deskstatus,
            betnum: this.betnum,
            nextuserid: this.nextuserid,
            canallin: this.canallin,
            genallin: this.genallin,
            predeskstatus: this.predeskstatus,
            betlevelList: this.betlevelList,
            isReady: this.isReady,
        };
        cc.log('[data]tdk_operation_data::debugInfo:', JSON.stringify(data));
    },

    /**
     * 重置数据
     */
    resetData: function () {
        cc.log('[data]tdk_operation_data::resetData!');
        this.userid = 0;
        this.actuserid = 0,
            this.resultcode = 0;
        this.deskstatus = 0;
        this.betnum = 0;
        this.nextuserid = 0;
        this.genallin = false;
        this.canallin = false;
        this.predeskstatus = 0;
        this.betlevelList = [];
        this.isReady = false;
    },
    /***********************************金币场数据设置****************************************/
    setCoinMsgData: function (msg) {
        this.userid = msg.userid;
        this.deskstatus = msg.deskstatus;
        if (msg.num != 0 && !cc.dd._.isUndefined(msg.num)) {
            this.betnum = msg.num;
        } else {
            this.betnum = 0;
        }

        //设置不缩枪 最低下注
        if (this.betnum > 0)
            CDeskData.Instance().setMinBet(this.betnum);

        this.nextuserid = msg.nextuserid;
        this.predeskstatus = msg.type;
        this.time = msg.time;
        TdkCPlayerMgrData.Instance().setCostChip({
            userid: msg.userid,
            betnum: this.betnum,
        });

        TdkCPlayerMgrData.Instance().setFanTiNum({
            userid: msg.userid,
            num: msg.fantiTimes,
        });

        if (msg.type == 0) {
            //TdkOperationED.notifyEvent(TdkOperationEvent.REFRSHOPERATION, this);
            return;
        }
        TdkOperationED.notifyEvent(this.eventType[msg.type], this);
    },

    /**
     * 单局结束
     * @param msg
     */
    setCRoundEndMsgData: function (msg) {
        var data = {
            userid: msg.userid,
            endtype: msg.languo,
            deskend: true,
            deskstatus: this.upstate,
            xifen: msg.xifen,
            lanNum: msg.lanNum,
        }
        this.upstate = msg.languo;

        this.roundEndData.setMsgData(data);
    },

    /**
     * 是否烂锅
     */
    getEndtype: function () {
        return this.roundEndData.endtype;
    },

    setEndType: function (languo, lannum, xifen) {
        this.roundEndData.endtype = languo;
        this.roundEndData.lanNum = lannum;
        this.roundEndData.xifen = xifen;
    },
    /***********************************金币场数据设置****************************************/
});

module.exports = {
    TdkOperationEvent: TdkOperationEvent,
    TdkOperationED: TdkOperationED,
    TdkOperationData: TdkOperationData,
};