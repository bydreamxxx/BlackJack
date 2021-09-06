/**
 * Created by wang on 2017/7/21.
 */


/**
 * 男生快捷短语数据
 * @type {[*]}
 */
var BoyQuickMsgCfg = [
    { id: '1001', text: '你这啥网啊，太次了！', audio: 'voice_talk_0', duration: '2.0' },
    { id: '1002', text: '唉......这两天手气老背了！', audio: 'voice_talk_1', duration: '2.0' },
    { id: '1003', text: '哎呀我去！又打错了！', audio: 'voice_talk_2', duration: '2.0' },
    { id: '1004', text: '你打牌那么慢，一趟新手村都回来了！', audio: 'voice_talk_3', duration: '2.0' },
    { id: '1005', text: '打牌要老实知道不？', audio: 'voice_talk_4', duration: '2.0' },
    { id: '1006', text: '盯住盯住啊，别窜张！', audio: 'voice_talk_5', duration: '2.0' },
    { id: '1007', text: '都别点啊 ，我自己搂！', audio: 'voice_talk_6', duration: '2.0' },
    { id: '1008', text: '跟谁俩呢，又是你胡！', audio: 'voice_talk_7', duration: '2.0' },
    { id: '1009', text: '你哪个部队里出来的，这炮让你点的！', audio: 'voice_talk_8', duration: '2.0' },
    { id: '1010', text: '杀楞的，打牌要快！', audio: 'voice_talk_9', duration: '2.0' },
    { id: '1011', text: '先胖不算胖，后胖压倒炕！', audio: 'voice_talk_10', duration: '2.0' },
    { id: '1012', text: '这牌开门就是胜利啊！', audio: 'voice_talk_11', duration: '2.0' },
];

/**
 * 女生快捷短语数据
 * @type {[*]}
 */
var GirlQuickMsgCfg = [
    { id: '2001', text: '你这啥网啊，太次了！', audio: 'voice_talk_12', duration: '2.0' },
    { id: '2002', text: '唉......这两天手气老背了！', audio: 'voice_talk_13', duration: '2.0' },
    { id: '2003', text: '哎呀我去！又打错了！', audio: 'voice_talk_14', duration: '2.0' },
    { id: '2004', text: '你打牌那么慢，一趟新手村都回来了！', audio: 'voice_talk_15', duration: '2.0' },
    { id: '2005', text: '打牌要老实知道不？', audio: 'voice_talk_16', duration: '2.0' },
    { id: '2006', text: '盯住盯住啊，别窜张！', audio: 'voice_talk_17', duration: '2.0' },
    { id: '2007', text: '都别点啊 ，我自己搂！', audio: 'voice_talk_18', duration: '2.0' },
    { id: '2008', text: '跟谁俩呢，又是你胡！', audio: 'voice_talk_19', duration: '2.0' },
    { id: '2009', text: '你哪个部队里出来的，这炮让你点的！', audio: 'voice_talk_20', duration: '2.0' },
    { id: '2010', text: '杀楞的，打牌要快！', audio: 'voice_talk_21', duration: '2.0' },
    { id: '2011', text: '先胖不算胖，后胖压倒炕！', audio: 'voice_talk_22', duration: '2.0' },
    { id: '2012', text: '这牌开门就是胜利啊！', audio: 'voice_talk_23', duration: '2.0' },
];

/**
 * 短语文件路径
 */
const quickMusicPath = 'blackjack_common/res/audio/chat/';

/**
 * 查找短语配置
 * @param id
 * @returns {*}
 * @constructor
 */
var GetQuickMsgCfgByID = function (id) {
    var result = null;
    BoyQuickMsgCfg.forEach(function (cfg) {
        if (Number(cfg.id) == Number(id)) {
            result = cfg;
        }
    });
    GirlQuickMsgCfg.forEach(function (cfg) {
        if (Number(cfg.id) == Number(id)) {
            result = cfg;
        }
    });
    return result;
};

/**
 * 道具数据
 * @type {[*]}
 */
var PropCfg = [
    { id: '3006', pic: 'zd_', count: 6, detail: '炸弹', icon: 'zadan', atlas: 'zadan', audio: 'zhadan' },
    { id: '3007', pic: 'ji', count: 12, detail: '鸡', icon: 'ji', atlas: 'ji', audio: 'xiaoji' },
    { id: '3003', pic: 'hua', count: 20, detail: '花', icon: 'hua', atlas: 'hua', audio: 'flowers' },
    { id: '3002', pic: 'other_emotion_kiss_', count: 9, detail: '飞吻', icon: 'feiwen', atlas: 'feiwen', audio: 'kiss' },
    { id: '3004', pic: 'jidan', count: 11, detail: '鸡蛋', icon: 'jidan', atlas: 'jidan', audio: 'jidan' },
    { id: '3005', pic: 'jiubei', count: 12, detail: '酒杯', icon: 'jiubei', atlas: 'jiu', audio: 'jiubei' },
    { id: '3001', pic: 'xihongshi', count: 13, detail: '番茄', icon: 'fanqie', atlas: 'fanqie', audio: 'tomato' },
];

/**
 * 聊天表情数据
 * @type {[*]}
 */
var EmoticonCfg = [
    { id: '2001', pic: 'bq_6', count: 2, detail: '鄙视' },
    { id: '2002', pic: 'bq_20', count: 6, detail: '打脸' },
    { id: '2003', pic: 'bq_9', count: 2, detail: '大笑' },
    { id: '2004', pic: 'bq_21', count: 8, detail: '发怒' },
    { id: '2005', pic: 'bq_4', count: 2, detail: '坏笑' },
    { id: '2006', pic: 'bq_8', count: 10, detail: '困' },
    { id: '2007', pic: 'bq_7', count: 4, detail: '流汗' },
    { id: '2008', pic: 'bq_17', count: 6, detail: '流泪' },
    { id: '2009', pic: 'bq_14', count: 1, detail: '玫瑰' },
    { id: '2010', pic: 'bq_16', count: 1, detail: 'ok' },
    { id: '2011', pic: 'bq_11', count: 2, detail: '亲亲' },
    { id: '2012', pic: 'bq_10', count: 2, detail: '色' },
    { id: '2013', pic: 'bq_15', count: 2, detail: '胜利' },
    { id: '2014', pic: 'bq_12', count: 3, detail: '睡觉' },
    { id: '2015', pic: 'bq_18', count: 6, detail: '挖鼻子' },
    { id: '2016', pic: 'bq_3', count: 4, detail: '委屈' },
    { id: '2017', pic: 'bq_1', count: 4, detail: '微笑' },
    { id: '2018', pic: 'bq_2', count: 5, detail: '疑问' },
    { id: '2019', pic: 'bq_19', count: 3, detail: '便便' },
    { id: '2020', pic: 'bq_5', count: 6, detail: '阴险的笑' },
    { id: '2021', pic: 'bq_13', count: 4, detail: '晕' },
];

var PropAudioCfg = [
    'blackjack_common/res/audio/prop/flowers',
    'blackjack_common/res/audio/prop/kiss',
    'blackjack_common/res/audio/prop/jidan',
    'blackjack_common/res/audio/prop/zhadan',
    'blackjack_common/res/audio/prop/tomato',
    'blackjack_common/res/audio/prop/jiubei',
    'blackjack_common/res/audio/prop/xiaoji',
];

module.exports = {
    BoyQuickMsgCfg: BoyQuickMsgCfg,
    GirlQuickMsgCfg: GirlQuickMsgCfg,
    QuickMusicPath: quickMusicPath,
    GetQuickMsgCfgByID: GetQuickMsgCfgByID,
    PropCfg: PropCfg,
    EmoticonCfg: EmoticonCfg,
    PropAudioCfg: PropAudioCfg,
};