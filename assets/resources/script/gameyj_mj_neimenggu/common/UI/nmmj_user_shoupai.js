cc.Class({
    extends: require('nmmj_pai'),

    properties: {
        jiao_jiantou: { default: null, type: cc.Node, tooltip: "叫牌箭头", },
    },

    zhanli: function (fCfg,vCfg,lCfg,hCfg) {
        this.value.node.active = true;
        this.setFrameCfg(fCfg);
        this.setValueCfg(vCfg);
        if(lCfg){
            this.setLiangZhangCfg(lCfg);
        }
        if(hCfg){
            this.setHunPaiCfg(hCfg);
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
