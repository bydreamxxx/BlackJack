//create by wj 2018/10/15
var DSZ_UserState = {
    UserStateWait : 1, //玩家等待加入
    UserStateOp : 2, //玩家正在操作
    UserStateFollow : 3,// 跟注
    UserStateAdd: 4, //加注
    UserStateFire: 5, //火拼
    UserStateTry: 6, //孤注一掷
    UserStateLost: 7, //输掉
    UserStateCmp : 8, //主动比牌
    UserStateNormal : 9, //游戏中状态
    UserStateWin : 10, //游戏胜利
    UserStatePrepare : 11, //朋友场已准备
    UserStateUnPrepare : 12, //朋友场未准备
    UserStateFold: 13, //弃牌
    UserStateWacth: 14, //看牌
};

var DSZ_PokerType = {
    Pin3Poker_Special : 1, //特殊牌型
    Pin3Poker_Dan : 2, //单张
    Pin3Poker_DuiZi : 3, //对子
    Pin3Poker_ShunZi : 4, //顺子
    Pin3Poker_TongHua : 5, //同花
    Pin3Poker_TongHuaShun : 6, //同花顺
    Pin3Poker_BaoZi : 7, //豹子
};

var DSZ_Audio = [
    {//女
        AUDIO_CALL:['female_gen0', 'female_gen1', 'female_gen2'],
        AUDIO_ADD:['female_jia'],
        AUDIO_WATCH:['female_kan0', 'female_kan1'],
        AUDIO_CMP:['female_bipai'],
        AUDIO_FOLD:['female_qi0', 'female_qi1'],
        AUDIO_ALLIN:['female_gzyz'],
        AUDIO_FIRE:['female_allin'],
        CHAT:['female_chat1',
            'female_chat2',
            'female_chat3',
            'female_chat4',
            'female_chat5',
            'female_chat6',
            'female_chat7',
            ],
    },
    {   //男
        AUDIO_CALL:['man_gen0','man_gen1','man_gen2'],
        AUDIO_ADD:['man_jia'],
        AUDIO_WATCH:['man_kan0','man_kan1'],
        AUDIO_CMP:['man_bipai'],
        AUDIO_FOLD:['man_qi0', 'man_qi1'],
        AUDIO_ALLIN:['man_gzyz'],
        AUDIO_FIRE:['man_allin'],
        CHAT:['man_chat1',
        'man_chat2',
        'man_chat3',
        'man_chat4',
        'man_chat5',
        'man_chat6',
        'man_chat7',
        ],
    },

];

var DSZ_Chat_Config = {
    Woman:['你打牌怎么比女生还慢啦！',
    '跟到底嘛，人家喜欢真男人！',
    '讨厌啦，干嘛让着人家！',
    '人家最鄙视看牌的！',
    '要玩就玩大的，全压！',
    '不要走，多玩一会儿嘛！',
    '这都能赢，什么运气嘛！',
    ],
    Man:['跟到底，才是真男人！',
    '想快点输你就全下吧！',
    '嫌钱多么，敢跟我？',
    '看牌是小狗！',
    '运气好，想输都难！',
    '有种闷到底！',
    '这么小都敢跟，你也是蛮拼的！',
    ],
};


var New_DSZ_Audio = [
    {//女
        AUDIO_CALL:['yqp3_Woman_genpai01', 'yqp3_Woman_genpai02', 'yqp3_Woman_genpai03'],
        AUDIO_ADD:['yqp3_Woman_jiazhu01','yqp3_Woman_jiazhu02'],
        AUDIO_WATCH:['yqp3_Woman_kanpai01', 'yqp3_Woman_kanpai02'],
        AUDIO_CMP:['yqp3_Woman_bipai01','yqp3_Woman_bipai02'],
        AUDIO_FOLD:['yqp3_Woman_qipai01', 'yqp3_Woman_qipai02'],
        CHAT:['woman_chat1',
            'woman_chat2',
            'woman_chat3',
            'woman_chat4',
            'woman_chat5',
            'woman_chat6',
            'woman_chat7',
            'woman_chat8',
            'woman_chat9',
            'woman_chat10',
            'woman_chat11',
            ],
    },
    {   //男
        AUDIO_CALL:['yqp3_Man_genpai01','yqp3_Man_genpai02','yqp3_Man_genpai03'],
        AUDIO_ADD:['yqp3_Man_jiazhu01', 'yqp3_Man_jiazhu02'],
        AUDIO_WATCH:['yqp3_Man_kanpai01','yqp3_Man_kanpai02'],
        AUDIO_CMP:['yqp3_Man_bipai01', 'yqp3_Man_bipai02'],
        AUDIO_FOLD:['yqp3_Man_qipai01', 'yqp3_Man_qipai02'],

        CHAT:['man_chat1',
        'man_chat2',
        'man_chat3',
        'man_chat4',
        'man_chat5',
        'man_chat6',
        'man_chat7',
        'man_chat8',
        'man_chat9',
        'man_chat10',
        'man_chat11',
        ],
    },

];

var New_DSZ_Chat_Config = {
    Woman:['快点吧，我等到花都谢了',
    '这局我赢定了！',
    '你太牛啦～',
    '哈哈，手气真好～',
    '快点出牌啊！',
    '今天真高兴！',
    '你家里是开银行的吗？',
    '不好意思，我有事要先走一步了。',
    '你的牌打的也太好了！',
    '大家好，很高兴见到各位！',
    '怎么又断线了，网络怎么这么差啊！',
    ],
    Man:['快点，别墨迹撒！',
    '哥这把庄稳如泰山！',
    '你太牛啦～',
    '哈哈，手气真好～',
    '快点出牌啊！',
    '今天真高兴！',
    '你家里是开银行的吗？',
    '不好意思，我有事要先走一步了。',
    '你的牌打的也太好了！',
    '大家好，很高兴见到各位！',
    '怎么又断线了，网络怎么这么差啊！',
    ],
};

var speakText = {
    QP:'弃牌',
    JZ:'加注',
    GZ:'跟注',
    HP:'火拼',
    GZYZ:'孤注一掷',
    BP:'比牌',
    KP:'看牌',
};

module.exports = {
    DSZ_UserState : DSZ_UserState,
    DSZ_PokerType : DSZ_PokerType,
    DSZ_Audio: DSZ_Audio,
    speakText: speakText,
    DSZ_Chat_Config : DSZ_Chat_Config,
    New_DSZ_Audio: New_DSZ_Audio,
    New_DSZ_Chat_Config : New_DSZ_Chat_Config,
}