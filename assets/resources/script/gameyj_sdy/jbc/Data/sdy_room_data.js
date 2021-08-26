var SdyColorSortValue = require('sdy_card_cfg').SdyColorSortValue;
var data_game_room = require('game_room');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

/**
 * 事件类型
 */
var RoomEvent = cc.Enum({
    SDY_ROOM_EVENT_GAMESTART:               'sdy_room_event_gamestart',              //游戏开始
    SDY_ROOM_EVENT_CALLSCOREEND:            'sdy_room_event_callscoreend',           //叫分
    SDY_ROOM_EVENT_DEALDIPAI:               'sdy_room_event_dealdipai',              //发底牌
    SDY_ROOM_EVENT_SELECTCOLOR:             'sdy_room_event_selectcolor',            //选主牌
    SDY_ROOM_EVENT_KOUDIPAI:                'sdy_room_event_koudipai',               //扣底牌
    SDY_ROOM_EVENT_WAVEEND:                 'sdy_room_event_waveend',                //一轮结束
    SDY_ROOM_EVENT_GETSCORE:                'sdy_room_event_getscore',               //闲家得分
    SDY_ROOM_EVENT_RECONNECT:               'sdy_room_event_reconnect',              //断线重连
    SDY_ROOM_EVENT_LEAVEGAME:               'sdy_room_event_leavegame',              //离开游戏
    SDY_ROOM_EVENT_CHONGXINFAPAI:           'sdy_room_event_chongxinfapai',                //重新开始
});

/**
 * 事件管理
 */
var RoomED = new cc.dd.EventDispatcher;

var RoomData = cc.Class({

    s_roomData: null,

    statics: {

        Instance: function () {
            if (this.s_roomData == null) {
                this.s_roomData = new RoomData();
            }
            return this.s_roomData;
        },

        Destroy: function () {
            if (this.s_roomData) {
                this.s_roomData = null;
            }
        },
    },

    ctor: function () {

        this.enter_type = null; //进入类型 1:正常, 2:重连
        this.game_type = null;  //50 三打一金币场
        this.owner_id = null;
        this.room_id = null;
        this.room_cfg_id = null;
        this.room_lv = null;
        this.room_config_id = null;
        this.max_num = null;
        this.cur_circle = null;
        this.max_circle = null;
        this.state = null;  //1叫分 2 选择主牌 3 扣底牌 4 出牌 5 朋友场继续 6 朋友场解散
        this.call_score_timeout = null; //叫分倒计时
        this.color_timeout = null;  //花色倒计时
        this.base_timeout = null;   //扣底牌倒计时
        this.timeout = null;    //出牌倒计时
        this.circle_color = null;   //每轮第一张牌的花色
        this.circle_user_id = null; //每轮第一个出牌玩家

        this.call_score = null;
        this.key_poker = null;
        this.bottom_pokers = null;
        this.score_pokers = null;
        this.score_type = null;
        this.matching = false;
        this.game_started = false;
        this.jiesan_left_time = 0;
        this.jiesan_start_time = 0;
    },

    clear: function () {
        this.enter_type = null; //进入类型 1:正常, 2:重连
        this.game_type = null;  //50 三打一金币场
        this.owner_id = null;
        this.room_id = null;
        // this.room_config_id = null;
        this.max_num = null;
        this.cur_circle = null;
        this.max_circle = null;
        this.state = null;  //1叫分 2 选择主牌 3 扣底牌 4 出牌
        this.call_score_timeout = null; //叫分倒计时
        this.color_timeout = null;  //花色倒计时
        this.base_timeout = null;   //扣底牌倒计时
        this.timeout = null;    //出牌倒计时
        this.circle_color = null;   //每轮第一张牌的花色
        this.circle_user_id = null; //每轮第一个出牌玩家

        this.call_score = null;
        this.key_poker = null;
        this.bottom_pokers = null;
        this.score_pokers = null;
        this.score_type = null;
        this.matching = false;
        this.game_started = false;
        this.jiesan_left_time = 0;
        this.jiesan_start_time = 0;
    },

    setData: function (msg) {
        this.game_started = true;
        this.enter_type = msg.type;
        this.game_type = msg.roomInfo.gameType;
        this.owner_id = msg.roomInfo.ownerId;
        this.room_id = msg.roomInfo.roomId;
        this.room_config_id = msg.roomInfo.roomConfigId;
        this.max_num = msg.roomInfo.maxNum;
        this.cur_circle = msg.roomInfo.curCircle;
        this.max_circle = msg.roomInfo.maxCircle;
        this.state = msg.roomInfo.state;
        this.call_score_timeout = msg.roomInfo.callScoreTimeout;    //叫分cd
        this.color_timeout = msg.roomInfo.colorTimeout; //花色cd
        this.base_timeout = msg.roomInfo.baseTimeout;   //扣底cd
        this.timeout = msg.roomInfo.timeout;    //出牌cd
        this.circle_color = msg.roomInfo.circleColor;   //第一张牌的花色
        this.circle_user_id = msg.roomInfo.circleUserId; //第一张出牌的玩家id

        if( !cc.dd._.isUndefined(msg.basePokersInfo)&&!cc.dd._.isNull(msg.basePokersInfo) ){
            this.call_score = msg.basePokersInfo.callScore;
            this.key_poker = msg.basePokersInfo.keyPoker;
            this.bottom_pokers = msg.basePokersInfo.pokersList;
            this.score_pokers = msg.basePokersInfo.scorePokersList;
            this.score_type = msg.basePokersInfo.type;
        }

        if(this.isCoinRoom()){
            var room_item = data_game_room.getItem(function (item) {
                return item.key == this.room_config_id;
            }.bind(this));
            if(room_item){
                this.room_lv = room_item.roomid;
            }else{
                cc.error('房间配置id错误 id=',this.room_config_id);
            }
        }else{
            this.jiesan_left_time = msg.voteTimeout;
            this.jiesan_start_time = new Date().getTime();
        }

        RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_GAMESTART, [this]);
    },

    setJieSanTime: function (left_time) {
        this.jiesan_left_time = left_time;
        this.jiesan_start_time = new Date().getTime();
    },

    isCoinRoom: function () {
        return RoomMgr.Instance().game_info.gameType == 25;
    },

    isFriendRoom: function () {
        return RoomMgr.Instance().game_info.gameType == 26;
    },

    /**
     * 叫分
     * @param score
     */
    callScoreEnd: function (score) {
        this.call_score = score;

        RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_CALLSCOREEND, [this]);
    },

    /**
     * 发底牌
     * @param bottom_pokers
     */
    dealBottomPokers: function (bottom_pokers) {
        this.bottom_pokers = bottom_pokers;

        RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_DEALDIPAI, [this]);
    },

    /**
     * 主牌花色选定
     * @param color
     */
    keyColorSelected: function (key_poker) {
        this.key_poker = key_poker;

        RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_SELECTCOLOR, [this]);
    },

    /**
     * 扣底牌
     * @param bottom_pokers
     */
    kouBottomPokers: function (bottom_pokers) {
        // this.bottom_pokers = bottom_pokers;
        //
        // RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_KOUDIPAI, [this]);
    },

    checkWaveEnd: function () {
        var waveEnd = true;
        var PlayerMgr = require('sdy_player_mgr').PlayerMgr;
        PlayerMgr.Instance().playerList.forEach(function (player) {
            if( player!= null ){
                if( cc.dd._.isUndefined(player.cur_send_poker) || cc.dd._.isNull(player.cur_send_poker) || player.cur_send_poker==0 ){
                    waveEnd = false;
                }
            }
        });

        if(waveEnd){
            PlayerMgr.Instance().playerList.forEach(function (player) {
                if( player!= null ){
                    player.cur_send_poker = 0;
                }
            });
            this.circle_color = null;
            RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_WAVEEND, [this]);
        }
    },

    /**
     * 闲家得分
     * @param msg
     */
    getScore: function (msg) {
        this.score_type = msg.type;
        if(this.score_pokers == null){
            this.score_pokers = [];
        }
        msg.pokersList.forEach(function (poker) {
            this.score_pokers.push(poker);
        }.bind(this));

        RoomED.notifyEvent(RoomEvent.SDY_ROOM_EVENT_GETSCORE, [this]);
    },
    
    isKeyPoker: function (poker) {
        var color = parseInt(poker/100);
        var value = parseInt(poker%100);

        //大小王
        if(color == 6){
            return true;
        }
        //2
        if(value == 15){
            return true;
        }
        return color == this.key_poker;
    },

    /**
     * 排序比较
     * @param a
     * @param b
     * @returns {number}
     */
    sortPokerCompare: function (a,b) {
        var is_key_a = this.isKeyPoker(a);
        var is_key_b = this.isKeyPoker(b);
        var color_a = parseInt(a/100);
        var color_b = parseInt(b/100);
        var value_a = parseInt(a%100);
        var value_b = parseInt(b%100);

        if( is_key_a && is_key_b ){
            if(color_a!=color_b){
                if(color_a==6){
                    return -1;
                }
                if(color_b==6){
                    return 1;
                }
                if(value_a==15 && value_b==15){
                    var color_sort_value_a = SdyColorSortValue[color_a];
                    var color_sort_value_b = SdyColorSortValue[color_b];
                    if(color_a == this.key_poker){
                        color_sort_value_a += 50;
                    }else if(color_b == this.key_poker){
                        color_sort_value_b += 50;
                    }
                    return color_sort_value_b - color_sort_value_a;
                }
                return value_b - value_a;
            }else{
                return value_b - value_a;
            }
        }else if( !is_key_a && !is_key_b ){
            if(color_a == color_b){
                return value_b - value_a;
            }else{
                var color_sort_value_a = SdyColorSortValue[color_a];
                var color_sort_value_b = SdyColorSortValue[color_b];
                return color_sort_value_b - color_sort_value_a;
            }
        }else{
            if( is_key_a ){
                return -1;
            }else{
                return 1;
            }
        }
    },

    /**
     * 出牌比较
     * @param a
     * @param b
     * @returns {number}
     */
    sendPokerCompare: function (a,b) {
        var is_key_a = this.isKeyPoker(a);
        var is_key_b = this.isKeyPoker(b);
        var color_a = parseInt(a/100);
        var color_b = parseInt(b/100);
        var value_a = parseInt(a%100);
        var value_b = parseInt(b%100);

        if( is_key_a && is_key_b ){
            if(color_a!=color_b){
                if(color_a==6){
                    return -1;
                }
                if(color_b==6){
                    return 1;
                }
                if(value_a==15 && value_b==15){
                    if(color_a == this.key_poker){
                        return -1;
                    }
                    if(color_b == this.key_poker){
                        return 1;
                    }
                    return 1;
                }
                return value_b - value_a;
            }else{
                return value_b - value_a;
            }
        }else if( !is_key_a && !is_key_b ){
            if(color_a == color_b){
                return value_b - value_a;
            }else{
                if(color_a == this.circle_color){
                    return -1;
                }
                if(color_b == this.circle_color){
                    return 1;
                }
                return 1;
            }
        }else{
            if( is_key_a ){
                return -1;
            }else{
                return 1;
            }
        }
    },

});

module.exports = {
    RoomEvent:RoomEvent,
    RoomED:RoomED,
    RoomData:RoomData,
};
