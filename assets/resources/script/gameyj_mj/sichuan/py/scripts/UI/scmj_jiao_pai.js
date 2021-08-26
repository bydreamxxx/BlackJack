let mj_jiao_pai = require('mj_jiao_pai');
var pai3d_value = require("jlmj_pai3d_value");
var Text = cc.dd.Text;

cc.Class({
    extends: mj_jiao_pai,
    /**
     * 设置叫牌信息
     * @param jiaoPai
     */
    setJiaoPai: function (jiaoPai) {
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai || !jiaoPai || typeof(jiaoPai.fan) == "undefined" || isNaN(jiaoPai.fan)){
            return;
        }
        cc.log("叫牌 牌信息：" + jiaoPai);
        // var huType =Text.TEXT_HUPAI_5;
        var valueRes = res_pai.getComponent('mj_res_pai').majiangpai_new;
        this.pai.spriteFrame = valueRes.getSpriteFrame(pai3d_value.spriteFrame["_"+jiaoPai.id]);
        this.fan.string = jiaoPai.fan+"番";
        this.cnt.string = jiaoPai.cnt+"张";
    },
});
