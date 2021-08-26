var pai3d_value = require("jlmj_pai3d_value");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        baoPaiNode:[cc.Node],//宝牌节点
        baopaochakanNode:[cc.Node],//宝牌查看情况 1 以看 2未看
    },
    setData:function (data) {
        if( data != null ){
            this.cur_baopai_idx = 0;
            this.cur_baopai_idx_ = 0;
            this.bao_arr = [data.baolistList,data.baolistseeList];
            for(var idx in this.bao_arr){
                var bp_arr = this.bao_arr[idx];
                for(var i in bp_arr){
                    if(this.cur_baopai_idx > this.baoPaiNode.length - 1){
                        this.cur_baopai_idx = 0;
                    }
                    var baopai = this.baoPaiNode[this.cur_baopai_idx];
                    var baoPaiSp = baopai.getChildByName('baopaiSp');
                    var num = baopai.getChildByName('num');
                    var wk = baopai.getChildByName('weikan');
                    var yk = baopai.getChildByName('yikan');

                    wk.active = idx==0;
                    yk.active = idx==1;
                    baopai.active = true;
                    baoPaiSp.getComponent(cc.Sprite).spriteFrame = this.getCardVauleSP(bp_arr[i]);
                    //baoPaiSp.scaleX = 0.5; baoPaiSp.scaleY = 0.4;

                    num.getComponent(cc.Label).string = this.cur_baopai_idx_ + 1;

                    this.cur_baopai_idx++;
                    this.cur_baopai_idx_++;
                }
            }

            //是否查看宝牌
            this.baopaochakanNode[0].active = false;
            this.baopaochakanNode[1].active = false;
        }
        /*var chakan_x = 0;
        if(this.cur_baopai_idx_ > this.baoPaiNode.length){
            chakan_x = this.baoPaiNode[this.baoPaiNode.length - 1].x;
        }else{
            chakan_x = this.baoPaiNode[this.cur_baopai_idx_ - 1].x;
        }
        this.baopaochakanNode[0].x = chakan_x;
        this.baopaochakanNode[1].x = chakan_x;*/
    },
    // use this for initialization
    onLoad: function () {
    },

    /**
     * 获取牌的值
     */
    getCardVauleSP:function (cardId) {
        if(cardId != null){
            var res_pai = cc.find('Canvas/mj_res_pai');
            if(!res_pai){
                return "";
            }
            var atlas = res_pai.getComponent('mj_res_pai').majiangpai_new;
            return  atlas.getSpriteFrame(pai3d_value.spriteFrame["_"+cardId]);
        }
    },

    setMoyuData(data){
        for(var i in data) {
            var baopai = this.baoPaiNode[i];
            var baoPaiSp = baopai.getChildByName('baopaiSp');
            var num = baopai.getChildByName('num');
            var bg = baopai.getChildByName('mj-js-kanpaidi');
            var wk = baopai.getChildByName('weikan');
            var yk = baopai.getChildByName('yikan');
            var yp = baopai.getChildByName('yupai');

            yp.active = true;
            wk.active = false;
            yk.active = false;
            bg.active = false;
            num.active = false;

            baopai.active = true;
            baoPaiSp.getComponent(cc.Sprite).spriteFrame = this.getCardVauleSP(data[i].id);
        }
    }
});
