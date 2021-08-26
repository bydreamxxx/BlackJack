const Prefix = 'gameyj_ddz/common/audio/';
const manPrefix = 'gameyj_ddz/common/audio/man/';
const womanPrefix = 'gameyj_ddz/common/audio/woman/';
const effectPrefix = 'gameyj_ddz/common/audio/effect/';
module.exports = {
    GAME_MUSIC: Prefix + 'Music_Game',
    SEND_CARD: Prefix + 'Send_CARD',

    //特效
    EFFECT: {
        DEAL_CARD: effectPrefix + 'lord_deal_card',
        DEAL_CARD_TURN: effectPrefix + 'lord_deal_card_turn',
        TIMER: effectPrefix + 'lord_s_time',
        FEIJI: effectPrefix + 'feiji',
        CHOUPAI: effectPrefix + 'choupai',
        CHUPAI: effectPrefix + 'chupai',
        CHUPAIDA: effectPrefix + 'chupaida',
        SHUNZI: effectPrefix + 'shunzi',
        TONGTIANSHUN: effectPrefix + 'lord_v_top_straight',
        START: effectPrefix + 'pk_loading',
        SPRING: effectPrefix + 'lord_s_spring_win',
        TOPCARD: effectPrefix + 'lord_s_dingpai',
    },

    MAN: {
        //叫分
        JIAOFEN: {
            [0]: manPrefix + 'BJDZ',
            [1]: manPrefix + '1fen',
            [2]: manPrefix + '2fen',
            [3]: manPrefix + '3fen',
        },
        //加倍
        JIABEI: {
            [0]: manPrefix + 'BJB',
            [1]: manPrefix + 'JB',
        },
        //单张
        DAN: {
            [3]: manPrefix + 'S_3',
            [4]: manPrefix + 'S_4',
            [5]: manPrefix + 'S_5',
            [6]: manPrefix + 'S_6',
            [7]: manPrefix + 'S_7',
            [8]: manPrefix + 'S_8',
            [9]: manPrefix + 'S_9',
            [10]: manPrefix + 'S_10',
            [11]: manPrefix + 'S_11',
            [12]: manPrefix + 'S_12',
            [13]: manPrefix + 'S_13',
            [14]: manPrefix + 'S_1',
            [16]: manPrefix + 'S_2',
            [171]: manPrefix + 'S_14',
            [172]: manPrefix + 'S_15',
        },
        //对子
        DUI: {
            [3]: manPrefix + 'D_3',
            [4]: manPrefix + 'D_4',
            [5]: manPrefix + 'D_5',
            [6]: manPrefix + 'D_6',
            [7]: manPrefix + 'D_7',
            [8]: manPrefix + 'D_8',
            [9]: manPrefix + 'D_9',
            [10]: manPrefix + 'D_10',
            [11]: manPrefix + 'D_11',
            [12]: manPrefix + 'D_12',
            [13]: manPrefix + 'D_13',
            [14]: manPrefix + 'D_1',
            [16]: manPrefix + 'D_2',
        },
        SAN: {
            [3]: manPrefix + 'T_3',
            [4]: manPrefix + 'T_4',
            [5]: manPrefix + 'T_5',
            [6]: manPrefix + 'T_6',
            [7]: manPrefix + 'T_7',
            [8]: manPrefix + 'T_8',
            [9]: manPrefix + 'T_9',
            [10]: manPrefix + 'T_10',
            [11]: manPrefix + 'T_11',
            [12]: manPrefix + 'T_12',
            [13]: manPrefix + 'T_13',
            [14]: manPrefix + 'T_1',
            [16]: manPrefix + 'T_2',
        },
        KILL: {
            [0]: manPrefix + 'KILL0',
            [1]: manPrefix + 'KILL1',
            [2]: manPrefix + 'KILL2',
        },
        PASS: {
            [0]: manPrefix + 'PASS0',
            [1]: manPrefix + 'PASS1',
            [2]: manPrefix + 'PASS2',
            [3]: manPrefix + 'PASS3',
        },
        //三带一
        THREE_YI: manPrefix + 'TT_1',
        //三带对
        THREE_DUI: manPrefix + 'TT_2',
        //四带二
        FOUR_ER: manPrefix + 'F_T1',
        //四带对
        FOUR_DUI: manPrefix + 'F_T2',
        //顺子
        SHUNZI: manPrefix + 'SL',
        //连对
        LIANDUI: manPrefix + 'DL',
        //炸弹
        BOMB: manPrefix + 'BOMB',
        ROCKET: manPrefix + 'MISSLE',
        //飞机
        AIRPLANE: manPrefix + 'P',
        //警告
        REMAIN: {
            [1]: manPrefix + 'BAOJING_1',
            [2]: manPrefix + 'BAOJING_2',
        },
        CHAT: {
            [0]: manPrefix + 'chat_0',
            [1]: manPrefix + 'chat_1',
            [2]: manPrefix + 'chat_2',
            [3]: manPrefix + 'chat_3',
            [4]: manPrefix + 'chat_4',
            [5]: manPrefix + 'chat_5',
            [6]: manPrefix + 'chat_6',
            [7]: manPrefix + 'chat_7',
            [8]: manPrefix + 'chat_8',
            [9]: manPrefix + 'chat_9',
        },
    },
    WOMAN: {
        //叫分
        JIAOFEN: {
            [0]: womanPrefix + 'BJDZ',
            [1]: womanPrefix + '1fen',
            [2]: womanPrefix + '2fen',
            [3]: womanPrefix + '3fen',
        },
        //加倍
        JIABEI: {
            [0]: womanPrefix + 'BJB',
            [1]: womanPrefix + 'JB',
        },
        //单张
        DAN: {
            [3]: womanPrefix + 'S_3',
            [4]: womanPrefix + 'S_4',
            [5]: womanPrefix + 'S_5',
            [6]: womanPrefix + 'S_6',
            [7]: womanPrefix + 'S_7',
            [8]: womanPrefix + 'S_8',
            [9]: womanPrefix + 'S_9',
            [10]: womanPrefix + 'S_10',
            [11]: womanPrefix + 'S_11',
            [12]: womanPrefix + 'S_12',
            [13]: womanPrefix + 'S_13',
            [14]: womanPrefix + 'S_1',
            [16]: womanPrefix + 'S_2',
            [171]: womanPrefix + 'S_14',
            [172]: womanPrefix + 'S_15',
        },
        //对子
        DUI: {
            [3]: womanPrefix + 'D_3',
            [4]: womanPrefix + 'D_4',
            [5]: womanPrefix + 'D_5',
            [6]: womanPrefix + 'D_6',
            [7]: womanPrefix + 'D_7',
            [8]: womanPrefix + 'D_8',
            [9]: womanPrefix + 'D_9',
            [10]: womanPrefix + 'D_10',
            [11]: womanPrefix + 'D_11',
            [12]: womanPrefix + 'D_12',
            [13]: womanPrefix + 'D_13',
            [14]: womanPrefix + 'D_1',
            [16]: womanPrefix + 'D_2',
        },
        SAN: {
            [3]: womanPrefix + 'T_3',
            [4]: womanPrefix + 'T_4',
            [5]: womanPrefix + 'T_5',
            [6]: womanPrefix + 'T_6',
            [7]: womanPrefix + 'T_7',
            [8]: womanPrefix + 'T_8',
            [9]: womanPrefix + 'T_9',
            [10]: womanPrefix + 'T_10',
            [11]: womanPrefix + 'T_11',
            [12]: womanPrefix + 'T_12',
            [13]: womanPrefix + 'T_13',
            [14]: womanPrefix + 'T_1',
            [16]: womanPrefix + 'T_2',
        },
        KILL: {
            [0]: womanPrefix + 'KILL0',
            [1]: womanPrefix + 'KILL1',
            [2]: womanPrefix + 'KILL2',
        },
        PASS: {
            [0]: womanPrefix + 'PASS0',
            [1]: womanPrefix + 'PASS1',
            [2]: womanPrefix + 'PASS2',
            [3]: womanPrefix + 'PASS3',
        },
        //三带一
        THREE_YI: womanPrefix + 'TT_1',
        //三带对
        THREE_DUI: womanPrefix + 'TT_2',
        //四带二
        FOUR_ER: womanPrefix + 'F_T1',
        //四带对
        FOUR_DUI: womanPrefix + 'F_T2',
        //顺子
        SHUNZI: womanPrefix + 'SL',
        //连对
        LIANDUI: womanPrefix + 'DL',
        //炸弹
        BOMB: womanPrefix + 'BOMB',
        ROCKET: womanPrefix + 'MISSLE',
        //飞机
        AIRPLANE: womanPrefix + 'P',
        //警告
        REMAIN: {
            [1]: womanPrefix + 'BAOJING_1',
            [2]: womanPrefix + 'BAOJING_2',
        },
        CHAT: {
            [0]: womanPrefix + 'chat_0',
            [1]: womanPrefix + 'chat_1',
            [2]: womanPrefix + 'chat_2',
            [3]: womanPrefix + 'chat_3',
            [4]: womanPrefix + 'chat_4',
            [5]: womanPrefix + 'chat_5',
            [6]: womanPrefix + 'chat_6',
            [7]: womanPrefix + 'chat_7',
            [8]: womanPrefix + 'chat_8',
            [9]: womanPrefix + 'chat_9',
        },
    },
};