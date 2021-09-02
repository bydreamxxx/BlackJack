/**
 * Created by wang on 2017/7/21.
 */


/**
 * 男生快捷短语数据
 * @type {[*]}
 */
var BoyQuickMsgCfg = [
    { id: '1001', text: '哥们，下象棋呢，敢再慢点不', audio: 'voice_resource_one', duration: '2.0' },
    { id: '1002', text: '不行了，我该往回捞本了', audio: 'voice_resource_two', duration: '2.0' },
    { id: '1003', text: '别走啊，干到明天早上', audio: 'voice_resource_three', duration: '2.0' },
    { id: '1004', text: '来呀，互相伤害啊', audio: 'voice_resource_four', duration: '2.0' },
    { id: '1005', text: '你是不是傻', audio: 'voice_resource_five', duration: '2.0' },
    { id: '1006', text: '你这样可没朋友啊', audio: 'voice_resource_six', duration: '2.0' },
    { id: '1007', text: '撒冷的要下班了，你快点呗', audio: 'voice_resource_seven', duration: '2.0' },
    { id: '1008', text: '嘘，都别吵吵，我媳妇查岗了', audio: 'voice_resource_eight', duration: '2.0' },
];

/**
 * 女生快捷短语数据
 * @type {[*]}
 */
var GirlQuickMsgCfg = [
    { id: '1009', text: '都耽误人家搞对象了', audio: 'voice_resource_nine', duration: '2.0' },
    { id: '1010', text: '哈哈，可真爽，太过瘾了', audio: 'voice_resource_ten', duration: '2.0' },
    { id: '1011', text: '等会儿，接个电话', audio: 'voice_resource_eleven', duration: '2.0' },
    { id: '1012', text: '来呀，互相伤害呀', audio: 'voice_resource_twelve', duration: '2.0' },
    { id: '1013', text: '怎么的，不带我了，还不让我摸牌', audio: 'voice_resource_thirteen', duration: '2.0' },
    { id: '1014', text: '你这样以后没朋友', audio: 'voice_resource_fourteen', duration: '2.0' },
    { id: '1015', text: '快点吧，牌在你手上都下崽了', audio: 'voice_resource_fifteen', duration: '2.0' },
    { id: '1016', text: '朋友，你快点的呗', audio: 'voice_resource_sixteen', duration: '2.0' },
];

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
    GetQuickMsgCfgByID: GetQuickMsgCfgByID,
    PropCfg: PropCfg,
    EmoticonCfg: EmoticonCfg,
    PropAudioCfg: PropAudioCfg,
};