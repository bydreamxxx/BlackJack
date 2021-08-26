/**
 * 麻将模式 1.朋友桌 2.金币桌 3.俱乐部 4.比赛桌
 * @type {{FRIEND: number, GOLD: number, CLUB: number, MATCH: number}}
 */
var MahjongMode = {
    FRIEND: 0,
    MATCH: 1,
    GOLD: 2,
    CLUB: 3
};

/**
 * 游戏类型
 * 吉林麻将 20.朋友桌 21.俱乐部
 * @type {{FRIEND: number, CLUB: number}}
 */
var GameType = {
    JLMJ_FRIEND: 20,
    JLMJ_CLUB: 21,
    JLMJ_MATCH: 520,
    JLMJ_GOLD: 23,

    CCMJ_FRIEND: 10,
    CCMJ_CLUB: 11,
    CCMJ_MATCH: 510,
    CCMJ_GOLD: 13,

    PAOYAO_GOLD: 61,
    PAOYAO_FRIEND: 60,

    GDY_GOLD: 142,
    GDY_FRIEND: 42,


    NAMJ_FRIEND: 54,
    //NNMJ_CLUB: 11,
    NAMJ_MATCH: 554,
    NAMJ_GOLD: 56,

    FXMJ_GOLD: 159,
    FXMJ_FRIEND: 59,
    FXMJ_MATCH: 559,

    SYMJ_GOLD: 162,
    SYMJ_FRIEND: 62,
    SYMJ_FRIEND_2: 262,
    SYMJ_MATCH: 562,

    TDK_FRIEND: 40,
    TDK_COIN: 41,
    TDK_FRIEND_LIU: 44,
    TDK_FRIEND_TL: 45,

    SDY_FRIEND: 26,

    PDK_FRIEND: 29,

    DDZ_MATCH: 31,
    DDZ_GOLD: 32,
    DDZ_FRIEND: 33,
    DDZ_XYPYC: 34,
    DDZ_XYJBC: 134,

    NN_GOLD: 51,
    NN_FRIEND: 50,
    NN_JLB: 150,

    BRNN_GOLD: 109,
    BRNN_JLB: 108,

    DSZ_FRIEND: 35,
    DSZ_GOLD: 135,

    SH_FRIEND: 63,
    SH_GOLD: 163,
    SH_MATCH: 563,

    XZMJ_GOLD: 164,
    XZMJ_FRIEND: 64,
    XZMJ_MATCH: 564,

    XLMJ_GOLD: 166,
    XLMJ_FRIEND: 66,
    XLMJ_MATCH: 566,

    SHMJ_GOLD: 169,
    SHMJ_FRIEND: 69,
    SHMJ_MATCH: 569,

    DT_GOLD: 103,

    HBSL_GOLD: 143,
    HBSL_JBL: 43,

    JZMJ_GOLD: 171,
    JZMJ_FRIEND: 71,
    JZMJ_MATCH: 571,

    HSMJ_GOLD: 172,
    HSMJ_FRIEND: 72,
    HSMJ_MATCH: 572,

    NEW_DSZ_FRIEND: 36,
    NEW_DSZ_GOLD: 136,
    NEW_DSZ_GOLD_CREATE: 37,

    TDHMJ_GOLD: 173,
    TDHMJ_FRIEND: 73,
    TDHMJ_MATCH: 573,

    BIRDS_AND_ANIMALS: 104,

    CFMJ_GOLD: 175,
    CFMJ_FRIEND: 75,
    CFMJ_MATCH: 575,

    AHMJ_GOLD: 176,
    AHMJ_FRIEND: 76,
    AHMJ_MATCH: 576,

    FZMJ_GOLD: 178,
    FZMJ_FRIEND: 78,
    FZMJ_MATCH: 578,

    WDMJ_GOLD: 179,
    WDMJ_FRIEND: 79,
    WDMJ_MATCH: 579,

    PZMJ_GOLD: 180,
    PZMJ_FRIEND: 80,
    PZMJ_MATCH: 580,

    BCMJ_GOLD: 181,
    BCMJ_FRIEND: 81,
    BCMJ_MATCH: 581,

    LKFISH_GOLD: 138,
    LKFISH_GOLD_CREATE: 38,

    DOYENFISH_GOLD: 139,
    DOYENFISH_GOLD_CREATE: 39,

    WESTWARD_GOLd: 105,

    ACMJ_GOLD: 182,
    ACMJ_FRIEND: 82,
    ACMJ_MATCH: 582,


    HLMJ_GOLD: 183,
    HLMJ_FRIEND: 83,
    HLMJ_MATCH: 583,
    LUCKY_TURNTABLE: 106,

    JSMJ_GOLD: 184,

    EBG_GOLD: 201,

    HJSM: 107,
    MOUSE: 110,

};

/**
 * 游戏ID 每款游戏以百位为单位 往后增加
 * @type {{JLMJ_FRIEND: number, JLMJ_CLUB: number, JLMJ_GOLD: number, JLMJ_MATCH: number, CCMJ_FRIEND: number, CCMJ_CLUB: number, CCMJ_GOLD: number, CCMJ_MATCH: number}}
 */
var GameId = {
    // ------------- 吉林麻将 -------------
    // 朋友桌
    20: "jlmj_game",
    // 俱乐部
    //21: "jlmj_jlb_game",
    // 比赛场
    //22: "jlmj_bsc_game",
    // 金币场
    23: "jlmj_jbc_game",
    // ------------- 吉林麻将 -------------

    // ------------- 长春麻将 -------------
    // 朋友桌
    10: "ccmj_py_game",
    // 俱乐部
    //11: "ccmj_jlb_game",
    // 比赛场
    510: "ccmj_jbc_game",
    // 金币场
    13: "ccmj_jbc_game",
    //-------------- 刨幺 -------------
    //金币场
    61: "py_game_jbc",
    //朋友场
    60: "py_game_pyc",

    //-------------- 干瞪眼 -------------
    //朋友场
    42: "gdy_game_pyc",
    //金币场
    142: "gdy_game_jbc",
    // ------------- 长春麻将 -------------

    // ------------- 农安麻将 -------------
    // 朋友桌
    54: "namj_py_game",
    // 俱乐部
    //11: "nnmj_jlb_game",
    // 比赛场
    //12: "nnmj_bsc_game",
    // 金币场
    56: "namj_jbc_game",

    // ------------- 农安麻将 -------------

    // ------------- 阜新麻将 -------------
    // 朋友桌
    59: "fxmj_py_game",
    // 俱乐部
    //11: "nnmj_jlb_game",
    // 比赛场
    //12: "nnmj_bsc_game",
    // 金币场
    159: "fxmj_jbc_game",

    // ------------- 阜新麻将 -------------

    // ------------- 阜新麻将 -------------
    // 朋友桌
    62: "symj_py_game",
    // 俱乐部
    //11: "nnmj_jlb_game",
    // 比赛场
    //12: "nnmj_bsc_game",
    // 金币场
    162: "symj_jbc_game",

    // ------------- 阜新麻将 -------------

    //---------------填大坑朋友场----------------
    40: "TDKScene",
    //---------------填大坑方正朋友场----------------
    44: 'TDKScene',
    //---------------填大坑金币场----------------
    41: "TDKCoinScene",
    //---------------斗地主---------------
    31: 'ddz_game_bsc',
    32: 'ddz_game_jbc',
    33: 'ddz_game_pyc',
    //---------------斗地主---------------
    26: "sdy_pyc",


    //---------------牛牛----------------
    51: 'nn_game_jbc',
    50: 'nn_game_pyc',
    150: 'nn_game_jlb',

    109: 'brnn_game',
    108: 'brnn_game_jlb',
    //---------------斗三张---------------
    35: 'dsz_game_pyc',
    135: 'dsz_game_jbc',

    //---------------梭哈---------------
    63: 'suoha_pyc',
    163: 'suoha_jbc',
    563: 'suoha_bsc',

    //---------------四川麻将--------------
    64: 'scmj_py_game',
    66: 'scmj_py_game',
    164: 'scmj_jbc_game',
    166: 'scmj_jbc_game',

    //---------------绥化麻将--------------
    69: 'shmj_py_game',
    169: 'shmj_jbc_game',

    //--------------------百人单挑----------
    103: 'gameyj_one_on_one',
    // 103: 'play_mouse',
    //-------------------红包扫雷
    43: 'hbslScene',
    143: 'hbslScene',

    //---------------锦州麻将--------------
    71: 'jzmj_py_game',
    171: 'jzmj_jbc_game',

    //---------------黑山麻将--------------
    72: 'hsmj_py_game',
    172: 'hsmj_jbc_game',

    //-----------------新斗三张---------
    36: 'new_dsz_scene',
    136: 'new_dsz_scene',
    37: 'new_dsz_scene',
    //---------------飞禽走兽
    104: 'birds_and_animals_scene',
    // ------------- 巷乐推倒胡 -------------
    // 朋友桌
    73: "tdhmj_py_game",
    // 比赛场
    173: "tdhmj_jbc_game",
    // 金币场
    573: "tdhmj_jbc_game",

    // ------------- 赤峰麻将 -------------
    // 朋友桌
    75: "cfmj_py_game",
    // 比赛场
    175: "cfmj_jbc_game",
    // 金币场
    575: "cfmj_jbc_game",

    // ------------- 敖汉麻将 -------------
    // 朋友桌
    76: "ahmj_py_game",
    // 比赛场
    176: "ahmj_jbc_game",
    // 金币场
    576: "ahmj_jbc_game",

    // ------------- 方正麻将 -------------
    // 朋友桌
    78: "fzmj_py_game",
    // 比赛场
    178: "fzmj_jbc_game",
    // 金币场
    578: "fzmj_jbc_game",

    // ------------- 乌丹麻将 -------------
    // 朋友桌
    79: "wdmj_py_game",
    // 比赛场
    179: "wdmj_jbc_game",
    // 金币场
    579: "wdmj_jbc_game",

    // ------------- 平庄麻将 -------------
    // 朋友桌
    80: "pzmj_py_game",
    // 比赛场
    180: "pzmj_jbc_game",
    // 金币场
    580: "pzmj_jbc_game",

    // ------------- 白城麻将 -------------
    // 朋友桌
    81: "bcmj_py_game",
    // 比赛场
    181: "bcmj_jbc_game",
    // 金币场
    581: "bcmj_jbc_game",

    138: "fish_scene",

    139: "fish_doyen_scene",

    34: 'xyddz_pyc',

    29: 'pdk_pyc',
    105: 'big_talk_westward_journey',//西游记

    // ------------- 阿城麻将 -------------
    // 朋友桌
    82: "acmj_py_game",
    // 比赛场
    182: "acmj_jbc_game",
    // 金币场
    582: "acmj_jbc_game",

    106: 'lucky_turntable_Scene', //幸运转盘


    // ------------- 和龙麻将 -------------
    // 朋友桌
    83: "hlmj_py_game",
    // 比赛场
    183: "hlmj_jbc_game",
    // 金币场
    583: "hlmj_jbc_game",

    // ------------- 极速麻将 -------------
    // 比赛场
    184: "jsmj_jbc_game",

    // ------------- 二八杠 -------------
    201: 'ebg_game',

    //------------h黄金赛马--------------
    107: 'gameyj_horse_racing_scene',
    //------------打地鼠--------------
    110: 'play_mouse',
};

/**
 * //逛锅类型
 * @type {{GD_50: number, GD_100: number, GD_200: number, GD_0_32: number, GD_0_64: number}}
 */
var GuangGuoType = {
    GD_50: 0,        //锅底50-16封顶
    GD_100: 1,        //锅底100-32封顶
    GD_200: 2,        //锅底200-64封顶
    GD_0_32: 3,        //不逛锅 32封顶
    GD_0_64: 4,        //不逛锅 64封顶
};


/**
 * 玩家状态
 * @type {{USER_ON_LINE: number, USER_OFF_LINE: number, USER_SIT: number, USER_READY: number, USER_GAMING: number}}
 */
var UserStatus = {
    USER_ON_LINE: 1,    // 在线
    USER_OFF_LINE: 2,    // 离线
    USER_SIT: 3,    // 坐下
    USER_READY: 4,    // 准备
    USER_GAMING: 5,    // 游戏中
};


/**
 * 胡牌类型
 * @type {{PING_HU: number, FANG_PAO: number, ZI_MO: number, JIA_HU: number, MO_BAO: number, DUI_BAO: number, PIAO_HU: number, ZHUANG_HU: number, LI_HU: number, QI_DUI: number, HAO_QI: number, SHUANG_HAO_QI: number, ZHIZUN_HAO_QI: number, QING_YI_SE: number, SHOU_BA_YI: number, BIAN_HU: number, GANG_HUA_HU: number, TIAN_HU: number, QIANG_HU: number}}
 */
var HuType = {
    PING_HU: 1,            // 平胡(+1)
    FANG_PAO: 2,            // 放炮(+1)
    ZI_MO: 3,            // 自摸(+1)
    JIA_HU: 4,            // 夹胡(+1)
    MO_BAO: 5,            // 摸宝(+1)
    DUI_BAO: 6,            // 对宝(+2)
    PIAO_HU: 7,            // 飘胡(+3)
    ZHUANG_HU: 8,            // 庄胡(+1)
    LI_HU: 9,            // 立胡/门清(+1)
    QI_DUI: 10,           // 七对(封顶)
    HAO_QI: 11,           // 豪七(封顶)
    SHUANG_HAO_QI: 12,           // 双豪七(封顶)
    ZHIZUN_HAO_QI: 13,           // 至尊豪七(封顶)
    QING_YI_SE: 14,           // 清一色(+1)
    SHOU_BA_YI: 15,			// 手把一(+1)
    BIAN_HU: 16,			// 边胡(+2)
    GANG_HUA_HU: 17,			// 杠上花(+1)
    TIAN_HU: 18,			// 天胡(封顶)
    QIANG_HU: 19,			// 抢杠胡(+1)
    DANDIAO_PIAOHU: 22, // 单吊飘胡
};

/**
 * 碰杠类型(客户端显示用)
 * @type {{C_MINGGANG: number, C_ANGANG: number, C_FENG: number, C_XI: number, C_YAO: number, C_JIU: number, C_PENG: number, C_CHI: number}}
 */
var ComposeCardType = {
    C_MINGGANG: 1, //明杠
    C_ANGANG: 2, //暗杠
    C_FENG: 3, //风杠
    C_XI: 4, //喜杠
    C_YAO: 5, //幺杠
    C_JIU: 6, //九杠
    C_PENG: 7, //碰
    C_CHI: 8, //吃牌的类型
    C_LZB: 11, //亮掌宝
    C_BUHUA: 12, //补花
};

var GamePID = {
    CFMJ: 10006
}

module.exports = {
    MahjongMode: MahjongMode,
    GameType: GameType,
    GameId: GameId,
    GuangGuoType: GuangGuoType,
    UserStatus: UserStatus,
    HuType: HuType,
    ComposeCardType: ComposeCardType,
    GamePID: GamePID,
};