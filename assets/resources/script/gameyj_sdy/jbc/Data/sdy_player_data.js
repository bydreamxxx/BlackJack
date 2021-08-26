var RoomData = require('sdy_room_data').RoomData;

var PlayerState = cc.Enum({
   SDY_PLAYER_STATE_INIT:                   'sdy_player_state_init',                //初始化
   SDY_PLAYER_STATE_CALLING:                'sdy_player_state_calling',             //正在叫分
   SDY_PLAYER_STATE_CALLED:                 'sdy_player_state_called',              //已叫分
   SDY_PLAYER_STATE_SELECTING:              'sdy_player_state_selecting',           //正在选花色
   SDY_PLAYER_STATE_SELECTED:               'sdy_player_state_selected',            //已选花色
   SDY_PLAYER_STATE_KOUING:                 'sdy_player_state_kouing',              //正在扣底牌
   SDY_PLAYER_STATE_KOUED:                  'sdy_player_state_koued',               //已扣底牌
   SDY_PLAYER_STATE_SENDING:                'sdy_player_state_sending',             //正在出牌
   SDY_PLAYER_STATE_SENDED:                 'sdy_player_state_sended',              //已出牌
});

/**
 * 事件类型
 */
var PlayerEvent = cc.Enum({
    SDY_PLAYER_EVENT_INIT:                  'sdy_player_event_init',                //初始化
    SDY_PLAYER_EVENT_CALLING:               'sdy_player_event_calling',             //正在叫分
    SDY_PLAYER_EVENT_CALLED:                'sdy_player_event_called',              //已叫分
    SDY_PLAYER_EVENT_SELECTING:             'sdy_player_event_selecting',           //正在选花色
    SDY_PLAYER_EVENT_SELECTED:              'sdy_player_event_selected',            //已选花色
    SDY_PLAYER_EVENT_KOUING:                'sdy_player_event_kouing',              //正在扣底牌
    SDY_PLAYER_EVENT_KOUED:                 'sdy_player_event_koued',               //已扣底牌
    SDY_PLAYER_EVENT_SENDING:               'sdy_player_event_sending',             //正在出牌
    SDY_PLAYER_EVENT_SENDED:                'sdy_player_event_sended',              //已出牌
    SDY_PLAYER_EVENT_BANKER:                'sdy_player_event_banker',              //做庄
    SDY_PLAYER_EVENT_SHOUDIPAI:             'sdy_player_event_shoudipai',           //收底牌
    SDY_PLAYER_EVENT_CHONGXINFAPAI:         'sdy_player_event_chongxinfapai',       //重新发牌
    SDY_PLAYER_EVENT_TUOGUAN:               'sdy_player_event_tuoguan',             //托管
    SDY_PLAYER_EVENT_JIESAN:                'sdy_player_event_jiesan',              //解散
});

/**
 * 事件管理
 */
var PlayerED = new cc.dd.EventDispatcher;

var PlayerData = cc.Class({

    ctor: function () {
        this.user_id = null;
        this.name = null;
        this.head_url = null;
        this.open_id = null;
        this.sex = null;
        this.coin = null;
        this.seat = null;
        this.view_idx = null;
        this.call_score = null;
        this.banker = false;
        this.pokers_num = null;
        this.pokers = null;
        this.cur_send_poker = null;
        this.is_auto = false;
        this.score_list = null; //可叫分列表
        this.timeout = null; //倒计时
        this.timeout_start = null;
        this.player_state = PlayerState.SDY_PLAYER_STATE_INIT;
        this.is_robot = false;
        this.ready = false;
        this.is_continue = true;
        this.is_agree = 0;  //0 没选择 1 同意 2 不同意 3 申请者
        this.state = 0; //0 游戏中 1 离开 2 离线
    },

    /**
     * 清空数据
     */
    clear: function () {
        // this.user_id = null;
        // this.name = null;
        // this.head_url = null;
        // this.open_id = null;
        // this.sex = null;
        // this.coin = null;
        // this.seat = null;
        this.call_score = null;
        this.banker = false;
        this.pokers_num = null;
        this.pokers = null;
        this.cur_send_poker = null;
        this.is_auto = false;
        // this.view_idx = null;
        this.score_list = null; //可叫分列表
        this.timeout = null; //倒计时
        this.timeout_start = null;
        this.player_state = PlayerState.SDY_PLAYER_STATE_INIT;
        this.is_robot = false;
        this.ready = false;
        this.is_continue = true;
        this.is_agree = 0;  //0 没选择 1 同意 2 不同意 3 申请者
        this.state = 0; //0 游戏中 1 离开 2 离线
    },

    setAgree: function (agree) {
        this.is_agree = agree;
        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_JIESAN, [this]);
    },

    /**
     * 设置房间管理器玩家数据
     * @param role
     */
    setRoomMgrData: function (role) {
        this.user_id = role.userId;
        this.name = role.name;
        this.sex = role.sex;
        this.head_url = cc.dd.Utils.getWX64Url(role.headUrl);
        this.open_id = role.openId;
        this.ready = role.isReady ? 1 : 0;
        this.seat = role.seat;
        this.isOnLine = role.state == 1;
        this.coin = role.coin;
    },

    /**
     * 设置玩家所有数据
     * @param msg
     */
    setGameData: function (msg) {
        this.user_id = msg.userId;
        this.name = msg.name;
        this.open_id = msg.openId;
        this.sex = msg.sex;
        this.coin = msg.coin;
        this.seat = msg.seat;
        this.call_score = msg.called;
        this.banker = msg.banker;
        this.pokers_num = msg.pokersNum;
        this.pokers = msg.pokersList;
        this.cur_send_poker = msg.curSendPoker;
        this.is_auto = msg.isAuto;
        this.is_robot = msg.isRobot;
        if(this.is_robot){
            this.head_url = 'http://47.92.48.105:8888/robot_icon/'+msg.headUrl;
        }else{
            this.head_url = msg.headUrl;
        }

        switch (RoomData.Instance().state){
            case 1:
                if( !cc.dd._.isUndefined(this.call_score) && !cc.dd._.isNull(this.call_score) && this.call_score!=-1 ){
                    this.player_state = PlayerState.SDY_PLAYER_STATE_CALLED;
                }
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                if( !cc.dd._.isUndefined(this.cur_send_poker) && !cc.dd._.isNull(this.cur_send_poker) && this.cur_send_poker!=0 ){
                    this.player_state = PlayerState.SDY_PLAYER_STATE_SENDED;
                }
                break;
            default:
                break;
        }
        this.sortShouPai();

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_INIT, [this]);
    },

    setReady: function (ready) {
        this.ready = ready;
    },

    sortShouPai: function () {

    },

    startCD: function () {
        cc.log('开始CD ', this.timeout);
        // clearInterval(this.timeout_id);
        // this.timeout_id = setInterval(this.CDing.bind(this), 1000);
        this.timeout_start = new Date().getTime();
    },

    CDing: function () {
        this.timeout = this.timeout - 1;
        if(this.timeout < 0){
            this.endCD();
        }
    },

    endCD: function () {
        // clearInterval(this.timeout_id);
        cc.log('结束CD ');
    },

    /**
     * 叫分中
     * @param score_list
     * @param call_score_timeout
     */
    calling: function (score_list, timeout) {
        this.score_list = score_list;
        this.timeout = timeout<0?0:timeout;
        this.startCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_CALLING;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_CALLING, [this]);
    },

    /**
     * 已叫分
     * @param score
     */
    called: function (score) {
        this.call_score = score;
        this.endCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_CALLED;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_CALLED, [this]);
    },

    /**
     * 做庄
     */
    becomeBanker: function () {
        this.banker = true;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_BANKER, [this]);
    },

    /**
     * 收底牌
     * @param bottom_pokers
     */
    dealBottomPokers: function (bottom_pokers) {
        this.pokers_num = 18;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SHOUDIPAI, [this, bottom_pokers]);
    },

    /**
     * 正在扣底牌
     * @param timeout
     */
    kouing: function (timeout) {
        this.timeout = timeout<0?0:timeout;
        this.startCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_KOUING;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_KOUING, [this]);
    },

    /**
     * 已扣底牌
     * @param bottom_pokers
     */
    kouedBottomPokers: function (bottom_pokers) {
        this.pokers_num = 12;
        this.endCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_KOUED;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_KOUED, [this]);
    },

    /**
     * 正在选花色
     */
    colorSelecting: function (timeout) {
        this.timeout = timeout<0?0:timeout;
        this.startCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_SELECTING;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SELECTING, [this]);
    },

    /**
     * 花色已选
     */
    colorSelected: function (color) {
        this.endCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_SELECTED;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SELECTED, [this]);
    },

    /**
     * 正在出牌
     */
    pokerSending: function (timeout) {
        this.timeout = timeout<0?0:timeout;
        this.startCD();
        this.player_state = PlayerState.SDY_PLAYER_STATE_SENDING;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SENDING, [this]);
    },

    /**
     * 已出牌
     * @param poker
     */
    pokerSended: function (poker) {
        this.pokers_num -= 1;
        this.endCD();
        this.cur_send_poker = poker;
        this.player_state = PlayerState.SDY_PLAYER_STATE_SENDED;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_SENDED, [this]);
    },

    /**
     * 托管状态
     * @param is_auto
     */
    setAuto: function (is_auto) {
        this.is_auto = is_auto;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_TUOGUAN, [this]);
    },

    /**
     * 重新发手牌
     */
    dealHandPokers: function (pokers) {
        this.pokers_num = 12;
        this.player_state = PlayerState.SDY_PLAYER_STATE_INIT;

        PlayerED.notifyEvent(PlayerEvent.SDY_PLAYER_EVENT_CHONGXINFAPAI, [this]);
    },

    /**
     * 获取总倒计时
     * @returns {*}
     */
    getAllTimeout: function () {
        switch (this.player_state){
            case PlayerState.SDY_PLAYER_STATE_CALLING:
                return RoomData.Instance().call_score_timeout;
            case PlayerState.SDY_PLAYER_STATE_SELECTING:
                return RoomData.Instance().color_timeout;
            case PlayerState.SDY_PLAYER_STATE_KOUING:
                return RoomData.Instance().base_timeout;
            case PlayerState.SDY_PLAYER_STATE_SENDING:
                return RoomData.Instance().timeout;
            default:
                return RoomData.Instance().timeout;
        }
    },

    getLeftTimeout: function () {
        var cur_time = new Date().getTime();
        var offset_time = (cur_time - this.timeout_start)/1000.0;
        var left_time = this.timeout - offset_time;
        return left_time;
    },

    /**
     * 获取倒计时进度 [0-1]
     * @returns {number}
     */
    getTimeoutProgress: function () {
        return this.getLeftTimeout() / this.getAllTimeout();
    },

});

module.exports = {
    PlayerEvent:PlayerEvent,
    PlayerED:PlayerED,
    PlayerData:PlayerData,
    PlayerState:PlayerState,
};
