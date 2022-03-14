/**
 * Created by shen on 2017/8/19.
 */

const dd = cc.dd;
// const TaskCfg = require('HallLuckBagCfg').HallLuckBagItemCfg;
if (!dd.EventDispatcher)
    dd.EventDispatcher = require("EventDispatcher");

const HallCommonEd = new dd.EventDispatcher();
const AudioChat = require('AudioChat').AudioChat;
const AppCfg = require('AppConfig');
const jlmj_room_mgr = require("jlmj_room_mgr");
const Define = require("Define");
const GateNet = require("GateNet");


const HallCommonEvent = cc.Enum({
    INIT: 'hall_common_init', //初始化玩家数据
    ACCOUNT_UPDATE: 'hall_common_account_update', //账号设置修改成功
    REAL_NAME_AUTHEN: 'hall_common_real_name_authen', //实名认证通过
    TEL_BIND: 'hall_common_tel_bind', //手机绑定成功
    TEL_UNBIND: 'hall_common_tel_unbind', //手机解绑成功
    GET_CODE_SUCCESS: 'hall_common_get_code',//获取验证码成功
    GET_CODE_Failed: 'hall_common_get_code_failed', //获取验证码失败
    TASK_INFO: 'hall_common_task_info', //获取任务列表
    GET_LUCK_ID: 'hall_common_get_luck_id', //获取抽奖结果
    ON_SHOP_SUCCESS: 'hall_common_on_shop_success', //商品购买成功
    TASK_UPDATE: 'hall_common_task_update', //任务更新
    RECEIVE_REWARD: 'hall_common_receive_reward', //已领取奖励
    SET_WINNERS: 'hall_common_set_winner', //返回获奖名单
    CHANGE_RED_BAG: 'hall_common_change_red_bag', //红包兑换结果
    UPDATE_NICK: 'hall_common_update_nick', //更新昵称
    UPDATE_SEX: 'hall_common_update_sex', //更新性别
    UPDATA_PropData: 'hall_prop_data',  //更新道具显示
    GET_BROADCAST_CONFIG: 'hall_ack_config_broadcast',            //跑马灯默认信息

    KLB_CREATE_ROOM_COMMON: 'klb_create_room_common', //创建房间的统一消息返回
    KLB_ENTER_GAME_ROOM_COMMON: 'klb_enter_game_room_common',//进入房间的统一消息返回
    KLB_ENTER_GAME_ROOM_OTHER_PLAYER_COMMON: 'klb_enter_game_room_other_players_common',//进入房间其他玩家信息统一返回
    KLB_LEAVE_GAME_ROOM_COMMON: 'klb_leave_game_room_common',//离开房间的统一消息返回
    KLB_PREPARE_GAME_COMMON: 'klb_prepare_game_common',//准备游戏的统一消息返回

    HALL_UPDATE_VIP: 'hall_update_vip',             //vip升级
    HALL_UPDATE_PLAYER: 'hall_update_player',       //玩家升级
    HALL_UPDATE_JIUJI_CNT: 'hall_update_jiuji_cnt',       //救济次数
    HALL_UPDATE_ASSETS: 'hall_update_assets',       //更新玩家资产   
    HALL_UPDATE_FLAG: 'hall_update_flag', //更新小红点 

    HALL_NO_RECONNECT_GAME: 'hall_no_reconnect_game',       //无重连游戏

    BANK_MAIN_UPDATE_COIN: 'bank_main_update_coin', //保险箱数据变化

    LUCKY_STOP_TIMER: 'LUCKY_STOP_TIMER',            //红包暂停时间
    LUCKY_RESUME_TIMER: 'LUCKY_RESUME_TIMER',        //红包恢复时间
    HALL_UPDATE_USERDATA: 'hall_update_userData',      // 更新用户信息
});
//玩家变量
const PlayerVariantIndex = cc.Enum({
    Gold_Score: 1, // 玩家充值积分
    VipLevelAward: 2,//使用位，Vip等级礼包 0标识位暂时不用  第1位表示 vip1的奖励领取了没
    FirstPay: 3, //是否首冲0没有，1有
    VipDayGiftGetTime: 4, //Vip每日礼包 领取时间
    BankTransGold: 5, //保险箱每日转账金额
    LevelGift_Get_Level: 6, //已领取奖励的等级
    RegistGift_State: 7, //正式账号奖励状态，0游客账号，1可领取，2已领取
    BindPhoneGift_State: 8, // 绑定手机奖励状态，0未绑定，1可领取，2已领取
    RenameGift_State: 9,// 改名奖励状态，0未改，1可领取，2已领取
    SetBankPasswordState: 10, //保险箱密码设置状态，0未设置，1已设置
});
const KLBHallCreateRoomCommonEvent = cc.Enum({
    GID_CR_MJCHANGCHUN: 'klb_mj_changchun',
    GID_CR_TIANDAKENG: 'klb_tiandakeng',
    GID_CR_MJJILIN: 'klb_mj_jilin',
    GID_CR_YYL: 'klb_yyl',
    GID_CR_LHD: 'klb_lhd',
});

const KLBHallEnterRoomCommonEvent = cc.Enum({
    GID_ER_MJCHANGCHUN: 'klb_mj_changchun',
    GID_ER_TIANDAKENG: 'klb_tiandakeng',
    GID_ER_MJJILIN: 'klb_mj_jilin',
    GID_ER_YYL: 'klb_yyl',
    GID_ER_LHD: 'klb_lhd',
});

const KLBHallEnterRoomOtherCommonEvent = cc.Enum({
    GID_ERO_MJCHANGCHUN: 'klb_mj_changchun',
    GID_ERO_TIANDAKENG: 'klb_tiandakeng',
    GID_ERO_MJJILIN: 'klb_mj_jilin',
    GID_ERO_YYL: 'klb_yyl',
    GID_ERO_LHD: 'klb_lhd',
});

const KLBHallLeaveRoomCommonEvent = cc.Enum({
    GID_LR_MJCHANGCHUN: 'klb_mj_changchun',
    GID_LR_TIANDAKENG: 'klb_tiandakeng',
    GID_LR_MJJILIN: 'klb_mj_jilin',
    GID_LR_YYL: 'klb_yyl',
    GID_LR_LHD: 'klb_lhd',
});

const KLBHallPrepareCommonEvent = cc.Enum({
    GID_P_MJCHANGCHUN: 'klb_mj_changchun',
    GID_P_TIANDAKENG: 'klb_tiandakeng',
    GID_P_MJJILIN: 'klb_mj_jilin',
    GID_P_YYL: 'klb_yyl',
    GID_P_LHD: 'klb_lhd',
});

const HallCommonData = cc.Class({
    _instance: null,

    statics: {
        getInstance: function () {
            if (!this._instance) {
                this._instance = new HallCommonData();
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
         * 玩家id
         */
        userId: 0,
        /**
         * 昵称
         */
        nick: '',
        /**
         * 性别
         */
        sex: 1,
        /**
         * 头像地址
         */
        headUrl: '',
        /**
         * 姓名
         */
        name: '',
        /**
         * 电话号码
         */
        telNum: '',
        /**
         * 微信号
         */
        wxNum: '',
        /**
         * 居住地址
         */
        address: '',
        /**
         * 微信unionid
         */
        unionId: '',
        /**
         * 微信openid
         */
        openId: '',
        /**
         * 微信获取城市
         */
        city: '',
        /**
         * 身份证号码
         */
        idNum: '',
        /**
         * 任务列表
         */
        taskList: [],
        /**
         * 抽奖结果
         */
        luckId: 0,
        /**
         * 语音sdk 账号
         */
        imAccid: '',
        /**
         * 语音sdk token
         */
        imToken: '',

        /**
         * 头像精灵zhen
         */
        headSpf: cc.SpriteFrame,

        vipLevel: 0,
        vipExp: 0,
        level: 0,
        exp: 0,

        /**
         * 金币
         */
        coin: 0,
        /**
         * 钻石
         */
        diamond: 0,
        /**
         * 房卡
         */
        roomCard: 0,
        /**
         * 红包
         */
        redBag: 0,
        /**
         * 元宝
         */
        common_gold: 0,
        /**
         * 
         */
        gold: 0,
        /**
         * 话费
         */
        phonePay: 0,

        jiuji_cnt: 0,

        /**
         * 在线时间
         */
        onlineTime: 0,

        /**
         * 累积充值量
         */
        rechargeCount: 0,

        //玩家变量
        playerVariant: [],

        //保险箱金币
        userBankGold_coin: 0,

        //公告
        noticeList: [],

        //注册方式:
        regChannel: 0,

        //改名次数
        changeNameCount: 0,

        fishGiftNum: 0,
        fishGiftLevel: 0,
        fishGiftBetNum: 0,
        fishGiftList: [],
        curUseFishGiftCnt: 0,
        fishActivityState: 0,
        wx: '',
    },

    setMsgData: function (msg) {
        this.userId = msg.userid;
        cc.dd.user.id = msg.userid;
        cc.dd.user.sex = msg.sex;
        this.nick = msg.username;
        this.sex = msg.sex;
        this.headUrl = msg.headurl;
        this.name = msg.realname;
        this.telNum = msg.phonenumber;
        this.wxNum = msg.wxnumber;
        this.address = msg.realaddress;
        this.unionId = msg.unionid;
        this.openId = msg.openid;
        this.city = msg.city;
        this.idNum = msg.idcardnumber;
        this.gameId = msg.gameid;
        this.vipLevel = msg.viplevel;
        this.vipExp = msg.vipexp;
        this.level = msg.level;
        this.exp = msg.exp;
        //玩家资产相关
        this.coin = msg.coin;
        this.diamond = msg.diamond;
        this.roomCard = msg.roomcard;
        this.redBag = msg.bouns;
        this.common_gold = msg.commonGold;
        this.gold = msg.gold;
        this.phonePay = msg.phoneValue;
        this.isGetMoney = msg.isGetMoney;

        this.onlineTime = msg.onlineTimeDay;
        this.rechargeCount = msg.rechargeDay;
        this.inviterId = msg.inviterId;//绑定的id
        this.inviterName = msg.inviterName;
        this.inviterHeadurl = msg.inviterHeadurl;
        this.code = msg.code;//玩家的邀请码
        this.changeNameCount = msg.modifiedNameTimes;

        this.memoryCardInfoList = msg.memoryCardInfoListList;
        cc.dd.user.regChannel = Math.floor(msg.regChannel / 100);
        this.regChannel = msg.regChannel % 100;
        this.fishGiftNum = msg.fishGiftNum //当前捕鱼达人礼券数量
        this.fishGiftLevel = 0//当前捕鱼达人礼包档位
        this.fishGiftBetNum = msg.fishGiftBetNum//当前捕鱼达人炮弹数量
        this.fishGiftList = msg.fishGiftListList//捕鱼达人已经领取的礼包id
        this.curUseFishGiftCnt = msg.curUseFishGiftCnt//捕鱼达人已经兑换的次数
        this.fishActivityState = 0//捕鱼达人抽礼券活动
        this.wx = ''//微信客服

        if (this.isReconectGameExit()) {
            cc.log('存在重连游戏, gameid=', this.gameId);
            GateNet.Instance().regRecvFunc(this.gameId);
        } else {
            HallCommonEd.notifyEvent(HallCommonEvent.HALL_NO_RECONNECT_GAME, [this]);
        }

        HallCommonEd.notifyEvent(HallCommonEvent.INIT, this);

        /**
         * 累计在线时长
         */
        cc.sys.localStorage.setItem('onlinetime', this.onlineTime);
        dd.CommonNodeUtil.opTimerControl('com_timer', 60, 10800);
        //登录网易IM
        if (!AppCfg.OPEN_RECORD) {
            return;
        }

        // if(typeof this.openId == 'undefined' || this.openId == ''){
        //     return;
        // }

        // var imuserid = cc.sys.localStorage.getItem('imuserid');
        // var imtoken = cc.sys.localStorage.getItem('imtoken');
        // if (imuserid != this.userId || typeof imtoken == 'undefined' || !imtoken) {
        //     AudioChat.createAccid(this.userId, function (msg) {
        //         if (msg == -1) {
        //             cc.log('语音登录::创建语音账号失败!');
        //         } else {
        //             var accid = msg.accid;
        //             var token = msg.token;
        //             cc.sys.localStorage.setItem('imuserid', accid);
        //             cc.sys.localStorage.setItem('imtoken', token);
        //             AudioChat.loginIm(accid, token);
        //         }
        //     }.bind(this));
        // } else {
        //     AudioChat.loginIm(imuserid, imtoken);
        // }
    },

    setUserData(data) {
        this.userData = data
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_USERDATA);
    },

    isMemoryCard(gameid) {
        if (this.memoryCardInfoList) {
            for (var i = 0; i < this.memoryCardInfoList.length; i++) {
                if (this.memoryCardInfoList[i].gameType == gameid) {
                    var expireTime = this.memoryCardInfoList[i].expireTime;
                    var now = Math.floor(new Date().getTime() / 1000);
                    if (now < expireTime)
                        return true;
                }
            }
        }
        return false;
    },

    updateMemoryCard(msg) {
        if (this.memoryCardInfoList) {
            for (var i = 0; i < this.memoryCardInfoList.length; i++) {
                if (this.memoryCardInfoList[i].gameType == msg.gameType) {
                    this.memoryCardInfoList[i].expireTime = msg.expireTime;
                    return;
                }
            }
        }
        if (!this.memoryCardInfoList)
            this.memoryCardInfoList = [];
        this.memoryCardInfoList.push(msg);
    },

    /**
     * 是否存在重连游戏
     */
    isReconectGameExit: function () {
        if (this.gameId == 0 || cc.dd._.isUndefined(this.gameId) || cc.dd._.isNull(this.gameId)) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * vip等级和经验更新
     * @param msg
     */
    update_vip: function (msg) {
        this.vipLevel = msg.curLevel;
        this.vipExp = msg.curExp;
        cc.dd.PromptBoxUtil.show('充值成功');
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_VIP, [this]);
    },

    /**
     * 玩家等级经验更新
     * @param msg
     */
    update_player: function (msg) {
        this.level = msg.curLevel;
        this.exp = msg.curExp;
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_PLAYER, [this]);
    },

    /**
     * 救济次数
     * @param msg
     */
    update_jiuji_cnt: function (msg) {
        this.jiuji_cnt = msg.remainCnt;
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_JIUJI_CNT, [this]);
    },

    /**
     * 减少救济次数
     * @param msg
     */
    des_jiuji_cnt: function () {
        this.jiuji_cnt -= 1;
        if (this.jiuji_cnt < 0)
            this.jiuji_cnt = 0;
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_JIUJI_CNT, [this]);
    },

    /**
     * 账号设置修改成功
     */
    accountSetSuccess: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.ACCOUNT_UPDATE, this);
    },

    /**
     * 实名认证通过
     */
    realNameAuthen: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.REAL_NAME_AUTHEN, this);
    },

    /**
     * 手机绑定成功
     */
    bindTelNum: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.TEL_BIND, this);
    },

    /**
     * 手机解绑成功
     */
    unbindTel: function () {
        this.telNum = "",
            HallCommonEd.notifyEvent(HallCommonEvent.TEL_UNBIND, this);
    },

    /**
     * 获取验证码成功
     */
    getCodeSuccess: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.GET_CODE_SUCCESS, this);
    },

    /**
     * 获取验证码失败
     */
    getCodeFailed: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.GET_CODE_Failed, this);
    },

    /**
     * 得到任务列表
     */
    taskInfo: function (data) {
        data.sort(function (a, b) {
            return a.taskId - b.taskId;
        });

        data.forEach(function (item) {
            var taskData = this._getTaskById(item.taskId);
            taskData.status = item.status;
            this.taskList.push(taskData);
        }.bind(this));

        HallCommonEd.notifyEvent(HallCommonEvent.TASK_INFO, this.taskList);
    },

    //设置玩家的保险箱数据
    setUserBankCoin: function (gold, bankGold) {
        if (gold != null) {
            this.userGold_coin = gold;
            this.coin = gold;
        }
        if (bankGold != null)
            this.userBankGold_coin = bankGold;
        //HallCommonEd.notifyEvent(HallCommonEvent.BANK_MAIN_UPDATE_COIN, null);
        var hall_prop_data = require('hall_prop_data').HallPropData;
        HallCommonEd.notifyEvent(HallCommonEvent.HALL_UPDATE_ASSETS, hall_prop_data.getInstance());
    },

    _getTaskById: function (id) {
        var data = null;
        // TaskCfg.forEach(function (item) {
        //     if(item.id == id){
        //         data = item;
        //     }
        // });
        // if(!data)
        //     cc.error('Hall_common_data::未知任务!');
        // return data;
    },

    getTaskInfo: function () {
        return this.taskList;
    },

    /**
     * 得到抽奖结果
     */
    setLuckId: function (idList, redBagList) {
        this.luckId = idList;
        HallCommonEd.notifyEvent(HallCommonEvent.GET_LUCK_ID, [idList, redBagList]);
    },

    /**
     * 商品购买成功
     */
    onShopSuccess: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.ON_SHOP_SUCCESS);
    },

    /**
     * 任务更新
     * @param data
     */
    taskUpdate: function (data) {
        var task = null;
        for (var i = 0; i < this.taskList.length; i++) {
            var item = this.taskList[i];
            if (item.id == data.taskid) {
                item.status = data.status;
                task = item;
                break;
            }
        }
        if (!task)
            cc.error('hall_common_data::任务更新失败!');
        HallCommonEd.notifyEvent(HallCommonEvent.TASK_UPDATE, task);
    },

    /**
     * 已领取奖励
     */
    receiveReward: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.RECEIVE_REWARD);
    },

    /**
     * 得到获奖名单
     */
    setWinners: function (list) {
        HallCommonEd.notifyEvent(HallCommonEvent.SET_WINNERS, list);
    },

    /**
     * 红包兑换结果
     * @param data
     */
    changeResult: function (data) {
        HallCommonEd.notifyEvent(HallCommonEvent.CHANGE_RED_BAG, data);
    },

    /**
     * 跑马灯
     */
    onMarquee: function (data) {
        HallCommonEd.notifyEvent(HallCommonEvent.MARQUEE, data);
    },

    /**
     * 跑马灯默认信息
     */
    onDefaultMarquee: function (data) {
        HallCommonEd.notifyEvent(HallCommonEvent.GET_BROADCAST_CONFIG, data);
    },
    /**
     * 更新昵称
     */
    updateNick: function () {
        HallCommonEd.notifyEvent(HallCommonEvent.UPDATE_NICK, this.nick);
    },

    /**
     * 更新性别
     */
    updateSex: function (success) {
        if (success) {
            if (this.sex == 1) {
                this.sex = 2;
            } else {
                this.sex = 1;
            }
        }
        HallCommonEd.notifyEvent(HallCommonEvent.UPDATE_SEX);
    },

    /**
     * 获取累冲数值
     */
    getRechargeCount: function () {
        return this.rechargeCount;
    },

    /**
     *创建游戏房间，统一消息处理 
     */
    createRoom: function (data) {
        if (data.retCode == 0) {
            switch (data.gameInfo.gameType) {
                case Define.GameType.JLMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                case Define.GameType.JLMJ_CLUB:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                case Define.GameType.CCMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                case Define.GameType.CCMJ_CLUB:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                case Define.GameType.NAMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
            }
        } else {
            var str = "";
            switch (data.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_1;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_2;
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_3;
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_4;
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_5;
                    break;
                default:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_10;
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str);
        }
    },


    /**
     *加入游戏房间，统一消息处理 
     */
    enterRoom: function (data) {
        if (data.retCode == 0) {
            switch (data.gameInfo.gameType) {
                case Define.GameType.JLMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvEnter(data);
                    break;
                case Define.GameType.JLMJ_CLUB:
                    jlmj_room_mgr.getInstance().recvEnter(data);
                    break;
                case Define.GameType.CCMJ_FRIEND:

                    break;
                case Define.GameType.CCMJ_CLUB:

                    break;
                case Define.GameType.NAMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                default:
                    break;
            }
        } else {
            var str = "";
            switch (data.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_6;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_7;
                    break;
                default:
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str);
        }
    },

    /**
     * 加入 房间其他玩家信息
     */
    enterRoomOtherPlayers: function (data) {
        switch (data.gameInfo.gameType) {
            case Define.GameType.JLMJ_FRIEND:
                jlmj_room_mgr.getInstance().recvJoin(data);
                break;
            case Define.GameType.JLMJ_CLUB:
                jlmj_room_mgr.getInstance().recvJoin(data);
                break;
            case Define.GameType.CCMJ_FRIEND:

                break;
            case Define.GameType.CCMJ_CLUB:

                break;
            case Define.GameType.NAMJ_FRIEND:
                jlmj_room_mgr.getInstance().recvCreate(data);
                break;
            default:
                break;
        }
    },

    /**
     * 离开游戏房间消息处理
     */
    leaveRoom: function (data) {
        if (data.retCode == 0) {
            switch (data.gameInfo.gameType) {
                case Define.GameType.JLMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvExit(data);
                    break;
                case Define.GameType.JLMJ_CLUB:
                    jlmj_room_mgr.getInstance().recvExit(data);
                    break;
                case Define.GameType.CCMJ_FRIEND:

                    break;
                case Define.GameType.CCMJ_CLUB:

                    break;
                case Define.GameType.NAMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                default:
                    break;
            }
        } else {
            var str = "";
            switch (data.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    break;
                default:
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str);
        }
    },

    /**
     * 点击准备消息处理
     */
    prepareGame: function () {
        if (data.retCode == 0) {
            switch (data.gameInfo.gameType) {
                case Define.GameType.JLMJ_FRIEND:

                    jlmj_room_mgr.getInstance().recvReady(data);
                    break;
                case Define.GameType.JLMJ_CLUB:
                    jlmj_room_mgr.getInstance().recvReady(data);
                    break;
                case Define.GameType.CCMJ_FRIEND:

                    break;
                case Define.GameType.CCMJ_CLUB:

                    break;
                case Define.GameType.NAMJ_FRIEND:
                    jlmj_room_mgr.getInstance().recvCreate(data);
                    break;
                case Define.GameType.PAOYAO_FRIEND:

                    break;
                default:
                    break;
            }
        } else {
            var str = "";
            switch (data.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    break;
                default:
                    break;
            }
            cc.dd.DialogBoxUtil.show(0, str);
        }
    },

    /**
     * ui层主动请求数据刷新界面
     */
    freshView: function () {
        cc.log('hall_common_data::freshView!');
        HallCommonEd.notifyEvent(HallCommonEvent.INIT, this);
    },

    //玩家变量
    //变量为0返回false，变量为1返回true
    GetPlayerVarivat: function (nFlag) {
        if (null == nFlag) {
            return false
        }
        var value = this.playerVariant[nFlag]
        if (null == value || 0 == value) {
            return false
        }

        return (value == 1)
    },

    setNotice(noticeListList) {
        this.noticeList = noticeListList
    },

    getNoticeLength() {
        let list = cc.sys.localStorage.getItem('readNoticeList');
        if (!list) {
            list = [];
        } else {
            list = JSON.parse(list);
        }


        let _isRead = (title) => {
            if (list.length == 0) {
                return false;
            }
            var isRead = false;
            list.forEach(function (item) {
                if (item == title) {
                    isRead = true;
                }
            });
            return isRead;
        };

        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        var unix_timstamp = Math.floor(date.getTime() / 1000);

        let num = 0;
        let noticeNum = 0;
        let activeNum = 0;

        for (let i = 0; i < this.noticeList.length; i++) {
            if (!_isRead(this.noticeList[i].title) && this.noticeList[i].timestamp <= unix_timstamp) {
                num++;
                if (this.noticeList[i].type == 0) {
                    noticeNum++;
                } else {
                    activeNum++;
                }
            }
        }

        return [num, noticeNum, activeNum];
    },


});

const PlayerBaseInfoMgr = cc.Class({
    _instance: null,

    statics: {
        getInstance: function () {
            if (!this._instance) {
                this._instance = new PlayerBaseInfoMgr();
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
        playerBaseInfo: [],
    },

    onLoad: function () {
        this.playerBaseInfo = [];
    },

    addPlayerInfo: function (info) {
        this.delPlayerInfoById(info.userId);
        this.playerBaseInfo[this.playerBaseInfo.length] = info;
    },

    delPlayerInfoById: function (id) {
        var infoNode = this.findPlayerInfoById(id);
        if (infoNode.info != null) {
            this.playerBaseInfo.splice(infoNode.index, 1);
        }
    },

    findPlayerInfoById: function (id) {
        for (var i = 0; i < this.playerBaseInfo.length; i++) {
            if (id == this.playerBaseInfo[i].userId)
                return { info: this.playerBaseInfo[i], index: i };
        }

        return { info: null, index: 0 };
    },

    clearData: function () {
        this.playerBaseInfo = [];
    },
});

module.exports = {
    HallCommonEd: HallCommonEd,
    HallCommonEvent: HallCommonEvent,
    HallCommonData: HallCommonData,
    PlayerBaseInfoMgr: PlayerBaseInfoMgr,
    KLBHallCreateRoomCommonEvent: KLBHallCreateRoomCommonEvent,
    KLBHallEnterRoomCommonEvent: KLBHallEnterRoomCommonEvent,
    KLBHallEnterRoomOtherCommonEvent: KLBHallEnterRoomOtherCommonEvent,
    KLBHallLeaveRoomCommonEvent: KLBHallLeaveRoomCommonEvent,
    KLBHallPrepareCommonEvent: KLBHallPrepareCommonEvent,
    PlayerVariantIndex: PlayerVariantIndex,
};