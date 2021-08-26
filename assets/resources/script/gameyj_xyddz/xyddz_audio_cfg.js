const manPrefix = 'gameyj_xyddz/audio/man/';
const womanPrefix = 'gameyj_xyddz/audio/female/';
const effectPrefix = 'gameyj_xyddz/audio/sound/';
module.exports = {
    GAME_MUSIC: effectPrefix + 'bg_music',

    //特效
    EFFECT: {
        DEAL_CARD: effectPrefix + 'xipai',
        TIMER: effectPrefix + 'effect_warning',
        FEIJI: effectPrefix + 'anim_feiji',
        CHOUPAI: effectPrefix + 'click_cards',
        CHUPAI: effectPrefix + 'OUT_CARD',
        CHUPAIDA: effectPrefix + 'OUT_CARD',
        SHUNZI: effectPrefix + 'anim_shunzi',
        TONGTIANSHUN: effectPrefix + 'anim_shunzi',
        START: effectPrefix + 'pk_loading',
        SPRING: effectPrefix + 'chuntian',
        ROCKET: effectPrefix + 'anim_huojian',
        BOMB: effectPrefix + 'anim_zhadan',
        WIN: effectPrefix + 'win',
        LOSE: effectPrefix + 'lost',
    },

    MAN: {
        //叫分
        JIAOFEN: {
            [0]: manPrefix + 'not_call',
            [1]: manPrefix + 'point_1',
            [2]: manPrefix + 'point_2',
            [3]: manPrefix + 'point_3',
        },
        //加倍
        JIABEI: {
            [0]: manPrefix + 'bujiabei1',
            [1]: manPrefix + 'jiabei',
        },
        //单张
        DAN: {
            [3]: manPrefix + 'cards/3',
            [4]: manPrefix + 'cards/4',
            [5]: manPrefix + 'cards/5',
            [6]: manPrefix + 'cards/6',
            [7]: manPrefix + 'cards/7',
            [8]: manPrefix + 'cards/8',
            [9]: manPrefix + 'cards/9',
            [10]: manPrefix + 'cards/10',
            [11]: manPrefix + 'cards/11',
            [12]: manPrefix + 'cards/12',
            [13]: manPrefix + 'cards/13',
            [14]: manPrefix + 'cards/14',
            [16]: manPrefix + 'cards/15',
            [171]: manPrefix + 'cards/16',
            [172]: manPrefix + 'cards/17',
        },
        //对子
        DUI: {
            [3]: manPrefix + 'cards/pair_3',
            [4]: manPrefix + 'cards/pair_4',
            [5]: manPrefix + 'cards/pair_5',
            [6]: manPrefix + 'cards/pair_6',
            [7]: manPrefix + 'cards/pair_7',
            [8]: manPrefix + 'cards/pair_8',
            [9]: manPrefix + 'cards/pair_9',
            [10]: manPrefix + 'cards/pair_10',
            [11]: manPrefix + 'cards/pair_11',
            [12]: manPrefix + 'cards/pair_12',
            [13]: manPrefix + 'cards/pair_13',
            [14]: manPrefix + 'cards/pair_14',
            [16]: manPrefix + 'cards/pair_15',
        },
        SAN: {
            [3]: manPrefix + 'cards/three',
            [4]: manPrefix + 'cards/three',
            [5]: manPrefix + 'cards/three',
            [6]: manPrefix + 'cards/three',
            [7]: manPrefix + 'cards/three',
            [8]: manPrefix + 'cards/three',
            [9]: manPrefix + 'cards/three',
            [10]: manPrefix + 'cards/three',
            [11]: manPrefix + 'cards/three',
            [12]: manPrefix + 'cards/three',
            [13]: manPrefix + 'cards/three',
            [14]: manPrefix + 'cards/three',
            [16]: manPrefix + 'cards/three',
        },
        KILL: {
            [0]: manPrefix + 'dani1',
            [1]: manPrefix + 'dani2',
            [2]: manPrefix + 'dani3',
            [3]: manPrefix + 'dani4'
        },
        PASS: {
            [0]: manPrefix + 'pass1',
            [1]: manPrefix + 'pass2',
            [2]: manPrefix + 'pass3',
            [3]: manPrefix + 'pass4',
        },
        //三带一
        THREE_YI: manPrefix + 'cardtype/three_with_one',
        //三带对
        THREE_DUI: manPrefix + 'cardtype/three_with_one_pair',
        //四带二
        FOUR_ER: manPrefix + 'cardtype/four_with_two',
        //四带对
        FOUR_DUI: manPrefix + 'cardtype/four_with_two_pair',
        //顺子
        SHUNZI: manPrefix + 'cardtype/shunzi',
        //连对
        LIANDUI: manPrefix + 'cardtype/continuous_pair',
        //炸弹
        BOMB: manPrefix + 'cardtype/bomb',
        ROCKET: manPrefix + 'cardtype/rocket',
        //飞机
        AIRPLANE: manPrefix + 'cardtype/airplane',
        //警告
        REMAIN: {
            [1]: manPrefix + 'I_got_left_one_cards',
            [2]: manPrefix + 'I_got_left_two_cards',
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
            [0]: womanPrefix + 'not_call',
            [1]: womanPrefix + 'point_1',
            [2]: womanPrefix + 'point_2',
            [3]: womanPrefix + 'point_3',
        },
        //加倍
        JIABEI: {
            [0]: womanPrefix + 'bujiabei1',
            [1]: womanPrefix + 'jiabei',
        },
        //单张
        DAN: {
            [3]: womanPrefix + 'cards/3',
            [4]: womanPrefix + 'cards/4',
            [5]: womanPrefix + 'cards/5',
            [6]: womanPrefix + 'cards/6',
            [7]: womanPrefix + 'cards/7',
            [8]: womanPrefix + 'cards/8',
            [9]: womanPrefix + 'cards/9',
            [10]: womanPrefix + 'cards/10',
            [11]: womanPrefix + 'cards/11',
            [12]: womanPrefix + 'cards/12',
            [13]: womanPrefix + 'cards/13',
            [14]: womanPrefix + 'cards/14',
            [16]: womanPrefix + 'cards/15',
            [171]: womanPrefix + 'cards/16',
            [172]: womanPrefix + 'cards/17',
        },
        //对子
        DUI: {
            [3]: womanPrefix + 'cards/pair_3',
            [4]: womanPrefix + 'cards/pair_4',
            [5]: womanPrefix + 'cards/pair_5',
            [6]: womanPrefix + 'cards/pair_6',
            [7]: womanPrefix + 'cards/pair_7',
            [8]: womanPrefix + 'cards/pair_8',
            [9]: womanPrefix + 'cards/pair_9',
            [10]: womanPrefix + 'cards/pair_10',
            [11]: womanPrefix + 'cards/pair_11',
            [12]: womanPrefix + 'cards/pair_12',
            [13]: womanPrefix + 'cards/pair_13',
            [14]: womanPrefix + 'cards/pair_14',
            [16]: womanPrefix + 'cards/pair_15',
        },
        SAN: {
            [3]: womanPrefix + 'cards/three',
            [4]: womanPrefix + 'cards/three',
            [5]: womanPrefix + 'cards/three',
            [6]: womanPrefix + 'cards/three',
            [7]: womanPrefix + 'cards/three',
            [8]: womanPrefix + 'cards/three',
            [9]: womanPrefix + 'cards/three',
            [10]: womanPrefix + 'cards/three',
            [11]: womanPrefix + 'cards/three',
            [12]: womanPrefix + 'cards/three',
            [13]: womanPrefix + 'cards/three',
            [14]: womanPrefix + 'cards/three',
            [16]: womanPrefix + 'cards/three',
        },
        KILL: {
            [0]: womanPrefix + 'dani1',
            [1]: womanPrefix + 'dani2',
            [2]: womanPrefix + 'dani3',
            [3]: womanPrefix + 'dani4'
        },
        PASS: {
            [0]: womanPrefix + 'pass1',
            [1]: womanPrefix + 'pass2',
            [2]: womanPrefix + 'pass3',
            [3]: womanPrefix + 'pass4',
        },
        //三带一
        THREE_YI: womanPrefix + 'cardtype/three_with_one',
        //三带对
        THREE_DUI: womanPrefix + 'cardtype/three_with_one_pair',
        //四带二
        FOUR_ER: womanPrefix + 'cardtype/four_with_two',
        //四带对
        FOUR_DUI: womanPrefix + 'cardtype/four_with_two_pair',
        //顺子
        SHUNZI: womanPrefix + 'cardtype/shunzi',
        //连对
        LIANDUI: womanPrefix + 'cardtype/continuous_pair',
        //炸弹
        BOMB: womanPrefix + 'cardtype/bomb',
        ROCKET: womanPrefix + 'cardtype/rocket',
        //飞机
        AIRPLANE: womanPrefix + 'cardtype/airplane',
        //警告
        REMAIN: {
            [1]: womanPrefix + 'I_got_left_one_cards',
            [2]: womanPrefix + 'I_got_left_two_cards',
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