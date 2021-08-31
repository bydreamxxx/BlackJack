/**
 * Created by Mac_Li on 2017/9/4.
 */
var dd = cc.dd;
/**
 * 事件类型
 */
var HallEvent = cc.Enum({
    GET_USERINFO: 'hall_CONNECT_HALL_Ok',        //获取玩家信息
    ENTER_CLUB_FAILED: 'ENTER_CLUB_FAILED',             //进入房间失败（需要群主审核等）
    LOGING_USER: 'hall_LOGIN_USER',             //玩家登录成功
    LOGING_RE_GETCODE: 'hall_login_getWXCode',        //微信授权码过期
    CREATE_ENTER_ROOM: 'hall_CREATE_ROOM',            //进入房间恢复
    GET_ROOM_RULE: 'hall_GET_ROOM_RULE',          //获取房间规则
    CREATE_ROOM_URL: 'hall_create_url',             //创建房间前获取到url
    JOIN_ROOM_URL: 'hall_join_url',               //加入房间前获取到url
    HALL_JLMJGAME_CONN_SUC: 'hall_jlmjgame_conn_suc',    //吉林麻将游戏连接成功
    HALL_JLMJGAME_RECONN_SUC: 'hall_jlmjgame_reconn_suc', //吉林麻将游戏重连成功
    HALL_JLMJGAME_RECOVER_SUC: 'hall_jlmjgame_recover',         //吉林麻将游戏恢复成功
    HALL_BSCJLMJGAME_CONN_SUC: 'hall_bscjlmjgame_conn_suc',    //吉林麻将比赛连接成功
    HALL_BSCJLMJGAME_RECONN_SUC: 'hall_bscjlmjgame_reconn_suc', //吉林麻将比赛重连成功
    RECNNECT_GAME: 'hall_reconnect_game',         //玩家在游戏中  需要断线重连

    CHANGE_ACT: 'hall_change_act',             //切换账户
    FLUSH_UI: 'hall_flush_ui',               //刷新ui

    GET_Battle_History_LIST: 'hall_Battle_History_list',             //获取战绩信息
    GET_Battle_Record: 'hall_Battle_record_list',              //获取每场中的详细信息

    Get_Notice_Config_LIST: 'hall_Notice_Config_list',              //公告数据信息
    Get_GM_Config_Info: 'hall_GM_Config_Info',                  //客服联系信息
    Get_PaoMaDeng_Marquee: 'hall_PaoMaDeng_Marquee',               //跑马灯信息
    Get_PaoMaDeng_Marquee_BET: 'hall_PaoMaDeng_Marquee_BET',               //跑马灯信息
    Get_PaoMaDeng_Default_Marquee: 'hall_PaoMaDeng_Defalut_Marquee',     //跑马灯默认信息
    Get_PaoMoDeng_DL_Marquee: 'hall_PaoMoDeng_DL_Marquee', //独立游戏跑马灯信息
    Get_ShuiHu_Marquee: 'shuihu_Marquee', //水浒传老虎机消息
    TurnOff_Marquee: 'TurnOff_Marquee',                                 //关闭跑马灯
    TurnOn_Marquee: 'TurnOn_Marquee',                                   //打开跑马灯

    Use_Item_Ret: 'hall_Use_Item_Ret',  //使用道具消息返回
    Exchange_Code_History: 'hall_Exchange_Code_History',    //历史兑换码
    Exchange_Code_List: 'hall_Exchange_Code_List', //兑换码列表
    Get_Bouns_Num: 'hall_Get_Bouns_Num',  //已领取红包的人数
    Rank_Info: 'hall_rank_info',   //排行信息
    Rank_Info_Game: 'Rank_Info_Game',   //排行信息不用公用的
    UPDATE_GAME_LIST: 'hall_game_list_update', //更新大厅游戏列表    

    UPDATE_UNREAD_MAIL_NUM: 'UPDATE_UNREAD_MAIL_NUM', //更新未读邮件数量
    MAIL_LIST_ACK: 'MAIL_LIST_ACK',                    //邮件列表
    READ_MAIL_ACK: 'READ_MAIL_ACK',                    //读取邮件
    DRAW_MAIL_ACK: 'DRAW_MAIL_ACK',                    //删除邮件
    UPDATE_UNREAD_MAIL_NUM_AND_NOTICE: 'UPDATE_UNREAD_MAIL_NUM_AND_NOTICE', //更新未读邮件和公告数量

    ACTIVE_PROPITEM_GET: 'active_propitem_get', //获取活动奖励道具
    ACTIVE_LIST_UPDATE: 'active_list_update', //活动列表更新发送
    ACTIVE_END: 'active_end', // 游戏活动结束
    ACTIVE_BEGIN: 'active_begin', //游戏活动开始
    ACTIVE_SEVEN_DAY_AWARD: 'Seven_Day_Ative_Award', //领取七天乐奖励成功

    SHOW_DAILY_SIGN: 'Show_Daily_sign', //显示签到
    DAILYSIGN_END: 'Daily_sign_end',// 每日签到完成
    CLOSE_ACTIVE_TIP: 'Close_active_tip',//关闭活动红点提示
    SPREAD_ACTIVITY_OPEN: 'Spread_Activity_open', //显示推广开启
    SHOW_ACTIVE_SPREAD: 'Show_Active_spread', //显示推广

    TASK_INFO: 'TASK_INFO',             //任务列表
    TASK_UPDATE: 'TASK_UPDATE',         //更新任务

    INVITE_INFO: 'hall_invite',         //邀请有礼
    UPDATE_INVITE_INFO: 'hall_invite_update',         //更新邀请有礼
    UPDATE_FXYL: 'hall_fxyl_update',                //分享有礼按钮
    UIDATE_FXYL_UI: 'show_fxyl_update_ui',       //分享有礼界面
    /////////////////国庆活动//////////////////////
    NATIONAL_ACTIVE_IS_OPEN: 'National_Active_Is_Open',
    NATIONAL_ACTIVE_DRAW: 'National_Active_Draw',  //翻牌消息返回
    NATIONAL_AVTIVE_OPEN_BOX: 'National_Active_Open_Box', //开宝箱消息返回
    NATION_ACTIVE_LEFTTIME: 'National_Active_LeftTime',//次数增加
    //////////////////////////////////////////////

    /////////////////冲榜活动///////////////////////
    RANK_ACTIVITY_INFO: 'rank_activity_info',
    RANK_ACTIVITY_STATE: 'rank_activity_state',
    RANK_ACTIVITY_ADDRESS: 'rank_activity_address',
    //////////////////////////////////////////////
    /////////////////财神到活动///////////////////////
    DRAWLOTTERY_ACTIVITY_INFO: 'drawlottery_activity_info',
    DRAWLOTTERY_ACTIVITY_STATE: 'drawlottery_activity_state',
    DRAWLOTTERY_ACTIVITY_RECORD: 'drawlottery_activity_record',
    DRAWLOTTERY_ACTIVITY_SUBMIT: 'drawlottery_activity_submit',
    DRAWLOTTERY_ACTIVITY_UPDATECOIN: 'drawlottery_activity_updatecoin',
    //////////////////////////////////////////////
    CHIFENG_DAIKAI_HISTORY: 'chifeng_daikai_history',//代开战绩
    CHIFENG_LUCKY: 'chifeng_lucky',//幸运转盘
    ///////////////绑定代理///////////
    BIND_AGGENT_QUERY_DATA: 'BIND_AGGENT_QUERY_DATA',

    ///////////////兑奖活动///////////
    DUIJIANG_ACTIVITY_INFO: 'duijiang_activity_info',
    DUIJIANG_REWARD_HISTORY: 'duijiang_reward_history',
    DUIJIANG_MY_HISTORY: 'duijiang_my_history',
    DUIJIANG_STATE: 'duijiang_state',
    DUIJIANG_GET_CODE: 'duijiang_get_code',
    DUIJIANG_OPEN_TIPS: 'duijiang_open_tips',
    DUIJIANG_OPEN_RESULT: 'duijiang_open_result',

    /////////////////////////////////////////////
    PLAYER_OP_RECORD: 'player_op_record', //玩家飞禽，PK，西游操作记录
    PLAYER_OP_RECORD_NULL: 'player_op_record_null', //玩家飞禽，PK，西游操作记录为空

    ///////////////////摇钱树/////////////////////
    MONEY_TREE: 'money_tree',
    GET_MONEY_TREE: 'get_money_tree',

    ///////////////////捕鱼达人优惠券/////////////////////
    FISH_GIFT: 'fish_gift',
    AUTO_GIFT: 'auto_gift',
    FISH_ACTIVITY: 'fish_activity',
    LOG_GIFT: 'log_gift',
    SHOW_GIFT_ANIM: 'show_gift_anim',
    UPDATE_GIFT: 'update_gift',
});

/**
 * 事件管理
 */
var HallED = new dd.EventDispatcher();

var HallData = cc.Class({

    s_desk: null,

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new HallData();
            }
            return this.s_desk;
        },
        properties: {
            sign_data: null,
            activeTag: 2,
            activeList: [],
            sevenDayData: null,
            nationalDayData: null,
            rankActiveInfoList: [],
            rankActiveID: -1,
            rankActiveOpen: false,
            drawlotteryActiveInfoList: [],
            drawlotteryActiveID: -1,
            drawlotteryActiveOpen: false,
            activitySpread: {
                beginTime: 0,
                count: 0,
                endTime: 0,
                id: 0,
                state: 0,
                userInfoList: []
            }

        }

    },

    ctor: function () {

    },

    /*****************************************************活动数据**********************************************/
    setActiveTag: function (tag) {
        this.activeTag = tag;
    },

    getActiveTag: function () {
        return this.activeTag;
    },

    // setActiveTag: function(data){
    //     var activity = this.getActiveById(data.activityId);
    //     activity.state = data.state;
    // },


    setActivetyList: function (list) {
        this.activeList = list;
    },

    getActiveById: function (activeId) {
        for (var i = 0; i < this.activeList.length; i++) {
            if (activeId == this.activeList[i].activityId)
                return this.activeList[i];
        }
        return null;
    },
    /*****************************************************活动数据end**********************************************/

    /*****************************************************七天乐数据**********************************************/
    /**
     * 设置七天乐数据
     */
    setSevenDayActivityData: function (data) {
        this.sevenDayData = data;
    },
    /**
     * 获取七天乐数据
     */
    getSevenDayActivityData: function () {
        return this.sevenDayData;
    },

    /**
     * 获取某天数据
     */
    getDataByDay: function (day) {
        for (var i = 0; i < this.sevenDayData.happysList.length; i++) {
            var data = this.sevenDayData.happysList[i];
            if (data.index == day)
                return data;
        }
    },

    /**
     * 更新七天乐数据
     */
    updateSevenDayDataByDay: function (day) {
        var data = this.getDataByDay(day)
        if (data)
            data.state = 2;
    },
    /*****************************************************七天乐数据end**********************************************/

    /*****************************************************国庆活动begin**********************************************/
    //检测活动是否开启
    checkActivityIsOpen: function () {
        if (this.nationalDayData != null)
            return true;
        return false;
    },

    //设置国庆活动数据
    setNationalDayActivityData: function (data) {
        this.nationalDayData = data;
        if (!this.checkActivityIsOpen())
            return;
        var list = [];
        for (var i = 1; i < 14; i++) {
            if (this.getB2bState(data.canOpenBoxPosList, i))
                list[i - 1] = i - 1;
        }
        this.nationalDayData.canOpenBoxPosListList = list;
    },

    //增加国庆活动翻盘次数
    addNationalDayActivityTimes: function (times) {
        this.nationalDayData.leftCollectTimes += times;
    },

    //更新国庆活动翻牌次数
    updateNationalDayActivityTimes: function (times) {
        this.nationalDayData.leftCollectTimes = times;
    },
    //获取国庆活动翻牌次数
    getNationalDayActivityTimes: function () {
        return this.nationalDayData.leftCollectTimes;
    },
    //更新国庆活动可开启箱子列表
    updateNationalDayActivityBoxList: function (list) {
        this.nationalDayData.canOpenBoxPosListList = list;
    },

    //获取国庆活动可打开箱子列表
    getNationalDayActivityBoxList: function () {
        return this.nationalDayData.canOpenBoxPosListList;
    },

    //删除已经开启的箱子数据
    deleteNationalDayActivityOpenedBox: function (pos) {
        for (var i = 0; i < this.nationalDayData.canOpenBoxPosListList.length; i++) {
            if (this.nationalDayData.canOpenBoxPosListList[i] == pos) {
                this.nationalDayData.canOpenBoxPosListList.splice(i, 1);
                break;
            }
        }
    },
    //更新国庆活动已开启箱子列表
    updateNationalDayActiveOpendBoxList: function (pos) {
        this.nationalDayData.collectedRewardList.push(pos);
    },

    //获取国庆活动已开箱子列表
    getNationalDayActivityOpendBoxList: function () {
        return this.nationalDayData.collectedRewardList;
    },
    //更新获得的字的数据
    updateNationalDayActivityWordData: function (data) {
        for (var i = 0; i < this.nationalDayData.activityWordsList.length; i++) {
            if (this.nationalDayData.activityWordsList[i].wordIndex == data.wordIndex) {
                this.nationalDayData.activityWordsList[i] = data;
                return;
            }
        }

        this.nationalDayData.activityWordsList.push(data);
    },

    //获取获得的字列表
    getNationalDayActivityWordList: function () {
        return this.nationalDayData.activityWordsList;
    },

    // 取出某一位的状态值
    getB2bState: function (value, idx) {
        var state = false
        var temp = (value >> idx)
        temp = (temp & 1)
        if (temp == 1) {
            state = true
        }
        return state
    },

    /*****************************************************国庆活动end**********************************************/


    /*****************************************************冲榜活动begin********************************************/
    //冲榜活动列表
    setRankActivityInfoList: function (list) {
        this.rankActiveInfoList = list;
    },

    getRankActiveById: function (activeId) {
        for (var i = 0; i < this.rankActiveInfoList.length; i++) {
            if (activeId == this.rankActiveInfoList[i].id) {
                return this.rankActiveInfoList[i];
            }
        }
        return null;
    },

    getRankActive() {
        return this.getRankActiveById(this.rankActiveID);
    },

    //冲榜活动状态列表
    setRankActivityState: function (id, state) {
        // if (!this.rankActiveList){
        //     this.rankActiveList = {};
        // }

        // this.rankActiveList[id] = state;
        this.rankActiveID = id;
        var AppConfig = require('AppConfig');
        this.rankActiveOpen = state == 1 && AppConfig.GAME_PID < 10000;
    },

    setRankAddress(msg) {
        this.address = msg;
    },

    getRankAddress() {
        return this.address
    },
    /*****************************************************冲榜活动end**********************************************/
    /*****************************************************财神到活动begin********************************************/
    setDrawLotterykActivityInfoList: function (list) {
        this.drawlotteryActiveInfoList = list;
    },

    getDrawLotterykActiveById: function (activeId) {
        for (var i = 0; i < this.drawlotteryActiveInfoList.length; i++) {
            if (activeId == this.drawlotteryActiveInfoList[i].id) {
                return this.drawlotteryActiveInfoList[i];
            }
        }
        return null;
    },

    getDrawLotterykActive() {
        return this.getDrawLotterykActiveById(this.drawlotteryActiveID);
    },

    setDrawLotterykActivityState: function (id, state) {
        this.drawlotteryActiveID = id;
        var AppConfig = require('AppConfig');
        this.drawlotteryActiveOpen = state == 1 && AppConfig.GAME_PID < 10000;
    },
    /*****************************************************财神到活动end**********************************************/
});

module.exports = {
    HallED: HallED,
    HallEvent: HallEvent,
    HallData: HallData,

}
