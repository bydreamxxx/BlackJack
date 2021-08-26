var pai3d_value = require("jlmj_pai3d_value");

/**
 * 胡牌信息
 * @type {Function}
 */
var JiaoPai = cc.Class({

    ctor: function (...params) {
        this.id = params[0];   //胡牌id
        this.fan = params[1]; //翻数
        this.cnt = params[2]; //剩余个数
        this.angang = params[3];//暗杠
        this.isddsj = params[4];//对倒算夹
        this.ismustddsj = params[5];
        this.hutypesList = params[6];
    },

    toString: function () {
        return "{"+"胡牌:"+pai3d_value.desc[this.id]+" 翻数:"+this.fan+" 个数:"+this.cnt+"}\n";
    },

});

/**
 * 打出某张牌对应的胡牌信息
 * @type {Function}
 */
var JiaoInfo = cc.Class({

    ctor: function (...params) {
        this.out_id = params[0];   //出牌
        this.jiao_pai_list = params[1];     //叫牌列表
        this.angang = params[2]; //是否可以暗杠听
    },

    toString: function () {
        var desc = "";
        //desc += "出牌:"+pai3d_value.desc[this.out_id]+"\n";
        desc += " 胡牌列表:\n";
        this.jiao_pai_list.forEach(function(jiaoPai,idx){
            desc += (idx+1)+":"+jiaoPai.toString();
        });
        return desc;
    },

});

module.exports = {
    JiaoPai: JiaoPai,
    JiaoInfo: JiaoInfo,
};
