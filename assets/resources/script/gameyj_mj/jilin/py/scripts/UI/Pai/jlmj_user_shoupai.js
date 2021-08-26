var dd = cc.dd;
var pai3d_value = require("jlmj_pai3d_value");

var jlmj_UserShouPai = cc.Class({
    extends: require('jlmj_pai'),

    statics: {
        // /**
        //  * 构造工厂
        //  * @returns {Component|*|cc.Component}
        //  */
        // create: function () {
        //     var pai = cc.loader.getRes(ccgpai_prefab,cc.Prefab);
        //     var pai_node = cc.instantiate(pai);
        //     var jlmj_ccgpai = pai_node.getComponent("jlmj_ccgpai");
        //     if(!jlmj_ccgpai){
        //         cc.error("麻将牌没有jlmj_ccgpai组件");
        //     }
        //     return jlmj_ccgpai;
        // },
    },

    properties: {
        jiao_jiantou: { default: null, type: cc.Node, tooltip: "叫牌箭头", },
    },

    zhanli: function (fCfg,vCfg,lCfg,hCfg,tCfg) {
        this.value.node.active = true;
        this.setFrameCfg(fCfg);
        this.setValueCfg(vCfg);
        if(lCfg){
            this.setLiangZhangCfg(lCfg);
        }
        if(hCfg){
            this.setHunPaiCfg(hCfg);
        }
        if(tCfg){
            this.setTuidaoCfg(tCfg);
        }
    },
    /**
     * 传入配置文件 以及位置
     * @param pai3dCfg
     * @param idx
     */
    zhanli_new :function (pai3dCfg, idx) {
        this.zhanli(pai3dCfg.shoupai_zhanli_cfg['frame_'+idx], pai3dCfg.shoupai_zhanli_cfg['value_'+idx]);
        this.value.node.active = true;
    }

});

module.exports = jlmj_UserShouPai;
