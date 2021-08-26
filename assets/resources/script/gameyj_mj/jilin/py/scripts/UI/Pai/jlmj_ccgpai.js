var dd = cc.dd;
var pai3d_value = require("jlmj_pai3d_value");

var jlmj_CCGPai = cc.Class({
    extends: require('jlmj_pai'),

    statics: {
        /**
         * 构造工厂
         * @returns {Component|*|cc.Component}
         */
        create: function (ccgpai_prefab) {
            var pai = cc.resources.get(ccgpai_prefab, cc.Prefab);
            var pai_node = cc.instantiate(pai);
            var jlmj_ccgpai = pai_node.getComponent("jlmj_ccgpai");
            if(!jlmj_ccgpai){
                cc.error("麻将牌没有jlmj_ccgpai组件");
            }
            return jlmj_ccgpai;
        },
    },

    properties: {
        cnt: { default:null, type:cc.Sprite, tooltip: '次数', },

        spf_cnt: [cc.SpriteFrame],
    },

    ctor: function () {

    },

    setCnt: function (cnt) {
        if(cnt>1){
            this.cnt.node.active = true;
            this.cnt.spriteFrame = this.spf_cnt[cnt-2];
            this.cnt_num = cnt;
        }else{
            this.cnt.node.active = false;
            this.cnt_num = 1;
        }
    },
});

module.exports = jlmj_CCGPai;
