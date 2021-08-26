//客户端操作
var clientAction = {
    //******* 游戏类型 ***********
    HALL: 1,                //大厅
    DDZ_MATCH: 2,           //斗地主比赛场
    DDZ_GOLD: 3,            //斗地主金币场
    DDZ_FRIEND: 4,          //斗地主朋友场
    DSZ_GOLD: 5,            //逗三张金币场
    DSZ_FRIEND: 6,          //逗三张朋友场
    WATER_SLOT: 7,          //水浒老虎机
    WATER_SLOT: 8,          //财神老虎机
    JLMJ_GOLD: 9,           //吉林麻将金币场
    JLMJ_FRIEND: 10,        //吉林麻将朋友场
    CCMJ_GOLD: 11,          //长春麻将金币场
    CCMJ_FRIEND: 12,        //长春麻将朋友场
    NAMJ_GOLD: 13,          //农安麻将金币场
    NAMJ_FRIEND: 14,        //农安麻将朋友场
    FXMJ_GOLD: 15,          //阜新麻将金币场
    FXMJ_FRIEND: 16,        //阜新麻将朋友场
    SYMJ_GOLD: 17,          //松原麻将金币场
    SYMJ_FRIEND: 18,        //松原麻将朋友场
    SYMJ_KT_FRIEND: 19,     //松原麻将（快听）朋友场
    XZMJ_GOLD: 20,          //血战麻将金币场
    XZMJ_FRIEND: 21,        //血战麻将朋友场
    XLMJ_GOLD: 22,          //血流成河金币场
    XLMJ_FRIEND: 23,        //血流成河朋友场
    RANK_TYPE: 24,          //排行榜
    ACTOVITY_TYPE: 25,      //活动
    PAOYAO_GOLD: 26,        //刨幺金币场
    PAOYAO_FRIEND: 27,      //刨幺朋友场
    TDK_FRIEND: 28,         //填大坑朋友场
    TDK_COIN: 29,           //填大坑金币场
    NN_GOLD: 30,            //牛牛金币场
    NN_FRIEND: 31,          //牛牛朋友场
    NN_JLB: 32,             //牛牛俱乐部
    BRNN_GOLD: 33,          //百人牛牛金币场
    BRNN_JLB: 34,           //百人牛牛俱乐部
    SH_FRIEND: 35,          //梭哈朋友场
    SH_GOLD: 36,            //梭哈金币场
    SHMJ_FRIEND: 37,        //绥化麻将朋友场
    SHMJ_GOLD: 38,          //绥化麻将金币场
    JZMJ_GOLD: 39,          //锦州麻将金币场
    JZMJ_FRIEND: 40,          //锦州麻将朋友场
    HSMJ_GOLD: 41,          //黑山麻将金币场
    HSMJ_FRIEND: 42,          //黑山麻将朋友场
    TDHMJ_GOLD: 41,          //推倒胡麻将金币场
    TDHMJ_FRIEND: 42,          //推倒胡麻将朋友场
    CFMJ_GOLD: 41,          //赤峰麻将金币场
    CFMJ_FRIEND: 42,          //赤峰麻将朋友场
    AHMJ_GOLD: 41,          //敖汉麻将金币场
    AHMJ_FRIEND: 42,          //敖汉麻将朋友场
    FZMJ_GOLD: 41,          //方正麻将金币场
    FZMJ_FRIEND: 42,          //方正麻将朋友场
    WDMJ_GOLD: 43,          //乌丹麻将金币场
    WDMJ_FRIEND: 44,          //乌丹麻将朋友场
    PZMJ_GOLD: 45,          //平庄麻将金币场
    PZMJ_FRIEND: 46,          //平庄麻将朋友场
    BCMJ_GOLD: 47,          //白城麻将金币场
    BCMJ_FRIEND: 48,          //白城麻将朋友场
    ACMJ_GOLD: 49,          //阿城麻将金币场
    ACMJ_FRIEND: 50,          //阿城麻将朋友场
    HLMJ_GOLD: 49,          //和龙麻将金币场
    HLMJ_FRIEND: 50,          //和龙麻将朋友场
    //*******   通用  ***********
    T_NORMAL: {
        NORMAL_GAME: 999,        //普通场
        ELITE_GAME: 998,         //精英场
        LOCAL_TYRANTS_GAME: 997, //土豪场
        SUPREME_GAME: 996,       //至尊场
        QUICK_GAME: 995,         //快速开始
    },
    //*******   大厅  ***********
    T_HALL: {
        MAIL: 1,                //邮件
        CLUB: 2,                //俱乐部
        JOIN_ROOM: 3,           //加入房间
        CREATE_ROOM: 4,         //创建房间
        BAG: 5,                 //背包
        TASK: 6,                //福利
        ACTIVITY: 7,            //活动
        RANK: 8,                //排行榜
        STORE: 9,               //商城
        LUCKYMONEY: 10,         //抢红包
        FKDL: 11,               //房卡代理
        FKYJ: 12,               //反馈有奖
        SHARE: 13,              //分享领金币
        FIRSTPAY: 14,           //首冲
        HONGBAO_1: 15,          //1元抢红包
        HONGBAO_3: 16,          //3元抢红包
        HONGBAO_5: 17,          //5元抢红包
        HONGBAO_20: 18,         //20元抢红包
        REAL_NAME: 19,          //实名认证
        BIND_PHONE: 20,         //绑定手机
        CUSTOMER_SERVICE: 21,   //联系客服
        VIP: 22,                //VIP
        RECORD: 23,             //战绩
        GAME_RULE: 24,          //游戏规则
        SETTING: 25,            //设置
        NOTICE: 26,             //声明
        SWITCH_USER: 27,        //切换账号
        HALL_ICON_CLICK: 28,    //大厅icon点击
        RANK_GOLD: 29,          //排行榜金币
        RANK_PROFIT: 30,        //排行榜盈利
        RANK_RICH: 31,          //排行榜富豪
        ACTIVITY_HONGBAO: 32,   //活动红包
        ACTIVITY_SIGN: 33,      //活动签到
        ACTIVITY_REAL: 34,      //活动实名
        ACTIVITY_FREE_CARD: 35, //活动免费房卡
        ACTIVITY_VIP: 36,       //活动VIP
        ACTIVITY_FREE: 37,      //活动免费代理
    },
    //*******   斗地主  ***********
    T_DDZ: {
        CALLSCORE_0: 1,         //不叫分
        CALLSCORE_1: 2,         //叫1分
        CALLSCORE_2: 3,         //叫2分
        CALLSCORE_3: 4,         //叫3分
        DOUBLE_0: 5,            //不加倍
        DOUBLE_1: 6,            //加倍
        PASS: 7,                //要不起
        CONTINUE: 8,            //继续
        EXCHANGE: 9,            //换桌
    },
    //************斗三张****************/
    T_DSZ: {
        CREARTE: 1,             //c创建
        OP: 2,                  //加注/跟注/弃牌
        CMP: 3,                 //比牌
        FIRE: 4,                //火拼
        ALLIN: 5,                //孤注一掷
        WATCH: 6,               //看牌
        CHANGE: 7,              //换桌
    },
    //*************老虎机***************/
    T_SLOT: {
        BET: 1,                  //下注
        CHECKGAME: 2,           //检测小游戏
        GETSCORE: 3,            //得分
        STARTTINY: 4,           //开始小游戏
        CMPBET: 5,              //比倍下注
        CMPBETTYPE: 6,          //比倍下注类型
        PLAYERLIST: 7,          //玩家数据
        OPENBOX: 8,             //开宝箱
        CHECKSMALL: 9,          //检测财神小游戏
    },


};

module.exports = {
    clientAction: clientAction,
    translateGameID: function (gameID) {
        if (cc.dd._.isString(gameID)) {
            gameID = parseInt(gameID);
        }
        switch (gameID) {
            case cc.dd.Define.GameType.DDZ_MATCH:
                return clientAction.DDZ_MATCH;
            case cc.dd.Define.GameType.DDZ_GOLD:
                return clientAction.DDZ_GOLD;
            case cc.dd.Define.GameType.DSZ_GOLD:
                return clientAction.DSZ_GOLD;
            case cc.dd.Define.GameType.JLMJ_GOLD:
                return clientAction.JLMJ_GOLD;
            case cc.dd.Define.GameType.CCMJ_GOLD:
                return clientAction.CCMJ_GOLD;
            case cc.dd.Define.GameType.NAMJ_GOLD:
                return clientAction.NAMJ_GOLD;
            case cc.dd.Define.GameType.FXMJ_GOLD:
                return clientAction.FXMJ_GOLD;
            case cc.dd.Define.GameType.SYMJ_GOLD:
                return clientAction.SYMJ_GOLD;
            case cc.dd.Define.GameType.XZMJ_GOLD:
                return clientAction.XZMJ_GOLD;
            case cc.dd.Define.GameType.XLMJ_GOLD:
                return clientAction.XLMJ_GOLD;
            case cc.dd.Define.GameType.PAOYAO_GOLD:
                return clientAction.PAOYAO_GOLD;
            case cc.dd.Define.GameType.TDK_COIN:
                return clientAction.TDK_COIN;
            case cc.dd.Define.GameType.NN_GOLD:
                return clientAction.NN_GOLD;
            case cc.dd.Define.GameType.BRNN_GOLD:
                return clientAction.BRNN_GOLD;
            case cc.dd.Define.GameType.BRNN_JLB:
                return clientAction.BRNN_JLB;
            case cc.dd.Define.GameType.SH_GOLD:
                return clientAction.SH_GOLD;
            case cc.dd.Define.GameType.SHMJ_GOLD:
                return clientAction.SHMJ_GOLD;
            case cc.dd.Define.GameType.JZMJ_GOLD:
                return clientAction.JZMJ_GOLD;
            case cc.dd.Define.GameType.HSMJ_GOLD:
                return clientAction.HSMJ_GOLD;
            case cc.dd.Define.GameType.TDHMJ_GOLD:
                return clientAction.TDHMJ_GOLD;
            case cc.dd.Define.GameType.CFMJ_GOLD:
                return clientAction.CFMJ_GOLD;
            case cc.dd.Define.GameType.AHMJ_GOLD:
                return clientAction.AHMJ_GOLD;
            case cc.dd.Define.GameType.FZMJ_GOLD:
                return clientAction.FZMJ_GOLD;
            case cc.dd.Define.GameType.WDMJ_GOLD:
                return clientAction.WDMJ_GOLD;
            case cc.dd.Define.GameType.PZMJ_GOLD:
                return clientAction.PZMJ_GOLD;
            case cc.dd.Define.GameType.BCMJ_GOLD:
                return clientAction.BCMJ_GOLD;
            case cc.dd.Define.GameType.ACMJ_GOLD:
                return clientAction.ACMJ_GOLD;
            case cc.dd.Define.GameType.HLMJ_GOLD:
                return clientAction.HLMJ_GOLD;
            default:
                return clientAction.HALL
        }
    },
}