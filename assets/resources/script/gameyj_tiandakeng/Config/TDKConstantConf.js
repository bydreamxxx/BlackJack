/**
 * Created by wang on 2017/6/10.
 */

var tdk = cc.dd.tdk || {};

/**
 * 玩家头像上方气泡显示的文字
 * @type {{QP: string, XZ: string, GZ: string, QJ: string, FT: string, BT: string, AI: string, KP: string}}
 */
var speakText = {
    QP:'弃牌',
    XZ:'下注',
    GZ:'跟注',
    QJ:'起脚',
    FT:'反踢',
    BT:'不踢',
    AI:'Allin',
    KP:'开牌',
};

/**
 * 玩家语音类型索引
 * @type {{AUDIO_BT: number, AUDIO_FT: number, AUDIO_GEN: number, AUDIO_KAI: number, AUDIO_KOU: number, AUDIO_TI: number, AUDIO_XZ: number}}
 */
var audioType = {
    AUDIO_BT:'AUDIO_BT',
    AUDIO_FT:'AUDIO_FT',
    AUDIO_GEN:'AUDIO_GEN',
    AUDIO_KAI:'AUDIO_KAI',
    AUDIO_KOU:'AUDIO_KOU',
    AUDIO_TI:'AUDIO_TI',
    AUDIO_XZ:'AUDIO_XZ',
    AUDIO_AI:'AUDIO_AI',
};

/**
 * 游戏类型
 * @type {{GT_FRIEND: number, GT_COIN: number}}
 */
var gameType = {
    GT_FRIEND: 40, //朋友桌
    GT_COIN: 1,  //金币场
};

/**
 * ui界面动画名
 * @type {{GAME_MENU_IN: string, GAME_MENU_OUT: string, POPUP_IN: string, POPUP_OUT: string, PROMPT_BOX_IN: string, PROMPT_BOX_OUT: string, QI_PAO: string, ROOM_MENU_IN: string, ROOM_MENU_OUT: string}}
 */
var animationType = {
    GAME_MENU_IN : 'gameMenuIn',
    GAME_MENU_OUT : 'gameMenuOut',
    POPUP_IN : 'popupIn',
    POPUP_OUT : 'popupOut',
    PROMPT_BOX_IN : 'promptBoxIn',
    PROMPT_BOX_OUT : 'promptBoxOut',
    QI_PAO : 'qipao',
    ROOM_MENU_IN : 'roomMenuIn',
    ROOM_MENU_OUT : 'roomMenuOut',
};

/**
 * 服务器地址
 * @type {{TEST: string, TEST_OUT: string}}
 */
var serverHost = {
    TEST:'ws://192.168.2.90:3803',
    TEST_OUT:'ws://182.92.179.230:3803',
};

tdk.constant_cfg = {
    SPEAK_TEXT : speakText,
    GAME_TYPE : gameType,
    AUDIO_TYPE : audioType,
    ANIMATION_TYPE : animationType,
    SERVER_HOST:serverHost,
};

module.exports = tdk.constant_cfg;