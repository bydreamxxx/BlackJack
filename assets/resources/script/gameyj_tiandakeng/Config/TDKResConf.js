/**
 * Created by zhanghuaxiong on 2017/5/15.
 */

var dd = cc.dd;

const common_path = "gameyj_tiandakeng/";

const TDK = {
    ATLASS: {
        URL: common_path + "Atlas/",
    },
    PREFAB: {
        URL: common_path + "Prefab/",
    },
    TEXTURE: {
        URL: common_path + "Texture/",
    },
    FONT: {
        URL: common_path + "Font/",
    },
    AUDIO: {
        URL: "gameyj_tiandakeng/Audio/",
    },
    AUDIO_COMMON: {
        URL: "gameyj_tiandakeng/Audio/",
    },
    CONFIG: {
        URL: common_path + "Config/",
    }
};

TDK.getResUrl = function (url, name) {
    for (const key in name) {
        name[key] = url + name[key];
    }
    return name;
};

TDK.ATLASS = TDK.getResUrl(TDK.ATLASS.URL, {
    ATS_CHIPS: "chips",
    ATS_POKER: "ddz_poker",
    ATS_SETTING: "setting",
});

TDK.CONFIG = TDK.getResUrl(TDK.CONFIG.URL, {
    CFG_AUDIO: "audioCfg.csv",
});

TDK.PREFAB = TDK.getResUrl(TDK.PREFAB.URL, {
    //PRE_DESK : "desk",
    //PRE_PLAYERS : "players",
    //PRE_PLAYER : "player",
    PRE_POKER: "Poker",
    //PRE_HALL_BG : "hall_bg",
    //PRE_HALL_SPL : "spl",
    //PRE_HALL_RULE : "rule",
    //PRE_HALL_ROOMNUM : "roomNum",
    PRE_SHIELD: "shield",
    PRE_COUNTDOWN: "operatepb",
    PRE_COUNTDOWN_V2: "operatepb_v2",
    PRE_ROOM_MENU: "roomMenu",
    PRE_DISSOLVE_ROOM: "dissolveroom",
    PRE_DISSOLVE_RESULT: "dissolveresult",
    PRE_DISSOLVE_TABLE: "dissolvetable",
    PRE_EXIT_CHOICE: "exitchoice",
    PRE_INTEGRAL: "integral",
    PRE_ZHANJI: "zhanji_panel",
    PRE_INTEGRAL_V2: "integral_v2",
    //PRE_ZHANJI_V2 : "zhanji_panel",
    PRE_AUDIO_SET: "common/audioSet",
    PRE_XIAZHU: "xiazhu",
    PRE_GAME_MENU: "gameMenu",
    PRE_GAME_COIN_MENU: "gameCoinMenu",
    //PRE_FRIEND_NODE : "FriendNode",
    //PRE_CROWN : 'crown',
    //PRE_JOIN_HOME : 'JoinHome',
    PRE_CREATE_HOME: 'CreateHome',
    PRE_CHIP: 'chip',
    //PRE_SEAT_ARR :  'seatArr',
    PRE_PLAYER_V2: 'player_v2',
    PRE_PLAYER_V3: 'player_v3',
    //PRE_ROOM : 'tdk_room',
    //PRE_COIN_ROOM : 'tdk_coin_room',
    PRE_PROMPT_BOX: 'common/promptBox',
    PRE_SEAT_ARR_3: 'seatArr_3',
    PRE_SEAT_ARR_4: 'seatArr_4',
    PRE_SEAT_ARR_5: 'seatArr_5',
    PRE_DISSOLVE_CONFIRM: 'tdk_dissolve_confirm',
    PRE_MESSAGE_BOX: 'tdk_message_box',
    PRE_CHAT_LABEL: 'TdkChatLabel',
    PRE_GAME_BEGIN: 'gameBegin',
    PRE_YING: 'ying',
    PRE_GAME_RESULTACTION: 'resultAction',
    PRE_CHAT: 'tdk_chat',
    PRE_USER_INFO: 'tdk_user_info',
});

TDK.TEXTURE = TDK.getResUrl(TDK.TEXTURE.URL, {
    TEX_CROWN: "crown",
});

TDK.FONT = TDK.getResUrl(TDK.FONT.URL, {
    FONT_TOTAL_WIN: 'ziti/anniuziti1',
    FONT_TOTAL_FAILED: 'ziti/anniuziti2',
    FONT_ROUND_WIN: 'ziti/anniuziti4',
    FONT_ROUND_FAILED: 'ziti/anniuziti3',
    FONT_WIN: 'winFont',
    FONT_FAILED: 'failFont',
});

TDK.getAudioResUrl = function (url, arr) {
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        for (const key in item) {
            var kvalue = item[key];
            for (var j = 0; j < kvalue.length; j++) {
                var jvalue = kvalue[j];
                kvalue[j] = url + jvalue;
                // cc.log('tdk.getAudioResUrl:value=', kvalue[j]);
            }
        }
    }
    // cc.log('tdk.getAudioResUrl:arr=', arr);
    return arr;
};

TDK.getCommonAudioResUrl = function (url, name) {
    for (const key in name) {
        name[key] = url + name[key];
        // cc.log('tdk.getCommonAudioResUrl:value=', name[key]);
    }
    return name;
};

TDK.AUDIO = TDK.getAudioResUrl(TDK.AUDIO.URL, [
    {
        AUDIO_BT: ['0_bt1', '0_bt2', '0_bt3'],
        AUDIO_FT: ['0_ft1', '0_ft2'],
        AUDIO_GEN: ['0_gen1', '0_gen2', '0_gen3'],
        AUDIO_KAI: ['0_kai1', '0_kai2'],
        AUDIO_KOU: ['0_kou1', '0_kou2', '0_kou3'],
        AUDIO_TI: ['0_ti1', '0_ti2'],
        AUDIO_XZ: ['0_xz1'],
        AUDIO_AI: ['0_allin1.ogg', '0_allin2.ogg'],
    },//男
    {
        AUDIO_BT: ['1_bt1', '1_bt2', '1_bt3'],
        AUDIO_FT: ['1_ft1', '1_ft2'],
        AUDIO_GEN: ['1_gen1', '1_gen2', '1_gen3'],
        AUDIO_KAI: ['1_kai1', '1_kai2'],
        AUDIO_KOU: ['1_kou1', '1_kou2', '1_kou3'],
        AUDIO_TI: ['1_ti1', '1_ti2'],
        AUDIO_XZ: ['1_xz1'],
        AUDIO_AI: ['1_allin1.ogg', '1_allin2.ogg'],
    },//女
]);

TDK.AUDIO_COMMON = TDK.getCommonAudioResUrl(TDK.AUDIO_COMMON.URL, {
    AUDIO_BET: 'Bet',
    AUDIO_READY: 'Ready',
    AUDIO_BG: 'bg',
    AUDIO_CARD: 'card',
    AUDIO_CHIP_END: 'chip_end',
    AUDIO_CLOCK: 'clock',
    AUDIO_HALL_BG: 'dz_hall_background_music',
    AUDIO_LANGUO: 'languo',
    AUDIO_LGG_BG: 'lggswz_bgmusic',
    AUDIO_SEL: 'sel',
    AUDIO_START: 'start',
    AUDIO_WIN: 'win',
    AUDIO_NUM: 'btnSound-0',
    AUDIO_BTN: 'Audio_Button_Click.ogg',
    AUDIO_SENGCARD: 'sendgamecard',
    AUDIO_CHIPHE: 'Chip_he',
    AUDIO_CHIP: 'Chip',
    AUDIO_BEIJIGN: 'tdk_sound',

});

dd.tdk_resCfg = module.exports = TDK;

