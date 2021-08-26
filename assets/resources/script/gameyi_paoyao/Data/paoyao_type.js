/**
 * 刨幺枚举类
 */
if(!cc.dd.Utils)
    cc.dd.Utils = require("Utils");
//玩法枚举
var PlayEnum = cc.Enum({
    //明幺
    BRIGHT_YAO: 1,
    //暗幺
    DARK_YAO: 2,
});

//规则枚举
var RuleEnum = cc.Enum({
    //转幺
    TRUN_YAO: 1,
    //有3
    HAVE_3: 2,
    //无3
    NOHAVE_3: 3,
    //3小
    SMALL_3 : 4
});

//结算规则
var SettlementEnum = cc.Enum({
    THRESOME_WIN: 3, //双飞获胜
    JIUSHI_WIN: 2, //九十分获胜
    YIBAISHI_WIN: 1, //一百四十分获胜
});

//雪规则
var SnowEnum = cc.Enum({
    NO_SNOW: 1, //无雪
    LIGHT_SNOW: 2, //小雪
    HEAVY_SNOW: 3, //大雪
});

//音效
var SoundEnum = cc.Enum({
    SOUND_CONTROL : 18, //管上
    SOUND_RUNOVER : 19, //压死
    SOUND_CLOSE : 20, //关了
    SOUND_PASS : 21, //过
    SOUND_TURN : 22, //转
});

var m_instance = null;
var EnumData = cc.Class({

    statics: {
        /**
         * 获取实例
         */
        Instance: function () {
            if (cc.dd.Utils.isNull(m_instance)) {
                m_instance = new EnumData();
            }
            return m_instance;
        },
        Destroy: function () {
            if (this.m_instance) {
                this.m_instance.clear();
                this.m_instance = null;
            }
        },
    },

    /**
     * 玩法类型转换字符
     * @param type 玩法枚举
     */
    GetPlayEnumStr: function (type) {
        switch (type) {
            case PlayEnum.BRIGHT_YAO:
                return "明幺";
            case PlayEnum.DARK_YAO:
                return "暗幺";
            default:
                return "";
        }
    },

    /**
     * 规则类型转化字符
     * @param type 规则枚举
     */
    GetRuleEnumStr: function (type) {
        switch (type) {
            case RuleEnum.TRUN_YAO:
                return "转幺";
            case RuleEnum.HAVE_3:
                return "有3";
            case RuleEnum.NOHAVE_3:
                return "无3";
            case RuleEnum.SMALL_3:
                return "3小"
            default:
                return "";
        }
    },

    /**
     * 结算类型转化字符
     * @param type 结算枚举
     */
    GetSettlementEnumStr: function (type) {
        switch (type) {
            case SettlementEnum.THRESOME_WIN:
                return "双飞";
            case SettlementEnum.JIUSHI_WIN:
                return "头跑90分";
            case SettlementEnum.YIBAISHI_WIN:
                return "140分";
            default:
                return "";
        }
    },

    /**
     * 雪类型转化字符
     * @param type 雪类型枚举
     */
    GetSnowEnumStr : function(type)
    {
        switch(type)
        {
            case SnowEnum.NO_SNOW: 
                return "无雪";
            case SnowEnum.LIGHT_SNOW:
                return "小雪";
            case SnowEnum.HEAVY_SNOW:
                return "大雪";
            default:
                return "";
        }
    },
});

module.exports = {
    PlayEnum: PlayEnum,
    RuleEnum: RuleEnum,
    EnumData: EnumData,
    SettlementEnum: SettlementEnum,
    SnowEnum: SnowEnum,
    SoundEnum : SoundEnum,

}



