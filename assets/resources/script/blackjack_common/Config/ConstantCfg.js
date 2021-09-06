/**
 * Created by wang on 2017/7/13.
 */

/**
 * 动画名称
 * @type {{POPUP_START: string, POPUP_END: string, PROMPT_BOX_START: string, PROMPT_BOX_END: string}}
 */
var AnimationName = {
    POPUP_START: 'PopupStart',
    POPUP_END: 'PopupEnd',
    PROMPT_BOX_START: 'PromptBoxStart',
    PROMPT_BOX_END: 'PromptBoxEnd',
    NET_WAIT: 'NetWait',
    CHAT_VIEW_SHOW: 'ChatViewShow',
    CHAT_VIEW_DISAPPEAR: 'ChatViewDisappear',
};

/**
 * csv配置文件唯一标识
 * @type {{BOY_QUICK_MSG: string, GIRL_QUICK_MSG: string, BIAO_QING: string}}
 */
var CsvFileId = {
    BOY_QUICK_MSG: 'boy_quick_msg_csv', //男生快捷短语
    GIRL_QUICK_MSG: 'girl_quick_msg_csv', //女生快捷短语
    EMOTICON: 'emoticon_csv', //表情
    PROP: 'prop_csv', //道具
};

/**
 * csv配置文件路径
 * @type {{BOY_QUICK_MSG_PATH: string, GIRL_QUICK_MSG_PATH: string, EMOTICON_PATH: string}}
 */
var CsvFilePath = {
    BOY_QUICK_MSG_PATH: 'blackjack_common/csv/BoyQuickMsg.csv', //男生短语
    GIRL_QUICK_MSG_PATH: 'blackjack_common/csv/GirlQuickMsg.csv', //女生短语
    EMOTICON_PATH: 'blackjack_common/csv/emoticon.csv', //表情
    PROP_PATH: 'blackjack_common/csv/prop.csv', //道具
};

/**
 * 玩家性别
 * @type {{BOY: number, GIRL: number}}
 */
var UserSex = {
    BOY: 1,
    GIRL: 2,
};

/**
 * 聊天消息类型
 * @type {{DUAN_YU: number, BIAO_QING: number, CUSTOM: number}}
 */
var ChatMsgType = {
    DUAN_YU: 1, //短语
    BIAO_QING: 2, //表情
    CUSTOM: 3, //自定义
    PROP: 4, //道具
};

/**
 * 图集路径
 * @type {{EMOTICON: string}}
 */
var AtlasPath = {
    EMOTICON: 'blackjack_common/atlas/emoticon',
    USER_INFO: 'blackjack_common/atlas/userInfo', //个人信息界面
    PROP_ICON: 'blackjack_common/atlas/prop_icon', //道具图标
    PROP_FANQIE: 'blackjack_common/atlas/prop_fanqie', //番茄道具
    PROP_FEIWEN: 'blackjack_common/atlas/prop_feiwen', //飞吻道具
    PROP_HUA: 'blackjack_common/atlas/prop_hua', //花道具
    PROP_JI: 'blackjack_common/atlas/prop_ji', //鸡道具
    PROP_JIDAN: 'blackjack_common/atlas/prop_jidan', //鸡蛋道具
    PROP_JIU: 'blackjack_common/atlas/prop_jiu', //酒道具
    PROP_ZHADAN: 'blackjack_common/atlas/prop_zadan', //炸弹道具
};

/**
 * 音效路径
 */
var AudioPath = {
    ONE: 'chat/voice_resource_one',
    TWO: 'chat/voice_resource_two',
    THREE: 'chat/voice_resource_three',
    FOUR: 'chat/voice_resource_four',
    FIVE: 'chat/voice_resource_five',
    SIX: 'chat/voice_resource_six',
    SEVEN: 'chat/voice_resource_seven',
    EIGHT: 'chat/voice_resource_eight',
    NINE: 'chat/voice_resource_nine',
    TEN: 'chat/voice_resource_ten',
    ELEVEN: 'chat/voice_resource_eleven',
    TWELVE: 'chat/voice_resource_twelve',
    THIRTEEN: 'chat/voice_resource_thirteen',
    FOURTEEN: 'chat/voice_resource_fourteen',
    FIFTEEN: 'chat/voice_resource_fifteen',
    SIXTEEN: 'chat/voice_resource_sixteen',
    FLOWERS: 'prop/flowers',
    JIDAN: 'prop/jidan',
    JIUBEI: 'prop/jiubei',
    KISS: 'prop/kiss',
    THROW: 'prop/throw',
    TOMATO: 'prop/tomato',
    XIAOJI: 'prop/xiaoji',
    ZHADAN: 'prop/zhadan',
};

/**
 * 预制路径
 */
var PrefabPath = {
    BIAO_QING_ITEM: 'blackjack_common/prefab/BiaoQingItem',
    CHAT_EMOTICON: 'blackjack_common/prefab/ChatEmoticon',
    CHAT_LABEL: 'blackjack_common/prefab/ChatLabel',
    CHAT_VIWE: 'blackjack_common/prefab/ChatView',
    COM_NET_WAIT: 'blackjack_common/prefab/com_net_wait',
    COM_PROMPT_BOX: 'blackjack_common/prefab/com_prompt_box',
    COM_USER_INFO: 'blackjack_common/prefab/com_user_info',
    DIALOG_BOX: 'blackjack_common/prefab/DialogBox',
    DUAN_YU_ITEM: 'blackjack_common/prefab/DuanYuItem',
    PROP_ITEM: 'blackjack_common/prefab/PropItem',
    PROP_UI: 'blackjack_common/prefab/PropUI',
    MARQUEE: 'blackjack_common/prefab/Marquee',
    RECORD: 'blackjack_common/prefab/chat/CommonRecord',
    PLAY_RECORD_RIGHT: 'blackjack_common/prefab/chat/PlayRecordRight',
    PLAY_RECORD_LEFT: 'blackjack_common/prefab/chat/PlayRecord',
    // RECORD_BUTTON:'blackjack_common/prefab/chat/RecordButton',
};

/**
 * 聊天文字框箭头指示标方位
 * @type {any}
 */
var IndicatorPos = cc.Enum({
    LEFT_BOTTOM: 1,  //左下
    LEFT_TOP: 2, //左上
    RIGHT_TOP: 3,  //右上
    RIGHT_BOTTOM: 4,   //右下
});

module.exports = {
    AnimationName: AnimationName,
    CsvFileId: CsvFileId,
    CsvFilePath: CsvFilePath,
    UserSex: UserSex,
    ChatMsgType: ChatMsgType,
    AtlasPath: AtlasPath,
    IndicatorPos: IndicatorPos,
    AudioPath: AudioPath,
    PrefabPath: PrefabPath,
};